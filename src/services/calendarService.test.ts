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

  it('remove o cache após um erro e permite tentar novamente', async () => {
    const response: CalendarMonthResponse = {
      year: 2032,
      month: 4,
      rangeStart: '2032-04-01',
      rangeEnd: '2032-04-30',
      days: [],
    };

    jest
      .mocked(supabase.functions.invoke)
      .mockRejectedValueOnce(new Error('Erro ao buscar calendário'))
      .mockResolvedValueOnce({
        data: response,
        error: null,
      });

    await expect(getCalendarMonth(2032, 4)).rejects.toThrow('Erro ao buscar calendário');

    const result = await getCalendarMonth(2032, 4);

    expect(result).toEqual(response);

    expect(supabase.functions.invoke).toHaveBeenCalledTimes(2);
  });

  it('busca novamente os dados após a expiração do cache', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-11-08T12:00:00Z'));

    try {
      const response: CalendarMonthResponse = {
        year: 2033,
        month: 8,
        rangeStart: '2033-08-01',
        rangeEnd: '2033-08-31',
        days: [],
      };

      jest.mocked(supabase.functions.invoke).mockResolvedValue({
        data: response,
        error: null,
      });

      await getCalendarMonth(2033, 8);

      expect(supabase.functions.invoke).toHaveBeenCalledTimes(1);

      // Ainda dentro dos cinco minutos.
      jest.setSystemTime(new Date('2026-11-08T12:04:00Z'));

      await getCalendarMonth(2033, 8);

      expect(supabase.functions.invoke).toHaveBeenCalledTimes(1);

      // Depois da expiração.
      jest.setSystemTime(new Date('2026-11-08T12:06:00Z'));

      await getCalendarMonth(2033, 8);

      expect(supabase.functions.invoke).toHaveBeenCalledTimes(2);
    } finally {
      jest.useRealTimers();
    }
  });
});
