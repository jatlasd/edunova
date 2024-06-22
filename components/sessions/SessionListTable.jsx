"use client";

import ComboBox from "@components/ComboBox";
import Header from "@components/Header";
import CreateSessionDialog from "@components/sessions/CreateSessionDialog";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGlobalContext } from "@lib/GlobalProvider";
const SessionListTable = ({ studentId}) => {
    const { user } = useGlobalContext();
  const pathname = usePathname();
  const [sessions, setSessions] = useState([]);

  const getSessionDetails = async () => {
    const response = await fetch(`/api/student/${studentId}`);
    const data = await response.json();
    setSessions(data.sessions);
  };

  useEffect(() => {
    if (user && studentId !== "") {
      getSessionDetails();
    }
  }, [user, studentId]);

  return (
    <>
      <div className="flex h-fit w-4/5 flex-col items-center justify-center rounded-md bg-primary-clear py-3 shadow-sm">
        {studentId !== "" && (
          <div className="flex w-4/5 flex-col items-center rounded-md">
            {pathname !== "/sessions" && (
              <h1 className="mt-2 text-3xl font-bold text-primary-tint">
                Sessions
              </h1>
            )}
            {sessions.length > 0 ? (
              <Table className="mt-5">
                <TableHeader>
                  <TableRow isHeader={true}>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead>Finished Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((session) => (
                    <TableRow
                      key={session._id}
                      onClick={() => router.push(`/sessions/${session._id}`)}
                      className="cursor-pointer"
                    >
                      <TableCell>{session.name}</TableCell>
                      <TableCell>{session.status}</TableCell>
                      <TableCell>{session.createdDate}</TableCell>
                      <TableCell>{session.finishedDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div>
                <h1>No Sessions Found</h1>
              </div>
            )}
            <div className="mt-10">
              {studentId !== "" && (
                <CreateSessionDialog studentId={studentId} />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SessionListTable;
