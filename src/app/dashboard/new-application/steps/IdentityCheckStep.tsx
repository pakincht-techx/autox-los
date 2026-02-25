"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Loader2, CreditCard, User, Camera, ArrowRight, UserCheck, UserPlus, FileText, MapPin, Briefcase, Calendar, ShieldAlert, AlertTriangle, XCircle, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";

import { format } from "date-fns";
import { Textarea } from "@/components/ui/Textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/Checkbox";
import { Combobox } from "@/components/ui/combobox";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface IdentityCheckStepProps {
    formData: any;
    setFormData: (data: any) => void;
    onNext: (isExisting: boolean, profile?: any) => void;
}

type KYCStage = 'INIT' | 'READING_CARD' | 'CHECKING_MEMBER' | 'CARD_SUCCESS' | 'FACE_VERIFY' | 'FACE_SUCCESS' | 'COMPLETE';

export function IdentityCheckStep({ formData, setFormData, onNext }: IdentityCheckStepProps) {
    const [stage, setStage] = useState<KYCStage>('INIT');
    const [verificationMethod, setVerificationMethod] = useState<'DIPCHIP' | 'MANUAL' | null>(null);

    const [isExistingMember, setIsExistingMember] = useState<boolean>(false);
    const [existingProfile, setExistingProfile] = useState<any>(null);

    // Mock Data
    const [mockChipPhoto, setMockChipPhoto] = useState<string | null>(null);
    const [watchlistReasons, setWatchlistReasons] = useState<('Fraud' | 'Compliance' | 'Legal')[]>([]);
    const [alertDialog, setAlertDialog] = useState({
        isOpen: false,
        title: "",
        description: ""
    });
    const [mockLivePhoto, setMockLivePhoto] = useState<string | null>(null);

    // --- DATE LOGIC ---
    const [useYearOnly, setUseYearOnly] = useState(false);
    const [dateDisplay, setDateDisplay] = useState("");

    useEffect(() => {
        if (formData.birthDate) {
            const date = new Date(formData.birthDate);
            if (!isNaN(date.getTime())) {
                const year = date.getFullYear();
                const thaiYear = year + 543;

                if (useYearOnly) {
                    setDateDisplay(`${thaiYear}`);
                } else {
                    const day = format(date, "dd");
                    const month = format(date, "MM");
                    setDateDisplay(`${day}/${month}/${thaiYear}`);
                }
            }
        } else {
            setDateDisplay("");
        }
    }, [formData.birthDate, useYearOnly]);

    const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, ''); // Keep only numbers

        if (useYearOnly) {
            // Year Only Mode
            if (val.length > 4) val = val.slice(0, 4);
            setDateDisplay(val);

            if (val.length === 4) {
                let y = parseInt(val);
                let realYearAD = y;
                if (y > 2400) {
                    // Already BE
                    realYearAD = y - 543;
                }
                // Default to Jan 1st
                handleFormChange('birthDate', `${realYearAD}-01-01`);
            }
        } else {
            // Full Date Mode
            if (val.length > 8) val = val.slice(0, 8); // Cap at 8 digits

            // Auto-format with slashes
            let formattedVal = val;
            if (val.length >= 3) {
                formattedVal = val.slice(0, 2) + '/' + val.slice(2);
            }
            if (val.length >= 5) {
                formattedVal = formattedVal.slice(0, 5) + '/' + formattedVal.slice(5);
            }

            setDateDisplay(formattedVal);

            // Parse logic (triggered when we have a full date)
            if (val.length === 8) {
                const d = parseInt(val.slice(0, 2));
                const m = parseInt(val.slice(2, 4));
                const y = parseInt(val.slice(4, 8));

                // Auto-adjust AD to BE logic
                let realYearAD = y;
                if (y > 2400) {
                    // Already BE
                    realYearAD = y - 543;
                }

                // Validate date
                const dateObj = new Date(realYearAD, m - 1, d);
                if (!isNaN(dateObj.getTime()) && dateObj.getDate() === d) {
                    handleFormChange('birthDate', format(dateObj, "yyyy-MM-dd"));
                }
            }
        }
    };

    const handleDateBlur = () => {
        if (formData.birthDate) {
            const date = new Date(formData.birthDate);
            const thaiYear = date.getFullYear() + 543;
            if (useYearOnly) {
                setDateDisplay(`${thaiYear}`);
            } else {
                setDateDisplay(`${format(date, "dd/MM")}/${thaiYear}`);
            }
        }
    };

    const toggleYearOnly = (checked: boolean) => {
        setUseYearOnly(checked);
        setDateDisplay("");
        handleFormChange('birthDate', ""); // Clear date when switching modes to avoid confusion
    };

    // --- SELECTION HANDLER ---
    const handleSelectMethod = (method: 'DIPCHIP' | 'MANUAL') => {
        setVerificationMethod(method);
        if (method === 'DIPCHIP') {
            // Auto-start Dipchip reading? Or wait for user to click "Start"?
            // Let's wait for user to click "Read Card" inside the next view
        }
    };

    const handleBackToSelection = () => {
        setVerificationMethod(null);
        setStage('INIT');
        setFormData({ ...formData, idNumber: "", firstName: "", middleName: "", lastName: "", houseNumber: "", floorNumber: "", unitNumber: "", village: "", moo: "", yaek: "", trohk: "", soi: "" }); // Reset basic info
    };


    // 1. Dip Chip -> Then Check Member Immediately
    const handleReadCard = async () => {
        setStage('READING_CARD');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock Data
        const mockData = {
            idNumber: "1234567890123", // Default ID
            firstName: "สมชาย",
            middleName: "",
            lastName: "รักชาติ",
            prefix: "นาย",
            gender: "ชาย",
            birthDate: "1990-01-01",
            addressLine1: "123 หมู่ 1",
            houseNumber: "123",
            moo: "1",
            subDistrict: "ลาดพร้าว",
            district: "ลาดพร้าว",
            province: "กรุงเทพมหานคร",
            zipCode: "10230",
            fullAddress: "123 หมู่ 1 ลาดพร้าว ลาดพร้าว กรุงเทพมหานคร 10230",
            occupation: "พนักงานบริษัท", // Default occupation
            phoneNumber: "0812345678",
            email: "",
            issueDate: "2020-05-20",
            expiryDate: "2029-05-19",
            laserId: "ME1-2345678-90",
        };

        setFormData({ ...formData, ...mockData });
        setMockChipPhoto("https://api.dicebear.com/7.x/avataaars/svg?seed=Somchai&backgroundColor=e6e6e6");

        // Proceed to check member immediately
        checkMemberStatus(mockData.idNumber);
    };

    // 1.2 Manual/OCR Upload Handler (Mock)
    const handleOCRUpload = async () => {
        setStage('READING_CARD'); // Reuse reading state for "Processing OCR"
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock OCR Data (Varies slightly based on method?)
        const mockData = {
            idNumber: "3334567890123",
            firstName: "สมหญิง",
            middleName: "มณี",
            lastName: "ใจงาม",
            prefix: "นางสาว",
            gender: "หญิง",
            birthDate: "1995-05-05",
            addressLine1: "456 หมู่ 2",
            houseNumber: "456",
            moo: "2",
            street: "เจริญกรุง",
            subDistrict: "บางรัก",
            province: "กรุงเทพมหานคร",
            zipCode: "10500",
            fullAddress: "456 หมู่ 2 บางรัก บางรัก กรุงเทพมหานคร 10500",
            issueDate: "2022-10-10",
            expiryDate: "2031-10-09",
            laserId: "CH2-9876543-21",
        };

        setFormData({ ...formData, ...mockData });
        // For Manual/OCR, we might want to let them REVIEW the data before checking member?
        // Or just auto-check. Let's auto-check for flow simplicity, but in real life maybe review first.
        // Actually, user requested "Manual Entry" option if OCR fails.
        // So let's land them on a "Review/Edit Data" screen first?
        // Current Step 3 (Stage COMPLETE) of THIS component allows editing if NEW CUSTOMER.
        // But we need to check member status first to know if they are new.

        checkMemberStatus(mockData.idNumber);
    };

    // 1.3 Manual Submit (When user types ID manually)
    const handleManualSubmit = () => {
        if (formData.idNumber && formData.idNumber.length >= 13) {
            checkMemberStatus(formData.idNumber);
        } else {
            setAlertDialog({
                isOpen: true,
                title: "ข้อมูลไม่ถูกต้อง",
                description: "กรุณากรอกเลขบัตรประชาชน/เลขบัตรต่างด้าว ให้ถูกต้อง (13 หลัก)"
            });
        }
    };


    const checkMemberStatus = async (idNumber: string) => {
        setStage('CHECKING_MEMBER');

        await new Promise(resolve => setTimeout(resolve, 1500));

        // 1. Determine Member Status First
        let isExisting = false;
        let profile = null;

        // Mock Logic: ID ends with '555' is Existing Customer
        if (idNumber.endsWith('555') || formData.idNumber.endsWith('555')) {
            isExisting = true;
            profile = {
                customerId: "CUST-555001",
                fullName: "คุณสมชาย ใจดี",
                activeLoans: 2,
                lastContact: "2023-12-01",
                creditGrade: "A"
            };
        }

        setIsExistingMember(isExisting);
        setExistingProfile(profile);



        // 3. Normal Flow
        if (isExisting) {
            // For Existing Customer: Skip Face Verify -> Go to COMPLETE
            setStage('COMPLETE');
            onNext(true, profile); // Notify parent (NewApplicationPage) immediately to show ExistingCustomerView
        } else {
            // New Customer -> Must do Face Verification
            setStage('FACE_VERIFY');
        }
    };


    // 2. Face Verification (Only for New Customers)
    const handleFaceVerify = async () => {
        setStage('FACE_VERIFY'); // Just to be sure
        await new Promise(resolve => setTimeout(resolve, 1500));
        setMockLivePhoto("https://api.dicebear.com/7.x/avataaars/svg?seed=Somchai&backgroundColor=ffffff");

        setStage('COMPLETE');
        // Do NOT call onNext yet. Wait for button click.
    };

    const handleCreateProfile = () => {
        onNext(false, null);
    };


    const handleManualID = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, idNumber: e.target.value });
    };

    const handleFormChange = (field: string, value: string) => {
        let updatedData = { ...formData, [field]: value };

        // Auto-fill gender based on prefix
        if (field === 'prefix') {
            if (value === 'นาย') {
                updatedData.gender = 'ชาย';
            } else if (value === 'นาง' || value === 'นางสาว') {
                updatedData.gender = 'หญิง';
            }
        }

        setFormData(updatedData);
    };

    // --- RENDER HELPERS ---
    const renderSelectionScreen = () => (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-center mb-8">เลือกวิธีการยืนยันตัวตน</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Option 1: Dipchip */}
                <Card
                    className="border-2 border-dashed border-gray-200 hover:border-chaiyo-blue hover:bg-blue-50/30 cursor-pointer transition-all group"
                    onClick={() => handleSelectMethod('DIPCHIP')}
                >
                    <CardContent className="flex flex-col items-center justify-center py-10 text-center h-full">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <CreditCard className="w-8 h-8 text-chaiyo-blue" />
                        </div>
                        <h3 className="font-bold text-lg mb-2 text-foreground group-hover:text-chaiyo-blue">บัตรประชาชน (Dipchip)</h3>
                        <p className="text-sm text-muted mb-4">สำหรับลูกค้าที่มีบัตรประชาชนแบบชิปการ์ด และสามารถอ่านข้อมูลได้</p>
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">แนะนำ (เร็วที่สุด)</Badge>
                    </CardContent>
                </Card>

                {/* Option 2: Manual/OCR (Thai & Non-Thai) */}
                <Card
                    className="border-2 border-dashed border-gray-200 hover:border-orange-400 hover:bg-orange-50/30 cursor-pointer transition-all group"
                    onClick={() => handleSelectMethod('MANUAL')}
                >
                    <CardContent className="flex flex-col items-center justify-center py-10 text-center h-full">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <FileText className="w-8 h-8 text-orange-600" />
                        </div>
                        <h3 className="font-bold text-lg mb-2 text-foreground group-hover:text-orange-600">กรอกข้อมูล / ถ่ายรูปบัตร</h3>
                        <p className="text-sm text-muted mb-4">สำหรับบัตรประชาชนที่ไม่สามารถอ่านชิปได้ หรือ บัตรต่างด้าว (บัตรชมพู/ขาว)</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );

    return (
        <>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">

                {/* Stage Indicators */}
                <div className="relative flex items-center justify-between px-12 md:px-24 mb-8">
                    {/* Connecting Line */}
                    <div className="absolute top-[15px] left-16 right-16 md:left-28 md:right-28 h-[2px] z-0">
                        <div className="absolute inset-0 bg-gray-300"></div>
                        <div
                            className="absolute left-0 top-0 h-full bg-chaiyo-blue transition-all duration-500"
                            style={{
                                width: stage === 'COMPLETE' || stage === 'FACE_SUCCESS' ? '100%' :
                                    stage === 'FACE_VERIFY' ? '100%' :
                                        stage === 'CHECKING_MEMBER' ? '50%' :
                                            stage === 'READING_CARD' ? '10%' : '0%'
                            }}
                        ></div>
                    </div>

                    <StepIndicator
                        num={1}
                        label="ข้อมูลบุคคล"
                        active={stage === 'INIT' || stage === 'READING_CARD'}
                        completed={stage !== 'INIT' && stage !== 'READING_CARD'}
                    />

                    <StepIndicator
                        num={2}
                        label="ตรวจสอบสถานะ"
                        active={stage === 'CHECKING_MEMBER'}
                        completed={stage === 'COMPLETE' || stage === 'FACE_VERIFY' || stage === 'FACE_SUCCESS'}
                    />

                    <StepIndicator
                        num={3}
                        label="ยืนยันใบหน้า"
                        active={stage === 'FACE_VERIFY'}
                        completed={stage === 'COMPLETE' || stage === 'FACE_SUCCESS'}
                        skipped={isExistingMember && stage === 'COMPLETE'}
                    />
                </div>

                {/* Main Content Area */}
                {stage === 'INIT' && !verificationMethod ? (
                    renderSelectionScreen()
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                        {/* LEFT COLUMN: ACTION / STATUS */}
                        <div className="space-y-6">
                            {/* Header with Back Button (Only if not processing) */}
                            {stage === 'INIT' && (
                                <Button variant="ghost" onClick={handleBackToSelection} className="pl-0 text-muted hover:text-foreground -mt-4 mb-2">
                                    <ArrowLeft className="w-4 h-4 mr-2" /> เลือกวิธีอื่น
                                </Button>
                            )}

                            {/* STAGE 1: INPUT DATA (Method Specific) */}
                            {(stage === 'INIT' || stage === 'READING_CARD') && (
                                <>
                                    {verificationMethod === 'DIPCHIP' && (
                                        <Card className="border-2 border-dashed border-chaiyo-blue/20 bg-blue-50/20 shadow-none hover:bg-blue-50/40 transition-colors cursor-pointer" onClick={handleReadCard}>
                                            <CardContent className="flex flex-col items-center justify-center py-20">
                                                {stage === 'READING_CARD' ? (
                                                    <>
                                                        <Loader2 className="w-16 h-16 text-chaiyo-blue animate-spin mb-4" />
                                                        <h3 className="text-xl font-bold text-chaiyo-blue">กำลังอ่านข้อมูลจากบัตร...</h3>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                                                            <CreditCard className="w-10 h-10 text-chaiyo-blue" />
                                                        </div>
                                                        <h3 className="text-xl font-bold text-foreground">เสียบบัตรประชาชน</h3>
                                                        <p className="text-muted text-sm mt-2 mb-6">เพื่อดึงข้อมูลจากชิปการ์ด (Smart Card)</p>
                                                        <Button className="pointer-events-none bg-chaiyo-blue">อ่านข้อมูลบัตร</Button>
                                                    </>
                                                )}
                                            </CardContent>
                                        </Card>
                                    )}

                                    {verificationMethod === 'MANUAL' && (
                                        <div className="space-y-4">
                                            <Card className="border-2 border-dashed bg-white shadow-none border-orange-200 bg-orange-50/20">
                                                <CardContent className="p-6">
                                                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                                        <FileText className="w-5 h-5 text-orange-600" />
                                                        กรอกข้อมูล / ถ่ายรูปบัตร
                                                    </h3>

                                                    <div className="space-y-4">
                                                        {stage === 'READING_CARD' ? (
                                                            <div className="flex flex-col items-center justify-center py-8">
                                                                <Loader2 className="w-10 h-10 text-chaiyo-blue animate-spin mb-2" />
                                                                <p className="text-sm text-muted">กำลังประมวลผลภาพ (OCR)...</p>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <div className="grid grid-cols-1 gap-2">
                                                                    <Label>ถ่ายรูปบัตรเพื่อดึงข้อมูล (OCR)</Label>
                                                                    <Button variant="outline" className="w-full h-12 border-dashed border-2" onClick={handleOCRUpload}>
                                                                        <Camera className="w-4 h-4 mr-2" /> ถ่ายรูปบัตรประชาชน / บัตรต่างด้าว
                                                                    </Button>
                                                                </div>

                                                                <div className="relative flex py-2 items-center">
                                                                    <div className="flex-grow border-t border-gray-200"></div>
                                                                    <span className="flex-shrink-0 mx-4 text-xs text-gray-400">หรือ กรอกเลขบัตรเพื่อตรวจสอบ</span>
                                                                    <div className="flex-grow border-t border-gray-200"></div>
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <Label>เลขบัตรประจำตัว (13 หลัก)</Label>
                                                                    <div className="flex gap-2">
                                                                        <Input
                                                                            value={formData.idNumber}
                                                                            onChange={handleManualID}
                                                                            placeholder="x-xxxx-xxxxx-xx-x"
                                                                            maxLength={13}
                                                                            className="font-mono text-lg"
                                                                        />
                                                                        <Button onClick={handleManualSubmit} disabled={!formData.idNumber || formData.idNumber.length < 13}>
                                                                            ตรวจสอบ
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* STAGE 2: CHECKING STATUS */}
                            {stage === 'CHECKING_MEMBER' && (
                                <Card className="border-border-subtle">
                                    <CardContent className="flex flex-col items-center justify-center py-20">
                                        <Loader2 className="w-12 h-12 text-chaiyo-blue animate-spin mb-4" />
                                        <h3 className="text-lg font-bold text-foreground">กำลังตรวจสอบสถานะลูกค้า...</h3>
                                    </CardContent>
                                </Card>
                            )}

                            {/* STAGE 3: FACE VERIFY */}
                            {(stage === 'FACE_VERIFY') && (
                                <Card className="border-border-subtle bg-slate-900 overflow-hidden relative">
                                    <CardContent className="flex flex-col items-center justify-center py-0 px-0 h-[400px] relative">
                                        <div className="flex flex-col items-center z-10">
                                            <Camera className="w-12 h-12 text-white/50 mb-4" />
                                            <Button size="lg" onClick={handleFaceVerify} className="bg-white text-chaiyo-blue hover:bg-gray-100 font-bold rounded-full px-8">
                                                ถ่ายภาพ
                                            </Button>
                                        </div>
                                        <div className="absolute inset-0 opacity-30 bg-gradient-to-b from-transparent to-slate-900">
                                            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?fit=crop&w=400&h=400" alt="Face Verification Overlay" className="w-full h-full object-cover grayscale" />
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* STAGE 4: COMPLETE (Results) */}
                            {stage === 'COMPLETE' && (
                                <Card className={cn(
                                    "border-2",
                                    isExistingMember ? "bg-blue-50 border-blue-200" : "bg-emerald-50 border-emerald-200"
                                )}>
                                    <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                                        {isExistingMember ? (
                                            <>
                                                <UserCheck className="w-12 h-12 text-blue-600 mb-2" />
                                                <h3 className="text-xl font-bold text-blue-800">ลูกค้าเก่าในระบบ</h3>
                                                <p className="text-blue-700">สถานะปกติ ยืนยันตัวตนเรียบร้อย</p>
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-12 h-12 text-emerald-500 mb-2" />
                                                <h3 className="text-xl font-bold text-emerald-800">ยืนยันตัวตนเรียบร้อย</h3>
                                                <p className="text-emerald-700 mb-6">สถานะปกติ ตรวจสอบข้อมูลลูกค้าใหม่</p>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* RIGHT COLUMN: PREVIEW / FORM */}
                        <div className="space-y-6">
                            {/* Display Profile Creating Form if Complete AND New Member */}
                            {stage === 'COMPLETE' && !isExistingMember ? (
                                <Card className="border-border-subtle shadow-md bg-white">
                                    <CardHeader className="bg-emerald-50 border-b border-emerald-100">
                                        <CardTitle className="text-emerald-800 flex items-center gap-2">
                                            <UserPlus className="w-5 h-5" /> สร้างข้อมูลลูกค้าใหม่
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-6">
                                        {/* 1. Static Identity Information */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 text-sm font-bold text-gray-700 pb-2 border-b border-gray-100">

                                                ข้อมูลตามบัตรประชาชน
                                            </div>

                                            {/* Citizen ID Display */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>เลขบัตรประชาชน</Label>
                                                    <div className="relative">
                                                        <Input
                                                            value={formData.idNumber || ""}
                                                            disabled
                                                            className="disabled:bg-gray-100 disabled:opacity-80"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>เลขหลังบัตรประชาชน (Laser ID)</Label>
                                                    <Input
                                                        value={formData.laserId || ""}
                                                        onChange={(e) => handleFormChange('laserId', e.target.value)}
                                                        disabled={verificationMethod === 'DIPCHIP'}
                                                        className="disabled:bg-gray-100 disabled:opacity-80 font-mono"
                                                        placeholder="JT0-0000000-00"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>คำนำหน้า</Label>
                                                    <Select value={formData.prefix} onValueChange={(val) => handleFormChange('prefix', val)} disabled={verificationMethod === 'DIPCHIP'}>
                                                        <SelectTrigger className="disabled:bg-gray-100 disabled:opacity-80">
                                                            <SelectValue placeholder="เลือก" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="นาย">นาย</SelectItem>
                                                            <SelectItem value="นาง">นาง</SelectItem>
                                                            <SelectItem value="นางสาว">นางสาว</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>ชื่อ</Label>
                                                    <Input value={formData.firstName} onChange={(e) => handleFormChange('firstName', e.target.value)} disabled={verificationMethod === 'DIPCHIP'} className="disabled:bg-gray-100 disabled:opacity-80" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>ชื่อกลาง (ถ้ามี)</Label>
                                                    <Input value={formData.middleName || ""} onChange={(e) => handleFormChange('middleName', e.target.value)} disabled={verificationMethod === 'DIPCHIP'} className="disabled:bg-gray-100 disabled:opacity-80" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>นามสกุล</Label>
                                                    <Input value={formData.lastName} onChange={(e) => handleFormChange('lastName', e.target.value)} disabled={verificationMethod === 'DIPCHIP'} className="disabled:bg-gray-100 disabled:opacity-80" />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-4">
                                                <div className="space-y-2">
                                                    <Label>วันเกิด</Label>
                                                    <div className="relative">
                                                        <Input
                                                            value={dateDisplay}
                                                            onChange={handleDateInputChange}
                                                            onBlur={handleDateBlur}
                                                            placeholder={useYearOnly ? "YYYY (พ.ศ. เช่น 2533)" : "DD/MM/YYYY (พ.ศ.)"}
                                                            disabled={verificationMethod === 'DIPCHIP'}
                                                            className="disabled:bg-gray-100 disabled:opacity-80 pr-10"
                                                            maxLength={useYearOnly ? 4 : 10}
                                                        />
                                                    </div>
                                                    <div className="flex items-center space-x-2 pt-1">
                                                        <Checkbox
                                                            id="year-only-mode"
                                                            checked={useYearOnly}
                                                            onCheckedChange={(checked) => toggleYearOnly(checked as boolean)}
                                                            disabled={verificationMethod === 'DIPCHIP'}
                                                        />
                                                        <label
                                                            htmlFor="year-only-mode"
                                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600"
                                                        >
                                                            จำวันเดือนเกิดไม่ได้ (ระบุแค่ปีเกิด)
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                                    <div className="space-y-2">
                                                        <Label>วันที่ออกบัตร</Label>
                                                        <Input
                                                            type="date"
                                                            value={formData.issueDate || ""}
                                                            onChange={(e) => handleFormChange('issueDate', e.target.value)}
                                                            disabled={verificationMethod === 'DIPCHIP'}
                                                            className="disabled:bg-gray-100 disabled:opacity-80"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>วันที่บัตรหมดอายุ</Label>
                                                        <Input
                                                            type="date"
                                                            value={formData.expiryDate || ""}
                                                            onChange={(e) => handleFormChange('expiryDate', e.target.value)}
                                                            disabled={verificationMethod === 'DIPCHIP'}
                                                            className="disabled:bg-gray-100 disabled:opacity-80"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-4 pt-2">
                                                    <div className="flex items-center gap-2 text-sm font-bold text-gray-700 pb-2 border-b border-gray-100">
                                                        ที่อยู่อาศัย
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 col-span-1 md:col-span-2">
                                                            <div className="space-y-2">
                                                                <Label className="text-xs text-muted-foreground">เลขที่บ้าน</Label>
                                                                <Input
                                                                    className="bg-white"
                                                                    value={formData.houseNumber || ""}
                                                                    onChange={(e) => handleFormChange('houseNumber', e.target.value)}
                                                                    disabled={verificationMethod === 'DIPCHIP'}
                                                                    placeholder="123/45"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-xs text-muted-foreground">ชั้น</Label>
                                                                <Input
                                                                    className="bg-white"
                                                                    value={formData.floorNumber || ""}
                                                                    onChange={(e) => handleFormChange('floorNumber', e.target.value)}
                                                                    disabled={verificationMethod === 'DIPCHIP'}
                                                                    placeholder="เช่น 2"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-xs text-muted-foreground">หน่วย/ห้อง</Label>
                                                                <Input
                                                                    className="bg-white"
                                                                    value={formData.unitNumber || ""}
                                                                    onChange={(e) => handleFormChange('unitNumber', e.target.value)}
                                                                    disabled={verificationMethod === 'DIPCHIP'}
                                                                    placeholder="เช่น 201"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-xs text-muted-foreground">หมู่ที่</Label>
                                                                <Input
                                                                    className="bg-white"
                                                                    value={formData.moo || ""}
                                                                    onChange={(e) => handleFormChange('moo', e.target.value)}
                                                                    disabled={verificationMethod === 'DIPCHIP'}
                                                                    placeholder="เช่น 1"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-1 md:col-span-2">
                                                            <div className="space-y-2">
                                                                <Label className="text-xs text-muted-foreground">หมู่บ้าน/อาคาร</Label>
                                                                <Input
                                                                    className="bg-white"
                                                                    value={formData.village || ""}
                                                                    onChange={(e) => handleFormChange('village', e.target.value)}
                                                                    disabled={verificationMethod === 'DIPCHIP'}
                                                                    placeholder="ชื่อหมู่บ้านหรืออาคาร"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-xs text-muted-foreground">ซอย</Label>
                                                                <Input
                                                                    className="bg-white"
                                                                    value={formData.soi || ""}
                                                                    onChange={(e) => handleFormChange('soi', e.target.value)}
                                                                    disabled={verificationMethod === 'DIPCHIP'}
                                                                    placeholder="ชื่อซอย"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 col-span-1 md:col-span-2">
                                                            <div className="space-y-2">
                                                                <Label className="text-xs text-muted-foreground">แยก</Label>
                                                                <Input
                                                                    className="bg-white"
                                                                    value={formData.yaek || ""}
                                                                    onChange={(e) => handleFormChange('yaek', e.target.value)}
                                                                    disabled={verificationMethod === 'DIPCHIP'}
                                                                    placeholder="ระบุแยก (ถ้ามี)"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-xs text-muted-foreground">ตรอก</Label>
                                                                <Input
                                                                    className="bg-white"
                                                                    value={formData.trohk || ""}
                                                                    onChange={(e) => handleFormChange('trohk', e.target.value)}
                                                                    disabled={verificationMethod === 'DIPCHIP'}
                                                                    placeholder="ระบุตรอก (ถ้ามี)"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="text-xs text-muted-foreground">ถนน</Label>
                                                            <Combobox
                                                                options={[{ label: "สุขุมวิท", value: "สุขุมวิท" }, { label: "เพชรเกษม", value: "เพชรเกษม" }, { label: "พหลโยธิน", value: "พหลโยธิน" }]}
                                                                value={formData.street || ""}
                                                                onValueChange={(val) => handleFormChange('street', val)}
                                                                disabled={verificationMethod === 'DIPCHIP'}
                                                                placeholder="ระบุถนน"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="text-xs text-muted-foreground">แขวง/ตำบล</Label>
                                                            <Combobox
                                                                options={[{ label: "ลาดพร้าว", value: "ลาดพร้าว" }, { label: "บางรัก", value: "บางรัก" }]}
                                                                value={formData.subDistrict || ""}
                                                                onValueChange={(val) => handleFormChange('subDistrict', val)}
                                                                disabled={verificationMethod === 'DIPCHIP'}
                                                                placeholder="ระบุแขวง/ตำบล"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="text-xs text-muted-foreground">เขต/อำเภอ</Label>
                                                            <Combobox
                                                                options={[{ label: "ลาดพร้าว", value: "ลาดพร้าว" }, { label: "บางรัก", value: "บางรัก" }]}
                                                                value={formData.district || ""}
                                                                onValueChange={(val) => handleFormChange('district', val)}
                                                                disabled={verificationMethod === 'DIPCHIP'}
                                                                placeholder="ระบุเขต/อำเภอ"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="text-xs text-muted-foreground">จังหวัด</Label>
                                                            <Combobox
                                                                options={[{ label: "กรุงเทพมหานคร", value: "กรุงเทพมหานคร" }, { label: "นนทบุรี", value: "นนทบุรี" }, { label: "ปทุมธานี", value: "ปทุมธานี" }]}
                                                                value={formData.province || ""}
                                                                onValueChange={(val) => handleFormChange('province', val)}
                                                                disabled={verificationMethod === 'DIPCHIP'}
                                                                placeholder="ระบุจังหวัด"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="text-xs text-muted-foreground">รหัสไปรษณีย์</Label>
                                                            <Input
                                                                className="bg-white"
                                                                value={formData.zipCode || ""}
                                                                onChange={(e) => handleFormChange('zipCode', e.target.value.replace(/\D/g, '').slice(0, 5))}
                                                                disabled={verificationMethod === 'DIPCHIP'}
                                                                maxLength={5}
                                                                placeholder="12345"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>



                                        { /* Only show warning if disabled */}
                                        {verificationMethod === 'DIPCHIP' && (
                                            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg text-xs mt-2">
                                                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                                <span>ข้อมูลส่วนตัวถูกดึงจาก Smart Card</span>
                                            </div>
                                        )}

                                        <Button size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg mt-6" onClick={handleCreateProfile}>
                                            <UserPlus className="w-5 h-5 mr-2" /> สร้างข้อมูลลูกค้าและเริ่มงาน
                                        </Button>
                                    </CardContent>
                                </Card >
                            ) : (
                                // Default View (Information Preview)
                                <Card className="h-full border-border-subtle bg-gray-50/50">
                                    <CardContent className="p-6 space-y-6">
                                        <h3 className="font-bold text-muted uppercase text-xs tracking-widest">ข้อมูล{verificationMethod === 'DIPCHIP' ? 'จากชิปการ์ด' : 'ที่ระบุ'}</h3>

                                        {/* Photos */}
                                        <div className="flex gap-4">
                                            <div className="flex-1 space-y-2">
                                                <div className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden border border-gray-300 relative group">
                                                    {mockChipPhoto ? (
                                                        <img src={mockChipPhoto} alt="Chip" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full text-muted"><User className="w-8 h-8 opacity-20" /></div>
                                                    )}
                                                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] py-1 text-center font-bold">
                                                        {verificationMethod === 'DIPCHIP' ? 'Smart Card' : 'OCR / Image'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <div className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden border border-gray-300 relative">
                                                    {mockLivePhoto ? (
                                                        <img src={mockLivePhoto} alt="Live" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full text-muted">
                                                            {isExistingMember ? <UserCheck className="w-8 h-8 opacity-20" /> : <Camera className="w-8 h-8 opacity-20" />}
                                                        </div>
                                                    )}
                                                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] py-1 text-center font-bold">
                                                        {isExistingMember ? 'Skipped' : 'Live Photo'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Data Fields */}
                                        <div className="space-y-4 pt-4 border-t border-gray-200">
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="space-y-1">
                                                    <Label className="text-xs text-muted">เลขบัตรประจำตัว</Label>
                                                    <Input value={formData.idNumber} readOnly className="font-mono bg-white text-base font-bold text-chaiyo-blue" placeholder="-" />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-xs text-muted">เลขหลังบัตร</Label>
                                                    <Input value={formData.laserId} readOnly className="font-mono bg-white text-base font-bold" placeholder="-" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2">
                                                <div className="space-y-1">
                                                    <Label className="text-xs text-muted">ชื่อ</Label>
                                                    <Input value={formData.firstName} readOnly className="bg-gray-100 border-none shadow-none text-muted-foreground" placeholder="-" />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-xs text-muted">ชื่อกลาง</Label>
                                                    <Input value={formData.middleName} readOnly className="bg-gray-100 border-none shadow-none text-muted-foreground" placeholder="-" />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-xs text-muted">นามสกุล</Label>
                                                    <Input value={formData.lastName} readOnly className="bg-gray-100 border-none shadow-none text-muted-foreground" placeholder="-" />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                            }
                        </div >
                    </div >
                )
                }
            </div >

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
                            ตรวจสอบอีกครั้ง
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

function StepIndicator({ num, label, active, completed, skipped }: { num: number, label: string, active: boolean, completed: boolean, skipped?: boolean }) {
    if (skipped) {
        return (
            <div className="flex flex-col items-center gap-2 z-10 opacity-50">
                <div className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-100 bg-gray-50 text-gray-300">
                    -
                </div>
                <span className="text-xs font-bold absolute -bottom-6 w-32 text-center text-gray-300">{label}</span>
            </div>
        )
    }

    return (
        <div className={cn("flex flex-col items-center gap-2 z-10")}>
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300",
                active ? "border-chaiyo-blue ring-4 ring-blue-50 text-chaiyo-blue bg-white" :
                    completed ? "bg-chaiyo-blue text-white border-chaiyo-blue" :
                        "bg-white border-gray-200 text-gray-300"
            )}>
                {completed ? <CheckCircle className="w-5 h-5" /> : num}
            </div>
            <span className={cn("text-xs font-bold absolute -bottom-6 w-32 text-center", active || completed ? "text-chaiyo-blue" : "text-gray-300")}>{label}</span>
        </div>
    )
}
