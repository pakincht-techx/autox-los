"use client";

import { useState } from "react";
import { FileText, CheckCircle2, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { cn } from "@/lib/utils";
import { CustomerFormData } from "@/types/application";
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

const getRequiredDocs = () => {
    // Phase 2: Only strictly personal/KYC documents here. 
    // Collateral docs moved to CollateralPhotoStep.
    return [
        { id: "id_card", name: "สำเนาบัตรประจำตัวประชาชน", req: true },
        { id: "house_reg", name: "สำเนาทะเบียนบ้าน", req: false }, // Optional example
        { id: "bank_statement", name: "Statement ย้อนหลัง 6 เดือน", req: false },
    ];
};

export function DocumentUploadStep({ formData, setFormData }: DocumentUploadStepProps) {
    const [uploads, setUploads] = useState<Record<string, boolean>>({});

    const handleUpload = (id: string) => {
        // Simulate upload
        setUploads(prev => ({ ...prev, [id]: true }));
    };

    const requiredDocs = getRequiredDocs();
    const uploadedCount = Object.values(uploads).filter(Boolean).length;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2">

            <div className="space-y-3">
                <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-bold text-gray-700">เอกสารประกอบการสมัคร ({uploadedCount}/{requiredDocs.length} ไฟล์)</Label>
                </div>
                <div className="border border-border-strong rounded-xl overflow-hidden bg-white">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow>
                                <TableHead className="w-[45%] text-xs">ประเภทเอกสาร</TableHead>
                                <TableHead className="w-[40%] text-xs">ไฟล์ที่อัพโหลด</TableHead>
                                <TableHead className="w-[15%] text-right text-xs">จัดการ</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {requiredDocs.map((doc) => {
                                const isUploaded = uploads[doc.id];
                                return (
                                    <TableRow key={doc.id} className="hover:bg-transparent">
                                        <TableCell className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                                                    isUploaded ? "bg-green-50 text-emerald-600" : "bg-gray-100 text-gray-400"
                                                )}>
                                                    {isUploaded ? <CheckCircle2 className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-gray-700 text-sm whitespace-nowrap">{doc.name}</span>
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
            </div>

        </div>
    );
}
