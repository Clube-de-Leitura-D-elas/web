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
  updateGroupStatus,
} from '../../services/groupService';
import type {
  GroupDetails as GroupDetailsData,
  GroupMeetingHistoryItem,
  GroupParticipantListItem,
} from '../../types/group';
import { Modal } from '../../components/Modal';

type GroupDetailsTab = 'participants' | 'history';

const formatHistoryDate = (iso: string) => {
  const parts = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'America/Sao_Paulo',
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
    timeZone: 'America/Sao_Paulo',
  }).format(date);
  const timeParts = new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
    hourCycle: 'h23',
  }).formatToParts(date);

  const hour = timeParts.find((p) => p.type === 'hour')?.value ?? '';
  const minute = timeParts.find((p) => p.type === 'minute')?.value ?? '';
  const formattedTime = minute === '00' ? `${hour}h` : `${hour}h${minute}`;
  const [d, , month] = day.split(' ');
  return `${d} de ${month.charAt(0).toUpperCase()}${month.slice(1)}, ${formattedTime}`;
};

const getInitials = (name: string | null) => {
  if (!name) return '';
  const [first, second] = name.trim().split(' ');
  return `${first?.[0] ?? ''}${second?.[0] ?? ''}`.toUpperCase();
};

export const GroupDetails = () => {
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
                  <Styled.AttendanceMark
                    key={index}
                    $present={mark === 'P'}
                    aria-label={
                      mark === 'P'
                        ? locale.group_details.table.present
                        : locale.group_details.table.absent
                    }
                  >
                    <span aria-hidden="true">{mark}</span>
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
        const date = formatHistoryDate(m.date);
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
  if (!group) return <Styled.Message>{locale.group_details.loadError}</Styled.Message>;

  const meeting = group.next_meeting;

  return (
    <Styled.Container>
      <Styled.BackButton type="button" onClick={() => navigate('/grupos')}>
        <LuArrowLeft aria-hidden />
        {locale.group_details.back}
      </Styled.BackButton>

      <Styled.Header>
        <Styled.HeaderInfo>
          <Styled.Title>
            {interpolate(locale.groups.table.groupName, {
              number: String(group.number).padStart(2, '0'),
              description: group.description,
            })}
          </Styled.Title>
          <Styled.Subtitle>
            {interpolate(locale.group_details.header.subtitle, {
              city: group.city || locale.group_details.notInformed,
              count: group.active_participants_count,
            })}
          </Styled.Subtitle>
        </Styled.HeaderInfo>
        <Styled.HeaderActions>
          <Styled.EditButton size="md" variant="secondary">
            {locale.group_details.header.editGroup}
          </Styled.EditButton>
          <Styled.CloseButton
            size="md"
            variant="secondary"
            onClick={() => setIsCloseModalOpen(true)}
          >
            {group.is_active !== false ? 'Encerrar Grupo' : 'Reativar Grupo'}
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

      <Modal
        isOpen={isCloseModalOpen}
        onClose={() => setIsCloseModalOpen(false)}
        title={group.is_active !== false ? 'Encerrar grupo?' : 'Reativar grupo?'}
        description={
          group.is_active !== false
            ? 'O grupo deixará de estar ativo na operação e no calendário, mas todo o histórico de encontros, leituras e presenças será preservado.'
            : 'O grupo voltará a ficar ativo na operação e os seus encontros constarão no calendário.'
        }
        confirmText={group.is_active !== false ? 'Encerrar grupo' : 'Reativar grupo'}
        confirmDisabled={isSubmitting}
        onConfirm={() => {
          const targetStatus = group.is_active === false;
          setIsSubmitting(true);
          updateGroupStatus(groupId, targetStatus)
            .then((newStatus) => {
              setResult((prev) =>
                prev && prev.group
                  ? { ...prev, group: { ...prev.group, is_active: newStatus } }
                  : prev,
              );
              setIsCloseModalOpen(false);
            })
            .catch((err) => console.error(err))
            .finally(() => setIsSubmitting(false));
        }}
      />
    </Styled.Container>
  );
};
