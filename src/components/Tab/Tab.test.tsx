import { screen } from '@testing-library/react';
import { useState } from 'react';
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

  it('mostra o contador junto do rótulo da aba', () => {
    renderWithProviders(
      <Tabs
        tabs={[
          { value: 'a', label: 'Participantes', count: 10, children: <p>lista</p> },
          { value: 'b', label: 'Histórico', children: <p>histórico</p> },
        ]}
      />,
    );

    expect(screen.getByRole('tab', { name: 'Participantes 10' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Histórico' })).toBeInTheDocument();
  });
});

describe('Tabs com keepMounted', () => {
  const Counter = () => {
    const [count, setCount] = useState(0);
    return (
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        contador {count}
      </button>
    );
  };

  const panels: Tab[] = [
    { value: 'one', label: 'Primeira', children: <Counter /> },
    { value: 'two', label: 'Segunda', children: <p>conteúdo 2</p> },
  ];

  it('só monta o painel quando a aba é aberta pela primeira vez', () => {
    renderWithProviders(<Tabs tabs={panels} keepMounted />);

    expect(screen.queryByText('conteúdo 2')).not.toBeInTheDocument();
  });

  it('mantém o estado do painel ao trocar de aba e voltar', async () => {
    const { user } = renderWithProviders(<Tabs tabs={panels} keepMounted />);

    await user.click(screen.getByRole('button', { name: 'contador 0' }));
    await user.click(screen.getByRole('tab', { name: 'Segunda' }));

    expect(screen.getByRole('tabpanel', { name: 'Segunda' })).toHaveTextContent('conteúdo 2');
    expect(screen.queryByRole('tabpanel', { name: 'Primeira' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Primeira' }));

    expect(screen.getByRole('button', { name: 'contador 1' })).toBeInTheDocument();
  });
});

describe('Tabs sem painel', () => {
  it('mostra só a lista de abas, sem tabpanel nem aria-controls', () => {
    renderWithProviders(
      <Tabs
        tabs={[
          { value: 'one', label: 'Primeira' },
          { value: 'two', label: 'Segunda' },
        ]}
        showPanels={false}
      />,
    );

    expect(screen.getAllByRole('tab')).toHaveLength(2);
    expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Primeira' })).not.toHaveAttribute('aria-controls');
  });

  it('com panelId, as abas controlam o painel externo', () => {
    renderWithProviders(
      <>
        <Tabs
          tabs={[
            { value: 'one', label: 'Primeira' },
            { value: 'two', label: 'Segunda' },
          ]}
          showPanels={false}
          panelId="painel-externo"
        />
        <div role="tabpanel" id="painel-externo" aria-labelledby="tab-one">
          conteúdo externo
        </div>
      </>,
    );

    const panel = screen.getByRole('tabpanel', { name: 'Primeira' });
    expect(panel).toHaveTextContent('conteúdo externo');
    expect(screen.getByRole('tab', { name: 'Primeira' })).toHaveAttribute(
      'aria-controls',
      panel.id,
    );
    expect(screen.getByRole('tab', { name: 'Segunda' })).toHaveAttribute('aria-controls', panel.id);
  });

  it('ocupa 100% da largura, e só o tamanho das abas com fit', () => {
    const tabs = [{ value: 'one', label: 'Primeira' }];
    const { rerender } = renderWithProviders(<Tabs tabs={tabs} showPanels={false} />);

    expect(screen.getByRole('tablist').parentElement).toHaveStyle({ width: '100%' });

    rerender(<Tabs tabs={tabs} showPanels={false} fit />);

    expect(screen.getByRole('tablist').parentElement).toHaveStyle({ width: 'auto' });
  });

  it('continua trocando de aba e avisando onChange', async () => {
    const onChange = jest.fn();
    const { user } = renderWithProviders(
      <Tabs
        tabs={[
          { value: 'one', label: 'Primeira' },
          { value: 'two', label: 'Segunda' },
        ]}
        showPanels={false}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole('tab', { name: 'Segunda' }));

    expect(onChange).toHaveBeenCalledWith('two');
    expect(screen.getByRole('tab', { name: 'Segunda' })).toHaveAttribute('aria-selected', 'true');
  });
});
