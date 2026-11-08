import { supabase } from './supabaseClient';
import { getCalendarMonth } from './calendarService';
import type { CalendarMonthResponse } from '../types/calendar';

describe('calendarService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('reutiliza a mesma requisição para o mesmo mês', async () => {
    const response: CalendarMonthResponse = {
      year: 2031,
      month: 7,
      rangeStart: '2031-07-01',
      rangeEnd: '2031-07-31',
      days: [],
    };

    jest.mocked(supabase.functions.invoke).mockResolvedValue({
      data: response,
      error: null,
    });

    const firstRequest = getCalendarMonth(2031, 7);
    const secondRequest = getCalendarMonth(2031, 7);

    expect(firstRequest).toBe(secondRequest);

    const [firstResult, secondResult] = await Promise.all([firstRequest, secondRequest]);

    expect(firstResult).toEqual(response);
    expect(secondResult).toEqual(response);

    expect(supabase.functions.invoke).toHaveBeenCalledTimes(1);
    expect(supabase.functions.invoke).toHaveBeenCalledWith('calendar-month?year=2031&month=7', {
      method: 'GET',
    });
  });
});
