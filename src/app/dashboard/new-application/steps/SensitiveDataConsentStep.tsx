import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { CheckCircle, ShieldAlert, FileText, ChevronDown, XCircle, User } from "lucide-react";
import { StatusBanner } from "@/components/ui/StatusBanner";
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
import { useRouter } from "next/navigation";
import { useSidebar } from "@/components/layout/SidebarContext";

interface SensitiveDataConsentStepProps {
    onAccept: () => void;
}

export const SensitiveDataConsentStep = ({ onAccept }: SensitiveDataConsentStepProps) => {
    const router = useRouter();
    // Track which consent step we're on: 1 = first consent, 2 = second consent
    const [consentStep, setConsentStep] = useState<1 | 2>(1);
    const [hasReadConsent, setHasReadConsent] = useState(false);
    const [isConsentAccepted, setIsConsentAccepted] = useState(false);
    const [isDeclineDialogOpen, setIsDeclineDialogOpen] = useState(false);
    const [showStaffBanner, setShowStaffBanner] = useState(true);
    const { } = useSidebar();

    const scrollRef = useRef<HTMLDivElement | null>(null);

    const checkScrollable = () => {
        if (scrollRef.current) {
            const { scrollHeight, clientHeight } = scrollRef.current;
            if (scrollHeight <= clientHeight) {
                setHasReadConsent(true);
            }
        }
    };

    useEffect(() => {
        checkScrollable();
        window.addEventListener('resize', checkScrollable);
        
        return () => {
            window.removeEventListener('resize', checkScrollable);
        };
    }, [consentStep]);

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
            if (scrollTop + clientHeight >= scrollHeight - 30) {
                setHasReadConsent(true);
            }
        }
    };

    const handleAcceptConsent = () => {
        if (consentStep === 1) {
            // Move to second consent
            setConsentStep(2);
            setHasReadConsent(false);
            setIsConsentAccepted(false);
            // Scroll content back to top
            if (scrollRef.current) {
                scrollRef.current.scrollTop = 0;
            }
        } else {
            // Both consents accepted, proceed
            onAccept();
        }
    };



    // ─── Consent 1: Biometric / Face Recognition ───
    const consent1 = {
        title: "หนังสือให้ความยินยอมเก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคลที่ละเอียดอ่อน",
        subtitle: "เพื่อการให้บริการที่ครบถ้วน กรุณาอ่านและให้ความยินยอม",
        sectionTitle: "ความยินยอมข้อมูลอ่อนไหว (Sensitive Data)",
        checkboxLabel: "ให้ความยินยอมเกี่ยวกับข้อมูลส่วนบุคคลอ่อนไหว (สำหรับการตรวจสอบความแม่นยำของเทคโนโลยี face recognition)",
        content: (
            <>
                <p>
                    ธนาคารมีความจำเป็นต้องใช้ข้อมูลชีวภาพ (biometric) ได้แก่ ข้อมูลการจดจำใบหน้า (face recognition) ในการพิสูจน์และยืนยันตัวตนของคุณก่อนการทำธุรกรรม โดยเป็นการใช้ในครั้งนี้เท่านั้น
                </p>
                <p>
                    โปรด <strong>"ยินยอม"</strong> ให้ธนาคารใช้ข้อมูลดังกล่าว
                </p>
                <p>
                    หากธนาคารไม่ได้รับความยินยอมจากคุณ ธนาคารจะไม่สามารถให้บริการแก่คุณได้ เนื่องจากธนาคารจะต้องใช้ข้อมูลการจดจำใบหน้าในการพิสูจน์และยืนยันตัวตนก่อนการทำธุรกรรมของคุณ
                </p>
            </>
        ),
    };

    // ─── Consent 2: Face Recognition Accuracy Verification ───
    const consent2 = {
        title: "ความยินยอมเกี่ยวกับข้อมูลส่วนบุคคลอ่อนไหว (สำหรับการตรวจสอบความแม่นยำของเทคโนโลยี face recognition)",
        subtitle: "กรุณาอ่านและให้ความยินยอมเพิ่มเติม",
        sectionTitle: "ความยินยอมข้อมูลอ่อนไหว ฉบับที่ 2 (Sensitive Data #2)",
        checkboxLabel: "ให้ความยินยอมเกี่ยวกับข้อมูลส่วนบุคคลอ่อนไหว (สำหรับการตรวจสอบความแม่นยำของเทคโนโลยี face recognition)",
        content: (
            <>
                <p>
                    บริษัทมีความจำเป็นต้องเก็บรวบรวมและใช้ข้อมูลชีวภาพ (biometric) ได้แก่ ข้อมูลการจดจำใบหน้า (face recognition) เพื่อการตรวจสอบความแม่นยำของเทคโนโลยี face recognition ซึ่งผลการตรวจสอบดังกล่าวจะถูกนำไปใช้เป็นการภายในบริษัท และ/หรือใช้จัดทำรายงานการใช้เทคโนโลยี face recognition นำส่งให้แก่ธนาคารแห่งประเทศไทย โดยข้อมูลที่ปรากฏในรายงานดังกล่าวจะเป็นผลสรุปเกี่ยวกับการทำ face recognition โดยไม่ปรากฏข้อมูลชีวภาพดังกล่าวแต่อย่างใด
                </p>
                <p>
                    โปรด <strong>"ยินยอม"</strong> ให้บริษัทเก็บและใช้ข้อมูลดังกล่าว
                </p>
                <p>
                    หากบริษัทไม่ได้รับความยินยอมจากคุณ บริษัทอาจมีข้อมูลไม่เพียงพอและไม่สามารถตรวจสอบความแม่นยำของเทคโนโลยี face recognition ได้
                </p>
            </>
        ),
    };

    const currentConsent = consentStep === 1 ? consent1 : consent2;

    return (
        <div key={consentStep} className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
            {/* Staff Instruction Banner */}
            {showStaffBanner && (
                <StatusBanner
                    variant="orange"
                    size="lg"
                    icon={User}
                    title="พนักงานต้องยื่น iPad ให้ลูกค้า"
                    description="เพื่อให้ลูกค้าอ่านรายละเอียด และกดยอมรับด้วยตนเอง"
                    className="-mt-2"
                />
            )}


            <div className="text-center space-y-2 mb-6">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldAlert className="w-8 h-8 text-chaiyo-blue" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">{currentConsent.title}</h2>
                <p className="text-muted-foreground">{currentConsent.subtitle}</p>
            </div>

            <div className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden mt-6">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <div className="flex items-center gap-2 font-semibold text-gray-700">
                        <FileText className="w-4 h-4 text-chaiyo-blue" />
                        {currentConsent.sectionTitle}
                    </div>
                    {!hasReadConsent && (
                        <div className="text-xs text-orange-500 flex items-center gap-1 animate-pulse">
                            <ChevronDown className="w-3 h-3" />
                            กรุณาเลื่อนอ่านจนจบ
                        </div>
                    )}
                </div>

                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="h-[400px] overflow-y-auto p-6 text-sm text-gray-600 space-y-4 leading-relaxed scroll-smooth"
                >
                    {currentConsent.content}
                    <div className="h-10"></div>
                </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start gap-3">
                <Checkbox
                    id={`accept-sensitive-${consentStep}`}
                    className="mt-1"
                    checked={isConsentAccepted}
                    onCheckedChange={(checked) => setIsConsentAccepted(checked as boolean)}
                    disabled={!hasReadConsent}
                />
                <label
                    htmlFor={`accept-sensitive-${consentStep}`}
                    className={cn(
                        "cursor-pointer select-none",
                        !hasReadConsent ? "text-gray-400" : "text-gray-700"
                    )}
                >
                    <span className="font-bold">{currentConsent.checkboxLabel}</span>
                    {!hasReadConsent && (
                        <p className="text-xs text-orange-500 mt-1">* กรุณาเลื่อนอ่านรายละเอียดด้านบนให้ครบถ้วนก่อนยอมรับ</p>
                    )}
                </label>
            </div>

            <div className="flex pt-4 flex-col sm:flex-row gap-4 justify-end">
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                        variant="outline"
                        onClick={() => setIsDeclineDialogOpen(true)}
                        disabled={!isConsentAccepted}
                        className={cn(
                            "min-w-[200px] h-12 rounded-xl font-bold transition-colors",
                            isConsentAccepted
                                ? "text-gray-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 border-gray-300 bg-white"
                                : "text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed"
                        )}
                    >
                        <XCircle className="w-5 h-5 mr-2" />
                        ไม่ยินยอม
                    </Button>
                    <Button
                        onClick={handleAcceptConsent}
                        disabled={!isConsentAccepted}
                        className={cn(
                            "min-w-[200px] h-12 transition-all rounded-xl font-bold",
                            isConsentAccepted
                                ? "bg-chaiyo-blue hover:bg-chaiyo-blue/90 text-white shadow-blue-200"
                                : "bg-gray-200 text-gray-400 shadow-none hover:bg-gray-200 cursor-not-allowed"
                        )}
                    >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        ยินยอม
                    </Button>
                </div>
            </div>

            <AlertDialog open={isDeclineDialogOpen} onOpenChange={setIsDeclineDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>ยืนยันการปฏิเสธ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            หากคุณปฏิเสธการให้ความยินยอมข้อมูลส่วนบุคคลที่ละเอียดอ่อน คุณจะไม่สามารถดำเนินการสมัครสินเชื่อต่อได้
                            ต้องการปฏิเสธและกลับหน้าหลักใช่หรือไม่?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="min-w-[120px] font-bold shadow-none">
                            ยกเลิก
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => router.push("/dashboard/applications")}
                            className="bg-red-600 hover:bg-red-700 text-white min-w-[120px] font-bold shadow-none"
                        >
                            ยืนยันการปฏิเสธ
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
