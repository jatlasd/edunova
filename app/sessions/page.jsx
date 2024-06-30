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
    const response = await fetch(`/api/user/${user.id}`);
    const data = await response.json();
    const formattedStudents = data.students.map((student) => ({
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
        </div>
      </div>
    </>
  );
};

export default Sessions;