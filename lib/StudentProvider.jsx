"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const StudentContext = createContext();

export const useStudentContext = () => useContext(StudentContext);

export const StudentProvider = ({ children }) => {
  const [studentId, setStudentId] = useState(null);
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const setStudentData = useCallback((id, data) => {
    setStudentId(id);
    setStudent(data);
    if (data) {
      localStorage.setItem("student", JSON.stringify(data));
    } else {
      localStorage.removeItem("student");
    }
  }, []);

  useEffect(() => {
    const storedStudent = localStorage.getItem("student");
    if (storedStudent) {
      const parsedStudent = JSON.parse(storedStudent);
      setStudentData(parsedStudent._id, parsedStudent);
    }
  }, [setStudentData]);

  const clearStudent = useCallback(() => {
    setStudentData(null, null);
  }, [setStudentData]);

  const refetchStudent = useCallback(async () => {
    if (!studentId) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/student/${studentId}`);
      const data = await response.json();
      setStudentData(studentId, data.student);
    } catch (error) {
      console.error("Failed to fetch student data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [studentId, setStudentData]);

  useEffect(() => {
    refetchStudent();
  }, [refetchTrigger, refetchStudent]);

  return (
    <StudentContext.Provider
      value={{ 
        studentId, 
        setStudentId,
        student, 
        isLoading, 
        setIsLoading,
        refetchTrigger,
        setRefetchTrigger,
        clearStudent,
        setStudentData,
        refetchStudent,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};