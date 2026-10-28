import { interpolate, locale } from '../../locales';
import type { EventAttendance, EventParticipant } from '../../types/event';
import { EventAvatar } from './EventAvatar';
import * as Styled from './styles';

type EventParticipationProps = {
  attendance: EventAttendance | null | undefined;
  participants: EventParticipant[] | null | undefined;
};

type ParticipantGroupProps = {
  title: string;
  emptyText: string;
  participants: EventParticipant[];
};

const ParticipantGroup = ({ title, emptyText, participants }: ParticipantGroupProps) => (
  <Styled.ParticipantGroup>
    <Styled.ParticipantGroupTitle>{title}</Styled.ParticipantGroupTitle>

    {participants.length > 0 ? (
      <Styled.ParticipantList>
        {participants.map((participant) => (
          <Styled.ParticipantItem key={participant.id}>
            <EventAvatar photoUrl={participant.photoUrl} />
            <Styled.ParticipantName>{participant.name}</Styled.ParticipantName>
          </Styled.ParticipantItem>
        ))}
      </Styled.ParticipantList>
    ) : (
      <Styled.ParticipationEmpty>{emptyText}</Styled.ParticipationEmpty>
    )}
  </Styled.ParticipantGroup>
);

export const EventParticipation = ({ attendance, participants }: EventParticipationProps) => {
  const text = locale.event_details.participation;

  // attended null = presença não registrada: fica fora das duas listas (não conta como falta)
  const present = (participants ?? []).filter((participant) => participant.attended === true);
  const absent = (participants ?? []).filter((participant) => participant.attended === false);

  // sem total (grupo vazio) ou sem nenhum registro: não mostra 0% nem listas
  const hasRecord = present.length + absent.length > 0;
  if (!attendance || attendance.total === 0 || !hasRecord) {
    return <Styled.ParticipationEmpty>{text.empty}</Styled.ParticipationEmpty>;
  }

  // present + absent pode ser menor que total (quem está sem registro): por isso present/total
  const percent = Math.round((attendance.present / attendance.total) * 100);

  return (
    <Styled.ParticipationRoot>
      <Styled.ParticipationSummary>
        {interpolate(text.summary, {
          present: attendance.present,
          total: attendance.total,
          percent,
        })}
      </Styled.ParticipationSummary>

      <Styled.ParticipantLists>
        <ParticipantGroup
          title={interpolate(text.presentTitle, { count: present.length })}
          emptyText={text.presentEmpty}
          participants={present}
        />
        <ParticipantGroup
          title={interpolate(text.absentTitle, { count: absent.length })}
          emptyText={text.absentEmpty}
          participants={absent}
        />
      </Styled.ParticipantLists>
    </Styled.ParticipationRoot>
  );
};
