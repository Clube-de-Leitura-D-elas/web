import { FunctionsHttpError } from '@supabase/supabase-js';

import { locale } from '../locales';
import type {
  Participant,
  ParticipantGroupsPage,
  ParticipantOption,
  ParticipantPresence,
  UpdateParticipantInput,
} from '../types/participant';
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
  created_at?: string | null;
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
    appRole: data.app_role?.toUpperCase() === 'MANAGER' ? 'MANAGER' : 'READER',
    entryDate: data.created_at ?? null,
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

// Cidades e zonas para os autocompletes do modal de edição.
// Atenção: lê direto das tabelas `cities` e `zones`; precisa de permissão de SELECT (RLS)
// para o usuário logado. Se não houver, troque o corpo destas duas funções por uma edge function.
async function getOptions(table: 'cities' | 'zones'): Promise<ParticipantOption[]> {
  const { data, error } = await supabase.from(table).select('id, name').order('name');
  if (error) throw error;

  return (data ?? []) as ParticipantOption[];
}

export const getCities = () => getOptions('cities');

export const getZones = () => getOptions('zones');

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
