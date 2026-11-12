import { screen, within } from '@testing-library/react';
import { renderWithProviders } from '../../test/render';
import { ChartCard } from '.';

describe('ChartCard', () => {
  it('mostra o título e o conteúdo dentro de uma região nomeada pelo título', () => {
    renderWithProviders(
      <ChartCard title="Novas inscrições">
        <p>conteúdo do gráfico</p>
      </ChartCard>,
    );

    const region = screen.getByRole('region', { name: 'Novas inscrições' });
    expect(region).toHaveTextContent('conteúdo do gráfico');
    expect(screen.getByRole('heading', { level: 2, name: 'Novas inscrições' })).toBeInTheDocument();
  });
});

describe('ChartCard com ação', () => {
  it('mostra a ação ao lado do título', () => {
    renderWithProviders(
      <ChartCard title="Total de Participantes" action={<button type="button">6 meses</button>}>
        <p>conteúdo do gráfico</p>
      </ChartCard>,
    );

    const region = screen.getByRole('region', { name: 'Total de Participantes' });
    expect(within(region).getByRole('button', { name: '6 meses' })).toBeInTheDocument();
  });

  it('sem ação, a região mostra só o título e o conteúdo', () => {
    renderWithProviders(
      <ChartCard title="Novas inscrições">
        <p>conteúdo do gráfico</p>
      </ChartCard>,
    );

    const region = screen.getByRole('region', { name: 'Novas inscrições' });
    expect(within(region).getByRole('heading', { name: 'Novas inscrições' })).toBeInTheDocument();
    expect(region).toHaveTextContent('conteúdo do gráfico');
    expect(within(region).queryByRole('button')).not.toBeInTheDocument();
    expect(within(region).queryByRole('tablist')).not.toBeInTheDocument();
  });
});
