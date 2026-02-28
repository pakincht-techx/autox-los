"use client";

import { useState, useEffect, useRef } from "react";
import { CheckCircle, Loader2, CreditCard, User, Camera, ArrowRight, UserCheck, UserPlus, FileText, MapPin, Briefcase, Calendar, ShieldAlert, AlertTriangle, XCircle, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

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

type KYCStage = 'INIT' | 'READING_CARD' | 'CHECKING_MEMBER' | 'CARD_SUCCESS' | 'TAKING_ID_FRONT' | 'TAKING_ID_BACK' | 'FACE_VERIFY' | 'FACE_SUCCESS' | 'COMPLETE';

export function IdentityCheckStep({ formData, setFormData, onNext }: IdentityCheckStepProps) {
    const [stage, setStage] = useState<KYCStage>('INIT');
    const [verificationMethod, setVerificationMethod] = useState<'DIPCHIP' | 'MANUAL' | null>(null);

    const [isExistingMember, setIsExistingMember] = useState<boolean>(false);
    const [existingProfile, setExistingProfile] = useState<any>(null);

    // Mock Data
    const [mockChipPhoto, setMockChipPhoto] = useState<string | null>(null);
    const COUNTRIES = [
        { label: "ไทย (Thai)", value: "Thai" },
        { label: "พม่า (Myanmar)", value: "Myanmar" },
        { label: "ลาว (Laos)", value: "Laos" },
        { label: "กัมพูชา (Cambodia)", value: "Cambodia" },
        { label: "จีน (China)", value: "China" },
        { label: "ญี่ปุ่น (Japan)", value: "Japan" },
        { label: "อื่นๆ (Other)", value: "Other" },
    ];
    const [watchlistReasons, setWatchlistReasons] = useState<('Fraud' | 'Compliance' | 'Legal')[]>([]);
    const [idFrontPhoto, setIdFrontPhoto] = useState<string | null>(null);
    const [idBackPhoto, setIdBackPhoto] = useState<string | null>(null);
    const [isProcessingFrontPhoto, setIsProcessingFrontPhoto] = useState(false);

    const [alertDialog, setAlertDialog] = useState<{
        isOpen: boolean;
        title: string;
        description: string;
        type: "error" | "warning";
        action?: () => void;
    }>({
        isOpen: false,
        title: "",
        description: "",
        type: "error"
    });
    const [mockLivePhoto, setMockLivePhoto] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    // --- DATE LOGIC ---
    const [useYearOnly, setUseYearOnly] = useState(false);
    const [isLifetime, setIsLifetime] = useState(false);
    const [dateDisplay, setDateDisplay] = useState("");
    // --- DATE DISPLAY STATES ---
    const [issueDateDisplay, setIssueDateDisplay] = useState("");
    const [expiryDateDisplay, setExpiryDateDisplay] = useState("");

    const formatToThaiBE = (dateString: string | undefined) => {
        if (!dateString) return "";
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return "";
            const thaiYear = date.getFullYear() + 543;
            return `${format(date, "dd/MM")}/${thaiYear}`;
        } catch {
            return "";
        }
    };

    useEffect(() => {
        if (formData.birthDate) {
            const date = new Date(formData.birthDate);
            if (!isNaN(date.getTime())) {
                const thaiYear = date.getFullYear() + 543;
                if (useYearOnly) {
                    setDateDisplay(`${thaiYear}`);
                } else {
                    setDateDisplay(`${format(date, "dd/MM")}/${thaiYear}`);
                }
            }
        } else {
            setDateDisplay("");
        }
    }, [formData.birthDate, useYearOnly]);

    useEffect(() => {
        setIssueDateDisplay(formatToThaiBE(formData.issueDate));
    }, [formData.issueDate]);

    useEffect(() => {
        setExpiryDateDisplay(formatToThaiBE(formData.expiryDate));
    }, [formData.expiryDate]);

    const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string, setDisplay: (val: string) => void) => {
        let val = e.target.value.replace(/\D/g, ''); // Keep only numbers

        if (field === 'birthDate' && useYearOnly) {
            if (val.length > 4) val = val.slice(0, 4);
            setDisplay(val);
            if (val.length === 4) {
                let y = parseInt(val);
                let realYearAD = y > 2400 ? y - 543 : y;
                handleFormChange(field, `${realYearAD}-01-01`);
            }
            return;
        }

        if (val.length > 8) val = val.slice(0, 8);

        // Ensure day (DD) is not over 31
        if (val.length >= 2) {
            const d = parseInt(val.slice(0, 2), 10);
            if (d > 31) val = "31" + val.slice(2);
        }

        // Ensure month (MM) is not over 12
        if (val.length >= 4) {
            const m = parseInt(val.slice(2, 4), 10);
            if (m > 12) val = val.slice(0, 2) + "12" + val.slice(4);
        }

        let formattedVal = val;
        if (val.length >= 3) formattedVal = val.slice(0, 2) + '/' + val.slice(2);
        if (val.length >= 5) formattedVal = formattedVal.slice(0, 5) + '/' + formattedVal.slice(5);

        setDisplay(formattedVal);

        if (val.length === 8) {
            const d = parseInt(val.slice(0, 2), 10);
            const m = parseInt(val.slice(2, 4), 10);
            let y = parseInt(val.slice(4, 8), 10);

            // Auto-convert A.D. to B.E. (if year < 2400, assume it's A.D. and add 543)
            if (y < 2400) {
                const convertedY = y + 543;
                y = convertedY;
                setDisplay(`${val.slice(0, 2)}/${val.slice(2, 4)}/${convertedY}`);
            }

            const realYearAD = y > 2400 ? y - 543 : y;
            const dateObj = new Date(realYearAD, m - 1, d);
            if (!isNaN(dateObj.getTime()) && dateObj.getDate() === d) {
                handleFormChange(field, format(dateObj, "yyyy-MM-dd"));
            }
        }
    };

    const handleDateBlur = (field: string, setDisplay: (val: string) => void) => {
        if (formData[field]) {
            setDisplay(formatToThaiBE(formData[field]));
        }
    };

    const toggleYearOnly = (checked: boolean) => {
        setUseYearOnly(checked);
        setDateDisplay("");
        handleFormChange('birthDate', ""); // Clear date when switching modes to avoid confusion
    };

    const toggleLifetime = (checked: boolean) => {
        setIsLifetime(checked);
        if (checked) {
            setExpiryDateDisplay("");
            handleFormChange('expiryDate', "");
        }
    };

    // --- CAMERA LOGIC ---
    useEffect(() => {
        if (stage === 'FACE_VERIFY') {
            startCamera("user");
        } else if (stage === 'TAKING_ID_FRONT' || stage === 'TAKING_ID_BACK') {
            startCamera("environment");
        } else {
            stopCamera();
        }
        return () => stopCamera();
    }, [stage]);

    // Auto-detection for Liveness Check
    useEffect(() => {
        let timer: any;
        if (stage === 'FACE_VERIFY' && isCameraActive) {
            timer = setTimeout(() => {
                handleFaceVerify();
            }, 3000); // Auto-detect after 3 seconds
        }
        return () => clearTimeout(timer);
    }, [stage, isCameraActive]);

    const startCamera = async (facingMode: "user" | "environment" = "user") => {
        try {
            const constraints = {
                video: {
                    facingMode: facingMode,
                    width: { ideal: facingMode === "environment" ? 1920 : 1280 },
                    height: { ideal: facingMode === "environment" ? 1080 : 720 }
                },
                audio: false
            };
            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current?.play();
                    setIsCameraActive(true);
                };
            }
            setCameraError(null);
        } catch (err) {
            console.error("Camera access error:", err);
            setCameraError("ไม่สามารถเข้าถึงกล้องได้ กรุณาตรวจสอบการอนุญาตใช้งานกล้อง");
            setIsCameraActive(false);
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setIsCameraActive(false);
    };

    const capturePhoto = () => {
        if (videoRef.current && isCameraActive) {
            const canvas = document.createElement("canvas");
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(videoRef.current, 0, 0);
                const photoData = canvas.toDataURL("image/jpeg", 0.9);
                return photoData;
            }
        }
        return null;
    };

    // --- SELECTION HANDLER ---
    const handleSelectMethod = (method: 'DIPCHIP' | 'MANUAL') => {
        setVerificationMethod(method);
        setFormData({ ...formData, verificationMethod: method });
        if (method === 'DIPCHIP') {
            // Auto-start Dipchip reading? Or wait for user to click "Start"?
            // Let's wait for user to click "Read Card" inside the next view
        }
    };

    const handleBackToSelection = () => {
        setVerificationMethod(null);
        setStage('INIT');
        setFormData({ ...formData, idNumber: "", firstName: "", middleName: "", lastName: "", birthDate: "", issueDate: "", expiryDate: "", nationality: "", houseNumber: "", floorNumber: "", unitNumber: "", village: "", moo: "", yaek: "", trohk: "", soi: "" }); // Reset basic info
    };


    // 1. Dip Chip -> Then Review Data
    const handleReadCard = async () => {
        setStage('READING_CARD');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock Data
        const mockData = {
            idNumber: "1-2345-67890-12-3",
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
            occupation: "พนักงานบริษัท",
            phoneNumber: "0812345678",
            email: "",
            issueDate: "2020-05-20",
            expiryDate: "2029-05-19",
            laserId: "ME1-2345678-90",
            nationality: "Thai",
        };

        const updatedData = { ...formData, ...mockData };
        setFormData(updatedData);
        setMockChipPhoto("https://api.dicebear.com/7.x/avataaars/svg?seed=Somchai&backgroundColor=e6e6e6");

        // Skip review for Dipchip, go straight to DOPA
        handleDOPAVerify(updatedData);
    };

    // 1.2 Manual/OCR Upload Handler
    const handleOCRUpload = (cardType: 'THAI_ID' | 'PINK_CARD') => {
        setFormData({ ...formData, cardType });
        setIdFrontPhoto(null);
        setIdBackPhoto(null);
        setStage('TAKING_ID_FRONT');
    };

    const handleCaptureID = async () => {
        const photo = capturePhoto();
        if (!photo) return;

        if (stage === 'TAKING_ID_FRONT') {
            setIsProcessingFrontPhoto(true);
            setIdFrontPhoto(photo);
            await new Promise(resolve => setTimeout(resolve, 1500));
            setIsProcessingFrontPhoto(false);
            setStage('TAKING_ID_BACK');
        } else if (stage === 'TAKING_ID_BACK') {
            setIdBackPhoto(photo);
            stopCamera();
            setStage('READING_CARD'); // Show OCR processing
            setMockChipPhoto(idFrontPhoto); // Use front photo as representative
            await new Promise(resolve => setTimeout(resolve, 2000));

            let mockData: any = {
                idNumber: formData.cardType === 'PINK_CARD' ? "0-1234-56789-01-2" : "3-3345-67890-12-3",
                firstName: formData.cardType === 'PINK_CARD' ? "ออง" : "สมหญิง",
                middleName: formData.cardType === 'PINK_CARD' ? "" : "มณี",
                lastName: formData.cardType === 'PINK_CARD' ? "มิน" : "ใจงาม",
                prefix: formData.cardType === 'PINK_CARD' ? "นาย" : "นางสาว",
                gender: formData.cardType === 'PINK_CARD' ? "ชาย" : "หญิง",
                birthDate: formData.cardType === 'PINK_CARD' ? "1998-08-08" : "1995-05-05",
                addressLine1: formData.cardType === 'PINK_CARD' ? "789 หมู่ 3" : "456 หมู่ 2",
                houseNumber: formData.cardType === 'PINK_CARD' ? "789" : "456",
                moo: formData.cardType === 'PINK_CARD' ? "3" : "2",
                street: "เจริญกรุง",
                subDistrict: "บางรัก",
                province: "กรุงเทพมหานคร",
                zipCode: "10500",
                fullAddress: formData.cardType === 'PINK_CARD' ? "789 หมู่ 3 บางรัก บางรัก กรุงเทพมหานคร 10500" : "456 หมู่ 2 บางรัก บางรัก กรุงเทพมหานคร 10500",
                issueDate: "2022-10-10",
                expiryDate: "2031-10-09",
                laserId: formData.cardType === 'PINK_CARD' ? "PNK-0000000-01" : "CH2-9876543-21",
                nationality: formData.cardType === 'PINK_CARD' ? "Myanmar" : "Thai",
            };

            setFormData({ ...formData, ...mockData });
            setStage('CARD_SUCCESS'); // Land on result container
        }
    };



    const handleDOPAVerify = async (dataOverride?: any) => {
        const dataToVerify = dataOverride || formData;

        // Validation: All inputs are mandatory
        const requiredFields = [
            { key: 'idNumber', label: 'เลขบัตรประจำตัวประชาชน' },
            ...(dataToVerify.cardType !== 'PINK_CARD' ? [{ key: 'laserId', label: 'หมายเลขหลังบัตร (Laser ID)' }] : []),
            { key: 'firstName', label: 'ชื่อ (Thai)' },
            { key: 'lastName', label: 'นามสกุล (Thai)' },
            { key: 'birthDate', label: 'วันเดือนปีเกิด' },
            ...(isLifetime ? [] : [{ key: 'expiryDate', label: 'วันที่บัตรหมดอายุ' }])
        ];

        const missingFields = requiredFields.filter(field => !dataToVerify[field.key]);

        if (missingFields.length > 0) {
            setAlertDialog({
                isOpen: true,
                title: "กรุณากรอกข้อมูลให้ครบถ้วน",
                description: `กรุณาระบุ: ${missingFields.map(f => f.label).join(', ')}`,
                type: "error"
            });
            return;
        }

        setStage('CHECKING_MEMBER'); // Spinner for DOPA Check
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 1. Check for Deceased status (Mock Trigger: ID ends with '999')
        const cleanID = (dataToVerify.idNumber || "").replace(/-/g, '');
        if (cleanID.endsWith('999')) {
            setAlertDialog({
                isOpen: true,
                title: "ตรวจสอบไม่ผ่าน",
                description: `ตรวจพบสถานะ: ผู้ถือบัตรประชาชนเสียชีวิต`,
                type: "error",
                action: () => {
                    setStage('INIT');
                    setVerificationMethod(null);
                }
            });
            return;
        }

        // 2. Check Expiry Date
        if (dataToVerify.expiryDate) {
            const expiry = new Date(dataToVerify.expiryDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const diffTime = expiry.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays < 0) {
                setAlertDialog({
                    isOpen: true,
                    title: "บัตรประจำตัวประชาชนหมดอายุ",
                    description: "บัตรประจำตัวประชาชนใบนี้หมดอายุแล้ว ไม่สามารถใช้ประกอบการสมัครได้",
                    type: "error",
                    action: () => {
                        setStage('INIT');
                        setVerificationMethod(null);
                    }
                });
                return;
            } else if (diffDays <= 30) {
                // Near expiry warning
                setAlertDialog({
                    isOpen: true,
                    title: "บัตรประจำตัวประชาชนใกล้หมดอายุ",
                    description: `บัตรประจำตัวประชาชนจะหมดอายุในอีก ${diffDays} วัน`,
                    type: "warning",
                    action: () => setStage('FACE_VERIFY')
                });
                // For near expiry, we often proceed after warning
                // If it's manual, stay on review; if it's dipchip, we might proceed or stay.
                // Let's stay on review if there's a warning.
                setStage('CARD_SUCCESS');
                return;
            }
        }

        // Mock: Pass DOPA
        setStage('FACE_VERIFY');
    };


    // 2. Face Verification (Only for New Customers)
    const handleFaceVerify = async () => {
        const photo = capturePhoto();
        if (!photo) {
            setAlertDialog({
                isOpen: true,
                title: "ไม่สามารถถ่ายภาพได้",
                description: "กรุณาตรวจสอบกล้องและลองใหม่อีกครั้ง",
                type: "error"
            });
            return;
        }

        setStage('READING_CARD'); // Show matching processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        setMockLivePhoto(photo);
        setStage('FACE_SUCCESS');
    };

    const handleCreateProfile = async () => {
        // This function is called after FACE_SUCCESS.
        // Now, we check member status to determine if existing or new.
        setStage('COMPLETE'); // Indicate final processing

        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate final check

        let isExisting = false;
        let profile = null;

        // Mock Logic: ID ends with '555' is Existing Customer
        const cleanID = (formData.idNumber || "").replace(/-/g, '');
        if (cleanID.endsWith('555')) {
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
        onNext(isExisting, profile);
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
                        <h3 className="font-bold text-lg mb-2 text-foreground group-hover:text-orange-600">ถ่ายรูปบัตร</h3>
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
                                    stage === 'FACE_VERIFY' ? '75%' :
                                        stage === 'CHECKING_MEMBER' ? '50%' :
                                            stage === 'CARD_SUCCESS' ? '25%' :
                                                stage === 'READING_CARD' ? '10%' : '0%'
                            }}
                        ></div>
                    </div>

                    <StepIndicator
                        num={1}
                        label="ข้อมูลบุคคล"
                        active={stage === 'INIT' || stage === 'READING_CARD' || stage === 'CARD_SUCCESS'}
                        completed={stage !== 'INIT' && stage !== 'READING_CARD' && stage !== 'CARD_SUCCESS'}
                    />

                    <StepIndicator
                        num={2}
                        label="ตรวจสอบสถานะ"
                        active={stage === 'CHECKING_MEMBER'}
                        completed={stage === 'FACE_VERIFY' || stage === 'FACE_SUCCESS' || stage === 'COMPLETE'}
                    />

                    <StepIndicator
                        num={3}
                        label="ยืนยันใบหน้า"
                        active={stage === 'FACE_VERIFY'}
                        completed={stage === 'FACE_SUCCESS' || stage === 'COMPLETE'}
                        skipped={isExistingMember && stage === 'COMPLETE'}
                    />
                </div>

                {/* Main Content Area */}
                {stage === 'INIT' && !verificationMethod ? (
                    renderSelectionScreen()
                ) : (
                    <div className="max-w-2xl mx-auto pt-4 transition-all duration-500 w-full">
                        <div className="space-y-8 pb-20">
                            {/* Header with Back Button (Only if not processing) */}
                            {(stage === 'INIT' || stage === 'CARD_SUCCESS' || stage === 'TAKING_ID_FRONT' || stage === 'TAKING_ID_BACK') && (
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        if (stage === 'TAKING_ID_BACK') {
                                            setStage('TAKING_ID_FRONT');
                                        } else {
                                            handleBackToSelection();
                                        }
                                    }}
                                    className="pl-0 text-foreground hover:text-foreground -mt-4 mb-2"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" /> {stage === 'TAKING_ID_BACK' ? 'กลับไปถ่ายหน้าบัตร' : 'เลือกวิธีอื่น'}
                                </Button>
                            )}

                            {/* STAGE 1: INPUT DATA (Method Specific) */}
                            {(stage === 'INIT' || stage === 'READING_CARD' || stage === 'TAKING_ID_FRONT' || stage === 'TAKING_ID_BACK') && (
                                <>
                                    {verificationMethod === 'MANUAL' && (stage === 'TAKING_ID_FRONT' || stage === 'TAKING_ID_BACK') && (
                                        <div className="space-y-6 animate-in zoom-in-95 duration-500">
                                            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-4">
                                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0">
                                                    <CreditCard className="w-6 h-6 text-orange-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-orange-800 text-sm">{stage === 'TAKING_ID_FRONT' ? 'ขั้นตอนที่ 1: ถ่ายรูปด้านหน้าบัตร' : 'ขั้นตอนที่ 2: ถ่ายรูปด้านหลังบัตร'}</h4>
                                                    <p className="text-orange-700/70 text-xs">วางบัตรให้ตรงกับกรอบที่กำหนด และกดปุ่มถ่ายภาพ</p>
                                                </div>
                                            </div>

                                            <Card className="border-border-subtle bg-slate-900 overflow-hidden relative aspect-[3/2] rounded-3xl shadow-2xl">
                                                <CardContent className="flex flex-col items-center justify-center p-0 h-full relative">
                                                    <video
                                                        ref={videoRef}
                                                        autoPlay
                                                        playsInline
                                                        muted
                                                        className={cn(
                                                            "absolute inset-0 w-full h-full object-cover",
                                                        )}
                                                    />

                                                    {isProcessingFrontPhoto && (
                                                        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm rounded-none">
                                                            <Loader2 className="w-12 h-12 text-white animate-spin mb-4" />
                                                            <p className="text-white font-bold text-lg">กำลังประมวลผลรูปภาพ...</p>
                                                        </div>
                                                    )}

                                                    {/* Card Overlay */}
                                                    {!cameraError && (
                                                        <div className="absolute inset-x-8 inset-y-12 border-2 border-dashed border-white/50 rounded-2xl z-30 pointer-events-none flex items-center justify-center">
                                                            <div className="bg-white/10 backdrop-blur-[2px] w-full h-full rounded-2xl border border-white/20"></div>
                                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                                                <div className="w-20 h-1 bg-white/30 rounded-full mb-1"></div>
                                                                <div className="w-12 h-1 bg-white/30 rounded-full mx-auto"></div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {isCameraActive && (
                                                        <div className="absolute bottom-6 left-0 right-0 flex justify-center z-40">
                                                            <Button
                                                                size="lg"
                                                                onClick={handleCaptureID}
                                                                className="bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-full px-10 h-14 text-lg shadow-xl"
                                                            >
                                                                <Camera className="w-6 h-6 mr-2" /> {stage === 'TAKING_ID_FRONT' ? 'ถ่ายภาพด้านหน้า' : 'ถ่ายภาพด้านหลัง'}
                                                            </Button>
                                                        </div>
                                                    )}

                                                    {!isCameraActive && !cameraError && (
                                                        <div className="z-40 text-center">
                                                            <Loader2 className="w-10 h-10 text-white animate-spin mx-auto mb-2" />
                                                            <p className="text-white text-sm">กำลังเปิดกล้อง...</p>
                                                        </div>
                                                    )}

                                                    {cameraError && (
                                                        <div className="z-40 text-center px-6">
                                                            <p className="text-white font-bold">{cameraError}</p>
                                                            <Button variant="secondary" onClick={() => startCamera("environment")} className="mt-4 font-bold px-8">ลองอีกครั้ง</Button>
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </div>
                                    )}

                                    {verificationMethod === 'DIPCHIP' && (stage === 'INIT' || stage === 'READING_CARD') && (
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
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    <Button variant="outline" className="w-full h-32 border-dashed border-2 flex flex-col gap-3 items-center justify-center rounded-2xl hover:border-chaiyo-blue hover:bg-blue-50/30 transition-all" onClick={() => handleOCRUpload('THAI_ID')}>
                                                                        <img src="/images/card_citizen.svg" alt="บัตรประชาชน" className="h-12 w-auto mb-1" />
                                                                        <span className="text-base font-bold text-gray-700">บัตรประชาชน</span>
                                                                    </Button>
                                                                    <Button variant="outline" className="w-full h-32 border-dashed border-2 flex flex-col gap-3 items-center justify-center rounded-2xl hover:border-pink-400 hover:bg-pink-50/30 transition-all" onClick={() => handleOCRUpload('PINK_CARD')}>
                                                                        <img src="/images/card_alien.svg" alt="บัตรต่างด้าวชมพู" className="h-12 w-auto mb-1" />
                                                                        <span className="text-base font-bold text-gray-700">บัตรต่างด้าวชมพู</span>
                                                                    </Button>
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

                            {/* STAGE 2: CHECKING STATUS (DOPA) */}
                            {stage === 'CHECKING_MEMBER' && (
                                <Card className="border-border-subtle overflow-hidden">
                                    <div className="h-2 w-full bg-gray-100 overflow-hidden">
                                        <div className="h-full bg-chaiyo-blue animate-progress origin-left"></div>
                                    </div>
                                    <CardContent className="flex flex-col items-center justify-center py-20">
                                        <div className="w-16 h-16 relative mb-6">
                                            <ShieldAlert className="w-16 h-16 text-chaiyo-blue animate-pulse" />
                                            <Loader2 className="w-20 h-20 text-chaiyo-blue/20 animate-spin absolute -top-2 -left-2" />
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground">กำลังตรวจสอบสถานะ DOPA...</h3>
                                        <p className="text-muted text-sm mt-2 text-center max-w-sm">กรุณารอสักครู่ ระบบกำลังเชื่อมต่อกับฐานข้อมูล กรมการปกครองเพื่อตรวจสอบสถานะบัตร</p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* STAGE 3: FACE VERIFY */}
                            {(stage === 'FACE_VERIFY') && (
                                <div className="space-y-6 animate-in zoom-in-95 duration-500">
                                    <div className="bg-chaiyo-blue/10 border border-chaiyo-blue/20 rounded-xl p-4 flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0">
                                            <Camera className="w-6 h-6 text-chaiyo-blue" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-chaiyo-blue text-sm">ตรวจสอบใบหน้า (Liveness Check)</h4>
                                            <p className="text-chaiyo-blue/70 text-xs">กรุณาวางใบหน้าให้อยู่ในกรอบ ระบบจะตรวจสอบอัตโนมัติ</p>
                                        </div>
                                    </div>

                                    <Card className="border-border-subtle bg-slate-900 overflow-hidden relative aspect-square md:aspect-video rounded-3xl shadow-2xl">
                                        <CardContent className="flex flex-col items-center justify-center p-0 h-full relative">
                                            {/* Camera Feed */}
                                            <video
                                                ref={videoRef}
                                                autoPlay
                                                playsInline
                                                muted
                                                className={cn(
                                                    "absolute inset-0 w-full h-full object-cover",
                                                    !isCameraActive && "hidden"
                                                )}
                                            />

                                            {/* Camera Overlay */}
                                            {!cameraError && (
                                                <>
                                                    <div className="absolute inset-0 border-[16px] border-slate-900 rounded-3xl z-20 pointer-events-none opacity-50"></div>
                                                    <div className="w-64 h-80 rounded-[100px] border-2 border-dashed border-white/50 z-30 relative flex items-center justify-center">
                                                        <div className="absolute -top-4 bg-chaiyo-blue text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest">Face Guide</div>
                                                    </div>
                                                </>
                                            )}

                                            {cameraError ? (
                                                <div className="z-40 text-center px-6">
                                                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                                                    <p className="text-white font-bold">{cameraError}</p>
                                                    <Button variant="secondary" onClick={() => startCamera("user")} className="mt-4 font-bold px-8">ลองอีกครั้ง</Button>
                                                </div>
                                            ) : !isCameraActive && (
                                                <div className="z-40 text-center">
                                                    <Loader2 className="w-10 h-10 text-white animate-spin mx-auto mb-2" />
                                                    <p className="text-white text-sm">กำลังเปิดกล้อง...</p>
                                                </div>
                                            )}

                                            {/* Auto Detect Indicator */}
                                            {isCameraActive && (
                                                <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-2 z-40 animate-pulse">
                                                    <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    <p className="text-white text-sm font-bold drop-shadow-md">กำลังตรวจสอบใบหน้า...</p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {/* STAGE 4: FACE SUCCESS / MATCH */}
                            {stage === 'FACE_SUCCESS' && (
                                <div className="space-y-6 animate-in fade-in duration-700">
                                    <Card className="border-2 border-emerald-200 bg-emerald-50/50 shadow-xl overflow-hidden rounded-3xl">
                                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                                                <CheckCircle className="w-14 h-14 text-emerald-600" />
                                            </div>
                                            <h3 className="text-3xl font-black text-emerald-900 mb-2">ยืนยันตัวตนสำเร็จ</h3>
                                            <p className="text-emerald-700 text-lg max-w-md mx-auto">การตรวจสอบใบหน้าและ DOPA ถูกต้องตรงกัน ระบบได้ยืนยันสถานะลูกค้าเรียบร้อยแล้ว</p>



                                            <Button size="lg" className="mt-12 w-full max-w-sm bg-emerald-600 hover:bg-emerald-700 text-white h-16 text-xl font-bold rounded-2xl shadow-xl shadow-emerald-200" onClick={handleCreateProfile}>
                                                ดำเนินการต่อ <ArrowRight className="ml-2 w-6 h-6" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {/* STAGE 5: FINAL PROCESSING (COMPLETE) */}
                            {stage === 'COMPLETE' && (
                                <Card className="border-border-subtle overflow-hidden">
                                    <CardContent className="flex flex-col items-center justify-center py-20">
                                        <Loader2 className="w-16 h-16 text-chaiyo-blue animate-spin mb-6" />
                                        <h3 className="text-xl font-bold text-foreground">กำลังนำคุณเข้าสู่ขั้นตอนถัดไป...</h3>
                                        <p className="text-muted text-sm mt-2">เตรียมเอกสารและข้อมูลพื้นฐานของลูกค้า</p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* RESULT CONTAINER (EXTRACTED DATA / REVIEW) */}
                            {(stage === 'CARD_SUCCESS') && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    {/* Success Alert */}
                                    <Alert variant="success" className="rounded-xl border-emerald-200 shadow-none">
                                        <CheckCircle className="h-4 w-4" />
                                        <AlertTitle className="font-bold">อ่านข้อมูลสำเร็จ</AlertTitle>
                                        <AlertDescription>
                                            {verificationMethod === 'DIPCHIP'
                                                ? "ดึงข้อมูลจากชิปการ์ดเรียบร้อยแล้ว ไม่สามารถแก้ไขข้อมูลได้"
                                                : "ดึงข้อมูลจาก OCR เรียบร้อยแล้ว กรุณาตรวจสอบและแก้ไขหากจำเป็น"}
                                        </AlertDescription>
                                    </Alert>

                                    <Card className="border-border-subtle overflow-hidden shadow-none">
                                        <CardHeader className="bg-gray-50/50 border-b pb-4">
                                            <CardTitle className="text-sm font-bold flex items-center gap-2 text-gray-700">
                                                <FileText className="w-4 h-4 text-chaiyo-blue" />
                                                ข้อมูลที่ดึงได้จากบัตร
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6 space-y-6">
                                            {/* ID & Laser Row */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
                                                        เลขบัตรประจำตัวประชาชน <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Input
                                                        value={formData.idNumber || ""}
                                                        onChange={(e) => handleFormChange('idNumber', e.target.value)}
                                                        readOnly={verificationMethod === 'DIPCHIP'}
                                                        className={cn(
                                                            "rounded-xl",
                                                            verificationMethod === 'DIPCHIP' ? "bg-gray-50 border-none shadow-none px-4" : "bg-white border focus:border-chaiyo-blue"
                                                        )}
                                                    />
                                                </div>
                                                {formData.cardType !== 'PINK_CARD' && (
                                                    <div className="space-y-2">
                                                        <Label className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
                                                            หมายเลขหลังบัตร (Laser ID) <span className="text-red-500">*</span>
                                                        </Label>
                                                        <Input
                                                            value={formData.laserId || ""}
                                                            onChange={(e) => handleFormChange('laserId', e.target.value)}
                                                            readOnly={verificationMethod === 'DIPCHIP'}
                                                            className={cn(
                                                                "rounded-xl",
                                                                verificationMethod === 'DIPCHIP' ? "bg-gray-50 border-none shadow-none px-4" : "bg-white border focus:border-chaiyo-blue"
                                                            )}
                                                            placeholder="JT0-0000000-00"
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Name Row */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-xs text-muted-foreground font-bold">
                                                        ชื่อ <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Input
                                                        value={formData.firstName || ""}
                                                        onChange={(e) => handleFormChange('firstName', e.target.value)}
                                                        readOnly={verificationMethod === 'DIPCHIP'}
                                                        className={cn(
                                                            "rounded-xl",
                                                            verificationMethod === 'DIPCHIP' ? "bg-gray-50 border-none px-4" : "bg-white"
                                                        )}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs text-muted-foreground font-bold">ชื่อกลาง</Label>
                                                    <Input
                                                        value={formData.middleName || ""}
                                                        onChange={(e) => handleFormChange('middleName', e.target.value)}
                                                        readOnly={verificationMethod === 'DIPCHIP'}
                                                        className={cn(
                                                            "rounded-xl",
                                                            verificationMethod === 'DIPCHIP' ? "bg-gray-50 border-none px-4" : "bg-white"
                                                        )}
                                                        placeholder="-"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs text-muted-foreground font-bold">
                                                        นามสกุล   <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Input
                                                        value={formData.lastName || ""}
                                                        onChange={(e) => handleFormChange('lastName', e.target.value)}
                                                        readOnly={verificationMethod === 'DIPCHIP'}
                                                        className={cn(
                                                            "rounded-xl",
                                                            verificationMethod === 'DIPCHIP' ? "bg-gray-50 border-none px-4" : "bg-white"
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            {/* Birth Date and Expiry Date Row */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <div className="flex items-end justify-between min-h-[20px]">
                                                        <Label className="text-xs text-muted-foreground font-bold">
                                                            วันเดือนปีเกิด <span className="text-red-500">*</span>
                                                        </Label>
                                                        {verificationMethod !== 'DIPCHIP' && (
                                                            <div className="flex items-center gap-2">
                                                                <Checkbox
                                                                    id="yearOnly"
                                                                    checked={useYearOnly}
                                                                    onCheckedChange={(checked) => toggleYearOnly(!!checked)}
                                                                />
                                                                <Label htmlFor="yearOnly" className="text-[10px] font-bold text-muted-foreground cursor-pointer leading-none">ทราบเฉพาะปีเกิด</Label>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <Input
                                                        value={dateDisplay || ""}
                                                        onChange={(e) => handleDateInputChange(e, 'birthDate', setDateDisplay)}
                                                        readOnly={verificationMethod === 'DIPCHIP'}
                                                        className={cn(
                                                            "rounded-xl",
                                                            verificationMethod === 'DIPCHIP' ? "bg-gray-50 border-none px-4" : "bg-white border focus:border-chaiyo-blue"
                                                        )}
                                                        placeholder={useYearOnly ? "YYYY" : "DD/MM/YYYY"}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex items-end justify-between min-h-[20px]">
                                                        <Label className="text-xs text-muted-foreground font-bold">
                                                            วันที่บัตรหมดอายุ {!isLifetime && <span className="text-red-500">*</span>}
                                                        </Label>
                                                        {verificationMethod !== 'DIPCHIP' && formData.cardType !== 'PINK_CARD' && (
                                                            <div className="flex items-center gap-2">
                                                                <Checkbox
                                                                    id="isLifetime"
                                                                    checked={isLifetime}
                                                                    onCheckedChange={(checked) => toggleLifetime(!!checked)}
                                                                />
                                                                <Label htmlFor="isLifetime" className="text-[10px] font-bold text-muted-foreground cursor-pointer leading-none">ตลอดชีพ</Label>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <Input
                                                        value={isLifetime ? "-" : (expiryDateDisplay || "")}
                                                        onChange={(e) => handleDateInputChange(e, 'expiryDate', setExpiryDateDisplay)}
                                                        className={cn("rounded-xl border", (verificationMethod === 'DIPCHIP' || isLifetime) ? "bg-gray-50 border-gray-200 shadow-none px-4" : "bg-white focus:border-chaiyo-blue")}
                                                        readOnly={verificationMethod === 'DIPCHIP' || isLifetime}
                                                        placeholder={isLifetime ? "ตลอดชีพ" : "DD/MM/YYYY"}
                                                    />
                                                </div>
                                            </div>

                                            <div className="pt-6 border-t">
                                                <Button
                                                    size="lg"
                                                    className="w-full bg-chaiyo-blue hover:bg-chaiyo-blue/90 text-white h-16 text-xl font-bold rounded-2xl"
                                                    onClick={() => handleDOPAVerify()}
                                                    disabled={!formData.idNumber || formData.idNumber.replace(/-/g, '').length < 13 || (formData.cardType !== 'PINK_CARD' && !formData.laserId) || !formData.firstName || !formData.lastName || !formData.birthDate || (!isLifetime && !formData.expiryDate)}
                                                >
                                                    <ShieldAlert className="w-6 h-6 mr-2" /> ตรวจสอบ
                                                </Button>
                                                <p className="text-[10px] text-muted text-center mt-3">ผลการตรวจสอบจะเชื่อมตรงกับฐานข้อมูล กรมการปกครอง (DOPA)</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                            {/* FINAL ACTIONS */}
                            {stage === 'COMPLETE' && (
                                <div className="pt-4 flex justify-center">
                                    <Button size="lg" className="w-full max-w-md bg-chaiyo-blue hover:bg-chaiyo-blue/90 text-white h-14 text-lg font-bold shadow-lg" onClick={handleCreateProfile}>
                                        {isExistingMember ? "ดำเนินการต่อ" : "สร้างข้อมูลลูกค้าและเริ่มงาน"}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <AlertDialog open={alertDialog.isOpen} onOpenChange={(open) => setAlertDialog({ ...alertDialog, isOpen: open })}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                                alertDialog.type === 'error' ? "bg-red-100" : "bg-amber-100"
                            )}>
                                {alertDialog.type === 'error' ? (
                                    <XCircle className="w-5 h-5 text-red-600" />
                                ) : (
                                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                                )}
                            </div>
                            <AlertDialogTitle className="text-lg">{alertDialog.title}</AlertDialogTitle>
                        </div>
                        <AlertDialogDescription className="text-base mt-2">
                            {alertDialog.description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction
                            onClick={() => {
                                if (alertDialog.action) {
                                    alertDialog.action();
                                }
                            }}
                            className={cn(
                                "text-white",
                                alertDialog.type === 'error' ? "bg-red-600 hover:bg-red-700" : "bg-chaiyo-blue hover:bg-chaiyo-blue/90"
                            )}
                        >
                            {alertDialog.type === 'error' ? "รับทราบ" : alertDialog.type === 'warning' ? "ดำเนินการต่อ" : "ตรวจสอบอีกครั้ง"}
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
