"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { CircleHelp } from "lucide-react";
import { useState, useEffect } from "react";

const PromptDetailCheckbox = ({ name, label, onChange, tooltipText }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`flex items-center gap-x-3 p-2 rounded-md transition-colors duration-200 ${isOpen ? 'bg-primary-clear border borderprimary-clear/10' : ''}`}>
      <input
        type="checkbox"
        name={name}
        onChange={(e) => onChange(name, e.target.checked)}
      />
      <p className="font-semibold text-primary">{label}</p>
      {tooltipText && (
        <Popover onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <CircleHelp className="w-4 h-4 text-primary cursor-pointer" />
          </PopoverTrigger>
          <PopoverContent 
            className={`bg-white-1 text-primary-tint max-w-[200px] border-primary-clear/10 ${isOpen ? 'bg-primary-light' : ''}`} 
            side="right" 
            sideOffset={10}
          >
            {tooltipText}
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

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
    { name: "patternsAndFrequency", label: "Patterns and Frequency", tooltipText: "Identifies recurring behaviors, calculates their frequencies, and highlights the top 3." },
    { name: "temporalTrendAnalysis", label: "Temporal Trend Analysis", tooltipText: "Analyzes behavior changes over time, noting trends and anomalies." },
    { name: "antecedentAnalysis", label: "Antecedent Analysis", tooltipText: "Identifies potential behavior triggers and ranks their impact." },
    { name: "areasOfConcern", label: "Areas of Concern", tooltipText: "Highlights urgent behaviors, ranked by frequency and learning impact." },
    { name: "function", label: "Function", tooltipText: "Hypothesizes functions for the most frequent or concerning behaviors." },
    { name: "intervention", label: "Intervention", tooltipText: "Suggests 3-5 strategies to address pressing behavioral concerns." },
    { name: "environmentalConsiderations", label: "Environmental Considerations", tooltipText: "Identifies environmental factors affecting behavior and suggests changes." }
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