"use client";

import { useState, useEffect, useCallback } from "react";
import { useGlobalContext } from "@lib/GlobalProvider";
import StudentSelect from "./StudentSelect";
import SessionListTable from "@components/sessions/SessionListTable";

const ReportContainer = () => {
  const { user } = useGlobalContext();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudentSessions, setSelectedStudentSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);

  const fetchStudents = useCallback(async () => {
    if (!user) return;
    try {
      const response = await fetch(`/api/user/${user.id}`);
      const data = await response.json();
      setStudents(data.students);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    }
  }, [user]);

  const fetchStudentSessions = useCallback(async (studentId) => {
    if (!studentId) return;
    try {
      const response = await fetch(`/api/student/${studentId}`);
      const data = await response.json();
      setSelectedStudentSessions(data.sessions);
    } catch (error) {
      console.error("Failed to fetch student sessions:", error);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    if (selectedStudent) {
      fetchStudentSessions(selectedStudent);
    }
  }, [selectedStudent, fetchStudentSessions]);

  const handleSelectStudent = useCallback((value) => {
    setSelectedStudent(value);
  }, []);

  const handleClear = useCallback(() => {
    setSelectedStudent(null);
    setSelectedStudentSessions([]);
    setSelectedSession(null);
  }, []);

  const handleSessionClick = useCallback((session) => {
    setSelectedSession(session);
  }, []);

  useEffect(() => {
    console.log("selectedSession: ", selectedSession);
  }, [selectedSession]);

  return (
    <div className="mx-10 mt-10 flex flex-col items-center gap-y-10">
      <StudentSelect
        students={students}
        selectedStudent={selectedStudent}
        onSelectStudent={handleSelectStudent}
        onClear={handleClear}
      />
      {selectedSession ? (
        <div className="flex w-full flex-col items-center gap-5">
          <div className="flex w-1/2">
            <button
              className="text-primary transition-all duration-75 hover:text-primary-tint hover:underline"
              onClick={() => setSelectedSession(null)}
            >
              Back
            </button>
            <h2 className="w-full text-center text-xl font-semibold text-primary">
              {selectedSession.name}
            </h2>
          </div>
        </div>
      ) : (
        <SessionListTable
          reportingSessions={selectedStudentSessions}
          handleSessionClick={handleSessionClick}
        />
      )}
    </div>
  );
};

export default ReportContainer;
