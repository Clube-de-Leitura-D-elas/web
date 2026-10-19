const LOCALE = 'pt-BR';

const monthFormatter = new Intl.DateTimeFormat(LOCALE, { month: 'short' });
const dayFormatter = new Intl.DateTimeFormat(LOCALE, { day: '2-digit' });
const entryDateFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'America/Sao_Paulo',
});

const isValid = (date: Date) => !Number.isNaN(date.getTime());

// "mar/2024"
export const formatMonthYear = (iso: string): string => {
  const date = new Date(iso);
  if (!isValid(date)) return '';

  const month = monthFormatter.format(date).replace('.', '');
  return `${month}/${date.getFullYear()}`;
};

// "15/03/2025" no fuso de São Paulo; '' se vazio ou inválido
export const formatEntryDate = (iso: string | null | undefined): string => {
  if (!iso) return '';

  const date = new Date(iso);
  if (!isValid(date)) return '';

  return entryDateFormatter.format(date);
};

// "24 ago, 19h" ou "24 ago, 19h30"
export const formatMeetingDate = (iso: string): string => {
  const date = new Date(iso);
  if (!isValid(date)) return '';

  const day = dayFormatter.format(date);
  const month = monthFormatter.format(date).replace('.', '');
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const time = minutes === 0 ? `${hours}h` : `${hours}h${String(minutes).padStart(2, '0')}`;

  return `${day} ${month}, ${time}`;
};
