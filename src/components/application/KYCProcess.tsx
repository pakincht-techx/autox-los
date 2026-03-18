"use client";

import { useState } from "react";
import { CreditCard, FileText, User, Camera, Loader2, ArrowLeft, XCircle, AlertTriangle, UserCheck, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export type KYCData = {
    idNumber: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    firstNameEn?: string;
    lastNameEn?: string;
    middleNameEn?: string;
    prefix: string;
    birthDate: string;
    addressLine1: string;
    houseNumber?: string;
    floorNumber?: string;
    unitNumber?: string;
    village?: string;
    moo?: string;
    yaek?: string;
    trohk?: string;
    soi?: string;
    street?: string;
    subDistrict: string;
    district: string;
    province: string;
    zipCode: string;
    fullAddress: string;
    issueDate?: string;
    expiryDate?: string;
    laserId?: string;
    gender?: string;
    verificationMethod?: 'DIPCHIP' | 'MANUAL';
    verificationStatus: 'NORMAL' | 'WATCHLIST' | 'BLACKLIST';
    watchlistReasons?: ('Fraud' | 'Compliance' | 'Legal')[];
};

interface KYCProcessProps {
    onComplete: (data: KYCData) => void;
    onCancel: () => void;
    title?: string;
}

type KYCStage = 'INIT' | 'ID_INPUT' | 'READING_CARD' | 'CHECKING_MEMBER' | 'COMPLETE' | 'FACE_VERIFY';

export function KYCProcess({ onComplete, onCancel, title = "ยืนยันตัวตน" }: KYCProcessProps) {
    const [stage, setStage] = useState<KYCStage>('INIT');
    const [verificationMethod, setVerificationMethod] = useState<'DIPCHIP' | 'MANUAL' | null>(null);
    const [tempData, setTempData] = useState<Partial<KYCData>>({ idNumber: "", middleName: "", laserId: "", issueDate: "", expiryDate: "" });
    const [verificationStatus, setVerificationStatus] = useState<'NORMAL' | 'WATCHLIST' | 'BLACKLIST'>('NORMAL');
    const [watchlistReasons, setWatchlistReasons] = useState<('Fraud' | 'Compliance' | 'Legal')[]>([]);
    const [alertDialog, setAlertDialog] = useState({
        isOpen: false,
        title: "",
        description: ""
    });

    // MOCK: Handle Start Reading / Dip Chip
    const handleReadCard = async () => {
        setStage('READING_CARD');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock Data
        const mockData: Partial<KYCData> = {
            idNumber: "1234567890123",
            firstName: "สมชาย",
            middleName: "", // Mock empty middle name for male
            lastName: "รักชาติ",
            firstNameEn: "SOMCHAI",
            lastNameEn: "RAKCHAT",
            middleNameEn: "",
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
            issueDate: "2020-05-20",
            expiryDate: "2029-05-19",
            laserId: "ME1-2345678-90",
        };
        setTempData(mockData);
        checkMemberStatus(mockData.idNumber!);
    };

    // MOCK: Handle Manual OCR/Input
    const handleOCRUpload = async () => {
        setStage('READING_CARD');
        await new Promise(resolve => setTimeout(resolve, 1500));

        const mockData: Partial<KYCData> = {
            idNumber: "3334567890123",
            firstName: "สมหญิง",
            middleName: "มณี", // Mock middle name example
            lastName: "ใจงาม",
            prefix: "นางสาว",
            gender: "หญิง",
            birthDate: "1995-05-05",
            addressLine1: "456 หมู่ 2",
            houseNumber: "456",
            moo: "2",
            subDistrict: "บางรัก",
            district: "บางรัก",
            province: "กรุงเทพมหานคร",
            zipCode: "10500",
            fullAddress: "456 หมู่ 2 บางรัก บางรัก กรุงเทพมหานคร 10500",
            issueDate: "2022-10-10",
            expiryDate: "2031-10-09",
            laserId: "CH2-9876543-21",
        };
        setTempData(mockData);
        checkMemberStatus(mockData.idNumber!);
    };

    const handleManualSubmit = () => {
        if (tempData.idNumber && tempData.idNumber.length >= 13) {
            checkMemberStatus(tempData.idNumber);
        } else {
            setAlertDialog({
                isOpen: true,
                title: "ข้อมูลไม่ถูกต้อง",
                description: "กรุณากรอกเลขบัตรประชาชนให้ถูกต้อง (13 หลัก)"
            });
        }
    };

    const checkMemberStatus = async (idNumber: string) => {
        setStage('CHECKING_MEMBER');
        setVerificationStatus('NORMAL');

        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock Logic
        if (idNumber.endsWith('888')) {
            setVerificationStatus('BLACKLIST');
            setStage('COMPLETE');
            return;
        }
        if (idNumber.endsWith('777')) {
            setVerificationStatus('WATCHLIST');
            setWatchlistReasons(['Fraud']);
            setStage('COMPLETE');
            return;
        }
        if (idNumber.endsWith('778')) {
            setVerificationStatus('WATCHLIST');
            setWatchlistReasons(['Compliance']);
            setStage('COMPLETE');
            return;
        }
        if (idNumber.endsWith('779')) {
            setVerificationStatus('WATCHLIST');
            setWatchlistReasons(['Legal', 'Fraud']);
            setStage('COMPLETE');
            return;
        }

        // Normal -> Go to Face Verify
        setStage('FACE_VERIFY');
    };

    const handleFaceVerify = async () => {
        setStage('FACE_VERIFY');
        await new Promise(resolve => setTimeout(resolve, 1500));
        // Success
        setStage('COMPLETE');
    };

    const handleContinueWatchlist = () => {
        // Proceed even if watchlist
        onComplete({ ...tempData, verificationMethod, verificationStatus: 'WATCHLIST', watchlistReasons } as KYCData);
    };

    // --- Renders ---

    const renderSelection = () => (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card
                    className="border-2 border-dashed border-gray-200 hover:border-chaiyo-blue hover:bg-blue-50/30 cursor-pointer transition-all group"
                    onClick={() => { setVerificationMethod('DIPCHIP'); setStage('ID_INPUT'); }}
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

                <Card
                    className="border-2 border-dashed border-gray-200 hover:border-orange-400 hover:bg-orange-50/30 cursor-pointer transition-all group"
                    onClick={() => { setVerificationMethod('MANUAL'); setStage('ID_INPUT'); }}
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

    const renderReading = () => (
        <div className="py-8 text-center animate-in fade-in">
            <Button variant="ghost" onClick={() => { setStage('INIT'); setVerificationMethod(null); }} className="mb-4 absolute left-4 top-4">
                <ArrowLeft className="w-4 h-4 mr-2" /> ย้อนกลับ
            </Button>

            {verificationMethod === 'DIPCHIP' && (
                <div onClick={handleReadCard} className="cursor-pointer">
                    {stage === 'READING_CARD' ? (
                        <div className="flex flex-col items-center">
                            <Loader2 className="w-16 h-16 text-chaiyo-blue animate-spin mb-4" />
                            <h3 className="text-lg font-bold text-chaiyo-blue">กำลังอ่านข้อมูล...</h3>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center border-2 border-dashed border-chaiyo-blue/30 rounded-xl p-8 bg-blue-50/20 hover:bg-blue-50/50 transition-colors">
                            <CreditCard className="w-16 h-16 text-chaiyo-blue mb-4" />
                            <h3 className="text-xl font-bold mb-2">เสียบบัตรประชาชน</h3>
                            <p className="text-muted-foreground text-sm">เสียบบัตรเข้ากับเครื่องอ่านแแล้วคลิกที่นี่</p>
                        </div>
                    )}
                </div>
            )}

            {verificationMethod === 'MANUAL' && (
                <div className="max-w-md mx-auto space-y-4">
                    {stage === 'READING_CARD' ? (
                        <div className="flex flex-col items-center py-10">
                            <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
                            <h3 className="text-lg font-bold">กำลังตรวจสอบข้อมูล...</h3>
                        </div>
                    ) : (
                        <div className="space-y-4 p-4 border rounded-xl bg-gray-50">
                            <Button variant="outline" className="w-full h-12 border-dashed" onClick={handleOCRUpload}>
                                <Camera className="w-4 h-4 mr-2" /> ถ่ายรูปบัตรประชาชน / บัตรต่างด้าว
                            </Button>
                            <div className="relative flex py-2 items-center">
                                <div className="flex-grow border-t border-gray-200"></div>
                                <span className="flex-shrink-0 mx-4 text-xs text-gray-400">หรือ</span>
                                <div className="flex-grow border-t border-gray-200"></div>
                            </div>
                            <div className="space-y-2 text-left">
                                <Label>เลขบัตรประจำตัว (13 หลัก)</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={tempData.idNumber}
                                        onChange={(e) => setTempData({ ...tempData, idNumber: e.target.value })}
                                        placeholder="x-xxxx-xxxxx-xx-x"
                                        maxLength={13}
                                    />
                                    <Button onClick={handleManualSubmit}>ตรวจสอบ</Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    const renderChecking = () => (
        <div className="flex flex-col items-center justify-center py-12 animate-in fade-in">
            <Loader2 className="w-12 h-12 text-chaiyo-blue animate-spin mb-4" />
            <h3 className="text-lg font-bold">กำลังตรวจสอบประวัติอาชญากรรม...</h3>
            <p className="text-muted-foreground text-sm">ตรวจสอบ Blacklist และ Fraud List</p>
        </div>
    );

    const renderFaceVerify = () => (
        <div className="py-8 text-center animate-in fade-in">
            <h3 className="text-lg font-bold mb-6">ยืนยันตัวตน (Face Verification)</h3>
            <div className="relative w-64 h-64 mx-auto bg-slate-900 rounded-2xl overflow-hidden mb-6 group cursor-pointer" onClick={handleFaceVerify}>
                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?fit=crop&w=400&h=400" className="w-full h-full object-cover opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Camera className="w-12 h-12 text-white" />
                </div>
                <div className="absolute bottom-4 left-0 right-0 text-white text-sm font-medium">คลิกเพื่อถ่ายภาพ</div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">กรุณามองกล้องและถอดแว่นตา / หน้ากากอนามัย</p>
        </div>
    );

    const renderResult = () => (
        <div className="py-8 text-center animate-in zoom-in-95">
            {verificationStatus === 'BLACKLIST' && (
                <div className="flex flex-col items-center">
                    <XCircle className="w-16 h-16 text-red-500 mb-4" />
                    <h3 className="text-xl font-bold text-red-600 mb-2">ไม่ผ่านการตรวจสอบ (Blacklist)</h3>
                    <p className="text-muted-foreground mb-6 max-w-xs mx-auto">บุคคลนี้มีประวัติอยู่ใน Blacklist ไม่สามารถทำธุรกรรมได้</p>
                    <Button variant="outline" onClick={() => { setStage('INIT'); setVerificationMethod(null); }}>ลองใหม่</Button>
                </div>
            )}
            {verificationStatus === 'WATCHLIST' && (
                <div className="flex flex-col items-center">
                    <AlertTriangle className="w-16 h-16 text-orange-500 mb-4" />
                    <h3 className="text-xl font-bold text-orange-600 mb-2">พบประวัติเฝ้าระวัง (Watchlist)</h3>
                    <p className="text-muted-foreground mb-4 max-w-xs mx-auto">บุคคลนี้อยู่ใน Watchlist ต้องการการพิจารณาเป็นพิเศษ</p>

                    {watchlistReasons.length > 0 && (
                        <div className="flex flex-wrap gap-2 justify-center mb-6">
                            {watchlistReasons.map((reason, idx) => (
                                <Badge key={idx} variant="outline" className="border-orange-200 bg-orange-50 text-orange-700">
                                    {reason}
                                </Badge>
                            ))}
                        </div>
                    )}

                    <div className="flex gap-3">
                        <Button variant="outline" onClick={() => { setStage('INIT'); setVerificationMethod(null); }}>ยกเลิก</Button>
                        <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleContinueWatchlist}>ดำเนินการต่อ</Button>
                    </div>
                </div>
            )}
            {verificationStatus === 'NORMAL' && (
                <div className="flex flex-col items-center">
                    <CheckCircle className="w-16 h-16 text-emerald-500 mb-4" />
                    <h3 className="text-xl font-bold text-emerald-600 mb-2">ยืนยันตัวตนสำเร็จ</h3>
                    <p className="text-muted-foreground mb-6 max-w-xs mx-auto">ข้อมูลถูกต้อง ตรวจสอบผ่าน</p>
                    <div className="flex justify-center">
                        <Button
                            className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[150px]"
                            onClick={() => onComplete({ ...tempData, verificationMethod, verificationStatus: 'NORMAL' } as KYCData)}
                        >
                            ยืนยันข้อมูล
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="w-full max-w-3xl mx-auto">
            <DialogHeader className="mb-6">
                <DialogTitle className="text-center">
                    {title}
                </DialogTitle>
            </DialogHeader>

            {stage === 'INIT' && renderSelection()}
            {(stage === 'ID_INPUT' || stage === 'READING_CARD') && renderReading()}
            {stage === 'CHECKING_MEMBER' && renderChecking()}
            {stage === 'FACE_VERIFY' && renderFaceVerify()}
            {stage === 'COMPLETE' && renderResult()}

            <AlertDialog open={alertDialog.isOpen} onOpenChange={(open) => setAlertDialog({ ...alertDialog, isOpen: open })}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{alertDialog.title}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {alertDialog.description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction className="bg-chaiyo-blue hover:bg-chaiyo-blue/90 min-w-[104px]">
                            ตรวจสอบอีกครั้ง
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
