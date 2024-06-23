"use client";

import { useState } from "react";

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

  const handleSelect = (option) => {
    const newValue = option.id === value.id ? { id: "", label: "" } : option;
    setValue(newValue.id);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="w-[200px] justify-between bg-white-1 mx-4 my-2 rounded-md px-2 py-1 text-primary-tint font-semibold text-lg"
          aria-expanded={open}
        >
          {value && value.label ? value.label : "Select Student"}
        </button>
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
                  {option.value}
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
