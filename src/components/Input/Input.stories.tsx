import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './index';

const meta = {
  title: 'Componentes/Input',
  component: Input,
  parameters: {
    docs: {
      description: {
        component: [
          'Campo de texto com label acima (sempre obrigatório) e texto auxiliar abaixo.',
          'Variantes de tamanho md e lg. Estados: padrão, focus, error e disabled.',
          '',
          '### Como importar',
          '',
          'tsx',
          "import { Input } from '../components/Input/';",
          '',
          '',
          '### Como usar',
          '',
          'tsx',
          '<Input id="nome" label="Nome" placeholder="Digite seu nome" helperText="Como você quer ser chamada no clube" />',
          '<Input id="email" label="E-mail" size="lg" error="E-mail inválido" />',
          '',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    label: { control: 'text', description: 'Texto do label, sempre acima do campo.' },
    size: {
      control: 'inline-radio',
      options: ['md', 'lg'],
      description: "Tamanho do campo. Padrão: 'md'.",
    },
    helperText: { control: 'text', description: 'Texto auxiliar abaixo do campo.' },
    error: {
      control: 'text',
      description: 'Mensagem de erro — quando preenchida, substitui o helperText.',
    },
    disabled: { control: 'boolean' },
  },
  args: {
    id: 'nome',
    label: 'Nome',
    placeholder: 'Digite seu nome',
    helperText: 'Como você quer ser chamada no clube',
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  args: { size: 'md' },
};

export const Lg: Story = {
  args: { size: 'lg' },
};

export const Erro: Story = {
  args: { error: 'Campo obrigatório', helperText: undefined },
};

export const Desabilitado: Story = {
  args: { disabled: true, defaultValue: 'Não editável' },
};

export const Variantes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 320 }}>
      <Input
        id="v-md"
        label="Nome (md)"
        placeholder="Digite seu nome"
        helperText="Como você quer ser chamada no clube"
      />
      <Input
        id="v-lg"
        label="Nome (lg)"
        size="lg"
        placeholder="Digite seu nome"
        helperText="Como você quer ser chamada no clube"
      />
      <Input id="v-erro" label="Nome" error="Campo obrigatório" />
      <Input
        id="v-disabled"
        label="Nome"
        disabled
        defaultValue="Não editável"
        helperText="desabilitado"
      />
    </div>
  ),
};
