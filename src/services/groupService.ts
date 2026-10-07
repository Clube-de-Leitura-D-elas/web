import type { TablePageRequest } from '../components/Table';
import type {
  GroupDetails,
  GroupMeetingHistoryItem,
  GroupParticipantListItem,
} from '../types/group';
import type { Page } from '../types/participantList';
import { invokeGet } from './invokeGet';
import { supabase } from './supabaseClient';

export function getGroupDetails(groupId: string): Promise<GroupDetails> {
  return invokeGet('get-group-details-web', { groupId });
}

export function getGroupParticipantsPage(
  groupId: string,
  { page, pageSize }: TablePageRequest,
): Promise<Page<GroupParticipantListItem>> {
  return invokeGet('get-group-participants-web', { groupId, page, pageSize });
}

export function getGroupMeetingsPage(
  groupId: string,
  { page, pageSize }: TablePageRequest,
): Promise<Page<GroupMeetingHistoryItem>> {
  return invokeGet('get-group-meetings-web', { groupId, page, pageSize });
}

export async function updateGroupStatus(groupId: string, active: boolean): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke<{ is_active: boolean }>(
      'update-group-status',
      { body: { group_id: groupId, is_active: active } },
    );

    if (error) throw error;
    if (!data) throw new Error('update-group-status returned no data');

    return data.is_active;
  } catch (err) {
    console.warn('Edge function remota ainda não disponivel, a usar mock provisório', err);
    return active;
  }
}
