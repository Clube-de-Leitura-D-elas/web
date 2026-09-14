import type {
  Participant,
  ParticipantGroup,
  ParticipantGroupsPage,
  ParticipantPresence,
} from '../types/participant';
import { supabase } from './supabaseClient';

type NameRelation = {
  name: string;
};

type ParticipantRelation = NameRelation | NameRelation[] | null;

const getRelationName = (relation: ParticipantRelation): string | null => {
  if (!relation) return null;

  if (Array.isArray(relation)) {
    return relation[0]?.name ?? null;
  }

  return relation.name;
};

const isPresentStatus = (status: string | null): boolean => {
  if (!status) return false;

  const normalizedStatus = status.trim().toLowerCase();

  return normalizedStatus === 'present' || normalizedStatus === 'presente';
};

export async function getParticipantById(participantId: string): Promise<Participant> {
  const { data, error } = await supabase
    .from('users')
    .select(
      `
      id,
      name,
      phone,
      instagram,
      email,
      birth_date,
      job,
      active,
      cities (
        name
      ),
      zones (
        name
      )
    `,
    )
    .eq('id', participantId)
    .single();

  if (error) throw error;

  return {
    id: data.id,
    name: data.name,
    phone: data.phone,
    instagram: data.instagram,
    email: data.email,
    birthDate: data.birth_date,
    job: data.job,
    active: data.active,
    city: getRelationName(data.cities),
    zone: getRelationName(data.zones),
  };
}

export async function getParticipantGroups(
  participantId: string,
  page: number,
  pageSize: number,
): Promise<ParticipantGroupsPage> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from('group_users')
    .select(
      `
        id,
        is_coordinator,
        groups!inner (
          id,
          number,
          cities (
            name
          )
        )
      `,
      {
        count: 'exact',
      },
    )
    .eq('user_id', participantId)
    .range(from, to);

  if (error) throw error;

  const groups: ParticipantGroup[] = data.flatMap((membership) => {
    const group = Array.isArray(membership.groups) ? membership.groups[0] : membership.groups;

    if (!group) return [];

    return [
      {
        id: group.id,
        number: group.number,
        city: getRelationName(group.cities),
        isCoordinator: membership.is_coordinator,
      },
    ];
  });

  return {
    groups,
    total: count ?? 0,
  };
}

export async function getParticipantPresence(
  participantId: string,
): Promise<ParticipantPresence[]> {
  const { data: memberships, error: membershipsError } = await supabase
    .from('group_users')
    .select('id')
    .eq('user_id', participantId);

  if (membershipsError) throw membershipsError;

  const membershipIds = memberships.map((membership) => membership.id);

  if (membershipIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from('meetings')
    .select(
      `
      id,
      date,
      meeting_group_users!inner (
        group_user_id,
        presence_status
      )
    `,
    )
    .in('meeting_group_users.group_user_id', membershipIds)
    .order('date', {
      ascending: false,
    })
    .limit(5);

  if (error) throw error;

  return data.flatMap((meeting) => {
    const attendance = Array.isArray(meeting.meeting_group_users)
      ? meeting.meeting_group_users[0]
      : meeting.meeting_group_users;

    if (!attendance) return [];

    return [
      {
        meetingId: meeting.id,
        date: meeting.date,
        present: isPresentStatus(attendance.presence_status),
      },
    ];
  });
}

export async function updateParticipantStatus(
  participantId: string,
  active: boolean,
): Promise<boolean> {
  const { data, error } = await supabase
    .from('users')
    .update({
      active,
    })
    .eq('id', participantId)
    .select('active')
    .single();

  if (error) throw error;

  return data.active;
}
