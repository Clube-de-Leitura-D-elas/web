import { LuBookOpen, LuCalendar, LuMapPin, LuUserRoundX } from 'react-icons/lu';
import { Avatar } from '../../components/Avatar';
import { Tag } from '../../components/Tag';
import { useLocale } from '../../hooks/useLocale';
import { interpolate, pluralize } from '../../locales';
import type { GroupDetails } from '../../types/group';
import { formatMeetingSummary } from '../../utils/date';
import * as Styled from './styles';

const listFormatter = new Intl.ListFormat('pt-BR', { style: 'long', type: 'conjunction' });

type GroupSummaryProps = {
  group: GroupDetails;
};

export const GroupSummary = ({ group }: GroupSummaryProps) => {
  const { group_details: text } = useLocale();
  const { coordinators, next_meeting: meeting } = group;
  const [firstCoordinator] = coordinators;

  return (
    <Styled.SummaryStrip aria-label={text.summary.label} $enter={80}>
      <Styled.SummaryItem>
        {firstCoordinator ? (
          <Avatar name={firstCoordinator.name} photo={firstCoordinator.photo} />
        ) : (
          <Styled.SummaryIcon aria-hidden="true">
            <LuUserRoundX />
          </Styled.SummaryIcon>
        )}
        <Styled.SummaryText>
          <Styled.SummaryLabel>
            {pluralize(text.summary.coordinator, Math.max(coordinators.length, 1))}
          </Styled.SummaryLabel>
          <Styled.SummaryValue $warning={!firstCoordinator}>
            {firstCoordinator
              ? listFormatter.format(coordinators.map((coordinator) => coordinator.name))
              : text.summary.noCoordinator}
          </Styled.SummaryValue>
        </Styled.SummaryText>
      </Styled.SummaryItem>

      <Styled.SummaryItem>
        <Styled.SummaryIcon aria-hidden="true">
          <LuCalendar />
        </Styled.SummaryIcon>
        <Styled.SummaryText>
          <Styled.SummaryLabel>{text.summary.nextMeeting}</Styled.SummaryLabel>
          {meeting ? (
            <Styled.SummaryValue>
              {formatMeetingSummary(meeting.date)}
              <Styled.SummaryTag>
                <Tag color={meeting.confirmed ? 'success' : 'warning'}>
                  {meeting.confirmed ? text.summary.statusConfirmed : text.summary.statusPending}
                </Tag>
              </Styled.SummaryTag>
            </Styled.SummaryValue>
          ) : (
            <Styled.SummaryValue>{text.summary.noNextMeeting}</Styled.SummaryValue>
          )}
        </Styled.SummaryText>
      </Styled.SummaryItem>

      {meeting && (
        <>
          <Styled.SummaryItem>
            <Styled.SummaryIcon aria-hidden="true">
              <LuBookOpen />
            </Styled.SummaryIcon>
            <Styled.SummaryText>
              <Styled.SummaryLabel>{text.summary.book}</Styled.SummaryLabel>
              <Styled.SummaryValue>
                {meeting.book_title || text.notInformed}
                {meeting.book_author && (
                  <Styled.SummaryDetail>
                    {interpolate(text.summary.detail, { value: meeting.book_author })}
                  </Styled.SummaryDetail>
                )}
              </Styled.SummaryValue>
            </Styled.SummaryText>
          </Styled.SummaryItem>

          <Styled.SummaryItem>
            <Styled.SummaryIcon aria-hidden="true">
              <LuMapPin />
            </Styled.SummaryIcon>
            <Styled.SummaryText>
              <Styled.SummaryLabel>{text.summary.place}</Styled.SummaryLabel>
              <Styled.SummaryValue>
                {meeting.place || text.notInformed}
                {meeting.neighborhood && (
                  <Styled.SummaryDetail>
                    {interpolate(text.summary.detail, { value: meeting.neighborhood })}
                  </Styled.SummaryDetail>
                )}
              </Styled.SummaryValue>
            </Styled.SummaryText>
          </Styled.SummaryItem>
        </>
      )}
    </Styled.SummaryStrip>
  );
};
