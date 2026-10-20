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
const firstPage = { page: 1, pageSize: 6 };

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
    summary: { groups: 4, cities: 1 },
  });
  jest.mocked(getParticipantsPage).mockResolvedValue({
    items: [
      { id: 'p1', name: 'Ana Souza', is_active: true, group_users: [{ id: 'gu1' }] },
      { id: 'p2', name: 'Bia Lima', is_active: false, group_users: [] },
    ],
    total: 2,
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
  it('mostra o resumo de grupos e cidades no subtítulo', async () => {
    renderWithProviders(<Participants />);

    expect(await screen.findByText('4 grupos ativos em 1 cidade')).toBeInTheDocument();
  });

  it('lista as participantes com link para o perfil, grupos e status', async () => {
    renderWithProviders(<Participants />);

    expect(await screen.findByRole('link', { name: 'Ana Souza' })).toHaveAttribute(
      'href',
      '/participantes/p1',
    );
    expect(screen.getByText(text.table.groupCountSingle)).toBeInTheDocument();
    expect(screen.getByText(interpolate(text.table.groupsCount, { count: 0 }))).toBeInTheDocument();
    expect(screen.getByText(text.table.statusActive)).toBeInTheDocument();
    expect(screen.getByText(text.table.statusInactive)).toBeInTheDocument();
    expect(getParticipantsPage).toHaveBeenCalledWith(firstPage, {
      search: '',
      cityId: '',
      groupId: '',
      order: 'name_asc',
    });
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
