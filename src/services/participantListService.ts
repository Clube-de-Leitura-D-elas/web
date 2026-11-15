import type { TablePageRequest } from '../components/Table';
import type {
  Page,
  ParticipantFilters,
  ParticipantListItem,
  PendingParticipantListItem,
} from '../types/participantList';
import { supabase } from './supabaseClient';
import { invokeGet } from './invokeGet';

export function getParticipantsPage(
  { page, pageSize }: TablePageRequest,
  filters: ParticipantFilters,
): Promise<Page<ParticipantListItem>> {
  return invokeGet('get-participants', {
    page,
    pageSize,
    order: filters.order,
    search: filters.search,
    cityId: filters.cityId,
    groupId: filters.groupId,
  });
}

export function getPendingParticipantsPage(
  { page, pageSize }: TablePageRequest,
  filters: Pick<ParticipantFilters, 'search' | 'order'>,
): Promise<Page<PendingParticipantListItem>> {
  return invokeGet('get-pending-participants', {
    page,
    pageSize,
    order: filters.order,
    search: filters.search,
  });
}

export async function approvePendingParticipant(id: string): Promise<void> {
  const { error } = await supabase.functions.invoke('accept-pending-user', {
    body: { pending_user_id: id },
  });
  if (error) throw error;
}

export async function rejectPendingParticipant(id: string): Promise<void> {
  const { error } = await supabase.functions.invoke('reject-pending-user', {
    body: { pending_user_id: id },
  });
  if (error) throw error;
}
