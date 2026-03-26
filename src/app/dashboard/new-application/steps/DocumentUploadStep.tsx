"use client";

import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { FileText, CheckCircle2, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { cn } from "@/lib/utils";
import { CustomerFormData } from "@/types/application";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/Table";

interface DocumentUploadStepProps {
    formData: CustomerFormData;
    setFormData: React.Dispatch<React.SetStateAction<CustomerFormData>>;
}

const documentSections = [
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
    }
];

export function DocumentUploadStep({ formData, setFormData }: DocumentUploadStepProps) {
    const [uploads, setUploads] = useState<Record<string, boolean>>({});
    const [activeTab, setActiveTab] = useState("0");

    const handleUpload = (id: string) => {
        // Simulate upload
        setUploads(prev => ({ ...prev, [id]: true }));
    };

    const uploadedCount = Object.values(uploads).filter(Boolean).length;
    const totalDocsCount = documentSections.reduce((acc, curr) => acc + curr.docs.length, 0);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">

            <div className="flex items-center justify-between">
                <Label className="text-xl font-bold text-gray-900">เอกสารประกอบการสมัคร ({uploadedCount}/{totalDocsCount} ไฟล์)</Label>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full flex flex-col lg:flex-row gap-8">
                <TabsList className="w-full lg:w-72 flex flex-col h-auto justify-start bg-transparent p-0 flex-shrink-0">
                    <LayoutGroup>
                    {documentSections.map((section, idx) => {
                        const sectionUploadCount = section.docs.filter(d => uploads[d.id]).length;
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
                                    <span className="text-xs text-muted-foreground whitespace-nowrap mt-0.5">
                                        {sectionUploadCount}/{section.docs.length}
                                    </span>
                                </div>
                            </TabsTrigger>
                        );
                    })}
                    </LayoutGroup>
                </TabsList>

                <div className="flex-1 overflow-hidden min-w-0">
                    <AnimatePresence mode="wait">
                    {documentSections.map((section, idx) => {
                        return (
                            <TabsContent key={idx} value={String(idx)} className="m-0 focus-visible:outline-none" forceMount={activeTab === String(idx) ? true : undefined}>
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                >
                                <div className="border border-border-strong rounded-xl overflow-hidden bg-white">
                                    <Table className="table-fixed">
                                        <TableHeader className="bg-gray-50/50">
                                            <TableRow>
                                                <TableHead className="w-[400px] text-xs">ประเภทเอกสาร</TableHead>
                                                <TableHead className="text-xs">ไฟล์ที่อัพโหลด</TableHead>
                                                <TableHead className="w-[120px] text-right text-xs">จัดการ</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {section.docs.map((doc) => {
                                                const isUploaded = uploads[doc.id];
                                                return (
                                                    <TableRow key={doc.id} className="hover:bg-transparent">
                                                        <TableCell className="py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className={cn(
                                                                    "w-8 h-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0",
                                                                    isUploaded ? "bg-green-50 text-emerald-600" : "bg-gray-100 text-gray-400"
                                                                )}>
                                                                    {isUploaded ? <CheckCircle2 className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-medium text-gray-700 text-sm">{doc.name}</span>
                                                                    {doc.req && <span className="text-red-500 text-sm">*</span>}
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {isUploaded ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleUpload(doc.id)}
                                                                    className="flex items-center gap-1.5 text-xs text-chaiyo-blue font-medium hover:underline cursor-pointer"
                                                                >
                                                                    <FileText className="w-3.5 h-3.5" />
                                                                    1 ไฟล์
                                                                </button>
                                                            ) : (
                                                                <span className="text-xs text-muted-foreground italic">ยังไม่มีไฟล์</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex items-center justify-end gap-1">
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleUpload(doc.id)}
                                                                    className="h-8 text-xs gap-1.5 font-medium"
                                                                >
                                                                    <Plus className="w-3.5 h-3.5" />
                                                                    เพิ่มเอกสาร
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                                </motion.div>
                            </TabsContent>
                        );
                    })}
                    </AnimatePresence>
                </div>
            </Tabs>
        </div>
    );
}
