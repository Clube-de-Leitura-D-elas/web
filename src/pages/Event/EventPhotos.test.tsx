import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { interpolate, locale } from '../../locales';
import { fetchPhotoBlob } from '../../services/eventPhotoService';
import { pending, renderWithProviders } from '../../test/render';
import type { EventPhoto } from '../../types/event';
import { saveBlob } from '../../utils/download';
import { buildZip } from '../../utils/zip';
import { EventPhotos } from './EventPhotos';

jest.mock('../../services/eventPhotoService', () => ({
  fetchPhotoBlob: jest.fn(),
}));

jest.mock('../../utils/download', () => ({
  ...jest.requireActual('../../utils/download'),
  saveBlob: jest.fn(),
}));

jest.mock('../../utils/zip', () => ({
  buildZip: jest.fn(),
}));

const text = locale.event_details.photos;

const photo = (n: number, overrides: Partial<EventPhoto> = {}): EventPhoto => ({
  id: `p${n}`,
  url: `https://exemplo.com/${n}.jpg`,
  thumbnailUrl: `https://exemplo.com/${n}-thumb.jpg`,
  uploadedAt: '2026-08-23T10:14:00-03:00',
  uploadedBy: { id: 'u1', name: 'Joseane Alves' },
  ...overrides,
});

const photos = [photo(1), photo(2), photo(3)];

const renderPhotos = (props: Partial<React.ComponentProps<typeof EventPhotos>> = {}) =>
  renderWithProviders(
    <EventPhotos
      groupName="Grupo 03 — Pinheiros"
      // 22h UTC = 19h em São Paulo
      startsAt="2026-08-22T22:00:00Z"
      photos={photos}
      onRefresh={jest.fn().mockResolvedValue(null)}
      {...props}
    />,
  );

const openPhoto = (position: number) =>
  screen.getByRole('button', {
    name: interpolate(text.openPhoto, { position, total: photos.length }),
  });

beforeEach(() => {
  jest.mocked(fetchPhotoBlob).mockResolvedValue(new Blob(['x'], { type: 'image/jpeg' }));
});

describe('EventPhotos', () => {
  describe('galeria', () => {
    it('mostra a quantidade e uma miniatura por foto', () => {
      renderPhotos();

      expect(screen.getByText('3 fotos')).toBeInTheDocument();
      const grid = within(screen.getByRole('list', { name: text.gridLabel }));
      expect(grid.getAllByRole('listitem')).toHaveLength(3);
      expect(document.querySelector('img')).toHaveAttribute('src', photos[0].thumbnailUrl);
    });

    it('mostra o estado vazio, sem botão de download', () => {
      renderPhotos({ photos: [] });

      expect(screen.getByText(text.empty)).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: text.downloadAll })).not.toBeInTheDocument();
    });

    it('troca a miniatura que falha por um placeholder, sem quebrar a grade', () => {
      renderPhotos();

      fireEvent.error(document.querySelector('img') as HTMLImageElement);

      expect(screen.getByRole('img', { name: text.unavailable })).toBeInTheDocument();
      expect(screen.getAllByRole('button', { name: /Ampliar foto/ })).toHaveLength(3);
      expect(screen.getByText(text.loadError)).toBeInTheDocument();
    });

    it('recarrega as fotos pelo aviso de miniatura que falhou', async () => {
      const onRefresh = jest.fn().mockResolvedValue(photos);
      const { user } = renderPhotos({ onRefresh });

      fireEvent.error(document.querySelector('img') as HTMLImageElement);
      await user.click(screen.getByRole('button', { name: text.reload }));

      expect(onRefresh).toHaveBeenCalledTimes(1);
    });
  });

  describe('foto ampliada', () => {
    it('abre a foto clicada com quem enviou e a data', async () => {
      const { user } = renderPhotos();

      await user.click(openPhoto(2));

      const dialog = within(screen.getByRole('dialog'));
      expect(dialog.getByRole('img')).toHaveAttribute('src', photos[1].url);
      expect(
        dialog.getByText(
          interpolate(text.uploadedBy, { name: 'Joseane Alves', date: '23/08/2026' }),
        ),
      ).toBeInTheDocument();
    });

    it('mostra só a data quando não sabe quem enviou', async () => {
      const { user } = renderPhotos({ photos: [photo(1, { uploadedBy: null })] });

      await user.click(screen.getByRole('button', { name: /Ampliar foto/ }));

      expect(
        screen.getByText(interpolate(text.uploadedAt, { date: '23/08/2026' })),
      ).toBeInTheDocument();
    });

    it('navega entre as fotos e fecha com Esc', async () => {
      const { user } = renderPhotos();

      await user.click(openPhoto(1));
      await user.click(screen.getByRole('button', { name: locale.lightbox.next }));
      expect(within(screen.getByRole('dialog')).getByRole('img')).toHaveAttribute(
        'src',
        photos[1].url,
      );

      await user.keyboard('{Escape}');
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('download individual', () => {
    it('baixa a original com nome de grupo, data e posição', async () => {
      const { user } = renderPhotos();

      await user.click(openPhoto(2));
      await user.click(screen.getByRole('button', { name: text.downloadOriginal }));

      await waitFor(() => expect(saveBlob).toHaveBeenCalledTimes(1));
      expect(fetchPhotoBlob).toHaveBeenCalledWith(photos[1].url);
      expect(jest.mocked(saveBlob).mock.calls[0][1]).toBe(
        'grupo-03-pinheiros-2026-08-22-foto-02.jpg',
      );
    });

    it('avisa a falha e tenta de novo com links atualizados', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      jest.mocked(fetchPhotoBlob).mockRejectedValueOnce(new Error('PHOTO_FETCH_FAILED_400'));
      const fresh = [photo(1, { url: 'https://exemplo.com/novo.jpg' }), photos[1], photos[2]];
      const onRefresh = jest.fn().mockResolvedValue(fresh);
      const { user } = renderPhotos({ onRefresh });

      await user.click(openPhoto(1));
      await user.click(screen.getByRole('button', { name: text.downloadOriginal }));
      expect(await screen.findByText(text.downloadOneError)).toBeInTheDocument();
      expect(saveBlob).not.toHaveBeenCalled();

      await user.click(screen.getByRole('button', { name: text.retry }));

      await waitFor(() => expect(saveBlob).toHaveBeenCalledTimes(1));
      expect(onRefresh).toHaveBeenCalledTimes(1);
      expect(fetchPhotoBlob).toHaveBeenLastCalledWith('https://exemplo.com/novo.jpg');
      expect(screen.queryByText(text.downloadOneError)).not.toBeInTheDocument();
    });
  });

  describe('baixar todas', () => {
    it('monta o pacote com progresso e salva com o nome do evento', async () => {
      const zip = new Blob(['zip']);
      let finish: () => void = () => {};
      const gate = new Promise<void>((resolve) => {
        finish = resolve;
      });
      jest.mocked(buildZip).mockImplementation(async ({ items, load, onProgress }) => {
        const loaded = await load(items[0], 0);
        expect(loaded.name).toBe('grupo-03-pinheiros-2026-08-22-foto-01.jpg');
        onProgress?.(1, 3);
        // segura o pacote até o teste conferir o progresso
        await gate;
        return zip;
      });
      const { user } = renderPhotos();

      await user.click(screen.getByRole('button', { name: text.downloadAll }));

      expect(
        await screen.findByText(interpolate(text.zipProgress, { done: 1, total: 3 })),
      ).toBeInTheDocument();

      finish();

      await waitFor(() => expect(saveBlob).toHaveBeenCalledWith(zip, expect.any(String)));
      expect(jest.mocked(saveBlob).mock.calls[0][1]).toBe(
        'grupo-03-pinheiros-2026-08-22-fotos.zip',
      );
      await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument());
    });

    it('desabilita o botão enquanto o pacote é montado', async () => {
      jest.mocked(buildZip).mockReturnValue(pending());
      const { user } = renderPhotos();

      await user.click(screen.getByRole('button', { name: text.downloadAll }));

      expect(screen.getByRole('button', { name: text.downloadAll })).toBeDisabled();
    });

    it('avisa a falha e permite tentar de novo', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      jest.mocked(buildZip).mockRejectedValueOnce(new Error('PHOTO_FETCH_FAILED_400'));
      const zip = new Blob(['zip']);
      jest.mocked(buildZip).mockResolvedValueOnce(zip);
      const onRefresh = jest.fn().mockResolvedValue(photos);
      const { user } = renderPhotos({ onRefresh });

      await user.click(screen.getByRole('button', { name: text.downloadAll }));
      expect(await screen.findByText(text.downloadError)).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: text.retry }));

      await waitFor(() => expect(saveBlob).toHaveBeenCalledWith(zip, expect.any(String)));
      expect(onRefresh).toHaveBeenCalledTimes(1);
      expect(screen.queryByText(text.downloadError)).not.toBeInTheDocument();
    });
  });
});
