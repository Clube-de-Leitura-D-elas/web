import { interpolate, locale } from '../../locales';
import type { ParticipantMeetingRecord } from '../../types/participant';
import { Skeleton } from '../../components/Skeleton';
import { formatDateBadge, formatShortDate } from '../../utils/date';
import * as Styled from './styles';

const text = locale.participant_details.meetings;

export type MeetingsState = {
  status: 'loading' | 'ready' | 'error';
  meetings: ParticipantMeetingRecord[];
};

type ParticipantRecentMeetingsProps = {
  state: MeetingsState;
};

const RECENT_LIMIT = 5;

export const ParticipantRecentMeetings = ({ state }: ParticipantRecentMeetingsProps) => {
  const recent = state.meetings.slice(0, RECENT_LIMIT);

  return (
    <Styled.Card aria-labelledby="participant-recent-meetings" $enter={300}>
      <Styled.CardHeader>
        <Styled.CardTitle id="participant-recent-meetings">{text.title}</Styled.CardTitle>
      </Styled.CardHeader>

      {state.status === 'loading' && (
        <Styled.MeetingList role="status">
          <Styled.VisuallyHidden>{text.loading}</Styled.VisuallyHidden>
          {Array.from({ length: 3 }).map((_, index) => (
            <Styled.MeetingItem key={index} $index={index} aria-hidden="true">
              <Skeleton width="3rem" height="2.75rem" />
              <Styled.MeetingInfo>
                <Skeleton width="60%" height="1rem" />
                <Skeleton width="30%" height="0.75rem" />
              </Styled.MeetingInfo>
            </Styled.MeetingItem>
          ))}
        </Styled.MeetingList>
      )}

      {state.status === 'error' && <Styled.Message role="alert">{text.error}</Styled.Message>}

      {state.status === 'ready' && recent.length === 0 && (
        <Styled.Message>{text.empty}</Styled.Message>
      )}

      {recent.length > 0 && (
        <Styled.MeetingList>
          {recent.map((meeting, index) => {
            const badge = formatDateBadge(meeting.date);

            return (
              <Styled.MeetingItem key={meeting.meetingId} $index={index}>
                {badge && (
                  <Styled.DateTile aria-hidden="true">
                    <Styled.DateTileDay>{badge.day}</Styled.DateTileDay>
                    <Styled.DateTileMonth>{badge.month}</Styled.DateTileMonth>
                  </Styled.DateTile>
                )}
                <Styled.MeetingInfo>
                  <Styled.VisuallyHidden>{formatShortDate(meeting.date)}</Styled.VisuallyHidden>
                  <Styled.MeetingBook>{meeting.bookTitle}</Styled.MeetingBook>
                  <Styled.MeetingGroup>
                    {interpolate(text.group, {
                      number: String(meeting.groupNumber).padStart(2, '0'),
                    })}
                  </Styled.MeetingGroup>
                </Styled.MeetingInfo>
                <Styled.Pill
                  $tone={
                    meeting.present === null ? 'neutral' : meeting.present ? 'success' : 'danger'
                  }
                >
                  {meeting.present === null
                    ? text.unknown
                    : meeting.present
                      ? text.present
                      : text.absent}
                </Styled.Pill>
              </Styled.MeetingItem>
            );
          })}
        </Styled.MeetingList>
      )}
    </Styled.Card>
  );
};
