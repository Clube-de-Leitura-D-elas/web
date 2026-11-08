export type Granularity = 'month' | 'week';

export type RegistrationsItem = {
  // primeiro dia do mês ou segunda-feira da semana, em YYYY-MM-DD
  period: string;
  total: number;
};

export type RegistrationsResponse = {
  items: RegistrationsItem[];
};
