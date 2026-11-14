import { locale } from '../locales';
import type {
  Participant,
  ParticipantGroupsPage,
  ParticipantOption,
  ParticipantGroup,
  ParticipantMeetingRecord,
  ParticipantPresence,
  ParticipantZoneOption,
  UpdateParticipantInput,
} from '../types/participant';
import { readFunctionErrorMessage } from './functionError';
import { supabase } from './supabaseClient';

type ParticipantResponse = {
  id: string;
  name: string;
  phone: string | null;
  instagram: string | null;
  email: string;
  birth_date: string | null;
  job: string | null;
  is_active: boolean;
  app_role: string | null;
  city: string | null;
  zone: string | null;
  entry_date?: string | null;
  photo: string | null;
};

type ParticipantGroupsResponse = {
  items: {
    id: string;
    number: number;
    city: string | null;
    is_coordinator: boolean;
    entry_date?: string | null;
  }[];
  total: number;
};

type ParticipantPresenceResponse = {
  items: { meeting_id: string; date: string; present: boolean }[];
};

async function invokeGet<T>(name: string, params: Record<string, string | number>): Promise<T> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => query.set(key, String(value)));

  const { data, error } = await supabase.functions.invoke<T>(`${name}?${query}`, {
    method: 'GET',
  });
  if (error) throw error;
  return data as T;
}

export async function getParticipantById(participantId: string): Promise<Participant> {
  const data = await invokeGet<ParticipantResponse>('get-participant', {
    participant_id: participantId,
  });

  return {
    id: data.id,
    name: data.name,
    phone: data.phone,
    instagram: data.instagram,
    email: data.email,
    birthDate: data.birth_date,
    job: data.job,
    active: data.is_active,
    city: data.city,
    zone: data.zone,
    appRole:
      data.app_role?.toUpperCase() === 'FOUNDER'
        ? 'FOUNDER'
        : data.app_role?.toUpperCase() === 'MANAGER'
          ? 'MANAGER'
          : 'READER',
    entryDate: data.entry_date ?? null,
    photo: data.photo ?? null,
  };
}

export async function getParticipantGroups(
  participantId: string,
  page: number,
  pageSize: number,
): Promise<ParticipantGroupsPage> {
  const data = await invokeGet<ParticipantGroupsResponse>('get-participant-groups', {
    participant_id: participantId,
    page,
    pageSize,
  });

  return {
    groups: data.items.map((group) => ({
      id: group.id,
      number: group.number,
      city: group.city,
      isCoordinator: group.is_coordinator,
      entryDate: group.entry_date ?? null,
    })),
    total: data.total,
  };
}

const ALL_GROUPS_PAGE_SIZE = 100;

export async function getAllParticipantGroups(participantId: string): Promise<ParticipantGroup[]> {
  const groups: ParticipantGroup[] = [];

  for (let page = 1; ; page += 1) {
    const result = await getParticipantGroups(participantId, page, ALL_GROUPS_PAGE_SIZE);
    groups.push(...result.groups);

    if (result.groups.length === 0 || groups.length >= result.total) return groups;
  }
}

export async function getParticipantPresence(
  participantId: string,
): Promise<ParticipantPresence[]> {
  const data = await invokeGet<ParticipantPresenceResponse>('get-participant-presence', {
    participant_id: participantId,
  });

  return data.items.map((meeting) => ({
    meetingId: meeting.meeting_id,
    date: meeting.date,
    present: meeting.present,
  }));
}

type PresenceHistoryResponse = {
  participant_id: string;
  groups: {
    group_id: string;
    group_number: number;
    meetings: {
      meeting_id: string;
      date: string;
      book_title: string;
      presence_status: 'PRESENT' | 'ABSENT' | null;
    }[];
  }[];
};

export async function getParticipantPresenceHistory(
  participantId: string,
): Promise<ParticipantMeetingRecord[]> {
  const data = await invokeGet<PresenceHistoryResponse>('get-participant-presence-history', {
    participant_id: participantId,
  });

  return data.groups
    .flatMap((group) =>
      group.meetings.map((meeting) => ({
        meetingId: meeting.meeting_id,
        date: meeting.date,
        bookTitle: meeting.book_title,
        groupId: group.group_id,
        groupNumber: group.group_number,
        present: meeting.presence_status === null ? null : meeting.presence_status === 'PRESENT',
      })),
    )
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}

export async function updateParticipantStatus(
  participantId: string,
  active: boolean,
): Promise<boolean> {
  const { data, error } = await supabase.functions.invoke<{ is_active: boolean }>(
    'update-participant-status',
    { body: { participant_id: participantId, is_active: active } },
  );
  if (error) throw error;
  if (!data) throw new Error('update-participant-status returned no data');

  return data.is_active;
}

export async function getCities(): Promise<ParticipantOption[]> {
  const { data, error } = await supabase.from('cities').select('id, name').order('name');
  if (error) throw error;

  return (data ?? []) as ParticipantOption[];
}

export async function getZones(): Promise<ParticipantZoneOption[]> {
  const { data, error } = await supabase.from('zones').select('id, name, city_id').order('name');
  if (error) throw error;

  return (data ?? []).map(({ id, name, city_id }) => ({ id, name, cityId: city_id }));
}

export async function updateParticipant(
  participantId: string,
  input: UpdateParticipantInput,
): Promise<void> {
  const { error } = await supabase.functions.invoke('update-participant-web', {
    body: {
      participant_id: participantId,
      name: input.name,
      email: input.email,
      phone: input.phone,
      instagram: input.instagram,
      city_id: input.cityId,
      zone_id: input.zoneId,
      birth_date: input.birthDate,
      job: input.job,
      app_role: input.appRole,
    },
  });

  if (error) {
    console.error('update-participant-web error', error);
    throw new Error(
      (await readFunctionErrorMessage(error)) ?? locale.participant_details.modal.saveError,
    );
  }
}
