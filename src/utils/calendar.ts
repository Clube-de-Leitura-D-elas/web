export const getCalendarDays = (year: number, month: number): Date[] => {
  const firstDay = new Date(year, month - 1, 1);

  const start = new Date(firstDay);
  start.setDate(firstDay.getDate() - firstDay.getDay());

  const lastDay = new Date(year, month, 0);

  const totalDays = Math.ceil((firstDay.getDay() + lastDay.getDate()) / 7) * 7;

  return Array.from({ length: totalDays }, (_, index) => {
    const date = new Date(start);

    date.setDate(start.getDate() + index);

    return date;
  });
};
