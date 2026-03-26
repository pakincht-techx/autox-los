"use client";

import { Badge } from "@/components/ui/Badge";
import { CircleCheck, CircleX } from "lucide-react";

// ─── Consent Items ───────────────────────────────────────────────────────────

const CONSENT_ITEMS = [
    {
        title: "ข้อกำหนดและเงื่อนไข (Terms & Conditions)",
        version: "v1.0.0",
        status: "accepted",
    },
    {
        title: "ความยินยอมทางการตลาด (Marketing Consent)",
        version: "v1.2.0",
        status: "accepted",
    },
    {
        title: "ความยินยอมการประกันภัย (Insurance Consent)",
        version: "v1.1.0",
        status: "accepted",
    },
    {
        title: "ความยินยอมในการเปิดเผยข้อมูลส่วนบุคคล (PDPA Consent)",
        version: "v2.0.0",
        status: "rejected",
    },
];

// ─── Page Component ──────────────────────────────────────────────────────────

export default function ConsentListPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-xl font-bold text-foreground">
                    การให้ความยินยอม
                </h2>
            </div>

            {/* Consent List */}
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white divide-y divide-gray-100">
                {CONSENT_ITEMS.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-4 px-5 py-4"
                    >
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-gray-900">
                                    {item.title}
                                </p>
                                <Badge variant="neutral" className="px-1.5 py-0 text-[10px] h-4 font-normal bg-gray-100 text-gray-500 hover:bg-gray-100">
                                    {item.version}
                                </Badge>
                            </div>
                        </div>
                        {item.status === 'accepted' ? (
                            <Badge variant="success" className="gap-1 shrink-0">
                                <CircleCheck className="w-3.5 h-3.5" />
                                ยอมรับแล้ว
                            </Badge>
                        ) : (
                            <Badge variant="danger" className="gap-1 shrink-0">
                                <CircleX className="w-3.5 h-3.5" />
                                ปฏิเสธ
                            </Badge>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
