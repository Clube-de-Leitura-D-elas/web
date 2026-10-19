import { formatMeetingDate, formatMonthYear } from './date';

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
