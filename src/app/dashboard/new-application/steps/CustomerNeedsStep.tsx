"use client";

import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Card, CardContent } from "@/components/ui/Card";
import { MessageSquare, Target, Banknote, Car, Bike, Truck, Tractor, Map, HelpCircle } from "lucide-react";

interface CustomerNeedsStepProps {
    formData: any;
    setFormData: (data: any) => void;
    isExistingCustomer?: boolean;
    existingAssets?: any[];
}

export function CustomerNeedsStep({ formData, setFormData, isExistingCustomer, existingAssets }: CustomerNeedsStepProps) {

    const handleChange = (field: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleMultipleChange = (updates: Record<string, any>) => {
        setFormData((prev: any) => ({ ...prev, ...updates }));
    };

    const formatNumber = (num: number | string) => {
        if (!num && num !== 0) return "";
        const parts = num.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/,/g, "");
        if (rawValue === "" || /^\d+$/.test(rawValue)) {
            handleChange('requestedAmount', rawValue === "" ? 0 : Number(rawValue));
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Purpose */}
                <Card className="border-gray-200 shadow-sm rounded-2xl overflow-hidden">
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-chaiyo-gold/10 flex items-center justify-center text-chaiyo-gold">
                                <Target className="w-5 h-5" />
                            </div>
                            <div>
                                <Label className="text-base text-foreground">วัตถุประสงค์การใช้เงิน</Label>
                                <p className="text-xs text-muted">ลูกค้าต้องการนำเงินไปใช้ทำอะไร?</p>
                            </div>
                        </div>

                        <Select value={formData.loanPurpose || ""} onValueChange={(val) => handleChange('loanPurpose', val)}>
                            <SelectTrigger className="bg-white">
                                <SelectValue placeholder="เลือกวัตถุประสงค์" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="business">ลงทุน/หมุนเวียนธุรกิจ</SelectItem>
                                <SelectItem value="personal">ใช้จ่ายส่วนตัว/ครอบครัว</SelectItem>
                                <SelectItem value="debt">ชำระหนี้สิน</SelectItem>
                                <SelectItem value="medical">รักษาพยาบาล</SelectItem>
                                <SelectItem value="agriculture">การเกษตร</SelectItem>
                                <SelectItem value="other">อื่นๆ</SelectItem>
                            </SelectContent>
                        </Select>

                        {formData.loanPurpose === 'other' && (
                            <Input
                                placeholder="ระบุรายละเอียดเพิ่มเติม"
                                value={formData.loanPurposeOther || ""}
                                onChange={(e) => handleChange('loanPurposeOther', e.target.value)}
                            />
                        )}
                    </CardContent>
                </Card>

                {/* 2. Amount */}
                <Card className="border-gray-200 shadow-sm rounded-2xl overflow-hidden">
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-chaiyo-blue">
                                <Banknote className="w-5 h-5" />
                            </div>
                            <div>
                                <Label className="text-base text-foreground">จำนวนสินเชื่อที่ต้องการ</Label>
                                <p className="text-xs text-muted">ลูกค้าต้องการสินเชื่อประมาณเท่าไหร่?</p>
                            </div>
                        </div>

                        <div className="relative">
                            <Input
                                type="text"
                                className="pl-4 pr-12 text-lg font-bold text-chaiyo-blue"
                                value={formData.requestedAmount ? formatNumber(formData.requestedAmount) : ""}
                                onChange={handleAmountChange}
                                placeholder="0"
                            />
                            <span className="absolute right-4 top-2.5 text-muted font-bold text-sm">บาท</span>
                        </div>
                        <p className="text-xs text-muted/80 text-right">
                            * เป็นเพียงการประเมินเบื้องต้น
                        </p>
                    </CardContent>
                </Card>

                {/* 3. Collateral Check */}
                <Card className="border-gray-200 shadow-sm rounded-2xl overflow-hidden md:col-span-2">
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                <Car className="w-5 h-5" />
                            </div>
                            <div>
                                <Label className="text-base text-foreground">ทรัพย์สินค้ำประกัน</Label>
                                <p className="text-xs text-muted">เลือกทรัพย์สินที่จะนำมาเป็นหลักประกันในครั้งนี้</p>
                            </div>
                        </div>

                        {isExistingCustomer && existingAssets && existingAssets.length > 0 ? (
                            <div className="space-y-4">
                                <p className="text-xs font-bold text-muted uppercase tracking-wider">เลือกจากทรัพย์สินเดิมของลูกค้า</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {existingAssets.filter(a => a.assetType !== 'unsecured').map((asset) => {
                                        const totalBalance = asset.loans.reduce((sum: number, loan: any) => sum + loan.balance, 0);
                                        const availableTopup = Math.max(0, (asset.maxLtvLimit || 0) - totalBalance);
                                        const Icon = asset.assetType === 'moto' ? Bike : Car;

                                        return (
                                            <div
                                                key={asset.id}
                                                onClick={() => {
                                                    handleMultipleChange({
                                                        existingAssetId: asset.id,
                                                        collateralType: asset.assetType
                                                    });
                                                }}
                                                className={`
                                                    cursor-pointer rounded-2xl border-2 p-4 transition-all hover:bg-gray-50 flex items-center gap-4
                                                    ${formData.existingAssetId === asset.id
                                                        ? 'border-chaiyo-blue bg-blue-50/50'
                                                        : 'border-gray-100 bg-white'}
                                                `}
                                            >
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${formData.existingAssetId === asset.id ? 'bg-chaiyo-blue text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                    <Icon className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-sm text-foreground truncate">{asset.type}</p>
                                                    <p className="text-[10px] text-muted font-bold uppercase">{asset.plate}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-bold text-emerald-600 uppercase">กู้เพิ่มได้</p>
                                                    <p className="text-sm font-black text-emerald-700">{availableTopup.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* Option to add new collateral for existing customer */}
                                    <div
                                        onClick={() => {
                                            handleMultipleChange({
                                                existingAssetId: 'new',
                                                collateralType: ''
                                            });
                                        }}
                                        className={`
                                            cursor-pointer rounded-2xl border-2 p-4 transition-all hover:bg-gray-50 flex items-center gap-4 border-dashed
                                            ${formData.existingAssetId === 'new'
                                                ? 'border-chaiyo-blue bg-blue-50/50'
                                                : 'border-gray-200 bg-white'}
                                        `}
                                    >
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${formData.existingAssetId === 'new' ? 'bg-chaiyo-blue text-white' : 'bg-gray-100 text-gray-400'}`}>
                                            <HelpCircle className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-foreground">ใช้ทรัพย์สินใหม่</p>
                                            <p className="text-[10px] text-muted font-bold">เพิ่มทรัพย์สินที่ไม่เคยเข้าร่วมโครงการ</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Selection grid for NEW collateral if 'new' is selected or not an existing customer */}
                                {(formData.existingAssetId === 'new') && (
                                    <div className="pt-6 border-t border-gray-100 animate-in fade-in slide-in-from-top-4">
                                        <p className="text-xs font-bold text-muted uppercase tracking-wider mb-4">ระบุประเภททรัพย์สินใหม่</p>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {[
                                                { id: 'car', label: 'รถเก๋ง/กระบะ', icon: Car },
                                                { id: 'moto', label: 'มอเตอร์ไซค์', icon: Bike },
                                                { id: 'truck', label: 'รถบรรทุก', icon: Truck },
                                                { id: 'agriculture_car', label: 'รถไถ/การเกษตร', icon: Tractor },
                                                { id: 'land', label: 'โฉนดที่ดิน', icon: Map },
                                                { id: 'none', label: 'ไม่มี/ไม่แน่ใจ', icon: HelpCircle },
                                            ].map((item) => (
                                                <div
                                                    key={item.id}
                                                    onClick={() => handleChange('collateralType', item.id)}
                                                    className={`
                                                        cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center justify-center gap-2 transition-all hover:bg-gray-50
                                                        ${formData.collateralType === item.id
                                                            ? 'border-chaiyo-blue bg-blue-50/50 text-chaiyo-blue'
                                                            : 'border-gray-100 bg-white text-muted'}
                                                    `}
                                                >
                                                    <item.icon className={`w-10 h-10 mb-2 ${formData.collateralType === item.id ? 'text-chaiyo-blue' : 'text-gray-300'}`} />
                                                    <span className="font-bold text-sm text-center">{item.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { id: 'car', label: 'รถเก๋ง/กระบะ', icon: Car },
                                    { id: 'moto', label: 'มอเตอร์ไซค์', icon: Bike },
                                    { id: 'truck', label: 'รถบรรทุก', icon: Truck },
                                    { id: 'agriculture_car', label: 'รถไถ/การเกษตร', icon: Tractor },
                                    { id: 'land', label: 'โฉนดที่ดิน', icon: Map },
                                    { id: 'none', label: 'ไม่มี/ไม่แน่ใจ', icon: HelpCircle },
                                ].map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => handleChange('collateralType', item.id)}
                                        className={`
                                            cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center justify-center gap-2 transition-all hover:bg-gray-50
                                            ${formData.collateralType === item.id
                                                ? 'border-chaiyo-blue bg-blue-50/50 text-chaiyo-blue'
                                                : 'border-gray-100 bg-white text-muted'}
                                        `}
                                    >
                                        <item.icon className={`w-10 h-10 mb-2 ${formData.collateralType === item.id ? 'text-chaiyo-blue' : 'text-gray-300'}`} />
                                        <span className="font-bold text-sm text-center">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
