"use client";

import { AlertTriangle, CheckCircle2, ChevronRight, AlertCircle } from "lucide-react";
import { ActionItem } from "@/components/applications/types";
import { cn } from "@/lib/utils";

interface ActionRequiredListProps {
    items: ActionItem[];
}

export function ActionRequiredList({ items }: ActionRequiredListProps) {
    if (!items || items.length === 0) return null;

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-amber-700">
                <AlertTriangle className="h-5 w-5" />
                <h3 className="font-bold text-lg">สิ่งที่ต้องดำเนินการ (Action Required)</h3>
            </div>

            <div className="grid gap-3">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className={cn(
                            "flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer group",
                            item.priority === 'High'
                                ? "bg-amber-50 border-amber-200 hover:border-amber-300"
                                : "bg-white border-border-subtle hover:border-chaiyo-blue/30"
                        )}
                    >
                        <div className={cn(
                            "mt-0.5 rounded-full p-1",
                            item.isCompleted ? "bg-green-100 text-green-600" : "bg-white border border-gray-200 text-gray-300"
                        )}>
                            <CheckCircle2 className="h-5 w-5" />
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-gray-900 group-hover:text-chaiyo-blue transition-colors">
                                    {item.title}
                                </h4>
                                {item.priority === 'High' && (
                                    <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                                        ด่วน
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                        </div>

                        <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-chaiyo-blue transition-colors self-center" />
                    </div>
                ))}
            </div>
        </div>
    );
}
