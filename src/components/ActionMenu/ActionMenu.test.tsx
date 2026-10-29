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

  describe('posição', () => {
    const rect = (top: number) =>
      ({ top, bottom: top + 32, left: 900, right: 932, width: 32, height: 32 }) as DOMRect;

    beforeEach(() => {
      Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800 });
      Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1000 });
      jest.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(100);
    });

    afterEach(() => jest.restoreAllMocks());

    it('abre abaixo do botão quando cabe', async () => {
      const { user, trigger } = renderMenu();
      jest.spyOn(trigger, 'getBoundingClientRect').mockReturnValue(rect(100));

      await user.click(trigger);

      expect(screen.getAllByRole('menuitem')[0].parentElement).toHaveStyle({
        top: '136px',
        right: '68px',
      });
    });

    it('abre acima do botão quando não cabe abaixo (ex.: última linha da tabela)', async () => {
      const { user, trigger } = renderMenu();
      jest.spyOn(trigger, 'getBoundingClientRect').mockReturnValue(rect(740));

      await user.click(trigger);

      expect(screen.getAllByRole('menuitem')[0].parentElement).toHaveStyle({ top: '636px' });
    });
  });
});
