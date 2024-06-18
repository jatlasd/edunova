"use client";

import { useState, useEffect } from "react";

const StudentDetailsTable = ({ studentId }) => {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      const response = await fetch(`/api/student/${studentId}`);
      const data = await response.json();
      console.log(data);
      setStudent(data);
    };
    fetchStudent();
  }, [studentId]);

  return (
    <div className="mr-40 flex flex-1 flex-col rounded-md bg-primary-clear p-3">
      {student && (
        <>
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-primary-tint">
              Name:&nbsp;
            </span>
            <span className="text-base capitalize text-primary-tint">
              {student.student.name}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-primary-tint">
              Age:&nbsp;
            </span>
            <span className="text-base capitalize text-primary-tint">
              {student.student.age}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-primary-tint">
              Grade:&nbsp;
            </span>
            <span className="text-base capitalize text-primary-tint">
              {student.student.grade}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentDetailsTable;
