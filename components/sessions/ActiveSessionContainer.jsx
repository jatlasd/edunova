"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@components/ui/input";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const formatTime = (date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";
  return `${(((hours + 11) % 12) + 1).toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${ampm}`;
};

const ActiveSessionContainer = ({ sessionId }) => {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [behaviors, setBehaviors] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const [selectedBehavior, setSelectedBehavior] = useState({});

  const fetchSession = async () => {
    const response = await fetch(`/api/session/${sessionId}`);
    const data = await response.json();
    setSession(data.session);
    setBehaviors(data.behaviors);
  };
  useEffect(() => {
    fetchSession();
  }, []);

  const handleBehaviorClick = (behavior) => {
    behavior.count++;
    const now = new Date();
    const formattedTime = formatTime(now);
    behavior.timestamps.push({ time: formattedTime, notes: "" });
    setSelectedBehavior(behavior);
    setIsOpen(true);
  };

  const handleSubmit = async () => {
    session.status = "Pending";
    const response = await fetch(`/api/session/${sessionId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(session),
    });
    if (response.ok) {
      router.push(`/sessions/${sessionId}`);
    }
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-white-1">
          <DialogHeader>
            <DialogTitle className='text-primary-tint font-bold text-xl'>{selectedBehavior.behavior}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-5 p-5">
            <span className="text-primary-tint font-semibold text-lg">Notes</span>
            <Input type="text" className="input-class" onChange={(e) => {
              const updatedBehavior = { ...selectedBehavior };
              updatedBehavior.timestamps[updatedBehavior.timestamps.length - 1].notes = e.target.value;
              setSelectedBehavior(updatedBehavior);
            }}/>
            <button
              className="px-4 py-2 mt-4 font-bold text-white-1 bg-primary hover:bg-primary-tint rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Submit
            </button>
          </div>
        </DialogContent>
      </Dialog>
      {session && (
        <div className="flex flex-col items-center h-full">
          <h1 className="mt-10 mb-20 text-5xl font-bold capitalize text-primary-tint">
            {session.name}
          </h1>
          <div className="flex gap-20">
            {session.behaviors.map((behavior, index) => (
              <button
                key={index}
                className="h-[200px] w-[250px] rounded-md bg-primary text-xl font-semibold text-white-1 shadow-md hover:bg-primary-tint"
                onClick={() => handleBehaviorClick(behavior)}
              >
                {behavior.behavior}
              </button>
            ))}
          </div>
          <button
            className="px-10 py-4 mt-20 font-bold rounded-md shadow-md bg-secondary text-white-1 hover:bg-secondary-tint"
            onClick={handleSubmit}
          >
            End Session
          </button>
        </div>
      )}
    </div>
  );
};

export default ActiveSessionContainer;
