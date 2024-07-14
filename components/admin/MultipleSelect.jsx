"use client";

import { useState, useEffect, useRef } from 'react';
import { Checkbox } from "@components/ui/checkbox";
import { ChevronDown, ChevronUp } from "lucide-react";

const MultipleSelect = ({ options, selectedValues, onChange, placeholder = "Select Options" }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (optionId) => {
    const newSelectedValues = selectedValues.includes(optionId)
      ? selectedValues.filter((id) => id !== optionId)
      : [...selectedValues, optionId];

    onChange(newSelectedValues);
  };

  const getDropdownDisplayText = () => {
    if (selectedValues.length === 0) return placeholder;
    if (selectedValues.length === 1) {
      const selectedOption = options.find(
        (option) => option._id === selectedValues[0]
      );
      return selectedOption ? selectedOption.name : placeholder;
    }
    return `${selectedValues.length} Selected`;
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-md border border-primary/30 bg-white-1 px-4 py-2 text-left text-sm font-medium shadow-sm"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {getDropdownDisplayText()}
        {isDropdownOpen ? (
          <ChevronUp className="h-5 w-5" />
        ) : (
          <ChevronDown className="h-5 w-5" />
        )}
      </button>
      {isDropdownOpen && (
        <div className="bg-white absolute right-0 mt-2 w-full origin-top-right rounded-md shadow-lg focus:outline-none">
          <div className="py-1">
            {options.map((option) => (
              <div
                key={option.value}
                className="flex cursor-pointer items-center bg-white-1 px-4 py-2 text-sm"
                onClick={() => handleSelect(option.value)}
              >
                <Checkbox
                  checked={selectedValues.includes(option.value)}
                  className="mr-2"
                />
                <span>{option.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultipleSelect;