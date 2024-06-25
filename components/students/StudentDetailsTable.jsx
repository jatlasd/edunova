"use client";

import { useGlobalContext } from "@lib/GlobalProvider";
import { useStudentContext } from "@lib/StudentProvider";
import { useState, useEffect, useRef } from "react";
import { Checkbox } from "@components/ui/checkbox";
import { ChevronDown, ChevronUp } from "lucide-react";

const TableRow = ({ detail, studentDetail }) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-lg font-semibold capitalize text-primary-tint">
        {detail}:&nbsp;
      </span>
      <span className="text-base capitalize text-primary-tint">
        {studentDetail}
      </span>
    </div>
  );
};

const StudentDetailsTable = ({}) => {
  const { student } = useStudentContext();
  const { user } = useGlobalContext();
  const [isEditing, setIsEditing] = useState(false);
  const [updatedStudent, setUpdatedStudent] = useState({
    name: "",
    age: "",
    grade: "",
    users: [],
  });
  const [allStaff, setAllStaff] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch(`/api/user`);
        const data = await response.json();
        setAllStaff(data);
      } catch (error) {
        console.error("Failed to fetch staff data:", error);
      }
    };

    fetchStaff();
  }, []);

  useEffect(() => {
    if (student) {
      setUpdatedStudent({
        name: student.name,
        age: student.age,
        grade: student.grade,
        users: student.users.map(user => user._id),
      });
    }
  }, [student]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleStaffSelect = (staffId) => {
    setUpdatedStudent(prev => {
      const newUsers = prev.users.includes(staffId)
        ? prev.users.filter(id => id !== staffId)
        : [...prev.users, staffId];
      
      return {
        ...prev,
        users: newUsers
      };
    });
  };

  const getDropdownDisplayText = () => {
    if (updatedStudent.users.length === 0) return "Select Staff";
    if (updatedStudent.users.length === 1) {
      const selectedStaffMember = allStaff.find(staff => staff._id === updatedStudent.users[0]);
      return selectedStaffMember ? selectedStaffMember.name : "Select Staff";
    }
    return `${updatedStudent.users.length} Selected`;
  };

  const handleSubmit = () => {
    console.log(updatedStudent);
    // e.preventDefault();
    // try {
    //   const response = await fetch(`/api/student/${student._id}`, {
    //     method: 'PUT',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(updatedStudent),
    //   });
    //   if (response.ok) {
    //     setIsEditing(false);
    //     // Optionally, update the student context or refetch the student data
    //   }
    // } catch (error) {
    //   console.error("Failed to update student:", error);
    // }
  };

  return (
    <div className="mr-40 flex flex-1 flex-col items-center rounded-md bg-primary-clear pr-2 pt-3">
      <div className="mx-5 flex w-full items-center justify-between">
        <h1 className="ml-2 w-1/2 border-b border-b-primary/30 pl-3 text-3xl font-bold text-primary-tint">
          Details
        </h1>
        {user &&
          (user.role === "admin" || user.role === "super") && (
            <button
              className="mr-5 cursor-pointer text-primary transition-all duration-75 hover:text-primary-tint hover:underline"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          )}
      </div>
      {student && user && (
        <div className="ml-5 mt-7 flex w-full flex-col gap-y-5 px-10">
          {isEditing ? (
            <>
              <div className="flex">
                <span className="text-lg font-semibold capitalize text-primary-tint">
                  Name:&nbsp;
                </span>
                <input
                  className="ml-auto w-[200px] rounded-md px-4 text-base capitalize text-primary-tint"
                  value={updatedStudent.name}
                  onChange={(e) =>
                    setUpdatedStudent({
                      ...updatedStudent,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex">
                <span className="text-lg font-semibold capitalize text-primary-tint">
                  Age:&nbsp;
                </span>
                <input
                  className="ml-auto w-[200px] rounded-md px-4 text-base capitalize text-primary-tint"
                  value={updatedStudent.age}
                  onChange={(e) =>
                    setUpdatedStudent({
                      ...updatedStudent,
                      age: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex">
                <span className="text-lg font-semibold capitalize text-primary-tint">
                  Grade:&nbsp;
                </span>
                <input
                  className="ml-auto w-[200px] rounded-md px-4 text-base capitalize text-primary-tint"
                  value={updatedStudent.grade}
                  onChange={(e) =>
                    setUpdatedStudent({
                      ...updatedStudent,
                      grade: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex relative" ref={dropdownRef}>
                <span className="text-lg font-semibold capitalize text-primary-tint">
                  Staff:&nbsp;
                </span>
                <div className="ml-auto w-[200px]">
                  <button
                    type="button"
                    className="flex justify-between items-center w-full px-4 py-2 text-sm font-medium text-left bg-white-1 border border-primary/30 rounded-md shadow-sm "
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    {getDropdownDisplayText()}
                    {isDropdownOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 w-[200px] mt-2 origin-top-right bg-white rounded-md shadow-lg  focus:outline-none">
                      <div className="py-1">
                        {allStaff.map((staff) => (
                          <div 
                            key={staff._id} 
                            className="flex items-center px-4 py-2 text-sm cursor-pointer bg-white-1 "
                            onClick={() => handleStaffSelect(staff._id)}
                          >
                            <Checkbox
                              checked={updatedStudent.users.includes(staff._id)}
                              className="mr-2"
                            />
                            <span>{staff.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex w-full justify-evenly">
                <button 
                  className="cursor-pointer rounded-md bg-primary px-2 py-1 font-semibold text-white-1 shadow-md transition-colors duration-75 hover:bg-primary-tint"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
                <button 
                  className="cursor-pointer rounded-md bg-secondary px-2 py-1 font-semibold text-white-1 shadow-md transition-colors duration-75 hover:bg-secondary-tint"
                  onClick={() => {setIsEditing(false)}}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <TableRow detail="name" studentDetail={student.name} />
              <TableRow detail="age" studentDetail={student.age} />
              <TableRow detail="grade" studentDetail={student.grade} />
              {user.role !== "user" && (
                <TableRow
                  detail="staff"
                  studentDetail={student.users.map(u => u.name).join(", ")}
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentDetailsTable;