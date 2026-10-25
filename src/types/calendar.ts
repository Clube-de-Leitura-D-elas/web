export type CalendarEvent = {
  id: string;
  groupId: string;
  groupName: string;
  city: string;
  startsAt: string;
  status: string;
};

export type CalendarDay = {
  date: string;
  inMonth: boolean;
  events: CalendarEvent[];
};

export type CalendarMonthResponse = {
  year: number;
  month: number;
  rangeStart: string;
  rangeEnd: string;
  days: CalendarDay[];
};
