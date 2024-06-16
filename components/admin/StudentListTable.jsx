"use client";

import { useState, useEffect } from "react";

const StudentListTable = ({ staffId }) => {
  const [students, setStudents] = useState([]);
  useEffect(() => {
    fetch(`/api/user/${staffId}?includeStudents=true`)
      .then((res) => res.json())
      .then((data) => setStudents(data));
  }, []);
  return (
    <div className=" w-1/3 h-full overflow-auto rounded-md bg-primary-clear p-10">
      <div className="flex flex-col">
        <div className="mb-4 flex justify-between">
          <h2 className="text-2xl font-bold text-primary">Student List</h2>
          <button className="text-primary hover:text-primary-tint">Edit</button>
        </div>
        <div className="flex flex-col ">
          {students.map((student) => (
            <div key={student._id} className="mb-4 flex justify-between">
              <span className="text-lg font-semibold text-primary-tint">
                Name:{" "}
                <span className="font-normal capitalize">{student.name}</span>
              </span>
              <span className="text-lg font-semibold text-primary-tint">
                Age:{" "}
                <span className="font-normal capitalize">{student.age}</span>
              </span>
              <span className="text-lg font-semibold text-primary-tint">
                Grade:{" "}
                <span className="font-normal capitalize">{student.grade}</span>
              </span>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default StudentListTable;
