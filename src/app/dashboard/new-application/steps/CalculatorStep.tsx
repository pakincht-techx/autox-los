"use client";

import { useState, useEffect } from "react";
import { Calculator, Banknote, Calendar, ChevronRight, ChevronLeft, Car, Bike, Truck, Sprout, MapIcon, Tractor, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";


interface CalculatorStepProps {
    onNext: (data: any) => void;
    formData?: any;
    setFormData?: (data: any) => void;
    onBack?: () => void;
    hideNavigation?: boolean;
    readOnlyProduct?: boolean;
    paymentMethod?: 'installment' | 'bullet';
}

export function CalculatorStep({ onNext, formData, setFormData, onBack, hideNavigation, readOnlyProduct, paymentMethod = 'installment' }: CalculatorStepProps) {
    const [amount, setAmount] = useState<number>(Number(formData?.requestedAmount) || 100000);
    const [months, setMonths] = useState<number>(formData?.requestedDuration || 24);
    const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
    const [totalInterest, setTotalInterest] = useState<number>(0);
    const [selectedProduct, setSelectedProduct] = useState<string>("car");

    // New State for Max Loan Logic
    const [maxLoanAmount, setMaxLoanAmount] = useState<number>(1000000);

    // Mock Interest Rates per product
    const INTEREST_RATES: Record<string, number> = {
        car: 0.2399,
        moto: 0.2399,
        truck: 0.2399,
        agri: 0.2399,
        land: 0.2399,
    };

    // Calculate Max Loan based on formData (if available)
    // Sync collateral type if read-only
    useEffect(() => {
        if (readOnlyProduct && formData?.collateralType && selectedProduct !== formData.collateralType) {
            setSelectedProduct(formData.collateralType);
        }
    }, [formData?.collateralType, readOnlyProduct]);

    // Calculate Max Loan based on formData (if available)
    useEffect(() => {
        let calculatedMax = 1000000; // Default Max Loan
        // Logic: Appraisal * LTV - Deductions

        // Priority 1: Appraisal Price (from AI/Collateral Step)
        const appraisalPrice = Number(formData?.appraisalPrice) || Number(formData?.aiAppraisal) || 0;
        if (formData && appraisalPrice > 0) {
            // LTV Logic: Land 70%, Others 90% (Matching Collateral Step)
            const isLand = selectedProduct === 'land' || formData.collateralType === 'land';
            const ltvRate = isLand ? 0.70 : 0.90;
            const approvedLimit = Math.floor(appraisalPrice * ltvRate);

            // Deductions Logic
            let deduction = 0;

            if (formData.legalStatus === 'mortgaged') {
                // Mortgage: Deduct 30% of Appraisal
                deduction = appraisalPrice * 0.30;
            } else if (formData.legalStatus === 'pawned' || formData.possessionStatus === 'pawn') {
                // Pawned: Deduct Remaining Debt
                deduction = Number(formData.pawnedRemainingDebt) || Number(formData.existingDebt) || 0;
            } else if (formData.legalStatus === 'lease' || formData.possessionStatus === 'finance') {
                // Lease: Deduct Payoff Balance
                deduction = Number(formData.leasePayoffBalance) || 0;
            }

            calculatedMax = Math.max(0, approvedLimit - deduction);
        }
        // Priority 2: Income Multiplier (Fallback)
        else if (formData && formData.income > 0) {
            // Mock Logic: Max Loan = Income * Multiplier
            let multiplier = 20; // Default
            if (selectedProduct === 'land') multiplier = 50;
            if (selectedProduct === 'car') multiplier = 30;
            if (selectedProduct === 'truck') multiplier = 35;
            if (selectedProduct === 'moto') multiplier = 10;

            calculatedMax = Math.floor(formData.income * multiplier);
        }

        // Ensure max is not negative
        setMaxLoanAmount(Math.max(0, calculatedMax));

        // Default Loan Amount Logic
        // If user hasn't actively set a requested amount (or it's just the default 100k placeholder),
        // OR if the current amount is invalid (> max), sync to max.
        // We check if formData.requestedAmount exists to respect previous user input if they navigated back.
        if (!formData?.requestedAmount || amount > calculatedMax) {
            if (calculatedMax > 0) setAmount(calculatedMax);
        } else if (calculatedMax <= 0) {
            setAmount(0);
        }
    }, [formData?.income, formData?.appraisalPrice, formData?.aiAppraisal, formData?.legalStatus, formData?.pawnedRemainingDebt, formData?.leasePayoffBalance, formData?.existingDebt, selectedProduct, formData?.collateralType, formData?.requestedAmount]);

    useEffect(() => {
        calculateLoan();
    }, [amount, months, selectedProduct, paymentMethod]);

    // Sync state to formData continuously to support external navigation
    useEffect(() => {
        if (setFormData && hideNavigation) {
            const data: any = {
                requestedAmount: amount,
                requestedDuration: months,
                estimatedMonthlyPayment: monthlyPayment,
                totalInterest: totalInterest,
                interestRate: INTEREST_RATES[selectedProduct] || 0.2399,
                paymentMethod: paymentMethod // Sync payment method back
            };

            // Only sync collateralType if NOT in read-only mode
            if (!readOnlyProduct) {
                data.collateralType = selectedProduct;
            }

            setFormData((prev: any) => ({ ...prev, ...data }));
        }
    }, [amount, months, monthlyPayment, totalInterest, selectedProduct, hideNavigation, readOnlyProduct, paymentMethod]);

    const calculateLoan = () => {
        if (amount <= 0 || months <= 0) {
            setMonthlyPayment(0);
            return;
        }

        const rate = INTEREST_RATES[selectedProduct] || 0.2399;
        const years = months / 12;
        const totalInt = amount * rate * years;
        const total = amount + totalInt;

        if (paymentMethod === 'bullet') {
            // Bullet: Pay total at end. Monthly = 0 (or technically interest only, but request said pay once)
            // Let's set monthly to 0 and handle display logic to show "Pay at end"
            setMonthlyPayment(0);
        } else {
            const monthly = total / months;
            setMonthlyPayment(monthly);
        }

        setTotalInterest(totalInt);
    };

    const handleNext = () => {
        const data = {
            requestedAmount: amount,
            requestedDuration: months,
            estimatedMonthlyPayment: monthlyPayment,
            totalInterest: totalInterest,
            interestRate: INTEREST_RATES[selectedProduct] || 0.2399,
            collateralType: selectedProduct,
            paymentMethod: paymentMethod
        };

        // If part of the main flow (formData present), update it
        if (setFormData) {
            setFormData((prev: any) => ({ ...prev, ...data }));
        }

        onNext(data);
    };

    const PRODUCTS = [
        { id: "car", label: "รถเก๋ง / กระบะ", icon: Car },
        { id: "moto", label: "รถมอเตอร์ไซค์", icon: Bike },
        { id: "truck", label: "รถบรรทุก", icon: Truck },
        { id: "agri", label: "รถเพื่อการเกษตร", icon: Tractor },
        { id: "land", label: "โฉนดที่ดิน", icon: MapIcon },
    ];

    const LOAN_DURATIONS_BY_PRODUCT: Record<string, number[]> = {
        moto: [6, 12, 18, 24, 30, 36],
        land: [12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84],
        car: [12, 18, 24, 30, 36, 42, 48, 54, 60],
        truck: [12, 18, 24, 30, 36, 42, 48, 54, 60],
        agri: [12, 18, 24, 30, 36, 42, 48, 54, 60]
    };

    const COMPARISON_DURATIONS = LOAN_DURATIONS_BY_PRODUCT[selectedProduct] || LOAN_DURATIONS_BY_PRODUCT['car'];

    const getMonthlyForDuration = (m: number) => {
        const rate = INTEREST_RATES[selectedProduct] || 0.2399;
        const years = m / 12;
        const totalInt = amount * rate * years;
        return (amount + totalInt) / m;
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Removed as per request */}

            <div className="grid lg:grid-cols-12 gap-10 max-w-7xl mx-auto">
                {/* Input Section - Minimal Styling */}
                <div className="lg:col-span-5 space-y-6 lg:order-1">
                    {/* Product Selection */}
                    <div className="space-y-4 animate-in fade-in duration-500">
                        {/* Show Summary if ReadOnly OR if we already have a collateral type from previous steps */}
                        {(readOnlyProduct || (formData && formData.collateralType)) ? (
                            // Read-Only Info Mode
                            <div className="space-y-4">
                                <Label className="text-sm font-bold">ข้อมูลการประเมินและการเงิน</Label>
                                <div className="space-y-2">
                                    {/* 1. Collateral & Appraisal Card */}
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 shadow-sm text-chaiyo-blue">
                                                {PRODUCTS.find(p => p.id === selectedProduct)?.icon ?
                                                    (() => { const Icon = PRODUCTS.find(p => p.id === selectedProduct)!.icon; return <Icon className="w-5 h-5" /> })() : <Car className="w-5 h-5" />}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <p className="font-bold text-foreground text-sm">
                                                        {PRODUCTS.find(p => p.id === selectedProduct)?.label}
                                                    </p>
                                                    <Badge variant="outline" className="text-[9px] h-4 bg-white">
                                                        {formData.legalStatus === 'pawned' ? 'ติดจำนำ' : formData.legalStatus === 'lease' ? 'ติดเช่าซื้อ' : 'ปลอดภาระ'}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-muted">
                                                    {selectedProduct === 'land'
                                                        ? `โฉนดเลขที่: ${formData.deedNumber || '-'}`
                                                        : `${formData.brand || ''} ${formData.model || ''} ${formData.year ? `(${formData.year})` : ''}`
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        <div className="h-px bg-gray-200/60" />


                                        <div className="flex justify-between items-center pl-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-muted-foreground">  วงเงินสูงสุด:</span>
                                            </div>
                                            <span className="text-sm font-mono font-bold text-blue-700">
                                                ฿{maxLoanAmount.toLocaleString()}
                                            </span>
                                        </div>

                                    </div>


                                </div>
                            </div>
                        ) : (
                            // Selector Mode
                            <>
                                <Label className="text-sm font-bold text-muted uppercase tracking-wider">เลือกประเภทหลักประกัน</Label>
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                    {PRODUCTS.map((prod) => (
                                        <div
                                            key={prod.id}
                                            onClick={() => setSelectedProduct(prod.id)}
                                            className={cn(
                                                "flex flex-col items-center justify-center p-4 border-2 rounded-2xl cursor-pointer transition-all duration-300 group relative",
                                                selectedProduct === prod.id
                                                    ? "border-chaiyo-blue bg-blue-50/50 shadow-sm"
                                                    : "border-border-subtle text-muted hover:border-chaiyo-blue/30"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors",
                                                selectedProduct === prod.id ? "bg-white text-chaiyo-blue shadow-sm" : "bg-gray-50 text-muted group-hover:bg-white"
                                            )}>
                                                <prod.icon className="w-5 h-5" />
                                            </div>
                                            <span className={cn("text-center text-[10px] font-bold leading-tight", selectedProduct === prod.id ? "text-chaiyo-blue" : "text-muted")}>{prod.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between items-baseline">
                                <Label className="text-sm font-bold">สินเชื่อที่ต้องการ (บาท)</Label>
                                {formData && (
                                    <div className={cn(
                                        "inline-flex items-center px-2 py-0.5 gap-1 rounded-full text-[9px] font-bold",
                                        maxLoanAmount <= 0 ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"
                                    )}>
                                        <AlertCircle className="w-2.5 h-2.5" />
                                        วงเงินสูงสุด: {maxLoanAmount.toLocaleString()}
                                    </div>
                                )}
                            </div>

                            {maxLoanAmount <= 0 ? (
                                <div className="p-4 bg-red-50 border border-red-100 rounded-xl space-y-2">
                                    <p className="text-red-700 text-sm font-bold">ไม่สามารถกู้เพิ่มได้ (Negative Equity)</p>
                                    <p className="text-red-600 text-[11px]">ยอดหนี้คงเหลือสูงกว่าราคาประเมินทรัพย์สิน กรุณาติดต่อเจ้าหน้าที่เพื่อขอคำปรึกษาเพิ่มเติม</p>
                                </div>
                            ) : (
                                <>
                                    <div className="relative">
                                        <Input
                                            type="text"
                                            value={amount.toLocaleString()}
                                            onChange={(e) => {
                                                const numericValue = Number(e.target.value.replace(/,/g, ''));
                                                if (!isNaN(numericValue) && numericValue <= maxLoanAmount) setAmount(numericValue);
                                            }}
                                            className="pl-9 pr-4 text-lg font-semibold font-mono h-12 bg-gray-50/50 border-gray-200 focus:bg-white transition-all text-right"
                                        />
                                    </div>
                                    <Slider
                                        value={[amount]}
                                        min={Math.min(10000, maxLoanAmount)}
                                        max={maxLoanAmount}
                                        step={5000}
                                        onValueChange={(val) => setAmount(val[0])}
                                        className="w-full py-4"
                                    />
                                    <div className="flex justify-between text-[10px] text-muted">
                                        <span>{Math.min(10000, maxLoanAmount).toLocaleString()}</span>
                                        <span>{maxLoanAmount.toLocaleString()}</span>
                                    </div>
                                </>
                            )}
                        </div>


                        {/* Payment Method Toggle (Moved here - ABOVE Loan Term) */}
                        <div className="space-y-4">
                            <Label className="text-sm font-bold">รูปแบบการผ่อนชำระ</Label>
                            <div className="flex p-1 bg-gray-100/50 border border-gray-200 rounded-xl">
                                <button
                                    onClick={() => setFormData && setFormData({ ...formData, paymentMethod: 'installment' })}
                                    className={cn(
                                        "flex-1 py-2 text-xs font-bold rounded-lg transition-all",
                                        paymentMethod !== 'bullet' ? "bg-white shadow-sm text-chaiyo-blue border border-gray-100" : "text-gray-400 hover:text-gray-600"
                                    )}
                                >
                                    ผ่อนรายเดือน
                                </button>
                                <button
                                    onClick={() => setFormData && setFormData({ ...formData, paymentMethod: 'bullet' })}
                                    className={cn(
                                        "flex-1 py-2 text-xs font-bold rounded-lg transition-all",
                                        paymentMethod === 'bullet' ? "bg-white shadow-sm text-chaiyo-blue border border-gray-100" : "text-gray-400 hover:text-gray-600"
                                    )}
                                >
                                    โปะงวดสุดท้าย
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Label className="text-sm font-bold">ระยะเวลาผ่อนชำระ (เดือน)</Label>
                            <div className="grid grid-cols-4 gap-2">
                                {(paymentMethod === 'bullet' ? [1, 2, 3, 4, 5, 6] : COMPARISON_DURATIONS).map((m) => (
                                    <button
                                        key={m}
                                        disabled={maxLoanAmount <= 0}
                                        onClick={() => setMonths(m)}
                                        className={cn(
                                            "py-2 px-1 rounded-lg text-[11px] font-bold border transition-all duration-200",
                                            months === m
                                                ? "bg-chaiyo-blue text-white border-chaiyo-blue shadow-md"
                                                : "bg-white text-foreground border-border-subtle hover:border-chaiyo-blue/50 hover:bg-blue-50/30",
                                            maxLoanAmount <= 0 && "opacity-50 cursor-not-allowed"
                                        )}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>


                {/* Output Container with Chart */}
                <Card className="lg:col-span-7 bg-[#001080] text-white border-none shadow-2xl overflow-hidden rounded-[2.5rem] flex flex-col h-full lg:sticky lg:top-6 lg:order-2">
                    <CardContent className="p-8 flex flex-col h-full relative items-center">
                        {/* 1. Main Payment Display (Replacing Header & Separator) */}
                        <div className="flex justify-between items-start w-full mb-6 pt-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center">
                                    <Calculator className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">เปรียบเทียบระยะเวลาผ่อน</p>
                                    <p className="text-[10px] text-white/50">
                                        {paymentMethod === 'bullet' ? '(ชำระครั้งเดียว)' : '(บาท/เดือน)'}
                                    </p>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="text-white/70 text-xs font-medium mb-1">
                                    {paymentMethod === 'bullet' ? 'ยอดชำระเมื่อครบกำหนด' : `ค่างวดต่อเดือน (${months} งวด)`}
                                </p>
                                <h3 className="text-4xl font-bold tracking-tight text-white">
                                    ฿{paymentMethod === 'bullet' ? (amount + totalInterest).toLocaleString() : Math.ceil(monthlyPayment).toLocaleString()}
                                </h3>
                            </div>
                        </div>

                        {/* 2. Chart Comparison */}
                        <div className={cn("w-full", paymentMethod === 'bullet' && "opacity-50 pointer-events-none grayscale")}>
                            {/* Hide Chart for Bullet because it's irrelevant (only 1 option usually, or just confusing to compare monthly bars) 
                                Actually, keep it but maybe disable interaction or show it visualizing total cost? 
                                For simplicity/time, just greying it out or hiding it is safest. 
                                Let's keep it visible but disabled with an overlay explaining. 
                            */}

                            <div className="flex justify-between items-end h-[220px] gap-2 px-1 relative">
                                {paymentMethod === 'bullet' && (
                                    <div className="absolute inset-0 z-10 flex items-center justify-center">
                                        <div className="bg-black/40 backdrop-blur-sm px-4 py-2 rounded-lg text-white text-xs font-bold">
                                            การผ่อนชำระแบบครั้งเดียว (ไม่แสดงกราฟเปรียบเทียบรายเดือน)
                                        </div>
                                    </div>
                                )}

                                {COMPARISON_DURATIONS.map(m => {
                                    const mPayment = getMonthlyForDuration(m);
                                    const maxPayment = getMonthlyForDuration(Math.min(...COMPARISON_DURATIONS));
                                    const heightPercentage = maxPayment > 0 ? (mPayment / maxPayment) * 100 : 0;
                                    const isSelected = m === months;

                                    return (
                                        <div
                                            key={m}
                                            onClick={() => maxLoanAmount > 0 && setMonths(m)}
                                            className={cn(
                                                "flex flex-col items-center h-full flex-1 group relative",
                                                maxLoanAmount > 0 ? "cursor-pointer" : "cursor-default"
                                            )}
                                        >
                                            {/* Bar Area */}
                                            <div className="relative flex-1 w-full flex flex-col justify-end items-center gap-2 pb-1">
                                                {/* The Actual Bar */}
                                                <div
                                                    className={cn(
                                                        "w-full rounded-t-lg transition-all duration-500 relative",
                                                        isSelected && maxLoanAmount > 0
                                                            ? "bg-chaiyo-gold shadow-[0_0_25px_rgba(255,193,7,0.6)]"
                                                            : "bg-white/10 group-hover:bg-white/20"
                                                    )}
                                                    style={{ height: `${heightPercentage}%` }}
                                                >
                                                    {/* Tooltip on Hover */}
                                                    {maxLoanAmount > 0 && (
                                                        <div className="absolute -top-11 left-1/2 -translate-x-1/2 bg-white text-[#001080] text-[10px] font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-2xl z-20 transform translate-y-2 group-hover:translate-y-0">
                                                            ฿{Math.ceil(mPayment).toLocaleString()}
                                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45"></div>
                                                        </div>
                                                    )}

                                                    {isSelected && maxLoanAmount > 0 && (
                                                        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white/40 "></div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Duration Label Below Bar */}
                                            <div className="flex flex-col items-center pt-2 border-t border-white/5 w-full">
                                                <span className={cn(
                                                    "text-[11px] font-black transition-all duration-300",
                                                    isSelected && maxLoanAmount > 0 ? "text-chaiyo-gold scale-125" : "text-white/40 group-hover:text-white/70"
                                                )}>
                                                    {m}
                                                </span>
                                                <span className="text-[7px] text-white/20 uppercase font-bold tracking-tighter">งวด</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 3. Detailed Summary Table */}
                        <div className="w-full space-y-4 pt-8">
                            <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-white/60">วงเงินกู้ (เงินต้น):</span>
                                    <span className="font-bold text-white">฿{amount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-white/60">ดอกเบี้ยรวม:</span>
                                    <span className="font-bold text-chaiyo-gold">฿{Math.ceil(totalInterest).toLocaleString()}</span>
                                </div>
                                <div className="h-[1px] bg-white/10 my-1"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-white/80">ยอดชำระทั้งหมด:</span>
                                    <span className="text-2xl font-bold text-white">฿{(amount + totalInterest).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* 4. Affordability Summary (Net Income vs Repay) */}
                        <div className="w-full mt-4">
                            <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-3 relative overflow-hidden">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-white/60 text-xs font-bold uppercase tracking-wider">ความสามารถในการชำระหนี้</p>

                                    </div>

                                    {/* Affinity Indicator */}
                                    {(() => {
                                        // Calculate Net Income consistent with Sales Talk Step 1
                                        const income = Number(formData?.income) || 0;
                                        const debt = Number(formData?.monthlyDebt) || 0;
                                        const netIncome = income - debt;
                                        const incomeUsed = netIncome > 0 ? netIncome : 0; // Prevent negative division

                                        const payment = Math.ceil(monthlyPayment);
                                        const dsr = incomeUsed > 0 ? (payment / incomeUsed) * 100 : 0;
                                        const isSafe = dsr <= 60; // Standard DSR limit

                                        return (
                                            <div className={cn(
                                                "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase transition-colors",
                                                isSafe ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"
                                            )}>
                                                <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", isSafe ? "bg-emerald-400" : "bg-red-400")} />
                                                {isSafe ? "Affordable" : "High DSR Warning"}
                                            </div>
                                        );
                                    })()}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-[9px] text-white/40 font-bold uppercase">ยอดผ่อน / รายได้สุทธิ</p>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "h-full transition-all duration-500",
                                                        (() => {
                                                            const income = Number(formData?.income) || 0;
                                                            const debt = Number(formData?.monthlyDebt) || 0;
                                                            const netIncome = Math.max(0, income - debt);
                                                            return (Math.ceil(monthlyPayment) / (netIncome || 1)) * 100 <= 60;
                                                        })() ? "bg-emerald-400" : "bg-red-400"
                                                    )}
                                                    style={{ width: `${Math.min(100, (Math.ceil(monthlyPayment) / (Math.max(1, (Number(formData?.income) || 0) - (Number(formData?.monthlyDebt) || 0)))) * 100)}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-mono font-bold text-white">
                                                {((Math.ceil(monthlyPayment) / (Math.max(1, (Number(formData?.income) || 0) - (Number(formData?.monthlyDebt) || 0)))) * 100).toFixed(0)}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] text-white/40 font-bold uppercase">ยอดผ่อน / รายได้สุทธิ</p>
                                        <p className="text-sm font-bold text-white">
                                            ฿{Math.ceil(monthlyPayment).toLocaleString()}
                                            <span className="text-sm font-bold text-white"> / {Math.max(0, (Number(formData?.income) || 0) - (Number(formData?.monthlyDebt) || 0)).toLocaleString()}</span>

                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>



                        <div className="w-full space-y-4 pt-4">
                            <p className="text-[10px] text-white/40 italic">
                                *คำนวณจากอัตราดอกเบี้ยเบื้องต้น {((INTEREST_RATES[selectedProduct] || 0.2399) * 100).toFixed(2)}% ต่อปี ดอกเบี้ยจริงขึ้นอยู่กับการพิจารณาของบริษัท
                            </p>
                            {!hideNavigation && (
                                <div className="flex gap-4">
                                    {onBack && (
                                        <Button
                                            onClick={onBack}
                                            variant="ghost"
                                            className="h-14 flex-1 text-white/70 hover:text-white hover:bg-white/10 rounded-xl"
                                        >
                                            <ChevronLeft className="w-5 h-5 mr-2" /> ย้อนกลับ
                                        </Button>
                                    )}
                                    <Button
                                        disabled={maxLoanAmount <= 0}
                                        onClick={handleNext}
                                        className={cn(
                                            "h-14 text-lg font-bold bg-chaiyo-gold hover:bg-chaiyo-gold/90 text-[#001080] rounded-xl shadow-xl transition-all transform hover:scale-[1.02]",
                                            onBack ? "flex-[2]" : "w-full",
                                            maxLoanAmount <= 0 && "opacity-50 grayscale cursor-not-allowed"
                                        )}
                                    >
                                        {formData ? "ยืนยันและถัดไป" : "สรุปยอดสินเชื่อ"} <ChevronRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div >
    );
}
