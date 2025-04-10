"use client";

import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ProblemSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
}

interface Problem {
  id: string;
  title: string;
}

export const ProblemSelect = ({
  value,
  onChange,
  disabled
}: ProblemSelectProps) => {
  const [open, setOpen] = useState(false);
  const [problems, setProblems] = useState<Problem[]>([]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch('/api/problems');
        const data = await response.json();
        setProblems(data);
      } catch (error) {
        console.error("Failed to fetch problems:", error);
      }
    };

    fetchProblems();
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {value.length > 0
            ? `${value.length} bài tập được chọn`
            : "Chọn bài tập..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Tìm kiếm bài tập..." />
          <CommandEmpty>Không tìm thấy bài tập.</CommandEmpty>
          <CommandGroup>
            {problems.map((problem) => (
              <CommandItem
                key={problem.id}
                onSelect={() => {
                  const newValue = value.includes(problem.id)
                    ? value.filter(id => id !== problem.id)
                    : [...value, problem.id];
                  onChange(newValue);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value.includes(problem.id) ? "opacity-100" : "opacity-0"
                  )}
                />
                {problem.title}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}; 