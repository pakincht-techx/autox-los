import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Shield, User, ChevronDown } from "lucide-react";
import { StatusBanner } from "@/components/ui/StatusBanner";
import { cn } from "@/lib/utils";
import { ExternalLink, Printer } from "lucide-react";
import { privacyNoticeHtml } from "@/data/privacy-notice-content";
import { useSidebar } from "@/components/layout/SidebarContext";

interface PrivacyConsentStepProps {
    onAccept: () => void;
    onBack?: () => void;
    collateralType?: string;
}

export const PrivacyConsentStep = ({ onAccept, onBack, collateralType }: PrivacyConsentStepProps) => {
    const [isPrivacyAccepted, setIsPrivacyAccepted] = useState(false);
    const [hasReadConsent, setHasReadConsent] = useState(false);
    const [showStaffBanner, setShowStaffBanner] = useState(true);
    const { setHideSaveDraftButton } = useSidebar();

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
        
        setHideSaveDraftButton(true);

        return () => {
            window.removeEventListener('resize', checkScrollable);
            setHideSaveDraftButton(false);
        };
    }, [setHideSaveDraftButton]);

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
            if (scrollTop + clientHeight >= scrollHeight - 30) {
                setHasReadConsent(true);
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
                    disabled={!hasReadConsent}
                />
                <label
                    htmlFor="accept-privacy"
                    className={cn(
                        "cursor-pointer select-none",
                        !hasReadConsent ? "text-gray-400" : "text-gray-700"
                    )}
                >
                    <span className="font-bold">ข้าพเจ้าได้อ่านและรับทราบประกาศนโยบายความเป็นส่วนตัว (Privacy Notice)</span>
                    {!hasReadConsent && (
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

                    รับทราบ
                </Button>
            </div>
        </div>
    );
};
