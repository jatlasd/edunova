// "use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { CircleX } from "lucide-react";


  const StudentSelect = ({ students, selectedStudent, onSelectStudent, onClear }) => (
    <div className="w-1/2 relative">
      <Select 
        value={selectedStudent} 
        onValueChange={onSelectStudent}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a student" />
        </SelectTrigger>
        <SelectContent>
          {students.map((student) => (
            <SelectItem key={student._id} value={student._id}>
              {student.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedStudent && (
        <button
          onClick={onClear}
          className="absolute right-8 top-1/2 transform -translate-y-1/2"
        >
          <CircleX size={20} className="mr-3 text-secondary-tint" />
        </button>
      )}
    </div>
  );

export default StudentSelect