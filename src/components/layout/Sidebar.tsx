"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutGrid,
    PlusSquare,
    Users,
    Files,
    CheckSquare,
    Car,
    LogOut,
    Settings,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    UserCircle,
    HelpCircle,
    Calculator
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const navigationGroups = [
    {
        title: "ทั่วไป",
        items: [
            { name: "หน้าหลัก", href: "/dashboard", icon: LayoutGrid },
            { name: "สินเชื่อใหม่", href: "/dashboard/new-application", icon: PlusSquare },
        ]
    },
    {
        title: "จัดการ",
        items: [
            { name: "ลูกค้า", href: "/dashboard/customers", icon: Users },
            { name: "รายการคำขอ", href: "/dashboard/applications", icon: Files },
            { name: "งานของฉัน", href: "/dashboard/tasks", icon: CheckSquare },
        ]
    },
    {
        title: "บริการ",
        items: [
            { name: "ประเมินรถ", href: "/dashboard/collateral", icon: Car },
            { name: "เครื่องคำนวณ", href: "/dashboard/calculator", icon: Calculator },
        ]
    },
    {
        title: "ตั้งค่า",
        items: [
            { name: "บัญชี", href: "/dashboard/profile", icon: UserCircle },
            { name: "การตั้งค่า", href: "/dashboard/settings", icon: Settings },
        ]
    }
];

export function Sidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className={cn(
            "relative flex flex-col h-full bg-background border-r border-border-subtle transition-all duration-300",
            isCollapsed ? "w-16" : "w-64"
        )}>
            {/* Brand Header */}
            <div className={cn("p-5 border-b border-border-subtle flex items-center gap-3 h-20", isCollapsed && "justify-center px-0")}>
                <div className="min-w-8 w-8 h-8 rounded bg-chaiyo-blue flex items-center justify-center text-white font-bold text-lg shrink-0">
                    ช
                </div>
                {!isCollapsed && (
                    <div className="overflow-hidden">
                        <h1 className="font-semibold text-base leading-none truncate underline decoration-chaiyo-blue decoration-2 underline-offset-4">เงินไชโย</h1>
                        <span className="text-[10px] text-muted tracking-widest uppercase mt-1 block truncate">Branch Portal</span>
                    </div>
                )}
            </div>

            {/* Collapse Toggle */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-17 w-6 h-6 rounded-full bg-white border border-border-color flex items-center justify-center hover:bg-gray-50 transition-colors z-50 shadow-sm"
            >
                {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
            </button>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-6 overflow-y-auto no-scrollbar">
                {navigationGroups.map((group) => (
                    <div key={group.title} className="space-y-1">
                        {!isCollapsed && (
                            <p className="px-3 text-[10px] font-semibold text-muted/60 uppercase tracking-widest mb-2">
                                {group.title}
                            </p>
                        )}
                        <div className="space-y-0.5">
                            {group.items.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2 rounded-md transition-all group border border-transparent",
                                            isActive
                                                ? "bg-white border-border-subtle text-foreground font-medium shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
                                                : "text-muted hover:text-foreground hover:bg-white/50",
                                            isCollapsed && "justify-center px-0"
                                        )}
                                        title={isCollapsed ? item.name : ""}
                                    >
                                        <Icon className={cn("w-4.5 h-4.5 shrink-0", isActive ? "text-chaiyo-blue" : "text-muted group-hover:text-foreground")} />
                                        {!isCollapsed && (
                                            <span className="text-[13px]">{item.name}</span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* User Footer */}
            <div className={cn("p-4 border-t border-border-subtle bg-white/50 backdrop-blur-sm", isCollapsed && "px-2")}>
                <div className={cn(
                    "flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer group hover:bg-white border border-transparent hover:border-border-subtle",
                    isCollapsed && "justify-center p-1"
                )}>
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs border border-purple-200 shrink-0">
                        JS
                    </div>
                    {!isCollapsed && (
                        <>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-xs font-semibold text-foreground truncate">สมหญิง จริงใจ</p>
                                <p className="text-[10px] text-muted truncate">สาขาลาดพร้าว</p>
                            </div>
                            <LogOut className="w-3.5 h-3.5 text-muted group-hover:text-red-500" />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
