import React, { useState, useEffect } from "react";
import { User, MapPin, Info, Users, Plus, Phone, AlertTriangle, AlertCircle, Facebook, Instagram, Twitter, Youtube, MessageCircle, Globe, Home, Trash2, CheckCircle, Upload, Loader2, Mail, Pencil, UserPlus, Save, ShieldCheck, Smartphone, ClipboardList, Wallet, TrendingUp, CreditCard, Music2, ShoppingBag, ShoppingBasket, CarFront, Bike, MoreHorizontal } from "lucide-react";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { Badge } from "@/components/ui/Badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/Table";
import { AddressForm } from "@/components/application/AddressForm";
import { cn } from "@/lib/utils";
import { KYCProcess, KYCData } from "@/components/application/KYCProcess";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/Dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"; import { DatePickerBE } from "@/components/ui/DatePickerBE";


import { SocialMedia, Child, FamilyMember, CoBorrower, Guarantor, CustomerFormData } from "@/types/application";

interface CustomerInfoStepProps {
    formData: CustomerFormData;
    setFormData: React.Dispatch<React.SetStateAction<CustomerFormData>>;
}

// AddressForm is now imported from @/components/application/AddressForm

const SOCIAL_PLATFORMS = [
    { label: "Facebook", value: "facebook" },
    { label: "TikTok", value: "tiktok" },
    { label: "Instagram", value: "instagram" },
    { label: "X (Twitter)", value: "x" },
    { label: "Youtube", value: "youtube" },
    { label: "Other", value: "other" }
];

const SocialIcon = ({ platform }: { platform: string }) => {
    switch (platform) {
        case 'facebook': return <Facebook className="w-4 h-4 text-blue-600" />;
        case 'line': return <MessageCircle className="w-4 h-4 text-green-500" />;
        case 'tiktok': return <MessageCircle className="w-4 h-4 text-black" />;
        case 'instagram': return <Instagram className="w-4 h-4 text-pink-600" />;
        case 'x': return <Twitter className="w-4 h-4 text-black" />;
        case 'youtube': return <Youtube className="w-4 h-4 text-red-600" />;
        default: return <Globe className="w-4 h-4 text-gray-500" />;
    }
};

const COUNTRIES = [
    { label: "ไทย (Thai)", value: "Thai" },
    { label: "พม่า (Myanmar)", value: "Myanmar" },
    { label: "ลาว (Laos)", value: "Laos" },
    { label: "กัมพูชา (Cambodia)", value: "Cambodia" },
    { label: "จีน (China)", value: "China" },
    { label: "ญี่ปุ่น (Japan)", value: "Japan" },
    { label: "อื่นๆ (Other)", value: "Other" },
];

const ID_TYPES = [
    { label: "บัตรประชาชนไทย", value: "THAI_ID" },
    { label: "พาสปอร์ต", value: "PASSPORT" },
    { label: "บัตรต่างด้าว", value: "ALIEN_ID" },
    { label: "อื่นๆ", value: "OTHER" },
];

const MARITAL_STATUSES = [
    { label: "โสด", value: "single" },
    { label: "สมรสจดทะเบียน", value: "married_registered" },
    { label: "สมรสไม่จดทะเบียน", value: "married_unregistered" },
    { label: "หย่าร้าง", value: "divorced" },
    { label: "หม่าย", value: "widowed" },
];

const EDUCATION_LEVELS = [
    { label: "ต่ำกว่าประถมศึกษา", value: "below_primary" },
    { label: "ประถมศึกษา", value: "primary" },
    { label: "มัธยมศึกษาตอนต้น (ม.3)", value: "junior_high" },
    { label: "มัธยมศึกษาตอนปลาย (ม.6) / ปวช.", value: "high_school" },
    { label: "ปวส. / อนุปริญญา", value: "diploma" },
    { label: "ปริญญาตรี", value: "bachelors" },
    { label: "สูงกว่าปริญญาตรี", value: "post_graduate" }
];

const RatingGroup = ({ label, value, onChange }: { label: string, value?: number, onChange: (v: number) => void }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 py-4 border-b border-border-subtle/50 last:border-0">
            <span className="text-sm font-bold text-gray-700">{label}</span>
            <div className="flex items-center gap-1.5 bg-white border border-border-strong p-1.5 rounded-xl shrink-0">
                {[1, 2, 3, 4, 5].map((num) => (
                    <button
                        key={num}
                        type="button"
                        onClick={() => onChange(num)}
                        className={cn(
                            "w-10 h-10 rounded-lg text-sm font-bold transition-all flex items-center justify-center",
                            value === num
                                ? "bg-chaiyo-blue text-white shadow-sm"
                                : "bg-white text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                        )}
                    >
                        {num}
                    </button>
                ))}
            </div>
        </div>
    );
};

const YesNoGroup = ({ label, value, onChange }: { label: React.ReactNode, value?: boolean, onChange: (v: boolean) => void }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 py-4 border-b border-border-subtle/50 last:border-0">
            <span className="text-sm font-bold text-gray-700 leading-relaxed max-w-[70%]">{label}</span>
            <div className="flex items-center gap-1.5 bg-white border border-border-strong p-1.5 rounded-xl shrink-0">
                {[
                    { label: "ใช่", value: true },
                    { label: "ไม่ใช่", value: false }
                ].map((item) => (
                    <button
                        key={String(item.value)}
                        type="button"
                        onClick={() => onChange(item.value)}
                        className={cn(
                            "px-6 py-2 rounded-lg text-sm font-bold transition-all min-w-[80px]",
                            value === item.value
                                ? "bg-chaiyo-blue text-white shadow-sm"
                                : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                        )}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export const formatPhoneNumber = (value: string) => {
    if (!value) return "";
    const digits = value.replace(/\D/g, "");
    if (digits.length === 0) return "";

    if (digits.startsWith("02")) {
        const truncated = digits.slice(0, 9);
        if (truncated.length <= 2) return truncated;
        if (truncated.length <= 5) return `${truncated.slice(0, 2)}-${truncated.slice(2)}`;
        return `${truncated.slice(0, 2)}-${truncated.slice(2, 5)}-${truncated.slice(5)}`;
    }

    const truncated = digits.slice(0, 10);
    if (truncated.length <= 3) return truncated;
    if (truncated.length <= 6) return `${truncated.slice(0, 3)}-${truncated.slice(3)}`;
    return `${truncated.slice(0, 3)}-${truncated.slice(3, 6)}-${truncated.slice(6)}`;
};

export function CustomerInfoStep({ formData, setFormData }: CustomerInfoStepProps) {




    // --- OTP State & Logic ---
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [otp, setOtp] = useState("");
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
    const [otpTimer, setOtpTimer] = useState(0);

    const [showEmailOtpInput, setShowEmailOtpInput] = useState(false);
    const [emailOtp, setEmailOtp] = useState("");
    const [isEmailOtpVerified, setIsEmailOtpVerified] = useState(false);
    const [isVerifyingEmailOtp, setIsVerifyingEmailOtp] = useState(false);
    const [emailOtpTimer, setEmailOtpTimer] = useState(0);
    const [otpError, setOtpError] = useState("");
    const [emailOtpError, setEmailOtpError] = useState("");
    const [otpRef, setOtpRef] = useState("");
    const [emailOtpRef, setEmailOtpRef] = useState("");

    const [alertDialog, setAlertDialog] = useState({
        isOpen: false,
        title: "",
        description: "",
        variant: "error" as "error" | "info"
    });

    // --- Phone Ownership Verification State ---
    const [showPhoneVerifyDialog, setShowPhoneVerifyDialog] = useState(false);
    const [isPhoneOwnershipVerifying, setIsPhoneOwnershipVerifying] = useState(false);
    const [phoneOwnershipStatus, setPhoneOwnershipStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleVerifyPhoneOwnership = () => {
        setShowPhoneVerifyDialog(true);
        setIsPhoneOwnershipVerifying(true);
        setPhoneOwnershipStatus('idle');

        // Simulate network delay for verification
        setTimeout(() => {
            setIsPhoneOwnershipVerifying(false);
            // Simulate error if phone ends in 9 for demo purposes
            if (formData.phone?.endsWith('9')) {
                setPhoneOwnershipStatus('error');
            } else {
                setPhoneOwnershipStatus('success');
            }
        }, 2000);
    };

    const handleSendOtp = () => {
        setShowOtpInput(true);
        setOtpTimer(60);
        setOtpError("");
        setOtp("");
        // Generate random 4-char ref code
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let ref = "";
        for (let i = 0; i < 4; i++) {
            ref += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setOtpRef(ref);
        // Simulate sending OTP
    };

    const handleVerifyOtp = () => {
        setIsVerifyingOtp(true);
        setOtpError("");
        setTimeout(() => {
            if (otp === "123456") {
                setIsOtpVerified(true);
                setShowOtpInput(false);
            } else {
                setOtpError("รหัส OTP ไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง (ใช้ 123456)");
            }
            setIsVerifyingOtp(false);
        }, 1000);
    };

    const handleSendEmailOtp = () => {
        setShowEmailOtpInput(true);
        setEmailOtpTimer(60);
        setEmailOtpError("");
        setEmailOtp("");
        // Generate random 4-char ref code
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let ref = "";
        for (let i = 0; i < 4; i++) {
            ref += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setEmailOtpRef(ref);
        // Simulate sending Email OTP
    };

    const handleVerifyEmailOtp = () => {
        setIsVerifyingEmailOtp(true);
        setEmailOtpError("");
        setTimeout(() => {
            if (emailOtp === "123456") {
                setIsEmailOtpVerified(true);
                setShowEmailOtpInput(false);
            } else {
                setEmailOtpError("รหัส OTP ไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง (ใช้ 123456)");
            }
            setIsVerifyingEmailOtp(false);
        }, 1000);
    };

    useEffect(() => {
        if (otpTimer <= 0) return;
        const interval = setInterval(() => setOtpTimer((prev: number) => prev - 1), 1000);
        return () => clearInterval(interval);
    }, [otpTimer]);

    useEffect(() => {
        if (emailOtpTimer <= 0) return;
        const interval = setInterval(() => setEmailOtpTimer((prev: number) => prev - 1), 1000);
        return () => clearInterval(interval);
    }, [emailOtpTimer]);

    // --- Co-borrower State ---
    const [isAddingCoBorrower, setIsAddingCoBorrower] = useState(false);
    const [coBorrowerStage, setCoBorrowerStage] = useState<'KYC' | 'FORM'>('KYC');
    const [newCoBorrower, setNewCoBorrower] = useState<CoBorrower>({
        relationship: "",
        idNumber: "",
        prefix: "",
        firstName: "",
        middleName: "",
        lastName: "",
        firstNameEn: "",
        middleNameEn: "",
        lastNameEn: "",
        gender: "",
        occupation: "",
        income: "",
        birthDate: "",
        fullAddress: "",
        watchlistReasons: [],
        phone: "",
        verificationStatus: "",
        latitude: "",
        longitude: ""
    });

    // --- Guarantor State ---
    const [isAddingGuarantor, setIsAddingGuarantor] = useState(false);
    const [guarantorStage, setGuarantorStage] = useState<'KYC' | 'FORM'>('KYC');
    const [newGuarantor, setNewGuarantor] = useState<Guarantor>({
        relationship: "",
        idNumber: "",
        prefix: "",
        firstName: "",
        middleName: "",
        lastName: "",
        firstNameEn: "",
        middleNameEn: "",
        lastNameEn: "",
        gender: "",
        verificationStatus: "",
        occupation: "",
        income: "",
        birthDate: "",
        fullAddress: "",
        watchlistReasons: [],
        phone: "",
        latitude: "",
        longitude: ""
    });
    const [editingCoBorrowerIndex, setEditingCoBorrowerIndex] = useState<number | null>(null);
    const [editingGuarantorIndex, setEditingGuarantorIndex] = useState<number | null>(null);

    // --- Delete Confirmation State ---
    const [deleteConfirmation, setDeleteConfirmation] = useState<{
        isOpen: boolean;
        type: 'co-borrower' | 'guarantor' | 'social-media' | 'child' | null;
        index: number | null;
    }>({
        isOpen: false,
        type: null,
        index: null
    });

    // --- Social Media Logic ---
    const handleAddSocialMedia = () => {
        const current = formData.socialMedias || [];
        setFormData((prev) => ({
            ...prev,
            socialMedias: [...current, { platform: "facebook", accountName: "" }]
        }));
    };

    const handleUpdateSocialMedia = (index: number, field: string, value: string) => {
        const items = [...(formData.socialMedias || [])];
        items[index] = { ...items[index], [field]: value };
        setFormData((prev: CustomerFormData) => ({ ...prev, socialMedias: items }));
    };

    const handleRemoveSocialMedia = (index: number) => {
        setDeleteConfirmation({
            isOpen: true,
            type: 'social-media',
            index: index
        });
    };


    // --- Children Logic ---
    const handleAddChild = () => {
        const current = formData.children || [];
        setFormData((prev) => ({
            ...prev,
            children: [...current, { age: "", occupation: "student" }]
        }));
    };

    const handleUpdateChild = (index: number, field: string, value: unknown) => {
        const items = [...(formData.children || [])];
        items[index] = { ...items[index], [field]: value };
        setFormData((prev: CustomerFormData) => ({ ...prev, children: items }));
    };

    const handleRemoveChild = (index: number) => {
        setDeleteConfirmation({
            isOpen: true,
            type: 'child',
            index: index
        });
    };


    // Helper: Update main form data
    const handleChange = (field: string, value: unknown) => {
        setFormData((prev: CustomerFormData) => ({ ...prev, [field]: value }));
    };

    // --- Co-Borrower Handlers ---
    const startAddCoBorrower = () => {
        setIsAddingCoBorrower(true);
        setEditingCoBorrowerIndex(null);
        setCoBorrowerStage('KYC');
        setNewCoBorrower({
            relationship: "", idNumber: "", prefix: "", firstName: "", middleName: "", lastName: "",
            firstNameEn: "", middleNameEn: "", lastNameEn: "",
            gender: "", occupation: "", income: "", birthDate: "", fullAddress: "", watchlistReasons: [], phone: "", issueDate: "", expiryDate: "", laserId: "",
            houseNumber: "", floorNumber: "", unitNumber: "", village: "", moo: "", yaek: "", trohk: "", soi: "", street: "", subDistrict: "", district: "", province: "", zipCode: ""
        });
    };

    const handleEditCoBorrower = (index: number) => {
        const coBorrowerToEdit = formData.coBorrowers[index];
        setNewCoBorrower({ ...coBorrowerToEdit });
        setEditingCoBorrowerIndex(index);
        setCoBorrowerStage('FORM'); // Skip KYC for edit
        setIsAddingCoBorrower(true);

    };

    // Helper: Format Date to Thai
    const formatDateToThai = (dateString: string | undefined) => {
        if (!dateString) return "";
        const [year, month, day] = dateString.split('-');
        const thaiYear = parseInt(year) + 543;
        return `${day}/${month}/${thaiYear}`;
    };

    const handleCoBorrowerKYCComplete = (data: KYCData) => {
        setNewCoBorrower({
            ...newCoBorrower,
            idNumber: data.idNumber,
            prefix: data.prefix,
            firstName: data.firstName,
            middleName: data.middleName || "",
            lastName: data.lastName,
            firstNameEn: data.firstNameEn || "",
            middleNameEn: data.middleNameEn || "",
            lastNameEn: data.lastNameEn || "",
            gender: data.gender,
            verificationMethod: data.verificationMethod,
            verificationStatus: data.verificationStatus,
            birthDate: formatDateToThai(data.birthDate),
            issueDate: data.issueDate,
            expiryDate: data.expiryDate,
            laserId: data.laserId,
            fullAddress: data.fullAddress,
            houseNumber: data.houseNumber,
            floorNumber: data.floorNumber,
            unitNumber: data.unitNumber,
            village: data.village,
            moo: data.moo,
            yaek: data.yaek,
            trohk: data.trohk,
            soi: data.soi,
            street: data.street,
            subDistrict: data.subDistrict,
            district: data.district,
            province: data.province,
            zipCode: data.zipCode,
            watchlistReasons: data.watchlistReasons || []
        });
        setCoBorrowerStage('FORM');
    };

    const handleAddCoBorrower = () => {
        if (!newCoBorrower.firstName || !newCoBorrower.lastName) return;

        if (editingCoBorrowerIndex !== null) {
            // Update existing
            const updatedCoBorrowers = [...(formData.coBorrowers || [])];
            updatedCoBorrowers[editingCoBorrowerIndex] = newCoBorrower;
            setFormData((prev: CustomerFormData) => ({ ...prev, coBorrowers: updatedCoBorrowers }));
        } else {
            // Add new
            setFormData((prev: CustomerFormData) => ({
                ...prev,
                coBorrowers: [...(prev.coBorrowers || []), newCoBorrower]
            }));
        }
        setIsAddingCoBorrower(false);
        setEditingCoBorrowerIndex(null);
    };

    const handleRemoveCoBorrower = (index: number) => {
        setDeleteConfirmation({
            isOpen: true,
            type: 'co-borrower',
            index: index
        });
    };

    // --- Guarantor Handlers ---
    const startAddGuarantor = () => {
        if (formData.guarantors && formData.guarantors.length >= 10) {
            setAlertDialog({
                isOpen: true,
                title: "ถึงขีดจำกัดแล้ว",
                description: "สามารถเพิ่มผู้ค้ำประกันได้สูงสุด 10 คน",
                variant: "info"
            });
            return;
        }
        setIsAddingGuarantor(true);
        setEditingGuarantorIndex(null);
        setGuarantorStage('KYC');
        setNewGuarantor({
            relationship: "", idNumber: "", prefix: "", firstName: "", middleName: "", lastName: "",
            firstNameEn: "", middleNameEn: "", lastNameEn: "",
            gender: "", occupation: "", income: "", birthDate: "", fullAddress: "", watchlistReasons: [], phone: "",
            houseNumber: "", floorNumber: "", unitNumber: "", village: "", moo: "", yaek: "", trohk: "", soi: "", street: "", subDistrict: "", district: "", province: "", zipCode: ""
        });
    };

    const handleEditGuarantor = (index: number) => {
        const guarantorToEdit = formData.guarantors[index];
        setNewGuarantor({ ...guarantorToEdit });
        setEditingGuarantorIndex(index);
        setGuarantorStage('FORM'); // Skip KYC for edit
        setIsAddingGuarantor(true);

    };

    const handleGuarantorKYCComplete = (data: KYCData) => {
        setNewGuarantor({
            ...newGuarantor,
            idNumber: data.idNumber,
            prefix: data.prefix,
            firstName: data.firstName,
            middleName: data.middleName || "",
            lastName: data.lastName,
            firstNameEn: data.firstNameEn || "",
            middleNameEn: data.middleNameEn || "",
            lastNameEn: data.lastNameEn || "",
            gender: data.gender,
            verificationMethod: data.verificationMethod,
            verificationStatus: data.verificationStatus,
            birthDate: formatDateToThai(data.birthDate),
            issueDate: data.issueDate,
            expiryDate: data.expiryDate,
            laserId: data.laserId,
            fullAddress: data.fullAddress,
            houseNumber: data.houseNumber,
            floorNumber: data.floorNumber,
            unitNumber: data.unitNumber,
            village: data.village,
            moo: data.moo,
            yaek: data.yaek,
            trohk: data.trohk,
            soi: data.soi,
            street: data.street,
            subDistrict: data.subDistrict,
            district: data.district,
            province: data.province,
            zipCode: data.zipCode,
            watchlistReasons: data.watchlistReasons || []
        });
        setGuarantorStage('FORM');
    };

    const handleAddGuarantor = () => {
        if (!newGuarantor.firstName || !newGuarantor.lastName) return;

        if (editingGuarantorIndex !== null) {
            // Update existing
            const updatedGuarantors = [...(formData.guarantors || [])];
            updatedGuarantors[editingGuarantorIndex] = newGuarantor;
            setFormData((prev: CustomerFormData) => ({ ...prev, guarantors: updatedGuarantors }));
        } else {
            // Add new
            setFormData((prev: CustomerFormData) => ({
                ...prev,
                guarantors: [...(prev.guarantors || []), newGuarantor]
            }));
        }
        setIsAddingGuarantor(false);
        setEditingGuarantorIndex(null);
    };

    const handleRemoveGuarantor = (index: number) => {
        setDeleteConfirmation({
            isOpen: true,
            type: 'guarantor',
            index: index
        });
    };

    const confirmDelete = () => {
        if (deleteConfirmation.type === 'co-borrower' && deleteConfirmation.index !== null) {
            setFormData((prev) => ({
                ...prev,
                coBorrowers: (prev.coBorrowers || []).filter((_, i) => i !== deleteConfirmation.index)
            }));
        } else if (deleteConfirmation.type === 'guarantor' && deleteConfirmation.index !== null) {
            setFormData((prev) => ({
                ...prev,
                guarantors: (prev.guarantors || []).filter((_, i) => i !== deleteConfirmation.index)
            }));
        } else if (deleteConfirmation.type === 'social-media' && deleteConfirmation.index !== null) {
            setFormData((prev) => ({
                ...prev,
                socialMedias: (prev.socialMedias || []).filter((_, i) => i !== deleteConfirmation.index)
            }));
        } else if (deleteConfirmation.type === 'child' && deleteConfirmation.index !== null) {
            setFormData((prev: CustomerFormData) => ({
                ...prev,
                children: (prev.children || []).filter((_, i) => i !== deleteConfirmation.index)
            }));
        }
        setDeleteConfirmation({ isOpen: false, type: null, index: null });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">

            {/* MAIN APPLICANT - SECTION 1: Personal Info */}
            <Card className="border-border-strong">
                <CardHeader className="bg-blue-50/50 border-b border-border-strong pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-chaiyo-blue">
                        <User className="w-5 h-5" />
                        ข้อมูลส่วนตัว (ผู้กู้หลัก)
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    {formData.verificationStatus === 'WATCHLIST' && (
                        <div className="bg-orange-50 border border-orange-200 text-orange-800 p-3 rounded-md mb-4">
                            <div className="flex items-center gap-2 text-sm font-bold mb-1">
                                <AlertTriangle className="w-4 h-4" />
                                บุคคลนี้อยู่ใน Watchlist
                            </div>
                            <div className="text-sm ml-6 mb-2">กรุณาตรวจสอบเอกสารเพิ่มเติม</div>
                            {formData.watchlistReasons && formData.watchlistReasons.length > 0 && (
                                <div className="flex flex-wrap gap-2 ml-6">
                                    {formData.watchlistReasons.map((reason: string, idx: number) => (
                                        <Badge key={idx} variant="outline" className="border-orange-200 bg-white text-orange-700">
                                            {reason}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    <div className="space-y-6 pt-2">
                        {/* Sub-section 1: General Info */}
                        <div className="rounded-xl border border-gray-200 bg-gray-50/40 p-5">
                            <div className="space-y-4">
                                <div className="pb-2 border-b border-gray-100 mb-4">
                                    <h3 className="text-sm font-bold text-gray-700">ข้อมูลทั่วไป</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label>คำนำหน้า <span className="text-red-500">*</span></Label>
                                        <Input value={formData.prefix || ""} disabled className="bg-gray-50 text-gray-600 h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>เพศ <span className="text-red-500">*</span></Label>
                                        <Select value={formData.gender || ""} onValueChange={(val) => handleChange("gender", val)}>
                                            <SelectTrigger className="h-12 bg-white">
                                                <SelectValue placeholder="ระบุเพศ" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ชาย">ชาย</SelectItem>
                                                <SelectItem value="หญิง">หญิง</SelectItem>
                                                <SelectItem value="ไม่ระบุ">ไม่ระบุ</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>ชื่อเล่น <span className="text-red-500">*</span></Label>
                                        <Input
                                            value={formData.nickname || ""}
                                            onChange={(e) => handleChange("nickname", e.target.value)}
                                            placeholder="ระบุชื่อเล่น"
                                            className="h-12 bg-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>ชื่อจริง <span className="text-red-500">*</span></Label>
                                        <Input value={formData.firstName || ""} disabled className="bg-gray-50 text-gray-600 h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>ชื่อกลาง</Label>
                                        <Input value={formData.middleName || ""} disabled className="bg-gray-50 text-gray-600 h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>นามสกุล <span className="text-red-500">*</span></Label>
                                        <Input value={formData.lastName || ""} disabled className="bg-gray-50 text-gray-600 h-12" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>ชื่อจริง (ภาษาอังกฤษ) <span className="text-red-500">*</span></Label>
                                        <Input
                                            value={formData.firstNameEn || ""}
                                            onChange={(e) => handleChange("firstNameEn", e.target.value)}
                                            placeholder="First Name"
                                            disabled={formData.verificationMethod === 'DIPCHIP'}
                                            className={cn("h-12", formData.verificationMethod === 'DIPCHIP' ? "bg-gray-50 text-gray-600" : "bg-white")}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>ชื่อกลาง (ภาษาอังกฤษ)</Label>
                                        <Input
                                            value={formData.middleNameEn || ""}
                                            onChange={(e) => handleChange("middleNameEn", e.target.value)}
                                            placeholder="Middle Name"
                                            disabled={formData.verificationMethod === 'DIPCHIP'}
                                            className={cn("h-12", formData.verificationMethod === 'DIPCHIP' ? "bg-gray-50 text-gray-600" : "bg-white")}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>นามสกุล (ภาษาอังกฤษ) <span className="text-red-500">*</span></Label>
                                        <Input
                                            value={formData.lastNameEn || ""}
                                            onChange={(e) => handleChange("lastNameEn", e.target.value)}
                                            placeholder="Last Name"
                                            disabled={formData.verificationMethod === 'DIPCHIP'}
                                            className={cn("h-12", formData.verificationMethod === 'DIPCHIP' ? "bg-gray-50 text-gray-600" : "bg-white")}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>วันเดือนปีเกิด <span className="text-red-500">*</span></Label>
                                        <DatePickerBE
                                            value={formData.birthDate || ""}
                                            onChange={(val) => handleChange("birthDate", val)}
                                            disabled
                                            inputClassName="h-12"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>อายุ <span className="text-red-500">*</span></Label>
                                        <Input
                                            value={(() => {
                                                if (!formData.birthDate) return "";
                                                const parts = formData.birthDate.split('-');
                                                if (parts.length < 1) return "";
                                                const y = parseInt(parts[0]);
                                                if (isNaN(y)) return "";
                                                const today = new Date();
                                                const age = today.getFullYear() - y;
                                                return age >= 0 ? age.toString() : "0";
                                            })()}
                                            disabled
                                            className="bg-gray-50 text-gray-600 h-12"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>ระดับการศึกษา <span className="text-red-500">*</span></Label>
                                        <Select
                                            value={formData.educationLevel || ""}
                                            onValueChange={(val) => handleChange("educationLevel", val)}
                                        >
                                            <SelectTrigger className="h-12 bg-white">
                                                <SelectValue placeholder="เลือกระดับการศึกษา" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {EDUCATION_LEVELS.map((level) => (
                                                    <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>


                                </div>
                            </div>
                        </div>

                        {/* Sub-section 2: ID Card Info */}
                        <div className="rounded-xl border border-gray-200 bg-gray-50/40 p-5">
                            <div className="space-y-4">
                                <div className="pb-2 border-b border-gray-100 mb-4">
                                    <h3 className="text-sm font-bold text-gray-700">ข้อมูลบัตรประจำตัว</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                                    <div className="space-y-2">
                                        <div className="flex items-end justify-between min-h-[20px]">
                                            <Label>ประเภทบัตรประจำตัว <span className="text-red-500">*</span></Label>
                                        </div>
                                        <Input
                                            value={ID_TYPES.find(t => t.value.toLowerCase() === (formData.idType || "thai_id").toLowerCase())?.label || "บัตรประชาชนไทย"}
                                            disabled
                                            className="bg-gray-50 text-gray-600 h-12"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-end justify-between min-h-[20px]">
                                            <Label>{formData.cardType === 'PINK_CARD' ? "เลขประจำตัว" : "เลขที่บัตรประจำตัว"} <span className="text-red-500">*</span></Label>
                                        </div>
                                        <Input
                                            value={formData.idNumber}
                                            disabled
                                            className="bg-gray-50 text-gray-600 font-mono h-12"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-end justify-between min-h-[20px]">
                                            <Label>ประเทศที่ออกบัตร <span className="text-red-500">*</span></Label>
                                        </div>
                                        {formData.verificationMethod === 'DIPCHIP' ? (
                                            <Input
                                                value={formData.issueCountry || "Thailand"}
                                                disabled
                                                className="bg-gray-50 text-gray-600 h-12"
                                            />
                                        ) : (
                                            <Select
                                                value={formData.issueCountry || "Thailand"}
                                                onValueChange={(val) => handleChange("issueCountry", val)}
                                            >
                                                <SelectTrigger className="h-12 bg-white">
                                                    <SelectValue placeholder="เลือกประเทศที่ออกบัตร" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {COUNTRIES.map(c => (
                                                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-end justify-between min-h-[20px]">
                                            <Label>สัญชาติ <span className="text-red-500">*</span></Label>
                                        </div>
                                        {formData.verificationMethod === 'DIPCHIP' ? (
                                            <Input
                                                value={formData.nationality || "Thai"}
                                                disabled
                                                className="bg-gray-50 text-gray-600 h-12"
                                            />
                                        ) : (
                                            <Select
                                                value={formData.nationality || ""}
                                                onValueChange={(val) => handleChange("nationality", val)}
                                            >
                                                <SelectTrigger className="h-12 bg-white">
                                                    <SelectValue placeholder="เลือกสัญชาติ" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {COUNTRIES.map(c => (
                                                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-end justify-between min-h-[20px]">
                                            <Label>วันที่ออกบัตร <span className="text-red-500">*</span></Label>
                                        </div>
                                        <Input
                                            value={
                                                formData.verificationMethod === 'DIPCHIP' ?
                                                    formatDateToThai(formData.issueDate) || "" :
                                                    (formData.issueDateDisplay !== undefined ? formData.issueDateDisplay : formatDateToThai(formData.issueDate) || "")
                                            }
                                            onChange={(e) => {
                                                if (formData.verificationMethod === 'DIPCHIP') return;
                                                let val = e.target.value.replace(/[^0-9-]/g, '');
                                                if (val.length > 8) val = val.slice(0, 8);
                                                let formattedVal = "";
                                                if (val.length > 0) {
                                                    formattedVal = val.slice(0, 2);
                                                    if (val.length > 2) {
                                                        formattedVal += '/' + val.slice(2, 4);
                                                        if (val.length > 4) {
                                                            formattedVal += '/' + val.slice(4, 8);
                                                        }
                                                    }
                                                }
                                                handleChange("issueDateDisplay", formattedVal);

                                                if (val.length === 8) {
                                                    const dStr = val.slice(0, 2);
                                                    const mStr = val.slice(2, 4);
                                                    const yStr = val.slice(4, 8);
                                                    const d = dStr === '--' ? '00' : dStr;
                                                    const m = mStr === '--' ? '00' : mStr;
                                                    const y = parseInt(yStr);
                                                    let realYearAD = y;
                                                    if (y > 2400) realYearAD = y - 543;
                                                    handleChange('issueDate', `${realYearAD}-${m}-${d}`);
                                                }
                                            }}
                                            disabled={formData.verificationMethod === 'DIPCHIP'}
                                            className={cn("h-12", formData.verificationMethod === 'DIPCHIP' ? "bg-gray-50 text-gray-600" : "bg-white focus:border-chaiyo-blue")}
                                            placeholder="DD/MM/YYYY"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-end justify-between min-h-[20px]">
                                            <Label>วันหมดอายุบัตร {!formData.isLifetime && <span className="text-red-500">*</span>}</Label>
                                            {formData.verificationMethod !== 'DIPCHIP' && (
                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        id="idIsLifetime"
                                                        checked={formData.isLifetime || false}
                                                        onCheckedChange={(checked) => handleChange("isLifetime", !!checked)}
                                                    />
                                                    <Label htmlFor="idIsLifetime" className="text-[10px] font-bold text-muted-foreground cursor-pointer leading-none">ตลอดชีพ</Label>
                                                </div>
                                            )}
                                        </div>
                                        <Input
                                            value={
                                                formData.isLifetime ? "-" :
                                                    (formData.verificationMethod === 'DIPCHIP' ?
                                                        formatDateToThai(formData.expiryDate) || "" :
                                                        (formData.expiryDateDisplay !== undefined ? formData.expiryDateDisplay : formatDateToThai(formData.expiryDate) || ""))
                                            }
                                            onChange={(e) => {
                                                if (formData.verificationMethod === 'DIPCHIP' || formData.isLifetime) return;
                                                let val = e.target.value.replace(/[^0-9-]/g, '');
                                                if (val.length > 8) val = val.slice(0, 8);
                                                let formattedVal = "";
                                                if (val.length > 0) {
                                                    formattedVal = val.slice(0, 2);
                                                    if (val.length > 2) {
                                                        formattedVal += '/' + val.slice(2, 4);
                                                        if (val.length > 4) {
                                                            formattedVal += '/' + val.slice(4, 8);
                                                        }
                                                    }
                                                }
                                                handleChange("expiryDateDisplay", formattedVal);

                                                if (val.length === 8) {
                                                    const dStr = val.slice(0, 2);
                                                    const mStr = val.slice(2, 4);
                                                    const yStr = val.slice(4, 8);
                                                    const d = dStr === '--' ? '00' : dStr;
                                                    const m = mStr === '--' ? '00' : mStr;
                                                    const y = parseInt(yStr);
                                                    let realYearAD = y;
                                                    if (y > 2400) realYearAD = y - 543;
                                                    handleChange('expiryDate', `${realYearAD}-${m}-${d}`);
                                                }
                                            }}
                                            disabled={formData.verificationMethod === 'DIPCHIP' || formData.isLifetime}
                                            className={cn("h-12", (formData.verificationMethod === 'DIPCHIP' || formData.isLifetime) ? "bg-gray-50 text-gray-600" : "bg-white focus:border-chaiyo-blue")}
                                            placeholder={formData.isLifetime ? "ตลอดชีพ" : "DD/MM/YYYY"}
                                        />
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* MAIN APPLICANT - SECTION 2: Address Info */}
            <Card className="border-border-strong">
                <CardHeader className="bg-blue-50/50 border-b border-border-strong pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-chaiyo-blue">
                        <MapPin className="w-5 h-5" />
                        ที่อยู่ (ผู้กู้หลัก)
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="space-y-6 pt-2">

                        {/* Address 1: ID Card Address */}
                        <div className="rounded-xl border border-gray-200 bg-gray-50/40 p-5">
                            <AddressForm
                                title="ที่อยู่ตามบัตรประชาชน"
                                prefix=""
                                formData={formData}
                                onChange={handleChange}
                                disabled={false}
                            />
                        </div>

                        {/* Address 2: Current Address */}
                        <div className="rounded-xl border border-gray-200 bg-gray-50/40 p-5">
                            <AddressForm
                                title="ที่อยู่ปัจจุบัน"
                                prefix="current"
                                formData={formData}
                                onChange={handleChange}
                                hideFields={!!(formData.currentAddressSource && formData.currentAddressSource !== 'new')}
                                headerChildren={
                                    <div className="space-y-4 mb-4 mt-2">
                                        <div className="space-y-2">
                                            <Label className="text-sm">เลือกที่อยู่ปัจจุบัน</Label>
                                            <Select
                                                value={formData.currentAddressSource || (formData.isCurrentSameAsId ? "id" : "new")}
                                                onValueChange={(val) => {
                                                    handleChange("currentAddressSource", val);
                                                    handleChange("isCurrentSameAsId", val === 'id');
                                                }}
                                            >
                                                <SelectTrigger className="h-12 bg-white">
                                                    <SelectValue placeholder="เลือกแหล่งที่มาของที่อยู่" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="id">ที่อยู่ตามบัตรประชาชน</SelectItem>
                                                    <SelectItem value="new">ระบุที่อยู่ใหม่</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {formData.currentAddressSource === 'id' && (
                                            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl text-sm text-chaiyo-blue flex items-center gap-2">
                                                <Info className="w-4 h-4" />
                                                ใช้ข้อมูลที่อยู่เดียวกับที่อยู่ตามบัตรประชาชน
                                            </div>
                                        )}
                                    </div>
                                }
                                footerChildren={
                                    <div className="mt-6 space-y-6 pt-6 border-t border-gray-100">
                                        <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                            ลักษณะที่อยู่อาศัย
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                            <div className="space-y-2">
                                                <Label>ลักษณะที่อยู่อาศัย <span className="text-red-500">*</span></Label>
                                                <Select
                                                    value={formData.currentHousingType || ""}
                                                    onValueChange={(val) => handleChange("currentHousingType", val)}
                                                >
                                                    <SelectTrigger className="h-12 bg-white">
                                                        <SelectValue placeholder="ระบุลักษณะที่อยู่อาศัย" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="บ้านเดี่ยว 2 ชั้น">บ้านเดี่ยว 2 ชั้น</SelectItem>
                                                        <SelectItem value="บ้านเดี่ยว 1 ชั้น">บ้านเดี่ยว 1 ชั้น</SelectItem>
                                                        <SelectItem value="ทาวน์เฮ้าส์">ทาวน์เฮ้าส์</SelectItem>
                                                        <SelectItem value="อาคารพาณิชย์/ตึกแถว">อาคารพาณิชย์/ตึกแถว</SelectItem>
                                                        <SelectItem value="บ้านพักสวัสดิการ">บ้านพักสวัสดิการ</SelectItem>
                                                        <SelectItem value="เพิง">เพิง</SelectItem>
                                                        <SelectItem value="อื่น ๆ">อื่น ๆ (โปรดระบุ)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {formData.currentHousingType === "อื่น ๆ" && (
                                                    <Input
                                                        className="mt-2 h-12 bg-white"
                                                        placeholder="โปรดระบุลักษณะที่อยู่อาศัย"
                                                        value={formData.currentHousingTypeOther || ""}
                                                        onChange={(e) => handleChange("currentHousingTypeOther", e.target.value)}
                                                    />
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label>สถานะที่อยู่อาศัย <span className="text-red-500">*</span></Label>
                                                <Select
                                                    value={formData.currentHousingStatus || ""}
                                                    onValueChange={(val) => handleChange("currentHousingStatus", val)}
                                                >
                                                    <SelectTrigger className="h-12 bg-white">
                                                        <SelectValue placeholder="ระบุสถานะที่อยู่อาศัย" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="เป็นของตนเอง (เป็นเจ้าบ้าน)">เป็นของตนเอง (เป็นเจ้าบ้าน)</SelectItem>
                                                        <SelectItem value="เป็นผู้อาศัย">เป็นผู้อาศัย</SelectItem>
                                                        <SelectItem value="เช่า">เช่า</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>ระยะเวลาที่พักอาศัย <span className="text-red-500">*</span></Label>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 flex items-center gap-2">
                                                        <Input
                                                            type="number"
                                                            className="h-12 bg-white text-center"
                                                            placeholder="0"
                                                            value={formData.housingDurationYears || ""}
                                                            onChange={(e) => handleChange("housingDurationYears", e.target.value)}
                                                        />
                                                        <span className="text-sm text-muted-foreground whitespace-nowrap">ปี</span>
                                                    </div>
                                                    <div className="flex-1 flex items-center gap-2">
                                                        <Input
                                                            type="number"
                                                            className="h-12 bg-white text-center"
                                                            placeholder="0"
                                                            max={11}
                                                            value={formData.housingDurationMonths || ""}
                                                            onChange={(e) => handleChange("housingDurationMonths", e.target.value)}
                                                        />
                                                        <span className="text-sm text-muted-foreground whitespace-nowrap">เดือน</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label>อาศัยอยู่กับใคร <span className="text-red-500">*</span></Label>
                                                    <Select
                                                        value={formData.currentResidentType || ""}
                                                        onValueChange={(val) => {
                                                            handleChange("currentResidentType", val);
                                                            if (val === "อยู่คนเดียว") {
                                                                handleChange("currentResidentRelationships", []);
                                                            }
                                                        }}
                                                    >
                                                        <SelectTrigger className="h-12 bg-white">
                                                            <SelectValue placeholder="ระบุผู้ที่พักอาศัยอยู่ด้วยกัน" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="อยู่คนเดียว">อยู่คนเดียว</SelectItem>
                                                            <SelectItem value="อยู่ร่วมกับผู้อื่น โปรดระบุความสัมพันธ์">อยู่ร่วมกับผู้อื่น โปรดระบุความสัมพันธ์</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                {formData.currentResidentType === "อยู่ร่วมกับผู้อื่น โปรดระบุความสัมพันธ์" && (
                                                    <div className="space-y-3 p-4 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                                                        <Label className="text-xs text-muted-foreground">โปรดระบุความสัมพันธ์ (เลือกได้มากกว่า 1)</Label>
                                                        <div className="flex flex-wrap gap-2">
                                                            {["พ่อ", "แม่", "ลูก", "สามี/ภรรยา/แฟน", "ญาติ", "เพื่อน"].map((relation) => {
                                                                const isSelected = formData.currentResidentRelationships?.includes(relation);
                                                                return (
                                                                    <Button
                                                                        key={relation}
                                                                        type="button"
                                                                        variant={isSelected ? "default" : "outline"}
                                                                        className={cn(
                                                                            "h-9 px-3 rounded-full text-xs font-medium transition-all",
                                                                            isSelected ? "bg-chaiyo-blue hover:bg-chaiyo-blue/90" : "bg-white hover:bg-gray-100 border-border-strong text-gray-700"
                                                                        )}
                                                                        onClick={() => {
                                                                            const current = formData.currentResidentRelationships || [];
                                                                            const next = isSelected
                                                                                ? current.filter(r => r !== relation)
                                                                                : [...current, relation];
                                                                            handleChange("currentResidentRelationships", next);
                                                                        }}
                                                                    >
                                                                        {relation}
                                                                    </Button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-span-1 md:col-span-2 mt-2 rounded-xl border border-border-subtle overflow-hidden bg-white">
                                                <YesNoGroup
                                                    label="ท่านพักอาศัยอยู่ที่เดิมเป็นประจำทุกวัน"
                                                    value={formData.isLivingHereEveryday}
                                                    onChange={(val) => handleChange("isLivingHereEveryday", val)}
                                                />
                                                <YesNoGroup
                                                    label="สถานที่พักปัจจุบันตั้งอยู่บนที่ดินที่ติดการจำนอง"
                                                    value={formData.isResidingOnMortgagedLand}
                                                    onChange={(val) => handleChange("isResidingOnMortgagedLand", val)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                }
                            />
                        </div>

                        {/* Address 3: Shipping Address */}
                        <div className="rounded-xl border border-gray-200 bg-gray-50/40 p-5">
                            <AddressForm
                                title="ที่อยู่จัดส่งเอกสาร"
                                prefix="shipping"
                                formData={formData}
                                onChange={handleChange}
                                hideFields={!!(formData.shippingAddressSource && formData.shippingAddressSource !== 'new')}
                                headerChildren={
                                    <div className="space-y-4 mb-4 mt-2">
                                        <div className="space-y-2">
                                            <Label className="text-sm">เลือกที่อยู่จัดส่งเอกสาร</Label>
                                            <Select
                                                value={formData.shippingAddressSource || (formData.isShippingSameAsCurrent ? "current" : "new")}
                                                onValueChange={(val) => {
                                                    handleChange("shippingAddressSource", val);
                                                    // Maintain backward compatibility for now if needed, 
                                                    // but primarily use shippingAddressSource
                                                    handleChange("isShippingSameAsCurrent", val === 'current');
                                                }}
                                            >
                                                <SelectTrigger className="h-12 bg-white">
                                                    <SelectValue placeholder="เลือกแหล่งที่มาของที่อยู่" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="id">ที่อยู่ตามบัตรประชาชน</SelectItem>
                                                    <SelectItem value="current">ที่อยู่ปัจจุบัน</SelectItem>
                                                    <SelectItem value="new">ระบุที่อยู่ใหม่</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {formData.shippingAddressSource && formData.shippingAddressSource !== 'new' && (
                                            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl text-sm text-chaiyo-blue flex items-center gap-2">
                                                <Info className="w-4 h-4" />
                                                ใช้ข้อมูลที่อยู่เดียวกับ{
                                                    formData.shippingAddressSource === 'id' ? 'ที่อยู่ตามบัตรประชาชน' : 'ที่อยู่ปัจจุบัน'
                                                }
                                            </div>
                                        )}
                                    </div>
                                }
                            />
                        </div>

                        {/* Address 4: Contact Address */}
                        <div className="rounded-xl border border-gray-200 bg-gray-50/40 p-5">
                            <AddressForm
                                title="ที่อยู่ที่สามารถติดต่อได้"
                                prefix="contact"
                                formData={formData}
                                onChange={handleChange}
                                hideFields={!!(formData.contactAddressSource && formData.contactAddressSource !== 'new')}
                                headerChildren={
                                    <div className="space-y-4 mb-4 mt-2">
                                        <div className="space-y-2">
                                            <Label className="text-sm">เลือกที่อยู่ที่สามารถติดต่อได้</Label>
                                            <Select
                                                value={formData.contactAddressSource || "new"}
                                                onValueChange={(val) => {
                                                    handleChange("contactAddressSource", val);
                                                    if (val !== 'new') {
                                                        // Copy logic if needed, or just let AddressForm handle display
                                                        // For consistency with other forms, we might want to sync data
                                                        // but the user just requested "can use", so selection is enough.
                                                    }
                                                }}
                                            >
                                                <SelectTrigger className="h-12 bg-white">
                                                    <SelectValue placeholder="เลือกแหล่งที่มาของที่อยู่" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="id">ที่อยู่ตามบัตรประชาชน</SelectItem>
                                                    <SelectItem value="current">ที่อยู่ปัจจุบัน</SelectItem>
                                                    <SelectItem value="shipping">ที่อยู่จัดส่งเอกสาร</SelectItem>
                                                    <SelectItem value="new">ระบุที่อยู่ใหม่</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {formData.contactAddressSource && formData.contactAddressSource !== 'new' && (
                                            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl text-sm text-chaiyo-blue flex items-center gap-2">
                                                <Info className="w-4 h-4" />
                                                ใช้ข้อมูลที่อยู่เดียวกับ{
                                                    formData.contactAddressSource === 'id' ? 'ที่อยู่ตามบัตรประชาชน' :
                                                        formData.contactAddressSource === 'current' ? 'ที่อยู่ปัจจุบัน' :
                                                            'ที่อยู่จัดส่งเอกสาร'
                                                }
                                            </div>
                                        )}
                                    </div>
                                }
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* MAIN APPLICANT - SECTION 3: Family Info */}
            <Card className="border-border-strong">
                <CardHeader className="bg-blue-50/50 border-b border-border-strong pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-chaiyo-blue">
                        <Home className="w-5 h-5" />
                        ข้อมูลครอบครัว (ผู้กู้หลัก)
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                        <div className="space-y-2">
                            <Label>สถานะการสมรส <span className="text-red-500">*</span></Label>
                            <Select
                                value={formData.maritalStatus || ""}
                                onValueChange={(val) => handleChange("maritalStatus", val)}
                            >
                                <SelectTrigger className="h-12 bg-white">
                                    <SelectValue placeholder="เลือกสถานะการสมรส" />
                                </SelectTrigger>
                                <SelectContent>
                                    {MARITAL_STATUSES.map((status) => (
                                        <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>หัวหน้าครัวเรือนเป็นผู้กู้ <span className="text-red-500">*</span></Label>
                            <Select
                                value={formData.isHouseholdHeadBorrower === true ? "true" : (formData.isHouseholdHeadBorrower === false ? "false" : "")}
                                onValueChange={(val) => handleChange("isHouseholdHeadBorrower", val === "true")}
                            >
                                <SelectTrigger className="h-12 bg-white">
                                    <SelectValue placeholder="เลือกการเป็นหัวหน้าครัวเรือน" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">ใช่</SelectItem>
                                    <SelectItem value="false">ไม่ใช่</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>เพศหัวหน้าครัวเรือน <span className="text-red-500">*</span></Label>
                            <Select
                                value={formData.householdHeadGender || (formData.isHouseholdHeadBorrower ? formData.gender : "") || ""}
                                onValueChange={(val) => handleChange("householdHeadGender", val)}
                            >
                                <SelectTrigger className="h-12 bg-white">
                                    <SelectValue placeholder="เลือกเพศ" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ชาย">ชาย</SelectItem>
                                    <SelectItem value="หญิง">หญิง</SelectItem>
                                    <SelectItem value="ไม่ระบุ">ไม่ระบุ</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>อายุหัวหน้าครัวเรือน <span className="text-red-500">*</span></Label>
                            <Input
                                type="number"
                                className="h-12 bg-white"
                                placeholder="ระบุอายุ"
                                value={formData.householdHeadAge || (formData.isHouseholdHeadBorrower ? formData.age : "") || ""}
                                onChange={(e) => handleChange("householdHeadAge", e.target.value)}
                            />
                        </div>


                    </div>

                    <div className="mt-8 space-y-4 pt-6 border-t border-border-subtle">
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                            <Users className="w-4 h-4 text-chaiyo-blue" /> จำนวนสมาชิกในครอบครัว
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-2 group">
                                <Label className="group-focus-within:text-chaiyo-blue transition-colors">มีงานทำ (คน)</Label>
                                <Input
                                    type="number"
                                    className="h-12 bg-white focus-visible:ring-chaiyo-blue/20"
                                    placeholder="0"
                                    value={formData.employedFamilyCount || ""}
                                    onChange={(e) => handleChange("employedFamilyCount", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2 group">
                                <Label className="group-focus-within:text-chaiyo-blue transition-colors">ไม่มีงานทำ (คน)</Label>
                                <Input
                                    type="number"
                                    className="h-12 bg-white focus-visible:ring-chaiyo-blue/20"
                                    placeholder="0"
                                    value={formData.unemployedFamilyCount || ""}
                                    onChange={(e) => handleChange("unemployedFamilyCount", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-500">รวมจำนวนสมาชิกในครอบครัว (คน)</Label>
                                <div className="h-12 rounded-xl flex items-center justify-between group transition-all duration-300 hover:bg-chaiyo-blue/[0.05] hover:border-chaiyo-blue/20">

                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-2xl font-black text-chaiyo-blue tabular-nums">
                                            {(Number(formData.employedFamilyCount) || 0) + (Number(formData.unemployedFamilyCount) || 0)}
                                        </span>
                                        <span className="text-[10px] font-bold text-chaiyo-blue/60 uppercase tracking-wider">คน</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 space-y-4 pt-6 border-t border-border-subtle">
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                            <Users className="w-4 h-4 text-chaiyo-blue" /> ความสัมพันธ์และภาระค่าใช้จ่าย
                        </div>
                        <div className="border border-border-strong rounded-xl overflow-hidden bg-white">
                            <Table>
                                <TableHeader className="bg-gray-50/50">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="w-[180px]">ความสัมพันธ์</TableHead>
                                        <TableHead className="w-[200px]">สถานะ</TableHead>
                                        <TableHead className="w-[140px]">อายุ</TableHead>
                                        <TableHead>มีค่าใช้จ่ายประกัน</TableHead>
                                        <TableHead>มีภาระใช้จ่ายสุขภาพ</TableHead>

                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {[
                                        { id: 'father', label: 'พ่อ' },
                                        { id: 'mother', label: 'แม่' },
                                        { id: 'spouse', label: 'คู่สมรส' }
                                    ].map((rel) => {
                                        const memberData = formData.familyMembers?.[rel.id] || { status: 'living_together' };

                                        const updateMember = (field: string, val: unknown) => {
                                            const currentMembers = formData.familyMembers || {};
                                            handleChange("familyMembers", {
                                                ...currentMembers,
                                                [rel.id]: {
                                                    ...(currentMembers[rel.id] || { status: 'living_together' }),
                                                    [field]: val
                                                }
                                            });
                                        };

                                        return (
                                            <TableRow key={rel.id} className="border-b border-border-subtle transition-colors hover:bg-gray-50/50">
                                                <TableCell className="font-bold text-gray-800">{rel.label}</TableCell>
                                                <TableCell>
                                                    <Select
                                                        value={memberData.status || "living_together"}
                                                        onValueChange={(val) => updateMember("status", val)}
                                                    >
                                                        <SelectTrigger className="h-12 bg-white">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="living_together">อยู่ด้วยกัน</SelectItem>
                                                            <SelectItem value="separated">แยกกันอยู่</SelectItem>
                                                            <SelectItem value="deceased">เสียชีวิตแล้ว</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {memberData.status !== 'deceased' ? (
                                                        <Input
                                                            type="number"
                                                            placeholder="อายุ"
                                                            className="h-12 bg-white"
                                                            value={memberData.age || ""}
                                                            onChange={(e) => updateMember("age", e.target.value)}
                                                        />
                                                    ) : (
                                                        <span className="text-muted-foreground">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="flex justify-center w-full min-w-[120px]">
                                                        {memberData.status !== 'deceased' ? (
                                                            <Select
                                                                value={memberData.hasInsurance || "no"}
                                                                onValueChange={(val) => updateMember("hasInsurance", val)}
                                                            >
                                                                <SelectTrigger className="h-12 bg-white">
                                                                    <SelectValue placeholder="เลือก" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="yes">มี</SelectItem>
                                                                    <SelectItem value="no">ไม่มี</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        ) : (
                                                            <span className="text-muted-foreground">-</span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="flex justify-center w-full min-w-[180px]">
                                                        {memberData.status !== 'deceased' ? (
                                                            <Select
                                                                value={memberData.hasHealthExp || "no"}
                                                                onValueChange={(val) => updateMember("hasHealthExp", val)}
                                                            >
                                                                <SelectTrigger className="h-12 bg-white">
                                                                    <SelectValue placeholder="เลือก" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="yes">มี</SelectItem>
                                                                    <SelectItem value="no">ไม่มี</SelectItem>
                                                                    <SelectItem value="temporary">มีชั่วคราว (ภายในช่วง 3-6 เดือน)</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        ) : (
                                                            <span className="text-muted-foreground">-</span>
                                                        )}
                                                    </div>
                                                </TableCell>

                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* Children Table */}
                    <div className="mt-8 space-y-4 pt-6 border-t border-border-subtle">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                <Users className="w-4 h-4 text-chaiyo-blue" /> ข้อมูลบุตร
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleAddChild}
                            >
                                <Plus className="w-4 h-4 mr-1" /> เพิ่มข้อมูลบุตร
                            </Button>
                        </div>
                        <div className="border border-border-strong rounded-xl overflow-hidden bg-white">
                            <Table>
                                <TableHeader className="bg-gray-50/50">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="w-[80px] text-center">ลำดับ</TableHead>
                                        <TableHead className="w-[200px]">อายุ (ปี)</TableHead>
                                        <TableHead>อาชีพ</TableHead>
                                        <TableHead className="w-[100px] text-center">จัดการ</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(!formData.children || formData.children.length === 0) ? (
                                        <TableRow className="hover:bg-transparent">
                                            <TableCell colSpan={4} className="text-center text-muted-foreground py-10 bg-gray-50/30">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Users className="w-8 h-8 text-gray-300" />
                                                    <p>ยังไม่มีข้อมูลบุตร</p>
                                                    <p className="text-xs text-gray-400">คลิก &quot;เพิ่มข้อมูลบุตร&quot; เพื่อเริ่มรายการ</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        formData.children.map((child, idx) => (
                                            <TableRow key={idx} className="hover:bg-gray-50/50 transition-colors group">
                                                <TableCell className="text-center font-medium py-3 text-gray-600">{idx + 1}</TableCell>
                                                <TableCell className="py-3">
                                                    <Input
                                                        type="number"
                                                        value={child.age || ""}
                                                        onChange={(e) => handleUpdateChild(idx, "age", e.target.value)}
                                                        placeholder="ระบุอายุ"
                                                        className="h-12 bg-white"
                                                    />
                                                </TableCell>
                                                <TableCell className="py-3">
                                                    <Select
                                                        value={child.occupation || "student"}
                                                        onValueChange={(val) => handleUpdateChild(idx, "occupation", val)}
                                                    >
                                                        <SelectTrigger className="h-12 bg-white">
                                                            <SelectValue placeholder="เลือกอาชีพ" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="student">นักเรียน/นักศึกษา</SelectItem>
                                                            <SelectItem value="employee">พนักงานบริษัท</SelectItem>
                                                            <SelectItem value="government">ข้าราชการ</SelectItem>
                                                            <SelectItem value="farmer">เกษตรกร</SelectItem>
                                                            <SelectItem value="owner">เจ้าของกิจการ</SelectItem>
                                                            <SelectItem value="freelance">รับจ้างทั่วไป</SelectItem>
                                                            <SelectItem value="none">ยังไม่เข้าเรียน/ว่างงาน</SelectItem>
                                                            <SelectItem value="other">อื่นๆ</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                                <TableCell className="py-3 text-center">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-9 w-9 p-0 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                        onClick={() => handleRemoveChild(idx)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                </CardContent>
            </Card>


            {/* MAIN APPLICANT - SECTION 4: Contact Info */}
            <Card className="border-border-strong">
                <CardHeader className="bg-blue-50/50 border-b border-border-strong pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-chaiyo-blue">
                        <Phone className="w-5 h-5" />
                        ข้อมูลการติดต่อ (ผู้กู้หลัก)
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="space-y-4 pt-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                            {/* Phone Verification Field */}
                            <div className="space-y-2">
                                <Label>เบอร์โทรศัพท์มือถือ <span className="text-red-500">*</span></Label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            value={formData.phone || ""}
                                            placeholder="08x-xxx-xxxx"
                                            className={cn(
                                                "pl-9 font-mono h-12",
                                                isOtpVerified && "border-green-500 bg-green-50 text-green-700"
                                            )}
                                            onChange={(e) => {
                                                if (isOtpVerified) setIsOtpVerified(false); // Reset if changed
                                                handleChange("phone", formatPhoneNumber(e.target.value));
                                            }}
                                            disabled={isOtpVerified}
                                        />
                                        {isOtpVerified && (
                                            <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                                        )}
                                    </div>
                                    {!isOtpVerified && (
                                        <Button
                                            variant="outline"
                                            onClick={handleSendOtp}
                                            disabled={!formData.phone || formData.phone.replace(/\D/g, '').length < 10}
                                            className="shrink-0 h-12 border-chaiyo-blue text-chaiyo-blue hover:bg-blue-50"
                                        >
                                            ยืนยันเบอร์มือถือ
                                        </Button>
                                    )}
                                </div>
                                {isOtpVerified && (
                                    <div className={cn(
                                        "mt-3 p-4 rounded-xl animate-in fade-in slide-in-from-top-2 duration-500",
                                        phoneOwnershipStatus === 'success' ? "bg-green-50 border border-green-200" : "bg-blue-50/50 border border-blue-100"
                                    )}>
                                        {phoneOwnershipStatus === 'success' ? (
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-sm">
                                                        <ShieldCheck className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-green-800">ตรวจสอบเบอร์มือถือสำเร็จ</p>
                                                        <p className="text-[11px] text-green-600 font-medium">ยืนยันความเป็นเจ้าของเบอร์เรียบร้อยแล้ว</p>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 px-2 text-green-700 hover:bg-green-100/50 text-[10px] font-bold"
                                                    onClick={() => {
                                                        handleChange("phoneOwnershipProof", null);
                                                        setPhoneOwnershipStatus('idle');
                                                    }}
                                                >
                                                    แก้ไขข้อมูล
                                                </Button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex items-center gap-2 mb-3 text-chaiyo-blue font-bold">
                                                    <span className="text-sm">ตรวจสอบเบอร์มือถือ</span>
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="bg-white border border-blue-100 p-3 rounded-lg">
                                                        <p className="text-xs text-gray-500 mb-2">ให้ลูกค้ากดรหัสเพื่อยืนยันความเป็นเจ้าของจากมือถือ:</p>
                                                        <div className="bg-gray-50 p-2 rounded-md font-mono text-center text-sm font-bold text-chaiyo-blue tracking-wider border border-gray-100">
                                                            *179*เลขบัตรประชาชน 13 หลัก# โทรออก
                                                        </div>
                                                        <p className="text-[10px] text-gray-400 mt-2 italic">* กรุณาแคปหน้าจอผลลัพธ์เพื่อนำมาอัปโหลด</p>
                                                    </div>

                                                    {formData.phoneOwnershipProof ? (
                                                        <div className="space-y-3">
                                                            <div className="flex items-center justify-between bg-white border border-red-100 p-2.5 rounded-lg">
                                                                <span className="truncate max-w-[200px] font-medium flex items-center gap-2 text-xs text-gray-700">
                                                                    <AlertCircle className="w-4 h-4 text-red-500" />
                                                                    {formData.phoneOwnershipProof.name}
                                                                </span>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                                                                    onClick={() => {
                                                                        handleChange("phoneOwnershipProof", null);
                                                                        setPhoneOwnershipStatus('idle');
                                                                    }}
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </Button>
                                                            </div>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={handleVerifyPhoneOwnership}
                                                                disabled={!formData.phone || !formData.idNumber}
                                                                className={cn(
                                                                    "w-full h-11 rounded-xl transition-all duration-300 font-bold bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:text-red-800"
                                                                )}
                                                            >
                                                                <div className="flex items-center gap-2 justify-center">
                                                                    <AlertCircle className="w-4 h-4 text-red-500" />
                                                                    ข้อมูลไม่ตรงกัน - ตรวจสอบอีกครั้ง
                                                                </div>
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <Input
                                                                type="file"
                                                                id="phoneOwnershipProof"
                                                                className="hidden"
                                                                accept="image/*"
                                                                onChange={(e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (file) {
                                                                        handleChange("phoneOwnershipProof", file);
                                                                        e.target.value = '';
                                                                        handleVerifyPhoneOwnership();
                                                                    }
                                                                }}
                                                            />
                                                            <Button
                                                                variant="outline"
                                                                className="w-full h-11 border-dashed border-chaiyo-blue/50 text-chaiyo-blue bg-white hover:bg-blue-50/50 rounded-xl"
                                                                onClick={() => document.getElementById('phoneOwnershipProof')?.click()}
                                                            >
                                                                <Upload className="w-4 h-4 mr-2" />
                                                                อัปโหลดรูปภาพ
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* Phone OTP Dialog */}
                                <Dialog open={showOtpInput} onOpenChange={setShowOtpInput}>
                                    <DialogContent className="max-w-[400px] p-6">
                                        <DialogHeader className="items-center text-center">
                                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-2">
                                                <Smartphone className="w-6 h-6 text-chaiyo-blue" />
                                            </div>
                                            <DialogTitle className="text-xl font-bold text-gray-900">ยืนยันเบอร์โทรศัพท์</DialogTitle>
                                            <DialogDescription className="text-sm text-gray-500">
                                                กรุณากรอกรหัส OTP ที่ส่งไปยังเบอร์ {formData.phone}
                                                {otpRef && <span className="block mt-1 font-bold text-gray-700">(Ref: {otpRef})</span>}
                                            </DialogDescription>
                                        </DialogHeader>

                                        <div className="flex flex-col items-center py-6">
                                            <InputOTP
                                                maxLength={6}
                                                value={otp}
                                                onChange={(val) => {
                                                    setOtp(val);
                                                    if (otpError) setOtpError("");
                                                }}
                                            >
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} className={cn("h-12 w-10 sm:w-12 text-lg", otpError && "border-red-500")} />
                                                    <InputOTPSlot index={1} className={cn("h-12 w-10 sm:w-12 text-lg", otpError && "border-red-500")} />
                                                    <InputOTPSlot index={2} className={cn("h-12 w-10 sm:w-12 text-lg", otpError && "border-red-500")} />
                                                    <InputOTPSlot index={3} className={cn("h-12 w-10 sm:w-12 text-lg", otpError && "border-red-500")} />
                                                    <InputOTPSlot index={4} className={cn("h-12 w-10 sm:w-12 text-lg", otpError && "border-red-500")} />
                                                    <InputOTPSlot index={5} className={cn("h-12 w-10 sm:w-12 text-lg", otpError && "border-red-500")} />
                                                </InputOTPGroup>
                                            </InputOTP>

                                            {otpError && (
                                                <p className="mt-4 text-xs font-medium text-red-500 animate-in fade-in slide-in-from-top-1">
                                                    {otpError}
                                                </p>
                                            )}

                                            <button
                                                type="button"
                                                className="mt-6 text-sm font-medium text-chaiyo-blue hover:underline disabled:text-gray-400"
                                                disabled={otpTimer > 0}
                                                onClick={handleSendOtp}
                                            >
                                                {otpTimer > 0 ? `ขอรหัสใหม่ใน ${otpTimer} วินาที` : "ส่งรหัสอีกครั้ง"}
                                            </button>
                                        </div>

                                        <DialogFooter className="flex flex-col sm:flex-row gap-3">
                                            <Button
                                                variant="outline"
                                                className="flex-1 h-12 rounded-xl text-gray-600 order-2 sm:order-1"
                                                onClick={() => setShowOtpInput(false)}
                                            >
                                                ยกเลิก
                                            </Button>
                                            <Button
                                                className="flex-1 h-12 rounded-xl bg-chaiyo-blue text-white hover:bg-chaiyo-blue/90 order-1 sm:order-2"
                                                onClick={handleVerifyOtp}
                                                disabled={otp.length !== 6 || isVerifyingOtp}
                                            >
                                                {isVerifyingOtp ? (
                                                    <div className="flex items-center gap-2">
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        กำลังตรวจสอบ...
                                                    </div>
                                                ) : "ยืนยันรหัส OTP"}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <Label>อีเมล</Label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                value={formData.email || ""}
                                                placeholder="example@email.com"
                                                className={cn(
                                                    "pl-9 h-12",
                                                    isEmailOtpVerified && "border-green-500 bg-green-50 text-green-700"
                                                )}
                                                onChange={(e) => {
                                                    if (isEmailOtpVerified) setIsEmailOtpVerified(false);
                                                    handleChange("email", e.target.value);
                                                }}
                                                disabled={isEmailOtpVerified}
                                            />
                                            {isEmailOtpVerified && (
                                                <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                                            )}
                                        </div>
                                        {!isEmailOtpVerified && (
                                            <Button
                                                variant="outline"
                                                onClick={handleSendEmailOtp}
                                                disabled={!formData.email || !formData.email.includes('@')}
                                                className="shrink-0 h-12 border-chaiyo-blue text-chaiyo-blue hover:bg-blue-50"
                                            >
                                                ยืนยันอีเมล
                                            </Button>
                                        )}
                                    </div>

                                    {/* Email OTP Dialog */}
                                    <Dialog open={showEmailOtpInput} onOpenChange={setShowEmailOtpInput}>
                                        <DialogContent className="max-w-[400px] p-6">
                                            <DialogHeader className="items-center text-center">
                                                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-2">
                                                    <Mail className="w-6 h-6 text-chaiyo-blue" />
                                                </div>
                                                <DialogTitle className="text-xl font-bold text-gray-900">ยืนยันอีเมล</DialogTitle>
                                                <DialogDescription className="text-sm text-gray-500">
                                                    กรุณากรอกรหัส OTP ที่ส่งไปยังอีเมล {formData.email}
                                                    {emailOtpRef && <span className="block mt-1 font-bold text-gray-700">(Ref: {emailOtpRef})</span>}
                                                </DialogDescription>
                                            </DialogHeader>

                                            <div className="flex flex-col items-center py-6">
                                                <InputOTP
                                                    maxLength={6}
                                                    value={emailOtp}
                                                    onChange={(val) => {
                                                        setEmailOtp(val);
                                                        if (emailOtpError) setEmailOtpError("");
                                                    }}
                                                >
                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={0} className={cn("h-12 w-10 sm:w-12 text-lg", emailOtpError && "border-red-500")} />
                                                        <InputOTPSlot index={1} className={cn("h-12 w-10 sm:w-12 text-lg", emailOtpError && "border-red-500")} />
                                                        <InputOTPSlot index={2} className={cn("h-12 w-10 sm:w-12 text-lg", emailOtpError && "border-red-500")} />
                                                        <InputOTPSlot index={3} className={cn("h-12 w-10 sm:w-12 text-lg", emailOtpError && "border-red-500")} />
                                                        <InputOTPSlot index={4} className={cn("h-12 w-10 sm:w-12 text-lg", emailOtpError && "border-red-500")} />
                                                        <InputOTPSlot index={5} className={cn("h-12 w-10 sm:w-12 text-lg", emailOtpError && "border-red-500")} />
                                                    </InputOTPGroup>
                                                </InputOTP>

                                                {emailOtpError && (
                                                    <p className="mt-4 text-xs font-medium text-red-500 animate-in fade-in slide-in-from-top-1">
                                                        {emailOtpError}
                                                    </p>
                                                )}

                                                <button
                                                    type="button"
                                                    className="mt-6 text-sm font-medium text-chaiyo-blue hover:underline disabled:text-gray-400"
                                                    disabled={emailOtpTimer > 0}
                                                    onClick={handleSendEmailOtp}
                                                >
                                                    {emailOtpTimer > 0 ? `ขอรหัสใหม่ใน ${emailOtpTimer} วินาที` : "ส่งรหัสอีกครั้ง"}
                                                </button>
                                            </div>

                                            <DialogFooter className="flex flex-col sm:flex-row gap-3">
                                                <Button
                                                    variant="outline"
                                                    className="flex-1 h-12 rounded-xl text-gray-600 order-2 sm:order-1"
                                                    onClick={() => setShowEmailOtpInput(false)}
                                                >
                                                    ยกเลิก
                                                </Button>
                                                <Button
                                                    className="flex-1 h-12 rounded-xl bg-chaiyo-blue text-white hover:bg-chaiyo-blue/90 order-1 sm:order-2"
                                                    onClick={handleVerifyEmailOtp}
                                                    disabled={emailOtp.length !== 6 || isVerifyingEmailOtp}
                                                >
                                                    {isVerifyingEmailOtp ? (
                                                        <div className="flex items-center gap-2">
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                            กำลังตรวจสอบ...
                                                        </div>
                                                    ) : "ยืนยันรหัส OTP"}
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                {/* Home Telephone Field */}
                                <div className="space-y-2">
                                    <Label>เบอร์โทรศัพท์บ้าน</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            value={formData.homePhone || ""}
                                            placeholder="02-xxx-xxxx"
                                            className="pl-9 font-mono h-12"
                                            onChange={(e) => handleChange("homePhone", formatPhoneNumber(e.target.value))}
                                        />
                                    </div>
                                </div>
                                {/* LINE ID Field */}
                                <div className="space-y-2">
                                    <Label>LINE ID <span className="text-red-500">*</span></Label>
                                    <div className="relative">
                                        <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            value={formData.lineId || ""}
                                            placeholder="@lineid"
                                            className="pl-9 h-12"
                                            onChange={(e) => handleChange("lineId", e.target.value)}
                                        />
                                    </div>
                                </div>

                            </div>


                        </div>

                        {/* SOCIAL MEDIAS SECTION */}
                        <div className="space-y-4 pt-4">
                            <div className="flex items-center justify-between mb-2">
                                <Label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-chaiyo-blue" /> เครือข่ายสังคมออนไลน์ (Social Media)
                                </Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleAddSocialMedia}
                                >
                                    <Plus className="w-4 h-4 mr-1" /> เพิ่มบัญชีโซเชียลมีเดีย
                                </Button>
                            </div>

                            <div className="border border-border-strong rounded-xl overflow-hidden bg-white">
                                <Table>
                                    <TableHeader className="bg-gray-50/80">
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead className="w-[80px] text-center">ลำดับ</TableHead>
                                            <TableHead className="w-[30%]">แพลตฟอร์ม</TableHead>
                                            <TableHead>ชื่อบัญชี / ID / Link</TableHead>
                                            <TableHead className="w-[80px] text-center">จัดการ</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {(!formData.socialMedias || formData.socialMedias.length === 0) ? (
                                            <TableRow className="hover:bg-transparent">
                                                <TableCell colSpan={4} className="text-center text-muted-foreground py-10 bg-gray-50/30">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Globe className="w-8 h-8 text-gray-300" />
                                                        <p>ยังไม่มีข้อมูลโซเชียลมีเดีย</p>
                                                        <p className="text-xs text-gray-400">คลิก &quot;เพิ่มบัญชีโซเชียลมีเดีย&quot; เพื่อเริ่มรายการ</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            formData.socialMedias.map((item, idx) => (
                                                <TableRow key={idx} className="hover:bg-gray-50/50 transition-colors group">
                                                    <TableCell className="text-center font-medium py-3 text-gray-600">{idx + 1}</TableCell>
                                                    <TableCell className="py-3">
                                                        <Select
                                                            value={item.platform}
                                                            onValueChange={(val) => handleUpdateSocialMedia(idx, "platform", val)}
                                                        >
                                                            <SelectTrigger className="h-10 bg-white border-gray-200">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {SOCIAL_PLATFORMS.map(p => (
                                                                    <SelectItem key={p.value} value={p.value}>
                                                                        <div className="flex items-center gap-2">
                                                                            <SocialIcon platform={p.value} />
                                                                            <span>{p.label}</span>
                                                                        </div>
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </TableCell>
                                                    <TableCell className="py-3">
                                                        <Input
                                                            value={item.accountName}
                                                            onChange={(e) => handleUpdateSocialMedia(idx, "accountName", e.target.value)}
                                                            placeholder="ระบุชื่อบัญชีหรือ ID"
                                                            className="h-10 bg-white border-gray-200 focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue"
                                                        />
                                                    </TableCell>
                                                    <TableCell className="py-3 text-center">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-9 w-9 p-0 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                            onClick={() => handleRemoveSocialMedia(idx)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* QUESTIONNAIRE SECTION */}
            <Card className="border-border-strong">
                <CardHeader className="bg-blue-50/50 border-b border-border-strong pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-chaiyo-blue">
                        <ClipboardList className="w-5 h-5" />
                        แบบสอบถาม
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="flex flex-col gap-4">
                        {/* Sub-section 1: Extra Income */}
                        <div className="rounded-xl border border-gray-200 bg-gray-50/40 p-5 space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <Wallet className="w-4 h-4 text-chaiyo-blue" />
                                </div>
                                <h3 className="text-sm font-bold text-gray-700">การหารายได้เสริม</h3>
                            </div>

                            <div className="space-y-4 pt-2">
                                {/* Skill Select */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">ความสามารถพิเศษอื่นๆ ที่จะสร้างรายได้เพิ่ม</Label>
                                    <Select
                                        value={formData.qExtraSkill}
                                        onValueChange={(val) => handleChange("qExtraSkill", val)}
                                    >
                                        <SelectTrigger className="h-12 bg-white rounded-xl border-gray-200">
                                            <SelectValue placeholder="เลือกความสามารถพิเศษ" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">ไม่มี</SelectItem>
                                            <SelectItem value="cooking">ทำกับข้าวขาย</SelectItem>
                                            <SelectItem value="online_sales">ขายของออนไลน์</SelectItem>
                                            <SelectItem value="labor">รับจ้างใช้แรงงาน</SelectItem>
                                            <SelectItem value="housekeeper">แม่บ้าน พนักงานทำความสะอาด</SelectItem>
                                            <SelectItem value="musician">เล่นดนตรี นักร้อง</SelectItem>
                                            <SelectItem value="caregiver">เลี้ยงเด็ก ดูแลผู้ป่วย</SelectItem>
                                            <SelectItem value="other">อื่นๆ โปรดระบุ</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {formData.qExtraSkill === "other" && (
                                        <div className="pt-1">
                                            <Input
                                                placeholder="โปรดระบุความสามารถพิเศษ"
                                                value={formData.qExtraSkillOther || ""}
                                                onChange={(e) => handleChange("qExtraSkillOther", e.target.value)}
                                                className="h-12 bg-white rounded-xl border-gray-200"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Known Apps Multi-select */}
                                <div className="space-y-3 pt-2">
                                    <Label className="text-sm font-bold text-gray-700">แอปที่รู้จัก และใช้เป็น</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {[
                                            { id: "Tiktok", label: "Tiktok", logo: "/application/tiktok.png" },
                                            { id: "Shoppee", label: "Shoppee", logo: "/application/shoppee.png" },
                                            { id: "Lazada", label: "Lazada", logo: "/application/lazada.png" },
                                            { id: "Grab", label: "Grab", logo: "/application/grab.png" },
                                            { id: "Lineman", label: "Lineman", logo: "/application/lineman.png" },
                                        ].map((app) => {
                                            const isSelected = (formData.qAppsKnown || []).includes(app.id);
                                            return (
                                                <div key={app.id} className={cn(
                                                    "flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer group",
                                                    isSelected
                                                        ? "border-chaiyo-blue bg-blue-50/30 shadow-sm"
                                                        : "border-gray-200 bg-white hover:border-chaiyo-blue/30"
                                                )}
                                                    onClick={() => {
                                                        const currentApps = formData.qAppsKnown || [];
                                                        const newApps = currentApps.includes(app.id)
                                                            ? currentApps.filter(a => a !== app.id)
                                                            : [...currentApps, app.id];
                                                        handleChange("qAppsKnown", newApps);
                                                    }}>
                                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 overflow-hidden bg-white border border-gray-100">
                                                        <img src={app.logo} alt={app.label} className="w-full h-full object-contain" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <Label className="text-sm font-bold cursor-pointer block truncate">{app.label}</Label>
                                                    </div>
                                                    <Checkbox
                                                        id={`app-${app.id}`}
                                                        checked={isSelected}
                                                        onCheckedChange={() => { }}
                                                        className="rounded-md"
                                                    />
                                                </div>
                                            );
                                        })}
                                        <div className={cn(
                                            "flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer",
                                            (formData.qAppsKnown || []).includes("อื่นๆ")
                                                ? "border-chaiyo-blue bg-blue-50/30 shadow-sm"
                                                : "border-gray-200 bg-white hover:border-chaiyo-blue/30"
                                        )}
                                            onClick={() => {
                                                const app = "อื่นๆ";
                                                const currentApps = formData.qAppsKnown || [];
                                                const newApps = currentApps.includes(app)
                                                    ? currentApps.filter(a => a !== app)
                                                    : [...currentApps, app];
                                                handleChange("qAppsKnown", newApps);
                                            }}>
                                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                                                <MoreHorizontal className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <Label className="text-sm font-bold cursor-pointer block truncate">อื่นๆ โปรดระบุ</Label>
                                            </div>
                                            <Checkbox
                                                id="app-other"
                                                checked={(formData.qAppsKnown || []).includes("อื่นๆ")}
                                                onCheckedChange={() => { }}
                                                className="rounded-md"
                                            />
                                        </div>
                                    </div>
                                    {(formData.qAppsKnown || []).includes("อื่นๆ") && (
                                        <div className="pt-1">
                                            <Input
                                                placeholder="โปรดระบุแอปอื่นๆ"
                                                value={formData.qAppsKnownOther || ""}
                                                onChange={(e) => handleChange("qAppsKnownOther", e.target.value)}
                                                className="h-12 bg-white rounded-xl border-gray-200"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Intention Rating */}
                                <div className="pt-2 border-t border-gray-100">
                                    <div className="bg-blue-50/50 border border-blue-100/50 p-4 rounded-xl space-y-2 mb-2">
                                        <div className="flex items-start gap-2 text-xs text-blue-800 leading-relaxed italic">
                                            <div>
                                                <p>กรุณาประเมินพฤติกรรมทางการเงินที่เกี่ยวข้องกับลูกค้า เลือกในช่องที่ตรงกับความเห็นของท่านมากที่สุดเพียงข้อเดียว (5 เห็นด้วยมากที่สุด)</p>
                                            </div>
                                        </div>
                                    </div>
                                    <RatingGroup
                                        label="ความตั้งใจ ในการสร้างรายได้ เพื่อชำระหนี้"
                                        value={formData.qDebtRepaymentIntention}
                                        onChange={(v) => handleChange("qDebtRepaymentIntention", v)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sub-section 2: Financial Behavior */}
                        <div className="rounded-xl border border-gray-200 bg-gray-50/40 p-5 space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                <div className="w-8 h-8 rounded-lg bg-gold-100 flex items-center justify-center" style={{ backgroundColor: 'rgba(255, 209, 0, 0.1)' }}>
                                    <TrendingUp className="w-4 h-4 text-[#FFD100]" />
                                </div>
                                <h3 className="text-sm font-bold text-gray-700">พฤติกรรมทางการเงิน</h3>
                            </div>
                            <div className="bg-blue-50/50 border border-blue-100/50 p-4 rounded-xl space-y-2 mb-2">
                                <div className="flex items-start gap-2 text-xs text-blue-800 leading-relaxed italic">
                                    <div>
                                        <p>กรุณาประเมินพฤติกรรมทางการเงินที่เกี่ยวข้องกับลูกค้า เลือกในช่องที่ตรงกับความเห็นของท่านมากที่สุดเพียงข้อเดียว (5 เห็นด้วยมากที่สุด)</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-0 text-gray-800">
                                <RatingGroup
                                    label="ก่อนที่ท่านจะซื้อสินค้า ท่านได้ไตร่ตรองอย่างถี่ถ้วน ว่ามีเงินพอจ่ายได้"
                                    value={formData.qFinancialPonder}
                                    onChange={(v) => handleChange("qFinancialPonder", v)}
                                />
                                <RatingGroup
                                    label="ท่านชำระเงินค่าใช้จ่ายต่างๆ ตรงเวลา"
                                    value={formData.qFinancialOnTime}
                                    onChange={(v) => handleChange("qFinancialOnTime", v)}
                                />
                                <RatingGroup
                                    label="ท่านดูแลเรื่องเงินของตัวเองอย่างใกล้ชิด เช่นรู้ว่ามีรายได้ และรายจ่ายเท่าไหร่"
                                    value={formData.qFinancialCloseMonitor}
                                    onChange={(v) => handleChange("qFinancialCloseMonitor", v)}
                                />
                                <RatingGroup
                                    label="ท่านมีวางแผนตั้งเป้าหมายทางการเงินระยะยาว อย่างน้อย 1-3 ปี"
                                    value={formData.qFinancialLongTermGoal}
                                    onChange={(v) => handleChange("qFinancialLongTermGoal", v)}
                                />
                                <RatingGroup
                                    label="ในการซื้อสินค้าหรือบริการท่านเปรียบเทียบข้อมูลก่อนการซื้อ และศึกษาข้อมูลจากแหล่งที่เหมาะสมก่อนตัดสินใจซื้อ"
                                    value={formData.qFinancialCompareInfo}
                                    onChange={(v) => handleChange("qFinancialCompareInfo", v)}
                                />
                            </div>
                        </div>

                        {/* Sub-section 3: Debt Repayment */}
                        <div className="rounded-xl border border-gray-200 bg-gray-50/40 p-5 space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                                    <CreditCard className="w-4 h-4 text-emerald-600" />
                                </div>
                                <h3 className="text-sm font-bold text-gray-700">การชำระหนี้</h3>
                            </div>
                            <div className="bg-blue-50/50 border border-blue-100/50 p-4 rounded-xl space-y-2 mb-2">
                                <div className="flex items-start gap-2 text-xs text-blue-800 leading-relaxed italic">
                                    <div>
                                        <p>กรุณาประเมินพฤติกรรมทางการเงินที่เกี่ยวข้องกับลูกค้า เลือกในช่องที่ตรงกับความเห็นของท่านมากที่สุดเพียงข้อเดียว (5 เห็นด้วยมากที่สุด)</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-0 text-gray-800">
                                <RatingGroup
                                    label="ท่านมีความกังวลข้อมูลเครดิต"
                                    value={formData.qCreditConcern}
                                    onChange={(v) => handleChange("qCreditConcern", v)}
                                />
                                <RatingGroup
                                    label="ท่านมีความกังวลในการชำระหนี้ที่มีการค้างชำระอยู่"
                                    value={formData.qDebtConcern}
                                    onChange={(v) => handleChange("qDebtConcern", v)}
                                />
                                <RatingGroup
                                    label="ท่านมีความกังวลหลักประกันที่จะถูกยึด"
                                    value={formData.qCollateralConcern}
                                    onChange={(v) => handleChange("qCollateralConcern", v)}
                                />
                            </div>
                        </div>

                        {/* Sub-section 4: Delinquency */}
                        <div className="rounded-xl border border-gray-200 bg-gray-50/40 p-5 space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                                    <AlertCircle className="w-4 h-4 text-red-500" />
                                </div>
                                <h3 className="text-sm font-bold text-gray-700">การค้างชำระ</h3>
                            </div>
                            <div className="flex flex-col gap-4">
                                <div className="rounded-xl border border-gray-100 bg-white/40 overflow-hidden">
                                    <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100 flex items-center gap-2">
                                        <div className="w-1 h-4 bg-chaiyo-blue rounded-full" />
                                        <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">หากจำเป็นต้องค้างชำระเงินกู้อาจเกิดจากปัญหาด้านใด</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <YesNoGroup
                                            label="ต้นทุนสูงขึ้น (ค่าใช้จ่ายของการผลิตสูงขึ้น)"
                                            value={formData.qDelinquencyHigherCost}
                                            onChange={(v) => handleChange("qDelinquencyHigherCost", v)}
                                        />
                                        <YesNoGroup
                                            label="ขายสินค้าไม่ออก เช่นผลิตมากเกินไป หรือขาดตลาดไม่ต้องการ"
                                            value={formData.qDelinquencyUnsold}
                                            onChange={(v) => handleChange("qDelinquencyUnsold", v)}
                                        />
                                        <YesNoGroup
                                            label="มีรายจ่ายหนี้สินอื่นๆ"
                                            value={formData.qDelinquencyOtherDebt}
                                            onChange={(v) => handleChange("qDelinquencyOtherDebt", v)}
                                        />
                                        <YesNoGroup
                                            label="มีค่าใช้จ่ายภายในครอบครัว"
                                            value={formData.qDelinquencyFamilyExpense}
                                            onChange={(v) => handleChange("qDelinquencyFamilyExpense", v)}
                                        />
                                        <YesNoGroup
                                            label="มีค่าใช้จ่ายในการศึกษาบุตรเพิ่มขึ้น"
                                            value={formData.qDelinquencyEducationExpense}
                                            onChange={(v) => handleChange("qDelinquencyEducationExpense", v)}
                                        />
                                        <YesNoGroup
                                            label="อุบัติเหตุ/ความเจ็บป่วยหรือถึงแก่กรรม"
                                            value={formData.qDelinquencyAccident}
                                            onChange={(v) => handleChange("qDelinquencyAccident", v)}
                                        />
                                    </div>
                                </div>
                                <div className="rounded-xl border border-gray-100 bg-white/40 overflow-hidden">
                                    <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100 flex items-center gap-2">
                                        <div className="w-1 h-4 bg-chaiyo-blue rounded-full" />
                                        <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">หากจำเป็นต้องมีการค้างชำระเงินกู้อาจเกิดจากสาเหตุใด</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <YesNoGroup
                                            label="เกิดปัญหาในครอบครัวเช่นหย่าร้าง หรือคู่สมรสเสียชีวิต"
                                            value={formData.qDelinquencyFamilyDispute}
                                            onChange={(v) => handleChange("qDelinquencyFamilyDispute", v)}
                                        />
                                        <YesNoGroup
                                            label="กิจการที่ทำอยู่ประสบปัญหา"
                                            value={formData.qDelinquencyBusinessProblem}
                                            onChange={(v) => handleChange("qDelinquencyBusinessProblem", v)}
                                        />
                                        <YesNoGroup
                                            label="ประสบปัญหาด้านสุขภาพ"
                                            value={formData.qDelinquencyHealthProblem}
                                            onChange={(v) => handleChange("qDelinquencyHealthProblem", v)}
                                        />
                                        <YesNoGroup
                                            label="มีค่าใช้จ่ายหลายทาง/ภาระค่าใช้จ่ายสูง"
                                            value={formData.qDelinquencyHighExpense}
                                            onChange={(v) => handleChange("qDelinquencyHighExpense", v)}
                                        />
                                        <YesNoGroup
                                            label="การย้ายถิ่นที่อยู่อาศัย"
                                            value={formData.qDelinquencyRelocation}
                                            onChange={(v) => handleChange("qDelinquencyRelocation", v)}
                                        />
                                        <YesNoGroup
                                            label="ขาดความเข้าใจในกระบวนการ/ขั้นตอนการจัดการหนี้"
                                            value={formData.qDelinquencyDebtProcessIgnorance}
                                            onChange={(v) => handleChange("qDelinquencyDebtProcessIgnorance", v)}
                                        />
                                        <YesNoGroup
                                            label="ถูกฟ้องให้ชำระหนี้สิน"
                                            value={formData.qDelinquencyLawsuit}
                                            onChange={(v) => handleChange("qDelinquencyLawsuit", v)}
                                        />
                                        <YesNoGroup
                                            label="ย้ายไปประกอบธุรกิจที่จังหวัดอื่น"
                                            value={formData.qDelinquencyMoveBusiness}
                                            onChange={(v) => handleChange("qDelinquencyMoveBusiness", v)}
                                        />
                                        <YesNoGroup
                                            label="ภาวะทางเศรษฐกิจ"
                                            value={formData.qDelinquencyEconomy}
                                            onChange={(v) => handleChange("qDelinquencyEconomy", v)}
                                        />
                                        <YesNoGroup
                                            label="เกิดภัยธรรมชาติ"
                                            value={formData.qDelinquencyNaturalDisaster}
                                            onChange={(v) => handleChange("qDelinquencyNaturalDisaster", v)}
                                        />
                                        <YesNoGroup
                                            label="รัฐบาลเปลี่ยนแปลงนโยบายบ่อย"
                                            value={formData.qDelinquencyGovernmentPolicy}
                                            onChange={(v) => handleChange("qDelinquencyGovernmentPolicy", v)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {
                false && (
                    <>
                        {/* CO-BORROWERS SECTION */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <Users className="w-5 h-5 text-gray-800" />
                                    ผู้กู้ร่วม
                                    <span className="text-sm font-normal text-muted-foreground ml-2">(สามารถเพิ่มได้หลายคน)</span>
                                </h3>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={startAddCoBorrower}
                                >
                                    <Plus className="w-4 h-4 mr-2" /> เพิ่มผู้กู้ร่วม
                                </Button>
                            </div>

                            {/* List of Co-Borrowers */}
                            {formData.coBorrowers && formData.coBorrowers.length > 0 && (
                                <Card className="overflow-hidden border-border-strong">
                                    <Table>
                                        <TableHeader className="bg-gray-50">
                                            <TableRow className="hover:bg-gray-50">
                                                <TableHead className="w-[35%] text-gray-700">ชื่อ-นามสกุล</TableHead>
                                                <TableHead className="w-[30%] text-gray-700">{formData.cardType === 'PINK_CARD' ? 'เลขประจำตัว' : 'เลขบัตรประชาชน'}</TableHead>
                                                <TableHead className="w-[25%] text-gray-700">ความสัมพันธ์</TableHead>
                                                <TableHead className="w-[10%] text-gray-700"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {formData.coBorrowers.map((person, index) => (
                                                <TableRow key={index} className="table-row-hover group">
                                                    <TableCell className="font-medium py-3">
                                                        {person.prefix} {person.firstName} {person.lastName}
                                                        {person.verificationStatus === 'WATCHLIST' && person.watchlistReasons && person.watchlistReasons.length > 0 && (
                                                            <div className="ml-2 inline-flex gap-1 align-top flex-wrap">
                                                                {person.watchlistReasons.map((r: string, i: number) => (
                                                                    <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                                                                        {r}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="font-mono text-xs py-3">{person.idNumber}</TableCell>
                                                    <TableCell className="py-3">
                                                        {{
                                                            spouse: "คู่สมรส",
                                                            parent: "บิดา/มารดา",
                                                            sibling: "พี่น้อง",
                                                            child: "บุตร/ธิดา",
                                                            friend: "เพื่อน/คนรู้จัก",
                                                            other: "อื่นๆ"
                                                        }[person.relationship as string] || person.relationship}
                                                    </TableCell>
                                                    <TableCell className="py-3 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-muted-foreground hover:text-chaiyo-blue hover:bg-blue-50 h-8 w-8 p-0 rounded-full"
                                                                onClick={() => handleEditCoBorrower(index)}
                                                            >
                                                                <Pencil className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 rounded-full"
                                                                onClick={() => handleRemoveCoBorrower(index)}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Card>
                            )}

                            {/* Add Co-Borrower Dialog */}
                            <Dialog open={isAddingCoBorrower} onOpenChange={setIsAddingCoBorrower}>
                                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                                    {coBorrowerStage === 'KYC' ? (
                                        <KYCProcess
                                            title="ยืนยันตัวตนผู้กู้ร่วม (eKYC)"
                                            onComplete={handleCoBorrowerKYCComplete}
                                            onCancel={() => setIsAddingCoBorrower(false)}
                                        />
                                    ) : (
                                        <>
                                            <DialogHeader>
                                                <DialogTitle className="text-chaiyo-blue flex items-center gap-2">
                                                    <UserPlus className="w-5 h-5" /> {editingCoBorrowerIndex !== null ? "แก้ไขข้อมูลผู้กู้ร่วม" : "เพิ่มข้อมูลผู้กู้ร่วม"}
                                                </DialogTitle>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                {newCoBorrower.verificationStatus === 'WATCHLIST' && (
                                                    <div className="bg-orange-50 border border-orange-200 text-orange-800 p-3 rounded-md mb-4">
                                                        <div className="flex items-center gap-2 text-sm font-bold mb-2">
                                                            <AlertTriangle className="w-4 h-4" />
                                                            บุคคลนี้อยู่ใน Watchlist - กรุณาตรวจสอบเอกสารเพิ่มเติม
                                                        </div>
                                                        {(newCoBorrower.watchlistReasons || []).length > 0 && (
                                                            <div className="flex flex-wrap gap-2 ml-6">
                                                                {(newCoBorrower.watchlistReasons || []).map
                                                                    ((reason: string, idx: number) => (
                                                                        <Badge key={idx} variant="outline" className="border-orange-200 bg-white text-orange-700">
                                                                            {reason}
                                                                        </Badge>
                                                                    ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>ความสัมพันธ์กับผู้กู้ <span className="text-red-500">*</span></Label>
                                                        <Select
                                                            value={newCoBorrower.relationship}
                                                            onValueChange={(val) => setNewCoBorrower({ ...newCoBorrower, relationship: val })}
                                                        >
                                                            <SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="spouse">คู่สมรส</SelectItem>
                                                                <SelectItem value="parent">บิดา/มารดา</SelectItem>
                                                                <SelectItem value="sibling">พี่น้อง</SelectItem>
                                                                <SelectItem value="child">บุตร/ธิดา</SelectItem>
                                                                <SelectItem value="other">อื่นๆ</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>{formData.cardType === 'PINK_CARD' ? 'เลขประจำตัว' : 'เลขบัตรประชาชน'}</Label>
                                                        <Input
                                                            className="font-mono"
                                                            value={newCoBorrower.idNumber}
                                                            onChange={(e) => setNewCoBorrower({ ...newCoBorrower, idNumber: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>คำนำหน้า</Label>
                                                        <Select
                                                            value={newCoBorrower.prefix}
                                                            onValueChange={(val) => {
                                                                const updatedCoBorrower = { ...newCoBorrower, prefix: val };
                                                                if (val === 'นาย') {
                                                                    updatedCoBorrower.gender = 'ชาย';
                                                                } else if (val === 'นาง' || val === 'นางสาว') {
                                                                    updatedCoBorrower.gender = 'หญิง';
                                                                }
                                                                setNewCoBorrower(updatedCoBorrower);
                                                            }}
                                                        >
                                                            <SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="นาย">นาย</SelectItem>
                                                                <SelectItem value="นาง">นาง</SelectItem>
                                                                <SelectItem value="นางสาว">นางสาว</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>เพศ</Label>
                                                        <Select
                                                            value={newCoBorrower.gender}
                                                            onValueChange={(val) => setNewCoBorrower({ ...newCoBorrower, gender: val })}
                                                        >
                                                            <SelectTrigger><SelectValue placeholder="เลือกเพศ" /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="ชาย">ชาย</SelectItem>
                                                                <SelectItem value="หญิง">หญิง</SelectItem>
                                                                <SelectItem value="ไม่ระบุ">ไม่ระบุ</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>ชื่อจริง</Label>
                                                        <Input
                                                            value={newCoBorrower.firstName}
                                                            onChange={(e) => setNewCoBorrower({ ...newCoBorrower, firstName: e.target.value })}
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>นามสกุล</Label>
                                                        <Input
                                                            value={newCoBorrower.lastName}
                                                            onChange={(e) => setNewCoBorrower({ ...newCoBorrower, lastName: e.target.value })}
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>ชื่อจริง (ภาษาอังกฤษ) <span className="text-red-500">*</span></Label>
                                                        <Input
                                                            value={newCoBorrower.firstNameEn || ""}
                                                            onChange={(e) => setNewCoBorrower({ ...newCoBorrower, firstNameEn: e.target.value })}
                                                            disabled={newCoBorrower.verificationMethod === 'DIPCHIP'}
                                                            className={cn(newCoBorrower.verificationMethod === 'DIPCHIP' ? "bg-gray-50 text-gray-600" : "bg-white")}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>ชื่อกลาง (ภาษาอังกฤษ)</Label>
                                                        <Input
                                                            value={newCoBorrower.middleNameEn || ""}
                                                            onChange={(e) => setNewCoBorrower({ ...newCoBorrower, middleNameEn: e.target.value })}
                                                            disabled={newCoBorrower.verificationMethod === 'DIPCHIP'}
                                                            className={cn(newCoBorrower.verificationMethod === 'DIPCHIP' ? "bg-gray-50 text-gray-600" : "bg-white")}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>นามสกุล (ภาษาอังกฤษ) <span className="text-red-500">*</span></Label>
                                                        <Input
                                                            value={newCoBorrower.lastNameEn || ""}
                                                            onChange={(e) => setNewCoBorrower({ ...newCoBorrower, lastNameEn: e.target.value })}
                                                            disabled={newCoBorrower.verificationMethod === 'DIPCHIP'}
                                                            className={cn(newCoBorrower.verificationMethod === 'DIPCHIP' ? "bg-gray-50 text-gray-600" : "bg-white")}
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>วันเกิด</Label>
                                                        <DatePickerBE
                                                            value={newCoBorrower.birthDate}
                                                            onChange={(val) => setNewCoBorrower({ ...newCoBorrower, birthDate: val })}
                                                            inputClassName="h-12"
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>เบอร์โทรศัพท์มือถือ <span className="text-red-500">*</span></Label>
                                                        <Input
                                                            value={newCoBorrower.phone}
                                                            placeholder="08x-xxx-xxxx"
                                                            className="font-mono"
                                                            onChange={(e) => setNewCoBorrower({ ...newCoBorrower, phone: formatPhoneNumber(e.target.value) })}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="pt-2">
                                                    <AddressForm
                                                        title="ที่อยู่ตามทะเบียนบ้าน"
                                                        formData={newCoBorrower}
                                                        onChange={(field, val) => setNewCoBorrower({ ...newCoBorrower, [field]: val })}
                                                    />
                                                </div>

                                                {/* Additional Info for Co-borrower */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>อาชีพ</Label>
                                                        <Select
                                                            value={newCoBorrower.occupation}
                                                            onValueChange={(val) => setNewCoBorrower({ ...newCoBorrower, occupation: val })}
                                                        >
                                                            <SelectTrigger><SelectValue placeholder="เลือกอาชีพ" /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="พนักงานบริษัท">พนักงานบริษัท</SelectItem>
                                                                <SelectItem value="ข้าราชการ">ข้าราชการ</SelectItem>
                                                                <SelectItem value="เกษตรกร">เกษตรกร</SelectItem>
                                                                <SelectItem value="เจ้าของกิจการ">เจ้าของกิจการ</SelectItem>
                                                                <SelectItem value="รับจ้างทั่วไป">รับจ้างทั่วไป</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>รายได้สุทธิต่อเดือน (บาท)</Label>
                                                        <Input
                                                            value={newCoBorrower.income}
                                                            placeholder="0.00"
                                                            className="text-right"
                                                            onChange={(e) => {
                                                                const rawValue = e.target.value.replace(/,/g, '');
                                                                if (!isNaN(Number(rawValue))) {
                                                                    const parts = rawValue.split('.');
                                                                    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                                                    setNewCoBorrower({ ...newCoBorrower, income: parts.join('.') });
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex justify-end pt-4">
                                                    <Button onClick={handleAddCoBorrower} className="bg-chaiyo-blue text-white hover:bg-chaiyo-blue/90">
                                                        <Save className="w-4 h-4 mr-2" /> บันทึกข้อมูล
                                                    </Button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </DialogContent>
                            </Dialog>
                        </div>

                        {/* GUARANTORS SECTION */}
                        <div className="space-y-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-gray-800" />
                                    ผู้ค้ำประกัน
                                    <span className="text-sm font-normal text-muted-foreground ml-2">(สามารถเพิ่มได้หลายคน)</span>
                                </h3>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={startAddGuarantor}
                                >
                                    <Plus className="w-4 h-4 mr-2" /> เพิ่มผู้ค้ำประกัน
                                </Button>
                            </div>

                            {/* List of Guarantors */}
                            {formData.guarantors && formData.guarantors.length > 0 && (
                                <Card className="overflow-hidden border-border-strong">
                                    <Table>
                                        <TableHeader className="bg-gray-50">
                                            <TableRow className="hover:bg-gray-50">
                                                <TableHead className="w-[35%] text-gray-700">ชื่อ-นามสกุล</TableHead>
                                                <TableHead className="w-[30%] text-gray-700">{formData.cardType === 'PINK_CARD' ? 'เลขประจำตัว' : 'เลขบัตรประชาชน'}</TableHead>
                                                <TableHead className="w-[25%] text-gray-700">ความสัมพันธ์</TableHead>
                                                <TableHead className="w-[10%] text-gray-700"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {formData.guarantors.map((person, index) => (
                                                <TableRow key={index} className="table-row-hover group">
                                                    <TableCell className="font-medium py-3">
                                                        {person.prefix} {person.firstName} {person.lastName}
                                                        {person.verificationStatus === 'WATCHLIST' && person.watchlistReasons && person.watchlistReasons.length > 0 && (
                                                            <div className="ml-2 inline-flex gap-1 align-top flex-wrap">
                                                                {person.watchlistReasons.map((r: string, i: number) => (
                                                                    <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                                                                        {r}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="font-mono text-xs py-3">{person.idNumber}</TableCell>
                                                    <TableCell className="py-3">
                                                        {{
                                                            spouse: "คู่สมรส",
                                                            parent: "บิดา/มารดา",
                                                            sibling: "พี่น้อง",
                                                            friend: "เพื่อน/คนรู้จัก",
                                                            other: "อื่นๆ"
                                                        }[person.relationship as string] || person.relationship}
                                                    </TableCell>
                                                    <TableCell className="py-3 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-muted-foreground hover:text-chaiyo-blue hover:bg-blue-50 h-8 w-8 p-0 rounded-full"
                                                                onClick={() => handleEditGuarantor(index)}
                                                            >
                                                                <Pencil className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 rounded-full"
                                                                onClick={() => handleRemoveGuarantor(index)}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Card>
                            )}



                            {/* Add Guarantor Dialog */}
                            <Dialog open={isAddingGuarantor} onOpenChange={setIsAddingGuarantor}>
                                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                                    {guarantorStage === 'KYC' ? (
                                        <KYCProcess
                                            title="ยืนยันตัวตนผู้ค้ำประกัน (eKYC)"
                                            onComplete={handleGuarantorKYCComplete}
                                            onCancel={() => setIsAddingGuarantor(false)}
                                        />
                                    ) : (
                                        <>
                                            <DialogHeader>
                                                <DialogTitle className="text-chaiyo-orange flex items-center gap-2">
                                                    <ShieldCheck className="w-5 h-5" /> {editingGuarantorIndex !== null ? "แก้ไขข้อมูลผู้ค้ำประกัน" : "เพิ่มข้อมูลผู้ค้ำประกัน"}
                                                </DialogTitle>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                {newGuarantor.verificationStatus === 'WATCHLIST' && (
                                                    <div className="bg-orange-50 border border-orange-200 text-orange-800 p-3 rounded-md mb-4">
                                                        <div className="flex items-center gap-2 text-sm font-bold mb-2">
                                                            <AlertTriangle className="w-4 h-4" />
                                                            บุคคลนี้อยู่ใน Watchlist - กรุณาตรวจสอบเอกสารเพิ่มเติม
                                                        </div>
                                                        {(newGuarantor.watchlistReasons || []).length > 0 && (
                                                            <div className="flex flex-wrap gap-2 ml-6">
                                                                {(newGuarantor.watchlistReasons || []).map
                                                                    ((reason: string, idx: number) => (
                                                                        <Badge key={idx} variant="outline" className="border-orange-200 bg-white text-orange-700">
                                                                            {reason}
                                                                        </Badge>
                                                                    ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>ความสัมพันธ์กับผู้กู้ <span className="text-red-500">*</span></Label>
                                                        <Select
                                                            value={newGuarantor.relationship}
                                                            onValueChange={(val) => setNewGuarantor({ ...newGuarantor, relationship: val })}
                                                        >
                                                            <SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="spouse">คู่สมรส</SelectItem>
                                                                <SelectItem value="parent">บิดา/มารดา</SelectItem>
                                                                <SelectItem value="sibling">พี่น้อง</SelectItem>
                                                                <SelectItem value="friend">เพื่อน/คนรู้จัก</SelectItem>
                                                                <SelectItem value="other">อื่นๆ</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>{formData.cardType === 'PINK_CARD' ? 'เลขประจำตัว' : 'เลขบัตรประชาชน'}</Label>
                                                        <Input
                                                            className="font-mono"
                                                            value={newGuarantor.idNumber}
                                                            onChange={(e) => setNewGuarantor({ ...newGuarantor, idNumber: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>คำนำหน้า</Label>
                                                        <Select
                                                            value={newGuarantor.prefix}
                                                            onValueChange={(val) => {
                                                                const updatedGuarantor = { ...newGuarantor, prefix: val };
                                                                if (val === 'นาย') {
                                                                    updatedGuarantor.gender = 'ชาย';
                                                                } else if (val === 'นาง' || val === 'นางสาว') {
                                                                    updatedGuarantor.gender = 'หญิง';
                                                                }
                                                                setNewGuarantor(updatedGuarantor);
                                                            }}
                                                        >
                                                            <SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="นาย">นาย</SelectItem>
                                                                <SelectItem value="นาง">นาง</SelectItem>
                                                                <SelectItem value="นางสาว">นางสาว</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>เพศ</Label>
                                                        <Select
                                                            value={newGuarantor.gender}
                                                            onValueChange={(val) => setNewGuarantor({ ...newGuarantor, gender: val })}
                                                        >
                                                            <SelectTrigger><SelectValue placeholder="เลือกเพศ" /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="ชาย">ชาย</SelectItem>
                                                                <SelectItem value="หญิง">หญิง</SelectItem>
                                                                <SelectItem value="ไม่ระบุ">ไม่ระบุ</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>ชื่อจริง</Label>
                                                        <Input
                                                            value={newGuarantor.firstName}
                                                            onChange={(e) => setNewGuarantor({ ...newGuarantor, firstName: e.target.value })}
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>นามสกุล</Label>
                                                        <Input
                                                            value={newGuarantor.lastName}
                                                            onChange={(e) => setNewGuarantor({ ...newGuarantor, lastName: e.target.value })}
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>ชื่อจริง (ภาษาอังกฤษ) <span className="text-red-500">*</span></Label>
                                                        <Input
                                                            value={newGuarantor.firstNameEn || ""}
                                                            onChange={(e) => setNewGuarantor({ ...newGuarantor, firstNameEn: e.target.value })}
                                                            disabled={newGuarantor.verificationMethod === 'DIPCHIP'}
                                                            className={cn(newGuarantor.verificationMethod === 'DIPCHIP' ? "bg-gray-50 text-gray-600" : "bg-white")}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>ชื่อกลาง (ภาษาอังกฤษ)</Label>
                                                        <Input
                                                            value={newGuarantor.middleNameEn || ""}
                                                            onChange={(e) => setNewGuarantor({ ...newGuarantor, middleNameEn: e.target.value })}
                                                            disabled={newGuarantor.verificationMethod === 'DIPCHIP'}
                                                            className={cn(newGuarantor.verificationMethod === 'DIPCHIP' ? "bg-gray-50 text-gray-600" : "bg-white")}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>นามสกุล (ภาษาอังกฤษ) <span className="text-red-500">*</span></Label>
                                                        <Input
                                                            value={newGuarantor.lastNameEn || ""}
                                                            onChange={(e) => setNewGuarantor({ ...newGuarantor, lastNameEn: e.target.value })}
                                                            disabled={newGuarantor.verificationMethod === 'DIPCHIP'}
                                                            className={cn(newGuarantor.verificationMethod === 'DIPCHIP' ? "bg-gray-50 text-gray-600" : "bg-white")}
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>วันเกิด</Label>
                                                        <DatePickerBE
                                                            value={newGuarantor.birthDate}
                                                            onChange={(val) => setNewGuarantor({ ...newGuarantor, birthDate: val })}
                                                            inputClassName="h-12"
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>เบอร์โทรศัพท์มือถือ <span className="text-red-500">*</span></Label>
                                                        <Input
                                                            value={newGuarantor.phone}
                                                            placeholder="08x-xxx-xxxx"
                                                            className="font-mono"
                                                            onChange={(e) => setNewGuarantor({ ...newGuarantor, phone: formatPhoneNumber(e.target.value) })}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="pt-2">
                                                    <AddressForm
                                                        title="ที่อยู่ตามทะเบียนบ้าน"
                                                        formData={newGuarantor}
                                                        onChange={(field, val) => setNewGuarantor({ ...newGuarantor, [field]: val })}
                                                    />
                                                </div>

                                                {/* Additional Info for Guarantor */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>อาชีพ</Label>
                                                        <Select
                                                            value={newGuarantor.occupation}
                                                            onValueChange={(val) => setNewGuarantor({ ...newGuarantor, occupation: val })}
                                                        >
                                                            <SelectTrigger><SelectValue placeholder="เลือกอาชีพ" /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="พนักงานบริษัท">พนักงานบริษัท</SelectItem>
                                                                <SelectItem value="ข้าราชการ">ข้าราชการ</SelectItem>
                                                                <SelectItem value="เกษตรกร">เกษตรกร</SelectItem>
                                                                <SelectItem value="เจ้าของกิจการ">เจ้าของกิจการ</SelectItem>
                                                                <SelectItem value="รับจ้างทั่วไป">รับจ้างทั่วไป</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>รายได้สุทธิต่อเดือน (บาท)</Label>
                                                        <Input
                                                            value={newGuarantor.income}
                                                            placeholder="0.00"
                                                            className="text-right"
                                                            onChange={(e) => {
                                                                const rawValue = e.target.value.replace(/,/g, '');
                                                                if (!isNaN(Number(rawValue))) {
                                                                    const parts = rawValue.split('.');
                                                                    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                                                    setNewGuarantor({ ...newGuarantor, income: parts.join('.') });
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex justify-end pt-4">
                                                    <Button onClick={handleAddGuarantor} className="bg-chaiyo-blue text-white hover:bg-chaiyo-blue/90">
                                                        <Save className="w-4 h-4 mr-2" /> บันทึกข้อมูล
                                                    </Button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </DialogContent>
                            </Dialog>
                        </div>
                    </>
                )
            }
            {/* Delete Confirmation Alert Dialog */}
            <AlertDialog open={deleteConfirmation.isOpen} onOpenChange={(open) => !open && setDeleteConfirmation((prev) => ({ ...prev, isOpen: false }))}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>ยืนยันการลบข้อมูล</AlertDialogTitle>
                        <AlertDialogDescription>
                            คุณแน่ใจหรือไม่ที่จะลบข้อมูล{
                                deleteConfirmation.type === 'co-borrower' ? 'ผู้กู้ร่วม' :
                                    deleteConfirmation.type === 'guarantor' ? 'ผู้ค้ำประกัน' :
                                        deleteConfirmation.type === 'child' ? 'บุตร' : 'บัญชีโซเชียลมีเดีย'
                            }นี้?
                            การกระทำนี้ไม่สามารถย้อนกลับได้
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteConfirmation({ isOpen: false, type: null, index: null })}>
                            ยกเลิก
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                            ลบข้อมูล
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={alertDialog.isOpen} onOpenChange={(open) => setAlertDialog({ ...alertDialog, isOpen: open })}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                                alertDialog.variant === "error" ? "bg-red-100" : "bg-blue-100"
                            )}>
                                {alertDialog.variant === "error" ? (
                                    <AlertCircle className="w-5 h-5 text-red-600" />
                                ) : (
                                    <Info className="w-5 h-5 text-blue-600" />
                                )}
                            </div>
                            <AlertDialogTitle className="text-lg">{alertDialog.title}</AlertDialogTitle>
                        </div>
                        <AlertDialogDescription className="text-base mt-2">
                            {alertDialog.description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction className="bg-chaiyo-blue hover:bg-chaiyo-blue/90">
                            ตกลง
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Phone Ownership Verification Dialog */}
            <Dialog open={showPhoneVerifyDialog} onOpenChange={setShowPhoneVerifyDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-center text-xl font-bold flex flex-col items-center gap-4">
                            {isPhoneOwnershipVerifying ? (
                                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center relative">
                                    <div className="absolute inset-0 rounded-full border-4 border-chaiyo-blue/20 border-t-chaiyo-blue animate-spin" />
                                    <Smartphone className="w-8 h-8 text-chaiyo-blue" />
                                </div>
                            ) : phoneOwnershipStatus === 'success' ? (
                                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                                    <ShieldCheck className="w-8 h-8 text-green-600" />
                                </div>
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                                    <AlertCircle className="w-8 h-8 text-red-600" />
                                </div>
                            )}
                            {isPhoneOwnershipVerifying ? "กำลังตรวจสอบข้อมูล" :
                                phoneOwnershipStatus === 'success' ? "ตรวจสอบข้อมูลสำเร็จ" : "ข้อมูลไม่ตรงกัน"}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="py-6 space-y-4">
                        {isPhoneOwnershipVerifying ? (
                            <div className="space-y-4 text-center">
                                <p className="text-gray-600">
                                    กำลังตรวจสอบความถูกต้องของหมายเลขโทรศัพท์กับเลขบัตรประชาชนผ่านระบบผู้ให้บริการเครือข่าย...
                                </p>

                            </div>
                        ) : phoneOwnershipStatus === 'success' ? (
                            <div className="space-y-4">
                                <div className="bg-green-50 border border-green-100 p-4 rounded-xl text-center">
                                    <p className="text-green-800 font-bold mb-1">ผลการตรวจสอบสำเร็จ</p>
                                    <div className="mx-auto w-fit space-y-2 mt-4 text-left">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-green-500" />
                                            <p className="text-green-700 text-sm font-mono tracking-tight">
                                                เบอร์: {formData.phone ? `${formData.phone.slice(0, 3)}-XXX-${formData.phone.slice(-4)}` : "0XX-XXX-XXXX"}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-green-500" />
                                            <p className="text-green-700 text-sm font-mono tracking-tight">
                                                บัตร: {formData.idNumber ? `${formData.idNumber.slice(0, 1)}-XXXX-XXXXX-XX-${formData.idNumber.slice(-1)}` : "X-XXXX-XXXXX-XX-X"}
                                            </p>
                                        </div>
                                    </div>

                                </div>

                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-center">
                                    <p className="text-red-800 font-bold mb-1">ตรวจสอบพบข้อมูลไม่ตรงกัน</p>
                                    <p className="text-red-700 text-sm">
                                        หมายเลขโทรศัพท์ {formData.phone} <span className="font-bold underline">ไม่ได้จดทะเบียน</span> ภายใต้เลขบัตรประชาชน {formData.idNumber?.replace(/(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})/, "$1-$2-$3-$4-$5")}
                                    </p>
                                </div>
                                <div className="p-3 bg-gray-50 text-gray-600 rounded-lg text-xs leading-relaxed border border-gray-100">
                                    <p className="font-bold text-gray-700 mb-1 flex items-center gap-1">
                                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                                        ข้อแนะนำเบื้องต้น:
                                    </p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>ตรวจสอบการพิมพ์เลขหมายโทรศัพท์</li>
                                        <li>ตรวจสอบเลขบัตรประชาชนในระบบ และรูปภาพที่อัพโหลด</li>
                                        <li>ให้ลูกค้ากด *179 เพื่อขอข้อมูลใหม่อีกครั้ง</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>

                    {!isPhoneOwnershipVerifying && (
                        <div className="flex gap-3 pt-2">
                            {phoneOwnershipStatus === 'error' && (
                                <Button
                                    variant="outline"
                                    className="flex-1 h-12 rounded-xl"
                                    onClick={handleVerifyPhoneOwnership}
                                >
                                    ตรวจสอบอีกครั้ง
                                </Button>
                            )}
                            <Button
                                className={cn(
                                    "h-12 rounded-xl px-8",
                                    phoneOwnershipStatus === 'error' ? "flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200" : "w-full bg-chaiyo-blue text-white hover:bg-chaiyo-blue/90"
                                )}
                                onClick={() => setShowPhoneVerifyDialog(false)}
                            >
                                ปิด
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div >
    );
}
