import { screen } from '@testing-library/react';
import { useState } from 'react';
import { locale } from '../../locales';
import { renderWithProviders } from '../../test/render';
import { Autocomplete, type AutocompleteProps } from '.';

const options = [
  { value: 'poa', label: 'Porto Alegre' },
  { value: 'poa-sul', label: 'Porto Alegre — Zona Sul' },
  { value: 'sp', label: 'São Paulo' },
  { value: 'rec', label: 'Recife' },
];

type Props = Partial<Omit<AutocompleteProps, 'value'>> & { initialValue?: string | null };

const ControlledAutocomplete = ({ initialValue = null, onChange, ...props }: Props) => {
  const [value, setValue] = useState<string | null>(initialValue);
  return (
    <Autocomplete
      label="Cidade"
      options={options}
      {...props}
      value={value}
      onChange={(next) => {
        setValue(next);
        onChange?.(next);
      }}
    />
  );
};

const renderAutocomplete = (props: Props = {}) => {
  const onChange = jest.fn();
  const view = renderWithProviders(<ControlledAutocomplete onChange={onChange} {...props} />);
  return { ...view, onChange, input: screen.getByRole('combobox', { name: 'Cidade' }) };
};

describe('Autocomplete', () => {
  it('só sugere a partir do mínimo de caracteres', async () => {
    const { user, input } = renderAutocomplete();

    await user.type(input, 'po');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    await user.type(input, 'r');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-expanded', 'true');
  });

  it('filtra ignorando acentos e maiúsculas', async () => {
    const { user, input } = renderAutocomplete();

    await user.type(input, 'SAO');

    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
      'São Paulo',
    ]);
  });

  it('seleciona uma sugestão com o mouse', async () => {
    const { user, input, onChange } = renderAutocomplete();

    await user.type(input, 'porto');
    await user.click(screen.getByRole('option', { name: 'Porto Alegre — Zona Sul' }));

    expect(onChange).toHaveBeenLastCalledWith('poa-sul');
    expect(input).toHaveValue('Porto Alegre — Zona Sul');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('navega pelas sugestões com as setas e seleciona com Enter', async () => {
    const { user, input, onChange } = renderAutocomplete();

    await user.type(input, 'porto');
    await user.keyboard('{ArrowDown}{ArrowDown}');
    expect(screen.getByRole('option', { name: 'Porto Alegre — Zona Sul' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('option', { name: 'Porto Alegre' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    await user.keyboard('{ArrowUp}{Enter}');
    expect(onChange).toHaveBeenLastCalledWith('poa-sul');
  });

  it('avisa quando nada foi encontrado', async () => {
    const { user, input } = renderAutocomplete();

    await user.type(input, 'xyz');

    expect(screen.getByRole('status')).toHaveTextContent(locale.autocomplete.noResults);
  });

  it('limpa a seleção quando a usuária edita o texto', async () => {
    const { user, input, onChange } = renderAutocomplete({ initialValue: 'rec' });
    expect(input).toHaveValue('Recife');

    await user.type(input, 'x');

    expect(onChange).toHaveBeenCalledWith(null);
    expect(input).toHaveValue('Recifex');
  });

  it('fecha as sugestões com Esc', async () => {
    const { user, input } = renderAutocomplete();

    await user.type(input, 'porto');
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('limita a quantidade de sugestões', async () => {
    const { user, input } = renderAutocomplete({ maxSuggestions: 1 });

    await user.type(input, 'porto');

    expect(screen.getAllByRole('option')).toHaveLength(1);
  });

  it('mostra o erro e marca o campo como inválido', () => {
    const { input } = renderAutocomplete({ error: 'Falhou', helperText: 'Ajuda' });

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Falhou');
  });

  it('não sugere quando desabilitado', () => {
    const { input } = renderAutocomplete({ disabled: true });

    expect(input).toBeDisabled();
  });
});
