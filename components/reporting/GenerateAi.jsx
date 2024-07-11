"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { CircleHelp } from "lucide-react";
import { useState, useEffect } from "react";

const PromptDetailCheckbox = ({ name, label, onChange, tooltipText }) => (
  <div className="flex items-center gap-x-3">
    <input
      type="checkbox"
      name={name}
      onChange={(e) => onChange(name, e.target.checked)}
    />
    <p className="font-semibold text-primary">{label}</p>
    {tooltipText && (
      <Popover>
        <PopoverTrigger asChild>
          <CircleHelp className="w-4 h-4 text-primary  cursor-pointer" />
        </PopoverTrigger>
        <PopoverContent className='bg-white-1 text-primary-tint w-fit' side="right" sideOffset={10}>
          {tooltipText}
          
        </PopoverContent>
      </Popover>
    )}
  </div>
);

const GenerateAi = ({ session }) => {
  const [allTimestamps, setAllTimestamps] = useState([]);
  const [promptDetails, setPromptDetails] = useState({
    patternsAndFrequency: false,
    temporalTrendAnalysis: false,
    antecedentAnalysis: false,
    areasOfConcern: false,
    function: false,
    intervention: false,
    environmentalConsiderations: false,
  });

  const promptOptions = [
    { name: "patternsAndFrequency", label: "Patterns and Frequency" },
    { name: "temporalTrendAnalysis", label: "Temporal Trend Analysis" },
    { name: "antecedentAnalysis", label: "Antecedent Analysis" },
    { name: "areasOfConcern", label: "Areas of Concern" },
    { name: "function", label: "Function" },
    { name: "intervention", label: "Intervention", tooltipText: "Testing!!!" },
    { name: "environmentalConsiderations", label: "Environmental Considerations" },
  ];

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

  const handlePromptDetailChange = (name, checked) => {
    setPromptDetails((prev) => ({ ...prev, [name]: checked }));
  };

  const handleClick = async () => {
    const response = await fetch("/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        behaviorData: allTimestamps,
        session: session,
        details: promptDetails,
      }),
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <div className="mb-20 mt-2 flex w-1/2 flex-col items-center rounded-md bg-white-2 shadow-md">
      <h1 className="mt-5 w-2/5 border-b border-b-primary-clear/30 text-center text-2xl font-bold text-primary">
        AI Generated Insight
      </h1>
      <div className="mt-3 flex w-1/2 flex-col items-start gap-5 p-5">
        {promptOptions.map((option) => (
          <PromptDetailCheckbox
            key={option.name}
            name={option.name}
            label={option.label}
            onChange={handlePromptDetailChange}
            tooltipText={option.tooltipText}
          />
        ))}
        <button
          className="btn-primary mt-3 flex self-center"
          onClick={handleClick}
        >
          Generate AI Insights
        </button>
      </div>
    </div>
  );
};

export default GenerateAi;