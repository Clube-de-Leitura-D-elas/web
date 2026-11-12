import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Tabs } from '.';
import { Tag } from '../Tag';

const meta = {
  title: 'Componentes/Tab',
  component: Tabs,
  parameters: {
    docs: {
      description: {
        component: [
          'Componente de abas genérico: cada aba pode exibir qualquer tipo de conteúdo (texto, lista, tabela, outro componente etc).',
          'Pode ser usado de forma não controlada (o componente guarda o estado sozinho) ou controlada (passando `active` + `onChange`).',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof Tabs>;

export const NaoControlado: Story = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <Tabs
        defaultActive="participantes"
        tabs={[
          {
            value: 'participantes',
            label: 'Participantes (2)',
            children: (
              <ul>
                <li>Maria Silva</li>
                <li>Joana Souza</li>
              </ul>
            ),
          },
          {
            value: 'solicitacoes',
            label: 'Solicitações (1)',
            children: <p>Pedido de entrada de Ana Costa aguardando aprovação.</p>,
          },
          {
            value: 'tags',
            label: 'Tags',
            children: <Tag>Exemplo de componente dentro da aba</Tag>,
          },
        ]}
      />
    </div>
  ),
};

export const Controlado: Story = {
  render: () => {
    const ControlledExample = () => {
      const [active, setActive] = useState('resumo');

      return (
        <div style={{ maxWidth: 480 }}>
          <Tabs
            active={active}
            onChange={setActive}
            size="lg"
            tabs={[
              {
                value: 'resumo',
                label: 'Resumo',
                children: <p>Visão geral do clube de leitura.</p>,
              },
              { value: 'membros', label: 'Membros', children: <p>Lista de membros aqui.</p> },
            ]}
          />
          <p style={{ marginTop: 16 }}>Aba ativa (controlada por fora): {active}</p>
        </div>
      );
    };

    return <ControlledExample />;
  },
};

// Só a lista de abas, sem painel: o conteúdo fica fora do componente (ex.: ao lado do título de um card).
export const SemPainel: Story = {
  render: () => {
    const WithoutPanelExample = () => {
      const [active, setActive] = useState('1y');

      return (
        <div style={{ maxWidth: 480 }}>
          <Tabs
            active={active}
            onChange={setActive}
            showPanels={false}
            panelId="painel-periodo"
            tabs={[
              { value: '6m', label: '6 meses' },
              { value: '1y', label: '1 ano' },
              { value: '2y', label: '2 anos' },
            ]}
          />
          <p
            role="tabpanel"
            id="painel-periodo"
            aria-labelledby={`tab-${active}`}
            style={{ marginTop: 16 }}
          >
            Período escolhido: {active}
          </p>
        </div>
      );
    };

    return <WithoutPanelExample />;
  },
};

// Tamanho compacto, para espaços menores (ex.: linha do título de um card).
export const Compacta: Story = {
  args: {
    size: 'sm',
    tabs: [
      { value: 'month', label: 'Mês', children: <p>Visão por mês.</p> },
      { value: 'week', label: 'Semana', children: <p>Visão por semana.</p> },
    ],
  },
};

// `fit`: a lista ocupa só o tamanho das abas e deixa espaço para outros itens ao lado.
export const AoLadoDeOutrosItens: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, maxWidth: 480 }}>
      <Tabs
        size="sm"
        fit
        showPanels={false}
        tabs={[
          { value: '6m', label: '6 meses' },
          { value: '1y', label: '1 ano' },
        ]}
      />
      <span>outro item</span>
    </div>
  ),
};
