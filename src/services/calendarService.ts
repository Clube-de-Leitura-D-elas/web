import type { CalendarMonthResponse } from '../types/calendar';
import { supabase } from './supabaseClient';

const CACHE_DURATION_MS = 5 * 60 * 1000;

type CacheEntry = {
  request: Promise<CalendarMonthResponse>;
  expiresAt: number;
};

const calendarCache = new Map<string, CacheEntry>();

export function getCalendarMonth(year: number, month: number): Promise<CalendarMonthResponse> {
  const cacheKey = `${year}-${month}`;

  const cached = calendarCache.get(cacheKey);

  if (cached && Date.now() < cached.expiresAt) {
    return cached.request;
  }

  const request = (async (): Promise<CalendarMonthResponse> => {
    const query = new URLSearchParams({
      year: String(year),
      month: String(month),
    });

    const { data, error } = await supabase.functions.invoke<CalendarMonthResponse>(
      `calendar-month?${query.toString()}`,
      {
        method: 'GET',
      },
    );

    if (error) throw error;
    if (!data) throw new Error('calendar-month returned no data');

    return data;
  })();

  calendarCache.set(cacheKey, {
    request,
    expiresAt: Date.now() + CACHE_DURATION_MS,
  });

  // Requisições com erro não devem permanecer no cache.
  void request.catch(() => {
    if (calendarCache.get(cacheKey)?.request === request) {
      calendarCache.delete(cacheKey);
    }
  });

  return request;
}
