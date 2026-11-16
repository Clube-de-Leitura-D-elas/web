import type {
  AbsenceItem,
  ActiveParticipantsItem,
  Granularity,
  RegistrationsItem,
} from '../../types/dashboard';

// Dados de exemplo só para as stories do Dashboard.
// total 0 no meio: os períodos vazios também aparecem no gráfico.
const MONTH_TOTALS = [14, 8, 21, 37, 29, 44, 0, 52, 60, 33, 26, 18];
const WEEK_TOTALS = [6, 9, 0, 14, 11, 17, 8, 22, 13, 5, 10, 15];

// 12 períodos a partir de `from`: o dia 1 de cada mês ou uma segunda-feira por semana
export const buildRegistrations = (
  granularity: Granularity,
  from: string,
  zeroed = false,
): RegistrationsItem[] => {
  const [year, month, day] = from.split('-').map(Number);
  const totals = granularity === 'month' ? MONTH_TOTALS : WEEK_TOTALS;

  return totals.map((total, index) => {
    const date =
      granularity === 'month'
        ? new Date(Date.UTC(year, month - 1 + index, 1))
        : new Date(Date.UTC(year, month - 1, day + index * 7));

    return { period: date.toISOString().slice(0, 10), total: zeroed ? 0 : total };
  });
};

const FIRST_TOTAL = 640;
const LAST_TOTAL = 984;

// Um ponto por mês de `from` até o mês de `to`, crescendo de ~640 a 984 sem nunca cair
// (o total é um acumulado).
export const buildActiveParticipants = (
  from: string,
  to: string,
  zeroed = false,
): ActiveParticipantsItem[] => {
  const [fromYear, fromMonth] = from.split('-').map(Number);
  const [toYear, toMonth] = to.split('-').map(Number);
  const count = (toYear - fromYear) * 12 + (toMonth - fromMonth) + 1;

  return Array.from({ length: count }, (_, index) => {
    const date = new Date(Date.UTC(fromYear, fromMonth - 1 + index, 1));
    const progress = count === 1 ? 1 : index / (count - 1);
    const total = FIRST_TOTAL + Math.floor(progress * (LAST_TOTAL - FIRST_TOTAL));

    return { period: date.toISOString().slice(0, 10), total: zeroed ? 0 : total };
  });
};

const absence = (
  participantId: string,
  name: string,
  group: AbsenceItem['group'],
  lastPresenceAt: string | null,
): AbsenceItem => ({ participantId, name, group, lastPresenceAt });

const GROUP_1 = { id: 'g1', number: 1, description: 'Porto Alegre' };
const GROUP_2 = { id: 'g2', number: 2, description: 'Porto Alegre' };
const GROUP_3 = { id: 'g3', number: 3, description: 'São Paulo' };
const GROUP_4 = { id: 'g4', number: 4, description: 'São Paulo' };
const GROUP_5 = { id: 'g5', number: 5, description: 'Belo Horizonte' };
const GROUP_6 = { id: 'g6', number: 6, description: 'Recife' };

// 8 linhas na ordem do backend (nunca presente primeiro, depois a presença mais antiga): com 6 por
// página, a tabela mostra a paginação. O nome longo testa a quebra de linha.
export const ABSENCES: AbsenceItem[] = [
  absence('p1', 'Rayane Moura', GROUP_6, null),
  absence('p2', 'Ísis Nascimento Pires', GROUP_3, '2026-08-18'),
  absence(
    'p3',
    'Thaís Cristina Oliveira Nascimento de Vasconcelos Albuquerque',
    GROUP_5,
    '2026-08-28',
  ),
  absence('p4', 'Joana Dias', GROUP_1, '2026-09-02'),
  absence('p5', 'Cecília Tavares', GROUP_6, '2026-09-05'),
  absence('p6', 'Ana Beatriz Ferreira', GROUP_2, '2026-09-10'),
  absence('p7', 'Mariana Albuquerque', GROUP_3, '2026-09-15'),
  absence('p8', 'Luiza Hashimoto', GROUP_4, '2026-09-21'),
];
