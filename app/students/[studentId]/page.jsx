import StudentBehaviorTable from "@components/students/StudentBehaviorTable";
import StudentDetailsTable from "@components/students/StudentDetailsTable";
import StudentSessionTable from "@components/students/StudentSessionTable";
import React from "react";

const StudentPage = ({params}) => {
  const { studentId } = params
  console.log(studentId)
  return (
    <div className="mt-10 flex w-4/5 flex-col items-center justify-center">
      <div className="w-full flex justify-evenly">
      <StudentDetailsTable studentId={studentId}/>
      <StudentBehaviorTable studentId={studentId}/>
      </div>
      <div>
        <StudentSessionTable studentId={studentId}/>
      </div>
    </div>
  );
};

export default StudentPage;
