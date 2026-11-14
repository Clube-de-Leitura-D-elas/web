import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ActionMenu } from '../../components/ActionMenu';
import { Breadcrumb } from '../../components/Breadcrumb';
import { DataState } from '../../components/DataState';
import {
  RemoveFromGroupModal,
  type CoordinatorCandidate,
} from '../../components/RemoveFromGroupModal';
import { Table, type TableColumn, type TableFetchPage } from '../../components/Table';
import { Toast, type ToastVariant } from '../../components/Toast';
import { interpolate, locale } from '../../locales';
import { getAllGroupParticipants, updateGroupParticipant } from '../../services/groupService';
import {
  getCities,
  getParticipantById,
  getAllParticipantGroups,
  getParticipantPresence,
  getParticipantPresenceHistory,
  getZones,
  updateParticipant,
  updateParticipantStatus,
} from '../../services/participantService';
import type {
  Participant,
  ParticipantFormValues,
  ParticipantGroup,
  ParticipantOption,
  ParticipantPresence,
  ParticipantZoneOption,
} from '../../types/participant';
import { formatEntryDate } from '../../utils/date';
import { ParticipantDetailsSkeleton } from './ParticipantDetailsSkeleton';
import { ParticipantModal } from './ParticipantModal';
import { ParticipantProfileCard } from './ParticipantProfileCard';
import { ParticipantRecentMeetings, type MeetingsState } from './ParticipantRecentMeetings';
import { ParticipantStats, type GroupsState } from './ParticipantStats';
import * as Styled from './styles';

const text = locale.participant_details;

type ToastState = {
  id: number;
  message: string;
  variant: ToastVariant;
};

type RemoveState = {
  group: ParticipantGroup;
  needsSuccessor: boolean;
  candidates: CoordinatorCandidate[];
};

const firstName = (name: string) => name.split(' ')[0];

const groupNumber = (number: number) => String(number).padStart(2, '0');

const groupColumns: TableColumn[] = [
  { key: 'number', label: text.groups.columns.name, align: 'left' },
  { key: 'status', label: text.groups.columns.status, align: 'left' },
  { key: 'city', label: text.groups.columns.city, align: 'left' },
  { key: 'entryDate', label: text.groups.columns.entryDate, align: 'left' },
  {
    key: 'actions',
    label: <Styled.VisuallyHidden>{text.groups.columns.actions}</Styled.VisuallyHidden>,
    align: 'right',
    width: '4.5rem',
    ignoreRowClick: true,
  },
];

export const ParticipantDetails = () => {
  const { participantId } = useParams<{
    participantId: string;
  }>();

  return <ParticipantProfile key={participantId} participantId={participantId} />;
};

const ParticipantProfile = ({ participantId }: { participantId?: string }) => {
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [presence, setPresence] = useState<ParticipantPresence[]>([]);
  const [loading, setLoading] = useState(Boolean(participantId));
  const [loadError, setLoadError] = useState<string | null>(participantId ? null : text.loadError);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [savingParticipant, setSavingParticipant] = useState(false);
  const [cities, setCities] = useState<ParticipantOption[]>([]);
  const [zones, setZones] = useState<ParticipantZoneOption[]>([]);
  const [optionsError, setOptionsError] = useState(false);

  const [statusError, setStatusError] = useState<string | null>(null);
  const [savingStatus, setSavingStatus] = useState(false);

  const [groupsVersion, setGroupsVersion] = useState(0);
  const [groupsState, setGroupsState] = useState<GroupsState>({ status: 'loading', groups: [] });
  const [meetingsState, setMeetingsState] = useState<MeetingsState>({
    status: 'loading',
    meetings: [],
  });

  const [removeState, setRemoveState] = useState<RemoveState | null>(null);
  const [removing, setRemoving] = useState(false);
  const [removeError, setRemoveError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const navigate = useNavigate();

  const showToast = useCallback(
    (message: string, variant: ToastVariant = 'success') =>
      setToast({ id: Date.now(), message, variant }),
    [],
  );

  useEffect(() => {
    if (!participantId) return;

    let ignore = false;

    Promise.all([getParticipantById(participantId), getParticipantPresence(participantId)])
      .then(([participantData, presenceData]) => {
        if (ignore) return;

        setParticipant(participantData);
        setPresence(presenceData);
      })
      .catch(() => {
        if (!ignore) setLoadError(text.loadError);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [participantId]);

  useEffect(() => {
    let ignore = false;

    Promise.all([getCities(), getZones()])
      .then(([citiesData, zonesData]) => {
        if (ignore) return;

        setCities(citiesData);
        setZones(zonesData);
      })
      .catch((error) => {
        console.error(error);
        if (!ignore) setOptionsError(true);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const groupsRequest = useRef<{ version: number; promise: Promise<ParticipantGroup[]> }>(null);

  const loadGroups = useCallback(() => {
    if (!participantId) return Promise.resolve([]);
    if (groupsRequest.current?.version !== groupsVersion) {
      const promise = getAllParticipantGroups(participantId);
      groupsRequest.current = { version: groupsVersion, promise };
      promise.catch(() => {
        if (groupsRequest.current?.promise === promise) groupsRequest.current = null;
      });
    }
    return groupsRequest.current.promise;
  }, [participantId, groupsVersion]);

  useEffect(() => {
    let ignore = false;

    loadGroups()
      .then((groups) => {
        if (!ignore) setGroupsState({ status: 'ready', groups });
      })
      .catch((error) => {
        console.error(error);
        if (!ignore) setGroupsState({ status: 'error', groups: [] });
      });

    return () => {
      ignore = true;
    };
  }, [loadGroups]);

  useEffect(() => {
    if (!participantId) return;

    let ignore = false;

    getParticipantPresenceHistory(participantId)
      .then((meetings) => {
        if (!ignore) setMeetingsState({ status: 'ready', meetings });
      })
      .catch((error) => {
        console.error(error);
        if (!ignore) setMeetingsState({ status: 'error', meetings: [] });
      });

    return () => {
      ignore = true;
    };
  }, [participantId]);

  const openRemove = useCallback(
    async (group: ParticipantGroup) => {
      setRemoveError(null);

      if (!group.isCoordinator) {
        setRemoveState({ group, needsSuccessor: false, candidates: [] });
        return;
      }

      try {
        const { items } = await getAllGroupParticipants(group.id);
        const coordinators = items.filter((member) => member.is_coordinator);
        setRemoveState({
          group,
          needsSuccessor: coordinators.length <= 1,
          candidates: items
            .filter((member) => member.id !== participantId && !member.is_coordinator)
            .map(({ id, name }) => ({ id, name })),
        });
      } catch (error) {
        console.error(error);
        showToast(text.groups.removeError, 'error');
      }
    },
    [participantId, showToast],
  );

  const fetchGroupsPage: TableFetchPage = useCallback(
    async ({ page, pageSize }) => {
      const request = loadGroups();
      const groups = await request;
      if (groupsRequest.current?.promise === request) {
        setGroupsState({ status: 'ready', groups });
      }
      const start = (page - 1) * pageSize;

      return {
        rows: groups.slice(start, start + pageSize).map((group) => {
          const entryDate = formatEntryDate(group.entryDate);
          const label = interpolate(text.groups.groupName, { number: groupNumber(group.number) });

          return {
            number: <Styled.GroupName>{label}</Styled.GroupName>,
            status: (
              <Styled.Pill $tone={group.isCoordinator ? 'brand' : 'neutral'}>
                {group.isCoordinator ? text.groups.roles.coordinator : text.groups.roles.member}
              </Styled.Pill>
            ),
            city: group.city ?? text.groups.emptyValue,
            entryDate: (
              <Styled.EntryDate $missing={!entryDate}>
                {entryDate || text.groups.noEntryDate}
              </Styled.EntryDate>
            ),
            actions: (
              <ActionMenu
                ariaLabel={interpolate(text.groups.actionsAriaLabel, {
                  number: groupNumber(group.number),
                })}
                items={[
                  { label: text.groups.viewGroup, onClick: () => navigate(`/grupos/${group.id}`) },
                  {
                    label: text.groups.remove,
                    variant: 'danger' as const,
                    onClick: () => openRemove(group),
                  },
                ]}
              />
            ),
            rowHref: `/grupos/${group.id}`,
          };
        }),
        total: groups.length,
      };
    },
    [loadGroups, navigate, openRemove],
  );

  const confirmRemove = async (newCoordinatorId: string | null) => {
    if (!removeState || !participant || removing) return;

    const { group, candidates } = removeState;
    setRemoving(true);
    setRemoveError(null);
    try {
      if (newCoordinatorId) await updateGroupParticipant(group.id, newCoordinatorId, 'promote');
      await updateGroupParticipant(group.id, participant.id, 'remove');
    } catch (error) {
      console.error(error);
      setRemoveError(
        error instanceof Error && error.message ? error.message : text.groups.removeError,
      );
      setGroupsVersion((version) => version + 1);
      setRemoving(false);
      return;
    }

    const successor = candidates.find((candidate) => candidate.id === newCoordinatorId);
    const values = {
      name: firstName(participant.name),
      number: groupNumber(group.number),
      coordinator: successor ? firstName(successor.name) : '',
    };
    showToast(
      interpolate(successor ? text.groups.removedWithCoordinator : text.groups.removed, values),
    );
    setGroupsVersion((version) => version + 1);
    setRemoveState(null);
    setRemoving(false);
  };

  const handleToggleActive = async () => {
    if (!participant) return;

    setSavingStatus(true);
    setStatusError(null);

    try {
      const active = await updateParticipantStatus(participant.id, !participant.active);

      setParticipant((current) => (current ? { ...current, active } : current));
      showToast(
        interpolate(active ? text.status.activated : text.status.deactivated, {
          name: firstName(participant.name),
        }),
      );
    } catch {
      setStatusError(text.updateStatusError);
    } finally {
      setSavingStatus(false);
    }
  };

  const handleOpenModal = () => {
    setUpdateError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setUpdateError(null);
    setIsModalOpen(false);
  };

  const handleUpdateParticipant = async (values: ParticipantFormValues) => {
    if (!participant) return;

    setSavingParticipant(true);
    setUpdateError(null);

    try {
      await updateParticipant(participant.id, {
        name: values.name,
        email: values.email,
        phone: values.phone,
        instagram: values.instagram || null,
        cityId: values.cityId,
        zoneId: values.zoneId,
        birthDate: values.birthDate,
        job: values.job || null,
        appRole: values.appRole,
      });

      // Deu certo: atualiza a página e só então fecha o modal.
      setParticipant((current) =>
        current
          ? {
              ...current,
              name: values.name,
              email: values.email,
              phone: values.phone || null,
              instagram: values.instagram || null,
              city: values.city,
              zone: values.zone,
              birthDate: values.birthDate,
              job: values.job || null,
              appRole: values.appRole,
            }
          : current,
      );
      setIsModalOpen(false);
    } catch (error) {
      // Deu erro: mantém o modal aberto e mostra a mensagem.
      setUpdateError(
        error instanceof Error && error.message ? error.message : text.modal.saveError,
      );
    } finally {
      setSavingParticipant(false);
    }
  };

  const isCoordinator = useMemo(
    () => groupsState.groups.some((group) => group.isCoordinator),
    [groupsState.groups],
  );

  if (loading) {
    return (
      <div role="status">
        <Styled.VisuallyHidden>{text.loading}</Styled.VisuallyHidden>
        <ParticipantDetailsSkeleton />
      </div>
    );
  }

  const breadcrumb = (
    <Breadcrumb
      ariaLabel={text.breadcrumbLabel}
      parentLabel={text.breadcrumbParticipants}
      parentTo="/participantes"
      current={participant?.name}
    />
  );

  if (loadError || !participant) {
    return (
      <Styled.Page>
        {breadcrumb}
        <DataState variant="error">{loadError ?? text.loadError}</DataState>
      </Styled.Page>
    );
  }

  const groupsCount = groupsState.status === 'ready' ? groupsState.groups.length : null;

  return (
    <Styled.Page>
      {breadcrumb}

      <Styled.Columns>
        <ParticipantProfileCard
          participant={participant}
          isCoordinator={isCoordinator}
          savingStatus={savingStatus}
          statusError={statusError}
          onToggleActive={handleToggleActive}
          onEdit={handleOpenModal}
        />

        <Styled.MainColumn>
          <ParticipantStats
            presence={presence}
            groups={groupsState}
            entryDate={participant.entryDate}
          />

          <Styled.Card aria-labelledby="participant-groups" $enter={250}>
            <Styled.CardHeader>
              <Styled.CardTitle id="participant-groups">
                {text.groups.title}
                {groupsCount !== null && <Styled.Count>{groupsCount}</Styled.Count>}
              </Styled.CardTitle>
            </Styled.CardHeader>

            {groupsCount === 0 ? (
              <Styled.EmptyState>
                <strong>
                  {interpolate(text.groups.empty, { name: firstName(participant.name) })}
                </strong>
                <span>{text.groups.emptyHint}</span>
              </Styled.EmptyState>
            ) : (
              <Styled.TableArea>
                <Table
                  columns={groupColumns}
                  fetchPage={fetchGroupsPage}
                  pageSize={5}
                  itemLabel={text.groups.itemLabel}
                />
              </Styled.TableArea>
            )}
          </Styled.Card>

          <ParticipantRecentMeetings state={meetingsState} />
        </Styled.MainColumn>
      </Styled.Columns>

      <ParticipantModal
        isOpen={isModalOpen}
        participant={participant}
        cities={cities}
        zones={zones}
        onClose={handleCloseModal}
        onConfirm={handleUpdateParticipant}
        saving={savingParticipant}
        error={updateError ?? (optionsError ? text.modal.optionsError : null)}
      />

      <RemoveFromGroupModal
        isOpen={removeState !== null}
        personName={participant.name}
        groupLabel={interpolate(text.groups.groupName, {
          number: groupNumber(removeState?.group.number ?? 0),
        })}
        isCoordinator={removeState?.needsSuccessor ?? false}
        candidates={removeState?.candidates}
        saving={removing}
        error={removeError}
        onClose={() => setRemoveState(null)}
        onConfirm={confirmRemove}
      />

      {toast && (
        <Toast key={toast.id} variant={toast.variant} onDismiss={() => setToast(null)}>
          {toast.message}
        </Toast>
      )}
    </Styled.Page>
  );
};
