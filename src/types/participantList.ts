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
