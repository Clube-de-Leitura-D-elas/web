import { LuInstagram, LuMail, LuPencil, LuPhone } from 'react-icons/lu';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';
import { Tag } from '../../components/Tag';
import { interpolate, locale } from '../../locales';
import type { Participant } from '../../types/participant';
import { formatBirthday, formatEntryDate } from '../../utils/date';
import * as Styled from './styles';

const text = locale.participant_details;

const toTelHref = (phone: string) => {
  const digits = phone.replace(/\D/g, '');

  return phone.trim().startsWith('+') ? `tel:+${digits}` : `tel:+55${digits}`;
};

const joinParts = (first: string | null, second: string | null) =>
  first && second ? interpolate(text.profile.subline, { first, second }) : (first ?? second);

type ParticipantProfileCardProps = {
  participant: Participant;
  isCoordinator: boolean;
  savingStatus: boolean;
  statusError: string | null;
  onToggleActive: () => void;
  onEdit: () => void;
};

export const ParticipantProfileCard = ({
  participant,
  isCoordinator,
  savingStatus,
  statusError,
  onToggleActive,
  onEdit,
}: ParticipantProfileCardProps) => {
  const instagram = participant.instagram?.replace(/^@/, '');
  const subline = joinParts(participant.job, participant.city);
  const location =
    participant.city && participant.zone
      ? interpolate(text.details.location, { city: participant.city, zone: participant.zone })
      : (participant.city ?? participant.zone ?? text.notInformed);

  return (
    <Styled.ProfileCard aria-label={text.profile.label} $enter={40}>
      <Styled.Identity>
        <Styled.AvatarRing $active={participant.active}>
          <Avatar name={participant.name} photo={participant.photo} size="xl" />
          <Styled.AvatarStatus $active={participant.active} aria-hidden="true" />
        </Styled.AvatarRing>

        <Styled.NameBlock>
          <Styled.Name>{participant.name}</Styled.Name>
          {subline && <Styled.Subline>{subline}</Styled.Subline>}
        </Styled.NameBlock>

        <Styled.Pills>
          <Styled.StatusTag key={String(participant.active)}>
            <Tag color={participant.active ? 'success' : 'neutral'}>
              <Styled.Dot aria-hidden="true" />
              {participant.active ? text.status.active : text.status.inactive}
            </Tag>
          </Styled.StatusTag>
          {isCoordinator && <Tag color="primary">{text.profile.coordinatorTag}</Tag>}
        </Styled.Pills>
      </Styled.Identity>

      <Styled.Actions>
        <Button variant="primary" icon={<LuPencil aria-hidden />} onClick={onEdit}>
          {text.editButton}
        </Button>
        <Styled.NeutralButton variant="secondary" disabled={savingStatus} onClick={onToggleActive}>
          {participant.active ? text.status.deactivate : text.status.activate}
        </Styled.NeutralButton>
      </Styled.Actions>

      {statusError && <Styled.StatusError role="alert">{statusError}</Styled.StatusError>}

      <Styled.Section>
        <Styled.SectionTitle>{text.contact.title}</Styled.SectionTitle>
        <Styled.ContactList>
          <li>
            <Styled.ContactLink
              href={`mailto:${participant.email}`}
              aria-label={interpolate(text.contact.emailAria, { name: participant.name })}
            >
              <Styled.ContactIcon aria-hidden="true">
                <LuMail />
              </Styled.ContactIcon>
              <span>{participant.email}</span>
            </Styled.ContactLink>
          </li>

          {participant.phone && (
            <li>
              <Styled.ContactLink
                href={toTelHref(participant.phone)}
                aria-label={interpolate(text.contact.phoneAria, { name: participant.name })}
              >
                <Styled.ContactIcon aria-hidden="true">
                  <LuPhone />
                </Styled.ContactIcon>
                <span>{participant.phone}</span>
              </Styled.ContactLink>
            </li>
          )}

          {instagram && (
            <li>
              <Styled.ContactLink
                href={`https://instagram.com/${instagram}`}
                target="_blank"
                rel="noreferrer"
                aria-label={interpolate(text.contact.instagramAria, { name: participant.name })}
              >
                <Styled.ContactIcon aria-hidden="true">
                  <LuInstagram />
                </Styled.ContactIcon>
                <span>{participant.instagram}</span>
              </Styled.ContactLink>
            </li>
          )}
        </Styled.ContactList>
      </Styled.Section>

      <Styled.Section>
        <Styled.SectionTitle>{text.details.title}</Styled.SectionTitle>
        <Styled.DetailsList>
          <dt>{text.details.city}</dt>
          <dd>{location}</dd>
          <dt>{text.details.birthday}</dt>
          <dd>{formatBirthday(participant.birthDate) || text.notInformed}</dd>
          <dt>{text.details.occupation}</dt>
          <dd>{participant.job || text.notInformed}</dd>
          <dt>{text.details.entryDate}</dt>
          <dd>{formatEntryDate(participant.entryDate) || text.notInformed}</dd>
          <dt>{text.details.appRole}</dt>
          <dd>{text.details.roles[participant.appRole]}</dd>
        </Styled.DetailsList>
      </Styled.Section>
    </Styled.ProfileCard>
  );
};
