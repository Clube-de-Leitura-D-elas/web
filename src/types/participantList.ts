import type { DropdownItemList } from '../components/Dropdown';

export type ParticipantOrder = 'name_asc' | 'name_desc' | 'newest';

export type ParticipantFilters = {
  search: string;
  cityId: string;
  groupId: string;
  order: ParticipantOrder;
};

export type Page<T> = {
  items: T[];
  total: number;
};

export type ActiveGroupsSummary = {
  groups: number;
  cities: number;
  activeParticipants: number | null;
};

export type ParticipantFiltersResponse = {
  cities: { id: string; name: string }[];
  groups: { id: string; number: number; description: string }[];
  summary: Omit<ActiveGroupsSummary, 'activeParticipants'> & { activeParticipants?: number | null };
};

export type ParticipantFilterOptions = {
  cityOptions: DropdownItemList[];
  groupOptions: DropdownItemList[];
  summary: ActiveGroupsSummary;
};

export type ParticipantStatus = 'active' | 'inactive' | 'awaiting_account';

export type ParticipantAttendanceMark = 'PRESENT' | 'ABSENT';

export type ParticipantListItem = {
  id: string;
  name: string;
  status: ParticipantStatus;
  group_users: { id: string }[];
  // Da mais antiga para a mais nova; ausente enquanto o backend não devolve o campo.
  recent_attendance?: ParticipantAttendanceMark[];
};

export type PendingParticipantListItem = {
  id: string;
  name: string;
  city: string | null;
  phone_number: string;
  instagram_user: string | null;
};
