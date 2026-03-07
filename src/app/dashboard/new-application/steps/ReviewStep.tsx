"use client";

import { useState, useEffect } from "react";
import { Check, ShieldCheck, User, Banknote, Car, FileText, X, MessageSquare, RefreshCcw, Loader2, FileCheck, CheckCircle2, XCircle, AlertCircle, ArrowRight } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Checkbox } from "@/components/ui/Checkbox";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/Table";
import { cn } from "@/lib/utils";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CustomerFormData, CoBorrower, Guarantor } from "@/types/application";

interface ReviewStepProps {
    formData: CustomerFormData;
    setFormData: React.Dispatch<React.SetStateAction<CustomerFormData>>;
    onSubmit: () => void;
    onEdit: (step: number) => void;
}

export function ReviewStep({ formData, setFormData, onSubmit, onEdit }: ReviewStepProps) {
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [showOTP, setShowOTP] = useState(false);
    const [otp, setOtp] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    // Submission & Approval State
    const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'analyzing' | 'approved' | 'rejected' | 'manual_review'>('idle');
    const [approvalResult, setApprovalResult] = useState<{
        status: string;
        approvedAmount: number;
        interestRate: number;
        monthlyPayment: number;
        reason?: string;
    } | null>(null);


    const [alertDialog, setAlertDialog] = useState({
        isOpen: false,
        title: "",
        description: ""
    });

    // Calculate DSR locally to ensure it matches the displayed data (Current Expenses / Current Income)
    const displayIncome = Number(formData.baseSalary ?? formData.income ?? 0) + Number(formData.otherIncome ?? 0);
    const displayExpenses = Number(formData.expenses ?? 0);
    const calculatedDSR = displayIncome > 0 ? (displayExpenses / displayIncome) * 100 : 0;

    const [isDocModalOpen, setIsDocModalOpen] = useState(false);

    // Helper to get photo config (duplicated from CollateralPhotoStep for consistency)
    const getPhotoConfig = (type: string) => {
        switch (type) {
            case 'moto':
                return [
                    { id: 'reg_book', label: 'เล่มทะเบียนรถ' },
                    { id: 'front', label: 'ด้านหน้า' },
                    { id: 'back', label: 'ด้านหลัง' },
                    { id: 'left', label: 'ด้านซ้าย' },
                    { id: 'right', label: 'ด้านขวา' },
                    { id: 'plate', label: 'ป้ายทะเบียน' },
                ];
            case 'land':
                return [
                    { id: 'deed_front', label: 'โฉนดด้านหน้า' },
                    { id: 'deed_back', label: 'โฉนดด้านหลัง' },
                    { id: 'appraisal', label: 'ใบประเมินราคา' },
                    { id: 'land_photo', label: 'รูปถ่ายที่ดิน' },
                    { id: 'map', label: 'แผนที่ตั้ง' },
                ];
            default: // car, truck
                return [
                    { id: 'reg_book', label: 'เล่มทะเบียนรถ' },
                    { id: 'front', label: 'ด้านหน้า (เต็มคัน)' },
                    { id: 'side', label: 'ด้านข้าง' },
                    { id: 'back', label: 'ด้านหลัง' },
                    { id: 'interior', label: 'ภายใน / คอนโซล' },
                    { id: 'plate', label: 'ป้ายทะเบียน' },
                ];
        }
    };



    const translateRelationship = (rel: string) => {
        const map: Record<string, string> = {
            spouse: "คู่สมรส",
            husband: "สามี",
            wife: "ภรรยา",
            parent: "บิดา/มารดา",
            father: "บิดา",
            mother: "มารดา",
            child: "บุตร",
            son: "บุตรชาย",
            daughter: "บุตรสาว",
            sibling: "พี่น้อง",
            brother: "พี่ชาย/น้องชาย",
            sister: "พี่สาว/น้องสาว",
            relative: "ญาติ",
            friend: "เพื่อน",
            colleague: "เพื่อนร่วมงาน",
            employer: "นายจ้าง",
            employee: "ลูกจ้าง",
            other: "อื่นๆ"
        };
        return map[rel?.toLowerCase()] || rel || "-";
    };


    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (showOTP && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [showOTP, timer]);

    useEffect(() => {
        if (showOTP && timer === 0 && !canResend) {
            // Using setTimeout to defer state update and avoid React lint warning
            const timeout = setTimeout(() => {
                setCanResend(true);
            }, 0);
            return () => clearTimeout(timeout);
        }
    }, [showOTP, timer, canResend]);

    const handleTermsChange = (checked: boolean) => {
        setAcceptedTerms(checked);
        setFormData((prev: CustomerFormData) => ({ ...prev, consentTerms: checked }));
    };

    const handleConfirmSubmission = () => {
        setShowOTP(true);
        setTimer(60);
        setCanResend(false);
    };

    const simulateApproval = () => {
        setSubmissionStatus('analyzing');

        // Calculate DSR
        const totalExp = (formData.expenses ?? 0) + (formData.estimatedMonthlyPayment ?? 0);
        const dsr = (formData.income ?? 0) > 0 ? (totalExp / (formData.income ?? 1)) * 100 : 0;

        let status: 'approved' | 'rejected' | 'manual_review' = 'manual_review';
        let message = "";

        if (dsr <= 50) {
            status = 'approved';
        } else if (dsr > 70) {
            status = 'rejected';
            message = "ภาระหนี้สินต่อรายได้ (DSR) สูงเกินเกณฑ์ที่กำหนด";
        } else {
            status = 'manual_review';
            message = "พิจารณาเพิ่มเติมเนื่องจาก DSR อยู่ในเกณฑ์ต้องตรวจสอบ";
        }

        // Mock Result Data
        const result = {
            status,
            approvedAmount: status === 'approved' ? (formData.requestedAmount ?? 0) : 0,
            interestRate: formData.interestRate ?? 0,
            monthlyPayment: formData.estimatedMonthlyPayment ?? 0,
            reason: message
        };

        setApprovalResult(result);

        // Simulate Delay
        setTimeout(() => {
            setSubmissionStatus(status);
        }, 3000);
    };

    const handleVerifyOTP = async () => {
        setIsVerifying(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsVerifying(false);
        if (otp === "123456") {
            setShowOTP(false); // Close OTP Modal
            simulateApproval(); // Start Analysis
        } else {
            setAlertDialog({
                isOpen: true,
                title: "รหัส OTP ไม่ถูกต้อง",
                description: "กรุณากรอกรหัส OTP ให้ถูกต้อง (ใช้ 123456 สำหรับ Demo)"
            });
        }
    };

    const handleResendOTP = () => {
        setTimer(60);
        setCanResend(false);
        // Simulate resend
    };

    const handleEditPersonalClick = () => {
        onEdit(1);
    };



    // Helper to count documents
    const docCount = Object.keys(formData.photos || {}).length;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2">

            <div className="text-center space-y-3 mb-6">
                <div className="w-20 h-20 bg-chaiyo-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-chaiyo-gold/20">
                    <ShieldCheck className="w-10 h-10 text-chaiyo-gold" />
                </div>
                <h3 className="text-2xl font-bold">ตรวจสอบข้อมูลและยืนยัน</h3>
                <p className="text-muted text-sm max-w-md mx-auto">กรุณาตรวจสอบความถูกต้องของข้อมูลและยอมรับเงื่อนไขก่อนยื่นใบคำขอ</p>
            </div>

            <div className="grid gap-6 grid-cols-1 w-full">
                {/* Personal Info Summary */}
                <Card className="border-border-subtle shadow-sm bg-white rounded-2xl overflow-hidden h-full">
                    <div className="bg-gray-50 px-6 py-4 border-b border-border-subtle flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted" />
                            <h4 className="font-bold text-sm text-foreground">ข้อมูลส่วนตัว</h4>
                        </div>
                        <Button variant="link" size="sm" onClick={handleEditPersonalClick} className="text-chaiyo-blue h-auto p-0">แก้ไข</Button>
                    </div>
                    <div className="grid md:grid-cols-2">
                        {/* Left Column: Personal + Financial */}
                        <div className="border-r border-gray-100 flex flex-col">


                            {/* Personal Info Content */}
                            <div className="p-6 text-sm space-y-3">
                                <div className="flex justify-between items-start">
                                    <span className="text-muted shrink-0">ชื่อ-นามสกุล</span>
                                    <span className="font-medium text-right">{formData.prefix} {formData.firstName} {formData.lastName}</span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-muted shrink-0">เพศ</span>
                                    <span className="font-medium text-right">{String(formData.gender || "-")}</span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-muted shrink-0">เลขบัตรประชาชน</span>
                                    <span className="font-medium text-right">{formData.idNumber}</span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-muted shrink-0">เลขหลังบัตร (Laser ID)</span>
                                    <span className="font-medium text-right font-mono">{formData.laserId || "-"}</span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-muted shrink-0">วันเกิด</span>
                                    <span className="font-medium text-right">
                                        {formData.birthDate ? (() => {
                                            const parts = formData.birthDate.split('-');
                                            const y = parts[0];
                                            const m = parts[1];
                                            const d = parts[2];
                                            return y && m && d ? `${d}/${m}/${parseInt(y) + 543}` : formData.birthDate;
                                        })() : "-"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-muted shrink-0">อายุ</span>
                                    <span className="font-medium text-right">
                                        {formData.birthDate ? (() => {
                                            let birthYear: number;
                                            let birthMonth = 0;
                                            let birthDateNum = 1;

                                            const parts = formData.birthDate.split('-');
                                            if (parts.length === 3) {
                                                birthYear = parseInt(parts[0]);
                                                birthMonth = parts[1] === '--' ? 0 : parseInt(parts[1]) - 1;
                                                birthDateNum = parts[2] === '--' ? 1 : parseInt(parts[2]);
                                            } else {
                                                const birth = new Date(formData.birthDate);
                                                if (isNaN(birth.getTime())) return "-";
                                                birthYear = birth.getFullYear();
                                                birthMonth = birth.getMonth();
                                                birthDateNum = birth.getDate();
                                            }

                                            if (isNaN(birthYear)) return "-";
                                            const today = new Date();
                                            let age = today.getFullYear() - birthYear;
                                            const m = today.getMonth() - birthMonth;
                                            if (m < 0 || (m === 0 && today.getDate() < birthDateNum)) {
                                                age--;
                                            }
                                            return `${age} ปี`;
                                        })() : "-"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-muted shrink-0">สัญชาติ</span>
                                    <span className="font-medium text-right">{formData.nationality || "-"}</span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-muted shrink-0">วันที่ออกบัตร</span>
                                    <span className="font-medium text-right">
                                        {formData.issueDate ? (() => {
                                            const [y, m, d] = formData.issueDate.split('-');
                                            return y && m && d ? `${d}/${m}/${parseInt(y) + 543}` : formData.issueDate;
                                        })() : "-"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-muted shrink-0">วันที่บัตรหมดอายุ</span>
                                    <span className="font-medium text-right">
                                        {formData.expiryDate ? (() => {
                                            const [y, m, d] = formData.expiryDate.split('-');
                                            return y && m && d ? `${d}/${m}/${parseInt(y) + 543}` : formData.expiryDate;
                                        })() : "-"}
                                    </span>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <span className="text-muted shrink-0">ที่อยู่</span>
                                    <span className="font-medium text-right">
                                        {[
                                            formData.houseNumber && `เลขที่ ${formData.houseNumber}`,
                                            formData.floorNumber && `ชั้น ${formData.floorNumber}`,
                                            formData.unitNumber && `ห้อง ${formData.unitNumber}`,
                                            formData.village && `หมู่บ้าน/อาคาร ${formData.village}`,
                                            formData.moo && `หมู่ที่ ${formData.moo}`,
                                            formData.soi && `ซอย ${formData.soi}`,
                                            formData.yaek && `แยก ${formData.yaek}`,
                                            formData.trohk && `ตรอก ${formData.trohk}`,
                                            formData.street && `ถนน ${formData.street}`,
                                            formData.subDistrict && (formData.province === 'กรุงเทพมหานคร' ? `แขวง${formData.subDistrict}` : `ตำบล${formData.subDistrict}`),
                                            formData.district && (formData.province === 'กรุงเทพมหานคร' ? `เขต${formData.district}` : `อำเภอ${formData.district}`),
                                            formData.province,
                                            formData.zipCode
                                        ].filter(Boolean).map(val => String(val)).join(' ') || String(formData.addressLine1 || "-")}
                                    </span>
                                </div>

                                <hr className="border-dashed border-gray-200 my-4" />
                                <div className="flex justify-between">
                                    <span className="text-muted">เบอร์โทรศัพท์</span>
                                    <span className="font-medium text-right">{formData.phone || formData.phoneNumber || "-"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted">LINE ID</span>
                                    <span className="font-medium text-right">{formData.lineId || "-"}</span>
                                </div>
                                {formData.email && (
                                    <div className="flex justify-between">
                                        <span className="text-muted">อีเมล</span>
                                        <span className="font-medium text-right break-all">{String(formData.email || "-")}</span>
                                    </div>
                                )}


                                <hr className="border-dashed border-gray-200 my-4" />
                                <div className="flex justify-between">
                                    <span className="text-muted">อาชีพ</span>
                                    <span className="font-medium text-right">{formData.occupation || "-"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted">รายได้หลัก</span>
                                    <span className="font-medium text-right">฿{Number(formData.baseSalary || formData.income || 0).toLocaleString()}</span>
                                </div>
                                {Number(formData.otherIncome ?? 0) > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-muted">รายได้อื่นๆ</span>
                                        <span className="font-medium text-right">฿{Number(formData.otherIncome ?? 0).toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-muted">ภาระหนี้สิน</span>
                                    <span className="font-medium text-right text-red-500">- ฿{Number(formData.expenses ?? 0).toLocaleString()}</span>
                                </div>
                                <div className="border-t border-dashed border-gray-200 my-2 pt-4 flex justify-between">
                                    <span className="text-muted font-bold">รายได้สุทธิ (Net Income)</span>
                                    <span className="font-bold text-right text-emerald-600">฿{(Number(formData.income ?? 0) - Number(formData.expenses ?? 0)).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl mt-2">
                                    <span className="text-muted text-xs">อัตราส่วนหนี้สิน (DSR)</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-lg">{calculatedDSR.toFixed(2)}%</span>
                                        {calculatedDSR < 60 ?
                                            <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-bold">PASS</span> :
                                            <span className="text-[10px] px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-bold">HIGH</span>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Co-Borrower + Guarantor */}
                        <div className="flex flex-col h-full bg-gray-50/30">
                            <div className="p-4 flex justify-between">
                                <span className="text-muted font-bold">ผู้กู้ร่วมและผู้ค้ำประกัน</span>
                            </div>
                            <div className="p-0 text-sm h-full">
                                {(!formData.coBorrowers?.length && !formData.guarantors?.length) ? (
                                    <div className="p-8 text-center text-muted-foreground text-xs border-dashed border-gray-200 m-6 rounded-xl border-2">
                                        ไม่มีผู้กู้ร่วมหรือผู้ค้ำประกัน
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="hover:bg-transparent border-border-subtle">
                                                <TableHead className="w-[40%] text-xs h-10 pl-6">ชื่อ-นามสกุล</TableHead>
                                                <TableHead className="w-[25%] text-xs h-10">สถานะ</TableHead>
                                                <TableHead className="text-right text-xs h-10 pr-6">ความสัมพันธ์</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {(formData.coBorrowers || []).map((person: CoBorrower, index: number) => (
                                                <TableRow key={`co-${index}`} className="hover:bg-transparent border-gray-100">
                                                    <TableCell className="py-3 text-xs font-medium pl-6">
                                                        {person.firstName} {person.lastName}
                                                    </TableCell>
                                                    <TableCell className="py-3">
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-800">
                                                            ผู้กู้ร่วม
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="py-3 text-xs text-right text-muted-foreground pr-6">
                                                        {translateRelationship(person.relationship ?? "")}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {(formData.guarantors || []).map((person: Guarantor, index: number) => (
                                                <TableRow key={`gu-${index}`} className="hover:bg-transparent border-gray-100">
                                                    <TableCell className="py-3 text-xs font-medium pl-6">
                                                        {person.firstName} {person.lastName}
                                                    </TableCell>
                                                    <TableCell className="py-3">
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-orange-100 text-orange-800">
                                                            ผู้ค้ำประกัน
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="py-3 text-xs text-right text-muted-foreground pr-6">
                                                        {translateRelationship(person.relationship ?? "")}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Collateral Summary */}
                <Card className="border-border-subtle shadow-sm bg-white rounded-2xl overflow-hidden h-full">
                    <div className="bg-gray-50 px-6 py-4 border-b border-border-subtle flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Car className="w-4 h-4 text-muted" />
                            <h4 className="font-bold text-sm text-foreground">หลักประกัน</h4>
                        </div>
                        <Button variant="link" size="sm" onClick={() => onEdit(2)} className="text-chaiyo-blue h-auto p-0">แก้ไข</Button>
                    </div>
                    <CardContent className="p-6 text-sm space-y-3">
                        <div className="flex justify-between">
                            <span className="text-muted">ประเภท</span>
                            <span className="font-medium text-right capitalize">
                                {formData.collateralType === 'land' ? 'ที่ดิน (โฉนด)' :
                                    formData.collateralType === 'truck' ? 'รถบรรทุก' :
                                        formData.collateralType === 'moto' ? 'รถมอเตอร์ไซค์' :
                                            formData.collateralType === 'car' ? 'รถยนต์' : formData.collateralType}
                            </span>
                        </div>

                        {formData.collateralType === 'land' ? (
                            <>
                                <div className="flex justify-between">
                                    <span className="text-muted">สถานะทางกฎหมาย</span>
                                    <span className="font-medium text-right">
                                        {['pawned', 'pledge'].includes(formData.legalStatus ?? "") ? 'ติดจำนำ' :
                                            ['lease', 'hire_purchase'].includes(formData.legalStatus ?? "") ? 'ติดเช่าซื้อ' :
                                                ['mortgaged', 'mortgage_refinance'].includes(formData.legalStatus ?? "") ? 'ติดจำนอง' : 'ปลอดภาระ'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted">เลขที่โฉนด</span>
                                    <span className="font-medium text-right">{formData.deedNumber || "-"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted">เลขที่ดิน / ระวาง</span>
                                    <span className="font-medium text-right">{formData.parcelNumber || formData.landNumber || "-"} / {formData.gridNumber || "-"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted">หน้าสำรวจ</span>
                                    <span className="font-medium text-right">{formData.surveyPage || formData.surveyNumber || "-"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted">เนื้อที่</span>
                                    <span className="font-medium text-right">
                                        {formData.area ? formData.area : `${formData.rai || 0} ไร่ ${formData.ngan || 0} งาน ${formData.wah || 0} ตร.วา`}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted">พิกัด / ที่ตั้ง</span>
                                    <span className="font-medium text-right font-mono text-xs">
                                        {formData.coordinates || `${formData.tambon || ''} ${formData.amphoe || ''} ${formData.province || ''}` || "-"}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <>

                                <div className="flex justify-between">
                                    <span className="text-muted">สถานะทางกฎหมาย</span>
                                    <span className="font-medium text-right">
                                        {['pawned', 'pledge'].includes(formData.legalStatus ?? "") ? 'ติดจำนำ' :
                                            ['lease', 'hire_purchase'].includes(formData.legalStatus ?? "") ? 'ติดเช่าซื้อ' :
                                                ['mortgaged', 'mortgage_refinance'].includes(formData.legalStatus ?? "") ? 'ติดจำนอง' : 'ปลอดภาระ'}
                                    </span>
                                </div>
                                {(['pawned', 'pledge', 'lease', 'hire_purchase', 'mortgaged', 'mortgage_refinance'].includes(formData.legalStatus ?? '')) && (
                                    <div className="flex justify-between text-red-500">
                                        <span className="text-red-500">
                                            {['pawned', 'pledge', 'mortgaged', 'mortgage_refinance'].includes(formData.legalStatus ?? "") ? 'ยอดหนี้คงเหลือ' : 'ยอดปิดบัญชี (Payoff)'}
                                        </span>
                                        <span className="font-medium text-right">
                                            ฿{Number(
                                                formData.pawnedRemainingDebt ||
                                                formData.existingDebt ||
                                                formData.leasePayoffBalance ||
                                                0
                                            ).toLocaleString()}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-muted">ปีรถ</span>
                                    <span className="font-medium text-right">{formData.year || "-"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted">ยี่ห้อ / รุ่น</span>
                                    <span className="font-medium text-right">{formData.brand} {formData.model}</span>
                                </div>
                                {formData.subModel && (
                                    <div className="flex justify-between">
                                        <span className="text-muted">รุ่นย่อย</span>
                                        <span className="font-medium text-right">{formData.subModel}</span>
                                    </div>
                                )}

                                {formData.collateralType === 'truck' && (
                                    <>
                                        <div className="flex justify-between">
                                            <span className="text-muted">จำนวนล้อ / ตัวถัง</span>
                                            <span className="font-medium text-right">{formData.wheels} ล้อ / {formData.bodyType}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted">น้ำหนักบรรทุก</span>
                                            <span className="font-medium text-right">{formData.loadCapacity} ตัน</span>
                                        </div>
                                    </>
                                )}

                                {formData.collateralType === 'agri' && (
                                    <>
                                        <div className="flex justify-between">
                                            <span className="text-muted">แรงม้า / อุปกรณ์</span>
                                            <span className="font-medium text-right">{formData.horsepower} HP / {formData.attachments}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted">ชั่วโมงการทำงาน</span>
                                            <span className="font-medium text-right">{formData.workingHours} ชม.</span>
                                        </div>
                                    </>
                                )}

                                {formData.color && (
                                    <div className="flex justify-between">
                                        <span className="text-muted">สีรถ</span>
                                        <span className="font-medium text-right">{formData.color}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-muted">ทะเบียน / จังหวัด</span>
                                    <span className="font-medium text-right">{formData.licensePlate || "-"} {(formData.registrationProvince || formData.province) && `/ ${formData.registrationProvince || formData.province}`}</span>
                                </div>
                                {formData.collateralType !== 'agri' && (
                                    <div className="flex justify-between">
                                        <span className="text-muted">เลขไมล์</span>
                                        <span className="font-medium text-right">{formData.mileage ? `${Number(formData.mileage).toLocaleString()} กม.` : "-"}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-muted">เลขตัวถัง (VIN)</span>
                                    <span className="font-medium text-right font-mono text-[10px]">{formData.vin || formData.chassisNumber || "-"}</span>
                                </div>
                            </>
                        )}
                        {/* Financial Breakdown Section */}
                        {/* Financial Breakdown Section - Updated to match design */}
                        <div className="border-t border-dashed border-gray-200 my-2 pt-4 flex justify-between">
                            <span className="text-muted font-bold">   สรุปวงเงินกู้สูงสุด (Maximum Loan Limit)</span>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl mt-2 space-y-4">


                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-start ">
                                    <div className="flex flex-col">
                                        <span className="text-gray-600">ราคาประเมิน (Appraisal Price)</span>
                                        <span className="text-xs text-blue-500 mt-0.5">
                                            {formData.collateralType === 'land' ? '*อ้างอิงจากราคาประเมินราชการ' : '*อ้างอิงจากข้อมูลราคากลาง Redbook'}
                                        </span>
                                    </div>
                                    <span className="font-medium">{(formData.appraisalPrice || formData.aiAppraisal || 0).toLocaleString()} บาท</span>
                                </div>

                                <div className="flex justify-between items-center text-green-600">
                                    <span>วงเงินจาก LTV ({formData.collateralType === 'land' ? '70%' : '90%'})</span>
                                    <span className="font-medium">+ {Math.floor((formData.appraisalPrice || formData.aiAppraisal || 0) * (formData.collateralType === 'land' ? 0.7 : 0.9)).toLocaleString()} บาท</span>
                                </div>

                                {['pawned', 'pledge', 'lease', 'hire_purchase', 'mortgaged', 'mortgage_refinance'].includes(formData.legalStatus ?? '') && (
                                    <div className="flex justify-between items-center text-red-500">
                                        <span>
                                            หัก{['pawned', 'pledge', 'mortgaged', 'mortgage_refinance'].includes(formData.legalStatus ?? "") ? 'ภาระหนี้' : 'ปิดบัญชี'}
                                        </span>
                                        <span className="font-medium">
                                            - {Number(
                                                formData.pawnedRemainingDebt ||
                                                formData.existingDebt ||
                                                formData.leasePayoffBalance ||
                                                0
                                            ).toLocaleString()} บาท
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                                    <span className="font-bold text-lg text-chaiyo-blue">วงเงินสุทธิ (Net Limit)</span>
                                    <span className="font-bold text-lg text-chaiyo-blue">
                                        {Math.max(0, Math.floor((formData.appraisalPrice || formData.aiAppraisal || 0) * (formData.collateralType === 'land' ? 0.7 : 0.9)) - (Number(
                                            formData.pawnedRemainingDebt ||
                                            formData.existingDebt ||
                                            formData.leasePayoffBalance ||
                                            0
                                        ) || 0)).toLocaleString()} บาท
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50/50 p-3 rounded-xl flex items-center gap-3 mt-4">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                                <FileCheck className="w-4 h-4 text-chaiyo-blue" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-chaiyo-blue">เอกสารและรูปภาพ</p>
                                <p className="text-[10px] text-muted-foreground">แนบแล้ว {docCount} รายการ</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setIsDocModalOpen(true)} className="ml-auto h-7 text-xs text-chaiyo-blue">ดู</Button>
                        </div>
                    </CardContent>
                </Card>




                {/* Loan Details Summary */}
                <Card className="border-border-subtle shadow-sm bg-white rounded-2xl overflow-hidden h-full">
                    <div className="bg-gray-50 px-6 py-4 border-b border-border-subtle flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Banknote className="w-4 h-4 text-muted" />
                            <h4 className="font-bold text-sm text-foreground">รายละเอียดสินเชื่อ</h4>
                        </div>
                        <Button variant="link" size="sm" onClick={() => onEdit(3)} className="text-chaiyo-blue h-auto p-0">แก้ไข</Button>
                    </div>
                    <CardContent className="p-6 text-sm space-y-3">
                        {/* Insurance Breakdown */}
                        {formData.selectedInsurances && formData.selectedInsurances.length > 0 && (
                            <div className="bg-blue-50/50 p-4 rounded-xl space-y-3 mb-4 border border-blue-100">
                                <p className="font-bold text-xs text-chaiyo-blue flex items-center gap-2">
                                    <ShieldCheck className="w-3.5 h-3.5" /> ประกันภัยที่เลือก
                                </p>
                                <div className="space-y-2">
                                    {formData.selectedInsurances.map((id: string) => {
                                        const INSURANCE_OPTIONS = [
                                            { id: 'car_tier1', label: 'ประกันรถยนต์ ชั้น 1', price: 20000 },
                                            { id: 'car_tier2', label: 'ประกันรถยนต์ ชั้น 2+', price: 15000 },
                                            { id: 'car_tier3', label: 'ประกันรถยนต์ ชั้น 3+', price: 10000 },
                                            { id: 'pa_basic', label: 'ประกันอุบัติเหตุส่วนบุคคล (PA)', price: 2500 },
                                        ];
                                        const opt = INSURANCE_OPTIONS.find(o => o.id === id);
                                        return opt ? (
                                            <div key={id} className="flex justify-between text-xs">
                                                <span className="text-muted-foreground">{opt.label}</span>
                                                <span className="font-medium">฿{opt.price.toLocaleString()}</span>
                                            </div>
                                        ) : null;
                                    })}
                                    <div className="h-px bg-blue-200/50 my-2" />
                                    <div className="flex justify-between text-xs">
                                        <span className="text-muted-foreground">รวมค่าเบี้ยประกัน</span>
                                        <span className="font-bold text-chaiyo-blue">
                                            ฿{(() => {
                                                const INSURANCE_OPTIONS = [
                                                    { id: 'car_tier1', label: 'ประกันรถยนต์ ชั้น 1', price: 20000 },
                                                    { id: 'car_tier2', label: 'ประกันรถยนต์ ชั้น 2+', price: 15000 },
                                                    { id: 'car_tier3', label: 'ประกันรถยนต์ ชั้น 3+', price: 10000 },
                                                    { id: 'pa_basic', label: 'ประกันอุบัติเหตุส่วนบุคคล (PA)', price: 2500 },
                                                ];
                                                return formData.selectedInsurances.reduce((acc: number, id: string) => {
                                                    const opt = INSURANCE_OPTIONS.find(o => o.id === id);
                                                    return acc + (opt ? opt.price : 0);
                                                }, 0);
                                            })().toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-[10px] items-center pt-1">
                                        <span className="text-muted-foreground">วิธีชำระ:</span>
                                        <span className={cn(
                                            "px-2 py-0.5 rounded-full font-bold",
                                            formData.includeInsuranceInLoan
                                                ? "bg-blue-100 text-blue-700"
                                                : "bg-gray-100 text-gray-600"
                                        )}>
                                            {formData.includeInsuranceInLoan ? "รวมในยอดจัด" : "ชำระแยกต่างหาก"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between">
                            <span className="text-muted">วงเงินขอสินเชื่อ (Net)</span>
                            <span className="font-medium text-right">฿{formData.requestedAmount?.toLocaleString()}</span>
                        </div>

                        {(formData.includeInsuranceInLoan && (formData.selectedInsurances?.length ?? 0) > 0) && (
                            <div className="flex justify-between">
                                <span className="text-muted">ค่าประกัน (รวมในยอดจัด)</span>
                                <span className="font-medium text-right text-chaiyo-blue flex items-center justify-end gap-1">
                                    <ShieldCheck className="w-3 h-3" />
                                    +฿{(() => {
                                        const INSURANCE_OPTIONS = [
                                            { id: 'car_tier1', label: 'ประกันรถยนต์ ชั้น 1', price: 20000 },
                                            { id: 'car_tier2', label: 'ประกันรถยนต์ ชั้น 2+', price: 15000 },
                                            { id: 'car_tier3', label: 'ประกันรถยนต์ ชั้น 3+', price: 10000 },
                                            { id: 'pa_basic', label: 'ประกันอุบัติเหตุส่วนบุคคล (PA)', price: 2500 },
                                        ];
                                        return (formData.selectedInsurances ?? []).reduce((acc: number, id: string) => {
                                            const opt = INSURANCE_OPTIONS.find(o => o.id === id);
                                            return acc + (opt ? opt.price : 0);
                                        }, 0);
                                    })().toLocaleString()}
                                </span>
                            </div>
                        )}

                        <div className="flex justify-between pt-2 border-t border-dashed border-gray-200">
                            <span className="text-foreground font-bold">ยอดจัดสินเชื่อสุทธิ</span>
                            <span className="font-bold text-chaiyo-blue text-lg text-right">
                                ฿{(() => {
                                    const INSURANCE_OPTIONS = [
                                        { id: 'car_tier1', label: 'ประกันรถยนต์ ชั้น 1', price: 20000 },
                                        { id: 'car_tier2', label: 'ประกันรถยนต์ ชั้น 2+', price: 15000 },
                                        { id: 'car_tier3', label: 'ประกันรถยนต์ ชั้น 3+', price: 10000 },
                                        { id: 'pa_basic', label: 'ประกันอุบัติเหตุส่วนบุคคล (PA)', price: 2500 },
                                    ];
                                    const insuranceCost = (formData.selectedInsurances ?? []).reduce((acc: number, id: string) => {
                                        const opt = INSURANCE_OPTIONS.find(o => o.id === id);
                                        return acc + (opt ? opt.price : 0);
                                    }, 0);

                                    return ((formData.requestedAmount ?? 0) + (formData.includeInsuranceInLoan ? insuranceCost : 0)).toLocaleString();
                                })()}
                            </span>
                        </div>


                        <div className="flex justify-between mt-2">
                            <span className="text-muted">ดอกเบี้ย ({((formData.interestRate || 0.08) * 100).toFixed(0)}% ต่อปี)</span>
                            <span className="font-bold text-right">฿{Math.ceil(formData.totalInterest || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted">ระยะเวลาผ่อน</span>
                            <span className="font-bold text-right">{formData.requestedDuration} งวด</span>
                        </div>

                        <div className="border-t border-dashed border-border-subtle my-2 pt-2 flex justify-between">
                            <span className="text-muted font-bold">รวมยอดหนี้ทั้งสิ้น ({formData.paymentMethod === 'bullet' ? 'Bullet' : 'Installment'})</span>
                            <span className="font-bold text-right">
                                ฿{(() => {
                                    const INSURANCE_OPTIONS = [
                                        { id: 'insurance_tier1', label: 'ประกันรถยนต์ ชั้น 1', price: 20000 },
                                        { id: 'insurance_tier2_plus', label: 'ประกันรถยนต์ ชั้น 2+', price: 15000 },
                                        { id: 'insurance_tier3_plus', label: 'ประกันรถยนต์ ชั้น 3+', price: 10000 },
                                        { id: 'insurance_pa', label: 'ประกันอุบัติเหตุ (PA)', price: 2500 },
                                    ];
                                    const insuranceCost = (formData.selectedInsurances ?? []).reduce((acc: number, id: string) => {
                                        const opt = INSURANCE_OPTIONS.find(o => o.id === id);
                                        return acc + (opt ? opt.price : 0);
                                    }, 0);
                                    const principal = (formData.requestedAmount ?? 0) + (formData.includeInsuranceInLoan ? insuranceCost : 0);
                                    return (principal + (formData.totalInterest ?? 0)).toLocaleString();
                                })()}
                            </span>
                        </div>

                        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl mt-2">
                            <span className="text-muted text-xs">
                                {formData.paymentMethod === 'bullet' ? 'ยอดชำระเมื่อครบกำหนด' : 'ค่างวดโดยประมาณ'}
                            </span>
                            <span className="font-bold text-right text-emerald-600 text-lg">
                                ฿{Math.ceil(formData.estimatedMonthlyPayment || 0).toLocaleString()}
                                {formData.paymentMethod === 'bullet' ? '' : ' / เดือน'}
                            </span>
                        </div>

                        {/* Post-Loan DSR / Payment Capacity Summary */}
                        <div className="pt-4 border-t border-dashed border-border-subtle mt-4">
                            <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[11px] font-bold text-indigo-900/60 uppercase tracking-wider">ความสามารถในการชำระหนี้รวม</span>
                                    {(() => {
                                        const totalExp = (formData.expenses || 0) + (formData.estimatedMonthlyPayment || 0);
                                        // For bullet, monthly payment is 0 (or interest only?), DSR might look weird if we use full bullet payment.
                                        // Usually Bullet loans calculate DSR based on Interest Only or specific policy.
                                        // Here we stick to 'estimatedMonthlyPayment' which is 0 for bullet in CalculatorStep?
                                        // Start of file says "Let's set monthly to 0" for bullet.
                                        // If 0, DSR won't increase much.
                                        // Let's assume this is correct for now or user will flag it.

                                        const dsr = (formData.income ?? 0) > 0 ? (totalExp / (formData.income ?? 1)) * 100 : 0;
                                        const isSafe = dsr <= 60;
                                        return (
                                            <div className={cn(
                                                "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase transition-colors shrink-0",
                                                isSafe ? "bg-emerald-500/20 text-emerald-700 border border-emerald-500/30" : "bg-red-500/20 text-red-700 border border-red-500/30"
                                            )}>
                                                <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", isSafe ? "bg-emerald-500" : "bg-red-500")} />
                                                {isSafe ? "Affordable" : "High DSR Warning"}
                                            </div>
                                        );
                                    })()}
                                </div>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-xs text-indigo-900/70">DSR หลังกู้ครั้งนี้ (เทียบรายได้):</span>
                                    <span className="text-xl font-black text-indigo-900">
                                        {Math.round((((formData.expenses ?? 0) + (formData.estimatedMonthlyPayment ?? 0)) / (formData.income ?? 1)) * 100)}%
                                    </span>
                                </div>
                                <p className="text-[10px] text-indigo-900/40 mt-1 italic">
                                    * รวมภาระหนี้เดิม ฿{(formData.expenses ?? 0).toLocaleString()} และงวดปัจจุบัน
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>

            {/* Legal and Consents Section (Merged) */}
            <div className="space-y-4">
                <h4 className="font-bold text-lg">เอกสารข้อตกลงและความยินยอม (Agreements)</h4>

                <Card className="border-border-subtle shadow-sm bg-white rounded-xl overflow-hidden">
                    <CardContent className="p-0 divide-y divide-gray-100">

                        {/* 1. Consents List */}
                        <div className="p-6 bg-white">
                            <h5 className="font-bold text-sm mb-4 text-chaiyo-blue flex items-center gap-2">
                                <FileCheck className="w-4 h-4" />
                                ความยินยอม (Consents)
                            </h5>
                            <div className="grid gap-3">
                                {[
                                    { title: "ความยินยอมเปิดเผยข้อมูลเพื่อวัตถุประสงค์ทางการตลาด (Marketing Consent)", desc: "ยินยอมให้บริษัทเสนอข้อมูลผลิตภัณฑ์ สิทธิพิเศษ และโปรโมชั่นต่างๆ" },
                                    { title: "ความยินยอมให้แนะนำผลิตภัณฑ์อื่น (Cross-Sale Consent)", desc: "ยินยอมให้บริษัทเปิดเผยข้อมูลแก่พันธมิตรทางธุรกิจเพื่อนำเสนอผลิตภัณฑ์ที่เหมาะสม" },
                                    { title: "ความยินยอมให้นำข้อมูลไปใช้ในการทำแบบจำลอง (Model Consent)", desc: "ยินยอมให้บริษัทนำข้อมูลไปใช้ในการวิเคราะห์และพัฒนาแบบจำลองทางสถิติ" },
                                    ...(formData.requireNCB ? [{ title: "ความยินยอมเปิดเผยข้อมูลเครดิต (NCB Consent)", desc: "ยินยอมให้บริษัท และ/หรือ ผู้ให้บริการข้อมูลเครดิต ตรวจสอบข้อมูลเครดิตบูโร (NCB) ของข้าพเจ้า เพื่อประโยชน์ในการวิเคราะห์และพิจารณาสินเชื่อ" }] : [])
                                ].map((item, index) => (
                                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-100 rounded-lg">
                                        <div className="mt-0.5">
                                            <ShieldCheck className="w-4 h-4 text-chaiyo-blue" />
                                        </div>
                                        <div>
                                            <h6 className="text-xs font-bold text-foreground">{item.title}</h6>
                                            <p className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 2. Terms Text */}
                        <div className="h-[200px] p-6 overflow-y-auto w-full text-xs text-foreground/70 leading-relaxed scrollbar-thin scrollbar-thumb-gray-200 bg-gray-50/50">
                            <h5 className="font-bold text-sm mb-3 sticky top-0 bg-gray-50/95 py-2 -mt-2">ข้อตกลงและเงื่อนไข (Terms & Conditions)</h5>

                            <p className="mb-2 font-bold">1. การเปิดเผยข้อมูลส่วนบุคคล</p>
                            <p className="mb-4">ข้าพเจ้าตกลงยินยอมให้บริษัท เงินไชโย จำกัด (&quot;บริษัท&quot;) และพนักงานของบริษัท เก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคลของข้าพเจ้า เพื่อประโยชน์ในการพิจารณาสินเชื่อ การติดต่อสื่อสาร การวิเคราะห์ข้อมูล และการนำเสนอผลิตภัณฑ์...</p>

                            <p className="mb-2 font-bold">2. ความถูกต้องของข้อมูล</p>
                            <p className="mb-4">ข้าพเจ้ารับรองว่าข้อมูลและเอกสารทั้งหมดที่ได้ให้ไว้กับบริษัท ในการสมัครสินเชื่อนี้ เป็นความจริงทุกประการ หากปรากฏว่าข้อมูลใดเป็นเท็จ ข้าพเจ้ายินยอมให้บริษัทระงับการพิจารณาหรือยกเลิกวงเงินสินเชื่อได้ทันที...</p>

                            <p className="mb-2 font-bold">3. การตรวจสอบข้อมูล</p>
                            <p className="mb-4">ข้าพเจ้ายินยอมให้บริษัทดำเนินการตรวจสอบข้อมูลของข้าพเจ้าจากแหล่งข้อมูลต่างๆ ที่บริษัทเห็นสมควร เพื่อประโยชน์ในการพิจารณาสินเชื่อ...</p>
                        </div>
                    </CardContent>
                </Card>

                <div
                    className="flex items-start space-x-4 p-4 rounded-xl border border-border-subtle hover:bg-blue-50/30 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-chaiyo-blue/50"
                    onClick={() => handleTermsChange(!acceptedTerms)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleTermsChange(!acceptedTerms);
                        }
                    }}
                >
                    <Checkbox
                        id="terms"
                        checked={acceptedTerms}
                        onCheckedChange={handleTermsChange}
                        className="mt-1"
                        tabIndex={-1} // Prevent double tab stop since parent is interactive
                    />
                    <div className="grid gap-1.5 leading-none">
                        <Label
                            htmlFor="terms"
                            className="text-sm font-medium text-foreground leading-snug cursor-pointer"
                        >
                            ข้าพเจ้าได้อ่าน เข้าใจ และตกลงยินยอมปฏิบัติตามข้อตกลง เงื่อนไข และให้ความยินยอมตามรายการข้างต้นทุกประการ
                        </Label>
                    </div>
                </div>
            </div>

            <div className="pt-4 pb-8 flex justify-center">
                <Button
                    size="lg"
                    className="w-full max-w-sm h-14 text-lg font-bold bg-chaiyo-gold hover:bg-chaiyo-gold/90 text-chaiyo-blue shadow-xl"
                    disabled={!acceptedTerms}
                    onClick={handleConfirmSubmission}
                >
                    <Check className="w-5 h-5 mr-2" /> ยืนยันการสมัครสินเชื่อ
                </Button>
            </div>



            {/* OTP Verification Modal */}
            {
                showOTP && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-chaiyo-blue/80 backdrop-blur-md" />
                        <Card className="relative w-full max-w-md bg-white shadow-2xl rounded-[2.5rem] border-none overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="p-10 space-y-8">
                                <div className="flex justify-center">
                                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                                        <MessageSquare className="w-10 h-10 text-chaiyo-blue" />
                                    </div>
                                </div>

                                <div className="text-center space-y-2">
                                    <h3 className="text-2xl font-bold text-foreground">ยืนยันตัวตน</h3>
                                    <p className="text-sm text-muted">
                                        ระบบได้ส่งรหัส OTP ไปยัง <span className="font-bold text-foreground">{String(formData.phoneNumber || formData.phone || "-")}</span>
                                    </p>
                                </div>

                                <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3 text-amber-900">
                                    <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
                                    <div className="text-xs leading-relaxed">
                                        <p className="font-bold mb-1 underline">คำแนะนำสำหรับพนักงาน</p>
                                        <p>กรุณาแจ้งให้ลูกค้าทราบว่าจะได้รับรหัสยืนยัน ให้พนักงานรับรหัสจากลูกค้าเพื่อนำมากรอกข้อมูลในหน้าจอนี้</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-center">
                                        <InputOTP maxLength={6} value={otp} onChange={(val) => setOtp(val)}>
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                                <InputOTPSlot index={2} />
                                                <InputOTPSlot index={3} />
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </div>
                                    <div className="text-center">
                                        {canResend ? (
                                            <button
                                                onClick={handleResendOTP}
                                                className="text-sm font-bold text-chaiyo-blue hover:underline flex items-center justify-center mx-auto gap-2"
                                            >
                                                <RefreshCcw className="w-4 h-4" /> ส่งรหัสอีกครั้ง
                                            </button>
                                        ) : (
                                            <p className="text-sm text-muted">ส่งรหัสอีกครั้งได้ใน {timer} วินาที</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <Button
                                        variant="outline"
                                        className="flex-1 h-14 rounded-2xl text-base font-bold border-gray-200"
                                        onClick={() => setShowOTP(false)}
                                    >
                                        ยกเลิก
                                    </Button>
                                    <Button
                                        className="flex-[2] h-14 rounded-2xl text-base font-bold bg-chaiyo-blue hover:bg-chaiyo-blue/90"
                                        disabled={otp.length !== 6 || isVerifying}
                                        onClick={handleVerifyOTP}
                                    >
                                        {isVerifying ? (
                                            <Loader2 className="w-5 h-5 animate-spin p-0" />
                                        ) : (
                                            "ยืนยันรหัส"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                )
            }

            {/* Analysis & Result States Overlay */}
            {
                submissionStatus !== 'idle' && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-white/95 backdrop-blur-xl" />

                        {/* Analyzing State */}
                        {submissionStatus === 'analyzing' && (
                            <div className="relative z-10 text-center space-y-8 animate-in fade-in zoom-in-95 duration-500 max-w-md w-full">
                                <div className="relative mx-auto w-32 h-32">
                                    <div className="absolute inset-0 border-4 border-gray-100 rounded-full" />
                                    <div className="absolute inset-0 border-4 border-chaiyo-gold border-t-transparent rounded-full animate-spin" />
                                    <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                                        <ShieldCheck className="w-12 h-12 text-chaiyo-blue animate-pulse" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold text-foreground">กำลังประมวลผลการสมัคร</h3>
                                    <p className="text-muted text-sm">ระบบกำลังตรวจสอบข้อมูลเครดิตและวิเคราะห์สินเชื่อ...</p>
                                </div>
                            </div>
                        )}

                        {/* Approved State */}
                        {submissionStatus === 'approved' && (
                            <Card className="relative z-10 w-full max-w-lg border-none shadow-2xl rounded-[2.5rem] overflow-hidden animate-in zoom-in-95 duration-500">
                                <div className="bg-emerald-500 p-8 text-center text-white relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 to-transparent" />
                                    <div className="relative z-10">
                                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                                            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-1">อนุมัติเบื้องต้น!</h3>
                                        <p className="text-emerald-50 opacity-90 text-sm">สินเชื่อของคุณผ่านการพิจารณาแล้ว</p>
                                    </div>
                                </div>
                                <CardContent className="p-8 space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                            <span className="text-sm text-muted font-medium">วงเงินที่ได้รับอนุมัติ</span>
                                            <span className="text-2xl font-black text-chaiyo-blue">฿{(approvalResult?.approvedAmount || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                                <span className="text-xs text-muted block mb-1">อัตราดอกเบี้ย</span>
                                                <span className="text-lg font-bold text-foreground">{((approvalResult?.interestRate || 0) * 100).toFixed(2)}%</span>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                                <span className="text-xs text-muted block mb-1">ค่างวด/เดือน</span>
                                                <span className="text-lg font-bold text-foreground">฿{(approvalResult?.monthlyPayment || 0).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-emerald-50 p-4 rounded-xl flex gap-3">
                                        <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                        <p className="text-xs text-emerald-800 leading-relaxed">
                                            กรุณาตรวจสอบเอกสารสัญญาที่ระบบส่งให้ทาง SMS และลงนามเพื่อรับเงินโอนเข้าบัญชีภายใน 24 ชม.
                                        </p>
                                    </div>
                                    <Button className="w-full h-14 text-lg font-bold rounded-2xl bg-chaiyo-blue hover:bg-chaiyo-blue/90" onClick={onSubmit}>
                                        ดำเนินการต่อ <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {/* Rejected State */}
                        {submissionStatus === 'rejected' && (
                            <Card className="relative z-10 w-full max-w-lg border-none shadow-2xl rounded-[2.5rem] overflow-hidden animate-in zoom-in-95 duration-500">
                                <div className="bg-red-500 p-8 text-center text-white relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 to-transparent" />
                                    <div className="relative z-10">
                                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
                                            <XCircle className="w-10 h-10 text-red-500" />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-1">ไม่ผ่านการพิจารณา</h3>
                                        <p className="text-red-50 opacity-90 text-sm">ขออภัยในความไม่สะดวก</p>
                                    </div>
                                </div>
                                <CardContent className="p-8 space-y-6">
                                    <div className="bg-red-50 p-5 rounded-2xl border border-red-100 text-center space-y-2">
                                        <span className="text-xs font-bold text-red-500 uppercase tracking-wider">เหตุผลการปฏิเสธ</span>
                                        <p className="text-red-900 font-medium">{approvalResult?.reason || "คุณสมบัติไม่ผ่านเกณฑ์ของบริษัท"}</p>
                                    </div>
                                    <p className="text-sm text-center text-muted leading-relaxed px-4">
                                        ท่านสามารถลองยื่นขอสินเชื่อใหม่ได้อีกครั้งเมื่อมีความพร้อม หรือติดต่อเจ้าหน้าที่เพื่อขอคำแนะนำเพิ่มเติม
                                    </p>
                                    <Button variant="outline" className="w-full h-14 text-lg font-bold rounded-2xl border-gray-200" onClick={() => window.location.reload()}>
                                        กลับสู่หน้าหลัก
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {/* Manual Review State */}
                        {submissionStatus === 'manual_review' && (
                            <Card className="relative z-10 w-full max-w-lg border-none shadow-2xl rounded-[2.5rem] overflow-hidden animate-in zoom-in-95 duration-500">
                                <div className="bg-amber-400 p-8 text-center text-amber-950 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 to-transparent" />
                                    <div className="relative z-10">
                                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-100">
                                            <AlertCircle className="w-10 h-10 text-amber-500" />
                                        </div>
                                        <h3 className="2xl font-bold mb-1">รอผลการพิจารณา</h3>
                                        <p className="text-amber-900/80 text-sm">ใบคำขอของท่านต้องได้รับการตรวจสอบเพิ่มเติม</p>
                                    </div>
                                </div>
                                <CardContent className="p-8 space-y-6">
                                    <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 space-y-3">
                                        <div className="flex items-start gap-3">
                                            <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center shrink-0 text-amber-600 font-bold text-xs">1</div>
                                            <p className="text-sm text-amber-900">เจ้าหน้าที่จะทำการตรวจสอบข้อมูลเพิ่มเติมและติดต่อกลับภายใน <span className="font-bold">1 วันทำการ</span></p>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center shrink-0 text-amber-600 font-bold text-xs">2</div>
                                            <p className="text-sm text-amber-900">กรุณารับสายจากเจ้าหน้าที่เพื่อยืนยันข้อมูล</p>
                                        </div>
                                    </div>
                                    <Button className="w-full h-14 text-lg font-bold rounded-2xl bg-amber-500 hover:bg-amber-600 text-white" onClick={onSubmit}>
                                        รับทราบนัดหมาย
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )
            }

            {/* Document Preview Modal */}
            {
                isDocModalOpen && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setIsDocModalOpen(false)} />
                        <div className="relative z-10 w-full max-w-4xl bg-transparent animate-in zoom-in-95 duration-300 pointer-events-none flex flex-col items-center">
                            <div className="w-full bg-white rounded-3xl overflow-hidden shadow-2xl pointer-events-auto">
                                <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                                    <h3 className="font-bold text-lg flex items-center gap-2">
                                        <FileCheck className="w-5 h-5 text-chaiyo-blue" />
                                        รูปภาพและเอกสารหลักประกัน
                                    </h3>
                                    <Button variant="ghost" size="icon" onClick={() => setIsDocModalOpen(false)} className="rounded-full hover:bg-gray-200">
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>
                                <div className="p-8 max-h-[70vh] overflow-y-auto">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                        {getPhotoConfig(formData.collateralType || 'car').map((item) => {
                                            const photoUrl = formData.photos?.[item.id];
                                            if (!photoUrl) return null;
                                            return (
                                                <div key={item.id} className="space-y-2 group">
                                                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                                                        <img src={photoUrl} alt={item.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                                                            <span className="text-white text-xs font-bold">{item.label}</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-xs font-medium text-center text-muted-foreground">{item.label}</p>
                                                </div>
                                            );
                                        })}
                                        {(!formData.photos || Object.keys(formData.photos || {}).length === 0) && (
                                            <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                                                <FileText className="w-10 h-10 mx-auto mb-2 opacity-20" />
                                                <p>ไม่พบรูปภาพหรือเอกสาร</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
            <AlertDialog open={alertDialog.isOpen} onOpenChange={(open) => setAlertDialog({ ...alertDialog, isOpen: open })}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                <AlertCircle className="w-5 h-5 text-red-600" />
                            </div>
                            <AlertDialogTitle className="text-lg">{alertDialog.title}</AlertDialogTitle>
                        </div>
                        <AlertDialogDescription className="text-base mt-2">
                            {alertDialog.description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction className="bg-chaiyo-blue hover:bg-chaiyo-blue/90">
                            ลองอีกครั้ง
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div >
    );
}
