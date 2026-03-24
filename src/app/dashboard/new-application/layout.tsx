"use client";

import { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2, Save, Send, Eye } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useSidebar } from "@/components/layout/SidebarContext";
import { ApplicationProvider, useApplication, APPLICATION_STEPS, ALL_FLOW_STEPS } from "./context/ApplicationContext";
import { MandatoryFieldWarningDialog } from "./components/MandatoryFieldWarningDialog";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogBody,
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
    const searchParams = useSearchParams();
    const isReadonly = searchParams.get('state') === 'readonly';
    const { setBreadcrumbs, setRightContent } = useSidebar();
    const {
        appId,
        isApplicationStarted,
        applicationStepIndex,
        isScreeningPhase,
        currentFlowIndex,
        navigateNext,
        navigatePrev,
        saveOverrideRef,
        mandatoryCheckRef,
        formData,
    } = useApplication();

    const [confirmLeaveDialog, setConfirmLeaveDialog] = useState(false);
    const [leaveDestination, setLeaveDestination] = useState("/dashboard/applications");
    const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
    const [submitComment, setSubmitComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mandatoryWarningOpen, setMandatoryWarningOpen] = useState(false);

    // Determine if we're in the application phase
    // applicationStepIndex covers standard stepper steps; also check ALL_FLOW_STEPS phase for extra pages like guarantors
    const isApplicationPhase = applicationStepIndex >= 0 || (!isScreeningPhase && currentFlowIndex >= 0);

    // Borrower name from formData
    const borrowerDisplayName = [
        formData.prefix,
        formData.firstName,
        formData.lastName,
    ].filter(Boolean).join(" ") || null;

    // ── Breadcrumbs ─────────────────────────────────────────────────────────
    useEffect(() => {
        const handleNavigateAway = (destination: string) => {
            if (isApplicationStarted && !isReadonly) {
                setLeaveDestination(destination);
                setConfirmLeaveDialog(true);
            } else {
                router.push(destination);
            }
        };

        // Fallback titles for slugs not in APPLICATION_STEPS
        const EXTRA_BREADCRUMB_TITLES: Record<string, string> = {
            'guarantors': 'ผู้ค้ำ',
            'refinance': 'รีไฟแนนซ์',
            'consent': 'ข้อกำหนดและเงื่อนไข',
        };
        const pathSlug = pathname.split('/').pop() || '';
        const currentStepTitle = applicationStepIndex >= 0
            ? APPLICATION_STEPS[applicationStepIndex]?.title
            : EXTRA_BREADCRUMB_TITLES[pathSlug] || null;

        const items: { label: string; onClick?: () => void; isActive?: boolean }[] = [
            {
                label: "รายการใบสมัคร",
                onClick: () => handleNavigateAway("/dashboard/applications")
            }
        ];

        if (isApplicationStarted && appId) {
            const firstName = formData?.firstName;
            const displayAppId = appId.length > 8 ? appId.slice(8) : appId;
            const appLabel = firstName ? `${displayAppId} (${firstName})` : displayAppId;

            items.push({
                label: appLabel,
                onClick: currentStepTitle ? () => handleNavigateAway(`/dashboard/applications/${appId}`) : undefined,
                isActive: !currentStepTitle
            });

            if (currentStepTitle && !isScreeningPhase) {
                items.push({
                    label: currentStepTitle,
                    isActive: true
                });
            }
        } else {
            items.push({ label: "สร้างใบสมัคร", isActive: true });
        }

        if (!pathname.includes('/guarantors/') || pathname.endsWith('/guarantors')) {
            setBreadcrumbs(items);
        }

        const isSalesheetPage = pathname.includes('/salesheet');
        const isGuarantorDetailPage = pathname.includes('/guarantors/') && !pathname.endsWith('/guarantors');
        const isGuarantorsPage = pathname.endsWith('/guarantors');
        if (isApplicationStarted && !isReadonly && !isSalesheetPage && !isGuarantorDetailPage && !isGuarantorsPage) {
            setRightContent(
                <Button
                    variant="default"
                    className=""
                    onClick={() => {
                        // If the current page has a custom save handler, use it
                        if (saveOverrideRef.current) {
                            saveOverrideRef.current();
                            return;
                        }
                        // Check if mandatory fields are missing
                        if (mandatoryCheckRef.current && mandatoryCheckRef.current()) {
                            setMandatoryWarningOpen(true);
                            return;
                        }
                        // Default: save toast + navigate back
                        toast.success("บันทึกข้อมูลสำเร็จ", {
                            description: "ข้อมูลถูกบันทึกเรียบร้อยแล้ว",
                            duration: 2000,
                        });
                        setTimeout(() => {
                            router.push(`/dashboard/applications/${appId || 'draft'}`);
                        }, 500);
                    }}
                >
                    <Save className="w-4 h-4 mr-2" /> บันทึกและกลับ
                </Button>
            );
        } else if (isReadonly) {
            setRightContent(
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Eye className="w-4 h-4" />
                    <span className="font-medium">ดูอย่างเดียว</span>
                </div>
            );
        } else {
            setRightContent(null);
        }

        return () => {
            setBreadcrumbs([]);
            setRightContent(null);
        };
    }, [isApplicationStarted, appId, setBreadcrumbs, setRightContent, router, applicationStepIndex, isScreeningPhase, formData?.firstName, isReadonly, pathname]);



    // Only match the exact guarantor detail page (/guarantors/[id]), not sub-pages like /guarantors/[id]/documents
    const guarantorSegments = pathname.split('/guarantors/')[1]?.split('/').filter(Boolean) || [];
    const isGuarantorDetailPage = pathname.includes('/guarantors/') && !pathname.endsWith('/guarantors') && !pathname.endsWith('/add') && guarantorSegments.length === 1;

    return (
        <div className="h-full bg-sidebar">
            {/* Guarantor detail page gets its own full-width layout (like application detail) */}
            {isApplicationPhase && isGuarantorDetailPage ? (
                <div className="h-full animate-in fade-in slide-in-from-bottom-8 duration-700">
                    {children}
                </div>
            ) : (
            <div className="max-w-7xl mx-auto space-y-6 p-6 lg:px-6 lg:py-6 pb-32">





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

                {/* ── APPLICATION PHASE: Clean card wrapper ─────────── */}
                {isApplicationPhase && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <Card className="min-h-[600px] border-none shadow-none bg-transparent">
                            <CardContent className={cn("p-0 w-full", isReadonly && "relative")}>
                                {isReadonly && (
                                    <div className="absolute inset-0 z-20" style={{ pointerEvents: 'all' }}>
                                        <div className="pointer-events-none" />
                                    </div>
                                )}
                                <div className={cn(isReadonly && "pointer-events-none select-none opacity-90")}>
                                    {children}
                                </div>
                            </CardContent>
                        </Card>


                    </div>
                )}
            </div>
            )}

            {/* ── Confirm Leave Dialog ──────────────────────────────────── */}
            <AlertDialog open={confirmLeaveDialog} onOpenChange={setConfirmLeaveDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>ออกจากหน้า{applicationStepIndex >= 0 ? APPLICATION_STEPS[applicationStepIndex]?.title : 'นี้'}?</AlertDialogTitle>
                        <AlertDialogDescription>
                            ข้อมูลที่คุณกรอกไว้และยังไม่ได้บันทึกอาจจะสูญหาย คุณแน่ใจหรือไม่ว่าต้องการออกจากหน้านี้?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className={cn(buttonVariants({ variant: "outline" }), "min-w-[104px]")}>
                            ยกเลิก
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => router.push(leaveDestination)}
                            className={cn(buttonVariants({ variant: "destructive" }), "min-w-[104px]")}
                        >
                            ยืนยันการออก
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* ── Submit Application Dialog ─────────────────────────────── */}
            <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                <Send className="w-6 h-6 text-chaiyo-blue" />
                            </div>
                            <DialogTitle>ส่งใบสมัครสินเชื่อ</DialogTitle>
                        </div>
                        <DialogDescription>
                            กรุณาระบุหมายเหตุหรือคำแนะนำเพิ่มเติมสำหรับการส่งพิจารณาใบสมัครนี้
                        </DialogDescription>
                    </DialogHeader>

                    <DialogBody>
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
                    </DialogBody>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsSubmitDialogOpen(false)}
                            className="min-w-[104px]"
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
                                    router.push(`/dashboard/applications/${appId || '25690316ULCRL0001'}`);
                                }, 1500);
                            }}
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
                                "ยืนยันการส่ง"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ── Mandatory Field Warning Dialog ─────────────────────────── */}
            <MandatoryFieldWarningDialog
                open={mandatoryWarningOpen}
                onOpenChange={setMandatoryWarningOpen}
                onSaveAndExit={() => {
                    setMandatoryWarningOpen(false);
                    toast.success("บันทึกข้อมูลสำเร็จ", {
                        description: "ข้อมูลถูกบันทึกเรียบร้อยแล้ว",
                        duration: 2000,
                    });
                    setTimeout(() => {
                        router.push(`/dashboard/applications/${appId || 'draft'}`);
                    }, 500);
                }}
                onCancel={() => setMandatoryWarningOpen(false)}
            />
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
