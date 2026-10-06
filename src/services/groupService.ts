import type { TablePageRequest } from '../components/Table';
import type {
  GroupDetails,
  GroupMeetingHistoryItem,
  GroupParticipantListItem,
} from '../types/group';
import type { Page } from '../types/participantList';
import type { CreateGroupResponse } from '../types/groupList';
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

export type CreateGroupPayload = {
  name: string;
  cityId: string;
  coordinatorId: string | null;
};

export async function createGroup(payload: CreateGroupPayload): Promise<CreateGroupResponse> {
  const { data, error } = await supabase.functions.invoke<CreateGroupResponse>('create-group', {
    body: payload,
  });

  if (error) throw error;
  if (!data) throw new Error('create-group returned no data');

  return data;
}
