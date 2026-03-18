"use client";

import React, { useState, useEffect } from "react";
import { useSidebar } from "@/components/layout/SidebarContext";
import { ApplicationStatus } from "@/components/applications/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
    Phone, MessageCircle, User, Pencil, Star, FileText, Check,
    ShieldCheck, Gift, Car, Wallet, Coins, Users, Plus, Eye,
    AlertTriangle, ShieldAlert, ClipboardCheck, MessageSquare, Paperclip
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

// ─── Types ───────────────────────────────────────────────────────────────────

type MockCase = 1 | 2 | 3;

const CASE_LABELS: Record<MockCase, { label: string; description: string }> = {
    1: { label: "Case 1", description: "แบบร่าง — กรอกข้อมูลผู้กู้แล้ว (ปกติ)" },
    2: { label: "Case 2", description: "รอพิจารณา — กรอกข้อมูลผู้กู้แล้ว (Softblock)" },
    3: { label: "Case 3", description: "แบบร่าง — กรอกข้อมูลครบทุกส่วน" },
};

// ─── Mock Data per Case ─────────────────────────────────────────────────────

function getMockData(mockCase: MockCase) {
    const base = {
        id: "1",
        applicationNo: "app-25680313000001",
        applicantName: "สมชาย ใจดี",
        status: "Draft" as ApplicationStatus,
        phone: "080-000-0000",
        lastActionTime: "14-03-2569 10:30",
        loanProductLabel: "ULCR",
        loanProductName: "จำนำรถมอเตอร์ไซต์ผ่อนรายเดือน",
        loanAmount: 20000,
        interestRate: 24,
        term: 60,
        installment: 3000,
        insurance: {
            company: "บริษัทประกัน",
            premium: "ทุนประกัน",
            fee: "ค่าเบี้ย",
            installmentFee: "ค่าผ่อน",
        },
        historyLog: [
            {
                date: "13 มี.ค. 2569",
                time: "10:30 น.",
                title: "สร้างใบสมัคร",
                team: "พนักงานสาขา",
                result: "",
            },
        ],
    };

    switch (mockCase) {
        case 1:
            return {
                ...base,
                checkStatus: "normal" as const,
                customerType: "ปกติ",
                collateralType: "",
                incomePerMonth: 0,
                debtPerMonth: 0,
                guarantorCount: 0,
            };
        case 2:
            return {
                ...base,
                status: "In Review" as ApplicationStatus,
                checkStatus: "soft_block" as const,
                reasonCodes: ["S01", "S03"],
                customerType: "ปกติ",
                collateralType: "",
                incomePerMonth: 0,
                debtPerMonth: 0,
                guarantorCount: 0,
            };
        case 3:
            return {
                ...base,
                checkStatus: "normal" as const,
                customerType: "ปกติ",
                collateralType: "รถมอเตอร์ไซต์",
                incomePerMonth: 25000,
                debtPerMonth: 8500,
                guarantorCount: 1,
            };
    }
}

// ─── Status Helpers ──────────────────────────────────────────────────────────

const getStatusBadgeVariant = (status: ApplicationStatus) => {
    switch (status) {
        case 'Approved': return 'success';
        case 'Rejected': return 'danger';
        case 'Cancelled': return 'neutral';
        case 'In Review': return 'yellow';
        case 'Sent Back': return 'warning';
        case 'Draft':
        default: return 'neutral';
    }
};

const getStatusLabel = (status: ApplicationStatus) => {
    switch (status) {
        case 'Approved': return 'อนุมัติ';
        case 'Rejected': return 'ปฏิเสธ';
        case 'In Review': return 'รอพิจารณา';
        case 'Sent Back': return 'ส่งกลับ';
        case 'Cancelled': return 'ยกเลิก';
        case 'Draft': return 'แบบร่าง';
        default: return status;
    }
};

// ─── Page Component ──────────────────────────────────────────────────────────
import { Suspense } from "react";

function MockupContent() {
    const searchParams = useSearchParams();
    const caseParam = parseInt(searchParams.get("case") || "1") as MockCase;
    const [activeCase, setActiveCase] = useState<MockCase>(caseParam);
    const app = getMockData(activeCase);
    const canEdit = app.status === 'Draft';
    const { setBreadcrumbs, setRightContent } = useSidebar();

    useEffect(() => {
        if (caseParam && [1, 2, 3].includes(caseParam)) {
            setActiveCase(caseParam);
        }
    }, [caseParam]);

    useEffect(() => {
        setBreadcrumbs([
            { label: "Mockup", href: "/dashboard/applications/mockup" },
            { label: `App Detail — ${CASE_LABELS[activeCase].description}`, isActive: true },
        ]);

        setRightContent(
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    className="font-bold"
                    onClick={() => {}}
                    disabled
                >
                    บันทึกและกลับ
                </Button>
                <Button
                    className="font-bold bg-chaiyo-blue hover:bg-chaiyo-blue/90 text-white"
                    onClick={() => {}}
                    disabled
                >
                    ส่งพิจารณา
                </Button>
            </div>
        );

        return () => {
            setBreadcrumbs([]);
            setRightContent(null);
        };
    }, [activeCase, setBreadcrumbs, setRightContent]);

    return (
        <div className="h-full overflow-y-auto no-scrollbar bg-sidebar">
            <div className="max-w-6xl mx-auto p-6 lg:p-8 space-y-8">

                {/* ═══════════════════════════════════════════════════════════
                    CASE SWITCHER
                ═══════════════════════════════════════════════════════════ */}
                <div className="bg-white rounded-2xl border border-border-strong p-1.5 flex gap-1">
                    {([1, 2, 3] as MockCase[]).map((c) => (
                        <button
                            key={c}
                            onClick={() => setActiveCase(c)}
                            className={cn(
                                "flex-1 rounded-xl py-3 px-4 text-sm font-bold transition-all duration-200",
                                activeCase === c
                                    ? "bg-chaiyo-blue text-white shadow-md"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                            )}
                        >
                            <span className="block text-xs font-medium opacity-70 mb-0.5">{CASE_LABELS[c].label}</span>
                            {CASE_LABELS[c].description}
                        </button>
                    ))}
                </div>

                {/* ═══════════════════════════════════════════════════════════
                    SECTION 1: APP HEADER
                ═══════════════════════════════════════════════════════════ */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground tracking-tight">
                                {app.applicantName}
                            </h1>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant={getStatusBadgeVariant(app.status)}>
                                    {getStatusLabel(app.status)}
                                </Badge>
                                <span className="text-xs text-gray-400">ดำเนินการล่าสุด: {app.lastActionTime}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2.5">
                        <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-xs text-gray-400">เบอร์โทร</span>
                            <span className="text-sm text-gray-700 font-semibold">{app.phone}</span>
                        </div>
                        <div className="w-px h-4 bg-gray-200"></div>
                        <div className="flex items-center gap-1.5">
                            <MessageCircle className="w-3.5 h-3.5 text-[#00B900]" />
                            <span className="text-xs text-gray-400">LINE</span>
                            <span className="text-sm text-gray-700 font-semibold">-</span>
                        </div>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════
                    SECTION 2: APP DETAIL
                ═══════════════════════════════════════════════════════════ */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left: Summary Cards Grid */}
                    <div className="grid grid-cols-2 gap-2 flex-1">
                        <SummaryCard
                            title="ข้อมูลผู้กู้"
                            value={
                                app.checkStatus === 'soft_block' ? (
                                    <div className="flex items-center gap-1.5 text-amber-600">
                                        <AlertTriangle className="w-5 h-5 flex-shrink-0" strokeWidth={2.5} />
                                        <span>รอตรวจสอบเพิ่มเติม {('reasonCodes' in app && app.reasonCodes) ? `(${app.reasonCodes.join(', ')})` : ''}</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5 text-emerald-600">
                                        <ShieldCheck className="w-5 h-5 flex-shrink-0" strokeWidth={2.5} />
                                        <span>ผ่านการตรวจสอบ</span>
                                    </div>
                                )
                            }
                            isEmpty={!app.customerType}
                            icon={<User className="w-24 h-24" />}
                            onEdit={canEdit ? () => {} : undefined}
                            onView={!canEdit && app.customerType ? () => {} : undefined}
                        />
                        <SummaryCard
                            title="หลักประกัน"
                            value={app.collateralType}
                            isBold
                            isEmpty={!app.collateralType}
                            icon={<Car className="w-24 h-24" />}
                            onEdit={canEdit ? () => {} : undefined}
                            onView={!canEdit && app.collateralType ? () => {} : undefined}
                        />
                        <SummaryCard
                            title="อาชีพและรายได้"
                            value={`${app.incomePerMonth.toLocaleString()}`}
                            unit="บาท/เดือน"
                            isEmpty={app.incomePerMonth === 0}
                            icon={<Coins className="w-24 h-24" />}
                            onEdit={canEdit ? () => {} : undefined}
                            onView={!canEdit && app.incomePerMonth > 0 ? () => {} : undefined}
                        />
                        <SummaryCard
                            title="หนี้สิน"
                            value={`${app.debtPerMonth.toLocaleString()}`}
                            unit="บาท/เดือน"
                            isEmpty={app.debtPerMonth === 0}
                            icon={<Wallet className="w-24 h-24" />}
                            onEdit={canEdit ? () => {} : undefined}
                            onView={!canEdit && app.debtPerMonth > 0 ? () => {} : undefined}
                        />
                        <SummaryCard
                            title="ผู้ค้ำประกัน"
                            value={`${app.guarantorCount} คน`}
                            isEmpty={app.guarantorCount === 0}
                            icon={<Users className="w-24 h-24" />}
                            onEdit={canEdit ? () => {} : undefined}
                            onView={!canEdit && app.guarantorCount > 0 ? () => {} : undefined}
                        />
                    </div>

                    {/* Right: Loan Detail Panel */}
                    <div className="w-full lg:w-[380px] shrink-0">
                        <div className="bg-white rounded-2xl overflow-hidden border border-border-strong relative group w-full flex flex-col hover:shadow-md transition-all duration-300">
                            {/* Dark Blue Header */}
                            <div className="p-6 text-white relative overflow-hidden bg-chaiyo-blue">
                                <div className="relative z-10">
                                    <div className="flex justify-between items-center w-full">
                                        <div className="px-3 py-1 rounded-full bg-white/10 text-[10px] font-bold backdrop-blur-sm tracking-widest uppercase">
                                            {app.loanProductLabel}
                                        </div>
                                        {canEdit ? (
                                            <button
                                                className="bg-white hover:bg-gray-100 text-chaiyo-blue rounded-full h-8 px-4 text-xs font-bold transition-all flex items-center gap-1.5"
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                                แก้ไข
                                            </button>
                                        ) : (
                                            <button
                                                className="bg-white/20 hover:bg-white/30 text-white rounded-full h-8 px-4 text-xs font-bold transition-all flex items-center gap-1.5 backdrop-blur-sm"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                ดูรายละเอียด
                                            </button>
                                        )}
                                    </div>

                                    <h3 className="text-2xl font-bold mt-4 tracking-wide">{app.loanProductName}</h3>

                                    {/* Amount */}
                                    <div className="mt-6">
                                        <div className="flex flex-col justify-center backdrop-blur-sm">
                                            <p className="text-xs text-white/80 mb-2 font-medium">วงเงินสินเชื่อ</p>
                                            <div className="flex items-baseline gap-1.5">
                                                <span className="text-[36px] font-bold text-white leading-none tracking-tight">{app.loanAmount.toLocaleString()}</span>
                                                <span className="text-base text-white/80">บาท</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer Stats */}
                                    <div className="w-full h-px bg-white/10 mt-5 mb-4"></div>
                                    <div className="grid grid-cols-3 gap-2 pb-1 pl-1">
                                        <div>
                                            <p className="text-[11px] text-white/80 mb-1 font-medium tracking-wide">ค่างวด</p>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-[20px] font-bold text-white leading-none tracking-tight">{app.installment.toLocaleString()}</span>
                                            </div>
                                            <p className="text-[10px] text-white/60">บาท/งวด</p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-white/80 mb-1 font-medium tracking-wide">ระยะเวลาผ่อน</p>
                                            <div className="flex items-baseline gap-1.5">
                                                <span className="text-[20px] font-bold text-white leading-none tracking-tight">{app.term}</span>
                                            </div>
                                            <p className="text-[10px] text-white/60">งวด</p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-white/80 mb-1 font-medium tracking-wide">อัตราดอกเบี้ย</p>
                                            <span className="text-[20px] font-bold text-white leading-none tracking-tight">{app.interestRate}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* White Body */}
                            <div className="p-6 bg-white flex-1 flex flex-col pt-5">
                                <ul className="space-y-3 flex-1">
                                    {/* Insurance */}
                                    <li className="text-sm flex items-start gap-3 p-3 rounded-xl transition-all border bg-blue-50/50 border-blue-100 pb-4">
                                        <div className="mt-0.5 rounded-full p-1 shrink-0 bg-blue-100">
                                            <ShieldCheck className="w-4 h-4 text-blue-600" strokeWidth={2.5} />
                                        </div>
                                        <div className="flex-1">
                                            <span className="leading-snug font-bold text-sm text-blue-900">
                                                {app.insurance.company}
                                            </span>
                                            <div className="text-xs text-blue-700/70 py-0.5 font-medium border-b border-blue-200/50 mb-1 pb-1">
                                                {app.insurance.premium}
                                            </div>
                                            <div className="flex flex-col gap-0.5 text-xs text-gray-500 mt-1.5 font-normal leading-relaxed">
                                                <div className="flex justify-between">
                                                    <span>{app.insurance.fee}</span>
                                                </div>
                                                <div className="flex justify-between text-blue-800 font-medium">
                                                    <span>{app.insurance.installmentFee}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>

                                    {/* Gift card */}
                                    <li className="text-sm flex items-start gap-3 p-3 rounded-xl transition-all border bg-amber-50/50 border-amber-100">
                                        <div className="mt-0.5 rounded-full p-1 shrink-0 bg-amber-100">
                                            <Gift className="w-4 h-4 text-amber-600" strokeWidth={2.5} />
                                        </div>
                                        <div className="flex-1">
                                            <span className="leading-snug font-bold text-sm text-amber-900">
                                                ฟรี! บัตรเงินไชโย
                                            </span>
                                            <p className="text-xs text-gray-500 mt-0.5 font-normal leading-relaxed">
                                                วงเงินหมุนเวียนพร้อมใช้ จ่ายเงินต้นไปแล้วเท่าไร กดใช้เพิ่มได้เท่านั้น ไม่มีค่าธรรมเนียม
                                            </p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════
                    SECTION 3: HISTORY LOG
                ═══════════════════════════════════════════════════════════ */}
                <div className="pt-4">
                    <h2 className="text-xl font-bold text-foreground mb-6">ประวัติการดำเนินการ</h2>
                    <div className="bg-white rounded-xl border border-gray-200 px-6 divide-y divide-gray-100">
                        {app.historyLog.map((entry, index) => (
                            <div key={index} className="flex items-start gap-6 py-5">
                                <div className="w-28 shrink-0 pt-0.5">
                                    <p className="text-sm font-medium text-gray-600">{entry.date}</p>
                                    {entry.time && <p className="text-xs text-gray-400 mt-0.5">{entry.time}</p>}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-foreground">{entry.title}</p>
                                    <p className="text-xs text-gray-500 mt-1">ทำรายการโดย <span className="font-medium text-gray-700">{entry.team}</span></p>
                                </div>
                                {entry.result && (
                                    <div className="shrink-0 flex items-center pt-1">
                                        <Badge variant="neutral">{entry.result}</Badge>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════
                    SECTION 4: OTHER (Maker - always shown in mockup)
                ═══════════════════════════════════════════════════════════ */}
                {canEdit && (
                    <div>
                        <h2 className="text-xl font-bold text-foreground mb-4">อื่นๆ</h2>
                        <div className="border border-gray-200 rounded-xl bg-white p-5 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-foreground">ยกเลิกแบบร่าง</p>
                                <p className="text-xs text-gray-400 mt-0.5">โดยพนักงานสาขา</p>
                            </div>
                            <Button variant="destructive" size="sm">
                                ยกเลิกแบบร่าง
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function MockupDetailPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-gray-500">กำลังโหลดข้อมูลจำลอง...</div>}>
            <MockupContent />
        </Suspense>
    );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SummaryCard({
    title,
    value,
    unit,
    isBold = false,
    icon,
    isEmpty = false,
    onEdit,
    onView,
}: {
    title: string;
    value: React.ReactNode;
    unit?: string;
    isBold?: boolean;
    icon?: React.ReactNode;
    isEmpty?: boolean;
    onEdit?: () => void;
    onView?: () => void;
}) {
    return (
        <div className={cn(
            "rounded-2xl p-5 flex flex-col justify-between min-h-[140px] group relative overflow-hidden transition-all duration-300",
            isEmpty
                ? "bg-white border-2 border-dashed border-gray-200"
                : "bg-gray-50/80"
        )}>
            {/* Background Icon Watermark */}
            {icon && (
                <div className={cn(
                    "absolute -bottom-4 -right-4 transition-colors duration-300 pointer-events-none",
                    isEmpty ? "text-gray-100/60 group-hover:text-gray-200/80" : "text-gray-200/50 group-hover:text-gray-200"
                )}>
                    {icon}
                </div>
            )}

            <div className="relative z-10">
                <p className={cn("text-sm mb-2 font-medium", isEmpty ? "text-gray-400" : "text-gray-500")}>{title}</p>
                {isEmpty ? (
                    <p className="text-xl font-normal text-gray-300 mt-1">-</p>
                ) : (
                    <>
                        <div className={`text-xl font-bold text-foreground tracking-tight`}>{value}</div>
                        {unit && <p className="text-sm text-gray-400 mt-1">{unit}</p>}
                    </>
                )}
            </div>
            {onEdit && (
                <Button
                    variant={isEmpty ? "default" : "outline"}
                    onClick={onEdit}
                    className={cn(
                        "relative z-10 rounded-full h-8 px-4 text-xs font-bold mt-4 self-start flex items-center gap-1.5",
                        isEmpty
                            ? "bg-chaiyo-blue text-white shadow-md"
                            : "bg-white hover:bg-gray-50 border-gray-200 text-gray-600 hover:text-chaiyo-blue shadow-sm"
                    )}
                >
                    {isEmpty ? <Plus className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
                    {isEmpty ? "เพิ่มข้อมูล" : "แก้ไข"}
                </Button>
            )}
            {onView && !onEdit && !isEmpty && (
                <Button
                    variant="outline"
                    onClick={onView}
                    className="relative z-10 rounded-full h-8 px-4 text-xs font-bold mt-4 self-start flex items-center gap-1.5 bg-white hover:bg-gray-50 border-gray-200 text-gray-500 hover:text-chaiyo-blue shadow-sm"
                >
                    <Eye className="w-3.5 h-3.5" />
                    ดูรายละเอียด
                </Button>
            )}
        </div>
    );
}
