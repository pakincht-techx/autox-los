"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";
import { useRouter, usePathname, useSearchParams, useParams } from "next/navigation";
import { User, Car, Calculator, FileText, Check } from "lucide-react";
import { BahtSign } from "@/components/icons/BahtSign";

// ─── Step Definitions ────────────────────────────────────────────────────────

/** All steps in the full flow, in order */
export const ALL_FLOW_STEPS = [
    { slug: 'privacy-notice', getPath: () => '/dashboard/new-application/privacy-notice', phase: 'screening' as const },
    { slug: 'sensitive-data', getPath: () => '/dashboard/new-application/sensitive-data', phase: 'screening' as const },
    { slug: 'identity-checker', getPath: () => '/dashboard/new-application/identity-checker', phase: 'screening' as const },
    { slug: 'salesheet', getPath: () => '/dashboard/new-application/salesheet', phase: 'screening' as const },
    { slug: 'customer-info', getPath: (id: string) => `/dashboard/new-application/${id || 'draft'}/customer-info`, phase: 'application' as const },
    { slug: 'collateral-info', getPath: (id: string) => `/dashboard/new-application/${id || 'draft'}/collateral-info`, phase: 'application' as const },
    { slug: 'income', getPath: (id: string) => `/dashboard/new-application/${id || 'draft'}/income`, phase: 'application' as const },
    { slug: 'debt', getPath: (id: string) => `/dashboard/new-application/${id || 'draft'}/debt`, phase: 'application' as const },
    { slug: 'guarantors', getPath: (id: string) => `/dashboard/new-application/${id || 'draft'}/guarantors`, phase: 'application' as const },
    { slug: 'loan-calculator', getPath: (id: string) => `/dashboard/new-application/${id || 'draft'}/loan-calculator`, phase: 'application' as const },
    { slug: 'documents', getPath: (id: string) => `/dashboard/new-application/${id || 'draft'}/documents`, phase: 'application' as const },
    { slug: 'review', getPath: (id: string) => `/dashboard/new-application/${id || 'draft'}/review`, phase: 'application' as const },
];

/** Application phase steps — used by the stepper UI */
export const APPLICATION_STEPS = [
    { id: 1, slug: 'customer-info', title: 'ข้อมูลผู้กู้', description: 'Customer Info', icon: User },
    { id: 2, slug: 'collateral-info', title: 'หลักประกัน', description: 'Collateral', icon: Car },
    { id: 3, slug: 'income', title: 'อาชีพและรายได้', description: 'Income', icon: BahtSign },
    { id: 4, slug: 'debt', title: 'ภาระหนี้สิน', description: 'Debt', icon: FileText },
    { id: 5, slug: 'loan-calculator', title: 'รายละเอียดสินเชื่อ', description: 'Calculator', icon: Calculator },
    { id: 6, slug: 'documents', title: 'เอกสาร', description: 'Documents', icon: FileText },
    { id: 7, slug: 'review', title: 'ตรวจสอบ', description: 'Review', icon: Check },
];

// ─── Mock Data ───────────────────────────────────────────────────────────────

export const MOCK_ASSETS_WITH_LOANS = [
    {
        id: "A-001",
        type: "Toyota Camry 2020",
        plate: "9กข 9999",
        assetType: "car",
        estimatedValue: 750000,
        maxLtvLimit: 675000,
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

// ─── Default Form Data ──────────────────────────────────────────────────────

const DEFAULT_FORM_DATA = {
    // Identity
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
    // Card Address
    addressLine1: "",
    houseNumber: "", floorNumber: "", unitNumber: "", village: "", moo: "", yaek: "", trohk: "", soi: "",
    subDistrict: "", district: "", province: "", zipCode: "",
    fullAddress: "",
    // Other addresses
    currentHouseNumber: "", currentFloorNumber: "", currentUnitNumber: "", currentVillage: "", currentMoo: "", currentYaek: "", currentTrohk: "", currentSoi: "",
    shippingHouseNumber: "", shippingFloorNumber: "", shippingUnitNumber: "", shippingVillage: "", shippingMoo: "", shippingYaek: "", shippingTrohk: "", shippingSoi: "",
    workHouseNumber: "", workFloorNumber: "", workUnitNumber: "", workVillage: "", workMoo: "", workYaek: "", workTrohk: "", workSoi: "",
    // Financial
    income: 0,
    requestedAmount: 0,
    requestedDuration: 0,
    loanPurpose: "",
    collateralType: "",
    existingAssetId: null,
    // Co-borrower & Guarantor
    coBorrowers: [],
    guarantors: [],
    // Context mapping
    customerGroup: "thai",
    nationality: "ไทย",
    specialProject: "none",
};

// ─── Context Type ────────────────────────────────────────────────────────────

interface ApplicationContextType {
    // Core form state
    formData: any;
    setFormData: React.Dispatch<React.SetStateAction<any>>;

    // Application metadata
    appId: string | null;
    setAppId: React.Dispatch<React.SetStateAction<string | null>>;
    isApplicationStarted: boolean;
    setIsApplicationStarted: React.Dispatch<React.SetStateAction<boolean>>;

    // Customer status
    isExistingCustomer: boolean;
    setIsExistingCustomer: React.Dispatch<React.SetStateAction<boolean>>;
    existingProfile: any;
    setExistingProfile: React.Dispatch<React.SetStateAction<any>>;
    isIdentityVerified: boolean;
    setIsIdentityVerified: React.Dispatch<React.SetStateAction<boolean>>;
    isSkipped: boolean;
    setIsSkipped: React.Dispatch<React.SetStateAction<boolean>>;

    // Mock data
    assetsWithLoans: any[];
    mockExistingCollaterals: any[];

    // Navigation
    navigateNext: () => void;
    navigatePrev: () => void;
    navigateTo: (path: string) => void;
    currentFlowIndex: number;
    isScreeningPhase: boolean;
    applicationStepIndex: number;

    // Override hooks for per-page customization
    setNextOverride: (fn: (() => void) | null) => void;
    setPrevOverride: (fn: (() => void) | null) => void;
    setSaveOverride: (fn: (() => void) | null) => void;
    saveOverrideRef: React.RefObject<(() => void) | null>;
    setHideLayoutNav: (hide: boolean) => void;
    hideLayoutNav: boolean;
}

const ApplicationContext = createContext<ApplicationContextType | null>(null);

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useApplication() {
    const ctx = useContext(ApplicationContext);
    if (!ctx) throw new Error("useApplication must be used within ApplicationProvider");
    return ctx;
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function ApplicationProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const params = useParams();
    const urlAppId = params.appid as string | undefined;

    // ── Core State ──────────────────────────────────────────────────────────
    const [formData, setFormData] = useState<any>({ ...DEFAULT_FORM_DATA });
    const [appIdState, setAppIdState] = useState<string | null>(null);
    const appId = urlAppId || appIdState;
    const setAppId = setAppIdState;
    const [isApplicationStarted, setIsApplicationStarted] = useState(false);

    // ── Customer Status ─────────────────────────────────────────────────────
    const [isExistingCustomer, setIsExistingCustomer] = useState(false);
    const [existingProfile, setExistingProfile] = useState<any>(null);
    const [isIdentityVerified, setIsIdentityVerified] = useState(false);
    const [isSkipped, setIsSkipped] = useState(false);

    // ── Per-page navigation overrides ───────────────────────────────────────
    const nextOverrideRef = useRef<(() => void) | null>(null);
    const prevOverrideRef = useRef<(() => void) | null>(null);
    const saveOverrideRef = useRef<(() => void) | null>(null);
    const [hideLayoutNav, setHideLayoutNav] = useState(false);

    const setNextOverride = useCallback((fn: (() => void) | null) => {
        nextOverrideRef.current = fn;
    }, []);

    const setPrevOverride = useCallback((fn: (() => void) | null) => {
        prevOverrideRef.current = fn;
    }, []);

    const setSaveOverride = useCallback((fn: (() => void) | null) => {
        saveOverrideRef.current = fn;
    }, []);

    // Reset per-page overrides on route change
    // Note: saveOverrideRef is NOT reset here — child pages handle their own cleanup
    useEffect(() => {
        nextOverrideRef.current = null;
        prevOverrideRef.current = null;
        setHideLayoutNav(false);
    }, [pathname]);

    // ── Mock Collaterals ────────────────────────────────────────────────────
    const mockExistingCollaterals = MOCK_ASSETS_WITH_LOANS
        .filter(a => a.assetType !== 'unsecured')
        .map(a => ({
            id: a.id,
            type: a.assetType,
            brand: a.type.split(" ")[0],
            model: a.type.split(" ").slice(1).join(" "),
            licensePlate: a.plate,
            status: a.loans.length > 0 ? "Pledged" : "Free"
        }));

    // ── Load prefilled data from pre-question ────────────────────────────────
    useEffect(() => {
        const state = searchParams.get('state');
        if (state === 'draft' || state === 'readonly') {
            setIsApplicationStarted(true);
            const id = searchParams.get('id');
            if (id) setAppId(id);
        }

        const salesTalkDataStr = localStorage.getItem('salesTalkData');
        if (salesTalkDataStr) {
            try {
                const salesTalkData = JSON.parse(salesTalkDataStr);
                setFormData((prev: any) => ({
                    ...prev,
                    collateralType: salesTalkData.collateralType || prev.collateralType,
                    appraisalPrice: salesTalkData.appraisalPrice || prev.appraisalPrice,
                    brand: salesTalkData.brand || prev.brand,
                    model: salesTalkData.model || prev.model,
                    year: salesTalkData.year || prev.year,
                    landRai: salesTalkData.landRai || prev.landRai,
                    landNgan: salesTalkData.landNgan || prev.landNgan,
                    landWah: salesTalkData.landWah || prev.landWah,
                    registrationProvince: salesTalkData.province || prev.registrationProvince,
                    income: salesTalkData.income || prev.income,
                    requestedAmount: salesTalkData.loanAmount || salesTalkData.requestedAmount || prev.requestedAmount,
                    requestedDuration: salesTalkData.duration || salesTalkData.requestedDuration || prev.requestedDuration,
                    monthlyDebt: salesTalkData.monthlyDebt || prev.monthlyDebt,
                    occupation: salesTalkData.occupation || prev.occupation,
                    customerGroup: salesTalkData.customerGroup || prev.customerGroup || "thai",
                    nationality: salesTalkData.nationality || prev.nationality || "ไทย",
                    specialProject: salesTalkData.specialProject || prev.specialProject || "none",
                }));
                localStorage.removeItem('salesTalkData');

                const accepted = localStorage.getItem('isConsentAccepted');
                if (accepted === 'true') {
                    setIsApplicationStarted(true);
                    setAppId("25690316ULCRL0001");
                    localStorage.removeItem('isConsentAccepted');
                }
            } catch (e) {
                console.error("Failed to parse sales talk data", e);
                localStorage.removeItem('salesTalkData');
            }
        }
    }, [searchParams]);

    // ── Load Mock Data for 'existing-user' & Mock Apps ───────────────────────
    useEffect(() => {
        if (appId === 'existing-user' || (appId && /^\d{8}[A-Z]{4}L\d{4}$/.test(appId))) {
            if (appId === 'existing-user') {
                setIsExistingCustomer(true);
            }
            setFormData((prev: any) => {
                // Only override if not already populated with mock data (basic check)
                if (prev.firstName) return prev;

                return {
                    ...prev,
                    idNumber: "1-1004-00123-45-6",
                    firstName: "สมชาย",
                    lastName: "ใจดี",
                    phone: "081-234-5678",
                    // Chaiyo Loan Products
                    chaiyoLoans: [
                        { type: "สินเชื่อรถยนต์", amount: 5500 },
                        { type: "สินเชื่อจำนองที่ดิน", amount: 2600 }
                    ],
                    chaiyoInsuranceInstallment: 450,
                    totalChaiyoDebt: 8550, // 5500 + 2600 + 450
                    occupations: [
                        {
                            id: 'main',
                            isMain: true,
                            type: 'SA',
                            saIncomes: [
                                { type: 'salary', amount: '25000' }
                            ],
                            totalIncome: '25000'
                        }
                    ],
                    personalDebts: [
                        { type: 'personal', amount: '3500' },
                        { type: 'housing', amount: '8000' }
                    ],
                    totalPersonalDebt: '11500',
                    incomeRemarks: "ลูกค้าประวัติดี มีรายได้ประจำจากเงินเดือน"
                };
            });
        }
    }, [appId]);

    // ── Navigation ──────────────────────────────────────────────────────────
    const currentFlowIndex = ALL_FLOW_STEPS.findIndex(s => pathname.endsWith(s.slug) || pathname.includes(s.slug));
    const currentStep = currentFlowIndex >= 0 ? ALL_FLOW_STEPS[currentFlowIndex] : null;
    const isScreeningPhase = currentStep?.phase === 'screening';

    // 0-based index within APPLICATION_STEPS (-1 if in screening)
    const applicationStepIndex = currentStep?.phase === 'application'
        ? APPLICATION_STEPS.findIndex(s => s.slug === currentStep.slug)
        : -1;

    const navigateNext = useCallback(() => {
        if (nextOverrideRef.current) {
            nextOverrideRef.current();
            return;
        }
        if (currentFlowIndex < ALL_FLOW_STEPS.length - 1) {
            router.push(ALL_FLOW_STEPS[currentFlowIndex + 1].getPath(appId || ''));
        }
    }, [currentFlowIndex, router, appId]);

    const navigatePrev = useCallback(() => {
        if (prevOverrideRef.current) {
            prevOverrideRef.current();
            return;
        }
        if (currentFlowIndex > 0) {
            router.push(ALL_FLOW_STEPS[currentFlowIndex - 1].getPath(appId || ''));
        }
    }, [currentFlowIndex, router, appId]);

    const navigateTo = useCallback((path: string) => {
        router.push(path);
    }, [router]);

    // ── Context Value ───────────────────────────────────────────────────────
    const value: ApplicationContextType = {
        formData,
        setFormData,
        appId,
        setAppId,
        isApplicationStarted,
        setIsApplicationStarted,
        isExistingCustomer,
        setIsExistingCustomer,
        existingProfile,
        setExistingProfile,
        isIdentityVerified,
        setIsIdentityVerified,
        isSkipped,
        setIsSkipped,
        assetsWithLoans: MOCK_ASSETS_WITH_LOANS,
        mockExistingCollaterals,
        navigateNext,
        navigatePrev,
        navigateTo,
        currentFlowIndex,
        isScreeningPhase,
        applicationStepIndex,
        setNextOverride,
        setPrevOverride,
        setSaveOverride,
        saveOverrideRef,
        setHideLayoutNav,
        hideLayoutNav,
    };

    return (
        <ApplicationContext.Provider value={value}>
            {children}
        </ApplicationContext.Provider>
    );
}
