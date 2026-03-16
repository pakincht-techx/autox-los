"use client";

import React, { useState, useEffect } from "react";
import { useSidebar } from "@/components/layout/SidebarContext";
import { ApplicationStatus } from "@/components/applications/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Phone, MessageCircle, User, Pencil, Star, FileText, Check, ShieldCheck, Gift, Car, Wallet, Coins, Users, Plus, ThumbsUp, ThumbsDown, Undo2, Eye, AlertTriangle, ShieldAlert, ClipboardCheck, MessageSquare, Paperclip } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog";

// ─── Types ───────────────────────────────────────────────────────────────────

type ViewMode = 'maker' | 'approver' | 'readonly';

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

// ─── Mock Data ───────────────────────────────────────────────────────────────

const BASE_MOCK_APP = {
    id: "1",
    applicationNo: "25680313ULCPL0001",
    applicantName: "สมชาย ใจดี",
    applicantInitials: "JS",
    status: "Draft" as ApplicationStatus,
    phone: "080-000-0000",
    lastActionTime: "14-03-2569 10:30",

    // Section 2: Detail cards
    customerType: "ปกติ",
    collateralType: "รถมอเตอร์ไซต์",
    incomePerMonth: 25000,
    debtPerMonth: 8500,
    guarantorCount: 1,

    // Loan detail
    loanProductLabel: "ULCR",
    loanProductName: "จำนำรถมอเตอร์ไซต์ผ่อนรายเดือน",
    loanAmount: 20000,
    interestRate: 24,
    term: 60,
    installment: 3000,
    insurance: {
        company: "วิริยะประกันภัย",
        logo: "/insurance-logo/Property 1=Viriya.png",
        tier: "ชั้น 1",
        premium: 20000,
        coverage: 500000,
        repairType: "ซ่อมศูนย์",
    },
    totalInstallmentWithInsurance: 4000,
    maxLoanAmount: 440000,
    maxInstallment: 12656,

    // Section 3: History log
    historyLog: [
        {
            date: "13 มี.ค. 2569",
            time: "10:30 น.",
            title: "สร้างใบสมัคร",
            team: "พนักงานสาขา",
            result: "",
            comment: undefined as string | undefined,
            attachments: undefined as { name: string; url: string }[] | undefined,
        },
    ],
};

/** Returns mock app data based on the mockCase query param (1, 2, or 3). */
function getMockApp(mockCase: string | null) {
    switch (mockCase) {
        case '1': // Draft — only customer info filled (Normal)
            return {
                ...BASE_MOCK_APP,
                applicationNo: "25680313ULCPL0001",
                collateralType: "",
                incomePerMonth: 0,
                debtPerMonth: 0,
                guarantorCount: 0,
            };
        case '2': // In Review — only customer info filled (Softblock)
            return {
                ...BASE_MOCK_APP,
                applicationNo: "25680313ULCPL0002",
                status: "In Review" as ApplicationStatus,
                collateralType: "",
                incomePerMonth: 0,
                debtPerMonth: 0,
                guarantorCount: 0,
            };
        case '3': // Draft — all sections filled
            return {
                ...BASE_MOCK_APP,
                applicationNo: "25680313ULCPL0003",
            };
        default:
            return BASE_MOCK_APP;
    }
}

// ─── Page Component ──────────────────────────────────────────────────────────

export default function ApplicationDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { setBreadcrumbs, setRightContent, devRole } = useSidebar();
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const searchParams = useSearchParams();
    const from = searchParams.get('from');
    const statusParam = searchParams.get('status');
    const mockCase = searchParams.get('mockCase');
    const checkStatus = mockCase === '2' ? 'soft_block' : searchParams.get('checkStatus'); // normal | soft_block
    const reasonCodes = mockCase === '2'
        ? ['S01', 'S03']
        : (searchParams.get('reasons')?.split(',').filter(Boolean) || []);
    const app = getMockApp(mockCase);

    // ── Derive view mode from source + role ───────────────────────────────
    // from=my → maker (editable)
    // from=all + legal-team → approver (approve/reject/send-back)
    // from=all + branch-staff → readonly (view-only, no actions)
    const viewMode: ViewMode = from === 'all'
        ? (devRole === 'legal-team' ? 'approver' : 'readonly')
        : 'maker';

    // ── Status: approver/readonly defaults to "In Review", maker keeps Draft
    const [currentStatus, setCurrentStatus] = useState<ApplicationStatus>(
        viewMode === 'maker' ? app.status : 'In Review'
    );
    const canEdit = viewMode === 'maker' && !['In Review', 'Approved', 'Rejected', 'Cancelled'].includes(currentStatus);

    // ── Approver action dialogs ──────────────────────────────────────────
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
    const [reviewResult, setReviewResult] = useState<string>('');
    const [reviewComment, setReviewComment] = useState<string>('');
    const [reviewAttachments, setReviewAttachments] = useState<{ file: File; url: string }[]>([]);
    const [historyLog, setHistoryLog] = useState(app.historyLog);
    const [customerStatusOverride, setCustomerStatusOverride] = useState<string | null>(null);

    // ── Set breadcrumbs + right content ──────────────────────────────────
    useEffect(() => {
        // If redirected from soft block, change status to In Review
        if (statusParam === 'in-review' && currentStatus !== 'In Review') {
            setCurrentStatus('In Review');
        }

        const firstName = app.applicantName.split(' ')[0];
        const breadcrumbMap: Record<string, { label: string; href: string }> = {
            all: { label: "รายการใบสมัครทั้งหมด", href: "/dashboard/all-applications" },
            my: { label: "รายการใบสมัครของฉัน", href: "/dashboard/applications" },
        };
        const source = breadcrumbMap[from || 'my'] || breadcrumbMap.my;

        setBreadcrumbs([
            { label: source.label, href: source.href },
            { label: `...${app.applicationNo.slice(-6)} (${firstName})`, isActive: true }
        ]);

        if (canEdit) {
            setRightContent(null);
        } else if (viewMode === 'approver' && currentStatus !== 'Sent Back') {
            // Approver (legal team): single review submission button — only when still In Review
            setRightContent(
                <div className="flex items-center gap-2">
                    <Button
                        className="font-bold bg-chaiyo-blue hover:bg-chaiyo-blue/90 text-white"
                        onClick={() => setReviewDialogOpen(true)}
                    >
                        <MessageSquare className="w-4 h-4 mr-1.5" /> ให้ความเห็น
                    </Button>
                </div>
            );
        } else {
            // Readonly or Sent Back: no actions
            setRightContent(null);
        }

        return () => {
            setBreadcrumbs([]);
            setRightContent(null);
        };
    }, [app.applicationNo, app.applicantName, from, setBreadcrumbs, setRightContent, viewMode, canEdit, currentStatus, statusParam]);

    return (
        <div className="h-full overflow-y-auto no-scrollbar bg-sidebar">
            <div className="max-w-6xl mx-auto p-6 lg:p-8 space-y-8">

                {/* ═══════════════════════════════════════════════════════════
                    SECTION 1: APP HEADER
                ═══════════════════════════════════════════════════════════ */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">

                        <div>
                            <h1 className="text-2xl font-bold text-foreground tracking-tight">
                                {app.applicantName}
                            </h1>
                            <div className="flex items-center gap-3 mt-2">
                                <Badge variant={getStatusBadgeVariant(currentStatus)}>
                                    {getStatusLabel(currentStatus)}
                                </Badge>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <span className="text-gray-300">•</span>
                                    <span className="font-medium tracking-wide">{app.applicationNo}</span>
                                    <span className="text-gray-300">•</span>
                                    <span>ดำเนินการล่าสุด: {app.lastActionTime}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="text-gray-600 hover:text-foreground">
                            <Phone className="w-4 h-4 mr-1.5" />
                            <span>{app.phone}</span>
                        </Button>
                        <Button variant="outline" size="sm" className="text-gray-600 hover:text-foreground">
                            <MessageCircle className="w-4 h-4 mr-1.5" />
                            <span>LINE</span>
                        </Button>
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
                                customerStatusOverride === 'not_pass' ? (
                                    <div className="flex items-center gap-1.5 text-red-600">
                                        <ShieldAlert className="w-5 h-5 flex-shrink-0" strokeWidth={2.5} />
                                        <span>ไม่ผ่านการตรวจสอบ</span>
                                    </div>
                                ) : customerStatusOverride === 'discretion' ? (
                                    <div className="flex items-center gap-1.5 text-emerald-600">
                                        <ShieldCheck className="w-5 h-5 flex-shrink-0" strokeWidth={2.5} />
                                        <span>ผ่านการตรวจสอบ</span>
                                    </div>
                                ) : checkStatus === 'soft_block' ? (
                                    <div className="flex items-center gap-1.5 text-amber-600">
                                        <AlertTriangle className="w-5 h-5 flex-shrink-0" strokeWidth={2.5} />
                                        <span>รอตรวจสอบเพิ่มเติม {reasonCodes.length > 0 ? `(${reasonCodes.join(', ')})` : ''}</span>
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
                            onEdit={canEdit ? () => router.push(`/dashboard/new-application/${app.applicationNo}/customer-info?state=draft`) : undefined}
                            onView={!canEdit ? () => router.push(`/dashboard/new-application/${app.applicationNo}/customer-info?state=readonly`) : undefined}
                        />
                        <SummaryCard
                            title="หลักประกัน"
                            value={app.collateralType}
                            isBold
                            isEmpty={!app.collateralType}
                            icon={<Car className="w-24 h-24" />}
                            onEdit={canEdit ? () => router.push(`/dashboard/new-application/${app.applicationNo}/collateral-info?state=draft`) : undefined}
                            onView={!canEdit ? () => router.push(`/dashboard/new-application/${app.applicationNo}/collateral-info?state=readonly`) : undefined}
                        />
                        <SummaryCard
                            title="อาชีพและรายได้"
                            value={`${app.incomePerMonth.toLocaleString()}`}
                            unit="บาท/เดือน"
                            isEmpty={app.incomePerMonth === 0}
                            icon={<Coins className="w-24 h-24" />}
                            onEdit={canEdit ? () => router.push(`/dashboard/new-application/${app.applicationNo}/income?state=draft`) : undefined}
                            onView={!canEdit ? () => router.push(`/dashboard/new-application/${app.applicationNo}/income?state=readonly`) : undefined}
                        />
                        <SummaryCard
                            title="หนี้สิน"
                            value={`${app.debtPerMonth.toLocaleString()}`}
                            unit="บาท/เดือน"
                            isEmpty={app.debtPerMonth === 0 || app.debtPerMonth === null}
                            icon={<Wallet className="w-24 h-24" />}
                            onEdit={canEdit ? () => router.push(`/dashboard/new-application/${app.applicationNo}/debt?state=draft`) : undefined}
                            onView={!canEdit ? () => router.push(`/dashboard/new-application/${app.applicationNo}/debt?state=readonly`) : undefined}
                        />
                        <SummaryCard
                            title="ผู้ค้ำประกัน"
                            value={`${app.guarantorCount} คน`}
                            isEmpty={app.guarantorCount === 0}
                            icon={<Users className="w-24 h-24" />}
                            onEdit={canEdit ? () => router.push(`/dashboard/new-application/${app.applicationNo}/guarantors?state=draft`) : undefined}
                            onView={!canEdit ? () => router.push(`/dashboard/new-application/${app.applicationNo}/guarantors?state=readonly`) : undefined}
                        />
                    </div>

                    {/* Right: Loan Detail Panel */}
                    <div className="w-full lg:w-[380px] shrink-0">

                        {/* Outer Gray Container */}
                        <div className="rounded-2xl bg-gray-50/80 p-5 flex flex-col h-full space-y-4">

                            {/* Header */}
                            <div className="flex items-center justify-between pb-1">
                                <p className="text-lg font-bold text-foreground">รายละเอียดสินเชื่อ</p>
                                {canEdit ? (
                                    <Button
                                        variant="outline"
                                        onClick={() => router.push(`/dashboard/new-application/${app.applicationNo}/loan-calculator?state=draft`)}
                                        className="h-8 px-4 text-xs font-bold rounded-full bg-white hover:bg-gray-50 border-gray-200 text-gray-700 shadow-sm transition-colors"
                                    >
                                        <Pencil className="w-3 h-3 mr-1.5" /> แก้ไข
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outline"
                                        onClick={() => router.push(`/dashboard/new-application/${app.applicationNo}/loan-calculator?state=readonly`)}
                                        className="h-8 px-4 text-xs font-bold rounded-full bg-white hover:bg-gray-50 border-gray-200 text-gray-700 shadow-sm transition-colors"
                                    >
                                        <Eye className="w-3 h-3 mr-1.5" /> ดูรายละเอียด
                                    </Button>
                                )}
                            </div>

                            {/* ── Card 1: Loan Info & Add-ons ── */}
                            <div className="bg-white rounded-2xl p-5 border border-gray-100/50">
                                {/* Product Tag */}
                                <div className="mb-2">
                                    <span className="px-2 py-0.5 rounded-full bg-[#0d005f] text-white text-[10px] font-bold tracking-wider">
                                        {app.loanProductLabel}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-4 leading-tight">{app.loanProductName}</h3>

                                <div className="w-full h-px bg-gray-100 mb-4"></div>

                                {/* Loan Stats Table */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">วงเงิน:</span>
                                        <span className="font-bold text-foreground">{app.loanAmount.toLocaleString()} บาท</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">อัตราดอกเบี้ย:</span>
                                        <span className="font-bold text-foreground">{app.interestRate}%</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">ระยะเวลาผ่อน:</span>
                                        <span className="font-bold text-foreground">{app.term} เดือน</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">ค่างวด:</span>
                                        <span className="font-bold text-foreground">{app.installment.toLocaleString()} บาท/เดือน</span>
                                    </div>
                                </div>

                                {/* Freebies (e.g. Chaiyo Card) */}
                                <div className="rounded-xl border border-gray-100 p-4 flex gap-4 mt-2">
                                    <div className="w-12 h-12 bg-[#0d005f] rounded-lg shrink-0 overflow-hidden relative border border-gray-100">
                                        {/* Simplified Mock Card Graphic */}
                                        <div className="absolute inset-0 flex flex-col">
                                            <div className="h-1/2 bg-[#0d005f]"></div>
                                            <div className="h-1/2 bg-[#ffd700] relative">
                                              <div className="absolute left-3 top-0 bottom-0 w-2 flex">
                                                 <div className="w-1/2 bg-red-600 h-full"></div>
                                                 <div className="w-1/2 bg-[#0d005f] h-full"></div>
                                              </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-foreground">ฟรี! บัตรกดเงินไชโย</p>
                                        <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                                            วงเงินหมุนเวียนพร้อมใช้<br/>จ่ายเงินต้นไปแล้วเท่าไรกดใช้เพิ่มได้เท่านั้น
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* ── Card 2: Insurance ── */}
                            <div className="bg-white rounded-2xl p-5 border border-gray-100/50">
                                <div className="flex items-center gap-3 mb-5">
                                    {app.insurance.logo ? (
                                        <img src={app.insurance.logo} alt={app.insurance.company} className="w-10 h-10 object-contain rounded-full bg-white border border-gray-50" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-[#0d005f] flex items-center justify-center p-2 text-white">
                                            <ShieldCheck className="w-5 h-5" strokeWidth={2} />
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-bold text-foreground">{app.insurance.company}</p>
                                        <p className="text-sm text-gray-400">{app.insurance.tier}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">ทุนประกัน:</span>
                                        <span className="font-bold text-foreground">300,000 บาท</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">ค่าเบี้ยประกัน:</span>
                                        <span className="font-bold text-foreground">{app.insurance.premium.toLocaleString()} บาท</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">ค่างวด:</span>
                                        <span className="font-bold text-foreground">500 บาท/เดือน</span>
                                    </div>
                                </div>
                            </div>

                            {/* ── Card 3: Summary Totals ── */}
                            <div className="bg-white rounded-2xl p-5 border border-gray-100/50">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 text-sm">วงเงินทั้งหมด:</span>
                                        <span className="font-bold text-foreground text-sm">{(app.loanAmount + app.insurance.premium).toLocaleString()} บาท</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex flex-col">
                                            <span className="text-gray-600 text-sm">ค่าผ่อนต่อเดือน:</span>
                                            <span className="text-xs text-gray-400 mt-0.5">*รวมสินเชื่อและประกัน</span>
                                        </div>
                                        <span className="font-bold text-foreground text-sm self-start">{(app.installment + 500).toLocaleString()} บาท</span>
                                    </div>
                                </div>
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
                        {historyLog.map((entry, index) => (
                            <div key={index} className="flex items-start gap-6 py-5">
                                <div className="w-28 shrink-0 pt-0.5">
                                    <p className="text-sm font-medium text-gray-600">{entry.date}</p>
                                    {entry.time && <p className="text-xs text-gray-400 mt-0.5">{entry.time}</p>}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-foreground">{entry.title}</p>
                                    <p className="text-xs text-gray-500 mt-1">ทำรายการโดย <span className="font-medium text-gray-700">{entry.team.replace(/^โดย\s*/, '')}</span></p>
                                    {/* Comment */}
                                    {entry.comment && (
                                        <div className="mt-2.5 flex items-start gap-1.5 text-xs text-gray-600 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
                                            <MessageSquare className="w-3.5 h-3.5 shrink-0 mt-0.5 text-gray-400" />
                                            <span className="leading-relaxed">{entry.comment}</span>
                                        </div>
                                    )}
                                    {/* Attachments */}
                                    {entry.attachments && entry.attachments.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-1.5">
                                            {entry.attachments.map((att, i) => (
                                                <a
                                                    key={i}
                                                    href={typeof att === 'string' ? undefined : att.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 border border-blue-100 rounded-md px-2 py-1 hover:bg-blue-100 hover:border-blue-300 transition-colors cursor-pointer"
                                                >
                                                    <Paperclip className="w-3 h-3 shrink-0" />
                                                    <span className="max-w-[160px] truncate">{typeof att === 'string' ? att : att.name}</span>
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {entry.result && (
                                    <div className="shrink-0 flex items-center pt-1">
                                        <Badge
                                            variant={
                                                entry.result.includes('ไม่ผ่าน') ? 'danger' :
                                                    entry.result.includes('ผ่าน') ? 'success' :
                                                        'neutral'
                                            }
                                        >
                                            {entry.result}
                                        </Badge>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════
                    SECTION 4: OTHER (Maker only)
                ═══════════════════════════════════════════════════════════ */}
                {canEdit && (
                    <div>
                        <h2 className="text-xl font-bold text-foreground mb-4">อื่นๆ</h2>
                        <div className="border border-gray-200 rounded-xl bg-white p-5 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-foreground">
                                    {currentStatus === 'Sent Back' ? 'ยกเลิกใบสมัคร' : 'ยกเลิกแบบร่าง'}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {currentStatus === 'Sent Back' ? 'ใบสมัครที่ถูกส่งกลับจากทีมตรวจสอบ' : 'โดยพนักงานสาขา'}
                                </p>
                            </div>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setCancelDialogOpen(true)}
                            >
                                ยกเลิกแบบร่าง
                            </Button>
                        </div>
                    </div>
                )}

                {/* ═══════════════════════════════════════════════════════════
                    DIALOGS
                ═══════════════════════════════════════════════════════════ */}

                {/* Cancel Dialog (Maker) */}
                <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>ยืนยันการยกเลิกแบบร่าง</DialogTitle>
                            <DialogDescription className="pt-2 text-sm text-gray-500">
                                คุณแน่ใจหรือไม่ว่าต้องการยกเลิกใบสมัคร <strong>{app.applicationNo}</strong>? การดำเนินการนี้ไม่สามารถย้อนกลับได้
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4 flex sm:justify-end gap-2">
                            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>ยกเลิก</Button>
                            <Button
                                variant="destructive"
                                onClick={() => {
                                    setCurrentStatus('Cancelled');
                                    setCancelDialogOpen(false);
                                }}
                            >
                                ยืนยันการยกเลิก
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Review Result Dialog (Legal Team / Approver) */}
                <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                    <DialogContent className="sm:max-w-[480px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                ให้ความเห็นสถานะลูกค้า
                            </DialogTitle>
                            <DialogDescription className="pt-2 text-sm text-gray-500 flex flex-col space-y-1">
                                <span>ผู้กู้: <strong className="text-gray-800">{app.applicantName}</strong></span>
                                <span>เลขที่ใบสมัคร: <strong className="text-gray-800">{app.applicationNo}</strong></span>
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-3">
                            <p className="text-sm font-semibold text-gray-700 mb-2">ผลการตรวจสอบ</p>
                            <label
                                className={cn(
                                    "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                                    reviewResult === 'discretion'
                                        ? "border-emerald-400 bg-emerald-50/50"
                                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                )}
                            >
                                <input
                                    type="radio"
                                    name="reviewResult"
                                    value="discretion"
                                    checked={reviewResult === 'discretion'}
                                    onChange={() => setReviewResult('discretion')}
                                    className="w-4 h-4 text-emerald-600 accent-emerald-600"
                                />
                                <div>
                                    <p className="text-sm font-bold text-gray-800">พิจารณาตามดุลยพินิจ</p>
                                    <p className="text-xs text-gray-400 mt-0.5">ผ่านการตรวจสอบ สามารถดำเนินการต่อได้</p>
                                </div>
                            </label>
                            <label
                                className={cn(
                                    "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                                    reviewResult === 'not_pass'
                                        ? "border-red-400 bg-red-50/50"
                                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                )}
                            >
                                <input
                                    type="radio"
                                    name="reviewResult"
                                    value="not_pass"
                                    checked={reviewResult === 'not_pass'}
                                    onChange={() => setReviewResult('not_pass')}
                                    className="w-4 h-4 text-red-600 accent-red-600"
                                />
                                <div>
                                    <p className="text-sm font-bold text-gray-800">ไม่ผ่านเกณฑ์การพิจารณา</p>
                                    <p className="text-xs text-gray-400 mt-0.5">ไม่ผ่านการตรวจสอบ ใบสมัครจะถูกปฏิเสธ</p>
                                </div>
                            </label>
                        </div>

                        {/* Additional Comments and Attachments */}
                        <div className="space-y-3 pt-2">
                            <p className="text-sm font-semibold text-gray-700">ความคิดเห็นเพิ่มเติมและการแนบเอกสาร (เฉพาะผู้ให้ความเห็น)</p>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">ความคิดเห็นเพิ่มเติม</label>
                                    <textarea
                                        value={reviewComment}
                                        onChange={(e) => setReviewComment(e.target.value)}
                                        className="w-full min-h-[80px] p-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20 transition-all resize-none"
                                        placeholder="ระบุความคิดเห็นหรือเหตุผลเพิ่มเติม..."
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">เอกสารประกอบการพิจารณา</label>
                                    <label className="border border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 hover:border-chaiyo-blue transition-all cursor-pointer">
                                        <input
                                            type="file"
                                            multiple
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            className="hidden"
                                            onChange={(e) => {
                                                const files = Array.from(e.target.files || []);
                                                const entries = files.map(f => ({ file: f, url: URL.createObjectURL(f) }));
                                                setReviewAttachments(prev => [...prev, ...entries]);
                                                e.target.value = ''; // allow re-selecting same file
                                            }}
                                        />
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                                            <Paperclip className="w-4 h-4 text-chaiyo-blue" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-chaiyo-blue">คลิกเพื่ออัปโหลด หรือลากไฟล์มาวางที่นี่</p>
                                            <p className="text-xs text-gray-400 mt-0.5">รองรับ PDF, JPG, PNG ขนาดไม่เกิน 5MB</p>
                                        </div>
                                    </label>
                                    {reviewAttachments.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-1.5">
                                            {reviewAttachments.map((entry, i) => (
                                                <div key={i} className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 border border-blue-100 rounded-md px-2 py-1">
                                                    <Paperclip className="w-3 h-3 shrink-0" />
                                                    <a
                                                        href={entry.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="max-w-[160px] truncate hover:underline cursor-pointer"
                                                    >{entry.file.name}</a>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            URL.revokeObjectURL(entry.url);
                                                            setReviewAttachments(prev => prev.filter((_, idx) => idx !== i));
                                                        }}
                                                        className="ml-0.5 text-blue-400 hover:text-red-500 transition-colors"
                                                    >✕</button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="mt-4 flex sm:justify-end gap-2">
                            <Button variant="outline" onClick={() => {
                                // Revoke URLs for attachments not yet submitted
                                reviewAttachments.forEach(e => URL.revokeObjectURL(e.url));
                                setReviewDialogOpen(false);
                                setReviewResult('');
                                setReviewComment('');
                                setReviewAttachments([]);
                            }}>ยกเลิก</Button>
                            <Button
                                disabled={!reviewResult}
                                className={cn(
                                    reviewResult === 'discretion' && "bg-emerald-600 hover:bg-emerald-700 text-white",
                                    reviewResult === 'not_pass' && "bg-red-600 hover:bg-red-700 text-white",
                                    !reviewResult && "opacity-50"
                                )}
                                onClick={() => {
                                    setCurrentStatus('Sent Back');
                                    setCustomerStatusOverride(reviewResult);

                                    const today = new Date();
                                    const dateStr = today.toLocaleString('th-TH', {
                                        day: '2-digit', month: 'short', year: 'numeric',
                                    });
                                    const timeStr = today.toLocaleString('th-TH', {
                                        hour: '2-digit', minute: '2-digit'
                                    }) + ' น.';

                                    const newLog = {
                                        date: dateStr,
                                        time: timeStr,
                                        title: 'ตรวจสอบสถานะผู้กู้',
                                        team: 'ฝ่ายตรวจสอบ (Legal Team)',
                                        result: reviewResult === 'not_pass' ? 'ไม่ผ่านการตรวจสอบ' : 'ผ่านการตรวจสอบ',
                                        comment: reviewComment.trim() || undefined,
                                        attachments: reviewAttachments.length > 0
                                            ? reviewAttachments.map(e => ({ name: e.file.name, url: e.url }))
                                            : undefined,
                                    };
                                    setHistoryLog(prev => [newLog, ...prev]);

                                    setReviewDialogOpen(false);
                                    setReviewResult('');
                                    setReviewComment('');
                                    // Don't revoke URLs here — they're still referenced in the history log
                                    setReviewAttachments([]);
                                }}
                            >
                                ยืนยันการส่งผล
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
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
                ? (onEdit ? "bg-white border-2 border-dashed border-gray-200" : "bg-gray-50/50 border border-border-subtle")
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
                        <div className={`text-xl font-bold text-foreground tracking-tight ${isBold ? '' : ''}`}>{value}</div>
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

function LoanDetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-white/80 rounded-xl px-4 py-3 flex items-center justify-between border border-blue-100/50">
            <span className="text-sm text-gray-600">{label}</span>
            <span className="text-sm font-bold text-foreground">{value}</span>
        </div>
    );
}
