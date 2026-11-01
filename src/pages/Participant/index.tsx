import { useCallback, useEffect, useState } from 'react';
import { BackButton } from '../../components/BackButton';
import { useParams, useLocation, useNavigate } from 'react-router';
import { Table, type TableColumn, type TableFetchPage } from '../../components/Table';
import { Tag } from '../../components/Tag';
import { locale } from '../../locales';
import { formatEntryDate } from '../../utils/date';
import { Skeleton } from '../../components/Skeleton';
import {
  getCities,
  getParticipantById,
  getParticipantGroups,
  getParticipantPresence,
  getZones,
  updateParticipant,
  updateParticipantStatus,
} from '../../services/participantService';
import type {
  Participant,
  ParticipantFormValues,
  ParticipantOption,
  ParticipantPresence,
  ParticipantZoneOption,
} from '../../types/participant';

import { ParticipantContacts } from './ParticipantContacts';
import { ParticipantInfoGrid } from './ParticipantInfoGrid';
import { ParticipantModal } from './ParticipantModal';
import { ParticipantSummary } from './ParticipantSummary';
import * as Styled from './styles';

const columns: TableColumn[] = [
  {
    key: 'number',
    label: locale.participant_details.groups.columns.name,
    align: 'left',
  },
  {
    key: 'status',
    label: locale.participant_details.groups.columns.status,
    align: 'center',
  },
  {
    key: 'entryDate',
    label: locale.participant_details.groups.columns.entryDate,
    align: 'center',
  },
  {
    key: 'city',
    label: locale.participant_details.groups.columns.city,
    align: 'left',
  },
];

const ParticipantDetailsSkeleton = () => {
  return (
    <Styled.Card>
      {/* Perfil e contatos */}
      <Styled.ProfileHeader>
        <Styled.SkeletonProfile>
          {/* Foto */}
          <Skeleton width="4.5rem" height="4.5rem" variant="circular" />

          {/* Nome, status e botões */}
          <Styled.SkeletonProfileInfo>
            <Skeleton width="12rem" height="1.5rem" />

            <Styled.SkeletonStatus>
              <Skeleton width="5rem" height="1.75rem" />
              <Skeleton width="7rem" height="2rem" />
              <Skeleton width="6rem" height="2rem" />
            </Styled.SkeletonStatus>
          </Styled.SkeletonProfileInfo>
        </Styled.SkeletonProfile>

        {/* Contatos */}
        <Styled.SkeletonContacts>
          <Skeleton width="14rem" height="1rem" />
          <Skeleton width="10rem" height="1rem" />
          <Skeleton width="12rem" height="1rem" />
        </Styled.SkeletonContacts>
      </Styled.ProfileHeader>

      {/* Tabela de grupos */}
      <Styled.TableArea>
        <Styled.SkeletonTable>
          {Array.from({ length: 5 }).map((_, index) => (
            <Styled.SkeletonTableRow key={index}>
              <Skeleton width="25%" height="1rem" />
              <Skeleton width="15%" height="1rem" />
              <Skeleton width="20%" height="1rem" />
              <Skeleton width="15%" height="1rem" />
            </Styled.SkeletonTableRow>
          ))}
        </Styled.SkeletonTable>
      </Styled.TableArea>

      {/* Informações adicionais */}
      <Styled.SkeletonDetails>
        {Array.from({ length: 6 }).map((_, index) => (
          <Styled.SkeletonDetail key={index}>
            <Skeleton width="6rem" height="0.875rem" />
            <Skeleton width="8rem" height="1.25rem" />
          </Styled.SkeletonDetail>
        ))}
      </Styled.SkeletonDetails>
    </Styled.Card>
  );
};

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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [updateError, setUpdateError] = useState<string | null>(null);
  const [savingParticipant, setSavingParticipant] = useState(false);

  const [cities, setCities] = useState<ParticipantOption[]>([]);
  const [zones, setZones] = useState<ParticipantZoneOption[]>([]);
  const [optionsError, setOptionsError] = useState(false);

  const [loadError, setLoadError] = useState<string | null>(
    participantId ? null : locale.participant_details.loadError,
  );

  const [statusError, setStatusError] = useState<string | null>(null);

  const [savingStatus, setSavingStatus] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const handleBack = () => {
    if (location.key === 'default') navigate('/participantes');
    else navigate(-1);
  };

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
        if (!ignore) {
          setLoadError(locale.participant_details.loadError);
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
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

  const fetchGroupsPage: TableFetchPage = useCallback(
    async ({ page, pageSize }) => {
      if (!participantId) {
        return {
          rows: [],
          total: 0,
        };
      }

      const result = await getParticipantGroups(participantId, page, pageSize);

      return {
        rows: result.groups.map((group) => ({
          number: <Styled.GroupNumber>{group.number}</Styled.GroupNumber>,

          status: (
            <Tag color={group.isCoordinator ? 'primary' : 'neutral'}>
              {group.isCoordinator
                ? locale.participant_details.groups.roles.coordinator
                : locale.participant_details.groups.roles.member}
            </Tag>
          ),

          entryDate:
            formatEntryDate(group.entryDate) || locale.participant_details.groups.emptyValue,

          city: group.city ?? locale.participant_details.notInformed,
        })),

        total: result.total,
      };
    },
    [participantId],
  );

  const handleToggleActive = async () => {
    if (!participant) return;

    setSavingStatus(true);
    setStatusError(null);

    try {
      const active = await updateParticipantStatus(participant.id, !participant.active);

      setParticipant((current) =>
        current
          ? {
              ...current,
              active,
            }
          : current,
      );
    } catch {
      setStatusError(locale.participant_details.updateStatusError);
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
        error instanceof Error && error.message
          ? error.message
          : locale.participant_details.modal.saveError,
      );
    } finally {
      setSavingParticipant(false);
    }
  };

  return (
    <Styled.Page>
      <BackButton label={locale.participant_details.back} onClick={handleBack} />

      <Styled.PageHeader>
        <Styled.PageTitle>{locale.participant_details.title}</Styled.PageTitle>
      </Styled.PageHeader>

      {loading && <ParticipantDetailsSkeleton />}

      {!loading && loadError && <Styled.Message $error>{loadError}</Styled.Message>}

      {!loading && !loadError && participant && (
        <Styled.Card>
          <Styled.ProfileHeader>
            <ParticipantSummary
              participant={participant}
              savingStatus={savingStatus}
              statusError={statusError}
              onToggleActive={handleToggleActive}
              onEdit={handleOpenModal}
            />

            <ParticipantContacts participant={participant} />
          </Styled.ProfileHeader>

          <ParticipantModal
            isOpen={isModalOpen}
            participant={participant}
            cities={cities}
            zones={zones}
            onClose={handleCloseModal}
            onConfirm={handleUpdateParticipant}
            saving={savingParticipant}
            error={
              updateError ?? (optionsError ? locale.participant_details.modal.optionsError : null)
            }
          />

          <Styled.TableArea>
            <Table
              columns={columns}
              fetchPage={fetchGroupsPage}
              pageSize={5}
              itemLabel={locale.participant_details.groups.itemLabel}
            />
          </Styled.TableArea>

          <ParticipantInfoGrid participant={participant} presence={presence} />
        </Styled.Card>
      )}
    </Styled.Page>
  );
};
