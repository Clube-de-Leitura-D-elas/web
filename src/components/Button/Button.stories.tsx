import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta = {
  title: 'Componentes/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: [
          'Botão padrão do Clube de Leitura D’Elas.',
          'Suporta variantes semânticas, três opções de tamanho e estados interativos.',
          '',
          '### Como importar',
          '```tsx',
          "import { Button } from '../components/Button/Button';",
          '```',
          '',
          '### Como usar',
          '```tsx',
          '<Button variant="primary">Confirmar</Button>',
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Texto exibido dentro do botão.',
    },
    variant: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'ghost', 'danger'],
      description: 'Estilo visual da variante.',
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      description: 'Tamanho e espaçamento do botão.',
    },
    icon: {
      control: false,
      description: 'Elemento de ícone posicionado antes do texto.',
    },
    disabled: {
      control: 'boolean',
      description: 'Estado desabilitado.',
    },
    onClick: { action: 'clicked' },
  },
  args: {
    children: 'Confirmar',
    variant: 'primary',
    size: 'md',
    disabled: false,
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Variante padrão para a ação principal da tela. */
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Confirmar',
  },
};

/** Variante secundária com contorno para diálogos e ações de suporte. */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Cancelar',
  },
};

/** Variante discreta sem fundo ou borda visíveis por padrão. */
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ver mais',
  },
};

/** Ação destrutiva confirmada. */
export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Excluir',
  },
};

/** Estado desabilitado com cursor bloqueado e cores neutras. */
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Confirmar',
  },
};

/** Todas as variantes no tamanho médio (md) lado a lado, conforme o Figma. */
export const Variantes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
      <Button variant="primary">Confirmar</Button>
      <Button variant="secondary">Cancelar</Button>
      <Button variant="ghost">Ver mais</Button>
      <Button variant="danger">Excluir</Button>
    </div>
  ),
};

/** Comparação dos três tamanhos: Sm (32px), Md (40px) e Lg (56px). */
export const Tamanhos: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
      <Button size="sm">Sm - 32px</Button>
      <Button size="md">Md - 40px</Button>
      <Button size="lg">Lg - 56px</Button>
    </div>
  ),
};
/** Exemplo de ícone de verificação em SVG */
const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/** Botão com ícone opcional posicionado à esquerda do texto. */
export const ComIcone: Story = {
  args: {
    variant: 'primary',
    children: 'Confirmar',
    icon: <CheckIcon />,
  },
};

/** Todas as variantes acompanhadas de ícone. */
export const VariantesComIcone: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
      <Button variant="primary" icon={<CheckIcon />}>
        Confirmar
      </Button>
      <Button variant="secondary" icon={<CheckIcon />}>
        Cancelar
      </Button>
      <Button variant="ghost" icon={<CheckIcon />}>
        Ver mais
      </Button>
      <Button variant="danger" icon={<CheckIcon />}>
        Excluir
      </Button>
    </div>
  ),
};
