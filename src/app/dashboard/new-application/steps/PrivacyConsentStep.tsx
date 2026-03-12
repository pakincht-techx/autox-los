import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Shield, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { ExternalLink, Printer } from "lucide-react";
import { privacyNoticeHtml } from "@/data/privacy-notice-content";

interface PrivacyConsentStepProps {
    onAccept: () => void;
    onBack?: () => void;
    collateralType?: string;
}

export const PrivacyConsentStep = ({ onAccept, onBack, collateralType }: PrivacyConsentStepProps) => {
    const [isPrivacyAccepted, setIsPrivacyAccepted] = useState(false);
    const [showStaffBanner, setShowStaffBanner] = useState(true);

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
                    <Shield className="w-8 h-8 text-chaiyo-blue" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">ประกาศความเป็นนโยบายส่วนตัว (Privacy notice)</h2>
                <p className="text-muted-foreground">บริษัท ออโต้ เอกซ์ จำกัด</p>
            </div>

            {/* 1. PDPA & NCB Consent */}
            <div className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden mt-6">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <div className="flex items-center gap-2 font-semibold text-gray-700">
                        กรุณาอ่านและทำความเข้าใจรายละเอียดเอกสารก่อนดำเนินการต่อ
                    </div>
                </div>

                <div
                    className="h-[500px] overflow-y-auto p-6 text-sm text-gray-700 leading-relaxed scroll-smooth privacy-content"
                    dangerouslySetInnerHTML={{ __html: privacyNoticeHtml }}
                />
            </div>

            {/* Checkbox: Privacy & NCB */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start gap-3">
                <Checkbox
                    id="accept-privacy"
                    className="mt-1"
                    checked={isPrivacyAccepted}
                    onCheckedChange={(checked) => setIsPrivacyAccepted(checked as boolean)}
                />
                <label
                    htmlFor="accept-privacy"
                    className="cursor-pointer select-none text-gray-700"
                >
                    <span className="font-bold">ข้าพเจ้าได้อ่านและรับทราบประกาศนโยบายความเป็นส่วนตัว (Privacy Notice)</span>
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

                    รับทราบ
                </Button>
            </div>
        </div>
    );
};
