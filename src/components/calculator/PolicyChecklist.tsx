"use client";

import React, { useState } from "react";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/Table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { useSidebar } from "@/components/layout/SidebarContext";

// Policy row types
type PolicyResult = "ผ่าน" | "ไม่ผ่าน" | "ขออนุโลมได้" | null;

interface PolicyRow {
    id: string;
    policy: string;
    customerInfo: string | string[];
    result: PolicyResult;
    badge?: string;
    waiverAuthority?: string;
    branchInfo?: string | string[];
    rcInput?: string | string[];
    branchResult?: PolicyResult;
    rcResult?: PolicyResult;
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
        branchInfo: "22 ปี",
        rcInput: "22 ปี",
        branchResult: "ไม่ผ่าน",
        rcResult: "ไม่ผ่าน",
        customerInfo: "22 ปี",
        result: "ไม่ผ่าน",
        waiverAuthority: "รองประธานเจ้าหน้าที่บริหารสายงานอนุมัติสินเชื่อ หรือ ผู้อำนวยการฝ่ายปฏิบัติการสินเชื่อรายย่อย",
    },
    {
        id: "borrower_age_with_term",
        policy: "อายุผู้กู้รวมระยะเวลาผ่อน",
        branchInfo: "54 ปี",
        rcInput: "54 ปี",
        branchResult: "ผ่าน",
        rcResult: "ผ่าน",
        customerInfo: "54 ปี",
        result: "ผ่าน",
    },
    {
        id: "borrower_occupation",
        policy: "อาชีพ",
        branchInfo: ["อาชีพหลัก: นักการเมือง-กำนัน", "อาชีพเสริม: เกษตรกร"],
        rcInput: ["อาชีพหลัก: สถาปนิก", "อาชีพเสริม: ที่ปรึกษาการเงิน"],
        branchResult: "ไม่ผ่าน",
        rcResult: "ผ่าน",
        customerInfo: ["อาชีพหลัก: นักการเมือง-กำนัน", "อาชีพเสริม: เกษตรกร"],
        result: "ไม่ผ่าน",
        waiverAuthority: "ประธานเจ้าหน้าที่บริหารกลุ่มงานบริหารความเสี่ยง และ ประธานเจ้าหน้าที่บริหารกลุ่มงานผลิตภัณฑ์",
    },
    {
        id: "borrower_income",
        policy: "รายได้ก่อนหักค่าใช้จ่าย",
        branchInfo: "30,000 บาท",
        rcInput: "38,000 บาท",
        branchResult: "ผ่าน",
        rcResult: "ผ่าน",
        customerInfo: "30,000 บาท",
        result: "ผ่าน",
    },
    {
        id: "borrower_residual_income",
        policy: "เงินคงเหลือสุทธิ (Residual Income)",
        branchInfo: "20,000 บาท",
        rcInput: "22,000 บาท",
        branchResult: "ผ่าน",
        rcResult: "ผ่าน",
        customerInfo: "20,000 บาท",
        result: "ผ่าน",
    },
    {
        id: "borrower_iir",
        policy: "IIR",
        branchInfo: "2.4 เท่า",
        rcInput: "2.5 เท่า",
        branchResult: "ผ่าน",
        rcResult: "ผ่าน",
        customerInfo: "2.4 เท่า",
        result: "ผ่าน",
    },
    {
        id: "borrower_dsr",
        policy: "DSR",
        branchInfo: "70.00 %",
        rcInput: "68.00 %",
        branchResult: "ผ่าน",
        rcResult: "ผ่าน",
        customerInfo: "70.00 %",
        result: "ผ่าน",
    },
    {
        id: "borrower_service_area",
        policy: "พื้นที่การให้บริการ",
        branchInfo: "48.00 กิโลเมตร",
        rcInput: "48.00 กิโลเมตร",
        branchResult: "ผ่าน",
        rcResult: "ผ่าน",
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
                branchInfo: "มี",
                rcInput: "มี",
                branchResult: "ผ่าน",
                rcResult: "ผ่าน",
                customerInfo: "มี",
                result: "ผ่าน",
            },
            {
                id: "g1_guarantor_type",
                policy: "ประเภทผู้ค้ำประกัน",
                branchInfo: "เจ้าของกรรมสิทธ์ร่วม",
                rcInput: "เจ้าของกรรมสิทธ์ร่วม",
                branchResult: "ผ่าน",
                rcResult: "ผ่าน",
                customerInfo: "เจ้าของกรรมสิทธ์ร่วม",
                result: "ผ่าน",
            },
            {
                id: "g1_guarantee_type",
                policy: "ประเภทการค้ำประกัน",
                branchInfo: "ค้ำประกันแบบไม่รวมรายได้",
                rcInput: "ค้ำประกันแบบไม่รวมรายได้",
                branchResult: "ผ่าน",
                rcResult: "ผ่าน",
                customerInfo: "ค้ำประกันแบบไม่รวมรายได้",
                result: "ผ่าน",
            },
            {
                id: "g1_age",
                policy: "อายุผู้ค้ำประกัน",
                branchInfo: "60 ปี",
                rcInput: "60 ปี",
                branchResult: null,
                rcResult: null,
                customerInfo: "60 ปี",
                result: null,
            },
            {
                id: "g1_income",
                policy: "รายได้ก่อนหักค่าใช้จ่ายผู้ค้ำประกัน",
                branchInfo: "30,000 บาท",
                rcInput: "32,000 บาท",
                branchResult: "ผ่าน",
                rcResult: "ผ่าน",
                customerInfo: "30,000 บาท",
                result: "ผ่าน",
            },
            {
                id: "g1_residual_income",
                policy: "เงินคงเหลือสุทธิ (Residual Income) ผู้ค้ำประกัน",
                branchInfo: "20,000 บาท",
                rcInput: "21,000 บาท",
                branchResult: "ผ่าน",
                rcResult: "ผ่าน",
                customerInfo: "20,000 บาท",
                result: "ผ่าน",
            },
            {
                id: "g1_iir",
                policy: "IIR ผู้ค้ำประกัน",
                branchInfo: "2.4 เท่า",
                rcInput: "2.5 เท่า",
                branchResult: "ผ่าน",
                rcResult: "ผ่าน",
                customerInfo: "2.4 เท่า",
                result: "ผ่าน",
            },
            {
                id: "g1_dsr",
                policy: "DSR ผู้ค้ำประกัน",
                branchInfo: "70.00 %",
                rcInput: "68.00 %",
                branchResult: "ผ่าน",
                rcResult: "ผ่าน",
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
                branchInfo: "มี",
                rcInput: "มี",
                branchResult: "ผ่าน",
                rcResult: "ผ่าน",
                customerInfo: "มี",
                result: "ผ่าน",
            },
            {
                id: "g2_guarantor_type",
                policy: "ประเภทผู้ค้ำประกัน",
                branchInfo: "ไม่ใช่เจ้าของกรรมสิทธิ์ร่วม",
                rcInput: "ไม่ใช่เจ้าของกรรมสิทธิ์ร่วม",
                branchResult: "ผ่าน",
                rcResult: "ผ่าน",
                customerInfo: "ไม่ใช่เจ้าของกรรมสิทธิ์ร่วม",
                result: "ผ่าน",
            },
            {
                id: "g2_guarantee_type",
                policy: "ประเภทการค้ำประกัน",
                branchInfo: "ค้ำประกันแบบรวมรายได้",
                rcInput: "ค้ำประกันแบบรวมรายได้",
                branchResult: "ผ่าน",
                rcResult: "ผ่าน",
                customerInfo: "ค้ำประกันแบบรวมรายได้",
                result: "ผ่าน",
            },
            {
                id: "g2_age",
                policy: "อายุผู้ค้ำประกัน",
                branchInfo: "45 ปี",
                rcInput: "45 ปี",
                branchResult: "ผ่าน",
                rcResult: "ผ่าน",
                customerInfo: "45 ปี",
                result: "ผ่าน",
            },
            {
                id: "g2_income",
                policy: "รายได้ก่อนหักค่าใช้จ่ายผู้ค้ำประกัน",
                branchInfo: "25,000 บาท",
                rcInput: "26,500 บาท",
                branchResult: "ผ่าน",
                rcResult: "ผ่าน",
                customerInfo: "25,000 บาท",
                result: "ผ่าน",
            },
            {
                id: "g2_residual_income",
                policy: "เงินคงเหลือสุทธิ (Residual Income) ผู้ค้ำประกัน",
                branchInfo: "15,000 บาท",
                rcInput: "16,500 บาท",
                branchResult: "ผ่าน",
                rcResult: "ผ่าน",
                customerInfo: "15,000 บาท",
                result: "ผ่าน",
            },
            {
                id: "g2_iir",
                policy: "IIR ผู้ค้ำประกัน",
                branchInfo: "1.8 เท่า",
                rcInput: "1.9 เท่า",
                branchResult: "ไม่ผ่าน",
                rcResult: "ไม่ผ่าน",
                customerInfo: "1.8 เท่า",
                result: "ไม่ผ่าน",
                waiverAuthority: "รองประธานเจ้าหน้าที่บริหารสายงานอนุมัติสินเชื่อ หรือ ผู้อำนวยการฝ่ายปฏิบัติการสินเชื่อรายย่อย",
            },
            {
                id: "g2_dsr",
                policy: "DSR ผู้ค้ำประกัน",
                branchInfo: "65.00 %",
                rcInput: "63.00 %",
                branchResult: "ผ่าน",
                rcResult: "ผ่าน",
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
                branchInfo: "2.4 เท่า",
                rcInput: "2.5 เท่า",
                branchResult: "ผ่าน",
                rcResult: "ผ่าน",
                customerInfo: "2.4 เท่า",
                result: "ผ่าน",
            },
            {
                id: "bg_dsr",
                policy: "DSR ผู้ค้ำประกัน (กรณีรวมรายได้)",
                branchInfo: "70.00 %",
                rcInput: "68.00 %",
                branchResult: "ผ่าน",
                rcResult: "ผ่าน",
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
                branchInfo: "3 ปี",
                rcInput: "3 ปี",
                branchResult: "ผ่าน",
                rcResult: "ผ่าน",
                customerInfo: "3 ปี",
                result: "ผ่าน",
            },
            {
                id: "col_ownership_duration",
                policy: "ระยะเวลาครอบครองกรรมสิทธ์รถยนต์",
                branchInfo: "90 วัน",
                rcInput: "90 วัน",
                branchResult: "ผ่าน",
                rcResult: "ผ่าน",
                customerInfo: "90 วัน",
                result: "ผ่าน",
            },
            {
                id: "col_ltv",
                policy: "LTV",
                branchInfo: "65 %",
                rcInput: "63 %",
                branchResult: "ผ่าน",
                rcResult: "ผ่าน",
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
                branchInfo: "0 งวด",
                rcInput: "0 งวด",
                branchResult: "ผ่าน",
                rcResult: "ผ่าน",
                customerInfo: "0 งวด",
                result: "ผ่าน",
            },
            {
                id: "loan_installment",
                policy: "ค่างวดกับไฟแนนซ์เดิม",
                branchInfo: "1,500 บาท",
                rcInput: "1,500 บาท",
                branchResult: "ผ่าน",
                rcResult: "ผ่าน",
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
            <TableCell colSpan={5} className="px-4 py-4 text-center">
                <span className="text-sm text-gray-400">รอกำหนด Policy</span>
            </TableCell>
        </TableRow>
    );
}

function SectionHeaderWithColumns() {
    return (
        <TableRow className="bg-gray-50 hover:bg-gray-50 border-t-4 border-gray-50">
            <TableCell className="px-4 py-3.5 text-sm font-bold text-gray-700 w-[18%]">
                เกณฑ์
            </TableCell>
            <TableCell className="px-4 py-3.5 text-sm font-bold text-gray-700 w-[20%]">
                ข้อมูลและผลตรวจสอบสาขา
            </TableCell>
            <TableCell className="px-4 py-3.5 text-sm font-bold text-gray-700 w-[12%]">
            </TableCell>
            <TableCell className="px-4 py-3.5 text-sm font-bold text-gray-700 w-[20%]">
                ข้อมูลและผลตรวจสอบ RCCO
            </TableCell>
            <TableCell className="px-4 py-3.5 text-sm font-bold text-gray-700 w-[12%]">
            </TableCell>
        </TableRow>
    );
}

function PolicyRowsWithColumns({ rows }: { rows: PolicyRow[] }) {
    const renderValue = (value: string | string[]): React.ReactNode => {
        if (Array.isArray(value)) {
            return value.map((line, i) => {
                const colonIdx = line.indexOf(':');
                if (colonIdx > -1) {
                    const label = line.slice(0, colonIdx + 1);
                    const val = line.slice(colonIdx + 1).trim();
                    return (
                        <div key={i} className="flex gap-1">
                            <span className="text-gray-400 font-normal">{label}</span>
                            <span className="text-gray-900 font-semibold">{val}</span>
                        </div>
                    );
                }
                return <div key={i} className="text-gray-900 font-semibold">{line}</div>;
            });
        }
        return <span className="text-gray-900 font-semibold">{value}</span>;
    };

    return (
        <>
            {rows.map((row) => {
                return (
                    <TableRow
                        key={row.id}
                        className="hover:bg-gray-50/50 transition-colors"
                    >
                        <TableCell className="px-4 py-3 text-sm text-gray-500 w-[18%]">
                            {row.policy}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm w-[20%]">
                            {renderValue(row.branchInfo || "")}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm text-center w-[12%]">
                            {row.branchResult && <ResultBadge result={row.branchResult} />}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm w-[20%]">
                            {renderValue(row.rcInput || "")}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm text-center w-[12%]">
                            {row.rcResult && <ResultBadge result={row.rcResult} />}
                        </TableCell>
                    </TableRow>
                );
            })}
        </>
    );
}

// ── Main Component ───────────────────────────────────────

export function PolicyChecklist() {
    const { devRole } = useSidebar();
    const isRCCOChecker = devRole === 'rcco-checker';

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
    const [waiverSubmitted, setWaiverSubmitted] = useState(false);

    // Store waiver info per failed row
    const [waiverData, setWaiverData] = useState<Record<string, {
        branchStatus: string;
        branchReason: string;
        rccoStatus: string;
        rccoReason: string;
        rccoPosition: string;
        rccoAdditionalCriteria: boolean;
    }>>({});

    // Track expanded accordion items
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

    const toggleExpanded = (rowId: string) => {
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(rowId)) {
            newExpanded.delete(rowId);
        } else {
            newExpanded.add(rowId);
        }
        setExpandedItems(newExpanded);
    };

    const updateWaiverData = (rowId: string, field: string, value: string) => {
        setWaiverData(prev => ({
            ...prev,
            [rowId]: {
                ...prev[rowId],
                [field]: value
            }
        }));
    };

    const getWaiverData = (rowId: string) => {
        return waiverData[rowId] || {
            branchStatus: "",
            branchReason: "",
            rccoStatus: "",
            rccoReason: "",
            rccoPosition: "",
            rccoAdditionalCriteria: false
        };
    };

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
                                {STANDARD_SECTIONS.map((section) => {
                                    const hasVerificationColumns = section.rows.length > 0 && section.rows[0].branchInfo;
                                    return (
                                        <React.Fragment key={section.id}>
                                            {hasVerificationColumns ? (
                                                <>
                                                    <SectionHeaderWithColumns />
                                                    <PolicyRowsWithColumns rows={section.rows} />
                                                </>
                                            ) : (
                                                <>
                                                    <SectionHeader label={section.label} note={section.note} />
                                                    {section.rows.length > 0 ? (
                                                        <PolicyRows rows={section.rows} />
                                                    ) : (
                                                        <PlaceholderRow />
                                                    )}
                                                </>
                                            )}
                                        </React.Fragment>
                                    );
                                })}

                                {/* 2. ข้อมูลผู้ค้ำประกัน — repeats per guarantor */}
                                {GUARANTORS.length > 0 ? (
                                    GUARANTORS.map((guarantor, index) => {
                                        const hasVerificationColumns = guarantor.rows.length > 0 && guarantor.rows[0].branchInfo;
                                        return (
                                            <React.Fragment key={`guarantor-${index}`}>
                                                {hasVerificationColumns ? (
                                                    <>
                                                        <TableRow className="bg-gray-50 hover:bg-gray-50 border-t-4 border-gray-50">
                                                            <TableCell colSpan={5} className="px-4 py-3.5">
                                                                <span className="text-sm font-bold text-gray-700">
                                                                    ข้อมูลผู้ค้ำประกัน คนที่ {index + 1} - {guarantor.name}
                                                                </span>
                                                            </TableCell>
                                                        </TableRow>
                                                        <SectionHeaderWithColumns />
                                                        <PolicyRowsWithColumns rows={guarantor.rows} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <SectionHeader
                                                            label={`ข้อมูลผู้ค้ำประกัน คนที่ ${index + 1} - ${guarantor.name}`}
                                                        />
                                                        <PolicyRows rows={guarantor.rows} />
                                                    </>
                                                )}
                                            </React.Fragment>
                                        );
                                    })
                                ) : (
                                    <>
                                        <SectionHeader label="ข้อมูลผู้ค้ำประกัน" note="สามารถมีได้หลายคน" />
                                        <PlaceholderRow />
                                    </>
                                )}

                                {/* 3-5. Remaining sections */}
                                {AFTER_GUARANTOR_SECTIONS.map((section) => {
                                    const hasVerificationColumns = section.rows.length > 0 && section.rows[0].branchInfo;
                                    return (
                                        <React.Fragment key={section.id}>
                                            {hasVerificationColumns ? (
                                                <>
                                                    <TableRow className="bg-gray-50 hover:bg-gray-50 border-t-4 border-gray-50">
                                                        <TableCell colSpan={4} className="px-4 py-3.5">
                                                            <span className="text-sm font-bold text-gray-700">
                                                                {section.label}
                                                            </span>
                                                            {section.note && (
                                                                <span className="text-xs text-gray-400 ml-2">
                                                                    ({section.note})
                                                                </span>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                    <SectionHeaderWithColumns />
                                                    {section.rows.length > 0 ? (
                                                        <PolicyRowsWithColumns rows={section.rows} />
                                                    ) : (
                                                        <PlaceholderRow />
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    <SectionHeader label={section.label} note={section.note} />
                                                    {section.rows.length > 0 ? (
                                                        <PolicyRows rows={section.rows} />
                                                    ) : (
                                                        <PlaceholderRow />
                                                    )}
                                                </>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
                )}
            </Card>

            <Dialog open={isFailedDialogOpen} onOpenChange={setIsFailedDialogOpen}>
                <DialogContent size="lg" className="flex flex-col max-h-[90vh]">
                    <DialogHeader className="flex-shrink-0 border-b border-border-strong pb-4">
                        <DialogTitle className="text-gray-900">ขออนุโลม</DialogTitle>
                        <DialogDescription>พิจารณาแต่ละรายการและระบุเหตุผลการขออนุโลม</DialogDescription>
                    </DialogHeader>
                    <DialogBody className="flex-1 overflow-y-auto">
                        <div className="space-y-3 pb-2 pt-1">
                            {/* Accordion for each failed item */}
                            {failedRows.map((row) => {
                                const data = getWaiverData(row.id);
                                const isExpanded = expandedItems.has(row.id);

                                return (
                                    <div
                                        key={row.id}
                                        className="border border-gray-200 rounded-lg overflow-hidden bg-white"
                                    >
                                        {/* Accordion Header */}
                                        <button
                                            onClick={() => toggleExpanded(row.id)}
                                            className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100"
                                        >
                                            <div className="flex items-center gap-3 text-left flex-1">
                                                <ChevronDown
                                                    className={cn(
                                                        "w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0",
                                                        isExpanded && "rotate-180"
                                                    )}
                                                />
                                                <div className="flex-1">
                                                    <div className="text-sm font-semibold text-gray-900">
                                                        {row.policy}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-0.5">
                                                        {Array.isArray(row.customerInfo)
                                                            ? row.customerInfo.join(' • ')
                                                            : row.customerInfo}
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge variant="danger" className="flex-shrink-0">
                                                ไม่ผ่าน
                                            </Badge>
                                        </button>

                                        {/* Accordion Body */}
                                        {isExpanded && (
                                            <div className="px-4 py-4 bg-gray-50/50 space-y-4 animate-in fade-in duration-300">
                                                {/* Waiver Authority */}
                                                {row.waiverAuthority && (
                                                    <div className="p-3 bg-blue-50 rounded border border-blue-100">
                                                        <div className="text-xs font-semibold text-blue-900 mb-1">
                                                            อำนาจอนุโลม
                                                        </div>
                                                        <div className="text-sm text-blue-800">
                                                            {row.waiverAuthority}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Branch Staff Waiver Section */}
                                                <div className="p-3 bg-blue-50 rounded border border-blue-200 space-y-3">
                                                    <div className="font-semibold text-sm text-blue-900">
                                                        ข้อมูลการขออนุโลมจากสาขา
                                                    </div>

                                                    <RadioGroup
                                                        value={data.branchStatus}
                                                        onValueChange={(value) =>
                                                            isRCCOChecker
                                                                ? null
                                                                : updateWaiverData(row.id, "branchStatus", value)
                                                        }
                                                        className="flex gap-6"
                                                        disabled={isRCCOChecker}
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem
                                                                value="ขออนุโลม"
                                                                id={`branch-yes-${row.id}`}
                                                                disabled={isRCCOChecker}
                                                            />
                                                            <Label
                                                                htmlFor={`branch-yes-${row.id}`}
                                                                className={`font-normal cursor-pointer text-sm ${
                                                                    isRCCOChecker
                                                                        ? "text-gray-400"
                                                                        : ""
                                                                }`}
                                                            >
                                                                ขออนุโลม
                                                            </Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem
                                                                value="ไม่ขออนุโลม"
                                                                id={`branch-no-${row.id}`}
                                                                disabled={isRCCOChecker}
                                                            />
                                                            <Label
                                                                htmlFor={`branch-no-${row.id}`}
                                                                className={`font-normal cursor-pointer text-sm ${
                                                                    isRCCOChecker
                                                                        ? "text-gray-400"
                                                                        : ""
                                                                }`}
                                                            >
                                                                ไม่ขออนุโลม
                                                            </Label>
                                                        </div>
                                                    </RadioGroup>

                                                    {data.branchStatus === "ขออนุโลม" && (
                                                        <div className="space-y-2 animate-in fade-in duration-300">
                                                            <Label className="text-sm font-semibold text-gray-900">
                                                                เหตุผลที่ขออนุโลม{" "}
                                                                <span className="text-red-500">*</span>
                                                            </Label>
                                                            <Textarea
                                                                placeholder="กรอกเหตุผลที่ขออนุโลม..."
                                                                value={data.branchReason}
                                                                onChange={(e) =>
                                                                    isRCCOChecker
                                                                        ? null
                                                                        : updateWaiverData(
                                                                              row.id,
                                                                              "branchReason",
                                                                              e.target.value
                                                                          )
                                                                }
                                                                disabled={isRCCOChecker}
                                                                className={`min-h-[80px] bg-white border-gray-200 text-sm ${
                                                                    isRCCOChecker
                                                                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                                                        : ""
                                                                }`}
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* RCCO Checker Waiver Section */}
                                                {isRCCOChecker && (
                                                    <div className="p-3 bg-amber-50 rounded border border-amber-200 space-y-3">
                                                        <div className="font-semibold text-sm text-amber-900">
                                                            ข้อมูลการขออนุโลมจาก RCCO Checker
                                                        </div>

                                                        <RadioGroup
                                                            value={data.rccoStatus}
                                                            onValueChange={(value) =>
                                                                updateWaiverData(row.id, "rccoStatus", value)
                                                            }
                                                            className="flex gap-6"
                                                        >
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem
                                                                    value="ขออนุโลม"
                                                                    id={`rcco-yes-${row.id}`}
                                                                />
                                                                <Label
                                                                    htmlFor={`rcco-yes-${row.id}`}
                                                                    className="font-normal cursor-pointer text-sm"
                                                                >
                                                                    ขออนุโลม
                                                                </Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem
                                                                    value="ไม่ขออนุโลม"
                                                                    id={`rcco-no-${row.id}`}
                                                                />
                                                                <Label
                                                                    htmlFor={`rcco-no-${row.id}`}
                                                                    className="font-normal cursor-pointer text-sm"
                                                                >
                                                                    ไม่ขออนุโลม
                                                                </Label>
                                                            </div>
                                                        </RadioGroup>

                                                        {data.rccoStatus === "ขออนุโลม" && (
                                                            <div className="space-y-3 animate-in fade-in duration-300">
                                                                <div className="space-y-2">
                                                                    <Label className="text-sm font-semibold text-gray-900">
                                                                        เหตุผลที่ขออนุโลม{" "}
                                                                        <span className="text-red-500">*</span>
                                                                    </Label>
                                                                    <Textarea
                                                                        placeholder="กรอกเหตุผลที่ขออนุโลม..."
                                                                        value={data.rccoReason}
                                                                        onChange={(e) =>
                                                                            updateWaiverData(
                                                                                row.id,
                                                                                "rccoReason",
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        className="min-h-[80px] bg-white border-gray-200 text-sm"
                                                                    />
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <Label className="text-sm font-semibold text-gray-900">
                                                                        ระบุตำแหน่งขออนุโลม{" "}
                                                                        <span className="text-red-500">*</span>
                                                                    </Label>
                                                                    <Select
                                                                        value={data.rccoPosition}
                                                                        onValueChange={(value) =>
                                                                            updateWaiverData(row.id, "rccoPosition", value)
                                                                        }
                                                                    >
                                                                        <SelectTrigger className="bg-white">
                                                                            <SelectValue placeholder="เลือกตำแหน่งขออนุโลม" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="ผู้บริหารระดับสูง">ผู้บริหารระดับสูง</SelectItem>
                                                                            <SelectItem value="ผู้บริหารระดับกลาง">ผู้บริหารระดับกลาง</SelectItem>
                                                                            <SelectItem value="หัวหน้าฝ่าย">หัวหน้าฝ่าย</SelectItem>
                                                                            <SelectItem value="เจ้าหน้าที่อื่นๆ">เจ้าหน้าที่อื่นๆ</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>

                                                                <div className="flex items-center space-x-2 p-2 bg-white rounded border border-gray-200">
                                                                    <Checkbox
                                                                        id={`criteria-${row.id}`}
                                                                        checked={data.rccoAdditionalCriteria}
                                                                        onCheckedChange={(checked) => {
                                                                            setWaiverData(prev => ({
                                                                                ...prev,
                                                                                [row.id]: {
                                                                                    ...prev[row.id],
                                                                                    rccoAdditionalCriteria: checked as boolean
                                                                                }
                                                                            }));
                                                                        }}
                                                                    />
                                                                    <Label
                                                                        htmlFor={`criteria-${row.id}`}
                                                                        className="font-normal cursor-pointer text-sm text-gray-900"
                                                                    >
                                                                        มีหลักเกณฑ์นอกเหนือ
                                                                    </Label>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </DialogBody>
                    <DialogFooter className="flex-shrink-0 border-t border-border-strong pt-4 mt-4">
                        <Button
                            variant="outline"
                            className="min-w-[120px] font-bold shadow-none"
                            onClick={() => setIsFailedDialogOpen(false)}
                        >
                            ปิด
                        </Button>
                        <Button
                            className="min-w-[120px] font-bold shadow-none bg-chaiyo-blue hover:bg-chaiyo-blue/90 text-white"
                            disabled={failedRows.length === 0}
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
