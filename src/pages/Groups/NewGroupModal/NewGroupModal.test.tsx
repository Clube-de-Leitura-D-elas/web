import { screen, waitFor } from '@testing-library/react';
import { locale } from '../../../locales';
import { GroupServiceError } from '../../../services/groupErrors';
import { pending, renderWithProviders } from '../../../test/render';
import { NewGroupModal, type NewGroupModalProps } from '.';

const text = locale.groups.newGroupModal;

const cities = [
  { value: 'poa', label: 'Porto Alegre' },
  { value: 'poa-sul', label: 'Porto Alegre — Zona Sul' },
];
const coordinators = [{ value: 'u1', label: 'Joana Alves' }];

const renderModal = (props: Partial<NewGroupModalProps> = {}) => {
  const onClose = jest.fn();
  const onSave = jest.fn();
  const createGroupRequest = jest.fn().mockResolvedValue({ id: 'g43' });
  const loadOptionsRequest = jest.fn().mockResolvedValue([cities, coordinators, 43]);
  const view = renderWithProviders(
    <NewGroupModal
      isOpen
      onClose={onClose}
      onSave={onSave}
      createGroupRequest={createGroupRequest}
      loadOptionsRequest={loadOptionsRequest}
      {...props}
    />,
  );
  return { ...view, onClose, onSave, createGroupRequest, loadOptionsRequest };
};

const saveButton = () => screen.getByRole('button', { name: text.save });
const cityInput = () => screen.getByRole('combobox', { name: text.city.label });
const nameInput = () => screen.getByLabelText(text.name.label);

const fillForm = async (user: ReturnType<typeof renderModal>['user']) => {
  await waitFor(() => expect(cityInput()).toBeEnabled());
  await user.type(cityInput(), 'zona');
  await user.click(screen.getByRole('option', { name: 'Porto Alegre — Zona Sul' }));
};

describe('NewGroupModal', () => {
  it('não renderiza nada fechado', () => {
    renderModal({ isOpen: false });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('desabilita a cidade e o salvar enquanto carrega as opções', () => {
    renderModal({ loadOptionsRequest: () => pending() });

    expect(screen.getByRole('dialog', { name: text.title })).toBeInTheDocument();
    expect(cityInput()).toBeDisabled();
    expect(cityInput()).toHaveAccessibleDescription(text.city.loading);
    expect(nameInput()).toHaveValue('');
    expect(nameInput()).toHaveAttribute('placeholder', text.name.loading);
    expect(saveButton()).toBeDisabled();
  });

  it('avisa quando as opções não carregam', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    renderModal({ loadOptionsRequest: () => Promise.reject(new Error('500')) });

    expect(await screen.findByRole('alert')).toHaveTextContent(text.errors.loadOptions);
    expect(cityInput()).toBeDisabled();
  });

  it('preenche o nome com o próximo número, sem deixar editar', async () => {
    renderModal();

    await waitFor(() => expect(nameInput()).toHaveValue('Grupo - 43'));
    expect(nameInput()).toBeDisabled();
    expect(nameInput()).toHaveAccessibleDescription(text.name.helperText);
  });

  it('completa números de um dígito com zero à esquerda', async () => {
    renderModal({ loadOptionsRequest: () => Promise.resolve([cities, coordinators, 7]) });

    await waitFor(() => expect(nameInput()).toHaveValue('Grupo - 07'));
  });

  it('só libera o salvar com a cidade escolhida', async () => {
    const { user } = renderModal();
    await waitFor(() => expect(cityInput()).toBeEnabled());
    expect(saveButton()).toBeDisabled();

    await user.type(cityInput(), 'porto');
    expect(saveButton()).toBeDisabled();

    await user.click(screen.getByRole('option', { name: 'Porto Alegre' }));
    expect(saveButton()).toBeEnabled();
  });

  it('cria o grupo sem coordenadora', async () => {
    const { user, createGroupRequest, onSave } = renderModal();

    await fillForm(user);
    await user.click(saveButton());

    expect(createGroupRequest).toHaveBeenCalledWith({
      cityId: 'poa-sul',
      coordinatorId: null,
    });
    await waitFor(() => expect(onSave).toHaveBeenCalled());
  });

  it('cria o grupo com a coordenadora escolhida', async () => {
    const { user, createGroupRequest } = renderModal();

    await fillForm(user);
    await user.click(screen.getByRole('button', { name: new RegExp(text.coordinator.label) }));
    await user.click(screen.getByRole('option', { name: 'Joana Alves' }));
    await user.click(saveButton());

    expect(createGroupRequest).toHaveBeenCalledWith(
      expect.objectContaining({ coordinatorId: 'u1' }),
    );
  });

  it('avisa quando o número gerado já foi usado', async () => {
    const { user, onSave } = renderModal({
      createGroupRequest: () => Promise.reject(new GroupServiceError('duplicate_number')),
    });

    await fillForm(user);
    await user.click(saveButton());

    expect(await screen.findByRole('alert')).toHaveTextContent(text.errors.duplicate);
    expect(onSave).not.toHaveBeenCalled();
  });

  it('mostra uma mensagem genérica para outros erros', async () => {
    const { user } = renderModal({
      createGroupRequest: () => Promise.reject(new Error('500')),
    });

    await fillForm(user);
    await user.click(saveButton());

    expect(await screen.findByRole('alert')).toHaveTextContent(text.errors.generic);
  });

  it('não fecha enquanto salva', async () => {
    const { user, onClose } = renderModal({ createGroupRequest: () => pending() });

    await fillForm(user);
    await user.click(saveButton());

    expect(screen.getByRole('button', { name: text.saving })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('fecha pelo cancelar', async () => {
    const { user, onClose } = renderModal();

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(onClose).toHaveBeenCalled();
  });
});
