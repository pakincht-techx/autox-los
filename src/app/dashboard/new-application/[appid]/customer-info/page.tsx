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
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/Dialog";
import { Loader2, CheckCircle, AlertCircle, ChevronLeft, ChevronRight, Info, XCircle, ShieldAlert } from "lucide-react";

export default function CustomerInfoPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { formData, setFormData, appId, setNextOverride, setHideLayoutNav } = useApplication();

    // Detect if this is edit mode (coming back from detail page)
    const isEditMode = searchParams.get('state') === 'draft';

    // Status Check State: HARD_BLOCK = cannot proceed, SOFT_BLOCK = can proceed with review
    const [isCheckingStatus, setIsCheckingStatus] = useState(false);
    const [statusCheckResult, setStatusCheckResult] = useState<"NORMAL" | "HARD_BLOCK" | "SOFT_BLOCK" | null>(null);
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
    const [softBlockReasons, setSoftBlockReasons] = useState<string[]>([]);

    // In new-app mode: hide layout footer, show own button
    // In edit mode: show layout footer, hide own button
    useEffect(() => {
        if (!isEditMode) {
            setHideLayoutNav(true);
        }
        return () => setHideLayoutNav(false);
    }, [isEditMode, setHideLayoutNav]);

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
            let result: "NORMAL" | "HARD_BLOCK" | "SOFT_BLOCK" = "NORMAL";
            const idToTest = formData.idNumber || "";

            // Mock logic: 888 = Hard Block, 777 = Soft Block
            if (idToTest.endsWith('888')) {
                result = "HARD_BLOCK";
            } else if (idToTest.endsWith('777')) {
                result = "SOFT_BLOCK";
            }

            // Assign mock reason codes for soft block
            const reasons: string[] = [];
            if (result === "SOFT_BLOCK") {
                // Mock: randomly assign 1-3 reason codes from [01, 02, 06]
                const allReasons = ['01', '02', '06'];
                const count = Math.floor(Math.random() * 3) + 1;
                const shuffled = [...allReasons].sort(() => 0.5 - Math.random());
                reasons.push(...shuffled.slice(0, count));
                reasons.sort();
            }
            setSoftBlockReasons(reasons);

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
                        className="px-8 font-bold shadow-lg shadow-blue-500/20"
                    >
                        ดำเนินการต่อ <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            )}

            {/* Status Check Dialog */}
            <Dialog open={isStatusDialogOpen} onOpenChange={(open) => {
                // Hard block dialog cannot be dismissed by clicking outside
                if (!open && !isCheckingStatus && statusCheckResult !== "HARD_BLOCK") {
                    setIsStatusDialogOpen(false);
                }
            }}>
                <DialogContent className="sm:max-w-xl rounded-[2rem] p-8">

                    {/* ── Loading State ── */}
                    {!statusCheckResult || isCheckingStatus ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="h-12 w-12 text-chaiyo-blue animate-spin mb-6" />
                            <DialogHeader className="space-y-2 flex flex-col items-center">
                                <DialogTitle className="text-xl font-bold text-gray-900">กำลังตรวจสอบสถานะลูกค้า...</DialogTitle>
                                <DialogDescription className="text-base text-gray-500 text-center">
                                    ระบบกำลังตรวจสอบข้อมูลผู้สมัครกับฐานข้อมูล<br />กรุณารอสักครู่
                                </DialogDescription>
                            </DialogHeader>
                        </div>

                    /* ── NORMAL: Pass ── */
                    ) : statusCheckResult === "NORMAL" ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle className="h-10 w-10 text-emerald-500" />
                            </div>
                            <DialogHeader className="space-y-2 flex flex-col items-center">
                                <DialogTitle className="text-xl font-bold text-gray-900">สถานะปกติ</DialogTitle>
                                <DialogDescription className="text-base text-gray-500 text-center">
                                    ตรวจสอบสำเร็จ กำลังไปสู่ขั้นตอนถัดไป...
                                </DialogDescription>
                            </DialogHeader>
                        </div>

                    /* ── HARD BLOCK: Cannot proceed ── */
                    ) : statusCheckResult === "HARD_BLOCK" ? (
                        <div className="space-y-8">
                            <DialogHeader className="flex flex-col items-center text-center space-y-4">
                                <div className="h-16 w-16 flex items-center justify-center rounded-full bg-red-50 shrink-0">
                                    <XCircle className="h-10 w-10 text-red-500" />
                                </div>
                                <div className="space-y-2 flex flex-col items-center">
                                    <DialogTitle className="text-xl font-bold text-gray-900">
                                        ไม่สามารถดำเนินการต่อได้
                                    </DialogTitle>
                                    <DialogDescription className="text-base text-gray-500 text-center">
                                        ผู้สมัครรายนี้ไม่ผ่านเกณฑ์การตรวจสอบ<br />
                                        ไม่สามารถดำเนินการสมัครสินเชื่อต่อได้
                                    </DialogDescription>
                                </div>
                            </DialogHeader>

                            <div className="bg-red-50 p-6 rounded-2xl text-red-800 border border-red-100">
                                <p className="flex items-start gap-3">
                                    <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                                    <span>
                                        <strong className="block mb-1">สิ่งที่ต้องดำเนินการ:</strong>
                                        กรุณายกเลิกใบสมัครนี้ และแจ้งให้ลูกค้าทราบว่าไม่สามารถดำเนินการได้ในขณะนี้
                                    </span>
                                </p>
                            </div>

                            <DialogFooter className="pt-4">
                                <Button
                                    variant="destructive"
                                    size="lg"
                                    onClick={() => {
                                        setIsStatusDialogOpen(false);
                                        router.push(`/dashboard/applications`);
                                    }}
                                    className="w-full font-bold shadow-lg shadow-red-200"
                                >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    ยกเลิกใบสมัคร
                                </Button>
                            </DialogFooter>
                        </div>

                    /* ── SOFT BLOCK: Can proceed with review ── */
                    ) : (
                        <div className="space-y-8">
                            <DialogHeader className="flex flex-col items-center text-center space-y-4">
                                <div className="h-16 w-16 flex items-center justify-center rounded-full bg-amber-50 shrink-0">
                                    <AlertCircle className="h-10 w-10 text-amber-600" />
                                </div>
                                <div className="space-y-2 flex flex-col items-center">
                                    <DialogTitle className="text-xl font-bold text-gray-900">
                                        ต้องการการตรวจสอบเพิ่มเติม
                                    </DialogTitle>
                                    <DialogDescription className="text-base text-gray-500 text-center">
                                        ผู้สมัครรายนี้จำเป็นต้องได้รับการตรวจสอบจากทีม Legal, Compliance และ Fraud ก่อนอนุมัติ
                                    </DialogDescription>
                                </div>
                            </DialogHeader>

                            {/* Reason Codes */}
                            {softBlockReasons.length > 0 && (
                                <div className="flex items-center justify-center gap-2 flex-wrap">
                                    {softBlockReasons.map((code) => (
                                        <span key={code} className="text-xs font-bold text-amber-700 bg-amber-100 border border-amber-200 px-3 py-1 rounded-full">
                                            รหัส {code}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="bg-amber-50 p-6 rounded-2xl text-amber-800 border border-amber-100">
                                <p className="flex items-start gap-3">
                                    <Info className="w-5 h-5 shrink-0 mt-0.5" />
                                    <span>
                                        <strong className="block mb-1">คำแนะนำในการดำเนินการ:</strong>
                                        หากดำเนินการต่อ สถานะใบสมัครจะเปลี่ยนเป็น &quot;รอพิจารณา&quot; และจะถูกส่งให้ทีมตรวจสอบพิจารณาก่อนดำเนินการในขั้นตอนถัดไป
                                    </span>
                                </p>
                            </div>

                            <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={() => setIsStatusDialogOpen(false)}
                                    className="flex-1 order-2 sm:order-1 font-bold"
                                >
                                    <ChevronLeft className="w-4 h-4 mr-2" />
                                    กลับไปตรวจสอบ
                                </Button>
                                <Button
                                    size="lg"
                                    onClick={() => {
                                        setIsStatusDialogOpen(false);
                                        // Navigate to detail page with status=in-review and check status info
                                        const reasonsParam = softBlockReasons.length > 0 ? `&reasons=${softBlockReasons.join(',')}` : '';
                                        router.push(`/dashboard/applications/${appId || 'draft'}?status=in-review&checkStatus=soft_block${reasonsParam}`);
                                    }}
                                    className="flex-[2] order-1 sm:order-2 font-bold bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-200 text-white"
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    รับทราบและดำเนินการต่อ
                                </Button>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
