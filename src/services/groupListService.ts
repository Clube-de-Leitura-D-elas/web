import type { TablePageRequest } from '../components/Table';
import type { GroupFilters, GroupGridResponse } from '../types/groupList';
import { supabase } from './supabaseClient';

export async function getGroupGrid(
  { page, pageSize }: TablePageRequest,
  { search, cityId, order }: GroupFilters,
): Promise<GroupGridResponse> {
  const trimmedSearch = search.trim();

  const { data, error } = await supabase.functions.invoke<GroupGridResponse>('group-grid-web', {
    body: {
      page,
      pageSize,
      order,
      // filtros vazios não são enviados
      ...(trimmedSearch ? { search: trimmedSearch } : {}),
      ...(cityId ? { cityId } : {}),
    },
  });

  if (error) throw error;
  if (!data) throw new Error('group-grid-web returned no data');

  return data;
}
