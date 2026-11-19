import { act, screen, waitFor, within } from '@testing-library/react';
import { locale } from '../../locales';
import { CityServiceError } from '../../services/cityErrors';
import { getCityGrid, saveCity, updateCityStatus } from '../../services/cityService';
import { renderWithProviders } from '../../test/render';
import type { CityGridResponse } from '../../types/city';
import { Settings } from '.';

jest.mock('../../services/authService', () => ({ changePassword: jest.fn() }));
jest.mock('../../services/cityService', () => ({
  getCityGrid: jest.fn(),
  saveCity: jest.fn(),
  updateCityStatus: jest.fn(),
}));

const text = locale.settings.cities;
const firstPage = { page: 1, pageSize: 8 };

const response: CityGridResponse = {
  items: [
    {
      id: 'poa',
      name: 'Porto Alegre',
      uf: 'RS',
      isActive: true,
      groups: 3,
      activeGroups: 2,
      zones: [
        { id: 'z1', name: 'Centro Histórico', isActive: true, activeGroups: 1 },
        { id: 'z2', name: 'Zona Norte', isActive: true, activeGroups: 0 },
        { id: 'z3', name: 'Zona Sul', isActive: true, activeGroups: 1 },
        { id: 'z4', name: 'Zona Leste', isActive: true, activeGroups: 0 },
        { id: 'z5', name: 'Restinga', isActive: false, activeGroups: 0 },
      ],
    },
    {
      id: 'cwb',
      name: 'Curitiba',
      uf: 'PR',
      isActive: false,
      groups: 0,
      activeGroups: 0,
      zones: [],
    },
    {
      id: 'can',
      name: 'Canoas',
      uf: 'RS',
      isActive: true,
      groups: 1,
      activeGroups: 0,
      zones: [],
    },
  ],
  total: 3,
  ufs: ['PR', 'RS'],
  summary: { activeCities: 2, activeZones: 4 },
};

const rowOf = (name: string) => screen.getByText(name, { selector: 'span' }).closest('tr')!;

const openActions = async (user: ReturnType<typeof renderWithProviders>['user'], name: string) => {
  await user.click(screen.getByRole('button', { name: `Ações de ${name}` }));
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(getCityGrid).mockResolvedValue(response);
});

describe('Settings', () => {
  it('mostra o título e a aba de cidades', async () => {
    renderWithProviders(<Settings />);

    expect(screen.getByRole('heading', { name: locale.settings.title })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: locale.settings.tabs.cities })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(await screen.findByText('2 cidades ativas e 4 regiões')).toBeInTheDocument();
    expect(getCityGrid).toHaveBeenCalledWith(firstPage, { search: '', uf: '', status: 'all' });
  });

  it('troca para a aba de autenticação e guarda a aba na URL', async () => {
    const { user } = renderWithProviders(<Settings />, {
      route: '/configuracoes',
      path: '/configuracoes',
      showLocationSearch: true,
    });
    await screen.findByText('Porto Alegre');

    await user.click(screen.getByRole('tab', { name: locale.settings.tabs.authentication }));

    expect(screen.getByRole('tab', { name: locale.settings.tabs.authentication })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByLabelText(locale.settings.authentication.current.label)).toBeInTheDocument();
    expect(screen.getByTestId('location-search')).toHaveTextContent('?aba=autenticacao');
  });

  it('volta para Cidades sem perder a busca nem buscar de novo', async () => {
    const { user } = renderWithProviders(<Settings />);
    await screen.findByText('Porto Alegre');
    await user.type(screen.getByLabelText(text.filters.searchPlaceholder), 'zona');
    await waitFor(() =>
      expect(getCityGrid).toHaveBeenLastCalledWith(
        firstPage,
        expect.objectContaining({ search: 'zona' }),
      ),
    );
    const calls = jest.mocked(getCityGrid).mock.calls.length;

    await user.click(screen.getByRole('tab', { name: locale.settings.tabs.authentication }));
    await user.click(screen.getByRole('tab', { name: locale.settings.tabs.cities }));

    expect(screen.getByLabelText(text.filters.searchPlaceholder)).toHaveValue('zona');
    expect(getCityGrid).toHaveBeenCalledTimes(calls);
  });

  it('troca de aba sem apagar os outros parâmetros da URL', async () => {
    const { user } = renderWithProviders(<Settings />, {
      route: '/configuracoes?origem=menu',
      path: '/configuracoes',
      showLocationSearch: true,
    });

    await user.click(screen.getByRole('tab', { name: locale.settings.tabs.authentication }));
    expect(screen.getByTestId('location-search')).toHaveTextContent(
      '?origem=menu&aba=autenticacao',
    );

    await user.click(screen.getByRole('tab', { name: locale.settings.tabs.cities }));
    expect(screen.getByTestId('location-search')).toHaveTextContent('?origem=menu');
  });

  it('abre direto na aba de autenticação pelo endereço', () => {
    renderWithProviders(<Settings />, {
      route: '/configuracoes?aba=autenticacao',
      path: '/configuracoes',
    });

    expect(screen.getByRole('tab', { name: locale.settings.tabs.authentication })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(getCityGrid).not.toHaveBeenCalled();
  });

  it('lista estado, regiões ativas, grupos e status de cada cidade', async () => {
    renderWithProviders(<Settings />);
    await screen.findByText('Porto Alegre');

    const poa = rowOf('Porto Alegre');
    expect(within(poa).getByText('RS')).toHaveAttribute('title', 'Rio Grande do Sul');
    expect(within(poa).getByText('Centro Histórico')).toBeInTheDocument();
    expect(within(poa).getByText('Zona Norte')).toBeInTheDocument();
    expect(within(poa).getByText('Zona Sul')).toBeInTheDocument();
    expect(within(poa).queryByText('Zona Leste')).not.toBeInTheDocument();
    expect(within(poa).queryByText('Restinga')).not.toBeInTheDocument();
    expect(within(poa).getByText('mais 1 região')).toBeInTheDocument();
    expect(within(poa).getByText('3')).toBeInTheDocument();
    expect(within(poa).getByText(text.table.statusActive)).toBeInTheDocument();

    const cwb = rowOf('Curitiba');
    expect(within(cwb).getByText(text.table.noZones)).toBeInTheDocument();
    expect(within(cwb).getByText(text.table.statusInactive)).toBeInTheDocument();
  });

  it('filtra por estado e por status', async () => {
    const { user } = renderWithProviders(<Settings />);
    await screen.findByText('Porto Alegre');

    await user.click(screen.getByRole('button', { name: text.filters.ufAll }));
    await user.click(screen.getByRole('option', { name: 'Estado: PR' }));

    await waitFor(() =>
      expect(getCityGrid).toHaveBeenLastCalledWith(
        firstPage,
        expect.objectContaining({ uf: 'PR' }),
      ),
    );

    await user.click(screen.getByRole('button', { name: text.filters.statusAll }));
    await user.click(screen.getByRole('option', { name: text.filters.statusInactive }));

    await waitFor(() =>
      expect(getCityGrid).toHaveBeenLastCalledWith(
        firstPage,
        expect.objectContaining({ uf: 'PR', status: 'inactive' }),
      ),
    );
  });

  it('busca por cidade ou região depois que a usuária para de digitar', async () => {
    const { user } = renderWithProviders(<Settings />);
    await screen.findByText('Porto Alegre');

    await user.type(screen.getByLabelText(text.filters.searchPlaceholder), 'zona sul');

    await waitFor(() =>
      expect(getCityGrid).toHaveBeenLastCalledWith(
        firstPage,
        expect.objectContaining({ search: 'zona sul' }),
      ),
    );
  });

  it('não deixa desativar cidade com grupo ativo', async () => {
    const { user } = renderWithProviders(<Settings />);
    await screen.findByText('Porto Alegre');

    await openActions(user, 'Porto Alegre');

    const deactivate = screen.getByRole('menuitem', { name: new RegExp(text.table.deactivate) });
    expect(deactivate).toHaveAttribute('aria-disabled', 'true');
    expect(deactivate).toHaveAccessibleDescription('Tem 2 grupos ativos');

    await user.click(deactivate);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('desativa depois de confirmar e recarrega a tabela', async () => {
    jest.mocked(updateCityStatus).mockResolvedValue(false);
    const { user } = renderWithProviders(<Settings />);
    await screen.findByText('Canoas');

    await openActions(user, 'Canoas');
    await user.click(screen.getByRole('menuitem', { name: text.table.deactivate }));

    const dialog = screen.getByRole('dialog', { name: 'Desativar Canoas?' });
    await user.click(within(dialog).getByRole('button', { name: text.deactivateModal.confirm }));

    expect(updateCityStatus).toHaveBeenCalledWith('can', false);
    expect(await screen.findByText('Canoas foi desativada.')).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await waitFor(() => expect(getCityGrid).toHaveBeenCalledTimes(2));
  });

  it('avisa quando o servidor recusa por grupos ativos', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest
      .mocked(updateCityStatus)
      .mockRejectedValue(new CityServiceError('city_has_active_groups', { activeGroups: 1 }));
    const { user } = renderWithProviders(<Settings />);
    await screen.findByText('Canoas');

    await openActions(user, 'Canoas');
    await user.click(screen.getByRole('menuitem', { name: text.table.deactivate }));
    await user.click(
      within(screen.getByRole('dialog')).getByRole('button', {
        name: text.deactivateModal.confirm,
      }),
    );

    expect(
      await screen.findByText(
        'Canoas tem 1 grupo ativo. Encerre o grupo antes de desativar a cidade.',
      ),
    ).toBeInTheDocument();
  });

  it('reativa uma cidade inativa sem confirmação', async () => {
    jest.mocked(updateCityStatus).mockResolvedValue(true);
    const { user } = renderWithProviders(<Settings />);
    await screen.findByText('Curitiba');

    await openActions(user, 'Curitiba');
    await user.click(screen.getByRole('menuitem', { name: text.table.reactivate }));

    expect(updateCityStatus).toHaveBeenCalledWith('cwb', true);
    expect(await screen.findByText('Curitiba foi reativada.')).toBeInTheDocument();
  });

  it('mantém aberta a confirmação de outra cidade quando uma reativação termina', async () => {
    let finishReactivation: (value: boolean) => void = () => {};
    jest.mocked(updateCityStatus).mockReturnValueOnce(
      new Promise((resolve) => {
        finishReactivation = resolve;
      }),
    );
    const { user } = renderWithProviders(<Settings />);
    await screen.findByText('Curitiba');

    await openActions(user, 'Curitiba');
    await user.click(screen.getByRole('menuitem', { name: text.table.reactivate }));
    await openActions(user, 'Canoas');
    await user.click(screen.getByRole('menuitem', { name: text.table.deactivate }));
    expect(screen.getByRole('dialog', { name: 'Desativar Canoas?' })).toBeInTheDocument();

    await act(async () => finishReactivation(true));

    expect(await screen.findByText('Curitiba foi reativada.')).toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: 'Desativar Canoas?' })).toBeInTheDocument();
  });

  it('não manda a reativação duas vezes enquanto a primeira está em andamento', async () => {
    jest.mocked(updateCityStatus).mockReturnValue(new Promise(() => {}));
    const { user } = renderWithProviders(<Settings />);
    await screen.findByText('Curitiba');

    await openActions(user, 'Curitiba');
    await user.click(screen.getByRole('menuitem', { name: text.table.reactivate }));
    await openActions(user, 'Curitiba');
    await user.click(screen.getByRole('menuitem', { name: text.table.reactivate }));

    expect(updateCityStatus).toHaveBeenCalledTimes(1);
  });

  it('avisa sem número quando o servidor não informa quantos grupos estão ativos', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest
      .mocked(updateCityStatus)
      .mockRejectedValue(new CityServiceError('city_has_active_groups', { activeGroups: null }));
    const { user } = renderWithProviders(<Settings />);
    await screen.findByText('Canoas');

    await openActions(user, 'Canoas');
    await user.click(screen.getByRole('menuitem', { name: text.table.deactivate }));
    await user.click(
      within(screen.getByRole('dialog')).getByRole('button', {
        name: text.deactivateModal.confirm,
      }),
    );

    expect(
      await screen.findByText(
        'Canoas tem grupos ativos. Encerre os grupos antes de desativar a cidade.',
      ),
    ).toBeInTheDocument();
  });

  it('limita a busca ao tamanho que o servidor aceita', () => {
    renderWithProviders(<Settings />);

    expect(screen.getByLabelText(text.filters.searchPlaceholder)).toHaveAttribute(
      'maxLength',
      '100',
    );
  });

  it('ignora o resumo de uma consulta antiga que termina depois da atual', async () => {
    let finishFirst: (value: CityGridResponse) => void = () => {};
    jest.mocked(getCityGrid).mockReturnValueOnce(
      new Promise((resolve) => {
        finishFirst = resolve;
      }),
    );
    const { user } = renderWithProviders(<Settings />);

    await user.click(screen.getByRole('button', { name: text.filters.statusAll }));
    await user.click(screen.getByRole('option', { name: text.filters.statusInactive }));
    expect(await screen.findByText('2 cidades ativas e 4 regiões')).toBeInTheDocument();

    await act(async () =>
      finishFirst({
        ...response,
        ufs: ['SC'],
        summary: { activeCities: 9, activeZones: 9 },
      }),
    );

    expect(screen.getByText('2 cidades ativas e 4 regiões')).toBeInTheDocument();
    expect(screen.queryByText('9 cidades ativas e 9 regiões')).not.toBeInTheDocument();
  });

  it('cria uma cidade pelo modal e recarrega a tabela', async () => {
    jest.mocked(saveCity).mockResolvedValue('new');
    const { user } = renderWithProviders(<Settings />);
    await screen.findByText('Porto Alegre');

    await user.click(screen.getByRole('button', { name: text.newCity }));
    const dialog = screen.getByRole('dialog', { name: text.modal.createTitle });

    await user.type(within(dialog).getByLabelText(text.modal.name.label), 'Gravataí');
    await user.type(within(dialog).getByRole('combobox', { name: text.modal.uf.label }), 'RS');
    await user.click(screen.getByRole('option', { name: 'RS — Rio Grande do Sul' }));
    await user.click(within(dialog).getByRole('button', { name: text.modal.save }));

    expect(saveCity).toHaveBeenCalledWith({ cityId: null, name: 'Gravataí', uf: 'RS', zones: [] });
    expect(await screen.findByText('Gravataí foi cadastrada.')).toBeInTheDocument();
    await waitFor(() => expect(getCityGrid).toHaveBeenCalledTimes(2));
  });

  it('abre a edição com os dados da cidade', async () => {
    const { user } = renderWithProviders(<Settings />);
    await screen.findByText('Porto Alegre');

    await openActions(user, 'Porto Alegre');
    await user.click(screen.getByRole('menuitem', { name: text.table.edit }));

    const dialog = screen.getByRole('dialog', { name: 'Editar Porto Alegre' });
    expect(within(dialog).getByLabelText(text.modal.name.label)).toHaveValue('Porto Alegre');
    expect(within(dialog).getByRole('combobox', { name: text.modal.uf.label })).toHaveValue(
      'RS — Rio Grande do Sul',
    );
    expect(within(dialog).getAllByPlaceholderText(text.modal.zones.placeholder)).toHaveLength(5);
  });
});
