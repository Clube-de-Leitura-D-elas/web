import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { Dropdown } from '.';

const mockOptions = [
  { label: 'Romance', value: 'romance' },
  { label: 'Fantasia', value: 'fantasia' },
  { label: 'Suspense', value: 'suspense' },
  { label: 'Não-ficção', value: 'nao-ficcao' },
];

const meta: Meta<typeof Dropdown> = {
  title: 'Componentes/Dropdown',
  component: Dropdown,
  parameters: {
    docs: {
      description: {
        component: [
          'Lista suspensa com label acima e texto auxiliar abaixo.',
          '',
          '### Estados',
          '',
          '- **Padrão**: campo em repouso.',
          '- **Hover**: cursor sobre o campo.',
          '- **Foco**: campo focado pelo teclado.',
          '- **Erro**: `isError` ativo, com a mensagem no `helperText`.',
          '- **Desabilitado**: `disabled`, sem interação.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['md', 'lg'],
      description: "Tamanho do campo. Padrão: 'md'.",
    },
    isError: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    label: 'Gênero',
    placeholder: 'Selecione um gênero',
    helperText: 'Escolha o gênero do próximo encontro',
    options: mockOptions,
    size: 'md',
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

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
    // Navega por teclado até o primeiro elemento focável do componente.
    await userEvent.tab();
    await expect(canvasElement.contains(document.activeElement)).toBe(true);
  },
};

export const Erro: Story = {
  args: {
    isError: true,
    helperText: 'Você precisa selecionar uma opção obrigatória.',
  },
};

export const Desabilitado: Story = {
  args: {
    disabled: true,
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
  render: (args) => (
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
              <div key={chave} id={`estado-${chave}-${tamanho}`}>
                <Dropdown
                  {...args}
                  size={tamanho}
                  label={titulo}
                  isError={chave === 'erro'}
                  disabled={chave === 'desabilitado'}
                  helperText={
                    chave === 'erro'
                      ? 'Você precisa selecionar uma opção obrigatória.'
                      : 'Escolha o gênero do próximo encontro'
                  }
                />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
};
