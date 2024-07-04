"use client";

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
import { useStudentContext } from "@lib/StudentProvider";

const SessionListTable = () => {
  const { student, clearStudent } = useStudentContext();
  const [sessionsLoaded, setSessionsLoaded] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [sessions, setSessions] = useState([]);
  const [isShouldAdd, setIsShouldAdd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let timeoutId;

    const updateSessions = () => {
      setIsLoading(true);
      timeoutId = setTimeout(() => {
        if (student) {
          if (pathname === "/sessions" && sessionsLoaded === false) {
            clearStudent();
            setSessions([]);
            setSessionsLoaded(true);
          } else {
            setSessions(student.sessions || []);
            setIsShouldAdd(pathname.startsWith("/sessions/"));
          }
        } else {
          setSessions([]);
          setIsShouldAdd(false);
        }
        setIsLoading(false);
      }, 300);
    };

    updateSessions();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [pathname, student, clearStudent, sessionsLoaded]);

  if (isLoading) {
    return (
      <div className="flex h-fit w-4/5 flex-col items-center justify-center rounded-md bg-primary-clear py-3 shadow-sm">
        <div className="flex w-4/5 flex-col items-center rounded-md">
          <h1 className="mt-5 text-2xl font-bold text-primary-tint">
            Loading...
          </h1>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-fit w-4/5 flex-col items-center justify-center rounded-md bg-primary-clear py-3 shadow-sm">
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
              {pathname === "/sessions" && !student && (
                <h1 className="mt-5 text-2xl font-bold text-primary-tint">
                  Select a Student to See Their Sessions
                </h1>
              )}
              {student && <h1>No Sessions</h1>}
            </div>
          )}
          <div className="mt-5">
              {pathname.startsWith('/students') ? (
                <CreateSessionDialog studentId={student._id} />
              ) : (
                pathname === '/sessions' ? (
                  <CreateSessionDialog studentId={null}/>
                ) : (
                  <></>
                )
              )}
              
          </div>
        </div>
      </div>
    </>
  );
};

export default SessionListTable;