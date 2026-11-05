import { screen } from '@testing-library/react';
import { locale } from '../../locales';
import { renderWithProviders } from '../../test/render';
import { Dashboard } from '.';

const text = locale.dashboard;

describe('Dashboard', () => {
  it('mostra o título e o subtítulo da página', () => {
    renderWithProviders(<Dashboard />);

    expect(screen.getByRole('heading', { level: 1, name: text.title })).toBeInTheDocument();
    expect(screen.getByText(text.subtitle)).toBeInTheDocument();
  });

  it('tem a área dos indicadores e a área dos gráficos', () => {
    renderWithProviders(<Dashboard />);

    expect(screen.getByRole('region', { name: text.kpis.label })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: text.charts.label })).toBeInTheDocument();
  });
});
