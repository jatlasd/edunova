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
        setAllData(data);
      } catch (error) {
        console.error("Failed to fetch todos:", error);
      }
    };

    const sortTodos = (allData) => {
      const bugs = allData.filter((todo) => todo.type === "Bug");
      console.log("bugs:", bugs);
      setBugs(bugs);
      const todos = allData.filter((todo) => todo.type !== "Bug");
      setTodos(todos);
    };

    fetchAllTodos();
    if (allData.length > 0) {
      sortTodos(allData);
    }
    console.log("running");
  }, [allData.length]);

  return (
    <div className="flex w-3/4 gap-10">
      <TodoTable items={todos} type="Todos"/>
      <TodoTable items={bugs} type="Bugs"/>
    </div>
  );
};

export default TodoTableContainer;
