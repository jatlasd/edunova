"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

const AddBehavior = ({ studentId, update }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newBehavior, setNewBehavior] = useState({
    behavior: "",
    description: "",
  });
  const [allBehaviors, setAllBehaviors] = useState([]);
  const [isAddingNewBehavior, setIsAddingNewBehavior] = useState(false);

  useEffect(() => {
    const fetchAllBehaviors = async () => {
      const response = await fetch("/api/behavior");
      const data = await response.json();
      setAllBehaviors(data);
    };

    fetchAllBehaviors();
  }, []);

  const handleSubmit = async () => {
    const response = await fetch("/api/behavior", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...newBehavior, student: studentId }),
    });
    if (response.ok) {
      setNewBehavior({ behavior: "", description: "" });
      update();
      setIsOpen(false);
      setIsAddingNewBehavior(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          onClick={() => setIsOpen(true)}
          className="w-1/3 px-2 py-1 my-2 text-base font-semibold transition-all duration-75 rounded-md shadow-md bg-primary text-white-1 hover:bg-primary-tint"
        >
          Add Behavior
        </button>
      </PopoverTrigger>
      <PopoverContent className="bg-white-1">
        <div className="flex flex-col gap-y-3">
          <div className="flex flex-col gap-y-1.5">
            <label className="form-label">Behavior</label>
            {isAddingNewBehavior ? (
              <Input
                type="text"
                value={newBehavior.behavior}
                onChange={(e) =>
                  setNewBehavior({ ...newBehavior, behavior: e.target.value })
                }
                placeholder="Enter new behavior"
              />
            ) : (
              <Select
                onValueChange={(value) => {
                  if (value === "add_new") {
                    setIsAddingNewBehavior(true);
                    setNewBehavior({ ...newBehavior, behavior: "" });
                  } else {
                    setNewBehavior({ ...newBehavior, behavior: value });
                  }
                }}
                value={newBehavior.behavior}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select behavior" />
                </SelectTrigger>
                <SelectContent className="bg-white-1">
                  <SelectItem
                    value="add_new"
                    className="font-semibold cursor-pointer text-primary"
                  >
                    Add new behavior
                  </SelectItem>
                  {allBehaviors.map((behavior) => (
                    <SelectItem
                      key={behavior.id}
                      value={behavior.behavior}
                      className="cursor-pointer"
                    >
                      {behavior.behavior}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="flex flex-col gap-y-1.5">
            <label className="form-label">Description</label>
            <Input
              type="text"
              value={newBehavior.description}
              onChange={(e) =>
                setNewBehavior({ ...newBehavior, description: e.target.value })
              }
            />
          </div>
          <button onClick={handleSubmit} className="form-btn">
            Add Behavior
          </button>
          {isAddingNewBehavior && (
            <button
              onClick={() => {
                setIsAddingNewBehavior(false);
                setNewBehavior({ ...newBehavior, behavior: "" });
              }}
              className="form-btn"
            >
              Cancel
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AddBehavior;