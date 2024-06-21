"use client";

import { useState, useEffect } from "react";
import { useGlobalContext } from "@lib/GlobalProvider";
import { useRouter } from "next/navigation";

const SessionDetailsContainer = ({ sessionId }) => {
  const router = useRouter();
  const { user } = useGlobalContext();
  const [session, setSession] = useState(null);
  const [allTimestamps, setAllTimestamps] = useState([]);
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
            {session.notes && (
              <div className="ml-10 flex items-center">
                <span className="text-lg font-bold text-primary-tint">
                  Notes:&nbsp;
                </span>
                <span className="ml-3 text-lg font-semibold text-primary">
                  {session.notes}
                </span>
              </div>
            )}
            <button onClick={() => console.log(allTimestamps)}>click</button>
          </div>

          {/* Session Details */}

          {/* {session.status === "Pending" && (
            <div className="">
              {session.behaviors.map((behavior, index) => (
                <div className="flex flex-col" key={index}>
                  <span className="text-lg font-bold capitalize text-primary-tint">
                    {behavior.behavior}
                  </span>
                  <div className="grid">
                    <div>
                      <span>Time</span>
                      <span>Notes</span>
                    </div>
                    {behavior.timestamps.map((timestamp, index) => (
                      <div className="flex gap-5" key={index}>
                        <span className="text-lg font-semibold text-primary">
                          {timestamp.time}
                        </span>
                        <span>{timestamp.notes}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )} */}

          {/* Buttons */}

          <div className="mt-8 flex flex-col items-center gap-8">
            <div className="flex items-center gap-10">
              {session.status === "Initialized" && (
                <button
                  className="rounded-md bg-primary px-4 py-2 font-semibold text-white-1 shadow-md hover:bg-primary-tint"
                  onClick={() => router.push(`/sessions/${sessionId}/active`)}
                >
                  Start Session
                </button>
              )}
              <button
                className="rounded-md bg-primary px-4 py-2 font-semibold text-white-1 shadow-md hover:bg-primary-tint"
                onClick={() => router.push(`/sessions/${sessionId}/edit`)}
              >
                Edit Session
              </button>
            </div>
            <div className="flex justify-center gap-20">
              <button className="rounded-md bg-secondary px-4 py-2 font-semibold text-white-1 shadow-md hover:bg-secondary-tint">
                Delete Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionDetailsContainer;
