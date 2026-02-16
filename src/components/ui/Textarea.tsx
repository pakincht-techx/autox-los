import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
    HTMLTextAreaElement,
    React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
    return (
        <textarea
            className={cn(
                "flex min-h-[44px] w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus:border-chaiyo-blue focus-visible:ring-2 focus-visible:ring-chaiyo-blue/20 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-all font-sans",
                className
            )}
            ref={ref}
            {...props}
        />
    )
})
Textarea.displayName = "Textarea"

export { Textarea }
