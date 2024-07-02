import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as dateFnsTz from "date-fns-tz";
import {
  parseISO,
  addDays,
  nextFriday,
  isAfter,
  isBefore,
  isTomorrow,
} from "date-fns";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const toNewYorkTime = (date) => {
  return new Date(
    date.toLocaleString("en-US", { timeZone: "America/New_York" }),
  );
};

export const getUpcomingSessions = (sessions) => {
  const upcomingSessions = { tomorrow: [], thisWeek: [], thisMonth: [] };

  const now = new Date();
  const today = toNewYorkTime(now);
  const tomorrow = toNewYorkTime(addDays(now, 1));
  const endOfWeek = toNewYorkTime(nextFriday(now));
  const upcoming = toNewYorkTime(addDays(now, 30));

  sessions.forEach((session) => {
    const sessionDate = toNewYorkTime(parseISO(session.scheduledDate));

    if (isTomorrow(sessionDate)) {
      upcomingSessions.tomorrow.push(session);
    }

    if (isAfter(sessionDate, tomorrow) && isBefore(sessionDate, endOfWeek)) {
      upcomingSessions.thisWeek.push(session);
    }

    if (isAfter(sessionDate, endOfWeek) && isBefore(sessionDate, upcoming)) {
      upcomingSessions.thisMonth.push(session);
    }
  });

  return upcomingSessions;
};
