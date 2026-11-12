import type { ReactNode } from 'react';
import { LuStar, LuTriangleAlert } from 'react-icons/lu';
import { Skeleton } from '../../components/Skeleton';
import { useLocale } from '../../hooks/useLocale';
import { interpolate, pluralize } from '../../locales';
import type { GroupMeetingHistoryItem, GroupParticipantListItem } from '../../types/group';
import { needsAttention } from './attendance';
import * as Styled from './styles';

export type AsyncList<T> = {
  status: 'loading' | 'ready' | 'error';
  items: T[];
  total: number;
};

type GroupStatsProps = {
  activeCount: number;
  members: AsyncList<GroupParticipantListItem>;
  meetings: AsyncList<GroupMeetingHistoryItem>;
};

const RECENT_MEETINGS = 3;
const ATTENTION_PREVIEW = 3;

const ratingFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const firstName = (name: string) => name.split(' ')[0];

export const GroupStats = ({ activeCount, members, meetings }: GroupStatsProps) => {
  const { group_details: text } = useLocale();
  const stats = text.stats;

  const renderValue = (status: AsyncList<unknown>['status'], value: () => ReactNode) => {
    if (status === 'loading') return <Skeleton width="5rem" height="2.5rem" />;
    if (status === 'error') return '—';
    return value();
  };

  const inactive = Math.max(members.total - activeCount, 0);

  const recent = meetings.items.slice(0, RECENT_MEETINGS);
  const recentPresent = recent.reduce((sum, meeting) => sum + meeting.attendance_present, 0);
  const recentTotal = recent.reduce((sum, meeting) => sum + meeting.attendance_total, 0);
  const attendancePercent = recentTotal > 0 ? Math.round((recentPresent / recentTotal) * 100) : 0;

  const rated = meetings.items.filter((meeting) => meeting.average_rating !== null);
  const votes = rated.reduce((sum, meeting) => sum + meeting.votes_count, 0);
  const rating =
    votes > 0
      ? rated.reduce(
          (sum, meeting) => sum + (meeting.average_rating ?? 0) * meeting.votes_count,
          0,
        ) / votes
      : null;

  const attention = members.items
    .map((member) => ({ member, reason: needsAttention(member) }))
    .filter((entry) => entry.reason !== null);

  return (
    <Styled.StatsGrid aria-label={stats.label}>
      <Styled.StatCard $enter={120}>
        <Styled.StatLabel>{stats.active}</Styled.StatLabel>
        <Styled.StatValue>
          {activeCount}
          {members.status === 'ready' && (
            <Styled.StatOf>{interpolate(stats.activeOf, { total: members.total })}</Styled.StatOf>
          )}
        </Styled.StatValue>
        <Styled.StatSub>
          {members.status === 'ready'
            ? inactive > 0
              ? pluralize(stats.inactive, inactive)
              : stats.allActive
            : members.status === 'error'
              ? stats.unavailable
              : null}
        </Styled.StatSub>
      </Styled.StatCard>

      <Styled.StatCard $enter={170}>
        <Styled.StatLabel>{stats.attendance}</Styled.StatLabel>
        <Styled.StatValue>
          {renderValue(meetings.status, () => (recentTotal > 0 ? `${attendancePercent}%` : '—'))}
        </Styled.StatValue>
        {meetings.status === 'ready' && recentTotal > 0 && (
          <Styled.Bar aria-hidden="true">
            <Styled.BarFill $percent={attendancePercent} />
          </Styled.Bar>
        )}
        <Styled.StatSub>
          {meetings.status === 'error'
            ? stats.unavailable
            : meetings.status === 'ready' &&
              (recent.length > 0
                ? pluralize(stats.attendanceSub, recent.length)
                : stats.noMeetings)}
        </Styled.StatSub>
      </Styled.StatCard>

      <Styled.StatCard $enter={220}>
        <Styled.StatLabel>{stats.rating}</Styled.StatLabel>
        <Styled.StatValue>
          {renderValue(meetings.status, () =>
            rating === null ? (
              '—'
            ) : (
              <>
                {ratingFormatter.format(rating)}
                <LuStar aria-hidden />
              </>
            ),
          )}
        </Styled.StatValue>
        <Styled.StatSub>
          {meetings.status === 'error'
            ? stats.unavailable
            : meetings.status === 'ready' &&
              (rating === null
                ? stats.noRatings
                : interpolate(stats.ratingSub, {
                    meetings: pluralize(stats.meetings, meetings.total),
                    votes: pluralize(stats.votes, votes),
                  }))}
        </Styled.StatSub>
      </Styled.StatCard>

      <Styled.StatCard $enter={270} $warning={attention.length > 0}>
        <Styled.StatLabel $warning={attention.length > 0}>
          {attention.length > 0 && <LuTriangleAlert aria-hidden />}
          {stats.attention}
        </Styled.StatLabel>
        <Styled.StatValue>{renderValue(members.status, () => attention.length)}</Styled.StatValue>
        {members.status === 'ready' &&
          (attention.length > 0 ? (
            <Styled.AttentionList>
              {attention.slice(0, ATTENTION_PREVIEW).map(({ member, reason }) => (
                <li key={member.id}>
                  {interpolate(reason === 'low' ? stats.lowAttendance : stats.incomplete, {
                    name: firstName(member.name),
                  })}
                </li>
              ))}
              {attention.length > ATTENTION_PREVIEW && (
                <li>{pluralize(stats.attentionMore, attention.length - ATTENTION_PREVIEW)}</li>
              )}
            </Styled.AttentionList>
          ) : (
            <Styled.StatSub>{stats.attentionNone}</Styled.StatSub>
          ))}
        {members.status === 'error' && <Styled.StatSub>{stats.unavailable}</Styled.StatSub>}
      </Styled.StatCard>
    </Styled.StatsGrid>
  );
};
