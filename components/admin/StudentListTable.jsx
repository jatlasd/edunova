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
      setSelectedStudents(data.students.map((student) => student._id));
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
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ students: selectedStudents }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user's students");
      }

      const updatedStaffStudents = allStudents.filter((student) =>
        selectedStudents.includes(student._id),
      );
      setStaffStudents(updatedStaffStudents);

      await Promise.all(
        allStudents.map(async (student) => {
          const isSelected = selectedStudents.includes(student._id);
          const userIndex = student.users.findIndex(
            (user) => user._id === staffId,
          );
          const userExists = userIndex !== -1;

          if ((isSelected && !userExists) || (!isSelected && userExists)) {
            const updatedUsers = isSelected
              ? [...student.users, { _id: staffId }]
              : student.users.filter((user) => user._id !== staffId);

            const updateResponse = await fetch(`/api/student/${student._id}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ users: updatedUsers }),
            });

            if (!updateResponse.ok) {
              throw new Error(`Failed to update student ${student._id}`);
            }
          }
        }),
      );

      setIsEditing(false);
    } catch (error) {
      throw error;
    }
  };
  return (
    <div className="flex h-full w-1/2 flex-col items-center rounded-md bg-primary-clear p-10">
      {!loading ? (
        <Loading />
      ) : (
        <>
          <div className="mb-2 flex w-full justify-between">
            <h2 className="text-2xl font-bold text-primary">Student List</h2>
            <div>
            {isEditing && (
              <button
                className="mr-5 cursor-pointer text-sm text-primary transition-colors duration-75 hover:text-primary-tint"
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
            )}
            <button
              className={`ml-auto cursor-pointer text-sm transition-colors duration-75 ${isEditing ? 'text-secondary/80 hover:text-secondary-tint' : 'text-primary hover:text-primary-tint'}`}
              onClick={() =>
                isEditing ? setIsEditing(false) : setIsEditing(true)
              }
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
            </div>

          </div>
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
          {isEditing && (
            <div className="flex flex-col items-center gap-y-5 mt-5 w-2/3">
              <h2 className="text-2xl font-semibold text-primary">Edit Student List</h2>
              <MultipleSelect
              options={allStudents.map((student) => ({
                value: student._id,
                label: student.name,
              }))}
              selectedValues={selectedStudents}
              onChange={handleStudentSelect}
              placeholder="Select students"
            />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StudentListTable;
