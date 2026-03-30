"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useSidebar } from "@/components/layout/SidebarContext";
import { useApplication } from "../../../context/ApplicationContext";
import { 
    CheckCircle, 
    Loader2, 
    CreditCard, 
    Camera, 
    ArrowRight, 
    FileText, 
    ShieldAlert, 
    AlertTriangle, 
    XCircle, 
    ArrowLeft, 
    AlertCircle, 
    Info, 
    Save, 
    Check, 
    User,
    Phone,
    MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/Card";
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

type KYCStage = 'INIT' | 'READING_CARD' | 'CHECKING_MEMBER' | 'TAKING_ID_FRONT' | 'TAKING_ID_BACK' | 'FACE_VERIFY' | 'FACE_SUCCESS' | 'FACE_FAILED' | 'COMPLETE';

export default function AddGuarantorPage() {
    const router = useRouter();
    const params = useParams();
    const appId = params.appid as string;
    
    const { setBreadcrumbs, setRightContent, setHideSaveDraftButton } = useSidebar();
    const { isApplicationStarted, formData: applicationFormData } = useApplication();
    const searchParams = useSearchParams();
    const isReadonly = searchParams.get('state') === 'readonly';

    // Breadcrumbs management
    useEffect(() => {
        const borrowerFirstName = applicationFormData?.firstName;
        const displayAppId = appId.length > 8 ? appId.slice(8) : appId;
        const appLabel = borrowerFirstName ? `${displayAppId} (${borrowerFirstName})` : displayAppId;

        setBreadcrumbs([
            { label: appLabel, onClick: () => router.push(`/dashboard/applications/${appId}`) },
            { label: "ผู้ค้ำ", onClick: () => router.push(`/dashboard/new-application/${appId}/guarantors`) },
            { label: "เพิ่มผู้ค้ำประกัน", isActive: true }
        ]);
        
        // Clear right content if any
        if (!isReadonly) {
            setRightContent(null);
        }

        // Hide save draft button on add guarantor page
        setHideSaveDraftButton(true);
        
        return () => {
            setHideSaveDraftButton(false);
        };
    }, [appId, setBreadcrumbs, applicationFormData?.firstName, router, isReadonly, setRightContent, setHideSaveDraftButton]);

    // Local form data for new guarantor
    const [formData, setFormData] = useState<any>({
        idNumber: "",
        firstName: "",
        lastName: "",
        birthDate: "",
        expiryDate: "",
        phoneNumber: "",
        lineId: "",
        cardType: "THAI_ID" // Always THAI_ID for guarantor
    });

    const [stage, setStage] = useState<KYCStage>('INIT');
    const [verificationMethod, setVerificationMethod] = useState<'DIPCHIP' | 'MANUAL' | null>('DIPCHIP');
    const [dipchipError, setDipchipError] = useState(false);
    const [isSimulatingError, setIsSimulatingError] = useState(false);
    const [isMockCamera, setIsMockCamera] = useState(true);

    const [livenessAttempts, setLivenessAttempts] = useState(0);
    const [simulateLivenessFail, setSimulateLivenessFail] = useState(false);

    const [idFrontPhoto, setIdFrontPhoto] = useState<string | null>(null);
    const [idBackPhoto, setIdBackPhoto] = useState<string | null>(null);
    const [isProcessingFrontPhoto, setIsProcessingFrontPhoto] = useState(false);
    const [mockLivePhoto, setMockLivePhoto] = useState<string | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    const [alertDialog, setAlertDialog] = useState<{
        isOpen: boolean,
        title: string,
        description: string,
        type: 'error' | 'warning' | 'success',
        action?: () => void,
        cancelAction?: () => void,
        cancelText?: string
    }>({
        isOpen: false, title: "", description: "", type: "error"
    });
    const [showNotContinueDialog, setShowNotContinueDialog] = useState(false);

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

    useEffect(() => {
        let timer: any;
        if (stage === 'FACE_VERIFY' && isCameraActive) {
            timer = setTimeout(() => {
                handleFaceVerify();
            }, 3000);
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
            const constraints = { video: { facingMode }, audio: false };
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
            return "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";
        }
        if (videoRef.current && isCameraActive) {
            const canvas = document.createElement("canvas");
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(videoRef.current, 0, 0);
                return canvas.toDataURL("image/jpeg", 0.9);
            }
        }
        return null;
    };

    const handleSelectMethod = (method: 'DIPCHIP' | 'MANUAL') => {
        setVerificationMethod(method);
    };

    const handleBackToSelection = () => {
        setVerificationMethod(null);
        setStage('INIT');
    };

    const handleReadCard = async () => {
        setDipchipError(false);
        setStage('READING_CARD');
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (isSimulatingError) {
            setDipchipError(true);
            setStage('INIT');
            return;
        }

        const mockData = {
            idNumber: "1-2345-67890-12-3",
            firstName: "ดีใจ",
            lastName: "ไชโย",
            phoneNumber: "0812345678",
            expiryDate: "2029-05-19",
        };

        setFormData(mockData);
        handleDOPAVerify(mockData);
    };

    const handleOCRUpload = () => {
        setVerificationMethod('MANUAL');
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
            setStage('READING_CARD');
            await new Promise(resolve => setTimeout(resolve, 2000));

            const mockData = {
                idNumber: "3-3345-67890-12-3",
                firstName: "ดีใจ",
                lastName: "ไชโย",
                expiryDate: "2031-10-09",
            };

            setFormData(mockData);
            handleDOPAVerify(mockData);
        }
    };

    const handleDOPAVerify = async (dataOverride?: any) => {
        setStage('CHECKING_MEMBER');
        await new Promise(resolve => setTimeout(resolve, 2000));
        setStage('FACE_VERIFY');
    };

    const handleFaceVerify = async () => {
        const photo = capturePhoto();
        if (!photo) {
            setAlertDialog({
                isOpen: true, title: "ไม่สามารถถ่ายภาพได้", description: "กรุณาตรวจสอบกล้องและลองใหม่อีกครั้ง", type: "error"
            });
            return;
        }

        const shouldFail = simulateLivenessFail || isSimulatingError;
        setStage('READING_CARD');
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
        setStage('COMPLETE');
        await new Promise(resolve => setTimeout(resolve, 500));
        router.push(`/dashboard/new-application/${appId}/guarantors/G-D${Date.now()}/info`); // Navigate to guarantor info page
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">


            <div className="max-w-2xl mx-auto pt-4 transition-all duration-500 w-full">
                <div className="space-y-8 pb-20">
                    {(stage === 'INIT' || (stage === 'READING_CARD' && (verificationMethod === 'DIPCHIP' || idBackPhoto))) && (
                        <div className="space-y-8 relative">

                            <Card className={cn("border-2 transition-all duration-300 shadow-none overflow-hidden", dipchipError ? "" : "border-chaiyo-blue/10 bg-blue-50/20 hover:bg-blue-50/40 cursor-pointer")} onClick={!dipchipError ? handleReadCard : undefined}>
                                <CardContent className="flex flex-col items-center justify-center py-10 text-center relative px-8">
                                    {stage === 'READING_CARD' ? (
                                        <>
                                            <Loader2 className="w-16 h-16 text-chaiyo-blue animate-spin mb-4" />
                                            <h3 className="text-xl font-bold text-chaiyo-blue">กำลังประมวลผลข้อมูล...</h3>
                                        </>
                                    ) : dipchipError ? (
                                        <div className="animate-in fade-in zoom-in-95 duration-500 w-full flex flex-col items-center">
                                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                                                <XCircle className="w-10 h-10 text-red-600" />
                                            </div>
                                            <h3 className="text-xl font-bold">ไม่สามารถอ่านข้อมูลจากชิปได้</h3>
                                            <p className="text-sm mt-2 mb-8 max-w-sm leading-relaxed">พบข้อผิดพลาดขณะอ่านข้อมูลจากบัตรประชาชน <br /> กรุณาตรวจสอบการเสียบบัตรและลองอีกครั้ง</p>
                                            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md justify-center">
                                                <Button variant="outline" onClick={handleOCRUpload} className="h-12 px-8 rounded-xl">ถ่ายรูปบัตรประชาชน</Button>
                                                <Button onClick={handleReadCard} className="text-white h-12 px-8 rounded-xl">ลองอีกครั้ง</Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-32 h-24 shadow-lg border border-gray-100 rounded-xl flex items-center justify-center mb-6 p-4 bg-white">
                                                <img src="/images/card_citizen.svg" alt="Dipchip" className="w-full h-full object-contain" />
                                            </div>
                                            <h3 className="text-xl font-bold text-foreground">เสียบบัตรประชาชน (Dipchip)</h3>
                                            <p className="text-muted text-sm mt-2 mb-6 max-w-sm">ดึงข้อมูลจากชิปการ์ดเพื่อความรวดเร็วและแม่นยำสูงสุด (รับเฉพาะคนไทย)</p>
                                            <Button className="pointer-events-none bg-chaiyo-blue px-10 h-10 rounded-xl">อ่านข้อมูลบัตร</Button>
                                        </>
                                    )}
                                </CardContent>
                            </Card>

                            {stage === 'INIT' && !dipchipError && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-[1px] flex-1 bg-gray-200"></div>
                                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-2">หรือใช้วิธีอื่น</span>
                                        <div className="h-[1px] flex-1 bg-gray-200"></div>
                                    </div>
                                    <Button variant="outline" className="w-full h-28 border-border-subtle hover:border-chaiyo-blue hover:bg-blue-50/30 flex flex-col items-center justify-center gap-2 rounded-2xl transition-all group" onClick={handleOCRUpload}>
                                        <div className="w-12 h-10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <img src="/images/card_citizen.svg" alt="บัตรประชาชน" className="w-full h-full object-contain" />
                                        </div>
                                        <span className="text-sm font-bold text-gray-700">ถ่ายรูปบัตรประชาชน</span>
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

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
                                    <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
                                    {isProcessingFrontPhoto && (
                                        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm rounded-none">
                                            <Loader2 className="w-12 h-12 text-white animate-spin mb-4" />
                                            <p className="text-white font-bold text-lg">กำลังประมวลผลรูปภาพ...</p>
                                        </div>
                                    )}
                                    {!cameraError && (
                                        <div className="absolute inset-x-8 inset-y-12 border-2 border-dashed border-white/50 rounded-2xl z-30 pointer-events-none flex items-center justify-center">
                                            <div className="bg-white/5 backdrop-blur-[1px] w-full h-full rounded-2xl border border-white/20 relative overflow-hidden">
                                                {stage === 'TAKING_ID_FRONT' && (
                                                    <>
                                                        <div className="absolute right-6 bottom-6 w-[28%] aspect-[3/4] border border-white/30 rounded-lg bg-white/5 flex items-center justify-center">
                                                            <User className="w-8 h-8 text-white/20" />
                                                        </div>
                                                        <div className="absolute left-6 top-[35%] w-1/2 space-y-3">
                                                            <div className="h-2 w-full bg-white/10 rounded-full"></div>
                                                            <div className="h-2 w-3/4 bg-white/10 rounded-full"></div>
                                                        </div>
                                                        <div className="absolute left-1/2 top-4 -translate-x-1/2 bg-white/20 text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest whitespace-nowrap">ด้านหน้าบัตรประชาชน</div>
                                                    </>
                                                )}
                                                {stage === 'TAKING_ID_BACK' && (
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                                                        <div className="w-1/2 h-10 border border-white/30 rounded-xl bg-white/10 flex items-center justify-center">
                                                            <div className="w-2/3 h-2 bg-white/20 rounded-full"></div>
                                                        </div>
                                                        <div className="bg-white/20 text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest">ด้านหลังบัตร</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    {isCameraActive && (
                                        <div className="absolute bottom-6 left-0 right-0 flex justify-center z-40">
                                            <Button size="default" onClick={handleCaptureID} className="text-white px-10 h-12 text-lg shadow-xl">
                                                <Camera className="w-6 h-6 mr-2" /> {stage === 'TAKING_ID_FRONT' ? 'ถ่ายภาพด้านหน้า' : 'ถ่ายภาพด้านหลัง'}
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {stage === 'CHECKING_MEMBER' && (
                        <Card className="border-border-subtle overflow-hidden">
                            <div className="h-2 w-full bg-gray-100 overflow-hidden"><div className="h-full bg-chaiyo-blue animate-progress origin-left"></div></div>
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

                                    <Button variant="ghost" onClick={() => setShowNotContinueDialog(true)} className="text-red-500 hover:bg-red-50">
                                        <XCircle className="w-5 h-5 mr-1" /> ออกจากการทำรายการ
                                    </Button>
                                </div>
                            </div>

                            <Card className="border-border-subtle bg-slate-900 overflow-hidden relative aspect-square md:aspect-video rounded-3xl shadow-2xl">
                                <CardContent className="flex flex-col items-center justify-center p-0 h-full relative">
                                    <video ref={videoRef} autoPlay playsInline muted className={cn("absolute inset-0 w-full h-full object-cover", !isCameraActive && "hidden")} />
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
                                            <Button variant="secondary" onClick={() => startCamera("user")} className="mt-4 px-8">ลองอีกครั้ง</Button>
                                        </div>
                                    ) : !isCameraActive && (
                                        <div className="z-40 text-center">
                                            <Loader2 className="w-10 h-10 text-white animate-spin mx-auto mb-2" />
                                            <p className="text-white text-sm">กำลังเปิดกล้อง...</p>
                                        </div>
                                    )}
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

                    {stage === 'FACE_SUCCESS' && (
                        <div className="space-y-6 animate-in fade-in duration-700">
                            <Card className="overflow-hidden rounded-3xl">
                                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                                        <CheckCircle className="w-14 h-14 text-emerald-600" />
                                    </div>
                                    <h3 className="text-3xl font-black mb-2">ยืนยันตัวตนสำเร็จ</h3>
                                    <p className="text-lg max-w-md mx-auto">การตรวจสอบใบหน้าและ DOPA มีข้อมูลถูกต้องตรงกัน</p>
                                    <div className="flex flex-col items-center gap-4 w-full max-w-sm mt-12">
                                        <Button size="default" className="w-full bg-chaiyo-blue text-white h-12 shadow-xl" onClick={handleCreateProfile}>
                                            ดำเนินการต่อ <ArrowRight className="ml-2 w-6 h-6" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {stage === 'FACE_FAILED' && (
                        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                            <Card className="overflow-hidden rounded-3xl">
                                <CardContent className="flex flex-col items-center py-12 px-8 text-center">
                                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                                        <XCircle className="w-12 h-12 text-red-600" />
                                    </div>
                                    <h3 className="text-2xl font-black mb-2">การยืนยันตัวตนไม่สำเร็จ</h3>
                                    <p className="text-base max-w-sm mb-10">ตรวจสอบใบหน้าไม่ผ่านครบ 3 ครั้ง<br /> กรุณาลองใช้วิธีอื่น หรือตรวจสอบข้อมูล</p>
                                    <Button onClick={() => setStage('INIT')} variant="outline" className="w-full max-w-sm h-12 rounded-xl">กลับไปหน้าเริ่มต้น</Button>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>

            <AlertDialog open={alertDialog.isOpen} onOpenChange={(open) => setAlertDialog({ ...alertDialog, isOpen: open })}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{alertDialog.title}</AlertDialogTitle>
                        <AlertDialogDescription>{alertDialog.description}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2">
                        {alertDialog.cancelAction && (
                            <AlertDialogCancel onClick={() => alertDialog.cancelAction?.()} className="rounded-xl border-gray-200">{alertDialog.cancelText || "ยกเลิก"}</AlertDialogCancel>
                        )}
                        <AlertDialogAction
                            onClick={() => { if (alertDialog.action) alertDialog.action(); }}
                            className={cn("text-white rounded-xl", alertDialog.type === 'error' ? "bg-red-600 hover:bg-red-700" : "bg-chaiyo-blue hover:bg-chaiyo-blue/90")}
                        >
                            ตกลง
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}


