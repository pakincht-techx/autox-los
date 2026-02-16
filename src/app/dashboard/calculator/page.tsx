"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { QuotationPrint } from "@/components/calculator/QuotationPrint";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { ChevronLeft, Printer, FileText, PiggyBank, Briefcase, Car, Camera, Check, Sparkles, Bike, Truck, Tractor, Map, Upload, Eye, X, ChevronRight, Plus, CreditCard, Gift, Shield, Percent, ArrowRight, Star, User, Banknote } from "lucide-react";
import { Combobox } from "@/components/ui/combobox";
import { cn } from "@/lib/utils";

const CAR_BRANDS = [
    { value: "toyota", label: "Toyota" },
    { value: "honda", label: "Honda" },
    { value: "isuzu", label: "Isuzu" },
    { value: "mitsubishi", label: "Mitsubishi" },
    { value: "nissan", label: "Nissan" },
    { value: "mazda", label: "Mazda" },
    { value: "ford", label: "Ford" },
    { value: "suzuki", label: "Suzuki" },
    { value: "mg", label: "MG" },
    { value: "byd", label: "BYD" },
    { value: "gwm", label: "GWM" },
    { value: "bmw", label: "BMW" },
    { value: "mercedes", label: "Mercedes-Benz" },
];

const CAR_MODELS = [
    { value: "yaris", label: "Yaris" },
    { value: "vios", label: "Vios" },
    { value: "altis", label: "Corolla Altis" },
    { value: "camry", label: "Camry" },
    { value: "hilux", label: "Hilux Revo" },
    { value: "fortuner", label: "Fortuner" },
    { value: "city", label: "City" },
    { value: "civic", label: "Civic" },
    { value: "crv", label: "CR-V" },
    { value: "hrv", label: "HR-V" },
    { value: "accord", label: "Accord" },
    { value: "dmax", label: "D-Max" },
    { value: "mux", label: "MU-X" },
    { value: "triton", label: "Triton" },
    { value: "pajero", label: "Pajero Sport" },
    { value: "ranger", label: "Ranger" },
    { value: "everest", label: "Everest" },
    { value: "attrage", label: "Attrage" },
    { value: "mirage", label: "Mirage" },
    { value: "swift", label: "Swift" },
    { value: "ciaz", label: "Ciaz" },
];

const YEARS = Array.from({ length: 30 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year.toString(), label: year.toString() };
});

export default function CalculatorPage() {
    const router = useRouter();
    // Local state for "Sales Talk"
    const [formData, setFormData] = useState<any>({
        collateralType: 'car',
        appraisalPrice: 0,
        income: 0,
        // Defaults for CalculatorStep
        requestedAmount: 0,
        requestedDuration: 24,
    });

    // Step 1: Select Type
    // Step 2: Upload / Analyze
    // Step 3: Info
    // Step 4: Calculate (Result)
    // Step 4: Calculate (Result)
    const [currentStep, setCurrentStep] = useState(1);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Lightbox State
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const uploadedDocs = [
        "https://placehold.co/600x800/e2e8f0/1e293b?text=Registration+Book+Page+1",
    ];

    // Enhanced Product List for UI Design
    const PRODUCTS = [
        {
            id: "car",
            label: "รถเก๋ง / รถกระบะ",
            desc: "เล่มทะเบียนรถ",
            icon: Car,
            color: "bg-blue-100 text-blue-600"
        },
        {
            id: "moto",
            label: "รถจักรยานยนต์",
            desc: "เล่มทะเบียนรถ",
            icon: Bike,
            color: "bg-purple-100 text-purple-600"
        },
        {
            id: "truck",
            label: "รถบรรทุก",
            desc: "เล่มทะเบียนรถ",
            icon: Truck,
            color: "bg-orange-100 text-orange-600"
        },
        {
            id: "agri",
            label: "รถเพื่อการเกษตร",
            desc: "เล่มทะเบียน หรือ ใบอินวอยซ์/ใบเสร็จซื้อขาย",
            icon: Tractor,
            color: "bg-green-100 text-green-600"
        },
        {
            id: "land",
            label: "ที่ดิน",
            desc: "โฉนดที่ดิน",
            icon: Map,
            color: "bg-yellow-100 text-yellow-600 hover:text-yellow-700"
        },
    ];

    // Document requirements per collateral type (matches CollateralStepNew.tsx)
    const DOCUMENT_REQUIREMENTS: Record<string, { name: string; description: string }> = {
        car: { name: 'เล่มทะเบียนรถ', description: 'หน้ารายการจดทะเบียน' },
        moto: { name: 'เล่มทะเบียนรถ', description: 'หน้ารายการจดทะเบียน' },
        truck: { name: 'เล่มทะเบียนรถ', description: 'หน้ารายการจดทะเบียน' },
        agri: { name: 'เล่มทะเบียน หรือ ใบอินวอยซ์/ใบเสร็จซื้อขาย', description: 'เอกสารแสดงกรรมสิทธิ์' },
        land: { name: 'โฉนดที่ดิน', description: 'หน้าแรก - ครุฑ' },
    };

    const handlePrint = () => {
        const date = new Date();
        const yyyymmdd = date.toISOString().slice(0, 10).replace(/-/g, '');

        // Mobile/Local Counter Logic
        const stored = localStorage.getItem('dailyPrintCounter');
        let counter = 1;

        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.date === yyyymmdd) {
                counter = parsed.count + 1;
            }
        }

        // Save new counter
        localStorage.setItem('dailyPrintCounter', JSON.stringify({ date: yyyymmdd, count: counter }));

        // Format ID as 3 digits (e.g., 001)
        const id = counter.toString().padStart(3, '0');

        document.title = `${yyyymmdd}_${id}_quotation`;
        window.print();
    };

    const handleCreateApplication = () => {
        // Save current sales talk data to localStorage for prefilling the application form
        localStorage.setItem('salesTalkData', JSON.stringify(formData));
        router.push("/dashboard/new-application");
    };

    const nextStep = () => setCurrentStep(prev => prev + 1);
    const prevStep = () => setCurrentStep(prev => prev - 1);

    // Mock AI Analysis from Photo Step
    const handleAnalyze = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            // Mock Data Filling based on type
            let mockData: any = {
                appraisalPrice: 450000
            };

            if (formData.collateralType === 'car') {
                mockData = { ...mockData, brand: 'Toyota', model: 'Camry', year: '2019', mileage: 85000 };
            } else if (formData.collateralType === 'moto') {
                mockData = { ...mockData, brand: 'Honda', model: 'Wave 125i', year: '2021', appraisalPrice: 35000 };
            } else if (formData.collateralType === 'land') {
                mockData = { ...mockData, landRai: 1, landNgan: 2, landWah: 50, province: 'กรุงเทพมหานคร', appraisalPrice: 2500000 };
            }

            setFormData((prev: any) => ({ ...prev, ...mockData }));
            setIsAnalyzing(false);
            nextStep(); // Go to Step 3
        }, 2000);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 h-full max-w-5xl mx-auto pb-20">
            {/* Header / Nav */}
            <div className="flex items-center justify-between print:hidden">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/dashboard")}
                    className="text-muted hover:text-foreground -ml-2"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    กลับไปที่แผงควบคุม
                </Button>
            </div>

            {/* Stepper Indicator (Matching Application Flow) */}
            <div className="flex justify-center items-center mb-16 print:hidden w-full">
                <div className="relative flex items-center justify-between w-full max-w-2xl px-4 md:px-12">
                    {/* Progress Line */}
                    <div className="absolute left-4 right-4 md:left-12 md:right-12 top-[14px] -translate-y-1/2 h-[2px] bg-gray-200 z-0">
                        <div
                            className="h-full bg-chaiyo-blue transition-all duration-500 ease-in-out"
                            style={{
                                width: `${((currentStep - 1) / 4) * 100}%`
                            }}
                        ></div>
                    </div>

                    {[
                        { id: 1, label: "เลือกประเภท", icon: Car },
                        { id: 2, label: "อัปโหลดเอกสาร", icon: Camera },
                        { id: 3, label: "ข้อมูลหลักประกัน", icon: Briefcase },
                        { id: 4, label: "ข้อมูลลูกค้า", icon: User },
                        { id: 5, label: "แนะนำสินค้า", icon: Sparkles }
                    ].map((step) => {
                        const isActive = currentStep === step.id;
                        const isCompleted = currentStep > step.id;
                        const Icon = step.icon;

                        return (
                            <div key={step.id} className="relative z-10 flex flex-col items-center">
                                {/* Circle Step Indicator */}
                                <div className={cn(
                                    "w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 bg-white shadow-sm",
                                    isActive
                                        ? "border-chaiyo-blue text-chaiyo-blue shadow-[0_0_0_4px_rgba(37,99,235,0.1)] scale-110"
                                        : isCompleted
                                            ? "bg-chaiyo-blue border-chaiyo-blue text-white"
                                            : "border-gray-200 text-gray-300"
                                )}>
                                    {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
                                </div>

                                {/* Label positioned below */}
                                <div className="absolute top-9 w-24 flex justify-center">
                                    <span className={cn(
                                        "text-[10px] md:text-xs font-bold text-center transition-colors whitespace-nowrap",
                                        isActive ? "text-chaiyo-blue" : isCompleted ? "text-gray-800" : "text-gray-400"
                                    )}>
                                        {step.label}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* STEP 1: Type Selection (Redesigned) */}
            {currentStep === 1 && (
                <div className="max-w-5xl mx-auto print:hidden space-y-8 animate-in slide-in-from-right-8 duration-300">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-chaiyo-blue fill-current" />
                            <h2 className="text-2xl font-bold text-gray-800">เลือกประเภทหลักประกัน</h2>
                        </div>
                        <p className="text-gray-500 pl-8">กรุณาเลือกประเภททรัพย์สินที่ต้องการใช้เป็นหลักประกัน</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {PRODUCTS.map((p) => {
                            const Icon = p.icon;
                            return (
                                <div
                                    key={p.id}
                                    onClick={() => {
                                        setFormData({ ...formData, collateralType: p.id });
                                        setTimeout(nextStep, 200);
                                    }}
                                    className={cn(
                                        "cursor-pointer bg-white rounded-2xl border transition-all p-8 flex flex-col items-center justify-center gap-4 hover:shadow-xl group relative overflow-hidden h-[240px]",
                                        formData.collateralType === p.id
                                            ? "border-chaiyo-blue ring-2 ring-chaiyo-blue/20"
                                            : "border-gray-200 hover:border-chaiyo-blue/30"
                                    )}
                                >
                                    <div className={cn(
                                        "w-20 h-20 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 duration-300",
                                        p.color
                                    )}>
                                        <Icon className="w-10 h-10" />
                                    </div>
                                    <div className="text-center space-y-2 relative z-10">
                                        <h3 className="font-bold text-xl text-gray-800">{p.label}</h3>
                                        <p className="text-sm text-gray-400">{p.desc}</p>
                                    </div>

                                    {/* Hover Effect Background */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity -z-0" />
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* STEP 2: Upload Documents (Type-specific) */}
            {currentStep === 2 && (() => {
                const docReq = DOCUMENT_REQUIREMENTS[formData.collateralType] || DOCUMENT_REQUIREMENTS.car;
                const selectedProduct = PRODUCTS.find(p => p.id === formData.collateralType);
                const TypeIcon = selectedProduct?.icon || Car;
                return (
                    <div className="max-w-4xl mx-auto print:hidden space-y-8 animate-in slide-in-from-right-8 duration-300">
                        {/* Header */}
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <FileText className="w-6 h-6 text-chaiyo-blue" />
                                <h2 className="text-2xl font-bold text-gray-800">อัปโหลดเอกสารหลักประกัน</h2>
                            </div>
                            <p className="text-gray-500 pl-8">กรุณาอัปโหลด{docReq.name} ({docReq.description})</p>
                        </div>

                        {/* Selected Type Badge */}
                        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
                            <div className="flex items-center gap-3">
                                <TypeIcon className="w-5 h-5 text-chaiyo-blue" />
                                <div>
                                    <p className="text-sm font-bold text-chaiyo-blue">{selectedProduct?.label}</p>
                                    <p className="text-xs text-blue-600">ประเภทหลักประกันที่เลือก</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={prevStep}
                                className="text-chaiyo-blue hover:text-chaiyo-blue/80"
                            >
                                เปลี่ยนประเภท
                            </Button>
                        </div>

                        {/* Upload Zone */}
                        <div
                            className={cn(
                                "border-2 border-dashed rounded-3xl p-16 text-center transition-all relative overflow-hidden",
                                isAnalyzing ? "border-chaiyo-blue bg-blue-50/10 cursor-wait" : "border-chaiyo-blue/30 bg-blue-50/20 hover:bg-blue-50/50 cursor-pointer group"
                            )}
                            onClick={!isAnalyzing ? handleAnalyze : undefined}
                        >
                            {isAnalyzing ? (
                                <div className="flex flex-col items-center justify-center gap-6 animate-in fade-in duration-300 py-8">
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-full border-4 border-chaiyo-blue/20 animate-spin"></div>
                                        <div className="absolute inset-0 border-4 border-chaiyo-blue border-t-transparent rounded-full animate-spin"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Sparkles className="w-6 h-6 text-chaiyo-gold animate-pulse" />
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <h4 className="text-lg font-bold text-chaiyo-blue">AI กำลังอ่านข้อมูลจากเอกสาร...</h4>
                                        <p className="text-sm text-blue-600 mt-1">ระบบกำลังดึงข้อมูลเพื่อกรอกอัตโนมัติ</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-6">
                                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <Upload className="w-10 h-10 text-chaiyo-blue" />
                                    </div>
                                    <h4 className="text-2xl font-bold text-chaiyo-blue">คลิกเพื่ออัปโหลด{docReq.name}</h4>
                                    <p className="text-muted text-sm max-w-md mx-auto">{docReq.description}</p>
                                    <div className="flex gap-2">
                                        <span className="text-xs bg-white px-3 py-1.5 rounded-md border border-gray-200 text-gray-500">.JPG</span>
                                        <span className="text-xs bg-white px-3 py-1.5 rounded-md border border-gray-200 text-gray-500">.PNG</span>
                                        <span className="text-xs bg-white px-3 py-1.5 rounded-md border border-gray-200 text-gray-500">.PDF</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-center">
                            <Button
                                variant="ghost"
                                onClick={() => setCurrentStep(3)}
                                className="text-gray-400 hover:text-chaiyo-blue hover:bg-transparent"
                            >
                                ข้ามการอัปโหลดเอกสาร
                            </Button>
                        </div>
                    </div>
                );
            })()}


            {/* STEP 3: Verify Info & Result Preview */}
            {
                currentStep === 3 && (
                    <div className="max-w-6xl mx-auto print:hidden animate-in slide-in-from-right-8 duration-300 pb-20">

                        {/* Page Header */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-6 h-6 text-chaiyo-blue" />
                                <h2 className="text-2xl font-bold text-gray-800">ข้อมูลหลักประกัน</h2>
                            </div>
                            <p className="text-gray-500 pl-8">ตรวจสอบและแก้ไขข้อมูลที่ระบบอ่านได้จากเอกสาร</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                            {/* LEFT SIDEBAR: Document Preview */}
                            <div className="lg:col-span-3 space-y-6">
                                <div>
                                    <h3 className="font-bold text-gray-700 flex items-center gap-2 mb-4">
                                        <FileText className="w-4 h-4" /> เอกสารที่อัปโหลด ({uploadedDocs.length})
                                    </h3>

                                    <div className="grid grid-cols-2 gap-3">
                                        {uploadedDocs.map((doc, index) => (
                                            <div
                                                key={index}
                                                className="group relative aspect-[3/4] cursor-zoom-in rounded-xl overflow-hidden border border-gray-200 hover:border-chaiyo-blue transition-all shadow-sm"
                                                onClick={() => setLightboxIndex(index)}
                                            >
                                                <img
                                                    src={doc}
                                                    alt={`Document ${index + 1}`}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                    <Eye className="w-6 h-6 text-white drop-shadow-md" />
                                                </div>
                                                <div className="absolute top-1 right-1 bg-green-500/90 text-white p-0.5 rounded-full shadow-sm">
                                                    <Check className="w-3 h-3" />
                                                </div>
                                            </div>
                                        ))}

                                        {/* Add More Placeholder */}
                                        <div className="aspect-[3/4] border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 hover:border-chaiyo-blue hover:text-chaiyo-blue transition-all group">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center mb-2 transition-colors">
                                                <Plus className="w-4 h-4" />
                                            </div>
                                            <span className="text-[10px]">เพิ่มรูปภาพ</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-600 flex items-start gap-2">
                                    <div className="shrink-0 mt-0.5">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
                                    </div>
                                    สามารถคลิกที่รูปภาพเพื่อดูขนาดใหญ่ หรือเพิ่มรูปภาพเพิ่มเติมได้
                                </div>

                                <div
                                    onClick={() => {
                                        setFormData({ ...formData, collateralType: 'car' }); // Reset minimal
                                        setCurrentStep(1);
                                    }}
                                    className="text-red-500 text-sm cursor-pointer hover:underline text-center lg:text-left mt-4 inline-block"
                                >
                                    ล้างข้อมูล / เริ่มใหม่ทั้งหมด
                                </div>
                            </div>

                            {/* RIGHT MAIN CONTENT: Form & Summary */}
                            <div className="lg:col-span-9 space-y-8">

                                {/* AI OCR Banner */}
                                <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center shadow-sm shrink-0">
                                        <Sparkles className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800">ข้อมูลจาก AI OCR</h4>
                                        <p className="text-sm text-purple-600">ระบบได้อ่านและกรอกข้อมูลอัตโนมัติ กรุณาตรวจสอบความถูกต้อง</p>
                                    </div>
                                </div>

                                {/* Form Fields */}
                                {/* Form Fields — Type-specific (matches CollateralStepNew.tsx) */}
                                {(formData.collateralType === 'car' || formData.collateralType === 'moto' || formData.collateralType === 'truck') && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-gray-500">ทะเบียนรถ</Label>
                                            <Input value={formData.licensePlate || ''} onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })} className="bg-white h-12" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-500">จังหวัด</Label>
                                            <Input value={formData.province || ''} onChange={(e) => setFormData({ ...formData, province: e.target.value })} className="bg-white h-12" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-500">ยี่ห้อ</Label>
                                            <Combobox options={CAR_BRANDS} value={formData.brand} onValueChange={(val) => setFormData({ ...formData, brand: val })} placeholder="เลือกยี่ห้อ..." searchPlaceholder="ค้นหายี่ห้อ..." emptyText="ไม่พบยี่ห้อที่ค้นหา" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-500">รุ่น</Label>
                                            <Combobox options={CAR_MODELS} value={formData.model} onValueChange={(val) => setFormData({ ...formData, model: val })} placeholder="เลือกรุ่น..." searchPlaceholder="ค้นหารุ่น..." emptyText="ไม่พบรุ่นที่ค้นหา" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-500">ปี</Label>
                                            <Combobox options={YEARS} value={formData.year} onValueChange={(val) => setFormData({ ...formData, year: val })} placeholder="เลือกปี..." searchPlaceholder="ค้นหาปี..." emptyText="ไม่พบปีที่ค้นหา" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-500">สี</Label>
                                            <Input value={formData.color || ''} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="bg-white h-12" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-500">เลขเครื่องยนต์</Label>
                                            <Input value={formData.engineNumber || ''} onChange={(e) => setFormData({ ...formData, engineNumber: e.target.value })} className="bg-white h-12 font-mono" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-500">เลขตัวถัง</Label>
                                            <Input value={formData.chassisNumber || ''} onChange={(e) => setFormData({ ...formData, chassisNumber: e.target.value })} className="bg-white h-12 font-mono" />
                                        </div>
                                        <div className="col-span-1 md:col-span-2 space-y-2">
                                            <Label className="text-gray-500">สถานะทางกฎหมาย</Label>
                                            <Select value={formData.legalStatus || 'clear'} onValueChange={(val) => setFormData({ ...formData, legalStatus: val })}>
                                                <SelectTrigger className="h-12 bg-white w-full"><SelectValue placeholder="เลือกสถานะ" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="clear">ปลอดภาระ</SelectItem>
                                                    <SelectItem value="pledge">จำนำ</SelectItem>
                                                    <SelectItem value="hire_purchase">เช่าซื้อ</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                )}

                                {formData.collateralType === 'agri' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-gray-500">ยี่ห้อ</Label>
                                            <Input value={formData.brand || ''} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} className="bg-white h-12" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-500">รุ่น</Label>
                                            <Input value={formData.model || ''} onChange={(e) => setFormData({ ...formData, model: e.target.value })} className="bg-white h-12" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-500">ปี</Label>
                                            <Input value={formData.year || ''} onChange={(e) => setFormData({ ...formData, year: e.target.value })} className="bg-white h-12" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-500">หมายเลขเครื่อง/Serial Number</Label>
                                            <Input value={formData.serialNumber || ''} onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })} className="bg-white h-12 font-mono" />
                                        </div>
                                        <div className="col-span-1 md:col-span-2 space-y-2">
                                            <Label className="text-gray-500">สถานะทางกฎหมาย</Label>
                                            <Select value={formData.legalStatus || 'clear'} onValueChange={(val) => setFormData({ ...formData, legalStatus: val })}>
                                                <SelectTrigger className="h-12 bg-white w-full"><SelectValue placeholder="เลือกสถานะ" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="clear">ปลอดภาระ</SelectItem>
                                                    <SelectItem value="pledge">จำนำ</SelectItem>
                                                    <SelectItem value="hire_purchase">เช่าซื้อ</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                )}

                                {formData.collateralType === 'land' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-gray-500">เลขที่โฉนด</Label>
                                            <Input value={formData.deedNumber || ''} onChange={(e) => setFormData({ ...formData, deedNumber: e.target.value })} className="bg-white h-12 font-mono" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-500">เลขที่ดิน</Label>
                                            <Input value={formData.landNumber || ''} onChange={(e) => setFormData({ ...formData, landNumber: e.target.value })} className="bg-white h-12" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-500">หน้าสำรวจ</Label>
                                            <Input value={formData.surveyNumber || ''} onChange={(e) => setFormData({ ...formData, surveyNumber: e.target.value })} className="bg-white h-12" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-500">ตำบล/แขวง</Label>
                                            <Input value={formData.tambon || ''} onChange={(e) => setFormData({ ...formData, tambon: e.target.value })} className="bg-white h-12" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-500">อำเภอ/เขต</Label>
                                            <Input value={formData.amphoe || ''} onChange={(e) => setFormData({ ...formData, amphoe: e.target.value })} className="bg-white h-12" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-500">จังหวัด</Label>
                                            <Input value={formData.province || ''} onChange={(e) => setFormData({ ...formData, province: e.target.value })} className="bg-white h-12" />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label className="text-gray-500">เนื้อที่ (ไร่-งาน-ตารางวา)</Label>
                                            <Input value={formData.area || ''} onChange={(e) => setFormData({ ...formData, area: e.target.value })} className="bg-white h-12 font-mono" placeholder="2-0-50" />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label className="text-gray-500">สถานะทางกฎหมาย</Label>
                                            <Select value={formData.legalStatus || 'pledge_clear'} onValueChange={(val) => setFormData({ ...formData, legalStatus: val })}>
                                                <SelectTrigger className="h-12 bg-white w-full"><SelectValue placeholder="เลือกสถานะ" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="pledge_clear">จำนำ (ปลอดภาระ)</SelectItem>
                                                    <SelectItem value="pledge_refinance">จำนำ (Refinance)</SelectItem>
                                                    <SelectItem value="mortgage_clear">จำนอง (ปลอดภาระ)</SelectItem>
                                                    <SelectItem value="mortgage_refinance">จำนอง (Refinance)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                )}

                                {/* Loan Summary Limit Card */}
                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-6">
                                    <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-4">
                                        <Sparkles className="w-5 h-5 text-chaiyo-blue" />
                                        <h3 className="font-bold text-gray-800">สรุปวงเงินกู้สูงสุด (Maximum Loan Limit)</h3>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-start text-sm">
                                            <div className="flex flex-col">
                                                <span className="text-gray-600">ราคาประเมิน (Appraisal Price)</span>
                                                <span className="text-xs text-blue-500 mt-0.5">
                                                    {formData.collateralType === 'land' ? '*อ้างอิงจากราคาประเมินราชการ' : '*อ้างอิงจากข้อมูลราคากลาง Redbook'}
                                                </span>
                                            </div>
                                            <span className="font-bold text-gray-800 text-lg">
                                                {Number(formData.appraisalPrice || 0).toLocaleString()} บาท
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center text-sm text-green-600">
                                            <span className="font-medium">วงเงินจาก LTV ({formData.collateralType === 'land' ? '70%' : '90%'})</span>
                                            <span className="font-bold text-lg">
                                                + {Math.floor((formData.appraisalPrice || 0) * (formData.collateralType === 'land' ? 0.7 : 0.9)).toLocaleString()} บาท
                                            </span>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                                        <span className="text-chaiyo-blue font-bold text-lg">วงเงินสุทธิ (Net Limit)</span>
                                        <span className="text-3xl font-bold text-chaiyo-blue">
                                            {Math.max(0, Math.floor((formData.appraisalPrice || 0) * (formData.collateralType === 'land' ? 0.7 : 0.9)) - (Number(formData.existingDebt) || 0)).toLocaleString()} บาท
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end pt-4 gap-4">
                                    <Button variant="ghost" onClick={prevStep} className="text-gray-500 h-12">
                                        <ChevronLeft className="w-4 h-4 mr-2" /> ย้อนกลับ
                                    </Button>
                                    <Button onClick={nextStep} className="bg-chaiyo-blue hover:bg-chaiyo-blue/90 text-white min-w-[150px] h-12 shadow-lg shadow-chaiyo-blue/20">
                                        ถัดไป <ChevronLeft className="w-5 h-5 rotate-180 ml-2" />
                                    </Button>
                                </div>

                            </div>
                        </div>
                    </div>
                )
            }

            {/* STEP 4: Customer Info (Occupation & Income) */}
            {currentStep === 4 && (
                <div className="max-w-4xl mx-auto print:hidden space-y-8 animate-in slide-in-from-right-8 duration-300">
                    {/* Header */}
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <User className="w-6 h-6 text-chaiyo-blue" />
                            <h2 className="text-2xl font-bold text-gray-800">ข้อมูลลูกค้า</h2>
                        </div>
                        <p className="text-gray-500 pl-8">กรุณากรอกข้อมูลอาชีพและรายได้ของลูกค้า</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 space-y-6">
                        {/* Occupation */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-chaiyo-blue" />
                                อาชีพ
                            </Label>
                            <Select
                                value={formData.occupation || ''}
                                onValueChange={(val) => setFormData((prev: any) => ({ ...prev, occupation: val }))}
                            >
                                <SelectTrigger className="h-12 bg-white border-gray-200">
                                    <SelectValue placeholder="เลือกอาชีพ" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="employee">พนักงานบริษัท</SelectItem>
                                    <SelectItem value="government">ข้าราชการ / พนักงานรัฐวิสาหกิจ</SelectItem>
                                    <SelectItem value="business">ธุรกิจส่วนตัว / เจ้าของกิจการ</SelectItem>
                                    <SelectItem value="freelance">รับจ้างอิสระ / ฟรีแลนซ์</SelectItem>
                                    <SelectItem value="farmer">เกษตรกร</SelectItem>
                                    <SelectItem value="retired">เกษียณ</SelectItem>
                                    <SelectItem value="other">อื่นๆ</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Occupation Detail (conditional) */}
                        {formData.occupation === 'other' && (
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-gray-700">ระบุอาชีพ</Label>
                                <Input
                                    placeholder="กรุณาระบุอาชีพ"
                                    value={formData.occupationDetail || ''}
                                    onChange={(e) => setFormData((prev: any) => ({ ...prev, occupationDetail: e.target.value }))}
                                    className="h-12 bg-white border-gray-200"
                                />
                            </div>
                        )}

                        {/* Workplace */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700">สถานที่ทำงาน / ชื่อกิจการ</Label>
                            <Input
                                placeholder="เช่น บริษัท ABC จำกัด"
                                value={formData.workplace || ''}
                                onChange={(e) => setFormData((prev: any) => ({ ...prev, workplace: e.target.value }))}
                                className="h-12 bg-white border-gray-200"
                            />
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-100 pt-4">
                            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-4">
                                <Banknote className="w-4 h-4 text-emerald-600" />
                                ข้อมูลรายได้
                            </Label>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Monthly Income */}
                                <div className="space-y-2">
                                    <Label className="text-sm text-gray-600">รายได้ต่อเดือน (บาท)</Label>
                                    <Input
                                        type="text"
                                        placeholder="0"
                                        value={formData.monthlyIncome ? Number(formData.monthlyIncome).toLocaleString() : ''}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/,/g, '');
                                            if (!isNaN(Number(value))) {
                                                setFormData((prev: any) => ({ ...prev, monthlyIncome: Number(value) }));
                                            }
                                        }}
                                        className="h-12 bg-white border-gray-200 text-right text-lg font-semibold"
                                    />
                                </div>

                                {/* Other Income */}
                                <div className="space-y-2">
                                    <Label className="text-sm text-gray-600">รายได้อื่นๆ ต่อเดือน (บาท)</Label>
                                    <Input
                                        type="text"
                                        placeholder="0"
                                        value={formData.otherIncome ? Number(formData.otherIncome).toLocaleString() : ''}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/,/g, '');
                                            if (!isNaN(Number(value))) {
                                                setFormData((prev: any) => ({ ...prev, otherIncome: Number(value) }));
                                            }
                                        }}
                                        className="h-12 bg-white border-gray-200 text-right text-lg font-semibold"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Monthly Expense */}
                        <div className="space-y-2">
                            <Label className="text-sm text-gray-600">ภาระหนี้สินต่อเดือน (บาท)</Label>
                            <Input
                                type="text"
                                placeholder="0"
                                value={formData.monthlyExpense ? Number(formData.monthlyExpense).toLocaleString() : ''}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/,/g, '');
                                    if (!isNaN(Number(value))) {
                                        setFormData((prev: any) => ({ ...prev, monthlyExpense: Number(value) }));
                                    }
                                }}
                                className="h-12 bg-white border-gray-200 text-right text-lg font-semibold"
                            />
                            <p className="text-xs text-gray-400">รวมค่างวดรถ, บ้าน, บัตรเครดิต, สินเชื่อส่วนบุคคล ฯลฯ</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4">
                        <Button variant="ghost" onClick={prevStep} className="text-gray-500 h-12">
                            <ChevronLeft className="w-4 h-4 mr-2" /> ย้อนกลับ
                        </Button>
                        <Button onClick={nextStep} className="bg-chaiyo-blue hover:bg-chaiyo-blue/90 text-white min-w-[150px] h-12 shadow-lg shadow-chaiyo-blue/20">
                            ถัดไป <ChevronLeft className="w-5 h-5 rotate-180 ml-2" />
                        </Button>
                    </div>
                </div>
            )}

            {/* STEP 5: Product Suggestion */}
            {currentStep === 5 && (() => {
                const ltvRate = formData.collateralType === 'land' ? 0.7 : 0.9;
                const maxLoan = Math.max(0, Math.floor((formData.appraisalPrice || 0) * ltvRate) - (Number(formData.existingDebt) || 0));
                const selectedProduct = PRODUCTS.find(p => p.id === formData.collateralType);
                const TypeIcon = selectedProduct?.icon || Car;

                // Unified interest rate: 23.99% per year for all types
                const annualRate = 0.2399;
                const monthlyRate = annualRate / 12;

                // Determine loan product name
                const loanProduct = (() => {
                    switch (formData.collateralType) {
                        case 'land': return { name: 'สินเชื่อโฉนดที่ดิน', tagline: 'Chaiyo Land Loan' };
                        case 'moto': return { name: 'สินเชื่อรถจักรยานยนต์', tagline: 'Chaiyo Moto Loan' };
                        case 'truck': return { name: 'สินเชื่อรถบรรทุก', tagline: 'Chaiyo Truck Loan' };
                        case 'agri': return { name: 'สินเชื่อรถเพื่อการเกษตร', tagline: 'Chaiyo Agri Loan' };
                        default: return { name: 'สินเชื่อรถยนต์', tagline: 'Chaiyo Auto Loan' };
                    }
                })();

                // Monthly installment calculation (amortization)
                const calcMonthly = (principal: number, months: number) => {
                    if (principal <= 0 || months <= 0) return 0;
                    return Math.ceil(principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1));
                };

                // Balloon payment calculation (interest-only monthly + lump sum at end)
                const calcBalloonMonthly = (principal: number) => {
                    return Math.ceil(principal * monthlyRate);
                };

                const exampleMonths = [12, 24, 36, 48, 60];

                // Document checklist per collateral type
                const documentChecklist: { label: string; items: string[] } = (() => {
                    const common = [
                        'บัตรประชาชนตัวจริง (ผู้กู้)',
                        'ทะเบียนบ้าน (สำเนา)',
                        'รูปถ่ายหน้าตรงคู่บัตรประชาชน',
                    ];
                    switch (formData.collateralType) {
                        case 'car':
                        case 'moto':
                        case 'truck':
                            return {
                                label: 'เอกสารสำหรับสินเชื่อรถ',
                                items: [
                                    ...common,
                                    'เล่มทะเบียนรถ (ตัวจริง)',
                                    'กุญแจรถ สำรอง (ถ้ามี)',
                                    'ประกันภัย พ.ร.บ. (ตัวจริง)',
                                    'สัญญาซื้อขาย / ใบเสร็จ (ถ้ามี)',
                                ]
                            };
                        case 'agri':
                            return {
                                label: 'เอกสารสำหรับสินเชื่อเครื่องจักรเกษตร',
                                items: [
                                    ...common,
                                    'เล่มทะเบียนเครื่องจักร หรือ ใบอินวอยซ์/ใบเสร็จซื้อขาย',
                                    'รูปถ่ายเครื่องจักร (4 ด้าน)',
                                    'หลักฐานการครอบครอง',
                                ]
                            };
                        case 'land':
                            return {
                                label: 'เอกสารสำหรับสินเชื่อโฉนดที่ดิน',
                                items: [
                                    ...common,
                                    'โฉนดที่ดิน (ตัวจริง)',
                                    'รูปถ่ายที่ดิน (ภาพรวม + 4 ด้าน)',
                                    'แผนที่ที่ตั้งที่ดิน / Google Maps Pin',
                                    'หนังสือยินยอมคู่สมรส (ถ้ามี)',
                                ]
                            };
                        default:
                            return { label: 'เอกสารที่ต้องใช้', items: common };
                    }
                })();

                return (
                    <div className="max-w-4xl mx-auto print:hidden space-y-8 animate-in slide-in-from-right-8 duration-300 pb-20">
                        {/* Header */}
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-6 h-6 text-chaiyo-blue" />
                                <h2 className="text-2xl font-bold text-gray-800">ผลิตภัณฑ์ที่แนะนำ</h2>
                            </div>
                            <p className="text-gray-500 pl-8">จากข้อมูลหลักประกันที่ได้รับ ระบบขอแนะนำผลิตภัณฑ์ที่เหมาะสม</p>
                        </div>

                        {/* Main Loan Product Card */}
                        <div className="relative overflow-hidden bg-gradient-to-br from-chaiyo-blue via-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl shadow-chaiyo-blue/30">
                            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full" />
                            <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-white/5 rounded-full" />

                            <div className="relative z-10">


                                <div className="flex items-start justify-between gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-blue-200 text-sm font-medium uppercase tracking-wider">{loanProduct.tagline}</p>
                                            <h3 className="text-3xl font-bold mt-1">{loanProduct.name}</h3>
                                        </div>

                                        <div className="flex items-center gap-3 flex-wrap">
                                            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                                                <TypeIcon className="w-6 h-6" />
                                                <div>
                                                    <p className="text-sm font-medium">{selectedProduct?.label}</p>
                                                    <p className="text-xs text-blue-200">{formData.brand ? `${formData.brand} ${formData.model || ''} ${formData.year || ''}` : 'หลักประกัน'}</p>
                                                </div>
                                            </div>
                                            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                                                <p className="text-xs text-blue-200">ราคาประเมิน</p>
                                                <p className="text-sm font-bold">{Number(formData.appraisalPrice || 0).toLocaleString()} บาท</p>
                                            </div>
                                            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                                                <p className="text-xs text-blue-200">ดอกเบี้ย</p>
                                                <p className="text-sm font-bold">23.99% <span className="text-xs text-blue-200">ต่อปี</span></p>
                                            </div>
                                            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                                                <p className="text-xs text-blue-200">LTV</p>
                                                <p className="text-sm font-bold">{formData.collateralType === 'land' ? '70%' : '90%'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Max Loan Amount */}
                                    <div className="text-right shrink-0">
                                        <p className="text-blue-200 text-sm">วงเงินสูงสุดที่จะได้รับ</p>
                                        <p className="text-4xl font-bold mt-1">{maxLoan.toLocaleString()}</p>
                                        <p className="text-blue-200 text-sm">บาท</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Methods — 2 Options */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-chaiyo-blue" />
                                <h3 className="text-lg font-bold text-gray-800">รูปแบบการชำระ</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Option 1: Monthly Installment */}
                                <div className="bg-white rounded-2xl border-2 border-blue-200 p-6 space-y-4 hover:shadow-lg hover:border-chaiyo-blue/50 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
                                            <PiggyBank className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800">ชำระแบบผ่อนรายเดือน</h4>
                                            <p className="text-xs text-gray-500">ผ่อนเท่ากันทุกงวด จนครบสัญญา</p>
                                        </div>
                                    </div>
                                    <div className="bg-blue-50/60 rounded-xl p-4 space-y-2">
                                        <p className="text-xs font-medium text-gray-500 mb-2">ตัวอย่างค่างวด (วงเงิน {maxLoan.toLocaleString()} บาท)</p>
                                        {exampleMonths.map((m) => (
                                            <div key={m} className="flex justify-between items-center text-sm">
                                                <span className="text-gray-600">{m} เดือน</span>
                                                <span className="font-bold text-gray-800">{calcMonthly(maxLoan, m).toLocaleString()} บาท/เดือน</span>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-[11px] text-gray-400">*คำนวณจากอัตราดอกเบี้ย 23.99% ต่อปี แบบลดต้นลดดอก</p>
                                </div>

                                {/* Option 2: Balloon Payment */}
                                <div className="bg-white rounded-2xl border-2 border-amber-200 p-6 space-y-4 hover:shadow-lg hover:border-amber-400/50 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center">
                                            <Star className="w-6 h-6 text-amber-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800">โปะงวดท้าย (Balloon)</h4>
                                            <p className="text-xs text-gray-500">จ่ายเฉพาะดอกเบี้ยรายเดือน + เงินต้นงวดสุดท้าย</p>
                                        </div>
                                    </div>
                                    <div className="bg-amber-50/60 rounded-xl p-4 space-y-3">
                                        <p className="text-xs font-medium text-gray-500 mb-2">ตัวอย่าง (วงเงิน {maxLoan.toLocaleString()} บาท)</p>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-600">ค่าดอกเบี้ยรายเดือน</span>
                                            <span className="font-bold text-gray-800">{calcBalloonMonthly(maxLoan).toLocaleString()} บาท/เดือน</span>
                                        </div>
                                        <div className="border-t border-amber-200 pt-2 flex justify-between items-center text-sm">
                                            <span className="text-gray-600">ชำระเงินต้นงวดสุดท้าย</span>
                                            <span className="font-bold text-amber-700">{maxLoan.toLocaleString()} บาท</span>
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-gray-400">*จ่ายเฉพาะดอกเบี้ยแต่ละเดือน แล้วคืนเงินต้นทั้งหมดในงวดท้าย</p>
                                </div>
                            </div>
                        </div>

                        {/* Bundle Product: บัตรเงินไชโย */}
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 relative overflow-hidden">
                            <div className="absolute -top-6 -right-6 w-24 h-24 bg-amber-200/30 rounded-full" />
                            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-200/20 rounded-full" />
                            <div className="relative z-10 space-y-5">
                                {/* Top row: Card visual + title */}
                                <div className="flex items-center gap-6">
                                    <div className="shrink-0">
                                        <div className="w-44 h-28 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 rounded-xl shadow-lg shadow-amber-200/50 p-4 flex flex-col justify-between relative overflow-hidden">
                                            <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full" />
                                            <div className="flex items-center gap-2">
                                                <CreditCard className="w-5 h-5 text-white/80" />
                                                <span className="text-white text-xs font-bold tracking-wider">CHAIYO CARD</span>
                                            </div>
                                            <div>
                                                <p className="text-white/70 text-[10px] font-mono">•••• •••• •••• ••••</p>
                                                <p className="text-white text-xs font-medium mt-0.5">MEMBER SINCE 2026</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                                                <Gift className="w-3 h-3" />
                                                Bundle Deal
                                            </div>
                                        </div>
                                        <h4 className="text-xl font-bold text-gray-800">บัตรเงินไชโย</h4>
                                        <p className="text-sm text-gray-600">
                                            สมัครพร้อมสินเชื่อ — วงเงินหมุนเวียนพร้อมใช้ ผ่อนสบาย ค่างวดเท่าเดิม
                                        </p>
                                    </div>
                                </div>

                                {/* Feature grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5 pt-3 border-t border-amber-200/60">
                                    {[
                                        'จ่ายเงินต้นไปแล้วเท่าไร กดใช้เพิ่มได้เท่านั้น',
                                        'ค่างวดเท่าเดิม',
                                        'ไม่ต้องยื่นเอกสารเพิ่ม',
                                        'ไม่มีค่าธรรมเนียม',
                                        'กดฟรีทุกตู้ ATM ทั่วประเทศ',
                                        'รับบัตรได้ทันที',
                                        'ระบบความปลอดภัยสูง',
                                    ].map((feat, i) => (
                                        <div key={i} className="flex items-start gap-2.5 py-1">
                                            <div className="mt-0.5 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
                                                <Check className="w-3 h-3 text-white" />
                                            </div>
                                            <span className="text-sm text-gray-700">{feat}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Document Checklist */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
                            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                                <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800">{documentChecklist.label}</h3>
                                    <p className="text-xs text-gray-500">กรุณาแจ้งลูกค้าเตรียมเอกสารต่อไปนี้</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                                {documentChecklist.items.map((item, idx) => (
                                    <label key={idx} className="flex items-start gap-3 py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                                        <div className="mt-0.5 w-5 h-5 rounded border-2 border-gray-300 group-hover:border-chaiyo-blue/50 flex items-center justify-center shrink-0 transition-colors">
                                            {/* unchecked checkbox visual */}
                                        </div>
                                        <span className="text-sm text-gray-700 leading-snug">{item}</span>
                                    </label>
                                ))}
                            </div>
                            <div className="pt-3 border-t border-gray-100">
                                <p className="text-xs text-gray-400 flex items-center gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    เอกสารที่แนะนำนี้สร้างขึ้นจากข้อมูลที่ได้รับโดยอัตโนมัติ สามารถปรับเปลี่ยนได้ตามเงื่อนไขของสาขา
                                </p>
                            </div>
                        </div>

                        {/* Actions Bar */}
                        <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
                            <Button
                                variant="outline"
                                onClick={prevStep}
                                className="w-full md:w-auto px-6 h-12 text-gray-500 hover:text-gray-900 border-gray-300 bg-white"
                            >
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                กลับไปแก้ไขข้อมูล
                            </Button>

                            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                                <Button
                                    onClick={handlePrint}
                                    variant="outline"
                                    className="w-full md:w-auto h-12 gap-2 bg-white border-chaiyo-blue/30 text-chaiyo-blue hover:bg-blue-50"
                                >
                                    <Printer className="w-4 h-4" /> พิมพ์ใบเสนอราคา
                                </Button>
                                <Button
                                    onClick={handleCreateApplication}
                                    className="w-full md:w-auto h-12 gap-2 bg-chaiyo-blue hover:bg-chaiyo-blue/90 shadow-lg shadow-chaiyo-blue/20 text-white px-8"
                                >
                                    <FileText className="w-4 h-4" /> สร้างใบคำขอจริง
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* Hidden Print Component */}
            <QuotationPrint
                data={{
                    collateralType: formData.collateralType,
                    estimatedValue: formData.appraisalPrice,
                    loanAmount: formData.requestedAmount,
                    duration: formData.requestedDuration,
                    monthlyPayment: formData.estimatedMonthlyPayment || 0,
                    interestRate: formData.interestRate || 0.2399,
                    totalInterest: formData.totalInterest || 0,
                    // Vehicle
                    brand: formData.brand,
                    model: formData.model,
                    year: formData.year,
                    // Land
                    landRai: formData.landRai,
                    landNgan: formData.landNgan,
                    landWah: formData.landWah,
                    province: formData.province,
                    // Finance
                    paymentMethod: formData.paymentMethod,
                    income: formData.income,
                    monthlyDebt: formData.monthlyDebt,
                    occupation: formData.occupation
                }}
            />
            {/* Lightbox / Gallery View */}
            {
                lightboxIndex !== null && (
                    <div
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 md:p-8 animate-in fade-in duration-200"
                        onClick={() => setLightboxIndex(null)}
                    >
                        <button
                            onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
                            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        {/* Navigation */}
                        {uploadedDocs.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setLightboxIndex(prev => prev !== null ? (prev - 1 + uploadedDocs.length) % uploadedDocs.length : 0);
                                    }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all"
                                >
                                    <ChevronLeft className="w-10 h-10" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setLightboxIndex(prev => prev !== null ? (prev + 1) % uploadedDocs.length : 0);
                                    }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all"
                                >
                                    <ChevronRight className="w-10 h-10" />
                                </button>
                            </>
                        )}

                        {/* Main Image */}
                        <img
                            src={uploadedDocs[lightboxIndex]}
                            alt={`Document ${lightboxIndex + 1}`}
                            className="max-h-[80vh] max-w-full object-contain shadow-2xl rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                        />

                        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto pb-2" onClick={(e) => e.stopPropagation()}>
                            {uploadedDocs.map((doc, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setLightboxIndex(idx)}
                                    className={cn(
                                        "w-16 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0",
                                        idx === lightboxIndex ? "border-white scale-110 shadow-lg ring-2 ring-white/20" : "border-transparent opacity-50 hover:opacity-100"
                                    )}
                                >
                                    <img src={doc} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>

                        <div className="absolute top-4 left-4 text-white/80 font-medium bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">
                            {lightboxIndex + 1} / {uploadedDocs.length}
                        </div>
                    </div>
                )
            }
        </div >
    );
}
