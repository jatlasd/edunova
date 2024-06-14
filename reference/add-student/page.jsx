"use client";

import { useState } from "react";
import { useGlobalContext } from "@/lib/GlobalProvider";

const AddStudent = () => {
  const { user } = useGlobalContext();
  const [form, setForm] = useState({
    studentName: "",
    studentAge: "",
    studentGrade: "",
  });
  const addStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/student", {
        method: "POST",

        body: JSON.stringify({
          name: form.studentName,
          age: form.studentAge,
          grade: form.studentGrade,
          user: user.id
        }),
      });
      if (response.ok) {
        alert("Student added");
      } else {
        alert("Failed to add student");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form onSubmit={addStudent}>
      <input
        type="text"
        placeholder="name"
        onChange={(e) => setForm({ ...form, studentName: e.target.value })}
        className="my-10"
      />
      <input
        type="text"
        placeholder="age"
        onChange={(e) => setForm({ ...form, studentAge: e.target.value })}
        className="my-10"
      />
      <input
        type="text"
        placeholder="grade"
        onChange={(e) => setForm({ ...form, studentGrade: e.target.value })}
        className="my-10"
      />
      <button type="submit" className="bg-blue-200 px-2 py-2">
        Submit
      </button>
    </form>
  );
};

export default AddStudent;
