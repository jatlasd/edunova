"use client"

import { Textarea } from "@components/ui/textarea"
import { useState, useEffect } from "react"

const Notebook = () => {
    const [notes, setNotes] = useState([])
    const noteId = "6693293219166684dedab6e3"
    const [currentText, setCurrentText] = useState("")

    useEffect(() => {
        const fetchNotes = async () => {
            const response = await fetch("/api/note")
            if (response.ok) {
                const data = await response.json()
                setNotes(data)
                if(data.length > 0) {
                    setCurrentText(data[0].text)
                
                }
            }
        }
        fetchNotes()
    }, [])
    const handleTextChange = (e) => {
        setCurrentText(e.target.value)
    }

    const handleSubmit = async () => {
        const response = await fetch(`/api/note/${noteId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: currentText }),
        })
        if (response.ok) {
            console.log("Note updated")
        }
    }

  return (
    <div className="flex flex-col w-full items-center">
        <div className="flex flex-col items-center w-2/3">
            <Textarea value={currentText} onChange={handleTextChange} className='min-h-[250px] w-4/5 p-5'/>
            <button className="btn-primary mt-5 w-1/3" onClick={handleSubmit}>Submit</button>
        </div>
    </div>
  )
}

export default Notebook