"use client";

import { useState, useEffect, useRef } from "react";
import { CheckCircle, Loader2, CreditCard, User, Camera, ArrowRight, UserCheck, UserPlus, FileText, MapPin, Briefcase, Calendar, ShieldAlert, AlertTriangle, XCircle, ArrowLeft, AlertCircle, Info, Save, Check, Printer, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { DatePickerBE } from "@/components/ui/DatePickerBE";

import { format } from "date-fns";
import { Textarea } from "@/components/ui/Textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/Checkbox";
import { Combobox } from "@/components/ui/combobox";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface IdentityCheckStepProps {
    formData: any;
    setFormData: (data: any) => void;
    onNext: (isExisting: boolean, profile?: any) => void;
}

type KYCStage = 'INIT' | 'READING_CARD' | 'CHECKING_MEMBER' | 'CARD_SUCCESS' | 'TAKING_ID_FRONT' | 'TAKING_ID_BACK' | 'FACE_VERIFY' | 'FACE_SUCCESS' | 'FACE_FAILED' | 'COMPLETE';

export function IdentityCheckStep({ formData, setFormData, onNext }: IdentityCheckStepProps) {
    const [stage, setStage] = useState<KYCStage>('INIT');
    const [verificationMethod, setVerificationMethod] = useState<'DIPCHIP' | 'MANUAL' | null>('DIPCHIP');
    const [dipchipError, setDipchipError] = useState(false);
    const [isSimulatingError, setIsSimulatingError] = useState(false);
    const [isMockCamera, setIsMockCamera] = useState(true); // Toggle this for real camera


    // Liveness Failure Simulation
    const [livenessAttempts, setLivenessAttempts] = useState(0);
    const [simulateLivenessFail, setSimulateLivenessFail] = useState(false);

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
        isOpen: boolean,
        title: string,
        description: string,
        type: 'error' | 'warning' | 'success',
        action?: () => void,
        cancelAction?: () => void,
        cancelText?: string
    }>({
        isOpen: false,
        title: "",
        description: "",
        type: "error"
    });
    const [showNotContinueDialog, setShowNotContinueDialog] = useState(false);
    const [notContinuePhone, setNotContinuePhone] = useState("");
    const [notContinueLineId, setNotContinueLineId] = useState("");
    const [mockLivePhoto, setMockLivePhoto] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    // --- DATE LOGIC ---
    const [isLifetime, setIsLifetime] = useState(false);

    const toggleLifetime = (checked: boolean) => {
        setIsLifetime(checked);
        if (checked) {
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
        if (isMockCamera) {
            setIsCameraActive(true);
            setCameraError(null);
            return;
        }

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
        if (isMockCamera) {
            // Return a black placeholder image (1x1 transparent png or black gif)
            return "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";
        }

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
        setDipchipError(false);
        setStage('READING_CARD');
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (isSimulatingError) {
            setDipchipError(true);
            setStage('INIT');
            return;
        }

        // Mock Data
        const mockData = {
            idNumber: "1-2345-67890-12-3",
            firstName: "ดีใจ",
            middleName: "",
            lastName: "ไชโย",
            firstNameEn: "DEEJAI",
            middleNameEn: "",
            lastNameEn: "CHAIYO",
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
            nationality: "ไทย",
            verificationMethod: 'DIPCHIP',
        };

        const updatedData = { ...formData, ...mockData };
        setFormData(updatedData);
        setMockChipPhoto("https://api.dicebear.com/7.x/avataaars/svg?seed=Deejai&backgroundColor=e6e6e6");

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
                firstName: formData.cardType === 'PINK_CARD' ? "ออง" : "ดีใจ",
                middleName: formData.cardType === 'PINK_CARD' ? "" : "",
                lastName: formData.cardType === 'PINK_CARD' ? "มิน" : "ไชโย",
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
                laserId: formData.cardType === 'PINK_CARD' ? "PNK-0000000-01" : "JT2-9876543-21",
                nationality: formData.cardType === 'PINK_CARD' ? "พม่า" : "ไทย",
                verificationMethod: 'MANUAL',
            };

            setFormData({ ...formData, ...mockData });
            setStage('CARD_SUCCESS'); // Land on result container
        }
    };



    const handleDOPAVerify = async (dataOverride?: any) => {
        const dataToVerify = dataOverride || formData;

        // Validation: All inputs are mandatory
        const requiredFields = [
            { key: 'idNumber', label: formData.cardType === 'PINK_CARD' ? 'เลขประจำตัว' : 'เลขบัตรประจำตัวประชาชน' },
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

        // Skip DOPA check for Alien/Pink Cards
        if (dataToVerify.cardType === 'PINK_CARD') {
            setStage('FACE_VERIFY');
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

        // Use either the master toggle or the section-specific toggle
        const shouldFail = simulateLivenessFail || isSimulatingError;

        setStage('READING_CARD'); // Show matching processing
        const delay = shouldFail ? 4000 : 2000;
        await new Promise(resolve => setTimeout(resolve, delay));

        if (shouldFail) {
            const nextAttempt = livenessAttempts + 1;
            setLivenessAttempts(nextAttempt);

            if (nextAttempt < 3) {
                setAlertDialog({
                    isOpen: true,
                    title: "ยืนยันตัวตนไม่สำเร็จ",
                    description: `ไม่สามารถยืนยันใบหน้าได้ (ครั้งที่ ${nextAttempt}/3) กรุณาลองใหม่อีกครั้ง`,
                    type: "warning",
                    action: () => setStage('FACE_VERIFY'),
                    cancelAction: () => {
                        setStage('INIT');
                        setVerificationMethod('DIPCHIP');
                        setLivenessAttempts(0);
                    },
                    cancelText: "ยกเลิก"
                });
                return;
            } else {
                setStage('FACE_FAILED');
                return;
            }
        }

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
                fullName: "คุณดีใจ ไชโย",
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Option 1: Dipchip (Main Method) */}
                <Card
                    className="md:col-span-2 relative border-2 border-dashed border-gray-200 hover:border-chaiyo-blue hover:bg-blue-50/30 cursor-pointer transition-all group shadow-sm hover:shadow-md"
                    onClick={() => handleSelectMethod('DIPCHIP')}
                >
                    <div className="absolute top-4 right-4">
                        <Badge className="bg-chaiyo-blue hover:bg-chaiyo-blue text-white px-3 py-1">แนะนำ</Badge>
                    </div>
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center h-full">
                        <div className="w-32 h-24 shadow-lg border border-gray-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform p-4">
                            <img src="/images/card_citizen.svg" alt="Dipchip" className="w-full h-full object-contain" />
                        </div>
                        <h3 className="font-bold text-2xl mb-3 text-foreground group-hover:text-chaiyo-blue">บัตรประชาชน (Dipchip)</h3>
                        <p className="text-base text-muted max-w-sm">สำหรับลูกค้าที่มีบัตรประชาชน และสามารถอ่านข้อมูลได้รวดเร็วและแม่นยำที่สุด</p>
                    </CardContent>
                </Card>

                {/* Option 2: Manual/OCR (Secondary Method) */}
                <Card
                    className="border-2 border-dashed border-gray-200 hover:border-orange-400 hover:bg-orange-50/30 cursor-pointer transition-all group opacity-90 hover:opacity-100"
                    onClick={() => handleSelectMethod('MANUAL')}
                >
                    <CardContent className="flex flex-col items-center justify-center py-10 text-center h-full">
                        <div className="h-20 flex items-center justify-center mb-4 relative w-32 group-hover:scale-110 transition-transform mx-auto">
                            <div className="absolute left-2 top-2 w-16 h-11 bg-white rounded-lg shadow-sm border border-gray-100 p-1 rotate-[-12deg] overflow-hidden flex items-center justify-center">
                                <img src="/images/card_alien.svg" alt="Card Alien" className="w-full h-full object-contain opacity-70" />
                            </div>
                            <div className="absolute right-2 bottom-2 w-16 h-11 bg-white rounded-lg shadow-md border border-gray-100 p-1 rotate-[8deg] z-10 overflow-hidden flex items-center justify-center">
                                <img src="/images/card_citizen.svg" alt="Card Citizen" className="w-full h-full object-contain" />
                            </div>
                        </div>
                        <h3 className="font-bold text-lg mb-2 text-foreground group-hover:text-orange-600">ถ่ายรูปบัตร</h3>
                        <p className="text-sm text-muted">สำหรับกรณีอ่านบัตรประชาชนไม่สำเร็จ หรือ<br />บัตรต่างด้าว (ชมพู/ขาว)</p>
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
                <div className="max-w-2xl mx-auto pt-4 transition-all duration-500 w-full">
                    <div className="space-y-8 pb-20">


                        {/* Combined Identity Verification Methods */}
                        {(stage === 'INIT' || stage === 'READING_CARD') && (
                            <div className="space-y-8 relative">
                                {/* Prototype simulation toggle */}
                                {stage === 'INIT' && (
                                    <div className="absolute -top-12 right-0 flex items-center gap-2 bg-gray-100/50 px-3 py-1.5 rounded-full border border-gray-200/50 scale-90 origin-right hover:bg-gray-100 transition-colors">
                                        <div className="relative inline-flex h-4 w-8 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                            style={{ backgroundColor: isSimulatingError ? '#10069F' : '#e5e7eb' }}
                                            onClick={() => setIsSimulatingError(!isSimulatingError)}
                                        >
                                            <span className={cn("pointer-events-none block h-3 w-3 rounded-full bg-white shadow-lg ring-0 transition-transform", isSimulatingError ? "translate-x-4" : "translate-x-1")} />
                                        </div>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">จำลองข้อผิดพลาด</span>
                                    </div>
                                )}

                                {/* Primary Option: Dipchip */}
                                {formData.customerGroup !== 'ethnic' && (
                                    <Card className={cn(
                                        "border-2 transition-all duration-300 shadow-none overflow-hidden",
                                        dipchipError
                                            ? ""
                                            : "border-chaiyo-blue/10 bg-blue-50/20 hover:bg-blue-50/40 cursor-pointer"
                                    )} onClick={!dipchipError ? handleReadCard : undefined}>
                                        <CardContent className="flex flex-col items-center justify-center py-10 text-center relative px-8">
                                            {stage === 'READING_CARD' ? (
                                                <>
                                                    <Loader2 className="w-16 h-16 text-chaiyo-blue animate-spin mb-4" />
                                                    <h3 className="text-xl font-bold text-chaiyo-blue">กำลังอ่านข้อมูล...</h3>
                                                </>
                                            ) : dipchipError ? (
                                                <div className="animate-in fade-in zoom-in-95 duration-500 w-full flex flex-col items-center">
                                                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                                                        <XCircle className="w-10 h-10 text-red-600" />
                                                    </div>
                                                    <h3 className="text-xl font-bold">ไม่สามารถอ่านข้อมูลจากชิปได้</h3>
                                                    <p className="text-sm mt-2 mb-8 max-w-sm leading-relaxed">
                                                        พบข้อผิดพลาดขณะอ่านข้อมูลจากบัตรประชาชน <br />
                                                        กรุณาตรวจสอบการเสียบบัตรและลองอีกครั้ง หรือใช้วิธีถ่ายรูปแทน
                                                    </p>
                                                    <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md justify-center">
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => {
                                                                setVerificationMethod('MANUAL');
                                                                handleOCRUpload('THAI_ID');
                                                            }}
                                                            className="font-bold h-12 px-8 rounded-xl"
                                                        >
                                                            ถ่ายรูปบัตรประชาชน
                                                        </Button>
                                                        <Button
                                                            onClick={handleReadCard}
                                                            className="text-white font-bold h-12 px-8 rounded-xl "
                                                        >
                                                            ลองอีกครั้ง
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="w-32 h-24 shadow-lg border border-gray-100 rounded-xl flex items-center justify-center mb-6 p-4 bg-white">
                                                        <img src="/images/card_citizen.svg" alt="Dipchip" className="w-full h-full object-contain" />
                                                    </div>
                                                    <h3 className="text-xl font-bold text-foreground">เสียบบัตรประชาชน (Dipchip)</h3>
                                                    <p className="text-muted text-sm mt-2 mb-6 max-w-sm">ดึงข้อมูลจากชิปการ์ดเพื่อความรวดเร็วและแม่นยำสูงสุด</p>
                                                    <Button className="pointer-events-none bg-chaiyo-blue px-10 h-10 rounded-xl">อ่านข้อมูลบัตร</Button>
                                                </>
                                            )}
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Secondary Options: OCR/Manual */}
                                {stage === 'INIT' && !dipchipError && (
                                    <div className="space-y-4">
                                        {formData.customerGroup !== 'ethnic' && (
                                            <div className="flex items-center gap-4">
                                                <div className="h-[1px] flex-1 bg-gray-200"></div>
                                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-2">หรือใช้วิธีอื่น</span>
                                                <div className="h-[1px] flex-1 bg-gray-200"></div>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Thai ID Button: Shown for Thai and B2B groups */}
                                            {formData.customerGroup !== 'ethnic' && (
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "h-28 border-border-subtle hover:border-chaiyo-blue hover:bg-blue-50/30 flex flex-col items-center justify-center gap-2 rounded-2xl transition-all group",
                                                        (formData.customerGroup === 'thai' || formData.customerGroup === 'b2b_payroll') ? "md:col-span-2" : ""
                                                    )}
                                                    onClick={() => {
                                                        setVerificationMethod('MANUAL');
                                                        handleOCRUpload('THAI_ID');
                                                    }}
                                                >
                                                    <div className="w-12 h-10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                        <img src="/images/card_citizen.svg" alt="บัตรประชาชน" className="w-full h-full object-contain" />
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-700">ถ่ายรูปบัตรประชาชน</span>
                                                </Button>
                                            )}

                                            {/* Alien ID Button: Shown ONLY for Ethnic group */}
                                            {formData.customerGroup === 'ethnic' && (
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "h-28 border-border-subtle hover:border-pink-400 hover:bg-pink-50/30 flex flex-col items-center justify-center gap-2 rounded-2xl transition-all group",
                                                        "md:col-span-2 py-8 h-40"
                                                    )}
                                                    onClick={() => {
                                                        setVerificationMethod('MANUAL');
                                                        handleOCRUpload('PINK_CARD');
                                                    }}
                                                >
                                                    <div className="w-12 h-10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                        <img src="/images/card_alien.svg" alt="บัตรต่างด้าวชมพู" className="w-full h-full object-contain" />
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-700">ถ่ายรูปบัตรชมพู / อื่นๆ</span>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* OCR Camera View */}
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
                                    <Button variant="ghost" onClick={handleBackToSelection} className="text-orange-600 hover:text-orange-700 hover:bg-orange-100">ยกเลิก</Button>
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
                                                <div className="bg-white/5 backdrop-blur-[1px] w-full h-full rounded-2xl border border-white/20 relative overflow-hidden">
                                                    {/* Guidelines for Front Card */}
                                                    {stage === 'TAKING_ID_FRONT' && (
                                                        <>
                                                            {/* User Photo Placeholder */}
                                                            <div className="absolute right-6 bottom-6 w-[28%] aspect-[3/4] border border-white/30 rounded-lg bg-white/5 flex items-center justify-center">
                                                                <User className="w-8 h-8 text-white/20" />
                                                            </div>

                                                            {/* Chip Placeholder (for Thai ID) */}
                                                            {formData.cardType === 'THAI_ID' && (
                                                                <div className="absolute left-6 top-10 w-12 h-10 border border-white/20 rounded-md bg-white/5 flex items-center justify-center">
                                                                    <div className="grid grid-cols-2 gap-0.5 w-6">
                                                                        <div className="h-1 bg-white/20 rounded-full"></div>
                                                                        <div className="h-1 bg-white/20 rounded-full"></div>
                                                                        <div className="h-1 bg-white/20 rounded-full"></div>
                                                                        <div className="h-1 bg-white/20 rounded-full"></div>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Text Line Guidelines */}
                                                            <div className="absolute left-6 top-[35%] w-1/2 space-y-3">
                                                                <div className="h-2 w-full bg-white/10 rounded-full"></div>
                                                                <div className="h-2 w-3/4 bg-white/10 rounded-full"></div>
                                                                <div className="h-2 w-4/5 bg-white/10 rounded-full"></div>
                                                            </div>

                                                            <div className="absolute left-1/2 top-4 -translate-x-1/2 bg-white/20 text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest whitespace-nowrap">
                                                                {formData.cardType === 'THAI_ID' ? 'ด้านหน้าบัตรประชาชน' : 'ด้านหน้าบัตรต่างด้าว'}
                                                            </div>
                                                        </>
                                                    )}

                                                    {/* Guidelines for Back Card */}
                                                    {stage === 'TAKING_ID_BACK' && (
                                                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                                                            <div className="w-1/2 h-10 border border-white/30 rounded-xl bg-white/10 flex items-center justify-center">
                                                                <div className="w-2/3 h-2 bg-white/20 rounded-full"></div>
                                                            </div>
                                                            <div className="bg-white/20 text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                                                                ด้านหลังบัตร
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {isCameraActive && (
                                            <div className="absolute bottom-6 left-0 right-0 flex justify-center z-40">
                                                <Button
                                                    size="default"
                                                    onClick={handleCaptureID}
                                                    className="text-white font-bold px-10 h-12 text-lg shadow-xl"
                                                >
                                                    <Camera className="w-6 h-6 mr-2" /> {stage === 'TAKING_ID_FRONT' ? 'ถ่ายภาพด้านหน้า' : 'ถ่ายภาพด้านหลัง'}
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
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
                                <div className="bg-chaiyo-blue/10 border border-chaiyo-blue/20 rounded-xl p-4 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0">
                                            <Camera className="w-6 h-6 text-chaiyo-blue" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-chaiyo-blue text-sm">ตรวจสอบใบหน้า (Liveness Check)</h4>
                                            <p className="text-chaiyo-blue/70 text-xs">กรุณาวางใบหน้าให้อยู่ในกรอบ ระบบจะตรวจสอบอัตโนมัติ</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {/* Simulation Toggle */}
                                        <div className="flex items-center gap-2 bg-white/50 px-2.5 py-1 rounded-full border border-chaiyo-blue/10 scale-90 origin-right">
                                            <div className="relative inline-flex h-4 w-8 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none"
                                                style={{ backgroundColor: simulateLivenessFail ? '#10069F' : '#e5e7eb' }}
                                                onClick={() => setSimulateLivenessFail(!simulateLivenessFail)}
                                            >
                                                <span className={cn("pointer-events-none block h-3 w-3 rounded-full bg-white shadow-lg ring-0 transition-transform", simulateLivenessFail ? "translate-x-4" : "translate-x-1")} />
                                            </div>
                                            <span className="text-[10px] font-bold text-chaiyo-blue uppercase tracking-wider">จำลองข้อผิดพลาด</span>
                                        </div>

                                        <Button
                                            variant="ghost"
                                            onClick={() => setShowNotContinueDialog(true)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 font-bold"
                                        >
                                            <XCircle className="w-5 h-5 mr-1" />
                                            ออกจากการทำรายการ
                                        </Button>
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
                                <Card className="overflow-hidden rounded-3xl">
                                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                                            <CheckCircle className="w-14 h-14 text-emerald-600" />
                                        </div>
                                        <h3 className="text-3xl font-black  mb-2">ยืนยันตัวตนสำเร็จ</h3>
                                        <p className=" text-lg max-w-md mx-auto">การตรวจสอบใบหน้าและ DOPA ถูกต้องตรงกัน ระบบได้ยืนยันสถานะลูกค้าเรียบร้อยแล้ว</p>



                                        <div className="flex flex-col items-center gap-4 w-full max-w-sm mt-12">
                                            <Button size="default" className="w-full bg-chaiyo-blue hover:bg-chaiyo-blue/90 text-white h-12 font-bold shadow-xl shadow-blue-100" onClick={handleCreateProfile}>
                                                ดำเนินการต่อ <ArrowRight className="ml-2 w-6 h-6" />
                                            </Button>

                                            <Button
                                                variant="outline"
                                                className="w-full h-12 text-chaiyo-blue font-bold hover:bg-blue-50"
                                                onClick={() => setShowNotContinueDialog(true)}
                                            >
                                                ไว้ภายหลัง
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                        {/* STAGE: FACE FAILED (FINAL FAILURE) */}
                        {stage === 'FACE_FAILED' && (
                            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                                <Card className="border-1 overflow-hidden rounded-3xl">
                                    <CardContent className="flex flex-col items-center py-12 px-8 text-center">
                                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                                            <XCircle className="w-12 h-12 text-red-600" />
                                        </div>
                                        <h3 className="text-2xl font-black mb-2">การยืนยันตัวตนไม่สำเร็จ</h3>
                                        <p className="text-base max-w-sm mb-10">ตรวจสอบใบหน้าไม่ผ่านครบ 3 ครั้งตามที่กฎกำหนด <br /> ไม่สามารถดำเนินการในขั้นตอนนี้ได้ต่อ</p>

                                        <div className="w-full max-w-md bg-white border rounded-2xl p-6 text-left space-y-4 mb-10">
                                            <div className="space-y-1">
                                                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">ชื่อ-นามสกุล ลูกค้า</Label>
                                                <p className="text-lg font-bold text-gray-900">{formData.firstName} {formData.lastName}</p>
                                            </div>

                                            <div className="grid gap-4 pt-2 border-t border-gray-50">
                                                <div className="space-y-2">
                                                    <Label className="text-muted tracking-tight">เบอร์ติดต่อ</Label>
                                                    <div className="relative">
                                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        <Input
                                                            placeholder="0xx-xxx-xxxx"
                                                            className="rounded-xl h-11 border-gray-200 focus:border-chaiyo-blue pl-9"
                                                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                                            defaultValue={formData.phoneNumber}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-muted tracking-tight">LINE ID</Label>
                                                    <div className="relative">
                                                        <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        <Input
                                                            placeholder="@lineid"
                                                            className="rounded-xl h-11 border-gray-200 focus:border-chaiyo-blue pl-9"
                                                            onChange={(e) => setFormData({ ...formData, lineId: e.target.value })}
                                                            defaultValue={formData.lineId}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
                                            <Button
                                                variant="outline"
                                                className="h-12 rounded-xl font-bold flex items-center justify-center gap-2 order-2 sm:order-1"
                                                onClick={() => window.location.href = '/dashboard'}
                                            >
                                                <XCircle className="w-4 h-4" /> ยกเลิกการทำรายการ
                                            </Button>
                                            <Button
                                                variant="default"
                                                className="h-12 rounded-xl font-bold text-white flex items-center justify-center gap-2 order-1 sm:order-2"
                                                onClick={() => {
                                                    setAlertDialog({
                                                        isOpen: true,
                                                        title: "บันทึกฉบับร่างสำเร็จ",
                                                        description: "ระบบได้บันทึกข้อมูลใบสมัครไว้ในรายการฉบับร่างแล้ว เมื่อลูกค้ากลับมาต้องทำการตรวจสอบจากบัตรและใบหน้าใหม่อีกครั้ง",
                                                        type: "success",
                                                        action: () => window.location.href = '/dashboard'
                                                    });
                                                }}
                                            >
                                                <Save className="w-4 h-4" /> บันทึกและกลับสู่หน้าหลัก
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

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
                                                    {formData.cardType === 'PINK_CARD' ? "เลขประจำตัว" : "เลขบัตรประจำตัวประชาชน"} <span className="text-red-500">*</span>
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
                                                <div className="flex items-center gap-1.5 min-h-[20px]">
                                                    <Label className="text-xs text-muted-foreground font-bold">
                                                        วันเดือนปีเกิด <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <button type="button" className="text-muted-foreground hover:text-chaiyo-blue transition-colors outline-none cursor-pointer">
                                                                <Info className="w-3.5 h-3.5" />
                                                            </button>
                                                        </PopoverTrigger>
                                                        <PopoverContent side="top" align="start" className="max-w-[300px] p-4 text-xs leading-relaxed bg-white border-border-strong text-foreground shadow-2xl rounded-2xl z-50">
                                                            <div className="space-y-3">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-chaiyo-blue"></div>
                                                                    <p className="font-bold text-chaiyo-blue text-sm">กรณีไม่ทราบวันหรือเดือนเกิด</p>
                                                                </div>
                                                                <p className="text-muted-foreground">ให้ระบุเป็น <code className="bg-red-50 text-red-600 px-1 rounded font-bold">--</code> ในช่องที่กำกับ</p>
                                                                <div className="bg-gray-50 p-3 rounded-xl border border-border-subtle space-y-2">
                                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">ตัวอย่างการระบุ</p>
                                                                    <div className="flex justify-between items-center border-b border-gray-200/50 pb-1.5">
                                                                        <span className="text-muted-foreground">ไม่ทราบวันเกิด:</span>
                                                                        <code className="text-foreground font-bold px-1.5 py-0.5 bg-white border border-border-subtle rounded-md">--/01/2538</code>
                                                                    </div>
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-muted-foreground">ไม่ทราบวันและเดือน:</span>
                                                                        <code className="text-foreground font-bold px-1.5 py-0.5 bg-white border border-border-subtle rounded-md">--/--/2538</code>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                                <DatePickerBE
                                                    value={formData.birthDate}
                                                    onChange={(val) => handleFormChange('birthDate', val)}
                                                    readOnly={verificationMethod === 'DIPCHIP'}
                                                    inputClassName="h-11"
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
                                                <DatePickerBE
                                                    value={formData.expiryDate}
                                                    onChange={(val) => handleFormChange('expiryDate', val)}
                                                    readOnly={verificationMethod === 'DIPCHIP' || isLifetime}
                                                    disabled={isLifetime}
                                                    inputClassName="h-11 shadow-none"
                                                    placeholder={isLifetime ? "ไม่มีวันหมดอายุ" : undefined}
                                                />
                                            </div>
                                        </div>





                                        <div className="pt-6 border-t">
                                            <Button
                                                size="default"
                                                className="w-full text-white h-12 text-xl font-bold rounded-2xl"
                                                onClick={() => handleDOPAVerify()}
                                                disabled={!formData.idNumber || formData.idNumber.replace(/-/g, '').length < 13 || (formData.cardType !== 'PINK_CARD' && !formData.laserId) || !formData.firstName || !formData.lastName || !formData.birthDate || (!isLifetime && !formData.expiryDate)}
                                            >
                                                ตรวจสอบ
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            <AlertDialog open={alertDialog.isOpen} onOpenChange={(open) => setAlertDialog({ ...alertDialog, isOpen: open })}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                                alertDialog.type === 'error' ? "bg-red-100" :
                                    alertDialog.type === 'success' ? "bg-emerald-100" : "bg-amber-100"
                            )}>
                                {alertDialog.type === 'error' ? (
                                    <XCircle className="w-5 h-5 text-red-600" />
                                ) : alertDialog.type === 'success' ? (
                                    <Check className="w-5 h-5 text-emerald-600" />
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
                    <AlertDialogFooter className="gap-2">
                        {alertDialog.cancelAction && (
                            <AlertDialogCancel
                                onClick={() => alertDialog.cancelAction?.()}
                                className="rounded-xl border-gray-200"
                            >
                                {alertDialog.cancelText || "ยกเลิก"}
                            </AlertDialogCancel>
                        )}
                        <AlertDialogAction
                            onClick={() => {
                                if (alertDialog.action) {
                                    alertDialog.action();
                                }
                            }}
                            className={cn(
                                "text-white rounded-xl",
                                alertDialog.type === 'error' ? "bg-red-600 hover:bg-red-700" : "bg-chaiyo-blue hover:bg-chaiyo-blue/90"
                            )}
                        >
                            {alertDialog.type === 'error' ? "รับทราบ" : alertDialog.type === 'warning' ? "ลองอีกครั้ง" : "ตรวจสอบอีกครั้ง"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Not Continue Dialog */}
            <AlertDialog open={showNotContinueDialog} onOpenChange={setShowNotContinueDialog}>
                <AlertDialogContent className="max-w-md rounded-3xl p-8">
                    <AlertDialogHeader className="items-center text-center">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                            <Info className="w-8 h-8 text-chaiyo-blue" />
                        </div>
                        <AlertDialogTitle className="text-2xl font-black text-gray-900">ยืนยันการออกจากหน้านี้</AlertDialogTitle>
                        <AlertDialogDescription className="text-base text-gray-500">
                            ข้อมูลทั้งหมดจะถูกบันทึกเป็น 'ฉบับร่าง' โดยอัตโนมัติ คุณสามารถกลับมาดำเนินการต่อได้จากรายการใบสมัคร
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="space-y-6 py-6">
                        <div className="bg-gray-50 rounded-2xl space-y-1">
                            <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">ชื่อ-นามสกุล ลูกค้า</Label>
                            <p className="text-lg font-bold text-gray-900">{formData.firstName} {formData.lastName}</p>
                        </div>

                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label className="text-muted tracking-tight">เบอร์ติดต่อ</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="0xx-xxx-xxxx"
                                        value={notContinuePhone}
                                        onChange={(e) => setNotContinuePhone(e.target.value)}
                                        className="rounded-xl h-11 border-gray-200 focus:border-chaiyo-blue pl-9 bg-white"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-muted tracking-tight">LINE ID</Label>
                                <div className="relative">
                                    <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="@lineid"
                                        value={notContinueLineId}
                                        onChange={(e) => setNotContinueLineId(e.target.value)}
                                        className="rounded-xl h-11 border-gray-200 focus:border-chaiyo-blue pl-9 bg-white"
                                    />
                                </div>
                            </div>
                        </div>


                    </div>

                    <AlertDialogFooter className="flex flex-col sm:flex-row gap-3">
                        <AlertDialogAction
                            onClick={() => window.location.href = '/dashboard'}
                            className="bg-chaiyo-blue hover:bg-chaiyo-blue/90 text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2 flex-1 order-1 sm:order-2"
                        >
                            <Save className="w-4 h-4" /> บันทึกและกลับสู่หน้าหลัก
                        </AlertDialogAction>
                        <AlertDialogCancel
                            onClick={() => setShowNotContinueDialog(false)}
                            className="border-gray-200 text-gray-500 hover:bg-gray-50 font-bold h-12 rounded-xl flex items-center justify-center gap-2 flex-1 order-2 sm:order-1"
                        >
                            ปิด
                        </AlertDialogCancel>
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
