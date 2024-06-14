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

const AdminTable = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  return (
    <Table>
      <TableHeader>
        <TableRow className="w-[100px]">
          <TableHead>Name</TableHead>
          <TableHead>Students</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow
            key={user._id}
            onClick={() => router.push(`/manage/staff/${user._id}`)}
            className="cursor-pointer"
          >
            <TableCell className="flex gap-8">
              <span>{user.name}</span>
            </TableCell>
            <TableCell>{user.students.length}</TableCell>
            <TableCell>{user.role}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AdminTable;
