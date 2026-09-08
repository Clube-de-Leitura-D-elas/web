/**
 * Stories do Tag — EXEMPLO DE REFERÊNCIA.
 *
 * Siga este formato nos outros componentes:
 *  - `meta` descreve o componente e as suas props (`argTypes`);
 *  - cada `export const` vira uma story na barra lateral;
 */
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tag } from './Tag';

const meta = {
  title: 'Componentes/Tag',
  component: Tag,
  parameters: {
    docs: {
      description: {
        component: [
          'Etiqueta de papel ou status. Fundo claro, sem borda, formato pill.',
          'Primary para papéis do clube, Neutral para rótulos sem destaque.',
          '',
          '### Como importar',
          '',
          '```tsx',
          "import { Tag } from '../components/Tag/Tag';",
          '```',
          '',
          '### Como usar',
          '',
          'O texto vai como `children`, entre as tags de abertura e fechamento:',
          '',
          '```tsx',
          '<Tag>Gestora</Tag>',
          '<Tag color="primary">Coordenadora</Tag>',
          '<Tag color="neutral">Ficção</Tag>',
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Conteúdo da tag — normalmente um texto curto.',
    },
    color: {
      control: 'inline-radio',
      options: ['primary', 'neutral'],
      description: "Variante de cor. Padrão: 'primary'.",
    },
  },
  args: { children: 'Gestora', color: 'primary' },
} satisfies Meta<typeof Tag>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Papéis do clube: fundo `surfaceBrandSoft`, texto `textBrand`.
 *
 * ```tsx
 * <Tag>Gestora</Tag>
 * ```
 */
export const Primary: Story = {
  args: { children: 'Gestora', color: 'primary' },
};

/**
 * Rótulos sem destaque: fundo `surfaceSunken`, texto `text`.
 *
 * ```tsx
 * <Tag color="neutral">Leitora</Tag>
 * ```
 */
export const Neutral: Story = {
  args: { children: 'Leitora', color: 'neutral' },
};

/** As duas variantes lado a lado, para comparar. */
export const Variantes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Tag>Primary</Tag>
      <Tag color="neutral">Neutral</Tag>
    </div>
  ),
};

export const PapeisDoClube: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Tag>Gestora</Tag>
      <Tag>Coordenadora</Tag>
      <Tag>Leitora</Tag>
      <Tag>Apoio</Tag>
    </div>
  ),
};

export const RotulosNeutros: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Tag color="neutral">Ficção</Tag>
      <Tag color="neutral">Encerrado</Tag>
      <Tag color="neutral">Mensal</Tag>
      <Tag color="neutral">Presencial</Tag>
    </div>
  ),
};
