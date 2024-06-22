import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

import { useState } from "react";

const AddBehavior = ({ studentId, update }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newBehavior, setNewBehavior] = useState({
    behavior: "",
    description: ""
  });

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
      update()
      setIsOpen(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button onClick={() => setIsOpen(true)} className="w-1/3 px-2 py-1 my-2 text-base font-semibold transition-all duration-75 rounded-md shadow-md bg-primary text-white-1 hover:bg-primary-tint">
          Add Behavior
        </button>
      </PopoverTrigger>
      <PopoverContent className="bg-white-1">
        <div className="flex flex-col gap-y-3">
          <div className="flex flex-col gap-y-1.5">
            <label className="form-label">Behavior</label>
            <Input
              type="text"
              value={newBehavior.behavior}
              onChange={(e) => setNewBehavior({ ...newBehavior, behavior: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-y-1.5">
            <label className="form-label">Description</label>
            <Input
              type="text"
              value={newBehavior.description}
              onChange={(e) => setNewBehavior({ ...newBehavior, description: e.target.value })}
            />
          </div>
          <button onClick={handleSubmit} className="form-btn">Add Behavior</button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AddBehavior;
