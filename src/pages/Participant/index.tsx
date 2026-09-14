import { useCallback, useEffect, useState } from 'react';
import { LuArrowLeft, LuInstagram, LuMail, LuPhone, LuUserRound } from 'react-icons/lu';
import { useNavigate, useParams } from 'react-router';

import { Button } from '../../components/Button';
import { Table, type TableColumn, type TableFetchPage } from '../../components/Table';
import { Tag } from '../../components/Tag';
import { interpolate, locale } from '../../locales';
import {
  getParticipantById,
  getParticipantGroups,
  getParticipantPresence,
  updateParticipantStatus,
} from '../../services/participantService';
import type { Participant, ParticipantPresence } from '../../types/participant';

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

const formatBirthDate = (birthDate: string | null) => {
  if (!birthDate) {
    return locale.participant_details.notInformed;
  }

  const [, month, day] = birthDate.split('-');

  if (!day || !month) {
    return birthDate;
  }

  return `${day}/${month}`;
};

function ParticipantDetails() {
  const navigate = useNavigate();

  const { participantId } = useParams<{
    participantId: string;
  }>();

  const [participant, setParticipant] = useState<Participant | null>(null);

  const [presence, setPresence] = useState<ParticipantPresence[]>([]);

  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState<string | null>(null);

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

  const presenceCount = presence.filter((item) => item.present).length;

  const instagramUsername = participant?.instagram?.replace(/^@/, '');

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
            <Styled.ProfileArea>
              <Styled.Avatar aria-hidden>
                <LuUserRound />
              </Styled.Avatar>

              <Styled.ProfileInfo>
                <Styled.ParticipantName>{participant.name}</Styled.ParticipantName>

                <Styled.StatusArea>
                  <Tag color={participant.active ? 'primary' : 'neutral'}>
                    {participant.active
                      ? locale.participant_details.status.active
                      : locale.participant_details.status.inactive}
                  </Tag>

                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={savingStatus}
                    onClick={handleToggleActive}
                  >
                    {participant.active
                      ? locale.participant_details.status.deactivate
                      : locale.participant_details.status.activate}
                  </Button>
                </Styled.StatusArea>

                {statusError && <Styled.StatusError>{statusError}</Styled.StatusError>}
              </Styled.ProfileInfo>
            </Styled.ProfileArea>

            <Styled.Contacts>
              <Styled.ContactItem
                href={`mailto:${participant.email}`}
                aria-label={interpolate(locale.participant_details.contact.emailAria, {
                  name: participant.name,
                })}
              >
                <LuMail aria-hidden />

                <span>{participant.email}</span>
              </Styled.ContactItem>

              {participant.instagram && instagramUsername && (
                <Styled.ContactItem
                  href={`https://instagram.com/${instagramUsername}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={interpolate(locale.participant_details.contact.instagramAria, {
                    name: participant.name,
                  })}
                >
                  <LuInstagram aria-hidden />

                  <span>{participant.instagram}</span>
                </Styled.ContactItem>
              )}

              {participant.phone && (
                <Styled.ContactItem
                  href={`tel:${participant.phone}`}
                  aria-label={interpolate(locale.participant_details.contact.phoneAria, {
                    name: participant.name,
                  })}
                >
                  <LuPhone aria-hidden />

                  <span>{participant.phone}</span>
                </Styled.ContactItem>
              )}
            </Styled.Contacts>
          </Styled.ProfileHeader>

          <Styled.TableArea>
            <Table
              columns={columns}
              fetchPage={fetchGroupsPage}
              pageSize={5}
              itemLabel={locale.participant_details.groups.itemLabel}
            />
          </Styled.TableArea>

          <Styled.DetailsGrid>
            <Styled.Detail>
              <Styled.DetailLabel>{locale.participant_details.details.presence}</Styled.DetailLabel>

              <Styled.Presence
                aria-label={interpolate(locale.participant_details.details.presenceAria, {
                  present: presenceCount,
                  total: presence.length,
                })}
              >
                {presence.map((item) => (
                  <Styled.PresenceDot key={item.meetingId} $present={item.present} aria-hidden />
                ))}
              </Styled.Presence>
            </Styled.Detail>

            <Styled.Detail>
              <Styled.DetailLabel>{locale.participant_details.details.city}</Styled.DetailLabel>

              <Styled.DetailValue>
                {participant.city ?? locale.participant_details.notInformed}
              </Styled.DetailValue>
            </Styled.Detail>

            <Styled.Detail>
              <Styled.DetailLabel>{locale.participant_details.details.zone}</Styled.DetailLabel>

              <Styled.DetailValue>
                {participant.zone ?? locale.participant_details.notInformed}
              </Styled.DetailValue>
            </Styled.Detail>

            <Styled.Detail>
              <Styled.DetailLabel>{locale.participant_details.details.birthday}</Styled.DetailLabel>

              <Styled.DetailValue>{formatBirthDate(participant.birthDate)}</Styled.DetailValue>
            </Styled.Detail>

            <Styled.Detail>
              <Styled.DetailLabel>
                {locale.participant_details.details.occupation}
              </Styled.DetailLabel>

              <Styled.DetailValue>
                {participant.job ?? locale.participant_details.notInformed}
              </Styled.DetailValue>
            </Styled.Detail>
          </Styled.DetailsGrid>
        </Styled.Card>
      )}
    </Styled.Page>
  );
}

export default ParticipantDetails;
