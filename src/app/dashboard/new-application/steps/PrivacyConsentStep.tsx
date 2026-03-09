import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { CheckCircle, Shield, FileText, ChevronDown, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ExternalLink, Printer } from "lucide-react";

interface PrivacyConsentStepProps {
    onAccept: () => void;
    onBack?: () => void;
    collateralType?: string;
}

export const PrivacyConsentStep = ({ onAccept, onBack, collateralType }: PrivacyConsentStepProps) => {
    const [hasReadPrivacy, setHasReadPrivacy] = useState(false);
    const [isPrivacyAccepted, setIsPrivacyAccepted] = useState(false);
    const [showStaffBanner, setShowStaffBanner] = useState(true);

    const privacyScrollRef = useRef<HTMLDivElement | null>(null);

    const checkScrollable = () => {
        if (privacyScrollRef.current) {
            const { scrollHeight, clientHeight } = privacyScrollRef.current;
            if (scrollHeight <= clientHeight) {
                setHasReadPrivacy(true);
            }
        }
    };

    useEffect(() => {
        checkScrollable();
        window.addEventListener('resize', checkScrollable);
        return () => window.removeEventListener('resize', checkScrollable);
    }, []);

    const handleScroll = (ref: React.RefObject<HTMLDivElement | null>, setReadState: (val: boolean) => void) => {
        if (ref.current) {
            const { scrollTop, scrollHeight, clientHeight } = ref.current;
            if (scrollTop + clientHeight >= scrollHeight - 30) {
                setReadState(true);
            }
        }
    };

    const handleOpenSalesSheet = () => {
        const pdfPath = collateralType === 'land'
            ? "/salesheets/Sales Sheet_ที่ดิน_บุคคลทั่วไปV7_ปกค231.2568.pdf"
            : "/salesheets/Sale Sheet_รถ บุคคลทั่วไป V8.0 2.pdf";
        window.open(pdfPath, '_blank');
    };

    return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            {/* Staff Instruction Banner */}
            {showStaffBanner && (
                <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl flex items-center justify-between gap-4 shadow-sm -mt-2">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                            <User className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                            <h3 className="text-orange-900 font-bold text-lg mb-0.5">พนักงาน : กรุณายื่นอุปกรณ์ให้ลูกค้า</h3>
                            <p className="text-orange-700 text-sm">
                                เพื่อให้ลูกค้าอ่านรายละเอียดและกดยอมรับด้วยตนเอง
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowStaffBanner(false)}
                        className="p-1 hover:bg-orange-100 rounded-lg transition-colors text-orange-500"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}

            <div className="text-center space-y-2 mb-6">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-chaiyo-blue" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">เอกสารและหนังสือความยินยอม</h2>
                <p className="text-muted-foreground">กรุณาอ่านและทำความเข้าใจรายละเอียดเอกสารก่อนดำเนินการต่อ</p>
            </div>

            {/* 1. PDPA & NCB Consent */}
            <div className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden mt-6">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <div className="flex items-center gap-2 font-semibold text-gray-700">
                        <FileText className="w-4 h-4 text-chaiyo-blue" />
                        ข้อกำหนดและเงื่อนไข (Privacy Notice)
                    </div>
                    {!hasReadPrivacy && (
                        <div className="text-xs text-orange-500 flex items-center gap-1 animate-pulse">
                            <ChevronDown className="w-3 h-3" />
                            กรุณาเลื่อนอ่านจนจบ
                        </div>
                    )}
                </div>

                <div
                    ref={privacyScrollRef}
                    onScroll={() => handleScroll(privacyScrollRef, setHasReadPrivacy)}
                    className="h-[400px] overflow-y-auto p-6 text-sm text-gray-600 space-y-4 leading-relaxed scroll-smooth"
                >
                    <p>
                        <strong>1. การเก็บรวบรวมข้อมูลส่วนบุคคล</strong><br />
                        บริษัทฯ จะเก็บรวบรวมข้อมูลส่วนบุคคลของท่านเท่าที่จำเป็นเพื่อวัตถุประสงค์ในการให้บริการสินเชื่อ โดยข้อมูลที่เก็บรวบรวมอาจรวมถึงแต่ไม่จำกัดเพียง ชื่อ-นามสกุล, ที่อยู่, เบอร์โทรศัพท์, ข้อมูลทางการเงิน และข้อมูลเครดิตบูโร (NCB)
                    </p>
                    <p>
                        <strong>2. วัตถุประสงค์ในการใช้ข้อมูล</strong><br />
                        ข้อมูลของท่านจะถูกนำไปใช้เพื่อการวิเคราะห์สินเชื่อ, การติดต่อสื่อสาร, การนำเสนอผลิตภัณฑ์ที่เหมาะสม, และการปฏิบัติตามกฎหมายที่เกี่ยวข้อง รวมถึงการตรวจสอบตัวตน (KYC) และการตรวจสอบข้อมูลเครดิต
                    </p>
                    <p>
                        <strong>3. การเปิดเผยข้อมูล</strong><br />
                        บริษัทฯ อาจเปิดเผยข้อมูลของท่านให้แก่หน่วยงานราชการ, บริษัทในเครือ, หรือพันธมิตรทางธุรกิจที่เกี่ยวข้อง เท่าที่จำเป็นตามกฎหมายหรือเพื่อการให้บริการ
                    </p>
                    <p>
                        <strong>4. สิทธิของเจ้าของข้อมูล</strong><br />
                        ท่านมีสิทธิในการขอเข้าถึง, แก้ไข, ลบ, หรือระงับการใช้ข้อมูลส่วนบุคคลของท่าน ตามหลักเกณฑ์ที่กฎหมายกำหนด โดยสามารถติดต่อเจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคลของบริษัทฯ
                    </p>
                    <p>
                        <strong>5. ระยะเวลาในการเก็บรักษา</strong><br />
                        บริษัทฯ จะเก็บรักษาข้อมูลของท่านไว้เป็นระยะเวลาตามที่กฎหมายกำหนด หรือเท่าที่จำเป็นต่อการดำเนินธุรกิจ หลังจากนั้นข้อมูลจะถูกทำลายหรือทำให้ไม่สามารถระบุตัวตนได้
                    </p>

                    <p>
                        -------------------------------------------------<br />
                        ข้าพเจ้าได้อ่านและทำความเข้าใจข้อความข้างต้นทั้งหมดแล้ว และตกลงยินยอมตามเงื่อนไขที่ระบุไว้ทุกประการ
                    </p>
                    <div className="h-10"></div>
                </div>
            </div>

            {/* Checkbox: Privacy & NCB */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start gap-3">
                <Checkbox
                    id="accept-privacy"
                    className="mt-1"
                    checked={isPrivacyAccepted}
                    onCheckedChange={(checked) => setIsPrivacyAccepted(checked as boolean)}
                    disabled={!hasReadPrivacy}
                />
                <label
                    htmlFor="accept-privacy"
                    className={cn(
                        "text-sm cursor-pointer select-none",
                        !hasReadPrivacy ? "text-gray-400" : "text-gray-700"
                    )}
                >
                    <span className="font-bold">ข้าพเจ้าได้อ่านและยอมรับข้อกำหนดและเงื่อนไข (Privacy Notice)</span>
                    <br />

                    {!hasReadPrivacy && (
                        <p className="text-xs text-orange-500 mt-1">* กรุณาเลื่อนอ่านรายละเอียดด้านบนให้ครบถ้วนก่อนยอมรับ</p>
                    )}
                </label>
            </div>

            <div className={cn("flex pt-4", onBack ? "justify-between" : "justify-end")}>
                {onBack && (
                    <Button
                        variant="outline"
                        onClick={onBack}
                        className="min-w-[200px] h-12 rounded-xl text-gray-500 hover:text-gray-900 border-gray-300 bg-white font-bold"
                    >
                        ย้อนกลับ
                    </Button>
                )}
                <Button
                    onClick={onAccept}
                    disabled={!isPrivacyAccepted}
                    className={cn(
                        "min-w-[200px] h-12 transition-all rounded-xl font-bold",
                        isPrivacyAccepted
                            ? "bg-chaiyo-blue hover:bg-chaiyo-blue/90 text-white shadow-blue-200"
                            : "bg-gray-200 text-gray-400 shadow-none hover:bg-gray-200 cursor-not-allowed"
                    )}
                >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    ยืนยันความยินยอม
                </Button>
            </div>
        </div>
    );
};
