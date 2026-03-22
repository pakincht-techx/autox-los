"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { User, Coins, FileText, Pencil, Plus, Check, Circle, Trash2 } from "lucide-react";
import { useSidebar } from "@/components/layout/SidebarContext";
import { useApplication } from "../../../context/ApplicationContext";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
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
        const displayAppId = appId.length > 8 ? `...${appId.slice(-6)}` : appId;
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

    const handleDeleteGuarantor = () => {
        setDeleteDialogOpen(false);
        toast.success("ลบผู้ค้ำประกันสำเร็จ", {
            description: `ข้อมูลผู้ค้ำประกัน "${guarantorName}" ถูกลบเรียบร้อยแล้ว`,
            duration: 2000,
        });
        setTimeout(() => {
            router.push(`/dashboard/new-application/${appId}/guarantors`);
        }, 500);
    };

    const modules = [
        {
            title: "ข้อมูลผู้ค้ำ",
            value: `${guarantorAge} ปี`,
            icon: <User className="w-24 h-24" />,
            isEmpty: false,
            completionStatus: 'incomplete' as const,
            href: `${basePath}/info`,
        },
        {
            title: "อาชีพและรายได้",
            value: "-",
            unit: "บาท/เดือน",
            icon: <Coins className="w-24 h-24" />,
            isEmpty: true,
            completionStatus: 'incomplete' as const,
            href: `${basePath}/income`,
        },
        {
            title: "ภาระหนี้สิน",
            value: "-",
            unit: "บาท/เดือน",
            icon: <FileText className="w-24 h-24" />,
            isEmpty: true,
            completionStatus: 'incomplete' as const,
            href: `${basePath}/debt`,
        },
    ];

    return (
        <>
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold">{guarantorName}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {modules.map((mod) => (
                        <SummaryCard
                            key={mod.title}
                            title={mod.title}
                            value={mod.value}
                            unit={mod.unit}
                            icon={mod.icon}
                            isEmpty={mod.isEmpty}
                            completionStatus={mod.completionStatus}
                            onEdit={() => router.push(mod.href)}
                        />
                    ))}
                </div>

                {/* Delete Guarantor Button */}
                {!isReadonly && (
                    <div className="pt-4 border-t border-border-subtle">
                        <Button
                            variant="ghost"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 font-bold"
                            onClick={() => setDeleteDialogOpen(true)}
                        >
                            <Trash2 className="w-4 h-4 mr-1.5" />
                            ลบผู้ค้ำประกัน
                        </Button>
                    </div>
                )}
            </div>

            {/* Delete Guarantor Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>ยืนยันการลบผู้ค้ำประกัน</AlertDialogTitle>
                        <AlertDialogDescription>
                            คุณต้องการลบข้อมูลผู้ค้ำประกัน &quot;{guarantorName}&quot; ใช่หรือไม่?
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

function SummaryCard({
    title,
    value,
    unit,
    icon,
    isEmpty = false,
    completionStatus,
    onEdit,
}: {
    title: string;
    value: React.ReactNode;
    unit?: string;
    icon?: React.ReactNode;
    isEmpty?: boolean;
    completionStatus?: 'completed' | 'incomplete';
    onEdit?: () => void;
}) {
    return (
        <div className={cn(
            "rounded-2xl p-5 flex flex-col justify-between min-h-[140px] group relative overflow-hidden transition-all duration-300 cursor-pointer",
            isEmpty
                ? (onEdit ? "bg-white border-2 border-dashed border-gray-300 hover:border-chaiyo-blue/50" : "bg-gray-50/50 border border-border-subtle")
                : completionStatus === 'completed'
                    ? "bg-blue-50/40 border border-blue-100/60 hover:border-blue-200"
                    : "bg-gray-50/80 border border-gray-200 hover:border-gray-300"
        )}
        onClick={onEdit}
        >
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
                    <div className="text-sm font-medium text-foreground tracking-tight">
                        {value}
                        {unit && <span className="text-sm text-foreground ml-1">{unit}</span>}
                    </div>
                )}
            </div>
            {onEdit && (
                <Button
                    variant={isEmpty ? "default" : "outline"}
                    onClick={(e) => { e.stopPropagation(); onEdit(); }}
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
        </div>
    );
}
