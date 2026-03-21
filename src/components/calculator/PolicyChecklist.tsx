"use client";

import React from "react";

import { ClipboardCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";

// Policy row types
type PolicyResult = "ผ่าน" | "ไม่ผ่าน" | null;

interface PolicyRow {
    id: string;
    policy: string;
    customerInfo: string | string[];
    result: PolicyResult;
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
        result: null,
    },
    {
        id: "borrower_iir",
        policy: "IIR",
        customerInfo: "2.4 เท่า",
        result: null,
    },
    {
        id: "borrower_dsr",
        policy: "DSR",
        customerInfo: "70.00 %",
        result: null,
    },
    {
        id: "borrower_service_area",
        policy: "พื้นที่การให้บริการ",
        customerInfo: "48.00 กิโลเมตร",
        result: null,
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
                customerInfo: "บุคคลทั่วไป",
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
        label: "ข้อมูลสินเชื่อ",
        rows: [
            {
                id: "loan_objective",
                policy: "วัตถุประสงค์การขอสินเชื่อ",
                customerInfo: "เพื่อประกอบอาชีพ",
                result: "ผ่าน",
            },
            {
                id: "loan_amount",
                policy: "วงเงินกู้",
                customerInfo: "200,000 บาท",
                result: "ผ่าน",
            },
            {
                id: "loan_account_status",
                policy: "สถานะบัญชี ณ วันขอสินเชื่อ",
                customerInfo: "0 งวด",
                result: "ผ่าน",
            },
            {
                id: "loan_installment",
                policy: "ค่างวด",
                customerInfo: "1,500 บาท",
                result: "ผ่าน",
            },
        ],
    },
];

// ── Sub-components ───────────────────────────────────────

function ResultBadge({ result }: { result: PolicyResult }) {
    if (result === null) return <span className="text-xs text-gray-400">-</span>;
    return (
        <Badge variant={result === "ผ่าน" ? "success" : "danger"}>
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

    // Compute passed / total
    const allRows: PolicyRow[] = [
        ...STANDARD_SECTIONS.flatMap(s => s.rows),
        ...GUARANTORS.flatMap(g => g.rows),
        ...AFTER_GUARANTOR_SECTIONS.flatMap(s => s.rows),
    ];
    const rowsWithResult = allRows.filter(r => r.result !== null);
    const passedCount = rowsWithResult.filter(r => r.result === "ผ่าน").length;
    const totalCount = rowsWithResult.length;
    const allPassed = passedCount === totalCount;

    return (
            <Card className="border-border-strong overflow-hidden animate-in fade-in duration-500">
                <CardHeader className="bg-blue-50/50 border-b border-border-strong pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2 text-chaiyo-blue">
                            <ClipboardCheck className="w-5 h-5 text-chaiyo-blue" />
                            Policy Checklist
                        </CardTitle>
                        <Badge variant={allPassed ? "success" : "danger"}>
                            ผ่าน {passedCount}/{totalCount}
                        </Badge>
                    </div>
                </CardHeader>
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
            </Card>
    );
}
