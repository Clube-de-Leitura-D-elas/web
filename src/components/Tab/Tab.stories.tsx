import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Tabs } from '.';
import { Tag } from '../Tag/Tag';

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
