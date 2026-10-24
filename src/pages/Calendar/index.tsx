import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';

import * as Styled from './styles';

import { useLocale } from '../../hooks/useLocale';
import { getCalendarMonth } from '../../services/calendarService';
import type { CalendarMonthResponse } from '../../types/calendar';
import { getCalendarDays } from '../../utils/calendar';

const MAX_VISIBLE_EVENTS = 3;
const TIME_ZONE = 'America/Sao_Paulo';

const getDateKey = (date: Date): string =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');

const formatTime = (value: string): string =>
  new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: TIME_ZONE,
  }).format(new Date(value));

export const Calendar = () => {
  const locale = useLocale();

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  const days = getCalendarDays(year, month);
  const totalWeeks = days.length / 7;

  const [calendarData, setCalendarData] = useState<CalendarMonthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadCalendar = async () => {
      setLoading(true);
      setError(false);

      try {
        const data = await getCalendarMonth(year, month);

        if (!cancelled) {
          setCalendarData(data);
        }
      } catch (err) {
        console.error('Erro ao buscar calendário:', err);

        if (!cancelled) {
          setCalendarData(null);
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadCalendar();

    return () => {
      cancelled = true;
    };
  }, [year, month]);

  const eventsByDate = new Map(calendarData?.days.map((day) => [day.date, day.events]) ?? []);

  const monthLabel = new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric',
  }).format(today);

  const weekdays = [
    locale.calendar.weekdays.sunday,
    locale.calendar.weekdays.monday,
    locale.calendar.weekdays.tuesday,
    locale.calendar.weekdays.wednesday,
    locale.calendar.weekdays.thursday,
    locale.calendar.weekdays.friday,
    locale.calendar.weekdays.saturday,
  ];

  const isToday = (date: Date): boolean =>
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  return (
    <Styled.Container>
      <Styled.Header>
        <Styled.Title>{locale.calendar.title}</Styled.Title>
        <Styled.Subtitle>{locale.calendar.subtitle}</Styled.Subtitle>
      </Styled.Header>

      <Styled.MonthTitle>{monthLabel}</Styled.MonthTitle>

      {loading && <Styled.Feedback role="status">{locale.calendar.loading}</Styled.Feedback>}

      {error && <Styled.Feedback role="alert">{locale.calendar.loadError}</Styled.Feedback>}

      <Styled.CalendarScroll>
        <Styled.CalendarGrid
          style={
            {
              '--calendar-weeks': totalWeeks,
            } as CSSProperties
          }
        >
          {weekdays.map((weekday, index) => (
            <Styled.WeekdayHeader key={index}>{weekday}</Styled.WeekdayHeader>
          ))}

          {days.map((date) => {
            const dateKey = getDateKey(date);
            const inMonth = date.getMonth() + 1 === month;
            const currentDay = isToday(date);

            const events = [...(eventsByDate.get(dateKey) ?? [])].sort(
              (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
            );

            const hiddenCount =
              events.length > MAX_VISIBLE_EVENTS ? events.length - (MAX_VISIBLE_EVENTS - 1) : 0;

            const visibleEvents =
              hiddenCount > 0 ? events.slice(0, MAX_VISIBLE_EVENTS - 1) : events;

            return (
              <Styled.DayCell key={dateKey} $outsideMonth={!inMonth}>
                <Styled.DayNumber $today={currentDay} $outsideMonth={!inMonth}>
                  {date.getDate()}
                </Styled.DayNumber>

                <Styled.EventsList>
                  {visibleEvents.map((event) => (
                    <Styled.EventItem
                      key={event.id}
                      title={`${formatTime(event.startsAt)} - ${event.groupName}`}
                    >
                      <Styled.EventDot />

                      <Styled.EventText>
                        {formatTime(event.startsAt)} {event.groupName}
                      </Styled.EventText>
                    </Styled.EventItem>
                  ))}

                  {hiddenCount > 0 && (
                    <Styled.MoreEvents>
                      {locale.calendar.moreEvents.replace('{{count}}', String(hiddenCount))}
                    </Styled.MoreEvents>
                  )}
                </Styled.EventsList>
              </Styled.DayCell>
            );
          })}
        </Styled.CalendarGrid>
      </Styled.CalendarScroll>
    </Styled.Container>
  );
};
