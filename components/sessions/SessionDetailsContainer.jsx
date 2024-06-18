"use client";

import { useState, useEffect } from "react";
import { useGlobalContext } from "@lib/GlobalProvider";
import { useRouter } from "next/navigation";

const SessionDetailsContainer = ({ sessionId }) => {
  const router = useRouter();
  const { user } = useGlobalContext();
  const [session, setSession] = useState(null);
  useEffect(() => {
    fetch(`/api/session/${sessionId}`)
      .then((res) => res.json())
      .then((data) => setSession(data));
  }, [sessionId]);

  return (
    <div className="mt-10 flex w-full">
      {session && (
        <div className="flex w-full flex-col">
          {/* Header */}
          <div className="flex flex-col items-center">
            <span className="text-5xl font-bold capitalize text-primary-tint">
              {session.session.name}
            </span>
            <span className="mt-10 text-3xl font-semibold text-primary">
              Session Details
            </span>
          </div>

          {/* Session Details */}
          <div className="mt-5 flex w-full justify-center">
            <div className="flex w-1/3 flex-col rounded-md bg-primary-clear shadow-md">
              <div className="flex items-center gap-3 p-5">
                <span className="text-2xl font-semibold text-primary-tint">
                  Student:&nbsp;
                </span>
                <span className="text-lg font-medium capitalize text-primary">
                  {session.student.name}
                </span>
              </div>

              <div className="flex items-center gap-3 p-5">
                <span className="text-2xl font-semibold text-primary-tint">
                  Date Created:&nbsp;
                </span>
                <span className="text-lg font-medium capitalize text-primary">
                  {session.session.createdDate}
                </span>
              </div>

              {(user && user.role === "admin") ||
                (user.role === "super" && (
                  <div className="flex items-center gap-3 p-5">
                    <span className="text-2xl font-semibold text-primary-tint">
                      Staff:&nbsp;
                    </span>
                    <span className="text-lg font-medium capitalize text-primary">
                      {session.staff.name}
                    </span>
                  </div>
                ))}

              <div className="flex items-center gap-3 p-5">
                <span className="text-2xl font-semibold text-primary-tint">
                  Status:&nbsp;
                </span>
                <span className="text-lg font-medium capitalize text-primary">
                  {session.session.status}
                </span>
              </div>

              <div className="flex flex-col p-5">
                <span className="text-2xl font-semibold text-primary-tint">
                  Behaviors:&nbsp;
                </span>
                {session.session.behaviors.map((behavior, index) => (
                  <div
                    className="flex w-2/3 items-center justify-between gap-3 p-5"
                    key={index}
                  >
                    <div>
                      <span className="text-lg font-medium capitalize text-primary-tint">
                        Behavior:&nbsp;
                      </span>
                      <span className="text-lg font-medium capitalize text-primary">
                        {behavior.behavior}
                      </span>
                    </div>
                    <div>
                      <span className="text-lg font-medium capitalize text-primary-tint">
                        Count:&nbsp;
                      </span>
                      <span className="text-lg font-medium text-primary">
                        {behavior.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {session.session.notes && (
                <div className="flex flex-col p-5">
                  <span className="text-2xl font-semibold text-primary-tint">
                    Notes:&nbsp;
                  </span>
                  <span className="text-lg font-medium text-primary">
                    {session.session.notes}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-col items-center gap-8">
            <div className="flex items-center gap-10">
              {session.session.status === "Pending" && (
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
