import { useState, useEffect } from "react";
import { useGlobalContext } from "@lib/GlobalProvider";
import { getUpcomingSessions } from "@lib/utils";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { utcToZonedTime, format } from "date-fns-tz";

const UpcomingTable = ({ sessions }) => {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow isHeader={true}>
          <TableHead>Student</TableHead>
          <TableHead>Session Name</TableHead>
          <TableHead>Scheduled Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sessions.map((session) => (
          <TableRow
            key={session._id}
            onClick={() => router.push(`/sessions/${session._id}`)}
          >
            <TableCell>{session.student.name}</TableCell>
            <TableCell>{session.name}</TableCell>
            <TableCell>
              {format(new Date(session.scheduledDate), "MM-dd-yyyy", {
                timeZone: "UTC",
              })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const UpcomingSessionsDisplay = () => {
  const [allSessions, setAllSessions] = useState([]);
  const [sortedSessions, setSortedSessions] = useState({});
  const { user } = useGlobalContext();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        if (user && user.id) {
          const response = await fetch(`/api/user/${user.id}`);
          const data = await response.json();
          console.log("Fetched sessions:", data.sessions);
          setAllSessions(data.sessions);
          const sorted = getUpcomingSessions(data.sessions);
          setSortedSessions(sorted);
        }
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    fetchSessions();
  }, [user]);

  useEffect(() => {
    const sorted = getUpcomingSessions(allSessions);
    setSortedSessions(sorted);
  }, [allSessions]);

  return (
    <div className="mx-10 mt-10 flex flex-col items-center gap-5">
      <h1 className="text-2xl font-bold text-primary-tint w-1/3 border-b border-b-primary/30 text-center">Upcoming Scheduled Sessions</h1>
        <div className="flex gap-5 justify-evenly">
        <div className="flex flex-col items-center rounded-md bg-primary-clear p-5 shadow-md">
        <h2 className="p-5 text-xl font-bold text-primary-tint">Tomorrow</h2>
        {sortedSessions.tomorrow ? (
          <UpcomingTable sessions={sortedSessions.tomorrow} />
        ) : (
          <h2>No sessions scheduled for tomorrow.</h2>
        )}
      </div>
      <div className="flex flex-col items-center rounded-md bg-primary-clear p-5 shadow-md">
        <h2 className="p-5 text-xl font-bold text-primary-tint">This Week</h2>
        {sortedSessions.tomorrow ? (
          <UpcomingTable sessions={sortedSessions.thisWeek} />
        ) : (
          <h2>No sessions scheduled for tomorrow.</h2>
        )}
      </div>
      <div className="flex flex-col items-center rounded-md bg-primary-clear p-5 shadow-md">
        <h2 className="p-5 text-xl font-bold text-primary-tint">This Month</h2>
        {sortedSessions.tomorrow ? (
          <UpcomingTable sessions={sortedSessions.thisMonth} />
        ) : (
          <h2>No sessions scheduled for tomorrow.</h2>
        )}
      </div>
        </div>
    </div> 
  );
};

export default UpcomingSessionsDisplay;
