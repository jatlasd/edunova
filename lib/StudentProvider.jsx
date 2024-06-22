"use client"

import { createContext, useContext, useState, useEffect } from "react";

const StudentContext = createContext();

export const useStudentContext = () => useContext(StudentContext);

export const StudentProvider = ({ children }) => {
    const [studentId, setStudentId] = useState(null);
    const [student, setStudent] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Effect for fetching student data
    useEffect(() => {
        if (!studentId) return;

        const fetchStudent = async () => {
            setIsLoading(true);
            const response = await fetch(`/api/student/${studentId}`);
            const data = await response.json();
            setStudent(data);
            localStorage.setItem("student", JSON.stringify(data));
            setIsLoading(false);
        };

        fetchStudent();
    }, [studentId]);

    // Effect for handling localStorage for studentId
    useEffect(() => {
        const storedStudentId = localStorage.getItem("studentId");
        if (storedStudentId) {
            setStudentId(JSON.parse(storedStudentId));
        }

        return () => {
            if (studentId) {
                localStorage.setItem("studentId", JSON.stringify(studentId));
            } else {
                localStorage.removeItem("studentId");
            }
        };
    }, [studentId]);

    // Effect for handling localStorage for student
    useEffect(() => {
        const storedStudent = localStorage.getItem("student");
        if (storedStudent) {
            setStudent(JSON.parse(storedStudent));
        }
    }, []);

    return (
        <StudentContext.Provider value={{ studentId, setStudentId, student, isLoading, setIsLoading }}>
            {children}
        </StudentContext.Provider>
    );
}