import { formatGroupNumber, formatRating, getFirstName } from './format';

describe('formatGroupNumber', () => {
  it('completa com zero à esquerda', () => {
    expect(formatGroupNumber(3)).toBe('03');
    expect(formatGroupNumber(12)).toBe('12');
  });
});

describe('formatRating', () => {
  it('usa vírgula e uma casa decimal', () => {
    expect(formatRating(4.5)).toBe('4,5');
    expect(formatRating(4)).toBe('4,0');
    expect(formatRating(3.96)).toBe('4,0');
  });
});

describe('getFirstName', () => {
  it('devolve o primeiro nome, ignorando espaços extras', () => {
    expect(getFirstName('  Ana Beatriz Souza ')).toBe('Ana');
    expect(getFirstName('Joseane')).toBe('Joseane');
  });

  it('devolve vazio para nome vazio', () => {
    expect(getFirstName('   ')).toBe('');
  });
});
