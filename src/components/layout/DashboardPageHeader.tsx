"use client";

import React from 'react';
import { ChevronRight, ChevronLeft, Save } from "lucide-react";
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
}

export function DashboardPageHeader({ breadcrumbs, rightContent, className, onBack, onSaveDraft, hideNavButtons }: DashboardPageHeaderProps) {
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
        const toastId = toast.loading("กำลังบันทึกร่าง...");

        try {
            if (onSaveDraft) {
                await onSaveDraft();
            }

            toast.success("บันทึกร่างสำเร็จ", { id: toastId });

            setTimeout(() => {
                if (onBack) {
                    onBack();
                } else {
                    router.back();
                }
            }, 500);
        } catch (error) {
            toast.error("บันทึกร่างล้มเหลว", {
                id: toastId,
                description: error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการบันทึก",
            });
            setIsSaving(false);
        }
    };

    return (
        <div className={cn("w-full border-b border-gray-100 bg-white relative h-12 shrink-0 z-10", className)}>
            <div className="flex items-center justify-between w-full h-full pr-6">
                {/* LEFT: Breadcrumb */}
                <div className="flex-1 flex items-center justify-start text-sm text-gray-500 gap-1">
                    <div className="flex items-center gap-1">
                        {breadcrumbs.map((bc, index) => {
                            const isLast = index === breadcrumbs.length - 1;
                            return (
                                <React.Fragment key={index}>
                                    {bc.onClick ? (
                                        <button
                                            onClick={bc.onClick}
                                            className="hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-gray-50 flex items-center gap-1.5 font-medium"
                                        >
                                            <span className="truncate">{bc.label}</span>
                                        </button>
                                    ) : bc.href ? (
                                        <Link href={bc.href} className="hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-gray-50 flex items-center gap-1.5 font-medium">
                                            <span className="truncate">{bc.label}</span>
                                        </Link>
                                    ) : (
                                        <div className={`px-2 py-1 flex items-center gap-1.5 ${bc.isActive ? 'font-bold text-gray-900' : 'font-medium'}`}>
                                            <span className="truncate">{bc.label}</span>
                                        </div>
                                    )}
                                    {!isLast && <ChevronRight className="h-3.5 w-3.5 text-gray-400" />}
                                </React.Fragment>
                            )
                        })}
                    </div>
                </div>

                {/* RIGHT: Depend Container */}
                <div className="flex items-center justify-end gap-3">
                    {!hideNavButtons && (
                        <>
                            <Button variant="outline" size="sm" onClick={handleBack}>
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                ย้อนกลับ
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleSaveDraft} disabled={isSaving}>
                                <Save className={cn("w-4 h-4 mr-2", isSaving && "animate-spin")} />
                                {isSaving ? "กำลังบันทึก..." : "บันทึกร่าง"}
                            </Button>
                        </>
                    )}
                    {rightContent}
                </div>
            </div>
        </div>
    );
}
