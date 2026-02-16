"use client";

import { useState } from "react";
import { Plus, Search, Filter } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { ApplicationTable } from "@/components/applications/ApplicationTable";
import { Application, ApplicationStatus } from "@/components/applications/types";

// Mock Data
const MOCK_DATA: Application[] = [
    {
        id: "1",
        applicationNo: "APP-2023001",
        applicantName: "สมชาย ใจดี",
        submissionDate: "01/10/2023",
        requestedAmount: 500000,
        status: "Approved",
        productType: "สินเชื่อจำนำทะเบียนรถยนต์"
    },
    {
        id: "2",
        applicationNo: "APP-2023002",
        applicantName: "วิภาวดี รักษ์ไทย",
        submissionDate: "02/10/2023",
        requestedAmount: 120000,
        status: "In Review",
        productType: "สินเชื่อโฉนดที่ดิน"
    },
    {
        id: "3",
        applicationNo: "APP-2023003",
        applicantName: "กมล คนขยัน",
        submissionDate: "03/10/2023",
        requestedAmount: 35000,
        status: "In Review",
        productType: "สินเชื่อนาโนไฟแนนซ์"
    },
    {
        id: "4",
        applicationNo: "APP-2023004",
        applicantName: "ดาริน สวยงาม",
        submissionDate: "04/10/2023",
        requestedAmount: 850000,
        status: "Draft",
        productType: "สินเชื่อจำนำทะเบียนรถบรรทุก"
    },
    {
        id: "5",
        applicationNo: "APP-2023005",
        applicantName: "เอกชัย มั่นคง",
        submissionDate: "05/10/2023",
        requestedAmount: 45000,
        status: "Rejected",
        productType: "สินเชื่อส่วนบุคคล"
    },
    {
        id: "6",
        applicationNo: "APP-2023006",
        applicantName: "มานะ อดทน",
        submissionDate: "06/10/2023",
        requestedAmount: 200000,
        status: "In Review",
        productType: "สินเชื่อจำนำทะเบียนรถยนต์"
    },
];

import { motion } from "framer-motion";

export default function ApplicationsPage() {
    const [currentTab, setCurrentTab] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");

    const tabs = [
        { label: "ทั้งหมด", value: "all" },
        { label: "แบบร่าง", value: "Draft" },
        { label: "รอพิจารณา", value: "In Review" },
        { label: "อนุมัติ", value: "Approved" },
        { label: "ถูกปฎิเสธ", value: "Rejected" },
    ];

    const filteredData = MOCK_DATA.filter((app) => {
        const matchesTab = currentTab === "all" || app.status === currentTab;
        const matchesSearch =
            app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.applicationNo.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground font-sans">รายการคำขอ</h1>
                    <p className="text-sm text-muted">จัดการและติดตามสถานะคำขอสินเชื่อทั้งหมด</p>
                </div>
                <Link href="/dashboard/new-application">
                    <Button className="w-full sm:w-auto bg-chaiyo-blue hover:bg-chaiyo-blue/90 font-semibold shadow-md active:scale-95 transition-transform">
                        <Plus className="w-4 h-4 mr-2" />
                        สร้างคำขอใหม่
                    </Button>
                </Link>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-1 p-1 bg-gray-50/50 border border-border-subtle rounded-xl w-fit overflow-x-auto no-scrollbar relative">
                    {tabs.map((tab) => {
                        const isActive = currentTab === tab.value;
                        return (
                            <button
                                key={tab.value}
                                onClick={() => setCurrentTab(tab.value)}
                                className={cn(
                                    "relative px-4 py-1.5 text-xs font-bold transition-colors whitespace-nowrap z-10",
                                    isActive
                                        ? "text-chaiyo-blue"
                                        : "text-muted hover:text-foreground"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="active-pill"
                                        className="absolute inset-0 bg-white border border-chaiyo-blue rounded-lg shadow-sm"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                                    />
                                )}
                                <span className="relative z-20">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                        <input
                            type="text"
                            placeholder="ค้นหาชื่อ หรือเลขที่คำขอ..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-border-subtle rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-chaiyo-blue/50 transition-all shadow-sm"
                        />
                    </div>
                    {/* <Button variant="outline" size="icon" className="shrink-0 h-9 w-9 border-border-subtle">
                        <Filter className="w-4 h-4 text-muted" />
                    </Button> */}
                </div>
            </div>

            {/* Application List Table */}
            <ApplicationTable data={filteredData} />

            <div className="flex items-center justify-between px-2">
                <p className="text-xs text-muted">
                    แสดง {filteredData.length} จาก {MOCK_DATA.length} รายการ
                </p>
                {/* Pagination placeholder - can be implemented later */}
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" disabled className="text-xs h-8">ก่อนหน้า</Button>
                    <Button variant="ghost" size="sm" disabled className="text-xs h-8">ถัดไป</Button>
                </div>
            </div>
        </div>
    );
}
