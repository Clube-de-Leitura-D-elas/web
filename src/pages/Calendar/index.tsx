import * as Styled from './styles';

import { useLocale } from '../../hooks/useLocale';
import { getCalendarDays } from '../../utils/calendar';

export const Calendar = () => {
  const locale = useLocale();

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  const days = getCalendarDays(year, month);

  const totalWeeks = days.length / 7;

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

  const isToday = (date: Date) =>
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

      <Styled.CalendarScroll>
        <Styled.CalendarGrid
          style={
            {
              '--calendar-weeks': totalWeeks,
            } as React.CSSProperties
          }
        >
          {weekdays.map((weekday, index) => (
            <Styled.WeekdayHeader key={index}>{weekday}</Styled.WeekdayHeader>
          ))}

          {days.map((date) => {
            const dateKey = [
              date.getFullYear(),
              String(date.getMonth() + 1).padStart(2, '0'),
              String(date.getDate()).padStart(2, '0'),
            ].join('-');

            const inMonth = date.getMonth() + 1 === month;
            const currentDay = isToday(date);

            return (
              <Styled.DayCell key={dateKey} $outsideMonth={!inMonth}>
                <Styled.DayNumber $today={currentDay} $outsideMonth={!inMonth}>
                  {date.getDate()}
                </Styled.DayNumber>
              </Styled.DayCell>
            );
          })}
        </Styled.CalendarGrid>
      </Styled.CalendarScroll>
    </Styled.Container>
  );
};
