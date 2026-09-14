import { interpolate, locale } from '../../locales';
import type { Participant, ParticipantPresence } from '../../types/participant';

import * as Styled from './styles';

const formatBirthDate = (birthDate: string | null) => {
  if (!birthDate) {
    return locale.participant_details.notInformed;
  }

  const [, month, day] = birthDate.slice(0, 10).split('-');

  if (!day || !month) {
    return birthDate;
  }

  return `${day}/${month}`;
};

type ParticipantInfoGridProps = {
  participant: Participant;
  presence: ParticipantPresence[];
};

export const ParticipantInfoGrid = ({ participant, presence }: ParticipantInfoGridProps) => {
  const presenceCount = presence.filter((item) => item.present).length;

  return (
    <Styled.DetailsGrid>
      <Styled.Detail>
        <Styled.DetailLabel>{locale.participant_details.details.presence}</Styled.DetailLabel>

        <Styled.Presence
          role="img"
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
        <Styled.DetailLabel>{locale.participant_details.details.occupation}</Styled.DetailLabel>

        <Styled.DetailValue>
          {participant.job ?? locale.participant_details.notInformed}
        </Styled.DetailValue>
      </Styled.Detail>
    </Styled.DetailsGrid>
  );
};
