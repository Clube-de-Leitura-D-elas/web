import { getGroupGrid } from './groupListService';
import { supabase } from './supabaseClient';

const invoke = jest.mocked(supabase.functions.invoke);

const response = {
  items: [],
  total: 0,
  summary: { activeGroups: 0, cities: 0 },
  cities: [],
};

describe('getGroupGrid', () => {
  it('envia página, ordem, busca sem espaços nas pontas e cidade', async () => {
    invoke.mockResolvedValue({ data: response, error: null });

    await expect(
      getGroupGrid(
        { page: 3, pageSize: 6 },
        { search: '  sul ', cityId: 'c1', order: 'name_desc' },
      ),
    ).resolves.toBe(response);
    expect(invoke).toHaveBeenCalledWith(
      'get-groups-web?page=3&pageSize=6&order=name_desc&search=sul&cityId=c1',
      { method: 'GET' },
    );
  });

  it('omite busca em branco e cidade vazia', async () => {
    invoke.mockResolvedValue({ data: response, error: null });

    await getGroupGrid({ page: 1, pageSize: 6 }, { search: '   ', cityId: '', order: 'name_asc' });

    expect(invoke).toHaveBeenCalledWith('get-groups-web?page=1&pageSize=6&order=name_asc', {
      method: 'GET',
    });
  });

  it('repassa o erro da function', async () => {
    const error = new Error('500');
    invoke.mockResolvedValue({ data: null, error } as never);

    await expect(
      getGroupGrid({ page: 1, pageSize: 6 }, { search: '', cityId: '', order: 'name_asc' }),
    ).rejects.toBe(error);
  });

  it('falha quando a resposta vem vazia', async () => {
    invoke.mockResolvedValue({ data: null, error: null });

    await expect(
      getGroupGrid({ page: 1, pageSize: 6 }, { search: '', cityId: '', order: 'name_asc' }),
    ).rejects.toThrow('returned no data');
  });
});
