import { LuInstagram, LuMail, LuPhone } from 'react-icons/lu';

import { interpolate, locale } from '../../locales';
import type { Participant } from '../../types/participant';

import * as Styled from './styles';

const toTelHref = (phone: string) => {
  const digits = phone.replace(/\D/g, '');

  return phone.trim().startsWith('+') ? `tel:+${digits}` : `tel:+55${digits}`;
};

type ParticipantContactsProps = {
  participant: Participant;
};

export const ParticipantContacts = ({ participant }: ParticipantContactsProps) => {
  const instagramUsername = participant.instagram?.replace(/^@/, '');

  return (
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
          href={toTelHref(participant.phone)}
          aria-label={interpolate(locale.participant_details.contact.phoneAria, {
            name: participant.name,
          })}
        >
          <LuPhone aria-hidden />

          <span>{participant.phone}</span>
        </Styled.ContactItem>
      )}
    </Styled.Contacts>
  );
};
