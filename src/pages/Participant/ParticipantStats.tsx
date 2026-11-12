import { Skeleton } from '../../components/Skeleton';
import { interpolate, locale, pluralize } from '../../locales';
import type { ParticipantGroup, ParticipantPresence } from '../../types/participant';
import { formatMonthYear, getElapsedTime } from '../../utils/date';
import * as Styled from './styles';

const text = locale.participant_details.stats;

export type GroupsState = {
  status: 'loading' | 'ready' | 'error';
  groups: ParticipantGroup[];
};

type ParticipantStatsProps = {
  presence: ParticipantPresence[];
  groups: GroupsState;
  entryDate: string | null;
};

const describeGroups = (groups: ParticipantGroup[]) => {
  const coordinator = groups.filter((group) => group.isCoordinator).length;
  const member = groups.length - coordinator;

  if (groups.length === 0) return text.noGroups;
  if (coordinator === 0) return pluralize(text.groupsMemberSub, member);
  if (member === 0) return pluralize(text.groupsCoordinatorSub, coordinator);
  return interpolate(text.groupsSub, { coordinator, member });
};

const describeTenure = (entryDate: string | null) => {
  const elapsed = getElapsedTime(entryDate);
  if (!elapsed || !entryDate) return { value: '—', sub: text.noEntryDate };

  const since = formatMonthYear(entryDate);
  if (elapsed.years > 0) {
    return {
      value: pluralize(text.years, elapsed.years),
      sub:
        elapsed.months > 0
          ? interpolate(text.tenureMore, {
              months: pluralize(text.months, elapsed.months),
              date: since,
            })
          : interpolate(text.tenureSince, { date: since }),
    };
  }

  return {
    value: elapsed.months > 0 ? pluralize(text.months, elapsed.months) : text.lessThanMonth,
    sub: interpolate(text.tenureSince, { date: since }),
  };
};

export const ParticipantStats = ({ presence, groups, entryDate }: ParticipantStatsProps) => {
  const presentCount = presence.filter((item) => item.present).length;
  const percent = presence.length > 0 ? Math.round((presentCount / presence.length) * 100) : 0;
  const tenure = describeTenure(entryDate);

  return (
    <Styled.StatsGrid aria-label={text.label}>
      <Styled.StatCard $enter={100}>
        <Styled.StatLabel>{text.presence}</Styled.StatLabel>
        <Styled.StatValue>{presence.length > 0 ? `${percent}%` : '—'}</Styled.StatValue>
        {presence.length > 0 && (
          <Styled.PresenceDots
            role="img"
            aria-label={interpolate(text.presenceAria, {
              present: presentCount,
              total: presence.length,
            })}
          >
            {presence.map((item, index) => (
              <Styled.PresenceDot key={item.meetingId} $present={item.present} $index={index} />
            ))}
          </Styled.PresenceDots>
        )}
        <Styled.StatSub>
          {presence.length > 0
            ? interpolate(text.presenceSub, { present: presentCount, total: presence.length })
            : text.noPresence}
        </Styled.StatSub>
      </Styled.StatCard>

      <Styled.StatCard $enter={150}>
        <Styled.StatLabel>{text.groups}</Styled.StatLabel>
        <Styled.StatValue>
          {groups.status === 'loading' ? (
            <Skeleton width="3rem" height="2.5rem" />
          ) : groups.status === 'error' ? (
            '—'
          ) : (
            groups.groups.length
          )}
        </Styled.StatValue>
        <Styled.StatSub>
          {groups.status === 'ready'
            ? describeGroups(groups.groups)
            : groups.status === 'error'
              ? text.unavailable
              : null}
        </Styled.StatSub>
      </Styled.StatCard>

      <Styled.StatCard $enter={200}>
        <Styled.StatLabel>{text.tenure}</Styled.StatLabel>
        <Styled.StatValue>{tenure.value}</Styled.StatValue>
        <Styled.StatSub>{tenure.sub}</Styled.StatSub>
      </Styled.StatCard>
    </Styled.StatsGrid>
  );
};
