import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/render';
import { KpiCard } from './index';

describe('KpiCard', () => {
  it('exibe o título do indicador', () => {
    renderWithProviders(<KpiCard title="Grupos de leitura" value={45} />);

    expect(screen.getByRole('region', { name: 'Grupos de leitura' })).toBeInTheDocument();
  });

  it('exibe o valor do indicador', () => {
    renderWithProviders(<KpiCard title="Grupos de leitura" value={45} />);

    expect(screen.getByText('45')).toBeInTheDocument();
  });

  it('exibe o valor zero', () => {
    renderWithProviders(<KpiCard title="Grupos de leitura" value={0} />);

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('exibe a descrição quando fornecida', () => {
    renderWithProviders(
      <KpiCard title="Grupos de leitura" value={45} description="Total de grupos cadastrados" />,
    );

    expect(screen.getByText('Total de grupos cadastrados')).toBeInTheDocument();
  });

  it('não exibe descrição quando não fornecida', () => {
    renderWithProviders(<KpiCard title="Grupos de leitura" value={45} />);

    expect(screen.queryByText('Total de grupos cadastrados')).not.toBeInTheDocument();
  });

  it('renderiza um ícone quando fornecido', () => {
    renderWithProviders(<KpiCard title="Grupos de leitura" value={45} icon={<span>Ícone</span>} />);

    expect(screen.getByText('Ícone')).toBeInTheDocument();
  });
});
