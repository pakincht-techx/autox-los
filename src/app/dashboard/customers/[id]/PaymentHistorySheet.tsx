"use client";

import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/Sheet";
import { Badge } from "@/components/ui/Badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/Table";
import { cn } from "@/lib/utils";

interface PaymentHistorySheetProps {
    isOpen: boolean;
    onClose: () => void;
    loanId: string | null;
}

export function PaymentHistorySheet({ isOpen, onClose, loanId }: PaymentHistorySheetProps) {
    // Mock Data - in a real app, you'd fetch this using loanId
    const mockHistory = [
        { no: 14, date: "25 ก.พ. 2024", amount: "฿ 2,500.00", status: "Pending" },
        { no: 13, date: "25 ม.ค. 2024", amount: "฿ 2,500.00", status: "Paid" },
        { no: 12, date: "25 ธ.ค. 2023", amount: "฿ 2,500.00", status: "Paid" },
        { no: 11, date: "25 พ.ย. 2023", amount: "฿ 2,500.00", status: "Paid" },
        { no: 10, date: "25 ต.ค. 2023", amount: "฿ 2,500.00", status: "Paid" },
        { no: 9, date: "25 ก.ย. 2023", amount: "฿ 2,500.00", status: "Paid" },
        { no: 8, date: "25 ส.ค. 2023", amount: "฿ 2,500.00", status: "Paid" },
    ];

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="max-w-lg">
                <SheetHeader>
                    <SheetTitle>ประวัติการชำระเงิน</SheetTitle>
                </SheetHeader>
                <div className="space-y-6 pb-10 mt-4">
                    {/* Header Summary */}
                    <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-blue-600 font-medium mb-1">เลขที่สัญญา</p>
                            <p className="text-sm font-bold text-gray-900">{loanId || "LN-XXXX-XXXX"}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-blue-600 font-medium mb-1">สถานะชำระล่าสุด</p>
                            <Badge variant="success">ปกติ</Badge>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="border border-border-subtle rounded-xl overflow-hidden bg-white">
                        <Table className="shadow-none border-none">
                            <TableHeader className="bg-gray-50/50 border-none">
                                <TableRow className="border-border-subtle">
                                    <TableHead className="py-3 text-[11px] font-semibold text-muted pl-4">งวดที่</TableHead>
                                    <TableHead className="py-3 text-[11px] font-semibold text-muted">วันครบกำหนด</TableHead>
                                    <TableHead className="py-3 text-[11px] font-semibold text-muted text-right">จำนวนเงิน</TableHead>
                                    <TableHead className="py-3 text-[11px] font-semibold text-muted text-right pr-4">สถานะ</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockHistory.map((row) => (
                                    <TableRow key={row.no} className="border-border-subtle last:border-0 hover:bg-gray-50/50 transition-colors">
                                        <TableCell className="py-3.5 text-[13px] font-medium pl-4">{row.no}</TableCell>
                                        <TableCell className="py-3.5 text-[13px] text-gray-600">{row.date}</TableCell>
                                        <TableCell className="py-3.5 text-[13px] font-bold text-right text-gray-900">{row.amount}</TableCell>
                                        <TableCell className="py-3.5 text-right pr-4">
                                            <span className={cn(
                                                "inline-flex items-center px-2 py-1 rounded text-[10px] font-bold border leading-none",
                                                row.status === 'Paid'
                                                    ? 'bg-green-50 text-green-700 border-green-100'
                                                    : 'bg-amber-50 text-amber-700 border-amber-100'
                                            )}>
                                                {row.status === 'Paid' ? 'ชำระแล้ว' : 'รอชำระ'}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
