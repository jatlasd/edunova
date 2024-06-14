"use client";

import UserTable from "@/components/dashboard/UserTable";
import { useGlobalContext } from "@/lib/GlobalProvider";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const { user } = useGlobalContext();

  useEffect(() => {
    const fetchStudents = async () => {
      const response = await fetch(`/api/user/${user.id}?includeStudents=true`);
      const data = await response.json();
      setStudents(data);
    };
    if (user && user.id) {
      fetchStudents();
    }
  }, [user]);

  const handleButtonClick = () => {
    console.log(students)
  };

  return (
    <div>
      <button className='ml-20' onClick={handleButtonClick}>click</button>
      {/* {students.length !== 0 && <UserTable students={students} />} */}
    </div>
  );
};

export default Dashboard;
