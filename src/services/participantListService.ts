import type { TablePageRequest } from '../components/Table';
import type {
  Page,
  ParticipantFilters,
  ParticipantListItem,
  PendingParticipantListItem,
} from '../types/participantList';
import { supabase } from './supabaseClient';

const supabaseBaseUrl = import.meta.env.VITE_SUPABASE_URL;

async function readEdgePage<T>(
  functionName: 'get-participants' | 'get-pending-participants',
  request: TablePageRequest,
  filters: ParticipantFilters,
): Promise<Page<T>> {
  const url = new URL(`${supabaseBaseUrl}/functions/v1/${functionName}`);
  url.searchParams.set('page', String(request.page));
  url.searchParams.set('pageSize', String(request.pageSize));
  url.searchParams.set('order', filters.order);

  if (filters.search) url.searchParams.set('search', filters.search);
  if (filters.cityId) url.searchParams.set('cityId', filters.cityId);
  if (filters.groupId) url.searchParams.set('groupId', filters.groupId);

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(payload.error ?? 'Failed to fetch edge function data');
  }

  const payload = (await response.json()) as { items: T[]; total: number };
  return {
    items: payload.items,
    total: payload.total,
  };
}

export async function getParticipantsPage(
  request: TablePageRequest,
  filters: ParticipantFilters,
): Promise<Page<ParticipantListItem>> {
  return readEdgePage<ParticipantListItem>('get-participants', request, filters);
}

export async function getPendingParticipantsPage(
  request: TablePageRequest,
  filters: ParticipantFilters,
): Promise<Page<PendingParticipantListItem>> {
  return readEdgePage<PendingParticipantListItem>('get-pending-participants', request, filters);
}

export async function approvePendingParticipant(id: string): Promise<void> {
  const { error } = await supabase.from('pending_users').update({ is_approved: true }).eq('id', id);
  if (error) throw error;
}

export async function rejectPendingParticipant(id: string): Promise<void> {
  const { error } = await supabase.from('pending_users').delete().eq('id', id);
  if (error) throw error;
}
