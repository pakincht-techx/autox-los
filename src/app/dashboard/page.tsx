"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Plus,
    Files,
    Banknote,
    Clock,
    ChevronRight,
    Calculator,
    Search,
    Filter,
    Download,
    MoreVertical,
    AlertTriangle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { SLATimer } from "@/components/dashboard/SLATimer";

const tabs = ["ทั้งหมด", "วันนี้", "เมื่อวาน", "เดือนนี้", "กำหนดเอง"];

const minutesAgo = (m: number) => new Date(Date.now() - m * 60000).toISOString();

const kpiData = [
    { label: "งานที่เสี่ยงหลุด SLA", value: "3", sub: "เหลือ < 5 นาที", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
    { label: "คำขอใหม่ (วันนี้)", value: "12", sub: "+2 รายการ", icon: Files, color: "text-blue-600" },
    { label: "เวลาเฉลี่ย/เคส", value: "14m", sub: "เป้าหมาย: 20m", icon: Clock, color: "text-emerald-600" },
];

const recentApps = [
    { id: "APP-001", name: "สมชาย ใจดี", amount: "฿250,000", status: "อนุมัติ", time: "10:30", type: "รถกระบะ", createdAt: minutesAgo(45) },
    { id: "APP-002", name: "มานะ รักชาติ", amount: "฿120,000", status: "รอพิจารณา", time: "11:15", type: "รถเก๋ง", createdAt: minutesAgo(12) }, // 12m elapsed (Safe)
    { id: "APP-003", name: "สุดา มีสุข", amount: "฿50,000", status: "ถูกปฎิเสธ", time: "09:45", type: "มอเตอร์ไซค์", createdAt: minutesAgo(60) },
    { id: "APP-004", name: "ปิติ พอเพียง", amount: "-", status: "แบบร่าง", time: "09:00", type: "รถกระบะ", createdAt: minutesAgo(120) },
    { id: "APP-005", name: "วีระ ยิ่งยง", amount: "฿300,000", status: "รอพิจารณา", time: "11:20", type: "รถบรรทุก", createdAt: minutesAgo(25) }, // 25m elapsed (Breached)
    { id: "APP-006", name: "อารี มีนา", amount: "฿150,000", status: "รอพิจารณา (HQ)", time: "09:00", type: "รถเก๋ง", createdAt: minutesAgo(150) }, // 150m elapsed (HQ - Info only)
];

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState("วันนี้");
    const router = useRouter();

    return (
        <div className="space-y-8">
            {/* Top Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">ระบบสินเชื่อสาขา - เงินไชโย</h1>
                    <p className="text-sm text-muted mt-1">ยินดีต้อนรับกลับมา, คุณสมหญิง</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/dashboard/pre-question">
                        <Button className="shadow-lg shadow-chaiyo-blue/20 font-semibold active:scale-95 transition-transform">
                            <Calculator className="w-4 h-4 mr-2" />
                            แนะนำผลิตภัณฑ์
                        </Button>
                    </Link>

                </div>
            </div>

            {/* Date Range Tabs (Peec style) */}
            <div className="flex items-center gap-1 p-1 bg-gray-50/50 border border-border-subtle rounded-xl w-fit relative">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab;
                    return (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "relative px-4 py-1.5 text-xs font-bold transition-colors z-10 cursor-pointer",
                                isActive
                                    ? "text-chaiyo-blue"
                                    : "text-muted hover:text-foreground"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="dashboard-active-pill"
                                    className="absolute inset-0 bg-white border border-chaiyo-blue rounded-lg shadow-sm"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                                />
                            )}
                            <span className="relative z-20">{tab}</span>
                        </button>
                    );
                })}
            </div>

            {/* KPI Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {kpiData.map((kpi, i) => {
                    const Icon = kpi.icon;
                    return (
                        <Card key={i} className={cn("group hover:border-chaiyo-blue/20 transition-all cursor-default overflow-hidden relative border-border-subtle", kpi.bg)}>
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                                <Icon className="w-16 h-16" />
                            </div>
                            <CardContent className="p-6">
                                <p className={cn("text-[13px] font-medium mb-2", kpi.bg ? "text-red-800" : "text-muted")}>{kpi.label}</p>
                                <div className="flex items-baseline gap-2">
                                    <h3 className={cn("text-2xl font-bold tracking-tight", kpi.bg ? "text-red-900" : "text-foreground")}>{kpi.value}</h3>
                                    <span className={cn("text-[11px] font-semibold px-1.5 py-0.5 rounded", kpi.bg ? "bg-red-100 text-red-700" : "text-emerald-600 bg-emerald-50")}>
                                        {kpi.sub}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Main Table Panel */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold text-foreground">ใบคำขอที่รอดำเนินการ</h2>
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-chaiyo-blue/10 text-chaiyo-blue rounded-full">4 รายการ</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted"> <Download className="w-4 h-4" /> </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted"> <Filter className="w-4 h-4" /> </Button>
                    </div>
                </div>

                <div className="border border-border-subtle rounded-xl overflow-hidden bg-white">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50/50 border-b border-border-subtle">
                            <tr className="text-[11px] font-bold text-muted uppercase tracking-wider">
                                <th className="px-6 py-4">ลูกค้า / ประเภท</th>
                                <th className="px-6 py-4">รหัสอ้างอิง</th>
                                <th className="px-6 py-4">วงเงินสินเชื่อ</th>
                                <th className="px-6 py-4">เวลาที่ใช้ไป (SLA)</th>
                                <th className="px-6 py-4 text-right">สถานะ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-subtle">
                            {recentApps.map((app) => (
                                <tr
                                    key={app.id}
                                    className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                                    onClick={() => {
                                        if (app.status === 'แบบร่าง') {
                                            router.push('/dashboard/new-application?state=draft');
                                        } else {
                                            router.push(`/dashboard/applications/${app.id.split('-')[1] || app.id}`);
                                        }
                                    }}
                                >
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-foreground text-[13px]">{app.name}</div>
                                        <div className="text-[11px] text-muted mt-0.5">{app.type}</div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs text-muted tracking-tight">{app.id}</td>
                                    <td className="px-6 py-4 font-bold text-foreground">{app.amount}</td>
                                    <td className="px-6 py-4 text-muted text-[12px]">
                                        <SLATimer startTime={app.createdAt} status={app.status} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <span className={cn(
                                                "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border",
                                                app.status === 'อนุมัติ' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                    app.status === 'รอพิจารณา' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                        app.status === 'แบบร่าง' ? 'bg-gray-50 text-gray-600 border-gray-200' :
                                                            'bg-red-50 text-red-700 border-red-200'
                                            )}>
                                                {app.status}
                                            </span>
                                            <MoreVertical className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="bg-gray-50/30 px-6 py-3 border-t border-border-subtle flex justify-center">
                        <Button variant="link" className="text-xs text-muted hover:text-chaiyo-blue font-semibold">ดูรายงานทั้งหมด ประจำเดือน กุมภาพันธ์ <ChevronRight className="w-3 h-3 ml-1" /></Button>
                    </div>
                </div>
            </div>

        </div>
    );
}
