"use client";

import React from 'react';
import { ChevronRight, ChevronLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export interface BreadcrumbItem {
    label: string;
    href?: string;
    isActive?: boolean;
    onClick?: () => void;
}

export interface DashboardPageHeaderProps {
    breadcrumbs: BreadcrumbItem[];
    rightContent?: React.ReactNode;
    className?: string;
    onBack?: () => void;
    onSaveDraft?: () => void | Promise<void>;
    hideNavButtons?: boolean;
    hideSaveDraftButton?: boolean;
}

export function DashboardPageHeader({ breadcrumbs, rightContent, className, onBack, onSaveDraft, hideNavButtons, hideSaveDraftButton }: DashboardPageHeaderProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = React.useState(false);

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            router.back();
        }
    };

    const handleSaveDraft = async () => {
        setIsSaving(true);
        const toastId = toast.loading("กำลังบันทึกแบบร่าง...");

        try {
            if (onSaveDraft) {
                await onSaveDraft();
            }

            toast.success("บันทึกแบบร่างสำเร็จ", { id: toastId });
            setIsSaving(false);
        } catch (error) {
            toast.error("บันทึกแบบร่างล้มเหลว", {
                id: toastId,
                description: error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการบันทึก",
            });
            setIsSaving(false);
        }
    };

    return (
        <div className={cn("w-full border-b border-gray-100 bg-white relative h-12 shrink-0 z-10", className)}>
            <div className="flex items-center justify-between w-full h-full pl-2 pr-6 relative">
                {/* LEFT: Back Button */}
                <div className="flex-1 flex items-center justify-start">
                    {!hideNavButtons && (
                        <Button variant="ghost" size="sm" onClick={handleBack}>
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            ย้อนกลับ
                        </Button>
                    )}
                </div>

                {/* CENTER: Breadcrumb */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center text-sm text-gray-500 gap-1 max-w-[50%] overflow-hidden">
                    <div className="flex items-center gap-1">
                        {breadcrumbs.map((bc, index) => {
                            const isLast = index === breadcrumbs.length - 1;
                            return (
                                <React.Fragment key={index}>
                                    {bc.onClick ? (
                                        <button
                                            onClick={bc.onClick}
                                            className="hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-gray-50 flex items-center gap-1.5 font-medium min-w-0 shrink"
                                        >
                                            <span className="truncate">{bc.label}</span>
                                        </button>
                                    ) : bc.href ? (
                                        <Link href={bc.href} className="hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-gray-50 flex items-center gap-1.5 font-medium min-w-0 shrink">
                                            <span className="truncate">{bc.label}</span>
                                        </Link>
                                    ) : (
                                        <div className={`px-2 py-1 flex items-center gap-1.5 min-w-0 shrink ${bc.isActive ? 'font-bold text-gray-900' : 'font-medium'}`}>
                                            <span className="truncate">{bc.label}</span>
                                        </div>
                                    )}
                                    {!isLast && <ChevronRight className="h-3.5 w-3.5 text-gray-400 shrink-0" />}
                                </React.Fragment>
                            )
                        })}
                    </div>
                </div>

                {/* RIGHT: Depend Container */}
                <div className="flex-1 flex items-center justify-end gap-3">
                    {!hideNavButtons && !hideSaveDraftButton && (
                        <Button variant="outline" size="sm" onClick={handleSaveDraft} disabled={isSaving}>
                            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {isSaving ? "กำลังบันทึก..." : "บันทึกแบบร่าง"}
                        </Button>
                    )}
                    {rightContent}
                </div>
            </div>
        </div>
    );
}
