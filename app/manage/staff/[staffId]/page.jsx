"use client";
import { useEffect, useState } from "react";

const UserPage = ({ params }) => {
    const [user, setUser] = useState({})
  const { staffId } = params;

  useEffect(() => {
    const getUser = async () => {
        const response = await fetch(`/api/user/${staffId}`)
        const data = await response.json()
        setUser(data)
    }
    getUser()
  }, [])

  return (
    <div>
      <button onClick={() => console.log(user)}>click</button>
    </div>
  );
};

export default UserPage;
