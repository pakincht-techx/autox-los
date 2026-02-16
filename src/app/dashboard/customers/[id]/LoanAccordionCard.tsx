"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ChevronDown, ChevronUp, FileText, Car, History } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoanAccordionCardProps {
    loanId: string;
    onViewHistory: () => void;
}

export function LoanAccordionCard({ loanId, onViewHistory }: LoanAccordionCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Mock Data
    const loanData = {
        amount: "฿ 50,000.00",
        date: "15 ต.ค. 2023",
        paid: "25%",
        remaining: "฿ 37,550",
        interestRate: "1.25% ต่อเดือน",
        startDate: "15 ต.ค. 2023",
        endDate: "15 ต.ค. 2026",
        installment: "฿ 2,500 / งวด",
        collateral: {
            brand: "Toyota Hilux Revo",
            plate: "1กข 1234 กทม.",
            year: "2021"
        }
    };

    return (
        <Card
            className={cn(
                "border-border-subtle shadow-sm transition-all duration-300 overflow-hidden",
                isExpanded ? "ring-2 ring-chaiyo-blue/10 border-chaiyo-blue/30" : "hover:shadow-md cursor-pointer"
            )}
            onClick={() => !isExpanded && setIsExpanded(true)}
        >
            <CardContent className="p-0">
                {/* Header Section - Always Visible */}
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">สินเชื่อส่วนบุคคล</Badge>
                                <span className="text-sm text-muted">#{loanId}</span>
                            </div>
                            <h4 className="text-xl font-bold text-foreground mt-2">{loanData.amount}</h4>
                            <p className="text-sm text-muted">อนุมัติเมื่อ: {loanData.date}</p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted shrink-0"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsExpanded(!isExpanded);
                            }}
                        >
                            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                        </Button>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                            <span className="text-muted">ชำระแล้ว {loanData.paid}</span>
                            <span className="text-chaiyo-blue">คงเหลือ {loanData.remaining}</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-chaiyo-blue w-[25%] rounded-full" />
                        </div>
                    </div>
                </div>

                {/* Expanded Section */}
                {isExpanded && (
                    <div className="bg-gray-50/50 border-t border-border-subtle animate-in slide-in-from-top-2 duration-300">
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Loan Info */}
                            <div className="space-y-3">
                                <h5 className="flex items-center gap-2 text-sm font-bold text-foreground">
                                    <FileText className="h-4 w-4 text-chaiyo-blue" />
                                    ข้อมูลสัญญา
                                </h5>
                                <div className="space-y-2 pl-6">
                                    <DetailItem label="ดอกเบี้ย" value={loanData.interestRate} />
                                    <DetailItem label="เริ่มสัญญา" value={loanData.startDate} />
                                    <DetailItem label="สิ้นสุดสัญญา" value={loanData.endDate} />
                                    <DetailItem label="ค่างวด" value={loanData.installment} />
                                </div>
                            </div>

                            {/* Collateral Info */}
                            <div className="space-y-3">
                                <h5 className="flex items-center gap-2 text-sm font-bold text-foreground">
                                    <Car className="h-4 w-4 text-chaiyo-blue" />
                                    หลักประกัน
                                </h5>
                                <div className="space-y-2 pl-6">
                                    <DetailItem label="ยี่ห้อ/รุ่น" value={loanData.collateral.brand} />
                                    <DetailItem label="ทะเบียน" value={loanData.collateral.plate} />
                                    <DetailItem label="ปีที่จดทะเบียน" value={loanData.collateral.year} />
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-4 bg-white border-t border-border-subtle flex justify-end">
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-chaiyo-blue border-chaiyo-blue/30 hover:bg-blue-50 hover:text-chaiyo-blue"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onViewHistory();
                                }}
                            >
                                <History className="h-4 w-4 mr-2" />
                                ประวัติการชำระเงิน
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function DetailItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between items-center text-sm">
            <span className="text-muted">{label}</span>
            <span className="font-medium text-foreground">{value}</span>
        </div>
    );
}
