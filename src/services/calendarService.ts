import type { CalendarMonthResponse } from '../types/calendar';
import { invokeGet } from './invokeGet';

const CACHE_DURATION_MS = 5 * 60 * 1000;

type CacheEntry = {
  request: Promise<CalendarMonthResponse>;
  expiresAt: number;
};

const calendarCache = new Map<string, CacheEntry>();

export function clearCalendarCache(): void {
  calendarCache.clear();
}

export function getCalendarMonth(year: number, month: number): Promise<CalendarMonthResponse> {
  const cacheKey = `${year}-${month}`;
  const now = Date.now();

  // Remove entradas expiradas, inclusive de outros meses.
  for (const [key, entry] of calendarCache) {
    if (now >= entry.expiresAt) {
      calendarCache.delete(key);
    }
  }

  const cached = calendarCache.get(cacheKey);

  if (cached) {
    return cached.request;
  }

  const request = invokeGet<CalendarMonthResponse>('calendar-month', {
    year,
    month,
  }).then((data) => {
    if (!data) {
      throw new Error('calendar-month returned no data');
    }

    return data;
  });

  calendarCache.set(cacheKey, {
    request,
    expiresAt: now + CACHE_DURATION_MS,
  });

  // Requisições com erro não devem permanecer no cache.
  void request.catch(() => {
    if (calendarCache.get(cacheKey)?.request === request) {
      calendarCache.delete(cacheKey);
    }
  });

  return request;
}
