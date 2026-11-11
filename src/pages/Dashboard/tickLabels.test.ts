import { pickTickLabels } from './tickLabels';

const months = (count: number) => Array.from({ length: count }, (_, index) => `m${index + 1}`);

describe('pickTickLabels', () => {
  it('com poucos meses, mostra todos', () => {
    expect(pickTickLabels(months(6))).toEqual(months(6));
  });

  it('1 ano: um rótulo a cada 2 meses, terminando no mais recente', () => {
    expect(pickTickLabels(months(12))).toEqual(['m2', 'm4', 'm6', 'm8', 'm10', 'm12']);
  });

  it('2 anos: um rótulo a cada 3 meses, terminando no mais recente', () => {
    const labels = pickTickLabels(months(24));

    expect(labels).toHaveLength(8);
    expect(labels[labels.length - 1]).toBe('m24');
    expect(labels[0]).toBe('m3');
  });

  it('5 anos: um rótulo por ano, terminando no mais recente', () => {
    expect(pickTickLabels(months(60))).toEqual(['m12', 'm24', 'm36', 'm48', 'm60']);
  });

  it('o mais recente aparece mesmo quando a quantidade não é múltipla do passo', () => {
    const labels = pickTickLabels(months(13));

    expect(labels[labels.length - 1]).toBe('m13');
  });

  it('devolve lista vazia sem rótulos', () => {
    expect(pickTickLabels([])).toEqual([]);
  });
});
