"use client";

import { Suspense } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, ChevronLeft, ChevronRight, Save, Send, User, Car, DollarSign, Calculator, FileText, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useSidebar } from "@/components/layout/SidebarContext";
import { ApplicationProvider, useApplication, APPLICATION_STEPS, ALL_FLOW_STEPS } from "./context/ApplicationContext";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/Dialog";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
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
import { buttonVariants } from "@/components/ui/Button";
import { AlertCircle, CheckCircle } from "lucide-react";

// ─── Inner Layout (uses context) ─────────────────────────────────────────────

function NewApplicationLayoutInner({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { setBreadcrumbs, setRightContent } = useSidebar();
    const {
        appId,
        isApplicationStarted,
        applicationStepIndex,
        isScreeningPhase,
        navigateNext,
        navigatePrev,
        hideLayoutNav,
        formData,
    } = useApplication();

    const [confirmLeaveDialog, setConfirmLeaveDialog] = useState(false);
    const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
    const [submitComment, setSubmitComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Determine if we're in the application phase
    const isApplicationPhase = applicationStepIndex >= 0;

    // Borrower name from formData
    const borrowerDisplayName = [
        formData.prefix,
        formData.firstName,
        formData.lastName,
    ].filter(Boolean).join(" ") || null;

    // ── Breadcrumbs ─────────────────────────────────────────────────────────
    useEffect(() => {
        setBreadcrumbs([
            {
                label: "รายการใบสมัคร",
                onClick: () => {
                    if (isApplicationStarted) {
                        setConfirmLeaveDialog(true);
                    } else {
                        router.push("/dashboard/applications");
                    }
                }
            },
            { label: isApplicationStarted && appId ? appId : "สร้างใบสมัคร", isActive: true }
        ]);

        if (isApplicationStarted) {
            setRightContent(
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={() => toast.success("บันทึกแบบร่างสำเร็จ", {
                            description: "ข้อมูลใบสมัครของคุณถูกบันทึกเรียบร้อยแล้ว",
                            duration: 3000,
                        })}
                    >
                        <Save className="w-4 h-4 mr-2" /> บันทึกแบบร่าง
                    </Button>
                    <Button
                        variant="default"
                        onClick={() => setIsSubmitDialogOpen(true)}
                    >
                        <Send className="w-4 h-4 mr-2" /> ส่งใบสมัคร
                    </Button>
                </div>
            );
        } else {
            setRightContent(null);
        }

        return () => {
            setBreadcrumbs([]);
            setRightContent(null);
        };
    }, [isApplicationStarted, appId, setBreadcrumbs, setRightContent, router]);

    // Check if we're on the review page (last step - no bottom nav)
    const isReviewPage = pathname.endsWith('/review');

    return (
        <div className="h-full bg-sidebar">
            <div className="max-w-7xl mx-auto space-y-6 p-6 lg:px-8 lg:py-6 pb-32">
                {/* Header Title Section */}
                {!isApplicationPhase && (
                    <div className="px-2">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-chaiyo-blue to-blue-800">
                            ตรวจสอบสถานะลูกค้า
                        </h1>
                        <p className="text-muted mt-1">
                            ขั้นตอนการตรวจสอบข้อมูลและสถานะของลูกค้า
                        </p>
                    </div>
                )}

                {/* Sticky Borrower Name Header — application phase only, full-width */}
                {isApplicationPhase && borrowerDisplayName && (
                    <div className="sticky top-0 z-30 bg-white py-3 border-b border-border-subtle shadow-sm -mt-6 -mx-6 lg:-mx-8 px-6 lg:px-8">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-chaiyo-blue/10 flex items-center justify-center">
                                    <User className="w-4.5 h-4.5 text-chaiyo-blue" />
                                </div>
                                <div>
                                    <p className="text-[11px] text-muted-foreground leading-none mb-0.5">ผู้กู้</p>
                                    <p className="text-base font-semibold text-foreground leading-tight">{borrowerDisplayName}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── SCREENING PHASE: No stepper, simple card ─────────────── */}
                {isScreeningPhase && (
                    <div className="animate-in fade-in zoom-in-95 duration-500">
                        <Card className="min-h-[500px] border border-border-subtle shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] bg-white overflow-hidden">
                            <CardContent className="p-10">
                                {children}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* ── APPLICATION PHASE: With Stepper + Navigation ─────────── */}
                {isApplicationPhase && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="flex flex-col gap-8 items-start">
                            <div className="flex-1 w-full min-w-0">
                                <Card className="min-h-[600px] border border-border-subtle shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] bg-white">

                                    {/* HORIZONTAL STEPPER */}
                                    <div className="pt-10 pb-12 border-b border-border-subtle bg-gray-50/5 rounded-t-[2rem]">
                                        <div className="relative flex items-center justify-between w-full px-12 md:px-24">
                                            <div className="absolute left-12 right-12 md:left-24 md:right-24 top-1/2 -translate-y-1/2 h-[2px] bg-gray-300 z-0">
                                                <div
                                                    className="h-full bg-chaiyo-gold transition-all duration-500 ease-in-out"
                                                    style={{
                                                        width: `${(applicationStepIndex / Math.max(APPLICATION_STEPS.length - 1, 1)) * 100}%`
                                                    }}
                                                ></div>
                                            </div>

                                            {APPLICATION_STEPS.map((step, idx) => {
                                                const isActive = idx === applicationStepIndex;
                                                const isCompleted = idx < applicationStepIndex;
                                                const StepIcon = step.icon;

                                                return (
                                                    <div key={step.id} className="flex flex-col items-center gap-2 relative">
                                                        <div className={cn(
                                                            "w-7 h-7 rounded-full border-2 flex items-center justify-center bg-white z-10 transition-all duration-300",
                                                            isActive ? "border-chaiyo-gold animate-calm-pulse text-chaiyo-blue" :
                                                                isCompleted ? "bg-chaiyo-gold border-chaiyo-gold text-blue-900 shadow-sm shadow-chaiyo-gold/20" : "border-gray-200 text-gray-300"
                                                        )}>
                                                            <StepIcon className="w-3.5 h-3.5" />
                                                        </div>
                                                        <div className="absolute top-9 w-32 text-center">
                                                            <p className={cn("text-[10px] md:text-xs font-bold", isActive ? "text-chaiyo-blue" : isCompleted ? "text-foreground" : "text-muted-foreground")}>
                                                                {step.title}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <CardHeader className="border-b border-border-subtle px-10 py-6 bg-gray-50/30">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="text-lg text-foreground flex items-center gap-2">
                                                    <span className="w-8 h-8 rounded-lg bg-chaiyo-gold/10 text-chaiyo-gold flex items-center justify-center text-sm font-bold">
                                                        {applicationStepIndex + 1}
                                                    </span>
                                                    {APPLICATION_STEPS[applicationStepIndex]?.title}
                                                </CardTitle>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="px-8 py-8 w-full">
                                        {children}
                                    </CardContent>
                                </Card>

                                {/* Footer / Navigation (hidden on Review) */}
                                {!isReviewPage && !hideLayoutNav && (
                                    <div className="flex justify-between items-center py-6 mt-2">
                                        <Button
                                            variant="ghost"
                                            onClick={navigatePrev}
                                            disabled={applicationStepIndex === 0}
                                            className="w-32 text-muted hover:bg-gray-100"
                                        >
                                            <ChevronLeft className="w-4 h-4 mr-2" /> ย้อนกลับ
                                        </Button>
                                        <Button
                                            variant="default"
                                            onClick={navigateNext}
                                            className="w-32 shadow-lg shadow-blue-500/20"
                                        >
                                            ถัดไป <ChevronRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Confirm Leave Dialog ──────────────────────────────────── */}
            <AlertDialog open={confirmLeaveDialog} onOpenChange={setConfirmLeaveDialog}>
                <AlertDialogContent className="rounded-[2rem] p-8">
                    <AlertDialogHeader>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                                <AlertCircle className="w-6 h-6 text-amber-600" />
                            </div>
                            <AlertDialogTitle className="text-xl">ออกจากระบบการขอสินเชื่อ?</AlertDialogTitle>
                        </div>
                        <AlertDialogDescription className="text-base mt-2">
                            ข้อมูลที่คุณกรอกไว้และยังไม่ได้บันทึกอาจจะสูญหาย คุณแน่ใจหรือไม่ว่าต้องการออกจากหน้านี้?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-6 gap-3">
                        <AlertDialogCancel className={cn(buttonVariants({ variant: "outline" }), "min-w-[120px]")}>
                            ยกเลิก
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => router.push("/dashboard/applications")}
                            className={cn(buttonVariants({ variant: "destructive" }), "min-w-[120px]")}
                        >
                            ยืนยันการออก
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* ── Submit Application Dialog ─────────────────────────────── */}
            <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
                <DialogContent className="rounded-[2rem] p-8 max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                <Send className="w-6 h-6 text-chaiyo-blue" />
                            </div>
                            <DialogTitle className="text-xl">ส่งใบสมัครสินเชื่อ</DialogTitle>
                        </div>
                        <DialogDescription className="text-base mt-2">
                            กรุณาระบุหมายเหตุหรือคำแนะนำเพิ่มเติมสำหรับการส่งพิจารณาใบสมัครนี้
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="comment" className="text-sm text-gray-700">หมายเหตุ / ความเห็นเพิ่มเติม</Label>
                            <Textarea
                                id="comment"
                                placeholder="ระบุรายละเอียดเพิ่มเติมที่นี่..."
                                value={submitComment}
                                onChange={(e) => setSubmitComment(e.target.value)}
                                className="min-h-[120px] resize-none"
                            />
                        </div>
                    </div>

                    <DialogFooter className="mt-2 gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setIsSubmitDialogOpen(false)}
                            className="flex-1"
                        >
                            ยกเลิก
                        </Button>
                        <Button
                            onClick={() => {
                                setIsSubmitting(true);
                                setTimeout(() => {
                                    setIsSubmitting(false);
                                    setIsSubmitDialogOpen(false);
                                    toast.success("ส่งใบสมัครสำเร็จ", {
                                        description: "ใบสมัครของคุณถูกส่งเข้าสู่ระบบการพิจารณาแล้ว",
                                    });
                                    router.push(`/dashboard/applications/${appId || 'app-256700001'}`);
                                }, 1500);
                            }}
                            variant="default"
                            className="flex-1"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    กำลังส่ง...
                                </>
                            ) : (
                                "ยืนยันการส่ง"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// ─── Exported Layout ─────────────────────────────────────────────────────────

export default function NewApplicationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Suspense fallback={
            <div className="flex justify-center flex-col items-center h-full min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-chaiyo-blue mb-4" />
                <p className="text-gray-500">กำลังโหลด...</p>
            </div>
        }>
            <ApplicationProvider>
                <NewApplicationLayoutInner>
                    {children}
                </NewApplicationLayoutInner>
            </ApplicationProvider>
        </Suspense>
    );
}
