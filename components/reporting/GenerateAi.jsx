"use client";

import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CircleHelp } from "lucide-react";
const PromptDetailCheckbox = ({ name, label, onChange, tooltipText }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`flex items-center gap-x-3 rounded-md p-2 transition-colors duration-200 ${isOpen ? "borderprimary-clear/10 border bg-primary-clear" : ""}`}
    >
      <input
        type="checkbox"
        name={name}
        onChange={(e) => onChange(name, e.target.checked)}
      />
      <p className="font-semibold text-primary">{label}</p>
      {tooltipText && (
        <Popover onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <CircleHelp className="h-4 w-4 cursor-pointer text-primary" />
          </PopoverTrigger>
          <PopoverContent
            className={`max-w-[200px] border-primary-clear/10 bg-white-1 text-primary-tint ${isOpen ? "bg-primary-light" : ""}`}
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
  const [aiInsights, setAiInsights] = useState([]);
  const [loading, setLoading] = useState(false);

  const promptOptions = [
    {
      name: "patternsAndFrequency",
      label: "Patterns and Frequency",
      tooltipText:
        "Identifies recurring behaviors, calculates their frequencies, and highlights the top 3.",
    },
    {
      name: "temporalTrendAnalysis",
      label: "Temporal Trend Analysis",
      tooltipText: "Analyzes behavior changes over time, noting trends.",
    },
    {
      name: "antecedentAnalysis",
      label: "Antecedent Analysis",
      tooltipText:
        "Identifies potential behavior triggers and ranks their impact.",
    },
    {
      name: "areasOfConcern",
      label: "Areas of Concern",
      tooltipText:
        "Highlights urgent behaviors, ranked by frequency and learning impact.",
    },
    {
      name: "function",
      label: "Function",
      tooltipText:
        "Hypothesizes functions for the most frequent or concerning behaviors.",
    },
    {
      name: "intervention",
      label: "Intervention",
      tooltipText:
        "Suggests 3-5 strategies to address pressing behavioral concerns.",
    },
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

      combinedTimestamps.sort(
        (a, b) => timeToMinutes(a.time) - timeToMinutes(b.time),
      );

      setAllTimestamps(combinedTimestamps);
    }
  }, [session]);

  const handlePromptDetailChange = (name, checked) => {
    setPromptDetails((prev) => {
      const newDetails = { ...prev, [name]: checked };
      console.log("Updated prompt details:", newDetails);
      return newDetails;
    });
  };

  const handleClick = async () => {
    setLoading(true);
    try {
      const selectedPrompts = promptOptions
        .filter((option) => promptDetails[option.name])
        .map((option) => option.name);

      const response = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          behaviorData: allTimestamps,
          session: session,
          selectedPrompts: selectedPrompts,
        }),
      });

      const data = await response.json();
      console.log("API response:", data);

      if (data.error) {
        console.error("Error from API:", data.error);
        setAiInsights([]);
      } else if (data && typeof data === "object") {
        const insights = Object.entries(data).map(([key, value]) => ({
          key,
          title: key
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
          content: value,
        }));
        setAiInsights(insights);
        setIsInsightsGenerated(true);
      } else {
        console.error("Unexpected API response format", data);
        setAiInsights([]);
      }
    } catch (error) {
      console.error("Error calling API:", error);
      setAiInsights([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-20 mt-2 flex w-full flex-col items-center rounded-md bg-white-2 shadow-md">
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
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate AI Insights"}
        </button>
        {aiInsights.length > 0 && (
          <div className="mx-auto mt-5 flex w-full max-w-3xl flex-col items-center rounded-md bg-white-1 p-6 shadow-md">
            <h2 className="mb-4 w-1/3 border-b border-b-primary-clear/30 text-center text-2xl font-bold text-primary">
              AI Insights
            </h2>
            <Accordion type="single" collapsible className="w-full space-y-2">
              {aiInsights.map((insight) => (
                <AccordionItem key={insight.key} value={insight.key}>
                  <AccordionTrigger className="text-lg font-semibold text-primary">
                    {insight.content.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="ml-2">{insight.content.response}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateAi;
