import { Modal } from '../../../components/Modal';
import type { CalendarEvent } from '../../../types/calendar';
import * as Styled from './styles';
import { useLocale } from '../../../hooks/useLocale';
import { formatDayModalDate, formatEventTime } from '../../../utils/date';
import { interpolate } from '../../../locales';

export type DayModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectEvent?: (eventId: string) => void;
  date: Date;
  events: CalendarEvent[];
};

export const DayModal = ({ isOpen, onClose, onSelectEvent, date, events }: DayModalProps) => {
  const locale = useLocale();

  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={formatDayModalDate(date)}
      showFooter={false}
      size="md"
    >
      {sortedEvents.length > 0 ? (
        <Styled.EventsList>
          {sortedEvents.map((event) => (
            <Styled.EventItem key={event.id}>
              <Styled.EventButton
                type="button"
                onClick={() => onSelectEvent?.(event.id)}
                disabled={!onSelectEvent}
                aria-label={interpolate(locale.calendar.dayModal.eventAriaLabel, {
                  time: formatEventTime(event.startsAt),
                  group: event.groupName,
                  city: event.city,
                })}
              >
                <Styled.EventDot />

                <Styled.EventDetails>
                  <Styled.EventTime>{formatEventTime(event.startsAt)}</Styled.EventTime>

                  <Styled.GroupName>{event.groupName}</Styled.GroupName>

                  <Styled.City>{event.city}</Styled.City>
                </Styled.EventDetails>
              </Styled.EventButton>
            </Styled.EventItem>
          ))}
        </Styled.EventsList>
      ) : (
        <Styled.EmptyState>{locale.calendar.emptyState}</Styled.EmptyState>
      )}
    </Modal>
  );
};
