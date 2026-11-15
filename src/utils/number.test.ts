import { formatNumber } from './number';

describe('formatNumber', () => {
  it('não muda números abaixo de mil', () => {
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(984)).toBe('984');
  });

  it('separa os milhares com ponto', () => {
    expect(formatNumber(1234)).toBe('1.234');
    expect(formatNumber(1_234_567)).toBe('1.234.567');
  });
});
