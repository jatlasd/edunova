import Header from "@components/Header";
import AdminTable from "@components/admin/AdminTable";
import React from "react";

const ManageStaff = () => {
  return (
    <div className="flex flex-col">
      <Header />
      <div className="flex flex-col w-full items-center mt-10">
        <h1 className="font-bold text-5xl text-primary mb-16">Staff</h1>
        <div className="flex w-1/2 items-center justify-center">
          <AdminTable />
        </div>
      </div>
    </div>
  );
};

export default ManageStaff;
