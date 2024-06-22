"use client";

import { useState, useEffect } from "react";

const StudentSessionTable = ({ studentId }) => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      const response = await fetch(`/api/student/${studentId}`);
      const data = await response.json();
      setSessions(data.sessions);
    };
    fetchSessions();
  }, []);
  return (
    // Delete from here
    <div className="flex w-full flex-col items-center gap-10">
      <button onClick={() => console.log(sessions)}>click</button>

      <div className="mt-10 flex w-1/2 flex-col items-center rounded-md bg-primary-clear shadow-md">
        <h1 className="my-2 ml-10 flex w-1/2 self-start border-b border-b-primary-tint/30 pl-1 text-2xl font-bold text-primary-tint">
          Sessions
        </h1>
      </div>
    </div>
  );
};

export default StudentSessionTable;
