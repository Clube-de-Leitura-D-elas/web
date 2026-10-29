import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/render';
import { ActionMenu } from '.';

const renderMenu = () => {
  const onEdit = jest.fn();
  const onDelete = jest.fn();
  const view = renderWithProviders(
    <>
      <ActionMenu
        items={[
          { label: 'Editar', onClick: onEdit },
          { label: 'Excluir', onClick: onDelete, variant: 'danger' },
        ]}
      />
      <button type="button">fora</button>
    </>,
  );
  return { ...view, onEdit, onDelete, trigger: screen.getByRole('button', { name: 'Mais ações' }) };
};

describe('ActionMenu', () => {
  it('começa fechado e abre pelo botão', async () => {
    const { user, trigger } = renderMenu();
    expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();

    await user.click(trigger);

    expect(screen.getAllByRole('menuitem')).toHaveLength(2);
  });

  it('executa a ação e fecha o menu', async () => {
    const { user, trigger, onDelete } = renderMenu();

    await user.click(trigger);
    await user.click(screen.getByRole('menuitem', { name: 'Excluir' }));

    expect(onDelete).toHaveBeenCalled();
    expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();
  });

  it('fecha com Esc', async () => {
    const { user, trigger } = renderMenu();

    await user.click(trigger);
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();
  });

  it('fecha ao clicar fora', async () => {
    const { user, trigger } = renderMenu();

    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'fora' }));

    expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();
  });
});
