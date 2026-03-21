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
import { Plus, Users, CircleCheck, AlertTriangle, ChevronLeft, Circle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Guarantor } from "@/types/application";
import { toast } from "sonner";
import { MandatoryFieldWarningDialog } from "../../components/MandatoryFieldWarningDialog";

// ─── Completion Status Helper ────────────────────────────────────────────────

const REQUIRED_FIELDS: (keyof Guarantor)[] = ['firstName', 'lastName', 'phone', 'birthDate', 'relationship'];

const getCompletionStatus = (g: Guarantor): {
    isComplete: boolean;
    label: string;
    icon: React.ReactNode;
    variant: 'success' | 'neutral';
} => {
    const isComplete = REQUIRED_FIELDS.every(field => !!g[field]);
    return isComplete
        ? {
            isComplete: true,
            label: 'ข้อมูลครบถ้วน',
            icon: <CircleCheck className="w-3.5 h-3.5" />,
            variant: 'success',
        }
        : {
            isComplete: false,
            label: 'ข้อมูลไม่ครบ',
            icon: <Circle className="w-3.5 h-3.5" />,
            variant: 'neutral',
        };
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
        phone: undefined,
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
    const [mandatoryWarningOpen, setMandatoryWarningOpen] = useState(false);

    // Use formData guarantors if available, else mock data for demo
    const guarantors: Guarantor[] =
        formData.guarantors && formData.guarantors.length > 0
            ? formData.guarantors
            : MOCK_GUARANTORS;

    // Register custom save handler — checks for mandatory fields and soft-blocked guarantors
    useEffect(() => {
        setSaveOverride(() => {
            // Check mandatory: at least one guarantor must exist
            if (guarantors.length === 0 || !guarantors[0]?.firstName) {
                setMandatoryWarningOpen(true);
                return;
            }

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
                                    <TableHead>สถานะข้อมูล</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {guarantors.map((g, index) => {
                                    const completionStatus = getCompletionStatus(g);
                                    return (
                                        <TableRow key={index} className="hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => router.push(`/dashboard/new-application/${appId}/guarantors/${index + 1}`)}>
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
                                                <Badge variant={completionStatus.variant} className="gap-1.5">
                                                    {completionStatus.icon}
                                                    {completionStatus.label}
                                                </Badge>
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
                        <p className="text-sm text-gray-300 mt-1">กดปุ่ม "เพิ่มผู้ค้ำประกัน" เพื่อเพิ่มข้อมูล</p>
                    </div>
                )}
            </div>

            {/* Soft-Block Warning Dialog */}
            <Dialog open={softBlockDialogOpen} onOpenChange={setSoftBlockDialogOpen}>
                <DialogContent>
                    <DialogHeader className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-amber-50 shrink-0">
                                <AlertTriangle className="h-5 w-5 text-amber-600" />
                            </div>
                            <DialogTitle>
                                ผู้ค้ำประกันต้องตรวจสอบเพิ่มเติม
                            </DialogTitle>
                        </div>
                        <DialogDescription>
                            ผู้ค้ำประกันด้านล่างนี้อยู่ในสถานะรอตรวจสอบ จะต้องผ่านการพิจารณาจากทีม Legal ก่อนอนุมัติ
                        </DialogDescription>
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

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setSoftBlockDialogOpen(false)}
                            className="min-w-[104px]"
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
                            className="flex-[2] bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-200 text-white"
                        >
                            รับทราบและบันทึก
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Mandatory Field Warning Dialog */}
            <MandatoryFieldWarningDialog
                open={mandatoryWarningOpen}
                onOpenChange={setMandatoryWarningOpen}
                onSaveAndExit={() => {
                    setMandatoryWarningOpen(false);
                    toast.success("บันทึกข้อมูลสำเร็จ", {
                        description: "ข้อมูลผู้ค้ำประกันถูกบันทึกเรียบร้อยแล้ว",
                        duration: 2000,
                    });
                    setTimeout(() => {
                        router.push(`/dashboard/applications/${appId || 'draft'}`);
                    }, 500);
                }}
                onCancel={() => setMandatoryWarningOpen(false)}
            />
        </>
    );
}

