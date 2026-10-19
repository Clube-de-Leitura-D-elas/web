import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/render';
import { Tabs, type Tab } from '.';

const tabs: Tab[] = [
  { value: 'one', label: 'Primeira', children: <p>conteúdo 1</p> },
  { value: 'two', label: 'Segunda', children: <p>conteúdo 2</p>, disabled: true },
  { value: 'three', label: 'Terceira', children: <p>conteúdo 3</p> },
];

describe('Tabs', () => {
  it('abre a primeira aba por padrão', () => {
    renderWithProviders(<Tabs tabs={tabs} />);

    expect(screen.getByRole('tab', { name: 'Primeira' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel', { name: 'Primeira' })).toHaveTextContent('conteúdo 1');
  });

  it('respeita defaultActive', () => {
    renderWithProviders(<Tabs tabs={tabs} defaultActive="three" />);

    expect(screen.getByRole('tabpanel')).toHaveTextContent('conteúdo 3');
  });

  it('troca de aba ao clicar e avisa onChange', async () => {
    const onChange = jest.fn();
    const { user } = renderWithProviders(<Tabs tabs={tabs} onChange={onChange} />);

    await user.click(screen.getByRole('tab', { name: 'Terceira' }));

    expect(onChange).toHaveBeenCalledWith('three');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('conteúdo 3');
  });

  it('controlada, só troca quando o pai muda o active', async () => {
    const onChange = jest.fn();
    const { user, rerender } = renderWithProviders(
      <Tabs tabs={tabs} active="one" onChange={onChange} />,
    );

    await user.click(screen.getByRole('tab', { name: 'Terceira' }));
    expect(onChange).toHaveBeenCalledWith('three');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('conteúdo 1');

    rerender(<Tabs tabs={tabs} active="three" onChange={onChange} />);
    expect(screen.getByRole('tabpanel')).toHaveTextContent('conteúdo 3');
  });

  it('navega pelas setas pulando abas desabilitadas', async () => {
    const { user } = renderWithProviders(<Tabs tabs={tabs} />);
    screen.getByRole('tab', { name: 'Primeira' }).focus();

    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Terceira' })).toHaveFocus();
    expect(screen.getByRole('tabpanel')).toHaveTextContent('conteúdo 3');

    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Primeira' })).toHaveFocus();

    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tab', { name: 'Terceira' })).toHaveFocus();

    await user.keyboard('{Home}');
    expect(screen.getByRole('tab', { name: 'Primeira' })).toHaveFocus();

    await user.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'Terceira' })).toHaveFocus();
  });

  it('só a aba ativa entra na ordem do Tab', () => {
    renderWithProviders(<Tabs tabs={tabs} />);

    expect(screen.getByRole('tab', { name: 'Primeira' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('tab', { name: 'Terceira' })).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('tab', { name: 'Segunda' })).toBeDisabled();
  });
});
