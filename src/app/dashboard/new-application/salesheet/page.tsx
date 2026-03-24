"use client";

import { useState } from "react";
import dynamic from 'next/dynamic';
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { FileText, User, X, ChevronRight, Printer } from "lucide-react";
import { StatusBanner } from "@/components/ui/StatusBanner";
import { useApplication } from "../context/ApplicationContext";
import { useSidebar } from "@/components/layout/SidebarContext";
import { useEffect } from "react";

const PdfViewer = dynamic(
    () => import('@/components/ui/PdfViewer').then((mod) => mod.PdfViewer),
    { ssr: false }
);

export default function SalesheetPage() {
    const router = useRouter();
    const { formData, setFormData, appId } = useApplication();
    const { setHideSaveDraftButton } = useSidebar();
    const [showStaffBanner, setShowStaffBanner] = useState(true);

    useEffect(() => {
        setHideSaveDraftButton(true);
        return () => setHideSaveDraftButton(false);
    }, [setHideSaveDraftButton]);

    let pdfPath = "/salesheets/Sale Sheet_รถ บุคคลทั่วไป V8.0 2.pdf";
    let pdfRotation = 90;
    if (formData.collateralType === 'land') {
        pdfPath = "/salesheets/Sales Sheet_ที่ดิน_บุคคลทั่วไปV7_ปกค231.2568.pdf";
        pdfRotation = 0;
    }

    return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            {/* Staff Instruction Banner */}
            {showStaffBanner && (
                <StatusBanner
                    variant="orange"
                    size="lg"
                    icon={User}
                    title="พนักงานต้องยื่น iPad ให้ลูกค้า"
                    description="เพื่อให้ลูกค้าอ่านรายละเอียดและกดยืนยันด้วยตนเอง และแจ้งลูกค้าว่ามีการอัดเสียงในขั้นตอนนี้"
                />
            )}

            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="w-12 h-12 rounded-xl bg-chaiyo-blue/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-chaiyo-blue" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">เอกสารแนะนำผลิตภัณฑ์ (Salesheet)</h2>
                </div>
            </div>

            <div className="bg-gray-800 rounded-xl overflow-hidden border border-border-strong relative flex items-center justify-center w-full" style={{ height: '80vh' }}>
                <PdfViewer key={pdfPath} url={pdfPath} rotation={pdfRotation} />
            </div>

            <div className="flex items-center space-x-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <Checkbox
                    id="salesheet-read"
                    checked={formData.isSalesheetRead}
                    onCheckedChange={(checked) => setFormData((prev: any) => ({ ...prev, isSalesheetRead: checked === true }))}
                    className="w-5 h-5 border-chaiyo-blue data-[state=checked]:bg-chaiyo-blue"
                />
                <label
                    htmlFor="salesheet-read"
                    className="font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-gray-800"
                >

                    ข้าพเจ้าได้อ่าน และรับทราบรายละเอียดของ Salesheet
                </label>
            </div>

            <div className="flex justify-end items-center gap-2">
                <Button
                    variant="outline"
                    size="xl"
                    onClick={() => window.open(pdfPath, '_blank')}

                >
                    <Printer className="w-4 h-4 mr-2" /> พิมพ์ Salesheet
                </Button>
                <Button
                    size="xl"
                    onClick={() => router.push(`/dashboard/new-application/${appId || "25690316ULCRL0001"}/customer-info`)}
                    disabled={!formData.isSalesheetRead}

                >
                    ดำเนินการต่อ <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </div>
    );
}
