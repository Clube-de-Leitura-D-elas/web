import { useCallback, useEffect, useState } from 'react';
import { LuArrowLeft } from 'react-icons/lu';
import { useNavigate, useParams } from 'react-router';

import { Table, type TableColumn, type TableFetchPage } from '../../components/Table';
import { Tag } from '../../components/Tag';
import { locale } from '../../locales';
import {
  getParticipantById,
  getParticipantGroups,
  getParticipantPresence,
  updateParticipantStatus,
} from '../../services/participantService';
import type { Participant, ParticipantPresence } from '../../types/participant';

import { ParticipantContacts } from './ParticipantContacts';
import { ParticipantInfoGrid } from './ParticipantInfoGrid';
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
    key: 'city',
    label: locale.participant_details.groups.columns.city,
    align: 'left',
  },
];

export const ParticipantDetails = () => {
  const { participantId } = useParams<{
    participantId: string;
  }>();

  return <ParticipantProfile key={participantId} participantId={participantId} />;
};

const ParticipantProfile = ({ participantId }: { participantId?: string }) => {
  const navigate = useNavigate();

  const [participant, setParticipant] = useState<Participant | null>(null);

  const [presence, setPresence] = useState<ParticipantPresence[]>([]);

  const [loading, setLoading] = useState(Boolean(participantId));

  const [loadError, setLoadError] = useState<string | null>(
    participantId ? null : locale.participant_details.loadError,
  );

  const [statusError, setStatusError] = useState<string | null>(null);

  const [savingStatus, setSavingStatus] = useState(false);

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

          city: group.city ?? locale.participant_details.notInformed,
        })),

        total: result.total,
      };
    },
    [participantId],
  );

  const handleBack = () => {
    navigate('/participantes');
  };

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

  return (
    <Styled.Page>
      <Styled.PageHeader>
        <Styled.BackButton
          type="button"
          onClick={handleBack}
          aria-label={locale.participant_details.back}
        >
          <LuArrowLeft aria-hidden />
        </Styled.BackButton>

        <Styled.PageTitle>{locale.participant_details.title}</Styled.PageTitle>
      </Styled.PageHeader>

      {loading && <Styled.Message>{locale.participant_details.loading}</Styled.Message>}

      {!loading && loadError && <Styled.Message $error>{loadError}</Styled.Message>}

      {!loading && !loadError && participant && (
        <Styled.Card>
          <Styled.ProfileHeader>
            <ParticipantSummary
              participant={participant}
              savingStatus={savingStatus}
              statusError={statusError}
              onToggleActive={handleToggleActive}
            />

            <ParticipantContacts participant={participant} />
          </Styled.ProfileHeader>

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
