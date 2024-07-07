import { addHours, endOfDay, format, isBefore, isValid, parseISO, setHours, setMinutes, startOfDay } from "date-fns";

export const constructDateTime = (date: string, time: string): Date => {
  const datePart = parseISO(date);
  const [hour, minute] = time.split(':').map(Number);
  return setMinutes(setHours(datePart, hour), minute);
};

export function parseAndValidateDate(dateString: string): Date | null {
  if (!dateString || !isValid(parseISO(dateString))) {
    return null;
  }
  return parseISO(dateString);
}

export function getStartAndEndOfDay(date: Date): { start: Date; end: Date } {
  return {
    start: startOfDay(date),
    end: endOfDay(date),
  };
}

export function generateTimeSlots(startHour: number, endHour: number, currentDate: Date): string[] {
  const slots = [];
  let currentTime = setHours(currentDate, startHour);
  const endTime = setHours(currentDate, endHour);

  while (isBefore(currentTime, endTime)) {
    slots.push(format(currentTime, 'HH:mm'));
    currentTime = addHours(currentTime, 1);
  }

  return slots;
}