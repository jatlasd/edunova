"use client";

import { useState, useEffect, useCallback } from "react";
import { useGlobalContext } from "@lib/GlobalProvider";
import StudentSelect from "./StudentSelect";

const ReportContainer = () => {
  const { user } = useGlobalContext();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudentSessions, setSelectedStudentSessions] = useState([]);

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
  }, []);

  return (
    <div className="mx-10 flex flex-col items-center">
      <StudentSelect 
        students={students}
        selectedStudent={selectedStudent}
        onSelectStudent={handleSelectStudent}
        onClear={handleClear}
      />
    </div>
  );
};

export default ReportContainer;