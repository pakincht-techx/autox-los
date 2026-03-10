"use client";

import * as React from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/Button";

export interface ComboboxOption {
    value: string;
    label: string;
}

interface ComboboxProps {
    options: ComboboxOption[];
    value?: string;
    onValueChange?: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    className?: string;
    disabled?: boolean;
}

export function Combobox({
    options,
    value,
    onValueChange,
    placeholder = "เลือก...",
    searchPlaceholder = "ค้นหา...",
    emptyText = "ไม่พบข้อมูล",
    className,
    disabled = false,
}: ComboboxProps) {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const [focusedIndex, setFocusedIndex] = React.useState(-1);

    React.useEffect(() => {
        setFocusedIndex(-1);
    }, [search, open]);

    const filtered = React.useMemo(() => {
        if (!search) return options;
        const lower = search.toLowerCase();
        return options.filter(
            (o) =>
                o.label.toLowerCase().includes(lower) ||
                o.value.toLowerCase().includes(lower)
        );
    }, [options, search]);

    const selectedLabel = React.useMemo(() => {
        if (!value) return null;
        const found = options.find(
            (o) => o.value === value || o.label.toLowerCase() === value.toLowerCase()
        );
        return found?.label || value;
    }, [options, value]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className={cn(
                        "w-full justify-between h-12 bg-white font-normal rounded-xl border-gray-200 px-3 hover:bg-gray-50 disabled:bg-gray-100 disabled:opacity-100 disabled:text-gray-500 transition-all",
                        className
                    )}
                >
                    <span className={cn(!selectedLabel && "text-muted-foreground")}>
                        {selectedLabel || placeholder}
                    </span>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-[--radix-popover-trigger-width] p-0 border-gray-200 bg-white shadow-lg rounded-xl overflow-hidden"
                align="start"
            >
                {/* Search Input */}
                <div className="flex items-center border-b border-gray-200 px-3">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "ArrowDown") {
                                e.preventDefault();
                                setFocusedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : prev));
                            } else if (e.key === "ArrowUp") {
                                e.preventDefault();
                                setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
                            } else if (e.key === "Enter" && focusedIndex >= 0 && focusedIndex < filtered.length) {
                                e.preventDefault();
                                onValueChange?.(filtered[focusedIndex].value);
                                setOpen(false);
                                setSearch("");
                            } else if (e.key === "Escape") {
                                setOpen(false);
                            }
                        }}
                        placeholder={searchPlaceholder}
                        autoFocus
                        className="flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                    />
                </div>

                {/* Options List */}
                <div className="max-h-[200px] overflow-y-auto p-1">
                    {filtered.length === 0 ? (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                            {emptyText}
                        </div>
                    ) : (
                        filtered.map((option, index) => {
                            const isSelected =
                                value === option.value ||
                                value?.toLowerCase() === option.label.toLowerCase();
                            const isFocused = index === focusedIndex;
                            return (
                                <div
                                    key={option.value}
                                    onClick={() => {
                                        onValueChange?.(option.value);
                                        setOpen(false);
                                        setSearch("");
                                    }}
                                    className={cn(
                                        "relative flex cursor-default select-none items-center rounded-lg py-2 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-gray-100 hover:text-gray-900",
                                        isSelected && "bg-gray-50",
                                        isFocused && "bg-gray-100 text-gray-900"
                                    )}
                                >
                                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                                        {isSelected && <Check className="h-4 w-4" />}
                                    </span>
                                    {option.label}
                                </div>
                            );
                        })
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
