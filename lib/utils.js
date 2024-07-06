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

export const getCurrentTimeFormatted = () => {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  const strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

export const getUpcomingSessions = (sessions) => {
  const upcomingSessions = { tomorrow: [], thisWeek: [], thisMonth: [] };

  const now = new Date();
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