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

const SessionDetailsContainer = ({ sessionId }) => {
  const router = useRouter();
  const { user } = useGlobalContext();
  const [session, setSession] = useState(null);
  const [allTimestamps, setAllTimestamps] = useState([]);
  const [dataFilter, setDataFilter] = useState("default");
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
            {/* <button onClick={() => console.log(allTimestamps)}>click</button> */}
          </div>

          {/* Session Details */}

          {session.status === "Pending" && (
            <div className="mt-10 flex w-1/2 flex-col items-center">
              {/* <div className="flex w-1/3 flex-col items-center rounded-md bg-primary-clear shadow-md mb-10"> */}
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
                  <span className="col-span-1 text-lg font-bold text-primary-tint">
                    Time
                  </span>
                  <span className="col-span-2 text-lg font-bold text-primary-tint">
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
