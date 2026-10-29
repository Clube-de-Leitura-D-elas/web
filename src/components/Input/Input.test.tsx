import { screen } from '@testing-library/react';
import { useState } from 'react';
import { locale } from '../../locales';
import { renderWithProviders } from '../../test/render';
import { Input, type InputProps } from '.';

const ControlledInput = (props: Omit<InputProps, 'value' | 'onChange'>) => {
  const [value, setValue] = useState('');
  return <Input {...props} value={value} onChange={(event) => setValue(event.target.value)} />;
};

describe('Input', () => {
  it('associa o label ao campo', () => {
    renderWithProviders(<Input id="email" label="E-mail" />);

    expect(screen.getByLabelText('E-mail')).toHaveAttribute('id', 'email');
  });

  it('descreve o campo com o texto de ajuda', () => {
    renderWithProviders(<Input id="email" label="E-mail" helperText="Use o e-mail da gestão" />);

    expect(screen.getByLabelText('E-mail')).toHaveAccessibleDescription('Use o e-mail da gestão');
    expect(screen.getByLabelText('E-mail')).toHaveAttribute('aria-invalid', 'false');
  });

  it('mostra o erro no lugar do texto de ajuda e marca o campo como inválido', () => {
    renderWithProviders(
      <Input id="email" label="E-mail" helperText="Ajuda" error="E-mail inválido" />,
    );

    const field = screen.getByLabelText('E-mail');
    expect(field).toHaveAttribute('aria-invalid', 'true');
    expect(field).toHaveAccessibleDescription('E-mail inválido');
    expect(screen.queryByText('Ajuda')).not.toBeInTheDocument();
  });

  it('tira o destaque de erro assim que a usuária volta a digitar', async () => {
    const { user } = renderWithProviders(
      <ControlledInput id="email" label="E-mail" error="E-mail inválido" />,
    );

    await user.type(screen.getByLabelText('E-mail'), 'a');

    expect(screen.getByLabelText('E-mail')).toHaveAttribute('aria-invalid', 'false');
  });

  it('volta a destacar quando chega um erro novo', async () => {
    const { user, rerender } = renderWithProviders(
      <Input id="email" label="E-mail" error="Erro 1" onChange={() => {}} value="" />,
    );
    await user.type(screen.getByLabelText('E-mail'), 'a');
    expect(screen.getByLabelText('E-mail')).toHaveAttribute('aria-invalid', 'false');

    rerender(<Input id="email" label="E-mail" error="Erro 2" onChange={() => {}} value="" />);

    expect(screen.getByLabelText('E-mail')).toHaveAttribute('aria-invalid', 'true');
  });

  it('alterna a visibilidade da senha', async () => {
    const { user } = renderWithProviders(<Input id="senha" label="Senha" type="password" />);
    const field = screen.getByLabelText('Senha');
    expect(field).toHaveAttribute('type', 'password');

    await user.click(screen.getByRole('button', { name: locale.input.showPassword }));
    expect(field).toHaveAttribute('type', 'text');

    await user.click(screen.getByRole('button', { name: locale.input.hidePassword }));
    expect(field).toHaveAttribute('type', 'password');
  });

  it('não mostra o botão de senha em outros tipos', () => {
    renderWithProviders(<Input id="email" label="E-mail" type="email" />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
