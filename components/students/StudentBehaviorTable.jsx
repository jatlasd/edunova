"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";

const StudentBehaviorTable = ({studentId}) => {
    const [ student, setStudent ] = useState({})

  useEffect(() => {
    const fetchStudent = async () => {
      const response = await fetch(`/api/student/${studentId}`);
      const data = await response.json();
      console.log(data)
      setStudent(data);
    };
    fetchStudent();
  
  }, [studentId])
  return (
    <div className="flex-1 rounded-md bg-primary-clear p-3">
      {student.behaviors && student.behaviors.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow isHeader={true}>
              <TableHead className="text-lg font-semibold text-primary-tint">
                Behavior
              </TableHead>
              <TableHead className="text-lg font-semibold text-primary-tint">
                Description
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {student.behaviors.map((behavior, index) => (
              <TableRow key={index}>
                <TableCell className="text-base text-primary-tint">
                  {behavior.behavior}
                </TableCell>
                <TableCell className="text-base text-primary-tint">
                  {behavior.description}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <h1 className="text-xl font-bold text-primary-tint">
          No Behaviors to Display
        </h1>
      )}
    </div>
  );
};

export default StudentBehaviorTable;
