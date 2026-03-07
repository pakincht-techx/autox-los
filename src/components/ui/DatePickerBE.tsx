"use client";

import * as React from "react";
import { format, isValid, getYear } from "date-fns";
import { cn } from "@/lib/utils";

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

    // Sync internal display value when external value (A.D. ISO string) changes
    React.useEffect(() => {
        if (!value) {
            setDisplayValue("");
            return;
        }

        // Custom validation for partial dates (e.g. 1995------ or 1995-01---)
        const parts = value.split('-');
        if (parts.length === 3) {
            const y = parts[0];
            const m = parts[1];
            const d = parts[2];

            const isPartialValid = y.length === 4 && (m === "--" || parseInt(m) > 0) && (d === "--" || parseInt(d) > 0);
            if (isPartialValid && (m === "--" || d === "--")) {
                const yBE = parseInt(y) + 543;
                setDisplayValue(`${d}/${m}/${yBE}`);
                return;
            }
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
        let val = e.target.value.replace(/[^0-9\-]/g, ""); // Keep numbers and dashes only
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
            const yBERaw = val.slice(4, 8);
            let yBE = parseInt(yBERaw);

            if (!isNaN(yBE)) {
                // Rule says "Never show A.D. in UI". If user types 2024, convert to 2567.
                if (yBE > 0 && yBE < 2400) {
                    yBE += 543;
                    setDisplayValue(`${d}/${m}/${yBE}`);
                }
                const yAD = yBE - 543;

                // Allow partial dates with dashes
                const dValid = d === "--" || (parseInt(d) > 0 && parseInt(d) <= 31);
                const mValid = m === "--" || (parseInt(m) > 0 && parseInt(m) <= 12);

                if (dValid && mValid && yAD > 1900 && yAD < 2200) {
                    const isoString = `${yAD}-${m}-${d}`;
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
            const parts = value.split('-');
            if (parts.length === 3) {
                const y = parts[0];
                const m = parts[1];
                const d = parts[2];
                const isPartialValid = y.length === 4 && (m === "--" || parseInt(m) > 0) && (d === "--" || parseInt(d) > 0);
                if (isPartialValid && (m === "--" || d === "--")) {
                    const yBE = parseInt(y) + 543;
                    setDisplayValue(`${d}/${m}/${yBE}`);
                    return;
                }
            }

            const date = new Date(value);
            if (isValid(date)) {
                const d = format(date, "dd");
                const m = format(date, "MM");
                const yBE = getYear(date) + 543;
                setDisplayValue(`${d}/${m}/${yBE}`);
            }
        }
    };

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
                        "h-12 rounded-xl border-gray-200", // Match standard project height and border
                        error && "border-red-500 ring-red-500/20",
                        displayValue && "font-medium",
                        (disabled || readOnly) && "bg-gray-200/50! border-gray-200! text-gray-500 cursor-not-allowed select-none pointer-events-none",
                        inputClassName
                    )}
                />
            </div>
        </div>
    );
}
