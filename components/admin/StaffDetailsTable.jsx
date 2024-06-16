"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { useGlobalContext } from "@lib/GlobalProvider";
import { set } from "mongoose";

const StaffDetailsTable = ({ staffId }) => {
  const { user } = useGlobalContext();
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const [isEditing, setIsEditing] = useState(false);

  const [selectedUser, setSelectedUser] = useState({});
  const [updatedUser, setUpdatedUser] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });
  const fetchUser = async () => {
    const response = await fetch(`/api/user/${staffId}`);
    const data = await response.json();
    setSelectedUser(data);
    setUpdatedUser({
      name: data.name,
      email: data.email,
      role: data.role,
      password: data.password,
    });
  };

  useEffect(() => {
    fetchUser();
  }, []); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/user/${staffId}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          password: updatedUser.password,
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        await fetchUser(); 
        if (isEditing) setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to update user:', error);
    }
    handleClose();
  };

  return (
    <div className="w-1/3 h-full p-10 rounded-md bg-primary-clear">
      <div className="flex flex-col">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold text-primary">Staff Details</h2>
          <button
            className="text-primary hover:text-primary-tint"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>
        <div className="flex flex-col">
          <div className="flex justify-between mb-4">
            <span className="text-xl font-semibold text-primary-tint">
              Name:
            </span>
            {isEditing ? (
              <input
                className="px-4 rounded-md"
                placeholder={user.name}
                onChange={(e) =>
                  setUpdatedUser({ ...updatedUser, name: e.target.value })
                }
              />
            ) : (
              <span className="capitalize text-primary-tint">
                {selectedUser.name}
              </span>
            )}
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-xl font-semibold text-primary-tint">
              Role:
            </span>
            {isEditing ? (
              <select
                className="w-2/3 px-3 py-2 rounded-lg"
                onChange={(e) =>
                  setUpdatedUser({ ...updatedUser, role: e.target.value })
                }
                value={updatedUser.role}
              >
                <option value="user" className="text-16">
                  User
                </option>
                <option value="admin" className="text-16">
                  Admin
                </option>
                {user?.role === "super" && (
                  <option value="super" className="text-16">
                    Super
                  </option>
                )}
              </select>
            ) : (
              <span className="capitalize text-primary-tint">
                {selectedUser.role}
              </span>
            )}
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-xl font-semibold text-primary-tint">
              Email:
            </span>
            {isEditing ? (
              <input
                className="px-4 rounded-md"
                placeholder={selectedUser.email}
                onChange={(e) =>
                  setUpdatedUser({ ...updatedUser, email: e.target.value })
                }
              />
            ) : (
              <span className="text-primary-tint">{selectedUser.email}</span>
            )}{" "}
          </div>
        </div>
        {isEditing ? (
          <button
            className="px-4 py-2 mt-5 ml-auto text-sm font-semibold rounded-md cursor-pointer bg-primary text-white-1 hover:bg-primary-tint"
            onClick={handleSubmit}
          >
            Save Changes
          </button>
        ) : (
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <button
                onClick={handleOpen}
                className="px-4 py-2 mt-5 ml-auto text-sm font-semibold rounded-md cursor-pointer bg-primary text-white-1 hover:bg-primary-tint"
              >
                Reset Password
              </button>
            </PopoverTrigger>
            <PopoverContent className="mt-3 w-80 bg-white-1">
              <div className="flex flex-col gap-y-1.5">
                <p className="w-full text-xl font-bold text-center text-primary">
                  New Password
                </p>
                <input
                  type="text"
                  placeholder="Password"
                  className="px-4 py-2 mt-2 input-class"
                  onChange={(e) =>
                    setUpdatedUser({ ...updatedUser, password: e.target.value })
                  }
                />
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 mt-2 text-sm font-semibold rounded-md bg-primary text-white-1 hover:bg-primary-tint"
                >
                  Submit
                </button>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
};

export default StaffDetailsTable;
