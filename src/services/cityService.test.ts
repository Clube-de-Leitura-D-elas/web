import { FunctionsHttpError } from '@supabase/functions-js';
import { CityServiceError } from './cityErrors';
import { getCityGrid, saveCity, updateCityStatus } from './cityService';
import { supabase } from './supabaseClient';

const invoke = jest.mocked(supabase.functions.invoke);

const respond = (data: unknown) => invoke.mockResolvedValue({ data, error: null });
const failWith = (status: number, body: unknown) =>
  invoke.mockResolvedValue({
    data: null,
    error: new FunctionsHttpError({ status, json: async () => body }),
  } as never);

const grid = {
  items: [],
  total: 0,
  ufs: ['RS'],
  summary: { activeCities: 0, activeZones: 0 },
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('getCityGrid', () => {
  it('envia só os filtros preenchidos', async () => {
    respond(grid);

    await expect(
      getCityGrid({ page: 2, pageSize: 8 }, { search: '  ', uf: '', status: 'all' }),
    ).resolves.toEqual(grid);

    expect(invoke).toHaveBeenCalledWith('get-cities-web?page=2&pageSize=8', { method: 'GET' });
  });

  it('envia busca, estado e status', async () => {
    respond(grid);

    await getCityGrid(
      { page: 1, pageSize: 8 },
      { search: ' zona sul ', uf: 'RS', status: 'inactive' },
    );

    expect(invoke).toHaveBeenCalledWith(
      'get-cities-web?page=1&pageSize=8&search=zona+sul&uf=RS&status=inactive',
      { method: 'GET' },
    );
  });

  it('falha quando a resposta vem vazia', async () => {
    respond(null);

    await expect(
      getCityGrid({ page: 1, pageSize: 8 }, { search: '', uf: '', status: 'all' }),
    ).rejects.toThrow('returned no data');
  });
});

describe('saveCity', () => {
  it('manda a cidade e as regiões no formato da function', async () => {
    respond({ id: 'c1' });

    await expect(
      saveCity({
        cityId: null,
        name: 'Canoas',
        uf: 'RS',
        zones: [
          { id: null, name: 'Centro', isActive: true },
          { id: 'z1', name: 'Niterói', isActive: false },
        ],
      }),
    ).resolves.toBe('c1');

    expect(invoke).toHaveBeenCalledWith('save-city-web', {
      body: {
        city_id: null,
        name: 'Canoas',
        uf: 'RS',
        zones: [
          { id: null, name: 'Centro', is_active: true },
          { id: 'z1', name: 'Niterói', is_active: false },
        ],
      },
    });
  });

  it('traduz cidade repetida no estado', async () => {
    failWith(409, { error: 'city already exists in this state', code: 'duplicate_city' });

    await expect(
      saveCity({ cityId: null, name: 'Porto Alegre', uf: 'RS', zones: [] }),
    ).rejects.toMatchObject({ code: 'duplicate_city' });
  });

  it('traduz região com grupos ativos e diz qual é', async () => {
    failWith(409, {
      error: 'zone has active groups',
      code: 'zone_has_active_groups',
      zone: 'Savassi',
    });

    const error = await saveCity({ cityId: 'c1', name: 'BH', uf: 'MG', zones: [] }).catch(
      (caught: unknown) => caught,
    );

    expect(error).toBeInstanceOf(CityServiceError);
    expect(error).toMatchObject({ code: 'zone_has_active_groups', zone: 'Savassi' });
  });

  it('trata erro sem corpo como unknown', async () => {
    invoke.mockResolvedValue({ data: null, error: new Error('network') } as never);

    await expect(
      saveCity({ cityId: null, name: 'Canoas', uf: 'RS', zones: [] }),
    ).rejects.toMatchObject({ code: 'unknown' });
  });
});

describe('updateCityStatus', () => {
  it('manda o novo status', async () => {
    respond({ is_active: false });

    await expect(updateCityStatus('c1', false)).resolves.toBe(false);

    expect(invoke).toHaveBeenCalledWith('update-city-status-web', {
      body: { city_id: 'c1', is_active: false },
    });
  });

  it('traduz cidade com grupos ativos com a contagem', async () => {
    failWith(409, {
      error: 'city has active groups',
      code: 'city_has_active_groups',
      activeGroups: 2,
    });

    await expect(updateCityStatus('c1', false)).rejects.toMatchObject({
      code: 'city_has_active_groups',
      activeGroups: 2,
    });
  });

  it('falha quando a resposta vem vazia', async () => {
    respond(null);

    await expect(updateCityStatus('c1', true)).rejects.toThrow('returned no data');
  });
});
