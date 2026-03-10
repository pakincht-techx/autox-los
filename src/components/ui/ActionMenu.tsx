import * as React from "react"
import {
    MoreVertical,
    Eye,
    Edit3,
    PlusCircle,
    Trash2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./Button"

export interface ActionMenuItem {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    className?: string;
    variant?: "default" | "destructive" | "primary";
}

export interface ActionMenuProps {
    // Legacy props support
    onView?: () => void;
    onEdit?: () => void;
    onNewApplication?: () => void;
    onDelete?: () => void;

    // New generic props
    items?: ActionMenuItem[];
}

export function ActionMenu({ onView, onEdit, onNewApplication, onDelete, items }: ActionMenuProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const menuRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Convert legacy props to items if items not provided
    const menuItems: ActionMenuItem[] = items || [];

    if (!items) {
        if (onView) {
            menuItems.push({
                label: "ดูรายละเอียด",
                icon: <Eye className="w-3.5 h-3.5" />,
                onClick: onView,
            });
        }
        if (onEdit) {
            menuItems.push({
                label: "แก้ไขข้อมูล",
                icon: <Edit3 className="w-3.5 h-3.5" />,
                onClick: onEdit,
            });
        }
        if (onNewApplication) {
            menuItems.push({
                label: "สร้างใบสมัครใหม่",
                icon: <PlusCircle className="w-3.5 h-3.5" />,
                onClick: onNewApplication,
                variant: 'primary',
                className: 'border-t border-border-subtle mt-1.5 pt-3'
            });
        }
        if (onDelete) {
            menuItems.push({
                label: "ลบรายการ",
                icon: <Trash2 className="w-3.5 h-3.5" />,
                onClick: onDelete,
                variant: 'destructive',
            });
        }
    }

    return (
        <div className="relative" ref={menuRef} onClick={(e) => e.stopPropagation()}>
            <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
            >
                <MoreVertical className="h-4 w-4 text-muted" />
            </Button>

            {isOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white border border-border-subtle rounded-xl shadow-lg z-50 py-1.5 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                item.onClick();
                                setIsOpen(false);
                            }}
                            className={cn(
                                "w-full flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-left transition-colors",
                                item.variant === 'destructive'
                                    ? "text-red-600 hover:bg-red-50"
                                    : item.variant === 'primary'
                                        ? "text-chaiyo-blue hover:bg-blue-50/50"
                                        : "text-foreground hover:bg-gray-50",
                                item.className,
                            )}
                        >
                            {item.icon && <span className={cn(
                                "shrink-0",
                                item.variant === 'destructive' ? "text-red-500" : "text-muted"
                            )}>{item.icon}</span>}
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
