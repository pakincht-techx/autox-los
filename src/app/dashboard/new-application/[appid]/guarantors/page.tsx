"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApplication } from "../../context/ApplicationContext";

import { Button } from "@/components/ui/Button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/Table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/Dialog";
import { Plus, Pencil, Trash2, Users, ShieldCheck, AlertTriangle, ShieldAlert, Clock, ChevronLeft } from "lucide-react";
import { Guarantor } from "@/types/application";
import { toast } from "sonner";

// ─── Status Helpers ──────────────────────────────────────────────────────────

type GuarantorStatus = 'PASSED' | 'WATCHLIST' | 'NOT_PASSED' | 'PENDING';

const getGuarantorStatusConfig = (status?: string): {
    label: string;
    icon: React.ReactNode;
    className: string;
} => {
    switch (status) {
        case 'PASSED':
            return {
                label: 'ผ่านการตรวจสอบ',
                icon: <ShieldCheck className="w-3.5 h-3.5" />,
                className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            };
        case 'WATCHLIST':
            return {
                label: 'รอตรวจสอบเพิ่มเติม',
                icon: <AlertTriangle className="w-3.5 h-3.5" />,
                className: 'bg-amber-50 text-amber-700 border-amber-200',
            };
        case 'NOT_PASSED':
            return {
                label: 'ไม่ผ่านการตรวจสอบ',
                icon: <ShieldAlert className="w-3.5 h-3.5" />,
                className: 'bg-red-50 text-red-600 border-red-200',
            };
        default:
            return {
                label: 'รอตรวจสอบ',
                icon: <Clock className="w-3.5 h-3.5" />,
                className: 'bg-gray-50 text-gray-500 border-gray-200',
            };
    }
};

// ─── Mock Guarantors ─────────────────────────────────────────────────────────

const MOCK_GUARANTORS: Guarantor[] = [
    {
        relationship: "พี่น้อง",
        idNumber: "1-1234-56789-01-2",
        firstName: "สมหญิง",
        lastName: "ใจดี",
        prefix: "นาง",
        birthDate: "15/06/2530",
        phone: "089-123-4567",
        verificationStatus: "PASSED",
    },
    {
        relationship: "คู่สมรส",
        idNumber: "3-4567-89012-34-5",
        firstName: "สมศักดิ์",
        lastName: "มั่งมี",
        prefix: "นาย",
        birthDate: "22/11/2525",
        phone: "081-987-6543",
        verificationStatus: "WATCHLIST",
        watchlistReasons: ["01", "06"],
    },
    {
        relationship: "บิดา",
        idNumber: "1-9876-54321-09-8",
        firstName: "สมบูรณ์",
        lastName: "ใจดี",
        prefix: "นาย",
        birthDate: "03/02/2500",
        phone: "086-555-1234",
        verificationStatus: "WATCHLIST",
        watchlistReasons: ["02"],
    },
];

// ─── Page Component ──────────────────────────────────────────────────────────

export default function GuarantorsPage() {
    const router = useRouter();
    const { formData, appId, setSaveOverride } = useApplication();
    const [softBlockDialogOpen, setSoftBlockDialogOpen] = useState(false);
    const [softBlockGuarantors, setSoftBlockGuarantors] = useState<Guarantor[]>([]);

    // Use formData guarantors if available, else mock data for demo
    const guarantors: Guarantor[] =
        formData.guarantors && formData.guarantors.length > 0
            ? formData.guarantors
            : MOCK_GUARANTORS;

    // Register custom save handler — checks for soft-blocked guarantors
    useEffect(() => {
        setSaveOverride(() => {
            const watchlistGuarantors = guarantors.filter(
                (g) => g.verificationStatus === 'WATCHLIST'
            );

            if (watchlistGuarantors.length > 0) {
                setSoftBlockGuarantors(watchlistGuarantors);
                setSoftBlockDialogOpen(true);
            } else {
                toast.success("บันทึกข้อมูลสำเร็จ", {
                    description: "ข้อมูลผู้ค้ำประกันถูกบันทึกเรียบร้อยแล้ว",
                    duration: 2000,
                });
                setTimeout(() => {
                    router.push(`/dashboard/applications/${appId || 'draft'}`);
                }, 500);
            }
        });
        return () => setSaveOverride(null);
    }, [setSaveOverride, guarantors]);

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-foreground">
                            ผู้ค้ำประกัน
                        </h2>
                        <p className="text-sm text-gray-400 mt-1">
                            จัดการข้อมูลผู้ค้ำประกันสำหรับใบสมัครนี้
                        </p>
                    </div>
                    <Button

                        variant="outline"
                        onClick={() => {
                            router.push(`/dashboard/new-application/${appId}/guarantors/add`);
                        }}
                    >
                        <Plus className="w-4 h-4 mr-1.5" />
                        เพิ่มผู้ค้ำประกัน
                    </Button>
                </div>

                {/* Table */}
                {guarantors.length > 0 ? (
                    <div className="border border-border-strong rounded-xl overflow-hidden bg-white">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[60px] text-center">ลำดับ</TableHead>
                                    <TableHead>ชื่อ-นามสกุล</TableHead>
                                    <TableHead>ความสัมพันธ์</TableHead>
                                    <TableHead>สถานะ</TableHead>
                                    <TableHead className="w-[100px] text-center">จัดการ</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {guarantors.map((g, index) => {
                                    const statusConfig = getGuarantorStatusConfig(g.verificationStatus);
                                    return (
                                        <TableRow key={index} className="hover:bg-gray-50/50 transition-colors">
                                            <TableCell className="text-center text-sm text-gray-500 font-medium">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">

                                                    <div>
                                                        <p className="text-sm font-semibold text-foreground">
                                                            {[g.prefix, g.firstName, g.lastName].filter(Boolean).join(" ")}
                                                        </p>

                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                                    {g.relationship || "-"}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusConfig.className}`}>
                                                    {statusConfig.icon}
                                                    {statusConfig.label}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button
                                                        className="p-1.5 rounded-lg text-gray-400 hover:text-chaiyo-blue hover:bg-blue-50 transition-colors"
                                                        onClick={() => {
                                                            // TODO: Edit guarantor
                                                        }}
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                        onClick={() => {
                                                            // TODO: Delete guarantor
                                                        }}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    /* Empty State */
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                            <Users className="w-8 h-8 text-gray-300" />
                        </div>
                        <p className="text-base font-semibold text-gray-400">ยังไม่มีผู้ค้ำประกัน</p>
                        <p className="text-sm text-gray-300 mt-1">กดปุ่ม "เพิ่มผู้ค้ำประกัน" เพื่อเริ่มเพิ่มข้อมูล</p>
                    </div>
                )}
            </div>

            {/* Soft-Block Warning Dialog */}
            <Dialog open={softBlockDialogOpen} onOpenChange={setSoftBlockDialogOpen}>
                <DialogContent className="sm:max-w-[480px] rounded-[2rem] p-8">
                    <DialogHeader className="flex flex-col items-center text-center space-y-4">
                        <div className="h-16 w-16 flex items-center justify-center rounded-full bg-amber-50 shrink-0">
                            <AlertTriangle className="h-10 w-10 text-amber-600" />
                        </div>
                        <div className="space-y-2 flex flex-col items-center">
                            <DialogTitle className="text-xl font-bold text-gray-900">
                                ผู้ค้ำประกันต้องตรวจสอบเพิ่มเติม
                            </DialogTitle>
                            <DialogDescription className="text-base text-gray-500 text-center">
                                ผู้ค้ำประกันด้านล่างนี้อยู่ในสถานะรอตรวจสอบ จะต้องผ่านการพิจารณาจากทีม Legal ก่อนอนุมัติ
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    {/* List of soft-blocked guarantors */}
                    <div className="space-y-3 my-4">
                        {softBlockGuarantors.map((g, i) => (
                            <div
                                key={i}
                                className="p-3 bg-amber-50 border border-amber-100 rounded-xl space-y-2"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-amber-900">
                                            {[g.prefix, g.firstName, g.lastName].filter(Boolean).join(" ")}
                                        </p>
                                        <p className="text-xs text-amber-700/70 mt-0.5">
                                            {g.relationship} · {g.idNumber}
                                        </p>
                                    </div>
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200 shrink-0">
                                        <AlertTriangle className="w-3 h-3" />
                                        รอตรวจสอบ
                                    </span>
                                </div>
                                {/* Reason Codes */}
                                {g.watchlistReasons && g.watchlistReasons.length > 0 && (
                                    <div className="flex items-center gap-1.5 pl-11 flex-wrap">
                                        {g.watchlistReasons.map((code: string) => (
                                            <span key={code} className="text-[10px] font-bold text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full">
                                                รหัส {code}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Button
                            variant="outline"
                            onClick={() => setSoftBlockDialogOpen(false)}
                            className="flex-1 font-bold"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1.5" />
                            กลับไปแก้ไข
                        </Button>
                        <Button
                            onClick={() => {
                                setSoftBlockDialogOpen(false);
                                toast.success("บันทึกข้อมูลสำเร็จ", {
                                    description: "ข้อมูลผู้ค้ำประกันถูกบันทึกเรียบร้อย ผู้ค้ำประกันที่รอตรวจสอบจะถูกส่งให้ทีม Legal พิจารณา",
                                    duration: 3000,
                                });
                                setTimeout(() => {
                                    router.push(`/dashboard/applications/${appId || 'draft'}`);
                                }, 500);
                            }}
                            className="flex-[2] font-bold bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-200 text-white"
                        >
                            รับทราบและบันทึก
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

