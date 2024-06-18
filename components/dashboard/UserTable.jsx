"use client"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useGlobalContext } from "@/lib/GlobalProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const UserTable = () => {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const { user } = useGlobalContext();

  const fetchStudents = async () => {
    const response = await fetch(`/api/user/${user.id}?includeStudents=true`);
    const data = await response.json();
    setStudents(data);
  };
  
  useEffect(() => {
    if (user && user.id) {
      fetchStudents();
    }
  }, [user]);

  return (
    <Table>
      <TableHeader>
        <TableRow className='w-[100px]'>
          <TableHead className='font-semibold text-primary-tint text-lg'>Name</TableHead>
          <TableHead className='font-semibold text-primary-tint text-lg'>Grade</TableHead>
          <TableHead className='font-semibold text-primary-tint text-lg'>Age</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => (
          <TableRow key={student._id} className='cursor-pointer' onClick={() => router.push(`/students/${student._id}`)}>
            <TableCell className=' capitalize text-slate-700'>{student.name}</TableCell>
            <TableCell className='text-slate-700'>{student.grade}</TableCell>
            <TableCell className='text-slate-700'>{student.age}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserTable;
