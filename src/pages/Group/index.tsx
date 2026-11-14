import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { LuStar } from 'react-icons/lu';
import { ActionMenu } from '../../components/ActionMenu';
import { Avatar } from '../../components/Avatar';
import { Breadcrumb } from '../../components/Breadcrumb';
import { DataState } from '../../components/DataState';
import { Modal } from '../../components/Modal';
import {
  RemoveFromGroupModal,
  type CoordinatorCandidate,
} from '../../components/RemoveFromGroupModal';
import { Tag } from '../../components/Tag';
import { Tabs } from '../../components/Tab';
import {
  Table,
  type TableColumn,
  type TablePage,
  type TablePageRequest,
} from '../../components/Table';
import { Toast, type ToastVariant } from '../../components/Toast';
import { useLocale } from '../../hooks/useLocale';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { MOBILE_QUERY } from '../../layouts/DefaultLayout/styles';
import { interpolate, pluralize } from '../../locales';
import {
  getAllGroupParticipants,
  getGroupCities,
  getGroupDetails,
  getGroupMeetingsPage,
  getGroupZones,
  updateGroupLocation,
  updateGroupParticipant,
  updateGroupStatus,
} from '../../services/groupService';
import type {
  GroupDetails as GroupDetailsData,
  GroupFormValues,
  GroupMeetingHistoryItem,
  GroupOption,
  GroupParticipantListItem,
  GroupZoneOption,
} from '../../types/group';
import type { Page } from '../../types/participantList';
import { formatEntryDate, formatShortDate, formatWeekdayTime } from '../../utils/date';
import { formatRating, getFirstName } from '../../utils/format';
import { getAttendance, isIncomplete } from './attendance';
import { GroupDetailsSkeleton } from './GroupDetailsSkeleton';
import { GroupHeader } from './GroupHeader';
import { GroupModal } from './GroupModal';
import { GroupStats, type AsyncList } from './GroupStats';
import { GroupSummary } from './GroupSummary';
import * as Styled from './styles';

type GroupDetailsTab = 'participants' | 'history';

type ToastState = {
  id: number;
  message: string;
  variant: ToastVariant;
  undo?: () => void;
};

const STATS_MEETINGS_PAGE = { page: 1, pageSize: 100 };

const LOADING_LIST: AsyncList<never> = { status: 'loading', items: [], total: 0 };

const errorMessage = (err: unknown, fallback: string) =>
  err instanceof Error && err.message ? err.message : fallback;

export const GroupDetails = () => {
  const locale = useLocale();
  const text = locale.group_details;
  const { groupId = '' } = useParams<{ groupId: string }>();

  const [result, setResult] = useState<{ id: string; group: GroupDetailsData | null } | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [activeTab, setActiveTab] = useState<GroupDetailsTab>('participants');
  const [participantsVersion, setParticipantsVersion] = useState(0);
  const [membersState, setMembersState] = useState<{
    key: string;
    list: AsyncList<GroupParticipantListItem>;
  } | null>(null);
  const [meetingsState, setMeetingsState] = useState<{
    key: string;
    list: AsyncList<GroupMeetingHistoryItem>;
  } | null>(null);

  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [savingLocation, setSavingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [cities, setCities] = useState<GroupOption[]>([]);
  const [zones, setZones] = useState<GroupZoneOption[]>([]);
  const [optionsError, setOptionsError] = useState(false);

  const [removal, setRemoval] = useState<{
    groupId: string;
    participant: GroupParticipantListItem;
    candidates: CoordinatorCandidate[];
  } | null>(null);
  const [removing, setRemoving] = useState(false);
  const [removeError, setRemoveError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const isMobile = useMediaQuery(MOBILE_QUERY);
  const navigate = useNavigate();

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
  }, [groupId, loadAttempt]);

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

  const membersRequest = useRef<{ key: string; promise: Promise<Page<GroupParticipantListItem>> }>(
    null,
  );

  const loadMembers = useCallback(() => {
    const key = `${groupId}:${participantsVersion}`;
    if (membersRequest.current?.key !== key) {
      const promise = getAllGroupParticipants(groupId);
      membersRequest.current = { key, promise };
      promise.catch(() => {
        if (membersRequest.current?.promise === promise) membersRequest.current = null;
      });
    }
    return membersRequest.current.promise;
  }, [groupId, participantsVersion]);

  useEffect(() => {
    let ignore = false;

    loadMembers()
      .then(({ items, total }) => {
        if (!ignore) setMembersState({ key: groupId, list: { status: 'ready', items, total } });
      })
      .catch((err) => {
        console.error(err);
        if (!ignore) {
          setMembersState({ key: groupId, list: { status: 'error', items: [], total: 0 } });
        }
      });

    return () => {
      ignore = true;
    };
  }, [groupId, loadMembers]);

  const meetingsRequest = useRef<{
    key: string;
    promise: Promise<Page<GroupMeetingHistoryItem>>;
  }>(null);

  const loadMeetings = useCallback(() => {
    if (meetingsRequest.current?.key !== groupId) {
      const promise = getGroupMeetingsPage(groupId, STATS_MEETINGS_PAGE);
      meetingsRequest.current = { key: groupId, promise };
      promise.catch(() => {
        if (meetingsRequest.current?.promise === promise) meetingsRequest.current = null;
      });
    }
    return meetingsRequest.current.promise;
  }, [groupId]);

  useEffect(() => {
    let ignore = false;

    loadMeetings()
      .then(({ items, total }) => {
        if (!ignore) setMeetingsState({ key: groupId, list: { status: 'ready', items, total } });
      })
      .catch((err) => {
        console.error(err);
        if (!ignore) {
          setMeetingsState({ key: groupId, list: { status: 'error', items: [], total: 0 } });
        }
      });

    return () => {
      ignore = true;
    };
  }, [groupId, loadMeetings]);

  const loading = result?.id !== groupId;
  const group = result?.group ?? null;
  const isLastCoordinator = group?.coordinators.length === 1;
  const members = membersState?.key === groupId ? membersState.list : LOADING_LIST;
  const meetings = meetingsState?.key === groupId ? meetingsState.list : LOADING_LIST;

  const showToast = useCallback(
    (next: Omit<ToastState, 'id' | 'variant'> & { variant?: ToastVariant }) =>
      setToast({ variant: 'success', ...next, id: Date.now() }),
    [],
  );

  const handleRetry = () => {
    setResult(null);
    setLoadAttempt((attempt) => attempt + 1);
  };

  const refreshGroup = useCallback(async () => {
    try {
      const updatedGroup = await getGroupDetails(groupId);
      setResult((prev) => (prev?.id === groupId ? { id: groupId, group: updatedGroup } : prev));
    } catch (err) {
      console.error(err);
    } finally {
      setParticipantsVersion((version) => version + 1);
    }
  }, [groupId]);

  const applyCoordinatorChange = useCallback(
    async (participantId: string, action: 'promote' | 'demote'): Promise<string | null> => {
      try {
        await updateGroupParticipant(groupId, participantId, action);
        return null;
      } catch (err) {
        console.error(err);
        return errorMessage(err, text.participantActions.error);
      } finally {
        await refreshGroup();
      }
    },
    [groupId, refreshGroup, text],
  );

  const changeCoordinator = useCallback(
    async (participant: GroupParticipantListItem, action: 'promote' | 'demote') => {
      const failure = await applyCoordinatorChange(participant.id, action);
      if (failure) {
        showToast({ variant: 'error', message: failure });
        return;
      }

      const inverse = action === 'promote' ? 'demote' : 'promote';
      showToast({
        message: interpolate(
          action === 'promote' ? text.participantActions.promoted : text.participantActions.demoted,
          { name: getFirstName(participant.name) },
        ),
        undo: async () => {
          const undoFailure = await applyCoordinatorChange(participant.id, inverse);
          showToast(
            undoFailure
              ? { variant: 'error', message: undoFailure }
              : { message: text.participantActions.undone },
          );
        },
      });
    },
    [applyCoordinatorChange, showToast, text],
  );

  const openRemove = useCallback(
    async (participant: GroupParticipantListItem) => {
      setRemoveError(null);
      try {
        const { items } = await loadMembers();
        setRemoval({
          groupId,
          participant,
          candidates: items
            .filter((member) => member.id !== participant.id && !member.is_coordinator)
            .map(({ id, name }) => ({ id, name })),
        });
      } catch (err) {
        console.error(err);
        showToast({ variant: 'error', message: text.participantActions.error });
      }
    },
    [groupId, loadMembers, showToast, text],
  );

  const removeTarget = removal?.groupId === groupId ? removal.participant : null;
  const removeCandidates = removal?.groupId === groupId ? removal.candidates : [];

  const removeNeedsSuccessor =
    removeTarget !== null &&
    isLastCoordinator === true &&
    group?.coordinators[0]?.id === removeTarget.id;

  const confirmRemove = async (newCoordinatorId: string | null) => {
    if (!removeTarget || removing) return;

    setRemoving(true);
    setRemoveError(null);
    let promoted = false;
    try {
      if (newCoordinatorId) {
        await updateGroupParticipant(groupId, newCoordinatorId, 'promote');
        promoted = true;
      }
      await updateGroupParticipant(groupId, removeTarget.id, 'remove');
    } catch (err) {
      console.error(err);
      let rolledBack = true;
      if (promoted && newCoordinatorId) {
        await updateGroupParticipant(groupId, newCoordinatorId, 'demote').catch((rollbackErr) => {
          console.error(rollbackErr);
          rolledBack = false;
        });
      }
      const successor = removeCandidates.find((candidate) => candidate.id === newCoordinatorId);
      setRemoveError(
        rolledBack || !successor
          ? errorMessage(err, text.participantActions.error)
          : interpolate(text.participantActions.rollbackError, {
              name: getFirstName(removeTarget.name),
              coordinator: getFirstName(successor.name),
            }),
      );
      await refreshGroup();
      setRemoving(false);
      return;
    }

    await refreshGroup();
    const successor = removeCandidates.find((candidate) => candidate.id === newCoordinatorId);
    showToast({
      message: successor
        ? interpolate(text.participantActions.removedWithCoordinator, {
            name: getFirstName(removeTarget.name),
            coordinator: getFirstName(successor.name),
          })
        : interpolate(text.participantActions.removed, { name: getFirstName(removeTarget.name) }),
    });
    setRemoval(null);
    setRemoving(false);
  };

  const handleOpenStatusModal = () => {
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
      setLocationError(errorMessage(err, text.modal.modalError));
    } finally {
      setSavingLocation(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!group || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setStatusError(null);

      const updatedStatus = await updateGroupStatus(groupId, !group.is_active);
      setResult((prev) =>
        prev && prev.group ? { ...prev, group: { ...prev.group, is_active: updatedStatus } } : prev,
      );
      setIsCloseModalOpen(false);
    } catch (err) {
      console.error(err);
      setStatusError(text.updateStatusError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const participantColumns: TableColumn[] = useMemo(
    () => [
      {
        key: 'participant',
        label: text.table.columns.participant,
        align: 'left',
        width: '42%',
      },
      { key: 'entryDate', label: text.table.columns.entryDate, align: 'left', width: '18%' },
      { key: 'attendance', label: text.table.columns.attendance, align: 'left' },
      {
        key: 'actions',
        label: <Styled.VisuallyHidden>{text.table.columns.actions}</Styled.VisuallyHidden>,
        align: 'right',
        width: '4.5rem',
        ignoreRowClick: true,
      },
    ],
    [text],
  );

  const fetchParticipants = useCallback(
    async ({ page, pageSize }: TablePageRequest): Promise<TablePage> => {
      const request = loadMembers();
      const { items, total } = await request;
      if (membersRequest.current?.promise === request) {
        setMembersState({ key: groupId, list: { status: 'ready', items, total } });
      }
      const table = text.table;
      const actions = text.participantActions;
      const sorted = [...items].sort((a, b) => Number(b.is_coordinator) - Number(a.is_coordinator));
      const start = (page - 1) * pageSize;

      const rows = sorted.slice(start, start + pageSize).map((p) => {
        const attendance = getAttendance(p.attendance);
        const entryDate = formatEntryDate(p.entry_date);
        const lockedCoordinator = p.is_coordinator && isLastCoordinator;

        return {
          participant: (
            <Styled.ParticipantCell>
              <Avatar name={p.name} />
              <Styled.ParticipantInfo>
                <Styled.NameRow>
                  <Styled.Name>{p.name}</Styled.Name>
                  {p.is_coordinator && <Tag color="primary">{table.coordinatorTag}</Tag>}
                  {isIncomplete(p) && <Tag color="warning">{table.incompleteTag}</Tag>}
                </Styled.NameRow>
                <Styled.Email $missing={!p.email}>{p.email || table.noEmail}</Styled.Email>
              </Styled.ParticipantInfo>
            </Styled.ParticipantCell>
          ),
          entryDate: (
            <Styled.EntryDate $missing={!entryDate}>
              {entryDate || table.noEntryDate}
            </Styled.EntryDate>
          ),
          attendance:
            attendance.total > 0 ? (
              <Styled.Attendance>
                <Styled.Dots
                  role="img"
                  aria-label={interpolate(table.attendanceAria, {
                    present: attendance.present,
                    total: attendance.total,
                  })}
                >
                  {p.attendance.map((mark, index) => (
                    <Styled.Dot key={index} $present={mark === 'P'} $index={index} />
                  ))}
                </Styled.Dots>
                <Styled.Percent $low={attendance.low}>{attendance.percent}%</Styled.Percent>
                {attendance.low && <Tag color="warning">{table.lowTag}</Tag>}
              </Styled.Attendance>
            ) : (
              <Styled.Muted>{table.noAttendance}</Styled.Muted>
            ),
          actions: (
            <ActionMenu
              ariaLabel={interpolate(table.actionsAriaLabel, { name: p.name })}
              items={[
                {
                  label: actions.viewProfile,
                  onClick: () => navigate(`/participantes/${p.id}`),
                },
                {
                  label: p.is_coordinator ? actions.demote : actions.promote,
                  disabled: lockedCoordinator,
                  hint: lockedCoordinator ? actions.lastCoordinatorHint : undefined,
                  onClick: () => changeCoordinator(p, p.is_coordinator ? 'demote' : 'promote'),
                },
                {
                  label: actions.remove,
                  variant: 'danger' as const,
                  onClick: () => openRemove(p),
                },
              ]}
            />
          ),
          rowHref: `/participantes/${p.id}`,
        };
      });

      return { rows, total: sorted.length };
    },
    [groupId, loadMembers, text, isLastCoordinator, navigate, changeCoordinator, openRemove],
  );

  const meetingColumns: TableColumn[] = useMemo(
    () => [
      { key: 'date', label: text.history.columns.date, align: 'left', width: '17%' },
      { key: 'book', label: text.history.columns.book, align: 'left', width: '27%' },
      { key: 'place', label: text.history.columns.place, align: 'left', width: '20%' },
      { key: 'attendance', label: text.history.columns.attendance, align: 'left', width: '18%' },
      { key: 'rating', label: text.history.columns.rating, align: 'left' },
    ],
    [text],
  );

  const fetchMeetings = useCallback(
    async (request: TablePageRequest): Promise<TablePage> => {
      const statsRequest = loadMeetings();
      const loaded = await statsRequest;
      if (meetingsRequest.current?.promise === statsRequest) {
        setMeetingsState({
          key: groupId,
          list: { status: 'ready', items: loaded.items, total: loaded.total },
        });
      }
      const start = (request.page - 1) * request.pageSize;
      const end = start + request.pageSize;
      const { items, total } =
        end <= loaded.items.length || loaded.items.length >= loaded.total
          ? { items: loaded.items.slice(start, end), total: loaded.total }
          : await getGroupMeetingsPage(groupId, request);
      const history = text.history;

      const rows = items.map((m: GroupMeetingHistoryItem) => {
        const percent =
          m.attendance_total > 0
            ? Math.round((m.attendance_present / m.attendance_total) * 100)
            : 0;

        return {
          date: (
            <Styled.Stacked>
              <Styled.Strong>{formatShortDate(m.date)}</Styled.Strong>
              <Styled.Muted>{formatWeekdayTime(m.date)}</Styled.Muted>
            </Styled.Stacked>
          ),
          book: (
            <Styled.Stacked>
              <Styled.Strong>{m.book_title}</Styled.Strong>
              <Styled.Muted>{m.book_author}</Styled.Muted>
            </Styled.Stacked>
          ),
          place: (
            <Styled.Stacked>
              <Styled.Strong $weight={600}>{m.place || text.notInformed}</Styled.Strong>
              {m.neighborhood && <Styled.Muted>{m.neighborhood}</Styled.Muted>}
            </Styled.Stacked>
          ),
          attendance: (
            <Styled.MeterRow>
              <Styled.Bar aria-hidden="true">
                <Styled.BarFill $percent={percent} />
              </Styled.Bar>
              <Styled.Strong>
                {interpolate(history.attendance, {
                  present: m.attendance_present,
                  total: m.attendance_total,
                })}
              </Styled.Strong>
            </Styled.MeterRow>
          ),
          rating:
            m.average_rating === null ? (
              <Styled.Muted>{history.noRating}</Styled.Muted>
            ) : (
              <Styled.Rating>
                <LuStar aria-hidden />
                {formatRating(m.average_rating)}
                <Styled.Muted>{pluralize(history.votes, m.votes_count)}</Styled.Muted>
              </Styled.Rating>
            ),
          rowHref: `/eventos/${m.id}`,
        };
      });

      return { rows, total };
    },
    [groupId, text, loadMeetings],
  );

  const tabsConfig = useMemo(
    () => [
      {
        value: 'participants',
        label: text.tabs.participants,
        count: members.status === 'ready' ? members.total : undefined,
        children: (
          <Styled.TabContent>
            <Table
              columns={participantColumns}
              fetchPage={fetchParticipants}
              pageSize={8}
              itemLabel={text.table.itemLabel}
            />
            <Styled.Legend aria-hidden="true">
              <span>
                <Styled.Dot $present />
                {text.table.legendPresent}
              </span>
              <span>
                <Styled.Dot $present={false} />
                {text.table.legendAbsent}
              </span>
            </Styled.Legend>
          </Styled.TabContent>
        ),
      },
      {
        value: 'history',
        label: text.tabs.history,
        count: meetings.status === 'ready' ? meetings.total : undefined,
        children: (
          <Styled.TabContent>
            <Table
              columns={meetingColumns}
              fetchPage={fetchMeetings}
              pageSize={6}
              itemLabel={text.history.itemLabel}
            />
          </Styled.TabContent>
        ),
      },
    ],
    [
      text,
      members.status,
      members.total,
      meetings.status,
      meetings.total,
      participantColumns,
      fetchParticipants,
      meetingColumns,
      fetchMeetings,
    ],
  );

  const breadcrumb = (current: string | null) => (
    <Breadcrumb
      ariaLabel={text.breadcrumbLabel}
      parentLabel={text.breadcrumbGroups}
      parentTo="/grupos"
      current={current}
    />
  );

  if (loading) {
    return (
      <div role="status">
        <Styled.VisuallyHidden>{text.loading}</Styled.VisuallyHidden>
        <GroupDetailsSkeleton />
      </div>
    );
  }

  if (!group) {
    return (
      <Styled.Container>
        {breadcrumb(null)}
        <DataState variant="error" onRetry={handleRetry}>
          {text.loadError}
        </DataState>
      </Styled.Container>
    );
  }

  const isActive = group.is_active;
  const number = String(group.number).padStart(2, '0');
  const groupName = interpolate(text.header.tittle, { number, description: group.description });

  return (
    <Styled.Container>
      {breadcrumb(interpolate(text.breadcrumbCurrent, { number }))}

      <GroupHeader
        group={group}
        groupName={groupName}
        onEditLocation={handleOpenLocationModal}
        onToggleStatus={handleOpenStatusModal}
      />

      <GroupSummary group={group} />

      <GroupStats
        activeCount={group.active_participants_count}
        members={members}
        meetings={meetings}
      />

      <Styled.TabsCard $enter={320}>
        <Tabs
          tabs={tabsConfig}
          active={activeTab}
          onChange={(value) => setActiveTab(value as GroupDetailsTab)}
          size={isMobile ? 'md' : 'lg'}
        />
      </Styled.TabsCard>

      <RemoveFromGroupModal
        isOpen={removeTarget !== null}
        personName={removeTarget?.name ?? ''}
        groupLabel={interpolate(text.breadcrumbCurrent, { number })}
        isCoordinator={removeNeedsSuccessor}
        candidates={removeCandidates}
        saving={removing}
        error={removeError}
        onClose={() => setRemoval(null)}
        onConfirm={confirmRemove}
      />

      <GroupModal
        isOpen={isLocationModalOpen}
        group={group}
        groupName={groupName}
        cities={cities}
        zones={zones}
        onClose={handleCloseLocationModal}
        onConfirm={handleUpdateLocation}
        saving={savingLocation}
        error={locationError ?? (optionsError ? text.modal.optionsError : null)}
      />

      <Modal
        isOpen={isCloseModalOpen}
        onClose={() => {
          if (!isSubmitting) setIsCloseModalOpen(false);
        }}
        title={isActive ? text.statusModal.closeTitle : text.statusModal.reopenTitle}
        description={
          isActive ? text.statusModal.closeDescription : text.statusModal.reopenDescription
        }
        confirmText={isActive ? text.statusModal.closeConfirm : text.statusModal.reopenConfirm}
        confirmDisabled={isSubmitting}
        onConfirm={handleToggleStatus}
      >
        {statusError && <Styled.FormError role="alert">{statusError}</Styled.FormError>}
      </Modal>

      {toast && (
        <Toast
          key={toast.id}
          variant={toast.variant}
          onDismiss={() => setToast(null)}
          actionLabel={toast.undo ? text.participantActions.undo : undefined}
          onAction={
            toast.undo
              ? () => {
                  const undo = toast.undo;
                  setToast(null);
                  undo?.();
                }
              : undefined
          }
        >
          {toast.message}
        </Toast>
      )}
    </Styled.Container>
  );
};
