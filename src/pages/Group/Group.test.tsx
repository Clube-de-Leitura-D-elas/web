import { screen, waitFor, within } from '@testing-library/react';
import { interpolate, locale } from '../../locales';
import {
  getGroupCities,
  getGroupDetails,
  getGroupMeetingsPage,
  getGroupParticipantsPage,
  getGroupZones,
  updateGroupLocation,
  updateGroupParticipant,
  updateGroupStatus,
} from '../../services/groupService';
import { pending, renderWithProviders } from '../../test/render';
import type { GroupDetails as GroupDetailsData } from '../../types/group';
import { GroupDetails } from '.';

jest.mock('../../services/groupService', () => ({
  getGroupCities: jest.fn(),
  getGroupDetails: jest.fn(),
  getGroupMeetingsPage: jest.fn(),
  getGroupParticipantsPage: jest.fn(),
  getGroupZones: jest.fn(),
  updateGroupLocation: jest.fn(),
  updateGroupParticipant: jest.fn(),
  updateGroupStatus: jest.fn(),
}));

const text = locale.group_details;
const firstPage = { page: 1, pageSize: 6 };

const group: GroupDetailsData = {
  id: 'g1',
  number: 7,
  description: 'Centro',
  city: 'Canoas',
  zone: null,
  is_active: true,
  active_participants_count: 12,
  coordinator_name: 'Joana Alves',
  coordinator_email: 'joana@gmail.com',
  coordinator_photo: 'https://cdn.exemplo.com/joana.jpg',
  next_meeting: {
    date: '2026-08-24T22:00:00Z',
    book_title: 'Torto Arado',
    book_author: 'Itamar Vieira Junior',
    place: 'Biblioteca Pública',
    neighborhood: 'Centro Histórico',
    confirmed: true,
  },
};

const renderPage = () =>
  renderWithProviders(<GroupDetails />, { route: '/grupos/g1', path: '/grupos/:groupId' });

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.mocked(getGroupDetails).mockResolvedValue(group);
  jest.mocked(getGroupCities).mockResolvedValue([
    { id: 'c1', name: 'Canoas' },
    { id: 'c2', name: 'Porto Alegre' },
  ]);
  jest.mocked(getGroupZones).mockResolvedValue([{ id: 'z1', name: 'Zona Sul', cityId: 'c1' }]);
  jest.mocked(getGroupParticipantsPage).mockResolvedValue({
    items: [
      {
        id: 'p1',
        name: 'Ana Souza',
        entry_date: '2024-03-01',
        attendance: ['P', 'F', 'P'],
        email: null,
        is_coordinator: true,
      },
      {
        id: 'p2',
        name: 'Bia Lima',
        entry_date: '2024-05-01',
        attendance: ['P', 'P', 'P'],
        email: null,
        is_coordinator: false,
      },
    ],
    total: 2,
  });
  jest.mocked(getGroupMeetingsPage).mockResolvedValue({
    items: [
      {
        id: 'm1',
        date: '2026-08-24T22:00:00Z',
        book_title: 'Torto Arado',
        book_author: 'Itamar Vieira Junior',
        place: null,
        neighborhood: 'Centro',
        attendance_present: 3,
        attendance_total: 4,
        average_rating: 4.5,
        votes_count: 2,
      },
      {
        id: 'm2',
        date: '2026-07-10T22:00:00Z',
        book_title: 'Quarto de Despejo',
        book_author: 'Carolina Maria de Jesus',
        place: 'Café',
        neighborhood: null,
        attendance_present: 0,
        attendance_total: 0,
        average_rating: null,
        votes_count: 0,
      },
    ],
    total: 2,
  });
});

describe('GroupDetails', () => {
  it('mostra o skeleton enquanto carrega os dados do grupo', () => {
    jest.mocked(getGroupDetails).mockReturnValue(pending());

    renderPage();

    expect(screen.getByRole('status')).toHaveTextContent(text.loading);
  });

  it('mostra o erro quando o grupo não carrega', async () => {
    jest.mocked(getGroupDetails).mockRejectedValue(new Error('404'));

    renderPage();

    expect(await screen.findByText(text.loadError)).toBeInTheDocument();
  });

  it('mostra o cabeçalho com nome, cidade e participantes ativas', async () => {
    renderPage();

    expect(await screen.findByRole('heading', { name: 'Grupo 07 — Centro' })).toBeInTheDocument();
    expect(getGroupDetails).toHaveBeenCalledWith('g1');
    expect(screen.getByText('Canoas • 12 participantes ativas')).toBeInTheDocument();
  });

  it('mostra a coordenadora com a foto', async () => {
    const { container } = renderPage();
    await screen.findByText('Joana Alves');

    expect(screen.getByText('joana@gmail.com')).toBeInTheDocument();
    expect(container.querySelector('img')).toHaveAttribute('src', group.coordinator_photo);
  });

  it('sem foto da coordenadora, mostra um ícone no lugar', async () => {
    jest.mocked(getGroupDetails).mockResolvedValue({ ...group, coordinator_photo: null });

    const { container } = renderPage();
    await screen.findByText('Joana Alves');

    expect(container.querySelector('img')).not.toBeInTheDocument();
  });

  it('mostra o próximo encontro no horário de Brasília', async () => {
    renderPage();

    expect(await screen.findByText('24 de Agosto, 19h')).toBeInTheDocument();
    expect(screen.getByText(text.nextMeeting.statusConfirmed)).toBeInTheDocument();
    expect(screen.getByText('Torto Arado')).toBeInTheDocument();
    expect(screen.getByText('Biblioteca Pública — Centro Histórico')).toBeInTheDocument();
  });

  it('sem próximo encontro nem coordenadora, mostra "não informado"', async () => {
    jest.mocked(getGroupDetails).mockResolvedValue({
      ...group,
      coordinator_name: null,
      coordinator_email: null,
      coordinator_photo: null,
      next_meeting: null,
    });

    renderPage();
    await screen.findByRole('heading', { name: 'Grupo 07 — Centro' });

    // nome e e-mail da coordenadora, e o card do encontro
    expect(screen.getAllByText(text.notInformed)).toHaveLength(3);
    expect(screen.queryByText(text.nextMeeting.statusConfirmed)).not.toBeInTheDocument();
  });

  it('lista as participantes do grupo', async () => {
    renderPage();

    const link = await screen.findByRole('link', { name: /^Ana Souza/ });
    expect(link).toHaveAttribute('href', '/participantes/p1');
    expect(getGroupParticipantsPage).toHaveBeenCalledWith('g1', firstPage);

    const row = link.closest('tr')!;
    expect(within(row).getByText(text.table.coordinatorTag)).toBeInTheDocument();
    expect(within(row).getByText('01/03/2024')).toBeInTheDocument();
    expect(within(row).getAllByLabelText(text.table.present)).toHaveLength(2);
    expect(within(row).getAllByLabelText(text.table.absent)).toHaveLength(1);
    expect(within(row).getByText(text.table.emptyValue)).toBeInTheDocument();
  });

  it('mostra o histórico de encontros na segunda aba', async () => {
    const { user } = renderPage();
    await screen.findByRole('heading', { name: 'Grupo 07 — Centro' });

    await user.click(screen.getByRole('tab', { name: text.tabs.history }));

    const first = (await screen.findByText('24 Ago 2026')).closest('tr')!;
    expect(getGroupMeetingsPage).toHaveBeenCalledWith('g1', firstPage);
    expect(within(first).getByText('Torto Arado - Itamar Vieira Junior')).toBeInTheDocument();
    expect(within(first).getByText('— — Centro')).toBeInTheDocument();
    expect(within(first).getByText('3 / 4 (75%)')).toBeInTheDocument();
    expect(within(first).getByText('4.5')).toBeInTheDocument();
    expect(within(first).getByText('(2 votos)')).toBeInTheDocument();

    const second = screen.getByText('10 Jul 2026').closest('tr')!;
    expect(within(second).getByText('0 / 0 (0%)')).toBeInTheDocument();
    expect(within(second).getByText(text.table.emptyValue)).toBeInTheDocument();
  });

  it('encerra o grupo pelo modal de confirmação', async () => {
    jest.mocked(updateGroupStatus).mockResolvedValue(false);
    const { user } = renderPage();

    await user.click(await screen.findByRole('button', { name: text.header.closeGroup }));
    const dialog = screen.getByRole('dialog', { name: text.statusModal.closeTitle });
    await user.click(within(dialog).getByRole('button', { name: text.statusModal.closeConfirm }));

    expect(updateGroupStatus).toHaveBeenCalledWith('g1', false);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.getByRole('button', { name: text.header.reopenGroup })).toBeInTheDocument();
  });

  it('reativa um grupo encerrado', async () => {
    jest.mocked(getGroupDetails).mockResolvedValue({ ...group, is_active: false });
    jest.mocked(updateGroupStatus).mockResolvedValue(true);
    const { user } = renderPage();

    await user.click(await screen.findByRole('button', { name: text.header.reopenGroup }));
    const dialog = screen.getByRole('dialog', { name: text.statusModal.reopenTitle });
    await user.click(within(dialog).getByRole('button', { name: text.statusModal.reopenConfirm }));

    expect(updateGroupStatus).toHaveBeenCalledWith('g1', true);
    expect(await screen.findByRole('button', { name: text.header.closeGroup })).toBeInTheDocument();
  });

  it('mantém o modal aberto e avisa quando o status não muda', async () => {
    jest.mocked(updateGroupStatus).mockRejectedValue(new Error('500'));
    const { user } = renderPage();

    await user.click(await screen.findByRole('button', { name: text.header.closeGroup }));
    const dialog = screen.getByRole('dialog', { name: text.statusModal.closeTitle });
    await user.click(within(dialog).getByRole('button', { name: text.statusModal.closeConfirm }));

    expect(await within(dialog).findByText(text.updateStatusError)).toBeInTheDocument();
    expect(dialog).toBeInTheDocument();
    expect(
      within(dialog).getByRole('button', { name: text.statusModal.closeConfirm }),
    ).toBeEnabled();
  });

  it('o botão de ações de cada linha cita a participante', async () => {
    renderPage();
    await screen.findByRole('link', { name: /^Ana Souza/ });

    expect(
      screen.getByRole('button', {
        name: interpolate(text.table.actionsAriaLabel, { name: 'Ana Souza' }),
      }),
    ).toBeInTheDocument();
  });

  it('edita a localização do grupo pelo modal', async () => {
    jest.mocked(updateGroupLocation).mockResolvedValue();
    const { user } = renderPage();

    await user.click(await screen.findByRole('button', { name: text.header.editLocation }));
    const dialog = screen.getByRole('dialog', { name: text.modal.title });
    const city = within(dialog).getByRole('combobox', { name: new RegExp(text.modal.city) });
    expect(city).toHaveValue('Canoas');

    await user.clear(city);
    await user.type(city, 'porto');
    await user.click(screen.getByRole('option', { name: 'Porto Alegre' }));
    await user.click(within(dialog).getByRole('button', { name: text.modal.save }));

    expect(updateGroupLocation).toHaveBeenCalledWith('g1', {
      description: 'Porto Alegre',
      city_id: 'c2',
      zone_id: null,
    });
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.getByRole('heading', { name: 'Grupo 07 — Porto Alegre' })).toBeInTheDocument();
    expect(screen.getByText('Porto Alegre • 12 participantes ativas')).toBeInTheDocument();
  });

  it('mantém o modal aberto e mostra o erro quando a localização não salva', async () => {
    jest.mocked(updateGroupLocation).mockRejectedValue(new Error(text.modal.modalError));
    const { user } = renderPage();

    await user.click(await screen.findByRole('button', { name: text.header.editLocation }));
    const dialog = screen.getByRole('dialog', { name: text.modal.title });
    await user.click(within(dialog).getByRole('button', { name: text.modal.save }));

    expect(await within(dialog).findByRole('alert')).toHaveTextContent(text.modal.modalError);
    expect(screen.getByRole('heading', { name: 'Grupo 07 — Centro' })).toBeInTheDocument();
  });

  describe('ações da participante', () => {
    const actions = (name: string) =>
      screen.getByRole('button', { name: interpolate(text.table.actionsAriaLabel, { name }) });

    it('coordenadora não tem a opção de tornar coordenadora', async () => {
      const { user } = renderPage();
      await screen.findByRole('link', { name: /^Ana Souza/ });

      await user.click(actions('Ana Souza'));

      expect(
        screen.queryByRole('menuitem', { name: text.participantActions.promote }),
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole('menuitem', { name: text.participantActions.remove }),
      ).toBeInTheDocument();
    });

    it('torna coordenadora após confirmar e recarrega a lista', async () => {
      jest.mocked(updateGroupParticipant).mockResolvedValue();
      const { user } = renderPage();
      await screen.findByRole('link', { name: 'Bia Lima' });
      const fetches = jest.mocked(getGroupParticipantsPage).mock.calls.length;

      await user.click(actions('Bia Lima'));
      await user.click(screen.getByRole('menuitem', { name: text.participantActions.promote }));
      const dialog = screen.getByRole('dialog', { name: text.participantActions.promoteTitle });
      expect(dialog).toHaveTextContent('Bia Lima');
      await user.click(
        within(dialog).getByRole('button', { name: text.participantActions.promote }),
      );

      expect(updateGroupParticipant).toHaveBeenCalledWith('g1', 'p2', 'promote');
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
      await waitFor(() =>
        expect(jest.mocked(getGroupParticipantsPage).mock.calls.length).toBeGreaterThan(fetches),
      );
    });

    it('remove do grupo e mantém o modal aberto com erro quando falha', async () => {
      jest.mocked(updateGroupParticipant).mockRejectedValue(new Error('boom'));
      const { user } = renderPage();
      await screen.findByRole('link', { name: 'Bia Lima' });

      await user.click(actions('Bia Lima'));
      await user.click(screen.getByRole('menuitem', { name: text.participantActions.remove }));
      const dialog = screen.getByRole('dialog', { name: text.participantActions.removeTitle });
      await user.click(
        within(dialog).getByRole('button', { name: text.participantActions.remove }),
      );

      expect(updateGroupParticipant).toHaveBeenCalledWith('g1', 'p2', 'remove');
      expect(await within(dialog).findByRole('alert')).toHaveTextContent(
        text.participantActions.error,
      );
    });
  });
});
