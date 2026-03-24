"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { User, Coins, FileText, Pencil, Check, Trash2, Eye, CircleCheck, Upload } from "lucide-react";
import { useSidebar } from "@/components/layout/SidebarContext";
import { useApplication } from "../../../context/ApplicationContext";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function GuarantorDetailPage() {
    const router = useRouter();
    const params = useParams();
    const appId = params.appid as string;
    const guarantorId = params.guarantorId as string;

    const { setBreadcrumbs, setRightContent } = useSidebar();
    const { formData: applicationFormData } = useApplication();
    const searchParams = useSearchParams();
    const isReadonly = searchParams.get('state') === 'readonly';
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    useEffect(() => {
        const borrowerFirstName = applicationFormData?.firstName;
        const displayAppId = appId.length > 8 ? appId.slice(8) : appId;
        const appLabel = borrowerFirstName ? `${displayAppId} (${borrowerFirstName})` : displayAppId;
        const displayName = "ดีใจ";

        setBreadcrumbs([
            { label: "รายการใบสมัคร", onClick: () => router.push("/dashboard/applications") },
            { label: appLabel, onClick: () => router.push(`/dashboard/applications/${appId}`) },
            { label: "ผู้ค้ำ", onClick: () => router.push(`/dashboard/new-application/${appId}/guarantors`) },
            { label: displayName, isActive: true }
        ]);

        setRightContent(null);
    }, [appId, setBreadcrumbs, applicationFormData?.firstName, router, isReadonly, setRightContent]);

    const basePath = `/dashboard/new-application/${appId}/guarantors/${guarantorId}`;

    // Calculate age from BE birthDate (DD/MM/YYYY BE)
    const birthDateBE = "15/06/2523";
    const [, , yearBE] = birthDateBE.split("/").map(Number);
    const currentYearBE = new Date().getFullYear() + 543;
    const guarantorAge = currentYearBE - yearBE;

    const guarantorName = "ดีใจ ไชโย";
    const canEdit = !isReadonly;

    const handleDeleteGuarantor = () => {
        setDeleteDialogOpen(false);
        toast.success("ลบผู้ค้ำประกันสำเร็จ", {
            description: "ข้อมูลผู้ค้ำประกันถูกลบเรียบร้อยแล้ว",
            duration: 2000,
        });
        setTimeout(() => {
            router.push(`/dashboard/new-application/${appId}/guarantors`);
        }, 500);
    };

    return (
        <>
            <div className="h-full overflow-y-auto no-scrollbar bg-sidebar">
                {/* ═══════════════════════════════════════════════════════════
                    SECTION 1: GUARANTOR HEADER (full-width border bottom)
                ═══════════════════════════════════════════════════════════ */}
                <div className="bg-sidebar">
                    <div className="max-w-6xl mx-auto px-6 lg:px-8 pt-6 pb-3">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground tracking-tight">
                                    {guarantorName}
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════
                    SECTION 2: GUARANTOR DETAIL
                ═══════════════════════════════════════════════════════════ */}
                <div className="max-w-6xl mx-auto p-6 lg:p-8 space-y-8">
                    <div className="flex gap-8 items-start">
                        {/* ── Left column: Module list ── */}
                        <div className="flex-1 min-w-0 space-y-5">
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">รายละเอียดผู้ค้ำประกัน</p>
                                <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 overflow-hidden">
                                    <ModuleRow
                                        title="ข้อมูลผู้ค้ำ"
                                        icon={<User className="w-4 h-4" />}
                                        completionStatus={'completed'}
                                        onEdit={canEdit ? () => router.push(`${basePath}/info`) : undefined}
                                        onView={!canEdit ? () => router.push(`${basePath}/info?state=readonly`) : undefined}
                                    />
                                    <ModuleRow
                                        title="อาชีพและรายได้"
                                        icon={<Coins className="w-4 h-4" />}
                                        completionStatus={'completed'}
                                        onEdit={canEdit ? () => router.push(`${basePath}/income`) : undefined}
                                        onView={!canEdit ? () => router.push(`${basePath}/income?state=readonly`) : undefined}
                                    />
                                    <ModuleRow
                                        title="ภาระหนี้สิน"
                                        icon={<FileText className="w-4 h-4" />}
                                        completionStatus={'completed'}
                                        onEdit={canEdit ? () => router.push(`${basePath}/debt`) : undefined}
                                        onView={!canEdit ? () => router.push(`${basePath}/debt?state=readonly`) : undefined}
                                    />
                                </div>
                            </div>

                            {/* Group 2: เอกสารแนบ */}
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">เอกสารแนบ</p>
                                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                                    <ModuleRow
                                        title="เอกสารแนบ"
                                        icon={<Upload className="w-4 h-4" />}
                                        completionStatus={'completed'}
                                        onEdit={canEdit ? () => router.push(`${basePath}/documents`) : undefined}
                                        onView={!canEdit ? () => router.push(`${basePath}/documents?state=readonly`) : undefined}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ── Right column ── */}
                        <div className="w-[280px] shrink-0 space-y-5">
                            {/* Guarantor info */}
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">ข้อมูลผู้ค้ำ</p>
                                <div className="bg-white border border-gray-200 rounded-xl p-4">
                                    <div className="space-y-2.5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500">อายุ</span>
                                            <span className="text-xs font-semibold text-gray-800">{guarantorAge} ปี</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500">ความสัมพันธ์</span>
                                            <span className="text-xs font-semibold text-gray-800">พี่น้อง</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500">รวมรายได้กับผู้กู้</span>
                                            <Badge variant="success" className="gap-1.5">
                                                <CircleCheck className="w-3.5 h-3.5" />
                                                ใช่
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500">เจ้าของกรรมสิทธิ์ร่วม</span>
                                            <Badge variant="success" className="gap-1.5">
                                                <CircleCheck className="w-3.5 h-3.5" />
                                                ใช่
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Delete guarantor */}
                            {canEdit && (
                                <Button
                                    variant="outline"
                                    className="w-full text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50"
                                    onClick={() => setDeleteDialogOpen(true)}
                                >
                                    <Trash2 className="w-4 h-4 mr-1.5" />
                                    ลบผู้ค้ำประกัน
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Guarantor Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>ยืนยันการลบผู้ค้ำประกัน</AlertDialogTitle>
                        <AlertDialogDescription>
                            คุณต้องการลบข้อมูลผู้ค้ำประกันรายนี้ใช่หรือไม่?
                            ข้อมูลทั้งหมดของผู้ค้ำประกันรายนี้จะถูกลบอย่างถาวร
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="min-w-[120px] font-bold">
                            ยกเลิก
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteGuarantor}
                            className="min-w-[120px] font-bold bg-red-600 hover:bg-red-700 shadow-none"
                        >
                            ลบข้อมูล
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

// ─── ModuleRow (same pattern as application detail) ─────────────────────────

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
    const isEmpty = !onEdit && !onView;

    return (
        <div className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50/50 transition-colors">
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
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-chaiyo-blue"
                        onClick={onEdit}
                    >
                        <Pencil className="w-4 h-4" />
                    </Button>
                )}
                {onView && !onEdit && !isEmpty && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-chaiyo-blue"
                        onClick={onView}
                    >
                        <Eye className="w-4 h-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
