import React, { useState, useEffect } from "react";
import { User, MapPin, Briefcase, UserPlus, Users, X, Info, ShieldCheck, Trash2, Plus, Save, Phone, Loader2, CheckCircle, RefreshCcw, Calendar, AlertTriangle, Mail, Pencil, AlertCircle, Upload, Facebook, Instagram, Twitter, Youtube, MessageCircle, Globe } from "lucide-react";
import { format } from "date-fns";
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
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Textarea } from "@/components/ui/Textarea";
import { Combobox } from "@/components/ui/combobox";
import { cn } from "@/lib/utils";
import { KYCProcess, KYCData } from "@/components/application/KYCProcess";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
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
} from "@/components/ui/alert-dialog";


interface CustomerInfoStepProps {
    formData: any;
    setFormData: (data: any) => void;
}

const AddressForm = ({ title, prefix = "", formData, onChange, disabled = false, headerChildren, hideFields = false }: { title: string, prefix?: string, formData: any, onChange: (field: string, val: any) => void, disabled?: boolean, headerChildren?: React.ReactNode, hideFields?: boolean }) => {
    const getField = (name: string) => prefix ? `${prefix}${name.charAt(0).toUpperCase() + name.slice(1)}` : name;

    // Aggregate address components into a single map query
    const getMapQuery = () => {
        const parts = [
            formData[getField('houseNumber')],
            formData[getField('village')],
            formData[getField('moo')] ? `หมู่ ${formData[getField('moo')]}` : '',
            formData[getField('soi')] ? `ซอย ${formData[getField('soi')]}` : '',
            formData[getField('street')] ? `ถนน ${formData[getField('street')]}` : '',
            formData[getField('subDistrict')],
            formData[getField('district')],
            formData[getField('province')],
            formData[getField('zipCode')]
        ].filter(Boolean);

        return parts.join(' ');
    };

    const handleOpenMap = () => {
        const query = getMapQuery();
        if (query) {
            window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank');
        }
    };

    const hasAddressData = getMapQuery().length > 0;

    return (
        <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    {title}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleOpenMap}
                    disabled={!hasAddressData}
                >
                    <MapPin className="w-3 h-3 mr-1" /> ดูแผนที่
                </Button>
            </div>
            {headerChildren}
            {!hideFields && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {prefix === 'work' && (
                        <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                            <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">ชื่อสถานที่ทำงาน / ชื่อกิจการ <span className="text-red-500">*</span></Label>
                                <Input
                                    className="bg-white"
                                    value={formData[getField('workplaceName')] || ""}
                                    onChange={(e) => onChange(getField('workplaceName'), e.target.value)}
                                    disabled={disabled}
                                    placeholder="ระบุชื่อสถานที่ทำงาน"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">เบอร์ติดต่อที่ทำงาน</Label>
                                <Input
                                    className="bg-white font-mono"
                                    value={formData[getField('workPhone')] || ""}
                                    onChange={(e) => onChange(getField('workPhone'), e.target.value)}
                                    disabled={disabled}
                                    placeholder="02-xxx-xxxx"
                                />
                            </div>
                        </div>
                    )}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 col-span-1 md:col-span-2">
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">เลขที่บ้าน</Label>
                            <Input
                                className="bg-white"
                                value={formData[getField('houseNumber')] || ""}
                                onChange={(e) => onChange(getField('houseNumber'), e.target.value)}
                                disabled={disabled}
                                placeholder="123/45"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">ชั้น</Label>
                            <Input
                                className="bg-white"
                                value={formData[getField('floorNumber')] || ""}
                                onChange={(e) => onChange(getField('floorNumber'), e.target.value)}
                                disabled={disabled}
                                placeholder="เช่น 2"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">หน่วย/ห้อง</Label>
                            <Input
                                className="bg-white"
                                value={formData[getField('unitNumber')] || ""}
                                onChange={(e) => onChange(getField('unitNumber'), e.target.value)}
                                disabled={disabled}
                                placeholder="เช่น 201"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">หมู่ที่</Label>
                            <Input
                                className="bg-white"
                                value={formData[getField('moo')] || ""}
                                onChange={(e) => onChange(getField('moo'), e.target.value)}
                                disabled={disabled}
                                placeholder="เช่น 1"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-1 md:col-span-2">
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">หมู่บ้าน/อาคาร</Label>
                            <Input
                                className="bg-white"
                                value={formData[getField('village')] || ""}
                                onChange={(e) => onChange(getField('village'), e.target.value)}
                                disabled={disabled}
                                placeholder="ชื่อหมู่บ้านหรืออาคาร"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">ซอย</Label>
                            <Input
                                className="bg-white"
                                value={formData[getField('soi')] || ""}
                                onChange={(e) => onChange(getField('soi'), e.target.value)}
                                disabled={disabled}
                                placeholder="ชื่อซอย"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 col-span-1 md:col-span-2">
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">แยก</Label>
                            <Input
                                className="bg-white"
                                value={formData[getField('yaek')] || ""}
                                onChange={(e) => onChange(getField('yaek'), e.target.value)}
                                disabled={disabled}
                                placeholder="ระบุแยก (ถ้ามี)"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">ตรอก</Label>
                            <Input
                                className="bg-white"
                                value={formData[getField('trohk')] || ""}
                                onChange={(e) => onChange(getField('trohk'), e.target.value)}
                                disabled={disabled}
                                placeholder="ระบุตรอก (ถ้ามี)"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">ถนน</Label>
                            <Combobox
                                options={[{ label: "สุขุมวิท", value: "สุขุมวิท" }, { label: "เพชรเกษม", value: "เพชรเกษม" }, { label: "พหลโยธิน", value: "พหลโยธิน" }]}
                                value={formData[getField('street')] || ""}
                                onValueChange={(val) => onChange(getField('street'), val)}
                                disabled={disabled}
                                placeholder="ระบุถนน"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">แขวง/ตำบล</Label>
                        <Combobox
                            options={[{ label: "ลาดพร้าว", value: "ลาดพร้าว" }, { label: "บางรัก", value: "บางรัก" }]}
                            value={formData[getField('subDistrict')] || ""}
                            onValueChange={(val) => onChange(getField('subDistrict'), val)}
                            disabled={disabled}
                            placeholder="ระบุแขวง/ตำบล"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">เขต/อำเภอ</Label>
                        <Combobox
                            options={[{ label: "ลาดพร้าว", value: "ลาดพร้าว" }, { label: "บางรัก", value: "บางรัก" }]}
                            value={formData[getField('district')] || ""}
                            onValueChange={(val) => onChange(getField('district'), val)}
                            disabled={disabled}
                            placeholder="ระบุเขต/อำเภอ"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">จังหวัด</Label>
                        <Combobox
                            options={[{ label: "กรุงเทพมหานคร", value: "กรุงเทพมหานคร" }, { label: "นนทบุรี", value: "นนทบุรี" }, { label: "ปทุมธานี", value: "ปทุมธานี" }]}
                            value={formData[getField('province')] || ""}
                            onValueChange={(val) => onChange(getField('province'), val)}
                            disabled={disabled}
                            placeholder="ระบุจังหวัด"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">รหัสไปรษณีย์</Label>
                        <Input
                            className="bg-white"
                            value={formData[getField('zipCode')] || ""}
                            onChange={(e) => onChange(getField('zipCode'), e.target.value.replace(/\D/g, '').slice(0, 5))}
                            disabled={disabled}
                            maxLength={5}
                            placeholder="12345"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

const SOCIAL_PLATFORMS = [
    { label: "Facebook", value: "facebook" },
    { label: "Line", value: "line" },
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

export function CustomerInfoStep({ formData, setFormData }: CustomerInfoStepProps) {
    // --- Date State & Logic ---
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
            if (val.length > 4) val = val.slice(0, 4);
            setDateDisplay(val);

            if (val.length === 4) {
                let y = parseInt(val);
                let realYearAD = y;
                if (y > 2400) realYearAD = y - 543;
                handleChange('birthDate', `${realYearAD}-01-01`);
            }
        } else {
            if (val.length > 8) val = val.slice(0, 8);
            let formattedVal = val;
            if (val.length >= 3) formattedVal = val.slice(0, 2) + '/' + val.slice(2);
            if (val.length >= 5) formattedVal = formattedVal.slice(0, 5) + '/' + formattedVal.slice(5);
            setDateDisplay(formattedVal);

            if (val.length === 8) {
                const d = parseInt(val.slice(0, 2));
                const m = parseInt(val.slice(2, 4));
                const y = parseInt(val.slice(4, 8));
                let realYearAD = y;
                if (y > 2400) realYearAD = y - 543;

                const dateObj = new Date(realYearAD, m - 1, d);
                if (!isNaN(dateObj.getTime()) && dateObj.getDate() === d) {
                    handleChange('birthDate', format(dateObj, "yyyy-MM-dd"));
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

    const [alertDialog, setAlertDialog] = useState({
        isOpen: false,
        title: "",
        description: "",
        variant: "error" as "error" | "info"
    });

    const handleSendOtp = () => {
        setShowOtpInput(true);
        setOtpTimer(60);
        // Simulate sending OTP
    };

    const handleVerifyOtp = () => {
        setIsVerifyingOtp(true);
        setTimeout(() => {
            if (otp === "123456") {
                setIsOtpVerified(true);
                setShowOtpInput(false);
            } else {
                setAlertDialog({
                    isOpen: true,
                    title: "รหัส OTP ไม่ถูกต้อง",
                    description: "กรุณากรอกรหัส OTP ให้ถูกต้อง (ใช้ 123456 สำหรับ Demo)",
                    variant: "error"
                });
            }
            setIsVerifyingOtp(false);
        }, 1000);
    };

    const handleSendEmailOtp = () => {
        setShowEmailOtpInput(true);
        setEmailOtpTimer(60);
        // Simulate sending Email OTP
    };

    const handleVerifyEmailOtp = () => {
        setIsVerifyingEmailOtp(true);
        setTimeout(() => {
            if (emailOtp === "123456") {
                setIsEmailOtpVerified(true);
                setShowEmailOtpInput(false);
            } else {
                setAlertDialog({
                    isOpen: true,
                    title: "รหัส OTP ไม่ถูกต้อง",
                    description: "กรุณากรอกรหัส OTP ให้ถูกต้อง (ใช้ 123456 สำหรับ Demo)",
                    variant: "error"
                });
            }
            setIsVerifyingEmailOtp(false);
        }, 1000);
    };

    useEffect(() => {
        let interval: any;
        if (otpTimer > 0) {
            interval = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [otpTimer]);

    useEffect(() => {
        let interval: any;
        if (emailOtpTimer > 0) {
            interval = setInterval(() => setEmailOtpTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [emailOtpTimer]);

    // --- Co-borrower State ---
    const [isAddingCoBorrower, setIsAddingCoBorrower] = useState(false);
    const [coBorrowerStage, setCoBorrowerStage] = useState<'KYC' | 'FORM'>('KYC');
    const [newCoBorrower, setNewCoBorrower] = useState<any>({
        relationship: "",
        idNumber: "",
        verificationStatus: "",
        occupation: "",
        income: "",
        birthDate: "",
        fullAddress: "",
        watchlistReasons: [],
        phone: ""
    });

    // --- Guarantor State ---
    const [isAddingGuarantor, setIsAddingGuarantor] = useState(false);
    const [guarantorStage, setGuarantorStage] = useState<'KYC' | 'FORM'>('KYC');
    const [newGuarantor, setNewGuarantor] = useState<any>({
        relationship: "",
        idNumber: "",
        firstName: "",
        lastName: "",
        verificationStatus: "",
        occupation: "",
        income: "",
        birthDate: "",
        fullAddress: "",
        watchlistReasons: [],
        phone: ""
    });
    const [editingCoBorrowerIndex, setEditingCoBorrowerIndex] = useState<number | null>(null);
    const [editingGuarantorIndex, setEditingGuarantorIndex] = useState<number | null>(null);

    // --- Delete Confirmation State ---
    const [deleteConfirmation, setDeleteConfirmation] = useState<{
        isOpen: boolean;
        type: 'co-borrower' | 'guarantor' | 'social-media' | null;
        index: number | null;
    }>({
        isOpen: false,
        type: null,
        index: null
    });

    // --- Social Media Logic ---
    const handleAddSocialMedia = () => {
        const current = formData.socialMedias || [];
        setFormData((prev: any) => ({
            ...prev,
            socialMedias: [...current, { platform: "facebook", accountName: "" }]
        }));
    };

    const handleUpdateSocialMedia = (index: number, field: string, value: string) => {
        const items = [...(formData.socialMedias || [])];
        items[index] = { ...items[index], [field]: value };
        setFormData((prev: any) => ({ ...prev, socialMedias: items }));
    };

    const handleRemoveSocialMedia = (index: number) => {
        setDeleteConfirmation({
            isOpen: true,
            type: 'social-media',
            index: index
        });
    };

    // --- Co-Borrower Date Logic ---
    const [coBorrowerUseYearOnly, setCoBorrowerUseYearOnly] = useState(false);
    const [coBorrowerDateDisplay, setCoBorrowerDateDisplay] = useState("");

    useEffect(() => {
        if (newCoBorrower.birthDate) {
            const date = new Date(newCoBorrower.birthDate);
            if (!isNaN(date.getTime())) {
                const year = date.getFullYear();
                const thaiYear = year + 543;
                if (coBorrowerUseYearOnly) {
                    setCoBorrowerDateDisplay(`${thaiYear}`);
                } else {
                    const day = format(date, "dd");
                    const month = format(date, "MM");
                    setCoBorrowerDateDisplay(`${day}/${month}/${thaiYear}`);
                }
            }
        } else {
            setCoBorrowerDateDisplay("");
        }
    }, [newCoBorrower.birthDate, coBorrowerUseYearOnly]);

    const handleCoBorrowerDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, '');
        if (coBorrowerUseYearOnly) {
            if (val.length > 4) val = val.slice(0, 4);
            setCoBorrowerDateDisplay(val);
            if (val.length === 4) {
                let y = parseInt(val);
                let realYearAD = y;
                if (y > 2400) realYearAD = y - 543;
                setNewCoBorrower((prev: any) => ({ ...prev, birthDate: `${realYearAD}-01-01` }));
            }
        } else {
            if (val.length > 8) val = val.slice(0, 8);
            let formattedVal = val;
            if (val.length >= 3) formattedVal = val.slice(0, 2) + '/' + val.slice(2);
            if (val.length >= 5) formattedVal = formattedVal.slice(0, 5) + '/' + formattedVal.slice(5);
            setCoBorrowerDateDisplay(formattedVal);

            if (val.length === 8) {
                const d = parseInt(val.slice(0, 2));
                const m = parseInt(val.slice(2, 4));
                const y = parseInt(val.slice(4, 8));
                let realYearAD = y;
                if (y > 2400) realYearAD = y - 543;
                const dateObj = new Date(realYearAD, m - 1, d);
                if (!isNaN(dateObj.getTime()) && dateObj.getDate() === d) {
                    setNewCoBorrower((prev: any) => ({ ...prev, birthDate: format(dateObj, "yyyy-MM-dd") }));
                }
            }
        }
    };

    const handleCoBorrowerDateBlur = () => {
        if (newCoBorrower.birthDate) {
            const date = new Date(newCoBorrower.birthDate);
            const thaiYear = date.getFullYear() + 543;
            if (coBorrowerUseYearOnly) {
                setCoBorrowerDateDisplay(`${thaiYear}`);
            } else {
                setCoBorrowerDateDisplay(`${format(date, "dd/MM")}/${thaiYear}`);
            }
        }
    };

    // --- Guarantor Date Logic ---
    const [guarantorUseYearOnly, setGuarantorUseYearOnly] = useState(false);
    const [guarantorDateDisplay, setGuarantorDateDisplay] = useState("");

    useEffect(() => {
        if (newGuarantor.birthDate) {
            const date = new Date(newGuarantor.birthDate);
            if (!isNaN(date.getTime())) {
                const year = date.getFullYear();
                const thaiYear = year + 543;
                if (guarantorUseYearOnly) {
                    setGuarantorDateDisplay(`${thaiYear}`);
                } else {
                    const day = format(date, "dd");
                    const month = format(date, "MM");
                    setGuarantorDateDisplay(`${day}/${month}/${thaiYear}`);
                }
            }
        } else {
            setGuarantorDateDisplay("");
        }
    }, [newGuarantor.birthDate, guarantorUseYearOnly]);

    const handleGuarantorDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, '');
        if (guarantorUseYearOnly) {
            if (val.length > 4) val = val.slice(0, 4);
            setGuarantorDateDisplay(val);
            if (val.length === 4) {
                let y = parseInt(val);
                let realYearAD = y;
                if (y > 2400) realYearAD = y - 543;
                setNewGuarantor((prev: any) => ({ ...prev, birthDate: `${realYearAD}-01-01` }));
            }
        } else {
            if (val.length > 8) val = val.slice(0, 8);
            let formattedVal = val;
            if (val.length >= 3) formattedVal = val.slice(0, 2) + '/' + val.slice(2);
            if (val.length >= 5) formattedVal = formattedVal.slice(0, 5) + '/' + formattedVal.slice(5);
            setGuarantorDateDisplay(formattedVal);

            if (val.length === 8) {
                const d = parseInt(val.slice(0, 2));
                const m = parseInt(val.slice(2, 4));
                const y = parseInt(val.slice(4, 8));
                let realYearAD = y;
                if (y > 2400) realYearAD = y - 543;
                const dateObj = new Date(realYearAD, m - 1, d);
                if (!isNaN(dateObj.getTime()) && dateObj.getDate() === d) {
                    setNewGuarantor((prev: any) => ({ ...prev, birthDate: format(dateObj, "yyyy-MM-dd") }));
                }
            }
        }
    };

    const handleGuarantorDateBlur = () => {
        if (newGuarantor.birthDate) {
            const date = new Date(newGuarantor.birthDate);
            const thaiYear = date.getFullYear() + 543;
            if (guarantorUseYearOnly) {
                setGuarantorDateDisplay(`${thaiYear}`);
            } else {
                setGuarantorDateDisplay(`${format(date, "dd/MM")}/${thaiYear}`);
            }
        }
    };

    // Helper: Update main form data
    const handleChange = (field: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    // --- Co-Borrower Handlers ---
    const startAddCoBorrower = () => {
        setIsAddingCoBorrower(true);
        setEditingCoBorrowerIndex(null);
        setCoBorrowerStage('KYC');
        setNewCoBorrower({
            relationship: "", idNumber: "", prefix: "", firstName: "", middleName: "", lastName: "", gender: "", occupation: "", income: "", birthDate: "", fullAddress: "", watchlistReasons: [], phone: "", issueDate: "", expiryDate: "", laserId: "",
            houseNumber: "", floorNumber: "", unitNumber: "", village: "", moo: "", yaek: "", trohk: "", soi: "", street: "", subDistrict: "", district: "", province: "", zipCode: ""
        });
    };

    const handleEditCoBorrower = (index: number) => {
        const coBorrowerToEdit = formData.coBorrowers[index];
        setNewCoBorrower({ ...coBorrowerToEdit });
        setEditingCoBorrowerIndex(index);
        setCoBorrowerStage('FORM'); // Skip KYC for edit
        setIsAddingCoBorrower(true);

        // Populate date display logic
        if (coBorrowerToEdit.birthDate) {
            // Check if it's a year-only date (YYYY-01-01) - simple heuristic or check logic
            // For now, we will follow the standard logic:
            const date = new Date(coBorrowerToEdit.birthDate);
            if (!isNaN(date.getTime())) {
                const year = date.getFullYear();
                const thaiYear = year + 543;
                // If the date is Jan 1st and user intended year only, we might need a flag or inference.
                // For simplicity, let's default to full date unless it looks exactly like Jan 1
                const isJan1 = date.getMonth() === 0 && date.getDate() === 1;

                // Ideally, we should store `isYearOnly` in the data as well.
                // For now, let's just display as full date and let user change if needed, 
                // or infer if it was originally year only if we had that flag.
                // Let's assume full date for editing for now to be safe.
                setCoBorrowerUseYearOnly(false);
                const day = format(date, "dd");
                const month = format(date, "MM");
                setCoBorrowerDateDisplay(`${day}/${month}/${thaiYear}`);
            }
        }
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
            gender: data.gender,
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
            setFormData((prev: any) => ({ ...prev, coBorrowers: updatedCoBorrowers }));
        } else {
            // Add new
            setFormData((prev: any) => ({
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
            relationship: "", idNumber: "", prefix: "", firstName: "", lastName: "", gender: "", occupation: "", income: "", birthDate: "", fullAddress: "", watchlistReasons: [], phone: "",
            houseNumber: "", floorNumber: "", unitNumber: "", village: "", moo: "", yaek: "", trohk: "", soi: "", street: "", subDistrict: "", district: "", province: "", zipCode: ""
        });
    };

    const handleEditGuarantor = (index: number) => {
        const guarantorToEdit = formData.guarantors[index];
        setNewGuarantor({ ...guarantorToEdit });
        setEditingGuarantorIndex(index);
        setGuarantorStage('FORM'); // Skip KYC for edit
        setIsAddingGuarantor(true);

        // Populate date display logic
        if (guarantorToEdit.birthDate) {
            const date = new Date(guarantorToEdit.birthDate);
            if (!isNaN(date.getTime())) {
                const year = date.getFullYear();
                const thaiYear = year + 543;
                setGuarantorUseYearOnly(false);
                const day = format(date, "dd");
                const month = format(date, "MM");
                setGuarantorDateDisplay(`${day}/${month}/${thaiYear}`);
            }
        }
    };

    const handleGuarantorKYCComplete = (data: KYCData) => {
        setNewGuarantor({
            ...newGuarantor,
            idNumber: data.idNumber,
            prefix: data.prefix,
            firstName: data.firstName,
            middleName: data.middleName || "",
            lastName: data.lastName,
            gender: data.gender,
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
            setFormData((prev: any) => ({ ...prev, guarantors: updatedGuarantors }));
        } else {
            // Add new
            setFormData((prev: any) => ({
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
            setFormData((prev: any) => ({
                ...prev,
                coBorrowers: (prev.coBorrowers || []).filter((_: any, i: number) => i !== deleteConfirmation.index)
            }));
        } else if (deleteConfirmation.type === 'guarantor' && deleteConfirmation.index !== null) {
            setFormData((prev: any) => ({
                ...prev,
                guarantors: (prev.guarantors || []).filter((_: any, i: number) => i !== deleteConfirmation.index)
            }));
        } else if (deleteConfirmation.type === 'social-media' && deleteConfirmation.index !== null) {
            setFormData((prev: any) => ({
                ...prev,
                socialMedias: (prev.socialMedias || []).filter((_: any, i: number) => i !== deleteConfirmation.index)
            }));
        }
        setDeleteConfirmation({ isOpen: false, type: null, index: null });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">

            {/* MAIN APPLICANT - SECTION 1: Personal Info */}
            <Card className="border-border-subtle shadow-sm">
                <CardHeader className="bg-blue-50/50 border-b border-border-subtle pb-4">
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
                    <div className="space-y-4 pt-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                            <div className="space-y-2">
                                <Label>เลขบัตรประชาชน</Label>
                                <Input
                                    value={formData.idNumber}
                                    disabled
                                    className="bg-gray-50 text-gray-600 font-mono h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>เลขหลังบัตรประชาชน (Laser ID)</Label>
                                <Input
                                    value={formData.laserId}
                                    disabled
                                    className="bg-gray-50 text-gray-600 font-mono h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label>วันเกิด</Label>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="yearOnly"
                                            checked={useYearOnly}
                                            onCheckedChange={(checked) => setUseYearOnly(checked as boolean)}
                                            disabled
                                        />
                                        <Label htmlFor="yearOnly" className="text-xs text-muted-foreground font-normal cursor-pointer">
                                            ทราบแค่ปีเกิด
                                        </Label>
                                    </div>
                                </div>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        value={dateDisplay}
                                        disabled
                                        className="pl-9 font-mono bg-gray-50 text-gray-600 h-11"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>เพศ</Label>
                                <Select value={formData.gender || ""} onValueChange={(val) => handleChange("gender", val)}>
                                    <SelectTrigger className="h-11 bg-white">
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
                                <Label>คำนำหน้า</Label>
                                <Input value={formData.prefix || ""} disabled className="bg-gray-50 text-gray-600 h-11" />
                            </div>
                            <div className="space-y-2">
                                <Label>ชื่อ</Label>
                                <Input value={formData.firstName || ""} disabled className="bg-gray-50 text-gray-600 h-11" />
                            </div>
                            <div className="space-y-2">
                                <Label>ชื่อกลาง</Label>
                                <Input value={formData.middleName || ""} disabled className="bg-gray-50 text-gray-600 h-11" />
                            </div>
                            <div className="space-y-2">
                                <Label>นามสกุล</Label>
                                <Input value={formData.lastName || ""} disabled className="bg-gray-50 text-gray-600 h-11" />
                            </div>
                            <div className="space-y-2">
                                <Label>ชื่อเล่น</Label>
                                <Input
                                    value={formData.nickname || ""}
                                    onChange={(e) => handleChange("nickname", e.target.value)}
                                    placeholder="ระบุชื่อเล่น"
                                    className="h-11 bg-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>วันที่ออกบัตร</Label>
                                <Input value={formatDateToThai(formData.issueDate) || ""} disabled className="bg-gray-50 text-gray-600 h-11" />
                            </div>
                            <div className="space-y-2">
                                <Label>วันที่บัตรหมดอายุ</Label>
                                <Input value={formatDateToThai(formData.expiryDate) || ""} disabled className="bg-gray-50 text-gray-600 h-11" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* MAIN APPLICANT - SECTION 2: Address Info */}
            <Card className="border-border-subtle shadow-sm">
                <CardHeader className="bg-blue-50/50 border-b border-border-subtle pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-chaiyo-blue">
                        <MapPin className="w-5 h-5" />
                        ที่อยู่ (ผู้กู้หลัก)
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="space-y-4 pt-2">

                        <AddressForm
                            title="ที่อยู่ตามบัตรประชาชน"
                            prefix=""
                            formData={formData}
                            onChange={handleChange}
                            disabled={true}
                        />


                        <AddressForm
                            title="ที่อยู่ปัจจุบัน"
                            prefix="current"
                            formData={formData}
                            onChange={handleChange}
                            hideFields={formData.isCurrentSameAsId}
                            headerChildren={
                                <div className="flex items-center gap-2 mb-2 bg-gray-50 p-3 rounded-lg border border-gray-100 mt-2">
                                    <Checkbox
                                        id="sameAsId"
                                        checked={formData.isCurrentSameAsId}
                                        onCheckedChange={(val) => handleChange("isCurrentSameAsId", val)}
                                    />
                                    <Label htmlFor="sameAsId" className="cursor-pointer font-bold">ที่อยู่ปัจจุบันตรงกับที่อยู่ตามบัตรประชาชน</Label>
                                </div>
                            }
                        />




                        <AddressForm
                            title="ที่อยู่จัดส่งเอกสาร"
                            prefix="shipping"
                            formData={formData}
                            onChange={handleChange}
                            hideFields={formData.isShippingSameAsCurrent}
                            headerChildren={
                                <div className="flex items-center gap-2 mb-2 bg-gray-50 p-3 rounded-lg border border-gray-100 mt-2">
                                    <Checkbox
                                        id="sameAsCurrent"
                                        checked={formData.isShippingSameAsCurrent}
                                        onCheckedChange={(val) => handleChange("isShippingSameAsCurrent", val)}
                                    />
                                    <Label htmlFor="sameAsCurrent" className="cursor-pointer font-bold">ที่อยู่จัดส่งเอกสารตรงกับที่อยู่ปัจจุบัน</Label>
                                </div>
                            }
                        />
                        <AddressForm
                            title="ที่อยู่ที่ทำงาน"
                            prefix="work"
                            formData={formData}
                            onChange={handleChange}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* MAIN APPLICANT - SECTION 3: Contact Info */}
            <Card className="border-border-subtle shadow-sm">
                <CardHeader className="bg-blue-50/50 border-b border-border-subtle pb-4">
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
                                <Label>เบอร์โทรศัพท์มือถือ</Label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            value={formData.phone || ""}
                                            placeholder="08x-xxx-xxxx"
                                            className={cn(
                                                "pl-9 font-mono h-11",
                                                isOtpVerified && "border-green-500 bg-green-50 text-green-700"
                                            )}
                                            onChange={(e) => {
                                                if (isOtpVerified) setIsOtpVerified(false); // Reset if changed
                                                handleChange("phone", e.target.value);
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
                                            disabled={!formData.phone || formData.phone.length < 10 || showOtpInput}
                                            className="shrink-0 h-11"
                                        >
                                            ยืนยันเบอร์
                                        </Button>
                                    )}
                                </div>
                                <div className="mt-2 bg-slate-50 border border-slate-200 text-slate-700 p-3 rounded-xl text-xs leading-relaxed animate-in fade-in slide-in-from-top-1">
                                    <div className="font-bold flex items-center gap-1 mb-1 text-slate-800">
                                        <Info className="w-3.5 h-3.5" />
                                        คำแนะนำสำหรับพนักงาน
                                    </div>
                                    <p className="mb-2">
                                        ให้ลูกค้ากด <span className="font-mono bg-blue-100/50 text-blue-800 px-1 rounded mx-1">*179*เลขบัตรประชาชน 13 หลัก#</span> โทรออก จากนั้นแคปหน้าจอผลลัพธ์เพื่อใช้ยืนยันความเป็นเจ้าของเบอร์
                                    </p>
                                    {formData.phoneOwnershipProof ? (
                                        <div className="flex items-center justify-between bg-white border border-slate-200 p-2 rounded-lg">
                                            <span className="truncate max-w-[200px] font-medium flex items-center gap-2">
                                                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                                                {formData.phoneOwnershipProof.name}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleChange("phoneOwnershipProof", null)}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
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
                                                        // Reset the value so the same file could be selected again if removed
                                                        e.target.value = '';
                                                    }
                                                }}
                                            />
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 text-slate-600 border-slate-300 hover:bg-slate-100 hover:text-slate-800 w-full rounded-lg bg-white"
                                                onClick={() => document.getElementById('phoneOwnershipProof')?.click()}
                                            >
                                                <Upload className="w-3.5 h-3.5 mr-1" />
                                                อัพโหลดรูปถ่ายหน้าจอ
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {/* OTP Input UI */}
                                {showOtpInput && !isOtpVerified && (
                                    <div className="mt-3 bg-blue-50/50 border border-blue-100 p-4 rounded-xl animate-in slide-in-from-top-2">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="text-center">
                                                <p className="text-sm font-bold text-chaiyo-blue">กรอกรหัส OTP</p>
                                                <p className="text-xs text-muted-foreground">รหัสถูกส่งไปยัง {formData.phone}</p>
                                            </div>

                                            <InputOTP maxLength={6} value={otp} onChange={(val) => setOtp(val)}>
                                                <InputOTPGroup className="bg-white">
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                </InputOTPGroup>
                                            </InputOTP>

                                            <div className="flex items-center gap-2 w-full">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="flex-1 text-xs text-muted-foreground"
                                                    disabled={otpTimer > 0}
                                                    onClick={handleSendOtp}
                                                >
                                                    {otpTimer > 0 ? `ขอรหัสใหม่ใน ${otpTimer}s` : "ขอรหัสใหม่"}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="flex-1 bg-chaiyo-blue text-white hover:bg-chaiyo-blue/90"
                                                    onClick={handleVerifyOtp}
                                                    disabled={otp.length !== 6 || isVerifyingOtp}
                                                >
                                                    {isVerifyingOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : "ยืนยัน"}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>อีเมล (ถ้ามี)</Label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            value={formData.email || ""}
                                            placeholder="example@email.com"
                                            className={cn(
                                                "pl-9 h-11",
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
                                            disabled={!formData.email || !formData.email.includes('@') || showEmailOtpInput}
                                            className="shrink-0 h-11"
                                        >
                                            ยืนยันอีเมล
                                        </Button>
                                    )}
                                </div>

                                {/* Email OTP Input UI */}
                                {showEmailOtpInput && !isEmailOtpVerified && (
                                    <div className="mt-3 bg-blue-50/50 border border-blue-100 p-4 rounded-xl animate-in slide-in-from-top-2">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="text-center">
                                                <p className="text-sm font-bold text-chaiyo-blue">กรอกรหัส OTP (Email)</p>
                                                <p className="text-xs text-muted-foreground">รหัสถูกส่งไปยัง {formData.email}</p>
                                            </div>

                                            <InputOTP maxLength={6} value={emailOtp} onChange={(val) => setEmailOtp(val)}>
                                                <InputOTPGroup className="bg-white">
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                </InputOTPGroup>
                                            </InputOTP>

                                            <div className="flex items-center gap-2 w-full">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="flex-1 text-xs text-muted-foreground"
                                                    disabled={emailOtpTimer > 0}
                                                    onClick={handleSendEmailOtp}
                                                >
                                                    {emailOtpTimer > 0 ? `ขอรหัสใหม่ใน ${emailOtpTimer}s` : "ขอรหัสใหม่"}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="flex-1 bg-chaiyo-blue text-white hover:bg-chaiyo-blue/90"
                                                    onClick={handleVerifyEmailOtp}
                                                    disabled={emailOtp.length !== 6 || isVerifyingEmailOtp}
                                                >
                                                    {isVerifyingEmailOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : "ยืนยัน"}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Home Telephone Field */}
                            <div className="space-y-2">
                                <Label>เบอร์โทรศัพท์บ้าน (ถ้ามี)</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        value={formData.homePhone || ""}
                                        placeholder="02-xxx-xxxx"
                                        className="pl-9 font-mono h-11"
                                        onChange={(e) => handleChange("homePhone", e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SOCIAL MEDIAS SECTION */}
                        <div className="space-y-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
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

                            <div className="border border-border-subtle rounded-xl overflow-hidden shadow-sm bg-white">
                                <Table>
                                    <TableHeader className="bg-gray-50/80">
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead className="w-[80px] py-3 text-center text-xs font-bold uppercase tracking-wider">ลำดับ</TableHead>
                                            <TableHead className="w-[30%] py-3 text-xs font-bold uppercase tracking-wider">แพลตฟอร์ม</TableHead>
                                            <TableHead className="py-3 text-xs font-bold uppercase tracking-wider">ชื่อบัญชี / ID / Link</TableHead>
                                            <TableHead className="w-[80px] py-3 text-center text-xs font-bold uppercase tracking-wider">จัดการ</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {(!formData.socialMedias || formData.socialMedias.length === 0) ? (
                                            <TableRow className="hover:bg-transparent">
                                                <TableCell colSpan={4} className="text-center text-muted-foreground py-10 bg-gray-50/30">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Globe className="w-8 h-8 text-gray-300" />
                                                        <p>ยังไม่มีข้อมูลโซเชียลมีเดีย</p>
                                                        <p className="text-xs text-gray-400">คลิก "เพิ่มบัญชีโซเชียลมีเดีย" เพื่อเริ่มรายการ</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            formData.socialMedias.map((item: any, idx: number) => (
                                                <TableRow key={idx} className="hover:bg-blue-50/20 group">
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

            {false && (
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
                            <Card className="overflow-hidden border-border-subtle">
                                <Table>
                                    <TableHeader className="bg-gray-50">
                                        <TableRow className="hover:bg-gray-50">
                                            <TableHead className="w-[35%] py-3">ชื่อ-นามสกุล</TableHead>
                                            <TableHead className="w-[30%] py-3">เลขบัตรประชาชน</TableHead>
                                            <TableHead className="w-[25%] py-3">ความสัมพันธ์</TableHead>
                                            <TableHead className="w-[10%] py-3"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {formData.coBorrowers.map((person: any, index: number) => (
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
                                                    {newCoBorrower.watchlistReasons && newCoBorrower.watchlistReasons.length > 0 && (
                                                        <div className="flex flex-wrap gap-2 ml-6">
                                                            {newCoBorrower.watchlistReasons.map((reason: string, idx: number) => (
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
                                                    <Label>เลขบัตรประชาชน</Label>
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
                                                            let updatedCoBorrower = { ...newCoBorrower, prefix: val };
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
                                                    <div className="flex justify-between items-center">
                                                        <Label>วันเกิด</Label>
                                                        <div className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id="coBorrowerYearOnly"
                                                                checked={coBorrowerUseYearOnly}
                                                                onCheckedChange={(checked) => setCoBorrowerUseYearOnly(checked as boolean)}
                                                            />
                                                            <Label htmlFor="coBorrowerYearOnly" className="text-xs text-muted-foreground font-normal cursor-pointer">
                                                                ทราบแค่ปีเกิด
                                                            </Label>
                                                        </div>
                                                    </div>
                                                    <div className="relative">
                                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        <Input
                                                            value={coBorrowerDateDisplay}
                                                            onChange={handleCoBorrowerDateInputChange}
                                                            onBlur={handleCoBorrowerDateBlur}
                                                            placeholder={coBorrowerUseYearOnly ? "พ.ศ. เกิด (เช่น 2533)" : "วัน/เดือน/ปี (พ.ศ.)"}
                                                            className="pl-9 font-mono"
                                                            maxLength={coBorrowerUseYearOnly ? 4 : 10}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>เบอร์โทรศัพท์มือถือ</Label>
                                                    <Input
                                                        value={newCoBorrower.phone}
                                                        placeholder="08x-xxx-xxxx"
                                                        className="font-mono"
                                                        onChange={(e) => setNewCoBorrower({ ...newCoBorrower, phone: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-4 pt-2">
                                                <div className="flex items-center gap-2 text-sm font-bold text-gray-700 pb-2 border-b border-gray-100">
                                                    ที่อยู่ตามทะเบียนบ้าน
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-xs text-muted-foreground">เลขที่บ้าน</Label>
                                                        <Input
                                                            className="bg-white"
                                                            value={newCoBorrower.houseNumber || ""}
                                                            onChange={(e) => setNewCoBorrower({ ...newCoBorrower, houseNumber: e.target.value })}
                                                            placeholder="123/45"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs text-muted-foreground">ชั้น</Label>
                                                        <Input
                                                            className="bg-white"
                                                            value={newCoBorrower.floorNumber || ""}
                                                            onChange={(e) => setNewCoBorrower({ ...newCoBorrower, floorNumber: e.target.value })}
                                                            placeholder="เช่น 2"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs text-muted-foreground">หน่วย/ห้อง</Label>
                                                        <Input
                                                            className="bg-white"
                                                            value={newCoBorrower.unitNumber || ""}
                                                            onChange={(e) => setNewCoBorrower({ ...newCoBorrower, unitNumber: e.target.value })}
                                                            placeholder="เช่น 201"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs text-muted-foreground">หมู่ที่</Label>
                                                        <Input
                                                            className="bg-white"
                                                            value={newCoBorrower.moo || ""}
                                                            onChange={(e) => setNewCoBorrower({ ...newCoBorrower, moo: e.target.value })}
                                                            placeholder="เช่น 1"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-xs text-muted-foreground">หมู่บ้าน/อาคาร</Label>
                                                        <Input
                                                            className="bg-white"
                                                            value={newCoBorrower.village || ""}
                                                            onChange={(e) => setNewCoBorrower({ ...newCoBorrower, village: e.target.value })}
                                                            placeholder="ชื่อหมู่บ้านหรืออาคาร"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs text-muted-foreground">ซอย</Label>
                                                        <Input
                                                            className="bg-white"
                                                            value={newCoBorrower.soi || ""}
                                                            onChange={(e) => setNewCoBorrower({ ...newCoBorrower, soi: e.target.value })}
                                                            placeholder="ชื่อซอย"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-xs text-muted-foreground">แยก</Label>
                                                        <Input
                                                            className="bg-white"
                                                            value={newCoBorrower.yaek || ""}
                                                            onChange={(e) => setNewCoBorrower({ ...newCoBorrower, yaek: e.target.value })}
                                                            placeholder="ระบุแยก (ถ้ามี)"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs text-muted-foreground">ตรอก</Label>
                                                        <Input
                                                            className="bg-white"
                                                            value={newCoBorrower.trohk || ""}
                                                            onChange={(e) => setNewCoBorrower({ ...newCoBorrower, trohk: e.target.value })}
                                                            placeholder="ระบุตรอก (ถ้ามี)"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs text-muted-foreground">ถนน</Label>
                                                        <Combobox
                                                            options={[{ label: "สุขุมวิท", value: "สุขุมวิท" }, { label: "เพชรเกษม", value: "เพชรเกษม" }, { label: "พหลโยธิน", value: "พหลโยธิน" }]}
                                                            value={newCoBorrower.street || ""}
                                                            onValueChange={(val) => setNewCoBorrower({ ...newCoBorrower, street: val })}
                                                            placeholder="ระบุถนน"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-xs text-muted-foreground">แขวง/ตำบล</Label>
                                                        <Combobox
                                                            options={[{ label: "ลาดพร้าว", value: "ลาดพร้าว" }, { label: "บางรัก", value: "บางรัก" }]}
                                                            value={newCoBorrower.subDistrict || ""}
                                                            onValueChange={(val) => setNewCoBorrower({ ...newCoBorrower, subDistrict: val })}
                                                            placeholder="ระบุแขวง/ตำบล"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs text-muted-foreground">เขต/อำเภอ</Label>
                                                        <Combobox
                                                            options={[{ label: "ลาดพร้าว", value: "ลาดพร้าว" }, { label: "บางรัก", value: "บางรัก" }]}
                                                            value={newCoBorrower.district || ""}
                                                            onValueChange={(val) => setNewCoBorrower({ ...newCoBorrower, district: val })}
                                                            placeholder="ระบุเขต/อำเภอ"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-xs text-muted-foreground">จังหวัด</Label>
                                                        <Combobox
                                                            options={[{ label: "กรุงเทพมหานคร", value: "กรุงเทพมหานคร" }, { label: "นนทบุรี", value: "นนทบุรี" }, { label: "ปทุมธานี", value: "ปทุมธานี" }]}
                                                            value={newCoBorrower.province || ""}
                                                            onValueChange={(val) => setNewCoBorrower({ ...newCoBorrower, province: val })}
                                                            placeholder="ระบุจังหวัด"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs text-muted-foreground">รหัสไปรษณีย์</Label>
                                                        <Input
                                                            className="bg-white"
                                                            value={newCoBorrower.zipCode || ""}
                                                            onChange={(e) => setNewCoBorrower({ ...newCoBorrower, zipCode: e.target.value.replace(/\D/g, '').slice(0, 5) })}
                                                            maxLength={5}
                                                            placeholder="12345"
                                                        />
                                                    </div>
                                                </div>
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
                            <Card className="overflow-hidden border-border-subtle">
                                <Table>
                                    <TableHeader className="bg-gray-50">
                                        <TableRow className="hover:bg-gray-50">
                                            <TableHead className="w-[35%] py-3">ชื่อ-นามสกุล</TableHead>
                                            <TableHead className="w-[30%] py-3">เลขบัตรประชาชน</TableHead>
                                            <TableHead className="w-[25%] py-3">ความสัมพันธ์</TableHead>
                                            <TableHead className="w-[10%] py-3"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {formData.guarantors.map((person: any, index: number) => (
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
                                                    {newGuarantor.watchlistReasons && newGuarantor.watchlistReasons.length > 0 && (
                                                        <div className="flex flex-wrap gap-2 ml-6">
                                                            {newGuarantor.watchlistReasons.map((reason: string, idx: number) => (
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
                                                    <Label>เลขบัตรประชาชน</Label>
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
                                                            let updatedGuarantor = { ...newGuarantor, prefix: val };
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
                                                    <div className="flex justify-between items-center">
                                                        <Label>วันเกิด</Label>
                                                        <div className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id="guarantorYearOnly"
                                                                checked={guarantorUseYearOnly}
                                                                onCheckedChange={(checked) => setGuarantorUseYearOnly(checked as boolean)}
                                                            />
                                                            <Label htmlFor="guarantorYearOnly" className="text-xs text-muted-foreground font-normal cursor-pointer">
                                                                ทราบแค่ปีเกิด
                                                            </Label>
                                                        </div>
                                                    </div>
                                                    <div className="relative">
                                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        <Input
                                                            value={guarantorDateDisplay}
                                                            onChange={handleGuarantorDateInputChange}
                                                            onBlur={handleGuarantorDateBlur}
                                                            placeholder={guarantorUseYearOnly ? "พ.ศ. เกิด (เช่น 2533)" : "วัน/เดือน/ปี (พ.ศ.)"}
                                                            className="pl-9 font-mono"
                                                            maxLength={guarantorUseYearOnly ? 4 : 10}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>เบอร์โทรศัพท์มือถือ</Label>
                                                    <Input
                                                        value={newGuarantor.phone}
                                                        placeholder="08x-xxx-xxxx"
                                                        className="font-mono"
                                                        onChange={(e) => setNewGuarantor({ ...newGuarantor, phone: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-4 pt-2">
                                                <div className="flex items-center gap-2 text-sm font-bold text-gray-700 pb-2 border-b border-gray-100">
                                                    ที่อยู่ตามทะเบียนบ้าน
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-xs text-muted-foreground">เลขที่บ้าน</Label>
                                                        <Input
                                                            className="bg-white"
                                                            value={newGuarantor.houseNumber || ""}
                                                            onChange={(e) => setNewGuarantor({ ...newGuarantor, houseNumber: e.target.value })}
                                                            placeholder="123/45"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs text-muted-foreground">ชั้น</Label>
                                                        <Input
                                                            className="bg-white"
                                                            value={newGuarantor.floorNumber || ""}
                                                            onChange={(e) => setNewGuarantor({ ...newGuarantor, floorNumber: e.target.value })}
                                                            placeholder="เช่น 2"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs text-muted-foreground">หน่วย/ห้อง</Label>
                                                        <Input
                                                            className="bg-white"
                                                            value={newGuarantor.unitNumber || ""}
                                                            onChange={(e) => setNewGuarantor({ ...newGuarantor, unitNumber: e.target.value })}
                                                            placeholder="เช่น 201"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs text-muted-foreground">หมู่ที่</Label>
                                                        <Input
                                                            className="bg-white"
                                                            value={newGuarantor.moo || ""}
                                                            onChange={(e) => setNewGuarantor({ ...newGuarantor, moo: e.target.value })}
                                                            placeholder="เช่น 1"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-xs text-muted-foreground">หมู่บ้าน/อาคาร</Label>
                                                        <Input
                                                            className="bg-white"
                                                            value={newGuarantor.village || ""}
                                                            onChange={(e) => setNewGuarantor({ ...newGuarantor, village: e.target.value })}
                                                            placeholder="ชื่อหมู่บ้านหรืออาคาร"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs text-muted-foreground">ซอย</Label>
                                                        <Input
                                                            className="bg-white"
                                                            value={newGuarantor.soi || ""}
                                                            onChange={(e) => setNewGuarantor({ ...newGuarantor, soi: e.target.value })}
                                                            placeholder="ชื่อซอย"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-xs text-muted-foreground">แยก</Label>
                                                        <Input
                                                            className="bg-white"
                                                            value={newGuarantor.yaek || ""}
                                                            onChange={(e) => setNewGuarantor({ ...newGuarantor, yaek: e.target.value })}
                                                            placeholder="ระบุแยก (ถ้ามี)"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs text-muted-foreground">ตรอก</Label>
                                                        <Input
                                                            className="bg-white"
                                                            value={newGuarantor.trohk || ""}
                                                            onChange={(e) => setNewGuarantor({ ...newGuarantor, trohk: e.target.value })}
                                                            placeholder="ระบุตรอก (ถ้ามี)"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs text-muted-foreground">ถนน</Label>
                                                        <Combobox
                                                            options={[{ label: "สุขุมวิท", value: "สุขุมวิท" }, { label: "เพชรเกษม", value: "เพชรเกษม" }, { label: "พหลโยธิน", value: "พหลโยธิน" }]}
                                                            value={newGuarantor.street || ""}
                                                            onValueChange={(val) => setNewGuarantor({ ...newGuarantor, street: val })}
                                                            placeholder="ระบุถนน"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-xs text-muted-foreground">แขวง/ตำบล</Label>
                                                        <Combobox
                                                            options={[{ label: "ลาดพร้าว", value: "ลาดพร้าว" }, { label: "บางรัก", value: "บางรัก" }]}
                                                            value={newGuarantor.subDistrict || ""}
                                                            onValueChange={(val) => setNewGuarantor({ ...newGuarantor, subDistrict: val })}
                                                            placeholder="ระบุแขวง/ตำบล"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs text-muted-foreground">เขต/อำเภอ</Label>
                                                        <Combobox
                                                            options={[{ label: "ลาดพร้าว", value: "ลาดพร้าว" }, { label: "บางรัก", value: "บางรัก" }]}
                                                            value={newGuarantor.district || ""}
                                                            onValueChange={(val) => setNewGuarantor({ ...newGuarantor, district: val })}
                                                            placeholder="ระบุเขต/อำเภอ"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-xs text-muted-foreground">จังหวัด</Label>
                                                        <Combobox
                                                            options={[{ label: "กรุงเทพมหานคร", value: "กรุงเทพมหานคร" }, { label: "นนทบุรี", value: "นนทบุรี" }, { label: "ปทุมธานี", value: "ปทุมธานี" }]}
                                                            value={newGuarantor.province || ""}
                                                            onValueChange={(val) => setNewGuarantor({ ...newGuarantor, province: val })}
                                                            placeholder="ระบุจังหวัด"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs text-muted-foreground">รหัสไปรษณีย์</Label>
                                                        <Input
                                                            className="bg-white"
                                                            value={newGuarantor.zipCode || ""}
                                                            onChange={(e) => setNewGuarantor({ ...newGuarantor, zipCode: e.target.value.replace(/\D/g, '').slice(0, 5) })}
                                                            maxLength={5}
                                                            placeholder="12345"
                                                        />
                                                    </div>
                                                </div>
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
            )}
            {/* Delete Confirmation Alert Dialog */}
            <AlertDialog open={deleteConfirmation.isOpen} onOpenChange={(open) => !open && setDeleteConfirmation(prev => ({ ...prev, isOpen: false }))}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>ยืนยันการลบข้อมูล</AlertDialogTitle>
                        <AlertDialogDescription>
                            คุณแน่ใจหรือไม่ที่จะลบข้อมูล{
                                deleteConfirmation.type === 'co-borrower' ? 'ผู้กู้ร่วม' :
                                    deleteConfirmation.type === 'guarantor' ? 'ผู้ค้ำประกัน' : 'บัญชีโซเชียลมีเดีย'
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
        </div>
    );
}
