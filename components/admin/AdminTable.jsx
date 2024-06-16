"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";

import { useState, useEffect } from "react";
import AddStaff from "./AddStaff";

const AdminTable = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  return (
    <div className="w-full p-10 rounded-md bg-primary-clear">
      <Table className=''>
        <TableHeader>
          <TableRow isHeader={true} className="w-[100px]">
            <TableHead className='text-xl font-semibold text-primary-tint'>Name</TableHead>
            <TableHead className='text-xl font-semibold text-primary-tint'>Email</TableHead>
            <TableHead className='text-xl font-semibold text-primary-tint'>Students</TableHead>
            <TableHead className='text-xl font-semibold text-primary-tint'>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user._id}
              onClick={() => router.push(`/manage/staff/${user._id}`)}
              className="cursor-pointer"
            >
              <TableCell>
                <span>{user.name}</span>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.students.length}</TableCell>
              <TableCell className='capitalize'>{user.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminTable;
