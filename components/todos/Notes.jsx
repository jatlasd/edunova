"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useHotkey } from "@lib/useHotkey";
import { Textarea } from "@components/ui/textarea";

const Notes = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = useCallback(() => setIsOpen(true), []);

  const [notes, setNotes] = useState([]);
  const noteId = "6693293219166684dedab6e3";
  const [currentText, setCurrentText] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      const response = await fetch("/api/note");
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
        if (data.length > 0) {
          setCurrentText(data[0].text);
        }
      }
    };
    fetchNotes();
  }, []);

  const handleTextChange = (e) => {
    setCurrentText(e.target.value);
  };

  const handleSubmit = async () => {
    const response = await fetch(`/api/note/${noteId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: currentText }),
    });
    if (response.ok) {
      console.log("Note updated");
    }
  };

  const handleDialogClose = useCallback(
    (open) => {
      if (!open) {
        handleSubmit();
      }
      setIsOpen(open);
    },
    [handleSubmit]
  );

  useHotkey("j", openDialog);

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="bg-white-1">
        <div className="flex w-full flex-col items-center">
          <Textarea
            value={currentText}
            onChange={handleTextChange}
            className="min-h-[350px] m-2 p-5"
          />
          <button className="btn-primary mt-5 w-1/3" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Notes;