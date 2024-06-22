import Header from "@components/Header";
import UserTable from "@components/dashboard/UserTable";
import AddStudentDialog from "@components/students/AddStudentDialog";
import React from "react";

const MyStudents = () => {
  return (
    <>
      <h1 className="mt-10 text-5xl font-bold text-primary-tint">
        My Students
      </h1>
      <div className="mt-10 w-3/5 rounded-md bg-primary-clear py-5 mb-5">
        <UserTable />
      </div>
        <AddStudentDialog />
    </>
  );
};

export default MyStudents;
