import { screen, within } from '@testing-library/react';
import { locale } from '../../../locales';
import { CityServiceError } from '../../../services/cityErrors';
import { renderWithProviders } from '../../../test/render';
import { MAX_LOCATION_NAME_LENGTH, type CityListItem } from '../../../types/city';
import { CityModal } from '.';

jest.mock('../../../services/cityService', () => ({ saveCity: jest.fn() }));

const text = locale.settings.cities.modal;

const city: CityListItem = {
  id: 'bh',
  name: 'Belo Horizonte',
  uf: 'MG',
  isActive: true,
  groups: 1,
  activeGroups: 1,
  zones: [
    { id: 'savassi', name: 'Savassi', isActive: true, activeGroups: 1 },
    { id: 'pampulha', name: 'Pampulha', isActive: true, activeGroups: 0 },
    { id: 'barreiro', name: 'Barreiro', isActive: false, activeGroups: 0 },
  ],
};

const renderModal = (target: CityListItem | null = city) => {
  const saveRequest = jest.fn().mockResolvedValue('id');
  const onSaved = jest.fn();
  const view = renderWithProviders(
    <CityModal city={target} onClose={jest.fn()} onSaved={onSaved} saveRequest={saveRequest} />,
  );
  const dialog = screen.getByRole('dialog');
  const save = () => view.user.click(within(dialog).getByRole('button', { name: text.save }));
  return { ...view, dialog, save, saveRequest, onSaved };
};

describe('CityModal', () => {
  it('exige nome e estado antes de salvar', async () => {
    const { dialog, save, saveRequest } = renderModal(null);

    await save();

    expect(within(dialog).getByText(text.errors.nameRequired)).toBeInTheDocument();
    expect(within(dialog).getByText(text.errors.ufRequired)).toBeInTheDocument();
    expect(saveRequest).not.toHaveBeenCalled();
  });

  it('limita o nome da cidade e das regiões ao tamanho aceito pelo backend', async () => {
    const { dialog } = renderModal();

    expect(within(dialog).getByLabelText(text.name.label)).toHaveAttribute(
      'maxLength',
      String(MAX_LOCATION_NAME_LENGTH),
    );
    expect(within(dialog).getByLabelText('Região 1')).toHaveAttribute(
      'maxLength',
      String(MAX_LOCATION_NAME_LENGTH),
    );
  });

  it('cria a cidade com as regiões novas, sem espaços sobrando', async () => {
    const { user, dialog, save, saveRequest, onSaved } = renderModal(null);

    await user.type(within(dialog).getByLabelText(text.name.label), '  Canoas  ');
    await user.type(
      within(dialog).getByRole('combobox', { name: text.uf.label }),
      'rio grande do s',
    );
    await user.click(screen.getByRole('option', { name: 'RS — Rio Grande do Sul' }));
    await user.click(within(dialog).getByRole('button', { name: text.zones.add }));
    await user.type(within(dialog).getByLabelText('Região 1'), ' Mathias   Velho ');
    await save();

    expect(saveRequest).toHaveBeenCalledWith({
      cityId: null,
      name: 'Canoas',
      uf: 'RS',
      zones: [{ id: null, name: 'Mathias Velho', isActive: true }],
    });
    expect(onSaved).toHaveBeenCalledWith('Canoas');
  });

  it('acusa região vazia ou repetida na lista', async () => {
    const { user, dialog, save, saveRequest } = renderModal();

    await user.click(within(dialog).getByRole('button', { name: text.zones.add }));
    await save();
    expect(within(dialog).getByText(text.errors.zoneRequired)).toBeInTheDocument();

    await user.type(within(dialog).getByLabelText('Região 4'), 'pampulha');
    await save();
    expect(within(dialog).getByText(text.errors.zoneDuplicate)).toBeInTheDocument();
    expect(saveRequest).not.toHaveBeenCalled();
  });

  it('só aponta erro em região adicionada depois de tentar salvar de novo', async () => {
    const { user, dialog, save } = renderModal(null);

    await save();
    await user.click(within(dialog).getByRole('button', { name: text.zones.add }));
    expect(within(dialog).queryByText(text.errors.zoneRequired)).not.toBeInTheDocument();

    await save();
    expect(within(dialog).getByText(text.errors.zoneRequired)).toBeInTheDocument();
  });

  it('remove uma região nova antes de salvar', async () => {
    const { user, dialog, save, saveRequest } = renderModal();

    await user.click(within(dialog).getByRole('button', { name: text.zones.add }));
    await user.click(within(dialog).getByRole('button', { name: 'Remover Região 4' }));
    await save();

    expect(saveRequest).toHaveBeenCalledTimes(1);
    expect(saveRequest.mock.calls[0][0].zones.map((zone: { id: string }) => zone.id)).toEqual([
      'savassi',
      'pampulha',
      'barreiro',
    ]);
  });

  it('desativa e reativa regiões existentes', async () => {
    const { user, dialog, save, saveRequest } = renderModal();

    await user.click(within(dialog).getByRole('button', { name: 'Desativar Pampulha' }));
    await user.click(within(dialog).getByRole('button', { name: 'Reativar Barreiro' }));
    await save();

    expect(saveRequest).toHaveBeenCalledWith({
      cityId: 'bh',
      name: 'Belo Horizonte',
      uf: 'MG',
      zones: [
        { id: 'savassi', name: 'Savassi', isActive: true },
        { id: 'pampulha', name: 'Pampulha', isActive: false },
        { id: 'barreiro', name: 'Barreiro', isActive: true },
      ],
    });
  });

  it('não deixa desativar região com grupo ativo', () => {
    const { dialog } = renderModal();

    expect(within(dialog).getByRole('button', { name: 'Desativar Savassi' })).toBeDisabled();
    expect(within(dialog).getByText('Tem 1 grupo ativo')).toBeInTheDocument();
  });

  it('mostra no campo de nome quando a cidade já existe no estado', async () => {
    const { dialog, save, saveRequest, onSaved } = renderModal();
    saveRequest.mockRejectedValue(new CityServiceError('duplicate_city'));

    await save();

    expect(
      await within(dialog).findByText('Já existe uma cidade com esse nome em MG.'),
    ).toBeInTheDocument();
    expect(onSaved).not.toHaveBeenCalled();
  });

  it('diz qual região tem grupos ativos quando o servidor recusa', async () => {
    const { dialog, save, saveRequest } = renderModal();
    saveRequest.mockRejectedValue(
      new CityServiceError('zone_has_active_groups', { zone: 'Savassi' }),
    );

    await save();

    expect(await within(dialog).findByRole('alert')).toHaveTextContent(
      'A região Savassi tem grupos ativos e não pode ser desativada.',
    );
  });

  it('mostra erro genérico nas outras falhas', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const { dialog, save, saveRequest } = renderModal();
    saveRequest.mockRejectedValue(new Error('network'));

    await save();

    expect(await within(dialog).findByRole('alert')).toHaveTextContent(text.errors.generic);
  });
});
