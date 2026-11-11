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
