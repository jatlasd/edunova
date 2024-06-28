"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@components/ui/input";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useGlobalContext } from "@lib/GlobalProvider";

const formatTime = (date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";
  return `${(((hours + 11) % 12) + 1).toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${ampm}`;
};

const ActiveSessionContainer = ({ sessionId }) => {
  const router = useRouter();
  const { user } = useGlobalContext();
  const [session, setSession] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBehavior, setSelectedBehavior] = useState({});
  const [inputNote, setInputNote] = useState("");

  useEffect(() => {
    const fetchSession = async () => {
      const response = await fetch(`/api/session/${sessionId}`);
      const data = await response.json();
      setSession(data.session);
    };
    fetchSession();
  }, [sessionId]);

  const handleBehaviorClick = (behavior) => {
    const now = new Date();
    const updatedBehavior = {
      ...behavior,
      count: behavior.count + 1,
      timestamps: [...behavior.timestamps, { time: formatTime(now), notes: "" }],
    };
    setSelectedBehavior(updatedBehavior);
    setInputNote("");
    setIsOpen(true);
  };

  const updateSessionBehavior = (updatedBehavior) => {
    setSession(prevSession => ({
      ...prevSession,
      behaviors: prevSession.behaviors.map(b => 
        b.behavior === updatedBehavior.behavior ? updatedBehavior : b
      )
    }));
  };

  const handleSubmit = async () => {
    const updatedSession = { ...session, status: "Pending" };
    const response = await fetch(`/api/session/${sessionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedSession),
    });
    if (response.ok) {
      router.push(`/sessions/${sessionId}`);
    }
  };

  const handleNoteSubmit = (note) => {
    const updatedBehavior = { ...selectedBehavior };
    updatedBehavior.timestamps[updatedBehavior.timestamps.length - 1].notes = note;
    setSelectedBehavior(updatedBehavior);
    updateSessionBehavior(updatedBehavior);
    setIsOpen(false);
  };

  const QuickNotesDiv = ({ behavior }) => {
    const notes = user.quickNotes.find((note) => note.behavior === behavior.behavior)?.notes || [];

    return (
      <div className="flex flex-col items-center">
        <span className="text-primary-tint font-semibold text-lg mb-3 border-b border-b-primary/20 px-5">Quick Notes</span>
        <div className="w-full flex justify-evenly">
          {notes.map((note, index) => (
            <button key={index} className="btn-primary" onClick={() => handleNoteSubmit(note)}>
              {note}
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (!session) return null;

  return (
    <div className="flex flex-col items-center h-full">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-white-1">
          <DialogHeader>
            <DialogTitle className="text-primary-tint font-bold text-xl">{selectedBehavior.behavior}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-5 p-5">
            <span className="text-primary-tint font-semibold text-lg">Notes</span>
            <Input
              type="text"
              className="input-class"
              value={inputNote}
              onChange={(e) => setInputNote(e.target.value)}
            />
            <QuickNotesDiv behavior={selectedBehavior} />
            <button
              className="px-4 py-2 mt-4 font-bold text-white-1 bg-primary hover:bg-primary-tint rounded-md"
              onClick={() => handleNoteSubmit(inputNote)}
            >
              Submit
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <h1 className="mt-10 mb-20 text-5xl font-bold capitalize text-primary-tint">{session.name}</h1>
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
  );
};

export default ActiveSessionContainer;