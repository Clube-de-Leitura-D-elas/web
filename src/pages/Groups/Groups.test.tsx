import { screen, waitFor, within } from '@testing-library/react';
import { locale } from '../../locales';
import { getGroupFormOptions } from '../../services/groupFormService';
import { getGroupGrid } from '../../services/groupListService';
import { createGroup } from '../../services/groupService';
import { renderWithProviders } from '../../test/render';
import type { GroupGridResponse } from '../../types/groupList';
import { Groups } from '.';

jest.mock('../../services/groupListService', () => ({ getGroupGrid: jest.fn() }));
jest.mock('../../services/groupFormService', () => ({ getGroupFormOptions: jest.fn() }));
jest.mock('../../services/groupService', () => ({ createGroup: jest.fn() }));

const text = locale.groups;
const firstPage = { page: 1, pageSize: 6 };

const response: GroupGridResponse = {
  items: [
    {
      id: 'g7',
      number: 7,
      description: 'Centro',
      createdAt: '2024-03-15T12:00:00Z',
      city: { id: 'c1', name: 'Canoas' },
      coordinator: 'Joana Alves',
      members: 12,
      nextMeetingAt: '2026-08-24T22:00:00Z',
      status: 'active',
    },
    {
      id: 'g12',
      number: 12,
      description: 'Sul',
      createdAt: '2025-01-10T12:00:00Z',
      city: null,
      coordinator: null,
      members: 0,
      nextMeetingAt: null,
      status: 'closed',
    },
  ],
  total: 2,
  summary: { activeGroups: 1, cities: 1 },
  cities: [
    { id: 'c1', name: 'Canoas' },
    { id: 'c2', name: 'Recife' },
  ],
};

const rowOf = (groupName: RegExp) => screen.getByRole('link', { name: groupName }).closest('tr')!;

beforeEach(() => {
  jest.mocked(getGroupGrid).mockResolvedValue(response);
});

describe('Groups', () => {
  it('mostra o resumo no subtítulo', async () => {
    renderWithProviders(<Groups />);

    expect(await screen.findByText('1 grupo ativo em 1 cidade')).toBeInTheDocument();
    expect(getGroupGrid).toHaveBeenCalledWith(firstPage, {
      search: '',
      cityId: '',
      order: 'name_asc',
    });
  });

  it('mostra cada grupo com link, data de criação, coordenadora, encontro e status', async () => {
    renderWithProviders(<Groups />);

    const link = await screen.findByRole('link', { name: /Grupo 07 — Centro/ });
    expect(link).toHaveAttribute('href', '/grupos/g7');
    expect(link).toHaveTextContent('criado em mar/2024');

    const row = rowOf(/Grupo 07/);
    expect(within(row).getByText('Canoas')).toBeInTheDocument();
    expect(within(row).getByText('Joana Alves')).toBeInTheDocument();
    expect(within(row).getByText('12')).toBeInTheDocument();
    expect(within(row).getByText('24 ago, 19h')).toBeInTheDocument();
    expect(within(row).getByText(text.table.statusActive)).toBeInTheDocument();
  });

  it('avisa grupos sem cidade, coordenadora ou próximo encontro', async () => {
    renderWithProviders(<Groups />);
    await screen.findByRole('link', { name: /Grupo 12 — Sul/ });

    const row = rowOf(/Grupo 12/);
    expect(within(row).getByText(text.table.emptyCity)).toBeInTheDocument();
    expect(within(row).getByText(text.table.emptyCoordinator)).toBeInTheDocument();
    expect(within(row).getByText(text.table.emptyNextMeeting)).toBeInTheDocument();
    expect(within(row).getByText(text.table.statusClosed)).toBeInTheDocument();
  });

  it('preenche o filtro de cidade com a resposta e filtra por ela', async () => {
    const { user } = renderWithProviders(<Groups />);
    await screen.findByRole('link', { name: /Grupo 07/ });

    await user.click(screen.getByRole('button', { name: text.filters.cityAll }));
    await user.click(screen.getByRole('option', { name: 'Recife' }));

    await waitFor(() =>
      expect(getGroupGrid).toHaveBeenLastCalledWith(
        firstPage,
        expect.objectContaining({ cityId: 'c2' }),
      ),
    );
  });

  it('ordena de Z a A', async () => {
    const { user } = renderWithProviders(<Groups />);
    await screen.findByRole('link', { name: /Grupo 07/ });

    await user.click(screen.getByRole('button', { name: text.filters.sortNameAsc }));
    await user.click(screen.getByRole('option', { name: text.filters.sortNameDesc }));

    await waitFor(() =>
      expect(getGroupGrid).toHaveBeenLastCalledWith(
        firstPage,
        expect.objectContaining({ order: 'name_desc' }),
      ),
    );
  });

  it('busca depois que a usuária para de digitar', async () => {
    const { user } = renderWithProviders(<Groups />);
    await screen.findByRole('link', { name: /Grupo 07/ });

    await user.type(screen.getByLabelText(text.filters.searchPlaceholder), 'sul');

    await waitFor(() =>
      expect(getGroupGrid).toHaveBeenLastCalledWith(
        firstPage,
        expect.objectContaining({ search: 'sul' }),
      ),
    );
    expect(getGroupGrid).toHaveBeenCalledTimes(2);
  });

  it('cria um grupo pelo modal e recarrega a tabela', async () => {
    jest.mocked(getGroupFormOptions).mockResolvedValue({
      citiesAndZones: [{ value: 'c2', label: 'Recife' }],
      coordinators: [],
      nextGroupNumber: 43,
    });
    jest.mocked(createGroup).mockResolvedValue({} as never);
    const { user } = renderWithProviders(<Groups />);
    await screen.findByRole('link', { name: /Grupo 07/ });

    await user.click(screen.getByRole('button', { name: text.newGroup }));
    const dialog = screen.getByRole('dialog', { name: text.newGroupModal.title });
    const city = within(dialog).getByRole('combobox', { name: text.newGroupModal.city.label });
    await waitFor(() => expect(city).toBeEnabled());
    await user.type(city, 'rec');
    await user.click(screen.getByRole('option', { name: 'Recife' }));
    await user.click(within(dialog).getByRole('button', { name: text.newGroupModal.save }));

    expect(createGroup).toHaveBeenCalledWith({ cityId: 'c2', coordinatorId: null });
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(getGroupGrid).toHaveBeenCalledTimes(2));
  });
});
