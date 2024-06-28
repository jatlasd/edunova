"use client";

import { useGlobalContext } from "@/lib/GlobalProvider";
import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const QuickNotesTable = () => {
  const [details, setDetails] = useState([]);
  const { user, setUser } = useGlobalContext();
  const [editingNote, setEditingNote] = useState({
    behaviorId: null,
    noteIndex: null,
  });
  const [editingText, setEditingText] = useState("");
  const [newNoteText, setNewNoteText] = useState("");
  const [isAddNewNote, setIsAddNewNote] = useState(false);
  const [newBehaviorText, setNewBehaviorText] = useState("");
  const [isAddNewBehavior, setIsAddNewBehavior] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const response = await fetch(`/api/user/${user.id}`);
      const data = await response.json();
      setDetails(data.quickNotes);
    };
    if (user && user.id) {
      fetchUserDetails();
    }
  }, [user]);

  const handleEditClick = (behaviorId, noteIndex, noteText) => {
    setEditingNote({ behaviorId, noteIndex });
    setEditingText(noteText);
  };

  const handleSaveEdit = async (behaviorId) => {
    const updatedDetails = details.map((detail) => {
      if (detail._id === behaviorId) {
        const updatedNotes = [...detail.notes];
        updatedNotes[editingNote.noteIndex] = editingText;
        return { ...detail, notes: updatedNotes };
      }
      return detail;
    });

    setDetails(updatedDetails);
    setEditingNote({ behaviorId: null, noteIndex: null });

    await updateQuickNotesInDB(updatedDetails);
  };

  const handleCancelEdit = () => {
    setEditingNote({ behaviorId: null, noteIndex: null });
    setEditingText("");
  };

  const handleAddQuickNote = async (behaviorId) => {
    if (!newNoteText.trim()) return;

    const updatedDetails = details.map((detail) => {
      if (detail._id === behaviorId) {
        return { ...detail, notes: [...detail.notes, newNoteText.trim()] };
      }
      return detail;
    });

    setDetails(updatedDetails);
    setNewNoteText("");

    await updateQuickNotesInDB(updatedDetails);
  };

  const handleDeleteNote = async (behaviorId, noteIndex) => {
    const updatedDetails = details.map((detail) => {
      if (detail._id === behaviorId) {
        const updatedNotes = detail.notes.filter(
          (_, index) => index !== noteIndex,
        );
        return { ...detail, notes: updatedNotes };
      }
      return detail;
    });

    setDetails(updatedDetails);

    await updateQuickNotesInDB(updatedDetails);
  };

  const updateUserContext = (updatedDetails) => {
    setUser((prevUser) => ({
      ...prevUser,
      quickNotes: updatedDetails,
    }));
  };

  const updateQuickNotesInDB = async (updatedDetails) => {
    try {
      const updateResponse = await fetch(`/api/user/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quickNotes: updatedDetails }),
      });

      if (updateResponse.ok) {
        console.log("Quick notes updated successfully");
        updateUserContext(updatedDetails);
      } else {
        console.error("Failed to update quick notes");
      }
    } catch (error) {
      console.error("Error updating quick notes:", error);
    }
  };

  const handleAddBehavior = async () => {
    if (!newBehaviorText.trim()) return;

    const newBehavior = {
      behavior: newBehaviorText.trim(),
      notes: [],
    };

    const updatedDetails = [...details, newBehavior];
    setDetails(updatedDetails);
    setNewBehaviorText("");
    setIsAddNewBehavior(false);

    await updateQuickNotesInDB(updatedDetails);
  };

  const handleDeleteBehavior = async (behaviorId) => {
    const updatedDetails = details.filter(
      (detail) => detail._id !== behaviorId,
    );
    setDetails(updatedDetails);
    await updateQuickNotesInDB(updatedDetails);
  };

  return (
    <div className="flex flex-col items-center gap-7">
      <div className="flex w-1/2 flex-col gap-3 bg-primary-clear shadow-md">
        <span className="mt-4 flex self-center text-3xl font-bold text-primary-tint">
          Quick Notes
        </span>
        {details.map((detail) => (
          <Accordion
            key={detail._id}
            type="single"
            collapsible
            className="mx-5"
          >
            <AccordionItem
              value={detail.behavior}
              className="mb-2 overflow-hidden rounded-lg transition-all duration-300 ease-in-out data-[state=open]:shadow-md"
            >
              <AccordionTrigger className="px-4 py-3 text-xl font-semibold text-primary transition-colors duration-300 hover:text-primary-tint data-[state=open]:border-b data-[state=open]:border-b-primary/10 data-[state=open]:bg-primary-clear data-[state=open]:text-primary-tint">
                <div className="flex w-full items-center justify-between">
                  <span>{detail.behavior}</span>
                  <div // Changed from button to div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBehavior(detail._id);
                    }}
                    className="cursor-pointer rounded-md bg-secondary px-2 py-1 text-sm text-white-1 transition-colors duration-75 hover:bg-secondary-tint"
                    role="button" // Accessibility role
                    tabIndex="0" // Make it focusable
                  >
                    Delete Behavior
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="bg-white data-[state=open]:animate-accordionSlideDown px-4 py-2">
                {detail.notes.map((note, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b border-b-primary/20 p-3"
                  >
                    {editingNote.behaviorId === detail._id &&
                    editingNote.noteIndex === index ? (
                      <>
                        <input
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="mr-2 flex-grow rounded-lg border border-primary/20 p-2 focus:outline-none"
                        />
                        <div className="flex gap-2">
                          <button
                            className="rounded-md bg-primary px-2 py-2 text-base text-white-1 transition-colors duration-75 hover:bg-primary-tint"
                            onClick={() => handleSaveEdit(detail._id)}
                          >
                            Save
                          </button>
                          <button
                            className="rounded-md bg-secondary px-2 py-2 text-base text-white-1 transition-colors duration-75 hover:bg-secondary-tint"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="text-lg font-semibold text-primary-tint">
                          {note}
                        </span>
                        <div className="flex gap-7">
                          <button
                            className="rounded-md bg-primary px-2 py-2 text-base text-white-1 transition-colors duration-75 hover:bg-primary-tint"
                            onClick={() =>
                              handleEditClick(detail._id, index, note)
                            }
                          >
                            Edit
                          </button>
                          <button
                            className="rounded-md bg-secondary px-2 py-2 text-base text-white-1 transition-colors duration-75 hover:bg-secondary-tint"
                            onClick={() => handleDeleteNote(detail._id, index)}
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                {isAddNewNote ? (
                  <div className="mt-4 flex items-center gap-4">
                    <input
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      placeholder="New quick note"
                      className="mr-2 flex-grow rounded-lg border border-primary/20 p-2 focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        handleAddQuickNote(detail._id);
                        setIsAddNewNote(false);
                      }}
                      className="rounded-md bg-primary px-3 py-2 text-base text-white-1 transition-colors duration-75 hover:bg-primary-tint"
                    >
                      Add Note
                    </button>
                    <button
                      onClick={() => setIsAddNewNote(false)}
                      className="rounded-md bg-secondary px-3 py-2 text-base text-white-1 transition-colors duration-75 hover:bg-secondary-tint"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="mt-4 flex w-full justify-center">
                    <button
                      className="rounded-md bg-primary px-3 py-2 text-base text-white-1 transition-colors duration-75 hover:bg-primary-tint"
                      onClick={() => setIsAddNewNote(true)}
                    >
                      Add New Note
                    </button>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
        {isAddNewBehavior ? (
          <div className="mx-5 mt-4 flex items-center gap-4">
            <input
              value={newBehaviorText}
              onChange={(e) => setNewBehaviorText(e.target.value)}
              placeholder="New behavior"
              className="mr-2 flex-grow rounded-lg border border-primary/20 p-2 focus:outline-none"
            />
            <button
              onClick={handleAddBehavior}
              className="rounded-md bg-primary px-3 py-2 text-base text-white-1 transition-colors duration-75 hover:bg-primary-tint"
            >
              Add Behavior
            </button>
            <button
              onClick={() => setIsAddNewBehavior(false)}
              className="rounded-md bg-secondary px-3 py-2 text-base text-white-1 transition-colors duration-75 hover:bg-secondary-tint"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            className="mx-5 mb-4 rounded-md bg-primary px-3 py-2 text-base text-white-1 transition-colors duration-75 hover:bg-primary-tint"
            onClick={() => setIsAddNewBehavior(true)}
          >
            Add Behavior Quick Notes
          </button>
        )}
      </div>
    </div>
  );
};

export default QuickNotesTable;
