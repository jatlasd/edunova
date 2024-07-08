"use client";

import { useState, useEffect } from "react";
import { useGlobalContext } from "@lib/GlobalProvider";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as React from "react";
import { getCurrentTimeFormatted } from "@lib/utils";

const SessionDetailsContainer = ({ sessionId }) => {
  const router = useRouter();
  const { user } = useGlobalContext();
  const [session, setSession] = useState(null);
  const [allTimestamps, setAllTimestamps] = useState([]);
  const [dataFilter, setDataFilter] = useState("default");
  const [isReadyToSubmit, setIsReadyToSubmit] = useState(false);
  const [finalNotes, setFinalNotes] = useState("");

  useEffect(() => {
    if (finalNotes.trim() === "") {
      setIsReadyToSubmit(false);
    }
  }, [finalNotes]);

  useEffect(() => {
    fetch(`/api/session/${sessionId}`)
      .then((res) => res.json())
      .then((data) => setSession(data.session));
  }, [sessionId]);

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

  const handleStartSession = async () => {
    const time = getCurrentTimeFormatted();
    session.startTime = time
  
    try {
      const response = await fetch(`/api/session/${sessionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(session),
      });
  
      if (response.ok) {
        console.log('response.ok')
        router.push(`/sessions/${sessionId}/active`)
      } else {
        const errorData = await response.json();
        console.error("Failed to update session start time:", errorData);
      }
    } catch (error) {
      console.error("Network or other error:", error);
    }
  };

  const handleSubmit = async () => {
    session.status = "Finalized";
    session.notes = finalNotes;
    session.finishedDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const response = await fetch(`/api/session/${sessionId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(session),
    });
    if (response.ok) {
      router.push(`/sessions/${sessionId}`);
    }
  };

  const handleDelete = async () => {
    const response = await fetch(`/api/session/${sessionId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      router.push("/sessions");
    }
  }

  return (
    <div className="mt-10 flex w-full">
      {session && (
        <div className="flex w-full flex-col items-center">
          {/* Header */}
          <div className="flex flex-col items-center">
            <span className="mb-5 text-5xl font-bold capitalize text-primary-tint">
              {session.name}
            </span>
            <div className="ml-10 flex items-center">
              <span className="text-lg font-bold text-primary-tint">
                Status:&nbsp;
              </span>
              <span className="ml-3 text-lg font-semibold text-primary">
                {session.status}
              </span>
            </div>
            <div className="ml-10 flex items-center">
              <span className="text-lg font-bold text-primary-tint">
                Created Date:&nbsp;
              </span>
              <span className="ml-3 text-lg font-semibold text-primary">
                {session.createdDate}
              </span>
            </div>
            {session.finishedDate && (
              <div className="ml-10 flex items-center">
                <span className="text-lg font-bold text-primary-tint">
                  Finished Date:&nbsp;
                </span>
                <span className="ml-3 text-lg font-semibold text-primary">
                  {session.finishedDate}
                </span>
              </div>
            )}
          </div>

          {/* Session Details */}
          {(session.status === "Pending" || session.status === "Finalized") && (
            <div className="mt-10 flex w-1/2 flex-col items-center">
              <Select onValueChange={(value) => setDataFilter(value)}>
                <SelectTrigger className="w-1/2 bg-primary-clear">
                  <SelectValue
                    placeholder="Select Filter"
                    className="placeholder:font-semibold placeholder:text-primary-tint"
                  />
                </SelectTrigger>
                <SelectContent className="bg-white-1">
                  <SelectGroup>
                    <SelectItem
                      value="default"
                      className="cursor-pointer text-base text-primary focus:bg-primary-clear focus:text-primary-tint"
                    >
                      All
                    </SelectItem>
                    {session.behaviors.map((behavior, index) => (
                      <SelectItem
                        key={index}
                        value={behavior.behavior}
                        className="cursor-pointer text-base text-primary focus:bg-primary-clear focus:text-primary-tint"
                      >
                        {behavior.behavior}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {dataFilter === "default" ? (
                <div className="mt-5 grid w-full grid-cols-4 gap-5 rounded-md bg-primary-clear p-10 pb-10 shadow-md">
                  <span className="col-span-1 w-1/2 border-b-2 border-primary-clear text-lg font-bold text-primary-tint">
                    Time
                  </span>
                  <span className="col-span-1 w-1/2 border-b-2 border-primary-clear text-lg font-bold text-primary-tint">
                    Behavior
                  </span>
                  <span className="col-span-2 w-1/2 border-b-2 border-primary-clear text-lg font-bold text-primary-tint">
                    Notes
                  </span>
                  {allTimestamps.map((timestamp, index) => (
                    <React.Fragment key={index}>
                      <span className="col-span-1">{timestamp.time}</span>
                      <span className="col-span-1">{timestamp.behavior}</span>
                      <span className="col-span-2">{timestamp.notes}</span>
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                <div className="ml-16 mt-5 grid w-full grid-cols-3 gap-5 rounded-md bg-primary-clear p-10 pb-10 shadow-md">
                  <span className="col-span-1 w-1/2 text-lg font-bold text-primary-tint border-b-2 border-primary-clear">
                    Time
                  </span>
                  <span className="col-span-2 w-1/2 text-lg font-bold text-primary-tint border-b-2 border-primary-clear">
                    Notes
                  </span>
                  {allTimestamps
                    .filter((timestamp) => timestamp.behavior === dataFilter)
                    .map((timestamp, index) => (
                      <React.Fragment key={index}>
                        <span className="col-span-1">{timestamp.time}</span>
                        <span className="col-span-2">{timestamp.notes}</span>
                      </React.Fragment>
                    ))}
                </div>
              )}
            </div>
          )}
          {session.notes && (
            <div className="ml-10 mt-10 flex w-1/2 flex-col rounded-md bg-white-1 p-5 shadow-md">
              <span className="w-1/2 border-b-2 border-b-primary/20 pl-2 text-lg font-bold text-primary-tint">
                Notes
              </span>
              <span className="ml-3 mt-3 text-lg font-semibold text-primary">
                {session.notes}
              </span>
            </div>
          )}

          {/* Buttons */}
          <div className="mt-8 flex w-full flex-col items-center gap-2">
            <div className="flex w-1/2 items-center justify-center">
              {session.status === "Initialized" && (
                <button
                  className="rounded-md bg-primary px-4 py-2 font-semibold text-white-1 shadow-md hover:bg-primary-tint"
                  onClick={handleStartSession}
                >
                  Start Session
                </button>
              )}
              {session.status === "Pending" && (
                <div className="flex w-full flex-col items-center gap-5">
                  <textarea
                    className="h-20 w-full rounded-md border-2 border-primary-clear bg-white-1 p-2 shadow-md -outline-offset-2 focus:outline-primary-clear focus:ring-0"
                    onChange={(e) => {
                      setFinalNotes(e.target.value);
                      setIsReadyToSubmit(true);
                    }}
                    placeholder="Enter Notes..."
                  />
                  <button
                    className={`rounded-md border-2 px-5 py-3 text-lg font-bold ${!isReadyToSubmit ? "cursor-not-allowed border-primary-tint/50 bg-white-3 text-primary/30" : "border-none bg-primary text-white-1 shadow-md hover:bg-primary-tint"}`}
                    onClick={handleSubmit}
                  >
                    Save and Submit
                  </button>
                </div>
              )}
            </div>
            <button className="rounded-md bg-secondary px-4 py-2 font-semibold text-white-1 shadow-md hover:bg-secondary-tint" onClick={handleDelete}>
              Delete Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionDetailsContainer;