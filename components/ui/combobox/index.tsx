"use client";

import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
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
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { useState } from "react";

export interface ComboboxOption {
    value: string;
    label: string;
}

export interface ComboboxProps {
    /** Currently selected value */
    value?: string;
    /** Name of the form field */
    name: string;
    /** List of options to display */
    options: ComboboxOption[];
    /** Callback when an option is selected */
    onChange: any;
    /** Label text to display above the combobox */
    label?: string;
    /** Error message to display below the combobox */
    error?: string;
    /** Placeholder text when no option is selected */
    placeholder?: string;
    /** Search input placeholder text */
    searchPlaceholder?: string;
    /** Text to display when no options match the search */
    noOptionsMessage?: string;
    /** Optional CSS classes to apply to the container */
    className?: string;
}

export function Combobox({
    value = "",
    name,
    options,
    onChange,
    label,
    error,
    placeholder = "Select option...",
    searchPlaceholder = "Search option...",
    noOptionsMessage = "No option found.",
    className,
}: ComboboxProps) {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Filter options based on the search query
    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        option.value.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedOption = options.find((option) => option.value === value);

    return (
        <div className={cn("space-y-2", className ? className : "p-2 border bg-gray-50  rounded-md")}>
            {label && (
                <label
                    htmlFor={name}
                    className=" text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    {label}
                </label>
            )}

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <div className="relative flex items-center justify-between">

                        <Button
                            id={name}
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            aria-controls={`${name}-popup`}
                            className="w-full h-10 justify-between"
                        >
                            {selectedOption ? (
                                <div className="flex w-full gap-1 items-center">
                                    {selectedOption.label}
                                </div>
                            ) : (
                                placeholder
                            )}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                        {selectedOption && <X
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent the click from reopening the popover
                                onChange({ target: { name, value: '' } }); // Notify parent component to reset value
                                setSearchQuery(""); // Clear the search query
                            }}
                            className="cursor-pointer absolute right-8 w-4"
                        />}
                    </div>
                </PopoverTrigger>

                <PopoverContent
                    className="w-[--radix-popover-trigger-width] p-0"
                    id={`${name}-popup`}
                >
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder={searchPlaceholder}
                            value={searchQuery}
                            onValueChange={setSearchQuery}
                        />
                        <CommandList>
                            {filteredOptions.length === 0 ? (
                                <CommandEmpty>{noOptionsMessage}</CommandEmpty>
                            ) : (
                                <CommandGroup>
                                    {filteredOptions.map((option) => (
                                        <CommandItem
                                            key={option.value}
                                            onSelect={() => {
                                                onChange({
                                                    target: {
                                                        name,
                                                        value: option.value === value ? "" : option.value,
                                                    },
                                                });
                                                setOpen(false);
                                                setSearchQuery("");
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    value === option.value ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {option.label}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {error && (
                <p className=" font-medium text-red-600">{error}</p>
            )}
        </div>
    );
}