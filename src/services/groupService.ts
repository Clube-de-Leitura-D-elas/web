import type { TablePageRequest } from '../components/Table';
import type {
  GroupDetails,
  GroupMeetingHistoryItem,
  GroupParticipantListItem,
} from '../types/group';
import type { Page } from '../types/participantList';
import { invokeGet } from './invokeGet';

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
