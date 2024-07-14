"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import Loading from "@components/Loading";
import MultipleSelect from "./MultipleSelect";

const StudentListTable = ({ staffId }) => {
  const router = useRouter();
  const [staffStudents, setStaffStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    const fetchStaffStudents = async () => {
      setLoading(true);
      const response = await fetch(`/api/user/${staffId}`);
      const data = await response.json();
      setStaffStudents(data.students);
      setSelectedStudents(data.students.map(student => student._id));
      setLoading(false);
    };
    const fetchAllStudents = async () => {
      setLoading(true);
      const response = await fetch("/api/student");
      const data = await response.json();
      setAllStudents(data);
      setLoading(false);
    };
    fetchStaffStudents();
    fetchAllStudents();
  }, [staffId]);

  const handleStudentSelect = (selectedIds) => {
    setSelectedStudents(selectedIds);
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`/api/user/${staffId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ students: selectedStudents }),
      });

      if (response.ok) {
        const updatedStaffStudents = allStudents.filter(student => 
          selectedStudents.includes(student._id)
        );
        setStaffStudents(updatedStaffStudents);
        setIsEditing(false);
      } else {
        console.error('Failed to update students');
      }
    } catch (error) {
      console.error('Error updating students:', error);
    }
  };

  return (
    <div className="flex h-full w-1/2 flex-col items-center rounded-md bg-primary-clear p-10">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex w-full justify-between mb-2">
            <h2 className="text-2xl font-bold text-primary">Student List</h2>
            <button
              className="ml-auto cursor-pointer text-sm text-primary transition-colors duration-75 hover:text-primary-tint"
              onClick={() => isEditing ? handleSaveChanges() : setIsEditing(true)}
            >
              {isEditing ? "Save" : "Edit"}
            </button>
          </div>
          {isEditing ? (
            <MultipleSelect 
              options={allStudents.map(student => ({
                value: student._id,
                label: student.name
              }))}
              selectedValues={selectedStudents}
              onChange={handleStudentSelect}
              placeholder="Select students"
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow isHeader={true}>
                  <TableHead className="w-[60%]">Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffStudents.map((student) => (
                  <TableRow
                    key={student._id}
                    onClick={() => router.push(`/students/${student._id}`)}
                    className="cursor-pointer"
                  >
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.age}</TableCell>
                    <TableCell>{student.grade}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </>
      )}
    </div>
  );
};

export default StudentListTable;