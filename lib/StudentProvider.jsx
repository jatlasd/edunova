"use client";

import { createContext, useContext, useState, useEffect } from "react";

const StudentContext = createContext();

export const useStudentContext = () => useContext(StudentContext);

export const StudentProvider = ({ children }) => {
  const [studentId, setStudentId] = useState(null);
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/student/${studentId}`);
        const data = await response.json();
        setStudent(data);
        localStorage.setItem("student", JSON.stringify(data.student));
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch student data:", error);
        setIsLoading(false);
      }
    };

    const storedStudent = localStorage.getItem("student");
    if (storedStudent) {
      const parsedStudent = JSON.parse(storedStudent);
      if (!studentId || (parsedStudent && parsedStudent._id === studentId)) {
        setStudent(parsedStudent);
        return;
      }
    }

    if (studentId) {
      fetchStudent();
    }
  }, [studentId]);

  useEffect(() => {
    const storedStudent = localStorage.getItem("student");
    if (storedStudent) {
      setStudent(JSON.parse(storedStudent));
    }
  }, []);

  return (
    <StudentContext.Provider
      value={{ studentId, setStudentId, student, isLoading, setIsLoading }}
    >
      {children}
    </StudentContext.Provider>
  );
};
