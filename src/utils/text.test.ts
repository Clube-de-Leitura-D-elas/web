import { normalizeText } from './text';

describe('normalizeText', () => {
  it('tira acentos, caixa e espaços repetidos', () => {
    expect(normalizeText('  São   PAULO ')).toBe('sao paulo');
    expect(normalizeText('Gravataí')).toBe('gravatai');
  });
});
