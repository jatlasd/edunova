"use client"

import { useState, useEffect } from "react"

const AddBehavior = () => {
    const [form, setForm] = useState({
        student: "",
        behavior: "",
        description: ""
    })
    const [students, setStudents] = useState([])

    useEffect(() => {
        const fetchStudents = async () => {
           const response = await fetch("/api/student")
            const data = await response.json()
            setStudents(data)
        }
        fetchStudents()
    }, [])

    useEffect(() => {
        if (students.length === 1) {
            console.log(students[0]._id); // Log the only student's ID
            setForm({ ...form, student: students[0]._id });
        }
    }, [students]);

    const addBehavior = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch("/api/behavior", {
                method: "POST",
                body: JSON.stringify({
                    student: form.student,
                    behavior: form.behavior,
                    description: form.description
                
                })
            })
            if (response.ok) {
                alert("Behavior added")
            } else {
                alert("Failed to add behavior")
            }
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <div>
        <form onSubmit={addBehavior}>
            <select
                onChange={(e) => {
                    console.log(e.target.value); // This will log the selected student ID
                    setForm({ ...form, student: e.target.value });
                }}
                className="my-10"
            >
                <option value="">Select a student</option>
                {students.map((student) => (
                    <option key={student._id} value={student._id}>
                        {student.name}
                    </option>
                ))}
            </select>
            <input
            type="text"
            placeholder="behavior"
            onChange={(e) => setForm({ ...form, behavior: e.target.value })}
            className="my-10"
            />
            <input
            type="text"
            placeholder="description"
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="my-10"
            />
            <button type="submit" className="px-2 py-2 bg-blue-200">
            Submit
            </button>
        </form>
    </div>
  )
}

export default AddBehavior