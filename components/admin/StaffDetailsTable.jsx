"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { useGlobalContext } from "@lib/GlobalProvider";
import { useRouter } from "next/navigation";

const StaffDetailsTable = ({ staffId }) => {
  const router = useRouter();
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
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        await fetchUser();
        if (isEditing) setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to update user:", error);
    }
    handleClose();
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/user/${staffId}`, {
        method: "DELETE",
      })
      if(response.ok) {
        setIsEditing(false)
        router.push("/manage/staff")
      }
    } catch (error) {
      console.error("Failed to delete user:", error)
    }
  }

  return (
    <div className="h-full w-1/3 rounded-md bg-primary-clear p-10">
      <div className="flex flex-col">
        <div className="mb-4 flex justify-between">
          <h2 className="text-2xl font-bold text-primary">Staff Details</h2>
          <button
            className="text-primary hover:text-primary-tint"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>
        <div className="flex flex-col">
          <div className="mb-4 flex justify-between">
            <span className="text-xl font-semibold text-primary-tint">
              Name:
            </span>
            {isEditing ? (
              <input
                className="rounded-md px-4"
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
          <div className="mb-4 flex justify-between">
            <span className="text-xl font-semibold text-primary-tint">
              Role:
            </span>
            {isEditing ? (
              <select
                className="w-2/3 rounded-lg px-3 py-2"
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
          <div className="mb-4 flex justify-between">
            <span className="text-xl font-semibold text-primary-tint">
              Email:
            </span>
            {isEditing ? (
              <input
                className="rounded-md px-4"
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
          <div className="flex justify-between">
            <button
              className="mr-auto mt-5 cursor-pointer rounded-md bg-secondary px-4 py-2 text-sm font-semibold text-white-1 hover:bg-secondary-tint"
              onClick={handleDelete}
            >
              Remove Staff
            </button>
            <button
              className="ml-auto mt-5 cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white-1 hover:bg-primary-tint"
              onClick={handleSubmit}
            >
              Save Changes
            </button>
          </div>
        ) : (
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <button
                onClick={handleOpen}
                className="ml-auto mt-5 cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white-1 hover:bg-primary-tint"
              >
                Reset Password
              </button>
            </PopoverTrigger>
            <PopoverContent className="mt-3 w-80 bg-white-1">
              <div className="flex flex-col gap-y-1.5">
                <p className="w-full text-center text-xl font-bold text-primary">
                  New Password
                </p>
                <input
                  type="text"
                  placeholder="Password"
                  className="input-class mt-2 px-4 py-2"
                  onChange={(e) =>
                    setUpdatedUser({ ...updatedUser, password: e.target.value })
                  }
                />
                <button
                  onClick={handleSubmit}
                  className="mt-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white-1 hover:bg-primary-tint"
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
