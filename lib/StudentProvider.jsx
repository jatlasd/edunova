"use client";

import { createContext, useContext, useState, useEffect } from "react";

const StudentContext = createContext();

export const useStudentContext = () => useContext(StudentContext);

export const StudentProvider = ({ children }) => {
  const [studentId, setStudentId] = useState(null);
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    const fetchStudent = async () => {
      if (!studentId) return;
      setIsLoading(true);
      try {
        const response = await fetch(`/api/student/${studentId}`);
        const data = await response.json();
        setStudent(data.student);
        localStorage.setItem("student", JSON.stringify(data.student));
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch student data:", error);
        setIsLoading(false);
      }
    };

    
      fetchStudent()
    
  }, [studentId, refetchTrigger]);

  useEffect(() => {
    const storedStudent = localStorage.getItem("student");
    if (storedStudent) {
      setStudent(JSON.parse(storedStudent));
    }
  }, []);

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
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};