import { screen, waitFor, within } from '@testing-library/react';
import { interpolate, locale } from '../../locales';
import { getAllGroupParticipants, updateGroupParticipant } from '../../services/groupService';
import {
  getCities,
  getParticipantById,
  getAllParticipantGroups,
  getParticipantPresence,
  getParticipantPresenceHistory,
  getZones,
  updateParticipantStatus,
} from '../../services/participantService';
import { pending, renderWithProviders } from '../../test/render';
import type { Participant } from '../../types/participant';
import { ParticipantDetails } from '.';

jest.mock('../../services/participantService', () => ({
  getParticipantById: jest.fn(),
  getAllParticipantGroups: jest.fn(),
  getParticipantPresence: jest.fn(),
  getParticipantPresenceHistory: jest.fn(),
  updateParticipantStatus: jest.fn(),
  getCities: jest.fn().mockResolvedValue([]),
  getZones: jest.fn().mockResolvedValue([]),
}));

jest.mock('../../services/groupService', () => ({
  getAllGroupParticipants: jest.fn(),
  updateGroupParticipant: jest.fn(),
}));

const text = locale.participant_details;

const participant: Participant = {
  id: 'p1',
  name: 'Joseane Alves',
  email: 'joseane.alves@gmail.com',
  instagram: '@joseane_alves',
  phone: '(51) 91234-5678',
  city: 'Porto Alegre',
  zone: 'Zona Leste',
  birthDate: '1990-10-24',
  job: 'Advogada',
  active: true,
  appRole: 'MANAGER',
  entryDate: '2025-03-15',
  photo: null,
};

const renderPage = () =>
  renderWithProviders(<ParticipantDetails />, {
    route: '/participantes/p1',
    path: '/participantes/:participantId',
  });

const waitForPage = () => screen.findByRole('heading', { name: 'Joseane Alves' });

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.mocked(getParticipantById).mockResolvedValue(participant);
  jest.mocked(getParticipantPresence).mockResolvedValue([
    { meetingId: 'm1', date: '2026-09-10', present: true },
    { meetingId: 'm2', date: '2026-09-08', present: false },
    { meetingId: 'm3', date: '2026-09-03', present: true },
  ]);
  jest.mocked(getAllParticipantGroups).mockResolvedValue([
    { id: 'g3', number: 3, city: 'São Paulo', isCoordinator: true, entryDate: '2024-03-01' },
    { id: 'g12', number: 12, city: null, isCoordinator: false, entryDate: null },
  ]);
  jest.mocked(getParticipantPresenceHistory).mockResolvedValue([
    {
      meetingId: 'm1',
      date: '2026-10-22T22:30:00Z',
      bookTitle: 'O Avesso da Pele',
      groupId: 'g3',
      groupNumber: 3,
      present: false,
    },
    {
      meetingId: 'm2',
      date: '2026-10-06T22:30:00Z',
      bookTitle: 'Pequeno Manual Antirracista',
      groupId: 'g12',
      groupNumber: 12,
      present: true,
    },
  ]);
});

describe('ParticipantDetails', () => {
  it('mostra o skeleton enquanto carrega os dados da participante', () => {
    jest.mocked(getParticipantById).mockReturnValue(pending());
    jest.mocked(getCities).mockReturnValue(pending());
    jest.mocked(getZones).mockReturnValue(pending());

    const { container } = renderPage();

    expect(screen.getByRole('status')).toHaveTextContent(text.loading);
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBeGreaterThan(0);
  });

  it('mostra o erro quando os dados não carregam, com o caminho de volta', async () => {
    jest.mocked(getParticipantById).mockRejectedValue(new Error('404'));

    renderPage();

    expect(await screen.findByRole('alert')).toHaveTextContent(text.loadError);
    expect(screen.getByRole('link', { name: text.breadcrumbParticipants })).toHaveAttribute(
      'href',
      '/participantes',
    );
  });

  it('busca pelo id da rota e mostra nome, função, status e coordenação', async () => {
    renderPage();

    expect(await waitForPage()).toBeInTheDocument();
    expect(getParticipantById).toHaveBeenCalledWith('p1');
    expect(getParticipantPresence).toHaveBeenCalledWith('p1');
    expect(getAllParticipantGroups).toHaveBeenCalledWith('p1');
    const profile = screen.getByRole('complementary', { name: text.profile.label });
    expect(within(profile).getByText('Advogada · Porto Alegre')).toBeInTheDocument();
    expect(within(profile).getByText(text.status.active)).toBeInTheDocument();
    expect(await within(profile).findByText(text.profile.coordinatorTag)).toBeInTheDocument();
    expect(
      within(screen.getByRole('navigation', { name: text.breadcrumbLabel })).getByText(
        'Joseane Alves',
      ),
    ).toHaveAttribute('aria-current', 'page');
  });

  it('monta os links de contato', async () => {
    renderPage();
    await waitForPage();

    const label = (template: string) => interpolate(template, { name: 'Joseane Alves' });
    expect(screen.getByRole('link', { name: label(text.contact.emailAria) })).toHaveAttribute(
      'href',
      'mailto:joseane.alves@gmail.com',
    );
    expect(screen.getByRole('link', { name: label(text.contact.instagramAria) })).toHaveAttribute(
      'href',
      'https://instagram.com/joseane_alves',
    );
    expect(screen.getByRole('link', { name: label(text.contact.phoneAria) })).toHaveAttribute(
      'href',
      'tel:+5551912345678',
    );
  });

  it('esconde contatos que a participante não informou', async () => {
    jest
      .mocked(getParticipantById)
      .mockResolvedValue({ ...participant, instagram: null, phone: null });

    renderPage();
    await waitForPage();

    const profile = screen.getByRole('complementary', { name: text.profile.label });
    expect(
      within(profile)
        .getAllByRole('link')
        .map((link) => link.getAttribute('href')),
    ).toEqual(['mailto:joseane.alves@gmail.com']);
  });

  it('mostra cidade, aniversário, trabalho, entrada e perfil no app', async () => {
    renderPage();
    await waitForPage();

    const profile = screen.getByRole('complementary', { name: text.profile.label });
    const value = (label: string) => within(profile).getByText(label).nextElementSibling;
    expect(value(text.details.city)).toHaveTextContent('Porto Alegre · Zona Leste');
    expect(value(text.details.birthday)).toHaveTextContent('24 de outubro');
    expect(value(text.details.occupation)).toHaveTextContent('Advogada');
    expect(value(text.details.entryDate)).toHaveTextContent('15/03/2025');
    expect(value(text.details.appRole)).toHaveTextContent(text.details.roles.MANAGER);
  });

  it('usa "não informado" para os dados vazios', async () => {
    jest.mocked(getParticipantById).mockResolvedValue({
      ...participant,
      zone: null,
      birthDate: null,
      entryDate: null,
      job: null,
    });

    renderPage();
    await waitForPage();

    const profile = screen.getByRole('complementary', { name: text.profile.label });
    expect(within(profile).getAllByText(text.notInformed)).toHaveLength(3);
    expect(within(profile).getByText(text.details.city).nextElementSibling).toHaveTextContent(
      /^Porto Alegre$/,
    );
    expect(screen.getByText(text.stats.noEntryDate)).toBeInTheDocument();
  });

  it('mostra a foto da participante, ou as iniciais quando não tem', async () => {
    jest
      .mocked(getParticipantById)
      .mockResolvedValue({ ...participant, photo: 'https://cdn.exemplo.com/joseane.jpg' });

    const { container, unmount } = renderPage();
    await waitForPage();
    expect(container.querySelector('img')).toHaveAttribute(
      'src',
      'https://cdn.exemplo.com/joseane.jpg',
    );
    unmount();

    jest.mocked(getParticipantById).mockResolvedValue(participant);
    const view = renderPage();
    await waitForPage();
    expect(view.container.querySelector('img')).not.toBeInTheDocument();
    expect(screen.getByText('JA')).toHaveAttribute('aria-hidden', 'true');
  });

  it('calcula presença recente e grupos', async () => {
    renderPage();
    await waitForPage();

    const stats = screen.getByRole('region', { name: text.stats.label });
    expect(within(stats).getByText('67%')).toBeInTheDocument();
    expect(
      within(stats).getByRole('img', {
        name: interpolate(text.stats.presenceAria, { present: 2, total: 3 }),
      }),
    ).toBeInTheDocument();
    expect(within(stats).getByText('2 de 3 últimos encontros')).toBeInTheDocument();
    expect(
      await within(stats).findByText(
        interpolate(text.stats.groupsSub, { coordinator: 1, member: 1 }),
      ),
    ).toBeInTheDocument();
  });

  it('lista os grupos com a função da participante e liga para o grupo', async () => {
    renderPage();

    const coordinatorRow = (await screen.findByRole('link', { name: 'Grupo 03' })).closest('tr')!;
    expect(within(coordinatorRow).getByText(text.groups.roles.coordinator)).toBeInTheDocument();
    expect(within(coordinatorRow).getByText('São Paulo')).toBeInTheDocument();
    expect(within(coordinatorRow).getByText('01/03/2024')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Grupo 03' })).toHaveAttribute('href', '/grupos/g3');

    const memberRow = screen.getByRole('link', { name: 'Grupo 12' }).closest('tr')!;
    expect(within(memberRow).getByText(text.groups.roles.member)).toBeInTheDocument();
    expect(within(memberRow).getByText(text.groups.emptyValue)).toBeInTheDocument();
    expect(within(memberRow).getByText(text.groups.noEntryDate)).toBeInTheDocument();
  });

  it('mostra o estado vazio quando não participa de nenhum grupo', async () => {
    jest.mocked(getAllParticipantGroups).mockResolvedValue([]);

    renderPage();

    expect(
      await screen.findByText(interpolate(text.groups.empty, { name: 'Joseane' })),
    ).toBeInTheDocument();
    expect(screen.getByText(text.stats.noGroups)).toBeInTheDocument();
  });

  it('tenta carregar os grupos de novo pela tabela e atualiza os indicadores', async () => {
    jest
      .mocked(getAllParticipantGroups)
      .mockRejectedValueOnce(new Error('rede'))
      .mockRejectedValueOnce(new Error('rede'));
    const { user } = renderPage();
    await waitForPage();

    await user.click(await screen.findByRole('button', { name: locale.table.retry }));

    expect(await screen.findByRole('link', { name: 'Grupo 03' })).toBeInTheDocument();
    expect(getAllParticipantGroups).toHaveBeenCalledTimes(3);
    expect(
      screen.getByText(interpolate(text.stats.groupsSub, { coordinator: 1, member: 1 })),
    ).toBeInTheDocument();
  });

  it('mostra o carregamento dos últimos encontros', async () => {
    jest.mocked(getParticipantPresenceHistory).mockReturnValue(pending());

    renderPage();
    await waitForPage();

    const meetings = screen.getByRole('region', { name: text.meetings.title });
    expect(within(meetings).getByRole('status')).toHaveTextContent(text.meetings.loading);
  });

  it('mostra os últimos encontros com a presença', async () => {
    renderPage();
    await waitForPage();

    const meetings = await screen.findByRole('region', { name: text.meetings.title });
    const first = within(meetings).getByText('O Avesso da Pele').closest('li')!;
    expect(within(first).getByText('22 out 2026')).toBeInTheDocument();
    expect(within(first).getByText('Grupo 03')).toBeInTheDocument();
    expect(within(first).getByText(text.meetings.absent)).toBeInTheDocument();
    const second = within(meetings).getByText('Pequeno Manual Antirracista').closest('li')!;
    expect(within(second).getByText(text.meetings.present)).toBeInTheDocument();
  });

  it('avisa quando os últimos encontros não carregam', async () => {
    jest.mocked(getParticipantPresenceHistory).mockRejectedValue(new Error('403'));

    renderPage();
    await waitForPage();

    expect(await screen.findByText(text.meetings.error)).toBeInTheDocument();
  });

  it('desativa a participante e avisa no toast', async () => {
    jest.mocked(updateParticipantStatus).mockResolvedValue(false);
    const { user } = renderPage();

    await user.click(await screen.findByRole('button', { name: text.status.deactivate }));

    expect(updateParticipantStatus).toHaveBeenCalledWith('p1', false);
    expect(await screen.findByRole('button', { name: text.status.activate })).toBeInTheDocument();
    expect(screen.getByText(text.status.inactive)).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(
      interpolate(text.status.deactivated, { name: 'Joseane' }),
    );
  });

  it('avisa quando o status não pôde ser alterado', async () => {
    jest.mocked(updateParticipantStatus).mockRejectedValue(new Error('500'));
    const { user } = renderPage();

    await user.click(await screen.findByRole('button', { name: text.status.deactivate }));

    expect(await screen.findByText(text.updateStatusError)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: text.status.deactivate })).toBeEnabled();
  });

  describe('remover de um grupo', () => {
    const openRemove = async (user: ReturnType<typeof renderPage>['user'], number: string) => {
      await screen.findByRole('link', { name: `Grupo ${number}` });
      await user.click(
        screen.getByRole('button', {
          name: interpolate(text.groups.actionsAriaLabel, { number }),
        }),
      );
      await user.click(screen.getByRole('menuitem', { name: text.groups.remove }));
    };

    it('remove de um grupo em que é membra', async () => {
      jest.mocked(updateGroupParticipant).mockResolvedValue();
      const { user } = renderPage();

      await openRemove(user, '12');
      const dialog = await screen.findByRole('dialog', {
        name: interpolate(locale.removeFromGroup.title, {
          name: 'Joseane Alves',
          group: 'Grupo 12',
        }),
      });
      await user.click(
        within(dialog).getByRole('button', { name: locale.removeFromGroup.confirm }),
      );

      expect(updateGroupParticipant).toHaveBeenCalledWith('g12', 'p1', 'remove');
      expect(getAllGroupParticipants).not.toHaveBeenCalled();
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
      expect(screen.getByRole('status')).toHaveTextContent(
        interpolate(text.groups.removed, { name: 'Joseane', number: '12' }),
      );
      expect(jest.mocked(getAllParticipantGroups).mock.calls.length).toBeGreaterThan(1);
    });

    it('como única coordenadora, escolhe quem assume antes de sair', async () => {
      jest.mocked(updateGroupParticipant).mockResolvedValue();
      jest.mocked(getAllGroupParticipants).mockResolvedValue({
        items: [
          {
            id: 'p1',
            name: 'Joseane Alves',
            entry_date: null,
            attendance: [],
            email: null,
            is_coordinator: true,
          },
          {
            id: 'p9',
            name: 'Carla Mendes',
            entry_date: null,
            attendance: [],
            email: null,
            is_coordinator: false,
          },
        ],
        total: 2,
      });
      const { user } = renderPage();

      await openRemove(user, '03');
      const dialog = await screen.findByRole('dialog');
      expect(getAllGroupParticipants).toHaveBeenCalledWith('g3');
      await user.click(
        within(dialog).getByRole('button', {
          name: new RegExp(locale.removeFromGroup.newCoordinator),
        }),
      );
      await user.click(screen.getByRole('option', { name: 'Carla Mendes' }));
      await user.click(
        within(dialog).getByRole('button', { name: locale.removeFromGroup.confirm }),
      );

      expect(updateGroupParticipant).toHaveBeenNthCalledWith(1, 'g3', 'p9', 'promote');
      expect(updateGroupParticipant).toHaveBeenNthCalledWith(2, 'g3', 'p1', 'remove');
      expect(await screen.findByRole('status')).toHaveTextContent(
        interpolate(text.groups.removedWithCoordinator, {
          name: 'Joseane',
          number: '03',
          coordinator: 'Carla',
        }),
      );
    });

    it('mantém o modal aberto com o erro quando a remoção falha', async () => {
      jest.mocked(updateGroupParticipant).mockRejectedValue(new Error(text.groups.removeError));
      const { user } = renderPage();

      await openRemove(user, '12');
      const dialog = await screen.findByRole('dialog');
      await user.click(
        within(dialog).getByRole('button', { name: locale.removeFromGroup.confirm }),
      );

      expect(await within(dialog).findByRole('alert')).toHaveTextContent(text.groups.removeError);
    });
  });
});
