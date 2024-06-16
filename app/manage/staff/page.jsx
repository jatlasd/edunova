import Header from "@components/Header";
import AddStaff from "@components/admin/AddStaff";
import AdminTable from "@components/admin/AdminTable";
import React from "react";

const ManageStaff = () => {
  return (
    <div className="flex flex-col">
      <Header />
      <div className="mt-10 flex w-full flex-col items-center">
        <h1 className="mb-16 text-5xl font-bold text-primary">Staff</h1>
        <div className="mb-10">
          <AddStaff />
        </div>
        <div className="flex w-3/5 items-center justify-center">
          <AdminTable />
        </div>
      </div>
    </div>
  );
};

export default ManageStaff;
