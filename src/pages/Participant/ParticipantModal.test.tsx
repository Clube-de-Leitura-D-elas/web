import { screen, within } from '@testing-library/react';
import { locale } from '../../locales';
import { renderWithProviders } from '../../test/render';
import type { Participant } from '../../types/participant';
import { ParticipantModal } from './ParticipantModal';

const text = locale.participant_details.modal;

const participant: Participant = {
  id: 'p1',
  name: 'Joseane Alves',
  email: 'jo@gmail.com',
  instagram: null,
  phone: '51999999999',
  city: 'Porto Alegre',
  zone: 'Zona Sul',
  birthDate: '1990-10-24',
  job: null,
  active: true,
  appRole: 'MANAGER',
  entryDate: null,
  photo: null,
};

const cities = [
  { id: 'poa', name: 'Porto Alegre' },
  { id: 'sp', name: 'São Paulo' },
];

// "Zona Sul" de São Paulo vem antes na lista: a zona tem que ser casada pela cidade
const zones = [
  { id: 'sp-sul', name: 'Zona Sul', cityId: 'sp' },
  { id: 'sp-oeste', name: 'Zona Oeste', cityId: 'sp' },
  { id: 'poa-sul', name: 'Zona Sul', cityId: 'poa' },
  { id: 'poa-norte', name: 'Zona Norte', cityId: 'poa' },
];

const renderModal = (overrides: Partial<Participant> = {}) => {
  const onConfirm = jest.fn();
  const view = renderWithProviders(
    <ParticipantModal
      isOpen
      participant={{ ...participant, ...overrides }}
      cities={cities}
      zones={zones}
      onClose={jest.fn()}
      onConfirm={onConfirm}
    />,
  );
  return { ...view, onConfirm };
};

const save = (user: ReturnType<typeof renderModal>['user']) =>
  user.click(within(screen.getByRole('dialog')).getByRole('button', { name: text.save }));

describe('ParticipantModal', () => {
  it('keeps the zone of the participant city when saving untouched', async () => {
    const { user, onConfirm } = renderModal();

    await save(user);

    expect(onConfirm).toHaveBeenCalledWith(
      expect.objectContaining({ cityId: 'poa', zoneId: 'poa-sul', zone: 'Zona Sul' }),
    );
  });

  it('only offers zones of the selected city', async () => {
    const { user } = renderModal();

    const zone = screen.getByRole('combobox', { name: new RegExp(text.zone) });
    await user.clear(zone);
    await user.type(zone, 'Zona');

    const options = screen.getAllByRole('option').map((option) => option.textContent);
    expect(options).toEqual(['Zona Sul', 'Zona Norte']);
  });

  it('clears the zone when the city changes', async () => {
    const { user, onConfirm } = renderModal();
    const city = screen.getByRole('combobox', { name: new RegExp(text.city) });

    await user.clear(city);
    await user.type(city, 'São');
    await user.click(screen.getByRole('option', { name: 'São Paulo' }));
    await save(user);

    expect(onConfirm).toHaveBeenCalledWith(
      expect.objectContaining({ cityId: 'sp', zoneId: null, zone: null }),
    );
  });

  it('hides the app role checkbox for a founder and keeps the role', async () => {
    const { user, onConfirm } = renderModal({ appRole: 'FOUNDER' });

    expect(screen.queryByRole('checkbox', { name: text.appRole })).not.toBeInTheDocument();

    await save(user);

    expect(onConfirm).toHaveBeenCalledWith(expect.objectContaining({ appRole: 'FOUNDER' }));
  });

  it('turns a manager into a reader when the checkbox is unchecked', async () => {
    const { user, onConfirm } = renderModal();

    await user.click(screen.getByRole('checkbox', { name: text.appRole }));
    await save(user);

    expect(onConfirm).toHaveBeenCalledWith(expect.objectContaining({ appRole: 'READER' }));
  });

  it('disables saving while a required field is empty', async () => {
    const { user } = renderModal();

    await user.clear(screen.getByLabelText(text.name));

    expect(
      within(screen.getByRole('dialog')).getByRole('button', { name: text.save }),
    ).toBeDisabled();
  });
});
