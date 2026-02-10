"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { ArrowLeft, Check, ChevronRight, User, FileText, Banknote, ShieldCheck, ChevronLeft, Save, Car, CreditCard, MessageSquare, Calculator, Camera } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

// Steps
import { IdentityCheckStep } from "./steps/IdentityCheckStep";
import { CollateralPhotoStep } from "./steps/CollateralPhotoStep";
// import { PersonalInfoStep } from "./steps/PersonalInfoStep"; // Merged into others or unused? Keeping commented to avoid break if user wants it later
import { CollateralStep } from "./steps/CollateralStep";
import { IncomeStep } from "./steps/IncomeStep";
import { CalculatorStep } from "./steps/CalculatorStep";
import { DocumentUploadStep } from "./steps/DocumentUploadStep";
import { ReviewStep } from "./steps/ReviewStep";
import { CustomerNeedsStep } from "./steps/CustomerNeedsStep"; // [NEW]
import { ExistingCustomerView } from "./components/ExistingCustomerView";

// NOTE: Step 1 (Identity) is Screening.
// Application Flow starts at Step 1 (Customer Needs).
const ALL_STEPS = [
    { id: 1, title: 'ความต้องการลูกค้า', description: 'Customer Needs', icon: MessageSquare }, // [NEW]
    { id: 2, title: 'ถ่ายภาพทรัพย์สิน', description: 'Collateral Photos', icon: Camera },
    { id: 3, title: 'ข้อมูลหลักประกัน', description: 'Collateral Info', icon: Car },
    { id: 4, title: 'รายได้/อาชีพ', description: 'Income', icon: Banknote }, // Moved up before Calculator
    { id: 5, title: 'คำนวณวงเงิน', description: 'Calculator', icon: Calculator },
    { id: 6, title: 'เอกสาร', description: 'Documents', icon: FileText },
    { id: 7, title: 'ตรวจสอบ', description: 'Review', icon: Check },
];

export default function NewApplicationPage() {
    const router = useRouter();

    // Phase 1: Screening (False) -> Phase 2: Application (True)
    const [isApplicationStarted, setIsApplicationStarted] = useState(false);

    // Flag to check if we skipped steps (Existing Customer)
    const [isSkipped, setIsSkipped] = useState(false);

    const [currentStep, setCurrentStep] = useState(1); // Start at 1 (Customer Needs)

    const [formData, setFormData] = useState<any>({
        // Initial empty state
        idNumber: "",
        prefix: "",
        firstName: "",
        lastName: "",
        birthDate: "",
        addressLine1: "",
        subDistrict: "",
        district: "",
        province: "",
        zipCode: "",
        income: 0,
        requestedAmount: 0,
        requestedDuration: 0,
        loanPurpose: "",
        collateralType: "",
        existingAssetId: null,
    });

    // New State for Branching Logic
    const [isExistingCustomer, setIsExistingCustomer] = useState(false);
    const [existingProfile, setExistingProfile] = useState<any>(null);
    const [isIdentityVerified, setIsIdentityVerified] = useState(false);

    // Mock Assets & Loans - Shared for Existing Customers
    const assetsWithLoans = [
        {
            id: "A-001",
            type: "Toyota Camry 2020",
            plate: "9กข 9999",
            assetType: "car",
            estimatedValue: 750000,
            maxLtvLimit: 675000, // 90% LTV
            loans: [
                { id: "L-2566001", type: "สินเชื่อจำนำทะเบียนรถ", balance: 145000, status: "Normal", installment: 6500, totalMonths: 48, paidMonths: 12, totalAmount: 312000, nextPaymentDate: "15 ก.พ. 69" },
            ]
        },
        {
            id: "A-002",
            type: "Honda Wave 125i",
            plate: "1กค 1234",
            assetType: "moto",
            estimatedValue: 45000,
            maxLtvLimit: 40500,
            loans: []
        },
        {
            id: "UNSECURED",
            type: "สินเชื่อไม่มีหลักประกัน",
            assetType: "unsecured",
            loans: [
                { id: "L-2565089", type: "สินเชื่อส่วนบุคคล", balance: 12000, status: "Normal", installment: 2100, totalMonths: 24, paidMonths: 18, totalAmount: 50400, nextPaymentDate: "28 ก.พ. 69" },
                { id: "L-2566110", type: "สินเชื่อนาโนไฟแนนซ์", balance: 8500, status: "Normal", installment: 1200, totalMonths: 18, paidMonths: 10, totalAmount: 21600, nextPaymentDate: "05 มี.ค. 69" },
            ]
        }
    ];

    const MOCK_EXISTING_COLLATERALS = assetsWithLoans.filter(a => a.assetType !== 'unsecured').map(a => ({
        id: a.id,
        type: a.assetType,
        brand: a.type.split(" ")[0],
        model: a.type.split(" ").slice(1).join(" "),
        licensePlate: a.plate,
        status: a.loans.length > 0 ? "Pledged" : "Free"
    }));

    // Dynamic Steps Calculation
    const getVisibleSteps = () => {
        if (isSkipped) {
            // If skipped, maybe hide Needs/Collateral?
            // For now, keep logic consistent with user request or simplify.
            // If existing customer skipped, they probably went straight to Calculator (Step 2).
            // Let's assume skipping hides CustomerNeeds (1) and Collateral (3)?
            // User request logic: "Existing Customer... skip to Calculator".

            // If skipped to Calculator (Step 2), we might hide Step 1?
            return ALL_STEPS; // For simplicity, show all but jump.
        }
        return ALL_STEPS;
    };

    const visibleSteps = getVisibleSteps();

    const nextStep = () => {
        // Find current index in visibleSteps
        const currentIndex = visibleSteps.findIndex(s => s.id === currentStep);
        if (currentIndex < visibleSteps.length - 1) {
            setCurrentStep(visibleSteps[currentIndex + 1].id);
        }
    };

    const prevStep = () => {
        const currentIndex = visibleSteps.findIndex(s => s.id === currentStep);
        if (currentIndex > 0) {
            setCurrentStep(visibleSteps[currentIndex - 1].id);
        }
    };

    const jumpToStep = (step: number) => {
        // Allow jumping only if it's in visible steps
        if (visibleSteps.find(s => s.id === step)) {
            setCurrentStep(step);
        }
    };

    // Handler for Identity Check Completion
    const handleIdentityCheckNext = (isExisting: boolean, profile: any) => {
        setIsExistingCustomer(isExisting);
        if (isExisting) {
            setExistingProfile(profile);
            // Pre-fill form data with existing profile if needed
            setFormData((prev: any) => ({
                ...prev,
                firstName: profile.fullName.split(" ")[1] || "",
                lastName: profile.fullName.split(" ")[2] || "",
            }));
        } else {
            // "Create Profile" clicked -> Start Application (Go to Customer Needs)
            setIsApplicationStarted(true);
            setCurrentStep(1); // Start at Customer Needs
        }
        setIsIdentityVerified(true);
    };

    const startApplication = () => {
        setIsApplicationStarted(true);
        setCurrentStep(1); // Start at Customer Needs
        setIsSkipped(false);
    };

    // AI Analysis State
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // MOCK AI ANALYSIS
    const handleAnalyzePhotos = () => {
        setIsAnalyzing(true);

        // Simulate AI Processing Time
        setTimeout(() => {
            // Mock Extracted Data based on collateral type
            const mockExtractedData = {
                brand: "Toyota",
                model: "Hilux Revo",
                year: "2022",
                licensePlate: "1กไ 9999",
                color: "ขาว",
                mileage: "45000",
                appraisalPrice: 450000, // AI Appraisal Result
            };

            setFormData((prev: any) => ({
                ...prev,
                ...mockExtractedData
            }));

            setIsAnalyzing(false);
            setCurrentStep(3); // Move to Collateral Info
        }, 3000); // 3 seconds delay
    };

    // NEW: Handler to skip to Calculator for Existing Customers
    const handleSkipToCalculator = () => {
        // Pre-fill COMPLETE mock data for existing customer
        setFormData((prev: any) => ({
            ...prev,
            // Personal
            prefix: "นาย",
            birthDate: "1990-01-01",
            addressLine1: "123 หมู่ 1",
            subDistrict: "ลาดพร้าว",
            district: "ลาดพร้าว",
            province: "กรุงเทพมหานคร",
            zipCode: "10230",

            // Collateral (Use one of the existing ones as default)
            existingAssetId: "A-002",
            collateralType: "moto",
            collateralBrand: "Honda",
            collateralModel: "Wave 125i",
            collateralYear: "2020",
            collateralLicense: "1กค 1234",

            // Needs
            loanPurpose: "personal",
            requestedAmount: 20000,

            // Income
            income: 40000,
            occupation: "พนักงานบริษัท",
            salary: 35000,
            otherIncome: 5000,
            expense: 15000,
        }));

        setIsSkipped(true);
        setIsApplicationStarted(true);
        setCurrentStep(2); // Jump to Calculator (Step 2 now)
    };

    const isStepValid = () => {
        return true;
    };

    const handleSubmit = () => {
        alert("ใบคำขอสินเชื่อถูกส่งเรียบร้อยแล้ว! (Demo)");
        router.push("/dashboard/applications");
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 pt-8 pb-32 px-4 shadow-none">
            {/* Header - Always Visible */}
            <div className="flex justify-between items-center px-2">
                <div>
                    <Button variant="ghost" onClick={() => router.back()} className="pl-0 text-muted hover:text-foreground mb-2">
                        <ArrowLeft className="w-4 h-4 mr-2" /> กลับไปหน้าแดชบอร์ด
                    </Button>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-chaiyo-blue to-blue-800">
                        {isApplicationStarted ? "สร้างใบคำขอ" : "ตรวจสอบสถานะลูกค้า"}
                    </h1>
                    <p className="text-muted mt-1">
                        {!isApplicationStarted
                            ? "ขั้นตอนการตรวจสอบข้อมูลและสถานะของลูกค้า"
                            : "กรอกข้อมูลผู้สมัครและยื่นเอกสารเพื่อพิจารณาสินเชื่อ"
                        }
                    </p>
                </div>
                <div className="flex gap-3">
                    {/* Save Draft Button */}
                    <Button
                        variant="outline"
                        onClick={() => alert("บันทึกแบบร่างเรียบร้อยแล้ว")}
                        className="bg-white border-chaiyo-blue text-chaiyo-blue hover:bg-blue-50"
                    >
                        <Save className="w-4 h-4 mr-2" /> บันทึกแบบร่าง
                    </Button>
                </div>
            </div>

            {/* PHASE 1: SCREENING (No Stepper) */}
            {!isApplicationStarted && (
                <div className="animate-in fade-in zoom-in-95 duration-500">
                    <Card className="min-h-[500px] border border-border-subtle shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] bg-white overflow-hidden">
                        <CardContent className="p-10">
                            {/* 1. Identity Check */}
                            {!isIdentityVerified && (
                                <IdentityCheckStep
                                    formData={formData}
                                    setFormData={setFormData}
                                    onNext={handleIdentityCheckNext}
                                />
                            )}

                            {/* 2. Existing Customer View (Still in Pre-App Phase) */}
                            {(isIdentityVerified && isExistingCustomer) && (
                                <ExistingCustomerView
                                    profile={existingProfile}
                                    assetsWithLoans={assetsWithLoans}
                                    onProceed={startApplication}
                                    onSkipToCalculator={handleSkipToCalculator}
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* PHASE 2: APPLICATION (With Vertical Stepper) */}
            {isApplicationStarted && (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">

                    <div className="flex flex-col gap-8 items-start">
                        {/* MAIN CONTENT (Full Width now) */}
                        <div className="flex-1 w-full min-w-0">
                            <Card className="min-h-[600px] border border-border-subtle shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] bg-white overflow-hidden">

                                {/* HORIZONTAL STEPPER (Integrated) */}
                                <div className="pt-10 pb-12 border-b border-border-subtle bg-gray-50/5">
                                    <div className="relative flex items-center justify-between w-full px-12 md:px-24">
                                        <div className="absolute left-12 right-12 md:left-24 md:right-24 top-1/2 -translate-y-1/2 h-[2px] bg-gray-300 z-0">
                                            <div
                                                className="h-full bg-chaiyo-gold transition-all duration-500 ease-in-out"
                                                style={{
                                                    width: `${((visibleSteps.findIndex(s => s.id === currentStep)) / (Math.max(visibleSteps.length - 1, 1))) * 100}%`
                                                }}
                                            ></div>
                                        </div>

                                        {visibleSteps.map((step) => {
                                            const isActive = step.id === currentStep;
                                            const isCompleted = ALL_STEPS.indexOf(step) < ALL_STEPS.findIndex(s => s.id === currentStep);

                                            return (
                                                <div key={step.id} className="flex flex-col items-center gap-2 relative">
                                                    <div className={cn(
                                                        "w-7 h-7 rounded-full border-2 flex items-center justify-center bg-white z-10 transition-all duration-300",
                                                        isActive ? "border-chaiyo-gold animate-calm-pulse text-chaiyo-blue" :
                                                            isCompleted ? "bg-chaiyo-gold border-chaiyo-gold text-blue-900 shadow-sm shadow-chaiyo-gold/20" : "border-gray-200 text-gray-300"
                                                    )}>
                                                        <step.icon className="w-3.5 h-3.5" />
                                                    </div>
                                                    <div className="absolute top-9 w-32 text-center">
                                                        <p className={cn("text-[10px] md:text-xs font-bold", isActive ? "text-chaiyo-blue" : isCompleted ? "text-foreground" : "text-muted-foreground")}>
                                                            {step.title}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <CardHeader className="border-b border-border-subtle px-10 py-6 bg-gray-50/30">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-lg text-foreground flex items-center gap-2">
                                                <span className="w-8 h-8 rounded-lg bg-chaiyo-gold/10 text-chaiyo-gold flex items-center justify-center text-sm font-bold">
                                                    {/* Show functional step number (1-index in visible checklist) */}
                                                    {visibleSteps.findIndex(s => s.id === currentStep) + 1}
                                                </span>
                                                {ALL_STEPS.find(s => s.id === currentStep)?.title}
                                            </CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="px-8 py-8 w-full">

                                    {/* Step 1: Customer Needs */}
                                    {currentStep === 1 && (
                                        <CustomerNeedsStep
                                            formData={formData}
                                            setFormData={setFormData}
                                            isExistingCustomer={isExistingCustomer}
                                            existingAssets={assetsWithLoans}
                                        />
                                    )}

                                    {/* Step 2: [NEW] Collateral Photos */}
                                    {currentStep === 2 && (
                                        <CollateralPhotoStep
                                            formData={formData}
                                            setFormData={setFormData}
                                            onAnalyze={handleAnalyzePhotos}
                                            isAnalyzing={isAnalyzing}
                                        />
                                    )}

                                    {/* Step 3: Collateral Info (Pre-filled) */}
                                    {currentStep === 3 && (
                                        <CollateralStep
                                            formData={formData}
                                            setFormData={setFormData}
                                            isExistingCustomer={isExistingCustomer}
                                            existingCollaterals={isExistingCustomer ? MOCK_EXISTING_COLLATERALS : []}
                                        />
                                    )}

                                    {/* Step 4: Income (Moved before Calculator) */}
                                    {currentStep === 4 && <IncomeStep formData={formData} setFormData={setFormData} />}

                                    {/* Step 5: Calculator */}
                                    {currentStep === 5 && (
                                        <CalculatorStep
                                            onNext={nextStep}
                                            formData={formData}
                                            setFormData={setFormData}
                                            onBack={prevStep}
                                            hideNavigation={true}
                                            readOnlyProduct={false}
                                        />
                                    )}

                                    {/* Step 6: Documents */}
                                    {currentStep === 6 && <DocumentUploadStep formData={formData} setFormData={setFormData} />}

                                    {/* Step 7: Review */}
                                    {currentStep === 7 && (
                                        <ReviewStep
                                            formData={formData}
                                            setFormData={setFormData}
                                            onSubmit={handleSubmit}
                                            onEdit={jumpToStep}
                                        />
                                    )}
                                </CardContent>
                            </Card>

                            {/* Footer / Navigation */}
                            {(currentStep !== 7) && (
                                <div className="flex justify-between items-center py-6 mt-2">
                                    <Button
                                        variant="ghost"
                                        onClick={prevStep}
                                        disabled={currentStep === 1} // Disabled at Step 1 (Customer Needs)
                                        className="w-32 text-muted hover:bg-gray-100"
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-2" /> ย้อนกลับ
                                    </Button>

                                    <Button
                                        variant="default"
                                        onClick={nextStep}
                                        disabled={!isStepValid()}
                                        className="w-32 shadow-lg shadow-blue-500/20"
                                    >
                                        ถัดไป <ChevronRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
