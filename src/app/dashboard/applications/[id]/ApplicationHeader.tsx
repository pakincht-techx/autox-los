"use client";

import { ArrowLeft, CheckCircle, XCircle, FileText, MoreVertical, Clock, ChevronRight, ChevronLeft, ChevronDown, ChevronUp, User, Activity, FileCheck, Send, RotateCcw, MessageSquare, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import Link from "next/link";
import { ApplicationStatus } from "@/components/applications/types";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

interface ApplicationHeaderProps {
    applicationId: string;
    applicationNo: string;
    status: ApplicationStatus;
    applicantName: string;
    productType: string;
    onApprove?: () => void;
    onReject?: () => void;
    onStatusChange?: (status: ApplicationStatus) => void;
    children?: React.ReactNode;
    isExpanded?: boolean;
    onToggleExpand?: () => void;
}

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
        case 'Cancelled': return 'ยกเลิกใบสมัคร';
        case 'Draft': return 'แบบร่าง';
        default: return status;
    }
}

export function ApplicationDetailSummary({
    applicationNo,
    status,
    applicantName,
    productType
}: Omit<ApplicationHeaderProps, 'onApprove' | 'onReject' | 'onStatusChange' | 'children'>) {
    return (
        <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
                <FileText className="h-6 w-6 text-gray-900" />
            </div>
            <div className="w-full">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold text-foreground tracking-tight">{applicationNo}</h1>
                    <Badge variant={getStatusBadgeVariant(status)}>
                        {getStatusLabel(status)}
                    </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <span className="font-medium text-gray-900">{applicantName}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span>{productType}</span>
                </div>
            </div>
        </div>
    );
}

interface SubmittedActivity {
    id: string;
    title: string;
    description: string;
    actor: string;
    position?: string;
    date: string;
    time: string;
    comment?: string;
    feedback?: string;
    icon: React.ReactNode;
    iconBg: string;
}

// Helper to get current date/time in Buddhist Era format
function getNowBE() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const yearBE = now.getFullYear() + 543;
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return { date: `${day}/${month}/${yearBE}`, time: `${hours}:${minutes}` };
}

const FEEDBACK_OPTIONS: Record<string, string> = {
    ok: 'ข้อมูลครบถ้วน ถูกต้องตามเงื่อนไข',
    doc_missing: 'เอกสารไม่ครบถ้วน / ไม่ชัดเจน',
    income_low: 'รายได้ไม่เพียงพอต่อเกณฑ์',
    policy_fail: 'ไม่ผ่านเกณฑ์นโยบายเครดิต',
    other: 'อื่นๆ (ระบุในหมายเหตุ)',
};

export function ApplicationActivitySidebar({
    status,
    onApprove,
    onReject,
    onStatusChange,
    isExpanded,
    onToggleExpand
}: Pick<ApplicationHeaderProps, 'status' | 'onApprove' | 'onReject' | 'onStatusChange' | 'isExpanded' | 'onToggleExpand'>) {
    // Current user role mock - in real app, this would come from an auth context
    const userRole: string = 'Admin'; // 'Maker', 'Checker', or 'Admin'
    const currentUserName = 'สมหมาย มุ่งมั่น (y1008001)';
    const currentUserPosition = 'ผู้ช่วยผู้จัดการสาขา';

    // Feedback form state
    const [selectedAction, setSelectedAction] = useState<string>('');
    const [selectedFeedback, setSelectedFeedback] = useState<string>('');
    const [comment, setComment] = useState('');
    const [submittedActivities, setSubmittedActivities] = useState<SubmittedActivity[]>([]);
    // Track all statuses that have been reached so past steps stay visually completed
    const [reachedStatuses, setReachedStatuses] = useState<Set<string>>(new Set([status, 'Draft']));

    const searchParams = useSearchParams();

    // Check query params on mount to simulate Watchlist/Blacklist redirect
    useEffect(() => {
        const source = searchParams?.get('source');
        if (source === 'watchlist' || source === 'blacklist') {
            const { date, time } = getNowBE();
            const sourceUpper = source.toUpperCase();

            const newActivity: SubmittedActivity = {
                id: `special-checked-${Date.now()}`,
                title: 'ส่งตรวจสอบพิเศษ',
                description: `ลูกค้าติดเงื่อนไข ${sourceUpper} - ส่งเรื่องให้ Fraud/Legal/Compliance พิจารณาเพิ่มเติม`,
                actor: 'ระบบอัตโนมัติ',
                position: 'AutoX Alert',
                date,
                time,
                icon: <Activity className="w-4 h-4 text-orange-600" />,
                iconBg: 'bg-orange-100',
            };
            setSubmittedActivities(prev => [...prev, newActivity]);
        }
    }, [searchParams]);

    // When status changes, record it as reached
    const markStatusReached = (s: string) => {
        setReachedStatuses(prev => new Set([...prev, s]));
    };

    // Helper: has the workflow ever passed through this status?
    const wasEverReached = (s: string) => reachedStatuses.has(s);

    const baseActivities = [
        {
            id: '4',
            title: status === 'Cancelled' ? 'ยกเลิกการทำรายการ' : 'ผลการพิจารณา',
            description: status === 'Approved' ? 'อนุมัติสินเชื่อ' : status === 'Rejected' ? 'ปฏิเสธสินเชื่อ' : status === 'Cancelled' ? 'ลูกค้ายกเลิกใบสมัครสินเชื่อ' : 'รอการพิจารณา',
            actor: currentUserName,
            position: currentUserPosition,
            date: status === 'Cancelled' ? '20/02/2569' : '-',
            time: status === 'Cancelled' ? '16:13' : '-',
            icon: status === 'Cancelled' ? <XCircle className="w-4 h-4 text-gray-600" /> : <FileCheck className={`w-4 h-4 ${status === 'Approved' ? 'text-emerald-600' : status === 'Rejected' ? 'text-red-600' : 'text-gray-400'}`} />,
            iconBg: status === 'Approved' ? 'bg-emerald-100' : status === 'Rejected' ? 'bg-red-100' : status === 'Cancelled' ? 'bg-gray-200' : 'bg-gray-100',
            isCompleted: status === 'Approved' || status === 'Rejected' || status === 'Cancelled',
            isCurrent: status === 'Approved' || status === 'Rejected' || status === 'Cancelled',
            canAction: false
        },
        {
            id: '3',
            title: 'กำลังพิจารณา (In Review)',
            description: 'ดำเนินการตรวจสอบข้อมูลและหลักประกัน',
            actor: '-',
            position: undefined,
            date: '-',
            time: '-',
            icon: <Activity className="w-4 h-4 text-amber-600" />,
            iconBg: 'bg-amber-100',
            isCompleted: wasEverReached('In Review'),
            isCurrent: status === 'In Review',
            canAction: userRole === 'Checker' || userRole === 'Admin'
        },

        {
            id: '2',
            title: 'ยื่นใบสมัคร (Submitted)',
            description: 'ยืนยันข้อมูลและส่งพิจารณา',
            actor: 'สมหญิง ใจดี (y1008001)',
            position: 'พนักงานสาขา',
            date: wasEverReached('In Review') ? '01/10/2566' : '-',
            time: wasEverReached('In Review') ? '11:45' : '-',
            icon: <Send className="w-4 h-4 text-blue-600" />,
            iconBg: 'bg-blue-100',
            isCompleted: wasEverReached('In Review'),
            isCurrent: false,
            canAction: false
        },
        {
            id: '1',
            title: 'สร้างใบสมัคร',
            description: 'สร้างร่างใบสมัครสินเชื่อเข้าระบบ',
            actor: 'สมหญิง ใจดี (y1008001)',
            position: 'พนักงานสาขา',
            date: '01/10/2566',
            time: '10:30',
            icon: <FileText className="w-4 h-4 text-emerald-600" />,
            iconBg: 'bg-emerald-100',
            isCompleted: true,
            isCurrent: false,
            canAction: false
        }
    ];

    const handleSubmitFeedback = () => {
        const { date, time } = getNowBE();
        const actionLabel = selectedAction === 'approve' ? 'อนุมัติ' : selectedAction === 'reject' ? 'ปฏิเสธ' : selectedAction === 'sendback' ? 'ส่งกลับ' : selectedAction === 'submit' ? 'ส่งพิจารณา' : selectedAction;
        const feedbackLabel = selectedFeedback ? FEEDBACK_OPTIONS[selectedFeedback] || selectedFeedback : '';

        const newActivity: SubmittedActivity = {
            id: `submitted-${Date.now()}`,
            title: `${actionLabel}`,
            description: feedbackLabel ? `${feedbackLabel}${comment ? ` — ${comment}` : ''}` : comment || 'ไม่มีหมายเหตุเพิ่มเติม',
            actor: currentUserName,
            position: currentUserPosition,
            date,
            time,
            comment,
            feedback: feedbackLabel,
            icon: selectedAction === 'approve'
                ? <CheckCircle className="w-4 h-4 text-emerald-600" />
                : selectedAction === 'reject'
                    ? <XCircle className="w-4 h-4 text-red-600" />
                    : selectedAction === 'sendback'
                        ? <RotateCcw className="w-4 h-4 text-orange-600" />
                        : <Send className="w-4 h-4 text-blue-600" />,
            iconBg: selectedAction === 'approve'
                ? 'bg-emerald-100'
                : selectedAction === 'reject'
                    ? 'bg-red-100'
                    : selectedAction === 'sendback'
                        ? 'bg-orange-100'
                        : 'bg-blue-100',
        };

        setSubmittedActivities(prev => [newActivity, ...prev]);

        // Advance status and record it as reached
        if (selectedAction === 'approve' && onStatusChange) {
            markStatusReached('Approved');
            onStatusChange('Approved');
        } else if (selectedAction === 'reject' && onStatusChange) {
            markStatusReached('Rejected');
            onStatusChange('Rejected');
        } else if (selectedAction === 'submit' && onStatusChange) {
            markStatusReached('In Review');
            onStatusChange('In Review');
        } else if (selectedAction === 'sendback' && onStatusChange) {
            markStatusReached('Sent Back');
            onStatusChange('Sent Back');
        }

        // Reset form
        setSelectedAction('');
        setSelectedFeedback('');
        setComment('');
    };

    // Maker re-submit handler (from footer)
    const handleMakerResubmit = () => {
        const { date, time } = getNowBE();

        const newActivity: SubmittedActivity = {
            id: `submitted-${Date.now()}`,
            title: 'ยื่นใบสมัคร',
            description: comment || 'แก้ไขข้อมูลและส่งพิจารณาอีกครั้ง',
            actor: currentUserName,
            position: currentUserPosition,
            date,
            time,
            comment,
            icon: <Send className="w-4 h-4 text-blue-600" />,
            iconBg: 'bg-blue-100',
        };

        setSubmittedActivities(prev => [newActivity, ...prev]);
        markStatusReached('In Review');
        if (onStatusChange) onStatusChange('In Review');
        setComment('');
    };

    // Merge submitted activities into the timeline
    // Once feedback is submitted, hide the "กำลังพิจารณา" base step (it's replaced by the submitted result)
    // Also hide "ผลการพิจารณา" since the submitted activity already captures the outcome
    const visibleBase = baseActivities.filter(a => {
        // Always hide "ผลการพิจารณา" unless Cancelled (since it lacks a submitted feedback event)
        if (a.id === '4' && status !== 'Cancelled') return false;
        // Always hide base "กำลังพิจารณา" when there are submitted activities — we'll add a fresh one at the top
        if (a.id === '3' && submittedActivities.length > 0) return false;
        return a.isCompleted || a.isCurrent;
    });

    // Build the dynamic "กำลังพิจารณา" entry at the top when status is In Review and there are submitted activities
    const dynamicReviewStep = (status === 'In Review' && submittedActivities.length > 0) ? [{
        id: `review-${Date.now()}`,
        title: 'กำลังพิจารณา (In Review)',
        description: 'ดำเนินการตรวจสอบข้อมูลและหลักประกัน',
        actor: '-',
        position: undefined,
        date: '-',
        time: '-',
        icon: <Activity className="w-4 h-4 text-amber-600" />,
        iconBg: 'bg-amber-100',
        isCompleted: false,
        isCurrent: true,
        canAction: userRole === 'Checker' || userRole === 'Admin'
    }] : [];

    const allActivities = [
        ...(status === 'Cancelled' ? [baseActivities.find(a => a.id === '4')!] : []),
        ...dynamicReviewStep,
        ...submittedActivities.map(a => ({ ...a, isCompleted: true, isCurrent: false, canAction: false })),
        ...visibleBase.filter(a => status === 'Cancelled' ? a.id !== '4' : true)
    ];

    return (
        <div className={cn("flex flex-col h-full", !isExpanded && "items-center overflow-x-hidden")}>
            <div className={cn("mb-4 flex items-center w-full", isExpanded ? "justify-between" : "justify-center")}>
                {isExpanded && (
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-gray-900" />
                        ประวัติการทำรายการ
                    </h3>
                )}
                {onToggleExpand && (
                    <Button variant="ghost" size="sm" onClick={onToggleExpand} className="h-8 w-8 p-0 text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors rounded-full rounded-md shrink-0">
                        {isExpanded ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </Button>
                )}
            </div>

            {isExpanded && (
                <div className="flex-1 relative space-y-6 before:absolute before:top-0 before:left-[17px] before:h-full before:w-0.5 before:bg-gray-100 w-full overflow-y-auto no-scrollbar">
                    {allActivities.map((activity) => (
                        <div key={activity.id} className="relative flex items-start group">
                            <div className={`flex items-center justify-center w-9 h-9 rounded-full border-2 border-white shrink-0 z-10 ${activity.iconBg} ${!activity.isCompleted && !activity.isCurrent && 'opacity-50 grayscale'}`}>
                                {activity.icon}
                            </div>
                            <div className={`ml-4 flex flex-col gap-1 w-full ${!activity.isCompleted && !activity.isCurrent && 'opacity-60'}`}>
                                <span className={`text-sm font-bold ${(activity.isCompleted || activity.isCurrent) ? 'text-gray-900' : 'text-gray-500'}`}>
                                    {activity.title}
                                </span>
                                <p className="text-[13px] text-gray-600">{activity.description}</p>
                                <div className="flex items-center justify-between mt-1">
                                    {activity.isCompleted && activity.actor !== '-' && (
                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                            <span className="font-medium text-gray-700">{activity.actor}</span>
                                            {activity.position && (
                                                <>
                                                    <span className="w-0.5 h-0.5 rounded-full bg-gray-300" />
                                                    <span className="text-gray-400">{activity.position}</span>
                                                </>
                                            )}
                                        </span>
                                    )}
                                    {(activity.date !== '-' || activity.time !== '-') && (
                                        <div className="text-[10px] text-gray-400 flex items-center gap-1">
                                            {activity.date !== '-' && <span>{activity.date}</span>}
                                            {activity.date !== '-' && activity.time !== '-' && <span className="w-0.5 h-0.5 rounded-full bg-gray-300 mx-0.5" />}
                                            {activity.time !== '-' && <span>{activity.time}</span>}
                                        </div>
                                    )}
                                </div>

                                {/* Authoritative Feedback & Action Card */}
                                {activity.isCurrent && activity.canAction && (
                                    <div className="mt-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm animate-in fade-in slide-in-from-top-1 duration-300">
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center gap-2 pb-2 border-b border-gray-50 mb-1">
                                                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                                                    <User className="w-3 h-3 text-gray-900" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-gray-400 leading-none">ผู้พิจารณาปัจจุบัน</span>
                                                    <span className="text-[11px] font-bold text-gray-700">{currentUserName}</span>
                                                    <span className="text-[10px] text-gray-400">{currentUserPosition}</span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">การดำเนินการ</label>
                                                <Select value={selectedAction} onValueChange={setSelectedAction}>
                                                    <SelectTrigger className="h-9 rounded-lg border-gray-100 bg-gray-50/50">
                                                        <SelectValue placeholder="เลือกการดำเนินการ" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {(status === 'Draft' || status === 'Sent Back') ? (
                                                            <SelectItem value="submit">ส่งพิจารณา (Submit)</SelectItem>
                                                        ) : (
                                                            <>
                                                                <SelectItem value="approve">อนุมัติ (Approve)</SelectItem>
                                                                <SelectItem value="sendback">ส่งกลับเพื่อแก้ไข (Send Back)</SelectItem>
                                                                <SelectItem value="reject">ปฏิเสธ (Reject)</SelectItem>
                                                            </>
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {status !== 'Draft' && status !== 'Sent Back' && (
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">ผลตอบรับ (Feedback)</label>
                                                    <Select value={selectedFeedback} onValueChange={setSelectedFeedback}>
                                                        <SelectTrigger className="h-9 rounded-lg border-gray-100 bg-gray-50/50">
                                                            <SelectValue placeholder="เลือกเหตุผลหรือผลตอบรับ..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="ok">ข้อมูลครบถ้วน ถูกต้องตามเงื่อนไข</SelectItem>
                                                            <SelectItem value="doc_missing">เอกสารไม่ครบถ้วน / ไม่ชัดเจน</SelectItem>
                                                            <SelectItem value="income_low">รายได้ไม่เพียงพอต่อเกณฑ์</SelectItem>
                                                            <SelectItem value="policy_fail">ไม่ผ่านเกณฑ์นโยบายเครดิต</SelectItem>
                                                            <SelectItem value="other">อื่นๆ (ระบุในหมายเหตุ)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            )}

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">ความเห็นเพิ่มเติม</label>
                                                <Textarea
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                    className="min-h-[90px] text-xs px-3 py-2 bg-gray-50/50 border-gray-100 focus:bg-white focus:border-chaiyo-blue transition-all"
                                                    placeholder="ระบุรายละเอียดหรือความเห็นประกอบการพิจารณา..."
                                                />
                                            </div>

                                            <Button
                                                className="w-full bg-gray-900 text-white h-10 text-xs disabled:opacity-50"
                                                onClick={handleSubmitFeedback}
                                                disabled={!selectedAction}
                                            >
                                                ยืนยันการพิจารณา
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Maker Footer: Re-submit after send back */}
            {isExpanded && status === 'Sent Back' && submittedActivities.length > 0 && (userRole === 'Maker' || userRole === 'Admin') && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center">
                            <Send className="w-3 h-3 text-blue-600" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 leading-none">ส่งใบสมัครโดย</span>
                            <span className="text-[11px] font-bold text-gray-700">{currentUserName}</span>
                            <span className="text-[10px] text-gray-400">{currentUserPosition}</span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <Textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="min-h-[80px] text-xs px-3 py-2 bg-white border-gray-200 focus:bg-white focus:border-chaiyo-blue transition-all"
                            placeholder="ระบุรายละเอียดการแก้ไขหรือหมายเหตุ..."
                        />
                        <Button
                            className="w-full bg-gray-900 text-white h-10 text-xs"
                            onClick={handleMakerResubmit}
                        >
                            <Send className="w-3.5 h-3.5 mr-1.5" />
                            ยื่นใบสมัครใหม่
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

