import type { Participant, ParticipantGroupsPage, ParticipantPresence } from '../types/participant';
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
  city: string | null;
  zone: string | null;
};

type ParticipantGroupsResponse = {
  items: { id: string; number: number; city: string | null; is_coordinator: boolean }[];
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
    })),
    total: data.total,
  };
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
