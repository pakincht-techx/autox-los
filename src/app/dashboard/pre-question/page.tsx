"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from 'next/dynamic';

const PdfViewer = dynamic(
    () => import('@/components/ui/PdfViewer').then((mod) => mod.PdfViewer),
    { ssr: false }
);

import { QuotationPrint } from "@/components/calculator/QuotationPrint";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { ChevronLeft, Printer, FileText, PiggyBank, Briefcase, Car, Camera, Check, Sparkles, Bike, Truck, Tractor, Map, Upload, Eye, EyeOff, X, ChevronRight, Plus, Minus, CreditCard, Gift, Shield, Percent, ArrowRight, Star, User, Banknote, ShieldCheck, AlertTriangle, CheckCircle, ChevronDown } from "lucide-react";
import { Combobox } from "@/components/ui/combobox";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/Checkbox";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useSidebar } from "@/components/layout/SidebarContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import {
    CAR_BRANDS,
    MOTO_BRANDS,
    TRUCK_BRANDS,
    AGRI_BRANDS,
    MODELS_BY_BRAND,
    SUB_MODELS_BY_MODEL,
    YEARS
} from "@/data/vehicle-data";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

function PreQuestionPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialStep = searchParams.get('step') ? parseInt(searchParams.get('step')!) : 1;

    const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'balloon'>('monthly');
    // Local state for "Sales Talk"
    const [formData, setFormData] = useState<any>({
        collateralType: 'car',
        appraisalPrice: 0,
        income: 0,
        // New Preliminary Fields
        loanPurpose: '',
        requestedAmount: '',
        collateralStatus: 'clear',
        occupationGroup: '',
        jobTitle: '',
        salary: '',
        otherIncome: '',
        monthlyDebt: '',
        specialProject: 'none',
        borrowerAge: '',
        collateralCondition: 'yes',
        brand: '',
        model: '',
        subModel: '',
        year: '',
        aiPrice: 0,
        redbookPrice: 0,
        aiDetectedData: null,

        nationality: 'thai',
        applicationOwner: "สมหญิง จริงใจ",
        branchRegion: 'other', // Default matched to "สมหญิง จริงใจ"
        // Defaults for CalculatorStep
        requestedDuration: 24,

        // Collateral Questions
        collateralQuestions: {},
        isSalesheetRead: false,
        landProvince: '',
        landCollateralPurpose: 'clear',

        // Land Appraisals
        landAppraisals: [
            { source: 'land_office', price: '', label: 'สำนักงานที่ดิน', hidden: false },
            { source: 'external_appraisal', price: '', label: 'บริษัทประเมินภายนอก', hidden: false }
        ],
        buildingAppraisals: [
            { source: 'treasury_department', price: '', label: 'กรมธนารักษ์', hidden: false },
            { source: 'external_appraisal', price: '', label: 'บริษัทประเมินภายนอก', hidden: false },
        ],
        condoUnitAppraisals: [
            { source: 'land_office', price: '', label: 'สำนักงานที่ดิน', hidden: false },
            { source: 'external_appraisal', price: '', label: 'บริษัทประเมินภายนอก', hidden: false }
        ],
        condoBalconyAppraisals: [
            { source: 'land_office', price: '', label: 'สำนักงานที่ดิน', hidden: false },
            { source: 'external_appraisal', price: '', label: 'บริษัทประเมินภายนอก', hidden: false }
        ],
        incomeBreakdown: [
            { label: 'รายได้หลัก', price: '', source: 'main' },
            { label: 'รายได้เสริม', price: '', source: 'extra' },
            { label: 'รายได้รวม', price: '', source: 'total' },
        ],
        debtBreakdown: [
            { label: 'ค่าผ่อนบ้าน/คอนโด/ที่ดิน/ ค่าที่อยู่อาศัย', price: '', source: 'housing' },
            { label: 'ค่าใช้จ่าย-ผ่อนสินเชื่ออื่นๆ (ไม่รวมของ เงินไชโย)', price: '', source: 'other_loan' },
            { label: 'ค่าผ่อนบัตรกดเงินสด', price: '', source: 'cash_card' },
            { label: 'ค่าผ่อนบัตรเครดิต', price: '', source: 'credit_card' },
            { label: 'ค่าเช่าบ้าน-ที่พักอาศัย', price: '', source: 'rent' },
            { label: 'จ่ายหนี้นอกระบบ', price: '', source: 'informal' },
        ],
    });

    // Step 1: Preliminary Questionnaire (Inc. Collateral Type)
    // Step 2: Upload / Analyze
    // Step 3: Info
    // Step 4: Calculate (Result)
    const [currentStep, setCurrentStep] = useState(initialStep);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiDetectedFields, setAiDetectedFields] = useState<string[]>([]);
    const [isFetchingRedbook, setIsFetchingRedbook] = useState(false);
    const [isConditionDialogOpen, setIsConditionDialogOpen] = useState(false);
    const [isQuestionsExpanded, setIsQuestionsExpanded] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // --- REFINED LAND APPRAISAL CALCULATION ---
    const calculatedLandResult = useMemo(() => {
        if (formData.collateralType !== 'land') return null;

        const deedType = formData.landDeedType;
        const isTrajong = deedType === 'trajong_deed';

        // 1. Check if it's "Land Only" (no building)
        let buildingOfficePrice = 0;
        let buildingExtPrice = 0;
        if (deedType !== 'orchor2') {
            const bldgTreasury = (formData.buildingAppraisals || []).find((a: any) => a.source === 'treasury_department' && !a.hidden);
            buildingOfficePrice = Number(bldgTreasury?.price) || 0;

            const bldgExt = (formData.buildingAppraisals || []).find((a: any) => a.source === 'external_appraisal' && !a.hidden);
            buildingExtPrice = Number(bldgExt?.price) || 0;
        }
        const isLandOnly = buildingOfficePrice === 0 && buildingExtPrice === 0;

        // 2. Calculate Land limit
        let landOfficePrice = 0;
        if (deedType === 'orchor2') {
            const unitOffice = (formData.condoUnitAppraisals || []).find((a: any) => a.source === 'land_office' && !a.hidden);
            const balcOffice = (formData.condoBalconyAppraisals || []).find((a: any) => a.source === 'land_office' && !a.hidden);
            landOfficePrice = (Number(unitOffice?.price) || 0) + (Number(balcOffice?.price) || 0);
        } else {
            const landOffice = (formData.landAppraisals || []).find((a: any) => a.source === 'land_office' && !a.hidden);
            landOfficePrice = Number(landOffice?.price) || 0;
        }

        let extAppraisalPrice = 0;
        if (deedType === 'orchor2') {
            const unitExt = (formData.condoUnitAppraisals || []).find((a: any) => a.source === 'external_appraisal' && !a.hidden);
            const balcExt = (formData.condoBalconyAppraisals || []).find((a: any) => a.source === 'external_appraisal' && !a.hidden);
            extAppraisalPrice = (Number(unitExt?.price) || 0) + (Number(balcExt?.price) || 0);
        } else {
            const landExt = (formData.landAppraisals || []).find((a: any) => a.source === 'external_appraisal' && !a.hidden);
            extAppraisalPrice = Number(landExt?.price) || 0;
        }

        // Base values for Step 2
        const ltvPenalty = (formData.branchRegion === 'isan' && formData.occupationGroup === 'business_owner') ? 0.05 : 0;

        // Rules 1.1 & 1.2 or Land Only Rule
        let landOfficeLtv = isLandOnly ? 0.50 : (isTrajong ? 0.50 : 0.60);
        let extAppraisalLtv = isLandOnly ? 0.50 : (isTrajong ? 0.40 : 0.50);

        // Apply penalty to Land Only case base LTV
        if (isLandOnly && ltvPenalty > 0) {
            landOfficeLtv -= ltvPenalty;
            extAppraisalLtv -= ltvPenalty;
        }

        let landOfficeLimitResult = landOfficePrice > 0 ? (landOfficePrice * landOfficeLtv) : Infinity;
        let extAppraisalLimitResult = extAppraisalPrice > 0 ? (extAppraisalPrice * extAppraisalLtv) : Infinity;

        // Constraint: Ext limit <= 2 * Dept of Lands Price
        if (extAppraisalLimitResult !== Infinity && landOfficePrice > 0) {
            extAppraisalLimitResult = Math.min(extAppraisalLimitResult, landOfficePrice * 2);
        }

        const landOptions = [];
        if (landOfficePrice > 0) landOptions.push({ price: landOfficePrice, limit: landOfficeLimitResult, label: 'กรมที่ดิน', ltv: landOfficeLtv });
        if (extAppraisalPrice > 0) landOptions.push({ price: extAppraisalPrice, limit: extAppraisalLimitResult, label: 'ราคาประเมินนอก', ltv: extAppraisalLtv });

        let chosenLand = { price: 0, limit: 0, label: '-', ltv: 0 };
        if (landOptions.length > 0) {
            // "We will select the lowest appraisal price to calculate in final appraisal price"
            chosenLand = landOptions.reduce((min, cur) => cur.limit < min.limit ? cur : min, landOptions[0]);
        }

        // 3. Calculate Building limit
        let chosenBuilding = { price: 0, limit: 0, label: '-', ltv: 0 };
        if (!isLandOnly) {
            const buildingAge = Number(formData.buildingAge) || 0;
            let bldgExtMultiplier = 0.20;
            if (buildingAge >= 1 && buildingAge <= 10) bldgExtMultiplier = 0.30;
            else if (buildingAge >= 11 && buildingAge <= 20) bldgExtMultiplier = 0.25;

            let bldgOfficeLtv = 0.20;
            let bldgOfficeLimitResult = buildingOfficePrice > 0 ? (buildingOfficePrice * bldgOfficeLtv) : Infinity;
            let bldgExtLimitResult = buildingExtPrice > 0 ? (buildingExtPrice * bldgExtMultiplier) : Infinity;

            const bldgOptions = [];
            if (buildingOfficePrice > 0) bldgOptions.push({ price: buildingOfficePrice, limit: bldgOfficeLimitResult, label: 'กรมธนารักษ์', ltv: bldgOfficeLtv });
            if (buildingExtPrice > 0) bldgOptions.push({ price: buildingExtPrice, limit: bldgExtLimitResult, label: 'ราคาประเมินนอก', ltv: bldgExtMultiplier });

            if (bldgOptions.length > 0) {
                chosenBuilding = bldgOptions.reduce((min, cur) => cur.limit < min.limit ? cur : min, bldgOptions[0]);
            }
        }

        // Final Appraisal Price for Step 1 display
        const finalAppraisalPrice = chosenLand.limit + chosenBuilding.limit;

        // Base values for Step 2
        const basePriceTotal = chosenLand.price + chosenBuilding.price;
        let capLtv = 0.50;
        if (ltvPenalty > 0) capLtv -= ltvPenalty;

        const maxOverallLimitByCap = basePriceTotal * capLtv;
        const absoluteCap = isLandOnly ? 220000 : 5000000;
        const finalCalculatedLimit = Math.min(finalAppraisalPrice, maxOverallLimitByCap, absoluteCap);

        return {
            chosenLand,
            chosenBuilding,
            finalAppraisalPrice,
            basePriceTotal,
            ltvPenalty,
            capLtv,
            finalCalculatedLimit,
            isLandOnly
        };
    }, [formData]);

    const finalSummaryLimit = useMemo(() => {
        let limit = 0;
        let appraisalPrice = Number(formData.appraisalPrice) || 0;

        if (formData.collateralType === 'land' && calculatedLandResult) {
            limit = calculatedLandResult.finalCalculatedLimit;
        } else {
            let baseLTV = 0.80;
            if (formData.specialProject === 'b2b_payroll') baseLTV += 0.10;
            if (formData.branchRegion === 'isan' && formData.occupationGroup === 'business_owner') baseLTV -= 0.05;
            const maxLtvCap = 1.20;
            const finalLTV = Math.min(baseLTV, maxLtvCap);
            limit = Math.floor(appraisalPrice * finalLTV);
        }
        return limit;
    }, [formData, calculatedLandResult]);

    // Load state from localStorage on mount
    useEffect(() => {
        const savedState = localStorage.getItem('preQuestionState');
        if (savedState) {
            try {
                const parsed = JSON.parse(savedState);
                if (parsed.formData) setFormData(parsed.formData);
                // If URL param step exists, use it has priority (for the back navigation scenario)
                // Otherwise use saved step if available, or default to 1.
                // Wait, if initialStep is from URL, currentStep is already initialized with it.
                // If no URL param, initialStep is 1.
                // We should only overwrite currentStep from storage if URL param is NOT present.
                if (!searchParams.get('step') && parsed.currentStep) {
                    setCurrentStep(parsed.currentStep);
                }
            } catch (e) {
                console.error("Failed to load pre-question state", e);
            }
        }
    }, [searchParams]);

    // Save state to localStorage
    useEffect(() => {
        localStorage.setItem('preQuestionState', JSON.stringify({
            formData,
            currentStep
        }));
    }, [formData, currentStep]);

    // Lightbox State
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [uploadedDocs, setUploadedDocs] = useState<string[]>([
        "https://placehold.co/600x800/e2e8f0/1e293b?text=Registration+Book+Page+1",
    ]);

    const handleAddPhoto = () => {
        setUploadedDocs(prev => [
            ...prev,
            `https://placehold.co/600x800/e2e8f0/1e293b?text=${encodeURIComponent(formData.collateralType === 'car' ? 'Car Front' : formData.collateralType === 'moto' ? 'Moto Side' : 'Document')}+${prev.length + 1}`
        ]);
    };

    const handleRemovePhoto = (idx: number) => {
        setUploadedDocs(prev => prev.filter((_, i) => i !== idx));
    };

    // Enhanced Product List for UI Design
    const PRODUCTS = [
        {
            id: "car",
            label: "รถเก๋ง / รถกระบะ / รถตู้",
            desc: "เล่มทะเบียนรถ",
            icon: Car,
            color: "bg-blue-100 text-blue-600"
        },
        {
            id: "moto",
            label: "รถจักรยานยนต์",
            desc: "เล่มทะเบียนรถ",
            icon: Bike,
            color: "bg-purple-100 text-purple-600"
        },
        {
            id: "truck",
            label: "รถบรรทุก",
            desc: "เล่มทะเบียนรถ",
            icon: Truck,
            color: "bg-orange-100 text-orange-600"
        },
        {
            id: "agri",
            label: "รถเพื่อการเกษตร",
            desc: "เล่มทะเบียน หรือ ใบอินวอยซ์/ใบเสร็จซื้อขาย",
            icon: Tractor,
            color: "bg-green-100 text-green-100" // Use a very pale green for the bg
        },
        {
            id: "land",
            label: "ที่ดิน",
            desc: "โฉนดที่ดิน",
            icon: Map,
            color: "bg-yellow-100 text-yellow-600 hover:text-yellow-700"
        },
    ];

    const STAFF_MEMBERS = [
        { value: "สมหญิง จริงใจ", label: "สมหญิง จริงใจ (Maker)", region: 'other' },
        { value: "สมหมาย มุ่งมั่น", label: "นายสมหมาย มุ่งมั่น (Maker)", region: 'isan' },
        { value: "ไชโย รักชาติ", label: "นายไชโย รักชาติ (Checker)", region: 'other' },
        { value: "กนกวรรณ ปลอดปลอดภัย", label: "นางกนกวรรณ ปลอดปลอดภัย (Maker)", region: 'isan' },
        { value: "ทดสอบ อีสาน", label: "พนักงาน ทดสอบ (ภาคอีสาน)", region: 'isan' },
    ];

    // Document requirements per collateral type (matches CollateralStepNew.tsx)
    const DOCUMENT_REQUIREMENTS: Record<string, { name: string; description: string }> = {
        car: { name: 'เล่มทะเบียนรถ', description: 'หน้ารายการจดทะเบียน' },
        moto: { name: 'เล่มทะเบียนรถ', description: 'หน้ารายการจดทะเบียน' },
        truck: { name: 'เล่มทะเบียนรถ', description: 'หน้ารายการจดทะเบียน' },
        agri: { name: 'เล่มทะเบียน หรือ ใบอินวอยซ์/ใบเสร็จซื้อขาย', description: 'เอกสารแสดงกรรมสิทธิ์' },
        land: { name: 'โฉนดที่ดิน', description: 'หน้าแรก - ครุฑ' },
    };

    // Mock Questions for Collateral Assessment
    const COLLATERAL_QUESTIONS: Record<string, { id: string; text: string }[]> = {
        car: [
            { id: 'car_q1', text: 'เป็นรถจากเต้นท์' },
            { id: 'car_q2', text: 'เป็นรถดัดแปลงสภาพ, รถแข่ง, รถแต่งเกิน 50%, รถดัดแปลงเครื่องยนต์' },
            { id: 'car_q3', text: 'เป็นรถตัดต่อ, เคยชนหนัก' },
            { id: 'car_q4', text: 'เป็นหรือเคยเป็น รถแท็กซี่ รถสองแถว/รถกะป๊อ /รถจากอาสามูลนิธิ' },
            { id: 'car_q5', text: 'เป็นรถสไลด์ที่ดัดแปลงจากรถกระบะ' },
            { id: 'car_q6', text: 'เป็นรถล้อเกินซุ้มล้อ' },
            { id: 'car_q7', text: 'เป็นรถที่ตัดแต่งคัสซี / ตัดเว้าคัสซี' },
        ],
        moto: [
            { id: 'moto_q1', text: 'เป็นรถจากเต้นท์' },
            { id: 'moto_q2', text: 'เป็นรถดัดแปลงสภาพ, รถแข่ง, รถแต่งเกิน 50%, รถดัดแปลงเครื่องยนต์' },
            { id: 'moto_q3', text: 'เป็นรถตัดต่อ, เคยชนหนัก' },
        ],
        truck: [
            { id: 'truck_q1', text: 'เป็นรถตัดต่อ, เคยชนหนัก' },
        ],
        agri: [],
        land: [
            { id: 'land_q1', text: 'เป็นที่ดินตาบอด หรือ ที่ดินติดคลอง/ติดลำธารทีไม่ติดถนนสาธารณะ' },
            { id: 'land_q2', text: 'เป็นที่ดินติดโรงเรียน/วัด/ศาลเจ้า/สถานที่ศักดิ์อื่น ๆ /สุสาน/ป่าช้า/บ่อขยะ' },
            { id: 'land_q3', text: 'เป็นที่ดินติดเขตการรถไฟ' },
            { id: 'land_q4', text: 'มีบ่อน้ำในที่ดินเกิน 40%' },
            { id: 'land_q5', text: 'ที่ดินรกร้างไม่ได้ทำประโยชน์' },
            { id: 'land_q6', text: 'ที่ดินสาธารณะประโยชน์ที่รถยนต์ไม่สามารถเข้าออกได้' },
            { id: 'land_q7', text: 'เป็นที่ดินเชิงเขาและอยู่ในเขตป่าสงวน / ป่าไม้แห่งชาติ' },
            { id: 'land_q8', text: 'เป็นที่ดินภาระจำยอมของบุคคลอื่น มีรั้วปิดทางเข้าออก' },
            { id: 'land_q9', text: 'เป็นที่ดินที่มีสัญญาเช่าระยะยาว เช่น ให้เช่าตั้งสัญญาณโทรศัพท์, มินิมาร์ท' },
        ],
    };

    const handlePrint = () => {
        let pdfPath = "/salesheets/Sale Sheet_รถ บุคคลทั่วไป V8.0 2.pdf";
        if (formData.collateralType === 'land') {
            pdfPath = "/salesheets/Sales Sheet_ที่ดิน_บุคคลทั่วไปV7_ปกค231.2568.pdf";
        }
        window.open(pdfPath, '_blank');
    };

    const handleCreateApplication = () => {
        // Just move to the consent step within this page
        setCurrentStep(4);
    };

    const handleProceedToApplication = () => {
        // Save current sales talk data to localStorage for prefilling the application form
        localStorage.setItem('salesTalkData', JSON.stringify(formData));
        router.push("/dashboard/new-application");
    };

    const isStep1Valid = () => {
        // Essential fields for all types
        if (!formData.collateralType || !formData.occupationGroup || !formData.borrowerAge || !formData.nationality) return false;

        // Vehicle (Car, Moto, Truck, Agri)
        if (['car', 'moto', 'truck', 'agri'].includes(formData.collateralType)) {
            // Mandatory: Brand, Model, Year, Collateral Status
            if (!formData.brand || !formData.model || !formData.year || !formData.collateralStatus) return false;

            // Sub-model is mandatory ONLY if there are sub-models available for that model
            const subModelOptions = SUB_MODELS_BY_MODEL[formData.model] || [];
            if (subModelOptions.length > 0 && !formData.subModel) return false;

            // Also require an appraisal price (suggests user has performed Redbook look-up or manual entry)
            if (!(Number(formData.appraisalPrice) > 0)) return false;
        }

        // Land / Condo
        if (formData.collateralType === 'land') {
            if (!formData.landDeedType || !formData.landCollateralPurpose) return false;

            // Specialized Mandatory check for Trajong Deed: Province must be selected
            if (formData.landDeedType === 'trajong_deed' && !formData.landProvince) return false;

            if (formData.landDeedType === 'orchor2') {
                // Mandatory: Condo Unit price AND Balcony price from at least 1 visible source
                const hasUnit = (formData.condoUnitAppraisals as any[] || []).some(a => !a.hidden && Number(a.price) > 0);
                const hasBalcony = (formData.condoBalconyAppraisals as any[] || []).some(a => !a.hidden && Number(a.price) > 0);
                if (!hasUnit || !hasBalcony) return false;
            } else {
                // Mandatory: Land appraisal price from at least 1 visible source
                const hasLand = (formData.landAppraisals as any[] || []).some(a => !a.hidden && Number(a.price) > 0);
                if (!hasLand) return false;
            }
        }

        return true;
    };

    const nextStep = () => {
        if (currentStep === 1) {
            let questions = COLLATERAL_QUESTIONS[formData.collateralType] || [];
            if (formData.collateralType === 'land' && formData.landDeedType === 'orchor2') {
                questions = [];
            }

            if (formData.collateralType === 'land' && formData.landDeedType === 'trajong_deed' && formData.landProvince === 'other') {
                setIsConditionDialogOpen(true);
                return;
            }

            const hasYesAnswer = questions.some(q => formData.collateralQuestions?.[q.id] === 'yes');

            if (hasYesAnswer) {
                setIsConditionDialogOpen(true);
                return;
            }
        }
        setCurrentStep(prev => prev + 1);
    };
    const prevStep = () => setCurrentStep(prev => prev - 1);

    // Mock AI Analysis from Photo Step
    const handleAnalyze = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            // Mock Data Filling based on type
            let mockData: any = {
                appraisalPrice: 450000
            };

            if (formData.collateralType === 'car') {
                mockData = { ...mockData, brand: 'Toyota', model: 'Camry', year: '2019', mileage: 85000, subModel: 'HEV Premium' };
            } else if (formData.collateralType === 'moto') {
                mockData = { ...mockData, brand: 'Honda', model: 'Wave 125i', year: '2021', appraisalPrice: 35000 };
            } else if (formData.collateralType === 'land') {
                mockData = { ...mockData, landRai: 1, landNgan: 2, landWah: 50, province: 'กรุงเทพมหานคร', appraisalPrice: 2500000 };
            }

            setFormData((prev: any) => ({
                ...prev,
                ...mockData,
                aiDetectedData: mockData,
                aiPrice: mockData.appraisalPrice
            }));
            setAiDetectedFields(Object.keys(mockData));
            setIsAnalyzing(false);
            toast.success("วิเคราะห์รูปภาพสำเร็จ!");
        }, 1500);
    };

    // Appraisal dynamic table helpers
    const updateOverallAppraisal = (updatedLand: any[], updatedBuilding: any[]) => {
        const totalLand = updatedLand.reduce((sum: number, item: any) => sum + (item.hidden ? 0 : (Number(item.price) || 0)), 0);
        const totalBuilding = updatedBuilding.reduce((sum: number, item: any) => sum + (item.hidden ? 0 : (Number(item.price) || 0)), 0);
        setFormData((prev: any) => ({
            ...prev,
            landAppraisals: updatedLand,
            buildingAppraisals: updatedBuilding,
            appraisedLandPrice: totalLand,
            appraisedBuildingPrice: totalBuilding,
            appraisalPrice: totalLand + totalBuilding
        }));
    };

    const handleUpdateLandAppraisal = (index: number, field: string, value: any) => {
        const updated = [...(formData.landAppraisals || [])];
        if (updated[index]) {
            updated[index] = { ...updated[index], [field]: value };
            updateOverallAppraisal(updated, formData.buildingAppraisals || []);
        }
    };

    const handleUpdateBuildingAppraisal = (index: number, field: string, value: any) => {
        const updated = [...(formData.buildingAppraisals || [])];
        if (updated[index]) {
            updated[index] = { ...updated[index], [field]: value };
            updateOverallAppraisal(formData.landAppraisals || [], updated);
        }
    };

    const updateCondoAppraisal = (updatedUnit: any[], updatedBalcony: any[]) => {
        const totalUnit = updatedUnit.reduce((sum: number, item: any) => sum + (item.hidden ? 0 : (Number(item.price) || 0)), 0);
        const totalBalcony = updatedBalcony.reduce((sum: number, item: any) => sum + (item.hidden ? 0 : (Number(item.price) || 0)), 0);

        setFormData((prev: any) => ({
            ...prev,
            condoUnitAppraisals: updatedUnit,
            condoBalconyAppraisals: updatedBalcony,
            appraisalPrice: totalUnit + totalBalcony
        }));
    };

    const handleUpdateCondoUnitAppraisal = (index: number, field: string, value: any) => {
        const updated = [...(formData.condoUnitAppraisals || [])];
        if (updated[index]) {
            if (field === 'hidden' && value === true) {
                const visibleCount = updated.filter(item => !item.hidden).length;
                if (visibleCount <= 1) {
                    toast.error("จำเป็นต้องมีอย่างน้อย 1 แหล่งที่มา");
                    return;
                }
            }
            updated[index] = { ...updated[index], [field]: value };
            updateCondoAppraisal(updated, formData.condoBalconyAppraisals || []);
        }
    };

    const handleUpdateCondoBalconyAppraisal = (index: number, field: string, value: any) => {
        const updated = [...(formData.condoBalconyAppraisals || [])];
        if (updated[index]) {
            if (field === 'hidden' && value === true) {
                const visibleCount = updated.filter(item => !item.hidden).length;
                if (visibleCount <= 1) {
                    toast.error("จำเป็นต้องมีอย่างน้อย 1 แหล่งที่มา");
                    return;
                }
            }
            updated[index] = { ...updated[index], [field]: value };
            updateCondoAppraisal(formData.condoUnitAppraisals || [], updated);
        }
    };

    const handleUpdateIncomeBreakdown = (index: number, value: any) => {
        const newBreakdown = [...formData.incomeBreakdown];
        newBreakdown[index].price = value;

        // Calculate total from main and extra (first two items)
        const main = Number(newBreakdown[0]?.price) || 0;
        const extra = Number(newBreakdown[1]?.price) || 0;
        const total = main + extra;

        // Update the total item if it exists
        if (newBreakdown[2]) {
            newBreakdown[2].price = total.toString();
        }

        setFormData({
            ...formData,
            incomeBreakdown: newBreakdown,
            salary: total.toString() // Sync with salary field
        });
    };

    const handleUpdateDebtBreakdown = (index: number, value: any) => {
        const newBreakdown = [...formData.debtBreakdown];
        newBreakdown[index].price = value;

        // Calculate total
        const totalDebtValue = newBreakdown.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

        setFormData({
            ...formData,
            debtBreakdown: newBreakdown,
            monthlyDebt: totalDebtValue.toString() // Sync with monthlyDebt field
        });
    };
    const handleFetchRedbook = () => {
        setIsFetchingRedbook(true);
        // Mock API Call
        setTimeout(() => {
            setIsFetchingRedbook(false);
            setFormData((prev: any) => ({
                ...prev,
                redbookPrice: 475000,
                appraisalPrice: 475000
            }));
            toast.success("ดึงข้อมูลจาก Redbook สำเร็จ");
        }, 1000);
    };

    const { setBreadcrumbs, setRightContent } = useSidebar();

    useEffect(() => {
        setBreadcrumbs([
            { label: "รายการคำขอ", href: "/dashboard/applications" },
            { label: "แนะนำผลิตภัณฑ์", isActive: true }
        ]);
        return () => {
            setBreadcrumbs([]);
            setRightContent(null);
        };
    }, [setBreadcrumbs, setRightContent]);

    if (!isMounted) return null;

    return (
        <div className="h-full">
            <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto pb-20 px-4 sm:px-6 lg:px-8 pt-6">

                {/* Stepper Indicator (Matching Application Flow) */}
                <div className="flex justify-center items-center mb-16 print:hidden w-full">
                    <div className="relative flex items-center justify-between w-full max-w-2xl px-4 md:px-12">
                        {/* Progress Line */}
                        <div className="absolute left-4 right-4 md:left-12 md:right-12 top-[14px] -translate-y-1/2 h-[2px] bg-gray-200 z-0">
                            <div
                                className="h-full bg-chaiyo-blue transition-all duration-500 ease-in-out"
                                style={{
                                    width: `${((currentStep - 1) / 3) * 100}%`
                                }}
                            ></div>
                        </div>

                        {[
                            { id: 1, label: "แบบสอบถามเบื้องต้น", icon: FileText },
                            { id: 2, label: "สรุปวงเงินประเมิน", icon: Briefcase },
                            { id: 3, label: "แนะนำสินค้า", icon: Sparkles },
                            { id: 4, label: "เอกสารและความยินยอม", icon: ShieldCheck }
                        ].map((step) => {
                            const isActive = currentStep === step.id;
                            const isCompleted = currentStep > step.id;
                            const Icon = step.icon;

                            return (
                                <div key={step.id} className="relative z-10 flex flex-col items-center">
                                    {/* Circle Step Indicator */}
                                    <div className={cn(
                                        "w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 bg-white",
                                        isActive
                                            ? "border-chaiyo-blue text-chaiyo-blue scale-110"
                                            : isCompleted
                                                ? "bg-chaiyo-blue border-chaiyo-blue text-white"
                                                : "border-gray-200 text-gray-300"
                                    )}>
                                        {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
                                    </div>

                                    {/* Label positioned below */}
                                    <div className="absolute top-9 w-24 flex justify-center">
                                        <span className={cn(
                                            "text-[10px] md:text-xs font-bold text-center transition-colors whitespace-nowrap",
                                            isActive ? "text-chaiyo-blue" : isCompleted ? "text-gray-800" : "text-gray-400"
                                        )}>
                                            {step.label}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* STEP 1: Preliminary Questionnaire (New) */}
                {/* STEP 1: Preliminary Questionnaire (New Github Layout) */}
                {currentStep === 1 && (
                    <div className="max-w-4xl mx-auto print:hidden animate-in slide-in-from-right-8 duration-300 pb-20 pt-4">
                        <div className="space-y-1 mb-8 text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900">แบบสอบถามเบื้องต้น</h2>
                            <p className="text-gray-500">กรุณากรอกข้อมูลเพื่อประเมินผลิตภัณฑ์สินเชื่อที่เหมาะสม</p>
                        </div>

                        {/* Section 1: Collateral Info */}
                        <div className="relative border-l-[2px] border-gray-200 ml-4 pl-8 pb-12">
                            <div className="absolute -left-[18px] top-0 w-8 h-8 bg-white rounded-full border-[2px] border-gray-200 flex items-center justify-center font-bold text-gray-500 text-sm">
                                1
                            </div>

                            <div className="space-y-6 -mt-1">
                                <h3 className="text-xl font-bold text-gray-900">ข้อมูลหลักประกัน</h3>

                                <div className="space-y-4">
                                    <Label>ประเภทหลักประกัน <span className="text-red-500">*</span></Label>
                                    <div className="flex flex-wrap gap-2">
                                        {PRODUCTS.map((p) => (
                                            <button
                                                key={p.id}
                                                onClick={() => {
                                                    setFormData({
                                                        ...formData,
                                                        collateralType: p.id,
                                                        brand: '',
                                                        model: '',
                                                        year: '',
                                                        appraisalPrice: 0,
                                                        // Automatically default to 'ns4' when land is selected
                                                        ...(p.id === 'land' ? { landDeedType: 'ns4' } : {})
                                                    });
                                                    setAiDetectedFields([]);
                                                }}
                                                className={cn(
                                                    "flex-1 min-w-[120px] py-3 px-4 rounded-xl border text-sm font-bold transition-all text-center group flex flex-col items-center justify-center gap-2",
                                                    formData.collateralType === p.id
                                                        ? "border-chaiyo-blue bg-blue-50 text-chaiyo-blue"
                                                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                                                )}
                                            >
                                                <p.icon className={cn("w-6 h-6", formData.collateralType === p.id ? "text-chaiyo-blue" : "text-gray-400 group-hover:text-gray-600")} />
                                                {p.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {/* Photo Upload Area (Card 1) */}
                                    {formData.collateralType === 'car' && (
                                        <div className="border border-border-strong rounded-xl bg-white overflow-hidden">
                                            <div className="p-6 bg-blue-50/30">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                                                    <div>
                                                        <h4 className="text-lg font-bold text-gray-900">
                                                            อัพโหลดรูปถ่ายหลักประกัน วิเคราะห์โดย AI
                                                        </h4>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <Button
                                                            variant="outline"
                                                            onClick={handleAddPhoto}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <Upload className="w-4 h-4" />
                                                            อัพโหลดรูปภาพ
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            onClick={handleAddPhoto}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <Camera className="w-4 h-4" />
                                                            เปิดกล้อง
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-4">
                                                    {uploadedDocs.map((doc, idx) => (
                                                        <div key={idx} className="relative w-28 h-28 rounded-xl overflow-hidden border border-border-strong group bg-white">
                                                            <img src={doc} alt={`doc-${idx}`} className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                                                <button
                                                                    onClick={() => setLightboxIndex(idx)}
                                                                    className="text-white hover:text-blue-200 transition-colors p-1"
                                                                >
                                                                    <Eye className="w-5 h-5" />
                                                                </button>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handleRemovePhoto(idx); }}
                                                                    className="text-white hover:text-red-300 transition-colors p-1"
                                                                >
                                                                    <X className="w-5 h-5" />
                                                                </button>
                                                            </div>
                                                            {isAnalyzing && (
                                                                <div className="absolute inset-0 bg-blue-500/20 flex flex-col items-center justify-center">
                                                                    <div className="w-full h-0.5 bg-blue-400 absolute top-0 animate-[scan_2s_infinite]" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}

                                                </div>

                                                <div className="mt-5 flex justify-end">
                                                    <Button
                                                        size="default"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setIsAnalyzing(true);
                                                            setAiDetectedFields([]);
                                                            toast.info("กำลังวิเคราะห์รูปถ่าย...", { duration: 1500 });

                                                            setTimeout(() => {
                                                                let mockData: any = { appraisalPrice: 450000 };
                                                                const fields = ['appraisalPrice', 'brand', 'model', 'year'];

                                                                if (formData.collateralType === 'car') {
                                                                    mockData = { ...mockData, brand: 'Toyota', model: 'Camry', year: '2019', subModel: 'HEV Premium' };
                                                                    fields.push('subModel');
                                                                } else if (formData.collateralType === 'moto') {
                                                                    mockData = { ...mockData, brand: 'Honda', model: 'Wave 125i', year: '2021', appraisalPrice: 35000 };
                                                                } else if (formData.collateralType === 'truck') {
                                                                    mockData = { ...mockData, brand: 'Isuzu', model: 'D-Max', year: '2020', appraisalPrice: 500000 };
                                                                } else if (formData.collateralType === 'agri') {
                                                                    mockData = { ...mockData, brand: 'Kubota', model: 'L5018', year: '2022', appraisalPrice: 600000 };
                                                                }

                                                                setFormData((prev: any) => ({
                                                                    ...prev,
                                                                    ...mockData,
                                                                    aiDetectedData: mockData,
                                                                    aiPrice: mockData.appraisalPrice,
                                                                    redbookPrice: 0 // Will be set when user selects from redbook
                                                                }));
                                                                setAiDetectedFields(fields);
                                                                setIsAnalyzing(false);
                                                                toast.success("วิเคราะห์รูปถ่ายสำเร็จ!", {
                                                                    icon: <Sparkles className="w-4 h-4 text-purple-500" />
                                                                });

                                                                // Automatically fetch redbook data after AI analysis
                                                                setTimeout(() => {
                                                                    handleFetchRedbook();
                                                                }, 500);
                                                            }, 1500);
                                                        }}
                                                        disabled={isAnalyzing || uploadedDocs.length === 0}
                                                        className="font-bold"
                                                    >
                                                        {isAnalyzing ? (
                                                            <>
                                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                                                กำลังวิเคราะห์...
                                                            </>
                                                        ) : (
                                                            <>วิเคราะห์รูปภาพ</>
                                                        )}
                                                    </Button>
                                                </div>


                                            </div>
                                        </div>
                                    )}

                                    {/* Form and Pricing Summary Card (Card 2) */}
                                    <div className="border border-border-strong rounded-xl bg-white overflow-hidden divide-y divide-gray-200">
                                        {(formData.collateralType === 'car' || formData.collateralType === 'moto' || formData.collateralType === 'truck' || formData.collateralType === 'agri') ? (
                                            <div className="flex flex-col">
                                                {/* Redbook Form Section Header */}
                                                <div className="px-6 pt-6 pb-2">
                                                    <div className="flex items-center gap-2 mb-">
                                                        <h3 className="text-lg font-bold text-gray-900">ข้อมูลหลักประกันจากฐานข้อมูล Redbook</h3>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 pb-6 pt-4">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <Label>ยี่ห้อ <span className="text-red-500">*</span></Label>
                                                        </div>
                                                        <Combobox
                                                            options={
                                                                formData.collateralType === 'moto' ? MOTO_BRANDS :
                                                                    formData.collateralType === 'truck' ? TRUCK_BRANDS :
                                                                        formData.collateralType === 'agri' ? AGRI_BRANDS :
                                                                            CAR_BRANDS
                                                            }
                                                            value={formData.brand}
                                                            onValueChange={(val) => {
                                                                setFormData({ ...formData, brand: val, model: '', subModel: '' });
                                                                setAiDetectedFields((prev: any[]) => prev.filter(f => f !== 'brand' && f !== 'model'));
                                                            }}
                                                            placeholder="เลือกยี่ห้อ..."
                                                            searchPlaceholder="ค้นหายี่ห้อ..."
                                                            emptyText="ไม่พบยี่ห้อที่ค้นหา"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <Label>รุ่น <span className="text-red-500">*</span></Label>
                                                        </div>
                                                        <Combobox
                                                            options={MODELS_BY_BRAND[formData.brand] || []}
                                                            value={formData.model}
                                                            onValueChange={(val) => {
                                                                setFormData({ ...formData, model: val });
                                                                setAiDetectedFields((prev: any[]) => prev.filter(f => f !== 'model'));
                                                            }}
                                                            placeholder="เลือกรุ่น..."
                                                            searchPlaceholder="ค้นหารุ่น..."
                                                            emptyText="ไม่พบรุ่นที่ค้นหา"
                                                            className={!formData.brand ? "opacity-50 pointer-events-none" : ""}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <Label>รุ่นย่อย <span className="text-red-500">*</span></Label>
                                                        </div>
                                                        <Combobox
                                                            options={SUB_MODELS_BY_MODEL[formData.model] || []}
                                                            value={formData.subModel}
                                                            onValueChange={(val) => {
                                                                setFormData({ ...formData, subModel: val });
                                                                setAiDetectedFields((prev: any[]) => prev.filter(f => f !== 'subModel'));
                                                            }}
                                                            placeholder="เลือกรุ่นย่อย..."
                                                            searchPlaceholder="ค้นหารุ่นย่อย..."
                                                            emptyText="ไม่พบรุ่นที่ค้นหา"
                                                            className={!formData.model ? "opacity-50 pointer-events-none" : ""}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <Label>ปีจดทะเบียน <span className="text-red-500">*</span></Label>
                                                        </div>
                                                        <Combobox
                                                            options={YEARS}
                                                            value={formData.year}
                                                            onValueChange={(val) => {
                                                                setFormData({ ...formData, year: val });
                                                                setAiDetectedFields((prev: any[]) => prev.filter(f => f !== 'year'));
                                                            }}
                                                            placeholder="เลือกปี..."
                                                            searchPlaceholder="ค้นหาปี..."
                                                            emptyText="ไม่พบปีที่ค้นหา"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>สถานะหลักประกัน <span className="text-red-500">*</span></Label>
                                                        <Select value={formData.collateralStatus || 'clear'} onValueChange={(val) => setFormData({ ...formData, collateralStatus: val })}>
                                                            <SelectTrigger className="bg-white"><SelectValue placeholder="เลือกสถานะ" /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="clear">ปลอดภาระ</SelectItem>
                                                                <SelectItem value="pledge">จำนำ</SelectItem>
                                                                <SelectItem value="hire_purchase">เช่าซื้อ</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                <div className="px-6 pb-6 pt-2 flex justify-end">
                                                    <Button
                                                        variant="default"
                                                        className="bg-chaiyo-blue hover:bg-blue-800 text-white font-bold"
                                                        onClick={handleFetchRedbook}
                                                        disabled={isFetchingRedbook || !formData.brand || !formData.model || !formData.year}
                                                    >
                                                        {isFetchingRedbook ? (
                                                            <>
                                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                                                กำลังดึงข้อมูล...
                                                            </>
                                                        ) : (
                                                            <>
                                                                ดึงข้อมูล Redbook
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                                                {/* 1. ประเภท โฉนดที่ดิน */}
                                                <div className="space-y-2 md:col-span-2">
                                                    <Label className="text-sm text-gray-700">ประเภทโฉนดที่ดิน <span className="text-red-500">*</span></Label>
                                                    <Select value={formData.landDeedType || ''} onValueChange={(val) => {
                                                        setFormData({ ...formData, landDeedType: val });
                                                    }}>
                                                        <SelectTrigger className="bg-white text-base h-12 rounded-xl">
                                                            <SelectValue placeholder="เลือกประเภทโฉนด" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="ns4">น.ส.4</SelectItem>
                                                            <SelectItem value="ns3k">น.ส.3ก</SelectItem>
                                                            <SelectItem value="orchor2">อ.ช.2</SelectItem>
                                                            <SelectItem value="trajong_deed">โฉนดตาจอง</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:col-span-2">
                                                    {/* 3. อายุสิ่งปลูกสร้าง (Hidden for orchor2) */}
                                                    {formData.landDeedType !== 'orchor2' && (
                                                        <div className="space-y-2">
                                                            <Label className="text-sm text-gray-700">อายุสิ่งปลูกสร้าง (ปี)</Label>
                                                            <Input
                                                                type="number"
                                                                value={formData.buildingAge || ''}
                                                                onChange={(e) => setFormData({ ...formData, buildingAge: e.target.value })}
                                                                className="h-12 text-base rounded-xl"
                                                                placeholder="กรอกอายุสิ่งปลูกสร้าง"
                                                            />
                                                        </div>
                                                    )}

                                                    {/* 8. หลักประกันที่เอามาใช้ */}
                                                    <div className={cn("space-y-2", formData.landDeedType === 'orchor2' ? "md:col-span-1" : "")}>
                                                        <Label className="text-sm text-gray-700">หลักประกันที่เอามาใช้ <span className="text-red-500">*</span></Label>
                                                        <Select value={formData.landCollateralPurpose || ''} onValueChange={(val) => setFormData({ ...formData, landCollateralPurpose: val })}>
                                                            <SelectTrigger className="bg-white text-base h-12 rounded-xl">
                                                                <SelectValue placeholder="เลือกชนิดหลักประกัน" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="clear">ปลอดภาระ</SelectItem>
                                                                <SelectItem value="refinance">Refinance</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                {/* 6. ราคาประเมิน */}
                                                {formData.landDeedType === 'orchor2' ? (
                                                    <div className="space-y-6 md:col-span-2">
                                                        {/* ราคาประเมินพื้นที่ห้องชุด Table */}
                                                        <div className="space-y-4">
                                                            <div className="flex items-center justify-between">
                                                                <Label className="text-sm font-bold text-gray-700">ราคาประเมินพื้นที่ห้องชุด <span className="text-red-500">*</span> (อย่างน้อย 1 แหล่ง)</Label>
                                                            </div>
                                                            <div className="overflow-hidden border border-border-strong rounded-xl bg-white">
                                                                <table className="w-full text-sm">
                                                                    <thead className="bg-gray-50 border-b border-border-strong">
                                                                        <tr>
                                                                            <th className="px-4 py-3 text-left font-bold text-gray-600">แหล่งที่มา</th>
                                                                            <th className="px-4 py-3 text-right font-bold text-gray-600">ราคา (บาท)</th>
                                                                            <th className="px-4 py-3 w-10">แสดง</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="divide-y divide-gray-100">
                                                                        {(formData.condoUnitAppraisals || []).map((item: any, idx: number) => (
                                                                            <tr key={idx} className={cn("group transition-colors", item.hidden ? "bg-gray-50/50 opacity-50" : "hover:bg-gray-50/50")}>
                                                                                <td className="px-4 py-2 font-medium text-gray-700">
                                                                                    {item.label}
                                                                                </td>
                                                                                <td className="px-3 py-2">
                                                                                    <Input
                                                                                        type="text"
                                                                                        className={cn(
                                                                                            "h-10 text-right font-mono border border-gray-200 focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue transition-colors",
                                                                                            item.hidden ? "text-gray-400 italic bg-gray-50/50 border-transparent" : "text-gray-900 bg-white"
                                                                                        )}
                                                                                        value={item.hidden ? 'ไม่มีราคาประเมิน' : (item.price ? Number(item.price).toLocaleString() : '')}
                                                                                        onChange={(e) => handleUpdateCondoUnitAppraisal(idx, 'price', e.target.value.replace(/,/g, ''))}
                                                                                        placeholder="0"
                                                                                        readOnly={item.hidden}
                                                                                    />
                                                                                </td>
                                                                                <td className="px-3 py-2 text-center">
                                                                                    <div className="flex justify-center">
                                                                                        <Switch
                                                                                            checked={!item.hidden}
                                                                                            onCheckedChange={(checked) => handleUpdateCondoUnitAppraisal(idx, 'hidden', !checked)}
                                                                                        />
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>

                                                        {/* ราคาประเมินพื้นที่ระเบียง Table */}
                                                        <div className="space-y-4">
                                                            <div className="flex items-center justify-between">
                                                                <Label className="text-sm font-bold text-gray-700">ราคาประเมินพื้นที่ระเบียง <span className="text-red-500">*</span> (อย่างน้อย 1 แหล่ง)</Label>
                                                            </div>
                                                            <div className="overflow-hidden border border-border-strong rounded-xl bg-white">
                                                                <table className="w-full text-sm">
                                                                    <thead className="bg-gray-50 border-b border-border-strong">
                                                                        <tr>
                                                                            <th className="px-4 py-3 text-left font-bold text-gray-600">แหล่งที่มา</th>
                                                                            <th className="px-4 py-3 text-right font-bold text-gray-600">ราคา (บาท)</th>
                                                                            <th className="px-4 py-3 w-10">แสดง</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="divide-y divide-gray-100">
                                                                        {(formData.condoBalconyAppraisals || []).map((item: any, idx: number) => (
                                                                            <tr key={idx} className={cn("group transition-colors", item.hidden ? "bg-gray-50/50 opacity-50" : "hover:bg-gray-50/50")}>
                                                                                <td className="px-4 py-2 font-medium text-gray-700">
                                                                                    {item.label}
                                                                                </td>
                                                                                <td className="px-3 py-2">
                                                                                    <Input
                                                                                        type="text"
                                                                                        className={cn(
                                                                                            "h-10 text-right font-mono border border-gray-200 focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue transition-colors",
                                                                                            item.hidden ? "text-gray-400 italic bg-gray-50/50 border-transparent" : "text-gray-900 bg-white"
                                                                                        )}
                                                                                        value={item.hidden ? 'ไม่มีราคาประเมิน' : (item.price ? Number(item.price).toLocaleString() : '')}
                                                                                        onChange={(e) => handleUpdateCondoBalconyAppraisal(idx, 'price', e.target.value.replace(/,/g, ''))}
                                                                                        placeholder="0"
                                                                                        readOnly={item.hidden}
                                                                                    />
                                                                                </td>
                                                                                <td className="px-3 py-2 text-center">
                                                                                    <div className="flex justify-center">
                                                                                        <Switch
                                                                                            checked={!item.hidden}
                                                                                            onCheckedChange={(checked) => handleUpdateCondoBalconyAppraisal(idx, 'hidden', !checked)}
                                                                                        />
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>


                                                    </div>
                                                ) : ['ns4', 'ns3k', 'trajong_deed'].includes(formData.landDeedType) ? (
                                                    <div className="space-y-6 md:col-span-2">
                                                        {formData.landDeedType === 'trajong_deed' && (
                                                            <div>
                                                                <Label className="text-sm text-gray-700">
                                                                    จังหวัดที่ระบุในโฉนดตราจอง <span className="text-red-500">*</span>
                                                                </Label>
                                                                <Select
                                                                    value={formData.landProvince || ''}
                                                                    onValueChange={(val) => setFormData({ ...formData, landProvince: val })}
                                                                >
                                                                    <SelectTrigger className="bg-white text-base h-12 rounded-xl">
                                                                        <SelectValue placeholder="เลือกจังหวัด..." />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="phitsanulok">พิษณุโลก</SelectItem>
                                                                        <SelectItem value="sukhothai">สุโขทัย</SelectItem>
                                                                        <SelectItem value="phichit">พิจิตร</SelectItem>
                                                                        <SelectItem value="uttaradit">อุตรดิตถ์</SelectItem>
                                                                        <SelectItem value="nakhon_sawan">นครสวรรค์</SelectItem>
                                                                        <SelectItem value="other">จังหวัดอื่นๆ (ไม่อยู่ในเงื่อนไข)</SelectItem>
                                                                    </SelectContent>
                                                                </Select>

                                                            </div>
                                                        )}
                                                        {/* ราคาประเมินที่ดิน Table */}
                                                        <div className="space-y-4">
                                                            <div className="flex items-center justify-between">
                                                                <Label className="text-sm font-bold text-gray-700">ราคาประเมินที่ดิน <span className="text-red-500">*</span> (อย่างน้อย 1 แหล่ง)</Label>
                                                            </div>
                                                            <div className="overflow-hidden border border-border-strong rounded-xl bg-white">
                                                                <table className="w-full text-sm">
                                                                    <thead className="bg-gray-50 border-b border-border-strong">
                                                                        <tr>
                                                                            <th className="px-4 py-3 text-left font-bold text-gray-600">แหล่งที่มา</th>
                                                                            <th className="px-4 py-3 text-right font-bold text-gray-600">ราคา (บาท)</th>
                                                                            <th className="px-4 py-3 w-10">แสดง</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="divide-y divide-gray-100">
                                                                        {(formData.landAppraisals || []).map((item: any, idx: number) => (
                                                                            <tr key={idx} className={cn("group transition-colors", item.hidden ? "bg-gray-50/50 opacity-50" : "hover:bg-gray-50/50")}>
                                                                                <td className="px-4 py-2 font-medium text-gray-700">
                                                                                    {item.label}
                                                                                </td>
                                                                                <td className="px-3 py-2">
                                                                                    <Input
                                                                                        type="text"
                                                                                        className={cn(
                                                                                            "h-10 text-right font-mono border border-gray-200 focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue transition-colors",
                                                                                            item.hidden ? "text-gray-400 italic bg-gray-50/50 border-transparent" : "text-gray-900 bg-white"
                                                                                        )}
                                                                                        value={item.hidden ? 'ไม่มีราคาประเมิน' : (item.price ? Number(item.price).toLocaleString() : '')}
                                                                                        onChange={(e) => handleUpdateLandAppraisal(idx, 'price', e.target.value.replace(/,/g, ''))}
                                                                                        placeholder="0"
                                                                                        readOnly={item.hidden}
                                                                                    />
                                                                                </td>
                                                                                <td className="px-3 py-2 text-center">
                                                                                    <div className="flex justify-center">
                                                                                        <Switch
                                                                                            checked={!item.hidden}
                                                                                            onCheckedChange={(checked) => handleUpdateLandAppraisal(idx, 'hidden', !checked)}
                                                                                        />
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>

                                                        {/* ราคาประเมินสิ่งปลูกสร้าง Table */}
                                                        <div className="space-y-4">
                                                            <div className="flex items-center justify-between">
                                                                <Label className="text-sm font-bold text-gray-700">ราคาประเมินสิ่งปลูกสร้าง</Label>
                                                            </div>
                                                            <div className="overflow-hidden border border-border-strong rounded-xl bg-white">
                                                                <table className="w-full text-sm">
                                                                    <thead className="bg-gray-50 border-b border-border-strong">
                                                                        <tr>
                                                                            <th className="px-4 py-3 text-left font-bold text-gray-600">แหล่งที่มา</th>
                                                                            <th className="px-4 py-3 text-right font-bold text-gray-600">ราคา (บาท)</th>
                                                                            <th className="px-4 py-3 w-10">แสดง</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="divide-y divide-gray-100">
                                                                        {(formData.buildingAppraisals || []).map((item: any, idx: number) => (
                                                                            <tr key={idx} className={cn("group transition-colors", item.hidden ? "bg-gray-50/50 opacity-50" : "hover:bg-gray-50/50")}>
                                                                                <td className="px-4 py-2 font-medium text-gray-700">
                                                                                    {item.label}
                                                                                </td>
                                                                                <td className="px-3 py-2">
                                                                                    <Input
                                                                                        type="text"
                                                                                        className={cn(
                                                                                            "h-10 text-right font-mono border border-gray-200 focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue transition-colors",
                                                                                            item.hidden ? "text-gray-400 italic bg-gray-50/50 border-transparent" : "text-gray-900 bg-white"
                                                                                        )}
                                                                                        value={item.hidden ? 'ไม่มีราคาประเมิน' : (item.price ? Number(item.price).toLocaleString() : '')}
                                                                                        onChange={(e) => handleUpdateBuildingAppraisal(idx, 'price', e.target.value.replace(/,/g, ''))}
                                                                                        placeholder="0"
                                                                                        readOnly={item.hidden}
                                                                                    />
                                                                                </td>
                                                                                <td className="px-3 py-2 text-center">
                                                                                    <div className="flex justify-center">
                                                                                        <Switch
                                                                                            checked={!item.hidden}
                                                                                            onCheckedChange={(checked) => handleUpdateBuildingAppraisal(idx, 'hidden', !checked)}
                                                                                        />
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>


                                                    </div>
                                                ) : (
                                                    <div className="space-y-4 md:col-span-2 p-4 bg-gray-50 border border-border-strong rounded-xl">
                                                        <Label className="text-sm text-gray-700">ราคาประเมิน กรอก เบื้องต้น</Label>

                                                        <div className="space-y-2">
                                                            <Label className="text-xs text-gray-500">แหล่งอ้างอิงราคาประเมิน</Label>
                                                            <Select value={formData.appraisalSource || ''} onValueChange={(val) => setFormData({ ...formData, appraisalSource: val })}>
                                                                <SelectTrigger className="bg-white text-base h-12 rounded-xl">
                                                                    <SelectValue placeholder="เลือกแหล่งอ้างอิง" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="department_of_lands">กรมที่ดิน</SelectItem>
                                                                    <SelectItem value="external_appraisal">บ.ประเมินนอก</SelectItem>
                                                                    <SelectItem value="treasury_department">กรมธนารักษ์ (ที่ดินพร้อมสิ่งปลูกสร้าง, ห้องชุด)</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                                            <div className="space-y-2">
                                                                <Label className="text-xs text-gray-500">ราคาที่ดิน (บาท)</Label>
                                                                <Input
                                                                    type="text"
                                                                    value={formData.appraisedLandPrice ? Number(formData.appraisedLandPrice).toLocaleString() : ''}
                                                                    onChange={(e) => {
                                                                        const value = e.target.value.replace(/,/g, '');
                                                                        if (!isNaN(Number(value))) {
                                                                            const landPrice = Number(value) || 0;
                                                                            const buildingPrice = Number(formData.appraisedBuildingPrice) || 0;
                                                                            setFormData({
                                                                                ...formData,
                                                                                appraisedLandPrice: value,
                                                                                appraisalPrice: landPrice + buildingPrice
                                                                            });
                                                                        }
                                                                    }}
                                                                    className="h-12 text-base rounded-xl font-mono text-right"
                                                                    placeholder="0"
                                                                />
                                                            </div>

                                                            <div className="space-y-2">
                                                                <Label className="text-xs text-gray-500">ราคาสิ่งปลูกสร้าง (บาท)</Label>
                                                                <Input
                                                                    type="text"
                                                                    value={formData.appraisedBuildingPrice ? Number(formData.appraisedBuildingPrice).toLocaleString() : ''}
                                                                    onChange={(e) => {
                                                                        const value = e.target.value.replace(/,/g, '');
                                                                        if (!isNaN(Number(value))) {
                                                                            const buildingPrice = Number(value) || 0;
                                                                            const landPrice = Number(formData.appraisedLandPrice) || 0;
                                                                            setFormData({
                                                                                ...formData,
                                                                                appraisedBuildingPrice: value,
                                                                                appraisalPrice: landPrice + buildingPrice
                                                                            });
                                                                        }
                                                                    }}
                                                                    className="h-12 text-base rounded-xl font-mono text-right"
                                                                    placeholder="0"
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* 7. แสดง Sum รวม */}
                                                        <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                                                            <Label className="text-sm text-gray-700">ราคารวม (ที่ดิน + สิ่งปลูกสร้าง)</Label>
                                                            <span className="text-xl font-bold text-chaiyo-blue">
                                                                {((Number(formData.appraisedLandPrice) || 0) + (Number(formData.appraisedBuildingPrice) || 0)).toLocaleString()} บาท
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}

                                            </div>
                                        )}
                                        {/* Pricing Summary Section */}
                                        {formData.collateralType !== 'land' && (formData.aiPrice > 0 || formData.redbookPrice > 0 || formData.appraisalPrice > 0) && (
                                            <div className="p-6 bg-gradient-to-r from-gray-50 to-white">
                                                <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                    สรุปราคาประเมินเบื้องต้น
                                                </h4>
                                                <div className="grid grid-cols-1 gap-4">
                                                    <div className="p-4 rounded-xl bg-chaiyo-blue text-gray-900 border border-border-strong space-y-1">
                                                        <p className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">Final Appraisal Price</p>
                                                        <p className="text-2xl font-bold text-white">
                                                            ฿{formData.collateralType === 'land'
                                                                ? (calculatedLandResult?.finalAppraisalPrice?.toLocaleString() || '0')
                                                                : (formData.appraisalPrice?.toLocaleString() || '0')
                                                            }
                                                        </p>
                                                        <p className="text-[9px] text-blue-100 italic">
                                                            {formData.collateralType === 'land'
                                                                ? (calculatedLandResult?.isLandOnly ? '* ที่ดิน หลังคำนวณ LTV' : '* (ที่ดิน + สิ่งปลูกสร้าง) หลังคำนวณ LTV')
                                                                : '* อ้างอิงวงเงินสูงสุด'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {/* End of Form and Pricing Summary Card (Card 2) */}
                                    </div>

                                    {/* Dynamic Collateral Questions Card (Card 3) - Wrapped in Accordion */}
                                    {(() => {
                                        let questions = COLLATERAL_QUESTIONS[formData.collateralType] || [];

                                        // Special logic for Land: Filter by Deed Type per screenshot requirements
                                        if (formData.collateralType === 'land') {
                                            if (formData.landDeedType === 'orchor2') {
                                                questions = []; // Hide all questions for OrChor 2
                                            }
                                        }

                                        if (questions.length === 0) return null;

                                        return (
                                            <div className="border border-border-strong rounded-2xl bg-white overflow-hidden">
                                                {/* Accordion Header */}
                                                <button
                                                    onClick={() => setIsQuestionsExpanded(!isQuestionsExpanded)}
                                                    className={cn(
                                                        "w-full p-6 flex items-center justify-between text-left transition-colors hover:bg-gray-50",
                                                        isQuestionsExpanded ? "bg-gray-50/50" : "bg-white"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-3">

                                                        <div>
                                                            <h4 className="text-lg font-bold text-gray-900">การประเมินสภาพทรัพย์สินเพิ่มเติม</h4>
                                                        </div>
                                                    </div>
                                                    <div className={cn(
                                                        "w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-transform duration-300",
                                                        isQuestionsExpanded ? "rotate-180" : ""
                                                    )}>
                                                        <ChevronDown className="w-5 h-5 text-gray-500" />
                                                    </div>
                                                </button>

                                                {/* Accordion Content */}
                                                <div className={cn(
                                                    "divide-y divide-gray-100 transition-all duration-300 ease-in-out",
                                                    isQuestionsExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                                                )}>
                                                    {questions.map((q) => (
                                                        <div key={q.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/40">
                                                            <div>
                                                                <Label className=" font-bold">{q.text}</Label>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 bg-white border border-border-strong p-1.5 rounded-xl shrink-0">
                                                                <button
                                                                    onClick={() => setFormData({ ...formData, collateralQuestions: { ...formData.collateralQuestions, [q.id]: 'yes' } })}
                                                                    className={cn("px-5 py-2 rounded-lg text-sm font-bold transition-all", formData.collateralQuestions?.[q.id] === 'yes' ? "bg-gray-200 text-gray-700" : "text-gray-500 hover:bg-gray-100")}
                                                                >
                                                                    ใช่
                                                                </button>
                                                                <button
                                                                    onClick={() => setFormData({ ...formData, collateralQuestions: { ...formData.collateralQuestions, [q.id]: 'no' } })}
                                                                    className={cn("px-5 py-2 rounded-lg text-sm font-bold transition-all", formData.collateralQuestions?.[q.id] === 'no' ? "bg-chaiyo-blue text-white" : "text-gray-500 hover:bg-gray-100")}
                                                                >
                                                                    ไม่ใช่
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })()}

                                </div>

                            </div>
                        </div>

                        {/* Section 2: Borrower Info */}
                        <div className="relative border-l-[2px] border-transparent ml-4 pl-8 pb-4">
                            <div className="absolute -left-[18px] top-0 w-8 h-8 bg-white rounded-full border-[2px] border-gray-200 flex items-center justify-center font-bold text-gray-500 text-sm">
                                2
                            </div>

                            <div className="space-y-6 -mt-1">
                                <h3 className="text-xl font-bold text-gray-900">ข้อมูลทั่วไป</h3>

                                <div className="border border-border-strong rounded-xl bg-white overflow-hidden p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                        <div className="space-y-2">
                                            <Label>สัญชาติ <span className="text-red-500">*</span></Label>
                                            <Select value={formData.nationality} onValueChange={(val) => setFormData({ ...formData, nationality: val })}>
                                                <SelectTrigger className="bg-white"><SelectValue placeholder="เลือกสัญชาติ" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="thai">ไทย</SelectItem>
                                                    <SelectItem value="non-thai">ต่างชาติ (Non-Thai)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>โครงการพิเศษ</Label>
                                            <Select value={formData.specialProject} onValueChange={(val) => setFormData({ ...formData, specialProject: val })}>
                                                <SelectTrigger className="bg-white"><SelectValue placeholder="เลือกโครงการพิเศษ" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">ไม่ระบุ</SelectItem>
                                                    <SelectItem value="b2b_payroll">B2B Payroll</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>กลุ่มอาชีพ <span className="text-red-500">*</span></Label>
                                            <Select value={formData.occupationGroup} onValueChange={(val) => setFormData({ ...formData, occupationGroup: val })}>
                                                <SelectTrigger className="bg-white"><SelectValue placeholder="เลือกกลุ่มอาชีพ" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="employee">พนักงานประจำ</SelectItem>
                                                    <SelectItem value="business_owner">เจ้าของกิจการ</SelectItem>
                                                    <SelectItem value="farmer">เกษตรกร</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>อายุผู้กู้ (ปี) <span className="text-red-500">*</span></Label>
                                            <Input
                                                type="number"
                                                placeholder="เช่น 35"
                                                value={formData.borrowerAge || ''}
                                                onChange={(e) => setFormData({ ...formData, borrowerAge: e.target.value })}

                                            />
                                        </div>

                                        <div className="space-y-4 md:col-span-2 pt-4 border-t border-gray-100">
                                            <Label className="text-sm font-bold text-gray-700">วงเงินที่ต้องการ</Label>
                                            <div className="relative">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">฿</div>
                                                <Input
                                                    type="text"
                                                    placeholder="ระบุวงเงินที่ต้องการ"
                                                    value={formData.requestedAmount ? Number(formData.requestedAmount).toLocaleString() : ''}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/,/g, '');
                                                        if (!isNaN(Number(value))) {
                                                            setFormData({ ...formData, requestedAmount: value });
                                                        }
                                                    }}
                                                    className=" pl-10 text-right text-base font-mono border-1 focus:border-chaiyo-blue transition-all"
                                                />
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                {/* New Section: Income and Debt Breakdown */}
                                <div className="border border-border-strong rounded-xl bg-white overflow-hidden p-6 space-y-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-sm font-bold text-gray-700">รายได้รวม</Label>
                                        </div>
                                        <div className="overflow-hidden border border-border-strong rounded-xl bg-white">
                                            <table className="w-full text-sm">
                                                <colgroup>
                                                    <col className="w-auto" />
                                                    <col className="w-[300px]" />
                                                </colgroup>
                                                <thead className="bg-gray-50 border-b border-border-strong">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left font-bold text-gray-600">ประเภทรายได้</th>
                                                        <th className="px-4 py-3 text-right font-bold text-gray-600">จำนวนเงิน (บาท) / ต่อเดือน</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {(formData.incomeBreakdown || []).filter((i: any) => i.source !== 'total').map((item: any, idx: number) => (
                                                        <tr key={idx} className="group transition-colors hover:bg-gray-50/50">
                                                            <td className="px-4 py-2 font-medium text-gray-700">
                                                                {item.label}
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                <Input
                                                                    type="text"
                                                                    className="h-10 text-right font-mono border border-gray-200 focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue transition-colors text-gray-900 bg-white"
                                                                    value={item.price ? Number(item.price).toLocaleString() : ''}
                                                                    onChange={(e) => handleUpdateIncomeBreakdown(idx, e.target.value.replace(/,/g, ''))}
                                                                    placeholder="0"
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    <tr className="bg-blue-50/30">
                                                        <td className="px-4 py-3 font-bold text-gray-900 text-right">รวมรายได้ทั้งหมด</td>
                                                        <td className="px-4 py-3 text-right">
                                                            <span className="text-lg font-bold text-chaiyo-blue font-mono">
                                                                {Number(formData.salary || 0).toLocaleString()}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-sm font-bold text-gray-700">ภาระหนี้สินรวม</Label>
                                        </div>
                                        <div className="overflow-hidden border border-border-strong rounded-xl bg-white">
                                            <table className="w-full text-sm">
                                                <colgroup>
                                                    <col className="w-auto" />
                                                    <col className="w-[300px]" />
                                                </colgroup>
                                                <thead className="bg-gray-50 border-b border-border-strong">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left font-bold text-gray-600">รายการภาระหนี้</th>
                                                        <th className="px-4 py-3 text-right font-bold text-gray-600">จำนวนเงิน (บาท) / ต่อเดือน</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {(formData.debtBreakdown || []).map((item: any, idx: number) => (
                                                        <tr key={idx} className="group transition-colors hover:bg-gray-50/50">
                                                            <td className="px-4 py-2 font-medium text-gray-700">
                                                                {item.label}
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                <Input
                                                                    type="text"
                                                                    className="h-10 text-right font-mono border border-gray-200 focus:border-chaiyo-blue focus:ring-1 focus:ring-chaiyo-blue transition-colors text-gray-900 bg-white"
                                                                    value={item.price ? Number(item.price).toLocaleString() : ''}
                                                                    onChange={(e) => handleUpdateDebtBreakdown(idx, e.target.value.replace(/,/g, ''))}
                                                                    placeholder="0"
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    <tr className="bg-gray-50/50">
                                                        <td className="px-4 py-3 font-bold text-gray-900 text-right">รวมภาระหนี้ทั้งหมด</td>
                                                        <td className="px-4 py-3 text-right">
                                                            <span className="text-lg font-bold text-red-600 font-mono">
                                                                {Number(formData.monthlyDebt || 0).toLocaleString()}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                {/* Summary / Submit */}
                                <div className="pt-4 flex flex-col items-end space-y-4">
                                    <Button
                                        size="xl"
                                        onClick={nextStep}
                                        className="min-w-[200px] font-bold transition-all shadow-md hover:shadow-lg"
                                        disabled={!isStep1Valid()}
                                    >
                                        ถัดไป <ChevronRight className="w-5 h-5 ml-2" />
                                    </Button>
                                    <p className="text-xs text-gray-400">ระบบจำเป็นต้องใช้ข้อมูลเหล่านี้เพื่อประเมินความสามารถในการชำระหนี้</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* REMOVED Step 2: Select Type */}

                {/* STEP 2: Verify Info & Result Preview (Was Step 3 and 4) */}
                {
                    currentStep === 2 && (() => {
                        let finalLimit = 0;
                        let appraisalPrice = Number(formData.appraisalPrice) || 0;
                        let ltvAdjustments: any[] = [];
                        let finalLTV = 0;
                        let basePriceTotal = 0;

                        if (formData.collateralType === 'land' && calculatedLandResult) {
                            const { chosenLand, chosenBuilding, finalAppraisalPrice, basePriceTotal: bpt, ltvPenalty, capLtv, finalCalculatedLimit, isLandOnly } = calculatedLandResult;

                            finalLimit = finalSummaryLimit;
                            appraisalPrice = bpt; // Full appraisal price of the selected sources
                            basePriceTotal = bpt;
                            finalLTV = capLtv;

                            ltvAdjustments.push({ label: `ประเมินที่ดิน (แหล่ง: ${chosenLand.label})`, value: `${(chosenLand.ltv * 100).toFixed(0)}%` });
                            if (!isLandOnly && chosenBuilding.price > 0) {
                                ltvAdjustments.push({ label: `ประเมินสิ่งปลูกสร้าง (แหล่ง: ${chosenBuilding.label})`, value: `${(chosenBuilding.ltv * 100).toFixed(0)}%` });
                            }

                            if (isLandOnly) {
                                ltvAdjustments.push({ label: 'วงเงินสูงสุด (ที่ดินเปล่า)', value: '220,000 บาท' });
                            } else {
                                ltvAdjustments.push({ label: `วงเงินสูงสุดไม่เกิน ${(capLtv * 100).toFixed(0)}% ของ (ที่ดิน+สิ่งปลูกสร้าง)`, value: 'Max Cap' });
                            }

                            if (ltvPenalty > 0) {
                                ltvAdjustments.push({ label: 'สาขาภาคอีสานและเจ้าของกิจการ', value: '-5%' });
                            }

                        } else {
                            let baseLTV = 0.80; // Default base



                            if (formData.specialProject === 'b2b_payroll') {
                                baseLTV += 0.10;
                                ltvAdjustments.push({ label: 'โครงการพิเศษ B2B Payroll', value: '+10%' });
                            }



                            if (formData.branchRegion === 'isan' && formData.occupationGroup === 'business_owner') {
                                baseLTV -= 0.05;
                                ltvAdjustments.push({ label: 'สาขาภาคอีสานและเจ้าของกิจการ', value: '-5%' });
                            }

                            const maxLtvCap = 1.20;
                            finalLTV = Math.min(baseLTV, maxLtvCap);

                            finalLimit = finalSummaryLimit;
                        }

                        return (
                            <div className="max-w-6xl mx-auto print:hidden animate-in slide-in-from-right-8 duration-300 pb-20">

                                {/* Page Header */}
                                <div className="mb-8 flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <h2 className="text-2xl font-bold text-gray-800">สรุปวงเงินประเมินเบื้องต้น</h2>
                                        </div>
                                        <p className="text-gray-500">ตรวจสอบความถูกต้องและวงเงินประเมินสูงสุด</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                                    {/* RIGHT MAIN CONTENT: Form & Summary */}
                                    <div className="col-span-1 lg:col-span-12 space-y-8">



                                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                                            {/* Display Info Section */}
                                            <div className="lg:col-span-2 space-y-6">
                                                <div className="bg-white border border-border-strong rounded-xl overflow-hidden">
                                                    <div className="p-6 space-y-6">
                                                        <h4 className="font-bold text-gray-900 border-b border-gray-200 pb-3 flex items-center gap-2">
                                                            <User className="w-5 h-5 text-chaiyo-blue" /> ปัจจัยที่มีผลต่อการคำนวณ LTV
                                                        </h4>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                                                            <div className="space-y-1">
                                                                <p className="text-gray-500 text-sm">ประเภทหลักประกัน</p>
                                                                <p className="font-semibold text-gray-900">
                                                                    {PRODUCTS.find(p => p.id === formData.collateralType)?.label || '-'}
                                                                </p>
                                                            </div>

                                                            <div className="space-y-1">
                                                                <p className="text-gray-500 text-sm">กลุ่มอาชีพ</p>
                                                                <p className="font-semibold text-gray-900">
                                                                    {formData.occupationGroup === 'employee' ? 'พนักงานประจำ' :
                                                                        formData.occupationGroup === 'business_owner' ? 'เจ้าของกิจการ' :
                                                                            formData.occupationGroup === 'farmer' ? 'เกษตรกร' : '-'}
                                                                </p>
                                                            </div>

                                                            <div className="space-y-1">
                                                                <p className="text-gray-500 text-sm">โครงการพิเศษ</p>
                                                                <p className="font-semibold text-gray-900">
                                                                    {formData.specialProject === 'b2b_payroll' ? 'B2B Payroll' : 'ทั่วไป'}
                                                                </p>
                                                            </div>

                                                            <div className="space-y-1">
                                                                <p className="text-gray-500 text-sm">อายุผู้กู้</p>
                                                                <p className="font-semibold text-gray-900">{formData.borrowerAge ? `${formData.borrowerAge} ปี` : '-'}</p>
                                                            </div>
                                                        </div>

                                                        {/* Visual context for the asset choice */}
                                                        <div className="mt-4 pt-6 border-t border-gray-50">
                                                            <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-4">
                                                                <div className={cn(
                                                                    "p-3 rounded-full",
                                                                    PRODUCTS.find(p => p.id === formData.collateralType)?.color || "bg-gray-100 text-gray-400"
                                                                )}>
                                                                    {(() => {
                                                                        const Icon = PRODUCTS.find(p => p.id === formData.collateralType)?.icon || Briefcase;
                                                                        return <Icon className="w-6 h-6" />;
                                                                    })()}
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-2">
                                                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">หลักประกันที่ประเมิน</p>

                                                                    </div>
                                                                    <p className="font-bold text-gray-900">
                                                                        {formData.brand} {formData.model} {formData.year}
                                                                        {formData.collateralType === 'land' && `${formData.province} (${formData.area || '-'})`}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="mt-8 pt-4 border-t border-gray-200">
                                                            <Button
                                                                variant="outline"
                                                                size="xl"
                                                                onClick={() => setCurrentStep(1)}
                                                                className="w-full font-bold transition-all flex items-center justify-center gap-2"
                                                            >
                                                                <ChevronLeft className="w-4 h-4" /> แก้ไขข้อมูล
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Loan Summary Limit Card Breakdown */}
                                            <div className="lg:col-span-3 space-y-6">
                                                <div className="bg-white border border-border-strong rounded-2xl overflow-hidden">
                                                    <div className="bg-gray-50 p-6 text-gray-900 flex items-center gap-3 border-b border-gray-200">

                                                        <h3 className="font-bold text-lg">สรุปวงเงินกู้สูงสุด (Maximum Loan Limit)</h3>
                                                    </div>

                                                    <div className="p-6 space-y-6">
                                                        {/* Row 1: Appraisal */}
                                                        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <p className="font-medium text-gray-800">ราคาประเมิน (Appraisal Price)</p>
                                                                </div>
                                                                <p className="text-xs text-blue-500 mt-1">
                                                                    {formData.collateralType === 'land' ? '*อ้างอิงจากราคาประเมินราชการ' : '*อ้างอิงจากข้อมูลราคากลาง Redbook'}
                                                                </p>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className="text-xl font-bold text-gray-900">
                                                                    {formData.appraisalPrice ? Number(formData.appraisalPrice).toLocaleString() : '0'}
                                                                </span>
                                                                <span className="text-gray-500 ml-2">บาท</span>
                                                            </div>
                                                        </div>

                                                        {/* Row 2: LTV Breakdown */}
                                                        <div className="space-y-3 pb-4 border-b border-gray-200">
                                                            <div className="flex justify-between items-center">
                                                                <p className="font-medium text-gray-800">สัดส่วนวงเงินกู้ (LTV)</p>
                                                                <span className="font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-full text-sm">
                                                                    {(finalLTV * 100).toFixed(0)}%
                                                                </span>
                                                            </div>

                                                            <div className="rounded-xl p-4 border border-border-strong space-y-2 text-sm">
                                                                {formData.collateralType !== 'land' && (
                                                                    <div className="flex justify-between text-gray-600">
                                                                        <span>ฐาน LTV มาตรฐาน</span>
                                                                        <span>80%</span>
                                                                    </div>
                                                                )}
                                                                {ltvAdjustments.map((adj, idx) => {
                                                                    const isDeduction = adj.value.includes('-');
                                                                    return (
                                                                        <div key={idx} className={cn(
                                                                            "flex justify-between font-medium pb-1.5 last:pb-0 last:border-0 border-b border-gray-100 border-dashed",
                                                                            isDeduction ? "text-red-500" : "text-emerald-600"
                                                                        )}>
                                                                            <span className="flex items-center gap-1.5">
                                                                                {isDeduction ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                                                                                {adj.label}
                                                                            </span>
                                                                            <span>{adj.value}</span>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>

                                                        {/* Row 3: Final Limit */}
                                                        <div className="bg-blue-50/50 rounded-xl p-6 border border-blue-100 mt-2">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <span className="text-blue-900 font-bold text-lg">วงเงินประเมินสูงสุดที่ได้</span>
                                                                <div className="text-right">
                                                                    <span className="text-4xl font-black text-chaiyo-blue tracking-tight">
                                                                        {finalLimit.toLocaleString()}
                                                                    </span>
                                                                    <span className="text-gray-500 font-medium ml-2">บาท</span>
                                                                </div>
                                                            </div>

                                                            <p className="text-xs text-blue-600/80 mt-3 text-right">
                                                                *คำนวณจาก {Number(appraisalPrice).toLocaleString()} บาท
                                                            </p>
                                                        </div>

                                                        {/* Action Buttons */}
                                                        <div className="flex justify-end pt-4 gap-4">

                                                            <Button
                                                                size="xl"
                                                                onClick={() => setCurrentStep(3)}
                                                                className="min-w-[200px] font-bold transition-all"
                                                            >
                                                                ถัดไป <ChevronRight className="w-5 h-5 ml-2" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        );
                    })()
                }




                {/* REMOVED Step 4: Customer Info */}

                {/* REMOVED Step 4: Customer Info */}

                {/* STEP 3: Product Suggestion (Was Step 4) */}
                {
                    currentStep === 3 && (() => {
                        const finalLimit = finalSummaryLimit;
                        const maxLoan = finalLimit;
                        const selectedProduct = PRODUCTS.find(p => p.id === formData.collateralType);
                        const TypeIcon = selectedProduct?.icon || Car;

                        // Unified interest rate: 23.99% per year for all types
                        const annualRate = 0.2399;
                        const monthlyRate = annualRate / 12;

                        // Determine loan product name
                        const loanProduct = (() => {
                            switch (formData.collateralType) {
                                case 'land': return { name: 'สินเชื่อโฉนดที่ดิน', tagline: 'สินเชื่อโฉนดที่ดินไชโย' };
                                case 'moto': return { name: 'สินเชื่อรถจักรยานยนต์', tagline: 'สินเชื่อรถจักรยานยนต์ไชโย' };
                                case 'truck': return { name: 'สินเชื่อรถบรรทุก', tagline: 'สินเชื่อรถบรรทุกไชโย' };
                                case 'agri': return { name: 'สินเชื่อรถเพื่อการเกษตร', tagline: 'สินเชื่อรถเพื่อการเกษตรไชโย' };
                                default: return { name: 'สินเชื่อรถยนต์', tagline: 'สินเชื่อรถยนต์ไชโย' };
                            }
                        })();

                        // Monthly installment calculation (amortization)
                        const calcMonthly = (principal: number, months: number) => {
                            if (principal <= 0 || months <= 0) return 0;
                            return Math.ceil(principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1));
                        };

                        // Balloon payment calculation (interest-only monthly + lump sum at end)
                        const calcBalloonMonthly = (principal: number) => {
                            return Math.ceil(principal * monthlyRate);
                        };

                        const exampleMonths = [12, 24, 36, 48, 60];

                        // Document checklist per collateral type & plan
                        type SectionGroup = { title: string; items: string[] };
                        const documentChecklist: { label: string; items: (string | SectionGroup)[] } = (() => {
                            const common = [
                                'บัตรประชาชนตัวจริง (ผู้กู้)',
                                'ทะเบียนบ้าน (สำเนา)',
                                'รูปถ่ายหน้าตรงคู่บัตรประชาชน',
                            ];

                            const isVehicle = ['car', 'moto', 'truck'].includes(formData.collateralType || '');

                            if (isVehicle) {
                                return {
                                    label: `เอกสารสำหรับ${loanProduct.name} (${selectedPlan === 'monthly' ? 'ผ่อนรายเดือน' : 'One-Time'})`,
                                    items: [
                                        {
                                            title: "ยืนยันตัวตน",
                                            items: [
                                                "สำเนาบัตรประชาชน ผู้กู้",
                                                "สำเนาบัตรประชาชน ผู้ค้ำประกัน (ถ้ามี)",
                                                "ใบเปลี่ยนชื่อ-นามสกุล ผู้กู้ (ถ้ามี)"
                                            ]
                                        },
                                        {
                                            title: "ตรวจสอบหลักประกัน / รูปถ่ายหลักประกัน (Time Stamp)",
                                            items: [
                                                "รูปหลังรถเห็นป้ายทะเบียน พร้อม เซลฟี่-ถือบัตรพนักงาน",
                                                "รูปหน้ารถ เห็นป้ายทะเบียน / เปิดกระโปงหน้า + เห็นเครื่องยนต์",
                                                "รูปหน้ารถ - เฉียงซ้าย45องศา",
                                                "รูปหน้ารถ - เฉียงขวา45องศา",
                                                "รูปหลังรถ - เฉียงซ้าย45องศา",
                                                "รูปหลังรถ - เฉียงขวา45องศา",
                                                "รูปภายในรถ + เห็นคอนโซล + เกียร์รถ",
                                                "รูปเลขตัวถัง/คัสซี",
                                                formData.collateralType === 'truck' ? "รูปเกียร์ 4x4 / 4WD (ถ้ามี)_สำหรับรถกระบะที่ขับเคลื่อน 4ล้อ" : null
                                            ].filter(Boolean) as string[]
                                        },
                                        {
                                            title: "หลักประกัน / เล่มทะเบียน เอกสารตรวจหลักประกัน (Time Stamp)",
                                            items: [
                                                "รูปถ่ายเล่มทะเบียน หน้าปก",
                                                "รูปถ่ายเล่มทะเบียน หน้ารายการจดทะเบียน",
                                                "รูปถ่ายเล่มทะเบียน หน้ากลางเล่ม",
                                                "รูปถ่ายเล่มทะเบียน หน้ารายการภาษี",
                                                "รูปถ่ายเล่มทะเบียน หน้าบันทึกเจ้าหน้าที่",
                                                "ผลเช็คต้น (ตามเงื่อนไข)",
                                                "หน้าตรวจสอบการชำระภาษีจากเว็ปกรมการขนส่งทางบก"
                                            ]
                                        },
                                        {
                                            title: "พิจารณาอนุมัติสินเชื่อ",
                                            items: [
                                                "สำเนาสมุดคู่ฝากธนาคารเพื่อใช้ในการโอนเงิน (บัญชีของลูกค้าเท่านั้น)",
                                                "ใบประเมินความสามารถลูกค้า (ผ่าน Branch App)",
                                                "แบบฟอร์มตรวจที่พักอาศัย (ถ้ามี)",
                                                "อีเมลผล ABC (ถ้ามี)"
                                            ]
                                        },
                                        {
                                            title: "รายได้",
                                            items: [
                                                "แบบฟอร์มประเมินรายได้ ผู้กู้",
                                                "แบบฟอร์มประเมินรายได้ ผู้ค้ำ (ถ้ามี)",
                                                "เอกสารรายได้ ของผู้กู้ (สลิปเงินเดือน, Bank Statement หรือ เอกสารอื่นๆ ที่แสดงให้เห็นรายได้ชัดเจน เช่น ใบประทวน, ใบเสร็จซื้อขายพืชผลทางการเกษตร, สัญญาว่าจ้าง เป็นต้น)",
                                                "เอกสารรายได้ ของผู้ค้ำ (ถ้ามี) (สลิปเงินเดือน, Bank Statement หรือ เอกสารอื่นๆ ที่แสดงให้เห็นรายได้ชัดเจน เช่น ใบประทวน, ใบเสร็จซื้อขายพืชผลทางการเกษตร, สัญญาว่าจ้าง เป็นต้น)",
                                                "แบบฟอร์มตรวจสอบภาคสนาม และข้อมูลบุคคลอ้างอิง (กรณีไม่มีเอกสารแสดงรายได้)"
                                            ]
                                        },
                                        {
                                            title: "เอกสารยืนยันการประกอบอาชีพ",
                                            items: [
                                                "รูปถ่ายกิจการ ของผู้กู้ (Time Stamp)",
                                                "รูปถ่ายกิจการ ของผู้ค้ำ (ถ้ามี) (Time Stamp)"
                                            ]
                                        },
                                        {
                                            title: "เอกสารอนุโลม",
                                            items: [
                                                "อนุโลม ผู้กู้ทำหรือไม่ทำประกัน ( PA Safty Loan) / ประกันภัยรถยนต์"
                                            ]
                                        }
                                    ]
                                };
                            }

                            switch (formData.collateralType) {
                                case 'agri':
                                    return {
                                        label: 'เอกสารสำหรับสินเชื่อเครื่องจักรเกษตร',
                                        items: [
                                            ...common,
                                            'เล่มทะเบียนเครื่องจักร หรือ ใบอินวอยซ์/ใบเสร็จซื้อขาย',
                                            'รูปถ่ายเครื่องจักร (4 ด้าน)',
                                            'หลักฐานการครอบครอง',
                                        ]
                                    };
                                case 'land':
                                    return {
                                        label: 'เอกสารสำหรับสินเชื่อโฉนดที่ดิน',
                                        items: [
                                            ...common,
                                            'โฉนดที่ดิน (ตัวจริง)',
                                            'รูปถ่ายที่ดิน (ภาพรวม + 4 ด้าน)',
                                            'แผนที่ที่ตั้งที่ดิน / Google Maps Pin',
                                            'หนังสือยินยอมคู่สมรส (ถ้ามี)',
                                        ]
                                    };
                                default:
                                    return { label: 'เอกสารที่ต้องใช้', items: common };
                            }
                        })();

                        const MOTO_PRODUCTS = [
                            {
                                code: 'ULMB',
                                name: 'รถมอไซค์ปลอดภาระ',
                                features: [
                                    'ชำระค่างวดรายเดือน',
                                    'ฟรี! บัตรเงินไชโย สำหรับเบิกเงินกู้เพิ่ม เมื่อมีวงเงินเหลือ ผ่านตู้ ATM ธ.ไทยพาณิชย์',
                                    'ฟรี! ประกันคุ้มครองวงเงินสินเชื่อ (Freebie)',
                                ],
                                nationality: ['thai'],
                                minAge: 25,
                                maxAge: 69,
                                collateralStatus: ['clear'],
                                collateral: 'moto',
                                terms: '12 - 36',
                                interestRate: '23.99%',
                            },
                            {
                                code: 'REUM',
                                name: 'รถมอไซค์รีไฟแนนซ์จำนำ',
                                features: [
                                    'ชำระค่างวดรายเดือน',
                                    'ฟรี! บริการชำระปิดบัญชีไฟแนนซ์เดิม',
                                    'ฟรี! บัตรเงินไชโย สำหรับเบิกเงินกู้เพิ่ม เมื่อมีวงเงินเหลือ ผ่านตู้ ATM ธ.ไทยพาณิชย์',
                                    'ฟรี! ประกันคุ้มครองวงเงินสินเชื่อ (Freebie)',
                                ],
                                nationality: ['thai'],
                                minAge: 25,
                                maxAge: 69,
                                collateralStatus: ['pledge'],
                                collateral: 'moto',
                                terms: '12 - 36',
                                interestRate: '23.99%',
                            },
                            {
                                code: 'ULMP',
                                name: 'Payroll ปลอดภาระ รถมอไซค์',
                                features: [
                                    'สะดวกกว่าด้วยบริการหักชำระค่างวดจากเงินเดือนโดยบริษัทที่ทำงานของท่านจะหักและนำส่งค่างวดให้อัตโนมัติ',
                                    'ฟรี! บัตรเงินไชโย สำหรับเบิกเงินกู้เพิ่ม เมื่อมีวงเงินเหลือ ผ่านตู้ ATM ธ.ไทยพาณิชย์',
                                ],
                                specialProject: 'b2b_payroll',
                                minAge: 25,
                                maxAge: 59,
                                collateralStatus: ['clear'],
                                collateral: 'moto',
                                terms: '12 - 36',
                                interestRate: '19.00%',
                            },
                            {
                                code: 'REPM',
                                name: 'Payroll รีไฟแนนซ์จำนำรถมอไซค์',
                                features: [
                                    'สะดวกกว่าด้วยบริการหักชำระค่างวดจากเงินเดือนโดยบริษัทที่ทำงานของท่านจะหักและนำส่งค่างวดให้อัตโนมัติ',
                                    'ฟรี! บริการชำระปิดบัญชีไฟแนนซ์เดิม',
                                    'ฟรี! บัตรเงินไชโย สำหรับเบิกเงินกู้เพิ่ม เมื่อมีวงเงินเหลือ ผ่านตู้ ATM ธ.ไทยพาณิชย์',
                                ],
                                specialProject: 'b2b_payroll',
                                minAge: 25,
                                maxAge: 59,
                                collateralStatus: ['pledge'],
                                collateral: 'moto',
                                terms: '12 - 36',
                                interestRate: '19.00%',
                            },
                            {
                                code: 'REXX',
                                name: 'รีไฟแนนซ์เช่าซื้อ มอไซค์',
                                features: [
                                    'ชำระค่างวดรายเดือน',
                                    'ฟรี! บริการชำระปิดบัญชีไฟแนนซ์เดิม',
                                    'ฟรี! บัตรเงินไชโย สำหรับเบิกเงินกู้เพิ่ม เมื่อมีวงเงินเหลือ ผ่านตู้ ATM ธ.ไทยพาณิชย์',
                                    'ฟรี! ประกันคุ้มครองวงเงินสินเชื่อ (Freebie)',
                                ],
                                nationality: ['thai'],
                                minAge: 25,
                                maxAge: 69,
                                collateralStatus: ['hire_purchase'],
                                collateral: 'moto',
                                terms: '12 - 36',
                                interestRate: '23.99%',
                            },
                            {
                                code: 'TLNM',
                                name: 'รถมอไซค์ ไม่ถือสัญชาติไทย ผ่อนรายเดือน',
                                features: [
                                    'ชำระค่างวดรายเดือน',
                                    'รองรับลูกค้าที่ไม่ได้มีสัญชาติไทย',
                                ],
                                nationality: ['non-thai'],
                                minAge: 25,
                                maxAge: 69,
                                collateralStatus: ['clear'],
                                collateral: 'moto',
                                terms: '12 - 36',
                                interestRate: '23.99%',
                            },
                        ];

                        const CAR_PRODUCTS = [
                            {
                                code: 'ULCR',
                                name: 'จำนำรถ ผ่อนรายเดือน',
                                features: [
                                    'ชำระค่างวดรายเดือน',
                                    'ฟรี! บัตรเงินไชโย สำหรับเบิกเงินกู้เพิ่ม เมื่อมีวงเงินเหลือ ผ่านตู้ ATM ธ.ไทยพาณิชย์',
                                    'ฟรี! ประกันคุ้มครองวงเงินสินเชื่อ (Freebie)',
                                ],
                                nationality: ['thai'],
                                minAge: 20,
                                maxAge: 69,
                                collateralStatus: ['clear'],
                                terms: '12 - 60',
                                interestRate: '23.99%',
                            },
                            {
                                code: 'REUC',
                                name: 'รีไฟแนนซ์จำนำรถยนต์ ผ่อนรายเดือน',
                                features: [
                                    'ชำระค่างวดรายเดือน',
                                    'ฟรี! บริการชำระปิดบัญชีไฟแนนซ์เดิม',
                                    'ฟรี! บัตรเงินไชโย สำหรับเบิกเงินกู้เพิ่ม เมื่อมีวงเงินเหลือ ผ่านตู้ ATM ธ.ไทยพาณิชย์',
                                    'ฟรี! ประกันคุ้มครองวงเงินสินเชื่อ (Freebie)',
                                ],
                                nationality: ['thai'],
                                minAge: 20,
                                maxAge: 69,
                                collateralStatus: ['pledge'],
                                terms: '12 - 60',
                                interestRate: '23.99%',
                            },
                            {
                                code: 'TLNC',
                                name: 'จำนำรถยนต์-ไม่ต้องมีสัญชาติไทย ผ่อนรายเดือน',
                                features: [
                                    'ชำระค่างวดรายเดือน',
                                    'รองรับลูกค้าที่ไม่ได้มีสัญชาติไทย',
                                ],
                                nationality: ['non-thai'],
                                minAge: 20,
                                maxAge: 69,
                                collateralStatus: ['clear'],
                                terms: '12 - 60',
                                interestRate: '23.99%',
                            },
                            {
                                code: 'ULCP',
                                name: 'Payroll รถยนต์ ปลอดภาระ',
                                features: [
                                    'สะดวกกว่าด้วยบริการหักชำระค่างวดจากเงินเดือนโดยบริษัทที่ทำงานของท่านจะหักและนำส่งค่างวดให้อัตโนมัติ',
                                    'ฟรี! บัตรเงินไชโย สำหรับเบิกเงินกู้เพิ่ม เมื่อมีวงเงินเหลือ ผ่านตู้ ATM ธ.ไทยพาณิชย์',
                                ],
                                specialProject: 'b2b_payroll',
                                minAge: 20,
                                maxAge: 59,
                                collateralStatus: ['clear'],
                                terms: '12 - 60',
                                interestRate: '19.00%',
                            },
                            {
                                code: 'REPC',
                                name: 'Payroll รีไฟแนนซ์รถยนต์',
                                features: [
                                    'สะดวกกว่าด้วยบริการหักชำระค่างวดจากเงินเดือนโดยบริษัทที่ทำงานของท่านจะหักและนำส่งค่างวดให้อัตโนมัติ',
                                    'ฟรี บริการชำระปิดบัญชีไฟแนนซ์เดิม',
                                    'ฟรี บัตรเงินไชโย สำหรับเบิกเงินกู้เพิ่ม เมื่อมีวงเงินเหลือ ผ่านตู้ ATM ธ.ไทยพาณิชย์',
                                ],
                                specialProject: 'b2b_payroll',
                                minAge: 20,
                                maxAge: 59,
                                collateralStatus: ['pledge'],
                                terms: '12 - 60',
                                interestRate: '19.00%',
                            },
                            {
                                code: 'REXX',
                                name: 'รีไฟแนนซ์เช่าซื้อ รถยนต์',
                                features: [
                                    'ชำระค่างวดรายเดือน',
                                    'ฟรี! บริการชำระปิดบัญชีไฟแนนซ์เดิม',
                                    'ฟรี! บัตรเงินไชโย สำหรับเบิกเงินกู้เพิ่ม เมื่อมีวงเงินเหลือ ผ่านตู้ ATM ธ.ไทยพาณิชย์',
                                    'ฟรี! ประกันคุ้มครองวงเงินสินเชื่อ (Freebie)',
                                ],
                                nationality: ['thai'],
                                minAge: 20,
                                maxAge: 69,
                                collateralStatus: ['hire_purchase'],
                                terms: '12 - 60',
                                interestRate: '23.99%',
                            },
                        ];

                        const TRUCK_PRODUCTS = [
                            {
                                code: 'TLTK',
                                name: 'จำนำรถบรรทุก ผ่อนรายเดือน',
                                features: [
                                    'ชำระค่างวดรายเดือน',
                                    'ฟรี! ประกันคุ้มครองวงเงินสินเชื่อ (Freebie)',
                                ],
                                nationality: ['thai'],
                                minAge: 20,
                                maxAge: 69,
                                collateralStatus: ['clear'],
                                terms: '12 - 60',
                                interestRate: '23.99%',
                                specialProject: undefined,
                            },
                            {
                                code: 'TLT1',
                                name: 'จำนำรถบรรทุก ONE TIME',
                                features: [
                                    'ชำระค่างวดและดอกเบี้ยครั้งเดียว',
                                    'เหมาะสำหรับลูกค้าที่ต้องการใช้เงินฉุกเฉิน แต่คาดว่าจะสามารถชำระคืนได้ภายใน 1 - 4 เดือน',
                                ],
                                nationality: ['thai'],
                                minAge: 20,
                                maxAge: 69,
                                collateralStatus: ['clear'],
                                terms: '1 - 4',
                                interestRate: '23.99%',
                                specialProject: undefined,
                            },
                            {
                                code: 'RETK',
                                name: 'รีไฟแนนซ์ จำนำรถบรรทุก ผ่อนรายเดือน',
                                features: [
                                    'ชำระค่างวดรายเดือน',
                                    'ฟรี! บริการชำระปิดบัญชีไฟแนนซ์เดิม',
                                    'ฟรี! ประกันคุ้มครองวงเงินสินเชื่อ (Freebie)',
                                ],
                                nationality: ['thai'],
                                minAge: 20,
                                maxAge: 69,
                                collateralStatus: ['pledge'],
                                terms: '12 - 60',
                                interestRate: '23.99%',
                                specialProject: undefined,
                            },
                            {
                                code: 'RET1',
                                name: 'รีไฟแนนซ์ จำนำรถบรรทุก One time',
                                features: [
                                    'ชำระค่างวดและดอกเบี้ยครั้งเดียว',
                                    'เหมาะสำหรับลูกค้าที่ต้องการใช้เงินฉุกเฉิน แต่คาดว่าจะสามารถชำระคืนได้ภายใน 1 - 4 เดือน',
                                    'ฟรี! บริการชำระปิดบัญชีไฟแนนซ์เดิม',
                                ],
                                nationality: ['thai'],
                                minAge: 20,
                                maxAge: 69,
                                collateralStatus: ['pledge'],
                                terms: '1 - 4',
                                interestRate: '23.99%',
                                specialProject: undefined,
                            },
                            {
                                code: 'REXX',
                                name: 'รีไฟแนนซ์เช่าซื้อ รถบรรทุก',
                                features: [
                                    'ชำระค่างวดรายเดือน',
                                    'ฟรี! บริการชำระปิดบัญชีไฟแนนซ์เดิม',
                                    'ฟรี! ประกันคุ้มครองวงเงินสินเชื่อ (Freebie)',
                                ],
                                nationality: ['thai'],
                                minAge: 20,
                                maxAge: 69,
                                collateralStatus: ['hire_purchase'],
                                terms: '12 - 60',
                                interestRate: '23.99%',
                                specialProject: undefined,
                            },
                        ];

                        const AGRI_PRODUCTS = [
                            {
                                code: 'TLIA',
                                name: 'จำนำรถเกษตรเก่า ผ่อนรายเดือน',
                                features: [
                                    'ชำระค่างวดรายเดือน',
                                    'ฟรี! ประกันคุ้มครองวงเงินสินเชื่อ (Freebie)',
                                ],
                                nationality: ['thai'],
                                minAge: 20,
                                maxAge: 69,
                                collateralStatus: ['clear'],
                                occupation: 'all',
                                terms: '12 - 60',
                                interestRate: '23.99%',
                                specialProject: undefined,
                            },
                            {
                                code: 'TLA1',
                                name: 'จำนำรถเกษตรเก่า ONE TIME',
                                features: [
                                    'ชำระค่างวดและดอกเบี้ยครั้งเดียว',
                                    'เหมาะสำหรับลูกค้าที่ต้องการใช้เงินฉุกเฉิน แต่คาดว่าจะสามารถชำระคืนได้ภายใน 1 - 4 เดือน',
                                ],
                                nationality: ['thai'],
                                minAge: 20,
                                maxAge: 69,
                                collateralStatus: ['clear'],
                                occupation: 'all',
                                terms: '1 - 4',
                                interestRate: '23.99%',
                                specialProject: undefined,
                            },
                            {
                                code: 'TLSA',
                                name: 'จำนำรถเกษตรเก่า ผ่อนรายฤดูกาล',
                                features: [
                                    'ชำระค่างวดรายฤดูกาล สามารถเลือกความถี่ชำระค่างวดให้สอดคล้องกับช่วงการเก็บเกี่ยวผลิตผล เช่น รายไตรมาส, รายปี',
                                    'ฟรี! ประกันคุ้มครองวงเงินสินเชื่อ (Freebie)',
                                ],
                                nationality: ['thai'],
                                minAge: 20,
                                maxAge: 69,
                                collateralStatus: ['clear'],
                                occupation: 'farmer',
                                terms: '12 - 72',
                                interestRate: '23.99%',
                                specialProject: undefined,
                            },
                            {
                                code: 'REAI',
                                name: 'รีไฟแนนซ์จำนำรถเกษตรเก่า ผ่อนรายเดือน',
                                features: [
                                    'ชำระค่างวดรายเดือน',
                                    'ฟรี! บริการชำระปิดบัญชีไฟแนนซ์เดิม',
                                    'ฟรี! ประกันคุ้มครองวงเงินสินเชื่อ (Freebie)',
                                ],
                                nationality: ['thai'],
                                minAge: 20,
                                maxAge: 69,
                                collateralStatus: ['pledge'],
                                occupation: 'all',
                                terms: '12 - 60',
                                interestRate: '23.99%',
                                specialProject: undefined,
                            },
                            {
                                code: 'REA1',
                                name: 'รีไฟแนนซ์จำนำรถเกษตรเก่า ONE TIME',
                                features: [
                                    'ชำระค่างวดและดอกเบี้ยครั้งเดียว',
                                    'เหมาะสำหรับลูกค้าที่ต้องการใช้เงินฉุกเฉิน แต่คาดว่าจะสามารถชำระคืนได้ภายใน 1 - 4 เดือน',
                                    'ฟรี บริการชำระปิดบัญชีไฟแนนซ์เดิม',
                                ],
                                nationality: ['thai'],
                                minAge: 20,
                                maxAge: 69,
                                collateralStatus: ['pledge'],
                                occupation: 'all',
                                terms: '1 - 4',
                                interestRate: '23.99%',
                                specialProject: undefined,
                            },
                            {
                                code: 'REAS',
                                name: 'รีไฟแนนซ์จำนำรถเกษตรเก่า ผ่อนรายฤดูกาล',
                                features: [
                                    'ชำระค่างวดรายฤดูกาล สามารถเลือกความถี่ชำระค่างวดให้สอดคล้องกับช่วงการเก็บเกี่ยวผลิตผล เช่น รายไตรมาส, รายปี',
                                    'ฟรี! ประกันคุ้มครองวงเงินสินเชื่อ (Freebie)',
                                    'ฟรี! บริการชำระปิดบัญชีไฟแนนซ์เดิม',
                                ],
                                nationality: ['thai'],
                                minAge: 20,
                                maxAge: 69,
                                collateralStatus: ['pledge'],
                                occupation: 'farmer',
                                terms: '12 - 72',
                                interestRate: '23.99%',
                                specialProject: undefined,
                            },
                        ];

                        const LAND_PRODUCTS = [
                            {
                                code: 'TLLD',
                                name: 'ที่ดิน (จำนำ) ผ่อนรายเดือน',
                                features: [
                                    'ชำระค่างวดรายเดือน',
                                    'ไม่ต้องจดจำนองที่ดิน',
                                    'พิเศษ! รับสิทธิ์ซื้อประกันคุ้มครองวงเงินสินเชื่อ (PA Safety Loan)',
                                ],
                                nationality: ['thai'],
                                minAge: 20,
                                maxAge: 69,
                                collateralStatus: ['clear'],
                                deedTypeExclude: ['tra_chong'],
                                maxAmount: 200000,
                                terms: '12 - 60',
                                interestRate: '23.99%',
                                specialProject: undefined,
                            },
                            {
                                code: 'TLP1',
                                name: 'ที่ดิน (จำนำ) ผ่อน ONE TIME',
                                features: [
                                    'ชำระค่างวดและดอกเบี้ยครั้งเดียว',
                                    'เหมาะสำหรับลูกค้าที่ต้องการใช้เงินฉุกเฉิน แต่คาดว่าจะสามารถชำระคืนได้ภายใน 1 - 4 เดือน',
                                    'ไม่ต้องจดจำนองที่ดิน',
                                ],
                                nationality: ['thai'],
                                minAge: 20,
                                maxAge: 69,
                                collateralStatus: ['clear'],
                                deedTypeExclude: ['tra_chong'],
                                maxAmount: 200000,
                                terms: '1 - 4',
                                interestRate: '23.99%',
                                specialProject: undefined,
                            },
                            {
                                code: 'RELD',
                                name: 'รีไฟแนนซ์ที่ดิน (จำนำ) ผ่อนรายเดือน',
                                features: [
                                    'ชำระค่างวดรายเดือน',
                                    'ไม่ต้องจดจำนองที่ดิน',
                                    'ฟรี! บริการชำระปิดบัญชีไฟแนนซ์เดิม',
                                    'พิเศษ! รับสิทธิ์ซื้อประกันคุ้มครองวงเงินสินเชื่อ (PA Safety Loan)',
                                ],
                                nationality: ['thai'],
                                minAge: 20,
                                maxAge: 69,
                                collateralStatus: ['pledge'],
                                deedTypeExclude: ['tra_chong'],
                                maxAmount: 200000,
                                terms: '12 - 60',
                                interestRate: '23.99%',
                                specialProject: undefined,
                            },
                            {
                                code: 'REP1',
                                name: 'รีไฟแนนซ์ที่ดิน (จำนำ) ผ่อน ONE TIME',
                                features: [
                                    'ชำระค่างวดและดอกเบี้ยครั้งเดียว',
                                    'เหมาะสำหรับลูกค้าที่ต้องการใช้เงินฉุกเฉิน แต่คาดว่าจะสามารถชำระคืนได้ภายใน 1 - 4 เดือน',
                                    'ไม่ต้องจดจำนองที่ดิน',
                                    'ฟรี! บริการชำระปิดบัญชีไฟแนนซ์เดิม',
                                ],
                                nationality: ['thai'],
                                minAge: 20,
                                maxAge: 69,
                                collateralStatus: ['pledge'],
                                deedTypeExclude: ['tra_chong'],
                                maxAmount: 200000,
                                terms: '1 - 4',
                                interestRate: '23.99%',
                                specialProject: undefined,
                            },
                            {
                                code: 'TLTD',
                                name: 'จำนองที่ดิน ผ่อนรายเดือน',
                                features: [
                                    'ชำระค่างวดรายเดือน',
                                    'ผ่อนยาวสูงสุด 120 งวด',
                                    'พิเศษ! รับสิทธิ์ซื้อประกันคุ้มครองวงเงินสินเชื่อ (PA Safety Loan)',
                                    'ค่าธรรมเนียมจัดทำนิติกรรมจำนอง 1% ของวงเงินอนุมัติ',
                                ],
                                nationality: ['thai'],
                                minAge: 20,
                                maxAge: 69,
                                collateralStatus: ['clear'],
                                terms: '12 - 120',
                                interestRate: '23.99%',
                                specialProject: undefined,
                            },
                            {
                                code: 'TLTI',
                                name: 'จำนองที่ดิน สัญญารายปี',
                                features: [
                                    'งวดที่ 1 - 11 จ่ายค่างวดน้อยเพียง 15% ของค่างวดรายเดือน แต่งวดที่ 12 จ่ายคืนเงินต้นพร้อมดอกเบี้ยที่เหลือทั้งหมด',
                                    'เหมาะสำหรับลูกค้าที่ต้องการใช้เงินระยะสั้นไม่เกิน 1 ปี',
                                    'พิเศษ! รับสิทธิ์ซื้อประกันคุ้มครองวงเงินสินเชื่อ (PA Safety Loan)',
                                    'ค่าธรรมเนียมจัดทำนิติกรรมจำนอง 1% ของวงเงินอนุมัติ',
                                ],
                                nationality: ['thai'],
                                minAge: 20,
                                maxAge: 69,
                                collateralStatus: ['clear'],
                                terms: '12',
                                interestRate: '23.99%',
                                specialProject: undefined,
                            },
                            {
                                code: 'TLL1',
                                name: 'จำนองที่ดิน ONE TIME',
                                features: [
                                    'ชำระค่างวดและดอกเบี้ยครั้งเดียว',
                                    'เหมาะสำหรับลูกค้าที่ต้องการใช้เงินฉุกเฉิน แต่คาดว่าจะสามารถชำระคืนได้ภายใน 1 - 4 เดือน',
                                    'ค่าธรรมเนียมจัดทำนิติกรรมจำนอง 1% ของวงเงินอนุมัติ',
                                ],
                                nationality: ['thai'],
                                minAge: 20,
                                maxAge: 69,
                                collateralStatus: ['clear'],
                                terms: '1 - 4',
                                interestRate: '23.99%',
                                specialProject: undefined,
                            },
                            {
                                code: 'RETD',
                                name: 'รีไฟแนนซ์จำนองที่ดิน ผ่อนรายเดือน',
                                features: [
                                    'ชำระค่างวดรายเดือน',
                                    'ฟรี! บริการชำระปิดบัญชีไฟแนนซ์เดิม',
                                    'พิเศษ! รับสิทธิ์ซื้อประกันคุ้มครองวงเงินสินเชื่อ (PA Safety Loan)',
                                    'ค่าธรรมเนียมจัดทำนิติกรรมจำนอง 1% ของวงเงินอนุมัติ',
                                ],
                                nationality: ['thai'],
                                minAge: 20,
                                maxAge: 69,
                                collateralStatus: ['pledge'],
                                terms: '12 - 120',
                                interestRate: '23.99%',
                                specialProject: undefined,
                            },
                            {
                                code: 'RETI',
                                name: 'รีไฟแนนซ์จำนองที่ดิน สัญญารายปี',
                                features: [
                                    'งวดที่ 1 - 11 จ่ายค่างวดน้อยเพียง 15% ของค่างวดรายเดือน แต่งวดที่ 12 จ่ายคืนเงินต้นพร้อมดอกเบี้ยที่เหลือทั้งหมด',
                                    'เหมาะสำหรับลูกค้าที่ต้องการใช้เงินระยะสั้นไม่เกิน 1 ปี',
                                    'ฟรี! บริการชำระปิดบัญชีไฟแนนซ์เดิม',
                                    'พิเศษ! รับสิทธิ์ซื้อประกันคุ้มครองวงเงินสินเชื่อ (PA Safety Loan)',
                                    'ค่าธรรมเนียมจัดทำนิติกรรมจำนอง 1% ของวงเงินอนุมัติ',
                                ],
                                nationality: ['thai'],
                                minAge: 20,
                                maxAge: 69,
                                collateralStatus: ['pledge'],
                                terms: '12',
                                interestRate: '23.99%',
                                specialProject: undefined,
                            },
                            {
                                code: 'RED1',
                                name: 'รีไฟแนนซ์จำนองที่ดิน ONE TIME',
                                features: [
                                    'ชำระค่างวดและดอกเบี้ยครั้งเดียว',
                                    'เหมาะสำหรับลูกค้าที่ต้องการใช้เงินฉุกเฉิน แต่คาดว่าจะสามารถชำระคืนได้ภายใน 1 - 4 เดือน',
                                    'ฟรี! บริการชำระปิดบัญชีไฟแนนซ์เดิม',
                                    'ค่าธรรมเนียมจัดทำนิติกรรมจำนอง 1% ของวงเงินอนุมัติ',
                                ],
                                nationality: ['thai'],
                                minAge: 20,
                                maxAge: 69,
                                collateralStatus: ['pledge'],
                                terms: '1 - 4',
                                interestRate: '23.99%',
                                specialProject: undefined,
                            },
                        ];

                        const borrowerAgeNum = Number(formData.borrowerAge) || 0;
                        const currentStatus = formData.collateralStatus || 'clear';
                        const currentNationality = formData.nationality || 'thai';

                        const eligibleMotoProducts = MOTO_PRODUCTS.filter(p => {
                            if (formData.collateralType !== 'moto') return false;
                            if (borrowerAgeNum < p.minAge || borrowerAgeNum > p.maxAge) return false;
                            if (!p.collateralStatus.includes(currentStatus)) return false;

                            if (p.specialProject === 'b2b_payroll') {
                                if (formData.specialProject !== 'b2b_payroll') return false;
                            } else {
                                if (p.nationality && !p.nationality.includes(currentNationality)) return false;
                            }
                            return true;
                        });

                        const eligibleCarProducts = CAR_PRODUCTS.filter(p => {
                            if (formData.collateralType !== 'car') return false;
                            if (borrowerAgeNum < p.minAge || borrowerAgeNum > p.maxAge) return false;
                            if (!p.collateralStatus.includes(currentStatus)) return false;

                            if (p.specialProject === 'b2b_payroll') {
                                if (formData.specialProject !== 'b2b_payroll') return false;
                            } else {
                                if (p.nationality && !p.nationality.includes(currentNationality)) return false;
                            }
                            return true;
                        });

                        const eligibleTruckProducts = TRUCK_PRODUCTS.filter(p => {
                            if (formData.collateralType !== 'truck') return false;
                            if (borrowerAgeNum < p.minAge || borrowerAgeNum > p.maxAge) return false;
                            if (!p.collateralStatus.includes(currentStatus)) return false;

                            if (p.specialProject === 'b2b_payroll') {
                                if (formData.specialProject !== 'b2b_payroll') return false;
                            } else {
                                if (p.nationality && !p.nationality.includes(currentNationality)) return false;
                            }
                            return true;
                        });

                        const eligibleAgriProducts = AGRI_PRODUCTS.filter(p => {
                            if (formData.collateralType !== 'agri') return false;
                            if (borrowerAgeNum < p.minAge || borrowerAgeNum > p.maxAge) return false;
                            if (!p.collateralStatus.includes(currentStatus)) return false;

                            if (p.occupation === 'farmer' && formData.occupationGroup !== 'farmer') return false;

                            if (p.specialProject === 'b2b_payroll') {
                                if (formData.specialProject !== 'b2b_payroll') return false;
                            } else {
                                if (p.nationality && !p.nationality.includes(currentNationality)) return false;
                            }
                            return true;
                        });

                        const eligibleLandProducts = LAND_PRODUCTS.filter(p => {
                            if (formData.collateralType !== 'land') return false;
                            if (borrowerAgeNum < p.minAge || borrowerAgeNum > p.maxAge) return false;
                            if (!p.collateralStatus.includes(currentStatus)) return false;

                            // Deed type filtering
                            if (p.deedTypeExclude && p.deedTypeExclude.includes(formData.landDeedType)) return false;

                            // Requested amount filtering
                            if (p.maxAmount && formData.requestedAmount) {
                                const requested = Number(formData.requestedAmount.replace(/,/g, '')) || 0;
                                if (requested > p.maxAmount) return false;
                            }

                            if (p.specialProject === 'b2b_payroll') {
                                if (formData.specialProject !== 'b2b_payroll') return false;
                            } else {
                                if (p.nationality && !p.nationality.includes(currentNationality)) return false;
                            }
                            return true;
                        });

                        return (
                            <div className="max-w-6xl mx-auto print:hidden space-y-8 animate-in slide-in-from-right-8 duration-300 pb-20">
                                {/* Header */}
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-bold text-gray-800">ผลิตภัณฑ์ที่แนะนำ</h2>
                                    <p className="text-gray-500">เลือกผลิตภัณฑ์ที่เหมาะสมกับลูกค้าเพื่อดูรายการเอกสารที่ต้องใช้</p>
                                </div>

                                {['moto', 'car', 'truck', 'agri', 'land'].includes(formData.collateralType) ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                        {(
                                            formData.collateralType === 'moto' ? eligibleMotoProducts :
                                                formData.collateralType === 'car' ? eligibleCarProducts :
                                                    formData.collateralType === 'truck' ? eligibleTruckProducts :
                                                        formData.collateralType === 'agri' ? eligibleAgriProducts :
                                                            eligibleLandProducts
                                        ).map(product => (
                                            <div key={product.code} className="bg-white rounded-3xl overflow-hidden border border-border-strong relative group w-full flex flex-col hover:shadow-sm transition-shadow">
                                                <div className="p-6 text-white relative overflow-hidden transition-colors bg-chaiyo-blue">
                                                    {(() => {
                                                        const CollateralIcon = PRODUCTS.find(p => p.id === formData.collateralType)?.icon || Sparkles;
                                                        return (
                                                            <>
                                                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                                                                <div className="absolute -top-6 -right-6 opacity-20 pointer-events-none rotate-12">
                                                                    <CollateralIcon className="w-32 h-32" />
                                                                </div>
                                                            </>
                                                        );
                                                    })()}
                                                    <div className="flex flex-col gap-2 relative z-10">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <div className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-sm border border-white/10 tracking-widest">
                                                                {product.code}
                                                            </div>
                                                        </div>
                                                        <h3 className="text-xl font-bold">{product.name}</h3>
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-white/10">
                                                        <div>
                                                            <p className="text-white/70 text-[10px] uppercase tracking-wider mb-1">วงเงินสูงสุด</p>
                                                            <p className="font-bold text-base">{maxLoan.toLocaleString()} <span className="text-[10px] font-normal opacity-75">บาท</span></p>
                                                        </div>
                                                        <div className="border-x border-white/10 px-2 text-center">
                                                            <p className="text-white/70 text-[10px] uppercase tracking-wider mb-1">ดอกเบี้ย</p>
                                                            <div className="flex items-center justify-center gap-1.5 ">
                                                                <p className={cn("font-bold text-base whitespace-nowrap", product.interestRate === '19.00%' ? "text-amber-300" : "text-white")}>
                                                                    {product.interestRate}
                                                                </p>
                                                                {product.interestRate === '19.00%' && (
                                                                    <span className="bg-amber-400 text-amber-900 text-[10px] px-1.5 py-0.5 rounded-full font-bold shadow-sm shrink-0">พิเศษ</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-white/70 text-[10px] uppercase tracking-wider mb-1">จำนวนงวด</p>
                                                            <p className="font-bold text-base">{product.terms} <span className="text-[10px] font-normal opacity-75">เดือน</span></p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="p-6 bg-white flex-1 flex flex-col">
                                                    <h4 className="font-bold text-sm text-gray-800 mb-4 flex items-center gap-2">
                                                        จุดเด่นผลิตภัณฑ์
                                                    </h4>
                                                    <ul className="space-y-1 mb-2 flex-1">
                                                        {[...product.features]
                                                            .sort((a, b) => {
                                                                const isASpecial = a.includes('บัตรเงินไชโย') || a.includes('ประกัน');
                                                                const isBSpecial = b.includes('บัตรเงินไชโย') || b.includes('ประกัน');
                                                                if (isASpecial && !isBSpecial) return 1;
                                                                if (!isASpecial && isBSpecial) return -1;
                                                                return 0;
                                                            })
                                                            .map((feature, i) => {
                                                                const isCard = feature.includes('บัตรเงินไชโย');
                                                                const isInsurance = feature.includes('ประกัน');
                                                                const isSpecial = isCard || isInsurance;

                                                                return (
                                                                    <li key={i} className={cn(
                                                                        "text-sm flex items-start gap-3 p-2 rounded-xl transition-all",
                                                                        isCard ? "bg-amber-50 border border-amber-100 mt-2" :
                                                                            isInsurance ? "bg-blue-50 border border-blue-100 mt-2" :
                                                                                "text-gray-600",
                                                                        isSpecial && i > 0 && "mt-3"
                                                                    )}>
                                                                        <div className={cn(
                                                                            "mt-0.5 rounded-full p-0.5 shrink-0",
                                                                            isCard ? "bg-amber-100" :
                                                                                isInsurance ? "bg-blue-100" :
                                                                                    "bg-emerald-100"
                                                                        )}>
                                                                            {isCard ? (
                                                                                <Gift className="w-3 h-3 text-amber-600" strokeWidth={3} />
                                                                            ) : isInsurance ? (
                                                                                <ShieldCheck className="w-3 h-3 text-blue-600" strokeWidth={3} />
                                                                            ) : (
                                                                                <Check className="w-3 h-3 text-emerald-600" strokeWidth={3} />
                                                                            )}
                                                                        </div>
                                                                        <div className="flex-1">
                                                                            <span className={cn(
                                                                                "leading-snug font-medium",
                                                                                isCard ? "text-amber-900" :
                                                                                    isInsurance ? "text-blue-900" :
                                                                                        "text-gray-700"
                                                                            )}>
                                                                                {feature}
                                                                            </span>

                                                                        </div>
                                                                        {isCard && (
                                                                            <div className="shrink-0 ml-auto">
                                                                                <img
                                                                                    src="/images/chaiyo-card.svg"
                                                                                    alt="Chaiyo Card"
                                                                                    className="w-16 h-auto drop-shadow-sm"
                                                                                />
                                                                            </div>
                                                                        )}
                                                                    </li>
                                                                );
                                                            })}
                                                    </ul>
                                                    <div className="mt-2 grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                                                        <Button size="lg" onClick={handleCreateApplication} className="w-full font-bold bg-chaiyo-blue text-white hover:bg-blue-800">เลือก</Button>
                                                        <Button size="lg" variant="outline" onClick={handlePrint} className="w-full font-bold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2"><Printer className="w-4 h-4" /> พิมพ์</Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {(
                                            formData.collateralType === 'moto' ? eligibleMotoProducts :
                                                formData.collateralType === 'car' ? eligibleCarProducts :
                                                    formData.collateralType === 'truck' ? eligibleTruckProducts :
                                                        formData.collateralType === 'agri' ? eligibleAgriProducts :
                                                            eligibleLandProducts
                                        ).length === 0 && (
                                                <div className="col-span-1 md:col-span-2 text-center py-16 px-4 bg-gray-50 border border-border-strong rounded-3xl flex flex-col items-center justify-center">
                                                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                                                        <FileText className="w-8 h-8 text-gray-400" />
                                                    </div>
                                                    <h3 className="text-lg font-bold text-gray-800 mb-2">ไม่พบผลิตภัณฑ์ที่เหมาะสม</h3>
                                                    <p className="text-gray-500">กรุณาปรับเปลี่ยนเงื่อนไขเช่น อายุ สัญชาติ หรือสถานะหลักประกัน เพื่อดูผลิตภัณฑ์อื่น ๆ</p>
                                                </div>
                                            )}
                                    </div>
                                ) : (
                                    <Tabs
                                        defaultValue="monthly"
                                        value={selectedPlan}
                                        onValueChange={(val) => setSelectedPlan(val as 'monthly' | 'balloon')}
                                        className="w-full"
                                    >
                                        <TabsList className="grid w-full grid-cols-2 mb-8 h-14 bg-gray-100 p-1.5 rounded-2xl">
                                            <TabsTrigger
                                                value="monthly"
                                                className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-chaiyo-blue text-gray-500 font-bold h-full text-base transition-all"
                                            >
                                                ผ่อนชำระรายเดือน
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="balloon"
                                                className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-amber-600 text-gray-500 font-bold h-full text-base transition-all"
                                            >
                                                โปะงวดท้าย (One-Time)
                                            </TabsTrigger>
                                        </TabsList>

                                        <div className="grid grid-cols-1 max-w-lg mx-auto gap-6 items-start">
                                            {/* Column 1: Product Card */}
                                            <div className="w-full">
                                                <TabsContent value="monthly" className="mt-0 animate-in fade-in zoom-in-95 duration-300">
                                                    {/* Option 1: Monthly Installment */}
                                                    <div className="bg-white rounded-3xl overflow-hidden border border-border-strong relative group w-full">
                                                        {/* Header - Product & Key Figures */}
                                                        <div className="p-6 text-white relative overflow-hidden transition-colors bg-gradient-to-r from-chaiyo-blue to-blue-600">
                                                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
                                                                <div>
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <p className="text-white/80 text-xs font-bold uppercase tracking-wider">{loanProduct.tagline}</p>
                                                                        <div className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold backdrop-blur-sm border border-white/10">
                                                                            {selectedProduct?.label}
                                                                        </div>
                                                                    </div>
                                                                    <h3 className="text-2xl font-bold">ผ่อนชำระรายเดือน</h3>
                                                                </div>

                                                            </div>

                                                            {/* Key Stats Bar */}
                                                            <div className="grid grid-cols-2 gap-2 mt-6 pt-4 border-t border-white/10">
                                                                <div>
                                                                    <p className="text-white/70 text-xs">วงเงินสูงสุด</p>
                                                                    <p className="font-bold">{maxLoan.toLocaleString()} <span className="text-[10px] font-normal opacity-75">บาท</span></p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-white/70 text-xs">ดอกเบี้ย</p>
                                                                    <p className="font-bold">23.99% <span className="text-[10px] font-normal opacity-75">ต่อปี</span></p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Payment Method Details */}
                                                        <div className="p-6 bg-white">
                                                            <div className="flex items-center gap-3 mb-4">
                                                                <div className="w-10 h-10 rounded-full flex items-center justify-center transition-colors bg-blue-50">
                                                                    <PiggyBank className="w-5 h-5 text-blue-600" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-bold text-lg text-gray-800">ชำระแบบผ่อนรายเดือน</h4>
                                                                    <p className="text-xs text-gray-500">ผ่อนเท่ากันทุกงวด นานสูงสุด 60 เดือน</p>
                                                                </div>
                                                            </div>

                                                            <div className="rounded-xl p-4 border border-border-strong">
                                                                <p className="text-xs font-medium text-gray-500 mb-3">ตัวอย่างค่างวด (Estimated Installment)</p>
                                                                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                                                    {exampleMonths.map((m) => (
                                                                        <div key={m} className="bg-white p-3 rounded-lg border border-border-strong text-center">
                                                                            <div className="text-xs text-gray-400 mb-1">{m} เดือน</div>
                                                                            <div className="font-bold text-[13px] text-chaiyo-blue">{calcMonthly(maxLoan, m).toLocaleString()}</div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            {/* Bundle Deal Inside Monthly Card */}
                                                            <div className="mt-4 bg-gray-50 border border-border-strong rounded-xl p-4 relative overflow-hidden">

                                                                <div className="flex items-start gap-4 relative z-10">
                                                                    <div className="shrink-0">
                                                                        <img
                                                                            src="/images/chaiyo-card.svg"
                                                                            alt="Chaiyo Card"
                                                                            className="w-28 h-auto rounded-lg"
                                                                        />
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center gap-2 mb-1">
                                                                            <h5 className="font-bold text-gray-800 text-sm">รับฟรี! บัตรเงินไชโย</h5>
                                                                            <span className="bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                                                                <Gift className="w-2.5 h-2.5" /> Bundle
                                                                            </span>
                                                                        </div>
                                                                        <p className="text-xs text-gray-600 leading-relaxed">
                                                                            วงเงินหมุนเวียนพร้อมใช้ จ่ายเงินต้นไปแล้วเท่าไร กดใช้เพิ่มได้เท่านั้น ไม่มีค่าธรรมเนียม
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Bundle Deal: Free Insurance */}
                                                            <div className="mt-3 bg-gray-50 border border-border-strong rounded-xl p-4 relative overflow-hidden">

                                                                <div className="flex items-start gap-4 relative z-10">
                                                                    <div className="shrink-0">
                                                                        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                                                                            <ShieldCheck className="w-7 h-7 text-blue-600" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center gap-2 mb-1">
                                                                            <h5 className="font-bold text-gray-800 text-sm">ฟรี! ประกันวงเงินสินเชื่อ</h5>
                                                                            <span className="bg-blue-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                                                                <Gift className="w-2.5 h-2.5" /> Special
                                                                            </span>
                                                                        </div>
                                                                        <p className="text-xs text-gray-600 leading-relaxed">
                                                                            รับความคุ้มครองทันที คุ้มครองวงเงินสินเชื่อ อุ่นใจตลอดสัญญา ไม่มีค่าใช้จ่ายเพิ่มเติม
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Action Buttons for Monthly Plan */}
                                                            <div className="mt-6 grid grid-cols-2 gap-3">
                                                                <Button
                                                                    size="xl"
                                                                    onClick={handleCreateApplication}
                                                                    className="w-full font-bold"
                                                                >
                                                                    ดำเนินการต่อ
                                                                </Button>
                                                                <Button
                                                                    size="xl"
                                                                    onClick={handlePrint}
                                                                    variant="outline"
                                                                    className="w-full font-bold"
                                                                >
                                                                    <Printer className="w-4 h-4" /> พิมพ์ Salesheets
                                                                </Button>
                                                            </div>
                                                            <div className="mt-4 text-xs text-gray-400 space-y-1 text-center">
                                                                <p>1) กู้เท่าที่จำเป็นและชำระคืนไหว</p>
                                                                <p>2) หากเลือกระยะเวลาในการผ่อนนาน จะทำให้เสียดอกเบี้ยรวมทั้งสัญญาเพิ่มขึ้น</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TabsContent>

                                                <TabsContent value="balloon" className="mt-0 animate-in fade-in zoom-in-95 duration-300">
                                                    {/* Option 2: Balloon Payment */}
                                                    <div className="bg-white rounded-3xl overflow-hidden border border-border-strong relative group w-full">
                                                        {/* Header - Product & Key Figures (Amber Variant) */}
                                                        <div className="p-6 text-gray-900 border-b border-gray-200 relative overflow-hidden transition-colors bg-gray-50">
                                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
                                                                <div>
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <p className="text-white/80 text-xs font-bold uppercase tracking-wider">{loanProduct.tagline}</p>
                                                                        <div className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold backdrop-blur-sm border border-white/10">
                                                                            {selectedProduct?.label}
                                                                        </div>
                                                                    </div>
                                                                    <h3 className="text-2xl font-bold">โปะงวดท้าย (One-Time)</h3>
                                                                </div>

                                                            </div>

                                                            {/* Key Stats Bar */}
                                                            <div className="grid grid-cols-2 gap-2 mt-6 pt-4 border-t border-gray-200">
                                                                <div>
                                                                    <p className="text-gray-500 text-xs">วงเงินสูงสุด</p>
                                                                    <p className="font-bold text-gray-900">{maxLoan.toLocaleString()} <span className="text-[10px] font-normal opacity-75">บาท</span></p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-gray-500 text-xs">ดอกเบี้ย</p>
                                                                    <p className="font-bold text-gray-900">23.99% <span className="text-[10px] font-normal opacity-75">ต่อปี</span></p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Payment Method Details */}
                                                        <div className="p-6 bg-white">
                                                            <div className="flex items-center gap-3 mb-4">
                                                                <div className="w-10 h-10 rounded-full flex items-center justify-center transition-colors bg-amber-50">
                                                                    <Star className="w-5 h-5 text-amber-600" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-bold text-lg text-gray-800">โปะงวดท้าย (One-Time)</h4>
                                                                    <p className="text-xs text-gray-500">ผ่อนสบาย จ่ายเฉพาะดอกเบี้ย แล้วปิดงวดยอดสุดท้าย</p>
                                                                </div>
                                                            </div>

                                                            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 space-y-3">
                                                                <div className="flex justify-between items-center text-sm p-2 bg-white rounded-lg border border-amber-100">
                                                                    <span className="text-gray-600">ผ่อนชำระต่อเดือน (เฉพาะดอกเบี้ย)</span>
                                                                    <span className="font-bold text-amber-700 text-lg">{calcBalloonMonthly(maxLoan).toLocaleString()} บาท</span>
                                                                </div>
                                                                <div className="flex justify-between items-center text-sm px-2">
                                                                    <span className="text-gray-500 text-xs">เงินต้นคงเหลือ (ชำระงวดสุดท้าย)</span>
                                                                    <span className="font-semibold text-gray-700">{maxLoan.toLocaleString()} บาท</span>
                                                                </div>
                                                            </div>

                                                            {/* Action Buttons for Balloon Plan */}
                                                            <div className="mt-6 grid grid-cols-2 gap-3">
                                                                <Button
                                                                    size="xl"
                                                                    onClick={handleCreateApplication}
                                                                    className="w-full bg-amber-500 hover:bg-amber-600 font-bold"
                                                                >
                                                                    ดำเนินการต่อ
                                                                </Button>
                                                                <Button
                                                                    size="xl"
                                                                    onClick={handlePrint}
                                                                    variant="outline"
                                                                    className="w-full font-bold border-amber-500/20 text-amber-600 hover:bg-amber-50 hover:border-amber-500/40"
                                                                >
                                                                    <Printer className="w-4 h-4" /> พิมพ์ Salesheets
                                                                </Button>
                                                            </div>
                                                            <div className="mt-4 text-xs text-gray-400 space-y-1 text-center">
                                                                <p>1) กู้เท่าที่จำเป็นและชำระคืนไหว</p>
                                                                <p>2) หากเลือกระยะเวลาในการผ่อนนาน จะทำให้เสียดอกเบี้ยรวมทั้งสัญญาเพิ่มขึ้น</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TabsContent>
                                            </div>


                                            {/* Column 2: Document Checklist (Hidden for now) */}
                                            {/* <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-sm animate-in fade-in duration-500 h-full"> */}
                                            {/* <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-sm animate-in fade-in duration-500 h-full">
                                    <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                                        <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                                            <FileText className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800">{documentChecklist.label}</h3>
                                            <p className="text-xs text-gray-500">เอกสารที่ต้องใช้สำหรับ: <span className="font-semibold text-chaiyo-blue">{selectedPlan === 'monthly' ? 'แบบผ่อนรายเดือน' : 'แบบโปะงวดท้าย (One-Time)'}</span></p>
                                        </div>
                                    </div>
                                    {typeof documentChecklist.items[0] === 'string' ? (
                                        <div className="grid grid-cols-1 gap-x-6 gap-y-2">
                                            {(documentChecklist.items as string[]).map((item, idx) => (
                                                <div key={idx} className="flex items-start gap-3 py-2 px-3">
                                                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-chaiyo-blue shrink-0" />
                                                    <span className="text-sm text-gray-700 leading-snug whitespace-pre-line">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {(documentChecklist.items as SectionGroup[]).map((section, idx) => (
                                                <div key={idx}>
                                                    <h4 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                                                        <div className="w-1.5 h-4 bg-chaiyo-blue rounded-full"></div>
                                                        {section.title}
                                                    </h4>
                                                    <div className="grid grid-cols-1 gap-x-6 gap-y-2 pl-2">
                                                        {section.items.map((subItem, subIdx) => (
                                                            <div key={subIdx} className="flex items-start gap-2.5 py-1">
                                                                <div className="mt-1.5 w-1 h-1 rounded-full bg-gray-400 shrink-0" />
                                                                <span className="text-sm text-gray-600 leading-snug">{subItem}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="pt-3 border-t border-gray-200 mt-auto">
                                        <p className="text-xs text-gray-400 flex items-center gap-1.5">
                                            <Sparkles className="w-3.5 h-3.5" />
                                            เอกสารที่แนะนำนี้สร้างขึ้นจากข้อมูลที่ได้รับโดยอัตโนมัติ สามารถปรับเปลี่ยนได้ตามเงื่อนไขของสาขา
                                        </p>
                                    </div>
                                </div> */}
                                        </div>
                                    </Tabs>
                                )}

                                {/* Actions Bar */}
                                <div className="bg-white p-4 rounded-xl border border-border-strong flex flex-col md:flex-row justify-between items-center gap-4">
                                    <Button
                                        variant="outline"
                                        size="xl"
                                        onClick={prevStep}
                                        className="w-full md:w-auto px-6 font-bold"
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-2" />
                                        แก้ไขข้อมูล
                                    </Button>
                                </div>
                            </div>
                        );
                    })()
                }

                {/* STEP 4: Salesheet View */}
                {
                    currentStep === 4 && (() => {
                        let pdfPath = "/salesheets/Sale Sheet_รถ บุคคลทั่วไป V8.0 2.pdf";
                        let pdfRotation = 90;
                        if (formData.collateralType === 'land') {
                            pdfPath = "/salesheets/Sales Sheet_ที่ดิน_บุคคลทั่วไปV7_ปกค231.2568.pdf";
                            pdfRotation = 0;
                        }
                        return (
                            <div className="max-w-6xl mx-auto py-8 animate-in slide-in-from-right-8 duration-300">
                                <Card className="border border-border-strong shadow-none rounded-[2rem] bg-white overflow-hidden">
                                    <CardContent className="p-8 space-y-6">
                                        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                                            <div className="w-12 h-12 rounded-xl bg-chaiyo-blue/10 flex items-center justify-center">
                                                <FileText className="w-6 h-6 text-chaiyo-blue" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-900">เอกสารแนะนำผลิตภัณฑ์ (Salesheet)</h2>
                                                <p className="text-gray-500 text-sm">กรุณาอธิบายรายละเอียดให้ลูกค้าทราบและให้ลูกค้าอ่านเอกสารก่อนทำรายการต่อ</p>
                                            </div>
                                        </div>

                                        <div className="bg-gray-800 rounded-xl overflow-hidden border border-border-strong relative flex items-center justify-center w-full" style={{ height: '80vh' }}>
                                            <PdfViewer key={pdfPath} url={pdfPath} rotation={pdfRotation} />
                                        </div>

                                        <div className="flex items-center space-x-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                            <Checkbox
                                                id="salesheet-read"
                                                checked={formData.isSalesheetRead}
                                                onCheckedChange={(checked) => setFormData({ ...formData, isSalesheetRead: checked === true })}
                                                className="w-5 h-5 border-chaiyo-blue data-[state=checked]:bg-chaiyo-blue"
                                            />
                                            <label
                                                htmlFor="salesheet-read"
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-gray-800"
                                            >
                                                ข้าพเจ้าได้อธิบายรายละเอียด Salesheet ให้ลูกค้าทราบ และลูกค้าได้อ่านทำความเข้าใจแล้ว
                                            </label>
                                        </div>

                                        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                                            <Button
                                                variant="outline"
                                                size="xl"
                                                onClick={() => setCurrentStep(3)}
                                                className="px-6 font-bold"
                                            >
                                                <ChevronLeft className="w-4 h-4 mr-2" /> ย้อนกลับ
                                            </Button>
                                            <Button
                                                size="xl"
                                                onClick={handleProceedToApplication}
                                                disabled={!formData.isSalesheetRead}
                                                className="px-8 font-bold"
                                            >
                                                ดำเนินการต่อ <ChevronRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        );
                    })()
                }

                {/* Hidden Print Component */}
                <QuotationPrint
                    data={{
                        collateralType: formData.collateralType,
                        estimatedValue: formData.appraisalPrice,
                        loanAmount: formData.requestedAmount,
                        duration: formData.requestedDuration,
                        monthlyPayment: formData.estimatedMonthlyPayment || 0,
                        interestRate: formData.interestRate || 0.2399,
                        totalInterest: formData.totalInterest || 0,
                        // Vehicle
                        brand: formData.brand,
                        model: formData.model,
                        year: formData.year,
                        // Land
                        landRai: formData.landRai,
                        landNgan: formData.landNgan,
                        landWah: formData.landWah,
                        province: formData.province,
                        // Finance
                        paymentMethod: formData.paymentMethod,
                        income: formData.income,
                        monthlyDebt: formData.monthlyDebt,
                        occupation: formData.occupation
                    }}
                />
                {/* Lightbox / Gallery View */}
                {
                    lightboxIndex !== null && (
                        <div
                            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 md:p-8 animate-in fade-in duration-200"
                            onClick={() => setLightboxIndex(null)}
                        >
                            <button
                                onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
                                className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all"
                            >
                                <X className="w-8 h-8" />
                            </button>

                            {/* Navigation */}
                            {uploadedDocs.length > 1 && (
                                <>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setLightboxIndex(prev => prev !== null ? (prev - 1 + uploadedDocs.length) % uploadedDocs.length : 0);
                                        }}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all"
                                    >
                                        <ChevronLeft className="w-10 h-10" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setLightboxIndex(prev => prev !== null ? (prev + 1) % uploadedDocs.length : 0);
                                        }}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all"
                                    >
                                        <ChevronRight className="w-10 h-10" />
                                    </button>
                                </>
                            )}

                            {/* Main Image */}
                            <img
                                src={uploadedDocs[lightboxIndex]}
                                alt={`Document ${lightboxIndex + 1}`}
                                className="max-h-[80vh] max-w-full object-contain rounded-lg"
                                onClick={(e) => e.stopPropagation()}
                            />

                            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto pb-2" onClick={(e) => e.stopPropagation()}>
                                {uploadedDocs.map((doc, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setLightboxIndex(idx)}
                                        className={cn(
                                            "w-16 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0",
                                            idx === lightboxIndex ? "border-white scale-110 ring-2 ring-white/20" : "border-transparent opacity-50 hover:opacity-100"
                                        )}
                                    >
                                        <img src={doc} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>

                            <div className="absolute top-4 left-4 text-white/80 font-medium bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">
                                {lightboxIndex + 1} / {uploadedDocs.length}
                            </div>
                        </div>
                    )
                }
                {/* Condition Warning Dialog */}
                <AlertDialog open={isConditionDialogOpen} onOpenChange={setIsConditionDialogOpen}>
                    <AlertDialogContent className="max-w-[400px]">
                        <AlertDialogHeader className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-2">
                                <AlertTriangle className="w-10 h-10 text-red-500" />
                            </div>
                            <AlertDialogTitle className="text-xl font-bold text-gray-900 leading-tight">คุณสมบัติไม่เป็นไปตามเงื่อนไข</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-600 mt-2">
                                ข้อมูลของผู้กู้หรือข้อมูลหลักประกัน <span className="font-bold text-red-600">ไม่ตรงตามเงื่อนไขเบื้องต้น</span> ของบริษัทฯ
                                <br /><br />
                                กรุณาตรวจสอบความถูกต้องของข้อมูลอีกครั้ง หรือติดต่อผู้จัดการอาวุโสเพื่อขอคำแนะนำเพิ่มเติม
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="sm:justify-center mt-2">
                            <AlertDialogAction
                                onClick={() => setIsConditionDialogOpen(false)}
                                className="bg-chaiyo-blue hover:bg-blue-800 text-white font-bold px-8 py-2 rounded-xl h-11 min-w-[120px]"
                            >
                                รับทราบ
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div >
    );
}

export default function PreQuestionPage() {
    return (
        <Suspense fallback={<div className="flex justify-center flex-col items-center h-full min-h-[50vh]"><p className="text-gray-500">กำลังโหลด...</p></div>}>
            <PreQuestionPageContent />
        </Suspense>
    );
}
