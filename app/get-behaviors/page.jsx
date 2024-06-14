"use client";

import { useState, useEffect } from "react";

const GetBehaviors = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [behaviors, setBehaviors] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const response = await fetch("/api/student");
      const data = await response.json();
      setStudents(data);
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    const fetchBehaviors = async () => {
      const response = await fetch(`/api/student/${selectedStudent}`);
      const data = await response.json();
      console.log(data);
      setBehaviors(data);
    };
    if (selectedStudent) {
      fetchBehaviors();
    }
  }, [selectedStudent]);

  return (
    <div className="flex h-screen flex-col">
      <div className="bg-blue-200 p-5">
        <select
          onChange={(e) => {
            console.log(e.target.value); // This will log the selected student ID
            setSelectedStudent(e.target.value);
          }}
          className="my-10"
        >
          <option value="">Select a student</option>
          {students.map((student) => (
            <option key={student._id} value={student._id}>
              {student.name}
            </option>
          ))}
        </select>
      </div>
      <div className="h-full bg-green-200 p-5">
        {selectedStudent ? (
          <>
            <button
              className="bg-red-200 p-4"
              onClick={() => {
                console.log(behaviors);
              }}
            >
              Click
            </button>
            {behaviors.map((behavior) => (
              <div key={behavior._id}>
                <h3>{behavior.behavior}</h3>
                <p>{behavior.description}</p>
              </div>
            ))}
          </>
        ) : (
          <>
            <p>Select a student to see associated behaviors</p>
          </>
        )}
      </div>
    </div>
  );
};

export default GetBehaviors;
