"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';
import { useSidebar } from "@/components/layout/SidebarContext";
import { Button } from "@/components/ui/Button";
import { FileSignature, ChevronRight, User, Loader2, Smartphone, CheckCircle } from "lucide-react";
import { StatusBanner } from "@/components/ui/StatusBanner";
import { getMockApp } from "@/lib/mockApplications";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/Dialog";

const PdfViewer = dynamic(
    () => import('@/components/ui/PdfViewer').then((mod) => mod.PdfViewer),
    { ssr: false }
);

export default function EContractPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const router = useRouter();
    const { setBreadcrumbs, setHideNavButtons, setHideSaveDraftButton, setOnBack } = useSidebar();
    
    const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
    const [otpValue, setOtpValue] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    useEffect(() => {
        const app = getMockApp(null, id);
        const appNoPrefix = app.applicationNo ? app.applicationNo.slice(8) : `${id.substring(0, 4)}...${id.slice(-4)}`.toUpperCase();
        const firstName = app.applicantName ? app.applicantName.split(' ')[0] : '';
        const appNoShort = `${appNoPrefix}${firstName ? ` (${firstName})` : ''}`;

        setBreadcrumbs([
            { label: appNoShort, href: `/dashboard/applications/${id}` },
            { label: "สัญญาทั้งหมด", href: `/dashboard/applications/${id}/contract` },
            { label: "e-Contract", isActive: true },
        ]);
        setOnBack(() => () => router.back());
        setHideNavButtons(false);
        setHideSaveDraftButton(true);

        return () => {
            setBreadcrumbs([]);
            setHideNavButtons(false);
            setHideSaveDraftButton(false);
            setOnBack(null);
        };
    }, [id, setBreadcrumbs, setHideNavButtons, setHideSaveDraftButton, setOnBack, router]);

    return (
        <div className="bg-white min-h-[calc(100vh-64px)]">
            <div className="max-w-5xl mx-auto p-6 space-y-6">
                {/* Staff Instruction Banner */}
                <StatusBanner
                    variant="orange"
                    size="lg"
                    icon={User}
                    title="พนักงานต้องยื่น iPad ให้ลูกค้า"
                    description="เพื่อให้ลูกค้าอ่านรายละเอียดและกดยืนยันด้วยตนเอง และแจ้งลูกค้าว่ามีการอัดเสียงในขั้นตอนนี้"
                />

                <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                    <div className="w-12 h-12 rounded-xl bg-chaiyo-blue/10 flex items-center justify-center">
                        <FileSignature className="w-6 h-6 text-chaiyo-blue" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">สัญญาสินเชื่อหลัก (e-Contract)</h2>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-xl overflow-hidden border border-border-strong relative flex items-center justify-center w-full" style={{ height: '70vh' }}>
                    <PdfViewer url="/salesheets/Sale Sheet_รถ บุคคลทั่วไป V8.0 2.pdf" rotation={90} />
                </div>

                <div className="flex justify-end items-center gap-2 pt-4">
                    <Button variant="outline" size="xl" onClick={() => router.back()}>
                        ยกเลิก
                    </Button>
                    <Button
                        size="xl"
                        onClick={() => setIsOtpDialogOpen(true)}
                    >
                        ยืนยันการลงนาม <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>

            {/* ── OTP Verification Dialog ───────────────────────────────────── */}
            <Dialog open={isOtpDialogOpen} onOpenChange={setIsOtpDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader className="space-y-4 items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto">
                            <Smartphone className="w-8 h-8 text-chaiyo-blue" />
                        </div>
                        <DialogTitle className="text-center text-xl text-gray-900">ยืนยันรหัส OTP</DialogTitle>
                        <DialogDescription className="text-center">
                            ระบบได้ส่งรหัส OTP ไปที่เบอร์โทรศัพท์ของคุณ
                            <span className="block mt-1 font-bold text-gray-700">(Ref: 1A2B3C)</span>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center py-6">
                        <InputOTP
                            maxLength={6}
                            value={otpValue}
                            onChange={(value) => setOtpValue(value)}
                        >
                            <InputOTPGroup>
                                <InputOTPSlot index={0} className="h-12 w-10 sm:w-12 text-lg" />
                                <InputOTPSlot index={1} className="h-12 w-10 sm:w-12 text-lg" />
                                <InputOTPSlot index={2} className="h-12 w-10 sm:w-12 text-lg" />
                                <InputOTPSlot index={3} className="h-12 w-10 sm:w-12 text-lg" />
                                <InputOTPSlot index={4} className="h-12 w-10 sm:w-12 text-lg" />
                                <InputOTPSlot index={5} className="h-12 w-10 sm:w-12 text-lg" />
                            </InputOTPGroup>
                        </InputOTP>

                        <button
                            type="button"
                            className="mt-6 text-sm font-medium text-chaiyo-blue hover:underline disabled:text-gray-400"
                        >
                            ส่งรหัสอีกครั้ง
                        </button>
                    </div>

                    <DialogFooter className="grid grid-cols-2 gap-2">
                        <Button
                            variant="outline"
                            className="w-full h-12 rounded-xl text-gray-600 shadow-none font-bold"
                            onClick={() => setIsOtpDialogOpen(false)}
                        >
                            ยกเลิก
                        </Button>
                        <Button
                            className="w-full h-12 rounded-xl bg-chaiyo-blue text-white hover:bg-chaiyo-blue/90 shadow-none font-bold"
                            disabled={otpValue.length !== 6 || isSubmitting}
                            onClick={(e) => {
                                e.preventDefault();
                                setIsSubmitting(true);
                                // verify OTP mock
                                setTimeout(() => {
                                    setIsSubmitting(false);
                                    setIsOtpDialogOpen(false);
                                    setIsSuccessDialogOpen(true);
                                }, 1000);
                            }}
                        >
                            {isSubmitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
                            ยืนยันรหัส OTP
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {/* ── Success Dialog ───────────────────────────────────── */}
            <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
                            <CheckCircle className="w-8 h-8 text-emerald-600" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-gray-900">ทำรายการสำเร็จ</h3>
                            <p className="text-gray-500">ระบบได้บันทึกการลงนามของท่านเรียบร้อยแล้ว</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            className="w-full h-12 rounded-xl bg-chaiyo-blue text-white hover:bg-chaiyo-blue/90 shadow-none font-bold"
                            onClick={() => {
                                setIsSuccessDialogOpen(false);
                                router.push(`/dashboard/applications/${id}/contract?signed=true`);
                            }}
                        >
                            กลับสู่หน้าหลักส่วนของสัญญา
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
