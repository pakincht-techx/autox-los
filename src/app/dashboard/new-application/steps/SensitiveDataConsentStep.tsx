import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { CheckCircle, ShieldAlert, FileText, ChevronDown, XCircle, User } from "lucide-react";
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

interface SensitiveDataConsentStepProps {
    onAccept: () => void;
    onBack?: () => void;
}

export const SensitiveDataConsentStep = ({ onAccept, onBack }: SensitiveDataConsentStepProps) => {
    const router = useRouter();
    const [hasReadConsent, setHasReadConsent] = useState(false);
    const [isConsentAccepted, setIsConsentAccepted] = useState(false);
    const [isDeclineDialogOpen, setIsDeclineDialogOpen] = useState(false);
    const [showStaffBanner, setShowStaffBanner] = useState(true);

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
        return () => window.removeEventListener('resize', checkScrollable);
    }, []);

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
            if (scrollTop + clientHeight >= scrollHeight - 30) {
                setHasReadConsent(true);
            }
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
            {/* Staff Instruction Banner */}
            {showStaffBanner && (
                <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl flex items-center gap-4 shadow-sm -mt-2">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                            <User className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                            <h3 className="text-orange-900 font-bold text-lg mb-0.5">พนักงานต้องยื่น iPad ให้ลูกค้า</h3>
                            <p className="text-orange-700 text-sm">
                                เพื่อให้ลูกค้าอ่านรายละเอียด และกดยอมรับด้วยตนเอง
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="text-center space-y-2 mb-6">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldAlert className="w-8 h-8 text-chaiyo-blue" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">หนังสือให้ความยินยอมเก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคลที่ละเอียดอ่อน</h2>
                <p className="text-muted-foreground">เพื่อการให้บริการที่ครบถ้วน กรุณาอ่านและให้ความยินยอม</p>
            </div>

            <div className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden mt-6">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <div className="flex items-center gap-2 font-semibold text-gray-700">
                        <FileText className="w-4 h-4 text-chaiyo-blue" />
                        ความยินยอมข้อมูลอ่อนไหว (Sensitive Data)
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
                    <p>
                        <strong>ข้อมูลส่วนบุคคลที่ละเอียดอ่อน (Sensitive Personal Data)</strong><br />
                        บริษัทฯ มีความจำเป็นต้องเก็บรวบรวม ใช้ และ/หรือเปิดเผยข้อมูลส่วนบุคคลที่ละเอียดอ่อนของท่าน เพื่อวัตถุประสงค์ในการพิสูจน์และยืนยันตัวตน (KYC/CDD) ตามกฎหมายว่าด้วยการป้องกันและปราบปรามการฟอกเงิน และกฎหมายอื่นๆ ที่เกี่ยวข้อง
                    </p>
                    <p>
                        <strong>ข้อมูลที่จัดเก็บ</strong><br />
                        ข้อมูลที่ปรากฏบนบัตรประจำตัวประชาชนของท่าน ซึ่งอาจรวมถึงข้อมูล <strong>ศาสนา</strong> และ/หรือ <strong>หมู่โลหิต</strong> ที่ไม่ได้มีการขีดฆ่า หรือปิดทับไว้อย่างชัดเจน
                    </p>
                    <p>
                        <strong>การให้ความยินยอม</strong><br />
                        ข้าพเจ้ายินยอมให้บริษัทฯ เก็บรวบรวม ใช้ และ/หรือเปิดเผยข้อมูลศาสนา และ/หรือหมู่โลหิตที่ปรากฏบนบัตรประจำตัวประชาชนและเอกสารอื่นๆ ของข้าพเจ้า เพื่อการพิสูจน์และยืนยันตัวตนของข้าพเจ้า
                        ทั้งนี้ การที่ท่านกดตกลง หรือดำเนินธุรกรรมต่อไป ถือว่าท่านได้อ่าน ทำความเข้าใจ และให้ความยินยอมในการประมวลผลข้อมูลส่วนบุคคลที่ละเอียดอ่อนดังกล่าวแก่บริษัทฯ ตามวัตถุประสงค์ที่ระบุไว้
                    </p>
                    <p>
                        -------------------------------------------------<br />
                        ข้าพเจ้าได้อ่านและทำความเข้าใจข้อความข้างต้นทั้งหมดแล้ว และตกลงยินยอมตามเงื่อนไขที่ระบุไว้ทุกประการ
                    </p>
                    <div className="h-10"></div>
                </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start gap-3">
                <Checkbox
                    id="accept-sensitive"
                    className="mt-1"
                    checked={isConsentAccepted}
                    onCheckedChange={(checked) => setIsConsentAccepted(checked as boolean)}
                    disabled={!hasReadConsent}
                />
                <label
                    htmlFor="accept-sensitive"
                    className={cn(
                        "cursor-pointer select-none",
                        !hasReadConsent ? "text-gray-400" : "text-gray-700"
                    )}
                >
                    <span className="font-bold">ข้าพเจ้าได้อ่าน และรับทราบการเก็บรวบรวมการใช้ และเปิดเผยข้อมูลส่วนบุคคลที่ละเอียดอ่อน</span>
                    {!hasReadConsent && (
                        <p className="text-xs text-orange-500 mt-1">* กรุณาเลื่อนอ่านรายละเอียดด้านบนให้ครบถ้วนก่อนยอมรับ</p>
                    )}
                </label>
            </div>

            <div className={cn("flex pt-4 flex-col sm:flex-row gap-4", onBack ? "justify-between" : "justify-end")}>
                {onBack && (
                    <Button
                        variant="outline"
                        onClick={onBack}
                        className="min-w-[200px] h-12 rounded-xl text-gray-500 hover:text-gray-900 border-gray-300 bg-white font-bold"
                    >
                        ย้อนกลับ
                    </Button>
                )}
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
                        ปฏิเสธการให้ความยินยอม
                    </Button>
                    <Button
                        onClick={onAccept}
                        disabled={!isConsentAccepted}
                        className={cn(
                            "min-w-[200px] h-12 transition-all rounded-xl font-bold",
                            isConsentAccepted
                                ? "bg-chaiyo-blue hover:bg-chaiyo-blue/90 text-white shadow-blue-200"
                                : "bg-gray-200 text-gray-400 shadow-none hover:bg-gray-200 cursor-not-allowed"
                        )}
                    >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        ยืนยันการให้ความยินยอม
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
