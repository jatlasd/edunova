"use client";

import ComboBox from "@components/ComboBox";
import Header from "@components/Header";
import { useGlobalContext } from "@lib/GlobalProvider";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const Sessions = () => {
    const router = useRouter()
  const { user } = useGlobalContext();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState({ id: "", label: "" });

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
  }, [user]);

  return (
    <>
      <Header />
      <div className="flex w-full flex-col items-center justify-center">
        <h1 className="my-10 text-5xl font-bold text-primary-tint">
          My Sessions
        </h1>
        <div className="flex h-fit w-4/5 flex-col items-center justify-center rounded-md bg-primary-clear py-10">
          {user && (
            <ComboBox
              options={students}
              value={selectedStudent}
              setValue={setSelectedStudent}
            />
          )}
          {selectedStudent.id !== "" && (
            <div className="mt-10 flex w-4/5 justify-center rounded-md bg-primary-clear">
              <h1 className="mt-2 text-3xl font-bold text-primary-tint">
                Sessions for {selectedStudent.label}
              </h1>
              <button onClick={() => router.push(`/sessions/create/${selectedStudent.id}`)}>Create New Session</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sessions;
