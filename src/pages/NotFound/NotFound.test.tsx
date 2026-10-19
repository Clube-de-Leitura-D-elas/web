import { screen } from '@testing-library/react';
import { locale } from '../../locales';
import { renderWithProviders } from '../../test/render';
import { NotFound } from '.';

describe('NotFound', () => {
  it('mostra os textos padrão', () => {
    renderWithProviders(<NotFound />);

    expect(screen.getByRole('heading', { name: locale.notFound.title })).toBeInTheDocument();
    expect(screen.getByText(locale.notFound.description)).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('aceita título e descrição próprios fora da tela cheia', () => {
    renderWithProviders(
      <NotFound title="Grupo não existe" description="Confira o link." fullScreen={false} />,
    );

    expect(screen.getByRole('heading', { name: 'Grupo não existe' })).toBeInTheDocument();
    expect(screen.getByText('Confira o link.')).toBeInTheDocument();
    expect(screen.queryByRole('main')).not.toBeInTheDocument();
  });

  it('volta para o início', async () => {
    const { user } = renderWithProviders(<NotFound />, { route: '/qualquer', path: '/qualquer' });

    await user.click(screen.getByRole('button', { name: locale.notFound.backButton }));

    expect(screen.getByTestId('location')).toHaveTextContent(/^\/$/);
  });
});
