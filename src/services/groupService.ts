import type { TablePageRequest } from '../components/Table';
import type {
  GroupDetails,
  GroupMeetingHistoryItem,
  GroupParticipantListItem,
} from '../types/group';
import type { Page } from '../types/participantList';
import { supabase } from './supabaseClient';

async function invokeGet<T>(name: string, params: Record<string, string | number>): Promise<T> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== '') query.set(key, String(value));
  });

  const { data, error } = await supabase.functions.invoke<T>(`${name}?${query}`, {
    method: 'GET',
  });
  if (error) throw error;
  return data as T;
}

export async function getGroupDetails(groupId: string): Promise<GroupDetails> {
  const { data, error } = await supabase.from('groups').select('*').eq('id', groupId).single();

  if (error) throw error;
  return data as GroupDetails;
}

export function getGroupParticipantsPage(
  groupId: string,
  { page, pageSize }: TablePageRequest,
): Promise<Page<GroupParticipantListItem>> {
  return invokeGet('get-group-participants', { groupId, page, pageSize });
}

export function getGroupMeetingsPage(
  groupId: string,
  { page, pageSize }: TablePageRequest,
): Promise<Page<GroupMeetingHistoryItem>> {
  return invokeGet('get-group-meetings', { groupId, page, pageSize });
}
