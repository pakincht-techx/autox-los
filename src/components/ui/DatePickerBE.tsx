"use client";

import * as React from "react";
import { format, parse, isValid, getYear } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/Input";

interface DatePickerBEProps {
    value?: string; // Expects YYYY-MM-DD (A.D.)
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string; // Wrapper className
    inputClassName?: string; // Inner input className
    disabled?: boolean;
    readOnly?: boolean;
    id?: string;
    error?: boolean;
}

export function DatePickerBE({
    value,
    onChange,
    placeholder = "วว/ดด/ปปปป (พ.ศ.)",
    className,
    inputClassName,
    disabled,
    readOnly,
    id,
    error,
}: DatePickerBEProps) {
    const [displayValue, setDisplayValue] = React.useState("");
    const [isOpen, setIsOpen] = React.useState(false);

    // Sync internal display value when external value (A.D. ISO string) changes
    React.useEffect(() => {
        if (!value) {
            setDisplayValue("");
            return;
        }

        const date = new Date(value);
        if (isValid(date)) {
            const d = format(date, "dd");
            const m = format(date, "MM");
            const yBE = getYear(date) + 543;
            setDisplayValue(`${d}/${m}/${yBE}`);
        }
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/[^0-9]/g, ""); // Keep numbers only
        if (val.length > 8) val = val.slice(0, 8);

        // Format: DD/MM/YYYY
        let formatted = "";
        if (val.length > 0) {
            formatted = val.slice(0, 2);
            if (val.length > 2) {
                formatted += "/" + val.slice(2, 4);
                if (val.length > 4) {
                    formatted += "/" + val.slice(4, 8);
                }
            }
        }
        setDisplayValue(formatted);

        // If complete, convert and fire onChange
        if (val.length === 8) {
            const d = val.slice(0, 2);
            const m = val.slice(2, 4);
            let yBE = parseInt(val.slice(4, 8));

            // Basic validation
            const dInt = parseInt(d);
            const mInt = parseInt(m);
            if (dInt > 0 && dInt <= 31 && mInt > 0 && mInt <= 12) {
                // If year is < 2400, assume it's A.D. and convert to B.E. for internal consistency?
                // Rule says "Never show A.D. in UI". If user types 2024, convert to 2567.
                if (yBE < 2400) {
                    yBE += 543;
                    setDisplayValue(`${d}/${m}/${yBE}`);
                }
                const yAD = yBE - 543;
                const isoString = `${yAD}-${m}-${d}`;
                if (isValid(new Date(isoString))) {
                    onChange(isoString);
                }
            }
        } else if (val.length === 0) {
            onChange("");
        }
    };

    const handleInputBlur = () => {
        // If incomplete, reset or clear? Usually better to show what's stored in parent
        if (!value) {
            setDisplayValue("");
        } else {
            const date = new Date(value);
            if (isValid(date)) {
                const d = format(date, "dd");
                const m = format(date, "MM");
                const yBE = getYear(date) + 543;
                setDisplayValue(`${d}/${m}/${yBE}`);
            }
        }
    };

    const handleCalendarSelect = (date: Date | undefined) => {
        if (date) {
            const isoString = format(date, "yyyy-MM-dd");
            onChange(isoString);
            setIsOpen(false);
        }
    };

    // Current Date in A.D. for Calendar
    const calendarDate = value && isValid(new Date(value)) ? new Date(value) : undefined;

    return (
        <div className={cn("relative w-full", className)}>
            <div className="relative">
                <Input
                    id={id}
                    value={displayValue}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    placeholder={placeholder}
                    disabled={disabled}
                    readOnly={readOnly}
                    className={cn(
                        "pr-10 h-12 rounded-xl", // Match standard project height
                        error && "border-red-500 ring-red-500/20",
                        displayValue && "font-medium",
                        readOnly && "bg-gray-50 border-none shadow-none text-gray-700",
                        inputClassName
                    )}
                />
                
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                    <PopoverTrigger asChild>
                        <button
                            type="button"
                            disabled={disabled || readOnly}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-chaiyo-blue transition-colors outline-none focus:text-chaiyo-blue disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <CalendarIcon className="w-4 h-4" />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-50" align="end">
                        <Calendar
                            mode="single"
                            selected={calendarDate}
                            onSelect={handleCalendarSelect}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>

                {displayValue && !disabled && (
                    <button
                        type="button"
                        onClick={() => {
                            setDisplayValue("");
                            onChange("");
                        }}
                        className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors p-1"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>
        </div>
    );
}
