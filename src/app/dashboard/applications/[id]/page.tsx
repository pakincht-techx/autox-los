"use client";

import React, { useState, useEffect } from "react";
import { useSidebar } from "@/components/layout/SidebarContext";
import { ApplicationStatus } from "@/components/applications/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Phone, MessageCircle, User, Pencil, Star, FileText, Check, ShieldCheck, Gift, Car, Wallet, Coins, Users, Plus, ThumbsUp, ThumbsDown, Undo2, Eye, AlertTriangle, ShieldAlert, ClipboardCheck, MessageSquare, Paperclip, CreditCard, Upload, CircleCheck, Circle, RefreshCw, Send, Loader2, ChevronLeft, ChevronRight, Building2, Home, AlertCircle } from "lucide-react";
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
    applicantNickname: "ชาย",
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
        verifyAddress: true,
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
        case '6': // In Review — Car loan, all sections filled (For RCCO-Checker)
            return {
                ...BASE_MOCK_APP,
                id: "mock-6",
                applicationNo: "25690106ULCRL0006",
                applicantName: "อภิชาติ ธนากิจ",
                applicantNickname: "นุ่น",
                applicantInitials: "อท",
                status: "In Review" as ApplicationStatus,
                phone: "089-345-6789",
                applicantAge: 38,
                lastActionTime: "06-01-2569 14:20",
                customerType: "ปกติ",
                collateralType: "รถยนต์",
                incomePerMonth: 45000,
                debtPerMonth: 12000,
                guarantorCount: 2,
                refinanceCount: 1,
                uploadedDocCount: 8,
                acceptedConsentCount: 4,
                moduleStatus: {
                    customerInfo: true,
                    collateral: true,
                    loanDetail: true,
                    income: true,
                    debt: true,
                    guarantor: true,
                    refinance: true,
                    verifyAddress: true,
                    documents: true,
                    consent: true,
                },
                loanProductLabel: "ULCR",
                loanProductName: "จำนำรถยนต์ผ่อนรายเดือน",
                loanAmount: 150000,
                interestRate: 20,
                term: 60,
                installment: 4200,
                insurance: {
                    company: "วิริยะประกันภัย",
                    logo: "/insurance-logo/Property 1=Viriya.png",
                    tier: "ชั้น 1",
                    premium: 15000,
                    coverage: 500000,
                    repairType: "ซ่อมศูนย์",
                },
                totalInstallmentWithInsurance: 4500,
                maxLoanAmount: 350000,
                maxInstallment: 9100,
                historyLog: [
                    {
                        date: "06 ม.ค. 2569",
                        time: "09:00 น.",
                        title: "สร้างใบสมัคร",
                        team: "พนักงานสาขา",
                        result: "",
                        comment: undefined as string | undefined,
                        attachments: undefined as { name: string; url: string }[] | undefined,
                    },
                    {
                        date: "06 ม.ค. 2569",
                        time: "14:20 น.",
                        title: "ส่งเข้าการพิจารณา",
                        team: "Maker",
                        result: "รอการตรวจสอบ",
                        comment: "ผลเบื้องต้นผ่าน",
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
    const { setBreadcrumbs, setRightContent, devRole, setHideNavButtons, setHideSaveDraftButton, setOnBack } = useSidebar();
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
    const [isIncompleteDialogOpen, setIsIncompleteDialogOpen] = useState(false);
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
    // from=all + rcco-checker → approver (with task claim feature)
    // from=all + branch-staff → readonly (view-only, no actions)
    const viewMode: ViewMode = from === 'all'
        ? (devRole === 'legal-team' || devRole === 'rcco-checker' ? 'approver' : 'readonly')
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

    // ── RCCO Checker timer ──────────────────────────────────────────────────
    const [timerActive, setTimerActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes in seconds

    useEffect(() => {
        if (!timerActive || timeLeft <= 0) return;

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setTimerActive(false);
                    toast.error("หมดเวลาในการทำใบงาน", {
                        description: "กรุณาส่งคืนใบงานไป Maker",
                    });
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timerActive, timeLeft]);

    const formatTimer = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const handleClaimTask = () => {
        setTimerActive(true);
        setTimeLeft(60 * 60);
        toast.success("เคลมใบงานสำเร็จ", {
            description: "คุณมีเวลา 60 นาทีในการทำใบงาน",
        });
    };

    // ── Set breadcrumbs + right content ──────────────────────────────────
    useEffect(() => {
        // If redirected from soft block, change status to In Review
        if (statusParam === 'in-review' && currentStatus !== 'In Review') {
            setCurrentStatus('In Review');
        }

        const firstName = app.applicantName.split(' ')[0];
        setBreadcrumbs([
            { label: `${app.applicationNo.slice(8)} (${firstName})`, isActive: true }
        ]);

        setOnBack(() => () => router.back());

        // No right content in the top bar — action buttons are in the header section
        setRightContent(null);

        // Hide nav buttons and save draft button on applications detail page
        setHideNavButtons(false);
        setHideSaveDraftButton(true);

        return () => {
            setBreadcrumbs([]);
            setRightContent(null);
            setHideNavButtons(false);
            setHideSaveDraftButton(false);
            setOnBack(null);
        };
    }, [app.applicationNo, app.applicantName, from, setBreadcrumbs, setRightContent, viewMode, canEdit, currentStatus, statusParam, setHideNavButtons, setHideSaveDraftButton, setOnBack, router]);

    return (
        <div className="h-full overflow-y-auto no-scrollbar bg-sidebar">
            {/* Timer notification bar */}
            {timerActive && devRole === 'rcco-checker' && (
                <div className="w-full py-2 px-4 flex items-center justify-center gap-3" style={{ backgroundColor: '#FFF7ED' }}>
                    <AlertCircle className="w-5 h-5 shrink-0" style={{ color: '#C2410C' }} />
                    <span className="font-semibold" style={{ color: '#C2410C' }}>ระยะเวลาทำใบงานนี้ ให้เสร็จสิ้นภายใน {formatTimer(timeLeft)}</span>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════
                SECTION 1: APP HEADER (full-width border bottom)
            ═══════════════════════════════════════════════════════════ */}
            <div className="border-b border-gray-200 bg-sidebar">
                <div className="max-w-6xl mx-auto px-6 lg:px-8 py-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground tracking-tight">
                                {app.applicantName}{app.applicantNickname && <span className="text-gray-400 font-medium ml-1">({app.applicantNickname})</span>}
                            </h1>
                            <div className="flex items-center gap-2.5 mt-2">
                                <Badge variant={getStatusBadgeVariant(currentStatus)}>
                                    {getStatusLabel(currentStatus)}
                                </Badge>
                                <span className="text-gray-300">•</span>
                                <span className="text-sm font-semibold tracking-wide text-gray-700">{app.applicationNo}</span>
                                <span className="text-gray-300">•</span>
                                <span className="text-sm text-gray-500">{app.loanProductName}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            {devRole === 'rcco-checker' && viewMode === 'approver' && (
                                <Button
                                    variant="default"
                                    onClick={handleClaimTask}
                                    disabled={timerActive}
                                    className="bg-chaiyo-blue hover:bg-chaiyo-blue/90 text-white"
                                >
                                    <Send className="w-4 h-4 mr-2" /> เคลมใบงาน
                                </Button>
                            )}
                            {canEdit && (
                                <Button
                                    variant="default"
                                    onClick={() => {
                                        const incompleteModules = Object.entries(app.moduleStatus)
                                            .filter(([key, done]) => key !== 'consent' && !done)
                                            .map(([key]) => key);
                                        if (incompleteModules.length > 0) {
                                            setIsIncompleteDialogOpen(true);
                                        } else {
                                            // Navigation to the full page consent flow
                                            router.push(`/dashboard/new-application/${app.applicationNo}/consent?state=draft`);
                                        }
                                    }}
                                >
                                    <Send className="w-4 h-4 mr-2" /> ส่งใบสมัคร
                                </Button>
                            )}
                            {viewMode === 'approver' && currentStatus !== 'Sent Back' && (
                                <Button
                                    className="bg-chaiyo-blue hover:bg-chaiyo-blue/90 text-white"
                                    onClick={() => setReviewDialogOpen(true)}
                                >
                                    <MessageSquare className="w-4 h-4 mr-1.5" /> ให้ความเห็น
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-6 lg:p-8 space-y-8">

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
                <div className="flex gap-8 items-start">
                    {/* ── Left column: Module list ── */}
                    <div className="flex-1 min-w-0 space-y-5">
                        {/* Group 1: รายละเอียดใบสมัคร */}
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">รายละเอียดใบสมัคร</p>
                            <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 overflow-hidden">
                                <ModuleRow
                                    title="ข้อมูลผู้กู้"
                                    icon={<User className="w-4 h-4" />}
                                    completionStatus={app.moduleStatus.customerInfo ? 'completed' : 'incomplete'}
                                    onEdit={canEdit ? () => router.push(`/dashboard/new-application/${app.applicationNo}/customer-info?state=draft`) : undefined}
                                    onView={!canEdit ? () => router.push(`/dashboard/new-application/${app.applicationNo}/customer-info?state=readonly`) : undefined}
                                />
                                <ModuleRow
                                    title="อาชีพและรายได้"
                                    icon={<Coins className="w-4 h-4" />}
                                    completionStatus={app.moduleStatus.income ? 'completed' : 'incomplete'}
                                    onEdit={canEdit ? () => router.push(`/dashboard/new-application/${app.applicationNo}/income?state=draft`) : undefined}
                                    onView={!canEdit ? () => router.push(`/dashboard/new-application/${app.applicationNo}/income?state=readonly`) : undefined}
                                />
                                <ModuleRow
                                    title="หลักประกัน"
                                    icon={<Car className="w-4 h-4" />}
                                    completionStatus={app.moduleStatus.collateral ? 'completed' : 'incomplete'}
                                    onEdit={canEdit ? () => router.push(`/dashboard/new-application/${app.applicationNo}/collateral-info?state=draft`) : undefined}
                                    onView={!canEdit ? () => router.push(`/dashboard/new-application/${app.applicationNo}/collateral-info?state=readonly`) : undefined}
                                />
                                <ModuleRow
                                    title="ภาระหนี้"
                                    icon={<Wallet className="w-4 h-4" />}
                                    completionStatus={app.moduleStatus.debt ? 'completed' : 'incomplete'}
                                    onEdit={canEdit ? () => router.push(`/dashboard/new-application/${app.applicationNo}/debt?state=draft`) : undefined}
                                    onView={!canEdit ? () => router.push(`/dashboard/new-application/${app.applicationNo}/debt?state=readonly`) : undefined}
                                />
                                <ModuleRow
                                    title="ผู้ค้ำประกัน"
                                    icon={<Users className="w-4 h-4" />}
                                    completionStatus={app.moduleStatus.guarantor ? 'completed' : 'incomplete'}
                                    onEdit={canEdit ? () => router.push(`/dashboard/new-application/${app.applicationNo}/guarantors?state=draft`) : undefined}
                                    onView={!canEdit ? () => router.push(`/dashboard/new-application/${app.applicationNo}/guarantors?state=readonly`) : undefined}
                                />
                                <ModuleRow
                                    title="รีไฟแนนซ์"
                                    icon={<RefreshCw className="w-4 h-4" />}
                                    completionStatus={app.moduleStatus.refinance ? 'completed' : 'incomplete'}
                                    onEdit={canEdit ? () => router.push(`/dashboard/new-application/${app.applicationNo}/refinance?state=draft`) : undefined}
                                    onView={!canEdit ? () => router.push(`/dashboard/new-application/${app.applicationNo}/refinance?state=readonly`) : undefined}
                                />
                                <ModuleRow
                                    title="ตรวจสอบที่อยู่"
                                    icon={<Home className="w-4 h-4" />}
                                    completionStatus={app.moduleStatus.verifyAddress ? 'completed' : 'incomplete'}
                                    onEdit={canEdit ? () => router.push(`/dashboard/new-application/${app.applicationNo}/verify-address?state=draft`) : undefined}
                                    onView={!canEdit ? () => router.push(`/dashboard/new-application/${app.applicationNo}/verify-address?state=readonly`) : undefined}
                                />
                            </div>
                        </div>

                        {/* Group 2: รายละเอียดสินเชื่อ */}
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">รายละเอียดสินเชื่อ</p>
                            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                                <ModuleRow
                                    title="รายละเอียดสินเชื่อ"
                                    icon={<FileText className="w-4 h-4" />}
                                    completionStatus={app.moduleStatus.loanDetail ? 'completed' : 'incomplete'}
                                    onEdit={canEdit ? () => router.push(`/dashboard/new-application/${app.applicationNo}/loan-calculator?state=draft`) : undefined}
                                    onView={!canEdit ? () => router.push(`/dashboard/new-application/${app.applicationNo}/loan-calculator?state=readonly`) : undefined}
                                />
                            </div>
                        </div>

                        {/* Group 3: เอกสารและการยินยอม */}
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">เอกสารและการยินยอม</p>
                            <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 overflow-hidden">
                                <ModuleRow
                                    title="เอกสารแนบ"
                                    icon={<Upload className="w-4 h-4" />}
                                    completionStatus={app.moduleStatus.documents ? 'completed' : 'incomplete'}
                                    onEdit={canEdit ? () => router.push(`/dashboard/new-application/${app.applicationNo}/documents?state=draft`) : undefined}
                                    onView={!canEdit ? () => router.push(`/dashboard/new-application/${app.applicationNo}/documents?state=readonly`) : undefined}
                                />
                                {(consentCompleted || (app.acceptedConsentCount > 0 && mockCase !== '3')) && (
                                    <ModuleRow
                                        title="การให้ความยินยอม"
                                        icon={<ClipboardCheck className="w-4 h-4" />}
                                        completionStatus={'completed'}
                                        onView={() => router.push(`/dashboard/new-application/${app.applicationNo}/consent?state=readonly`)}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Right column: Contact info ── */}
                    <div className="w-[280px] shrink-0 space-y-5">
                        {/* Branch staff contact */}
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">ข้อมูลติดต่อสาขา</p>
                            <div className="bg-white border border-gray-200 rounded-xl p-4">
                                <div className="space-y-2.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500">พนักงาน</span>
                                        <span className="text-xs font-semibold text-gray-800">สมหญิง จริงใจ - 108001</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500">สาขา</span>
                                        <span className="text-xs font-semibold text-gray-800">ลาดพร้าว</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500">เบอร์มือถือ</span>
                                        <span className="text-xs font-semibold text-gray-800">080-000-0000</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Customer contact */}
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">ข้อมูลติดต่อลูกค้า</p>
                            <div className="bg-white border border-gray-200 rounded-xl p-4">
                                <div className="space-y-2.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500">LINEID</span>
                                        <span className="text-xs font-semibold text-gray-800">@LINEID</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500">เบอร์มือถือ</span>
                                        <span className="text-xs font-semibold text-gray-800">{app.phone}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cancel application */}
                        {canEdit && (
                            <Button
                                variant="outline"
                                className="w-full text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50"
                                onClick={() => setCancelDialogOpen(true)}
                            >
                                ยกเลิกใบสมัคร
                            </Button>
                        )}
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════
                    SECTION 3: HISTORY LOG
                ═══════════════════════════════════════════════════════════ */}
                <div className="pt-4">
                    <h2 className="text-xl font-bold text-foreground mb-2">ประวัติการดำเนินการ</h2>
                    <div className="bg-white rounded-xl divide-y divide-gray-100">
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
                    DIALOGS
                ═══════════════════════════════════════════════════════════ */}

                {/* Cancel Dialog (Maker) */}
                <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>ยืนยันการยกเลิกใบสมัคร</DialogTitle>
                            <DialogDescription>
                                คุณแน่ใจหรือไม่ว่าต้องการยกเลิกใบสมัคร? การดำเนินการนี้ไม่สามารถย้อนกลับได้
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

                {/* Incomplete Modules Warning Dialog */}
                <IncompleteModulesDialog
                    open={isIncompleteDialogOpen}
                    onOpenChange={setIsIncompleteDialogOpen}
                    moduleStatus={app.moduleStatus}
                    applicationNo={app.applicationNo}
                />

                {/* Submit Application Dialog (Maker) — with block warnings */}
                <SubmitApplicationDialog
                    open={isSubmitDialogOpen}
                    onOpenChange={setIsSubmitDialogOpen}
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
                            <div className="space-y-4">
                                {/* Group by module */}
                                {['ข้อมูลผู้กู้', 'หลักประกัน', 'ผู้ค้ำประกัน'].map(moduleName => {
                                    const items = MOCK_BLOCK_ITEMS.filter(b => b.type === 'softblock' && b.module === moduleName);
                                    if (items.length === 0) return null;
                                    return (
                                        <div key={moduleName} className="border border-gray-200 rounded-xl overflow-hidden">
                                            <div className="bg-gray-50 border-b border-gray-200 px-4 py-2.5">
                                                <p className="text-xs font-bold text-gray-600">{moduleName}</p>
                                            </div>
                                            <div className="divide-y divide-gray-100">
                                                {items.map((item, i) => (
                                                    <div key={i} className="px-4 py-2.5 bg-white">
                                                        <p className="text-xs font-semibold text-gray-900">
                                                            {item.personName || item.collateralType}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
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
                                                        >
                                                            {entry.file.name}
                                                        </a>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                URL.revokeObjectURL(entry.url);
                                                                setReviewAttachments(prev => prev.filter((_, idx) => idx !== i));
                                                            }}
                                                            className="ml-0.5 text-blue-400 hover:text-red-500 transition-colors"
                                                        >
                                                            ✕
                                                        </button>
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
            "rounded-2xl p-5 flex flex-col justify-between min-h-[140px] group relative overflow-hidden",
            isEmpty
                ? (onEdit ? "bg-white border-2 border-dashed border-gray-300" : "bg-gray-50/50 border border-border-subtle")
                : completionStatus === 'completed'
                    ? "bg-blue-50/40 border border-blue-100/60"
                    : "bg-gray-50/80 border border-gray-200"
        )}>
            {/* Background Icon Watermark */}
            {icon && (
                <div className={cn(
                    "absolute -bottom-4 -right-4 pointer-events-none",
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

            </div>
            {onEdit && (
                <Button
                    variant={isEmpty ? "default" : "outline"}
                    onClick={onEdit}
                    className={cn(
                        "relative z-10 rounded-lg h-8 px-4 text-xs font-bold mt-4 self-start flex items-center gap-1.5",
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
                    className="relative z-10 rounded-lg h-8 px-4 text-xs font-bold mt-4 self-start flex items-center gap-1.5 bg-white hover:bg-gray-50 border-gray-200 text-gray-500 hover:text-chaiyo-blue"
                >
                    <Eye className="w-3.5 h-3.5" />
                    ดูรายละเอียด
                </Button>
            )}
        </div>
    );
}

function ModuleRow({
    title,
    icon,
    completionStatus,
    onEdit,
    onView,
}: {
    title: string;
    icon?: React.ReactNode;
    completionStatus?: 'completed' | 'incomplete';
    onEdit?: () => void;
    onView?: () => void;
}) {
    const handleClick = () => {
        if (onEdit) onEdit();
        else if (onView) onView();
    };

    return (
        <div 
            onClick={onEdit || onView ? handleClick : undefined}
            className={cn(
                "flex items-center justify-between px-4 py-3.5 group transition-colors",
                (onEdit || onView) && "cursor-pointer hover:bg-gray-50"
            )}
        >
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 text-gray-400">
                    {icon ?? <User className="w-4 h-4" />}
                </div>
                <span className="text-base font-semibold text-gray-800">{title}</span>
            </div>
            <div className="flex items-center gap-2">
                {completionStatus === 'completed' && (
                    <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                )}
                {onEdit && (
                    <div className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 group-hover:text-chaiyo-blue group-hover:bg-blue-50 transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                    </div>
                )}
                {onView && !onEdit && (
                    <div className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 group-hover:text-chaiyo-blue group-hover:bg-blue-50 transition-colors">
                        <Eye className="w-3.5 h-3.5" />
                    </div>
                )}
            </div>
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
    collateralType?: string;
}

// Mock block data across 3 modules
const MOCK_BLOCK_ITEMS: BlockItem[] = [
    // Customer Info
    {
        module: 'ข้อมูลผู้กู้',
        type: 'softblock',
        code: '06',
        description: 'ผู้กู้ สมชาย ใจดี ถูกพบในรายชื่อเฝ้าระวังทุจริต',
        personName: 'สมชาย ใจดี',
    },
    // Collateral
    {
        module: 'หลักประกัน',
        type: 'hardblock',
        code: '01',
        description: 'หลักประกันมีสถานะติดจำนอง ไม่สามารถใช้เป็นหลักประกันได้',
        collateralType: 'รถมอเตอร์ไซต์',
    },
    // Guarantors
    {
        module: 'ผู้ค้ำประกัน',
        type: 'softblock',
        code: '11',
        description: 'ผู้ค้ำ สมศักดิ์ มั่งมี ถูกพบในรายชื่อ OFAC',
        personName: 'สมศักดิ์ มั่งมี',
    },
    {
        module: 'ผู้ค้ำประกัน',
        type: 'softblock',
        code: '02',
        description: 'ผู้ค้ำ สมบูรณ์ ใจดี ข้อมูลไม่สมบูรณ์',
        personName: 'สมบูรณ์ ใจดี',
    },
];

const PASSED_MODULES = [
    { module: 'ข้อมูลผู้กู้', description: 'ตรวจสอบข้อมูลลูกค้าผ่านเรียบร้อย' },
    { module: 'หลักประกัน', description: 'ข้อมูลหลักประกันผ่านเกณฑ์' },
    { module: 'ผู้ค้ำประกัน', description: 'ผู้ค้ำประกันผ่านการตรวจสอบ' },
];

function IncompleteModulesDialog({
    open,
    onOpenChange,
    moduleStatus,
    applicationNo
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    moduleStatus: Record<string, boolean>;
    applicationNo: string;
}) {
    const router = useRouter();
    const incompleteModules = [];

    if (!moduleStatus.customerInfo) incompleteModules.push({ name: 'ข้อมูลผู้กู้', path: 'customer-info', icon: <User className="w-4 h-4 text-gray-500" /> });
    if (!moduleStatus.collateral) incompleteModules.push({ name: 'หลักประกัน', path: 'collateral-info', icon: <Car className="w-4 h-4 text-gray-500" /> });
    if (!moduleStatus.loanDetail) incompleteModules.push({ name: 'รายละเอียดสินเชื่อ', path: 'loan-calculator', icon: <FileText className="w-4 h-4 text-gray-500" /> });
    if (!moduleStatus.income) incompleteModules.push({ name: 'อาชีพและรายได้', path: 'income', icon: <Coins className="w-4 h-4 text-gray-500" /> });
    if (!moduleStatus.debt) incompleteModules.push({ name: 'ภาระหนี้', path: 'debt', icon: <Wallet className="w-4 h-4 text-gray-500" /> });
    if (!moduleStatus.guarantor) incompleteModules.push({ name: 'ผู้ค้ำประกัน', path: 'guarantors', icon: <Users className="w-4 h-4 text-gray-500" /> });
    if (!moduleStatus.documents) incompleteModules.push({ name: 'เอกสารแนบ', path: 'documents', icon: <Upload className="w-4 h-4 text-gray-500" /> });
    if (!moduleStatus.refinance) incompleteModules.push({ name: 'รีไฟแนนซ์', path: 'refinance', icon: <RefreshCw className="w-4 h-4 text-gray-500" /> });
    if (!moduleStatus.verifyAddress) incompleteModules.push({ name: 'ตรวจสอบที่อยู่', path: 'verify-address', icon: <Home className="w-4 h-4 text-gray-500" /> });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader className="text-left">
                    <DialogTitle>ไม่สามารถส่งใบสมัครได้</DialogTitle>
                    <DialogDescription>
                        กรุณากรอกข้อมูลให้ครบทุกรายการก่อนส่งใบสมัคร
                    </DialogDescription>
                </DialogHeader>
                
                <DialogBody>
                    <div className="space-y-0 mt-4">
                        {incompleteModules.map((module, index) => (
                            <div 
                                key={index} 
                                onClick={() => {
                                    onOpenChange(false);
                                    router.push(`/dashboard/new-application/${applicationNo}/${module.path}?state=draft`);
                                }}
                                className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer transition-colors group border-b border-gray-100 last:border-0"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                        {module.icon}
                                    </div>
                                    <span className="text-sm font-semibold text-gray-700">{module.name}</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                            </div>
                        ))}
                    </div>
                </DialogBody>

                <DialogFooter className="mt-6 sm:justify-end">
                    <Button 
                        variant="outline"
                        className="min-w-[104px]"
                        onClick={() => onOpenChange(false)}
                    >
                        ปิด
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function SubmitApplicationDialog({
    open,
    onOpenChange,
    allPassed = false,
    onSubmit,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    allPassed?: boolean;
    onSubmit: () => void;
}) {
    const hasBlocks = MOCK_BLOCK_ITEMS.length > 0;
    const hasSoftblocks = MOCK_BLOCK_ITEMS.some(b => b.type === 'softblock');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getStepTitle = () => {
        return 'ส่งใบสมัครสินเชื่อ';
    };

    const getStepDescription = () => {
        if (allPassed) return 'ข้อมูลทั้งหมดผ่านการตรวจสอบเรียบร้อย กรุณาดำเนินการส่งใบสมัคร';
        if (hasBlocks) return 'ตรวจพบรายการที่ต้องตรวจสอบเพิ่มเติมจากระบบ กรุณาตรวจสอบรายละเอียดก่อนส่งใบสมัคร';
        return 'ใบสมัครจะถูกส่งเข้าสู่ระบบเพื่อพิจารณาอนุมัติ';
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle>{getStepTitle()}</DialogTitle>
                    </div>
                    <DialogDescription>{getStepDescription()}</DialogDescription>
                </DialogHeader>

                <DialogBody>
                    {!allPassed && hasBlocks && hasSoftblocks && (
                        <div className="space-y-5">
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-2.5">
                                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                                    <Send className="w-3 h-3 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-blue-800">
                                        ใบสมัครจะถูกส่งไปยังทีมตรวจสอบก่อน
                                    </p>
                                    <p className="text-[11px] text-blue-600 mt-0.5 leading-relaxed">
                                        เนื่องจากมีรายการที่ต้องตรวจสอบ ใบสมัครจะถูกส่งให้ทีม Legal / Compliance / Fraud พิจารณาก่อน
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {['ข้อมูลผู้กู้', 'หลักประกัน', 'ผู้ค้ำประกัน'].map(moduleName => {
                                    const items = MOCK_BLOCK_ITEMS.filter(b => b.module === moduleName);
                                    if (items.length === 0) return null;
                                    return (
                                        <div key={moduleName} className="border border-gray-200 rounded-xl overflow-hidden">
                                            <div className="bg-gray-50 border-b border-gray-200 px-4 py-2.5">
                                                <p className="text-xs font-bold text-gray-600">{moduleName}</p>
                                            </div>
                                            <div className="divide-y divide-gray-100">
                                                {items.map((item, i) => (
                                                    <div key={i} className="px-4 py-2.5 bg-white flex items-center gap-2.5">
                                                        <div className="w-5 h-5 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                                                            <AlertTriangle className="w-3 h-3 text-amber-500" />
                                                        </div>
                                                        <p className="text-xs font-semibold text-gray-900">
                                                            {item.personName || item.collateralType}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </DialogBody>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="min-w-[104px]"
                    >
                        ยกเลิก
                    </Button>

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
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
