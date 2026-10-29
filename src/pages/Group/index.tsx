import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'react-router';
import { LuCalendar, LuMapPin, LuStar, LuUserRound } from 'react-icons/lu';
import { BackButton } from '../../components/BackButton';
import { ActionMenu } from '../../components/ActionMenu';
import * as Styled from './styles';
import { GroupModal } from './GroupModal';
import { Modal } from '../../components/Modal';
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
  getGroupCities,
  getGroupDetails,
  getGroupMeetingsPage,
  getGroupParticipantsPage,
  getGroupZones,
  updateGroupLocation,
  updateGroupStatus,
  updateGroupParticipant,
} from '../../services/groupService';
import type {
  GroupDetails as GroupDetailsData,
  GroupFormValues,
  GroupMeetingHistoryItem,
  GroupOption,
  GroupZoneOption,
  GroupParticipantListItem,
} from '../../types/group';

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

export const GroupDetails = () => {
  const locale = useLocale();
  const { groupId = '' } = useParams<{ groupId: string }>();

  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<GroupDetailsTab>('participants');
  const [participantsVersion, setParticipantsVersion] = useState(0);
  const [selectedParticipant, setSelectedParticipant] = useState<GroupParticipantListItem | null>(
    null,
  );
  const [participantAction, setParticipantAction] = useState<'promote' | 'remove' | null>(null);
  const [savingParticipant, setSavingParticipant] = useState(false);
  const [participantError, setParticipantError] = useState<string | null>(null);
  const [result, setResult] = useState<{ id: string; group: GroupDetailsData | null } | null>(null);

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [savingLocation, setSavingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [cities, setCities] = useState<GroupOption[]>([]);
  const [zones, setZones] = useState<GroupZoneOption[]>([]);
  const [optionsError, setOptionsError] = useState(false);

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

  useEffect(() => {
    let ignore = false;

    Promise.all([getGroupCities(), getGroupZones()])
      .then(([citiesData, zonesData]) => {
        if (ignore) return;

        setCities(citiesData);
        setZones(zonesData);
      })
      .catch((err) => {
        console.error(err);
        if (!ignore) setOptionsError(true);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const loading = result?.id !== groupId;
  const group = result?.group ?? null;

  const handleOpenModal = () => {
    setStatusError(null);
    setIsCloseModalOpen(true);
  };

  const handleOpenLocationModal = () => {
    setLocationError(null);
    setIsLocationModalOpen(true);
  };

  const handleCloseLocationModal = () => {
    // Com um envio em andamento não dá para cancelar; evita perder o resultado/erro.
    if (savingLocation) return;

    setLocationError(null);
    setIsLocationModalOpen(false);
  };

  const handleUpdateLocation = async (values: GroupFormValues) => {
    if (!group || savingLocation) return;

    setSavingLocation(true);
    setLocationError(null);

    try {
      await updateGroupLocation(groupId, values);

      // Deu certo: atualiza a página e só então fecha o modal.
      const city = cities.find((option) => option.id === values.city_id);
      const zone = zones.find((option) => option.id === values.zone_id);

      setResult((prev) =>
        prev && prev.group
          ? {
              ...prev,
              group: {
                ...prev.group,
                description: values.description,
                city: city?.name ?? prev.group.city,
                zone: zone?.name ?? null,
              },
            }
          : prev,
      );
      setIsLocationModalOpen(false);
    } catch (err) {
      // Deu erro: mantém o modal aberto e mostra a mensagem.
      console.error(err);
      setLocationError(
        err instanceof Error && err.message ? err.message : locale.group_details.modal.modalError,
      );
    } finally {
      setSavingLocation(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!group || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setStatusError(null);

      const targetStatus = !isActive;
      const updatedStatus = await updateGroupStatus(groupId, targetStatus);
      setResult((prev) =>
        prev && prev.group ? { ...prev, group: { ...prev.group, is_active: updatedStatus } } : prev,
      );
      setIsCloseModalOpen(false);
    } catch (err) {
      console.error(err);
      setStatusError(locale.group_details.updateStatusError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmParticipantAction = async () => {
    if (!selectedParticipant || !participantAction || savingParticipant) return;
    setSavingParticipant(true);
    setParticipantError(null);
    try {
      await updateGroupParticipant(groupId, selectedParticipant.id, participantAction);
      const updatedGroup = await getGroupDetails(groupId);
      setResult({ id: groupId, group: updatedGroup });
      setParticipantsVersion((version) => version + 1);
      setSelectedParticipant(null);
      setParticipantAction(null);
    } catch (err) {
      console.error(err);
      setParticipantError(locale.group_details.participantActions.error);
    } finally {
      setSavingParticipant(false);
    }
  };

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
        ignoreRowClick: true,
      },
    ],
    [locale],
  );

  const fetchParticipants = useCallback(
    async (request: TablePageRequest): Promise<TablePage> => {
      void participantsVersion;
      const { items, total } = await getGroupParticipantsPage(groupId, request);

      const rows = items.map((p: GroupParticipantListItem) => ({
        name: (
          <Styled.NameCell>
            <Styled.ParticipantName>{p.name}</Styled.ParticipantName>
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
          <ActionMenu
            ariaLabel={interpolate(locale.group_details.table.actionsAriaLabel, {
              name: p.name,
            })}
            items={[
              ...(!p.is_coordinator
                ? [
                    {
                      label: locale.group_details.participantActions.promote,
                      onClick: () => {
                        setSelectedParticipant(p);
                        setParticipantAction('promote');
                        setParticipantError(null);
                      },
                    },
                  ]
                : []),
              {
                label: locale.group_details.participantActions.remove,
                variant: 'danger' as const,
                onClick: () => {
                  setSelectedParticipant(p);
                  setParticipantAction('remove');
                  setParticipantError(null);
                },
              },
            ]}
          />
        ),
        rowHref: `/participantes/${p.id}`,
      }));

      return { rows, total };
    },
    [groupId, locale, participantsVersion],
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
        ignoreRowClick: true,
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
          date: date,
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
          rowHref: `/eventos/${m.id}`,
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
  const isActive = group.is_active;
  const groupName = interpolate(locale.group_details.header.tittle, {
    number: String(group.number).padStart(2, '0'),
    description: group.description,
  });

  return (
    <Styled.Container>
      <BackButton label={locale.group_details.back} />

      <Styled.Header>
        <Styled.HeaderInfo>
          <Styled.Title>{groupName}</Styled.Title>
          <Styled.Subtitle>
            {interpolate(locale.group_details.header.subtitle, {
              city: group.city || locale.group_details.notInformed,
              count: group.active_participants_count,
            })}
          </Styled.Subtitle>
        </Styled.HeaderInfo>
        <Styled.HeaderActions>
          <Styled.EditButton size="md" variant="secondary" onClick={handleOpenLocationModal}>
            {locale.group_details.header.editLocation}
          </Styled.EditButton>
          <Styled.CloseButton size="md" variant="secondary" onClick={handleOpenModal}>
            {isActive
              ? locale.group_details.header.closeGroup
              : locale.group_details.header.reopenGroup}
          </Styled.CloseButton>
        </Styled.HeaderActions>
      </Styled.Header>

      <Styled.CardsRow>
        <Styled.Card>
          <Styled.CardLabel>{locale.group_details.coordinator.label}</Styled.CardLabel>
          <Styled.CoordinatorRow>
            <Styled.Avatar aria-hidden>
              {group.coordinator_photo ? (
                <img src={group.coordinator_photo} alt="" />
              ) : (
                <LuUserRound />
              )}
            </Styled.Avatar>
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
        isOpen={participantAction !== null && selectedParticipant !== null}
        onClose={() => {
          if (savingParticipant) return;
          setParticipantAction(null);
          setParticipantError(null);
          setSelectedParticipant(null);
        }}
        title={
          participantAction === 'remove'
            ? locale.group_details.participantActions.removeTitle
            : locale.group_details.participantActions.promoteTitle
        }
        description={interpolate(
          participantAction === 'remove'
            ? locale.group_details.participantActions.removeDescription
            : locale.group_details.participantActions.promoteDescription,
          { name: selectedParticipant?.name ?? '' },
        )}
        confirmText={
          participantAction === 'remove'
            ? locale.group_details.participantActions.remove
            : locale.group_details.participantActions.promote
        }
        confirmDisabled={savingParticipant}
        onConfirm={confirmParticipantAction}
      >
        {participantError && <p role="alert">{participantError}</p>}
      </Modal>

      <GroupModal
        isOpen={isLocationModalOpen}
        group={group}
        groupName={groupName}
        cities={cities}
        zones={zones}
        onClose={handleCloseLocationModal}
        onConfirm={handleUpdateLocation}
        saving={savingLocation}
        error={locationError ?? (optionsError ? locale.group_details.modal.optionsError : null)}
      />

      <Modal
        isOpen={isCloseModalOpen}
        onClose={() => {
          if (!isSubmitting) setIsCloseModalOpen(false);
        }}
        title={
          isActive
            ? locale.group_details.statusModal.closeTitle
            : locale.group_details.statusModal.reopenTitle
        }
        description={
          isActive
            ? locale.group_details.statusModal.closeDescription
            : locale.group_details.statusModal.reopenDescription
        }
        confirmText={
          isActive
            ? locale.group_details.statusModal.closeConfirm
            : locale.group_details.statusModal.reopenConfirm
        }
        confirmDisabled={isSubmitting}
        onConfirm={handleToggleStatus}
      >
        {statusError && <p style={{ color: 'red', marginTop: '0.5rem' }}>{statusError}</p>}
      </Modal>
    </Styled.Container>
  );
};
