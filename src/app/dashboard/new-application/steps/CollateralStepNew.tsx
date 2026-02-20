// Merged Collateral Step - Combines document upload and info entry with OCR
"use client";

import { useState, useEffect } from "react";
import { Car, Bike, Truck, Tractor, MapIcon, Sparkles, Upload, FileText, Check, Loader2, AlertCircle, Camera, Book, X, Plus, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Combobox } from "@/components/ui/combobox";
import { cn } from "@/lib/utils";
import {
    CAR_BRANDS,
    MOTO_BRANDS,
    TRUCK_BRANDS,
    AGRI_BRANDS,
    MODELS_BY_BRAND,
    YEARS
} from "@/data/vehicle-data";

interface CollateralStepProps {
    formData: any;
    setFormData: (data: any) => void;
    isExistingCustomer?: boolean;
    existingCollaterals?: any[];
}

type CollateralType = 'car' | 'moto' | 'truck' | 'agri' | 'land';
type StepStage = 'SELECT_TYPE' | 'UPLOAD_DOC' | 'FILL_INFO';

// Document requirements for each collateral type
const DOCUMENT_REQUIREMENTS: Record<CollateralType, { name: string; description: string }> = {
    car: { name: 'เล่มทะเบียนรถ', description: 'หน้ารายการจดทะเบียน' },
    moto: { name: 'เล่มทะเบียนรถ', description: 'หน้ารายการจดทะเบียน' },
    truck: { name: 'เล่มทะเบียนรถ', description: 'หน้ารายการจดทะเบียน' },
    agri: { name: 'เล่มทะเบียน หรือ ใบอินวอยซ์/ใบเสร็จซื้อขาย', description: 'เอกสารแสดงกรรมสิทธิ์' },
    land: { name: 'โฉนดที่ดิน', description: 'หน้าแรก - ครุฑ' }
};

// Helper component for displaying OCR data rows
function DataRow({ label, value, mono = false, highlight = false }: { label: string; value?: string; mono?: boolean; highlight?: boolean }) {
    return (
        <div className="flex justify-between items-center py-2 border-b border-blue-100 last:border-0">
            <span className="text-xs text-blue-700 font-medium">{label}</span>
            <span className={cn(
                "text-sm font-bold",
                mono && "font-mono",
                highlight ? "text-chaiyo-blue text-lg" : "text-gray-900"
            )}>
                {value || '-'}
            </span>
        </div>
    );
}

export function CollateralStep({ formData, setFormData, isExistingCustomer = false, existingCollaterals = [] }: CollateralStepProps) {
    const [stage, setStage] = useState<StepStage>('SELECT_TYPE');
    const [selectedType, setSelectedType] = useState<CollateralType | null>(null);
    const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
    const [isProcessingOCR, setIsProcessingOCR] = useState(false);
    const [ocrComplete, setOcrComplete] = useState(false);

    // Lightbox State
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    // Collateral Validation State
    const [collateralStatus, setCollateralStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');
    const [validationMessage, setValidationMessage] = useState<string>("");

    // Simulate Collateral Check
    useEffect(() => {
        const checkAvailability = async () => {
            const keyField = formData.licensePlate || formData.deedNumber || formData.chassisNumber;

            if (!keyField || keyField.length < 3) {
                setCollateralStatus('idle');
                return;
            }

            setCollateralStatus('checking');

            // Mock API delay
            await new Promise(resolve => setTimeout(resolve, 800));

            // Mock Validation Logic: If ends with '9999', it's already used
            if (keyField.endsWith('9999')) {
                setCollateralStatus('unavailable');
                setValidationMessage("ไม่สามารถใช้หลักประกันนี้ได้: หลักประกันนี้ถูกใช้ค้ำประกันในสินเชื่อสัญญาเลขที่ LA-2567/00128 แล้ว (สถานะ: Active)");
            } else {
                setCollateralStatus('available');
                setValidationMessage("");
            }
        };

        const timer = setTimeout(checkAvailability, 1000);
        return () => clearTimeout(timer);
    }, [formData.licensePlate, formData.deedNumber, formData.chassisNumber]);

    // Restore state from formData on mount
    useEffect(() => {
        if (formData.collateralType && stage === 'SELECT_TYPE') {
            const hasData = formData.brand || formData.landNumber || formData.aiAppraisal;
            if (hasData) {
                setSelectedType(formData.collateralType as CollateralType);
                setStage('FILL_INFO');
                setOcrComplete(true);
                // If docs are not in state but we have data, likely we are returning.
                // Restore mock doc for visual consistency if empty
                if (uploadedDocs.length === 0) {
                    setUploadedDocs(["/mock-doc.jpg"]);
                }
            }
        }
    }, [formData.collateralType]);

    // Collateral type options
    const collateralTypes = [
        { id: 'car' as CollateralType, label: 'รถเก๋ง / รถกระบะ', icon: Car, color: 'blue' },
        { id: 'moto' as CollateralType, label: 'รถจักรยานยนต์', icon: Bike, color: 'purple' },
        { id: 'truck' as CollateralType, label: 'รถบรรทุก', icon: Truck, color: 'orange' },
        { id: 'agri' as CollateralType, label: 'รถเพื่อการเกษตร', icon: Tractor, color: 'green' },
        { id: 'land' as CollateralType, label: 'ที่ดิน', icon: MapIcon, color: 'amber' }
    ];

    const handleTypeSelect = (type: CollateralType) => {
        setSelectedType(type);
        setFormData((prev: any) => ({ ...prev, collateralType: type }));
        setStage('UPLOAD_DOC');
    };

    const handleDocumentUpload = () => {
        // Simulate document upload (appending new doc)
        const newDocUrl = `https://placehold.co/600x800/e2e8f0/1e293b?text=Document+${uploadedDocs.length + 1}`;
        setUploadedDocs(prev => [...prev, newDocUrl]);

        // Start OCR processing only if it's the first document
        if (uploadedDocs.length === 0 && !ocrComplete) {
            setIsProcessingOCR(true);

            // Simulate OCR processing
            setTimeout(() => {
                setIsProcessingOCR(false);
                setOcrComplete(true);

                // Mock OCR data based on collateral type
                const mockOCRData = getMockOCRData(selectedType!);
                setFormData((prev: any) => ({ ...prev, ...mockOCRData }));

                // Move to info filling stage automatically
                setTimeout(() => setStage('FILL_INFO'), 500);
            }, 2500);
        }
    };

    const getMockOCRData = (type: CollateralType) => {
        switch (type) {
            case 'car':
            case 'moto':
            case 'truck':
                return {
                    licensePlate: 'กข-1234',
                    province: 'กรุงเทพมหานคร',
                    brand: 'Toyota',
                    model: 'Camry',
                    year: '2020',
                    color: 'ขาว',
                    engineNumber: 'ABC123456',
                    chassisNumber: 'XYZ789012',
                    aiAppraisal: 850000
                };
            case 'agri':
                return {
                    brand: 'Kubota',
                    model: 'M7040',
                    year: '2019',
                    serialNumber: 'KB12345',
                    aiAppraisal: 450000
                };
            case 'land':
                return {
                    deedNumber: 'น.ส.3ก/1234',
                    landNumber: '56',
                    surveyNumber: '789',
                    tambon: 'บางนา',
                    amphoe: 'บางนา',
                    province: 'กรุงเทพมหานคร',
                    area: '2-0-50',
                    aiAppraisal: 3500000
                };
            default:
                return {};
        }
    };

    const handleChange = (field: string, value: string | number) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    const formatNumber = (num: number | string) => {
        return Number(num).toLocaleString('th-TH');
    };

    const handleAppraisalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/,/g, '');
        if (/^\d*$/.test(value)) {
            handleChange('aiAppraisal', value);
        }
    };

    // Render different stages
    if (stage === 'SELECT_TYPE') {
        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-chaiyo-blue" />
                        เลือกประเภทหลักประกัน
                    </h3>
                    <p className="text-muted text-sm">
                        กรุณาเลือกประเภททรัพย์สินที่ต้องการใช้เป็นหลักประกัน
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {collateralTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                            <Card
                                key={type.id}
                                onClick={() => handleTypeSelect(type.id)}
                                className={cn(
                                    "cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border border-gray-200",
                                    "hover:border-chaiyo-blue group"
                                )}
                            >
                                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                                    <div className={cn(
                                        "w-16 h-16 rounded-full flex items-center justify-center",
                                        `bg-${type.color}-100 group-hover:bg-${type.color}-200 transition-colors`
                                    )}>
                                        <Icon className={cn("w-8 h-8", `text-${type.color}-600`)} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-base">{type.label}</h4>
                                        <p className="text-xs text-muted mt-1">
                                            {DOCUMENT_REQUIREMENTS[type.id].name}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        );
    }

    if (stage === 'UPLOAD_DOC') {
        const docReq = DOCUMENT_REQUIREMENTS[selectedType!];
        const selectedTypeInfo = collateralTypes.find(t => t.id === selectedType);

        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <FileText className="w-6 h-6 text-chaiyo-blue" />
                        อัปโหลดเอกสารหลักประกัน
                    </h3>
                    <p className="text-muted text-sm">
                        กรุณาอัปโหลด{docReq.name} ({docReq.description})
                    </p>
                </div>

                {/* Selected Type Badge */}
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-3">
                        {selectedTypeInfo && <selectedTypeInfo.icon className="w-5 h-5 text-chaiyo-blue" />}
                        <div>
                            <p className="text-sm font-bold text-chaiyo-blue">{selectedTypeInfo?.label}</p>
                            <p className="text-xs text-blue-600">ประเภทหลักประกันที่เลือก</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setStage('SELECT_TYPE');
                            setSelectedType(null);
                            setUploadedDocs([]);
                            setOcrComplete(false);
                        }}
                        className="text-chaiyo-blue hover:text-chaiyo-blue/80"
                    >
                        เปลี่ยนประเภท
                    </Button>
                </div>

                {/* Upload Area */}
                {uploadedDocs.length === 0 ? (
                    <div
                        onClick={handleDocumentUpload}
                        className="border-2 border-dashed border-chaiyo-blue/30 bg-blue-50/20 hover:bg-blue-50/50 rounded-3xl p-16 text-center cursor-pointer transition-all duration-300 group flex flex-col items-center justify-center"
                    >
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Upload className="w-10 h-10 text-chaiyo-blue" />
                        </div>
                        <h4 className="text-2xl font-bold text-chaiyo-blue mb-2">คลิกเพื่ออัปโหลด{docReq.name}</h4>
                        <p className="text-muted text-sm max-w-md mx-auto mb-4">
                            {docReq.description}
                        </p>
                        <div className="flex gap-2">
                            <span className="text-xs bg-white px-3 py-1.5 rounded-md border border-gray-200 text-gray-500">.JPG</span>
                            <span className="text-xs bg-white px-3 py-1.5 rounded-md border border-gray-200 text-gray-500">.PNG</span>
                            <span className="text-xs bg-white px-3 py-1.5 rounded-md border border-gray-200 text-gray-500">.PDF</span>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* OCR Processing */}
                        {isProcessingOCR && (
                            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 flex flex-col items-center gap-4">
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
                        )}
                    </div>
                )}
            </div>
        );
    }

    // FILL_INFO stage - render appropriate form based on collateral type
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-chaiyo-blue" />
                        ข้อมูลหลักประกัน
                    </h3>
                    <p className="text-muted text-sm">
                        ตรวจสอบและแก้ไขข้อมูลที่ระบบอ่านได้จากเอกสาร
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Side: Uploaded Document Gallery */}
                <div className="space-y-4 lg:col-span-1">
                    <h4 className="font-bold text-gray-700 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-chaiyo-blue" />
                        เอกสารที่อัปโหลด ({uploadedDocs.length})
                    </h4>

                    <div className="grid grid-cols-3 gap-2">
                        {uploadedDocs.map((doc, index) => (
                            <div
                                key={index}
                                className="group relative aspect-[3/4] cursor-zoom-in rounded-xl overflow-hidden border-2 border-gray-100 hover:border-chaiyo-blue transition-all"
                                onClick={() => setLightboxIndex(index)}
                            >
                                <img
                                    src={doc}
                                    alt={`Document ${index + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <Eye className="w-8 h-8 text-white drop-shadow-md" />
                                </div>
                                <div className="absolute top-2 right-2 bg-green-500/90 text-white p-1 rounded-full shadow-sm">
                                    <Check className="w-3 h-3" />
                                </div>
                            </div>
                        ))}

                        {/* Add More Button */}
                        <div
                            onClick={handleDocumentUpload}
                            className="aspect-[3/4] rounded-xl border-2 border-dashed border-gray-300 hover:border-chaiyo-blue hover:bg-blue-50/50 cursor-pointer flex flex-col items-center justify-center gap-2 transition-all group"
                        >
                            <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                                <Plus className="w-5 h-5 text-gray-500 group-hover:text-chaiyo-blue" />
                            </div>
                            <span className="text-sm font-medium text-gray-500 group-hover:text-chaiyo-blue">เพิ่มรูปภาพ</span>
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-600 flex gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <p>สามารถคลิกที่รูปภาพเพื่อดูขนาดใหญ่ หรือเพิ่มรูปภาพเพิ่มเติมได้</p>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setStage('UPLOAD_DOC');
                            setUploadedDocs([]);
                            setOcrComplete(false);
                        }}
                        className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                        ล้างข้อมูล / เริ่มใหม่ทั้งหมด
                    </Button>
                </div>

                {/* Right Side: Form */}
                <div className="space-y-6 lg:col-span-2">

                    {/* Validation Alert */}
                    {collateralStatus === 'unavailable' && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-4 animate-in fade-in slide-in-from-top-2">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                <X className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-red-700">ไม่สามารถทำรายการต่อได้</h4>
                                <p className="text-sm text-red-600 mt-1">{validationMessage}</p>
                            </div>
                        </div>
                    )}

                    {collateralStatus === 'checking' && (
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center gap-3">
                            <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                            <p className="text-sm text-blue-700">กำลังตรวจสอบสถานะหลักประกัน...</p>
                        </div>
                    )}
                    {/* AI Badge */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-chaiyo-blue to-purple-600 flex items-center justify-center shrink-0">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-chaiyo-blue">ข้อมูลจาก AI OCR</p>
                            <p className="text-xs text-blue-600">ระบบได้อ่านและกรอกข้อมูลอัตโนมัติ กรุณาตรวจสอบความถูกต้อง</p>
                        </div>
                    </div>

                    {/* Render form based on type - Two Column Layout */}
                    {(selectedType === 'car' || selectedType === 'moto' || selectedType === 'truck') && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>ทะเบียนรถ</Label>
                                <Input
                                    value={formData.licensePlate || ''}
                                    onChange={(e) => handleChange('licensePlate', e.target.value)}
                                    className="h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>จังหวัด</Label>
                                <Input
                                    value={formData.province || ''}
                                    onChange={(e) => handleChange('province', e.target.value)}
                                    className="h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>ยี่ห้อ</Label>
                                <Combobox
                                    options={
                                        selectedType === 'moto' ? MOTO_BRANDS :
                                            selectedType === 'truck' ? TRUCK_BRANDS :
                                                CAR_BRANDS
                                    }
                                    value={formData.brand}
                                    onValueChange={(val) => handleChange('brand', val)}
                                    placeholder="เลือกยี่ห้อ..."
                                    searchPlaceholder="ค้นหายี่ห้อ..."
                                    emptyText="ไม่พบยี่ห้อที่ค้นหา"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>รุ่น</Label>
                                <Combobox
                                    options={MODELS_BY_BRAND[formData.brand] || []}
                                    value={formData.model}
                                    onValueChange={(val) => handleChange('model', val)}
                                    placeholder="เลือกรุ่น..."
                                    searchPlaceholder="ค้นหารุ่น..."
                                    emptyText="ไม่พบรุ่นที่ค้นหา"
                                    className={!formData.brand ? "opacity-50 pointer-events-none" : ""}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>ปี</Label>
                                <Combobox
                                    options={YEARS}
                                    value={formData.year}
                                    onValueChange={(val) => handleChange('year', val)}
                                    placeholder="เลือกปี..."
                                    searchPlaceholder="ค้นหาปี..."
                                    emptyText="ไม่พบปีที่ค้นหา"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>สี</Label>
                                <Input
                                    value={formData.color || ''}
                                    onChange={(e) => handleChange('color', e.target.value)}
                                    className="h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>เลขเครื่องยนต์</Label>
                                <Input
                                    value={formData.engineNumber || ''}
                                    onChange={(e) => handleChange('engineNumber', e.target.value)}
                                    className="h-11 font-mono"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>เลขตัวถัง</Label>
                                <Input
                                    value={formData.chassisNumber || ''}
                                    onChange={(e) => handleChange('chassisNumber', e.target.value)}
                                    className="h-11 font-mono"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>สถานะทางกฎหมาย</Label>
                                <Select
                                    value={formData.legalStatus || 'clear'}
                                    onValueChange={(val) => handleChange('legalStatus', val)}
                                >
                                    <SelectTrigger className="h-11">
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
                    )}

                    {selectedType === 'agri' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>ยี่ห้อ</Label>
                                <Combobox
                                    options={AGRI_BRANDS}
                                    value={formData.brand}
                                    onValueChange={(val) => handleChange('brand', val)}
                                    placeholder="เลือกยี่ห้อ..."
                                    searchPlaceholder="ค้นหายี่ห้อ..."
                                    emptyText="ไม่พบยี่ห้อที่ค้นหา"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>รุ่น</Label>
                                <Combobox
                                    options={MODELS_BY_BRAND[formData.brand] || []}
                                    value={formData.model}
                                    onValueChange={(val) => handleChange('model', val)}
                                    placeholder="เลือกรุ่น..."
                                    searchPlaceholder="ค้นหารุ่น..."
                                    emptyText="ไม่พบรุ่นที่ค้นหา"
                                    className={!formData.brand ? "opacity-50 pointer-events-none" : ""}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>ปี</Label>
                                <Combobox
                                    options={YEARS}
                                    value={formData.year}
                                    onValueChange={(val) => handleChange('year', val)}
                                    placeholder="เลือกปี..."
                                    searchPlaceholder="ค้นหาปี..."
                                    emptyText="ไม่พบปีที่ค้นหา"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>หมายเลขเครื่อง/Serial Number</Label>
                                <Input
                                    value={formData.serialNumber || ''}
                                    onChange={(e) => handleChange('serialNumber', e.target.value)}
                                    className="h-11 font-mono"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>สถานะทางกฎหมาย</Label>
                                <Select
                                    value={formData.legalStatus || 'clear'}
                                    onValueChange={(val) => handleChange('legalStatus', val)}
                                >
                                    <SelectTrigger className="h-11">
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
                    )}

                    {selectedType === 'land' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>เลขที่โฉนด</Label>
                                <Input
                                    value={formData.deedNumber || ''}
                                    onChange={(e) => handleChange('deedNumber', e.target.value)}
                                    className="h-11 font-mono"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>เลขที่ดิน</Label>
                                <Input
                                    value={formData.landNumber || ''}
                                    onChange={(e) => handleChange('landNumber', e.target.value)}
                                    className="h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>หน้าสำรวจ</Label>
                                <Input
                                    value={formData.surveyNumber || ''}
                                    onChange={(e) => handleChange('surveyNumber', e.target.value)}
                                    className="h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>ตำบล/แขวง</Label>
                                <Input
                                    value={formData.tambon || ''}
                                    onChange={(e) => handleChange('tambon', e.target.value)}
                                    className="h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>อำเภอ/เขต</Label>
                                <Input
                                    value={formData.amphoe || ''}
                                    onChange={(e) => handleChange('amphoe', e.target.value)}
                                    className="h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>จังหวัด</Label>
                                <Input
                                    value={formData.province || ''}
                                    onChange={(e) => handleChange('province', e.target.value)}
                                    className="h-11"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label>เนื้อที่ (ไร่-งาน-ตารางวา)</Label>
                                <Input
                                    value={formData.area || ''}
                                    onChange={(e) => handleChange('area', e.target.value)}
                                    className="h-11 font-mono"
                                    placeholder="2-0-50"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label>สถานะทางกฎหมาย</Label>
                                <Select
                                    value={formData.legalStatus || 'clear'}
                                    onValueChange={(val) => handleChange('legalStatus', val)}
                                >
                                    <SelectTrigger className="h-11">
                                        <SelectValue placeholder="เลือกสถานะ" />
                                    </SelectTrigger>
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
                    {/* Loan Limit Breakdown */}
                    {selectedType && (
                        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 space-y-4 mt-6">
                            <h4 className="font-bold text-gray-800 flex items-center gap-2 border-b border-gray-200 pb-2">
                                <Sparkles className="w-5 h-5 text-chaiyo-blue" />
                                สรุปวงเงินกู้สูงสุด (Maximum Loan Limit)
                            </h4>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col">
                                        <span className="text-gray-600">ราคาประเมิน (Appraisal Price)</span>
                                        <span className="text-xs text-blue-500 mt-0.5">
                                            {selectedType === 'land' ? '*อ้างอิงจากราคาประเมินราชการ' : '*อ้างอิงจากข้อมูลราคากลาง Redbook'}
                                        </span>
                                    </div>
                                    <span className="font-medium">{formatNumber(formData.aiAppraisal || 0)} บาท</span>
                                </div>

                                <div className="flex justify-between items-center text-green-600">
                                    <span>วงเงินจาก LTV ({selectedType === 'land' ? '70%' : '90%'})</span>
                                    <span className="font-medium">+ {formatNumber((formData.aiAppraisal || 0) * (selectedType === 'land' ? 0.7 : 0.9))} บาท</span>
                                </div>

                                {formData.legalStatus === 'mortgaged' && (
                                    <div className="flex justify-between items-center text-red-500">
                                        <span>หักภาระจำนอง (30%)</span>
                                        <span className="font-medium">- {formatNumber((formData.aiAppraisal || 0) * 0.3)} บาท</span>
                                    </div>
                                )}
                                {(formData.legalStatus === 'pawned' || formData.possessionStatus === 'pawn') && (
                                    <div className="flex justify-between items-center text-red-500">
                                        <span>หักหนี้คงเหลือ (จำนำ)</span>
                                        <span className="font-medium">- {formatNumber(Number(formData.pawnedRemainingDebt) || Number(formData.existingDebt) || 0)} บาท</span>
                                    </div>
                                )}
                                {(formData.legalStatus === 'lease' || formData.possessionStatus === 'finance') && (
                                    <div className="flex justify-between items-center text-red-500">
                                        <span>หักยอดปิดบัญชี (เช่าซื้อ)</span>
                                        <span className="font-medium">- {formatNumber(Number(formData.leasePayoffBalance) || 0)} บาท</span>
                                    </div>
                                )}
                                {(formData.legalStatus === 'seized' || formData.legalStatus === 'legal_case') && (
                                    <div className="flex justify-between items-center text-red-500">
                                        <span>หักภาระทางกฎหมาย (ยึด/ฟ้องร้อง)</span>
                                        <span className="font-medium text-xs">ไม่สามารถอนุมัติได้</span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                                    <span className="font-bold text-lg text-chaiyo-blue">วงเงินสุทธิ (Net Limit)</span>
                                    <span className="font-bold text-2xl text-chaiyo-blue">
                                        {formatNumber(Math.max(0,
                                            ((formData.aiAppraisal || 0) * (selectedType === 'land' ? 0.7 : 0.9)) -
                                            (formData.legalStatus === 'mortgaged' ? ((formData.aiAppraisal || 0) * 0.3) : 0) -
                                            ((formData.legalStatus === 'pawned' || formData.possessionStatus === 'pawn') ? (Number(formData.pawnedRemainingDebt) || Number(formData.existingDebt) || 0) : 0) -
                                            ((formData.legalStatus === 'lease' || formData.possessionStatus === 'finance') ? (Number(formData.leasePayoffBalance) || 0) : 0) -
                                            ((formData.legalStatus === 'seized' || formData.legalStatus === 'legal_case') ? ((formData.aiAppraisal || 0) * 0.9) : 0) // Full deduction
                                        ))} บาท
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Lightbox / Gallery View */}
            {lightboxIndex !== null && (
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
            )}
        </div>
    );
}
