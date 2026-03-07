// Merged Collateral Step - Replaced with Pre-question style UI
"use client";

import { useState, useEffect } from "react";
import {
    Car, Bike, Truck, Tractor, Map, Sparkles, Upload, FileText,
    Check, Loader2, AlertCircle, Camera, Book, X, Plus,
    ChevronLeft, ChevronRight, Eye, UserCheck, Calculator, ShieldCheck
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Combobox } from "@/components/ui/combobox";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
    CAR_BRANDS,
    MOTO_BRANDS,
    TRUCK_BRANDS,
    AGRI_BRANDS,
    MODELS_BY_BRAND,
    SUB_MODELS_BY_MODEL,
    YEARS,
    YEARS_AD
} from "@/data/vehicle-data";
import { DatePickerBE } from "@/components/ui/DatePickerBE";

interface CollateralStepProps {
    formData: any;
    setFormData: (data: any) => void;
    isExistingCustomer?: boolean;
    existingCollaterals?: any[];
}

const PRODUCTS = [
    {
        id: "car",
        label: "รถเก๋ง / รถกระบะ / รถตู้",
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

const COLLATERAL_QUESTIONS: Record<string, { id: string; text: string }[]> = {
    car: [
        { id: 'car_q1', text: 'เป็นรถจากเต้นท์' },
        { id: 'car_q2', text: 'เป็นรถดัดแปลงสภาพ, รถแข่ง, รถแต่งเกิน 50%, รถดัดแปลงเครื่องยนต์' },
        { id: 'car_q3', text: 'เป็นรถตัดต่อ, เคยชนหนัก' },
        { id: 'car_q4', text: 'เป็นหรือเคยเป็น รถแท็กซี่ รถสองแถว/รถกะป๊อ /รถจากอาสามูลนิธิ' },
        { id: 'car_q5', text: 'เป็นรถสไลด์ที่ดัดแปลงจากรถกระบะ' },
        { id: 'car_q6', text: 'เป็นรถล้อเกินซุ้มล้อ' },
        { id: 'car_q7', text: 'เป็นรถที่ตัดแต่งคัสซี / ตัดเว้าคัสซี' },
    ],
    moto: [
        { id: 'moto_q1', text: 'เป็นรถจากเต้นท์' },
        { id: 'moto_q2', text: 'เป็นรถดัดแปลงสภาพ, รถแข่ง, รถแต่งเกิน 50%, รถดัดแปลงเครื่องยนต์' },
        { id: 'moto_q3', text: 'เป็นรถตัดต่อ, เคยชนหนัก' },
    ],
    truck: [
        { id: 'truck_q1', text: 'เป็นรถตัดต่อ, เคยชนหนัก' },
    ],
    agri: [],
    land: [
        { id: 'm', text: 'ที่ดินตาบอด, ที่ดินติดคลองติดลำธารที่ไม่ติดถนนสาธารณะ' },
        { id: 'n', text: 'ที่ดินติดหรือเป็น สถานที่ศักดิ์สิทธิ์ วัด ศาลเจ้า โรงเรียน' },
        { id: 'o', text: 'ที่ดินติดหรือเป็น สุสาน ป่าช้า บ่อขยะ' },
        { id: 'p', text: 'ที่ดินติดเขตกรรถไฟ' },
        { id: 'q', text: 'ที่ดินที่มีบ่อน้ำกินพื้นที่ตั้งแต่ 40% ขึ้นไป' },
        { id: 'r', text: 'ที่ดินรกร้าง, ห่างไกลชุมชน เช่น ห่างจากอำเภอเมือง หรือหัวเมืองใหญ่ หรือที่ดินรอบข้างไม่ใช่ที่ทำกิน และที่อยู่อาศัย' },
    ],
};

const THAI_PREFIXES = [
    { value: "นาย", label: "นาย" },
    { value: "นาง", label: "นาง" },
    { value: "นางสาว", label: "นางสาว" },
    { value: "คุณ", label: "คุณ" },
    { value: "นพ.", label: "นพ." },
    { value: "พญ.", label: "พญ." },
    { value: "ดร.", label: "ดร." },
    { value: "ทพ.", label: "ทพ." },
    { value: "ทพญ.", label: "ทพญ." },
    { value: "พล.อ.", label: "พล.อ." },
    { value: "พล.ท.", label: "พล.ท." },
    { value: "พล.ต.", label: "พล.ต." },
    { value: "พ.อ.", label: "พ.อ." },
    { value: "พ.ท.", label: "พ.ท." },
    { value: "พ.ต.", label: "พ.ต." },
    { value: "ร.อ.", label: "ร.อ." },
    { value: "ร.ท.", label: "ร.ท." },
    { value: "ร.ต.", label: "ร.ต." },
    { value: "พล.ต.อ.", label: "พล.ต.อ." },
    { value: "พ.ต.อ.", label: "พ.ต.อ." },
    { value: "พ.ต.ท.", label: "พ.ต.ท." },
    { value: "พ.ต.ต.", label: "พ.ต.ต." },
    { value: "ร.ต.อ.", label: "ร.ต.อ." },
    { value: "ร.ต.ท.", label: "ร.ต.ท." },
    { value: "ร.ต.ต.", label: "ร.ต.ต." },
    { value: "ว่าที่ ร.ต.", label: "ว่าที่ ร.ต." },
    { value: "ม.ล.", label: "ม.ล." },
    { value: "ม.ร.ว.", label: "ม.ร.ว." },
    { value: "ม.จ.", label: "ม.จ." },
];

export function CollateralStep({ formData, setFormData, isExistingCustomer = false, existingCollaterals = [] }: CollateralStepProps) {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiDetectedFields, setAiDetectedFields] = useState<string[]>([]);
    const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    // Initial setup if collateralType is already set
    useEffect(() => {
        if (!formData.collateralType || Object.keys(formData.collateralQuestions || {}).length === 0) {
            setFormData({
                ...formData,
                collateralType: formData.collateralType || 'car',
                // Prefill with default 'no' for all questions as seen in PreQuestionPage
                collateralQuestions: {
                    ...(formData.collateralQuestions || {}),
                    car_q1: 'no', car_q2: 'no', car_q3: 'no', car_q4: 'no', car_q5: 'no', car_q6: 'no', car_q7: 'no',
                    moto_q1: 'no', moto_q2: 'no', moto_q3: 'no',
                    truck_q1: 'no'
                },
                isLivelihoodCollateral: formData.isLivelihoodCollateral || 'yes',
                estimatedSalePrice: formData.estimatedSalePrice || '650000'
            });
        }
    }, []);

    const handleAddPhoto = () => {
        setUploadedDocs(prev => [
            ...prev,
            `https://placehold.co/600x800/e2e8f0/1e293b?text=${encodeURIComponent(formData.collateralType === 'car' ? 'Car Front' : formData.collateralType === 'moto' ? 'Moto Side' : 'Document')}+${prev.length + 1}`
        ]);
    };

    const handleRemovePhoto = (idx: number) => {
        setUploadedDocs(prev => prev.filter((_, i) => i !== idx));
    };

    const handleAnalyzePhotos = () => {
        setIsAnalyzing(true);
        setAiDetectedFields([]);
        toast.info("กำลังวิเคราะห์รูปถ่าย...", { duration: 1500 });

        setTimeout(() => {
            let mockData: any = { appraisalPrice: 450000 };
            let fields = ['appraisalPrice', 'brand', 'model', 'year'];

            if (formData.collateralType === 'car') {
                mockData = { ...mockData, brand: 'Toyota', model: 'Camry', year: '2562', subModel: 'HEV Premium', taxDueDate: '2025-06-15', previousOwnerDate: '2017-01-20' };
                fields.push('subModel', 'taxDueDate', 'previousOwnerDate');
            } else if (formData.collateralType === 'moto') {
                mockData = { ...mockData, brand: 'Honda', model: 'Wave 125i', year: '2564', appraisalPrice: 35000, taxDueDate: '2025-03-10', previousOwnerDate: '2019-05-05' };
            } else if (formData.collateralType === 'truck') {
                mockData = { ...mockData, brand: 'Isuzu', model: 'D-Max', year: '2563', appraisalPrice: 500000, taxDueDate: '2024-11-22', previousOwnerDate: '2015-08-12' };
            } else if (formData.collateralType === 'agri') {
                mockData = { ...mockData, brand: 'Kubota', model: 'L5018', year: '2565', appraisalPrice: 600000, taxDueDate: '2026-01-01', previousOwnerDate: '2020-12-15' };
            }

            setFormData((prev: any) => ({ ...prev, ...mockData }));
            setAiDetectedFields(fields);
            setIsAnalyzing(false);
            toast.success("วิเคราะห์ข้อมูลสำเร็จ! ระบบได้กรอกข้อมูลเบื้องต้นให้แล้ว", {
                icon: <Sparkles className="w-4 h-4 text-purple-500" />
            });
        }, 1500);
    };

    return (
        <div className="max-w-4xl mx-auto animate-in slide-in-from-right-8 duration-300 pb-20 pt-4">
            <div className="space-y-6">
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
                            * ข้อมูลเบื้องต้นดึงมาจากแบบสอบถามคัดกรอง (Pre-screening)
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-100">
                            <div className="space-y-1">
                                <Label className="text-sm font-bold text-gray-700">ชื่อหลักประกัน</Label>
                                <div className="h-12 flex items-center">
                                    <h3 className="text-2xl font-bold text-chaiyo-blue tracking-tight">2334582260</h3>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-bold text-gray-700">ประเภทหลักประกัน <span className="text-red-500">*</span></Label>
                                <Select
                                    value={formData.collateralType || 'car'}
                                    onValueChange={(val) => setFormData({ ...formData, collateralType: val })}
                                >
                                    <SelectTrigger className="h-12 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-chaiyo-blue/20">
                                        <SelectValue placeholder="เลือกประเภทหลักประกัน" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PRODUCTS.map((prod) => (
                                            <SelectItem key={prod.id} value={prod.id}>
                                                {prod.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="mt-8 space-y-6">
                            <h3 className="text-lg font-bold text-gray-900">
                                {formData.collateralType === 'land' ? 'รายละเอียดโฉนดที่ดิน' : 'รายละเอียดหลักประกัน'}
                            </h3>

                            {formData.collateralType === 'land' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">ประเภทโฉนด</Label>
                                        <Input disabled value="โฉนดที่ดิน (น.ส. 4 จ.)" className="h-10 rounded-xl bg-gray-50/50 border-gray-200 disabled:opacity-100 text-gray-900 font-medium" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">เลขที่โฉนด</Label>
                                        <Input disabled value="12345" className="h-10 rounded-xl bg-gray-50/50 border-gray-200 disabled:opacity-100 text-gray-900 font-medium" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">เล่ม/หน้า</Label>
                                        <Input disabled value="123/45" className="h-10 rounded-xl bg-gray-50/50 border-gray-200 disabled:opacity-100 text-gray-900 font-medium" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">หน้าสำรวจ</Label>
                                        <Input disabled value="678" className="h-10 rounded-xl bg-gray-50/50 border-gray-200 disabled:opacity-100 text-gray-900 font-medium" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">เลขที่ดิน</Label>
                                        <Input disabled value="901" className="h-10 rounded-xl bg-gray-50/50 border-gray-200 disabled:opacity-100 text-gray-900 font-medium" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">ระวาง</Label>
                                        <Input disabled value="5136 IV 7224-11" className="h-10 rounded-xl bg-gray-50/50 border-gray-200 disabled:opacity-100 text-gray-900 font-medium" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">เนื้อที่ (ไร่-งาน-ตร.ว.)</Label>
                                        <Input disabled value="2-1-50" className="h-10 rounded-xl bg-gray-50/50 border-gray-200 disabled:opacity-100 text-gray-900 font-medium" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">จังหวัด</Label>
                                        <Input disabled value="ปทุมธานี" className="h-10 rounded-xl bg-gray-50/50 border-gray-200 disabled:opacity-100 text-gray-900 font-medium" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">อำเภอ/เขต</Label>
                                        <Input disabled value="ลำลูกกา" className="h-10 rounded-xl bg-gray-50/50 border-gray-200 disabled:opacity-100 text-gray-900 font-medium" />
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                                <div className="space-y-1">
                                    <Label className="text-[13px] text-muted-foreground ml-1">ลักษณสภาพรถ</Label>
                                    <Input disabled value="ใช้แล้ว" className="h-10 rounded-xl bg-gray-50/50 border-gray-200 disabled:opacity-100 text-gray-900 font-medium" />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[13px] text-muted-foreground ml-1">เลขทะเบียน</Label>
                                    <Input disabled value="7กส 474" className="h-10 rounded-xl bg-gray-50/50 border-gray-200 disabled:opacity-100 text-gray-900 font-medium" />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[13px] text-muted-foreground ml-1">จังหวัด</Label>
                                    <Input disabled value="กรุงเทพมหานคร" className="h-10 rounded-xl bg-gray-50/50 border-gray-200 disabled:opacity-100 text-gray-900 font-medium" />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[13px] text-chaiyo-blue font-bold ml-1">วันที่ครบกำหนดเสียภาษี</Label>
                                    <DatePickerBE
                                        value={formData.taxDueDate}
                                        onChange={(val) => setFormData({ ...formData, taxDueDate: val })}
                                        inputClassName={cn(
                                            "h-10 transition-all focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20",
                                            aiDetectedFields.includes('taxDueDate') && "border-purple-300 ring-1 ring-purple-100 bg-purple-50/30 font-bold text-purple-700"
                                        )}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[13px] text-muted-foreground ml-1">ยี่ห้อรถ</Label>
                                    <Input disabled value="HONDA" className="h-10 rounded-xl bg-gray-50/50 border-gray-200 disabled:opacity-100 text-gray-900 font-medium" />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[13px] text-muted-foreground ml-1">รุ่นรถ</Label>
                                    <Input disabled value="CIVIC" className="h-10 rounded-xl bg-gray-50/50 border-gray-200 disabled:opacity-100 text-gray-900 font-medium" />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[13px] text-muted-foreground ml-1">รุ่นปี ค.ศ.</Label>
                                    <Input disabled value="2018" className="h-10 rounded-xl bg-gray-50/50 border-gray-200 disabled:opacity-100 text-gray-900 font-medium" />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[13px] text-muted-foreground ml-1">หมายเลขรุ่นย่อย</Label>
                                    <Input disabled value="1.8 i-VTEC EL" className="h-10 rounded-xl bg-gray-50/50 border-gray-200 disabled:opacity-100 text-gray-900 font-medium" />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[13px] text-muted-foreground ml-1">ซีซี (CC)</Label>
                                    <Input disabled value="1,799" className="h-10 rounded-xl bg-gray-50/50 border-gray-200 disabled:opacity-100 text-gray-900 font-medium text-right" />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[13px] text-muted-foreground ml-1">แรงม้า</Label>
                                    <Input disabled value="141" className="h-10 rounded-xl bg-gray-50/50 border-gray-200 disabled:opacity-100 text-gray-900 font-medium text-right" />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[13px] text-muted-foreground ml-1">สี</Label>
                                    <Input disabled value="ขาว (Platinum White Pearl)" className="h-10 rounded-xl bg-gray-50/50 border-gray-200 disabled:opacity-100 text-gray-900 font-medium" />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[13px] text-muted-foreground ml-1">เลข รย.</Label>
                                    <Input disabled value="รย.1" className="h-10 rounded-xl bg-gray-50/50 border-gray-200 disabled:opacity-100 text-gray-900 font-medium" />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[13px] text-muted-foreground ml-1">ลักษณะ</Label>
                                    <Input disabled value="เก๋งสองตอน" className="h-10 rounded-xl bg-gray-50/50 border-gray-200 disabled:opacity-100 text-gray-900 font-medium" />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[13px] text-muted-foreground ml-1">ประเภทการใช้งาน</Label>
                                    <Input disabled value="ส่วนบุคคล" className="h-10 rounded-xl bg-gray-50/50 border-gray-200 disabled:opacity-100 text-gray-900 font-medium" />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[13px] text-muted-foreground ml-1">เชื้อเพลิง</Label>
                                    <Input disabled value="เบนซิน" className="h-10 rounded-xl bg-gray-50/50 border-gray-200 disabled:opacity-100 text-gray-900 font-medium" />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[13px] text-muted-foreground ml-1">เลขเครื่องยนต์</Label>
                                    <Input disabled value="R18Z1-7842516" className="h-10 rounded-xl bg-gray-50/50 border-gray-200 disabled:opacity-100 text-gray-900 font-medium font-mono text-[12px]" />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[13px] text-muted-foreground ml-1">เลขตัวถัง</Label>
                                    <Input disabled value="MRHFC1650JPXXXXXX" className="h-10 rounded-xl bg-gray-50/50 border-gray-200 disabled:opacity-100 text-gray-900 font-medium font-mono text-[12px]" />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[13px] text-muted-foreground ml-1">บริเวณสถานที่ตั้งรถ</Label>
                                    <Input disabled value="กรุงเทพมหานคร" className="h-10 rounded-xl bg-gray-50/50 border-gray-200 disabled:opacity-100 text-gray-900 font-medium" />
                                </div>
                            </div>
                        )}

                        {/* Refer Pre-screening questions */}
                            {COLLATERAL_QUESTIONS[formData.collateralType]?.length > 0 && (
                                <div className="pt-8 border-t border-border-subtle mt-8">
                                    <h4 className="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                        เงื่อนไขการประเมินสภาพ{formData.collateralType === 'land' ? 'ทรัพย์สิน' : 'รถ'}
                                    </h4>
                                    <div className="space-y-2">
                                        {COLLATERAL_QUESTIONS[formData.collateralType]?.map((q) => (
                                            <div key={q.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50/50 border border-gray-100 rounded-xl gap-4">
                                                <span className="text-sm text-gray-700 font-bold">{q.text}</span>
                                                <div className="flex items-center gap-1.5 bg-white border border-border-strong p-1 rounded-lg shrink-0">
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({
                                                            ...formData,
                                                            collateralQuestions: { ...formData.collateralQuestions, [q.id]: 'yes' }
                                                        })}
                                                        className={cn(
                                                            "px-5 py-1.5 rounded-md text-sm font-bold transition-all",
                                                            formData.collateralQuestions?.[q.id] === 'yes'
                                                                ? "bg-gray-200 text-gray-700 shadow-sm"
                                                                : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                                                        )}
                                                    >
                                                        ใช่
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({
                                                            ...formData,
                                                            collateralQuestions: { ...formData.collateralQuestions, [q.id]: 'no' }
                                                        })}
                                                        className={cn(
                                                            "px-5 py-1.5 rounded-md text-sm font-bold transition-all",
                                                            formData.collateralQuestions?.[q.id] === 'no'
                                                                ? "bg-chaiyo-blue text-white shadow-sm"
                                                                : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                                                        )}
                                                    >
                                                        ไม่ใช่
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Additional Questions */}
                                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-blue-50/30 border border-blue-100/50 rounded-xl gap-4">
                                            <span className="text-sm text-gray-700 font-bold">เป็นหลักประกันที่ใช้ทำมาหากินหรือไม่</span>
                                            <div className="flex items-center gap-1.5 bg-white border border-border-strong p-1 rounded-lg shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, isLivelihoodCollateral: 'yes' })}
                                                    className={cn(
                                                        "px-5 py-1.5 rounded-md text-sm font-bold transition-all",
                                                        formData.isLivelihoodCollateral === 'yes'
                                                            ? "bg-chaiyo-blue text-white shadow-sm"
                                                            : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                                                    )}
                                                >
                                                    ใช่
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, isLivelihoodCollateral: 'no' })}
                                                    className={cn(
                                                        "px-5 py-1.5 rounded-md text-sm font-bold transition-all",
                                                        formData.isLivelihoodCollateral === 'no'
                                                            ? "bg-chaiyo-blue text-white shadow-sm"
                                                            : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                                                    )}
                                                >
                                                    ไม่ใช่
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            )}
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
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-900">ผู้ถือครองกรรมสิทธิ์</h3>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                <div className="md:col-span-2 space-y-1">
                                    <Label className="text-[13px] text-muted-foreground ml-1">คำนำหน้า</Label>
                                    <Combobox
                                        options={THAI_PREFIXES}
                                        value={formData.ownerTitle || "นาย"}
                                        onValueChange={(val) => setFormData({ ...formData, ownerTitle: val })}
                                        placeholder="คำนำหน้า"
                                        searchPlaceholder="ค้นหาคำนำหน้า..."
                                    />
                                </div>
                                <div className="md:col-span-10 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label className="text-[13px] text-muted-foreground ml-1">ชื่อ <span className="text-red-500">*</span></Label>
                                            <Input
                                                value={formData.ownerFirstName || "กฤตพาส"}
                                                onChange={(e) => setFormData({ ...formData, ownerFirstName: e.target.value })}
                                                className="h-12 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[13px] text-muted-foreground ml-1">นามสกุล <span className="text-red-500">*</span></Label>
                                            <Input
                                                value={formData.ownerLastName || "อัครเดชธนาธรพงศ์"}
                                                onChange={(e) => setFormData({ ...formData, ownerLastName: e.target.value })}
                                                className="h-12 rounded-xl bg-white border-gray-200 text-gray-900 font-medium focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue/20"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Group: ระยะเวลาการถือกรรมสิทธิ์ */}
                            <div className="pt-4 border-t border-gray-100">
                                <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-chaiyo-gold" />
                                    {formData.collateralType === 'land' ? 'ข้อมูลการโอนกรรมสิทธิ์' : 'ระยะเวลาการถือกรรมสิทธิ์'}
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">
                                            {formData.collateralType === 'land' ? 'วันที่โอนกรรมสิทธิ์ล่าสุด' : 'วันที่ถือกรรมสิทธิ์(จำนำ/จำนอง)/ครอบครอง(รีไฟแนนซ์)'}
                                        </Label>
                                        <DatePickerBE
                                            value={formData.ownershipStartDate}
                                            onChange={(val) => setFormData({ ...formData, ownershipStartDate: val })}
                                            inputClassName="h-12"
                                        />
                                    </div>
                                    {formData.collateralType !== 'land' && (
                                        <div className="space-y-1">
                                            <Label className="text-[13px] text-muted-foreground ml-1">ระยะเวลาถือกรรมสิทธิ์/ครอบครอง</Label>
                                            <div className="h-12 flex items-center px-4 bg-blue-50/30 border border-blue-100/50 rounded-xl text-chaiyo-blue font-medium">
                                                {formData.ownershipDuration || "3 ปี 2 เดือน 15 วัน"}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Group: ข้อมูลเจ้าของเดิม */}
                            <div className="pt-4 border-t border-gray-100">
                                <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Book className="w-4 h-4 text-blue-500" />
                                    ข้อมูลเจ้าของเดิม
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">เจ้าของกรรมสิทธิ์เดิม</Label>
                                        <Input
                                            placeholder="ชื่อ-นามสกุล เจ้าของเดิม"
                                            value={formData.previousOwnerName || ""}
                                            onChange={(e) => setFormData({ ...formData, previousOwnerName: e.target.value })}
                                            className="h-12 rounded-xl bg-white border-gray-200"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[13px] text-muted-foreground ml-1">วันที่ถือกรรมสิทธิ์ของเจ้าของเดิม</Label>
                                        <DatePickerBE
                                            value={formData.previousOwnerDate}
                                            onChange={(val) => setFormData({ ...formData, previousOwnerDate: val })}
                                            inputClassName={cn(
                                                "h-12 transition-all",
                                                aiDetectedFields.includes('previousOwnerDate') && "border-purple-300 ring-1 ring-purple-100 bg-purple-50/30 font-bold text-purple-700"
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* SECTION 3: ราคาประเมินสินทรัพย์ */}
                {(formData.collateralType === 'car' || formData.collateralType === 'land') && (
                    <Card className="border-border-strong overflow-hidden">
                        <CardHeader className="bg-blue-50/50 border-b border-border-strong pb-4">
                            <CardTitle className="text-lg flex items-center gap-2 text-chaiyo-blue font-bold">
                                <Calculator className="w-5 h-5" />
                                ราคาประเมินสินทรัพย์
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                {formData.collateralType === 'land' ? (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center justify-between p-4 bg-blue-50/30 border border-blue-100/50 rounded-xl">
                                            <Label className="text-sm font-bold text-gray-700">ราคาประเมินจากกรมที่ดิน</Label>
                                            <div className="text-lg font-bold text-chaiyo-blue">
                                                1,200,000 <span className="text-xs text-muted-foreground ml-1">บาท</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-blue-50/30 border border-blue-100/50 rounded-xl">
                                            <Label className="text-sm font-bold text-gray-700">ราคาประเมินตลาด/บริษัทฯ</Label>
                                            <div className="text-lg font-bold text-chaiyo-blue">
                                                2,500,000 <span className="text-xs text-muted-foreground ml-1">บาท</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-emerald-50/30 border border-emerald-100/50 rounded-xl md:col-span-2">
                                            <Label className="text-base font-bold text-emerald-800">ราคาประเมินรวมที่ใช้คำนวณ</Label>
                                            <div className="text-2xl font-bold text-emerald-600">
                                                2,500,000 <span className="text-sm text-emerald-800/60 ml-1">บาท</span>
                                            </div>
                                        </div>
                                    </div>
                                    </>
                                ) : (
                                    <div className="flex items-center justify-between p-4 bg-blue-50/30 border border-blue-100/50 rounded-xl">
                                        <Label className="text-base font-bold text-gray-700">ราคาประเมิน/เรทบุ๊ค</Label>
                                        <div className="text-2xl font-bold text-chaiyo-blue">
                                            550,000 <span className="text-sm text-muted-foreground ml-1">บาท</span>
                                        </div>
                                    </div>
                                )}

                                {formData.collateralType !== 'land' && (
                                    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50/50 border border-gray-100 rounded-xl gap-4">
                                        <span className="text-sm text-gray-700 font-bold">
                                            ถ้ามีคนมาติดต่อขอซื้อหลักประกัน ท่านจะขายในราคาเท่าไร
                                        </span>
                                        <div className="relative w-full md:w-64">
                                            <Input
                                                type="text"
                                                placeholder="0"
                                                value={formData.estimatedSalePrice ? Number(formData.estimatedSalePrice).toLocaleString() : ''}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/,/g, '');
                                                    if (/^\d*$/.test(val) || val === '') {
                                                        setFormData({ ...formData, estimatedSalePrice: val });
                                                    }
                                                }}
                                                className="h-12 pr-12 text-right font-bold text-chaiyo-blue border-chaiyo-blue/20 bg-white focus:border-chaiyo-blue focus:ring-chaiyo-blue/10 rounded-xl"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">บาท</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* SECTION 4: แบบสอบถามพฤติกรรมที่เกี่ยวกับหลักประกัน (Land Only) */}
                {formData.collateralType === 'land' && (
                    <Card className="border-border-strong overflow-hidden">
                        <CardHeader className="bg-chaiyo-gold/5 border-b border-border-strong pb-4">
                            <CardTitle className="text-lg flex items-center gap-2 text-gray-900 font-bold">
                                <FileText className="w-5 h-5 text-chaiyo-blue" />
                                แบบสอบถามพฤติกรรมที่เกี่ยวกับหลักประกัน
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground mb-4">ส่วนนี้เป็นข้อมูลเพิ่มเติม (Optional) เพื่อใช้ประกอบการพิจารณา</p>
                                
                                <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50/50 border border-gray-100 rounded-xl gap-4">
                                    <span className="text-sm text-gray-700 font-bold">ใช้ทำมาหากินด้านไหน</span>
                                    <Input
                                        placeholder="ระบุ เช่น ทำสวน, ค้าขาย"
                                        className="h-11 w-full md:w-80 bg-white border-gray-200 focus:border-chaiyo-blue"
                                        value={formData.landUsageType || ""}
                                        onChange={(e) => setFormData({ ...formData, landUsageType: e.target.value })}
                                    />
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50/50 border border-gray-100 rounded-xl gap-4">
                                    <span className="text-sm text-gray-700 font-bold">ที่ดินทำกินมีคนช่วยทำงานหรือไม่</span>
                                    <div className="flex items-center gap-1.5 bg-white border border-border-strong p-1 rounded-lg shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, hasHelpers: 'yes' })}
                                            className={cn(
                                                "px-5 py-1.5 rounded-md text-sm font-bold transition-all",
                                                formData.hasHelpers === 'yes' ? "bg-chaiyo-blue text-white shadow-sm" : "text-gray-400 hover:text-gray-600"
                                            )}
                                        >
                                            มี
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, hasHelpers: 'no' })}
                                            className={cn(
                                                "px-5 py-1.5 rounded-md text-sm font-bold transition-all",
                                                formData.hasHelpers === 'no' ? "bg-chaiyo-blue text-white shadow-sm" : "text-gray-400 hover:text-gray-600"
                                            )}
                                        >
                                            ไม่มี
                                        </button>
                                    </div>
                                </div>

                                {formData.hasHelpers === 'yes' && (
                                    <div className="flex flex-col gap-2 pl-6 border-l-2 border-blue-100 animate-in slide-in-from-left-2 duration-200">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-blue-50/20 border border-blue-50 rounded-xl gap-4">
                                            <span className="text-sm text-gray-600 font-medium">ญาติ พี่น้อง คนในครอบครัวที่ช่วยทำงาน กี่คน</span>
                                            <div className="relative w-full md:w-32">
                                                <Input
                                                    type="text"
                                                    placeholder="0"
                                                    value={formData.helperFamilyCount || ""}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        if (/^\d*$/.test(val)) {
                                                            const family = parseInt(val) || 0;
                                                            const hired = parseInt(formData.helperHiredCount || "0") || 0;
                                                            setFormData({ 
                                                                ...formData, 
                                                                helperFamilyCount: val,
                                                                helperTotalCount: (family + hired).toString()
                                                            });
                                                        }
                                                    }}
                                                    className="h-11 pr-10 text-right font-bold bg-white border-gray-200"
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">คน</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-blue-50/20 border border-blue-50 rounded-xl gap-4">
                                            <span className="text-sm text-gray-600 font-medium">มีพนักงานว่าจ้าง กี่คน</span>
                                            <div className="relative w-full md:w-32">
                                                <Input
                                                    type="text"
                                                    placeholder="0"
                                                    value={formData.helperHiredCount || ""}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        if (/^\d*$/.test(val)) {
                                                            const hired = parseInt(val) || 0;
                                                            const family = parseInt(formData.helperFamilyCount || "0") || 0;
                                                            setFormData({ 
                                                                ...formData, 
                                                                helperHiredCount: val,
                                                                helperTotalCount: (family + hired).toString()
                                                            });
                                                        }
                                                    }}
                                                    className="h-11 pr-10 text-right font-bold bg-white border-gray-200"
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">คน</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-blue-50/40 border border-blue-100 rounded-xl gap-4">
                                            <div className="flex items-center gap-2">
                                                <Calculator className="w-4 h-4 text-chaiyo-blue" />
                                                <span className="text-sm text-chaiyo-blue font-bold">คำนวนจำนวนทั้งหมด (System sum)</span>
                                            </div>
                                            <div className="flex items-center gap-2 px-4 h-11 bg-white border border-blue-200 rounded-lg min-w-32 justify-end">
                                                <span className="text-lg font-bold text-chaiyo-blue">
                                                    {formData.helperTotalCount || "0"}
                                                </span>
                                                <span className="text-sm font-bold text-gray-400">คน</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="pt-4 mt-2 border-t border-gray-100">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50/50 border border-gray-100 rounded-xl gap-4">
                                        <span className="text-sm text-gray-700 font-bold">หากมีคนมาติดต่อขอซื้อหลักประกัน ท่านจะขายในราคาเท่าไร</span>
                                        <div className="relative w-full md:w-64">
                                            <Input
                                                type="text"
                                                placeholder="0"
                                                value={formData.estimatedSalePrice ? Number(formData.estimatedSalePrice).toLocaleString() : ''}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/,/g, '');
                                                    if (/^\d*$/.test(val) || val === '') {
                                                        setFormData({ ...formData, estimatedSalePrice: val });
                                                    }
                                                }}
                                                className="h-12 pr-12 text-right font-bold text-chaiyo-blue border-chaiyo-blue/20 bg-white focus:border-chaiyo-blue rounded-xl"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">บาท</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Lightbox */}
            {
                lightboxIndex !== null && (
                    <div
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 animate-in fade-in duration-300"
                        onClick={() => setLightboxIndex(null)}
                    >
                        <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors bg-white/10 p-2 rounded-full backdrop-blur-md">
                            <X className="w-8 h-8" />
                        </button>

                        <img
                            src={uploadedDocs[lightboxIndex as number]}
                            className="max-h-[85vh] max-w-full object-contain rounded-2xl shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />

                        <div className="mt-8 flex gap-3 px-4 py-3 bg-white/5 rounded-2xl backdrop-blur-md" onClick={(e) => e.stopPropagation()}>
                            {uploadedDocs.map((doc, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setLightboxIndex(idx)}
                                    className={cn(
                                        "w-16 h-16 rounded-xl overflow-hidden border-2 transition-all",
                                        idx === lightboxIndex ? "border-white scale-110" : "border-transparent opacity-40 hover:opacity-100"
                                    )}
                                >
                                    <img src={doc} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>
                )
            }
        </div >
    );
}
