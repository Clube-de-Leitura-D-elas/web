import {
  formatDayMonth,
  formatEntryDate,
  formatMeetingDate,
  formatMonthLabel,
  formatMonthYear,
  getRegistrationsRange,
} from './date';

// O jest.config.js fixa o fuso em America/Sao_Paulo (UTC-3).

describe('formatMonthYear', () => {
  it('formata como mês abreviado sem ponto e ano', () => {
    expect(formatMonthYear('2024-03-15T12:00:00Z')).toBe('mar/2024');
  });

  it('usa o fuso local para decidir o mês', () => {
    // 01/04 às 01h UTC ainda é 31/03 em São Paulo
    expect(formatMonthYear('2024-04-01T01:00:00Z')).toBe('mar/2024');
  });

  it('devolve texto vazio para data inválida', () => {
    expect(formatMonthYear('não é data')).toBe('');
  });
});

describe('formatMeetingDate', () => {
  it('omite os minutos em hora cheia', () => {
    expect(formatMeetingDate('2026-08-24T22:00:00Z')).toBe('24 ago, 19h');
  });

  it('mostra os minutos com dois dígitos', () => {
    expect(formatMeetingDate('2026-08-24T22:05:00Z')).toBe('24 ago, 19h05');
  });

  it('completa o dia com zero à esquerda', () => {
    expect(formatMeetingDate('2026-09-03T12:30:00Z')).toBe('03 set, 9h30');
  });

  it('devolve texto vazio para data inválida', () => {
    expect(formatMeetingDate('')).toBe('');
  });
});

describe('formatEntryDate', () => {
  it('mostra a data sem hora como o próprio dia, sem mudar de fuso', () => {
    // a API já devolve o dia civil de São Paulo
    expect(formatEntryDate('2024-03-01')).toBe('01/03/2024');
  });

  it('converte o timestamp para o dia em São Paulo', () => {
    // 16/03 às 01h30 UTC ainda é 15/03 em São Paulo
    expect(formatEntryDate('2025-03-16T01:30:00Z')).toBe('15/03/2025');
  });

  it('devolve texto vazio quando não há data ou ela é inválida', () => {
    expect(formatEntryDate(null)).toBe('');
    expect(formatEntryDate('não é data')).toBe('');
  });
});

describe('getRegistrationsRange', () => {
  it('pede os últimos 12 meses, começando no dia 1', () => {
    expect(getRegistrationsRange('month', new Date('2026-11-08T15:00:00Z'))).toEqual({
      from: '2025-12-01',
      to: '2026-11-08',
    });
  });

  it('atravessa a virada do ano', () => {
    expect(getRegistrationsRange('month', new Date('2026-01-15T15:00:00Z')).from).toBe(
      '2025-02-01',
    );
  });

  it('pede as últimas 12 semanas, começando numa segunda-feira', () => {
    // 08/11/2026 é domingo: a semana atual começou na segunda 02/11
    expect(getRegistrationsRange('week', new Date('2026-11-08T15:00:00Z'))).toEqual({
      from: '2026-08-17',
      to: '2026-11-08',
    });
  });

  it('numa segunda-feira, a semana atual é a própria segunda', () => {
    expect(getRegistrationsRange('week', new Date('2026-11-09T15:00:00Z'))).toEqual({
      from: '2026-08-24',
      to: '2026-11-09',
    });
  });

  it('falha de forma explícita quando a data de referência é inválida', () => {
    expect(() => getRegistrationsRange('month', new Date('não é data'))).toThrow();
  });

  it('usa o dia de São Paulo, não o de UTC', () => {
    // 02h UTC de segunda ainda é domingo 23h em São Paulo
    expect(getRegistrationsRange('week', new Date('2026-11-09T02:00:00Z'))).toEqual({
      from: '2026-08-17',
      to: '2026-11-08',
    });
  });
});

describe('formatMonthLabel', () => {
  it('formata mês abreviado e ano', () => {
    expect(formatMonthLabel('2026-03-01')).toBe('mar/2026');
    expect(formatMonthLabel('2026-09-01')).toBe('set/2026');
  });

  it('não volta para o mês anterior por causa do fuso', () => {
    expect(formatMonthLabel('2026-08-01')).toBe('ago/2026');
  });

  it('devolve texto vazio para valor inválido', () => {
    expect(formatMonthLabel('não é data')).toBe('');
    expect(formatMonthLabel('2026-13-40')).toBe('');
  });
});

describe('formatDayMonth', () => {
  it('formata dia e mês com dois dígitos', () => {
    expect(formatDayMonth('2026-09-28')).toBe('28/09');
    expect(formatDayMonth('2026-11-02')).toBe('02/11');
  });

  it('devolve texto vazio para valor inválido', () => {
    expect(formatDayMonth('')).toBe('');
  });
});
