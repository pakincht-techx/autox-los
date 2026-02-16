"use client";

import { useEffect, useState } from "react";
import { Banknote, Wallet, FileText, UploadCloud, TrendingDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface IncomeStepProps {
    formData: any;
    setFormData: (data: any) => void;
}

export function IncomeStep({ formData, setFormData }: IncomeStepProps) {
    const [baseSalary, setBaseSalary] = useState(Number(formData.income) || 0);
    const [otherIncome, setOtherIncome] = useState(0);
    const [expenses, setExpenses] = useState(0);

    const totalIncome = baseSalary + otherIncome;
    const netIncome = totalIncome - expenses;
    const debtServiceRatio = totalIncome > 0 ? ((expenses / totalIncome) * 100).toFixed(1) : 0;

    useEffect(() => {
        setFormData({
            ...formData,
            income: totalIncome,
            netIncome: netIncome,
            baseSalary: baseSalary,
            otherIncome: otherIncome,
            expenses: expenses,
            dsr: debtServiceRatio
        });
    }, [totalIncome, netIncome, baseSalary, otherIncome, expenses, debtServiceRatio]);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Column: Summary Output (Moved from Right) */}
                <div className="lg:col-span-12 xl:col-span-5 order-last lg:order-last"> {/* Allow responsive reordering if needed, but per request moving to Left */}
                    <div className="sticky top-6">
                        <div className="bg-chaiyo-blue text-white p-8 rounded-[2.5rem] space-y-8 shadow-xl shadow-blue-900/10">
                            <div>
                                <h3 className="text-white/80 font-medium mb-6 flex items-center gap-2">
                                    <Banknote className="w-5 h-5" /> สรุปรายได้และภาระหนี้
                                </h3>

                                <div className="space-y-6">
                                    <div className="space-y-1">
                                        <p className="text-white/60 text-xs font-bold uppercase tracking-wider">รายได้รวมต่อเดือน</p>
                                        <p className="text-4xl font-black text-chaiyo-gold tracking-tight">฿ {totalIncome.toLocaleString()}</p>
                                    </div>

                                    <div className="pt-6 border-t border-white/10 space-y-1">
                                        <p className="text-white/60 text-xs font-bold uppercase tracking-wider">รายได้สุทธิ (Net Income)</p>
                                        <p className="text-3xl font-bold">฿ {netIncome.toLocaleString()}</p>
                                    </div>

                                    <div className="pt-6 border-t border-white/10 space-y-2">
                                        <div className="flex justify-between items-end">
                                            <p className="text-white/60 text-xs font-bold uppercase tracking-wider">ภาระหนี้ต่อรายได้ (DSR)</p>
                                            <span className={cn(
                                                "text-xs px-2 py-0.5 rounded-full font-bold",
                                                Number(debtServiceRatio) > 70 ? "bg-red-500/20 text-red-200" : "bg-emerald-500/20 text-emerald-200"
                                            )}>
                                                {Number(debtServiceRatio) > 70 ? "สูงเกินเกณฑ์" : "ผ่านเกณฑ์"}
                                            </span>
                                        </div>
                                        <p className={cn("text-5xl font-black", Number(debtServiceRatio) > 70 ? "text-red-400" : "text-emerald-400")}>
                                            {debtServiceRatio}<span className="text-2xl text-white/40 font-bold ml-1">%</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Inputs (Moved from Left) */}
                <div className="lg:col-span-12 xl:col-span-7">

                    {/* Income Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                <Wallet className="w-5 h-5 text-chaiyo-blue" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">รายได้ (Income)</h3>
                        </div>

                        <div className="grid gap-6 px-1">
                            <div>
                                <Label className="text-base text-muted-foreground mb-2 block">เงินเดือน / รายได้หลัก</Label>
                                <Input
                                    type="text"
                                    value={baseSalary ? baseSalary.toLocaleString() : ""}
                                    onChange={(e) => {
                                        const numericValue = Number(e.target.value.replace(/,/g, ''));
                                        if (!isNaN(numericValue)) setBaseSalary(numericValue);
                                    }}
                                    className="font-mono text-lg h-14 bg-gray-50/50 border-gray-200 focus:bg-white transition-all text-right"
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <Label className="text-base text-muted-foreground mb-2 block">รายได้อื่นๆ (ค่าคอม, โอที)</Label>
                                <Input
                                    type="text"
                                    value={otherIncome ? otherIncome.toLocaleString() : ""}
                                    onChange={(e) => {
                                        const numericValue = Number(e.target.value.replace(/,/g, ''));
                                        if (!isNaN(numericValue)) setOtherIncome(numericValue);
                                    }}
                                    className="font-mono text-lg h-14 bg-gray-50/50 border-gray-200 focus:bg-white transition-all text-right"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gray-200 my-10" />

                    {/* Expenses Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                                <TrendingDown className="w-5 h-5 text-orange-500" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">ภาระหนี้สิน (Expenses)</h3>
                        </div>

                        <div className="px-1">
                            <Label className="text-base text-muted-foreground mb-2 block">ผ่อนชำระต่อเดือน (ยังไม่รวมตรวจสอบ NCB)</Label>
                            <Input
                                type="text"
                                value={expenses ? expenses.toLocaleString() : ""}
                                onChange={(e) => {
                                    const numericValue = Number(e.target.value.replace(/,/g, ''));
                                    if (!isNaN(numericValue)) setExpenses(numericValue);
                                }}
                                className="font-mono text-lg h-14 bg-gray-50/50 border-gray-200 focus:bg-white transition-all text-right"
                                placeholder="0"
                            />

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
