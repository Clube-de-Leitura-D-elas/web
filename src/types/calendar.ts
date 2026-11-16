export type CalendarEvent = {
  id: string;
  groupId: string;
  groupName: string;
  cityId: string;
  city: string;
  state: string;
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

export type CalendarOption = {
  id: string;
  name: string;
  uf: string;
};

export type CalendarGroup = {
  id: string;
  number: number;
  description: string;
  cityId: string;
  state: string;
};
