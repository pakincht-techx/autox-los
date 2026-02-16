"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { CalculatorStep } from "../new-application/steps/CalculatorStep";
import { QuotationPrint } from "@/components/calculator/QuotationPrint";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { ChevronLeft, Printer, FileText, PiggyBank, Briefcase, Car, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

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

    const [currentStep, setCurrentStep] = useState(1);

    // Mock Product List for Quick Select
    const PRODUCTS = [
        { id: "car", label: "รถเก๋ง / กระบะ" },
        { id: "moto", label: "รถมอเตอร์ไซค์" },
        { id: "truck", label: "รถบรรทุก" },
        { id: "agri", label: "รถเพื่อการเกษตร" },
        { id: "land", label: "ที่ดิน" },
    ];

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

    const nextStep = () => setCurrentStep(2);
    const prevStep = () => setCurrentStep(1);

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

            {/* Stepper Indicator */}
            <div className="flex justify-center items-center gap-4 mb-8 print:hidden">
                <div className={cn("flex items-center gap-2", currentStep >= 1 ? "text-chaiyo-blue" : "text-gray-300")}>
                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2", currentStep >= 1 ? "bg-chaiyo-blue text-white border-chaiyo-blue" : "border-gray-300 text-gray-400")}>1</div>
                    <span className="font-bold text-sm">ข้อมูลลูกค้า/หลักประกัน</span>
                </div>
                <div className="w-16 h-[2px] bg-gray-200">
                    <div className={cn("h-full bg-chaiyo-blue transition-all duration-300", currentStep >= 2 ? "w-full" : "w-0")}></div>
                </div>
                <div className={cn("flex items-center gap-2", currentStep >= 2 ? "text-chaiyo-blue" : "text-gray-300")}>
                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2", currentStep >= 2 ? "bg-chaiyo-blue text-white border-chaiyo-blue" : "border-gray-300 text-gray-400")}>2</div>
                    <span className="font-bold text-sm">คำนวณสินเชื่อ</span>
                </div>
            </div>

            {/* STEP 1: Inputs */}
            {currentStep === 1 && (
                <div className="max-w-2xl mx-auto print:hidden space-y-6 animate-in slide-in-from-right-8 duration-300">
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-8">
                        <div className="text-center space-y-2">
                            <div className="w-12 h-12 bg-chaiyo-blue/10 rounded-full flex items-center justify-center text-chaiyo-blue mx-auto">
                                <Briefcase className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">ข้อมูลเบื้องต้น</h2>
                            <p className="text-sm text-gray-500">กรอกข้อมูลเพื่อประเมินวงเงินสินเชื่อที่เหมาะสม</p>
                        </div>

                        {/* Collateral Selection */}
                        <div className="space-y-3">
                            <Label className="text-sm font-bold text-gray-700">ประเภทหลักประกัน</Label>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                {PRODUCTS.map((p) => (
                                    <div
                                        key={p.id}
                                        onClick={() => setFormData({ ...formData, collateralType: p.id })}
                                        className={cn(
                                            "cursor-pointer text-sm font-bold py-3 px-2 rounded-xl border transition-all text-center hover:shadow-md flex items-center justify-center text-[13px]",
                                            formData.collateralType === p.id
                                                ? "bg-blue-50 border-chaiyo-blue text-chaiyo-blue shadow-inner"
                                                : "bg-white border-gray-200 text-gray-500 hover:border-chaiyo-blue/50"
                                        )}
                                    >
                                        {p.label}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Dynamic Inputs */}
                        {/* Dynamic Inputs */}
                        {formData.collateralType === 'land' ? (
                            <div className="space-y-4 p-5 bg-gray-50/50 rounded-xl border border-gray-100">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-gray-500">ขนาดที่ดิน</Label>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="relative">
                                            <Input
                                                type="number" className="bg-white text-center h-11"
                                                value={formData.landRai || ''}
                                                onChange={(e) => setFormData({ ...formData, landRai: e.target.value })}
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">ไร่</span>
                                        </div>
                                        <div className="relative">
                                            <Input
                                                type="number" className="bg-white text-center h-11"
                                                value={formData.landNgan || ''}
                                                onChange={(e) => setFormData({ ...formData, landNgan: e.target.value })}
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">งาน</span>
                                        </div>
                                        <div className="relative">
                                            <Input
                                                type="number" className="bg-white text-center h-11"
                                                value={formData.landWah || ''}
                                                onChange={(e) => setFormData({ ...formData, landWah: e.target.value })}
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">ตร.ว.</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-gray-500">จังหวัด</Label>
                                        <Input
                                            placeholder="ระบุจังหวัด" className="bg-white h-11"
                                            value={formData.province || ''}
                                            onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-gray-500">ประเภทโฉนด</Label>
                                        <Select
                                            value={formData.deedType || 'chanote'}
                                            onValueChange={(val) => setFormData({ ...formData, deedType: val })}
                                        >
                                            <SelectTrigger className="h-11 bg-white">
                                                <SelectValue placeholder="เลือกประเภทโฉนด" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="chanote">โฉนด (น.ส.4)</SelectItem>
                                                <SelectItem value="norsor3">น.ส.3ก</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-gray-500">พิกัด (Lat, Long)</Label>
                                    <Input
                                        placeholder="13.7563, 100.5018" className="bg-white h-11"
                                        value={formData.coordinates || ''}
                                        onChange={(e) => setFormData({ ...formData, coordinates: e.target.value })}
                                    />
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full bg-white border-chaiyo-blue text-chaiyo-blue hover:bg-blue-50 border-dashed"
                                    onClick={() => {
                                        const mockPrice = Math.floor(Math.random() * (5000000 - 1000000) + 1000000);
                                        setFormData({ ...formData, appraisalPrice: mockPrice });
                                    }}
                                >
                                    <TrendingUp className="w-4 h-4 mr-2" />
                                    ประเมินราคาที่ดิน (AI Valuation)
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4 p-5 bg-gray-50/50 rounded-xl border border-gray-100">
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Common Vehicle Fields */}
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-gray-500">ยี่ห้อ</Label>
                                        <Input
                                            placeholder={formData.collateralType === 'agri' ? "Kubota..." : "Toyota..."} className="bg-white h-11"
                                            value={formData.brand || ''}
                                            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-gray-500">รุ่น</Label>
                                        <Input
                                            placeholder="Standard..." className="bg-white h-11"
                                            value={formData.model || ''}
                                            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Type Specific Fields */}
                                {['car', 'moto'].includes(formData.collateralType) && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-gray-500">รุ่นย่อย</Label>
                                            <Input
                                                placeholder="E / G / Sport..." className="bg-white h-11"
                                                value={formData.subModel || ''}
                                                onChange={(e) => setFormData({ ...formData, subModel: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-gray-500">ปีที่จดทะเบียน</Label>
                                            <Input
                                                placeholder="2020" className="bg-white h-11 text-center"
                                                value={formData.year || ''}
                                                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-gray-500">เลขไมล์ (กม.)</Label>
                                            <Input
                                                type="number" placeholder="0" className="bg-white h-11 text-right font-mono"
                                                value={formData.mileage || ''}
                                                onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                )}

                                {formData.collateralType === 'truck' && (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-gray-500">จำนวนล้อ</Label>
                                                <Select
                                                    value={formData.wheels || '4'}
                                                    onValueChange={(val) => setFormData({ ...formData, wheels: val })}
                                                >
                                                    <SelectTrigger className="h-11 bg-white">
                                                        <SelectValue placeholder="เลือกจำนวนล้อ" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="4">4 ล้อ</SelectItem>
                                                        <SelectItem value="6">6 ล้อ</SelectItem>
                                                        <SelectItem value="10">10 ล้อ</SelectItem>
                                                        <SelectItem value="18">18 ล้อขึ้นไป</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-gray-500">ลักษณะตัวถัง</Label>
                                                <Input
                                                    placeholder="ตู้ทึบ, กระบะ..." className="bg-white h-11"
                                                    value={formData.bodyType || ''}
                                                    onChange={(e) => setFormData({ ...formData, bodyType: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-gray-500">น้ำหนักบรรทุก (ตัน)</Label>
                                                <Input
                                                    type="number" placeholder="0" className="bg-white h-11 text-center"
                                                    value={formData.loadCapacity || ''}
                                                    onChange={(e) => setFormData({ ...formData, loadCapacity: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-gray-500">เลขไมล์ (กม.)</Label>
                                                <Input
                                                    type="number" placeholder="0" className="bg-white h-11 text-right font-mono"
                                                    value={formData.mileage || ''}
                                                    onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {formData.collateralType === 'agri' && (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-gray-500">แรงม้า</Label>
                                                <Input
                                                    type="number" placeholder="50 HP" className="bg-white h-11 text-center"
                                                    value={formData.horsepower || ''}
                                                    onChange={(e) => setFormData({ ...formData, horsepower: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-gray-500">ชั่วโมงการทำงาน</Label>
                                                <Input
                                                    type="number" placeholder="0" className="bg-white h-11 text-right font-mono"
                                                    value={formData.workingHours || ''}
                                                    onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-gray-500">อุปกรณ์ต่อพ่วง</Label>
                                            <Input
                                                placeholder="ผานไถ, โรตารี่..." className="bg-white h-11"
                                                value={formData.attachments || ''}
                                                onChange={(e) => setFormData({ ...formData, attachments: e.target.value })}
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Common Status & Action */}
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-gray-500">สถานะครอบครอง</Label>
                                    <Select
                                        value={formData.possessionStatus || 'owned'}
                                        onValueChange={(val) => setFormData({ ...formData, possessionStatus: val })}
                                    >
                                        <SelectTrigger className="h-11 bg-white">
                                            <SelectValue placeholder="เลือกสถานะ" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="owned">เจ้าของกรรมสิทธิ์ (ปลอดภาระ)</SelectItem>
                                            <SelectItem value="finance">ติดไฟแนนซ์ / ผ่อนอยู่</SelectItem>
                                            <SelectItem value="pawn">จำนำเล่ม</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full bg-white border-chaiyo-blue text-chaiyo-blue hover:bg-blue-50 border-dashed"
                                    onClick={() => {
                                        const mockPrice = Math.floor(Math.random() * (800000 - 300000) + 300000);
                                        // Auto-set requested amount to max
                                        const maxLoan = Math.floor(mockPrice * 0.9) - (Number(formData.existingDebt) || 0);
                                        setFormData({ ...formData, appraisalPrice: mockPrice, requestedAmount: Math.max(0, maxLoan) });
                                    }}
                                >
                                    <TrendingUp className="w-4 h-4 mr-2" />
                                    ประเมินราคารถ (AI Valuation)
                                </Button>
                            </div>
                        )}

                        {/* Appraisal Price */}
                        <div className="space-y-3 pt-2">
                            <Label className="text-sm font-bold text-gray-700">ราคาประเมิน (บาท)</Label>
                            <div className="flex gap-2 relative">
                                <div className="relative flex-1">
                                    <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="0"
                                        value={formData.appraisalPrice ? Number(formData.appraisalPrice).toLocaleString() : ''}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/[^0-9]/g, '');
                                            const newStats = { ...formData, appraisalPrice: val ? Number(val) : 0 };
                                            // Auto-set requested amount to max
                                            const maxLoan = Math.max(0, Math.floor((newStats.appraisalPrice || 0) * 0.9) - (Number(newStats.existingDebt) || 0));
                                            setFormData({ ...newStats, requestedAmount: maxLoan });
                                        }}
                                        className="pl-10 pr-4 font-bold text-xl h-12 text-right font-mono"
                                    />
                                </div>
                            </div>

                            {/* Remaining Debt Input - Show only if financed or pawned */}
                            {(formData.possessionStatus === 'finance' || formData.possessionStatus === 'pawn') && (
                                <div className="space-y-2 pt-2 animate-in fade-in slide-in-from-top-2">
                                    <Label className="text-xs font-bold text-gray-400">ภาระหนี้คงเหลือปัจจุบัน</Label>
                                    <Input
                                        type="text"
                                        placeholder="ระบุยอดหนี้คงเหลือ..."
                                        className="font-bold text-lg h-11 text-red-500 text-right font-mono"
                                        value={formData.existingDebt ? Number(formData.existingDebt).toLocaleString() : ''}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/[^0-9]/g, '');
                                            const newStats = { ...formData, existingDebt: val ? Number(val) : 0 };
                                            // Auto-set requested amount to max
                                            const maxLoan = Math.max(0, Math.floor((newStats.appraisalPrice || 0) * 0.9) - (Number(newStats.existingDebt) || 0));
                                            setFormData({ ...newStats, requestedAmount: maxLoan });
                                        }}
                                    />
                                    <p className="text-[10px] text-red-400">* ยอดหนี้จะถูกนำไปหักลบกับวงเงินกู้สูงสุดที่ได้รับ</p>
                                </div>
                            )}
                            <div className="flex justify-between items-center bg-blue-50 px-4 py-3 rounded-xl border border-blue-100">
                                <span className="text-sm font-bold text-gray-500">วงเงินกู้สูงสุด (90%)</span>
                                <span className="font-bold text-xl text-chaiyo-blue">฿{Math.max(0, Math.floor((formData.appraisalPrice || 0) * 0.9) - (Number(formData.existingDebt) || 0)).toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Income & Financial Section */}
                        <div className="space-y-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                    <PiggyBank className="w-4 h-4" />
                                </div>
                                <h3 className="font-bold text-gray-800 text-sm">ข้อมูลรายได้และภาระหนี้</h3>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-gray-400">อาชีพ</Label>
                                    <Select
                                        value={formData.occupation || ''}
                                        onValueChange={(val) => setFormData({ ...formData, occupation: val })}
                                    >
                                        <SelectTrigger className="h-11 bg-white font-bold text-gray-700">
                                            <SelectValue placeholder="เลือกอาชีพ" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="office">พนักงานออฟฟิศ</SelectItem>
                                            <SelectItem value="business">เจ้าของธุรกิจ</SelectItem>
                                            <SelectItem value="farmer">เกษตรกร</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-gray-400">รายได้รวมต่อเดือน</Label>
                                    <Input
                                        type="text"
                                        placeholder="0"
                                        value={formData.income ? Number(formData.income).toLocaleString() : ''}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/[^0-9]/g, '');
                                            setFormData({ ...formData, income: val ? Number(val) : 0 });
                                        }}
                                        className="font-bold text-lg h-11 text-emerald-600 text-right font-mono"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-gray-400">ภาระหนี้ต่อเดือน</Label>
                                    <Input
                                        type="text" placeholder="0"
                                        value={formData.monthlyDebt ? Number(formData.monthlyDebt).toLocaleString() : ''}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/[^0-9]/g, '');
                                            setFormData({ ...formData, monthlyDebt: val ? Number(val) : 0 });
                                        }}
                                        className="font-bold text-lg h-11 text-red-500 text-right font-mono"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                                <span className="text-sm font-medium text-gray-500">รายได้สุทธิ (Net Income)</span>
                                <span className={cn(
                                    "font-bold text-xl",
                                    ((formData.income || 0) - (formData.monthlyDebt || 0)) < 0 ? "text-red-600" : "text-emerald-600"
                                )}>
                                    ฿{((formData.income || 0) - (formData.monthlyDebt || 0)).toLocaleString()}
                                </span>
                            </div>
                        </div>



                        {/* Required Documents List (Compact) */}
                        <div className="pt-4 border-t border-gray-100 bg-blue-50/50 -mx-8 -mb-8 p-6 rounded-b-2xl">
                            <div className="flex items-center gap-2 text-chaiyo-blue mb-3">
                                <FileText className="w-4 h-4" />
                                <span className="text-xs font-bold">เอกสารที่ต้องเตรียม</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600">
                                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-chaiyo-blue/40"></div>บัตรประชาชน (ตัวจริง)</div>
                                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-chaiyo-blue/40"></div>ทะเบียนบ้าน (ตัวจริง)</div>
                                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-chaiyo-blue/40"></div>{formData.collateralType === 'land' ? 'โฉนดที่ดิน' : 'เล่มทะเบียนรถ'}</div>
                                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-chaiyo-blue/40"></div>เอกสารรายได้</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button onClick={nextStep} className="bg-chaiyo-blue hover:bg-chaiyo-blue/90 w-full md:w-auto h-12 px-8 text-lg shadow-lg shadow-chaiyo-blue/20">
                            ถัดไป <ChevronLeft className="w-5 h-5 rotate-180 ml-2" />
                        </Button>
                    </div>
                </div>
            )}

            {/* STEP 2: Calculator */}
            {currentStep === 2 && (
                <div className="animate-in slide-in-from-right-8 duration-300 print:hidden space-y-6">
                    {/* Calculator (Now full width) */}
                    <CalculatorStep
                        formData={formData}
                        setFormData={setFormData}
                        hideNavigation={true}
                        onNext={() => { }}
                        paymentMethod={formData.paymentMethod}
                    />

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
                            </Button>
                        </div>
                    </div>
                </div>
            )}

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
        </div>
    );
}
