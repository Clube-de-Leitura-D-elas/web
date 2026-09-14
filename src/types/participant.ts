export type Participant = {
  id: string;
  name: string;
  phone: string | null;
  instagram: string | null;
  email: string;
  birthDate: string | null;
  job: string | null;
  active: boolean;
  city: string | null;
  zone: string | null;
};

export type ParticipantGroup = {
  id: string;
  number: number;
  city: string | null;
  isCoordinator: boolean;
};

export type ParticipantGroupsPage = {
  groups: ParticipantGroup[];
  total: number;
};

export type ParticipantPresence = {
  meetingId: string;
  date: string;
  present: boolean;
};
