import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Banknote, FileText, Car, Bike, ShieldCheck, Sparkles, TrendingUp, ChevronDown, ChevronUp, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActiveLoan {
    id: string;
    type: string;
    balance: number;
    status: string;
    installment: number;
    totalMonths: number;
    paidMonths: number;
    totalAmount: number;
    nextPaymentDate?: string;
}

interface Asset {
    id: string;
    type: string;
    plate?: string;
    assetType: string;
    estimatedValue?: number;
    maxLtvLimit?: number;
    loans: ActiveLoan[];
}

interface ActiveLoansListProps {
    assets: Asset[];
    className?: string;
}

export function ActiveLoansList({ assets, className }: ActiveLoansListProps) {
    const [expandedIds, setExpandedIds] = useState<string[]>(assets.map(a => a.id));

    const toggleExpand = (id: string) => {
        setExpandedIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    return (
        <Card className={cn("border-border-subtle shadow-sm flex flex-col h-full bg-transparent border-0 shadow-none", className)}>
            <div className="flex items-center gap-3 mb-6 px-1">
                <div className="w-10 h-10 rounded-xl bg-chaiyo-gold/10 flex items-center justify-center text-chaiyo-gold">
                    <Banknote className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-foreground">รายการทรัพย์สินและสินเชื่อ</h3>
                    <p className="text-xs text-muted">เลือกดูรายละเอียดสินเชื่อแยกตามหลักประกัน</p>
                </div>
            </div>

            <div className="space-y-4 h-full overflow-y-auto pr-1 custom-scrollbar">
                {assets.map((asset) => {
                    const isExpanded = expandedIds.includes(asset.id);
                    const totalBalance = asset.loans.reduce((sum, loan) => sum + loan.balance, 0);
                    const isUnsecured = asset.assetType === 'unsecured';
                    const maxLimit = asset.maxLtvLimit || 0;
                    const availableTopup = Math.max(0, maxLimit - totalBalance);
                    const usagePercent = maxLimit > 0 ? (totalBalance / maxLimit) * 100 : 0;

                    const Icon = asset.assetType === 'moto' ? Bike : (isUnsecured ? ShieldCheck : Car);

                    return (
                        <div key={asset.id} className="border border-border-subtle overflow-hidden shadow-sm bg-white rounded-[1.5rem] transition-all duration-300">
                            {/* Accordion Header */}
                            <div
                                onClick={() => toggleExpand(asset.id)}
                                style={{ WebkitTapHighlightColor: 'transparent' }}
                                className={cn(
                                    "p-5 cursor-pointer hover:bg-gray-50/50 transition-colors flex items-center justify-between gap-4 outline-none select-none",
                                    isExpanded && "border-b border-gray-100 bg-gray-50/30"
                                )}
                            >
                                <div className="flex gap-4 flex-1 min-w-0">
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                                        isUnsecured ? "bg-purple-50 text-purple-600" : "bg-chaiyo-blue/5 text-chaiyo-blue"
                                    )}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-foreground truncate">{asset.type}</h4>
                                            {asset.loans.length > 0 && (
                                                <Badge className="bg-chaiyo-blue/10 text-chaiyo-blue border-none text-[10px] h-4">
                                                    {asset.loans.length} สินเชื่อ
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-muted mt-1 uppercase tracking-wider font-bold">
                                            {asset.plate || (isUnsecured ? "Personal Loans" : "Asset")}

                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right hidden sm:block">
                                        {!isUnsecured && availableTopup > 0 ? (
                                            <>
                                                <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-0.5">ยอดหนี้รวม</p>
                                                <p className="text-base font-black text-chaiyo-blue">฿{totalBalance.toLocaleString()}</p>
                                                <p className="text-[10px] text-emerald-600 font-bold mt-1 inline-flex items-center gap-1">
                                                    <span className="w-1 h-1 rounded-full bg-emerald-400" />
                                                    กู้เพิ่มได้ ฿{availableTopup.toLocaleString()}
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-0.5">ยอดหนี้รวม</p>
                                                <p className="text-base font-black text-chaiyo-blue">฿{totalBalance.toLocaleString()}</p>
                                            </>
                                        )}
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    </div>
                                </div>
                            </div>

                            {/* Accordion Content */}
                            {isExpanded && (
                                <div className="animate-in slide-in-from-top-2 duration-300">

                                    {/* Individual Loans List */}
                                    <div className="bg-white">
                                        <div className="px-5 pt-6 pb-2">
                                            <p className="text-[10px] font-bold text-muted uppercase tracking-widest">รายการสินเชื่อ</p>
                                        </div>
                                        {asset.loans.map((loan) => {
                                            const paidAmount = loan.totalAmount - loan.balance;
                                            const progress = (paidAmount / loan.totalAmount) * 100;

                                            return (
                                                <div
                                                    key={loan.id}
                                                    className="p-5 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                                                >
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm font-bold text-foreground">{loan.type}</span>
                                                                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 text-[10px] py-0 px-1.5 h-4">ปกติ</Badge>
                                                            </div>
                                                            <p className="text-xs text-muted flex items-center gap-1">
                                                                <FileText className="w-3 h-3" /> {loan.id}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-base font-black text-chaiyo-blue leading-none mb-1">฿{loan.balance.toLocaleString()}</p>
                                                            <div className="flex items-center justify-end gap-1.5 text-[11px] font-medium text-muted">
                                                                <span className="text-foreground font-bold">฿{loan.installment.toLocaleString()}/ด</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="flex justify-between text-[10px] font-bold">
                                                            <span className="text-muted">ผ่อนชำระ {loan.paidMonths}/{loan.totalMonths} งวด</span>
                                                            <span className="text-chaiyo-blue">ชำระแล้ว {progress.toFixed(0)}%</span>
                                                        </div>
                                                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-emerald-500 rounded-full"
                                                                style={{ width: `${progress}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {asset.loans.length === 0 && (
                                            <div className="p-10 text-center flex flex-col items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                                                    <ShieldCheck className="w-6 h-6" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-bold text-foreground">หลักประกันปลอดภาระ</p>
                                                    <p className="text-xs text-muted">ทรัพย์สินนี้ไม่มีภาระหนี้ผูกพัน สามารถใช้สมัครสินเชื่อใหม่ได้ทันที</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}
