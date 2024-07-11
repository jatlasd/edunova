import { useState, useMemo, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TodoTable = ({ items, type, onItemUpdate, onItemDelete }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showCompletedTodos, setShowCompletedTodos] = useState(true);
  const [showCompletedBugs, setShowCompletedBugs] = useState(true);
  const isBugs = type === "Bugs";

  let showCompleted = isBugs ? showCompletedBugs : showCompletedTodos;

  const filteredAndSortedItems = useMemo(() => {
    let filteredItems = showCompleted
      ? items
      : items.filter((item) => item.status !== "completed");
    return filteredItems.sort((a, b) => {
      if (a.status === "completed" && b.status !== "completed") return 1;
      if (a.status !== "completed" && b.status === "completed") return -1;
      return 0;
    });
  }, [items, showCompletedTodos, showCompletedBugs]);

  const handleEdit = (item) => {
    setEditingId(item._id);
    setEditForm(item);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleInputChange = (e, field) => {
    setEditForm({ ...editForm, [field]: e.target.value });
  };

  const handleSelectChange = (value, field) => {
    setEditForm((prevForm) => ({ ...prevForm, [field]: value }));
  };

  const handleShowCompletedTodos = () => {
    setShowCompletedTodos(!showCompletedTodos);
  };

  const handleShowCompletedBugs = () => {
    setShowCompletedBugs(!showCompletedBugs);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/todo/${editingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        throw new Error("Failed to update item");
      }

      const updatedItem = await response.json();
      onItemUpdate(updatedItem);
      setEditingId(null);
      setEditForm({});
    } catch (error) {
      console.error("Failed to update item:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const response = await fetch(`/api/todo/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete item");
        }

        onItemDelete(id);
      } catch (error) {
        console.error("Failed to delete item:", error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full p-4 rounded-md shadow-lg bg-white-5">
      <button
        className={`w-fit cursor-pointer rounded-md border-2 border-primary px-2 py-1 text-sm font-semibold transition-all duration-150 mr-auto mt-3 ${showCompleted ? "bg-primary text-white-1 hover:bg-white-1 hover:text-primary" : "bg-white-1 text-primary hover:bg-primary hover:text-white-1"}`}
        onClick={isBugs ? handleShowCompletedBugs : handleShowCompletedTodos}
      >
        {showCompleted ? "Hide Completed" : "Show Completed"}
      </button>
      <h1 className="mb-4 text-2xl font-semibold text-primary">{type}</h1>
      <Accordion type="single" collapsible className="w-full">
        {filteredAndSortedItems.map((item) => (
          <AccordionItem
            key={item._id}
            value={item._id}
            className={item.status === "completed" ? "bg-secondary/20" : ""}
          >
            <AccordionTrigger className="px-3 font-semibold text-primary-tint">
              {item.item}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <div>
                  <p className="font-semibold text-primary-tint">
                    Description:&nbsp;
                  </p>
                  {editingId === item._id ? (
                    <Input
                      value={editForm.description}
                      onChange={(e) => handleInputChange(e, "description")}
                    />
                  ) : (
                    <p>{item.description}</p>
                  )}
                </div>
                {isBugs && (
                  <div>
                    <p className="font-semibold text-primary-tint">
                      Path:&nbsp;
                    </p>
                    {editingId === item._id ? (
                      <Input
                        value={editForm.path}
                        onChange={(e) => handleInputChange(e, "path")}
                      />
                    ) : (
                      <p>{item.path}</p>
                    )}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-primary-tint">
                    Notes:&nbsp;
                  </p>
                  {editingId === item._id ? (
                    <Input
                      value={editForm.notes}
                      onChange={(e) => handleInputChange(e, "notes")}
                    />
                  ) : (
                    <p>{item.notes}</p>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-primary-tint">
                    Status:&nbsp;
                  </p>
                  {editingId === item._id ? (
                    <Select
                      value={editForm.status}
                      onValueChange={(value) =>
                        handleSelectChange(value, "status")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-white-1">
                        <SelectItem value="open" className="cursor-pointer">
                          Open
                        </SelectItem>
                        <SelectItem
                          value="completed"
                          className="cursor-pointer"
                        >
                          Completed
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className="capitalize">{item.status}</span>
                  )}
                </div>
                <div className="flex mt-4 space-x-2">
                  {editingId === item._id ? (
                    <div className="flex items-center w-full ml-5">
                      <button onClick={handleSave} className="btn-primary">
                        Save
                      </button>
                      <button
                        className="ml-2 btn-secondary"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-2 py-1 ml-auto mr-10 text-base font-semibold transition-all duration-75 border rounded-md border-secondary-tint text-secondary-tint hover:border-transparent hover:bg-secondary hover:text-white-1"
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        className="mr-2 btn-primary"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>
                    </>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default TodoTable;