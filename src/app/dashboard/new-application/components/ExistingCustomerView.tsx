import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { User, Car, ArrowRight, Wallet, History, Calculator, Calendar, PieChart } from "lucide-react";
import { ActiveLoansList } from "./ActiveLoansList";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface ExistingCustomerViewProps {
    profile: any;
    assetsWithLoans: any[];
    onProceed: () => void;
    onSkipToCalculator?: () => void;
}

export function ExistingCustomerView({ profile, assetsWithLoans, onProceed, onSkipToCalculator }: ExistingCustomerViewProps) {
    const router = useRouter();

    const activeLoans = assetsWithLoans.flatMap(a => a.loans);

    // Mock Income Info
    const incomeInfo = {
        salary: 35000,
        otherIncome: 5000,
        totalIncome: 40000
    };

    // Calculate Summaries
    const totalBalance = activeLoans.reduce((sum, loan) => sum + loan.balance, 0);
    const totalInstallment = activeLoans.reduce((sum, loan) => sum + loan.installment, 0);
    const maxLoanLimit = 2500000; // วงเงินสูงสุดที่กู้ได้ (Mock)
    const dsr = (totalInstallment / incomeInfo.totalIncome) * 100;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">

            {/* 1. Simplified Customer Header (No Card) */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2">
                <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center border-4 border-white shadow-md text-chaiyo-blue relative">
                        <User className="w-10 h-10" />
                        <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                            {profile?.fullName || "คุณสมชาย ใจดี"}
                            <Badge className="bg-chaiyo-gold/20 text-blue-900 border-chaiyo-gold/50 pointer-events-none">Credit Grade: {profile?.creditGrade || "A"}</Badge>
                        </h2>
                        <div className="flex items-center gap-3 text-sm text-muted mt-1">
                            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {profile?.customerId || "CUST-555001"}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span>ลูกค้าตั้งแต่: 12/05/2021 (3 ปี)</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap md:flex-nowrap gap-3 shrink-0">
                    <Button
                        variant="ghost"
                        size="default"
                        className="h-11 px-4 text-muted hover:text-chaiyo-blue hover:bg-chaiyo-blue/5 rounded-xl"
                        onClick={() => router.push(`/dashboard/customers/${profile?.customerId || 'CUST-001'}`)}
                    >
                        <History className="w-4 h-4 mr-2" /> ดูข้อมูลลูกค้า
                    </Button>
                    <Button
                        size="default"
                        className="h-11 px-6 bg-chaiyo-blue text-white shadow-lg hover:bg-chaiyo-blue/90 rounded-xl"
                        onClick={onProceed}
                    >
                        ขอสินเชื่อใหม่ <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>


            {/* Main Content Grid: Active Loans (Left/Big) vs Collateral+Income (Right/Stack) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* 1. Assets & Loans List - Spans 2 columns */}
                <div className="lg:col-span-2 space-y-6">
                    <ActiveLoansList assets={assetsWithLoans} />
                </div>

                {/* Right Column: Stacked Info */}
                <div className="space-y-6 lg:col-span-1">

                    {/* 3. Financial Info Card */}
                    <Card className="border-border-subtle shadow-sm">
                        <CardHeader className="border-b border-border-subtle bg-gray-50/50 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Wallet className="w-5 h-5 text-chaiyo-blue" />
                                    <CardTitle className="text-base">ข้อมูลทางการเงิน</CardTitle>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 space-y-5">
                            {/* Income Section */}
                            <div className="space-y-3">
                                <p className="text-[10px] font-bold text-muted uppercase tracking-widest">ข้อมูลรายได้</p>
                                <div className="flex justify-between items-center pb-2 border-b border-dashed border-gray-100">
                                    <span className="text-sm text-muted">รายเดือน (ฐาน + อื่นๆ)</span>
                                    <span className="font-bold">{(incomeInfo.salary + incomeInfo.otherIncome).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-foreground">รายได้รวมสุทธิ</span>
                                    <span className="font-bold text-base text-emerald-600">{incomeInfo.totalIncome.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Debt Section */}
                            <div className="pt-4 border-t border-gray-100 space-y-4">
                                <p className="text-[10px] font-bold text-muted uppercase tracking-widest">ภาระหนี้ปัจจุบัน</p>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <Wallet className="w-4 h-4 text-chaiyo-blue" />
                                        <span className="text-sm text-muted">ยอดหนี้สะสม</span>
                                    </div>
                                    <span className="font-bold text-chaiyo-blue">{totalBalance.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2 pt-1">
                                        <PieChart className="w-4 h-4 text-purple-600" />
                                        <span className="text-sm text-muted">ผ่อนชำระต่อเดือน</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-purple-600">{totalInstallment.toLocaleString()}</p>
                                        <div className="mt-1">
                                            <Badge variant="outline" className={cn(
                                                "text-[10px] font-bold border py-0 h-4 px-1.5",
                                                dsr > 70 ? "bg-red-50 text-red-700 border-red-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                            )}>
                                                DSR: {dsr.toFixed(1)}%
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-3 mt-4 text-[10px] text-muted border border-gray-100">
                                <p className="flex items-center gap-1.5">
                                    <Calendar className="w-3 h-3" /> อัปเดตล่าสุดจากการสอบทาน: 01/01/2026
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
