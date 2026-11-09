import {
  buildPhotoFilename,
  buildZipFilename,
  extensionFromMime,
  saveBlob,
  slugify,
} from './download';

describe('slugify', () => {
  it('tira acento, símbolos e espaços', () => {
    expect(slugify('Grupo 03 — Pinheiros')).toBe('grupo-03-pinheiros');
    expect(slugify('  São João  ')).toBe('sao-joao');
  });
});

describe('extensionFromMime', () => {
  it('traduz os tipos aceitos pelo bucket', () => {
    expect(extensionFromMime('image/png')).toBe('png');
    expect(extensionFromMime('image/webp')).toBe('webp');
    expect(extensionFromMime('image/heic')).toBe('heic');
  });

  it('cai em jpg quando o tipo é desconhecido ou vazio', () => {
    expect(extensionFromMime('')).toBe('jpg');
    expect(extensionFromMime('application/octet-stream')).toBe('jpg');
  });
});

describe('nomes de arquivo', () => {
  it('inclui grupo, data e posição da foto', () => {
    expect(buildPhotoFilename('Grupo 03 — Pinheiros', '2026-08-22', 1, 'jpg')).toBe(
      'grupo-03-pinheiros-2026-08-22-foto-01.jpg',
    );
    expect(buildPhotoFilename('Grupo 03 — Pinheiros', '2026-08-22', 12, 'png')).toBe(
      'grupo-03-pinheiros-2026-08-22-foto-12.png',
    );
  });

  it('nomeia o pacote', () => {
    expect(buildZipFilename('Grupo 03 — Pinheiros', '2026-08-22')).toBe(
      'grupo-03-pinheiros-2026-08-22-fotos.zip',
    );
  });

  it('não deixa hífen sobrando quando a data é inválida', () => {
    expect(buildZipFilename('Grupo 03', '')).toBe('grupo-03-fotos.zip');
  });
});

describe('saveBlob', () => {
  const createObjectURL = jest.fn();
  const revokeObjectURL = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    createObjectURL.mockReturnValue('blob:fake');
    Object.assign(URL, { createObjectURL, revokeObjectURL });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('dispara o download com o nome pedido e libera a URL depois', () => {
    const click = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
      this: HTMLAnchorElement,
    ) {
      expect(this.download).toBe('foto.jpg');
      expect(this.href).toBe('blob:fake');
    });

    saveBlob(new Blob(['x']), 'foto.jpg');

    expect(click).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).not.toHaveBeenCalled();

    jest.runAllTimers();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:fake');
  });
});
