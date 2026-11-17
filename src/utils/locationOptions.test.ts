import { toSelectableOptions } from './locationOptions';

describe('toSelectableOptions', () => {
  const options = [
    { id: 'a', name: 'Ativa', isActive: true },
    { id: 'b', name: 'Inativa', isActive: false },
    { id: 'c', name: 'Sem status' },
  ];

  it('mantém só as ativas', () => {
    expect(toSelectableOptions(options, null)).toEqual([
      { value: 'a', label: 'Ativa' },
      { value: 'c', label: 'Sem status' },
    ]);
  });

  it('mantém a inativa que o registro já usa', () => {
    expect(toSelectableOptions(options, 'b')).toEqual([
      { value: 'a', label: 'Ativa' },
      { value: 'b', label: 'Inativa' },
      { value: 'c', label: 'Sem status' },
    ]);
  });
});
