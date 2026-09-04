/**
 * Stories do Input.
 *
 * Quando implementar o componente: descomente o import, apague a story `Placeholder`
 * e crie uma story por variante. Use `src/components/Tag/Tag.stories.tsx` como modelo.
 */
import type { Meta, StoryObj } from '@storybook/react-vite';

// import { Input } from './Input';

const meta: Meta = {
  title: 'Componentes/Input',
};

export default meta;

export const Placeholder: StoryObj = {
  render: () => <p>Input ainda não implementado — ver o card do Input no Kanban.</p>,
};
