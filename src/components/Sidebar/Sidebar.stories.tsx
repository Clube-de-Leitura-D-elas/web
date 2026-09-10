import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router';
import { Sidebar } from './Sidebar';

const meta = {
  title: 'Componentes/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Painel lateral de navegação do painel de gestão, com os dois estados do Figma:',
          'aberto (248px, com rótulos) e fechado (72px, só ícones).',
          '',
          'O botão redondo na quina superior direita alterna entre os dois.',
          'O item da rota atual aparece como uma pílula na cor da marca.',
          '',
          '### Como importar',
          '',
          '```tsx',
          "import { Sidebar } from '../components/Sidebar/Sidebar';",
          '```',
          '',
          '### Como usar',
          '',
          'Do jeito mais simples, o painel guarda sozinho se está aberto ou fechado:',
          '',
          '```tsx',
          "<Sidebar user={{ name: 'Claudine' }} onLogout={sair} />",
          '```',
          '',
          'Se a página precisar saber a largura do painel, controle de fora:',
          '',
          '```tsx',
          'const [fechado, setFechado] = useState(false);',
          '',
          '<Sidebar',
          "  user={{ name: 'Claudine' }}",
          '  collapsed={fechado}',
          '  onToggleCollapse={() => setFechado((valor) => !valor)}',
          '/>',
          '```',
          '',
          'Para acrescentar uma tela ao menu, inclua uma linha em `NAV_ITEMS`, no',
          '`Sidebar.tsx`, e registre a rota em `src/App.tsx`.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    user: { description: 'Usuária logada, exibida no rodapé do painel.' },
    collapsed: {
      control: 'boolean',
      description: 'Controla o painel de fora. Sem esta prop, ele controla a si mesmo.',
    },
    defaultCollapsed: {
      control: 'boolean',
      description: 'Estado inicial quando o painel se controla sozinho. Padrão: aberto.',
    },
    onToggleCollapse: { description: 'Chamado a cada clique no botão da quina.' },
    onLogout: { description: 'Chamado ao clicar em "Sair".' },
    onNavigate: { description: 'Chamado ao clicar em um item do menu.' },
  },
  args: { user: { name: 'Claudine' } },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/grupos']}>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof Sidebar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Aberto: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Estado aberto: marca, rótulos, divisória e o card da usuária.',
      },
    },
  },
};

export const Fechado: Story = {
  args: { defaultCollapsed: true },
  parameters: {
    docs: {
      description: {
        story: 'Estado fechado: a logo no topo, só os ícones e o avatar.',
      },
    },
  },
};

export const Estados: Story = {
  render: (args) => (
    <div style={{ display: 'flex' }}>
      <Sidebar {...args} collapsed={false} />
      <Sidebar {...args} collapsed />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Os dois estados lado a lado, para comparar.',
      },
    },
  },
};

export const ItemAtivo: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/participantes']}>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'O item ativo acompanha a rota. Aqui a story está em `/participantes`.',
      },
    },
  },
};
