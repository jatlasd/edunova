"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useStudentContext } from "@lib/StudentProvider";

const ManageStudentsTable = () => {
    const {setStudentId} = useStudentContext()
    const router = useRouter()
  const [students, setStudents] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  const fetchStudents = async () => {
    const response = await fetch("/api/student");
    const data = await response.json();
    console.log(data);
    setStudents(data);
  };
  const fetchUsers = async () => {
    const response = await fetch("/api/user");
    const data = await response.json();
    setUsers(data);
  };

  const clearFilter = () => {
    setSelectedUser("");
  };

  useEffect(() => {
    fetchStudents();
    fetchUsers();
  }, []);

  const handleClick = (studentId) => {
    setStudentId(studentId)
    router.push(`/students/${studentId}`)
  }

  return (
    <div className="flex w-4/5 flex-col items-center mt-5">
      <div className="relative flex w-1/3 flex-col items-center">
        <Select
          value={selectedUser}
          onValueChange={(value) => setSelectedUser(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by Staff" />
          </SelectTrigger>
          <SelectContent className='bg-white-1'>
            {users.map((user) => (
              <SelectItem key={user._id} value={user._id}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedUser && (
          <button
            onClick={clearFilter}
            className="absolute right-10 top-3 text-primary-tint"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="mt-10 max-h-[350px] w-full overflow-y-scroll rounded-md bg-primary-clear p-5 shadow-md">
        <Table>
          <TableHeader>
            <TableRow isHeader={true}>
              <TableHead className="text-lg font-semibold text-primary-tint">
                Student
              </TableHead>
              <TableHead className="text-lg font-semibold text-primary-tint">
                Grade
              </TableHead>
              <TableHead className="text-lg font-semibold text-primary-tint">
                Age
              </TableHead>
              <TableHead className="text-lg font-semibold text-primary-tint">
                Staff
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students
              .filter((student) =>
                selectedUser ? student.staff === selectedUser : true,
              )
              .map((student) => (
                <TableRow
                  key={student._id}
                  onClick={() => handleClick(student._id)}
                  className="cursor-pointer"
                >
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.grade}</TableCell>
                  <TableCell>{student.age}</TableCell>
                  <TableCell>{student.users[0].name}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ManageStudentsTable;
