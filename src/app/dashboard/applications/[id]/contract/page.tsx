"use client";
import { getMockApp } from "@/lib/mockApplications";

import React, { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSidebar } from "@/components/layout/SidebarContext";
import { Button } from "@/components/ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Copy, Download, Eye, FileSignature, Upload, FileText, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
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

const ADDITIONAL_CONTRACTS = [
    { id: "DOC-24891-INS", name: "กรมธรรม์ประกันภัยรถยนต์" },
    { id: "DOC-24892-CHY", name: "เอกสารรับบัตรไชโย" },
    { id: "DOC-24893-COL", name: "เอกสารประเมินหลักทรัพย์" },
    { id: "DOC-24894-LGL", name: "ใบมอบอำนาจและเอกสารโอนสิทธิ์" },
    { id: "DOC-24895-BNK", name: "แบบฟอร์มการหักบัญชีผ่านธนาคาร" },
];

export default function ContractPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const router = useRouter();
    const searchParams = useSearchParams();
    const isSigned = searchParams.get('signed') === 'true';
    const { setBreadcrumbs, setHideNavButtons, setHideSaveDraftButton, setOnBack, setRightContent } = useSidebar();

    const [uploads, setUploads] = useState<Record<string, number>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);
    const [docToDelete, setDocToDelete] = useState<string | null>(null);

    const handleUpload = (docId: string) => {
        setUploadingDocId(docId);
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0 && uploadingDocId) {
            setUploads(prev => ({
                ...prev,
                [uploadingDocId]: 1
            }));
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setUploadingDocId(null);
    };
    
    // Derived appNo abbreviation
    useEffect(() => {
        const app = getMockApp(null, id);
        const appNoPrefix = app.applicationNo ? app.applicationNo.slice(8) : `${id.substring(0, 4)}...${id.slice(-4)}`.toUpperCase();
        const firstName = app.applicantName ? app.applicantName.split(' ')[0] : '';
        const appNoShort = `${appNoPrefix}${firstName ? ` (${firstName})` : ''}`;

        setBreadcrumbs([
            { label: appNoShort, href: `/dashboard/applications/${id}` },
            { label: "สัญญาทั้งหมด", isActive: true },
        ]);
        setOnBack(() => () => router.back());
        setHideNavButtons(false);
        setHideSaveDraftButton(false);
        setRightContent(
            <Button size="sm" onClick={() => {
                // Mock save and back
                router.back();
            }}>
                บันทึกและย้อนกลับ
            </Button>
        );

        return () => {
            setBreadcrumbs([]);
            setHideNavButtons(false);
            setHideSaveDraftButton(false);
            setOnBack(null);
            setRightContent(null);
        };
    }, [id, setBreadcrumbs, setHideNavButtons, setHideSaveDraftButton, setOnBack, setRightContent, router]);

    return (
        <div className="bg-white min-h-[calc(100vh-64px)]">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
            />
            <div className="max-w-5xl mx-auto p-6 space-y-8">
                <h1 className="text-xl font-bold text-gray-900">สัญญาทั้งหมด</h1>

                <div className="space-y-8">
                    {/* E-Contract Section */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-700">e-Contract</h3>
                        <div className="border border-border-strong rounded-xl overflow-hidden bg-white">
                            <Table>
                                <TableHeader className="bg-gray-50/80">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="w-[80px] text-center">ลำดับ</TableHead>
                                        <TableHead>เลขที่สัญญา</TableHead>
                                        <TableHead>ประเภทสัญญา</TableHead>
                                        <TableHead className="text-center">สถานะผู้กู้</TableHead>
                                        <TableHead className="text-right"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow className="border-b border-border-subtle hover:bg-gray-50/50">
                                        <TableCell className="text-center text-gray-500">1</TableCell>
                                        <TableCell className="font-medium text-gray-800">
                                            CON-APP-0001
                                        </TableCell>
                                        <TableCell>สัญญาสินเชื่อหลัก (Contract)</TableCell>
                                        <TableCell className="text-center">
                                            {isSigned ? (
                                                <Badge variant="success">
                                                    เสร็จสมบูรณ์
                                                </Badge>
                                            ) : (
                                                <Badge variant="neutral">
                                                    รอดำเนินการ
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {isSigned ? (
                                                <Button variant="outline" size="sm">
                                                    ดูรายละเอียด
                                                </Button>
                                            ) : (
                                                <Button size="sm" onClick={() => router.push(`/dashboard/applications/${id}/contract/e-contract`)}>
                                                    ดำเนินการลงนาม
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* Paper Contracts Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-gray-700">สัญญาเพิ่มเติม</h3>
                            <Button variant="outline" size="sm">
                                <Download className="w-4 h-4 mr-2" /> ดาวน์โหลดสัญญาทั้งหมด
                            </Button>
                        </div>
                        <div className="border border-border-strong rounded-xl overflow-hidden bg-white">
                            <Table>
                                <TableHeader className="bg-gray-50/80">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="w-[80px] text-center">ลำดับ</TableHead>
                                        <TableHead>เลขที่อ้างอิง</TableHead>
                                        <TableHead>เอกสาร</TableHead>
                                        <TableHead className="text-center w-32">ไฟล์อัปโหลด</TableHead>
                                        <TableHead className="text-right"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {ADDITIONAL_CONTRACTS.map((doc, index) => {
                                        const fileCount = uploads[doc.id] || 0;
                                        const isUploaded = fileCount > 0;
                                        
                                        return (
                                            <TableRow key={doc.id} className="border-b last:border-b-0 border-border-subtle hover:bg-gray-50/50">
                                                <TableCell className="text-center text-gray-500">{index + 1}</TableCell>
                                                <TableCell className="font-medium text-gray-800">
                                                    {doc.id}
                                                </TableCell>
                                                <TableCell>{doc.name}</TableCell>
                                                <TableCell className="text-center">
                                                    {isUploaded ? (
                                                        <div className="flex items-center justify-center gap-1.5 text-sm font-medium text-chaiyo-blue cursor-pointer hover:underline">
                                                            <FileText className="w-4 h-4" />
                                                            {fileCount} ไฟล์
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-500 text-sm">0 ไฟล์</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {isUploaded ? (
                                                        <Button variant="ghost" size="icon" onClick={() => setDocToDelete(doc.id)} className="rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50">
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    ) : (
                                                        <Button variant="outline" size="sm" onClick={() => handleUpload(doc.id)}>
                                                            <Upload className="w-4 h-4 mr-2" /> อัปโหลด
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={docToDelete !== null} onOpenChange={(open: boolean) => !open && setDocToDelete(null)}>
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
                                    setUploads(prev => {
                                        const next = { ...prev };
                                        delete next[docToDelete];
                                        return next;
                                    });
                                }
                                setDocToDelete(null);
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
