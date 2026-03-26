"use client";

import { useState, useEffect } from "react";
import { Calculator, Banknote, Calendar, ChevronRight, ChevronLeft, Car, Bike, Truck, Sprout, MapIcon, Tractor, AlertCircle, ShieldCheck, Info, X, Target, Wallet, Gift, Users, CreditCard, ImagePlus, FileText, CheckCircle2, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Checkbox } from "@/components/ui/Checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // Verify if available, otherwise use custom or standard input
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/Dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { PolicyChecklist } from "@/components/calculator/PolicyChecklist";
import { DatePickerBE } from "@/components/ui/DatePickerBE";

const THAI_BANKS = [
    { label: "ธนาคารกสิกรไทย", value: "KBANK", logo: "/bank-logo/Type=KBank.svg" },
    { label: "ธนาคารไทยพาณิชย์", value: "SCB", logo: "/bank-logo/Type=SCB.svg" },
    { label: "ธนาคารกรุงเทพ", value: "BBL", logo: "/bank-logo/Type=BBL.svg" },
    { label: "ธนาคารกรุงศรีอยุธยา", value: "BAY", logo: "/bank-logo/Type=Bank of Ayudhya (Krungsri).svg" },
    { label: "ธนาคารกรุงไทย", value: "KTB", logo: "/bank-logo/Type=Krungthai Bank.svg" },
    { label: "ธนาคารทหารไทยธนชาต", value: "ttb", logo: "/bank-logo/Type=TTB.svg" },
    { label: "ธนาคารออมสิน", value: "GSB", logo: "/bank-logo/Type=GSB.svg" },
    { label: "ทรูมันนี่วอลเล็ท", value: "TRUEMONEY", logo: "/bank-logo/Type=Truemoney.svg" },
];

const LOAN_OBJECTIVES = [
    { label: "เพื่ออุปโภคบริโภค", value: "consumption" },
    { label: "เพื่อประกอบอาชีพ", value: "business" },
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
    const [amount, setAmount] = useState<number>(Number(formData?.requestedAmount) || 600000);
    const SYSTEM_MAX_AMOUNT = 700000;
    const [interestRateInput, setInterestRateInput] = useState<string>("23.99");
    const [months, setMonths] = useState<number>(formData?.requestedDuration || 24);
    const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
    const [totalInterest, setTotalInterest] = useState<number>(0);
    const [selectedProduct, setSelectedProduct] = useState<string>("car");
    const [bookBankFile, setBookBankFile] = useState<File | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // Local Payment Method State
    const [localPaymentMethod, setLocalPaymentMethod] = useState<'installment' | 'bullet'>(formData?.paymentMethod || paymentMethod || 'installment');

    // Seasonal payment (ผ่อนรายฤดูกาล)
    const [seasonalPeriods, setSeasonalPeriods] = useState<string>("2");
    const [seasonalPayments, setSeasonalPayments] = useState<string>("6");
    const [seasonalStartMonth, setSeasonalStartMonth] = useState<string>("5");

    // New State for Max Loan Logic
    const [maxLoanAmount, setMaxLoanAmount] = useState<number>(500000);
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);

    // Insurance State
    const [selectedInsurances, setSelectedInsurances] = useState<string[]>([]);
    const [includeInsuranceInLoan, setIncludeInsuranceInLoan] = useState<boolean>(true);
    const [carInsuranceEnabled, setCarInsuranceEnabled] = useState<boolean>(false);

    // PA Insurance State (Land only)
    const [paInsuranceEnabled, setPaInsuranceEnabled] = useState<boolean>(formData?.paInsuranceEnabled || false);
    const PA_INSURANCE_PREMIUM = 5000; // Mock premium
    const [paCoverageMonths, setPaCoverageMonths] = useState<number>(months);
    const [paStartDateValue, setPaStartDateValue] = useState<string>(() => {
        const d = new Date();
        return d.toISOString().split('T')[0]; // yyyy-mm-dd for input[type=date]
    });

    // Ensure paCoverageMonths doesn't exceed loan term
    useEffect(() => {
        if (paCoverageMonths > months) {
            setPaCoverageMonths(months);
        }
    }, [months, paCoverageMonths]);

    // Helper: format date to DD/MM/YYYY B.E.
    const formatDateBE = (date: Date) => {
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = date.getFullYear() + 543;
        return `${dd}/${mm}/${yyyy}`;
    };

    const paInsuranceCoverageMonths = paCoverageMonths;
    const paStartDate = formatDateBE(new Date(paStartDateValue));
    const paEndDate = (() => {
        const end = new Date(paStartDateValue);
        end.setMonth(end.getMonth() + paCoverageMonths);
        return formatDateBE(end);
    })();

    // Dialog State
    const [isInsuranceDialogOpen, setIsInsuranceDialogOpen] = useState(false);
    const [draftInsurances, setDraftInsurances] = useState<string[]>([]);

    // Filter State
    const [filterTier, setFilterTier] = useState<string[]>([]);
    const [filterRepairType, setFilterRepairType] = useState<string[]>([]);
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
        if (filterTier.length > 0 && !filterTier.includes(opt.tier || '')) return false;
        if (filterRepairType.length > 0 && !filterRepairType.includes(opt.repairType || '')) return false;
        if (filterCompany.length > 0 && !filterCompany.includes(opt.company || '')) return false;
        return true;
    });

    const uniqueCompanies = Array.from(new Set(COMPLEX_INSURANCE_OPTIONS.filter(o => o.type === 'car' && o.company).map(o => o.company)));

    const companyLogoMap: Record<string, string> = {};
    COMPLEX_INSURANCE_OPTIONS.forEach(o => {
        if (o.company && o.logo) companyLogoMap[o.company] = o.logo;
    });

    const calculateTotalInsurancePremium = () => {
        let total = selectedInsurances.reduce((sum, id) => {
            const option = INSURANCE_OPTIONS.find(opt => opt.id === id);
            return sum + (option ? option.price : 0);
        }, 0);
        // Add PA insurance premium if enabled (land only)
        if (paInsuranceEnabled && selectedProduct === 'land') {
            total += PA_INSURANCE_PREMIUM;
        }
        return total;
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
        let calculatedMax = 500000; // Default Max Loan
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
    }, [amount, months, selectedProduct, localPaymentMethod, selectedInsurances, includeInsuranceInLoan, paInsuranceEnabled]);

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
                includeInsuranceInLoan: includeInsuranceInLoan,
                paInsuranceEnabled: paInsuranceEnabled && selectedProduct === 'land',
                paInsurancePremium: paInsuranceEnabled && selectedProduct === 'land' ? PA_INSURANCE_PREMIUM : 0,
                paInsuranceCoverageMonths: paInsuranceCoverageMonths,
                paInsuranceCoverageStartDate: paStartDate,
                paInsuranceCoverageEndDate: paEndDate,
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
    }, [amount, months, monthlyPayment, totalInterest, selectedProduct, hideNavigation, readOnlyProduct, localPaymentMethod, selectedInsurances, includeInsuranceInLoan, paInsuranceEnabled, setFormData]);

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
        { id: "car", label: "รถเก๋ง / กระบะ", icon: Car, code: "ULCR", fullName: "จำนำรถ ผ่อนรายเดือน" },
        { id: "moto", label: "รถมอเตอร์ไซค์", icon: Bike, code: "ULMB", fullName: "รถมอไซค์ปลอดภาระ" },
        { id: "truck", label: "รถบรรทุก", icon: Truck, code: "TLTK", fullName: "จำนำรถบรรทุก ผ่อนรายเดือน" },
        { id: "agri", label: "รถเพื่อการเกษตร", icon: Tractor, code: "TLIA", fullName: "จำนำรถเกษตรเก่า ผ่อนรายเดือน" },
        { id: "land", label: "โฉนดที่ดิน", icon: MapIcon, code: "TLLD", fullName: "ที่ดิน (จำนำ) ผ่อนรายเดือน" },
    ];

    const currentProduct = PRODUCTS.find(p => p.id === selectedProduct) || PRODUCTS[0];

    // Loan product code & name from pre-question step (formData) or current product
    const displayLoanCode = formData?.loanProductCode || currentProduct.code;
    const displayLoanName = formData?.loanProductName || currentProduct.fullName;

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

            <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto w-full">
                {/* Left Column - Input Sections */}
                <div className="flex-1 space-y-6 min-w-0">

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
                            <div className="grid grid-cols-1 gap-4">
                                {/* Loan Objective */}
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

                                {/* Recommended + Requested Amount (same row) */}
                                <div className="grid grid-cols-2 gap-4">
                                    {/* System Recommended Amount (read-only) */}
                                    <div className="space-y-1.5">
                                        <Label className="text-sm">วงเงินที่ระบบแนะนำ</Label>
                                        <div className="relative">
                                            <Input
                                                type="text"
                                                value={(600000).toLocaleString()}
                                                readOnly
                                                disabled
                                                className="pl-4 pr-14 text-lg font-semibold font-mono h-12 bg-gray-50 border-gray-200 text-left cursor-not-allowed"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">บาท</span>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-sm">วงเงินที่ขออนุมัติ</Label>

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
                                                            if (!isNaN(numericValue)) setAmount(numericValue);
                                                        }}
                                                        className={cn(
                                                            "pl-4 pr-14 text-lg font-semibold font-mono h-12 bg-white border-gray-200 focus:bg-white transition-all text-left",
                                                            amount > SYSTEM_MAX_AMOUNT && "border-red-400 focus:border-red-400 focus:ring-red-200"
                                                        )}
                                                    />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">บาท</span>
                                                </div>
                                                {amount > SYSTEM_MAX_AMOUNT && (
                                                    <p className="text-xs text-red-500 mt-1">วงเงินที่ขออนุมัติต้องไม่เกิน {SYSTEM_MAX_AMOUNT.toLocaleString()} บาท</p>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Interest Rate + Installment Period (same row) */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-sm">ดอกเบี้ย</Label>
                                        <div className="relative">
                                            <Input
                                                type="text"
                                                value={interestRateInput}
                                                readOnly
                                                disabled
                                                className="pl-4 pr-14 text-lg font-semibold font-mono h-12 bg-gray-50 border-gray-200 text-left cursor-not-allowed"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">%</span>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-sm">ระยะเวลาผ่อนชำระ</Label>
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

                            </div>

                            {/* Seasonal Payment Section */}
                            <div className="pt-2 space-y-4">
                                <div className="space-y-1.5">
                                    <Label className="text-sm">รูปแบบการผ่อน</Label>
                                    <Select value="seasonal" disabled>
                                        <SelectTrigger className="w-full h-12 rounded-xl bg-white text-sm border-gray-200">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="seasonal">ผ่อนรายฤดูกาล</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-sm">จำนวนช่วงการจ่าย</Label>
                                            <Select value={seasonalPeriods} onValueChange={setSeasonalPeriods}>
                                                <SelectTrigger className="w-full h-12 rounded-xl bg-white text-sm border-gray-200">
                                                    <SelectValue placeholder="-- เลือก --" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {[1, 2, 3, 4].map((n) => (
                                                        <SelectItem key={n} value={n.toString()}>
                                                            {n} ช่วง
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label className="text-sm">จำนวนครั้งที่จ่าย</Label>
                                            <Select value={seasonalPayments} onValueChange={setSeasonalPayments}>
                                                <SelectTrigger className="w-full h-12 rounded-xl bg-white text-sm border-gray-200">
                                                    <SelectValue placeholder="-- เลือก --" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                                                        <SelectItem key={n} value={n.toString()}>
                                                            {n} ครั้ง
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label className="text-sm">เดือนที่เริ่มต้น</Label>
                                            <Select
                                                value={seasonalStartMonth}
                                                onValueChange={setSeasonalStartMonth}
                                            >
                                                <SelectTrigger className="w-full h-12 rounded-xl bg-white text-sm border-gray-200">
                                                    <SelectValue placeholder="-- เลือกเดือน --" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {[
                                                        { value: "1", label: "มกราคม" },
                                                        { value: "2", label: "กุมภาพันธ์" },
                                                        { value: "3", label: "มีนาคม" },
                                                        { value: "4", label: "เมษายน" },
                                                        { value: "5", label: "พฤษภาคม" },
                                                        { value: "6", label: "มิถุนายน" },
                                                        { value: "7", label: "กรกฎาคม" },
                                                        { value: "8", label: "สิงหาคม" },
                                                        { value: "9", label: "กันยายน" },
                                                        { value: "10", label: "ตุลาคม" },
                                                        { value: "11", label: "พฤศจิกายน" },
                                                        { value: "12", label: "ธันวาคม" },
                                                    ].map((m) => (
                                                        <SelectItem key={m.value} value={m.value}>
                                                            {m.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Seasonal Payment Visualization */}
                                    {(() => {
                                        const THAI_MONTHS_SHORT = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
                                        const intervals = Number(seasonalPeriods) || 1;
                                        const times = Number(seasonalPayments) || 1;
                                        const startIdx = (Number(seasonalStartMonth) - 1) || 0;
                                        const timesPerInterval = Math.ceil(times / intervals);
                                        const monthsPerInterval = Math.floor(12 / intervals);

                                        // Build a set of payment month indices (0-11, relative to calendar)
                                        const paymentMonths = new Set<number>();
                                        for (let i = 0; i < intervals; i++) {
                                            for (let j = 0; j < timesPerInterval; j++) {
                                                const monthIdx = (startIdx + i * monthsPerInterval + j) % 12;
                                                paymentMonths.add(monthIdx);
                                            }
                                        }

                                        // Build ordered month columns starting from startIdx
                                        const orderedMonths = Array.from({ length: 12 }, (_, i) => (startIdx + i) % 12);

                                        return (
                                            <div className="mt-2">
                                                <p className="text-xs text-gray-500 mb-2">ตารางการจ่ายรายเดือน</p>
                                                <div className="rounded-lg border border-gray-200 overflow-hidden">
                                                    <table className="w-full text-center text-xs">
                                                        <thead>
                                                            <tr className="bg-gray-50">
                                                                {orderedMonths.map((mIdx, i) => (
                                                                    <th key={i} className={cn(
                                                                        "px-1 py-2 font-medium border-r border-gray-100 last:border-r-0",
                                                                        paymentMonths.has(mIdx) ? "bg-blue-100 text-blue-700" : "text-gray-400"
                                                                    )}>
                                                                        {THAI_MONTHS_SHORT[mIdx]}
                                                                    </th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                {orderedMonths.map((mIdx, i) => (
                                                                    <td key={i} className={cn(
                                                                        "px-1 py-2.5 border-r border-gray-100 last:border-r-0 font-bold",
                                                                        paymentMonths.has(mIdx) ? "bg-blue-50 text-blue-600" : "text-gray-200"
                                                                    )}>
                                                                        {paymentMonths.has(mIdx) ? "✕" : "—"}
                                                                    </td>
                                                                ))}
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>

                        </CardContent>
                    </Card>

                    {/* Insurance Section */}
                    <Card className="border-border-strong overflow-hidden animate-in fade-in duration-500">
                        <CardHeader className="bg-blue-50/50 border-b border-border-strong pb-4">
                            <CardTitle className="text-lg flex items-center gap-2 text-chaiyo-blue">
                                <ShieldCheck className="w-5 h-5 text-chaiyo-blue" />
                                ประกันภัย
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-6 pb-6 pt-5 space-y-4">

                            {/* 1. Freebie Insurance (Mock Logic: Car/Moto/Truck/Agri get free loan protection) */}
                            {['car', 'moto', 'truck', 'agri'].includes(selectedProduct) && (
                                <div className="space-y-4">
                                    <Label className="text-md font-bold mb-1">ประกันคุ้มครองวงเงินสินเชื่อ</Label>
                                    <div className="flex justify-between items-center p-3 rounded-xl border border-gray-200 bg-white">
                                        <div className="flex items-center gap-3">
                                            <img src="/insurance-logo/Property 1=FWD.png" alt="FWD" className="w-8 h-8 object-contain rounded-md shrink-0" />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-gray-800">ประกันคุ้มครองวงเงินสินเชื่อ FWD</span>
                                                <span className="text-xs text-gray-500">ฟรี! ความคุ้มครองทันที ไม่มีค่าใช้จ่ายเพิ่มเติม</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 2. Optional Insurance Selection */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-md font-bold">ประกันภัยรถยนต์/ประกันรถมอเตอไซค์</Label>
                                    <RadioGroup
                                        value={carInsuranceEnabled ? 'yes' : 'no'}
                                        onValueChange={(val) => {
                                            setCarInsuranceEnabled(val === 'yes');
                                            if (val === 'no') setSelectedInsurances([]);
                                        }}
                                        className="flex items-center gap-4"
                                    >
                                        <div className="flex items-center gap-2">
                                            <RadioGroupItem value="yes" id="car-insurance-yes" />
                                            <Label htmlFor="car-insurance-yes" className="text-sm font-normal cursor-pointer">ต้องการ</Label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <RadioGroupItem value="no" id="car-insurance-no" />
                                            <Label htmlFor="car-insurance-no" className="text-sm font-normal cursor-pointer">ไม่ต้องการ</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {carInsuranceEnabled && (
                                    <>
                                        {selectedInsurances.length > 0 ? (
                                            <div className="space-y-3">
                                                {selectedInsurances.map(id => {
                                                    const option = INSURANCE_OPTIONS.find(opt => opt.id === id);
                                                    if (!option) return null;
                                                    return (
                                                        <div key={id} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                                                            {/* Company Header */}
                                                            <div className="flex justify-between items-center p-3">
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
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="h-8 text-xs"
                                                                    onClick={() => {
                                                                        setDraftInsurances([...selectedInsurances]);
                                                                        setIsInsuranceDialogOpen(true);
                                                                    }}
                                                                >
                                                                    เปลี่ยนแผนประกัน
                                                                </Button>
                                                            </div>

                                                            {/* Detail Rows */}
                                                            <div className="divide-y divide-gray-100 border-t border-gray-100">
                                                                {option.coverage && (
                                                                    <div className="flex items-center justify-between px-4 py-2.5">
                                                                        <span className="text-xs text-gray-500">ทุนประกัน</span>
                                                                        <span className="text-sm">{option.coverage.toLocaleString()} บาท</span>
                                                                    </div>
                                                                )}
                                                                <div className="flex items-center justify-between px-4 py-2.5">
                                                                    <div className="flex flex-col">
                                                                        <span className="text-xs text-gray-500">ค่าเบี้ยประกัน</span>
                                                                        <span className="text-[11px] text-gray-400">*ค่าเบี้ยประกันจะถูกรวมในวงเงินสินเชื่อ</span>
                                                                    </div>
                                                                    <span className="text-sm">{option.price.toLocaleString()} บาท</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="text-center p-6 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                                                <ShieldCheck className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                                <p className="text-sm text-gray-500 font-medium">ยังไม่มีประกันเพิ่มเติม</p>
                                                <p className="text-xs text-gray-400 mt-1">คลิก "เลือกแผนประกัน" เพื่อเลือกความคุ้มครอง</p>
                                                <Button
                                                    size="sm"
                                                    className="h-8 text-xs mt-3"
                                                    onClick={() => {
                                                        setDraftInsurances([...selectedInsurances]);
                                                        setIsInsuranceDialogOpen(true);
                                                    }}
                                                >
                                                    เลือกแผนประกัน
                                                </Button>
                                            </div>
                                        )}
                                    </>
                                )}


                            </div>

                            {/* 3. PA Insurance Section (Land only) */}
                            {true && (
                                <div className="space-y-4 pt-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-md font-bold">ประกันคุ้มครองวงเงินสินเชื่อ</Label>
                                        <RadioGroup
                                            value={paInsuranceEnabled ? 'yes' : 'no'}
                                            onValueChange={(val) => setPaInsuranceEnabled(val === 'yes')}
                                            className="flex items-center gap-4"
                                        >
                                            <div className="flex items-center gap-2">
                                                <RadioGroupItem value="yes" id="pa-insurance-yes" />
                                                <Label htmlFor="pa-insurance-yes" className="text-sm font-normal cursor-pointer">ต้องการ</Label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <RadioGroupItem value="no" id="pa-insurance-no" />
                                                <Label htmlFor="pa-insurance-no" className="text-sm font-normal cursor-pointer">ไม่ต้องการ</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    {paInsuranceEnabled && (
                                        <>
                                            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                                                {/* Company Header */}
                                                <div className="flex justify-between items-center p-3">
                                                    <div className="flex items-center gap-3">
                                                        <img src="/insurance-logo/Property 1=Theves.png" alt="เทเวศประกันภัย" className="w-8 h-8 object-contain rounded-md shrink-0" />
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-semibold text-gray-800">เทเวศประกันภัย</span>
                                                            <span className="text-xs text-gray-500">ประกันอุบัติเหตุส่วนบุคคล (PA)</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Detail Rows */}
                                                <div className="divide-y divide-gray-100 border-t border-gray-100">
                                                    <div className="flex items-center justify-between px-4 py-2.5">
                                                        <span className="text-xs text-gray-500">ทุนประกัน</span>
                                                        <span className="text-sm">{amount.toLocaleString()} บาท</span>
                                                    </div>

                                                    <div className="flex items-center justify-between px-4 py-2.5">
                                                        <span className="text-xs text-gray-500">เวลาการคุ้มครอง</span>
                                                        <Select
                                                            value={paCoverageMonths.toString()}
                                                            onValueChange={(val) => setPaCoverageMonths(Number(val))}
                                                        >
                                                            <SelectTrigger className="w-[160px] h-9 rounded-lg bg-white border-gray-200 text-sm">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent className="max-h-[200px] overflow-y-auto">
                                                                {Array.from({ length: Math.floor(months / 12) || 1 }, (_, i) => (i + 1) * 12).map((m) => (
                                                                    <SelectItem key={m} value={m.toString()}>
                                                                        {m / 12} ปี
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="flex items-center justify-between px-4 py-2.5">
                                                        <div className="flex flex-col">
                                                            <span className="text-xs text-gray-500">ค่าเบี้ยประกัน</span>
                                                            <span className="text-[11px] text-gray-400">*ค่าเบี้ยประกันจะถูกรวมในวงเงินสินเชื่อ</span>
                                                        </div>
                                                        <span className="text-sm">{PA_INSURANCE_PREMIUM.toLocaleString()} บาท</span>
                                                    </div>

                                                    {/* ผู้รับผลประโยชน์ */}
                                                    <div className="px-4 py-2.5">
                                                        <span className="text-xs font-bold text-gray-600 mb-2 block">ผู้รับผลประโยชน์</span>
                                                        <div className="rounded-lg border border-gray-200 overflow-hidden">
                                                            <Table>
                                                                <TableHeader>
                                                                    <TableRow className="bg-gray-50 border-b border-gray-200 hover:bg-gray-50">
                                                                        <TableHead className="px-3 py-2 text-left font-semibold text-gray-500 w-16 text-xs">อันดับ</TableHead>
                                                                        <TableHead className="px-3 py-2 text-left font-semibold text-gray-500 text-xs">ชื่อผู้รับผลประโยชน์</TableHead>
                                                                    </TableRow>
                                                                </TableHeader>
                                                                <TableBody>
                                                                    <TableRow className="hover:bg-transparent">
                                                                        <TableCell className="px-3 py-2.5 text-gray-700 font-medium text-xs">1</TableCell>
                                                                        <TableCell className="px-3 py-2.5 text-gray-800 font-semibold text-xs">บริษัท ออโต้ เอกซ์ จำกัด</TableCell>
                                                                    </TableRow>
                                                                    <TableRow className="hover:bg-transparent">
                                                                        <TableCell className="px-3 py-2.5 text-gray-700 font-medium text-xs">2</TableCell>
                                                                        <TableCell className="px-3 py-2.5 text-gray-800 font-semibold text-xs">ทายาททางกฎหมาย</TableCell>
                                                                    </TableRow>
                                                                </TableBody>
                                                            </Table>
                                                        </div>
                                                    </div>

                                                </div>

                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Insurance Dialog */}
                    <Dialog open={isInsuranceDialogOpen} onOpenChange={setIsInsuranceDialogOpen}>
                        <DialogContent size="xl" className="p-0 gap-0 overflow-hidden border-border-strong rounded-2xl h-[85vh] flex flex-col">
                            <DialogHeader className="px-6 pt-6 pb-4 shrink-0 bg-white border-b border-gray-100">
                                <DialogTitle>
                                    เลือกประกันเพิ่มเติม
                                </DialogTitle>
                            </DialogHeader>
                            <div className="flex-1 overflow-hidden flex flex-col md:flex-row bg-gray-50/30">
                                {/* Sidebar Filters */}
                                <div className="w-full md:w-56 bg-white border-r border-gray-100 overflow-y-auto shrink-0 shadow-sm flex flex-col">
                                    <div className="p-4 bg-gray-50/50 border-b border-gray-100 shrink-0">
                                        <h3 className="font-bold text-sm text-gray-700 flex items-center justify-between">
                                            ตัวกรอง
                                            {(filterTier.length > 0 || filterRepairType.length > 0 || filterCompany.length > 0) && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 px-2 text-[10px] text-chaiyo-blue"
                                                    onClick={() => {
                                                        setFilterTier([]);
                                                        setFilterRepairType([]);
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
                                                <div className="space-y-2.5">
                                                    {['1', '2+', '3+'].map(tier => (
                                                        <div key={tier} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={`tier-${tier}`}
                                                                checked={filterTier.includes(tier)}
                                                                onCheckedChange={(checked) => {
                                                                    if (checked) {
                                                                        setFilterTier([...filterTier, tier]);
                                                                    } else {
                                                                        setFilterTier(filterTier.filter(t => t !== tier));
                                                                    }
                                                                }}
                                                                className="border-gray-300 data-[state=checked]:border-chaiyo-blue data-[state=checked]:bg-chaiyo-blue data-[state=checked]:text-white"
                                                            />
                                                            <Label htmlFor={`tier-${tier}`} className="cursor-pointer text-sm text-gray-600">ชั้น {tier}</Label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value="repair" className="border-b-0 px-2 border-t border-gray-100 mt-2">
                                            <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3">การซ่อม</AccordionTrigger>
                                            <AccordionContent>
                                                <div className="space-y-2.5">
                                                    {[
                                                        { value: 'ศูนย์', label: 'ซ่อมศูนย์' },
                                                        { value: 'อู่', label: 'ซ่อมอู่' }
                                                    ].map(repair => (
                                                        <div key={repair.value} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={`repair-${repair.value}`}
                                                                checked={filterRepairType.includes(repair.value)}
                                                                onCheckedChange={(checked) => {
                                                                    if (checked) {
                                                                        setFilterRepairType([...filterRepairType, repair.value]);
                                                                    } else {
                                                                        setFilterRepairType(filterRepairType.filter(r => r !== repair.value));
                                                                    }
                                                                }}
                                                                className="border-gray-300 data-[state=checked]:border-chaiyo-blue data-[state=checked]:bg-chaiyo-blue data-[state=checked]:text-white"
                                                            />
                                                            <Label htmlFor={`repair-${repair.value}`} className="cursor-pointer text-sm text-gray-600">{repair.label}</Label>
                                                        </div>
                                                    ))}
                                                </div>
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


                                            <div className="bg-white rounded-none border-y border-gray-200">
                                                <Table>
                                                    <TableHeader className="bg-gray-50/80 sticky top-0 z-10">
                                                        <TableRow className="hover:bg-transparent">
                                                            <TableHead className="w-[50px]"></TableHead>
                                                            <TableHead className="font-medium text-gray-400 text-xs">บริษัทประกัน</TableHead>
                                                            <TableHead className="text-right font-medium text-gray-400 text-xs">ทุนประกันภัย</TableHead>
                                                            <TableHead className="text-right font-medium text-gray-400 text-xs">ค่าเบี้ยประกัน</TableHead>
                                                            <TableHead className="text-right font-medium text-gray-400 text-xs whitespace-nowrap">ผ่อน 0% (12 ด.)</TableHead>
                                                            <TableHead className="text-center font-medium text-gray-400 text-xs">การซ่อม</TableHead>
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
                            <DialogFooter className="px-6 py-3 bg-white border-t border-gray-100 flex flex-row justify-between items-center sm:justify-between shrink-0 z-10">
                                <div className="text-sm font-medium text-gray-600 flex items-center gap-2 leading-tight">
                                    <span className="text-gray-400 text-xs">ค่าเบี้ยประกัน</span>
                                    <span className="text-lg font-black text-chaiyo-blue">{draftInsurances.reduce((total, id) => {
                                        const option = INSURANCE_OPTIONS.find(opt => opt.id === id);
                                        return total + (option ? option.price : 0);
                                    }, 0).toLocaleString()}</span>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" className="h-9 px-4 rounded-lg text-sm text-gray-600 border-gray-200 hover:bg-gray-50" onClick={() => setIsInsuranceDialogOpen(false)}>ยกเลิก</Button>
                                    <Button className="h-9 px-5 rounded-lg bg-chaiyo-blue hover:bg-chaiyo-blue/90 text-white text-sm" onClick={() => {
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
                        <CardContent className="grid grid-cols-1 px-6 pb-6 pt-5">
                            {/* Upload Book Bank Table */}
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <Label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                        อัพโหลดหน้าสมุดบัญชีธนาคาร
                                    </Label>
                                </div>
                                <div className="border border-border-strong rounded-xl overflow-hidden bg-white">
                                    <Table>
                                        <TableHeader className="bg-gray-50/50">
                                            <TableRow className="hover:bg-transparent">
                                                <TableHead className="w-[45%] text-xs">ประเภทเอกสาร/รูปภาพ <span className="text-red-500 text-sm">*</span></TableHead>
                                                <TableHead className="w-[40%] text-xs">ไฟล์ที่อัพโหลด</TableHead>
                                                <TableHead className="w-[15%] text-right text-xs">จัดการ</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow className="hover:bg-transparent">
                                                <TableCell className="py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn(
                                                            "w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0",
                                                            bookBankFile ? "bg-green-50 text-emerald-600" : "bg-gray-100 text-gray-400"
                                                        )}>
                                                            {bookBankFile ? <CheckCircle2 className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                                        </div>
                                                        <span className="font-medium text-gray-700 text-sm whitespace-nowrap">หน้าสมุดบัญชีธนาคาร (Book Bank)</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {bookBankFile ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => window.open(URL.createObjectURL(bookBankFile), '_blank')}
                                                            className="flex items-center gap-1.5 text-xs text-chaiyo-blue font-medium hover:underline cursor-pointer"
                                                        >
                                                            <FileText className="w-3.5 h-3.5" /> 1 ไฟล์
                                                        </button>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground italic">ยังไม่มีไฟล์</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="relative inline-block">
                                                        <Button
                                                            type="button"
                                                            variant={bookBankFile ? "ghost" : "outline"}
                                                            size="sm"
                                                            onClick={() => {
                                                                if (bookBankFile) setIsDeleteDialogOpen(true);
                                                            }}
                                                            className={cn(
                                                                "h-8 text-xs gap-1.5 font-medium relative",
                                                                bookBankFile ? "w-8 p-0 rounded-full text-red-500 hover:text-red-700 hover:bg-red-50" : ""
                                                            )}
                                                            title={bookBankFile ? "ลบไฟล์" : "อัพโหลดไฟล์"}
                                                        >
                                                            {bookBankFile ? <Trash2 className="w-4 h-4" /> : <><Plus className="w-3.5 h-3.5" /> อัพโหลดไฟล์</>}
                                                        </Button>
                                                        {!bookBankFile && (
                                                            <input
                                                                type="file"
                                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                                onChange={(e) => {
                                                                    if (e.target.files && e.target.files.length > 0) {
                                                                        setBookBankFile(e.target.files[0]);
                                                                    }
                                                                }}
                                                                accept="image/*,.pdf"
                                                            />
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                            {/* Bank Account Details */}
                            <div className="space-y-4">
                                {/* Select Bank */}
                                <div className="space-y-1.5">
                                    <Label className="text-sm">ธนาคาร <span className="text-red-500">*</span></Label>
                                    <Select
                                        value={formData?.bankName || ''}
                                        onValueChange={(val) => setFormData?.({ ...formData, bankName: val })}
                                    >
                                        <SelectTrigger className="w-full text-sm">
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
                                        <SelectContent className="max-h-[200px] overflow-y-auto">
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



                                {/* Bank Account Number */}
                                <div className="space-y-1.5">
                                    <Label className="text-sm">เลขที่บัญชี <span className="text-red-500">*</span></Label>
                                    <Input
                                        placeholder="กรอกเลขที่บัญชีธนาคาร"
                                        value={formData?.bankAccountNumber || ''}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const bankName = formData?.bankName;
                                            let finalValue = value;
                                            const numbers = value.replace(/\D/g, '');
                                            if (bankName === 'TRUEMONEY') {
                                                const digits = numbers.slice(0, 10);
                                                if (digits.length > 0) {
                                                    finalValue = digits.slice(0, 3);
                                                    if (digits.length > 3) {
                                                        finalValue += "-" + digits.slice(3, 6);
                                                        if (digits.length > 6) {
                                                            finalValue += "-" + digits.slice(6, 10);
                                                        }
                                                    }
                                                }
                                            } else {
                                                const digits = numbers.slice(0, 10);
                                                if (digits.length > 0) {
                                                    finalValue = digits.slice(0, 3);
                                                    if (digits.length > 3) {
                                                        finalValue += "-" + digits.slice(3, 4);
                                                        if (digits.length > 4) {
                                                            finalValue += "-" + digits.slice(4, 9);
                                                            if (digits.length > 9) {
                                                                finalValue += "-" + digits.slice(9, 10);
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            setFormData?.({ ...formData, bankAccountNumber: finalValue });
                                        }}
                                        className="font-mono text-base"
                                    />
                                </div>
                                {/* Bank Account Name */}
                                <div className="space-y-1.5">
                                    <Label className="text-sm">ชื่อบัญชี <span className="text-red-500">*</span></Label>
                                    <Input
                                        placeholder="ชื่อ-นามสกุล เจ้าของบัญชี"
                                        value={formData?.bankAccountName || ''}
                                        onChange={(e) => setFormData?.({ ...formData, bankAccountName: e.target.value })}
                                    />
                                </div>
                            </div>


                        </CardContent>
                    </Card>


                    {/* Delete Confirmation Dialog */}
                    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>ยืนยันการลบไฟล์</AlertDialogTitle>
                                <AlertDialogDescription>
                                    คุณต้องการลบไฟล์หน้าสมุดบัญชีธนาคารใช่หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>ยกเลิก</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => {
                                        setBookBankFile(null);
                                        setIsDeleteDialogOpen(false);
                                    }}
                                    className="bg-status-rejected hover:bg-status-rejected/90 text-white"
                                >
                                    ยืนยันการลบ
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    {/* Policy Checklist - Last Section */}
                    <PolicyChecklist />

                    {/* Navigation */}
                    <div className="w-full space-y-4 pt-3">
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

                {/* Right Column - Loan Breakdown */}
                <div className="w-full lg:w-[380px] shrink-0">
                    <div className="lg:sticky lg:top-6">
                        {/* Consolidated Receipt Card */}
                        {(() => {
                            const netAmount = amount + (includeInsuranceInLoan ? calculateTotalInsurancePremium() : 0);
                            const hasInsurance = includeInsuranceInLoan && calculateTotalInsurancePremium() > 0;
                            const hasPaInsurance = paInsuranceEnabled;
                            const isFreebieEligible = ['car', 'moto', 'truck', 'agri'].includes(selectedProduct);
                            const income = Number(formData?.income) || 0;
                            const debt = Number(formData?.monthlyDebt) || 0;
                            const netIncome = Math.max(0, income - debt);
                            const payment = Math.ceil(monthlyPayment);
                            const dsrPercentage = netIncome > 0 ? Math.min(100, (payment / netIncome) * 100) : 100;
                            const isSafe = dsrPercentage <= 60;

                            return (
                                <div className="rounded-2xl bg-gray-50/80 p-5 flex flex-col space-y-4">
                                    {/* Header */}
                                    <div className="flex items-center justify-between pb-1">
                                        <p className="text-lg font-bold text-foreground">สรุปสินเชื่อ</p>
                                    </div>

                                    {/* ── Card 1: Loan Info + Insurance (merged) ── */}
                                    <div className="bg-white rounded-2xl p-5 border border-gray-100/50">
                                        {/* Product Tag */}
                                        <div className="mb-2">
                                            <span className="px-2 py-0.5 rounded-full bg-[#0d005f] text-white text-[10px] font-bold tracking-wider">
                                                {displayLoanCode}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-foreground mb-3 leading-tight">{displayLoanName}</h3>




                                        {/* Loan Stats */}
                                        <div className="space-y-2.5">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-500">วงเงิน</span>
                                                <span className="font-bold text-foreground">{amount.toLocaleString()} บาท</span>
                                            </div>

                                        </div>

                                        {/* Insurance (merged into same card) */}
                                        {(hasInsurance || hasPaInsurance) && (
                                            <>
                                                <div className="w-full h-px bg-gray-100 my-4"></div>
                                                <div className="space-y-4">
                                                    {selectedInsurances.map(id => {
                                                        const option = INSURANCE_OPTIONS.find(opt => opt.id === id);
                                                        if (!option) return null;
                                                        return (
                                                            <div key={id}>
                                                                <div className="flex items-center gap-2.5 mb-3">
                                                                    {option.logo ? (
                                                                        <img src={option.logo} alt={option.company} className="w-8 h-8 object-contain rounded-full bg-white border border-gray-50" />
                                                                    ) : (
                                                                        <div className="w-8 h-8 rounded-full bg-[#0d005f] flex items-center justify-center text-white">
                                                                            <ShieldCheck className="w-4 h-4" strokeWidth={2} />
                                                                        </div>
                                                                    )}
                                                                    <div>
                                                                        <p className="font-bold text-foreground text-sm">{option.company || option.label}</p>
                                                                        <p className="text-xs text-gray-400">{option.tier ? `ชั้น ${option.tier}` : ''}{option.repairType ? ` · ซ่อม${option.repairType}` : ''}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-2.5">

                                                                    <div className="flex justify-between items-center text-sm">
                                                                        <span className="text-gray-500">ค่าเบี้ยประกัน</span>
                                                                        <span className="font-bold text-foreground">+{option.price.toLocaleString()} บาท</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}

                                                    {/* PA Insurance in summary */}
                                                    {hasPaInsurance && (
                                                        <div>
                                                            <div className="flex items-center gap-2.5 mb-3">
                                                                <img src="/insurance-logo/Property 1=Theves.png" alt="เทเวศประกันภัย" className="w-8 h-8 object-contain rounded-md shrink-0" />
                                                                <div>
                                                                    <p className="font-bold text-foreground text-sm">เทเวศประกันภัย</p>
                                                                    <p className="text-xs text-gray-400">ประกันอุบัติเหตุส่วนบุคคล · {paInsuranceCoverageMonths} เดือน</p>
                                                                </div>
                                                            </div>
                                                            <div className="space-y-2.5">
                                                                <div className="flex justify-between items-center text-sm">
                                                                    <span className="text-gray-500">ค่าเบี้ยประกัน</span>
                                                                    <span className="font-bold text-foreground">+{PA_INSURANCE_PREMIUM.toLocaleString()} บาท</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* ── Card 2: Summary ── */}
                                    <div className="bg-white rounded-2xl p-5 border border-gray-100/50">
                                        <div className="space-y-2.5 mb-3">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <span className="font-bold text-foreground">วงเงินสุทธิ</span>
                                                    {hasInsurance && <p className="text-[11px] text-gray-400 mt-0.5">*รวมสินเชื่อและประกัน</p>}
                                                </div>
                                                <span className="font-black text-chaiyo-blue text-xl">{netAmount.toLocaleString()} <span className="text-xs font-bold text-chaiyo-blue/60">บาท</span></span>
                                            </div>

                                        </div>
                                        <div className="border-t border-gray-100 pt-3">
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="text-gray-500  text-sm">
                                                        {localPaymentMethod === 'bullet' ? 'ยอดชำระเมื่อครบกำหนด' : 'ค่าผ่อนต่อเดือน'}
                                                    </p>
                                                </div>
                                                <span className="text-foreground text-sm">
                                                    {localPaymentMethod === 'bullet'
                                                        ? (amount + totalInterest).toLocaleString()
                                                        : Math.ceil(monthlyPayment).toLocaleString()} บาท{localPaymentMethod !== 'bullet' ? '/เดือน' : ''}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                    </div>
                </div>
            </div>
        </div >
    );
}
