"use client";

import { useGlobalContext } from "@/lib/GlobalProvider";
import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Trash2Icon, X } from "lucide-react";

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
  const [confirmingDelete, setConfirmingDelete] = useState({
    type: null,
    behaviorId: null,
    noteIndex: null,
  });
  const [allBehaviors, setAllBehaviors] = useState([]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const response = await fetch(`/api/user/${user.id}`);
      const data = await response.json();
      setDetails(data.quickNotes);
    };
    const fetchAllBehaviors = async () => {
      const response = await fetch("/api/behavior");
      const data = await response.json();
      setAllBehaviors(data);
    };
    if (user && user.id) {
      fetchUserDetails();
      fetchAllBehaviors();
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
    setConfirmingDelete({ type: null, behaviorId: null, noteIndex: null });
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
    setConfirmingDelete({ type: null, behaviorId: null, noteIndex: null });
  };

  return (
    <div className="flex w-full flex-col items-center gap-7">
      <div className="flex w-1/2 flex-col gap-3 bg-primary-clear shadow-md">
        <span className="mt-4 flex self-center text-3xl font-bold text-primary-tint">
          Quick Notes
        </span>
        <Accordion type="single" collapsible className="mx-5">
          {details.map((detail) => (
            <AccordionItem
              key={detail._id}
              value={detail._id}
              className="mb-2 overflow-hidden rounded-lg transition-all duration-300 ease-in-out data-[state=open]:shadow-md"
            >
              <AccordionTrigger className="group px-4 py-3 text-xl font-semibold text-primary transition-colors duration-300 hover:text-primary-tint data-[state=open]:border-b data-[state=open]:border-b-primary/10 data-[state=open]:bg-primary-clear data-[state=open]:text-primary-tint">
                <div className="flex w-full items-center justify-between">
                  <span>{detail.behavior}</span>
                  {confirmingDelete.type === "behavior" &&
                  confirmingDelete.behaviorId === detail._id ? (
                    <div className="flex items-center">
                      <button
                        className="btn-secondary mr-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteBehavior(detail._id);
                        }}
                      >
                        Confirm
                      </button>
                      <X
                        className="cursor-pointer text-gray-500 hover:text-gray-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmingDelete({
                            type: null,
                            behaviorId: null,
                            noteIndex: null,
                          });
                        }}
                      />
                    </div>
                  ) : (
                    <Trash2Icon
                      className="mr-10 hidden cursor-pointer text-secondary group-data-[state=open]:block"
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmingDelete({
                          type: "behavior",
                          behaviorId: detail._id,
                          noteIndex: null,
                        });
                      }}
                    />
                  )}
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
                            className="btn-primary"
                            onClick={() => handleSaveEdit(detail._id)}
                          >
                            Save
                          </button>
                          <button
                            className="btn-secondary"
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
                            className="btn-primary"
                            onClick={() =>
                              handleEditClick(detail._id, index, note)
                            }
                          >
                            Edit
                          </button>
                          {confirmingDelete.type === "note" &&
                          confirmingDelete.behaviorId === detail._id &&
                          confirmingDelete.noteIndex === index ? (
                            <div className="flex items-center">
                              <button
                                className="btn-secondary mr-2"
                                onClick={() =>
                                  handleDeleteNote(detail._id, index)
                                }
                              >
                                Confirm
                              </button>
                              <X
                                className="cursor-pointer text-gray-500 hover:text-gray-700"
                                onClick={() =>
                                  setConfirmingDelete({
                                    type: null,
                                    behaviorId: null,
                                    noteIndex: null,
                                  })
                                }
                              />
                            </div>
                          ) : (
                            <button
                              className="btn-secondary"
                              onClick={() =>
                                setConfirmingDelete({
                                  type: "note",
                                  behaviorId: detail._id,
                                  noteIndex: index,
                                })
                              }
                            >
                              Delete
                            </button>
                          )}
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
                      className="btn-primary"
                    >
                      Add Note
                    </button>
                    <button
                      onClick={() => setIsAddNewNote(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="mt-4 flex w-full justify-center">
                    <button
                      className="btn-primary"
                      onClick={() => setIsAddNewNote(true)}
                    >
                      Add New Note
                    </button>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        {isAddNewBehavior ? (
          <div className="mx-5 mb-5 mt-4 flex items-center gap-4">
            <Select onValueChange={(value) => setNewBehaviorText(value)}>
              <SelectTrigger className='bg-white-1'>
                <SelectValue placeholder="Select a behavior" />
              </SelectTrigger>
              <SelectContent className="bg-white-1">
                {allBehaviors.map((behavior, index) => (
                  <SelectItem key={index} value={behavior.behavior}>
                    {behavior.behavior}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button onClick={handleAddBehavior} className="btn-primary">
              Add
            </button>
            <button
              onClick={() => setIsAddNewBehavior(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            className="btn-primary mx-5 mb-4"
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
