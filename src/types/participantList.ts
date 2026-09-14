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
};

export type ParticipantFiltersResponse = {
  cities: { id: string; name: string }[];
  groups: { id: string; number: number; description: string }[];
  summary: ActiveGroupsSummary;
};

export type ParticipantFilterOptions = {
  cityOptions: DropdownItemList[];
  groupOptions: DropdownItemList[];
  summary: ActiveGroupsSummary;
};

export type ParticipantListItem = {
  id: string;
  name: string;
  is_active: boolean;
  group_users: { id: string }[];
};

export type PendingParticipantListItem = {
  id: string;
  name: string;
  city: string | null;
  phone_number: string;
  instagram_user: string | null;
};
