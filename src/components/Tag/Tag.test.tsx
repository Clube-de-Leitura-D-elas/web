import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/render';
import { Tag } from '.';

describe('Tag', () => {
  it('renderiza o conteúdo', () => {
    renderWithProviders(<Tag color="success">Ativo</Tag>);

    expect(screen.getByText('Ativo')).toBeInTheDocument();
  });
});
