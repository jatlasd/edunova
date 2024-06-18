"use client";

import ComboBox from "@components/ComboBox";
import Header from "@components/Header";
import CreateSessionDialog from "@components/sessions/CreateSessionDialog";
import { useGlobalContext } from "@lib/GlobalProvider";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const Sessions = () => {
  const router = useRouter();
  const { user } = useGlobalContext();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState({ id: "", label: "" });
  const [sessions, setSessions] = useState([]);

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

  const getSessionDetails = async () => {
    const response = await fetch(`/api/student/${selectedStudent.id}`);
    const data = await response.json();
    setSessions(data.sessions);
  };

  useEffect(() => {
    if (user) {
      getUserDetails();
    }
    if (user && selectedStudent.id !== "") {
      getSessionDetails();
    }
  }, [user, selectedStudent]);

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
              value={selectedStudent}
              setValue={setSelectedStudent}
            />
          )}
          {selectedStudent.id !== "" && (
            <div className="mt-10 flex w-4/5 flex-col items-center rounded-md">
              <h1 className="mt-2 text-3xl font-bold text-primary-tint">
                Sessions for {selectedStudent.label}
              </h1>
              {sessions.length > 0 ? (
                <div className="flex gap-5">
                  {sessions.map((session) => (
                    <div
                      key={session._id}
                      className="hover:bg-primary-clear-tint mt-5 flex h-[200px] w-[300px] cursor-pointer flex-col items-center justify-center gap-5 rounded-md bg-primary-clear shadow-sm"
                      onClick={() => router.push(`/sessions/${session._id}`)}
                    >
                      <h1 className="text-2xl font-bold capitalize text-primary-tint">
                        {session.name}
                      </h1>
                      <div className="flex gap-5">
                        <h2 className="text-lg font-bold text-primary-tint">
                          Status:&nbsp;
                        </h2>
                        <span className="text-lg font-semibold capitalize text-primary">
                          {session.status}
                        </span>
                      </div>
                      <div className="flex gap-5">
                        <h2 className="text-lg font-bold text-primary-tint">
                          Date Created:&nbsp;
                        </h2>
                        <span className="text-lg font-semibold text-primary">
                          {session.createdDate}
                        </span>
                      </div>
                      {session.status === "finished" && (
                        <div className="flex gap-5">
                          <h2 className="text-lg font-bold text-primary-tint">
                            Date Finished:&nbsp;
                          </h2>
                          <span className="text-lg font-semibold text-primary">
                            {session.finishedDate}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
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
          )}
        </div>
      </div>
    </>
  );
};

export default Sessions;
