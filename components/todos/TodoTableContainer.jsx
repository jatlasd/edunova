"use client";

import { useState, useEffect } from "react";
import TodoTable from "./TodoTable";

const TodoTableContainer = () => {
  const [allData, setAllData] = useState([]);
  const [todos, setTodos] = useState([]);
  const [bugs, setBugs] = useState([]);


  useEffect(() => {
    const fetchAllTodos = async () => {
      try {
        const response = await fetch("/api/todo");
        const data = await response.json();
        const normalizedData = data.map((item) => ({
          ...item,
          status: item.status === "completed" ? "completed" : "open",
        }));
        setAllData(normalizedData);
      } catch (error) {
        console.error("Failed to fetch todos:", error);
      }
    };

    fetchAllTodos();
  }, []);

  useEffect(() => {
    const sortTodos = () => {
      const bugs = allData.filter((todo) => todo.type === "Bug");
      const todos = allData.filter((todo) => todo.type !== "Bug");
      setBugs(bugs);
      setTodos(todos);
    };

    if (allData.length > 0) {
      sortTodos();
    }
  }, [allData]);

  const handleItemUpdate = (updatedItem) => {
    setAllData((prevData) =>
      prevData.map((item) =>
        item._id === updatedItem._id ? updatedItem : item,
      ),
    );
  };

  const handleItemDelete = (deletedItemId) => {
    setAllData((prevData) =>
      prevData.filter((item) => item._id !== deletedItemId),
    );
  };



  return (
    <div className="mb-20 flex w-3/4 flex-col gap-5">

      <TodoTable
        items={todos}
        type="Todos"
        onItemUpdate={handleItemUpdate}
        onItemDelete={handleItemDelete}
      />

      <TodoTable
        items={bugs}
        type="Bugs"
        onItemUpdate={handleItemUpdate}
        onItemDelete={handleItemDelete}
      />
    </div>
  );
};

export default TodoTableContainer;
