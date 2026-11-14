import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/render';
import { Avatar } from '.';

describe('Avatar', () => {
  it('usa a primeira letra do primeiro e do último nome', () => {
    renderWithProviders(<Avatar name="Ana Beatriz Souza" />);

    expect(screen.getByText('AS')).toBeInTheDocument();
  });

  it('usa só uma letra, em maiúscula, quando há um nome', () => {
    renderWithProviders(<Avatar name="  joseane " />);

    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('fica vazio para nome vazio', () => {
    const { container } = renderWithProviders(<Avatar name="   " />);

    expect(container).toHaveTextContent(/^$/);
  });

  it('mostra as iniciais sem foto e fica fora da árvore de acessibilidade', () => {
    const { container } = renderWithProviders(<Avatar name="Joseane Alves" />);

    expect(screen.getByText('JA')).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelector('img')).not.toBeInTheDocument();
  });

  it('mostra a foto quando existe', () => {
    const { container } = renderWithProviders(
      <Avatar name="Joseane Alves" photo="https://cdn.exemplo.com/joseane.jpg" />,
    );

    expect(container.querySelector('img')).toHaveAttribute(
      'src',
      'https://cdn.exemplo.com/joseane.jpg',
    );
  });

  it('volta para as iniciais quando a foto não carrega', () => {
    const { container } = renderWithProviders(
      <Avatar name="Joseane Alves" photo="https://cdn.exemplo.com/quebrada.jpg" />,
    );

    fireEvent.error(container.querySelector('img')!);

    expect(container.querySelector('img')).not.toBeInTheDocument();
    expect(screen.getByText('JA')).toBeInTheDocument();
  });
});
