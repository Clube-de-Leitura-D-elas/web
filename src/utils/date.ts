const LOCALE = 'pt-BR';

const monthFormatter = new Intl.DateTimeFormat(LOCALE, { month: 'short' });
const dayFormatter = new Intl.DateTimeFormat(LOCALE, { day: '2-digit' });
const entryDateFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'America/Sao_Paulo',
});
// Datas sem hora ("2025-03-15") já são o dia civil de São Paulo; em UTC o dia não muda.
const civilDateFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'UTC',
});
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

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

  return (DATE_ONLY.test(iso) ? civilDateFormatter : entryDateFormatter).format(date);
};

const eventDateTimeFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: 'numeric',
  month: 'long',
  hour: 'numeric',
  minute: '2-digit',
  hourCycle: 'h23',
  timeZone: 'America/Sao_Paulo',
});

const eventTimeFormatter = new Intl.DateTimeFormat(LOCALE, {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'America/Sao_Paulo',
});

const calendarMonthFormatter = new Intl.DateTimeFormat(LOCALE, {
  month: 'long',
});

// "22 de Agosto, 19h" ou "22 de Agosto, 19h30"; '' se vazio ou inválido
export const formatEventDateTime = (iso: string): string => {
  const date = new Date(iso);
  if (!isValid(date)) return '';

  const parts = eventDateTimeFormatter.formatToParts(date);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? '';

  const month = get('month');
  const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
  const minute = get('minute');
  const time = minute === '00' ? `${get('hour')}h` : `${get('hour')}h${minute}`;

  return `${get('day')} de ${capitalizedMonth}, ${time}`;
};

const shortDateFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: 'America/Sao_Paulo',
});

export const formatShortDate = (iso: string): string => {
  const date = new Date(iso);
  if (!isValid(date)) return '';

  const parts = shortDateFormatter.formatToParts(date);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? '';

  return `${get('day')} ${get('month').replace('.', '')} ${get('year')}`;
};

const meetingPartsFormatter = new Intl.DateTimeFormat(LOCALE, {
  weekday: 'long',
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
  timeZone: 'America/Sao_Paulo',
});

const getMeetingParts = (date: Date) => {
  const parts = meetingPartsFormatter.formatToParts(date);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? '';
  const weekday = get('weekday').split('-')[0];
  const minute = get('minute');

  return {
    weekday: weekday.charAt(0).toUpperCase() + weekday.slice(1),
    day: get('day'),
    month: get('month').replace('.', ''),
    time: minute === '00' ? `${get('hour')}h` : `${get('hour')}h${minute}`,
  };
};

export const formatMeetingSummary = (iso: string): string => {
  const date = new Date(iso);
  if (!isValid(date)) return '';

  const { weekday, day, month, time } = getMeetingParts(date);
  return `${weekday.slice(0, 3)}, ${day} ${month} · ${time}`;
};

export const formatWeekdayTime = (iso: string): string => {
  const date = new Date(iso);
  if (!isValid(date)) return '';

  const { weekday, time } = getMeetingParts(date);
  return `${weekday}, ${time}`;
};

const dateBadgeFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: '2-digit',
  month: 'short',
  timeZone: 'America/Sao_Paulo',
});

export const formatDateBadge = (iso: string): { day: string; month: string } | null => {
  const date = new Date(iso);
  if (!isValid(date)) return null;

  const parts = dateBadgeFormatter.formatToParts(date);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? '';

  return { day: get('day'), month: get('month').replace('.', '') };
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
export const formatDayModalDate = (date: Date): string => {
  if (!isValid(date)) return '';

  return new Intl.DateTimeFormat(LOCALE, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

export const formatEventTime = (iso: string): string => {
  const date = new Date(iso);
  if (!isValid(date)) return '';

  return eventTimeFormatter.format(date);
};

export const formatCalendarMonthName = (date: Date): string => {
  if (!isValid(date)) return '';

  return calendarMonthFormatter.format(date);
};

const civilMonthFormatter = new Intl.DateTimeFormat(LOCALE, { month: 'short', timeZone: 'UTC' });
const civilDayMonthFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: '2-digit',
  month: '2-digit',
  timeZone: 'UTC',
});

const isoDateFormatter = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: 'America/Sao_Paulo',
});

// "2026-08-22" no fuso de São Paulo, para nomes de arquivo; '' se vazio ou inválido
export const formatIsoDate = (iso: string): string => {
  const date = new Date(iso);
  if (!isValid(date)) return '';

  return isoDateFormatter.format(date);
};

const DAY_MS = 24 * 60 * 60 * 1000;
const PERIODS_BACK = 11;

// Períodos do dashboard chegam como "YYYY-MM-DD" (dia civil). Todo o cálculo é em UTC com
// ano, mês e dia explícitos: `new Date('2026-03-01')` seria 28/02 em São Paulo.
const toCivilDate = (date: Date): string => date.toISOString().slice(0, 10);

const parseCivilDate = (value: string): Date | null => {
  if (!DATE_ONLY.test(value)) return null;

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  // Date.UTC "corrige" datas impossíveis (mês 13, dia 40): só vale se voltar igual
  return isValid(date) && toCivilDate(date) === value ? date : null;
};

// 12 períodos até hoje, com o início já alinhado: dia 1 (mês) ou segunda-feira (semana).
// O backend conta o primeiro período inteiro, mas mandar alinhado evita depender disso.
export const getRegistrationsRange = (
  granularity: 'month' | 'week',
  now: Date = new Date(),
): { from: string; to: string } => {
  const to = formatIsoDate(now.toISOString());
  const today = parseCivilDate(to);
  if (!today) throw new Error(`INVALID_DATE: ${now.toISOString()}`);

  if (granularity === 'month') {
    const from = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - PERIODS_BACK, 1));
    return { from: toCivilDate(from), to };
  }

  // getUTCDay: 0 = domingo; a semana começa na segunda
  const daysSinceMonday = (today.getUTCDay() + 6) % 7;
  const from = new Date(today.getTime() - (daysSinceMonday + PERIODS_BACK * 7) * DAY_MS);
  return { from: toCivilDate(from), to };
};

// "2026-03-01" -> "mar/2026"; '' se inválido
export const formatMonthLabel = (period: string): string => {
  const date = parseCivilDate(period);
  if (!date) return '';

  const month = civilMonthFormatter.format(date).replace('.', '');
  return `${month}/${date.getUTCFullYear()}`;
};

// "2026-09-28" -> "28/09"; '' se inválido
export const formatDayMonth = (period: string): string => {
  const date = parseCivilDate(period);
  if (!date) return '';

  return civilDayMonthFormatter.format(date);
};

const birthdayFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
});

export const formatBirthday = (value: string | null | undefined): string => {
  const date = value ? parseCivilDate(value.slice(0, 10)) : null;
  if (!date) return '';

  return birthdayFormatter.format(date);
};

export const getElapsedTime = (
  iso: string | null | undefined,
  now: Date = new Date(),
): { years: number; months: number } | null => {
  if (!iso) return null;
  const civil = parseCivilDate(iso);
  const start = civil
    ? new Date(civil.getUTCFullYear(), civil.getUTCMonth(), civil.getUTCDate())
    : new Date(iso);
  if (!isValid(start) || start > now) return null;

  const totalMonths =
    (now.getFullYear() - start.getFullYear()) * 12 +
    (now.getMonth() - start.getMonth()) -
    (now.getDate() < start.getDate() ? 1 : 0);

  return { years: Math.floor(totalMonths / 12), months: totalMonths % 12 };
};
