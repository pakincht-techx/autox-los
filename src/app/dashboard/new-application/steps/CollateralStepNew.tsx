// Merged Collateral Step - Replaced with Pre-question style UI
"use client";

import { useState, useEffect } from "react";
import {
    Car, Bike, Truck, Tractor, Map, Sparkles, Upload, FileText,
    Check, Loader2, AlertCircle, Camera, Book, X, Plus,
    ChevronLeft, ChevronRight, Eye
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
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
    YEARS
} from "@/data/vehicle-data";

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
        { id: 'q1', text: 'มีการดัดแปลงสภาพรถหรือไม่?' },
        { id: 'q2', text: 'มีประวัติอุบัติเหตุหนักหรือไม่?' },
        { id: 'q3', text: 'เล่มทะเบียนมีผู้ครอบครองมากกว่า 1 คนหรือไม่?' },
    ],
    moto: [
        { id: 'q1', text: 'มีการดัดแปลงสภาพรถหรือไม่?' },
        { id: 'q2', text: 'รถใช้งานรับจ้างสาธารณะหรือไม่?' },
    ],
    truck: [
        { id: 'q1', text: 'มีการดัดแปลงต่อเติมกระบะ/โครงเหล็กหรือไม่?' },
        { id: 'q2', text: 'รถวิ่งงานข้ามจังหวัดเป็นหลักหรือไม่?' },
    ],
    agri: [
        { id: 'q1', text: 'เครื่องจักรมีการใช้งานหนักต่อเนื่องหรือไม่?' },
        { id: 'q2', text: 'มีอุปกรณ์ต่อพ่วงครบชุดหรือไม่?' },
    ],
    land: [
        { id: 'm', text: 'ที่ดินตาบอด, ที่ดินติดคลองติดลำธารที่ไม่ติดถนนสาธารณะ' },
        { id: 'n', text: 'ที่ดินติดหรือเป็น สถานที่ศักดิ์สิทธิ์ วัด ศาลเจ้า โรงเรียน' },
        { id: 'o', text: 'ที่ดินติดหรือเป็น สุสาน ป่าช้า บ่อขยะ' },
        { id: 'p', text: 'ที่ดินติดเขตกรรถไฟ' },
        { id: 'q', text: 'ที่ดินที่มีบ่อน้ำกินพื้นที่ตั้งแต่ 40% ขึ้นไป' },
        { id: 'r', text: 'ที่ดินรกร้าง, ห่างไกลชุมชน เช่น ห่างจากอำเภอเมือง หรือหัวเมืองใหญ่ หรือที่ดินรอบข้างไม่ใช่ที่ทำกิน และที่อยู่อาศัย' },
    ],
};

export function CollateralStep({ formData, setFormData, isExistingCustomer = false, existingCollaterals = [] }: CollateralStepProps) {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiDetectedFields, setAiDetectedFields] = useState<string[]>([]);
    const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    // Initial setup if collateralType is already set
    useEffect(() => {
        if (!formData.collateralType) {
            setFormData({ ...formData, collateralType: 'car' });
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
                mockData = { ...mockData, brand: 'Toyota', model: 'Camry', year: '2019', subModel: 'HEV Premium' };
                fields.push('subModel');
            } else if (formData.collateralType === 'moto') {
                mockData = { ...mockData, brand: 'Honda', model: 'Wave 125i', year: '2021', appraisalPrice: 35000 };
            } else if (formData.collateralType === 'truck') {
                mockData = { ...mockData, brand: 'Isuzu', model: 'D-Max', year: '2020', appraisalPrice: 500000 };
            } else if (formData.collateralType === 'agri') {
                mockData = { ...mockData, brand: 'Kubota', model: 'L5018', year: '2022', appraisalPrice: 600000 };
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


            <div className="relative ml-4 pl-8 pb-12">


                <div className="space-y-8 pb-4">
                    <div className="space-y-4">
                        <Label className="text-base font-bold text-gray-700">ประเภทหลักประกัน *</Label>
                        <div className="flex flex-wrap gap-2">
                            {PRODUCTS.map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => {
                                        setFormData({
                                            ...formData,
                                            collateralType: p.id,
                                            brand: '',
                                            model: '',
                                            year: '',
                                            appraisalPrice: 0,
                                            collateralQuestions: {}
                                        });
                                        setAiDetectedFields([]);
                                    }}
                                    className={cn(
                                        "flex-1 min-w-[120px] py-4 px-4 rounded-2xl border-2 text-sm font-bold transition-all text-center group flex flex-col items-center justify-center gap-2",
                                        formData.collateralType === p.id
                                            ? "border-chaiyo-blue bg-blue-50 text-chaiyo-blue shadow-sm"
                                            : "border-gray-100 bg-white text-gray-500 hover:border-gray-200 hover:bg-gray-50"
                                    )}
                                >
                                    <p.icon className={cn("w-6 h-6", formData.collateralType === p.id ? "text-chaiyo-blue" : "text-gray-400 group-hover:text-gray-600")} />
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        {(formData.collateralType === 'car' || formData.collateralType === 'moto' || formData.collateralType === 'truck' || formData.collateralType === 'agri') ? (
                            <div className="border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm">
                                {/* Photo Upload Area */}
                                <div className="p-8 border-b border-gray-100 bg-blue-50/20">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                                <Camera className="w-5 h-5 text-chaiyo-blue" />
                                                อัพโหลดรูปถ่ายหลักประกัน
                                            </h4>
                                            <p className="text-sm text-gray-500 mt-1">อัพโหลดรูปถ่ายรถหรือป้ายทะเบียน เพื่อให้ AI ช่วยวิเคราะห์ข้อมูล</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4">
                                        {uploadedDocs.map((doc, idx) => (
                                            <div key={idx} className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-gray-200 group bg-white shadow-sm transition-all hover:border-chaiyo-blue">
                                                <img src={doc} alt={`doc-${idx}`} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => setLightboxIndex(idx)}
                                                        className="text-white hover:text-blue-200 transition-colors p-1.5 bg-white/10 rounded-full backdrop-blur-sm"
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleRemovePhoto(idx); }}
                                                        className="text-white hover:text-red-300 transition-colors p-1.5 bg-white/10 rounded-full backdrop-blur-sm"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </div>
                                                {isAnalyzing && (
                                                    <div className="absolute inset-0 bg-blue-500/20 flex flex-col items-center justify-center">
                                                        <div className="w-full h-1 bg-blue-400 absolute top-0 animate-[scan_2s_infinite]" />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            onClick={handleAddPhoto}
                                            className="w-32 h-32 rounded-2xl border-2 border-dashed border-gray-300 hover:border-chaiyo-blue hover:bg-blue-50 flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-chaiyo-blue transition-all bg-white shadow-sm group"
                                        >
                                            <div className="p-3 bg-gray-50 rounded-full group-hover:bg-blue-100 transition-colors">
                                                <Plus className="w-6 h-6" />
                                            </div>
                                            <span className="text-xs font-bold">เพิ่มรูปถ่าย</span>
                                        </button>
                                    </div>

                                    <div className="mt-8 flex justify-end">
                                        <Button
                                            size="lg"
                                            onClick={handleAnalyzePhotos}
                                            disabled={isAnalyzing || uploadedDocs.length === 0}
                                            className="font-bold px-8 h-12 rounded-xl shadow-lg shadow-blue-500/20"
                                        >
                                            {isAnalyzing ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                                    กำลังวิเคราะห์...
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="w-5 h-5 mr-2" />
                                                    วิเคราะห์รูปภาพ
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 p-8">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label>ยี่ห้อ</Label>
                                            {aiDetectedFields.includes('brand') && (
                                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-none text-[10px] font-bold">
                                                    AI EXTRACTED
                                                </Badge>
                                            )}
                                        </div>
                                        <Combobox
                                            options={
                                                formData.collateralType === 'moto' ? MOTO_BRANDS :
                                                    formData.collateralType === 'truck' ? TRUCK_BRANDS :
                                                        formData.collateralType === 'agri' ? AGRI_BRANDS :
                                                            CAR_BRANDS
                                            }
                                            value={formData.brand}
                                            onValueChange={(val) => {
                                                setFormData({ ...formData, brand: val, model: '', subModel: '' });
                                                setAiDetectedFields(prev => prev.filter(f => f !== 'brand' && f !== 'model'));
                                            }}
                                            placeholder="เลือกยี่ห้อ..."
                                            searchPlaceholder="ค้นหายี่ห้อ..."
                                            className="h-12"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label>รุ่น</Label>
                                            {aiDetectedFields.includes('model') && (
                                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-none text-[10px] font-bold">
                                                    AI EXTRACTED
                                                </Badge>
                                            )}
                                        </div>
                                        <Combobox
                                            options={MODELS_BY_BRAND[formData.brand] || []}
                                            value={formData.model}
                                            onValueChange={(val) => {
                                                setFormData({ ...formData, model: val });
                                                setAiDetectedFields(prev => prev.filter(f => f !== 'model'));
                                            }}
                                            placeholder="เลือกรุ่น..."
                                            searchPlaceholder="ค้นหารุ่น..."
                                            className={cn("h-12", !formData.brand && "opacity-50 pointer-events-none")}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label>รุ่นย่อย</Label>
                                            {aiDetectedFields.includes('subModel') && (
                                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-none text-[10px] font-bold">
                                                    AI EXTRACTED
                                                </Badge>
                                            )}
                                        </div>
                                        <Combobox
                                            options={SUB_MODELS_BY_MODEL[formData.model] || []}
                                            value={formData.subModel}
                                            onValueChange={(val) => {
                                                setFormData({ ...formData, subModel: val });
                                            }}
                                            placeholder="เลือกรุ่นย่อย..."
                                            searchPlaceholder="ค้นหารุ่นย่อย..."
                                            className={cn("h-12", !formData.model && "opacity-50 pointer-events-none")}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label>ปีจดทะเบียน</Label>
                                            {aiDetectedFields.includes('year') && (
                                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-none text-[10px] font-bold">
                                                    AI EXTRACTED
                                                </Badge>
                                            )}
                                        </div>
                                        <Combobox
                                            options={YEARS}
                                            value={formData.year}
                                            onValueChange={(val) => {
                                                setFormData({ ...formData, year: val });
                                                setAiDetectedFields(prev => prev.filter(f => f !== 'year'));
                                            }}
                                            placeholder="เลือกปี..."
                                            searchPlaceholder="ค้นหาปี..."
                                            className="h-12"
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label>สถานะหลักประกัน</Label>
                                        <Select value={formData.collateralStatus || 'clear'} onValueChange={(val) => setFormData({ ...formData, collateralStatus: val })}>
                                            <SelectTrigger className="bg-white h-12 rounded-xl">
                                                <SelectValue placeholder="เลือกสถานะ" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="clear">ปลอดภาระ</SelectItem>
                                                <SelectItem value="pledge">จำนำ</SelectItem>
                                                <SelectItem value="hire_purchase">เช่าซื้อ</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 p-8 bg-white">
                                    {/* 1. ประเภท โฉนดที่ดิน */}
                                    <div className="space-y-2 md:col-span-2">
                                        <Label className="text-sm font-bold text-gray-700">ประเภท โฉนดที่ดิน</Label>
                                        <Select value={formData.landDeedType || ''} onValueChange={(val) => {
                                            setFormData({ ...formData, landDeedType: val, residenceType: '' });
                                        }}>
                                            <SelectTrigger className="bg-white text-base h-12 rounded-xl">
                                                <SelectValue placeholder="เลือกประเภทโฉนด" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ns4">น.ส. 4</SelectItem>
                                                <SelectItem value="ns3k">น.ส. 3 ก</SelectItem>
                                                <SelectItem value="orchor2">อ.ช. 2</SelectItem>
                                                <SelectItem value="trajong_deed">โฉนดตราจอง</SelectItem>
                                                <SelectItem value="trajong_utilized">ตราจองที่ว่าได้ทำประโยชน์แล้ว</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* 2. ลักษณะที่ดิน */}
                                    <div className="space-y-2 md:col-span-2">
                                        <Label className="text-sm font-bold text-gray-700">ลักษณะที่ดิน</Label>
                                        <Select value={formData.landFeatureType || ''} onValueChange={(val) => setFormData({ ...formData, landFeatureType: val })}>
                                            <SelectTrigger className="bg-white text-base h-12 rounded-xl">
                                                <SelectValue placeholder="เลือกลักษณะที่ดิน" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="empty_land">ที่ดินเปล่า</SelectItem>
                                                <SelectItem value="land_with_building">ที่ดินพร้อมสิ่งปลูกสร้าง</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {formData.landFeatureType === 'land_with_building' && (
                                        <>
                                            {/* 3. อายุสิ่งปลูกสร้าง */}
                                            <div className="space-y-2 md:col-span-1">
                                                <Label className="text-sm font-bold text-gray-700">อายุสิ่งปลูกสร้าง (ปี)</Label>
                                                <Input
                                                    type="number"
                                                    value={formData.buildingAge || ''}
                                                    onChange={(e) => setFormData({ ...formData, buildingAge: e.target.value })}
                                                    className="h-12 text-base rounded-xl"
                                                    placeholder="กรอกอายุสิ่งปลูกสร้าง"
                                                />
                                            </div>

                                            {/* 4. รีโนเวท */}
                                            <div className="space-y-2 md:col-span-1">
                                                <Label className="text-sm font-bold text-gray-700">มีการรีโนเวทในช่วงที่ผ่านมาหรือไม่</Label>
                                                <Select value={formData.hasRenovation || ''} onValueChange={(val) => setFormData({ ...formData, hasRenovation: val })}>
                                                    <SelectTrigger className="bg-white text-base h-12 rounded-xl">
                                                        <SelectValue placeholder="เลือก" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="yes">มีการรีโนเวท</SelectItem>
                                                        <SelectItem value="no">ไม่มีการรีโนเวท</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* 5. ที่อยู่อาศัยเป็นแบบใด */}
                                            <div className="space-y-2 md:col-span-2">
                                                <Label className="text-sm font-bold text-gray-700">ที่อยู่อาศัยเป็นแบบใด</Label>
                                                <Select value={formData.residenceType || ''} onValueChange={(val) => setFormData({ ...formData, residenceType: val })}>
                                                    <SelectTrigger className="bg-white text-base h-12 rounded-xl">
                                                        <SelectValue placeholder="เลือกแบบที่อยู่อาศัย" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {formData.landDeedType === 'orchor2' ? (
                                                            <SelectItem value="condo">คอนโดมิเนียม</SelectItem>
                                                        ) : (
                                                            <>
                                                                <SelectItem value="housing_estate">หมู่บ้านจัดสรร</SelectItem>
                                                                <SelectItem value="general_residence">ที่อยู่อาศัยทั่วไป / สร้างเอง</SelectItem>
                                                            </>
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </>
                                    )}

                                    {/* 6. ราคาประเมิน */}
                                    <div className="space-y-4 md:col-span-2 p-6 bg-blue-50/30 border border-blue-100 rounded-2xl mt-4">
                                        <Label className="text-sm font-bold text-chaiyo-blue">สรุปราคาประเมินเบื้องต้น</Label>

                                        <div className="space-y-2">
                                            <Label className="text-xs text-gray-500">แหล่งอ้างอิงราคาประเมิน</Label>
                                            <Select value={formData.appraisalSource || ''} onValueChange={(val) => setFormData({ ...formData, appraisalSource: val })}>
                                                <SelectTrigger className="bg-white text-base h-12 rounded-xl">
                                                    <SelectValue placeholder="เลือกแหล่งอ้างอิง" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="department_of_lands">กรมที่ดิน</SelectItem>
                                                    <SelectItem value="external_appraisal">บ.ประเมินนอก</SelectItem>
                                                    <SelectItem value="treasury_department">กรมธนารักษ์ (ที่ดินพร้อมสิ่งปลูกสร้าง, ห้องชุด)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                            <div className="space-y-2">
                                                <Label className="text-xs text-gray-500 font-bold">ราคาที่ดิน (บาท)</Label>
                                                <Input
                                                    type="text"
                                                    value={formData.appraisedLandPrice ? Number(formData.appraisedLandPrice).toLocaleString() : ''}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/,/g, '');
                                                        if (!isNaN(Number(value))) {
                                                            const landPrice = Number(value) || 0;
                                                            const buildingPrice = Number(formData.appraisedBuildingPrice) || 0;
                                                            setFormData({
                                                                ...formData,
                                                                appraisedLandPrice: value,
                                                                appraisalPrice: landPrice + buildingPrice
                                                            });
                                                        }
                                                    }}
                                                    className="h-12 text-base rounded-xl font-bold text-right"
                                                    placeholder="0"
                                                />
                                            </div>

                                            {formData.landFeatureType === 'land_with_building' && (
                                                <div className="space-y-2">
                                                    <Label className="text-xs text-gray-500 font-bold">ราคาสิ่งปลูกสร้าง (บาท)</Label>
                                                    <Input
                                                        type="text"
                                                        value={formData.appraisedBuildingPrice ? Number(formData.appraisedBuildingPrice).toLocaleString() : ''}
                                                        onChange={(e) => {
                                                            const value = e.target.value.replace(/,/g, '');
                                                            if (!isNaN(Number(value))) {
                                                                const buildingPrice = Number(value) || 0;
                                                                const landPrice = Number(formData.appraisedLandPrice) || 0;
                                                                setFormData({
                                                                    ...formData,
                                                                    appraisedBuildingPrice: value,
                                                                    appraisalPrice: landPrice + buildingPrice
                                                                });
                                                            }
                                                        }}
                                                        className="h-12 text-base rounded-xl font-bold text-right"
                                                        placeholder="0"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {/* 7. แสดง Sum รวม */}
                                        <div className="pt-6 border-t border-blue-100 flex justify-between items-center">
                                            <Label className="text-sm font-bold text-gray-700">ราคารวมเบื้องต้น</Label>
                                            <div className="text-right">
                                                <span className="text-2xl font-bold text-chaiyo-blue">
                                                    {((Number(formData.appraisedLandPrice) || 0) + (Number(formData.appraisedBuildingPrice) || 0)).toLocaleString()}
                                                </span>
                                                <span className="text-sm font-bold text-chaiyo-blue ml-2">บาท</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 8. หลักประกันที่เอามาใช้ */}
                                    <div className="space-y-2 md:col-span-2 pt-2">
                                        <Label className="text-sm font-bold text-gray-700">หลักประกันที่เอามาใช้</Label>
                                        <Select value={formData.landCollateralPurpose || ''} onValueChange={(val) => setFormData({ ...formData, landCollateralPurpose: val })}>
                                            <SelectTrigger className="bg-white text-base h-12 rounded-xl">
                                                <SelectValue placeholder="เลือกชนิดหลักประกัน" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="clear">ปลอดภาระ</SelectItem>
                                                <SelectItem value="refinance">Refinance</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Pricing Summary Section */}
                        {(formData.aiPrice > 0 || formData.redbookPrice > 0 || formData.appraisalPrice > 0) && (
                            <div className="p-6 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl shadow-sm">
                                <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    สรุปราคาประเมินเบื้องต้น
                                </h4>
                                <div className={cn(
                                    "grid grid-cols-1 gap-4",
                                    formData.collateralType === 'car' ? "md:grid-cols-3" :
                                        formData.collateralType === 'land' ? "md:grid-cols-1" :
                                            "md:grid-cols-2"
                                )}>
                                    {formData.collateralType === 'car' && (
                                        <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm space-y-1">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">AI Analysis Price</p>
                                            <p className="text-lg font-bold text-gray-900">฿{formData.aiPrice?.toLocaleString() || '0'}</p>
                                            <Badge className="bg-blue-50 text-blue-600 border-none text-[9px]">From Photos</Badge>
                                        </div>
                                    )}
                                    {(formData.collateralType === 'car' || formData.collateralType === 'moto' || formData.collateralType === 'truck' || formData.collateralType === 'agri') && (
                                        <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm space-y-1">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Redbook Database</p>
                                            <p className="text-lg font-bold text-gray-900">฿{formData.redbookPrice?.toLocaleString() || '0'}</p>
                                            <Badge className="bg-purple-50 text-purple-600 border-none text-[9px]">Market Standard</Badge>
                                        </div>
                                    )}
                                    <div className="p-4 rounded-xl bg-chaiyo-blue text-white shadow-sm space-y-1">
                                        <p className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">Final Appraisal Price</p>
                                        <p className="text-2xl font-black">฿{formData.appraisalPrice?.toLocaleString() || '0'}</p>
                                        <p className="text-[9px] text-blue-100 italic">* อ้างอิงวงเงินสูงสุด</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Dynamic Collateral Questions */}
                        <div className="border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm divide-y divide-gray-100">
                            {(() => {
                                let questions = COLLATERAL_QUESTIONS[formData.collateralType] || [];

                                // Special logic for Land: Hide if OrChor 2
                                if (formData.collateralType === 'land' && formData.landDeedType === 'orchor2') {
                                    questions = [];
                                }

                                return questions.map((q) => (
                                    <div key={q.id} className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white transition-colors">
                                        <div className="max-w-xl">
                                            <Label className="text-base font-medium leading-relaxed">{q.text}</Label>
                                        </div>
                                        <div className="flex items-center gap-2 bg-white border border-gray-100 p-2 rounded-2xl shadow-sm shrink-0">
                                            <button
                                                onClick={() => setFormData({ ...formData, collateralQuestions: { ...formData.collateralQuestions, [q.id]: 'yes' } })}
                                                className={cn(
                                                    "px-8 py-2.5 rounded-xl text-sm font-bold transition-all",
                                                    formData.collateralQuestions?.[q.id] === 'yes'
                                                        ? "bg-gray-200 text-gray-700 shadow-sm"
                                                        : "text-gray-400 hover:bg-gray-50"
                                                )}
                                            >
                                                ใช่
                                            </button>
                                            <button
                                                onClick={() => setFormData({ ...formData, collateralQuestions: { ...formData.collateralQuestions, [q.id]: 'no' } })}
                                                className={cn(
                                                    "px-8 py-2.5 rounded-xl text-sm font-bold transition-all",
                                                    formData.collateralQuestions?.[q.id] === 'no'
                                                        ? "bg-chaiyo-blue text-white shadow-lg shadow-blue-200"
                                                        : "text-gray-400 hover:bg-gray-50"
                                                )}
                                            >
                                                ไม่ใช่
                                            </button>
                                        </div>
                                    </div>
                                ));
                            })()}
                        </div>
                    </div>
                </div>
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
                            src={uploadedDocs[lightboxIndex]}
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
                                        idx === lightboxIndex ? "border-white scale-110 shadow-lg" : "border-transparent opacity-40 hover:opacity-100"
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
