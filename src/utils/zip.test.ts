import { unzipSync } from 'fflate';
import { buildZip } from './zip';

// o jsdom não implementa Blob#arrayBuffer
const toBytes = (blob: Blob) =>
  new Promise<Uint8Array>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer));
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(blob);
  });

const fakeBlob = (content: string) => {
  const blob = new Blob([content]);
  Object.assign(blob, { arrayBuffer: async () => (await toBytes(new Blob([content]))).buffer });
  return blob;
};

describe('buildZip', () => {
  it('junta os arquivos no pacote e avisa o progresso', async () => {
    const onProgress = jest.fn();

    const zip = await buildZip({
      items: ['a', 'b', 'c'],
      load: async (item) => ({ name: `${item}.jpg`, blob: fakeBlob(`conteudo-${item}`) }),
      onProgress,
    });

    const files = unzipSync(await toBytes(zip));
    expect(Object.keys(files).sort()).toEqual(['a.jpg', 'b.jpg', 'c.jpg']);
    expect(new TextDecoder().decode(files['b.jpg'])).toBe('conteudo-b');
    expect(onProgress.mock.calls).toEqual([
      [1, 3],
      [2, 3],
      [3, 3],
    ]);
  });

  it('falha o pacote todo quando um arquivo falha', async () => {
    await expect(
      buildZip({
        items: ['a', 'b'],
        load: async (item) => {
          if (item === 'b') throw new Error('PHOTO_FETCH_FAILED_400');
          return { name: `${item}.jpg`, blob: fakeBlob(item) };
        },
      }),
    ).rejects.toThrow('PHOTO_FETCH_FAILED_400');
  });

  it('respeita o limite de downloads em paralelo', async () => {
    let running = 0;
    let peak = 0;

    await buildZip({
      items: [1, 2, 3, 4, 5, 6],
      concurrency: 2,
      load: async (item) => {
        running += 1;
        peak = Math.max(peak, running);
        await new Promise((resolve) => setTimeout(resolve, 5));
        running -= 1;
        return { name: `${item}.jpg`, blob: fakeBlob(String(item)) };
      },
    });

    expect(peak).toBe(2);
  });
});
