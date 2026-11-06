import { fetchPhotoBlob } from './eventPhotoService';

const fetchMock = jest.fn();

beforeEach(() => {
  globalThis.fetch = fetchMock;
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('fetchPhotoBlob', () => {
  it('devolve o conteúdo da foto', async () => {
    const blob = new Blob(['x'], { type: 'image/jpeg' });
    fetchMock.mockResolvedValue({ ok: true, blob: async () => blob });

    await expect(fetchPhotoBlob('https://exemplo.com/foto.jpg')).resolves.toBe(blob);
    expect(fetchMock).toHaveBeenCalledWith('https://exemplo.com/foto.jpg');
  });

  it('lança erro quando o link vencido responde com falha', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 400 });

    await expect(fetchPhotoBlob('https://exemplo.com/foto.jpg')).rejects.toThrow(
      'PHOTO_FETCH_FAILED_400',
    );
  });
});
