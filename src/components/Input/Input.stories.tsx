import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Input } from './index';

const meta = {
  title: 'Componentes/Input',
  component: Input,
  parameters: {
    docs: {
      description: {
        component: [
          'Campo de texto com label acima (sempre obrigatório) e texto auxiliar abaixo.',
          '',
          '### Estados',
          '',
          'Todos os estados têm uma story própria, com o mesmo conteúdo, para facilitar a comparação:',
          '',
          '- **Padrão**: campo em repouso.',
          '- **Hover**: cursor sobre o campo.',
          '- **Foco**: campo focado pelo teclado ou clique.',
          '- **Erro**: `error` preenchido substitui o `helperText`.',
          '- **Desabilitado**: `disabled`, sem interação.',
          '',
          '### Como importar',
          '',
          '```tsx',
          "import { Input } from '../components/Input';",
          '```',
          '',
          '### Como usar',
          '',
          '```tsx',
          '<Input id="nome" label="Nome" placeholder="Digite seu nome" helperText="Como você quer ser chamada no clube" />',
          '<Input id="email" label="E-mail" size="lg" error="E-mail inválido" />',
          '```',
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
      description: 'Mensagem de erro. Quando preenchida, substitui o helperText.',
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
  name: 'Padrão',
};

export const Hover: Story = {
  parameters: {
    pseudo: { hover: true },
  },
};

export const Foco: Story = {
  play: async ({ canvasElement }) => {
    const campo = within(canvasElement).getByLabelText('Nome');
    await userEvent.click(campo);
    await expect(campo).toHaveFocus();
  },
};

export const Erro: Story = {
  args: {
    error: 'Campo obrigatório',
  },
};

export const Desabilitado: Story = {
  args: {
    disabled: true,
    defaultValue: 'Não editável',
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByLabelText('Nome')).toBeDisabled();
  },
};

const estados = [
  { chave: 'padrao', titulo: 'Padrão' },
  { chave: 'hover', titulo: 'Hover' },
  { chave: 'foco', titulo: 'Foco' },
  { chave: 'erro', titulo: 'Erro' },
  { chave: 'desabilitado', titulo: 'Desabilitado' },
] as const;

const tamanhos = ['md', 'lg'] as const;

export const TodosOsEstados: Story = {
  name: 'Todos os estados',
  parameters: {
    layout: 'padded',
    pseudo: {
      hover: ['#estado-hover-md', '#estado-hover-lg'],
      focus: ['#estado-foco-md', '#estado-foco-lg'],
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {tamanhos.map((tamanho) => (
        <section key={tamanho}>
          <h3 style={{ margin: '0 0 12px' }}>Tamanho {tamanho}</h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 24,
            }}
          >
            {estados.map(({ chave, titulo }) => (
              <Input
                key={chave}
                id={`estado-${chave}-${tamanho}`}
                size={tamanho}
                label={titulo}
                placeholder="Digite seu nome"
                helperText={chave === 'erro' ? undefined : 'Como você quer ser chamada no clube'}
                error={chave === 'erro' ? 'Campo obrigatório' : undefined}
                disabled={chave === 'desabilitado'}
                defaultValue={chave === 'desabilitado' ? 'Não editável' : undefined}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
};
