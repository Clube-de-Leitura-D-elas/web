// Baixa a foto pela URL assinada que veio da `event-details-web`. Link vencido volta 4xx.
export async function fetchPhotoBlob(url: string): Promise<Blob> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`PHOTO_FETCH_FAILED_${response.status}`);

  return response.blob();
}
