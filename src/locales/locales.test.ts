import { interpolate, pluralize } from '.';

describe('interpolate', () => {
  it('troca cada {{chave}} pelo valor', () => {
    expect(
      interpolate('Grupo {{number}} — {{description}}', { number: 7, description: 'Sul' }),
    ).toBe('Grupo 7 — Sul');
  });

  it('mantém o marcador quando a chave não foi informada', () => {
    expect(interpolate('Olá, {{name}}', {})).toBe('Olá, {{name}}');
  });

  it('aceita zero como valor', () => {
    expect(interpolate('{{count}} itens', { count: 0 })).toBe('0 itens');
  });
});

describe('pluralize', () => {
  const forms = { one: '{{count}} grupo', other: '{{count}} grupos' };

  it('usa a forma singular só para 1', () => {
    expect(pluralize(forms, 1)).toBe('1 grupo');
  });

  it('usa a forma plural para 0 e para mais de 1', () => {
    expect(pluralize(forms, 0)).toBe('0 grupos');
    expect(pluralize(forms, 3)).toBe('3 grupos');
  });
});
