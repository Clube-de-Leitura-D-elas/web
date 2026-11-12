import { fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../test/render';
import { Avatar } from '.';

const initialsOf = (name: string) =>
  renderWithProviders(<Avatar name={name} />).container.firstElementChild!.textContent;

describe('Avatar', () => {
  it('usa a primeira letra do primeiro e do último nome', () => {
    expect(initialsOf('Ana Beatriz Souza')).toBe('AS');
  });

  it('usa só uma letra, em maiúscula, quando há um nome', () => {
    expect(initialsOf('  joseane ')).toBe('J');
  });

  it('fica vazio para nome vazio', () => {
    expect(initialsOf('   ')).toBe('');
  });

  it('mostra as iniciais sem foto e fica fora da árvore de acessibilidade', () => {
    const { container } = renderWithProviders(<Avatar name="Joseane Alves" />);

    const avatar = container.firstElementChild!;
    expect(avatar).toHaveTextContent('JA');
    expect(avatar).toHaveAttribute('aria-hidden', 'true');
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
    expect(container.firstElementChild).toHaveTextContent('JA');
  });
});
