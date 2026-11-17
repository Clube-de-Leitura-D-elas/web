import type { TablePageRequest } from '../components/Table';
import type { CityFilters, CityGridResponse, SaveCityInput } from '../types/city';
import { CityServiceError, toCityErrorCode } from './cityErrors';
import { readFunctionErrorBody } from './functionError';
import { invokeGet } from './invokeGet';
import { supabase } from './supabaseClient';

async function toCityServiceError(error: unknown): Promise<CityServiceError> {
  const body = await readFunctionErrorBody(error);

  return new CityServiceError(
    toCityErrorCode(body?.code),
    {
      zone: typeof body?.zone === 'string' ? body.zone : null,
      activeGroups: typeof body?.activeGroups === 'number' ? body.activeGroups : 0,
    },
    error,
  );
}

export async function getCityGrid(
  { page, pageSize }: TablePageRequest,
  { search, uf, status }: CityFilters,
): Promise<CityGridResponse> {
  const data = await invokeGet<CityGridResponse | null>('get-cities-web', {
    page,
    pageSize,
    search: search.trim(),
    uf,
    status: status === 'all' ? '' : status,
  });

  if (!data) throw new Error('get-cities-web returned no data');

  return data;
}

export async function saveCity({ cityId, name, uf, zones }: SaveCityInput): Promise<string> {
  const { data, error } = await supabase.functions.invoke<{ id: string }>('save-city-web', {
    body: {
      city_id: cityId,
      name,
      uf,
      zones: zones.map((zone) => ({ id: zone.id, name: zone.name, is_active: zone.isActive })),
    },
  });

  if (error) throw await toCityServiceError(error);
  if (!data) throw new Error('save-city-web returned no data');

  return data.id;
}

export async function updateCityStatus(cityId: string, isActive: boolean): Promise<boolean> {
  const { data, error } = await supabase.functions.invoke<{ is_active: boolean }>(
    'update-city-status-web',
    { body: { city_id: cityId, is_active: isActive } },
  );

  if (error) throw await toCityServiceError(error);
  if (!data) throw new Error('update-city-status-web returned no data');

  return data.is_active;
}
