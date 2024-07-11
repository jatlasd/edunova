"use client"

import { useState, useEffect } from "react";

const GenerateAi = ({session}) => {
    const [allTimestamps, setAllTimestamps] = useState([]);

    useEffect(() => {
        if (session) {
          const combinedTimestamps = [];
          session.behaviors.forEach((behavior) => {
            behavior.timestamps.forEach((timestamp) => {
              combinedTimestamps.push({
                behavior: behavior.behavior,
                time: timestamp.time,
                notes: timestamp.notes,
              });
            });
          });
    
          const timeToMinutes = (time) => {
            const [timePart, period] = time.split(" ");
            let [hours, minutes] = timePart.split(":").map(Number);
            if (hours === 12) hours = 0;
            if (period.toLowerCase() === "pm") hours += 12;
            return hours * 60 + minutes;
          };
    
          combinedTimestamps.sort((a, b) => {
            return timeToMinutes(a.time) - timeToMinutes(b.time);
          });
    
          setAllTimestamps(combinedTimestamps);
        }
      }, [session]);

      const handleClick = async () => {
        const response = await fetch("/api/openai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            behaviorData: allTimestamps,
            session: session
          }),
        });
        const data = await response.json();
        console.log(data);
      
      }

      const handleTest = () => {
        console.log(session.notes)
      }

  return (
    <div>
        <button className="btn-primary my-5" onClick={handleClick}>click</button>
    </div>
  )
}

export default GenerateAi