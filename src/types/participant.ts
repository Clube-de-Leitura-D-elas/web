export type ParticipantAppRole = 'MANAGER' | 'READER' | 'FOUNDER';

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
  appRole: ParticipantAppRole;
  entryDate: string | null;
  photo: string | null;
};

export type ParticipantGroup = {
  id: string;
  number: number;
  city: string | null;
  isCoordinator: boolean;
  entryDate: string | null;
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

export type UpdateParticipantData = {
  name: string;
  email: string;
  phone: string;
  instagram: string;
  city: string;
  zone: string;
  birthday: string;
  profession: string;
};

/** Item de cidade/zona usado nos autocompletes do modal. */
export type ParticipantOption = {
  id: string;
  name: string;
};

/** Valores que o modal de edição entrega para a página. */
export type ParticipantFormValues = {
  name: string;
  email: string;
  phone: string;
  instagram: string;
  cityId: string;
  city: string;
  zoneId: string | null;
  zone: string | null;
  birthDate: string;
  job: string;
  appRole: ParticipantAppRole;
};

/** Payload enviado para a edge function `update-participant-web`. */
export type UpdateParticipantInput = {
  name: string;
  email: string;
  phone: string;
  instagram: string | null;
  cityId: string;
  zoneId: string | null;
  birthDate: string;
  job: string | null;
  appRole: ParticipantAppRole;
};
