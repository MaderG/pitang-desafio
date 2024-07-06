import { parseISO, setHours, setMinutes } from "date-fns";

export const constructDateTime = (date: string, time: string): Date => {
  const datePart = parseISO(date);
  const [hour, minute] = time.split(':').map(Number);
  return setMinutes(setHours(datePart, hour), minute);
};
