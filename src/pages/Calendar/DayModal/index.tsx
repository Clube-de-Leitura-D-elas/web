import { Modal } from '../../../components/Modal';
import type { CalendarEvent } from '../../../types/calendar';
import * as Styled from './styles';
import { useLocale } from '../../../hooks/useLocale';

const TIME_ZONE = 'America/Sao_Paulo';

export type DayModalProps = {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  events: CalendarEvent[];
};

const formatDate = (date: Date): string =>
  new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);

const formatTime = (value: string): string =>
  new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: TIME_ZONE,
  }).format(new Date(value));

export const DayModal = ({ isOpen, onClose, date, events }: DayModalProps) => {
  const locale = useLocale();
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={formatDate(date)} showFooter={false} size="md">
      {sortedEvents.length > 0 ? (
        <Styled.EventsList>
          {sortedEvents.map((event) => (
            <Styled.EventItem key={event.id}>
              <Styled.EventDot />

              <Styled.EventDetails>
                <Styled.EventTime>{formatTime(event.startsAt)}</Styled.EventTime>

                <Styled.GroupName>{event.groupName}</Styled.GroupName>

                <Styled.City>{event.city}</Styled.City>
              </Styled.EventDetails>
            </Styled.EventItem>
          ))}
        </Styled.EventsList>
      ) : (
        <Styled.EmptyState> {locale.calendar.emptyState}</Styled.EmptyState>
      )}
    </Modal>
  );
};
