import { LuUserRound } from 'react-icons/lu';

import { Button } from '../../components/Button';
import { Tag } from '../../components/Tag';
import { locale } from '../../locales';
import type { Participant } from '../../types/participant';

import * as Styled from './styles';

type ParticipantSummaryProps = {
  participant: Participant;
  savingStatus: boolean;
  statusError: string | null;
  onToggleActive: () => void;
};

export const ParticipantSummary = ({
  participant,
  savingStatus,
  statusError,
  onToggleActive,
}: ParticipantSummaryProps) => (
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

        <Button variant="secondary" size="sm" disabled={savingStatus} onClick={onToggleActive}>
          {participant.active
            ? locale.participant_details.status.deactivate
            : locale.participant_details.status.activate}
        </Button>
      </Styled.StatusArea>

      {statusError && <Styled.StatusError>{statusError}</Styled.StatusError>}
    </Styled.ProfileInfo>
  </Styled.ProfileArea>
);
