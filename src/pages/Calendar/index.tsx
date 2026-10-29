import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

import * as Styled from './styles';

import { useLocale } from '../../hooks/useLocale';
import { getCalendarMonth } from '../../services/calendarService';
import type { CalendarMonthResponse } from '../../types/calendar';
import { getCalendarDays } from '../../utils/calendar';
import { Input } from '../../components/Input';

const MAX_VISIBLE_EVENTS = 3;
const TIME_ZONE = 'America/Sao_Paulo';

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => ({
  label: new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
  }).format(new Date(2026, index, 1)),
  value: index + 1,
}));

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

  const [selectedDate, setSelectedDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;

  const days = getCalendarDays(year, month);
  const totalWeeks = days.length / 7;

  const [calendarData, setCalendarData] = useState<CalendarMonthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const [isEditingYear, setIsEditingYear] = useState(false);
  const monthSelectorRef = useRef<HTMLDivElement>(null);

  const [yearDraft, setYearDraft] = useState(String(selectedDate.getFullYear()));

  const handlePreviousMonth = () => {
    setSelectedDate((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1));
  };

  const handleMonthSelect = (month: number) => {
    setSelectedDate((current) => new Date(current.getFullYear(), month - 1, 1));

    setIsMonthDropdownOpen(false);
  };

  const handleYearCommit = () => {
    const parsedYear = Number(yearDraft);

    if (!/^\d{1,4}$/.test(yearDraft) || parsedYear < 1 || parsedYear > 9999) {
      setYearDraft(String(selectedDate.getFullYear()));
      setIsEditingYear(false);
      return;
    }

    setSelectedDate((current) => new Date(parsedYear, current.getMonth(), 1));

    setIsEditingYear(false);
  };

  const handleToday = () => {
    const today = new Date();

    setSelectedDate(new Date(today.getFullYear(), today.getMonth(), 1));
  };

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

  useEffect(() => {
    if (!isMonthDropdownOpen) return;

    const handleClickOutside = (event: PointerEvent) => {
      if (monthSelectorRef.current && !monthSelectorRef.current.contains(event.target as Node)) {
        setIsMonthDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMonthDropdownOpen(false);
      }
    };

    document.addEventListener('pointerdown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMonthDropdownOpen]);

  const eventsByDate = new Map(calendarData?.days.map((day) => [day.date, day.events]) ?? []);

  const monthLabel = new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric',
  }).format(selectedDate);

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

      <Styled.MonthNavigation>
        <Styled.TodayButton type="button" onClick={handleToday}>
          Hoje
        </Styled.TodayButton>

        <Styled.MonthNavigationButtons>
          <Styled.MonthNavigationButton
            type="button"
            aria-label="Mês anterior"
            onClick={handlePreviousMonth}
          >
            ←
          </Styled.MonthNavigationButton>

          <Styled.MonthNavigationButton
            type="button"
            aria-label="Próximo mês"
            onClick={handleNextMonth}
          >
            →
          </Styled.MonthNavigationButton>

          <Styled.MonthSelector ref={monthSelectorRef}>
            <Styled.MonthSelectorTrigger
              type="button"
              aria-haspopup="listbox"
              aria-expanded={isMonthDropdownOpen}
              onClick={() => setIsMonthDropdownOpen((current) => !current)}
            >
              {monthLabel.split(' ')[0]}
            </Styled.MonthSelectorTrigger>

            {isMonthDropdownOpen && (
              <Styled.MonthOptions role="listbox" aria-label="Selecionar mês">
                {MONTH_OPTIONS.map((option) => (
                  <Styled.MonthOption
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={month === option.value}
                    $isSelected={month === option.value}
                    onClick={() => handleMonthSelect(option.value)}
                  >
                    {option.label}
                  </Styled.MonthOption>
                ))}
              </Styled.MonthOptions>
            )}
          </Styled.MonthSelector>
          <Styled.MonthSeparator>de</Styled.MonthSeparator>

          {isEditingYear ? (
            <Styled.YearInputContainer>
              <Input
                id="calendar-year"
                label="Ano"
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={yearDraft}
                autoFocus
                onFocus={(event) => event.target.select()}
                onChange={(event) => setYearDraft(event.target.value)}
                onBlur={handleYearCommit}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleYearCommit();
                  }

                  if (event.key === 'Escape') {
                    setYearDraft(String(selectedDate.getFullYear()));
                    setIsEditingYear(false);
                  }
                }}
                fullWidth
              />
            </Styled.YearInputContainer>
          ) : (
            <Styled.YearButton
              type="button"
              aria-label="Editar ano"
              onClick={() => {
                setYearDraft(String(selectedDate.getFullYear()));
                setIsEditingYear(true);
              }}
            >
              {year}
            </Styled.YearButton>
          )}
        </Styled.MonthNavigationButtons>
      </Styled.MonthNavigation>

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
