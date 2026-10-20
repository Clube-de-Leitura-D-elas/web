import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/render';
import { Dropdown, type DropdownProps } from '.';

const options = [
  { value: 'poa', label: 'Porto Alegre' },
  { value: 'sp', label: 'São Paulo' },
  { value: 'rec', label: 'Recife' },
];

const renderDropdown = (props: Partial<DropdownProps> = {}) => {
  const onSelect = jest.fn();
  const view = renderWithProviders(
    <>
      <Dropdown label="Cidade" options={options} onSelect={onSelect} {...props} />
      <button type="button">fora</button>
    </>,
  );
  const trigger = screen.getByRole('button', { name: /Cidade/ });
  return { ...view, onSelect, trigger };
};

describe('Dropdown', () => {
  it('mostra o placeholder e começa fechado', () => {
    const { trigger } = renderDropdown({ placeholder: 'Escolha' });

    expect(trigger).toHaveTextContent('Escolha');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('seleciona uma opção com o mouse', async () => {
    const { user, trigger, onSelect } = renderDropdown();

    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await user.click(screen.getByRole('option', { name: 'São Paulo' }));

    expect(onSelect).toHaveBeenCalledWith('sp');
    expect(trigger).toHaveTextContent('São Paulo');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('marca a opção selecionada', async () => {
    const { user, trigger } = renderDropdown();

    await user.click(trigger);
    await user.click(screen.getByRole('option', { name: 'Recife' }));
    await user.click(trigger);

    expect(screen.getByRole('option', { name: 'Recife' })).toHaveAttribute('aria-selected', 'true');
  });

  it('abre com a seta e navega e seleciona pelo teclado', async () => {
    const { user, trigger, onSelect } = renderDropdown();

    trigger.focus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('option', { name: 'Porto Alegre' })).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('option', { name: 'São Paulo' })).toHaveFocus();

    await user.keyboard('{End}');
    expect(screen.getByRole('option', { name: 'Recife' })).toHaveFocus();

    await user.keyboard('{Home}');
    await user.keyboard('{Enter}');

    expect(onSelect).toHaveBeenCalledWith('poa');
    expect(trigger).toHaveFocus();
  });

  it('fecha com Esc e devolve o foco ao botão', async () => {
    const { user, trigger } = renderDropdown();

    await user.click(trigger);
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('fecha ao clicar fora', async () => {
    const { user, trigger } = renderDropdown();

    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'fora' }));

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('não abre quando desabilitado', async () => {
    const { user, trigger } = renderDropdown({ disabled: true });

    await user.click(trigger);

    expect(trigger).toBeDisabled();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('mostra o texto de ajuda', () => {
    renderDropdown({ helperText: 'Obrigatório', isError: true });

    expect(screen.getByText('Obrigatório')).toBeInTheDocument();
  });
});
