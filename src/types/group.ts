export type GroupNextMeeting = {
  date: string;
  book_title: string | null;
  book_author: string | null;
  place: string | null;
  neighborhood: string | null;
  confirmed: boolean;
};

export type GroupDetails = {
  id: string;
  // o nome exibido é montado com number + description, como na grade de grupos
  number: number;
  description: string;
  city: string | null;
  is_active: boolean;
  active_participants_count: number;
  coordinator_name: string | null;
  coordinator_email: string | null;
  next_meeting: GroupNextMeeting | null;
};

export type GroupParticipantListItem = {
  id: string;
  name: string;
  entry_date: string | null;
  attendance: ('P' | 'F')[];
  email: string | null;
  is_coordinator: boolean;
};

export type GroupMeetingHistoryItem = {
  id: string;
  date: string;
  book_title: string;
  book_author: string;
  place: string | null;
  neighborhood: string | null;
  attendance_present: number;
  attendance_total: number;
  average_rating: number | null;
  votes_count: number;
};
