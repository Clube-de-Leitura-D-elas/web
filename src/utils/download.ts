const EXTENSION_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/heic': 'heic',
};

const DEFAULT_EXTENSION = 'jpg';

// "Grupo 03 — Pinheiros" -> "grupo-03-pinheiros"
export const slugify = (text: string): string =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const extensionFromMime = (mime: string): string =>
  EXTENSION_BY_MIME[mime.toLowerCase()] ?? DEFAULT_EXTENSION;

const baseName = (groupName: string, isoDate: string) =>
  [slugify(groupName), isoDate].filter(Boolean).join('-');

// "grupo-03-pinheiros-2026-08-22-foto-01.jpg"
export const buildPhotoFilename = (
  groupName: string,
  isoDate: string,
  position: number,
  extension: string,
): string =>
  `${baseName(groupName, isoDate)}-foto-${String(position).padStart(2, '0')}.${extension}`;

// "grupo-03-pinheiros-2026-08-22-fotos.zip"
export const buildZipFilename = (groupName: string, isoDate: string): string =>
  `${baseName(groupName, isoDate)}-fotos.zip`;

// Dispara o download no navegador: o atributo `download` só vale para blob/mesma origem,
// por isso as fotos (URLs assinadas de outro domínio) passam antes por fetch.
export const saveBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // adia a revogação: revogar na hora pode cancelar o download em alguns navegadores
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
