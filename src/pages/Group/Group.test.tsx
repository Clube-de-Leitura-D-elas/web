import { screen, waitFor, within } from '@testing-library/react';
import { interpolate, locale } from '../../locales';
import {
  getAllGroupParticipants,
  getGroupCities,
  getGroupDetails,
  getGroupMeetingsPage,
  getGroupZones,
  updateGroupLocation,
  updateGroupParticipant,
  updateGroupStatus,
} from '../../services/groupService';
import { pending, renderWithProviders } from '../../test/render';
import type { GroupDetails as GroupDetailsData, GroupParticipantListItem } from '../../types/group';
import { GroupDetails } from '.';

jest.mock('../../services/groupService', () => ({
  getAllGroupParticipants: jest.fn(),
  getGroupCities: jest.fn(),
  getGroupDetails: jest.fn(),
  getGroupMeetingsPage: jest.fn(),
  getGroupZones: jest.fn(),
  updateGroupLocation: jest.fn(),
  updateGroupParticipant: jest.fn(),
  updateGroupStatus: jest.fn(),
}));

const text = locale.group_details;

const group: GroupDetailsData = {
  id: 'g1',
  number: 7,
  description: 'Centro',
  city: 'Canoas',
  zone: null,
  is_active: true,
  active_participants_count: 2,
  coordinators: [
    {
      id: 'p1',
      name: 'Ana Souza',
      email: null,
      photo: 'https://cdn.exemplo.com/ana.jpg',
    },
  ],
  next_meeting: {
    date: '2026-08-24T22:00:00Z',
    book_title: 'Torto Arado',
    book_author: 'Itamar Vieira Junior',
    place: 'Biblioteca Pública',
    neighborhood: 'Centro Histórico',
    confirmed: true,
  },
};

const members: GroupParticipantListItem[] = [
  {
    id: 'p2',
    name: 'Bia Lima',
    entry_date: '2024-05-01',
    attendance: ['P', 'P', 'P'],
    email: 'bia@email.com',
    is_coordinator: false,
  },
  {
    id: 'p3',
    name: 'Carla Dias',
    entry_date: '2024-06-01',
    attendance: ['F', 'F', 'P'],
    email: 'carla@email.com',
    is_coordinator: false,
  },
  {
    id: 'p1',
    name: 'Ana Souza',
    entry_date: '2024-03-01',
    attendance: ['P', 'F', 'P'],
    email: null,
    is_coordinator: true,
  },
];

const renderPage = () =>
  renderWithProviders(<GroupDetails />, { route: '/grupos/g1', path: '/grupos/:groupId' });

const waitForPage = () => screen.findByRole('heading', { name: 'Grupo 07 — Centro' });

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.mocked(getGroupDetails).mockResolvedValue(group);
  jest.mocked(getGroupCities).mockResolvedValue([
    { id: 'c1', name: 'Canoas' },
    { id: 'c2', name: 'Porto Alegre' },
  ]);
  jest.mocked(getGroupZones).mockResolvedValue([{ id: 'z1', name: 'Zona Sul', cityId: 'c1' }]);
  jest.mocked(getAllGroupParticipants).mockResolvedValue({ items: members, total: 3 });
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

    const { container } = renderPage();

    expect(screen.getByRole('status')).toHaveTextContent(text.loading);
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBeGreaterThan(0);
  });

  it('mostra o erro com o caminho de volta e tenta de novo', async () => {
    jest.mocked(getGroupDetails).mockRejectedValueOnce(new Error('rede'));
    const { user } = renderPage();

    expect(await screen.findByRole('alert')).toHaveTextContent(text.loadError);
    expect(screen.getByRole('link', { name: text.breadcrumbGroups })).toHaveAttribute(
      'href',
      '/grupos',
    );

    await user.click(screen.getByRole('button', { name: locale.dataState.retry }));

    expect(await waitForPage()).toBeInTheDocument();
    expect(getGroupDetails).toHaveBeenCalledTimes(2);
  });

  it('mostra o caminho, o nome, o status e a cidade do grupo', async () => {
    renderPage();

    expect(await waitForPage()).toBeInTheDocument();
    expect(getGroupDetails).toHaveBeenCalledWith('g1');
    const breadcrumb = screen.getByRole('navigation', { name: text.breadcrumbLabel });
    expect(within(breadcrumb).getByText('Grupo 07')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByText(text.header.statusActive)).toBeInTheDocument();
    expect(screen.getByText('Canoas')).toBeInTheDocument();
  });

  it('mostra a zona junto da cidade', async () => {
    jest.mocked(getGroupDetails).mockResolvedValue({ ...group, zone: 'Zona Sul' });

    renderPage();

    expect(await screen.findByText('Canoas · Zona Sul')).toBeInTheDocument();
  });

  describe('resumo', () => {
    const summary = () => screen.getByRole('region', { name: text.summary.label });

    it('mostra a coordenadora, o próximo encontro, o livro e o local', async () => {
      const { container } = renderPage();
      await waitForPage();

      expect(within(summary()).getByText('Ana Souza')).toBeInTheDocument();
      expect(within(summary()).getByText('Seg, 24 ago · 19h')).toBeInTheDocument();
      expect(within(summary()).getByText(text.summary.statusConfirmed)).toBeInTheDocument();
      expect(within(summary()).getByText('Torto Arado')).toBeInTheDocument();
      expect(within(summary()).getByText('· Itamar Vieira Junior')).toBeInTheDocument();
      expect(within(summary()).getByText('Biblioteca Pública')).toBeInTheDocument();
      expect(within(summary()).getByText('· Centro Histórico')).toBeInTheDocument();
      expect(container.querySelector('img')).toHaveAttribute('src', group.coordinators[0].photo);
    });

    it('junta os nomes quando há mais de uma coordenadora', async () => {
      jest.mocked(getGroupDetails).mockResolvedValue({
        ...group,
        coordinators: [
          ...group.coordinators,
          { id: 'p3', name: 'Carla Dias', email: null, photo: null },
        ],
      });

      renderPage();
      await waitForPage();

      expect(within(summary()).getByText(text.summary.coordinator.other)).toBeInTheDocument();
      expect(within(summary()).getByText('Ana Souza e Carla Dias')).toBeInTheDocument();
    });

    it('avisa o encontro pendente', async () => {
      jest.mocked(getGroupDetails).mockResolvedValue({
        ...group,
        next_meeting: { ...group.next_meeting!, confirmed: false },
      });

      renderPage();
      await waitForPage();

      expect(within(summary()).getByText(text.summary.statusPending)).toBeInTheDocument();
    });

    it('sem encontro nem coordenadora, mostra os estados vazios', async () => {
      jest
        .mocked(getGroupDetails)
        .mockResolvedValue({ ...group, coordinators: [], next_meeting: null });

      renderPage();
      await waitForPage();

      expect(within(summary()).getByText(text.summary.noCoordinator)).toBeInTheDocument();
      expect(within(summary()).getByText(text.summary.noNextMeeting)).toBeInTheDocument();
      expect(within(summary()).queryByText(text.summary.book)).not.toBeInTheDocument();
    });
  });

  describe('indicadores', () => {
    const stats = () => screen.getByRole('region', { name: text.stats.label });

    it('calcula ativas, presença média, nota média e quem precisa de atenção', async () => {
      renderPage();
      await waitForPage();

      expect(await within(stats()).findByText('de 3')).toBeInTheDocument();
      expect(within(stats()).getByText('1 inativa')).toBeInTheDocument();
      expect(within(stats()).getByText('75%')).toBeInTheDocument();
      expect(within(stats()).getByText('Últimos 2 encontros')).toBeInTheDocument();
      expect(within(stats()).getByText('4,5')).toBeInTheDocument();
      expect(within(stats()).getByText('2 encontros · 2 votos')).toBeInTheDocument();
      expect(within(stats()).getByText('Carla · presença baixa')).toBeInTheDocument();
      expect(within(stats()).getByText('Ana · cadastro incompleto')).toBeInTheDocument();
    });

    it('avisa quando não consegue calcular', async () => {
      jest.mocked(getAllGroupParticipants).mockRejectedValue(new Error('rede'));
      jest.mocked(getGroupMeetingsPage).mockRejectedValue(new Error('rede'));

      renderPage();
      await waitForPage();

      await waitFor(() =>
        expect(within(stats()).getAllByText(text.stats.unavailable)).toHaveLength(4),
      );
    });
  });

  it('lista as participantes com a coordenadora primeiro', async () => {
    renderPage();

    const link = await screen.findByRole('link', { name: /^Ana Souza/ });
    expect(link).toHaveAttribute('href', '/participantes/p1');
    expect(screen.getByRole('tab', { name: `${text.tabs.participants} 3` })).toBeInTheDocument();

    const rows = screen.getAllByRole('row').slice(1);
    expect(rows[0]).toHaveTextContent('Ana Souza');

    const ana = link.closest('tr')!;
    expect(within(ana).getByText(text.table.coordinatorTag)).toBeInTheDocument();
    expect(within(ana).getByText(text.table.incompleteTag)).toBeInTheDocument();
    expect(within(ana).getByText(text.table.noEmail)).toBeInTheDocument();
    expect(within(ana).getByText('01/03/2024')).toBeInTheDocument();
    expect(
      within(ana).getByRole('img', {
        name: interpolate(text.table.attendanceAria, { present: 2, total: 3 }),
      }),
    ).toBeInTheDocument();
    expect(within(ana).getByText('67%')).toBeInTheDocument();

    const carla = screen.getByRole('link', { name: 'Carla Dias carla@email.com' }).closest('tr')!;
    expect(within(carla).getByText('33%')).toBeInTheDocument();
    expect(within(carla).getByText(text.table.lowTag)).toBeInTheDocument();
  });

  it('a nova tentativa da tabela recarrega a lista e os indicadores', async () => {
    jest
      .mocked(getAllGroupParticipants)
      .mockRejectedValueOnce(new Error('rede'))
      .mockRejectedValueOnce(new Error('rede'));
    const { user } = renderPage();
    await waitForPage();

    await user.click(await screen.findByRole('button', { name: locale.table.retry }));

    expect(await screen.findByRole('link', { name: /^Ana Souza/ })).toBeInTheDocument();
    expect(getAllGroupParticipants).toHaveBeenCalledTimes(3);
    expect(
      within(screen.getByRole('region', { name: text.stats.label })).getByText('de 3'),
    ).toBeInTheDocument();
  });

  it('mostra o histórico de encontros na segunda aba', async () => {
    const { user } = renderPage();
    await waitForPage();

    await user.click(screen.getByRole('tab', { name: new RegExp(text.tabs.history) }));

    const first = (await screen.findByText('24 ago 2026')).closest('tr')!;
    expect(getGroupMeetingsPage).toHaveBeenCalledWith('g1', { page: 1, pageSize: 6 });
    expect(within(first).getByText('Segunda, 19h')).toBeInTheDocument();
    expect(within(first).getByText('Torto Arado')).toBeInTheDocument();
    expect(within(first).getByText('Itamar Vieira Junior')).toBeInTheDocument();
    expect(within(first).getByText(text.notInformed)).toBeInTheDocument();
    expect(within(first).getByText('Centro')).toBeInTheDocument();
    expect(within(first).getByText('3 de 4')).toBeInTheDocument();
    expect(within(first).getByText('4,5')).toBeInTheDocument();
    expect(within(first).getByText('· 2 votos')).toBeInTheDocument();

    const second = screen.getByText('10 jul 2026').closest('tr')!;
    expect(within(second).getByText('Café')).toBeInTheDocument();
    expect(within(second).getByText('0 de 0')).toBeInTheDocument();
    expect(within(second).getByText(text.history.noRating)).toBeInTheDocument();
  });

  describe('status do grupo', () => {
    const openStatusAction = async (user: ReturnType<typeof renderPage>['user'], label: string) => {
      await user.click(await screen.findByRole('button', { name: text.header.moreActions }));
      await user.click(screen.getByRole('menuitem', { name: label }));
    };

    it('encerra o grupo pelo menu e pelo modal de confirmação', async () => {
      jest.mocked(updateGroupStatus).mockResolvedValue(false);
      const { user } = renderPage();

      await openStatusAction(user, text.header.closeGroup);
      const dialog = screen.getByRole('dialog', { name: text.statusModal.closeTitle });
      await user.click(within(dialog).getByRole('button', { name: text.statusModal.closeConfirm }));

      expect(updateGroupStatus).toHaveBeenCalledWith('g1', false);
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
      expect(screen.getByText(text.header.statusClosed)).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: text.header.moreActions }));
      expect(screen.getByRole('menuitem', { name: text.header.reopenGroup })).toBeInTheDocument();
    });

    it('reativa um grupo encerrado', async () => {
      jest.mocked(getGroupDetails).mockResolvedValue({ ...group, is_active: false });
      jest.mocked(updateGroupStatus).mockResolvedValue(true);
      const { user } = renderPage();

      await openStatusAction(user, text.header.reopenGroup);
      const dialog = screen.getByRole('dialog', { name: text.statusModal.reopenTitle });
      await user.click(
        within(dialog).getByRole('button', { name: text.statusModal.reopenConfirm }),
      );

      expect(updateGroupStatus).toHaveBeenCalledWith('g1', true);
      expect(await screen.findByText(text.header.statusActive)).toBeInTheDocument();
    });

    it('mantém o modal aberto e avisa quando o status não muda', async () => {
      jest.mocked(updateGroupStatus).mockRejectedValue(new Error('500'));
      const { user } = renderPage();

      await openStatusAction(user, text.header.closeGroup);
      const dialog = screen.getByRole('dialog', { name: text.statusModal.closeTitle });
      await user.click(within(dialog).getByRole('button', { name: text.statusModal.closeConfirm }));

      expect(await within(dialog).findByRole('alert')).toHaveTextContent(text.updateStatusError);
      expect(
        within(dialog).getByRole('button', { name: text.statusModal.closeConfirm }),
      ).toBeEnabled();
    });
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
    expect(screen.getByText('Porto Alegre')).toBeInTheDocument();
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
    const actions = text.participantActions;

    const openMenu = async (user: ReturnType<typeof renderPage>['user'], name: string) => {
      await screen.findByRole('link', { name: new RegExp(`^${name}`) });
      await user.click(
        screen.getByRole('button', { name: interpolate(text.table.actionsAriaLabel, { name }) }),
      );
    };

    it('abre o perfil pelo menu', async () => {
      const { user } = renderPage();

      await openMenu(user, 'Bia Lima');
      await user.click(screen.getByRole('menuitem', { name: actions.viewProfile }));

      expect(screen.getByTestId('location')).toHaveTextContent('/participantes/p2');
    });

    it('a última coordenadora não pode perder a coordenação', async () => {
      const { user } = renderPage();

      await openMenu(user, 'Ana Souza');

      const demote = screen.getByRole('menuitem', { name: new RegExp(actions.demote) });
      expect(demote).toHaveAttribute('aria-disabled', 'true');
      expect(demote).toHaveTextContent(actions.lastCoordinatorHint);
      expect(screen.getByRole('menuitem', { name: actions.remove })).toBeEnabled();
    });

    it('torna coordenadora, avisa no toast e desfaz', async () => {
      jest.mocked(updateGroupParticipant).mockResolvedValue();
      const { user } = renderPage();
      const fetches = jest.mocked(getGroupDetails).mock.calls.length;

      await openMenu(user, 'Bia Lima');
      await user.click(screen.getByRole('menuitem', { name: actions.promote }));

      expect(updateGroupParticipant).toHaveBeenCalledWith('g1', 'p2', 'promote');
      expect(await screen.findByRole('status')).toHaveTextContent(
        interpolate(actions.promoted, { name: 'Bia' }),
      );
      expect(jest.mocked(getGroupDetails).mock.calls.length).toBeGreaterThan(fetches);

      await user.click(screen.getByRole('button', { name: actions.undo }));

      expect(updateGroupParticipant).toHaveBeenLastCalledWith('g1', 'p2', 'demote');
      expect(await screen.findByRole('status')).toHaveTextContent(actions.undone);
    });

    it('mostra o erro no toast quando a coordenação não muda', async () => {
      jest.mocked(updateGroupParticipant).mockRejectedValue(new Error(actions.conflictError));
      const { user } = renderPage();

      await openMenu(user, 'Bia Lima');
      await user.click(screen.getByRole('menuitem', { name: actions.promote }));

      expect(await screen.findByRole('alert')).toHaveTextContent(actions.conflictError);
    });

    it('remove uma participante depois de confirmar', async () => {
      jest.mocked(updateGroupParticipant).mockResolvedValue();
      const { user } = renderPage();

      await openMenu(user, 'Bia Lima');
      await user.click(screen.getByRole('menuitem', { name: actions.remove }));
      const dialog = screen.getByRole('dialog', {
        name: interpolate(locale.removeFromGroup.title, { name: 'Bia Lima', group: 'Grupo 07' }),
      });
      expect(within(dialog).queryByRole('button', { name: /Nova coordenadora/ })).toBeNull();
      await user.click(
        within(dialog).getByRole('button', { name: locale.removeFromGroup.confirm }),
      );

      expect(updateGroupParticipant).toHaveBeenCalledWith('g1', 'p2', 'remove');
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
      expect(screen.getByRole('status')).toHaveTextContent(
        interpolate(actions.removed, { name: 'Bia' }),
      );
    });

    it('para remover a última coordenadora, pede quem assume', async () => {
      jest.mocked(updateGroupParticipant).mockResolvedValue();
      const { user } = renderPage();

      await openMenu(user, 'Ana Souza');
      await user.click(screen.getByRole('menuitem', { name: actions.remove }));
      const dialog = screen.getByRole('dialog');
      const confirm = within(dialog).getByRole('button', { name: locale.removeFromGroup.confirm });
      expect(confirm).toBeDisabled();

      await user.click(
        within(dialog).getByRole('button', {
          name: new RegExp(locale.removeFromGroup.newCoordinator),
        }),
      );
      await user.click(screen.getByRole('option', { name: 'Carla Dias' }));
      await user.click(confirm);

      expect(updateGroupParticipant).toHaveBeenNthCalledWith(1, 'g1', 'p3', 'promote');
      expect(updateGroupParticipant).toHaveBeenNthCalledWith(2, 'g1', 'p1', 'remove');
      expect(await screen.findByRole('status')).toHaveTextContent(
        interpolate(actions.removedWithCoordinator, { name: 'Ana', coordinator: 'Carla' }),
      );
    });

    it('mantém o modal aberto com o erro quando a remoção falha', async () => {
      jest.mocked(updateGroupParticipant).mockRejectedValue(new Error(actions.error));
      const { user } = renderPage();

      await openMenu(user, 'Bia Lima');
      await user.click(screen.getByRole('menuitem', { name: actions.remove }));
      const dialog = screen.getByRole('dialog');
      await user.click(
        within(dialog).getByRole('button', { name: locale.removeFromGroup.confirm }),
      );

      expect(await within(dialog).findByRole('alert')).toHaveTextContent(actions.error);
      expect(dialog).toBeInTheDocument();
    });
  });
});
