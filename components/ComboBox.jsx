"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const ComboBox = ({ options, value, setValue }) => {
  const [open, setOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("Select Student");

  useEffect(() => {
    const selected = options.find(option => option.id === value);
    if (selected) {
      setSelectedLabel(selected.label);
    } else {
      setSelectedLabel("Select Student");
    }
  }, [value, options]);

  const handleSelect = (option) => {
    setValue(option.id === value ? "" : option.id);
    setOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setValue("");
    setSelectedLabel("Select Student");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-[200px]">
          <button
            className="w-full justify-between bg-white-1 mx-4 my-2 rounded-md px-2 py-1 text-primary-tint font-semibold text-lg"
            aria-expanded={open}
          >
            {selectedLabel}
          </button>
          {value && (
            <button
              onClick={handleClear}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 text-primary-tint"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className='bg-white-1'>
        <Command>
          <CommandInput placeholder="Select Student" className="h-9 bg-white-1" />
          <CommandList>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.id}
                  onSelect={() => handleSelect(option)}
                  className='text-primary-tint'
                >
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ComboBox;