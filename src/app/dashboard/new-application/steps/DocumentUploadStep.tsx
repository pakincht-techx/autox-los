"use client";

import { useState } from "react";
import { FileText, CheckCircle, Upload, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Checkbox } from "@/components/ui/Checkbox";
import { cn } from "@/lib/utils";

interface DocumentUploadStepProps {
    formData: any;
    setFormData: (data: any) => void;
}

const getRequiredDocs = (collateralType: string) => {
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

    const requiredDocs = getRequiredDocs(formData.collateralType || 'car');

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2">


            <div className="space-y-4">
                {requiredDocs.map((doc) => (
                    <div
                        key={doc.id}
                        className={cn(
                            "flex items-center justify-between p-6 rounded-[1.5rem] border transition-all duration-300",
                            uploads[doc.id]
                                ? "bg-emerald-50/50 border-emerald-200 shadow-sm"
                                : "bg-white border-border-subtle hover:border-chaiyo-blue/30 hover:shadow-md hover:shadow-gray-200/50"
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                                uploads[doc.id] ? "bg-emerald-100 text-emerald-600" : "bg-gray-100/80 text-gray-500/80"
                            )}>
                                <FileText className="w-7 h-7" />
                            </div>
                            <div className="space-y-1">
                                <h4 className={cn("text-base font-bold", uploads[doc.id] ? "text-emerald-900" : "text-foreground")}>
                                    {doc.name}
                                </h4>
                                {doc.req && !uploads[doc.id] && (
                                    <span className="text-[10px] bg-red-50 text-red-600 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border border-red-100">
                                        จำเป็น
                                    </span>
                                )}
                            </div>
                        </div>

                        {uploads[doc.id] ? (
                            <div className="flex items-center gap-2 text-emerald-600">
                                <span className="text-sm font-medium">แนบไฟล์แล้ว</span>
                                <CheckCircle className="w-5 h-5" />
                                <Button variant="ghost" size="sm" className="h-8 text-xs text-muted hover:text-red-500" onClick={() => setUploads(prev => ({ ...prev, [doc.id]: false }))}>
                                    ลบ
                                </Button>
                            </div>
                        ) : (
                            <Button variant="outline" size="sm" onClick={() => handleUpload(doc.id)}>
                                <Upload className="w-4 h-4 mr-2" /> อัปโหลด
                            </Button>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex items-center space-x-3 p-4 border border-blue-100 rounded-xl bg-blue-50/50 mt-6">
                <Checkbox
                    id="requireNCB"
                    checked={formData.requireNCB || false}
                    onCheckedChange={(checked) => setFormData((prev: any) => ({ ...prev, requireNCB: checked }))}
                    className="border-chaiyo-blue data-[state=checked]:bg-chaiyo-blue data-[state=checked]:text-white"
                />
                <div className="grid gap-1.5 leading-none">
                    <label
                        htmlFor="requireNCB"
                        className="text-sm font-bold text-chaiyo-blue cursor-pointer"
                    >
                        ตรวจสอบเครดิตบูโร (NCB)
                    </label>
                    <p className="text-xs text-muted-foreground">
                        หากเลือก การขอความยินยอมเปิดเผยข้อมูลเครดิต (NCB Consent) จะถูกเพิ่มในขั้นตอนการตรวจสอบ
                    </p>
                </div>
            </div>


        </div>
    );
}


