import { zipSync } from 'fflate';

export type ZipFile = { name: string; blob: Blob };

type BuildZipOptions<T> = {
  items: T[];
  // baixa um item e diz com que nome ele entra no zip
  load: (item: T, index: number) => Promise<ZipFile>;
  onProgress?: (done: number, total: number) => void;
  concurrency?: number;
};

const DEFAULT_CONCURRENCY = 4;

// Baixa os itens com poucas requisições em paralelo e monta o .zip no navegador.
// Se um item falhar, o zip todo falha: um pacote incompleto passaria por completo.
export async function buildZip<T>({
  items,
  load,
  onProgress,
  concurrency = DEFAULT_CONCURRENCY,
}: BuildZipOptions<T>): Promise<Blob> {
  const files: ZipFile[] = new Array(items.length);
  let next = 0;
  let done = 0;
  let failed = false;

  const worker = async () => {
    while (!failed && next < items.length) {
      const index = next++;
      try {
        files[index] = await load(items[index], index);
      } catch (error) {
        failed = true;
        throw error;
      }
      done += 1;
      onProgress?.(done, items.length);
    }
  };

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));

  const entries: Record<string, Uint8Array> = {};
  for (const { name, blob } of files) {
    entries[name] = new Uint8Array(await blob.arrayBuffer());
  }

  // nível 0: JPEG/PNG/WebP já são comprimidos, comprimir de novo só gasta tempo
  const zipped = zipSync(entries, { level: 0 });
  return new Blob([zipped as BlobPart], { type: 'application/zip' });
}
