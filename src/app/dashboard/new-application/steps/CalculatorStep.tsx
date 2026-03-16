"use client";

import { useState, useEffect } from "react";
import { Calculator, Banknote, Calendar, ChevronRight, ChevronLeft, Car, Bike, Truck, Sprout, MapIcon, Tractor, AlertCircle, ShieldCheck, Info, X, Target, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Checkbox } from "@/components/ui/Checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // Verify if available, otherwise use custom or standard input
import { Badge } from "@/components/ui/Badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { cn } from "@/lib/utils";

const THAI_BANKS = [
    { label: "ธนาคารกสิกรไทย", value: "KBANK", logo: "/bank-logo/Type=KBank.svg" },
    { label: "ธนาคารไทยพาณิชย์", value: "SCB", logo: "/bank-logo/Type=SCB.svg" },
    { label: "ธนาคารกรุงเทพ", value: "BBL", logo: "/bank-logo/Type=BBL.svg" },
    { label: "ธนาคารกรุงศรีอยุธยา", value: "BAY", logo: "/bank-logo/Type=Bank of Ayudhya (Krungsri).svg" },
    { label: "ธนาคารกรุงไทย", value: "KTB", logo: "/bank-logo/Type=Krungthai Bank.svg" },
    { label: "ธนาคารทหารไทยธนชาต", value: "ttb", logo: "/bank-logo/Type=TTB.svg" },
    { label: "ธนาคารออมสิน", value: "GSB", logo: "/bank-logo/Type=GSB.svg" },
    { label: "ทรูมันนี่", value: "TRUEMONEY", logo: "/bank-logo/Type=Truemoney.svg" },
];

const LOAN_OBJECTIVES = [
    { label: "เพื่ออุปโภคบริโภค", value: "consumption" },
    { label: "เพื่อประกอบอาชีพ", value: "business" },
    { label: "เพื่อชำระหนี้", value: "debt" },
    { label: "เพื่อซื้อยานพาหนะ", value: "vehicle" },
    { label: "อื่นๆ", value: "other" },
];

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

    // Local Payment Method State
    const [localPaymentMethod, setLocalPaymentMethod] = useState<'installment' | 'bullet'>(formData?.paymentMethod || paymentMethod || 'installment');

    // New State for Max Loan Logic
    const [maxLoanAmount, setMaxLoanAmount] = useState<number>(1000000);
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);

    // Insurance State
    const [selectedInsurances, setSelectedInsurances] = useState<string[]>([]);
    const [includeInsuranceInLoan, setIncludeInsuranceInLoan] = useState<boolean>(true);

    // Dialog State
    const [isInsuranceDialogOpen, setIsInsuranceDialogOpen] = useState(false);
    const [draftInsurances, setDraftInsurances] = useState<string[]>([]);

    // Filter State
    const [filterTier, setFilterTier] = useState<string>('all');
    const [filterRepairType, setFilterRepairType] = useState<string>('all');
    const [filterCompany, setFilterCompany] = useState<string[]>([]);


    // Mock Interest Rates per product
    const INTEREST_RATES: Record<string, number> = {
        car: 0.2399,
        moto: 0.2399,
        truck: 0.2399,
        agri: 0.2399,
        land: 0.2399,
    };

    interface InsuranceOption {
        id: string;
        label: string;
        price: number;
        type: 'car' | 'pa'; // Car Insurance or Personal Accident
        requiredProduct?: string[]; // If specified, only available for these products
        company?: string;
        logo?: string;
        coverage?: number;
        installment?: number;
        repairType?: 'ศูนย์' | 'อู่';
        tier?: '1' | '2+' | '3+';
    }

    const COMPLEX_INSURANCE_OPTIONS: InsuranceOption[] = [
        // วิริยะประกันภัย
        { id: 'car_viriya_1_center', label: 'ประกันรถยนต์ ชั้น 1', price: 22000, type: 'car', company: 'วิริยะประกันภัย', logo: '/insurance-logo/Property 1=Viriya.png', coverage: 550000, installment: 1834, repairType: 'ศูนย์', tier: '1' },
        { id: 'car_viriya_1_garage', label: 'ประกันรถยนต์ ชั้น 1', price: 18000, type: 'car', company: 'วิริยะประกันภัย', logo: '/insurance-logo/Property 1=Viriya.png', coverage: 500000, installment: 1500, repairType: 'อู่', tier: '1' },
        { id: 'car_viriya_2p', label: 'ประกันรถยนต์ ชั้น 2+', price: 15000, type: 'car', company: 'วิริยะประกันภัย', logo: '/insurance-logo/Property 1=Viriya.png', coverage: 300000, installment: 1250, repairType: 'อู่', tier: '2+' },
        { id: 'car_viriya_3p', label: 'ประกันรถยนต์ ชั้น 3+', price: 8500, type: 'car', company: 'วิริยะประกันภัย', logo: '/insurance-logo/Property 1=Viriya.png', coverage: 100000, installment: 709, repairType: 'อู่', tier: '3+' },
        // กรุงเทพประกันภัย
        { id: 'car_bangkok_1_center', label: 'ประกันรถยนต์ ชั้น 1', price: 21000, type: 'car', company: 'กรุงเทพประกันภัย', logo: '/insurance-logo/Property 1=Bangkok.png', coverage: 520000, installment: 1750, repairType: 'ศูนย์', tier: '1' },
        { id: 'car_bangkok_1_garage', label: 'ประกันรถยนต์ ชั้น 1', price: 17500, type: 'car', company: 'กรุงเทพประกันภัย', logo: '/insurance-logo/Property 1=Bangkok.png', coverage: 480000, installment: 1459, repairType: 'อู่', tier: '1' },
        { id: 'car_bangkok_2p', label: 'ประกันรถยนต์ ชั้น 2+', price: 14000, type: 'car', company: 'กรุงเทพประกันภัย', logo: '/insurance-logo/Property 1=Bangkok.png', coverage: 250000, installment: 1167, repairType: 'อู่', tier: '2+' },
        { id: 'car_bangkok_3p', label: 'ประกันรถยนต์ ชั้น 3+', price: 9000, type: 'car', company: 'กรุงเทพประกันภัย', logo: '/insurance-logo/Property 1=Bangkok.png', coverage: 120000, installment: 750, repairType: 'อู่', tier: '3+' },
        // เมืองไทยประกันภัย
        { id: 'car_muangthai_1', label: 'ประกันรถยนต์ ชั้น 1', price: 19500, type: 'car', company: 'เมืองไทยประกันภัย', logo: '/insurance-logo/Property 1=Muang thai.png', coverage: 500000, installment: 1625, repairType: 'ศูนย์', tier: '1' },
        { id: 'car_muangthai_2p', label: 'ประกันรถยนต์ ชั้น 2+', price: 12500, type: 'car', company: 'เมืองไทยประกันภัย', logo: '/insurance-logo/Property 1=Muang thai.png', coverage: 200000, installment: 1042, repairType: 'อู่', tier: '2+' },
        { id: 'car_muangthai_3p', label: 'ประกันรถยนต์ ชั้น 3+', price: 7800, type: 'car', company: 'เมืองไทยประกันภัย', logo: '/insurance-logo/Property 1=Muang thai.png', coverage: 80000, installment: 650, repairType: 'อู่', tier: '3+' },
    ];

    const INSURANCE_OPTIONS = COMPLEX_INSURANCE_OPTIONS;

    // Derived filtered options
    const filteredCarInsurances = COMPLEX_INSURANCE_OPTIONS.filter(opt => {
        if (opt.type !== 'car') return false;
        if (filterTier !== 'all' && opt.tier !== filterTier) return false;
        if (filterRepairType !== 'all' && opt.repairType !== filterRepairType) return false;
        if (filterCompany.length > 0 && !filterCompany.includes(opt.company || '')) return false;
        return true;
    });

    const uniqueCompanies = Array.from(new Set(COMPLEX_INSURANCE_OPTIONS.filter(o => o.type === 'car' && o.company).map(o => o.company)));

    const companyLogoMap: Record<string, string> = {};
    COMPLEX_INSURANCE_OPTIONS.forEach(o => {
        if (o.company && o.logo) companyLogoMap[o.company] = o.logo;
    });

    const calculateTotalInsurancePremium = () => {
        return selectedInsurances.reduce((total, id) => {
            const option = INSURANCE_OPTIONS.find(opt => opt.id === id);
            return total + (option ? option.price : 0);
        }, 0);
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
    }, [amount, months, selectedProduct, localPaymentMethod, selectedInsurances, includeInsuranceInLoan]);

    // Sync state to formData continuously to support external navigation
    useEffect(() => {
        if (setFormData && hideNavigation) {
            const data: any = {
                requestedAmount: amount,
                requestedDuration: months,
                estimatedMonthlyPayment: monthlyPayment,
                totalInterest: totalInterest,
                interestRate: INTEREST_RATES[selectedProduct] || 0.2399,
                paymentMethod: localPaymentMethod, // Sync payment method back
                selectedInsurances: selectedInsurances,
                includeInsuranceInLoan: includeInsuranceInLoan
            };

            // Only sync collateralType if NOT in read-only mode
            if (!readOnlyProduct) {
                data.collateralType = selectedProduct;
            }

            setFormData((prev: any) => {
                const income = Number(prev.income) || 0;
                const expenses = Number(prev.expenses) || 0;
                // DSR = Current Expenses / Total Income (Excluding New Loan as per request)
                const newDsr = income > 0 ? (expenses / income) * 100 : 0;

                return {
                    ...prev,
                    ...data,
                    dsr: newDsr.toFixed(2)
                };
            });
        }
    }, [amount, months, monthlyPayment, totalInterest, selectedProduct, hideNavigation, readOnlyProduct, localPaymentMethod, selectedInsurances, includeInsuranceInLoan, setFormData]);

    const calculateLoan = () => {
        if (amount <= 0 || months <= 0) {
            setMonthlyPayment(0);
            return;
        }

        const rate = INTEREST_RATES[selectedProduct] || 0.2399;
        const years = months / 12;

        // Insurance Logic
        const insurancePremium = calculateTotalInsurancePremium();
        const principal = amount + (includeInsuranceInLoan ? insurancePremium : 0);

        const totalInt = principal * rate * years;
        const total = principal + totalInt;

        if (localPaymentMethod === 'bullet') {
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
            paymentMethod: localPaymentMethod,
            selectedInsurances: selectedInsurances,
            includeInsuranceInLoan: includeInsuranceInLoan
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

    const currentProduct = PRODUCTS.find(p => p.id === selectedProduct) || PRODUCTS[0];

    // Loan product code & name from pre-question step (formData)
    const displayLoanCode = formData?.loanProductCode || formData?.loanProductLabel || '-';
    const displayLoanName = formData?.loanProductName || currentProduct.label;

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

            <div className="flex flex-col gap-10 max-w-4xl mx-auto w-full">
                {/* Input Section - Loan & Insurance */}
                <div className="space-y-6">
                    {/* Product Selection */}
                    {!(readOnlyProduct || (formData && formData.collateralType)) && (
                        <div className="space-y-4 animate-in fade-in duration-500">
                            <Label className="text-sm text-muted uppercase tracking-wider">เลือกประเภทหลักประกัน</Label>
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
                        </div>
                    )}

                    {/* Loan Settings Section */}
                    <Card className="border-border-strong overflow-hidden animate-in fade-in duration-500">
                        <CardHeader className="bg-blue-50/50 border-b border-border-strong pb-4">
                            <CardTitle className="text-lg flex items-center gap-2 text-chaiyo-blue">
                                <Calculator className="w-5 h-5 text-chaiyo-blue" />
                                รายละเอียดวงเงินและระยะเวลาผ่อน
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 px-6 pb-6 pt-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-baseline">
                                        <Label className="text-sm">สินเชื่อที่ต้องการ (บาท)</Label>
                                        {formData && (
                                            <Popover open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
                                                <PopoverTrigger asChild>
                                                    <div
                                                        className={cn(
                                                            "inline-flex items-center px-2 py-0.5 gap-1 rounded-full text-[9px] font-bold cursor-pointer transition-colors hover:bg-blue-100",
                                                            maxLoanAmount <= 0 ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"
                                                        )}
                                                    >
                                                        <Info className="w-2.5 h-2.5" />
                                                        วงเงินสูงสุด: {maxLoanAmount.toLocaleString()}
                                                    </div>
                                                </PopoverTrigger>
                                                <PopoverContent className="bg-white border-blue-100 text-blue-900 shadow-xl p-3 rounded-xl relative w-auto max-w-[280px]">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setIsTooltipOpen(false);
                                                        }}
                                                        className="absolute top-3 right-3 text-blue-300 hover:text-blue-500 transition-colors cursor-pointer"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                    <div className="space-y-1 pr-6">
                                                        <p className="font-bold text-xs mb-2">ที่มาของวงเงินสูงสุด</p>
                                                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
                                                            <span className="text-muted-foreground">ราคาประเมินกลาง:</span>
                                                            <span className="text-right font-medium">฿{(Number(formData?.appraisalPrice) || 0).toLocaleString()}</span>

                                                            <span className="text-muted-foreground">LTV (อัตราส่วน):</span>
                                                            <span className="text-right font-medium">{(selectedProduct === 'land' ? 0.70 : 0.90) * 100}%</span>

                                                            <span className="text-muted-foreground">หัก ภาระหนี้เดิม:</span>
                                                            <span className="text-right text-red-500 font-medium">-฿{(Number(formData?.existingDebt) || 0).toLocaleString()}</span>

                                                            <div className="col-span-2 h-px bg-blue-100 my-1"></div>

                                                            <span className="font-bold text-blue-700">วงเงินสูงสุดสุทธิ:</span>
                                                            <span className="text-right font-bold text-blue-700">฿{maxLoanAmount.toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
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
                                                    className="pl-9 pr-4 text-lg font-semibold font-mono h-12 bg-white border-gray-200 focus:bg-white transition-all text-right"
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>



                                <div className="flex flex-col justify-end space-y-2">
                                    <div className="flex items-baseline min-h-[20px]">
                                        <Label className="text-sm">ระยะเวลาผ่อนชำระ (เดือน)</Label>
                                    </div>
                                    <Select
                                        disabled={maxLoanAmount <= 0}
                                        value={months.toString()}
                                        onValueChange={(val) => setMonths(Number(val))}
                                    >
                                        <SelectTrigger className="w-full h-12 rounded-xl bg-white text-sm border-gray-200">
                                            <SelectValue placeholder="-- เลือกจำนวนงวด --">
                                                {months ? `${months} เดือน` : "-- เลือกจำนวนงวด --"}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {(localPaymentMethod === 'bullet' ? [1, 2, 3, 4, 5, 6] : COMPARISON_DURATIONS).map((m) => (
                                                <SelectItem key={m} value={m.toString()}>
                                                    {m} เดือน
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Insurance Section */}
                    <Card className="border-border-strong overflow-hidden animate-in fade-in duration-500 delay-100">
                        <CardHeader className="bg-blue-50/50 border-b border-border-strong pb-4">
                            <CardTitle className="text-lg flex items-center gap-2 text-chaiyo-blue">
                                <ShieldCheck className="w-5 h-5 text-chaiyo-blue" />
                                ประกันภัยที่แนะนำ (ถ้ามี)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 px-6 pb-6 pt-5">

                            {/* 1. Freebie Insurance (Mock Logic: Car/Moto/Truck/Agri get free loan protection) */}
                            {['car', 'moto', 'truck', 'agri'].includes(selectedProduct) && (
                                <div className="p-4 bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-xl flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                        <ShieldCheck className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-blue-800">ฟรี! ประกันคุ้มครองวงเงินกู้</p>
                                        <p className="text-xs text-blue-600/80 mt-1">
                                            คุ้มครองวงเงินกู้สูงสุดตามยอดหนี้คงเหลือ กรณีเสียชีวิตหรือทุพพลภาพ
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* 2. Optional Insurance Selection */}
                            {!['car', 'moto', 'truck', 'agri'].includes(selectedProduct) && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                    <Label className="text-md font-bold text-chaiyo-blue">เลือกประกันเพิ่มเติม (สมัครใจ)</Label>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 text-xs font-bold text-chaiyo-blue border-chaiyo-blue/30 hover:bg-blue-50 transition-colors"
                                        onClick={() => {
                                            setDraftInsurances([...selectedInsurances]);
                                            setIsInsuranceDialogOpen(true);
                                        }}
                                    >
                                        เลือกประกัน
                                    </Button>
                                </div>

                                {selectedInsurances.length > 0 ? (
                                    <div className="space-y-3">
                                        {selectedInsurances.map(id => {
                                            const option = INSURANCE_OPTIONS.find(opt => opt.id === id);
                                            if (!option) return null;
                                            return (
                                                <div key={id} className="flex justify-between items-center p-3 rounded-xl border border-blue-100 bg-blue-50/30">
                                                    <div className="flex items-center gap-3">
                                                        {option.logo ? (
                                                            <img src={option.logo} alt={option.company || ''} className="w-8 h-8 object-contain rounded-md shrink-0" />
                                                        ) : (
                                                            <ShieldCheck className="w-6 h-6 text-chaiyo-blue shrink-0" />
                                                        )}
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-semibold text-gray-800">{option.company}</span>
                                                            <span className="text-xs text-gray-500">{option.label}</span>
                                                        </div>
                                                    </div>
                                                    <span className="text-sm font-bold text-chaiyo-blue whitespace-nowrap">+{option.price.toLocaleString()} ฿</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center p-6 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                                        <ShieldCheck className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                        <p className="text-sm text-gray-500 font-medium">ยังไม่มีประกันเพิ่มเติม</p>
                                        <p className="text-xs text-gray-400 mt-1">คลิก "เลือกประกัน" เพื่อเลือกความคุ้มครอง</p>
                                    </div>
                                )}


                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Insurance Dialog */}
                    <Dialog open={isInsuranceDialogOpen} onOpenChange={setIsInsuranceDialogOpen}>
                        <DialogContent className="w-[calc(100%-2rem)] max-w-6xl p-0 gap-0 overflow-hidden border-border-strong rounded-2xl h-[85vh] flex flex-col">
                            <DialogHeader className="p-6 bg-blue-50/50 border-b border-border-strong pb-4 shrink-0">
                                <DialogTitle className="text-xl flex items-center gap-2 text-chaiyo-blue">
                                    <ShieldCheck className="w-6 h-6 text-chaiyo-blue" />
                                    เลือกประกันเพิ่มเติม
                                </DialogTitle>
                            </DialogHeader>
                            <div className="flex-1 overflow-hidden flex flex-col md:flex-row bg-gray-50/30">
                                {/* Sidebar Filters */}
                                <div className="w-full md:w-56 bg-white border-r border-gray-100 overflow-y-auto shrink-0 shadow-sm flex flex-col">
                                    <div className="p-4 bg-gray-50/50 border-b border-gray-100 shrink-0">
                                        <h3 className="font-bold text-sm text-gray-700 flex items-center justify-between">
                                            ตัวกรอง
                                            {(filterTier !== 'all' || filterRepairType !== 'all' || filterCompany.length > 0) && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 px-2 text-[10px] text-chaiyo-blue"
                                                    onClick={() => {
                                                        setFilterTier('all');
                                                        setFilterRepairType('all');
                                                        setFilterCompany([]);
                                                    }}
                                                >
                                                    ล้างทั้งหมด
                                                </Button>
                                            )}
                                        </h3>
                                    </div>
                                    <Accordion type="multiple" defaultValue={["tier", "repair", "company"]} className="w-full px-2 mt-2">
                                        <AccordionItem value="tier" className="border-b-0 px-2">
                                            <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3">ชั้นประกัน</AccordionTrigger>
                                            <AccordionContent>
                                                <RadioGroup value={filterTier} onValueChange={setFilterTier} className="space-y-2.5">
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="all" id="tier-all" />
                                                        <Label htmlFor="tier-all" className="cursor-pointer text-sm text-gray-600">ทั้งหมด</Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="1" id="tier-1" />
                                                        <Label htmlFor="tier-1" className="cursor-pointer text-sm text-gray-600">ชั้น 1</Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="2+" id="tier-2p" />
                                                        <Label htmlFor="tier-2p" className="cursor-pointer text-sm text-gray-600">ชั้น 2+</Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="3+" id="tier-3p" />
                                                        <Label htmlFor="tier-3p" className="cursor-pointer text-sm text-gray-600">ชั้น 3+</Label>
                                                    </div>
                                                </RadioGroup>
                                            </AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value="repair" className="border-b-0 px-2 border-t border-gray-100 mt-2">
                                            <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3">การซ่อม</AccordionTrigger>
                                            <AccordionContent>
                                                <RadioGroup value={filterRepairType} onValueChange={setFilterRepairType} className="space-y-2.5">
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="all" id="repair-all" />
                                                        <Label htmlFor="repair-all" className="cursor-pointer text-sm text-gray-600">ทั้งหมด</Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="ศูนย์" id="repair-center" />
                                                        <Label htmlFor="repair-center" className="cursor-pointer text-sm text-gray-600">ซ่อมศูนย์</Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="อู่" id="repair-garage" />
                                                        <Label htmlFor="repair-garage" className="cursor-pointer text-sm text-gray-600">ซ่อมอู่</Label>
                                                    </div>
                                                </RadioGroup>
                                            </AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value="company" className="border-b-0 px-2 border-t border-gray-100 mt-2 pb-4">
                                            <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3">บริษัทประกัน</AccordionTrigger>
                                            <AccordionContent>
                                                <div className="space-y-2.5">
                                                    {uniqueCompanies.map(comp => comp && (
                                                        <div key={comp} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={`comp-${comp}`}
                                                                checked={filterCompany.includes(comp)}
                                                                onCheckedChange={(checked) => {
                                                                    if (checked) {
                                                                        setFilterCompany([...filterCompany, comp]);
                                                                    } else {
                                                                        setFilterCompany(filterCompany.filter(c => c !== comp));
                                                                    }
                                                                }}
                                                                className="border-gray-300 data-[state=checked]:border-chaiyo-blue data-[state=checked]:bg-chaiyo-blue data-[state=checked]:text-white"
                                                            />
                                                            {companyLogoMap[comp] && (
                                                                <img src={companyLogoMap[comp]} alt={comp} className="w-5 h-5 object-contain rounded shrink-0" />
                                                            )}
                                                            <Label htmlFor={`comp-${comp}`} className="cursor-pointer text-sm text-gray-600">{comp}</Label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </div>

                                {/* Main Content - Tables */}
                                <div className="flex-1 overflow-y-auto space-y-8">
                                    {/* Car Insurance Table */}
                                    {(selectedProduct === 'car' || selectedProduct === 'truck') && (
                                        <div className="space-y-4">


                                            <div className="bg-white rounded-none border-y border-gray-200 overflow-hidden">
                                                <Table>
                                                    <TableHeader className="bg-gray-50/80">
                                                        <TableRow className="hover:bg-transparent">
                                                            <TableHead className="w-[50px]"></TableHead>
                                                            <TableHead className="font-semibold text-gray-600">บริษัทประกัน</TableHead>
                                                            <TableHead className="text-right font-semibold text-gray-600">ทุนประกันภัย</TableHead>
                                                            <TableHead className="text-right font-semibold text-gray-600">ค่าเบี้ยประกัน</TableHead>
                                                            <TableHead className="text-right font-semibold text-gray-600 whitespace-nowrap">ผ่อน 0% (12 ด.)</TableHead>
                                                            <TableHead className="text-center font-semibold text-gray-600">การซ่อม</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {filteredCarInsurances.length > 0 ? (
                                                            filteredCarInsurances.map(option => (
                                                                <TableRow
                                                                    key={option.id}
                                                                    className={cn(
                                                                        "cursor-pointer transition-colors group",
                                                                        draftInsurances.includes(option.id) ? "bg-blue-50/50 hover:bg-blue-50/80" : "hover:bg-gray-50/80"
                                                                    )}
                                                                    onClick={() => {
                                                                        const current = draftInsurances.find(id => INSURANCE_OPTIONS.find(opt => opt.id === id)?.type === 'car');
                                                                        if (current === option.id) {
                                                                            setDraftInsurances(draftInsurances.filter(id => id !== option.id));
                                                                        } else {
                                                                            const others = draftInsurances.filter(id => INSURANCE_OPTIONS.find(opt => opt.id === id)?.type !== 'car');
                                                                            setDraftInsurances([...others, option.id]);
                                                                        }
                                                                    }}
                                                                >
                                                                    <TableCell className="py-4">
                                                                        <RadioGroup value={draftInsurances.find(id => INSURANCE_OPTIONS.find(opt => opt.id === id)?.type === 'car') || ""}>
                                                                            <RadioGroupItem
                                                                                value={option.id}
                                                                                id={`tbl-${option.id}`}
                                                                                className="border-gray-300 text-chaiyo-blue group-hover:border-chaiyo-blue/50 data-[state=checked]:border-chaiyo-blue pointer-events-none"
                                                                            />
                                                                        </RadioGroup>
                                                                    </TableCell>
                                                                    <TableCell className="font-medium text-gray-800 py-4">
                                                                        <div className="flex items-center gap-3">
                                                                            {option.logo && (
                                                                                <img src={option.logo} alt={option.company || ''} className="w-8 h-8 object-contain rounded-md shrink-0" />
                                                                            )}
                                                                            <div className="flex flex-col">
                                                                                <span className="text-[15px]">{option.company}</span>
                                                                                <span className="text-[11px] text-gray-500 mt-0.5">{option.label}</span>
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="text-right font-mono py-4 text-[14px]">{option.coverage?.toLocaleString()}</TableCell>
                                                                    <TableCell className="text-right font-mono font-bold text-chaiyo-blue py-4 text-[15px]">{option.price.toLocaleString()}</TableCell>
                                                                    <TableCell className="text-right font-mono py-4 text-gray-600 text-[14px]">{option.installment?.toLocaleString()}</TableCell>
                                                                    <TableCell className="text-center py-4">
                                                                        <Badge variant="outline" className={cn(
                                                                            "font-normal",
                                                                            option.repairType === 'ศูนย์' ? "bg-blue-50 text-chaiyo-blue border-blue-200" : "bg-orange-50 text-orange-600 border-orange-200"
                                                                        )}>
                                                                            ซ่อม{option.repairType}
                                                                        </Badge>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        ) : (
                                                            <TableRow>
                                                                <TableCell colSpan={6} className="h-32 text-center text-gray-500">
                                                                    ไม่พบข้อมูลประกันภัยที่ตรงกับเงื่อนไขการกรอง
                                                                </TableCell>
                                                            </TableRow>
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </div>
                                    )}


                                </div>
                            </div>

                            {/* Footer */}
                            <DialogFooter className="p-6 bg-white border-t border-gray-200 flex flex-row justify-between items-center sm:justify-between shrink-0 shadow-[0_-4px_20px_-15px_rgba(0,0,0,0.1)] z-10">
                                <div className="text-sm font-medium text-gray-600 flex flex-col items-start leading-tight">
                                    <span className="text-gray-500 text-xs mb-0.5">ยอดรวมเบี้ยประกัน</span>
                                    <span className="text-2xl font-black text-chaiyo-blue">฿{draftInsurances.reduce((total, id) => {
                                        const option = INSURANCE_OPTIONS.find(opt => opt.id === id);
                                        return total + (option ? option.price : 0);
                                    }, 0).toLocaleString()}</span>
                                </div>
                                <div className="flex gap-3">
                                    <Button variant="outline" className="h-12 px-6 rounded-xl text-gray-600 border-gray-300 hover:bg-gray-50" onClick={() => setIsInsuranceDialogOpen(false)}>ยกเลิก</Button>
                                    <Button className="h-12 px-8 rounded-xl bg-chaiyo-blue hover:bg-chaiyo-blue/90 text-white shadow-sm font-bold text-[15px]" onClick={() => {
                                        setSelectedInsurances(draftInsurances);
                                        setIsInsuranceDialogOpen(false);
                                    }} >ยืนยันการเลือก</Button>
                                </div>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Bank Account Section */}
                    <Card className="border-border-strong overflow-hidden animate-in fade-in duration-500">
                        <CardHeader className="bg-blue-50/50 border-b border-border-strong pb-4">
                            <CardTitle className="text-lg flex items-center gap-2 text-chaiyo-blue">
                                <Banknote className="w-5 h-5 text-chaiyo-blue" />
                                รายละเอียดบัญชีรับโอนเงินกู้
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6 pb-6 pt-5">
                            {/* Select Bank */}
                            <div className="space-y-1.5">
                                <Label className="text-sm">ธนาคาร</Label>
                                <Select
                                    value={formData?.bankName || ''}
                                    onValueChange={(val) => setFormData?.({ ...formData, bankName: val })}
                                >
                                    <SelectTrigger className="w-full h-12 rounded-xl bg-white border-gray-200 text-sm">
                                        <SelectValue placeholder="-- เลือกธนาคาร --">
                                            {formData?.bankName && (
                                                <div className="flex items-center gap-2">
                                                    <img
                                                        src={THAI_BANKS.find(b => b.value === formData.bankName)?.logo}
                                                        alt={formData.bankName}
                                                        className="w-5 h-5 object-contain"
                                                    />
                                                    <span className="truncate">{THAI_BANKS.find(b => b.value === formData.bankName)?.label}</span>
                                                </div>
                                            )}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {THAI_BANKS.map(bank => (
                                            <SelectItem key={bank.value} value={bank.value}>
                                                <div className="flex items-center gap-2">
                                                    <img src={bank.logo} alt={bank.label} className="w-5 h-5 object-contain shrink-0" />
                                                    <span>{bank.label}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Bank Account Name */}
                            <div className="space-y-1.5">
                                <Label className="text-sm">ชื่อบัญชี</Label>
                                <Input
                                    placeholder="ชื่อ-นามสกุล เจ้าของบัญชี"
                                    value={formData?.bankAccountName || ''}
                                    onChange={(e) => setFormData?.({ ...formData, bankAccountName: e.target.value })}
                                    className="h-12 rounded-xl bg-white border-gray-200"
                                />
                            </div>

                            {/* Bank Account Number */}
                            <div className="space-y-1.5">
                                <Label className="text-sm">เลขที่บัญชี</Label>
                                <Input
                                    placeholder="กรอกเลขที่บัญชีธนาคาร"
                                    value={formData?.bankAccountNumber || ''}
                                    onChange={(e) => setFormData?.({ ...formData, bankAccountNumber: e.target.value })}
                                    className="h-12 rounded-xl bg-white border-gray-200"
                                    maxLength={15}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Loan Objective Section */}
                    <Card className="border-border-strong overflow-hidden animate-in fade-in duration-500">
                        <CardHeader className="bg-blue-50/50 border-b border-border-strong pb-4">
                            <CardTitle className="text-lg flex items-center gap-2 text-chaiyo-blue">
                                <Target className="w-5 h-5 text-chaiyo-blue" />
                                วัตถุประสงค์ในการกู้เงิน
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-1 gap-4 px-6 pb-6 pt-5">
                            {/* Select Loan Objective */}
                            <div className="space-y-1.5">
                                <Label className="text-sm">วัตถุประสงค์การขอสินเชื่อ</Label>
                                <Select
                                    value={formData?.loanObjective || ''}
                                    onValueChange={(val) => setFormData?.({ ...formData, loanObjective: val })}
                                >
                                    <SelectTrigger className="w-full h-12 rounded-xl bg-white border-gray-200 text-sm">
                                        <SelectValue placeholder="-- เลือกวัตถุประสงค์ --" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {LOAN_OBJECTIVES.map(objective => (
                                            <SelectItem key={objective.value} value={objective.value}>
                                                {objective.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>



                    {/* Consolidated Receipt Card */}
                    {(() => {
                        const netAmount = amount + (includeInsuranceInLoan ? calculateTotalInsurancePremium() : 0);
                        const hasInsurance = includeInsuranceInLoan && calculateTotalInsurancePremium() > 0;
                        const isFreebieEligible = ['car', 'moto', 'truck', 'agri'].includes(selectedProduct);
                        const income = Number(formData?.income) || 0;
                        const debt = Number(formData?.monthlyDebt) || 0;
                        const netIncome = Math.max(0, income - debt);
                        const payment = Math.ceil(monthlyPayment);
                        const dsrPercentage = netIncome > 0 ? Math.min(100, (payment / netIncome) * 100) : 100;
                        const isSafe = dsrPercentage <= 60;

                        return (
                            <Card className="border border-gray-200 overflow-hidden rounded-2xl shadow-sm">
                                {/* Header with product info */}
                                <CardHeader className="bg-white border-b border-gray-100 pb-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                                {currentProduct && <currentProduct.icon className="w-4.5 h-4.5 text-chaiyo-blue" />}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{displayLoanCode}</p>
                                                <p className="text-sm font-bold text-chaiyo-blue">{displayLoanName}</p>
                                            </div>
                                        </div>
                                        <Calculator className="w-4 h-4 text-gray-300" />
                                    </div>
                                </CardHeader>

                                <CardContent className="p-0">
                                    {/* Loan Details Section */}
                                    <div className="px-5 py-4 space-y-2.5 bg-white">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500">วงเงินที่ต้องการ</span>
                                            <span className="text-sm font-bold text-gray-800">{amount.toLocaleString()} ฿</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500">ระยะเวลาผ่อน</span>
                                            <span className="text-sm font-bold text-gray-800">{months} งวด</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500">อัตราดอกเบี้ย (ต่อปี)</span>
                                            <span className="text-sm font-bold text-gray-800">{((INTEREST_RATES[selectedProduct] || 0.2399) * 100).toFixed(2)}%</span>
                                        </div>
                                    </div>

                                    {/* Insurance Section (conditional) */}
                                    {(hasInsurance || isFreebieEligible) && (
                                        <div className="px-5 py-3 border-t border-dashed border-gray-200 bg-gray-50/50 space-y-2">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                                                <ShieldCheck className="w-3 h-3" /> ประกันภัย
                                            </p>
                                            {isFreebieEligible && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-blue-700 font-medium">ฟรี! ประกันคุ้มครองวงเงินกู้</span>
                                                    <span className="text-xs font-bold text-blue-600">0 ฿</span>
                                                </div>
                                            )}
                                            {selectedInsurances.map(id => {
                                                const option = INSURANCE_OPTIONS.find(opt => opt.id === id);
                                                if (!option) return null;
                                                return (
                                                    <div key={id} className="flex justify-between items-center">
                                                        <span className="text-xs text-gray-600 truncate max-w-[200px]">{option.label}</span>
                                                        <span className="text-xs font-bold text-gray-700">+{option.price.toLocaleString()} ฿</span>
                                                    </div>
                                                );
                                            })}
                                            {hasInsurance && (
                                                <div className="flex justify-between items-center pt-1.5 border-t border-gray-200">
                                                    <span className="text-xs font-medium text-gray-500">รวมเบี้ยประกัน (รวมในยอดจัดฯ)</span>
                                                    <span className="text-xs font-black text-chaiyo-blue">{calculateTotalInsurancePremium().toLocaleString()} ฿</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Calculation Breakdown */}
                                    <div className="px-5 py-3 border-t border-dashed border-gray-200 bg-white space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500">ยอดจัดสินเชื่อสุทธิ</span>
                                            <span className="text-sm font-bold text-gray-800">{netAmount.toLocaleString()} ฿</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500">ดอกเบี้ยรวมตลอดสัญญา</span>
                                            <span className="text-sm font-bold text-chaiyo-gold">+{Math.ceil(totalInterest).toLocaleString()} ฿</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-1 border-t border-gray-100">
                                            <span className="text-xs text-gray-500">ยอดชำระทั้งหมด</span>
                                            <span className="text-sm font-bold text-gray-800">{(netAmount + totalInterest).toLocaleString()} ฿</span>
                                        </div>
                                    </div>

                                    {/* Highlighted Installment */}
                                    <div className="bg-gradient-to-r from-chaiyo-blue to-blue-900 px-5 py-4 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -mr-8 -mt-8"></div>
                                        <div className="flex justify-between items-end relative z-10">
                                            <p className="text-xs font-medium text-blue-200">
                                                {localPaymentMethod === 'bullet' ? 'ยอดชำระเมื่อครบกำหนด' : 'ค่างวดประมาณ'}
                                            </p>
                                            <div className="flex items-baseline gap-1">
                                                <span className="font-black text-2xl text-chaiyo-gold leading-none">
                                                    {localPaymentMethod === 'bullet'
                                                        ? (amount + totalInterest).toLocaleString()
                                                        : Math.ceil(monthlyPayment).toLocaleString()}
                                                </span>
                                                <span className="text-[10px] font-bold text-chaiyo-gold/70">
                                                    {localPaymentMethod === 'bullet' ? '฿' : '฿/งวด'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* DSR Footer */}
                                    <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">DSR</span>
                                            <div className={cn(
                                                "flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold",
                                                isSafe ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                                            )}>
                                                <div className={cn("w-1 h-1 rounded-full animate-pulse", isSafe ? "bg-emerald-500" : "bg-red-500")} />
                                                {isSafe ? "ปกติ" : "สูง"}
                                            </div>
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden mb-1.5">
                                            <div
                                                className={cn("h-full transition-all duration-500 rounded-full", isSafe ? "bg-emerald-500" : "bg-red-500")}
                                                style={{ width: `${dsrPercentage}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-[10px] text-gray-400">
                                            <span>ค่างวด {payment.toLocaleString()} / รายได้สุทธิ {netIncome.toLocaleString()}</span>
                                            <span className={cn("font-bold", isSafe ? "text-emerald-600" : "text-red-500")}>{dsrPercentage.toFixed(0)}%</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })()}

                    {/* Disclaimer & Navigation */}
                    <div className="w-full space-y-4 pt-3">
                        <p className="text-[10px] text-gray-400 italic text-center">
                            *คำนวณจากอัตราดอกเบี้ยเบื้องต้น {((INTEREST_RATES[selectedProduct] || 0.2399) * 100).toFixed(2)}% ต่อปี ดอกเบี้ยจริงขึ้นอยู่กับการพิจารณาของบริษัท
                        </p>
                        {!hideNavigation && (
                            <div className="flex gap-4">
                                {onBack && (
                                    <Button
                                        onClick={onBack}
                                        variant="outline"
                                        className="h-14 flex-1 text-gray-600 border-gray-200 hover:bg-gray-50 rounded-xl font-bold"
                                    >
                                        <ChevronLeft className="w-5 h-5 mr-1" /> ย้อนกลับ
                                    </Button>
                                )}
                                <Button
                                    disabled={maxLoanAmount <= 0}
                                    onClick={handleNext}
                                    className={cn(
                                        "h-14 text-lg font-bold bg-chaiyo-blue hover:bg-chaiyo-blue/90 text-white rounded-xl shadow-lg transition-all transform hover:scale-[1.01]",
                                        onBack ? "flex-[2]" : "w-full",
                                        maxLoanAmount <= 0 && "opacity-50 grayscale cursor-not-allowed"
                                    )}
                                >
                                    {formData ? "ยืนยันและถัดไป" : "สรุปยอดสินเชื่อ"} <ChevronRight className="w-5 h-5 ml-1" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
}
