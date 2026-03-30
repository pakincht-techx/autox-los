import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

type StatusBannerVariant = "success" | "warning" | "info" | "error" | "orange";
type StatusBannerSize = "default" | "lg";

interface StatusBannerProps {
    variant: StatusBannerVariant;
    size?: StatusBannerSize;
    icon?: LucideIcon;
    title: string;
    description?: ReactNode;
    action?: ReactNode;
    className?: string;
}

const variantStyles: Record<StatusBannerVariant, {
    container: string;
    iconBox: string;
    title: string;
    description: string;
}> = {
    success: {
        container: "bg-emerald-50 border-emerald-200",
        iconBox: "bg-emerald-100 text-emerald-600",
        title: "text-emerald-700",
        description: "text-emerald-600",
    },
    warning: {
        container: "bg-yellow-50 border-yellow-200",
        iconBox: "bg-yellow-100 text-yellow-600",
        title: "text-yellow-700",
        description: "text-yellow-600",
    },
    info: {
        container: "bg-blue-50 border-blue-200",
        iconBox: "bg-blue-100 text-blue-600",
        title: "text-blue-700",
        description: "text-blue-600",
    },
    error: {
        container: "bg-red-50 border-red-200",
        iconBox: "bg-red-100 text-red-600",
        title: "text-red-700",
        description: "text-red-600",
    },
    orange: {
        container: "bg-orange-50 border-orange-200",
        iconBox: "bg-orange-100 text-orange-600",
        title: "text-orange-900",
        description: "text-orange-700",
    },
};

export function StatusBanner({
    variant,
    size = "default",
    icon: Icon,
    title,
    description,
    action,
    className,
}: StatusBannerProps) {
    const styles = variantStyles[variant];
    const isLg = size === "lg";

    return (
        <div
            className={cn(
                "p-4 rounded-xl border flex items-center gap-4",
                styles.container,
                className
            )}
        >
            {Icon && (
                <div
                    className={cn(
                        "rounded-full flex items-center justify-center flex-shrink-0",
                        isLg ? "w-12 h-12" : "w-10 h-10",
                        styles.iconBox
                    )}
                >
                    <Icon className={isLg ? "w-6 h-6" : "w-5 h-5"} />
                </div>
            )}
            <div className="flex-1 min-w-0">
                <h3 className={cn("font-bold", isLg ? "text-lg" : "text-sm", styles.title)}>
                    {title}
                </h3>
                {description && (
                    <p className={cn("mt-0.5", isLg ? "text-sm" : "text-xs", styles.description)}>
                        {description}
                    </p>
                )}
            </div>
            {action && <div className="flex-shrink-0">{action}</div>}
        </div>
    );
}
