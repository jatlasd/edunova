"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useGlobalContext } from "@/lib/GlobalProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useStudentContext } from "@lib/StudentProvider";

const UserTable = () => {
  const { student, setStudentId } = useStudentContext();
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const { user } = useGlobalContext();

  const fetchStudents = async () => {
    const response = await fetch(`/api/user/${user.id}?includeStudents=true`);
    const data = await response.json();
    setStudents(data);
  };

  const handleStudentClick = (studentId) => {
    setStudentId(studentId);
    router.push(`/students/${studentId}`);
  };

  useEffect(() => {
    if (user && user.id) {
      fetchStudents();
    }
  }, [user]);

  return (
    <Table>
      <TableHeader>
        <TableRow className="w-[100px]" isHeader={true}>
          <TableHead className="text-lg font-semibold text-primary-tint">
            Name
          </TableHead>
          <TableHead className="text-lg font-semibold text-primary-tint">
            Grade
          </TableHead>
          <TableHead className="text-lg font-semibold text-primary-tint">
            Age
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => (
          <TableRow
            key={student._id}
            className="cursor-pointer"
            onClick={() => handleStudentClick(student._id)}
          >
            <TableCell className="capitalize text-slate-700">
              {student.name}
            </TableCell>
            <TableCell className="text-slate-700">{student.grade}</TableCell>
            <TableCell className="text-slate-700">{student.age}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserTable;
