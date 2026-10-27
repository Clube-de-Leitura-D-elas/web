import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/render';
import { Button } from '.';

describe('Button', () => {
  it('é do tipo "button" por padrão, para não enviar formulários sem querer', () => {
    renderWithProviders(<Button>Salvar</Button>);

    expect(screen.getByRole('button', { name: 'Salvar' })).toHaveAttribute('type', 'button');
  });

  it('aceita outro tipo', () => {
    renderWithProviders(<Button type="submit">Enviar</Button>);

    expect(screen.getByRole('button', { name: 'Enviar' })).toHaveAttribute('type', 'submit');
  });

  it('chama onClick ao ser clicado', async () => {
    const onClick = jest.fn();
    const { user } = renderWithProviders(<Button onClick={onClick}>Salvar</Button>);

    await user.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('não chama onClick quando desabilitado', async () => {
    const onClick = jest.fn();
    const { user } = renderWithProviders(
      <Button disabled onClick={onClick}>
        Salvar
      </Button>,
    );

    await user.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(screen.getByRole('button', { name: 'Salvar' })).toBeDisabled();
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renderiza o ícone junto do texto', () => {
    renderWithProviders(<Button icon={<svg data-testid="icon" />}>Novo</Button>);

    expect(screen.getByRole('button', { name: 'Novo' })).toContainElement(
      screen.getByTestId('icon'),
    );
  });
});
