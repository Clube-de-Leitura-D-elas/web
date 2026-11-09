import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/render';
import { PeriodTooltip } from './PeriodTooltip';

describe('PeriodTooltip', () => {
  it('mostra o período e o valor exato', () => {
    renderWithProviders(<PeriodTooltip title="mar/2026" value="37 inscrições" />);

    expect(screen.getByText('mar/2026')).toBeInTheDocument();
    expect(screen.getByText('37 inscrições')).toBeInTheDocument();
  });
});
