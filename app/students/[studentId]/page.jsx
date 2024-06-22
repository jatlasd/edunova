import SessionListTable from "@components/sessions/SessionListTable";
import StudentBehaviorTable from "@components/students/StudentBehaviorTable";
import StudentDetailsTable from "@components/students/StudentDetailsTable";
import StudentSessionTable from "@components/students/StudentSessionTable";
import React from "react";

const StudentPage = ({params}) => {
  const { studentId } = params
  return (
    <div className="mt-10 flex w-4/5 flex-col items-center justify-center">
      <div className="w-full flex justify-evenly">
      <StudentDetailsTable studentId={studentId}/>
      <StudentBehaviorTable studentId={studentId}/>
      </div>
      <div className=" w-4/5 mt-5 flex justify-center items-center">
        {/* <StudentSessionTable studentId={studentId}/> */}
        <SessionListTable studentId={studentId}/>
      </div>
    </div>
  );
};

export default StudentPage;
