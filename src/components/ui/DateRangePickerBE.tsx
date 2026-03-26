"use client";

import * as React from "react";
import { format, parse, isValid, getYear } from "date-fns";
import { th } from "date-fns/locale";
import type { DateLibOptions } from "react-day-picker";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DateRangePickerBEProps {
    /** Start date as YYYY-MM-DD (A.D.) */
    from?: string;
    /** End date as YYYY-MM-DD (A.D.) */
    to?: string;
    /** Called when the range changes */
    onRangeChange: (from: string, to: string) => void;
    /** Placeholder label */
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

/** Convert an ISO date string (A.D.) to B.E. display format DD/MM/YYYY */
export function toBEDisplay(isoDate: string): string {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    if (!isValid(date)) return "";
    const d = format(date, "dd");
    const m = format(date, "MM");
    const yBE = getYear(date) + 543;
    return `${d}/${m}/${yBE}`;
}

export function DateRangePickerBE({
    from,
    to,
    onRangeChange,
    placeholder = "เลือกช่วงวันที่",
    className,
    disabled,
}: DateRangePickerBEProps) {
    const [open, setOpen] = React.useState(false);

    // Convert ISO strings to Date objects for the Calendar
    const selected: DateRange | undefined = React.useMemo(() => {
        const fromDate = from ? new Date(from) : undefined;
        const toDate = to ? new Date(to) : undefined;
        if (!fromDate || !isValid(fromDate)) return undefined;
        return {
            from: fromDate,
            to: toDate && isValid(toDate) ? toDate : undefined,
        };
    }, [from, to]);

    const handleSelect = (range: DateRange | undefined) => {
        const newFrom = range?.from ? format(range.from, "yyyy-MM-dd") : "";
        const newTo = range?.to ? format(range.to, "yyyy-MM-dd") : "";
        onRangeChange(newFrom, newTo);
    };

    // Build the display label
    const displayLabel = React.useMemo(() => {
        if (!from) return null;
        const fromLabel = toBEDisplay(from);
        const toLabel = toBEDisplay(to || "");
        if (fromLabel && toLabel) return `${fromLabel} - ${toLabel}`;
        if (fromLabel) return fromLabel;
        return null;
    }, [from, to]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                        "h-12 w-full justify-start text-left font-normal rounded-xl border-gray-200 hover:bg-transparent",
                        !displayLabel && "text-muted-foreground",
                        className
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    {displayLabel ? (
                        <span className="truncate font-medium text-sm">{displayLabel}</span>
                    ) : (
                        <span className="text-sm">{placeholder}</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="range"
                    defaultMonth={selected?.from}
                    selected={selected}
                    onSelect={handleSelect}
                    numberOfMonths={2}
                    locale={th}
                    formatters={{
                        formatMonthCaption: (month: Date, options?: DateLibOptions) => {
                            const monthName = format(month, "LLLL", { locale: th });
                            const yearBE = getYear(month) + 543;
                            return `${monthName} ${yearBE}`;
                        },
                    }}
                />
            </PopoverContent>
        </Popover>
    );
}
