import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/render';
import { BackButton } from '.';

describe('BackButton', () => {
  it('mostra "Voltar" quando não recebe label', () => {
    renderWithProviders(<BackButton />);

    expect(screen.getByRole('button', { name: 'Voltar' })).toBeInTheDocument();
  });

  it('volta no histórico do navegador por padrão', async () => {
    const back = jest.spyOn(window.history, 'back').mockImplementation(() => {});
    const { user } = renderWithProviders(<BackButton label="Voltar para grupos" />);

    await user.click(screen.getByRole('button', { name: 'Voltar para grupos' }));

    expect(back).toHaveBeenCalled();
  });

  it('usa o onClick recebido no lugar do histórico', async () => {
    const back = jest.spyOn(window.history, 'back').mockImplementation(() => {});
    const onClick = jest.fn();
    const { user } = renderWithProviders(<BackButton onClick={onClick} />);

    await user.click(screen.getByRole('button', { name: 'Voltar' }));

    expect(onClick).toHaveBeenCalled();
    expect(back).not.toHaveBeenCalled();
  });
});
