"use client";

import UserTable from "@/components/dashboard/UserTable";
import { useGlobalContext } from "@/lib/GlobalProvider";
import QuickNotesTable from "@components/dashboard/QuickNotesTable";
import UpcomingSessionsDisplay from "@components/dashboard/UpcomingSessionsDisplay";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const [details, setDetails] = useState([]);
  const { user } = useGlobalContext();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const response = await fetch(`/api/user/${user.id}`);
      const data = await response.json();
      setDetails(data);
    };
    if (user && user.id) {
      fetchUserDetails();
    }
  }, [user]);

  const handleButtonClick = () => {
    console.log(details)
  };

  return (
    <div className="flex flex-col items-center">
      <QuickNotesTable />
      <UpcomingSessionsDisplay />
    </div>
  );
};

export default Dashboard;
