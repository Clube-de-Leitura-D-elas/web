import type { GroupParticipantListItem } from '../../types/group';

const LOW_ATTENDANCE_PERCENT = 50;

export type Attendance = {
  present: number;
  total: number;
  percent: number;
  low: boolean;
};

export const getAttendance = (marks: GroupParticipantListItem['attendance']): Attendance => {
  const present = marks.filter((mark) => mark === 'P').length;
  const total = marks.length;
  const percent = total > 0 ? Math.round((present / total) * 100) : 0;

  return { present, total, percent, low: total > 0 && percent < LOW_ATTENDANCE_PERCENT };
};

export const isIncomplete = (member: GroupParticipantListItem) =>
  !member.email || !member.entry_date;

export const needsAttention = (member: GroupParticipantListItem): 'low' | 'incomplete' | null => {
  if (getAttendance(member.attendance).low) return 'low';
  if (isIncomplete(member)) return 'incomplete';
  return null;
};
