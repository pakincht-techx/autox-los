"use client";

import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { FileText, CheckCircle2, Plus, Info, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { CustomerFormData } from "@/types/application";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { StatusBanner } from "@/components/ui/StatusBanner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/Table";
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogBody,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/Dialog";
import { Checkbox } from "@/components/ui/Checkbox";

interface DocumentUploadStepProps {
    formData: CustomerFormData;
    setFormData: React.Dispatch<React.SetStateAction<CustomerFormData>>;
}

type DocumentDoc = { id: string; name: string; req: boolean };
type DocumentSection = {
    title: string;
    docs: DocumentDoc[];
    isViewOnly?: boolean;
    sourceModule?: string;
    isCustom?: boolean;
};

const documentSections: DocumentSection[] = [
    {
        title: "ยืนยันตัวตน",
        docs: [
            { id: "id_card_borrower", name: "สำเนาบัตรประชาชน ผู้กู้", req: true },
            { id: "id_card_guarantor", name: "สำเนาบัตรประชาชน ผู้ค้ำประกัน", req: false },
            { id: "house_reg_borrower", name: "สำเนาทะเบียนบ้าน ผู้กู้", req: true },
            { id: "house_reg_guarantor", name: "สำเนาทะเบียนบ้าน ผู้ค้ำ", req: false },
            { id: "name_change_borrower", name: "ใบเปลี่ยนชื่อ-นามสกุล ผู้กู้", req: false },
        ]
    },
    {
        title: "รูปถ่ายหลักประกัน",
        isViewOnly: true,
        sourceModule: "รูปถ่ายหลักประกัน",
        docs: [
            { id: "photo_rear_selfie", name: "รูปหลังรถเห็นป้ายทะเบียน พร้อม เซลฟี่-ถือบัตรพนักงาน", req: true },
            { id: "photo_front_hood", name: "รูปหน้ารถ เห็นป้ายทะเบียน / เปิดกระโปงหน้า + เห็นเครื่องยนต์", req: true },
            { id: "photo_front_left45", name: "รูปหน้ารถ - เฉียงซ้าย 45องศา", req: true },
            { id: "photo_front_right45", name: "รูปหน้ารถ - เฉียงขวา 45องศา", req: true },
            { id: "photo_rear_left45", name: "รูปหลังรถ - เฉียงซ้าย 45องศา", req: true },
            { id: "photo_rear_right45", name: "รูปหลังรถ - เฉียงขวา 45องศา", req: true },
            { id: "photo_interior_console", name: "รูปภายในรถ + เห็นคอนโซล + เกียร์รถ", req: true },
            { id: "photo_chassis", name: "รูปเลขตัวถัง/คัสซี", req: true },
            { id: "photo_4wd", name: "รูปเกียร์ 4x4 / 4WD_สำหรับรถกระบะที่ขับเคลื่อน 4ล้อ", req: false },
        ]
    },
    {
        title: "เอกสารตรวจหลักประกัน",
        docs: [
            { id: "reg_book_front", name: "รูปถ่ายเล่มทะเบียน หน้าปก", req: true },
            { id: "reg_book_detail", name: "รูปถ่ายเล่มทะเบียน หน้ารายการจดทะเบียน", req: true },
            { id: "reg_book_center", name: "รูปถ่ายเล่มทะเบียน หน้ากลางเล่ม", req: true },
            { id: "reg_book_tax", name: "รูปถ่ายเล่มทะเบียน หน้ารายการภาษี", req: true },
            { id: "reg_book_officer", name: "รูปถ่ายเล่มทะเบียน หน้าบันทึกเจ้าหน้าที่", req: true },
            { id: "initial_check", name: "ผลเช็คต้น (ตามเงื่อนไข)", req: true },
            { id: "tax_sign", name: "รูปภาพป้ายภาษี", req: true },
            { id: "dlt_web_check", name: "หน้าตรวจสอบการชำระภาษีจากเว็ปกรมการขนส่งทางบก", req: true },
        ]
    },
    {
        title: "พิจารณาอนุมัติสินเชื่อ",
        docs: [
            { id: "bank_account", name: "สำเนาสมุดคู่ฝากธนาคารเพื่อใช้ในการโอนเงิน (บัญชีของลูกค้าเท่านั้น)", req: true },
            { id: "customer_ability", name: "ใบประเมินความสามารถลูกค้า (ผ่าน Branch App)", req: true },
            { id: "house_inspection", name: "แบบฟอร์มตรวจที่พักอาศัย", req: false },
            { id: "abc_email", name: "อีเมลผล ABC", req: false },
        ]
    },
    {
        title: "เอกสารรายได้",
        docs: [
            { id: "income_eval_borrower", name: "แบบฟอร์มประเมินรายได้ ผู้กู้", req: true },
            { id: "income_eval_guarantor", name: "แบบฟอร์มประเมินรายได้ ผู้ค้ำ", req: false },
            { id: "income_doc_borrower", name: "เอกสารรายได้ ของผู้กู้", req: true },
            { id: "income_doc_guarantor", name: "เอกสารรายได้ ของผู้ค้ำ", req: false },
            { id: "field_check_doc", name: "แบบฟอร์มตรวจสอบภาคสนาม และข้อมูลบุคคลอ้างอิง (กรณีไม่มีเอกสารแสดงรายได้)", req: false },
        ]
    },
    {
        title: "เอกสารยืนยันการประกอบอาชีพ",
        docs: [
            { id: "business_photo_borrower", name: "รูปถ่ายกิจการ ของผู้กู้ ", req: true },
            { id: "business_photo_guarantor", name: "รูปถ่ายกิจการ ของผู้ค้ำ ", req: false },
        ]
    },
    {
        title: "เอกสารรีไฟแนนซ์ / ต่อสัญญา",
        docs: [
            { id: "refinance_contract", name: "สัญญาคู่ฉบับไฟแนนซ์เดิม ", req: true },
            { id: "refinance_receipt", name: "ใบเสร็จชำระค่างวด", req: true },
            { id: "refinance_inquiry", name: "ใบสอบถามยอดหนี้ไฟแนนซ์เดิม", req: true },
            { id: "refinance_interest", name: "ใบเรียกเก็บดอกเบี้ยสะสม (เฉพาะลูกค้า Top up ของ AutoX เท่านั้น)", req: false },
        ]
    },
    {
        title: "เอกสารอนุโลม",
        docs: [
            { id: "waiver_onetime", name: "อนุโลม ต่อสัญญา One-Time", req: false },
            { id: "waiver_insurance", name: "อนุโลม ผู้กู้ทำหรือไม่ทำประกัน ( PA Safty Loan) / ประกันภัยรถยนต์", req: false },
        ]
    },
    {
        title: "เอกสารอื่นๆ",
        isCustom: true,
        docs: []
    }
];

export function DocumentUploadStep({ formData, setFormData }: DocumentUploadStepProps) {
    const [uploads, setUploads] = useState<Record<string, number>>({
        // Identity verification
        id_card_borrower: 1,
        id_card_guarantor: 1,
        house_reg_borrower: 1,
        house_reg_guarantor: 1,
        name_change_borrower: 1,
        // Collateral photos
        photo_rear_selfie: 1,
        photo_front_hood: 2,
        photo_front_left45: 1,
        photo_front_right45: 1,
        photo_rear_left45: 2,
        photo_rear_right45: 1,
        photo_interior_console: 3,
        photo_chassis: 1,
        // Loan verification
        reg_book_front: 1,
        reg_book_detail: 1,
        reg_book_center: 1,
        reg_book_tax: 1,
        reg_book_officer: 1,
        initial_check: 1,
        tax_sign: 1,
        dlt_web_check: 1,
        // Loan approval
        bank_account: 1,
        customer_ability: 1,
    });
    const [activeTab, setActiveTab] = useState("0");
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [lightboxPhotos, setLightboxPhotos] = useState<string[]>([]);
    const [customDocs, setCustomDocs] = useState<DocumentDoc[]>([]);
    const [rccoCustomDocs, setRccoCustomDocs] = useState<DocumentDoc[]>([]);
    const [docToDelete, setDocToDelete] = useState<DocumentDoc | null>(null);
    const [docGroupToDelete, setDocGroupToDelete] = useState<'custom' | 'rcco' | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);

    const sections = useMemo(() => {
        return documentSections.map(section => {
            if (section.isCustom) {
                return { ...section, docs: customDocs };
            }
            return section;
        });
    }, [customDocs]);

    const MOCK_CAR_PHOTOS = [
        'https://images.unsplash.com/photo-1554224155-169641357599?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800',
    ];

    const handleViewPhotos = (id: string, count: number) => {
        // Generate mock photos for preview
        const mockPhotos = Array.from({ length: count }).map((_, i) =>
            MOCK_CAR_PHOTOS[i % MOCK_CAR_PHOTOS.length]
        );
        setLightboxPhotos(mockPhotos);
        setLightboxIndex(0);
    };

    const handleUpload = (id: string) => {
        setUploadingDocId(id);
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0 && uploadingDocId) {
            // Simulate upload by adding the count of selected files
            setUploads(prev => ({ 
                ...prev, 
                [uploadingDocId]: (prev[uploadingDocId] || 0) + e.target.files!.length 
            }));
        }
        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setUploadingDocId(null);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                multiple
                onChange={handleFileChange} 
            />

            <div className="flex items-center justify-between">
                <Label className="text-xl font-bold text-gray-900">เอกสารประกอบการสมัคร</Label>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full flex flex-col lg:flex-row gap-8">
                <TabsList className="w-full lg:w-72 flex flex-col h-auto justify-start bg-transparent p-0 flex-shrink-0">
                    <LayoutGroup>
                    {sections.map((section, idx) => {
                        const sectionUploadCount = section.docs.filter(d => (uploads[d.id] || 0) > 0).length;
                        const mandatoryDocs = section.docs.filter(d => d.req);
                        const isCompleted = mandatoryDocs.length > 0 
                            ? mandatoryDocs.every(d => (uploads[d.id] || 0) > 0)
                            : sectionUploadCount > 0;
                        const isActive = activeTab === String(idx);
                        return (
                            <TabsTrigger
                                key={idx}
                                value={String(idx)}
                                className={cn(
                                    "relative w-full justify-start text-left whitespace-normal h-auto px-4 py-3 text-sm rounded-none border-l-[3px] transition-all duration-200 !shadow-none",
                                    isActive
                                        ? "border-l-transparent bg-gradient-to-r from-blue-50 to-blue-50/30 text-chaiyo-blue font-semibold"
                                        : "border-l-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-l-gray-300"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeDocTab"
                                        className="absolute -left-[3px] top-0 bottom-0 w-[3px] bg-chaiyo-blue"
                                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                                    />
                                )}
                                <div className="flex items-start justify-between w-full gap-2">
                                    <span className="leading-snug">{section.title.replace(/^\d+\.\s*/, '')}</span>
                                    {isCompleted && (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    )}
                                </div>
                            </TabsTrigger>
                        );
                    })}
                    </LayoutGroup>
                </TabsList>

                <div className="flex-1 overflow-hidden min-w-0">
                    <AnimatePresence mode="wait">
                    {sections.map((section, idx) => {
                        return (
                            <TabsContent key={idx} value={String(idx)} className="m-0 focus-visible:outline-none" forceMount={activeTab === String(idx) ? true : undefined}>
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                >
                                {section.isViewOnly && section.sourceModule && (
                                    <div className="mb-6">
                                        <StatusBanner
                                            variant="info"
                                            icon={Info}
                                            title={`เอกสารเหล่านี้ถูกอัปโหลดจาก ${section.sourceModule}`}
                                            description={`หากต้องการแก้ไข หรืออัปเดตข้อมูล กรุณาไปที่ ${section.sourceModule}`}
                                        />
                                    </div>
                                )}
                                {(() => {
                                    const mandatoryDocs = section.docs.filter(d => d.req);
                                    const optionalDocs = section.docs.filter(d => !d.req);

                                    const renderDocTable = (title: string, docs: DocumentDoc[], onAddDoc?: () => void, isMandatory: boolean = false, docGroup?: 'custom' | 'rcco') => {
                                        if (docs.length === 0 && !onAddDoc) return null;

                                        return (
                                            <div className="mb-6 last:mb-0">
                                                <div className="flex justify-between items-center mb-3">
                                                    <div className="text-sm font-bold text-gray-700">{title}</div>
                                                    {onAddDoc && (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={onAddDoc}
                                                            className="h-9 gap-1.5 font-medium"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                            เพิ่มเอกสาร
                                                        </Button>
                                                    )}
                                                </div>
                                                <div className="border border-border-strong rounded-xl overflow-hidden bg-white">
                                                    <Table>
                                                        <TableHeader className="bg-gray-50/50">
                                                            <TableRow>
                                                                <TableHead className="text-xs flex-1 min-w-0">
                                                                    ประเภทเอกสาร{isMandatory && <span className="text-red-500 ml-0.5">*</span>}
                                                                </TableHead>
                                                                <TableHead className="text-xs w-32 text-center">ไฟล์ที่อัพโหลด</TableHead>
                                                                {!section.isViewOnly && (
                                                                    <TableHead className="w-40 text-right text-xs">จัดการ</TableHead>
                                                                )}
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {docs.length === 0 ? (
                                                                <TableRow>
                                                                    <TableCell colSpan={section.isViewOnly ? 2 : 3} className="text-center py-8 text-muted-foreground text-sm">
                                                                        ไม่มีเอกสารในรายการนี้
                                                                    </TableCell>
                                                                </TableRow>
                                                            ) : (
                                                                docs.map((doc) => {
                                                                    const fileCount = uploads[doc.id] || 0;
                                                                    const isUploaded = fileCount > 0;
                                                                    return (
                                                                        <TableRow key={doc.id} className="hover:bg-transparent">
                                                                            <TableCell className="py-4 min-w-0">
                                                                                <div className="flex items-center gap-3 min-w-0">
                                                                                    <div className={cn(
                                                                                        "w-8 h-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0",
                                                                                        isUploaded ? "bg-green-50 text-emerald-600" : "bg-gray-100 text-gray-400"
                                                                                    )}>
                                                                                        {isUploaded ? <CheckCircle2 className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                                                                    </div>
                                                                                    {section.isCustom ? (
                                                                                        <Input
                                                                                            value={doc.name}
                                                                                            onChange={(e) => {
                                                                                                setCustomDocs(prev => prev.map(d => d.id === doc.id ? { ...d, name: e.target.value } : d));
                                                                                            }}
                                                                                            className="h-8 text-sm font-medium flex-1 min-w-0"
                                                                                            placeholder="ชื่อเอกสาร"
                                                                                        />
                                                                                    ) : (
                                                                                        <span className="font-medium text-gray-700 text-sm truncate">{doc.name}</span>
                                                                                    )}
                                                                                </div>
                                                                            </TableCell>
                                                                            <TableCell className="text-center py-4">
                                                                                {isUploaded ? (
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => section.isViewOnly ? handleViewPhotos(doc.id, fileCount) : handleUpload(doc.id)}
                                                                                        className={cn(
                                                                                            "inline-flex items-center gap-1.5 text-xs font-medium cursor-pointer whitespace-nowrap",
                                                                                            section.isViewOnly ? "text-chaiyo-blue hover:text-chaiyo-blue no-underline" : "text-chaiyo-blue hover:underline"
                                                                                        )}
                                                                                    >
                                                                                        <FileText className="w-3.5 h-3.5 flex-shrink-0" />
                                                                                        {fileCount} ไฟล์
                                                                                    </button>
                                                                                ) : (
                                                                                    <span className="text-xs text-muted-foreground italic">ยังไม่มีไฟล์</span>
                                                                                )}
                                                                            </TableCell>
                                                                            {!section.isViewOnly && (
                                                                                <TableCell className="text-right py-4">
                                                                                    <div className="flex items-center justify-end gap-1 flex-shrink-0">
                                                                                        {section.isCustom && (
                                                                                            <Button
                                                                                                type="button"
                                                                                                variant="outline"
                                                                                                size="sm"
                                                                                                onClick={() => handleUpload(doc.id)}
                                                                                                className="h-8 text-xs gap-1.5 font-medium whitespace-nowrap"
                                                                                            >
                                                                                                <Plus className="w-3.5 h-3.5 flex-shrink-0" />
                                                                                                เพิ่มเอกสาร
                                                                                            </Button>
                                                                                        )}
                                                                                        {section.isCustom && (
                                                                                            <Button
                                                                                                type="button"
                                                                                                variant="ghost"
                                                                                                size="sm"
                                                                                                onClick={() => {
                                                                                                    setDocToDelete(doc);
                                                                                                    setDocGroupToDelete(docGroup || 'custom');
                                                                                                }}
                                                                                                className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
                                                                                                title="ลบเอกสาร"
                                                                                            >
                                                                                                <Trash2 className="w-4 h-4" />
                                                                                            </Button>
                                                                                        )}
                                                                                    </div>
                                                                                </TableCell>
                                                                            )}
                                                                        </TableRow>
                                                                    );
                                                                })
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </div>
                                        );
                                    };

                                    if (section.isCustom) {
                                        return (
                                            <>
                                                {renderDocTable(
                                                    "รายการเอกสาร",
                                                    optionalDocs,
                                                    () => {
                                                        const newId = `other_${Date.now()}`;
                                                        setCustomDocs(prev => [...prev, { id: newId, name: 'เอกสารอื่นๆ', req: false }]);
                                                    },
                                                    false,
                                                    'custom'
                                                )}
                                                {renderDocTable(
                                                    "รายการเอกสาร จาก RCCO",
                                                    rccoCustomDocs,
                                                    () => {
                                                        const newId = `rcco_${Date.now()}`;
                                                        setRccoCustomDocs(prev => [...prev, { id: newId, name: 'เอกสาร RCCO', req: false }]);
                                                    },
                                                    false,
                                                    'rcco'
                                                )}
                                            </>
                                        );
                                    }
                                    return (
                                        <>
                                            {renderDocTable("เอกสารบังคับ (Mandatory)", mandatoryDocs, undefined, true)}
                                            {renderDocTable("เอกสารทางเลือก (Optional)", optionalDocs, undefined, false)}
                                        </>
                                    );
                                })()}
                                </motion.div>
                            </TabsContent>
                        );
                    })}
                    </AnimatePresence>
                </div>
            </Tabs>

            {/* Photo Lightbox */}
            {lightboxIndex !== null && lightboxPhotos.length > 0 && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 md:p-8 animate-in fade-in duration-200"
                    onClick={() => setLightboxIndex(null)}
                >
                    <button
                        onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
                        className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all border border-white/20"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    {/* Navigation */}
                    {lightboxPhotos.length > 1 && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setLightboxIndex(prev => prev !== null ? (prev - 1 + lightboxPhotos.length) % lightboxPhotos.length : 0);
                                }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10"><path d="m15 18-6-6 6-6" /></svg>
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setLightboxIndex(prev => prev !== null ? (prev + 1) % lightboxPhotos.length : 0);
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10"><path d="m9 18 6-6-6-6" /></svg>
                            </button>
                        </>
                    )}

                    {/* Main Image */}
                    <img
                        src={lightboxPhotos[lightboxIndex ?? 0]}
                        alt={`Document View ${(lightboxIndex ?? 0) + 1}`}
                        className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    />

                    {/* Thumbnail Strip */}
                    <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto pb-2" onClick={(e) => e.stopPropagation()}>
                        {lightboxPhotos.map((url, idx) => (
                            <button
                                key={idx}
                                onClick={(e) => { e.stopPropagation(); setLightboxIndex(idx); }}
                                className={cn(
                                    "w-16 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0",
                                    idx === lightboxIndex ? "border-white scale-110 ring-2 ring-white/20" : "border-transparent opacity-50 hover:opacity-100"
                                )}
                            >
                                <img src={url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>

                    <div className="absolute top-4 left-4 text-white/80 font-medium bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">
                        {(lightboxIndex ?? 0) + 1} / {lightboxPhotos.length}
                    </div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={docToDelete !== null} onOpenChange={(open: boolean) => !open && (setDocToDelete(null), setDocGroupToDelete(null))}>
                <AlertDialogContent onCloseAutoFocus={(e: Event) => e.preventDefault()}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>ยืนยันการลบเอกสาร</AlertDialogTitle>
                        <AlertDialogDescription>
                            คุณต้องการลบข้อมูลนี้ใช่หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (docToDelete) {
                                    if (docGroupToDelete === 'rcco') {
                                        setRccoCustomDocs(prev => prev.filter(d => d.id !== docToDelete.id));
                                    } else {
                                        setCustomDocs(prev => prev.filter(d => d.id !== docToDelete.id));
                                    }
                                    setUploads(prev => {
                                        const next = { ...prev };
                                        delete next[docToDelete.id];
                                        return next;
                                    });
                                }
                                setDocToDelete(null);
                                setDocGroupToDelete(null);
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            ยืนยันการลบ
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </div>
    );
}
