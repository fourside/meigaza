import { endOfISOWeek, parse } from "date-fns";

export function isWithinThisWeek(dateString: string, today: Date) {
  const yyyymmdd = dateString.match(/^\d{4}\/\d{1,2}\/\d{1,2}/);
  if (!yyyymmdd) {
    return false;
  }
  const date = parse(yyyymmdd[0], "yyyy/MM/dd", new Date());
  if (date < today) {
    return false;
  }
  const thisWeekend = endOfISOWeek(today);
  return date <= thisWeekend;
}
