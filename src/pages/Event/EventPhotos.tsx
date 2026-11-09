import { useState } from 'react';
import { LuDownload, LuImageOff } from 'react-icons/lu';
import { Button } from '../../components/Button';
import { Lightbox } from '../../components/Lightbox';
import { interpolate, locale, pluralize } from '../../locales';
import { fetchPhotoBlob } from '../../services/eventPhotoService';
import type { EventPhoto } from '../../types/event';
import { formatEntryDate, formatIsoDate } from '../../utils/date';
import {
  buildPhotoFilename,
  buildZipFilename,
  extensionFromMime,
  saveBlob,
} from '../../utils/download';
import { buildZip } from '../../utils/zip';
import * as Styled from './styles';

type EventPhotosProps = {
  groupName: string;
  startsAt: string;
  photos: EventPhoto[];
  // refaz o fetch do evento (novas URLs assinadas); devolve as fotos novas ou null se falhar
  onRefresh: () => Promise<EventPhoto[] | null>;
};

type Task = { kind: 'one'; photoId: string } | { kind: 'all' };

export const EventPhotos = ({ groupName, startsAt, photos, onRefresh }: EventPhotosProps) => {
  const text = locale.event_details.photos;

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  // guarda as URLs que falharam: com link novo, a imagem volta a ser tentada
  const [failedUrls, setFailedUrls] = useState<ReadonlySet<string>>(new Set());
  const [busyPhotoId, setBusyPhotoId] = useState<string | null>(null);
  const [zipProgress, setZipProgress] = useState<{ done: number; total: number } | null>(null);
  const [failedTask, setFailedTask] = useState<Task | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const isoDate = formatIsoDate(startsAt);
  const busy = busyPhotoId !== null || zipProgress !== null || refreshing;

  const markFailed = (url: string) => setFailedUrls((current) => new Set(current).add(url));

  const downloadOne = async (list: EventPhoto[], photoId: string) => {
    const index = list.findIndex((photo) => photo.id === photoId);
    if (index === -1) return;

    const blob = await fetchPhotoBlob(list[index].url);
    saveBlob(blob, buildPhotoFilename(groupName, isoDate, index + 1, extensionFromMime(blob.type)));
  };

  const downloadAll = async (list: EventPhoto[]) => {
    const zip = await buildZip({
      items: list,
      load: async (photo, index) => {
        const blob = await fetchPhotoBlob(photo.url);
        const extension = extensionFromMime(blob.type);
        return { name: buildPhotoFilename(groupName, isoDate, index + 1, extension), blob };
      },
      onProgress: (done, total) => setZipProgress({ done, total }),
    });
    saveBlob(zip, buildZipFilename(groupName, isoDate));
  };

  const run = async (task: Task, list: EventPhoto[]) => {
    setFailedTask(null);

    try {
      if (task.kind === 'one') {
        setBusyPhotoId(task.photoId);
        await downloadOne(list, task.photoId);
      } else {
        setZipProgress({ done: 0, total: list.length });
        await downloadAll(list);
      }
    } catch (err) {
      console.error(err);
      setFailedTask(task);
    } finally {
      setBusyPhotoId(null);
      setZipProgress(null);
    }
  };

  // o erro mais comum é link vencido (1 h): busca o evento de novo antes de repetir
  const retry = async () => {
    if (!failedTask) return;

    setRefreshing(true);
    const fresh = await onRefresh();
    setRefreshing(false);
    await run(failedTask, fresh ?? photos);
  };

  const reload = async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };

  if (photos.length === 0) return <Styled.PhotosEmpty>{text.empty}</Styled.PhotosEmpty>;

  const loadFailed = photos.some(
    (photo) => failedUrls.has(photo.thumbnailUrl) || failedUrls.has(photo.url),
  );
  const openPhoto = openIndex === null ? null : photos[openIndex];
  const lightboxFailure =
    failedTask?.kind === 'one' && failedTask.photoId === openPhoto?.id ? failedTask : null;

  const progressText = zipProgress
    ? zipProgress.done >= zipProgress.total
      ? text.zipPacking
      : interpolate(text.zipProgress, zipProgress)
    : null;

  const positionOf = (index: number) => ({ position: index + 1, total: photos.length });

  return (
    <Styled.PhotosRoot>
      <Styled.PhotosToolbar>
        <Styled.PhotosCount>{pluralize(text.count, photos.length)}</Styled.PhotosCount>

        <Button
          size="sm"
          variant="secondary"
          icon={<LuDownload aria-hidden />}
          disabled={busy}
          onClick={() => run({ kind: 'all' }, photos)}
        >
          {text.downloadAll}
        </Button>
      </Styled.PhotosToolbar>

      {progressText && <Styled.PhotosStatus role="status">{progressText}</Styled.PhotosStatus>}

      {failedTask?.kind === 'all' && (
        <Styled.PhotosNotice role="alert">
          {text.downloadError}
          <Button size="sm" variant="secondary" disabled={busy} onClick={retry}>
            {text.retry}
          </Button>
        </Styled.PhotosNotice>
      )}

      {loadFailed && (
        <Styled.PhotosNotice role="alert">
          {text.loadError}
          <Button size="sm" variant="secondary" disabled={busy} onClick={reload}>
            {text.reload}
          </Button>
        </Styled.PhotosNotice>
      )}

      <Styled.PhotoGrid aria-label={text.gridLabel}>
        {photos.map((photo, index) => (
          <li key={photo.id}>
            <Styled.PhotoThumbButton
              type="button"
              aria-label={interpolate(text.openPhoto, positionOf(index))}
              onClick={() => setOpenIndex(index)}
            >
              {failedUrls.has(photo.thumbnailUrl) ? (
                <Styled.PhotoThumbPlaceholder role="img" aria-label={text.unavailable}>
                  <LuImageOff aria-hidden />
                </Styled.PhotoThumbPlaceholder>
              ) : (
                <img
                  src={photo.thumbnailUrl}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  onError={() => markFailed(photo.thumbnailUrl)}
                />
              )}
            </Styled.PhotoThumbButton>
          </li>
        ))}
      </Styled.PhotoGrid>

      {openPhoto && openIndex !== null && (
        <Lightbox
          items={photos.map((photo, index) => ({
            id: photo.id,
            src: photo.url,
            alt: interpolate(text.thumbnailAlt, { position: index + 1 }),
          }))}
          index={openIndex}
          onIndexChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
          label={text.gridLabel}
          onImageError={(item) => markFailed(item.src)}
          footer={
            <Styled.PhotoActions>
              <Styled.PhotoMeta>
                {openPhoto.uploadedBy
                  ? interpolate(text.uploadedBy, {
                      name: openPhoto.uploadedBy.name,
                      date: formatEntryDate(openPhoto.uploadedAt),
                    })
                  : interpolate(text.uploadedAt, { date: formatEntryDate(openPhoto.uploadedAt) })}
              </Styled.PhotoMeta>

              <Button
                size="sm"
                variant="secondary"
                icon={<LuDownload aria-hidden />}
                disabled={busy}
                onClick={() => run({ kind: 'one', photoId: openPhoto.id }, photos)}
              >
                {text.downloadOriginal}
              </Button>

              {lightboxFailure && (
                <Styled.PhotoError role="alert">
                  {text.downloadOneError}
                  <Button size="sm" variant="secondary" disabled={busy} onClick={retry}>
                    {text.retry}
                  </Button>
                </Styled.PhotoError>
              )}
            </Styled.PhotoActions>
          }
        />
      )}
    </Styled.PhotosRoot>
  );
};
