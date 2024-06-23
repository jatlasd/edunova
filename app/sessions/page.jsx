"use client";

import ComboBox from "@components/ComboBox";
import Header from "@components/Header";
import { useGlobalContext } from "@lib/GlobalProvider";
import { useState, useEffect } from "react";

import SessionListTable from "@components/sessions/SessionListTable";
import { useStudentContext } from "@lib/StudentProvider";

const Sessions = () => {
  const { user } = useGlobalContext();
  const [students, setStudents] = useState([]);
  const { studentId, setStudentId } = useStudentContext();

  const getUserDetails = async () => {
    const response = await fetch(`/api/user/${user.id}?includeStudents=true`);
    const data = await response.json();
    const formattedStudents = data.map((student) => ({
      id: student._id,
      value: student.name,
      label: student.name,
    }));
    setStudents(formattedStudents);
  };

  useEffect(() => {
    if (user) {
      getUserDetails();
    }

  }, [user, studentId]);

  return (
    <>
      <Header />
      <div className="flex w-full flex-col items-center justify-center">
        <h1 className="my-10 text-5xl font-bold text-primary-tint">
          My Sessions
        </h1>
        <div className="flex h-fit w-4/5 flex-col items-center justify-center rounded-md bg-primary-clear py-10 shadow-sm">
          {user && (
            <ComboBox
              options={students}
              value={studentId}
              setValue={setStudentId}
            />
          )}
          <SessionListTable />
          {/* {selectedStudent.id !== "" && (
            <div className="mt-10 flex w-4/5 flex-col items-center rounded-md">
              <h1 className="mt-2 text-3xl font-bold text-primary-tint">
                Sessions for {selectedStudent.label}
              </h1>
              {sessions.length > 0 ? (
                <Table className='mt-5'>
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
                {selectedStudent.id !== "" && (
                  <CreateSessionDialog studentId={selectedStudent.id} />
                )}
              </div>
            </div>
          )} */}
        </div>
      </div>
    </>
  );
};

export default Sessions;
