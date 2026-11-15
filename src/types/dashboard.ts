export type Granularity = 'month' | 'week';

export type RegistrationsItem = {
  // primeiro dia do mês ou segunda-feira da semana, em YYYY-MM-DD
  period: string;
  total: number;
};

export type RegistrationsResponse = {
  items: RegistrationsItem[];
};

export type ActiveParticipantsItem = {
  // primeiro dia do mês, em YYYY-MM-DD
  period: string;
  // participantes ativas ao fim do mês (acumulado, não as que entraram no mês)
  total: number;
};

export type ActiveParticipantsResponse = {
  items: ActiveParticipantsItem[];
};

// Uma linha por participante + grupo: a mesma participante aparece uma vez em cada grupo em que
// faltou aos 3 últimos encontros.
export type AbsenceItem = {
  participantId: string;
  name: string;
  group: {
    id: string;
    number: number;
    description: string;
  };
  // último encontro do grupo com presença, em YYYY-MM-DD; null se nunca esteve presente
  lastPresenceAt: string | null;
};

export type AbsencesResponse = {
  items: AbsenceItem[];
};

export type DashboardKpisResponse = {
  groups: {
    active: number;
    total: number;
  };
  meetings: {
    currentMonth: number;
    previousMonth: number;
  };
};
