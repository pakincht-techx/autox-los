import { useEffect, useState } from "react";
import { Banknote, TrendingDown, Wallet } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface FinancialInfoSectionProps {
    formData: any;
    setFormData: (data: any) => void;
}

export function FinancialInfoSection({ formData, setFormData }: FinancialInfoSectionProps) {
    const [baseSalary, setBaseSalary] = useState(Number(formData.income) || 0); // Map income to baseSalary for initial load if needed
    const [otherIncome, setOtherIncome] = useState(Number(formData.otherIncome) || 0);
    const [expenses, setExpenses] = useState(Number(formData.expenses) || 0);

    const totalIncome = baseSalary + otherIncome;
    const netIncome = totalIncome - expenses;
    const debtServiceRatio = totalIncome > 0 ? ((expenses / totalIncome) * 100).toFixed(1) : 0;

    useEffect(() => {
        // Sync local state with fresh props if they change externally (optional, but good for resets)
        if (formData.baseSalary !== undefined) setBaseSalary(Number(formData.baseSalary));
        if (formData.otherIncome !== undefined) setOtherIncome(Number(formData.otherIncome));
        if (formData.expenses !== undefined) setExpenses(Number(formData.expenses));
    }, [formData.baseSalary, formData.otherIncome, formData.expenses]);

    useEffect(() => {
        // Debounce or direct update? Direct is fine for now as it's local form
        // But we need to update parent
        // Use a timeout to avoid too many re-renders if parent is heavy
        const timer = setTimeout(() => {
            setFormData((prev: any) => ({
                ...prev,
                income: totalIncome, // This is usually Total Income
                netIncome: netIncome,
                baseSalary: baseSalary,
                otherIncome: otherIncome,
                expenses: expenses,
                dsr: debtServiceRatio
            }));
        }, 300);
        return () => clearTimeout(timer);
    }, [baseSalary, otherIncome, expenses, totalIncome, netIncome, debtServiceRatio, setFormData]);

    return (
        <Card className="border-border-subtle shadow-sm bg-white rounded-2xl overflow-hidden mt-8">
            <CardHeader className="bg-gray-50/50 px-6 py-4 border-b border-border-subtle">
                <CardTitle className="text-lg text-foreground flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                        <Banknote className="w-4 h-4 text-chaiyo-blue" />
                    </div>
                    ข้อมูลทางการเงิน (Financial Info)
                </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left: Inputs */}
                    <div className="space-y-8">
                        {/* Income */}
                        <div className="space-y-4">
                            <h4 className="font-bold flex items-center gap-2 text-chaiyo-blue">
                                <Wallet className="w-4 h-4" /> รายได้ (Income)
                            </h4>
                            <div className="grid gap-4">
                                <div>
                                    <Label>เงินเดือน / รายได้หลัก</Label>
                                    <Input
                                        type="text"
                                        value={baseSalary ? baseSalary.toLocaleString() : ""}
                                        onChange={(e) => {
                                            const val = Number(e.target.value.replace(/,/g, ''));
                                            if (!isNaN(val)) setBaseSalary(val);
                                        }}
                                        className="h-12 text-right font-mono"
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <Label>รายได้อื่นๆ (ค่าคอม, โอที)</Label>
                                    <Input
                                        type="text"
                                        value={otherIncome ? otherIncome.toLocaleString() : ""}
                                        onChange={(e) => {
                                            const val = Number(e.target.value.replace(/,/g, ''));
                                            if (!isNaN(val)) setOtherIncome(val);
                                        }}
                                        className="h-12 text-right font-mono"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Expenses */}
                        <div className="space-y-4">
                            <h4 className="font-bold flex items-center gap-2 text-orange-600">
                                <TrendingDown className="w-4 h-4" /> ภาระหนี้สิน (Debts)
                            </h4>
                            <div>
                                <Label>ผ่อนชำระต่อเดือน (รวมสินเชื่ออื่นๆ)</Label>
                                <Input
                                    type="text"
                                    value={expenses ? expenses.toLocaleString() : ""}
                                    onChange={(e) => {
                                        const val = Number(e.target.value.replace(/,/g, ''));
                                        if (!isNaN(val)) setExpenses(val);
                                    }}
                                    className="h-12 text-right font-mono"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right: Summary */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 h-fit">
                        <h4 className="font-bold text-gray-700 mb-6">สรุปสถานะทางการเงิน</h4>

                        <div className="space-y-6">
                            <div className="flex justify-between items-end pb-4 border-b border-gray-200">
                                <span className="text-sm text-gray-500">รายได้รวมต่อเดือน</span>
                                <span className="text-2xl font-bold text-chaiyo-blue">฿ {totalIncome.toLocaleString()}</span>
                            </div>

                            <div className="flex justify-between items-end pb-4 border-b border-gray-200">
                                <span className="text-sm text-gray-500">รายได้สุทธิ (Net)</span>
                                <span className="text-xl font-bold text-gray-800">฿ {netIncome.toLocaleString()}</span>
                            </div>

                            <div className="pt-2">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-gray-500 font-bold">ภาระหนี้ต่อรายได้ (DSR)</span>
                                    <span className={cn(
                                        "text-[10px] px-2 py-1 rounded-full font-bold",
                                        Number(debtServiceRatio) > 70 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                                    )}>
                                        {Number(debtServiceRatio) > 70 ? "สูงเกินเกณฑ์" : "ผ่านเกณฑ์"}
                                    </span>
                                </div>
                                <div className={cn(
                                    "text-4xl font-black text-right",
                                    Number(debtServiceRatio) > 70 ? "text-red-500" : "text-green-500"
                                )}>
                                    {debtServiceRatio}%
                                </div>
                                <p className="text-xs text-right text-gray-400 mt-1">เกณฑ์อนุมัติไม่เกิน 70%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
