import { screen } from '@testing-library/react';
import { interpolate, locale } from '../../locales';
import { renderWithProviders } from '../../test/render';
import { RemoveFromGroupModal, type RemoveFromGroupModalProps } from '.';

const text = locale.removeFromGroup;

const renderModal = (props: Partial<RemoveFromGroupModalProps> = {}) => {
  const onConfirm = jest.fn();
  const view = renderWithProviders(
    <RemoveFromGroupModal
      isOpen
      personName="Ana Souza"
      groupLabel="Grupo 03"
      isCoordinator={false}
      onClose={jest.fn()}
      onConfirm={onConfirm}
      {...props}
    />,
  );
  return { ...view, onConfirm };
};

describe('RemoveFromGroupModal', () => {
  it('confirma a remoção de quem não é coordenadora', async () => {
    const { user, onConfirm } = renderModal();

    expect(
      screen.getByRole('dialog', {
        name: interpolate(text.title, { name: 'Ana Souza', group: 'Grupo 03' }),
      }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: text.confirm }));

    expect(onConfirm).toHaveBeenCalledWith(null);
  });

  it('exige escolher quem assume quando é a única coordenadora', async () => {
    const { user, onConfirm } = renderModal({
      isCoordinator: true,
      candidates: [{ id: 'p2', name: 'Bia Lima' }],
    });

    expect(screen.getByRole('button', { name: text.confirm })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: new RegExp(text.newCoordinator) }));
    await user.click(screen.getByRole('option', { name: 'Bia Lima' }));
    await user.click(screen.getByRole('button', { name: text.confirm }));

    expect(onConfirm).toHaveBeenCalledWith('p2');
  });

  it('bloqueia de novo quando a escolhida sai da lista de candidatas', async () => {
    const { user, rerender } = renderModal({
      isCoordinator: true,
      candidates: [{ id: 'p2', name: 'Bia Lima' }],
    });
    await user.click(screen.getByRole('button', { name: new RegExp(text.newCoordinator) }));
    await user.click(screen.getByRole('option', { name: 'Bia Lima' }));

    rerender(
      <RemoveFromGroupModal
        isOpen
        personName="Ana Souza"
        groupLabel="Grupo 03"
        isCoordinator
        candidates={[]}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: text.confirm })).toBeDisabled();
    expect(screen.getByText(interpolate(text.noCandidates, { name: 'Ana' }))).toBeInTheDocument();
  });

  it('mostra o erro e trava os botões enquanto salva', () => {
    renderModal({ saving: true, error: 'Falhou' });

    expect(screen.getByRole('alert')).toHaveTextContent('Falhou');
    expect(screen.getByRole('button', { name: text.removing })).toBeDisabled();
    expect(screen.getByRole('button', { name: text.cancel })).toBeDisabled();
  });
});
