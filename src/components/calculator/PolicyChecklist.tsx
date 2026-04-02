"use client";

import React, { useState } from "react";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";

// Policy row types
type PolicyResult = "ผ่าน" | "ไม่ผ่าน" | "ขออนุโลมได้" | null;

interface PolicyRow {
    id: string;
    policy: string;
    customerInfo: string | string[];
    result: PolicyResult;
    badge?: string;
    waiverAuthority?: string;
}

interface PolicySection {
    id: string;
    label: string;
    note?: string;
    rows: PolicyRow[];
}

// Guarantor data structure — supports multiple guarantors
interface Guarantor {
    name: string;
    rows: PolicyRow[];
}

// ── Mock Data ────────────────────────────────────────────

const BORROWER_ROWS: PolicyRow[] = [
    {
        id: "borrower_age",
        policy: "อายุผู้กู้",
        customerInfo: "22 ปี",
        result: "ไม่ผ่าน",
        waiverAuthority: "รองประธานเจ้าหน้าที่บริหารสายงานอนุมัติสินเชื่อ หรือ ผู้อำนวยการฝ่ายปฏิบัติการสินเชื่อรายย่อย",
    },
    {
        id: "borrower_age_with_term",
        policy: "อายุผู้กู้รวมระยะเวลาผ่อน",
        customerInfo: "54 ปี",
        result: "ผ่าน",
    },
    {
        id: "borrower_occupation",
        policy: "อาชีพ",
        customerInfo: ["อาชีพหลัก: นักการเมือง-กำนัน", "อาชีพเสริม: เกษตรกร"],
        result: "ไม่ผ่าน",
        waiverAuthority: "ประธานเจ้าหน้าที่บริหารกลุ่มงานบริหารความเสี่ยง และ ประธานเจ้าหน้าที่บริหารกลุ่มงานผลิตภัณฑ์",
    },
    {
        id: "borrower_income",
        policy: "รายได้ก่อนหักค่าใช้จ่าย",
        customerInfo: "30,000 บาท",
        result: "ผ่าน",
    },
    {
        id: "borrower_residual_income",
        policy: "เงินคงเหลือสุทธิ (Residual Income)",
        customerInfo: "20,000 บาท",
        result: "ผ่าน",
    },
    {
        id: "borrower_iir",
        policy: "IIR",
        customerInfo: "2.4 เท่า",
        result: "ผ่าน",
    },
    {
        id: "borrower_dsr",
        policy: "DSR",
        customerInfo: "70.00 %",
        result: "ผ่าน",
    },
    {
        id: "borrower_service_area",
        policy: "พื้นที่การให้บริการ",
        customerInfo: "48.00 กิโลเมตร",
        result: "ผ่าน",
    },
];

// Mock guarantor data — array supports multiple guarantors
const GUARANTORS: Guarantor[] = [
    {
        name: "นายสมศักดิ์ รักดี",
        rows: [
            {
                id: "g1_has_guarantor",
                policy: "มีผู้ค้ำประกัน",
                customerInfo: "มี",
                result: "ผ่าน",
            },
            {
                id: "g1_guarantor_type",
                policy: "ประเภทผู้ค้ำประกัน",
                customerInfo: "เจ้าของกรรมสิทธ์ร่วม",
                result: "ผ่าน",
            },
            {
                id: "g1_guarantee_type",
                policy: "ประเภทการค้ำประกัน",
                customerInfo: "ค้ำประกันแบบไม่รวมรายได้",
                result: "ผ่าน",
            },
            {
                id: "g1_age",
                policy: "อายุผู้ค้ำประกัน",
                customerInfo: "60 ปี",
                result: null,
            },
            {
                id: "g1_income",
                policy: "รายได้ก่อนหักค่าใช้จ่ายผู้ค้ำประกัน",
                customerInfo: "30,000 บาท",
                result: "ผ่าน",
            },
            {
                id: "g1_residual_income",
                policy: "เงินคงเหลือสุทธิ (Residual Income) ผู้ค้ำประกัน",
                customerInfo: "20,000 บาท",
                result: "ผ่าน",
            },
            {
                id: "g1_iir",
                policy: "IIR ผู้ค้ำประกัน",
                customerInfo: "2.4 เท่า",
                result: "ผ่าน",
            },
            {
                id: "g1_dsr",
                policy: "DSR ผู้ค้ำประกัน",
                customerInfo: "70.00 %",
                result: "ผ่าน",
            },
        ],
    },
    {
        name: "นางสาวสุดา ใจงาม",
        rows: [
            {
                id: "g2_has_guarantor",
                policy: "มีผู้ค้ำประกัน",
                customerInfo: "มี",
                result: "ผ่าน",
            },
            {
                id: "g2_guarantor_type",
                policy: "ประเภทผู้ค้ำประกัน",
                customerInfo: "ไม่ใช่เจ้าของกรรมสิทธิ์ร่วม",
                result: "ผ่าน",
            },
            {
                id: "g2_guarantee_type",
                policy: "ประเภทการค้ำประกัน",
                customerInfo: "ค้ำประกันแบบรวมรายได้",
                result: "ผ่าน",
            },
            {
                id: "g2_age",
                policy: "อายุผู้ค้ำประกัน",
                customerInfo: "45 ปี",
                result: "ผ่าน",
            },
            {
                id: "g2_income",
                policy: "รายได้ก่อนหักค่าใช้จ่ายผู้ค้ำประกัน",
                customerInfo: "25,000 บาท",
                result: "ผ่าน",
            },
            {
                id: "g2_residual_income",
                policy: "เงินคงเหลือสุทธิ (Residual Income) ผู้ค้ำประกัน",
                customerInfo: "15,000 บาท",
                result: "ผ่าน",
            },
            {
                id: "g2_iir",
                policy: "IIR ผู้ค้ำประกัน",
                customerInfo: "1.8 เท่า",
                result: "ไม่ผ่าน",
                waiverAuthority: "รองประธานเจ้าหน้าที่บริหารสายงานอนุมัติสินเชื่อ หรือ ผู้อำนวยการฝ่ายปฏิบัติการสินเชื่อรายย่อย",
            },
            {
                id: "g2_dsr",
                policy: "DSR ผู้ค้ำประกัน",
                customerInfo: "65.00 %",
                result: "ผ่าน",
            },
        ],
    },
];

// Standard (non-guarantor) sections
const STANDARD_SECTIONS: PolicySection[] = [
    {
        id: "project",
        label: "ข้อมูลโครงการ",
        rows: [
            {
                id: "project_name",
                policy: "ชื่อโครงการ",
                customerInfo: "test program",
                result: null,
            }
        ]
    },
    {
        id: "borrower",
        label: "ข้อมูลผู้กู้",
        rows: BORROWER_ROWS,
    },
];

const AFTER_GUARANTOR_SECTIONS: PolicySection[] = [
    {
        id: "borrower_guarantor",
        label: "รวมผู้กู้และผู้ค้ำทุกราย",
        rows: [
            {
                id: "bg_iir",
                policy: "IIR (กรณีรวมรายได้)",
                customerInfo: "2.4 เท่า",
                result: "ผ่าน",
            },
            {
                id: "bg_dsr",
                policy: "DSR ผู้ค้ำประกัน (กรณีรวมรายได้)",
                customerInfo: "70.00 %",
                result: "ผ่าน",
            },
        ],
    },
    {
        id: "collateral",
        label: "ข้อมูลหลักประกัน",
        rows: [
            {
                id: "col_car_age",
                policy: "อายุรถ",
                customerInfo: "3 ปี",
                result: "ผ่าน",
            },
            {
                id: "col_ownership_duration",
                policy: "ระยะเวลาครอบครองกรรมสิทธ์รถยนต์",
                customerInfo: "90 วัน",
                result: "ผ่าน",
            },
            {
                id: "col_ltv",
                policy: "LTV",
                customerInfo: "65 %",
                result: "ผ่าน",
            },
        ],
    },
    {
        id: "loan",
        label: "ข้อมูลสินเชื่อเดิม (กรณีรีไฟแนนซ์)",
        rows: [
            {
                id: "loan_account_status",
                policy: "สถานะบัญชี ณ วันขอสินเชื่อ",
                customerInfo: "0 งวด",
                result: "ผ่าน",
            },
            {
                id: "loan_installment",
                policy: "ค่างวดกับไฟแนนซ์เดิม",
                customerInfo: "1,500 บาท",
                result: "ผ่าน",
            },
        ],
    },
];

// ── Sub-components ───────────────────────────────────────

function ResultBadge({ result }: { result: PolicyResult }) {
    if (result === null) return <span className="text-xs text-gray-400">-</span>;
    const variant = result === "ผ่าน" ? "success" : result === "ขออนุโลมได้" ? "warning" : "danger";
    return (
        <Badge variant={variant}>
            {result}
        </Badge>
    );
}

function PolicyRows({ rows }: { rows: PolicyRow[] }) {
    return (
        <>
            {rows.map((row) => (
                    <TableRow
                        key={row.id}
                        className="hover:bg-gray-50/50 transition-colors"
                    >
                        <TableCell className="px-4 py-3 text-sm text-gray-500">
                            {row.policy}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm text-gray-900 font-semibold">
                            <div className="flex items-center gap-2">
                            {Array.isArray(row.customerInfo) ? (
                                <div className="flex flex-col gap-1">
                                    {row.customerInfo.map((line, i) => {
                                        const colonIdx = line.indexOf(':');
                                        if (colonIdx > -1) {
                                            const label = line.slice(0, colonIdx + 1);
                                            const value = line.slice(colonIdx + 1).trim();
                                            return (
                                                <span key={i}>
                                                    <span className="text-gray-400 font-normal">{label}</span>{' '}
                                                    <span className="font-semibold text-gray-900">{value}</span>
                                                </span>
                                            );
                                        }
                                        return <span key={i}>{line}</span>;
                                    })}
                                </div>
                            ) : (
                                row.customerInfo
                            )}
                            {row.badge && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200">
                                    {row.badge}
                                </span>
                            )}
                            </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-center">
                            <ResultBadge result={row.result} />
                        </TableCell>
                    </TableRow>
            ))}
        </>
    );
}

function SectionHeader({ label, note }: { label: string; note?: string }) {
    return (
        <TableRow className="bg-gray-50 hover:bg-gray-50 border-t-4 border-gray-50">
            <TableCell colSpan={3} className="px-4 py-3.5">
                <span className="text-sm font-bold text-gray-700">
                    {label}
                </span>
                {note && (
                    <span className="text-xs text-gray-400 ml-2">
                        ({note})
                    </span>
                )}
            </TableCell>
        </TableRow>
    );
}

function PlaceholderRow() {
    return (
        <TableRow className="hover:bg-gray-50/50 transition-colors">
            <TableCell colSpan={3} className="px-4 py-4 text-center">
                <span className="text-sm text-gray-400">รอกำหนด Policy</span>
            </TableCell>
        </TableRow>
    );
}

// ── Main Component ───────────────────────────────────────

export function PolicyChecklist() {

    // Compute overall status
    const allRows: PolicyRow[] = [
        ...STANDARD_SECTIONS.flatMap(s => s.rows),
        ...GUARANTORS.flatMap(g => g.rows),
        ...AFTER_GUARANTOR_SECTIONS.flatMap(s => s.rows),
    ];
    const rowsWithResult = allRows.filter(r => r.result !== null);
    const failedRows = rowsWithResult.filter(r => r.result === "ไม่ผ่าน");
    const hasNotPassed = failedRows.length > 0;
    const hasException = rowsWithResult.some(r => r.result === "ขออนุโลมได้");
    const overallStatus = hasNotPassed ? "ไม่ผ่าน" : hasException ? "ขออนุโลมได้" : "ผ่าน";
    const overallVariant = hasNotPassed ? "danger" : hasException ? "warning" : "success";

    const [isOpen, setIsOpen] = useState(false);
    const [isFailedDialogOpen, setIsFailedDialogOpen] = useState(false);
    const [waiverStatus, setWaiverStatus] = useState<string>("");
    const [waiverReason, setWaiverReason] = useState("");
    const [waiverSubmitted, setWaiverSubmitted] = useState(false);

    return (
        <>
            <Card className="border-border-strong overflow-hidden animate-in fade-in duration-500">
                <CardHeader
                    className="bg-blue-50/50 border-b border-border-strong pb-4 cursor-pointer select-none"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CardTitle className="text-lg flex items-center gap-2 text-chaiyo-blue">
                                Policy Checklist
                            </CardTitle>
                            <Badge variant={overallVariant}>
                                {overallStatus}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                                <Button 
                                    size="sm" 
                                    className={cn(
                                        "h-7 text-xs px-3 shadow-none font-bold",
                                        waiverSubmitted 
                                            ? "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50" 
                                            : "bg-chaiyo-blue hover:bg-chaiyo-blue/90 text-white"
                                    )}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsFailedDialogOpen(true);
                                    }}
                                >
                                    {waiverSubmitted ? "ดูเหตุผลการขออนุโลม" : "ขออนุโลม"}
                                </Button>
                            <ChevronDown className={cn("w-5 h-5 text-gray-400 transition-transform duration-200", isOpen && "rotate-180")} />
                        </div>
                    </div>
                </CardHeader>
                {isOpen && (
                <CardContent className="p-0">
                    <div className="overflow-hidden bg-white ">
                        <Table>

                            <TableBody>
                                {/* 1. ข้อมูลผู้กู้ */}
                                {STANDARD_SECTIONS.map((section) => (
                                    <React.Fragment key={section.id}>
                                        <SectionHeader label={section.label} note={section.note} />
                                        {section.rows.length > 0 ? (
                                            <PolicyRows rows={section.rows} />
                                        ) : (
                                            <PlaceholderRow />
                                        )}
                                    </React.Fragment>
                                ))}

                                {/* 2. ข้อมูลผู้ค้ำประกัน — repeats per guarantor */}
                                {GUARANTORS.length > 0 ? (
                                    GUARANTORS.map((guarantor, index) => (
                                        <React.Fragment key={`guarantor-${index}`}>
                                            <SectionHeader
                                                label={`ข้อมูลผู้ค้ำประกัน คนที่ ${index + 1} - ${guarantor.name}`}
                                            />
                                            <PolicyRows rows={guarantor.rows} />
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <>
                                        <SectionHeader label="ข้อมูลผู้ค้ำประกัน" note="สามารถมีได้หลายคน" />
                                        <PlaceholderRow />
                                    </>
                                )}

                                {/* 3-5. Remaining sections */}
                                {AFTER_GUARANTOR_SECTIONS.map((section) => (
                                    <React.Fragment key={section.id}>
                                        <SectionHeader label={section.label} note={section.note} />
                                        {section.rows.length > 0 ? (
                                            <PolicyRows rows={section.rows} />
                                        ) : (
                                            <PlaceholderRow />
                                        )}
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
                )}
            </Card>

            <Dialog open={isFailedDialogOpen} onOpenChange={setIsFailedDialogOpen}>
                <DialogContent size="lg">
                    <DialogHeader>
                        <DialogTitle className="text-gray-900">ขออนุโลม</DialogTitle>
                        <DialogDescription>กรุณาระบุเหตุผลประกอบการพิจารณาให้สำนักงานใหญ่ เพื่ออธิบายว่าถึงแม้ลูกค้าไม่ผ่านเกณฑ์ที่กำหนด แต่มีเหตุผลสมควรที่จะอนุมัติได้</DialogDescription>
                    </DialogHeader>
                    <DialogBody>
                        <div className="space-y-6 pb-2 pt-1">
                            {/* Table List */}
                            <div className="border border-border-strong rounded-xl overflow-hidden bg-white">
                                <Table>
                                    <TableHeader className="bg-gray-50/50">
                                        <TableRow>
                                            <TableHead className="w-[25%] text-xs">รายการ</TableHead>
                                            <TableHead className="w-[25%] text-xs">ข้อมูลลูกค้า</TableHead>
                                            <TableHead className="w-[35%] text-xs">อำนาจอนุโลม</TableHead>
                                            <TableHead className="w-[15%] text-xs text-center">สถานะ</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {failedRows.map((row, idx) => (
                                            <TableRow key={idx} className="hover:bg-gray-50/50 transition-colors">
                                                <TableCell className="text-sm font-medium">{row.policy}</TableCell>
                                                <TableCell className="text-sm text-gray-600">
                                                    {Array.isArray(row.customerInfo) ? row.customerInfo.join(', ') : row.customerInfo}
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-600">
                                                    {row.waiverAuthority || '-'}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="danger">ไม่ผ่าน</Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Waiver Options */}
                            <div className="space-y-4">
                                <Label className="text-sm font-bold text-gray-900">การขออนุโลม <span className="text-red-500">*</span></Label>
                                <RadioGroup value={waiverStatus} onValueChange={setWaiverStatus} className="flex gap-6">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="ขออนุโลม" id="waiver-yes" />
                                        <Label htmlFor="waiver-yes" className="font-normal cursor-pointer text-sm">ขออนุโลม</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="ไม่ขออนุโลม" id="waiver-no" />
                                        <Label htmlFor="waiver-no" className="font-normal cursor-pointer text-sm">ไม่ขออนุโลม</Label>
                                    </div>
                                </RadioGroup>

                                {waiverStatus === "ขออนุโลม" && (
                                    <div className="space-y-2 animate-in fade-in duration-300">
                                        <Label className="text-sm font-bold text-gray-900">เหตุผลที่ขออนุโลม <span className="text-red-500">*</span></Label>
                                        <Textarea
                                            placeholder="กรอกเหตุผลที่ขออนุโลม..."
                                            value={waiverReason}
                                            onChange={(e) => setWaiverReason(e.target.value)}
                                            className="min-h-[100px] bg-white border-gray-200"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </DialogBody>
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            className="min-w-[120px] font-bold shadow-none" 
                            onClick={() => setIsFailedDialogOpen(false)}
                        >
                            ปิด
                        </Button>
                        <Button
                            className="min-w-[120px] font-bold shadow-none bg-chaiyo-blue hover:bg-chaiyo-blue/90 text-white"
                            disabled={!waiverStatus || (waiverStatus === "ขออนุโลม" && !waiverReason.trim())}
                            onClick={() => {
                                setWaiverSubmitted(true);
                                setIsFailedDialogOpen(false);
                            }}
                        >
                            บันทึก
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
