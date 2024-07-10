"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

import { useState, useEffect } from "react";
import AddBehavior from "./AddBehavior";
import { Trash2 } from "lucide-react";
import CustomTooltip from "@components/CustomTooltip";

const StudentBehaviorTable = ({ studentId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBehaviorId, setSelectedBehaviorId] = useState(null);

  const handleOpen = (behaviorId) => {
    setIsOpen(true);
    setSelectedBehaviorId(behaviorId);
  };
  const [student, setStudent] = useState({});
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const update = () => setShouldUpdate(!shouldUpdate);

  useEffect(() => {
    const fetchStudent = async () => {
      const response = await fetch(`/api/student/${studentId}`);
      const data = await response.json();
      setStudent(data);
    };
    fetchStudent();
  }, [studentId, shouldUpdate]);

  const handleDelete = async () => {
    const response = await fetch(`/api/behavior/${selectedBehaviorId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setIsOpen(false);
      update();
    }
  };

  const handleClick = () => {
    console.log(student.student.behaviors)
  }

  return (
    <div
      className={`flex flex-1 flex-col rounded-md bg-primary-clear p-3 ${!student.behaviors || student.behaviors.length === 0 ? "h-30 items-center justify-center" : ""}`}
    >
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-white-1">
          <DialogHeader className="text-lg font-semibold text-primary-tint">
            Delete this behavior?
          </DialogHeader>
          <div className="flex justify-evenly">
            <button
              className="rounded-md bg-secondary px-2 py-1 text-base font-semibold text-white-1 shadow-md transition-colors duration-75 hover:bg-secondary-tint focus:outline-none"
              onClick={() => handleDelete()}
            >
              Delete
            </button>
            <button
              className="rounded-md bg-primary px-2 py-1 text-base font-semibold text-white-1 shadow-md transition-colors duration-75 hover:bg-primary-tint focus:outline-none"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
          </div>
        </DialogContent>
      </Dialog>
      <div className="flex w-full justify-center">
        <button className="btn-primary mr-10" onClick={handleClick}>click</button>
        <AddBehavior studentId={studentId} update={update} />
      </div>
      {student.student?.behaviors && student.student.behaviors.length > 0 ? (
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
            {student.student.behaviors.map((behavior, index) => (
              <TableRow key={index}>
                <TableCell className="text-base text-primary-tint">
                  {behavior.behavior}
                </TableCell>
                <TableCell className="flex justify-between text-base text-primary-tint">
                  {behavior.description}
                  <CustomTooltip
                    text="Delete Behavior"
                    textStyles="text-secondary font-semibold"
                  >
                    <Trash2
                      className="cursor-pointer text-secondary"
                      onClick={() => handleOpen(behavior._id)}
                    />
                  </CustomTooltip>
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
