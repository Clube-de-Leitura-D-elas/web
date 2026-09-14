import type { TablePageRequest } from '../components/Table';
import type {
  Page,
  ParticipantFilters,
  ParticipantListItem,
  ParticipantOrder,
  PendingParticipantListItem,
} from '../types/participantList';
import { supabase } from './supabaseClient';

const ORDER_BY: Record<ParticipantOrder, { column: string; ascending: boolean }> = {
  name_asc: { column: 'name', ascending: true },
  name_desc: { column: 'name', ascending: false },
  newest: { column: 'created_at', ascending: false },
};

const getRange = ({ page, pageSize }: TablePageRequest) => {
  const from = (page - 1) * pageSize;
  return [from, from + pageSize - 1] as const;
};

export async function getParticipantsPage(
  request: TablePageRequest,
  filters: ParticipantFilters,
): Promise<Page<ParticipantListItem>> {
  const [from, to] = getRange(request);
  const { column, ascending } = ORDER_BY[filters.order];

  const columns = filters.groupId
    ? 'id, name, is_active, group_users(id), in_group:group_users!inner(group_id)'
    : 'id, name, is_active, group_users(id)';

  let query = supabase.from('users').select(columns, { count: 'exact' });

  if (filters.search) query = query.ilike('name', `%${filters.search}%`);
  if (filters.cityId) query = query.eq('city_id', filters.cityId);
  if (filters.groupId) query = query.eq('in_group.group_id', filters.groupId);

  const { data, error, count } = await query
    .order(column, { ascending })
    .order('id')
    .range(from, to);

  if (error) throw error;
  return { items: data as unknown as ParticipantListItem[], total: count ?? 0 };
}

export async function getPendingParticipantsPage(
  request: TablePageRequest,
  filters: ParticipantFilters,
): Promise<Page<PendingParticipantListItem>> {
  const [from, to] = getRange(request);
  const { column, ascending } = ORDER_BY[filters.order];

  let query = supabase
    .from('pending_users')
    .select('id, name, city, phone_number, instagram_user', { count: 'exact' })
    .eq('is_approved', false);

  if (filters.search) query = query.ilike('name', `%${filters.search}%`);

  const { data, error, count } = await query
    .order(column, { ascending })
    .order('id')
    .range(from, to);

  if (error) throw error;
  return { items: data as unknown as PendingParticipantListItem[], total: count ?? 0 };
}

export async function approvePendingParticipant(id: string): Promise<void> {
  const { error } = await supabase.from('pending_users').update({ is_approved: true }).eq('id', id);
  if (error) throw error;
}

export async function rejectPendingParticipant(id: string): Promise<void> {
  const { error } = await supabase.from('pending_users').delete().eq('id', id);
  if (error) throw error;
}
