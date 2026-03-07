"use client";

import { useState, useEffect } from "react";
import { Car, Bike, Truck, Tractor, MapIcon, Sparkles, FileText, Camera, UserCheck, Calculator } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { cn } from "@/lib/utils";

interface CollateralStepProps {
    formData: any;
    setFormData: (data: any) => void;
    isExistingCustomer?: boolean;
    existingCollaterals?: any[];
}

export function CollateralStep({ formData, setFormData, isExistingCustomer = false, existingCollaterals = [] }: CollateralStepProps) {
    const [selectedType, setSelectedType] = useState<string>(formData.collateralType || "car");

    useEffect(() => {
        if (formData.collateralType) {
            let type = formData.collateralType as string;
            if (type === 'agriculture_car') type = 'agri';
            setSelectedType(type);
        }
    }, [formData.collateralType]);

    const handleChange = (field: string, value: string | number) => {
        setFormData({ ...formData, [field]: value });
    };

    const LOAN_TYPES = [
        { id: "car", label: "รถยนต์", icon: Car },
        { id: "moto", label: "มอเตอร์ไซค์", icon: Bike },
        { id: "truck", label: "รถบรรทุก", icon: Truck },
        { id: "agri", label: "เกษตร", icon: Tractor },
        { id: "land", label: "ที่ดิน", icon: MapIcon },
    ];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2">
            <div className="grid gap-8 grid-cols-1 lg:grid-cols-12">

                {/* LEFT COLUMN: Sidebar Summary */}
                <div className="lg:col-span-4 space-y-6 order-last lg:order-last">
                    <div className="space-y-6 sticky top-6">
                        {/* Summary & Breakdown Card */}
                        <div className="bg-chaiyo-blue text-white p-6 rounded-[2.5rem] shadow-xl space-y-8 relative overflow-hidden">
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
                                            {selectedType === 'land' ? "ที่ดิน" : "รถ"}
                                        </p>
                                        <Badge variant="outline" className="h-5 text-[10px] bg-white/10 text-white border-white/20 px-2">
                                            รอดำเนินการ
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* 2. Calculation Breakdown */}
                            <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-3">
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">ข้อมูลวงเงินกู้</p>
                                <div className="mt-2 pt-2 border-t border-white/10">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="text-4xl font-black text-chaiyo-gold tracking-tighter">
                                            ฿0
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Form Details */}
                <div className="lg:col-span-8 space-y-6">
                    {/* SECTION 1: ข้อมูลหลักประกัน */}
                    <Card className="border-border-strong overflow-hidden">
                        <CardHeader className="bg-blue-50/50 border-b border-border-strong pb-4">
                            <CardTitle className="text-lg flex items-center gap-2 text-chaiyo-blue font-bold">
                                <FileText className="w-5 h-5" />
                                ข้อมูลหลักประกัน
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <p className="text-xs text-muted-foreground mb-6 bg-gray-50 p-3 rounded-lg border border-gray-100 italic">
                                * ข้อมูลส่วนนี้ดึงมาจากแบบสอบถามคัดกรองเบื้องต้น (Pre-screening) และไม่สามารถแก้ไขได้ในขั้นตอนนี้
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="space-y-1">
                                    <Label className="text-[13px] text-muted ml-1">ชื่อหลักประกัน</Label>
                                    <div className="h-12 flex items-center ml-1">
                                        <h3 className="text-2xl font-bold text-chaiyo-blue tracking-tight">2334582260</h3>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[13px] text-muted ml-1">ประเภทหลักประกัน <span className="text-red-500">*</span></Label>
                                    <Input
                                        disabled
                                        value="รถกระบะ"
                                        className="h-12 rounded-xl bg-gray-50/50 border-gray-200 disabled:opacity-100 disabled:text-gray-900 font-medium"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* SECTION 2: ข้อมูลผู้ถือกรรมสิทธิ์ */}
                    <Card className="border-border-strong overflow-hidden">
                        <CardHeader className="bg-blue-50/50 border-b border-border-strong pb-4">
                            <CardTitle className="text-lg flex items-center gap-2 text-chaiyo-blue font-bold">
                                <UserCheck className="w-5 h-5" />
                                ข้อมูลผู้ถือกรรมสิทธิ์
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="py-12 flex flex-col items-center justify-center text-gray-400 italic bg-gray-50/30 rounded-xl border border-dashed border-gray-200">
                                <UserCheck className="w-10 h-10 opacity-20 mb-3" />
                                <p className="text-sm">รอการออกแบบฟอร์มข้อมูลผู้ถือกรรมสิทธิ์...</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* SECTION 3: วิธีการประเมิน */}
                    <Card className="border-border-strong overflow-hidden">
                        <CardHeader className="bg-blue-50/50 border-b border-border-strong pb-4">
                            <CardTitle className="text-lg flex items-center gap-2 text-chaiyo-blue font-bold">
                                <Calculator className="w-5 h-5" />
                                วิธีการประเมิน
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <p className="text-xs text-muted-foreground mb-6">
                                วิธีการประเมินราคาหลักประกันสำหรับ: <Badge variant="secondary" className="ml-1 bg-chaiyo-blue/10 text-chaiyo-blue border-none">{formData.collateralType === 'land' ? 'โฉนดที่ดิน' : 'รถ'}</Badge>
                            </p>
                            <div className="py-12 flex flex-col items-center justify-center text-gray-400 italic bg-gray-50/30 rounded-xl border border-dashed border-gray-200">
                                <Calculator className="w-10 h-10 opacity-20 mb-3" />
                                <p className="text-sm">รอการออกแบบฟอร์มวิธีการประเมิน...</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
