import { screen } from '@testing-library/react';
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
