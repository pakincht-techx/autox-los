"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { ShieldAlert, ChevronDown, User, Loader2, FileText, Send } from "lucide-react";
import { StatusBanner } from "@/components/ui/StatusBanner";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/components/layout/SidebarContext";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/Dialog";
import { toast } from "sonner";

// ─── Consent Content Data ───────────────────────────────────────────────────

const CONSENT_DATA = [
    {
        id: 'tc',
        title: 'ข้อกำหนดและเงื่อนไข (Terms & Conditions)',
        description: 'กรุณาอ่านข้อกำหนดและเงื่อนไขการใช้บริการ และยินยอมเพื่อดำเนินการต่อ',
        content: `1. ผู้ขอกู้ตกลงและรับทราบว่าการพิจารณาอนุมัติสินเชื่อเป็นไปตามหลักเกณฑ์ของบริษัท\n2. ข้อมูลที่ให้ไว้เป็นความจริงทุกประการ หากพบว่าข้อมูลเป็นเท็จ บริษัทมีสิทธิยกเลิกการพิจารณา\n3. ผู้ขอกู้ยินยอมให้บริษัทคิดดอกเบี้ยและค่าธรรมเนียมตามที่ได้ตกลงกันไว้\n4. ในกรณีผิดนัดชำระหนี้ ผู้ขอกู้ยินยอมให้ดำเนินการตามกฎหมายและรับประวัติในเครดิตบูโร\n... (แสดงรายละเอียดข้อกำหนดทั้งหมด) ...`,
        mandatory: true,
        checkboxLabel: 'ข้าพเจ้าได้อ่านและยอมรับข้อกำหนดและเงื่อนไข (Terms & Conditions)'
    },
    {
        id: 'marketing',
        title: 'วัตถุประสงค์ทางการตลาด (Marketing Consent)',
        description: 'ความยินยอมเพื่อนำเสนอข้อมูล ผลิตภัณฑ์ บริการ และข้อเสนอพิเศษจากบริษัทและพันธมิตร',
        content: `บริษัทขอความยินยอมจากท่านในการเก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคลของท่าน เพื่อวัตถุประสงค์ในการนำเสนอข่าวสาร กิจกรรมทางการตลาด รายการส่งเสริมการขาย ผลิตภัณฑ์และบริการต่างๆ ที่อาจเป็นประโยชน์และตรงกับความต้องการของท่าน\n\nการให้ความยินยอมในส่วนนี้เป็นความสมัครใจ และไม่มีผลต่อการพิจารณาอนุมัติสินเชื่อของท่าน...`,
        mandatory: false,
        checkboxLabel: 'ข้าพเจ้ายินยอมให้ วัตถุประสงค์ทางการตลาด (Marketing Consent)'
    },
    {
        id: 'insurance',
        title: 'ความยินยอมเสนอขายประกัน (Insurance Consent)',
        description: 'ความยินยอมเพื่อนำเสนอผลิตภัณฑ์ประกันภัย และแนะนำบริษัทประกันภัยที่เป็นนายหน้า',
        content: `บริษัทขอความยินยอมจากท่านในการนำเสนอผลิตภัณฑ์ประกันภัยต่างๆ อาทิ ประกันชีวิต ประกันอุบัติเหตุ ประกันรถยนต์ รวมถึงการเปิดเผยข้อมูลเบื้องต้นให้แก่บริษัทประกันภัยที่เป็นพันธมิตร เพื่อประโยชน์ในการจัดทำใบเสนอราคา\n\nการให้ความยินยอมในส่วนนี้เป็นความสมัครใจ และไม่มีผลต่อการพิจารณาอนุมัติสินเชื่อของท่าน...`,
        mandatory: false,
        checkboxLabel: 'ข้าพเจ้ายินยอมให้ ความยินยอมเสนอขายประกัน (Insurance Consent)'
    }
];

// ─── Page Component ──────────────────────────────────────────────────────────

export default function ConsentStepPage() {
    const router = useRouter();
    const { setHideSaveDraftButton } = useSidebar();
    
    // Step State (0 = T&C, 1 = Marketing, 2 = Insurance)
    const [currentStep, setCurrentStep] = useState(0);
    
    // Arrays tracking state for each individual consent
    const [hasReadState, setHasReadState] = useState([false, false, false]);
    const [isAcceptedState, setIsAcceptedState] = useState([false, false, false]);

    const scrollRef = useRef<HTMLDivElement | null>(null);

    // Maker Submission Modal State
    const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const checkScrollable = () => {
        if (scrollRef.current) {
            const { scrollHeight, clientHeight } = scrollRef.current;
            if (scrollHeight <= clientHeight + 10) {
                setHasReadState(prev => {
                    if (prev[currentStep]) return prev;
                    const next = [...prev];
                    next[currentStep] = true;
                    return next;
                });
            }
        }
    };

    useEffect(() => {
        const timer = setTimeout(checkScrollable, 100);
        window.addEventListener('resize', checkScrollable);
        
        // Hide save draft because this is a customer-facing screen
        setHideSaveDraftButton(true);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', checkScrollable);
            setHideSaveDraftButton(false);
        };
    }, [currentStep, setHideSaveDraftButton]);

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
            if (scrollTop + clientHeight >= scrollHeight - 30) {
                setHasReadState(prev => {
                    if (prev[currentStep]) return prev;
                    const next = [...prev];
                    next[currentStep] = true;
                    return next;
                });
            }
        }
    };

    const handleNext = () => {
        if (currentStep < CONSENT_DATA.length - 1) {
            setCurrentStep(prev => prev + 1);
            if (scrollRef.current) {
                scrollRef.current.scrollTop = 0;
            }
        } else {
            setIsSubmitDialogOpen(true);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
            if (scrollRef.current) {
                scrollRef.current.scrollTop = 0;
            }
        } else {
            // Cancel / Go back to main
            router.push("/dashboard/applications");
        }
    };

    const toggleAccepted = (checked: boolean) => {
        setIsAcceptedState(prev => {
            const next = [...prev];
            next[currentStep] = checked;
            return next;
        });
    };

    const currentConsent = CONSENT_DATA[currentStep];
    const hasRead = hasReadState[currentStep];
    const isAccepted = isAcceptedState[currentStep];

    const canProceed = !currentConsent.mandatory || isAccepted;

    // Render the final maker submission dialog
    if (isSubmitDialogOpen) {
        return (
            <Dialog open={true} onOpenChange={setIsSubmitDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>ส่งใบสมัครสินเชื่อ</DialogTitle>
                        <DialogDescription>
                            ลูกค้ายืนยันและให้ความยินยอมเรียบร้อยแล้ว ใบสมัครจะถูกส่งเข้าสู่ระบบเพื่อพิจารณาอนุมัติ
                        </DialogDescription>
                    </DialogHeader>

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
                                        description: "ใบสมัครถูกส่งเข้าสู่ระบบการพิจารณาแล้ว",
                                    });
                                    setIsAcceptedState([false, false, false]); // Reset
                                    router.push("/dashboard/applications");
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
                                "ยืนยันการส่งเข้าระบบ"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <div key={currentStep} className="space-y-6 max-w-3xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500 pb-20 mt-4">
            {/* Staff Instruction Banner */}
            <StatusBanner
                variant="orange"
                size="lg"
                icon={User}
                title="พนักงานต้องยื่น iPad ให้ลูกค้า"
                description="เพื่อให้ลูกค้าอ่านรายละเอียด และกดยอมรับด้วยตนเองทุกขั้นตอน"
                className="-mt-2"
            />

            <div className="text-center space-y-2 mb-8 mt-2">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldAlert className="w-8 h-8 text-chaiyo-blue" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">{currentConsent.title}</h2>
                <p className="text-muted-foreground">{currentConsent.description}</p>
            </div>

            <div className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden mt-6">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <div className="flex items-center gap-2 font-semibold text-gray-700">
                        <FileText className="w-4 h-4 text-chaiyo-blue" />
                        รายละเอียดความยินยอม
                    </div>
                    {!hasRead && currentConsent.mandatory && (
                        <div className="text-xs text-orange-500 flex items-center gap-1 animate-pulse">
                            <ChevronDown className="w-3 h-3" />
                            กรุณาเลื่อนอ่านจนจบ
                        </div>
                    )}
                </div>

                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="h-[400px] overflow-y-auto p-6 text-sm text-gray-600 space-y-4 leading-relaxed scroll-smooth whitespace-pre-line"
                >
                    {currentConsent.content}
                    <div className="h-10"></div>
                </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start gap-3 mt-6">
                <Checkbox
                    id={`accept-${currentConsent.id}`}
                    className="mt-1"
                    checked={isAccepted}
                    onCheckedChange={(c) => toggleAccepted(c as boolean)}
                    disabled={currentConsent.mandatory && !hasRead}
                />
                <label
                    htmlFor={`accept-${currentConsent.id}`}
                    className={cn(
                        "cursor-pointer select-none",
                        !hasRead && currentConsent.mandatory ? "text-gray-400" : "text-gray-700"
                    )}
                >
                    <span className="font-bold flex items-center gap-1">
                        {currentConsent.checkboxLabel}
                        {currentConsent.mandatory && <span className="text-red-500">*</span>}
                    </span>
                    {!hasRead && currentConsent.mandatory && (
                        <p className="text-xs text-orange-500 mt-1">* กรุณาเลื่อนอ่านรายละเอียดด้านบนให้ครบถ้วนก่อนยอมรับ</p>
                    )}
                </label>
            </div>

            <div className="flex pt-4 flex-col sm:flex-row gap-4 justify-end mt-8">
                <Button
                    variant="outline"
                    onClick={handleBack}
                    className="min-w-[120px] font-bold h-12 rounded-xl"
                >
                    ย้อนกลับ
                </Button>
                <Button
                    onClick={handleNext}
                    disabled={!canProceed}
                    className={cn(
                        "min-w-[120px] transition-all font-bold h-12 rounded-xl border-none shadow-sm",
                        canProceed
                            ? "bg-chaiyo-blue hover:bg-chaiyo-blue/90 text-white shadow-blue-200"
                            : "bg-gray-200 text-gray-400 opacity-80 shadow-none cursor-not-allowed"
                    )}
                >
                    {currentStep === CONSENT_DATA.length - 1 ? (
                        <>
                            <Send className="w-4 h-4 mr-2" />
                            ยืนยันและส่งใบสมัคร
                        </>
                    ) : (
                        "ถัดไป"
                    )}
                </Button>
            </div>
        </div>
    );
}

