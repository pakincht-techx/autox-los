"use client";

import { useEffect, useState } from "react";
import { Clock, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SLATimerProps {
    startTime: string | Date;
    status: string;
    className?: string;
}

export function SLATimer({ startTime, status, className }: SLATimerProps) {
    const [elapsed, setElapsed] = useState(0);
    const TARGET_MINUTES = 20;
    const TARGET_MS = TARGET_MINUTES * 60 * 1000;

    useEffect(() => {
        const start = new Date(startTime).getTime();

        const update = () => {
            const now = new Date().getTime();
            setElapsed(now - start);
        };

        update(); // Initial
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [startTime]);

    // Format helper
    const formatTime = (ms: number) => {
        const absMs = Math.abs(ms);
        const d = Math.floor(absMs / (24 * 60 * 60 * 1000));
        const h = Math.floor((absMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        const m = Math.floor((absMs % (60 * 60 * 1000)) / 60000);
        const s = Math.floor((absMs % 60000) / 1000);

        if (d > 0) return `${d}d ${h}h`;
        if (h > 0) return `${h}h ${m}m`;
        return `${m}m ${s}s`;
    };

    // Determine State
    // 1. Completed: Show final state (simple "Completed" for now)
    if (status === 'อนุมัติ' || status === 'ถูกปฎิเสธ') {
        return (
            <div className={cn("flex items-center text-muted text-xs", className)}>
                <CheckCircle className="w-3 h-3 mr-1" /> Completed
            </div>
        );
    }

    if (status === 'แบบร่าง') {
        return (
            <div className={cn("flex items-center text-muted text-xs", className)}>
                -
            </div>
        );
    }

    // 2. HQ Review: Neutral/Info state (No SLA breach for branch)
    if (status.includes('HQ') || status.includes('Headquarter')) {
        return (
            <div className={cn("flex items-center font-mono font-bold text-xs px-2 py-0.5 rounded-full w-fit text-blue-700 bg-blue-50", className)}>
                <Clock className="w-3 h-3 mr-1.5" />
                {formatTime(elapsed)}
            </div>
        )
    }

    // 3. Branch Pending: Check against 20 min target
    const isBreached = elapsed > TARGET_MS;

    return (
        <div className={cn(
            "flex items-center font-mono font-bold text-xs px-2 py-0.5 rounded-full w-fit",
            isBreached ? "text-white bg-red-600" : "text-emerald-700 bg-emerald-50",
            className
        )}>
            {isBreached ? <AlertCircle className="w-3 h-3 mr-1.5" /> : <Clock className="w-3 h-3 mr-1.5" />}
            {formatTime(elapsed)}
        </div>
    );
}
