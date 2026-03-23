"use client";

import { Badge } from "@/components/ui/Badge";
import { CircleCheck, ClipboardCheck } from "lucide-react";

// ─── Consent Items ───────────────────────────────────────────────────────────

const CONSENT_ITEMS = [
    {
        title: "ข้อกำหนดและเงื่อนไข (Terms & Conditions)",
        description: "ข้อกำหนดและเงื่อนไขการใช้บริการสินเชื่อ",
    },
    {
        title: "ความยินยอมทางการตลาด (Marketing Consent)",
        description: "ความยินยอมในการใช้ข้อมูลเพื่อวัตถุประสงค์ทางการตลาด",
    },
    {
        title: "ความยินยอมการประกันภัย (Insurance Consent)",
        description: "เงื่อนไขการประกันภัยสำหรับสินเชื่อ",
    },
];

// ─── Page Component ──────────────────────────────────────────────────────────

export default function ConsentListPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-xl font-bold text-foreground">
                    การยอมรับ
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                    รายการความยินยอมทั้งหมดสำหรับใบสมัครนี้
                </p>
            </div>

            {/* Consent List */}
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white divide-y divide-gray-100">
                {CONSENT_ITEMS.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-4 px-5 py-4"
                    >
                        <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                            <ClipboardCheck className="w-4.5 h-4.5 text-blue-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900">
                                {item.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {item.description}
                            </p>
                        </div>
                        <Badge variant="success" className="gap-1 shrink-0">
                            <CircleCheck className="w-3.5 h-3.5" />
                            ยอมรับแล้ว
                        </Badge>
                    </div>
                ))}
            </div>
        </div>
    );
}
