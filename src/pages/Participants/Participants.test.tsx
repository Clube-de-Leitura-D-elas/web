import { screen, waitFor, within } from '@testing-library/react';
import { interpolate, locale } from '../../locales';
import { getParticipantFilterOptions } from '../../services/filterOptionsService';
import {
  approvePendingParticipant,
  getParticipantsPage,
  getPendingParticipantsPage,
  rejectPendingParticipant,
} from '../../services/participantListService';
import { renderWithProviders } from '../../test/render';
import { Participants } from '.';

jest.mock('../../services/participantListService', () => ({
  getParticipantsPage: jest.fn(),
  getPendingParticipantsPage: jest.fn(),
  approvePendingParticipant: jest.fn(),
  rejectPendingParticipant: jest.fn(),
}));
jest.mock('../../services/filterOptionsService', () => ({
  getParticipantFilterOptions: jest.fn(),
}));

const text = locale.participants;
const firstPage = { page: 1, pageSize: 10 };

beforeEach(() => {
  jest.mocked(getParticipantFilterOptions).mockResolvedValue({
    cityOptions: [
      { value: '', label: text.filters.cityAll },
      { value: 'c1', label: 'Canoas' },
    ],
    groupOptions: [
      { value: '', label: text.filters.groupAll },
      { value: 'g1', label: 'Grupo 3 - Centro' },
    ],
    summary: {
      groups: 4,
      cities: 1,
      activeParticipants: 10,
    },
  });
  jest.mocked(getParticipantsPage).mockResolvedValue({
    items: [
      {
        id: 'p1',
        name: 'Ana Souza',
        status: 'active',
        group_users: [{ id: 'gu1' }],
        recent_attendance: ['PRESENT', 'ABSENT', 'PRESENT'],
      },
      { id: 'p2', name: 'Bia Lima', status: 'inactive', group_users: [] },
      {
        id: 'p3',
        name: 'Dora Reis',
        status: 'awaiting_account',
        group_users: [],
        recent_attendance: [],
      },
    ],
    total: 3,
  });
  jest.mocked(getPendingParticipantsPage).mockResolvedValue({
    items: [
      {
        id: 'pend1',
        name: 'Carla Dias',
        city: null,
        phone_number: '(51) 90000-0000',
        instagram_user: 'carladias',
      },
    ],
    total: 1,
  });
});

const openRequestsTab = async (user: ReturnType<typeof renderWithProviders>['user']) => {
  await user.click(screen.getByRole('tab', { name: text.tabs.requests }));
  return screen.findByText('Carla Dias');
};

describe('Participants', () => {
  it('mostra a quantidade de participantes ativas no subtítulo', async () => {
    renderWithProviders(<Participants />);

    expect(await screen.findByText('10 participantes ativas')).toBeInTheDocument();
  });

  it('mostra participante no singular quando existe apenas um ativo', async () => {
    jest.mocked(getParticipantFilterOptions).mockResolvedValueOnce({
      cityOptions: [
        { value: '', label: text.filters.cityAll },
        { value: 'c1', label: 'Canoas' },
      ],
      groupOptions: [
        { value: '', label: text.filters.groupAll },
        { value: 'g1', label: 'Grupo 3 - Centro' },
      ],
      summary: {
        groups: 4,
        cities: 1,
        activeParticipants: 1,
      },
    });

    renderWithProviders(<Participants />);

    expect(await screen.findByText('1 participante ativa')).toBeInTheDocument();
  });

  it('mostra "Nenhuma participante ativa" quando a contagem é zero', async () => {
    jest.mocked(getParticipantFilterOptions).mockResolvedValueOnce({
      cityOptions: [],
      groupOptions: [],
      summary: { groups: 4, cities: 1, activeParticipants: 0 },
    });

    renderWithProviders(<Participants />);

    expect(await screen.findByText('Nenhuma participante ativa')).toBeInTheDocument();
  });

  it('esconde o subtítulo quando não há contagem de participantes ativas', async () => {
    jest.mocked(getParticipantFilterOptions).mockResolvedValueOnce({
      cityOptions: [],
      groupOptions: [],
      summary: { groups: 4, cities: 1, activeParticipants: null },
    });

    renderWithProviders(<Participants />);

    expect(await screen.findByRole('link', { name: 'Ana Souza' })).toBeInTheDocument();
    expect(screen.queryByText(/participantes? ativas?/i)).not.toBeInTheDocument();
  });

  it('lista as participantes com link para o perfil, grupos e status', async () => {
    renderWithProviders(<Participants />);

    expect(await screen.findByRole('link', { name: 'Ana Souza' })).toHaveAttribute(
      'href',
      '/participantes/p1',
    );
    expect(screen.getByText(text.table.groupCountSingle)).toBeInTheDocument();
    expect(screen.getAllByText(interpolate(text.table.groupsCount, { count: 0 }))).toHaveLength(2);
    expect(screen.getByText(text.table.statusActive)).toBeInTheDocument();
    expect(screen.getByText(text.table.statusInactive)).toBeInTheDocument();
    expect(getParticipantsPage).toHaveBeenCalledWith(firstPage, {
      search: '',
      cityId: '',
      groupId: '',
      order: 'name_asc',
    });
  });

  it('mostra a presença nos últimos encontros, da mais antiga para a mais nova', async () => {
    renderWithProviders(<Participants />);

    await screen.findByText('Ana Souza');
    const row = screen.getByRole('row', { name: /Ana Souza/ });
    const marks = within(row).getByRole('img', {
      name: interpolate(text.table.attendanceAria, { present: 2, total: 3 }),
    });
    expect(Array.from(marks.children).map((mark) => mark.textContent)).toEqual([
      text.table.attendancePresentShort,
      text.table.attendanceAbsentShort,
      text.table.attendancePresentShort,
    ]);
  });

  it('mostra o traço para quem ainda não tem presença registrada', async () => {
    renderWithProviders(<Participants />);

    await screen.findByText('Ana Souza');
    for (const name of [/Bia Lima/, /Dora Reis/]) {
      const row = screen.getByRole('row', { name });
      expect(within(row).queryByRole('img')).not.toBeInTheDocument();
      expect(within(row).getByText(text.table.emptyValue)).toBeInTheDocument();
    }
  });

  it('mostra quem aguarda criação de conta sem link para o perfil', async () => {
    renderWithProviders(<Participants />);

    await screen.findByText('Dora Reis');
    const row = screen.getByRole('row', { name: /Dora Reis/ });
    expect(within(row).getByText(text.table.statusAwaitingAccount)).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Dora Reis' })).not.toBeInTheDocument();
  });

  it('busca pelo nome depois que a usuária para de digitar', async () => {
    const { user } = renderWithProviders(<Participants />);
    await screen.findByText('Ana Souza');

    await user.type(screen.getByLabelText(text.filters.searchPlaceholder), 'ana');

    await waitFor(() =>
      expect(getParticipantsPage).toHaveBeenLastCalledWith(
        firstPage,
        expect.objectContaining({ search: 'ana' }),
      ),
    );
    // uma busca para o texto inteiro, não uma por tecla
    expect(getParticipantsPage).toHaveBeenCalledTimes(2);
  });

  it('filtra por cidade e por grupo', async () => {
    const { user } = renderWithProviders(<Participants />);
    await screen.findByText('Ana Souza');

    await user.click(screen.getByRole('button', { name: text.filters.cityAll }));
    await user.click(screen.getByRole('option', { name: 'Canoas' }));
    await user.click(screen.getByRole('button', { name: text.filters.groupAll }));
    await user.click(screen.getByRole('option', { name: 'Grupo 3 - Centro' }));

    await waitFor(() =>
      expect(getParticipantsPage).toHaveBeenLastCalledWith(
        firstPage,
        expect.objectContaining({ cityId: 'c1', groupId: 'g1' }),
      ),
    );
  });

  it('limpa a busca e os filtros de uma vez', async () => {
    const { user } = renderWithProviders(<Participants />);
    await screen.findByText('Ana Souza');
    const clear = screen.getByRole('button', { name: text.filters.clear });
    expect(clear).toBeDisabled();

    await user.type(screen.getByLabelText(text.filters.searchPlaceholder), 'ana');
    await user.click(screen.getByRole('button', { name: text.filters.cityAll }));
    await user.click(screen.getByRole('option', { name: 'Canoas' }));
    await waitFor(() =>
      expect(getParticipantsPage).toHaveBeenLastCalledWith(
        firstPage,
        expect.objectContaining({ search: 'ana', cityId: 'c1' }),
      ),
    );
    const callsBeforeClear = jest.mocked(getParticipantsPage).mock.calls.length;
    await user.click(clear);

    expect(screen.getByLabelText(text.filters.searchPlaceholder)).toHaveValue('');
    expect(screen.getByRole('button', { name: text.filters.cityAll })).toBeInTheDocument();
    expect(clear).toBeDisabled();
    await waitFor(() =>
      expect(getParticipantsPage).toHaveBeenLastCalledWith(
        firstPage,
        expect.objectContaining({ search: '', cityId: '', groupId: '' }),
      ),
    );
    const callsAfterClear = jest.mocked(getParticipantsPage).mock.calls.slice(callsBeforeClear);
    expect(callsAfterClear.every(([, filters]) => filters.search === '')).toBe(true);
    expect(screen.getByRole('button', { name: text.filters.sortNameAsc })).toBeInTheDocument();
  });

  it('inverte a ordenação', async () => {
    const { user } = renderWithProviders(<Participants />);
    await screen.findByText('Ana Souza');

    await user.click(screen.getByRole('button', { name: text.filters.sortNameAsc }));

    expect(screen.getByRole('button', { name: text.filters.sortNameDesc })).toBeInTheDocument();
    await waitFor(() =>
      expect(getParticipantsPage).toHaveBeenLastCalledWith(
        firstPage,
        expect.objectContaining({ order: 'name_desc' }),
      ),
    );
  });

  describe('aba de solicitações', () => {
    it('lista as solicitações pendentes e desabilita os filtros de cidade e grupo', async () => {
      const { user } = renderWithProviders(<Participants />);

      await openRequestsTab(user);

      expect(getPendingParticipantsPage).toHaveBeenCalledWith(firstPage, {
        search: '',
        order: 'name_asc',
      });
      const row = screen.getByText('Carla Dias').closest('tr')!;
      expect(within(row).getByText(text.table.emptyValue)).toBeInTheDocument();
      expect(within(row).getByText('(51) 90000-0000')).toBeInTheDocument();
      expect(within(row).getByText('@carladias')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: text.filters.cityAll })).toBeDisabled();
      expect(screen.getByRole('button', { name: text.filters.groupAll })).toBeDisabled();
    });

    it('aceita a solicitação e recarrega as duas listas', async () => {
      jest.mocked(approvePendingParticipant).mockResolvedValue();
      const { user } = renderWithProviders(<Participants />);
      await screen.findByText('Ana Souza');
      await openRequestsTab(user);

      await user.click(
        screen.getByRole('button', {
          name: interpolate(text.requests.approveAriaLabel, { name: 'Carla Dias' }),
        }),
      );

      expect(approvePendingParticipant).toHaveBeenCalledWith('pend1');
      await waitFor(() => expect(getPendingParticipantsPage).toHaveBeenCalledTimes(2));

      await user.click(screen.getByRole('tab', { name: text.tabs.participants }));
      await waitFor(() => expect(getParticipantsPage).toHaveBeenCalledTimes(2));
    });

    it('recusa a solicitação e recarrega a lista', async () => {
      jest.mocked(rejectPendingParticipant).mockResolvedValue();
      const { user } = renderWithProviders(<Participants />);
      await openRequestsTab(user);

      await user.click(
        screen.getByRole('button', {
          name: interpolate(text.requests.rejectAriaLabel, { name: 'Carla Dias' }),
        }),
      );

      expect(rejectPendingParticipant).toHaveBeenCalledWith('pend1');
      await waitFor(() => expect(getPendingParticipantsPage).toHaveBeenCalledTimes(2));
    });

    it('não recarrega a lista quando a recusa falha', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      jest.mocked(rejectPendingParticipant).mockRejectedValue(new Error('falhou'));
      const { user } = renderWithProviders(<Participants />);
      await openRequestsTab(user);

      await user.click(
        screen.getByRole('button', {
          name: interpolate(text.requests.rejectAriaLabel, { name: 'Carla Dias' }),
        }),
      );

      await waitFor(() => expect(console.error).toHaveBeenCalled());
      expect(getPendingParticipantsPage).toHaveBeenCalledTimes(1);
    });
  });
});
