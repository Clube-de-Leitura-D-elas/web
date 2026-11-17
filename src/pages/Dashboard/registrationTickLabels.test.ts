import { formatRegistrationTick } from './registrationTickLabels';

describe('formatRegistrationTick', () => {
  it('mostra os dois últimos dígitos do ano na visualização mensal', () => {
    expect(formatRegistrationTick('dez/2025', 'month')).toBe('dez/25');
    expect(formatRegistrationTick('jan/2026', 'month')).toBe('jan/26');
    expect(formatRegistrationTick('set/2026', 'month')).toBe('set/26');
    expect(formatRegistrationTick('nov/2026', 'month')).toBe('nov/26');
  });

  it('mostra apenas a data na visualização semanal', () => {
    expect(formatRegistrationTick('Semana de 03/11', 'week')).toBe('03/11');
    expect(formatRegistrationTick('Semana de 16/11', 'week')).toBe('16/11');
  });
});
