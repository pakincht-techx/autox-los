import { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { CheckCircle, Shield, FileText, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface PrivacyConsentStepProps {
    onAccept: () => void;
}

export const PrivacyConsentStep = ({ onAccept }: PrivacyConsentStepProps) => {
    const [hasReadPrivacy, setHasReadPrivacy] = useState(false);
    const [isPrivacyAccepted, setIsPrivacyAccepted] = useState(false);
    const [hasReadSalesSheet, setHasReadSalesSheet] = useState(false);
    const [isSalesSheetAccepted, setIsSalesSheetAccepted] = useState(false);

    const privacyScrollRef = useRef<HTMLDivElement | null>(null);
    const salesScrollRef = useRef<HTMLDivElement | null>(null);

    const handleScroll = (ref: React.RefObject<HTMLDivElement | null>, setReadState: (val: boolean) => void) => {
        if (ref.current) {
            const { scrollTop, scrollHeight, clientHeight } = ref.current;
            if (scrollTop + clientHeight >= scrollHeight - 30) {
                setReadState(true);
            }
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="text-center space-y-2 mb-6">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-chaiyo-blue" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">เอกสารและหนังสือความยินยอม</h2>
                <p className="text-muted-foreground">กรุณาอ่านและทำความเข้าใจรายละเอียดเอกสารก่อนดำเนินการต่อ</p>
            </div>

            {/* 1. Sales Sheet Section (Moved to Top) */}
            <div className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <div className="flex items-center gap-2 font-semibold text-gray-700">
                        <FileText className="w-4 h-4 text-chaiyo-blue" />
                        1. เอกสารประกอบการขาย (Sales Sheet)
                    </div>
                    {!hasReadSalesSheet && (
                        <div className="text-xs text-orange-500 flex items-center gap-1 animate-pulse">
                            <ChevronDown className="w-3 h-3" />
                            กรุณาเลื่อนอ่านจนจบ
                        </div>
                    )}
                </div>

                <div
                    ref={salesScrollRef}
                    onScroll={() => handleScroll(salesScrollRef, setHasReadSalesSheet)}
                    className="h-[300px] overflow-y-auto p-6 text-sm text-gray-600 space-y-4 leading-relaxed scroll-smooth"
                >
                    <p>
                        <strong>รายละเอียดผลิตภัณฑ์สินเชื่อ (Sales Sheet)</strong><br />
                        กรุณาตรวจสอบรายละเอียดผลิตภัณฑ์ที่ท่านเลือก:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>อัตราดอกเบี้ย:</strong> แบบลดต้นลดดอก (Effective Rate) สูงสุดไม่เกิน 24% ต่อปี หรือตามที่กฎหมายกำหนด</li>
                        <li><strong>ระยะเวลาผ่อนชำระ:</strong> สามารถเลือกผ่อนชำระได้ตั้งแต่ 12 - 60 งวด</li>
                        <li><strong>ค่าธรรมเนียม:</strong>
                            <ul className="list-disc pl-5 mt-1">
                                <li>ค่าอากรแสตมป์ 0.05% ของวงเงินกู้</li>
                                <li>ค่าติดตามทวงถามหนี้ (กรณีผิดนัดชำระ) ตามอัตราที่กฎหมายกำหนด</li>
                                <li>ไม่มีค่าธรรมเนียมจัดการเงินกู้ (Front-end Fee)</li>
                            </ul>
                        </li>
                        <li><strong>การโปะปิดบัญชี:</strong> สามารถปิดบัญชีได้ก่อนกำหนด โดยไม่มีค่าปรับ (ลดดอกเบี้ยส่วนที่เหลือทั้งหมด)</li>
                        <li><strong>ผลกระทบกรณีผิดนัดชำระ:</strong> อาจมีค่าปรับล่าช้าและผลกระทบต่อประวัติเครดิตบูโร</li>
                    </ul>
                    <p>
                        -------------------------------------------------<br />
                        ข้าพเจ้าได้รับทราบรายละเอียดผลิตภัณฑ์สินเชื่อ อัตราดอกเบี้ย ค่าธรรมเนียม และเงื่อนไขต่างๆ อย่างครบถ้วนแล้ว
                    </p>
                    <div className="h-10"></div>
                </div>
            </div>

            {/* Checkbox 1: Sales Sheet */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start gap-3">
                <Checkbox
                    id="accept-sales-sheet"
                    className="mt-1"
                    checked={isSalesSheetAccepted}
                    onCheckedChange={(checked) => setIsSalesSheetAccepted(checked as boolean)}
                    disabled={!hasReadSalesSheet}
                />
                <label
                    htmlFor="accept-sales-sheet"
                    className={cn(
                        "text-sm cursor-pointer select-none",
                        !hasReadSalesSheet ? "text-gray-400" : "text-gray-700"
                    )}
                >
                    <span className="font-bold">ข้าพเจ้าได้รับทราบและเข้าใจรายละเอียดในเอกสารประกอบการขาย (Sales Sheet)</span>
                    {!hasReadSalesSheet && (
                        <p className="text-xs text-orange-500 mt-1">* กรุณาเลื่อนอ่านรายละเอียดด้านบนให้ครบถ้วนก่อนยอมรับ</p>
                    )}
                </label>
            </div>

            {/* 2. PDPA & NCB Consent (Moved to Bottom) */}
            <div className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden mt-6">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <div className="flex items-center gap-2 font-semibold text-gray-700">
                        <FileText className="w-4 h-4 text-chaiyo-blue" />
                        2. ข้อกำหนดและเงื่อนไข (Privacy Notice)
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
                        <strong>6. ความยินยอมในการเปิดเผยข้อมูลเครดิต (NCB Consent)</strong><br />
                        ข้าพเจ้ายินยอมให้บริษัทฯ ตรวจสอบข้อมูลเครดิตของข้าพเจ้าจากบริษัท ข้อมูลเครดิตแห่งชาติ จำกัด (เครดิตบูโร) เพื่อประโยชน์ในการวิเคราะห์สินเชื่อและการบริหารความเสี่ยง ตลอดระยะเวลาที่ข้าพเจ้ายังมีภาระหนี้อยู่กับบริษัทฯ
                    </p>
                    <p>
                        -------------------------------------------------<br />
                        ข้าพเจ้าได้อ่านและทำความเข้าใจข้อความข้างต้นทั้งหมดแล้ว และตกลงยินยอมตามเงื่อนไขที่ระบุไว้ทุกประการ
                    </p>
                    <div className="h-10"></div>
                </div>
            </div>

            {/* Checkbox 2: Privacy & NCB */}
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
                    <span className="text-xs text-muted-foreground">
                        รวมถึงยินยอมให้เปิดเผยข้อมูลเครดิต (NCB Consent)
                    </span>
                    {!hasReadPrivacy && (
                        <p className="text-xs text-orange-500 mt-1">* กรุณาเลื่อนอ่านรายละเอียดด้านบนให้ครบถ้วนก่อนยอมรับ</p>
                    )}
                </label>
            </div>

            <div className="flex justify-end pt-4">
                <Button
                    onClick={onAccept}
                    disabled={!isPrivacyAccepted || !isSalesSheetAccepted}
                    className={cn(
                        "min-w-[200px] h-12 shadow-lg transition-all",
                        isPrivacyAccepted && isSalesSheetAccepted
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
