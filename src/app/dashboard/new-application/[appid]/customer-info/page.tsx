"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CustomerInfoStep } from "../../steps/CustomerInfoStep";
import { useApplication } from "../../context/ApplicationContext";
import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogBody,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/Dialog";
import { Loader2, CheckCircle, ChevronRight, XCircle, ShieldAlert } from "lucide-react";

export default function CustomerInfoPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { formData, setFormData, appId, setNextOverride, setHideLayoutNav, setMandatoryCheckOverride } = useApplication();

    // Detect if this is edit mode (coming back from detail page)
    const isEditMode = searchParams.get('state') === 'draft';

    // Status Check State: HARD_BLOCK = cannot proceed
    const [isCheckingStatus, setIsCheckingStatus] = useState(false);
    const [statusCheckResult, setStatusCheckResult] = useState<"NORMAL" | "HARD_BLOCK" | null>(null);
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

    // In new-app mode: hide layout footer, show own button
    // In edit mode: show layout footer, hide own button
    useEffect(() => {
        if (!isEditMode) {
            setHideLayoutNav(true);
        }
        return () => setHideLayoutNav(false);
    }, [isEditMode, setHideLayoutNav]);

    // Register mandatory field check (edit mode only — new-app has its own flow)
    useEffect(() => {
        if (isEditMode) {
            setMandatoryCheckOverride(() => {
                return !formData.firstName || !formData.idNumber;
            });
        }
        return () => setMandatoryCheckOverride(null);
    }, [isEditMode, formData.firstName, formData.idNumber, setMandatoryCheckOverride]);

    // Register custom next handler
    useEffect(() => {
        setNextOverride(handleNext);
        return () => {
            setNextOverride(null);
        };
    }, [formData.idNumber, appId]);

    const handleNext = () => {
        setIsCheckingStatus(true);
        setIsStatusDialogOpen(true);
        setStatusCheckResult(null);

        setTimeout(() => {
            let result: "NORMAL" | "HARD_BLOCK" = "NORMAL";
            const idToTest = formData.idNumber || "";

            // Mock logic: 888 = Hard Block, otherwise normal
            if (idToTest.endsWith('888')) {
                result = "HARD_BLOCK";
            }

            setStatusCheckResult(result);
            setIsCheckingStatus(false);

            if (result === "NORMAL") {
                setTimeout(() => {
                    setIsStatusDialogOpen(false);
                    router.push(`/dashboard/applications/${appId || 'draft'}?checkStatus=normal`);
                }, 1000);
            }
        }, 1500);
    };

    return (
        <>
            <CustomerInfoStep
                formData={formData}
                setFormData={setFormData}
            />

            {/* Action Button — only in new-app mode */}
            {!isEditMode && (
                <div className="flex justify-end pt-6 mt-6 border-t border-gray-100">
                    <Button
                        size="lg"
                        onClick={handleNext}
                        className="px-8 shadow-none"
                    >
                        ดำเนินการต่อ <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            )}

            {/* Status Check Dialog */}
            <Dialog open={isStatusDialogOpen} onOpenChange={(open) => {
                // Hard block dialog cannot be dismissed by clicking outside
                if (!open && !isCheckingStatus && statusCheckResult === "NORMAL") {
                    setIsStatusDialogOpen(false);
                }
            }}>
                <DialogContent>

                    {/* ── Loading State ── */}
                    {!statusCheckResult || isCheckingStatus ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="h-12 w-12 text-chaiyo-blue animate-spin mb-6" />
                            <DialogHeader className="space-y-2 items-center text-center">
                                <DialogTitle>กำลังตรวจสอบสถานะลูกค้า</DialogTitle>
                                <DialogDescription>
                                    ระบบกำลังตรวจสอบข้อมูลผู้สมัครกับฐานข้อมูล<br />กรุณารอสักครู่...
                                </DialogDescription>
                            </DialogHeader>
                        </div>

                        /* ── NORMAL: Pass ── */
                    ) : statusCheckResult === "NORMAL" ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle className="h-10 w-10 text-emerald-500" />
                            </div>
                            <DialogHeader className="space-y-2 items-center text-center">
                                <DialogTitle>สถานะปกติ</DialogTitle>
                                <DialogDescription>
                                    ตรวจสอบสำเร็จ กำลังไปสู่ขั้นตอนถัดไป...
                                </DialogDescription>
                            </DialogHeader>
                        </div>

                        /* ── HARD BLOCK: Cannot proceed ── */
                    ) : statusCheckResult === "HARD_BLOCK" ? (
                        <>
                            <div className="flex flex-col items-center justify-center pt-4">
                                <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
                                    <XCircle className="h-10 w-10 text-red-500" />
                                </div>
                                <DialogHeader className="space-y-2 items-center text-center">
                                    <DialogTitle>
                                        ไม่สามารถดำเนินการต่อได้
                                    </DialogTitle>
                                    <DialogDescription>
                                        ผู้สมัครรายนี้ไม่ผ่านเกณฑ์การตรวจสอบ
                                        ไม่สามารถดำเนินการสมัครสินเชื่อต่อได้
                                    </DialogDescription>
                                </DialogHeader>
                            </div>

                            <DialogBody>
                                <div className="bg-red-50 p-4 rounded-xl text-red-800 border border-red-100 text-sm">
                                    <p className="flex items-start gap-3">
                                        <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                                        <span>
                                            <strong className="block mb-1">สิ่งที่ต้องดำเนินการ:</strong>
                                            กรุณายกเลิกใบสมัครนี้ และแจ้งให้ลูกค้าทราบว่าไม่สามารถดำเนินการได้ในขณะนี้
                                        </span>
                                    </p>
                                </div>
                            </DialogBody>

                            <DialogFooter>
                                <Button
                                    variant="destructive"
                                    size="lg"
                                    onClick={() => {
                                        setIsStatusDialogOpen(false);
                                        router.push(`/dashboard/applications`);
                                    }}
                                    className="w-full shadow-none"
                                >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    ยกเลิกใบสมัคร
                                </Button>
                            </DialogFooter>
                        </>

                    ) : null}
                </DialogContent>
            </Dialog>
        </>
    );
}
