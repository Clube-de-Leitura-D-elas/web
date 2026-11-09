import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import * as Styled from './styles';
import { useLocale } from '../../hooks/useLocale';
import { getCalendarMonth } from '../../services/calendarService';
import type { CalendarMonthResponse } from '../../types/calendar';
import { getCalendarDays } from '../../utils/calendar';
import { Input } from '../../components/Input';
import { DayModal } from './DayModal';
import { interpolate } from '../../locales';
import { formatCalendarMonthName, formatEventTime } from '../../utils/date';
import { useNavigate, useSearchParams } from 'react-router';

const MAX_VISIBLE_EVENTS = 3;
// mesmo intervalo aceito pela edge function calendar-month
const MIN_YEAR = 1000;
const MAX_YEAR = 9998;

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

const getInitialCalendarDate = (params: URLSearchParams): Date => {
  const today = new Date();

  const yearParam = params.get('year');
  const monthParam = params.get('month');

  const year = Number(yearParam);
  const month = Number(monthParam);

  const validYear =
    yearParam !== null && /^\d{4}$/.test(yearParam) && year >= MIN_YEAR && year <= MAX_YEAR;

  const validMonth =
    monthParam !== null && /^\d{1,2}$/.test(monthParam) && month >= 1 && month <= 12;

  return new Date(
    validYear ? year : today.getFullYear(),
    validMonth ? month - 1 : today.getMonth(),
    1,
  );
};

export const Calendar = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const locale = useLocale();
  const navigationText = locale.calendar.navigation;

  const today = new Date();

  const selectedDate = getInitialCalendarDate(searchParams);

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;

  useEffect(() => {
    if (searchParams.get('year') === String(year) && searchParams.get('month') === String(month)) {
      return;
    }

    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);

        next.set('year', String(year));
        next.set('month', String(month));

        return next;
      },
      { replace: true },
    );
  }, [year, month, searchParams, setSearchParams]);

  const days = getCalendarDays(year, month);
  const totalWeeks = days.length / 7;

  const [calendarData, setCalendarData] = useState<CalendarMonthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const isCalendarAvailable = !loading && !error && calendarData !== null;
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const [isEditingYear, setIsEditingYear] = useState(false);
  const monthSelectorRef = useRef<HTMLDivElement>(null);

  const [yearDraft, setYearDraft] = useState(String(selectedDate.getFullYear()));

  const updateCalendarDate = (date: Date) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);

      next.set('year', String(date.getFullYear()));
      next.set('month', String(date.getMonth() + 1));

      return next;
    });
  };

  const handlePreviousMonth = () => {
    updateCalendarDate(new Date(year, month - 2, 1));
  };

  const handleNextMonth = () => {
    updateCalendarDate(new Date(year, month, 1));
  };

  const handleMonthSelect = (selectedMonth: number) => {
    updateCalendarDate(new Date(year, selectedMonth - 1, 1));

    setIsMonthDropdownOpen(false);
  };

  const handleYearCommit = () => {
    const parsedYear = Number(yearDraft);

    // só 4 dígitos: `new Date(26, …)` viraria 1926
    if (!/^\d{4}$/.test(yearDraft) || parsedYear < MIN_YEAR || parsedYear > MAX_YEAR) {
      setYearDraft(String(selectedDate.getFullYear()));
      setIsEditingYear(false);
      return;
    }

    updateCalendarDate(new Date(parsedYear, month - 1, 1));

    setIsEditingYear(false);
  };

  const handleToday = () => {
    const now = new Date();

    updateCalendarDate(new Date(now.getFullYear(), now.getMonth(), 1));
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

  const handleDayClick = (date: Date) => {
    if (!isCalendarAvailable) return;
    setSelectedDay(date);
  };

  const handleEventSelect = (eventId: string) => {
    setSelectedDay(null);
    navigate(`/eventos/${eventId}`);
  };

  return (
    <Styled.Container>
      <Styled.Header>
        <Styled.Title>{locale.calendar.title}</Styled.Title>
        <Styled.Subtitle>{locale.calendar.subtitle}</Styled.Subtitle>
      </Styled.Header>

      <Styled.MonthNavigation>
        <Styled.TodayButton type="button" onClick={handleToday}>
          {navigationText.today}
        </Styled.TodayButton>

        <Styled.MonthNavigationButtons>
          <Styled.MonthNavigationButton
            type="button"
            aria-label={navigationText.previousMonth}
            onClick={handlePreviousMonth}
          >
            <LuChevronLeft aria-hidden />
          </Styled.MonthNavigationButton>

          <Styled.MonthNavigationButton
            type="button"
            aria-label={navigationText.nextMonth}
            onClick={handleNextMonth}
          >
            <LuChevronRight aria-hidden />
          </Styled.MonthNavigationButton>

          <Styled.MonthSelector ref={monthSelectorRef}>
            <Styled.MonthSelectorTrigger
              type="button"
              aria-haspopup="listbox"
              aria-expanded={isMonthDropdownOpen}
              onClick={() => setIsMonthDropdownOpen((current) => !current)}
            >
              {MONTH_OPTIONS[month - 1].label}
            </Styled.MonthSelectorTrigger>

            {isMonthDropdownOpen && (
              <Styled.MonthOptions role="listbox" aria-label={navigationText.selectMonth}>
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
          <Styled.MonthSeparator>{navigationText.monthYearSeparator}</Styled.MonthSeparator>

          {isEditingYear ? (
            <Styled.YearInputContainer>
              <Input
                id="calendar-year"
                label={navigationText.year}
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
              aria-label={navigationText.editYear}
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

      {error && <Styled.Feedback role="alert">{locale.calendar.loadError}</Styled.Feedback>}

      <Styled.CalendarScroll>
        {loading && (
          <Styled.LoadingStatus role="status">{locale.calendar.loading}</Styled.LoadingStatus>
        )}
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

            const dayAriaLabel = `${interpolate(locale.calendar.dayAriaLabel, {
              day: date.getDate(),
              month: formatCalendarMonthName(date),
              year: date.getFullYear(),
            })}, ${events.length} ${events.length === 1 ? 'evento' : 'eventos'}`;

            return (
              <Styled.DayCell
                data-testid="calendar-day"
                key={dateKey}
                $outsideMonth={!inMonth}
                $isLoading={loading}
                $disabled={!isCalendarAvailable}
                role="button"
                tabIndex={isCalendarAvailable ? 0 : -1}
                aria-disabled={!isCalendarAvailable}
                aria-label={dayAriaLabel}
                onClick={() => handleDayClick(date)}
                onKeyDown={(event) => {
                  if (!isCalendarAvailable) return;

                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handleDayClick(date);
                  }
                }}
              >
                <Styled.DayNumber $today={currentDay} $outsideMonth={!inMonth}>
                  {date.getDate()}
                </Styled.DayNumber>

                <Styled.EventsList>
                  {visibleEvents.map((event) => (
                    <Styled.EventItem
                      key={event.id}
                      title={`${formatEventTime(event.startsAt)} - ${event.groupName}`}
                    >
                      <Styled.EventDot />

                      <Styled.EventText>
                        {formatEventTime(event.startsAt)} {event.groupName}
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
      {selectedDay && (
        <DayModal
          isOpen={Boolean(selectedDay)}
          onClose={() => setSelectedDay(null)}
          onSelectEvent={handleEventSelect}
          date={selectedDay}
          events={eventsByDate.get(getDateKey(selectedDay)) ?? []}
        />
      )}
    </Styled.Container>
  );
};
