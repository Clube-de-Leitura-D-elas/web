import type { TablePageRequest } from '../components/Table';
import type { GroupFilters, GroupGridResponse } from '../types/groupList';
import { supabase } from './supabaseClient';

export async function getGroupGrid(
  { page, pageSize }: TablePageRequest,
  { search, cityId, order }: GroupFilters,
): Promise<GroupGridResponse> {
  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    order,
  });

  // filtros vazios não são enviados
  const trimmedSearch = search.trim();
  if (trimmedSearch) query.set('search', trimmedSearch);
  if (cityId) query.set('cityId', cityId);

  const { data, error } = await supabase.functions.invoke<GroupGridResponse>(
    `get-group-web?${query}`,
    { method: 'GET' },
  );

  if (error) throw error;
  if (!data) throw new Error('get-group-web returned no data');

  return data;
}
