"use client";

import { useState, useEffect } from "react";
import { Car, Bike, Truck, Tractor, MapIcon, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface CollateralStepProps {
    formData: any;
    setFormData: (data: any) => void;
    isExistingCustomer?: boolean;
    existingCollaterals?: any[];
}

export function CollateralStep({ formData, setFormData, isExistingCustomer = false, existingCollaterals = [] }: CollateralStepProps) {
    const [selectedType, setSelectedType] = useState<string>(formData.collateralType || "car");
    const [selectedAssetId, setSelectedAssetId] = useState<string | null>(formData.existingAssetId || null);

    useEffect(() => {
        if (formData.collateralType) {
            let type = formData.collateralType as string;
            if (type === 'agriculture_car') type = 'agri';
            setSelectedType(type);
        }
    }, [formData.collateralType]);

    const handleSelectAsset = (asset: any) => {
        setSelectedAssetId(asset.id);
        setSelectedType(asset.type);
        setFormData({
            ...formData,
            collateralType: asset.type,
            existingAssetId: asset.id,
            brand: asset.brand,
            model: asset.model,
            year: asset.year,
            licensePlate: asset.licensePlate,
            registrationProvince: asset.registrationProvince,
            mileage: asset.mileage,
            vin: asset.vin,
            deedNumber: "",
            parcelNumber: "",
        });
    };

    const handleAddNew = () => {
        setSelectedAssetId(null);
        setSelectedType("car");
        setFormData({
            ...formData,
            collateralType: "car",
            existingAssetId: null,
            brand: "",
            model: "",
            year: "",
            licensePlate: "",
            registrationProvince: "",
            mileage: "",
            vin: "",
        });
    };

    const handleChange = (field: string, value: string | number) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleTypeSelect = (type: string) => {
        setSelectedType(type);
        setFormData({ ...formData, collateralType: type });
    };

    const formatNumber = (num: number | string) => {
        if (!num && num !== 0) return "";
        const parts = num.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    };

    const handleAppraisalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/,/g, "");
        if (rawValue === "" || /^\d+$/.test(rawValue)) {
            handleChange("appraisalPrice", rawValue === "" ? 0 : Number(rawValue));
        }
    };

    const LOAN_TYPES = [
        { id: "car", label: "รถยนต์", icon: Car },
        { id: "moto", label: "มอเตอร์ไซค์", icon: Bike },
        { id: "truck", label: "รถบรรทุก", icon: Truck },
        { id: "agri", label: "เกษตร", icon: Tractor },
        { id: "land", label: "ที่ดิน", icon: MapIcon },
    ];

    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleReanalyze = () => {
        setIsAnalyzing(true);
        // Simulate AI calculation
        setTimeout(() => {
            let basePrice = 500000;
            if (selectedType === 'moto') basePrice = 45000;
            if (selectedType === 'truck') basePrice = 1200000;
            if (selectedType === 'land') basePrice = 1500000;
            if (selectedType === 'agri') basePrice = 300000;

            const yearMod = formData.year ? (new Date().getFullYear() - Number(formData.year)) * 25000 : 0;

            // Mileage impact: -0.5% for every 1000km
            const mileageMod = formData.mileage ? (Number(formData.mileage) / 1000) * (basePrice * 0.005) : 0;

            // Province impact: BKK gets 5% bonus
            const provinceBonus = formData.registrationProvince?.includes('กรุงเทพ') ? (basePrice * 0.05) : 0;

            const finalPrice = Math.max(selectedType === 'moto' ? 5000 : 50000, basePrice - yearMod - mileageMod + provinceBonus);

            setFormData({ ...formData, appraisalPrice: Math.round(finalPrice / 1000) * 1000 });
            setIsAnalyzing(false);
        }, 1200);
    };

    const isLand = selectedType === 'land';

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2">
            <div className="grid gap-8 grid-cols-1 lg:grid-cols-12">

                {/* LEFT COLUMN: Sidebar (Asset List OR Appraisal Summary) */}
                <div className="lg:col-span-4 space-y-6 order-last lg:order-last">
                    {/* CASE A: Existing Customer List View */}
                    {isExistingCustomer && existingCollaterals.length > 0 && !selectedAssetId && (
                        <div className="space-y-4">
                            <Label className="text-base font-bold text-foreground block mb-2">เลือกทรัพย์สิน</Label>
                            <div className="space-y-3">
                                {existingCollaterals.map((asset) => (
                                    <div
                                        key={asset.id}
                                        onClick={() => handleSelectAsset(asset)}
                                        className={cn(
                                            "p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-gray-50 relative overflow-hidden",
                                            selectedAssetId === asset.id
                                                ? "border-chaiyo-blue bg-blue-50/50 ring-2 ring-chaiyo-blue/10"
                                                : "border-border-subtle bg-white"
                                        )}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={cn(
                                                "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                                                selectedAssetId === asset.id ? "bg-chaiyo-blue text-white" : "bg-gray-100 text-gray-500"
                                            )}>
                                                {asset.type === 'car' ? <Car className="w-5 h-5" /> : <Bike className="w-5 h-5" />}
                                            </div>
                                            <div className="space-y-0.5 min-w-0">
                                                <p className="font-bold text-foreground text-sm truncate">{asset.brand} {asset.model}</p>
                                                <p className="text-xs text-muted truncate">ทะเบียน: {asset.licensePlate}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div
                                    onClick={handleAddNew}
                                    className="p-4 rounded-xl border-2 border-dashed border-gray-300 cursor-pointer transition-all hover:bg-gray-50 flex items-center gap-3 text-muted-foreground bg-white"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                        <span className="text-xl font-light">+</span>
                                    </div>
                                    <span className="font-medium text-sm">เพิ่มทรัพย์สินใหม่</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* CASE B: Calculation Breakdown & Summary (Show when viewing a specific asset or main flow) */}
                    {(!isExistingCustomer || selectedAssetId) && (
                        <div className="space-y-6 sticky top-6">
                            {/* Summary & Breakdown Card */}
                            <div className="bg-[#001080] text-white p-6 rounded-[2.5rem] shadow-xl space-y-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -mr-16 -mt-16 pointer-events-none"></div>

                                {/* 1. Asset Recap */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white">
                                            {(() => {
                                                const activeType = LOAN_TYPES.find(t => t.id === selectedType) || LOAN_TYPES[0];
                                                const Icon = activeType.icon;
                                                return <Icon className="w-6 h-6" />;
                                            })()}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-black text-lg tracking-tight truncate">
                                                {selectedType === 'land'
                                                    ? (formData.deedNumber ? `โฉนดเลขที่ ${formData.deedNumber}` : "ที่ดิน")
                                                    : `${formData.brand || "ระบุยี่ห้อ"} ${formData.model || ""}`
                                                }
                                            </p>
                                            <Badge variant="outline" className="h-5 text-[10px] bg-white/10 text-white border-white/20 px-2">
                                                {formData.legalStatus === 'pawned' ? 'ติดจำนำ' : formData.legalStatus === 'lease' ? 'ติดเช่าซื้อ' : 'ปลอดภาระ'}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Asset Details Badge/Row */}
                                    <div className="flex flex-wrap gap-2">
                                        {selectedType !== 'land' ? (
                                            <>
                                                {formData.year && <span className="px-2.5 py-1 bg-white/5 rounded-lg text-[10px] font-bold text-white/60">ปี {formData.year}</span>}
                                                {formData.licensePlate && <span className="px-2.5 py-1 bg-white/5 rounded-lg text-[10px] font-bold text-white/60">{formData.licensePlate}{formData.registrationProvince ? ` ${formData.registrationProvince}` : ''}</span>}
                                                {formData.mileage && <span className="px-2.5 py-1 bg-white/5 rounded-lg text-[10px] font-bold text-white/60">{Number(formData.mileage).toLocaleString()} กม.</span>}
                                            </>
                                        ) : (
                                            <>
                                                {formData.rai !== undefined && <span className="px-2.5 py-1 bg-white/5 rounded-lg text-[10px] font-bold text-white/60">{formData.rai} ไร่ {formData.ngan} งาน</span>}
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* 2. Calculation Breakdown */}
                                <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-3">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40">ข้อมูลวงเงินประเมิน</p>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center group">
                                            <span className="text-sm text-white/60">ราคาประเมิน:</span>
                                            <span className="text-base font-bold text-white">฿{formData.appraisalPrice ? Number(formData.appraisalPrice).toLocaleString() : '0'}</span>
                                        </div>

                                        <div className="flex justify-between items-center group">
                                            <span className="text-sm text-white/60">วงเงินกู้ (LTV 90%):</span>
                                            <span className="text-base font-bold text-emerald-400">฿{Math.floor((formData.appraisalPrice || 0) * 0.9).toLocaleString()}</span>
                                        </div>

                                        {(formData.legalStatus === 'pawned' || formData.legalStatus === 'lease') && (
                                            <div className="flex justify-between items-center group">
                                                <span className="text-sm text-red-400">หัก: {formData.legalStatus === 'pawned' ? 'ยอดหนี้เดิม' : 'ยอดปิดบัญชี'}:</span>
                                                <span className="text-base font-bold text-red-400">- ฿{Number(formData.legalStatus === 'pawned' ? formData.pawnedRemainingDebt : formData.leasePayoffBalance).toLocaleString()}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Total Container */}
                                    <div className="mt-6 pt-6 border-t border-white/10">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">วงเงินกู้สูงสุดที่ได้รับ</p>
                                        <div className="flex justify-between items-baseline">
                                            <h3 className="text-4xl font-black text-chaiyo-gold tracking-tighter">
                                                ฿{Math.max(0, Math.floor((formData.appraisalPrice || 0) * 0.9) - (Number(formData.legalStatus === 'pawned' ? formData.pawnedRemainingDebt : formData.leasePayoffBalance) || 0)).toLocaleString()}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Collateral Type Selection (Mini Info) */}
                            {(!isExistingCustomer || (isExistingCustomer && !selectedAssetId)) && !isExistingCustomer && (
                                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                                    <Label className="text-[10px] font-black text-muted uppercase tracking-widest">ประเภทหลักประกันที่เลือก</Label>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200/50">
                                        <div className="w-8 h-8 rounded-full bg-chaiyo-blue text-white flex items-center justify-center shrink-0 shadow-sm">
                                            {(() => {
                                                const activeType = LOAN_TYPES.find(t => t.id === selectedType) || LOAN_TYPES[0];
                                                const Icon = activeType.icon;
                                                return <Icon className="w-4 h-4" />;
                                            })()}
                                        </div>
                                        <span className="font-bold text-sm text-foreground">
                                            {LOAN_TYPES.find(t => t.id === selectedType)?.label || selectedType}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN: Form Details */}
                <div className="lg:col-span-8 space-y-6">

                    <div className="flex justify-between items-center mb-2">
                        <Label className="text-base font-bold text-foreground">รายละเอียดหลักประกัน</Label>
                    </div>

                    {/* Leftover Tabs for existing customers adding new assets */}
                    {isExistingCustomer && !selectedAssetId && (
                        <div className="flex w-full overflow-x-auto no-scrollbar items-end pl-2 mb-6">
                            {LOAN_TYPES.map((type) => {
                                const isActive = selectedType === type.id;
                                return (
                                    <button
                                        key={type.id}
                                        onClick={() => handleTypeSelect(type.id)}
                                        className={cn(
                                            "flex flex-col items-center justify-center gap-2 px-8 py-4 min-w-[120px] transition-all duration-300 relative group outline-none cursor-pointer",
                                            "rounded-t-2xl",
                                            isActive
                                                ? "bg-white text-chaiyo-blue z-20 translate-y-[2px]"
                                                : "bg-gray-50 text-muted hover:bg-gray-100 z-10 mb-[2px]"
                                        )}
                                    >
                                        {isActive && <div className="absolute top-0 left-0 right-0 h-1 bg-chaiyo-blue rounded-t-full"></div>}
                                        <type.icon className={cn("w-6 h-6", isActive ? "scale-110" : "opacity-50")} />
                                        <span className={cn("text-xs font-bold", isActive ? "" : "opacity-70")}>{type.label}</span>
                                    </button>
                                )
                            })}
                        </div>
                    )}

                    {/* Main Content Area */}
                    <div className="bg-white pt-6 relative z-10">

                        {/* 1. Vehicle Form (Cleaned up, no Appraisal) */}
                        {!isLand && (
                            <div className="grid gap-x-10 gap-y-6 md:grid-cols-2 animate-in fade-in duration-500">
                                <div className="space-y-2">
                                    <Label className="text-[13px] font-bold text-muted ml-1">ปีจดทะเบียน</Label>
                                    <Input
                                        placeholder="เช่น 2020"
                                        className="font-mono h-14 rounded-xl text-lg disabled:opacity-100 disabled:bg-gray-50 disabled:text-gray-600"
                                        value={formData.year || ""}
                                        onChange={(e) => handleChange("year", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[13px] font-bold text-muted ml-1">ยี่ห้อ</Label>
                                    <Input
                                        placeholder="Toyota, Honda..."
                                        className="h-14 rounded-xl text-lg disabled:opacity-100 disabled:bg-gray-50 disabled:text-gray-600"
                                        value={formData.brand || ""}
                                        onChange={(e) => handleChange("brand", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[13px] font-bold text-muted ml-1">รุ่น</Label>
                                    <Input
                                        placeholder="Hilux Revo..."
                                        className="h-14 rounded-xl text-lg disabled:opacity-100 disabled:bg-gray-50 disabled:text-gray-600"
                                        value={formData.model || ""}
                                        onChange={(e) => handleChange("model", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[13px] font-bold text-muted ml-1">สี</Label>
                                    <Input
                                        placeholder="ขาว, ดำ..."
                                        className="h-14 rounded-xl text-lg disabled:opacity-100 disabled:bg-gray-50 disabled:text-gray-600"
                                        value={formData.color || ""}
                                        onChange={(e) => handleChange("color", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[13px] font-bold text-muted ml-1">เลขทะเบียน</Label>
                                    <Input
                                        placeholder="1กข 1234"
                                        className="h-14 rounded-xl text-lg disabled:opacity-100 disabled:bg-gray-50 disabled:text-gray-600"
                                        value={formData.licensePlate || ""}
                                        onChange={(e) => handleChange("licensePlate", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[13px] font-bold text-muted ml-1">จังหวัดที่จดทะเบียน</Label>
                                    <Input
                                        placeholder="กรุงเทพมหานคร"
                                        className="h-14 rounded-xl text-lg disabled:opacity-100 disabled:bg-gray-50 disabled:text-gray-600"
                                        value={formData.registrationProvince || ""}
                                        onChange={(e) => handleChange("registrationProvince", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[13px] font-bold text-muted ml-1">เลขไมล์</Label>
                                    <div className="relative">
                                        <Input
                                            placeholder="0"
                                            className="h-14 rounded-xl text-lg pr-12 text-right font-mono disabled:opacity-100 disabled:bg-gray-50 disabled:text-gray-600"
                                            value={formData.mileage ? formatNumber(formData.mileage) : ""}
                                            onChange={(e) => {
                                                const rawValue = e.target.value.replace(/,/g, "");
                                                if (rawValue === "" || /^\d+$/.test(rawValue)) {
                                                    handleChange("mileage", rawValue === "" ? 0 : Number(rawValue));
                                                }
                                            }}
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted font-bold text-xs">กม.</span>
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <Label className="text-[13px] font-bold text-muted ml-1">เลขตัวถัง (VIN)</Label>
                                    <Input
                                        placeholder="ระบุเลขตัวถัง..."
                                        className="font-mono uppercase h-14 rounded-xl text-lg disabled:opacity-100 disabled:bg-gray-50 disabled:text-gray-600"
                                        value={formData.vin || ""}
                                        onChange={(e) => handleChange("vin", e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        {/* 2. Land Form */}
                        {isLand && (
                            <div className="grid gap-x-10 gap-y-8 md:grid-cols-2 animate-in fade-in duration-500">
                                <div className="space-y-2">
                                    <Label className="text-[13px] font-bold text-muted ml-1">เลขที่โฉนด</Label>
                                    <Input
                                        placeholder="ระบุเลขที่โฉนด"
                                        className="h-14 rounded-xl text-lg disabled:opacity-100 disabled:bg-gray-50 disabled:text-gray-600"
                                        value={formData.deedNumber || ""}
                                        onChange={(e) => handleChange("deedNumber", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[13px] font-bold text-muted ml-1">เลขที่ดิน</Label>
                                    <Input
                                        placeholder="ระบุเลขที่ดิน"
                                        className="h-14 rounded-xl text-lg disabled:opacity-100 disabled:bg-gray-50 disabled:text-gray-600"
                                        value={formData.parcelNumber || ""}
                                        onChange={(e) => handleChange("parcelNumber", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[13px] font-bold text-muted ml-1">ระวาง</Label>
                                    <Input
                                        placeholder="ระบุระวาง"
                                        className="h-14 rounded-xl text-lg disabled:opacity-100 disabled:bg-gray-50 disabled:text-gray-600"
                                        value={formData.gridNumber || ""}
                                        onChange={(e) => handleChange("gridNumber", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[13px] font-bold text-muted ml-1">หน้าสำรวจ</Label>
                                    <Input
                                        placeholder="ระบุหน้าสำรวจ"
                                        className="h-14 rounded-xl text-lg disabled:opacity-100 disabled:bg-gray-50 disabled:text-gray-600"
                                        value={formData.surveyPage || ""}
                                        onChange={(e) => handleChange("surveyPage", e.target.value)}
                                    />
                                </div>
                                <div className="md:col-span-2 grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[13px] font-bold text-muted ml-1">ไร่</Label>
                                        <Input
                                            type="number" placeholder="0"
                                            className="h-14 rounded-xl text-lg text-center disabled:opacity-100 disabled:bg-gray-50 disabled:text-gray-600"
                                            value={formData.rai || ""}
                                            onChange={(e) => handleChange("rai", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[13px] font-bold text-muted ml-1">งาน</Label>
                                        <Input
                                            type="number" placeholder="0"
                                            className="h-14 rounded-xl text-lg text-center disabled:opacity-100 disabled:bg-gray-50 disabled:text-gray-600"
                                            value={formData.ngan || ""}
                                            onChange={(e) => handleChange("ngan", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[13px] font-bold text-muted ml-1">ตร.ว.</Label>
                                        <Input
                                            type="number" placeholder="0"
                                            className="h-14 rounded-xl text-lg text-center disabled:opacity-100 disabled:bg-gray-50 disabled:text-gray-600"
                                            value={formData.wah || ""}
                                            onChange={(e) => handleChange("wah", e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 2.5 Appraisal Price Section */}
                        <div className="mt-8 pt-8 border-t border-gray-100 space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
                            <Label className="text-base font-bold text-foreground">ราคาประเมินทรัพย์สิน</Label>
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                <div className="relative flex-1 w-full max-w-md group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-700 font-bold text-xl transition-transform group-focus-within:scale-110">฿</span>
                                    <Input
                                        type="text"
                                        className="h-16 pl-10 pr-6 text-3xl font-mono font-bold text-right text-emerald-800 bg-emerald-50/30 border-emerald-100/50 focus:bg-white focus:border-emerald-500 focus:ring-emerald-500/20 transition-all rounded-[1.25rem] shadow-sm w-full"
                                        value={formData.appraisalPrice ? formatNumber(formData.appraisalPrice) : ""}
                                        onChange={handleAppraisalChange}
                                        placeholder="0"
                                    />
                                    {!formData.appraisalPrice && !isAnalyzing && (
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-20">
                                            <Sparkles className="w-6 h-6 text-emerald-600" />
                                        </div>
                                    )}
                                </div>
                                <Button
                                    onClick={handleReanalyze}
                                    disabled={isAnalyzing}
                                    className={cn(
                                        "h-16 px-8 rounded-2xl font-bold transition-all shrink-0",
                                        isAnalyzing ? "bg-emerald-100 text-emerald-700" : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200"
                                    )}
                                >
                                    {isAnalyzing ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin" />
                                            กำลังคำนวณ...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="w-5 h-5" />
                                            คำนวนราคาประเมิน
                                        </div>
                                    )}
                                </Button>
                            </div>
                            <p className="text-[11px] text-muted-foreground italic ml-1">
                                *ระบุหรือกดคำนวณเพื่อใช้คำนวณวงเงินกู้เบื้องต้น (LTV 90%)
                            </p>
                        </div>

                        {/* 3. Legal Status Section */}
                        <div className="mt-10 pt-8 border-t border-gray-100 space-y-6">
                            <Label className="text-base font-bold text-foreground">สถานะทางกฎหมายของทรัพย์สิน</Label>

                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { id: 'free', label: 'ปลอดภาระ', desc: 'มีเล่มทะเบียน' },
                                    { id: 'pawned', label: 'ติดจำนำ', desc: 'จำนำเล่มทะเบียน' },
                                    { id: 'lease', label: 'ติดเช่าซื้อ', desc: 'ผ่อนกับไฟแนนซ์' },
                                ].map((status) => (
                                    <button
                                        key={status.id}
                                        onClick={() => handleChange("legalStatus", status.id)}
                                        className={cn(
                                            "flex flex-col items-center justify-center p-4 border-2 rounded-2xl transition-all duration-300 gap-1",
                                            formData.legalStatus === status.id || (!formData.legalStatus && status.id === 'free')
                                                ? "border-chaiyo-blue bg-blue-50/50 text-chaiyo-blue shadow-sm"
                                                : "border-border-subtle text-muted hover:border-gray-300"
                                        )}
                                    >
                                        <span className="font-bold text-sm">{status.label}</span>
                                        <span className="text-[10px] opacity-70">{status.desc}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Conditional Inputs for Debt */}
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                {formData.legalStatus === 'pawned' && (
                                    <div className="space-y-2 max-w-md">
                                        <Label className="text-[13px] font-bold text-muted ml-1 text-red-600">ยอดหนี้คงเหลือจากที่เดิม (บาท)</Label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold">฿</span>
                                            <Input
                                                placeholder="0"
                                                type="text"
                                                className="h-14 pl-10 rounded-xl text-lg font-mono text-red-600 border-red-100 bg-red-50/30"
                                                value={formData.pawnedRemainingDebt ? formatNumber(formData.pawnedRemainingDebt) : ""}
                                                onChange={(e) => {
                                                    const rawValue = e.target.value.replace(/,/g, "");
                                                    if (rawValue === "" || /^\d+$/.test(rawValue)) {
                                                        handleChange("pawnedRemainingDebt", rawValue === "" ? 0 : Number(rawValue));
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {formData.legalStatus === 'lease' && (
                                    <div className="space-y-2 max-w-md">
                                        <Label className="text-[13px] font-bold text-muted ml-1 text-red-600">ยอดหนี้ปิดบัญชี (Payoff Balance) (บาท)</Label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold">฿</span>
                                            <Input
                                                placeholder="0"
                                                type="text"
                                                className="h-14 pl-10 rounded-xl text-lg font-mono text-red-600 border-red-100 bg-red-50/30"
                                                value={formData.leasePayoffBalance ? formatNumber(formData.leasePayoffBalance) : ""}
                                                onChange={(e) => {
                                                    const rawValue = e.target.value.replace(/,/g, "");
                                                    if (rawValue === "" || /^\d+$/.test(rawValue)) {
                                                        handleChange("leasePayoffBalance", rawValue === "" ? 0 : Number(rawValue));
                                                    }
                                                }}
                                            />
                                        </div>
                                        <p className="text-[11px] text-muted italic ml-1">*ยอดปิดบัญชีรวมภาษีมูลค่าเพิ่ม (VAT) แล้ว</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
