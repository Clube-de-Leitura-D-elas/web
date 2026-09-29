import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import { LuArrowLeft, LuCalendar, LuMapPin, LuStar } from 'react-icons/lu';
import * as Styled from './styles';
import { Tabs } from '../../components/Tab';
import {
  Table,
  type TableColumn,
  type TablePageRequest,
  type TablePage,
} from '../../components/Table';
import { useLocale } from '../../hooks/useLocale';
import { interpolate } from '../../locales';
import {
  getGroupDetails,
  getGroupMeetingsPage,
  getGroupParticipantsPage,
} from '../../services/groupService';
import type {
  GroupDetails as GroupDetailsData,
  GroupMeetingHistoryItem,
  GroupParticipantListItem,
} from '../../types/group';

type GroupDetailsTab = 'participants' | 'history';

const formatMeetingDate = (iso: string) => {
  const parts = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).formatToParts(new Date(iso));
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? '';
  const month = get('month').replace('.', '');

  return `${get('day')} ${month.charAt(0).toUpperCase()}${month.slice(1)} ${get('year')}`;
};

const formatNextMeetingDate = (iso: string) => {
  const date = new Date(iso);
  const day = new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).format(date);
  const time = new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
    hourCycle: 'h23',
  }).format(date);

  const [d, , month] = day.split(' ');
  return `${d} de ${month.charAt(0).toUpperCase()}${month.slice(1)}, ${time.replace(':00', 'h')}`;
};

const getInitials = (name: string | null) => {
  if (!name) return '';
  const [first, second] = name.trim().split(' ');
  return `${first?.[0] ?? ''}${second?.[0] ?? ''}`.toUpperCase();
};

export const GroupDetails = () => {
  const locale = useLocale();
  const navigate = useNavigate();
  const { groupId = '' } = useParams<{ groupId: string }>();

  const [activeTab, setActiveTab] = useState<GroupDetailsTab>('participants');
  const [result, setResult] = useState<{ id: string; group: GroupDetailsData | null } | null>(null);

  useEffect(() => {
    let ignore = false;

    getGroupDetails(groupId)
      .then((data) => {
        if (!ignore) setResult({ id: groupId, group: data });
      })
      .catch((err) => {
        console.error(err);
        if (!ignore) setResult({ id: groupId, group: null });
      });

    return () => {
      ignore = true;
    };
  }, [groupId]);

  const loading = result?.id !== groupId;
  const group = result?.group ?? null;
  const hasError = !loading && !group;

  //aba 1
  const participantColumns: TableColumn[] = useMemo(
    () => [
      { key: 'name', label: locale.group_details.table.columns.name, align: 'left' },
      { key: 'entryDate', label: locale.group_details.table.columns.entryDate, align: 'center' },
      { key: 'attendance', label: locale.group_details.table.columns.attendance, align: 'center' },
      { key: 'email', label: locale.group_details.table.columns.email, align: 'center' },
      {
        key: 'actions',
        label: locale.group_details.table.columns.actions,
        align: 'right',
        width: '6rem',
      },
    ],
    [locale],
  );

  const fetchParticipants = useCallback(
    async (request: TablePageRequest): Promise<TablePage> => {
      const { items, total } = await getGroupParticipantsPage(groupId, request);

      const rows = items.map((p: GroupParticipantListItem) => ({
        name: (
          <Styled.NameCell>
            <Styled.ParticipantLink to={`/participantes/${p.id}`}>{p.name}</Styled.ParticipantLink>
            {p.is_coordinator && (
              <Styled.CoordinatorTag>
                {locale.group_details.table.coordinatorTag}
              </Styled.CoordinatorTag>
            )}
          </Styled.NameCell>
        ),
        entryDate: p.entry_date
          ? new Date(p.entry_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
          : locale.group_details.table.emptyValue,
        attendance: (
          <Styled.AttendanceList>
            {p.attendance.length > 0
              ? p.attendance.map((mark, index) => (
                  <Styled.AttendanceMark key={index} $present={mark === 'P'}>
                    {mark}
                  </Styled.AttendanceMark>
                ))
              : locale.group_details.table.emptyValue}
          </Styled.AttendanceList>
        ),
        email: p.email || locale.group_details.table.emptyValue,
        actions: (
          <Styled.ActionsButton
            type="button"
            aria-label={interpolate(locale.group_details.table.actionsAriaLabel, { name: p.name })}
          >
            ⋮
          </Styled.ActionsButton>
        ),
      }));

      return { rows, total };
    },
    [groupId, locale],
  );

  //aba 2
  const meetingColumns: TableColumn[] = useMemo(
    () => [
      { key: 'date', label: locale.group_details.history.columns.date, align: 'left' },
      { key: 'book', label: locale.group_details.history.columns.book, align: 'left' },
      { key: 'place', label: locale.group_details.history.columns.place, align: 'left' },
      { key: 'attendance', label: locale.group_details.history.columns.attendance, align: 'left' },
      { key: 'rating', label: locale.group_details.history.columns.rating, align: 'left' },
      {
        key: 'actions',
        label: locale.group_details.history.columns.actions,
        align: 'right',
        width: '6rem',
      },
    ],
    [locale],
  );

  const fetchMeetings = useCallback(
    async (request: TablePageRequest): Promise<TablePage> => {
      const { items, total } = await getGroupMeetingsPage(groupId, request);

      const rows = items.map((m: GroupMeetingHistoryItem) => {
        const date = formatMeetingDate(m.date);
        const percent =
          m.attendance_total > 0
            ? Math.round((m.attendance_present / m.attendance_total) * 100)
            : 0;

        return {
          date,
          book: interpolate(locale.group_details.history.book, {
            title: m.book_title,
            author: m.book_author,
          }),
          place: interpolate(locale.group_details.nextMeeting.location, {
            place: m.place || locale.group_details.notInformed,
            neighborhood: m.neighborhood || locale.group_details.notInformed,
          }),
          attendance: (
            <Styled.Muted>
              {interpolate(locale.group_details.history.attendance, {
                present: m.attendance_present,
                total: m.attendance_total,
                percent,
              })}
            </Styled.Muted>
          ),
          rating:
            m.average_rating === null ? (
              locale.group_details.table.emptyValue
            ) : (
              <Styled.Rating>
                <LuStar aria-hidden />
                {m.average_rating.toFixed(1)}
                <Styled.Muted>
                  {interpolate(locale.group_details.history.votes, { count: m.votes_count })}
                </Styled.Muted>
              </Styled.Rating>
            ),
          actions: (
            <Styled.ActionsButton
              type="button"
              aria-label={interpolate(locale.group_details.history.actionsAriaLabel, { date })}
            >
              ⋮
            </Styled.ActionsButton>
          ),
        };
      });

      return { rows, total };
    },
    [groupId, locale],
  );

  const tabsConfig = useMemo(
    () => [
      {
        value: 'participants',
        label: locale.group_details.tabs.participants,
        children: (
          <Styled.TableContainer>
            <Table
              columns={participantColumns}
              fetchPage={fetchParticipants}
              pageSize={6}
              itemLabel={locale.group_details.table.itemLabel}
            />
          </Styled.TableContainer>
        ),
      },
      {
        value: 'history',
        label: locale.group_details.tabs.history,
        children: (
          <Styled.TableContainer>
            <Table
              columns={meetingColumns}
              fetchPage={fetchMeetings}
              pageSize={6}
              itemLabel={locale.group_details.history.itemLabel}
            />
          </Styled.TableContainer>
        ),
      },
    ],
    [locale, participantColumns, fetchParticipants, meetingColumns, fetchMeetings],
  );

  if (loading) return <Styled.Message>{locale.group_details.loading}</Styled.Message>;
  if (hasError || !group) return <Styled.Message>{locale.group_details.loadError}</Styled.Message>;

  const meeting = group.next_meeting;

  return (
    <Styled.Container>
      <Styled.BackButton type="button" onClick={() => navigate('/grupos')}>
        <LuArrowLeft aria-hidden />
        {locale.group_details.back}
      </Styled.BackButton>

      <Styled.Header>
        <Styled.HeaderInfo>
          <Styled.Title>{group.name}</Styled.Title>
          <Styled.Subtitle>
            {interpolate(locale.group_details.header.subtitle, {
              city: group.city || locale.group_details.notInformed,
              count: group.active_participants_count,
            })}
          </Styled.Subtitle>
        </Styled.HeaderInfo>
        <Styled.HeaderActions>
          <Styled.EditButton size="sm" variant="secondary">
            {locale.group_details.header.editGroup}
          </Styled.EditButton>
          <Styled.CloseButton size="sm" variant="secondary">
            {locale.group_details.header.closeGroup}
          </Styled.CloseButton>
        </Styled.HeaderActions>
      </Styled.Header>

      <Styled.CardsRow>
        <Styled.Card>
          <Styled.CardLabel>{locale.group_details.coordinator.label}</Styled.CardLabel>
          <Styled.CoordinatorRow>
            <Styled.Avatar>{getInitials(group.coordinator_name)}</Styled.Avatar>
            <Styled.CoordinatorInfo>
              <Styled.CardValue>
                {group.coordinator_name || locale.group_details.notInformed}
              </Styled.CardValue>
              <Styled.CardText>
                {group.coordinator_email || locale.group_details.notInformed}
              </Styled.CardText>
            </Styled.CoordinatorInfo>
            <Styled.TrocarButton type="button">
              {locale.group_details.coordinator.change}
            </Styled.TrocarButton>
          </Styled.CoordinatorRow>
        </Styled.Card>

        <Styled.Card>
          <Styled.MeetingHeader>
            <Styled.CardLabel>{locale.group_details.nextMeeting.label}</Styled.CardLabel>
            {meeting && (
              <Styled.MeetingStatus $confirmed={meeting.confirmed}>
                {meeting.confirmed
                  ? locale.group_details.nextMeeting.statusConfirmed
                  : locale.group_details.nextMeeting.statusPending}
              </Styled.MeetingStatus>
            )}
          </Styled.MeetingHeader>

          {meeting ? (
            <Styled.MeetingBody>
              <Styled.CalendarIcon aria-hidden>
                <LuCalendar />
              </Styled.CalendarIcon>
              <Styled.MeetingInfo>
                <Styled.MeetingDate>{formatNextMeetingDate(meeting.date)}</Styled.MeetingDate>
                <Styled.CardText>
                  {locale.group_details.nextMeeting.bookLabel}{' '}
                  <Styled.BookTitle>
                    {meeting.book_title || locale.group_details.notInformed}
                  </Styled.BookTitle>{' '}
                  ({meeting.book_author || locale.group_details.notInformed})
                </Styled.CardText>
                <Styled.LocationText>
                  <LuMapPin aria-hidden />
                  {interpolate(locale.group_details.nextMeeting.location, {
                    place: meeting.place || locale.group_details.notInformed,
                    neighborhood: meeting.neighborhood || locale.group_details.notInformed,
                  })}
                </Styled.LocationText>
              </Styled.MeetingInfo>
            </Styled.MeetingBody>
          ) : (
            <Styled.CardValue>{locale.group_details.notInformed}</Styled.CardValue>
          )}
        </Styled.Card>
      </Styled.CardsRow>

      <Tabs
        tabs={tabsConfig}
        active={activeTab}
        onChange={(value) => setActiveTab(value as GroupDetailsTab)}
        size="lg"
      />
    </Styled.Container>
  );
};
