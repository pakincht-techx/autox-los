"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { FileText, ChevronLeft, ChevronRight, User, Car, Calculator, Check, AlertCircle, CheckCircle, Loader2, ArrowLeft, Save, Send, DollarSign, Info } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

// Steps
import { IdentityCheckStep } from "./steps/IdentityCheckStep";
import { PrivacyConsentStep } from "./steps/PrivacyConsentStep";
import { SensitiveDataConsentStep } from "./steps/SensitiveDataConsentStep";
import { CustomerInfoStep } from "./steps/CustomerInfoStep";
import { IncomeAndDebtStep } from "./steps/IncomeAndDebtStep";
import { CollateralStep } from "./steps/CollateralStepNew"; // New merged step
import { CalculatorStep } from "./steps/CalculatorStep";
import { DocumentUploadStep } from "./steps/DocumentUploadStep";
import { ReviewStep } from "./steps/ReviewStep";
import { ExistingCustomerView } from "./components/ExistingCustomerView";

import { useSidebar } from "@/components/layout/SidebarContext";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/Dialog";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";

// NOTE: Step 1 (Identity) is Screening.
// Application Flow starts at Step 1 (Customer Info).
const ALL_STEPS = [
    { id: 1, title: 'ข้อมูลผู้กู้', description: 'Customer Info', icon: User },
    { id: 2, title: 'หลักประกัน', description: 'Collateral', icon: Car },
    { id: 3, title: 'รายได้และหนี้สิน', description: 'Income & Debt', icon: DollarSign },
    { id: 4, title: 'คำนวณวงเงิน', description: 'Calculator', icon: Calculator },
    { id: 5, title: 'เอกสาร', description: 'Documents', icon: FileText },
    { id: 6, title: 'ตรวจสอบ', description: 'Review', icon: Check },
];

function NewApplicationPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Phase 1: Screening (False) -> Phase 2: Application (True)
    const [isApplicationStarted, setIsApplicationStarted] = useState(false);
    const [appId, setAppId] = useState<string | null>(null);

    // Flag to check if we skipped steps (Existing Customer)
    const [isSkipped, setIsSkipped] = useState(false);

    const [currentStep, setCurrentStep] = useState(1); // Start at 1 (Customer Info)

    const [alertDialog, setAlertDialog] = useState({
        isOpen: false,
        title: "",
        description: "",
        variant: "default" as "default" | "success"
    });

    const [confirmLeaveDialog, setConfirmLeaveDialog] = useState(false);
    const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
    const [submitComment, setSubmitComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Watchlist/Blacklist Status Check State
    const [isCheckingStatus, setIsCheckingStatus] = useState(false);
    const [statusCheckResult, setStatusCheckResult] = useState<"NORMAL" | "WATCHLIST" | "BLACKLIST" | null>(null);
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

    useEffect(() => {
        const state = searchParams.get('state');
        if (state === 'draft') {
            setIsApplicationStarted(true);
            const id = searchParams.get('id');
            if (id) setAppId(id);
        }

        // Check for prefilled data from Sales Talk (Calculator)
        const salesTalkDataStr = localStorage.getItem('salesTalkData');
        if (salesTalkDataStr) {
            try {
                const salesTalkData = JSON.parse(salesTalkDataStr);
                setFormData((prev: any) => ({
                    ...prev,
                    // Collateral Info
                    collateralType: salesTalkData.collateralType || prev.collateralType,
                    appraisalPrice: salesTalkData.appraisalPrice || prev.appraisalPrice,
                    // Vehicle
                    brand: salesTalkData.brand || prev.brand,
                    model: salesTalkData.model || prev.model,
                    year: salesTalkData.year || prev.year,
                    // Land
                    landRai: salesTalkData.landRai || prev.landRai,
                    landNgan: salesTalkData.landNgan || prev.landNgan,
                    landWah: salesTalkData.landWah || prev.landWah,

                    registrationProvince: salesTalkData.province || prev.registrationProvince,

                    // Financial Info
                    income: salesTalkData.income || prev.income,
                    requestedAmount: salesTalkData.loanAmount || salesTalkData.requestedAmount || prev.requestedAmount,
                    requestedDuration: salesTalkData.duration || salesTalkData.requestedDuration || prev.requestedDuration,
                    monthlyDebt: salesTalkData.monthlyDebt || prev.monthlyDebt,
                    occupation: salesTalkData.occupation || prev.occupation,
                }));
                localStorage.removeItem('salesTalkData');

                // Check if consent was already accepted in Sales Talk
                const accepted = localStorage.getItem('isConsentAccepted');
                if (accepted === 'true') {
                    setIsConsentAccepted(true);
                    setAppId("app-256700001"); // Mock ID creation
                    localStorage.removeItem('isConsentAccepted');
                }
            } catch (e) {
                console.error("Failed to parse sales talk data", e);
                localStorage.removeItem('salesTalkData');
            }
        }
    }, [searchParams]);

    const [formData, setFormData] = useState<any>({
        // Initial empty state
        idNumber: "",
        prefix: "",
        firstName: "",
        middleName: "",
        lastName: "",
        gender: "",
        issueDate: "",
        expiryDate: "",
        laserId: "",
        birthDate: "",
        phone: "",
        addressLine1: "",
        houseNumber: "",
        floorNumber: "",
        unitNumber: "",
        village: "",
        moo: "",
        yaek: "",
        trohk: "",
        soi: "",
        subDistrict: "",
        district: "",
        province: "",
        zipCode: "",
        fullAddress: "", // From Identity Check

        // Pre-initialize other addresses to avoid undefined if needed
        currentHouseNumber: "", currentFloorNumber: "", currentUnitNumber: "", currentVillage: "", currentMoo: "", currentYaek: "", currentTrohk: "", currentSoi: "",
        shippingHouseNumber: "", shippingFloorNumber: "", shippingUnitNumber: "", shippingVillage: "", shippingMoo: "", shippingYaek: "", shippingTrohk: "", shippingSoi: "",
        workHouseNumber: "", workFloorNumber: "", workUnitNumber: "", workVillage: "", workMoo: "", workYaek: "", workTrohk: "", workSoi: "",

        income: 0,
        requestedAmount: 0,
        requestedDuration: 0,
        loanPurpose: "",
        collateralType: "",
        existingAssetId: null,

        // Co-borrower & Guarantor
        coBorrowers: [],
        guarantors: [],
    });

    // New State for Branching Logic
    const [isExistingCustomer, setIsExistingCustomer] = useState(false);
    const [existingProfile, setExistingProfile] = useState<any>(null);
    const [isIdentityVerified, setIsIdentityVerified] = useState(false);
    const [isConsentAccepted, setIsConsentAccepted] = useState(false);
    const [isSensitiveConsentAccepted, setIsSensitiveConsentAccepted] = useState(false);

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
            return ALL_STEPS; // For simplicity, show all but jump.
        }
        return ALL_STEPS;
    };

    const visibleSteps = getVisibleSteps();

    const nextStep = () => {
        // If we are on Step 1 (Customer Info), intercept and perform status check
        if (currentStep === 1) {
            handleStatusCheck();
            return;
        }

        proceedToNextStep();
    };

    const proceedToNextStep = () => {
        // Find current index in visibleSteps
        const currentIndex = visibleSteps.findIndex(s => s.id === currentStep);
        if (currentIndex < visibleSteps.length - 1) {
            setCurrentStep(visibleSteps[currentIndex + 1].id);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleStatusCheck = () => {
        setIsCheckingStatus(true);
        setIsStatusDialogOpen(true);
        setStatusCheckResult(null);

        // Simulate API call for checking status
        setTimeout(() => {
            let result: "NORMAL" | "WATCHLIST" | "BLACKLIST" = "NORMAL";
            const idToTest = formData.idNumber || "";

            // Mock Logic
            if (idToTest.endsWith('888')) {
                result = "BLACKLIST";
            } else if (idToTest.endsWith('777')) {
                result = "WATCHLIST";
            }

            setStatusCheckResult(result);
            setIsCheckingStatus(false);

            if (result === "NORMAL") {
                // If normal, briefly show success then automatically proceed
                setTimeout(() => {
                    setIsStatusDialogOpen(false);
                    proceedToNextStep();
                }, 1000);
            }
        }, 1500);
    };

    const handleSubmitToTeam = () => {
        setAlertDialog({
            isOpen: true,
            title: "ส่งเรื่องตรวจสอบสำเร็จ",
            description: "ข้อมูลถูกส่งไปยังทีม Fraud/Legal/Compliance เรียบร้อยแล้ว",
            variant: "success"
        });

        // Pass a query parameter so the detail page knows to show an activity log
        const source = statusCheckResult?.toLowerCase();
        setTimeout(() => router.push(`/dashboard/applications/${appId || "app-new"}?source=${source}`), 1500);
    };

    const prevStep = () => {
        const currentIndex = visibleSteps.findIndex(s => s.id === currentStep);
        if (currentIndex > 0) {
            setCurrentStep(visibleSteps[currentIndex - 1].id);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const jumpToStep = (step: number) => {
        // Allow jumping only if it's in visible steps
        if (visibleSteps.find(s => s.id === step)) {
            setCurrentStep(step);
            window.scrollTo({ top: 0, behavior: "smooth" });
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
                middleName: profile.fullName.split(" ").length > 3 ? profile.fullName.split(" ")[2] : "",
                lastName: profile.fullName.split(" ").slice(-1)[0] || "",
            }));
        } else {
            // "Create Profile" clicked -> Start Application
            setIsApplicationStarted(true);
            setAppId("app-256700002");
            setCurrentStep(1); // Start at Customer Info
        }
        setIsIdentityVerified(true);
    };

    const startApplication = () => {
        setIsApplicationStarted(true);
        if (!appId) setAppId("app-256700001");
        setCurrentStep(1); // Start at Customer Info
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
            setCurrentStep(2); // Move to Collateral Info (Step 2 now)
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
        if (!appId) setAppId("app-256700001");
        setCurrentStep(4); // Jump to Calculator (Step 4 now)
    };

    const { setBreadcrumbs, setRightContent } = useSidebar();

    useEffect(() => {
        setBreadcrumbs([
            {
                label: "รายการคำขอ",
                onClick: () => {
                    setConfirmLeaveDialog(true);
                }
            },
            { label: isApplicationStarted && appId ? appId : "สร้างใบคำขอ", isActive: true }
        ]);

        if (isApplicationStarted) {
            setRightContent(
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={() => toast.success("บันทึกแบบร่างสำเร็จ", {
                            description: "ข้อมูลใบคำขอของคุณถูกบันทึกเรียบร้อยแล้ว",
                            duration: 3000,
                        })}
                    >
                        <Save className="w-4 h-4 mr-2" /> บันทึกแบบร่าง
                    </Button>
                    <Button
                        variant="default"
                        onClick={() => setIsSubmitDialogOpen(true)}
                    >
                        <Send className="w-4 h-4 mr-2" /> ส่งใบคำขอ
                    </Button>
                </div>
            );
        } else {
            setRightContent(null);
        }

        return () => {
            setBreadcrumbs([]);
            setRightContent(null);
        };
    }, [isApplicationStarted, appId, setBreadcrumbs, setRightContent]);

    const isStepValid = () => {
        return true;
    };

    const handleSubmit = () => {
        setAlertDialog({
            isOpen: true,
            title: "ส่งคำขอสำเร็จ",
            description: "ใบคำขอสินเชื่อถูกส่งเรียบร้อยแล้ว! ระบบกำลังดำเนินการพิจารณา",
            variant: "success"
        });
        setTimeout(() => router.push("/dashboard/applications"), 1500);
    };

    return (
        <div className="h-full bg-sidebar">
            <div className="max-w-7xl mx-auto space-y-6 p-6 lg:px-8 lg:py-6 pb-32">
                {/* Header Title Section */}
                <div className="px-2">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-chaiyo-blue to-blue-800">
                        {isApplicationStarted ? `ใบคำขอเลขที่ ${appId}` : "ตรวจสอบสถานะลูกค้า"}
                    </h1>
                    <p className="text-muted mt-1">
                        {!isApplicationStarted
                            ? "ขั้นตอนการตรวจสอบข้อมูลและสถานะของลูกค้า"
                            : "กรอกข้อมูลผู้สมัครและยื่นเอกสารเพื่อพิจารณาสินเชื่อ"
                        }
                    </p>
                </div>

                {/* PHASE 1: SCREENING (No Stepper) */}
                {!isApplicationStarted && (
                    <div className="animate-in fade-in zoom-in-95 duration-500">
                        <Card className="min-h-[500px] border border-border-subtle shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] bg-white overflow-hidden">
                            <CardContent className="p-10">
                                {/* 0. Privacy Consent (First Step) */}
                                {!isConsentAccepted && (
                                    <PrivacyConsentStep
                                        onAccept={() => setIsConsentAccepted(true)}
                                        collateralType={formData.collateralType}
                                    />
                                )}

                                {/* 0.5 Sensitive Data Consent (Second Step) */}
                                {(isConsentAccepted && !isSensitiveConsentAccepted) && (
                                    <SensitiveDataConsentStep
                                        onAccept={() => setIsSensitiveConsentAccepted(true)}
                                        onBack={() => setIsConsentAccepted(false)}
                                    />
                                )}

                                {/* 1. Identity Check (After Both Consents) */}
                                {(isConsentAccepted && isSensitiveConsentAccepted && !isIdentityVerified) && (
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
                                <Card className="min-h-[600px] border border-border-subtle shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] bg-white">

                                    {/* HORIZONTAL STEPPER (Integrated) */}
                                    <div className="pt-10 pb-12 border-b border-border-subtle bg-gray-50/5 rounded-t-[2rem]">
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

                                        {/* Step 1: Customer Info */}
                                        {currentStep === 1 && (
                                            <CustomerInfoStep
                                                formData={formData}
                                                setFormData={setFormData}
                                            />
                                        )}

                                        {/* Step 2: Collateral (Merged: Type Selection + Document Upload + Info) */}
                                        {currentStep === 2 && (
                                            <CollateralStep
                                                formData={formData}
                                                setFormData={setFormData}
                                                isExistingCustomer={isExistingCustomer}
                                                existingCollaterals={isExistingCustomer ? MOCK_EXISTING_COLLATERALS : []}
                                            />
                                        )}

                                        {/* Step 3: Income and Debt */}
                                        {currentStep === 3 && (
                                            <IncomeAndDebtStep
                                                formData={formData}
                                                setFormData={setFormData}
                                                isExistingCustomer={isExistingCustomer}
                                            />
                                        )}

                                        {/* Step 4: Calculator */}
                                        {currentStep === 4 && (
                                            <CalculatorStep
                                                onNext={nextStep}
                                                formData={formData}
                                                setFormData={setFormData}
                                                onBack={prevStep}
                                                hideNavigation={true}
                                                readOnlyProduct={false}
                                            />
                                        )}

                                        {/* Step 5: Documents */}
                                        {currentStep === 5 && <DocumentUploadStep formData={formData} setFormData={setFormData} />}

                                        {/* Step 6: Review */}
                                        {currentStep === 6 && (
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
                                {(currentStep !== 6) && (
                                    <div className="flex justify-between items-center py-6 mt-2">
                                        <Button
                                            variant="ghost"
                                            onClick={prevStep}
                                            disabled={currentStep === 1} // Disabled at Step 1 (Customer Info)
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

                <AlertDialog open={alertDialog.isOpen} onOpenChange={(open) => setAlertDialog({ ...alertDialog, isOpen: open })}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                                    alertDialog.variant === "success" ? "bg-green-100" : "bg-red-100"
                                )}>
                                    {alertDialog.variant === "success" ? (
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <AlertCircle className="w-5 h-5 text-red-600" />
                                    )}
                                </div>
                                <AlertDialogTitle className="text-lg">{alertDialog.title}</AlertDialogTitle>
                            </div>
                            <AlertDialogDescription className="text-base mt-2">
                                {alertDialog.description}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogAction onClick={() => setAlertDialog(prev => ({ ...prev, isOpen: false }))}>
                                ตกลง
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Watchlist/Blacklist Status Check Dialog */}
                <Dialog open={isStatusDialogOpen} onOpenChange={(open) => {
                    if (!open && !isCheckingStatus) {
                        setIsStatusDialogOpen(false);
                    }
                }}>
                    <DialogContent className="sm:max-w-xl rounded-[2rem] p-8">
                        {!statusCheckResult || isCheckingStatus ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <Loader2 className="h-12 w-12 text-chaiyo-blue animate-spin mb-6" />
                                <DialogHeader className="space-y-2 flex flex-col items-center">
                                    <DialogTitle className="text-xl font-bold text-gray-900">กำลังตรวจสอบสถานะลูกค้า...</DialogTitle>
                                    <DialogDescription className="text-base text-gray-500 text-center">
                                        ระบบกำลังตรวจสอบข้อมูลผู้สมัครกับฐานข้อมูล<br />กรุณารอสักครู่
                                    </DialogDescription>
                                </DialogHeader>
                            </div>
                        ) : statusCheckResult === "NORMAL" ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle className="h-10 w-10 text-emerald-500" />
                                </div>
                                <DialogHeader className="space-y-2 flex flex-col items-center">
                                    <DialogTitle className="text-xl font-bold text-gray-900">สถานะปกติ</DialogTitle>
                                    <DialogDescription className="text-base text-gray-500 text-center">
                                        ตรวจสอบสำเร็จ กำลังไปสู่ขั้นตอนถัดไป...
                                    </DialogDescription>
                                </DialogHeader>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                <DialogHeader className="flex flex-col items-center text-center space-y-4">
                                    <div className="h-16 w-16 flex items-center justify-center rounded-full bg-amber-50 shrink-0">
                                        <AlertCircle className="h-10 w-10 text-amber-600" />
                                    </div>
                                    <div className="space-y-2 flex flex-col items-center">
                                        <DialogTitle className="text-xl font-bold text-gray-900">
                                            พบข้อมูลต้องสงสัย ({statusCheckResult})
                                        </DialogTitle>
                                        <DialogDescription className="text-base text-gray-500 text-center">
                                            ข้อมูลลูกค้าตรงกับฐานข้อมูลแจ้งเตือน กรุณาเตรียมข้อมูลหรือเอกสารสำหรับตรวจสอบเพิ่มเติม
                                        </DialogDescription>
                                    </div>
                                </DialogHeader>

                                <div className="bg-amber-50 p-6 rounded-2xl text-amber-800 border border-amber-100">
                                    <p className="flex items-start gap-3">
                                        <Info className="w-5 h-5 shrink-0 mt-0.5" />
                                        <span>
                                            <strong className="block mb-1">คำแนะนำในการดำเนินการ:</strong>
                                            ระบบจะบันทึกสถานะนี้เพื่อประกอบการพิจารณา ท่านสามารถดำเนินการต่อได้ แต่ควรเตรียมเอกสารเพิ่มเติมที่เกี่ยวข้อง
                                        </span>
                                    </p>
                                </div>

                                <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
                                    <Button
                                        variant="outline"
                                        size="xl"
                                        onClick={() => setIsStatusDialogOpen(false)}
                                        className="flex-1 order-2 sm:order-1 font-bold"
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-2" />
                                        กลับไปตรวจสอบ
                                    </Button>
                                    <Button
                                        size="xl"
                                        onClick={() => {
                                            setIsStatusDialogOpen(false);
                                            proceedToNextStep();
                                        }}
                                        className="flex-[2] order-1 sm:order-2 font-bold bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-200 text-white"
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        รับทราบและดำเนินการต่อ
                                    </Button>
                                </DialogFooter>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Confirm Leave Dialog */}
                <AlertDialog open={confirmLeaveDialog} onOpenChange={setConfirmLeaveDialog}>
                    <AlertDialogContent className="rounded-[2rem] p-8">
                        <AlertDialogHeader>
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                                    <AlertCircle className="w-6 h-6 text-amber-600" />
                                </div>
                                <AlertDialogTitle className="text-xl">ออกจากระบบการขอสินเชื่อ?</AlertDialogTitle>
                            </div>
                            <AlertDialogDescription className="text-base mt-2">
                                ข้อมูลที่คุณกรอกไว้และยังไม่ได้บันทึกอาจจะสูญหาย คุณแน่ใจหรือไม่ว่าต้องการออกจากหน้านี้?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-6 gap-3">
                            <AlertDialogCancel className={cn(buttonVariants({ variant: "outline" }), "min-w-[120px]")}>
                                ยกเลิก
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => router.push("/dashboard/applications")}
                                className={cn(buttonVariants({ variant: "destructive" }), "min-w-[120px]")}
                            >
                                ยืนยันการออก
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Submit Application Dialog */}
                <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
                    <DialogContent className="rounded-[2rem] p-8 max-w-md">
                        <DialogHeader>
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                    <Send className="w-6 h-6 text-chaiyo-blue" />
                                </div>
                                <DialogTitle className="text-xl">ส่งใบคำขอสินเชื่อ</DialogTitle>
                            </div>
                            <DialogDescription className="text-base mt-2">
                                กรุณาระบุหมายเหตุหรือคำแนะนำเพิ่มเติมสำหรับการส่งพิจารณาใบคำขอนี้
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="comment" className="text-sm text-gray-700">หมายเหตุ / ความเห็นเพิ่มเติม</Label>
                                <Textarea
                                    id="comment"
                                    placeholder="ระบุรายละเอียดเพิ่มเติมที่นี่..."
                                    value={submitComment}
                                    onChange={(e) => setSubmitComment(e.target.value)}
                                    className="min-h-[120px] resize-none"
                                />
                            </div>
                        </div>

                        <DialogFooter className="mt-2 gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setIsSubmitDialogOpen(false)}
                                className="flex-1"
                            >
                                ยกเลิก
                            </Button>
                            <Button
                                onClick={() => {
                                    setIsSubmitting(true);
                                    // Mock submission delay
                                    setTimeout(() => {
                                        setIsSubmitting(false);
                                        setIsSubmitDialogOpen(false);
                                        toast.success("ส่งใบคำขอสำเร็จ", {
                                            description: "ใบคำขอของคุณถูกส่งเข้าสู่ระบบการพิจารณาแล้ว",
                                        });
                                        // Redirect to detail page (mocking ID)
                                        router.push(`/dashboard/applications/${appId || 'app-256700001'}`);
                                    }, 1500);
                                }}
                                variant="default"
                                className="flex-1"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        กำลังส่ง...
                                    </>
                                ) : (
                                    "ยืนยันการส่ง"
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div >
    );
}

export default function NewApplicationPage() {
    return (
        <Suspense fallback={<div className="flex justify-center flex-col items-center h-full min-h-[50vh]"><Loader2 className="w-8 h-8 animate-spin text-chaiyo-blue mb-4" /><p className="text-gray-500">กำลังโหลด...</p></div>}>
            <NewApplicationPageContent />
        </Suspense>
    );
}
