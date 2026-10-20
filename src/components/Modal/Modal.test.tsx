import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/render';
import { Modal, type ModalProps } from '.';

const renderModal = (props: Partial<ModalProps> = {}) => {
  const onClose = jest.fn();
  const onConfirm = jest.fn();
  const view = renderWithProviders(
    <Modal
      isOpen
      title="Encerrar grupo?"
      description="Essa ação pode ser desfeita."
      confirmText="Encerrar"
      onClose={onClose}
      onConfirm={onConfirm}
      {...props}
    />,
  );
  return { ...view, onClose, onConfirm };
};

describe('Modal', () => {
  it('não renderiza nada fechado', () => {
    renderModal({ isOpen: false });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('é um diálogo nomeado pelo título', () => {
    renderModal();

    expect(screen.getByRole('dialog', { name: 'Encerrar grupo?' })).toHaveAttribute(
      'aria-modal',
      'true',
    );
    expect(screen.getByText('Essa ação pode ser desfeita.')).toBeInTheDocument();
  });

  it('confirma pelo botão principal', async () => {
    const { user, onConfirm } = renderModal();

    await user.click(screen.getByRole('button', { name: 'Encerrar' }));

    expect(onConfirm).toHaveBeenCalled();
  });

  it('desabilita a confirmação', () => {
    renderModal({ confirmDisabled: true });

    expect(screen.getByRole('button', { name: 'Encerrar' })).toBeDisabled();
  });

  it.each(['Cancelar', 'Fechar'])('fecha pelo botão %s', async (name) => {
    const { user, onClose } = renderModal();

    await user.click(screen.getByRole('button', { name }));

    expect(onClose).toHaveBeenCalled();
  });

  it('fecha com Esc', async () => {
    const { user, onClose } = renderModal();

    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalled();
  });

  it('fecha ao clicar no fundo, mas não ao clicar dentro', async () => {
    const { user, onClose } = renderModal({ children: <p>conteúdo</p> });
    const dialog = screen.getByRole('dialog');

    await user.click(screen.getByText('conteúdo'));
    expect(onClose).not.toHaveBeenCalled();

    await user.click(dialog.parentElement!);
    expect(onClose).toHaveBeenCalled();
  });

  it('foca o elemento marcado com data-autofocus ao abrir', () => {
    renderModal({ children: <input aria-label="Nome" data-autofocus /> });

    expect(screen.getByLabelText('Nome')).toHaveFocus();
  });

  it('mantém o Tab preso dentro do diálogo', async () => {
    const { user } = renderModal();
    const close = screen.getByRole('button', { name: 'Fechar' });
    const confirm = screen.getByRole('button', { name: 'Encerrar' });
    expect(close).toHaveFocus();

    await user.tab({ shift: true });
    expect(confirm).toHaveFocus();

    await user.tab();
    expect(close).toHaveFocus();
  });

  it('devolve o foco para quem abriu ao fechar', () => {
    const { rerender } = renderWithProviders(
      <>
        <button type="button">abrir</button>
        <Modal isOpen={false} title="T" confirmText="Ok" onClose={() => {}} onConfirm={() => {}} />
      </>,
    );
    const opener = screen.getByRole('button', { name: 'abrir' });
    opener.focus();

    const renderOpen = (isOpen: boolean) => (
      <>
        <button type="button">abrir</button>
        <Modal isOpen={isOpen} title="T" confirmText="Ok" onClose={() => {}} onConfirm={() => {}} />
      </>
    );
    rerender(renderOpen(true));
    expect(opener).not.toHaveFocus();

    rerender(renderOpen(false));
    expect(opener).toHaveFocus();
  });
});
