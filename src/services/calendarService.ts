import type { CalendarMonthResponse } from '../types/calendar';
import { supabase } from './supabaseClient';

export async function getCalendarMonth(
  year: number,
  month: number,
): Promise<CalendarMonthResponse> {
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
}
