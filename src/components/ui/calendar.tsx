"use client"

import * as React from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/Button"

function Calendar({
  className,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month: "flex flex-col gap-4",
        month_caption: "flex justify-center pt-1 relative items-center h-7",
        caption_label: "text-sm font-semibold",
        nav: "flex items-center gap-1 absolute inset-x-3 top-3 z-10 justify-between",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        week: "flex w-full mt-2",
        day: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-chaiyo-blue/10 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-range-start)]:rounded-l-md [&:has([aria-selected].day-outside)]:bg-chaiyo-blue/5",
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "size-9 p-0 font-normal aria-selected:opacity-100 hover:bg-chaiyo-blue/10 hover:text-chaiyo-blue"
        ),
        range_start: "day-range-start rounded-l-md",
        range_end: "day-range-end rounded-r-md",
        selected:
          "[&>button]:bg-chaiyo-blue [&>button]:text-white [&>button]:hover:bg-chaiyo-blue [&>button]:hover:text-white [&>button]:focus:bg-chaiyo-blue [&>button]:focus:text-white rounded-md",
        today: "bg-gray-100 text-gray-900 rounded-md",
        outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-chaiyo-blue/10 aria-selected:text-muted-foreground",
        disabled: "text-muted-foreground opacity-50",
        range_middle:
          "aria-selected:bg-chaiyo-blue/10 [&>button]:!bg-transparent [&>button]:!text-gray-900 [&>button]:hover:!bg-chaiyo-blue/20 [&>button]:hover:!text-gray-900 rounded-none",
        hidden: "invisible",
      }}
      components={{
        Chevron: ({ orientation }) => {
          if (orientation === "left") {
            return <ChevronLeftIcon className="size-4" />
          }
          return <ChevronRightIcon className="size-4" />
        },
      }}
      {...props}
    />
  )
}

export { Calendar }
