"use client";

import { useState, useEffect } from "react";
import { Check, ShieldCheck, User, Banknote, Car, FileText, X, Phone, Briefcase, MessageSquare, RefreshCcw, Loader2, MapPin, Calendar, Mail, FileCheck, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface ReviewStepProps {
    formData: any;
    setFormData: (data: any) => void;
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

    // Personal Info Edit State
    const [isEditingPersonal, setIsEditingPersonal] = useState(false);
    const [editPersonalData, setEditPersonalData] = useState<any>({});

    useEffect(() => {
        let interval: any;
        if (showOTP && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [showOTP, timer]);

    const handleTermsChange = (checked: boolean) => {
        setAcceptedTerms(checked);
        setFormData((prev: any) => ({ ...prev, consentTerms: checked }));
    };

    const handleConfirmSubmission = () => {
        setShowOTP(true);
        setTimer(60);
        setCanResend(false);
    };

    const handleVerifyOTP = async () => {
        setIsVerifying(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsVerifying(false);
        if (otp === "123456") {
            onSubmit();
        } else {
            alert("รหัส OTP ไม่ถูกต้อง (ใช้ 123456)");
        }
    };

    const handleResendOTP = () => {
        setTimer(60);
        setCanResend(false);
        // Simulate resend
    };

    const handleEditPersonalClick = () => {
        setEditPersonalData({ ...formData });
        setIsEditingPersonal(true);
    };

    const handleSavePersonalEdit = () => {
        setFormData({ ...formData, ...editPersonalData });
        setIsEditingPersonal(false);
    };

    const handleCancelPersonalEdit = () => {
        setIsEditingPersonal(false);
    };

    // Helper to count documents
    const docCount = Object.keys(formData.photos || {}).length;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2">

            <div className="text-center space-y-3 mb-6">
                <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-yellow-100">
                    <ShieldCheck className="w-10 h-10 text-chaiyo-gold" />
                </div>
                <h3 className="text-2xl font-bold">ตรวจสอบข้อมูลและยืนยัน</h3>
                <p className="text-muted text-sm max-w-md mx-auto">กรุณาตรวจสอบความถูกต้องของข้อมูลและยอมรับเงื่อนไขก่อนยื่นใบคำขอ</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Personal Info Summary */}
                <Card className="border-border-subtle shadow-sm bg-white rounded-2xl overflow-hidden h-full">
                    <div className="bg-gray-50 px-6 py-4 border-b border-border-subtle flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted" />
                            <h4 className="font-bold text-sm text-foreground">ข้อมูลส่วนตัว</h4>
                        </div>
                        <Button variant="link" size="sm" onClick={handleEditPersonalClick} className="text-chaiyo-blue h-auto p-0">แก้ไข</Button>
                    </div>
                    <CardContent className="p-6 text-sm space-y-3">
                        <div className="flex justify-between items-start">
                            <span className="text-muted shrink-0">ชื่อ-นามสกุล</span>
                            <span className="font-medium text-right">{formData.prefix} {formData.firstName} {formData.lastName}</span>
                        </div>
                        <div className="flex justify-between items-start">
                            <span className="text-muted shrink-0">เลขบัตรประชาชน</span>
                            <span className="font-medium text-right">{formData.idNumber}</span>
                        </div>
                        <div className="flex justify-between items-start">
                            <span className="text-muted shrink-0">วันเกิด</span>
                            <span className="font-medium text-right">{formData.birthDate || "-"}</span>
                        </div>
                        <div className="flex justify-between items-start">
                            <span className="text-muted shrink-0">เบอร์โทรศัพท์</span>
                            <span className="font-medium text-right">{formData.phone || formData.phoneNumber || "-"}</span>
                        </div>
                        {formData.email && (
                            <div className="flex justify-between items-start">
                                <span className="text-muted shrink-0">อีเมล</span>
                                <span className="font-medium text-right break-all">{formData.email}</span>
                            </div>
                        )}
                        <hr className="border-dashed border-gray-200 my-2" />
                        <div className="flex justify-between items-start">
                            <span className="text-muted shrink-0">อาชีพ</span>
                            <span className="font-medium text-right">{formData.occupation || "-"}</span>
                        </div>
                        <div className="flex justify-between items-start">
                            <span className="text-muted shrink-0">สถานที่ทำงาน</span>
                            <span className="font-medium text-right">{formData.workplace || "-"}</span>
                        </div>
                        <div className="flex justify-between items-start">
                            <span className="text-muted shrink-0">อายุงาน</span>
                            <span className="font-medium text-right">{formData.workYears ? `${formData.workYears} ปี` : "-"}</span>
                        </div>
                        <hr className="border-dashed border-gray-200 my-2" />
                        <div className="flex justify-between gap-4">
                            <span className="text-muted shrink-0">ที่อยู่</span>
                            <span className="font-medium text-right">
                                {formData.addressLine1} {formData.subDistrict} {formData.district} {formData.province} {formData.zipCode}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Collateral Summary */}
                <Card className="border-border-subtle shadow-sm bg-white rounded-2xl overflow-hidden h-full">
                    <div className="bg-gray-50 px-6 py-4 border-b border-border-subtle flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Car className="w-4 h-4 text-muted" />
                            <h4 className="font-bold text-sm text-foreground">หลักประกัน</h4>
                        </div>
                        <Button variant="link" size="sm" onClick={() => onEdit(3)} className="text-chaiyo-blue h-auto p-0">แก้ไข</Button>
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
                                        {formData.legalStatus === 'pawned' ? 'ติดจำนำ' :
                                            formData.legalStatus === 'lease' ? 'ติดเช่าซื้อ' : 'ปลอดภาระ'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted">เลขที่โฉนด</span>
                                    <span className="font-medium text-right">{formData.deedNumber || "-"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted">เลขที่ดิน / ระวาง</span>
                                    <span className="font-medium text-right">{formData.parcelNumber || "-"} / {formData.gridNumber || "-"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted">หน้าสำรวจ</span>
                                    <span className="font-medium text-right">{formData.surveyPage || "-"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted">เนื้อที่</span>
                                    <span className="font-medium text-right">{formData.rai || 0} ไร่ {formData.ngan || 0} งาน {formData.wah || 0} ตร.วา</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex justify-between">
                                    <span className="text-muted">สถานะทางกฎหมาย</span>
                                    <span className="font-medium text-right">
                                        {formData.legalStatus === 'pawned' ? 'ติดจำนำ' :
                                            formData.legalStatus === 'lease' ? 'ติดเช่าซื้อ' : 'ปลอดภาระ'}
                                    </span>
                                </div>
                                {(formData.legalStatus === 'pawned' || formData.legalStatus === 'lease') && (
                                    <div className="flex justify-between text-red-500">
                                        <span className="text-red-500">{formData.legalStatus === 'pawned' ? 'ยอดหนี้คงเหลือ' : 'ยอดปิดบัญชี (Payoff)'}</span>
                                        <span className="font-medium text-right">฿{Number(formData.legalStatus === 'pawned' ? formData.pawnedRemainingDebt : formData.leasePayoffBalance).toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-muted">ปีจดทะเบียน</span>
                                    <span className="font-medium text-right">{formData.year || "-"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted">ยี่ห้อ / รุ่น</span>
                                    <span className="font-medium text-right">{formData.brand} {formData.model}</span>
                                </div>
                                {formData.color && (
                                    <div className="flex justify-between">
                                        <span className="text-muted">สีรถ</span>
                                        <span className="font-medium text-right">{formData.color}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-muted">ทะเบียน / จังหวัด</span>
                                    <span className="font-medium text-right">{formData.licensePlate || "-"} {formData.registrationProvince && `/ ${formData.registrationProvince}`}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted">เลขไมล์</span>
                                    <span className="font-medium text-right">{formData.mileage ? `${Number(formData.mileage).toLocaleString()} กม.` : "-"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted">เลขตัวถัง (VIN)</span>
                                    <span className="font-medium text-right font-mono text-[10px]">{formData.vin || "-"}</span>
                                </div>
                            </>
                        )}
                        <hr className="border-dashed border-gray-200 my-2" />

                        {/* Financial Breakdown Section */}
                        <div className="space-y-2.5 bg-gray-50/50 p-4 rounded-xl border border-gray-100 mt-2">
                            <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">สรุปวงเงินประเมิน</p>

                            <div className="flex justify-between items-center">
                                <span className="text-muted text-xs">ราคาประเมิน:</span>
                                <span className="font-bold text-foreground">฿{(formData.appraisalPrice || 0).toLocaleString()}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-muted text-xs">วงเงินกู้ (90% LTV):</span>
                                <span className="font-bold text-emerald-600">฿{Math.floor((formData.appraisalPrice || 0) * 0.9).toLocaleString()}</span>
                            </div>

                            {(formData.legalStatus === 'pawned' || formData.legalStatus === 'lease') && (
                                <div className="flex justify-between items-center">
                                    <span className="text-red-500 text-xs">หัก{formData.legalStatus === 'pawned' ? 'ส่วนต่างจำนำ' : 'ปิดบัญชี'}:</span>
                                    <span className="font-bold text-red-500">- ฿{Number(formData.legalStatus === 'pawned' ? formData.pawnedRemainingDebt : formData.leasePayoffBalance).toLocaleString()}</span>
                                </div>
                            )}

                            <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                                <span className="text-muted text-[11px] font-bold">วงเงินกู้สุทธิสูงสุด:</span>
                                <span className="font-black text-chaiyo-blue text-base">
                                    ฿{Math.max(0, Math.floor((formData.appraisalPrice || 0) * 0.9) - (Number(formData.legalStatus === 'pawned' ? formData.pawnedRemainingDebt : formData.leasePayoffBalance) || 0)).toLocaleString()}
                                </span>
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
                            <Button variant="ghost" size="sm" onClick={() => onEdit(6)} className="ml-auto h-7 text-xs text-chaiyo-blue">ดู</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Financial Summary */}
                <Card className="border-border-subtle shadow-sm bg-white rounded-2xl overflow-hidden h-full">
                    <div className="bg-gray-50 px-6 py-4 border-b border-border-subtle flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Banknote className="w-4 h-4 text-muted" />
                            <h4 className="font-bold text-sm text-foreground">ข้อมูลทางการเงิน</h4>
                        </div>
                        <Button variant="link" size="sm" onClick={() => onEdit(4)} className="text-chaiyo-blue h-auto p-0">แก้ไข</Button>
                    </div>
                    <CardContent className="p-6 text-sm space-y-3">
                        <div className="flex justify-between">
                            <span className="text-muted">รายได้หลัก</span>
                            <span className="font-medium text-right">฿{(formData.baseSalary || 0).toLocaleString()}</span>
                        </div>
                        {formData.otherIncome > 0 && (
                            <div className="flex justify-between">
                                <span className="text-muted">รายได้อื่นๆ</span>
                                <span className="font-medium text-right">฿{formData.otherIncome.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="text-muted">ภาระหนี้สิน</span>
                            <span className="font-medium text-right text-red-500">- ฿{(formData.expenses || 0).toLocaleString()}</span>
                        </div>
                        <div className="border-t border-dashed border-border-subtle my-2 pt-2 flex justify-between">
                            <span className="text-muted font-bold">รายได้สุทธิ (Net Income)</span>
                            <span className="font-bold text-right text-emerald-600">฿{((formData.income || 0) - (formData.expenses || 0)).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl mt-2">
                            <span className="text-muted text-xs">อัตราส่วนหนี้สิน (DSR)</span>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-lg">{formData.dsr || 0}%</span>
                                {(formData.dsr || 0) < 60 ?
                                    <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-bold">PASS</span> :
                                    <span className="text-[10px] px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-bold">HIGH</span>
                                }
                            </div>
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
                        <Button variant="link" size="sm" onClick={() => onEdit(5)} className="text-chaiyo-blue h-auto p-0">แก้ไข</Button>
                    </div>
                    <CardContent className="p-6 text-sm space-y-3">
                        <div className="flex justify-between">
                            <span className="text-muted">วงเงินที่ขอสินเชื่อ</span>
                            <span className="font-bold text-chaiyo-blue text-lg text-right">฿{formData.requestedAmount?.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-muted">ดอกเบี้ย ({((formData.interestRate || 0.08) * 100).toFixed(0)}% ต่อปี)</span>
                            <span className="font-bold text-right">฿{Math.ceil(formData.totalInterest || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted">ระยะเวลาผ่อน</span>
                            <span className="font-bold text-right">{formData.requestedDuration} งวด</span>
                        </div>
                        <div className="border-t border-dashed border-border-subtle my-2 pt-2 flex justify-between">
                            <span className="text-muted font-bold">รวมยอดชำระทั้งสิ้น</span>
                            <span className="font-bold text-right">฿{((formData.requestedAmount || 0) + (formData.totalInterest || 0)).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl mt-2">
                            <span className="text-muted text-xs">ค่างวดโดยประมาณ</span>
                            <span className="font-bold text-right text-emerald-600 text-lg">฿{Math.ceil(formData.estimatedMonthlyPayment || 0).toLocaleString()} / เดือน</span>
                        </div>

                        {/* Post-Loan DSR / Payment Capacity Summary */}
                        <div className="pt-4 border-t border-dashed border-border-subtle mt-4">
                            <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[11px] font-bold text-indigo-900/60 uppercase tracking-wider">ความสามารถในการชำระหนี้รวม</span>
                                    {(() => {
                                        const totalExp = (formData.expenses || 0) + (formData.estimatedMonthlyPayment || 0);
                                        const dsr = formData.income > 0 ? (totalExp / formData.income) * 100 : 0;
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
                                        {Math.round((((formData.expenses || 0) + (formData.estimatedMonthlyPayment || 0)) / (formData.income || 1)) * 100)}%
                                    </span>
                                </div>
                                <p className="text-[10px] text-indigo-900/40 mt-1 italic">
                                    * รวมภาระหนี้เดิม ฿{(formData.expenses || 0).toLocaleString()} และงวดปัจจุบัน
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>

            {/* Terms and Conditions Section */}
            <div className="space-y-4">
                <h4 className="font-bold text-lg">ข้าพเจ้าขอรับรองและยินยอมตามข้อตกลงตังต่อไปนี้</h4>

                <Card className="border-border-subtle shadow-inner bg-gray-50 rounded-xl overflow-hidden">
                    <CardContent className="p-0">
                        <div className="h-[200px] p-6 overflow-y-auto w-full text-xs text-foreground/70 leading-relaxed scrollbar-thin scrollbar-thumb-gray-200">
                            <p className="mb-2 font-bold">1. การเปิดเผยข้อมูลส่วนบุคคล</p>
                            <p className="mb-4">ข้าพเจ้าตกลงยินยอมให้บริษัท เงินไชโย จำกัด ("บริษัท") และพนักงานของบริษัท เก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคลของข้าพเจ้า เพื่อประโยชน์ในการพิจารณาสินเชื่อ การติดต่อสื่อสาร การวิเคราะห์ข้อมูล และการนำเสนอผลิตภัณฑ์...</p>

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
                            ข้าพเจ้าได้อ่าน เข้าใจ และตกลงยินยอมปฏิบัติตามข้อตกลงและเงื่อนไขข้างต้นทุกประการ และขอรับรองว่าข้อมูลที่ให้ไว้เป็นความจริง
                        </Label>
                    </div>
                </div>
            </div>

            <div className="pt-4 pb-8 flex justify-center">
                <Button
                    size="lg"
                    className="w-full max-w-sm h-14 text-lg font-bold bg-chaiyo-gold hover:bg-chaiyo-gold/90 text-[#001080] shadow-xl"
                    disabled={!acceptedTerms}
                    onClick={handleConfirmSubmission}
                >
                    <Check className="w-5 h-5 mr-2" /> ยืนยันการสมัครสินเชื่อ
                </Button>
            </div>

            {/* Personal Info Edit Modal */}
            {isEditingPersonal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleCancelPersonalEdit} />
                    <Card className="relative w-full max-w-lg bg-white shadow-2xl rounded-[2rem] border-none overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                        <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
                            <div className="flex justify-between items-center sticky top-0 bg-white z-10 pb-4 border-b border-gray-100">
                                <div>
                                    <h3 className="text-xl font-bold text-foreground">แก้ไขข้อมูลผู้ติดต่อ</h3>
                                    <p className="text-xs text-muted">ข้อมูลจากบัตรประชาชนไม่สามารถแก้ไขได้</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={handleCancelPersonalEdit} className="rounded-full">
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            <div className="space-y-6">
                                {/* Disabled ID Info Section */}
                                <div className="bg-gray-50 p-4 rounded-xl space-y-3 opacity-70">
                                    <div className="flex gap-2 items-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                        <ShieldCheck className="w-3 h-3" /> ข้อมูลบัตรประชาชน
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-xs">ชื่อ-นามสกุล</Label>
                                            <div className="text-sm font-medium mt-1">{formData.prefix} {formData.firstName} {formData.lastName}</div>
                                        </div>
                                        <div>
                                            <Label className="text-xs">เลขบัตรประชาชน</Label>
                                            <div className="text-sm font-medium mt-1">{formData.idNumber}</div>
                                        </div>
                                        <div>
                                            <Label className="text-xs">วันเกิด</Label>
                                            <div className="text-sm font-medium mt-1">{formData.birthDate || "-"}</div>
                                        </div>
                                        <div className="col-span-2">
                                            <Label className="text-xs">ที่อยู่</Label>
                                            <div className="text-sm font-medium mt-1">
                                                {formData.addressLine1} {formData.subDistrict} {formData.district} {formData.province} {formData.zipCode}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>เบอร์โทรศัพท์</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                className="pl-9 h-12 rounded-xl"
                                                value={editPersonalData.phone || editPersonalData.phoneNumber}
                                                onChange={(e) => setEditPersonalData({ ...editPersonalData, phone: e.target.value, phoneNumber: e.target.value })}
                                                placeholder="08x-xxx-xxxx"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>อีเมล</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                className="pl-9 h-12 rounded-xl"
                                                value={editPersonalData.email}
                                                onChange={(e) => setEditPersonalData({ ...editPersonalData, email: e.target.value })}
                                                placeholder="example@email.com"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-gray-100" />

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>อาชีพ</Label>
                                        <Select
                                            value={editPersonalData.occupation}
                                            onValueChange={(val) => setEditPersonalData({ ...editPersonalData, occupation: val })}
                                        >
                                            <SelectTrigger className="pl-9 relative h-12 rounded-xl">
                                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                                                <SelectValue placeholder="เลือกอาชีพ" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="พนักงานบริษัท">พนักงานบริษัท</SelectItem>
                                                <SelectItem value="เจ้าของกิจการ">เจ้าของกิจการ</SelectItem>
                                                <SelectItem value="รับจ้างอิสระ">รับจ้างอิสระ</SelectItem>
                                                <SelectItem value="ข้าราชการ/รัฐวิสาหกิจ">ข้าราชการ/รัฐวิสาหกิจ</SelectItem>
                                                <SelectItem value="เกษตรกร">เกษตรกร</SelectItem>
                                                <SelectItem value="พ่อบ้าน/แม่บ้าน">พ่อบ้าน/แม่บ้าน</SelectItem>
                                                <SelectItem value="อื่นๆ">อื่นๆ</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>สถานที่ทำงาน</Label>
                                            <Input
                                                className="h-12 rounded-xl"
                                                value={editPersonalData.workplace}
                                                onChange={(e) => setEditPersonalData({ ...editPersonalData, workplace: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>อายุงาน (ปี)</Label>
                                            <Input
                                                type="number"
                                                className="h-12 rounded-xl"
                                                value={editPersonalData.workYears}
                                                onChange={(e) => setEditPersonalData({ ...editPersonalData, workYears: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 sticky bottom-0 bg-white border-t border-gray-100 mt-auto">
                                <Button variant="outline" className="flex-1 h-12 rounded-xl" onClick={handleCancelPersonalEdit}>ยกเลิก</Button>
                                <Button className="flex-1 h-12 rounded-xl bg-chaiyo-blue text-white hover:bg-chaiyo-blue/90" onClick={handleSavePersonalEdit}>บันทึกข้อมูล</Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* OTP Verification Modal */}
            {showOTP && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#001080]/80 backdrop-blur-md" />
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
                                    ระบบได้ส่งรหัส OTP ไปยัง <span className="font-bold text-foreground">{formData.phoneNumber || formData.phone}</span>
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
                                        </InputOTPGroup>
                                        <InputOTPSeparator />
                                        <InputOTPGroup>
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
            )}
        </div>
    );
}
