"use client";

import React, { useState, useEffect } from "react";
import { useSidebar } from "@/components/layout/SidebarContext";
import { ApplicationStatus } from "@/components/applications/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Phone, MessageCircle, User, Pencil, Star, FileText, Check, ShieldCheck, Gift, Car, Wallet, Coins, Users, Plus, ThumbsUp, ThumbsDown, Undo2, Eye, AlertTriangle, ShieldAlert, ClipboardCheck, MessageSquare, Paperclip, CreditCard, Upload, CircleCheck, Circle, RefreshCw, Send, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/Checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogBody,
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
    applicantAge: 35,
    lastActionTime: "14-03-2569 10:30",

    // Section 2: Detail cards
    customerType: "ปกติ",
    collateralType: "รถมอเตอร์ไซต์",
    incomePerMonth: 25000,
    debtPerMonth: 8500,
    guarantorCount: 1,
    refinanceCount: 1,
    uploadedDocCount: 5,
    acceptedConsentCount: 3,

    // Module completion status
    moduleStatus: {
        customerInfo: true,
        collateral: true,
        loanDetail: true,
        income: true,
        debt: true,
        guarantor: true,
        refinance: true,
        documents: true,
        consent: false,
    } as Record<string, boolean>,

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
                uploadedDocCount: 0,
                acceptedConsentCount: 0,
                moduleStatus: {
                    customerInfo: true,
                    collateral: false,
                    loanDetail: false,
                    income: false,
                    debt: false,
                    guarantor: false,
                    documents: false,
                    consent: false,
                },
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
                uploadedDocCount: 0,
                acceptedConsentCount: 0,
                moduleStatus: {
                    customerInfo: true,
                    collateral: false,
                    loanDetail: false,
                    income: false,
                    debt: false,
                    guarantor: false,
                    documents: false,
                    consent: false,
                },
            };
        case '3': // Draft — all sections filled
            return {
                ...BASE_MOCK_APP,
                applicationNo: "25680313ULCPL0003",
            };
        case '4': // Draft — Land collateral, all sections filled
            return {
                ...BASE_MOCK_APP,
                id: "mock-4",
                applicationNo: "25690317TLTDL0009",
                applicantName: "สมศักดิ์ ที่ดินทอง",
                applicantInitials: "สท",
                status: "Draft" as ApplicationStatus,
                phone: "081-234-5678",
                applicantAge: 42,
                lastActionTime: "17-03-2569 10:00",
                customerType: "ปกติ",
                collateralType: "โฉนดที่ดิน",
                incomePerMonth: 30000,
                debtPerMonth: 5000,
                guarantorCount: 1,
                refinanceCount: 0,
                uploadedDocCount: 3,
                acceptedConsentCount: 2,
                moduleStatus: {
                    customerInfo: true,
                    collateral: true,
                    loanDetail: true,
                    income: true,
                    debt: true,
                    guarantor: true,
                    refinance: false,
                    documents: true,
                    consent: false,
                },
                loanProductLabel: "TLTD",
                loanProductName: "ที่ดิน (จำนำ) ผ่อนรายเดือน",
                loanAmount: 500000,
                interestRate: 15,
                term: 120,
                installment: 8075,
                insurance: {
                    company: "เทเวศประกันภัย",
                    logo: "",
                    tier: "",
                    premium: 5000,
                    coverage: 500000,
                    repairType: "",
                },
                totalInstallmentWithInsurance: 8075,
                maxLoanAmount: 750000,
                maxInstallment: 12113,
                historyLog: [
                    {
                        date: "17 มี.ค. 2569",
                        time: "09:00 น.",
                        title: "สร้างใบสมัคร",
                        team: "พนักงานสาขา",
                        result: "",
                        comment: undefined as string | undefined,
                        attachments: undefined as { name: string; url: string }[] | undefined,
                    },
                ],
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
    const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
    const [consentCompleted, setConsentCompleted] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
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
    const [softblockDetailOpen, setSoftblockDetailOpen] = useState(false);

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
            setRightContent(
                <Button
                    variant="default"
                    onClick={() => setIsSubmitDialogOpen(true)}
                >
                    <Send className="w-4 h-4 mr-2" /> ส่งใบสมัคร
                </Button>
            );
        } else if (viewMode === 'approver' && currentStatus !== 'Sent Back') {
            // Approver (legal team): single review submission button — only when still In Review
            setRightContent(
                <div className="flex items-center gap-2">
                    <Button
                        className="bg-chaiyo-blue hover:bg-chaiyo-blue/90 text-white"
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
                    <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2.5">
                        <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-xs text-gray-400">เบอร์โทร</span>
                            <span className="text-sm text-gray-700 font-semibold">{app.phone}</span>
                        </div>
                        <div className="w-px h-4 bg-gray-200"></div>
                        <div className="flex items-center gap-1.5">
                            <MessageCircle className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-xs text-gray-400">LINEID</span>
                            <span className="text-sm text-gray-700 font-semibold">-</span>
                        </div>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════
                    SOFTBLOCK ALERT BANNER (Legal Team / Approver)
                ═══════════════════════════════════════════════════════════ */}
                {viewMode === 'approver' && MOCK_BLOCK_ITEMS.some(b => b.type === 'softblock') && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                                <AlertTriangle className="w-4.5 h-4.5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-amber-900">
                                    ใบสมัครนี้มีรายการ Softblock ที่ต้องพิจารณา
                                </p>
                                <p className="text-xs text-amber-700 mt-0.5">
                                    พบ {MOCK_BLOCK_ITEMS.filter(b => b.type === 'softblock').length} รายการที่ต้องตรวจสอบจากทีม Legal / Compliance / Fraud
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSoftblockDetailOpen(true)}
                            className="shrink-0 border-amber-300 text-amber-700 hover:bg-amber-100 hover:text-amber-800"
                        >
                            <Eye className="w-4 h-4 mr-1.5" />
                            ดูรายละเอียด
                        </Button>
                    </div>
                )}

                {/* ═══════════════════════════════════════════════════════════
                    SECTION 2: APP DETAIL
                ═══════════════════════════════════════════════════════════ */}
                <div className="space-y-5">
                    {/* ── Group 1: 2-column grid ── */}
                    <div className="grid grid-cols-2 gap-2 auto-rows-[1fr]">
                        <SummaryCard
                            title="ข้อมูลผู้กู้"
                            value={`${app.applicantAge} ปี`}
                            isEmpty={!app.customerType}
                            icon={<User className="w-24 h-24" />}
                            completionStatus={app.moduleStatus.customerInfo ? 'completed' : 'incomplete'}
                            onEdit={canEdit ? () => router.push(`/dashboard/new-application/${app.applicationNo}/customer-info?state=draft`) : undefined}
                            onView={!canEdit ? () => router.push(`/dashboard/new-application/${app.applicationNo}/customer-info?state=readonly`) : undefined}
                        />
                        <SummaryCard
                            title="อาชีพและรายได้"
                            value={`${app.incomePerMonth.toLocaleString()}`}
                            unit="บาท/เดือน"
                            isEmpty={app.incomePerMonth === 0}
                            icon={<Coins className="w-24 h-24" />}
                            completionStatus={app.moduleStatus.income ? 'completed' : 'incomplete'}
                            onEdit={canEdit ? () => router.push(`/dashboard/new-application/${app.applicationNo}/income?state=draft`) : undefined}
                            onView={!canEdit ? () => router.push(`/dashboard/new-application/${app.applicationNo}/income?state=readonly`) : undefined}
                        />
                        <SummaryCard
                            title="หลักประกัน"
                            value={app.collateralType}
                            isBold
                            isEmpty={!app.collateralType}
                            icon={<Car className="w-24 h-24" />}
                            completionStatus={app.moduleStatus.collateral ? 'completed' : 'incomplete'}
                            onEdit={canEdit ? () => router.push(`/dashboard/new-application/${app.applicationNo}/collateral-info?state=draft`) : undefined}
                            onView={!canEdit ? () => router.push(`/dashboard/new-application/${app.applicationNo}/collateral-info?state=readonly`) : undefined}
                        />
                        <SummaryCard
                            title="ภาระหนี้"
                            value={`${app.debtPerMonth.toLocaleString()}`}
                            unit="บาท/เดือน"
                            isEmpty={app.debtPerMonth === 0 || app.debtPerMonth === null}
                            icon={<Wallet className="w-24 h-24" />}
                            completionStatus={app.moduleStatus.debt ? 'completed' : 'incomplete'}
                            onEdit={canEdit ? () => router.push(`/dashboard/new-application/${app.applicationNo}/debt?state=draft`) : undefined}
                            onView={!canEdit ? () => router.push(`/dashboard/new-application/${app.applicationNo}/debt?state=readonly`) : undefined}
                        />
                        <SummaryCard
                            title="ผู้ค้ำประกัน"
                            value={`${app.guarantorCount} คน`}
                            isEmpty={app.guarantorCount === 0}
                            icon={<Users className="w-24 h-24" />}
                            completionStatus={app.moduleStatus.guarantor ? 'completed' : 'incomplete'}
                            onEdit={canEdit ? () => router.push(`/dashboard/new-application/${app.applicationNo}/guarantors?state=draft`) : undefined}
                            onView={!canEdit ? () => router.push(`/dashboard/new-application/${app.applicationNo}/guarantors?state=readonly`) : undefined}
                        />
                        <SummaryCard
                            title="รีไฟแนนซ์"
                            value={`${app.refinanceCount} รายการ`}
                            isEmpty={app.refinanceCount === 0}
                            icon={<RefreshCw className="w-24 h-24" />}
                            completionStatus={app.moduleStatus.refinance ? 'completed' : 'incomplete'}
                            onEdit={canEdit ? () => router.push(`/dashboard/new-application/${app.applicationNo}/refinance?state=draft`) : undefined}
                            onView={!canEdit ? () => router.push(`/dashboard/new-application/${app.applicationNo}/refinance?state=readonly`) : undefined}
                        />
                    </div>

                    {/* ── Group 2: รายละเอียดสินเชื่อ (full-width / 2-col span) ── */}
                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">รายละเอียดสินเชื่อ</p>
                        <SummaryCard
                            title="รายละเอียดสินเชื่อและประกันภัย"
                            value={app.loanProductName}
                            isBold
                            isEmpty={false}
                            icon={<FileText className="w-24 h-24" />}
                            completionStatus={app.moduleStatus.loanDetail ? 'completed' : 'incomplete'}
                            onEdit={canEdit ? () => router.push(`/dashboard/new-application/${app.applicationNo}/loan-calculator?state=draft`) : undefined}
                            onView={!canEdit ? () => router.push(`/dashboard/new-application/${app.applicationNo}/loan-calculator?state=readonly`) : undefined}
                        />
                    </div>

                    {/* ── Group 3: เอกสารและสัญญา ── */}
                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">เอกสารและสัญญา</p>
                        <div className="grid grid-cols-2 gap-2 auto-rows-[1fr]">
                            <SummaryCard
                                title="อัพโหลดเอกสาร"
                                value={`${app.uploadedDocCount} ไฟล์`}
                                isEmpty={app.uploadedDocCount === 0}
                                icon={<Upload className="w-24 h-24" />}
                                completionStatus={app.moduleStatus.documents ? 'completed' : 'incomplete'}
                                onEdit={canEdit ? () => router.push(`/dashboard/new-application/${app.applicationNo}/documents?state=draft`) : undefined}
                                onView={!canEdit ? () => router.push(`/dashboard/new-application/${app.applicationNo}/documents?state=readonly`) : undefined}
                            />
                            {(consentCompleted || (app.acceptedConsentCount > 0 && mockCase !== '3')) && (
                                <SummaryCard
                                    title="T&C Consent"
                                    value={consentCompleted ? '3 รายการ' : `${app.acceptedConsentCount} รายการ`}
                                    isEmpty={false}
                                    icon={<ClipboardCheck className="w-24 h-24" />}
                                    completionStatus={'completed'}
                                    onView={() => router.push(`/dashboard/new-application/${app.applicationNo}/consent?state=readonly`)}
                                />
                            )}
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
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>ยืนยันการยกเลิกแบบร่าง</DialogTitle>
                            <DialogDescription>
                                คุณแน่ใจหรือไม่ว่าต้องการยกเลิกใบสมัคร <strong>{app.applicationNo}</strong>? การดำเนินการนี้ไม่สามารถย้อนกลับได้
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" className="min-w-[104px]" onClick={() => setCancelDialogOpen(false)}>ยกเลิก</Button>
                            <Button
                                variant="destructive"
                                className="min-w-[104px]"
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

                {/* Submit Application Dialog (Maker) — with block warnings */}
                <SubmitApplicationDialog
                    open={isSubmitDialogOpen}
                    onOpenChange={setIsSubmitDialogOpen}
                    isSubmitting={isSubmitting}
                    allPassed={mockCase === '3'}
                    onSubmit={() => {
                        setIsSubmitting(true);
                        setTimeout(() => {
                            setIsSubmitting(false);
                            setIsSubmitDialogOpen(false);
                            setCurrentStatus('In Review');
                            if (mockCase === '3') {
                                setConsentCompleted(true);
                            }

                            // Stamp "ตรวจสอบใบสมัคร" in history log
                            const today = new Date();
                            const dateStr = today.toLocaleString('th-TH', {
                                day: '2-digit', month: 'short', year: 'numeric',
                            });
                            const timeStr = today.toLocaleString('th-TH', {
                                hour: '2-digit', minute: '2-digit'
                            }) + ' น.';
                            const submitLog = {
                                date: dateStr,
                                time: timeStr,
                                title: 'ตรวจสอบใบสมัคร',
                                team: 'พนักงานสาขา',
                                result: '',
                                comment: undefined as string | undefined,
                                attachments: undefined as { name: string; url: string }[] | undefined,
                            };
                            setHistoryLog(prev => [submitLog, ...prev]);

                            toast.success("ส่งใบสมัครสำเร็จ", {
                                description: "ใบสมัครของคุณถูกส่งเข้าสู่ระบบการพิจารณาแล้ว",
                            });
                        }, 1500);
                    }}
                />

                {/* Softblock Detail Dialog (Legal Team) */}
                <Dialog open={softblockDetailOpen} onOpenChange={setSoftblockDetailOpen}>
                    <DialogContent size="lg">
                        <DialogHeader>
                            <DialogTitle>รายการ Softblock</DialogTitle>
                            <DialogDescription>
                                รายการทั้งหมดที่ต้องพิจารณาจากทีม Legal / Compliance / Fraud
                            </DialogDescription>
                        </DialogHeader>
                        <DialogBody>
                            <div className="border border-gray-200 rounded-xl overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-200">
                                            <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-600 w-[120px]"></th>
                                            <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-600">รายละเอียด</th>
                                            <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-600 w-[80px]">รหัส</th>
                                            <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-600 w-[200px]">ประเภท</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {MOCK_BLOCK_ITEMS.filter(b => b.type === 'softblock').map((item, i) => (
                                            <tr key={i} className="bg-white hover:bg-gray-50/50 transition-colors">
                                                <td className="px-4 py-2.5">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700 border border-gray-200">
                                                        {item.module}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2.5">
                                                    {item.personName && (
                                                        <p className="text-xs font-semibold text-gray-900">{item.personName}</p>
                                                    )}
                                                    <p className="text-xs text-gray-600 mt-0.5">{item.description}</p>
                                                </td>
                                                <td className="px-4 py-2.5">
                                                    {item.code && (
                                                        <Badge variant="warning">{item.code}</Badge>
                                                    )}
                                                </td>
                                                <td className="px-4 py-2.5 text-xs text-gray-600 font-medium">
                                                    {item.code && BLOCK_CODE_MAP[item.code] ? BLOCK_CODE_MAP[item.code] : '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </DialogBody>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setSoftblockDetailOpen(false)} className="min-w-[104px]">
                                ปิด
                            </Button>
                            <Button onClick={() => { setSoftblockDetailOpen(false); setReviewDialogOpen(true); }} className="min-w-[104px]">
                                ให้ความเห็น
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Review Result Dialog (Legal Team / Approver) */}
                <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                ให้ความเห็นสถานะลูกค้า
                            </DialogTitle>
                        </DialogHeader>
                        <DialogBody>
                            <div className="space-y-2 mb-4">
                                <RadioGroup value={reviewResult} onValueChange={setReviewResult} className="flex gap-2">
                                    <label
                                        className={cn(
                                            "flex-1 flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all",
                                            reviewResult === 'discretion'
                                                ? "border-gray-300 bg-gray-50/80"
                                                : "border-gray-200 hover:bg-gray-50"
                                        )}
                                    >
                                        <RadioGroupItem value="discretion" />
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">พิจารณาตามดุลยพินิจ</p>
                                            <p className="text-xs text-gray-400 mt-0.5">ผ่านการตรวจสอบ สามารถดำเนินการต่อได้</p>
                                        </div>
                                    </label>
                                    <label
                                        className={cn(
                                            "flex-1 flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all",
                                            reviewResult === 'not_pass'
                                                ? "border-gray-300 bg-gray-50/80"
                                                : "border-gray-200 hover:bg-gray-50"
                                        )}
                                    >
                                        <RadioGroupItem value="not_pass" />
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">ไม่ผ่านเกณฑ์การพิจารณา</p>
                                            <p className="text-xs text-gray-400 mt-0.5">ไม่ผ่านการตรวจสอบ ใบสมัครจะถูกปฏิเสธ</p>
                                        </div>
                                    </label>
                                </RadioGroup>
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
                        </DialogBody>

                        <DialogFooter>
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
                                    "min-w-[104px] bg-chaiyo-blue hover:bg-chaiyo-blue/90 text-white",
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
    completionStatus,
    onEdit,
    onView,
}: {
    title: string;
    value: React.ReactNode;
    unit?: string;
    isBold?: boolean;
    icon?: React.ReactNode;
    isEmpty?: boolean;
    completionStatus?: 'completed' | 'incomplete';
    onEdit?: () => void;
    onView?: () => void;
}) {
    return (
        <div className={cn(
            "rounded-2xl p-5 flex flex-col justify-between min-h-[140px] group relative overflow-hidden transition-all duration-300",
            isEmpty
                ? (onEdit ? "bg-white border-2 border-dashed border-gray-300" : "bg-gray-50/50 border border-border-subtle")
                : completionStatus === 'completed'
                    ? "bg-blue-50/40 border border-blue-100/60"
                    : "bg-gray-50/80 border border-gray-200"
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
                <div className="flex items-center justify-between mb-2">
                    <p className={cn("text-base font-semibold", isEmpty ? "text-gray-400" : "text-gray-700")}>{title}</p>
                    {completionStatus && (
                        completionStatus === 'completed' ? (
                            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                                <Check className="w-3 h-3 text-white" strokeWidth={3} />
                            </div>
                        ) : (
                            <Circle className="w-4.5 h-4.5 text-gray-300 shrink-0" strokeWidth={2} />
                        )
                    )}
                </div>
                {isEmpty ? (
                    <p className="text-sm font-normal text-gray-300 mt-1">-</p>
                ) : (
                    <>
                        <div className={`text-sm font-medium text-foreground tracking-tight`}>{value}{unit && <span className="text-sm text-foreground ml-1">{unit}</span>}</div>
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
                            ? "bg-chaiyo-blue text-white"
                            : "bg-white hover:bg-gray-50 border-gray-200 text-gray-600 hover:text-chaiyo-blue"
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
                    className="relative z-10 rounded-full h-8 px-4 text-xs font-bold mt-4 self-start flex items-center gap-1.5 bg-white hover:bg-gray-50 border-gray-200 text-gray-500 hover:text-chaiyo-blue"
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

// ─── Softblock / Hardblock Code Descriptions ────────────────────────────────

const BLOCK_CODE_MAP: Record<string, string> = {
    '01': 'ล้มละลาย (Bankrupt)',
    '02': 'ข้อมูลไม่สมบูรณ์ (Incomplete)',
    '06': 'รายชื่อเฝ้าระวังทุจริต (Fraud List)',
    '11': 'รายชื่อ OFAC (OFAC Sanctions)',
};

interface BlockItem {
    module: string;
    type: 'softblock' | 'hardblock';
    code?: string;
    description: string;
    personName?: string;
}

// Mock block data across 3 modules
const MOCK_BLOCK_ITEMS: BlockItem[] = [
    // Customer Info — softblocks
    {
        module: 'ข้อมูลผู้กู้',
        type: 'softblock',
        code: '06',
        description: 'ผู้กู้ สมชาย ใจดี ถูกพบในรายชื่อเฝ้าระวังทุจริต',
        personName: 'สมชาย ใจดี',
    },
    // Collateral — hardblock
    {
        module: 'หลักประกัน',
        type: 'hardblock',
        code: '01',
        description: 'หลักประกันมีสถานะติดจำนอง ไม่สามารถใช้เป็นหลักประกันได้',
    },
    // Guarantors — softblocks
    {
        module: 'ผู้ค้ำประกัน',
        type: 'softblock',
        code: '02',
        description: 'ผู้ค้ำ สมบูรณ์ ใจดี ข้อมูลไม่สมบูรณ์',
        personName: 'สมบูรณ์ ใจดี',
    },
    {
        module: 'ผู้ค้ำประกัน',
        type: 'softblock',
        code: '11',
        description: 'ผู้ค้ำ สมศักดิ์ มั่งมี ถูกพบในรายชื่อ OFAC',
        personName: 'สมศักดิ์ มั่งมี',
    },
    // Guarantors — hardblock
    {
        module: 'ผู้ค้ำประกัน',
        type: 'hardblock',
        code: '01',
        description: 'ผู้ค้ำ สมศักดิ์ มั่งมี อยู่ใน Blacklist ไม่สามารถเป็นผู้ค้ำประกันได้',
        personName: 'สมศักดิ์ มั่งมี',
    },
];

const PASSED_MODULES = [
    { module: 'ข้อมูลผู้กู้', description: 'ตรวจสอบข้อมูลลูกค้าผ่านเรียบร้อย' },
    { module: 'หลักประกัน', description: 'ข้อมูลหลักประกันผ่านเกณฑ์' },
    { module: 'ผู้ค้ำประกัน', description: 'ผู้ค้ำประกันผ่านการตรวจสอบ' },
];

const CONSENT_STEPS = [
    {
        title: 'ข้อกำหนดและเงื่อนไข (Terms & Conditions)',
        description: 'กรุณาอ่านและยอมรับข้อกำหนดและเงื่อนไขการใช้บริการสินเชื่อ',
        content: `ข้อกำหนดและเงื่อนไขการใช้บริการสินเชื่อ\n\nผู้กู้ตกลงและยินยอมผูกพันตามข้อกำหนดและเงื่อนไขที่ระบุไว้ในสัญญาสินเชื่อฉบับนี้ทุกประการ โดยมีสาระสำคัญดังนี้\n\n1. อัตราดอกเบี้ย: อัตราดอกเบี้ยเป็นไปตามที่บริษัทกำหนด และอาจมีการเปลี่ยนแปลงตามประกาศของบริษัท\n2. ระยะเวลาผ่อนชำระ: ผู้กู้ต้องชำระค่างวดตามกำหนดเวลาที่ระบุในสัญญา\n3. ค่าธรรมเนียม: ผู้กู้รับทราบและยินยอมชำระค่าธรรมเนียมต่างๆ ที่เกี่ยวข้อง\n4. การผิดนัดชำระ: หากผู้กู้ผิดนัดชำระ บริษัทมีสิทธิ์คิดดอกเบี้ยผิดนัดตามอัตราที่กฎหมายกำหนด\n5. หลักประกัน: หลักประกันที่ใช้ในการค้ำประกันสินเชื่อจะอยู่ภายใต้เงื่อนไขตามที่ระบุในสัญญา\n6. การบอกเลิกสัญญา: บริษัทมีสิทธิ์บอกเลิกสัญญาได้ทันทีหากผู้กู้ผิดเงื่อนไขข้อใดข้อหนึ่ง`,
        checkboxLabel: 'ข้าพเจ้าได้อ่านและยอมรับข้อกำหนดและเงื่อนไขการใช้บริการสินเชื่อ',
    },
    {
        title: 'ความยินยอมทางการตลาด (Marketing Consent)',
        description: 'ข้อมูลของท่านอาจถูกใช้เพื่อวัตถุประสงค์ทางการตลาด',
        content: `ความยินยอมในการใช้ข้อมูลเพื่อวัตถุประสงค์ทางการตลาด\n\nบริษัท ออโต้ เอกซ์ จำกัด ขอความยินยอมจากท่านในการเก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคลของท่าน เพื่อวัตถุประสงค์ดังต่อไปนี้:\n\n1. การนำเสนอผลิตภัณฑ์และบริการที่เหมาะสม\n2. การส่งข่าวสาร โปรโมชั่น และสิทธิพิเศษ\n3. การวิเคราะห์พฤติกรรมเพื่อปรับปรุงบริการ\n4. การติดต่อสื่อสารผ่านช่องทางต่างๆ เช่น โทรศัพท์ อีเมล SMS หรือ LINE\n\nท่านสามารถถอนความยินยอมได้ทุกเมื่อโดยแจ้งความประสงค์ผ่านช่องทางที่บริษัทกำหนด`,
        checkboxLabel: 'ข้าพเจ้ายินยอมให้ใช้ข้อมูลเพื่อวัตถุประสงค์ทางการตลาด',
    },
    {
        title: 'ความยินยอมการประกันภัย (Insurance Consent)',
        description: 'กรุณารับทราบเงื่อนไขการประกันภัยที่เกี่ยวข้องกับสินเชื่อ',
        content: `เงื่อนไขการประกันภัยสำหรับสินเชื่อ\n\nผู้กู้รับทราบและยินยอมเงื่อนไขการประกันภัยดังนี้:\n\n1. ประกันภัยหลักประกัน: หลักประกันที่ใช้ในการค้ำประกันสินเชื่อต้องมีการทำประกันภัยตลอดระยะเวลาสัญญา\n2. ผู้รับผลประโยชน์: บริษัทจะเป็นผู้รับผลประโยชน์ตามกรมธรรม์ประกันภัย\n3. ค่าเบี้ยประกันภัย: ผู้กู้เป็นผู้รับผิดชอบค่าเบี้ยประกันภัยทั้งหมด\n4. การต่ออายุ: ผู้กู้ต้องต่ออายุกรมธรรม์ก่อนวันหมดอายุ\n5. ประกันชีวิตกลุ่ม (PA): ผู้กู้ได้รับการคุ้มครองประกันอุบัติเหตุส่วนบุคคลตามเงื่อนไขที่บริษัทกำหนด`,
        checkboxLabel: 'ข้าพเจ้ารับทราบและยินยอมเงื่อนไขการประกันภัยที่เกี่ยวข้อง',
    },
];

function SubmitApplicationDialog({
    open,
    onOpenChange,
    isSubmitting,
    allPassed = false,
    onSubmit,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isSubmitting: boolean;
    allPassed?: boolean;
    onSubmit: () => void;
}) {
    const [dialogStep, setDialogStep] = useState(1);
    const [consentChecked, setConsentChecked] = useState([false, false, false]);

    // Reset state when dialog opens/closes
    useEffect(() => {
        if (open) {
            setDialogStep(1);
            setConsentChecked([false, false, false]);
        }
    }, [open]);

    const softblocks = MOCK_BLOCK_ITEMS.filter(b => b.type === 'softblock');
    const hasSoftblocks = softblocks.length > 0;
    const hasBlocks = MOCK_BLOCK_ITEMS.length > 0;

    const handleConsentChange = (index: number, checked: boolean) => {
        setConsentChecked(prev => {
            const next = [...prev];
            next[index] = checked;
            return next;
        });
    };

    // For all-passed flow: consent step index (0, 1, 2) maps to dialogStep 2, 3, 4
    const consentIndex = dialogStep - 2;
    const currentConsent = CONSENT_STEPS[consentIndex];
    const isConsentStep = allPassed && dialogStep >= 2 && dialogStep <= 4;
    const isFinalStep = allPassed && dialogStep === 4;

    // Step titles for header
    const getStepTitle = () => {
        if (!allPassed || dialogStep === 1) return 'ส่งใบสมัครสินเชื่อ';
        return currentConsent?.title || 'ส่งใบสมัครสินเชื่อ';
    };

    const getStepDescription = () => {
        if (dialogStep === 1) {
            if (allPassed) return 'ข้อมูลทั้งหมดผ่านการตรวจสอบเรียบร้อย กรุณาดำเนินการขั้นตอนถัดไป';
            if (hasBlocks) return 'ตรวจพบรายการที่ต้องตรวจสอบเพิ่มเติมจากระบบ กรุณาตรวจสอบรายละเอียดก่อนส่งใบสมัคร';
            return 'ใบสมัครจะถูกส่งเข้าสู่ระบบเพื่อพิจารณาอนุมัติ';
        }
        return currentConsent?.description || '';
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent size="lg">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle>{getStepTitle()}</DialogTitle>
                        {/* Step indicator for all-passed flow */}
                        {allPassed && dialogStep >= 2 && (
                            <div className="flex items-center gap-1.5 shrink-0">
                                {CONSENT_STEPS.map((_, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "h-1.5 rounded-full transition-all",
                                            i === consentIndex ? "w-8 bg-chaiyo-blue" : i < consentIndex ? "w-4 bg-emerald-400" : "w-4 bg-gray-200"
                                        )}
                                    />
                                ))}
                                <span className="text-[10px] text-gray-400 ml-1.5">ขั้นตอน {consentIndex + 1} / {CONSENT_STEPS.length}</span>
                            </div>
                        )}
                    </div>
                    <DialogDescription>{getStepDescription()}</DialogDescription>
                </DialogHeader>

                <DialogBody>
                    {/* Step 1: Status check */}
                    {dialogStep === 1 && (
                        <div className="space-y-5">
                            {/* Block flow (existing) */}
                            {!allPassed && hasBlocks && (
                                <>
                                    {hasSoftblocks && (
                                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-2.5">
                                            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                                                <Send className="w-3 h-3 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-blue-800">
                                                    ใบสมัครจะถูกส่งไปยังทีมตรวจสอบก่อน
                                                </p>
                                                <p className="text-[11px] text-blue-600 mt-0.5 leading-relaxed">
                                                    เนื่องจากมีรายการ Softblock ใบสมัครจะถูกส่งให้ทีม Legal / Compliance / Fraud พิจารณาก่อน
                                                    หลังจากทีมตรวจสอบให้ความเห็นแล้ว ใบสมัครจะถูกส่งกลับมายังพนักงานสาขาเพื่อดำเนินการต่อ
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="bg-gray-50 border-b border-gray-200">
                                                    <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-600 w-[120px]"></th>
                                                    <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-600">รายละเอียด</th>
                                                    <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-600 w-[80px]">รหัส</th>
                                                    <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-600 w-[200px]">ประเภท</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {MOCK_BLOCK_ITEMS.map((item, i) => {
                                                    const isHardblock = item.type === 'hardblock';
                                                    return (
                                                        <tr key={i} className="bg-white hover:bg-gray-50/50 transition-colors">
                                                            <td className="px-4 py-2.5">
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700 border border-gray-200">
                                                                    {item.module}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-2.5">
                                                                {item.personName && (
                                                                    <p className="text-xs font-semibold text-gray-900">{item.personName}</p>
                                                                )}
                                                                <p className="text-xs text-gray-600 mt-0.5">{item.description}</p>
                                                            </td>
                                                            <td className="px-4 py-2.5">
                                                                {item.code && (
                                                                    <span className={cn(
                                                                        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border",
                                                                        isHardblock
                                                                            ? "bg-red-100 text-red-700 border-red-200"
                                                                            : "bg-amber-100 text-amber-700 border-amber-200"
                                                                    )}>
                                                                        {item.code}
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-2.5 text-xs text-gray-600 font-medium">
                                                                {item.code && BLOCK_CODE_MAP[item.code] ? BLOCK_CODE_MAP[item.code] : '-'}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}

                            {/* All-passed flow */}
                            {allPassed && (
                                <div className="space-y-3">
                                    {PASSED_MODULES.map((mod, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-3 p-3.5 bg-white border border-gray-200 rounded-xl"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                                <CircleCheck className="w-4.5 h-4.5 text-emerald-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-900">{mod.module}</p>
                                            </div>
                                            <Badge variant="success" className="gap-1 shrink-0">
                                                <CircleCheck className="w-3.5 h-3.5" />
                                                ผ่าน
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Steps 2-4: Consent steps */}
                    {isConsentStep && currentConsent && (
                        <div className="space-y-4">
                            <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
                                <div className="p-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-chaiyo-blue" />
                                    <span className="text-sm font-semibold text-gray-700">
                                        กรุณาอ่านและทำความเข้าใจรายละเอียดก่อนดำเนินการต่อ
                                    </span>
                                </div>
                                <div className="h-[280px] overflow-y-auto p-5 text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                                    {currentConsent.content}
                                </div>
                            </div>

                            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 flex items-start gap-3">
                                <Checkbox
                                    id={`consent-${consentIndex}`}
                                    className="mt-0.5"
                                    checked={consentChecked[consentIndex]}
                                    onCheckedChange={(checked) => handleConsentChange(consentIndex, checked as boolean)}
                                />
                                <label
                                    htmlFor={`consent-${consentIndex}`}
                                    className="cursor-pointer select-none text-sm text-gray-700 font-semibold leading-snug"
                                >
                                    {currentConsent.checkboxLabel}
                                </label>
                            </div>
                        </div>
                    )}
                </DialogBody>

                <DialogFooter>
                    {/* Back button for consent steps */}
                    {isConsentStep && (
                        <Button
                            variant="outline"
                            onClick={() => setDialogStep(prev => prev - 1)}
                            className="min-w-[104px] mr-auto"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            ย้อนกลับ
                        </Button>
                    )}

                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="min-w-[104px]"
                    >
                        ยกเลิก
                    </Button>

                    {/* Step 1 all-passed: ดำเนินการต่อ */}
                    {dialogStep === 1 && allPassed && (
                        <Button
                            onClick={() => setDialogStep(2)}
                            variant="default"
                            className="min-w-[104px]"
                        >
                            ดำเนินการต่อ
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    )}

                    {/* Step 1 with blocks: ส่งใบสมัคร (to legal) */}
                    {dialogStep === 1 && !allPassed && (
                        <Button
                            onClick={onSubmit}
                            variant="default"
                            className="min-w-[104px]"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    กำลังส่ง...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4 mr-1.5" />
                                    ส่งใบสมัคร
                                </>
                            )}
                        </Button>
                    )}

                    {/* Consent steps 2-3: ถัดไป */}
                    {isConsentStep && !isFinalStep && (
                        <Button
                            onClick={() => setDialogStep(prev => prev + 1)}
                            variant="default"
                            className="min-w-[104px]"
                            disabled={!consentChecked[consentIndex]}
                        >
                            ถัดไป
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    )}

                    {/* Final consent step 4: ส่งใบสมัคร */}
                    {isFinalStep && (
                        <Button
                            onClick={onSubmit}
                            variant="default"
                            className="min-w-[104px]"
                            disabled={isSubmitting || !consentChecked[consentIndex]}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    กำลังส่ง...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4 mr-1.5" />
                                    ส่งใบสมัคร
                                </>
                            )}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
