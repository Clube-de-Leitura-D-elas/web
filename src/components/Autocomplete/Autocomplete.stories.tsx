import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Autocomplete } from './index';

const options = [
  { value: '1', label: 'Porto Alegre' },
  { value: '2', label: 'São Paulo' },
  { value: '3', label: 'São Leopoldo' },
  { value: '4', label: 'Porto Alegre — Zona Sul' },
  { value: '5', label: 'Canoas' },
];

const meta = {
  title: 'Componentes/Autocomplete',
  component: Autocomplete,
  args: {
    label: 'Cidade ou Zona',
    placeholder: 'Digite uma cidade ou zona',
    options,
    value: null,
    onChange: () => {},
  },
} satisfies Meta<typeof Autocomplete>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  render: (args) => {
    // Storybook precisa manter o valor selecionado como estado externo.
    const Example = () => {
      const [value, setValue] = useState<string | null>(null);

      return (
        <div style={{ width: 340 }}>
          <Autocomplete {...args} value={value} onChange={setValue} />
        </div>
      );
    };

    return <Example />;
  },
};

export const Desabilitado: Story = {
  args: {
    disabled: true,
  },
};

export const ComErro: Story = {
  args: {
    error: 'Selecione uma opção cadastrada',
  },
};
