import { FunctionsHttpError } from '@supabase/functions-js';
import type { TablePageRequest } from '../components/Table';
import type {
  GroupDetails,
  GroupMeetingHistoryItem,
  GroupOption,
  GroupZoneOption,
  GroupParticipantListItem,
  UpdateGroupLocationInput,
} from '../types/group';
import type { Page } from '../types/participantList';
import { GroupServiceError } from './groupErrors';
import { invokeGet } from './invokeGet';
import { supabase } from './supabaseClient';
import { locale } from '../locales';

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

export const updateGroupStatus = async (groupId: string, isActive: boolean): Promise<boolean> => {
  const { data, error } = await supabase.functions.invoke<{ is_active: boolean }>(
    'update-group-status',
    { body: { group_id: groupId, is_active: isActive } },
  );

  if (error) throw error;
  if (!data) throw new Error('update-group-status returned no data');

  return data.is_active;
};

export type CreateGroupPayload = {
  cityId: string;
  coordinatorId: string | null;
};

type CreateGroupResponse = {
  id: string;
  number: number;
  description: string;
  cityId: string;
  zoneId: string | null;
  coordinatorId: string | null;
  createdAt: string;
};

function toGroupServiceError(error: unknown) {
  if (error instanceof FunctionsHttpError && error.context?.status === 409) {
    return new GroupServiceError('duplicate_number', error);
  }

  console.error('[groupService]', error);
  return new GroupServiceError('unknown', error);
}

export async function createGroup(payload: CreateGroupPayload): Promise<CreateGroupResponse> {
  const { data, error } = await supabase.functions.invoke<CreateGroupResponse>('create-group', {
    body: payload,
  });

  if (error) throw toGroupServiceError(error);
  if (!data) throw new Error('create-group returned no data');

  return data;
}

export async function getGroupCities(): Promise<GroupOption[]> {
  const { data, error } = await supabase.from('cities').select('id, name').order('name');
  if (error) throw error;

  return (data ?? []) as GroupOption[];
}

export async function getGroupZones(): Promise<GroupZoneOption[]> {
  const { data, error } = await supabase.from('zones').select('id, name, city_id').order('name');
  if (error) throw error;

  return (data ?? []).map(({ id, name, city_id }) => ({ id, name, cityId: city_id }));
}

// Extrai a mensagem `{ error: "..." }` devolvida pela edge function, quando existir.
async function readFunctionErrorMessage(error: unknown): Promise<string | null> {
  if (!(error instanceof FunctionsHttpError)) return null;

  try {
    const body = await error.context.json();
    return typeof body?.error === 'string' && body.error ? body.error : null;
  } catch {
    return null;
  }
}

export async function updateGroupLocation(
  groupId: string,
  input: UpdateGroupLocationInput,
): Promise<void> {
  const { data, error } = await supabase.functions.invoke('update-group-location-web', {
    body: {
      group_id: groupId,
      description: input.description,
      city_id: input.city_id,
      zone_id: input.zone_id,
    },
  });

  if (error) {
    console.error('update-group-location-web error', error);
    throw new Error(
      (await readFunctionErrorMessage(error)) ?? locale.group_details.modal.modalError,
    );
  }

  if (!data) {
    throw new Error(locale.group_details.modal.modalError);
  }
}

export async function updateGroupParticipant(
  groupId: string,
  participantId: string,
  action: 'promote' | 'remove',
): Promise<void> {
  const { error } = await supabase.functions.invoke('update-group-participant-web', {
    body: { groupId, participantId, action },
  });
  if (error) throw error;
}
