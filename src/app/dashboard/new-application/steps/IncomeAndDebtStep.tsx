import { useState, useEffect, useRef } from "react";
import { DollarSign, Briefcase, Plus, Trash2, Home, CreditCard, Building, PieChart, TrendingUp, TrendingDown, Pencil, Users, ImagePlus, X, Eye, Link, FileText, UploadCloud, CheckCircle2, Info, HelpCircle, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableFooter,
} from "@/components/ui/Table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/Checkbox";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Combobox } from "@/components/ui/combobox";
import { SpecialIncomeDialog, SpecialIncomeSource } from "./SpecialIncomeDialog";
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
<<<<<<< Updated upstream
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/Dialog";
=======
import { Info, HelpCircle } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
>>>>>>> Stashed changes
import { AddressForm } from "@/components/application/AddressForm";
import { CustomerFormData, IncomeOccupation, SpecialIncome, IncomeItem, EnterpriseIncome, IncomeDocument, PersonalDebt, ChaiyoLoan, SAIncome, ReferencePerson, BankAccount } from "@/types/application";

interface IncomeAndDebtStepProps {
    formData: CustomerFormData;
    setFormData: React.Dispatch<React.SetStateAction<CustomerFormData>>;
    isExistingCustomer?: boolean;
}

export function IncomeAndDebtStep({ formData, setFormData, isExistingCustomer = false }: IncomeAndDebtStepProps) {
    const handleChange = <K extends keyof CustomerFormData>(field: K, value: CustomerFormData[K]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // Helper for specific occupation tab field change
    const handleOccupationChange = (id: string, fieldOrUpdates: string | Partial<IncomeOccupation>, value?: unknown) => {
        setFormData((prev) => {
            const occs = prev.occupations || [{ id: 'main', isMain: true } as IncomeOccupation];
            const updates = typeof fieldOrUpdates === 'string' ? { [fieldOrUpdates]: value } : fieldOrUpdates;
            const updated = occs.map((o) => o.id === id ? { ...o, ...updates } : o);
            return { ...prev, occupations: updated };
        });
    };

    const [activeTab, setActiveTab] = useState("main");
    const idCounterRef = useRef(0);
    const generateId = (prefix: string) => `${prefix}-${++idCounterRef.current}`;
    const occupations = formData.occupations || [{ id: 'main', isMain: true }];

    const [isSpecialIncomeDialogOpen, setIsSpecialIncomeDialogOpen] = useState(false);
    const [editingSpecialIncome, setEditingSpecialIncome] = useState<SpecialIncomeSource | null>(null);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [itemToDelete, setItemToDelete] = useState<{
        id?: string,
        index?: number,
        occId?: string,
        name?: string,
        categoryId?: string,
        type: 'special' | 'reference' | 'photo' | 'bankAccount' | 'incomeDocument' | 'saIncomeRow' | 'seIncomeRow' | 'seCostRow' | 'debtRow' | 'categorizedPhoto'
    } | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [currentDocContext, setCurrentDocContext] = useState<{ occId: string, docType: string, label: string } | null>(null);

    // Debt Row Handlers
    const handleAddDebtRow = () => {
        const debts = formData.personalDebts || [];
        const newDebt: PersonalDebt = {
            id: generateId('debt'),
            type: "",
            description: "",
            amount: 0,
            installment: 0
        };
        handleChange("personalDebts", [...debts, newDebt]);
    };

    const handleUpdateDebtRow = (index: number, field: string, value: string) => {
        const debts = [...(formData.personalDebts || [])];
        let finalValue = value;
        if (field === 'amount') {
            const clean = value.replace(/[^0-9.]/g, '');
            const parts = clean.split('.');
            if (parts.length > 2) {
                finalValue = parts[0] + '.' + parts.slice(1).join('');
            } else if (parts.length === 2 && parts[1].length > 2) {
                finalValue = parts[0] + '.' + parts[1].slice(0, 2);
            } else {
                finalValue = clean;
            }
        }
        debts[index] = { ...debts[index], [field]: finalValue };
        handleChange("personalDebts", debts);
    };

    const handleRemoveDebtRow = (index: number) => {
        const debts = [...(formData.personalDebts || [])];
        debts.splice(index, 1);
        handleChange("personalDebts", debts);
        setItemToDelete(null);
    };

    const handleSaveSpecialIncome = (source: SpecialIncomeSource | SpecialIncome) => {
        const currentIncomes = formData.specialIncomes || [];
        if ('amount' in source) {
            handleChange("specialIncomes", currentIncomes.map((item) => (item.id === source.id ? source : item)));
        } else {
            const newIncome: SpecialIncome = {
                ...source,
                frequency: 'monthly',
                amount: 0,
                netIncome: 0,
                id: generateId('special'),
            };
            handleChange("specialIncomes", [...currentIncomes, newIncome]);
        }
        setEditingSpecialIncome(null);
    };

    const handleRemoveSpecialIncome = (id: string) => {
        const currentIncomes = formData.specialIncomes || [];
        handleChange("specialIncomes", currentIncomes.filter((item: SpecialIncome) => item.id !== id));
        setItemToDelete(null);
    };

    const confirmDelete = () => {
        if (!itemToDelete) return;

        if (itemToDelete.type === 'special' && itemToDelete.id) {
            handleRemoveSpecialIncome(itemToDelete.id);
        } else if (itemToDelete.type === 'reference' && itemToDelete.index !== undefined) {
            handleRemoveReference(itemToDelete.index);
        } else if (itemToDelete.type === 'photo' && itemToDelete.index !== undefined) {
            handleRemovePhoto(itemToDelete.index);
        } else if (itemToDelete.type === 'bankAccount' && itemToDelete.occId && itemToDelete.index !== undefined) {
            handleRemoveBankAccount(itemToDelete.occId, itemToDelete.index);
        } else if (itemToDelete.type === 'incomeDocument' && itemToDelete.occId && itemToDelete.id) {
            handleRemoveIncomeDocument(itemToDelete.occId, itemToDelete.id);
        } else if (itemToDelete.type === 'saIncomeRow' && itemToDelete.occId && itemToDelete.index !== undefined) {
            handleRemoveSAIncomeRow(itemToDelete.occId, itemToDelete.index);
        } else if (itemToDelete.type === 'seIncomeRow' && itemToDelete.occId && itemToDelete.index !== undefined) {
            handleRemoveSEIncomeRow(itemToDelete.occId, itemToDelete.index);
        } else if (itemToDelete.type === 'seCostRow' && itemToDelete.occId && itemToDelete.index !== undefined) {
            handleRemoveSECostRow(itemToDelete.occId, itemToDelete.index);
        } else if (itemToDelete.type === 'debtRow' && itemToDelete.index !== undefined) {
            handleRemoveDebtRow(itemToDelete.index);
        }
    };

    const handleNumberChange = (field: string, value: string) => {
        const cleanValue = value.replace(/,/g, '');
        if (/^\d*\.?\d*$/.test(cleanValue)) {
            const num = cleanValue === "" ? 0 : Number(cleanValue);
            handleChange(field as keyof CustomerFormData, num);
        }
    };

    const formatNumberWithCommas = (val: string | number) => {
        if (val === null || val === undefined || String(val) === "") return "";
        const parts = val.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    };

    // Helper to round down to 2 decimal places
    const roundDown2 = (num: number) => {
        return Math.floor(num * 100) / 100;
    };

    // Calculate Totals automatically
    useEffect(() => {
        // Special Income Calc
        const specialIncomesList = formData.specialIncomes || [];
        const specialIncomeSum = specialIncomesList.reduce((sum: number, item: SpecialIncome) => sum + (item.netIncome || 0), 0);

        if (formData.specialIncome !== specialIncomeSum) {
            handleChange("specialIncome", specialIncomeSum);
        }

        // Get Occupation Sums
        const mainOccSum = occupations.filter((o: IncomeOccupation) => o.isMain).reduce((acc: number, o: IncomeOccupation) => {
            if (o.employmentType === 'SA') {
                const saSum = (o.saIncomes || []).reduce((sumAcc: number, item: SAIncome) => sumAcc + (Number(item.amount) || 0), 0);
                return acc + roundDown2(saSum);
            }
            if (o.employmentType === 'SE') {
                if (o.occupationCode === 'FARMER') {
                    const std = FARM_STANDARD_PRICES[o.produceType || "others"] || { sales: 0, cost: 0 };
                    const totalAreaRai = Number(o.cultivationAreaRai || 0) + (Number(o.cultivationAreaNgan || 0) / 4) + (Number(o.cultivationAreaSqWa || 0) / 400);
                    const cycles = Number(o.cyclesPerYear || 1);
                    const laborers = Number(o.laborCount || 1) || 1;
                    const salesValue = o.customerSalesPerRai ? Number(o.customerSalesPerRai) : std.sales;
                    const costValue = o.customerCostPerRai ? Number(o.customerCostPerRai) : std.cost;
                    const farmerIncome = (((salesValue - costValue) * totalAreaRai * cycles) / 12) / laborers;
                    return acc + roundDown2(Math.max(0, farmerIncome));
                }
                const sales = (o.seIncomes || []).reduce((sumAcc: number, item: SAIncome) => sumAcc + (Number(item.calculatedMonthly) || 0), 0);
                const costs = (o.seCosts || []).reduce((sumAcc: number, item: SAIncome) => sumAcc + (Number(item.calculatedMonthly) || 0), 0);
                return acc + roundDown2(sales - costs);
            }
            return acc;
        }, 0);

        const secondaryOccSum = occupations.filter((o: IncomeOccupation) => !o.isMain).reduce((acc: number, o: IncomeOccupation) => {
            if (o.employmentType === 'SA') {
                const saSum = (o.saIncomes || []).reduce((sumAcc: number, item: SAIncome) => sumAcc + (Number(item.amount) || 0), 0);
                return acc + roundDown2(saSum);
            }
            if (o.employmentType === 'SE') {
                if (o.occupationCode === 'FARMER') {
                    const std = FARM_STANDARD_PRICES[o.produceType || "others"] || { sales: 0, cost: 0 };
                    const totalAreaRai = Number(o.cultivationAreaRai || 0) + (Number(o.cultivationAreaNgan || 0) / 4) + (Number(o.cultivationAreaSqWa || 0) / 400);
                    const cycles = Number(o.cyclesPerYear || 1);
                    const laborers = Number(o.laborCount || 1) || 1;
                    const salesValue = o.customerSalesPerRai ? Number(o.customerSalesPerRai) : std.sales;
                    const costValue = o.customerCostPerRai ? Number(o.customerCostPerRai) : std.cost;
                    const farmerIncome = (((salesValue - costValue) * totalAreaRai * cycles) / 12) / laborers;
                    return acc + roundDown2(Math.max(0, farmerIncome));
                }
                const sales = (o.seIncomes || []).reduce((sumAcc: number, item: SAIncome) => sumAcc + (Number(item.calculatedMonthly) || 0), 0);
                const costs = (o.seCosts || []).reduce((sumAcc: number, item: SAIncome) => sumAcc + (Number(item.calculatedMonthly) || 0), 0);
                return acc + roundDown2(sales - costs);
            }
            return acc;
        }, 0);

        // Income Summery
        const special = specialIncomeSum;
        const other = Number(formData.otherIncome) || 0;
        const totalIncome = mainOccSum + secondaryOccSum + special + other;

        // Keep mainIncome and secondaryIncome properties in sync for data model consistency
        if (formData.mainOccupationIncome !== mainOccSum) {
            handleChange("mainOccupationIncome", mainOccSum);
        }
        if (formData.secondaryOccupationIncome !== secondaryOccSum) {
            handleChange("secondaryOccupationIncome", secondaryOccSum);
        }

        if (formData.totalIncome !== totalIncome) {
            handleChange("totalIncome", totalIncome);
        }

        // Debt - Personal
        const debtsList = formData.personalDebts || [];
        const personalDebtSum = debtsList.reduce((sum: number, item: SAIncome) => sum + (Number(item.amount) || 0), 0);
        const totalPersonalDebt = roundDown2(personalDebtSum);

        if (formData.totalPersonalDebt !== totalPersonalDebt) {
            handleChange("totalPersonalDebt", totalPersonalDebt);
        }

        // Debt - Chaiyo
        const chaiyoList = formData.chaiyoLoans || [];
        const chaiyoLoansSum = chaiyoList.reduce((sum: number, item: SAIncome) => sum + (Number(item.amount) || 0), 0);
        // Add legacy field if exists for fallback
        const legacyChaiyo = Number(formData.chaiyoLoanInstallment) || 0;
        const chaiyoIns = Number(formData.chaiyoInsuranceInstallment) || 0;
        const totalChaiyoDebt = chaiyoLoansSum + legacyChaiyo + chaiyoIns;

        if (formData.totalChaiyoDebt !== totalChaiyoDebt) {
            handleChange("totalChaiyoDebt", totalChaiyoDebt);
        }

        // Total Debt
        const totalDebt = totalPersonalDebt + totalChaiyoDebt;
        if (formData.totalDebt !== totalDebt) {
            handleChange("totalDebt", totalDebt);
        }
    }, [
        occupations, formData.specialIncome, formData.otherIncome,
        formData.personalDebts,
        formData.chaiyoLoans, formData.chaiyoLoanInstallment, formData.chaiyoInsuranceInstallment
    ]);

    // Reference Persons
    const handleAddReference = () => {
        const refs = formData.referencePersons || [];
        setFormData((prev: CustomerFormData) => ({
            ...prev,
            referencePersons: [...refs, { name: "", phone: "", relationship: "", customRelationship: "" }]
        }));
    };

    const handleUpdateReference = (index: number, field: string, value: string) => {
        const refs = [...(formData.referencePersons || [])];
        refs[index] = { ...refs[index], [field]: value };
        handleChange("referencePersons", refs);
    };

    const handleRemoveReference = (index: number) => {
        const refs = [...(formData.referencePersons || [])];
        refs.splice(index, 1);
        handleChange("referencePersons", refs);
        setItemToDelete(null);
    };

    // Occupations Management

    const handleAddSecondaryOccupation = () => {
        const secondaryCount = occupations.filter((o: IncomeOccupation) => !o.isMain).length;
        if (secondaryCount >= 10) return;

        const newId = generateId('sec');
        handleChange("occupations", [
            ...occupations,
            { id: newId, isMain: false }
        ]);
        setActiveTab(newId);
    };

    const handleRemoveOccupation = (id: string) => {
        const newOccupations = occupations.filter((o: IncomeOccupation) => o.id !== id);
        handleChange("occupations", newOccupations);
        if (activeTab === id) {
            setActiveTab("main");
        }
    };

    // Photo Upload
    const handleAddPhoto = () => {
        const photos = formData.incomePhotos || [];
        const mockUrl = `https://placehold.co/400x300/e2e8f0/475569?text=${encodeURIComponent('รูปประกอบ')}+${photos.length + 1}`;
        handleChange("incomePhotos", [...photos, mockUrl]);
    };

    const handleRemovePhoto = (index: number) => {
        const photos = [...(formData.incomePhotos || [])];
        photos.splice(index, 1);
        handleChange("incomePhotos", photos);
        setItemToDelete(null);
    };

    // Income Channels Handlers
    const toggleIncomeChannel = (occId: string, channel: string) => {
        const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
        if (!occ) return;
        const current = occ.incomeChannels || [];
        const updated = current.includes(channel)
            ? current.filter((c: string) => c !== channel)
            : [...current, channel];
        handleOccupationChange(occId, 'incomeChannels', updated);
    };

    const handleAddBankAccount = (occId: string) => {
        const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
        if (!occ) return;
        const currentAccounts = occ.bankAccounts || [];
        handleOccupationChange(occId, 'bankAccounts', [...currentAccounts, { bankName: '', accountNo: '' }]);
    };

    const handleUpdateBankAccount = (occId: string, index: number, field: string, value: string) => {
        const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
        if (!occ) return;
        const currentAccounts = [...(occ.bankAccounts || [])];

        // Apply mask if it's the account number field
        let finalValue = value;
        if (field === 'accountNo') {
            const numbers = value.replace(/\D/g, '').slice(0, 10);
            if (numbers.length > 0) {
                finalValue = numbers.slice(0, 3);
                if (numbers.length > 3) {
                    finalValue += "-" + numbers.slice(3, 4);
                    if (numbers.length > 4) {
                        finalValue += "-" + numbers.slice(4, 9);
                        if (numbers.length > 9) {
                            finalValue += "-" + numbers.slice(9, 10);
                        }
                    }
                }
            }
        }

        currentAccounts[index] = { ...currentAccounts[index], [field]: finalValue };
        handleOccupationChange(occId, 'bankAccounts', currentAccounts);
    };

    const handleRemoveBankAccount = (occId: string, index: number) => {
        const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
        if (!occ) return;
        const currentAccounts = [...(occ.bankAccounts || [])];
        currentAccounts.splice(index, 1);
        handleOccupationChange(occId, 'bankAccounts', currentAccounts);
        setItemToDelete(null);
    };

    // SA Income Handlers
    const handleAddSAIncomeRow = (occId: string) => {
        const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
        if (!occ) return;
        const currentIncomes = occ.saIncomes || [];
        handleOccupationChange(occId, 'saIncomes', [...currentIncomes, { type: '', detail: '', amount: '' }]);
    };

    const handleUpdateSAIncomeRow = (occId: string, index: number, field: string, value: string) => {
        const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
        if (!occ) return;
        const currentIncomes = [...(occ.saIncomes || [])];

        let finalValue = value;
        if (field === 'amount') {
            // Numbers only, handle decimals and round down to 2 places
            const clean = value.replace(/[^0-9.]/g, '');
            const parts = clean.split('.');
            if (parts.length > 2) {
                finalValue = parts[0] + '.' + parts.slice(1).join('');
            } else if (parts.length === 2 && parts[1].length > 2) {
                finalValue = parts[0] + '.' + parts[1].slice(0, 2);
            } else {
                finalValue = clean;
            }
        }

        currentIncomes[index] = { ...currentIncomes[index], [field]: finalValue };

        // Calculate total income for this occupation
        const total = currentIncomes.reduce((acc: number, curr: SAIncome) => acc + (Number(curr.amount) || 0), 0);

        handleOccupationChange(occId, {
            saIncomes: currentIncomes,
            totalIncome: total
        });
    };

    const handleRemoveSAIncomeRow = (occId: string, index: number) => {
        const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
        if (!occ) return;
        const currentIncomes = [...(occ.saIncomes || [])];
        currentIncomes.splice(index, 1);

        // Calculate total
        const total = currentIncomes.reduce((acc: number, curr: SAIncome) => acc + (Number(curr.amount) || 0), 0);

        handleOccupationChange(occId, {
            saIncomes: currentIncomes,
            totalIncome: total
        });
        setItemToDelete(null);
    };

    const DEBT_TYPES = [
        { value: "commercial", label: "สินเชื่อเพื่อการพาณิชย์" },
        { value: "od", label: "สินเชื่อวงเงินเบิกเกินบัญชี" },
        { value: "personal", label: "สินเชื่อบุคคล" },
        { value: "housing", label: "สินเชื่อที่อยู่อาศัย" },
        { value: "leasing", label: "สินเชื่อให้เช่าแบบลิซซิ่งรถยนต์" },
        { value: "hire_purchase", label: "สินเชื่อเช่าซื้อที่อื่น" },
        { value: "agriculture", label: "สินเชื่อเพื่อการเกษตร" },
        { value: "cooperative", label: "เงินกู้สหกรณ์" },
        { value: "other", label: "ภาระหนี้อื่นๆ" },
    ];

    const SA_INCOME_TYPES = [
        { label: "เงินเดือน", value: "salary" },
        { label: "รายได้ประจำ", value: "fixed_income" },
        { label: "รายได้อื่นๆ", value: "other_income" },
        { label: "โบนัส", value: "bonus" },
    ];

    const REFERENCE_RELATIONSHIPS = [
        { value: "kamnan", label: "กำนัน" },
        { value: "phuyaiban", label: "ผู้ใหญ่บ้าน" },
        { value: "neighbor", label: "เพื่อนบ้าน" },
        { value: "community_leader", label: "ผู้นำชุมชน" },
        { value: "obt_official", label: "เจ้าหน้าที่ อบต" },
        { value: "obh_official", label: "เจ้าหน้าที่ อบจ" },
        { value: "employer", label: "นายจ้าง" },
        { value: "customer", label: "ลูกค้าในร้าน" },
        { value: "nearby_shop", label: "ร้านค้าข้างเคียง" },
        { value: "other", label: "อื่นๆ โปรดระบุ" },
    ];

    const PHOTO_GUIDES = [
        {
            id: 'landmarks',
            title: 'รูปสถานที่/จุดสังเกตุหลัก',
            description: 'รูปสถานที่, รูปป้าย ที่เป็นจุดสังเกตุหลัก รอบกิจการผู้กู้ (ที่คนในพื้นที่รู้จัก) เช่น ป้ายซอย, ตึกอาคาร, วัด, ตลาด',
            required: true,
            icon: Building,
            demoUrl: '/images/guidelines/landmarks_demo.png'
        },
        {
            id: 'business_wide',
            title: 'รูปมุมกว้างที่ตั้งกิจการ',
            description: 'รูปมุมกว้าง เห็นที่ตั้งของกิจการ, เห็นป้ายหน้าร้าน (เห็นเบอร์โทรกิจการ) และ เห็นบริเวณข้างเคียง',
            required: true,
            icon: ImagePlus,
            demoUrl: '/images/guidelines/business_wide_demo.png'
        },
        {
            id: 'equipment',
            title: 'รูปวัสดุ/อุปกรณ์กิจการ',
            description: 'รูปวัสดุ และอุปกรณ์ที่ใช้ในการดำเนินกิจการ (อุปกรณ์ หรือเครื่องมือ ทำมาหากิน)',
            required: true,
            icon: Briefcase,
            demoUrl: '/images/guidelines/equipment_demo.png'
        },
        {
            id: 'applicant_working',
            title: 'รูปผู้กู้ขณะทำงาน',
            description: 'รูปผู้กู้ ขณะประกอบกิจการ',
            required: true,
            icon: Users,
            demoUrl: '/images/guidelines/applicant_working_demo.png'
        },
        {
            id: 'address_sign',
            title: 'รูปเลขที่ตั้งกิจการ',
            description: 'รูปเลขที่ตั้งกิจการ (ระบุเลขที่บ้าน หรือเลขที่ตั้งกิจการ)',
            required: false,
            icon: Home,
            demoUrl: '/images/guidelines/address_sign_demo.png'
        },
        {
            id: 'qr_code',
            title: 'รูป QR Code รับเงิน',
            description: 'รูป QR Code สำหรับรับเงินของกิจการ',
            required: false,
            icon: CreditCard,
            demoUrl: '/images/guidelines/qr_code_demo.png'
        }
    ];

    // SE Income Handlers
    const calculateSEMonthlyIncome = (item: EnterpriseIncome) => {
        const amount = Number(item.salesAmount) || 0;
        if (!item.frequency) return 0;
        let result = 0;
        if (item.frequency === 'daily') {
            const days = Number(item.daysPerMonth) || 0;
            result = amount * days;
        } else if (item.frequency === 'weekly') {
            const weeks = Number(item.weeksPerMonth) || 0;
            result = amount * weeks;
        } else if (item.frequency === 'monthly') {
            result = amount;
        } else if (item.frequency === 'quarterly') {
            result = amount / 3;
        } else if (item.frequency === 'yearly') {
            result = amount / 12;
        }
        return roundDown2(result);
    };

    const handleAddSEIncomeRow = (occId: string) => {
        const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
        if (!occ) return;
        const currentIncomes = occ.seIncomes || [];
        handleOccupationChange(occId, 'seIncomes', [...currentIncomes, {
            frequency: '',
            daysPerMonth: '',
            weeksPerMonth: '',
            operatingHours: [],
            salesAmount: '',
            calculatedMonthly: '0'
        }]);
    };

    const handleUpdateSEIncomeRow = (occId: string, index: number, updates: Record<string, unknown>) => {
        const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
        if (!occ) return;
        const currentIncomes = [...(occ.seIncomes || [])];

        const currentRow: EnterpriseIncome = { ...currentIncomes[index] };

        for (const [field, value] of Object.entries(updates)) {
            let finalValue = value;
            if (field === 'salesAmount' || field === 'daysPerMonth' || field === 'weeksPerMonth') {
                const clean = String(value).replace(/[^0-9.]/g, '');
                if (field === 'salesAmount') {
                    const parts = clean.split('.');
                    if (parts.length > 2) {
                        finalValue = parts[0] + '.' + parts.slice(1).join('');
                    } else if (parts.length === 2 && parts[1].length > 2) {
                        finalValue = parts[0] + '.' + parts[1].slice(0, 2);
                    } else {
                        finalValue = clean;
                    }
                } else {
                    finalValue = clean; // Whole numbers for days/weeks
                }
            }
            currentRow[field] = finalValue;
        }

        // Update calculated monthly for this row specifically
        currentRow.calculatedMonthly = calculateSEMonthlyIncome(currentRow);
        currentIncomes[index] = currentRow;

        // Calculate total income for this occupation
        const total = currentIncomes.reduce((acc: number, curr: EnterpriseIncome) => acc + (Number(curr.calculatedMonthly) || 0), 0);

        handleOccupationChange(occId, {
            seIncomes: currentIncomes,
            totalIncome: total
        });
    };

    const handleRemoveSEIncomeRow = (occId: string, index: number) => {
        const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
        if (!occ) return;
        const currentIncomes = [...(occ.seIncomes || [])];
        currentIncomes.splice(index, 1);

        // Calculate total
        const total = currentIncomes.reduce((acc: number, curr: EnterpriseIncome) => acc + (Number(curr.calculatedMonthly) || 0), 0);

        handleOccupationChange(occId, {
            seIncomes: currentIncomes,
            totalIncome: total
        });
        setItemToDelete(null);
    };

    const SE_INCOME_FREQUENCIES = [
        { label: "รายวัน", value: "daily" },
        { label: "รายสัปดาห์", value: "weekly" },
        { label: "รายเดือน", value: "monthly" },
        { label: "รายไตรมาส", value: "quarterly" },
        { label: "รายปี", value: "yearly" },
    ];

    const SE_OPERATING_HOURS = [
        { label: "เช้า", value: "morning" },
        { label: "กลางวัน", value: "afternoon" },
        { label: "เย็น", value: "evening" },
        { label: "กลางคืน", value: "night" },
    ];

    const FARM_STAGES = [
        "เตรียมดินก่อนเพาะปลุก",
        "เพาะปลูก",
        "ระยะโต",
        "เก็บเกี่ยวผลผลิต"
    ];

    const THAI_MONTHS_SHORT = [
        "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
        "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
    ];

    const FARMER_PRODUCE_LIST = [
        { label: "ข้าวนาปี", value: "ข้าวนาปี" },
        { label: "ข้าวนาปรัง", value: "ข้าวนาปรัง" },
        { label: "ข้าวโพด", value: "ข้าวโพด" },
        { label: "อ้อย", value: "อ้อย" },
        { label: "มันสำปะหลัง", value: "มันสำปะหลัง" },
        { label: "ยางพารา", value: "ยางพารา" },
        { label: "ปาร์มน้ำมัน", value: "ปาร์มน้ำมัน" },
        { label: "อื่นๆ", value: "others" },
    ];

    const LAND_OWNERSHIP_TYPES = [
        { label: "เช่า", value: "rent" },
        { label: "ตนเอง", value: "own" },
        { label: "ครอบครัว", value: "family" },
    ];

    const YEAR_OPTIONS = Array.from({ length: 21 }, (_, i) => ({ label: `${i} ปี`, value: String(i) }));
    const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({ label: `${i} เดือน`, value: String(i) }));

    const currentYearBE = new Date().getFullYear() + 543;
    const FARM_YEARS = Array.from({ length: 11 }, (_, i) => {
        const year = currentYearBE - 5 + i;
        return { label: `พ.ศ. ${year}`, value: String(year) };
    });
    const FARM_MONTHS = [
        { label: "มกราคม", value: "1" },
        { label: "กุมภาพันธ์", value: "2" },
        { label: "มีนาคม", value: "3" },
        { label: "เมษายน", value: "4" },
        { label: "พฤษภาคม", value: "5" },
        { label: "มิถุนายน", value: "6" },
        { label: "กรกฎาคม", value: "7" },
        { label: "สิงหาคม", value: "8" },
        { label: "กันยายน", value: "9" },
        { label: "ตุลาคม", value: "10" },
        { label: "พฤศจิกายน", value: "11" },
        { label: "ธันวาคม", value: "12" },
    ];

    const FARM_STANDARD_PRICES: Record<string, { sales: number, cost: number }> = {
        "ข้าวนาปี": { sales: 8000, cost: 4500 },
        "ข้าวนาปรัง": { sales: 9500, cost: 5500 },
        "ข้าวโพด": { sales: 7500, cost: 4000 },
        "อ้อย": { sales: 13000, cost: 7000 },
        "มันสำปะหลัง": { sales: 11000, cost: 5000 },
        "ยางพารา": { sales: 16000, cost: 8000 },
        "ปาร์มน้ำมัน": { sales: 15000, cost: 7500 },
        "others": { sales: 0, cost: 0 }
    };

    const LIVESTOCK_TYPES = [
        { label: "หมู", value: "pig" },
        { label: "ไก่", value: "chicken" },
        { label: "วัว", value: "cow" },
        { label: "เป็ด", value: "duck" },
        { label: "ปลา", value: "fish" },
        { label: "อื่นๆ", value: "others" },
    ];

    const LIVESTOCK_UNITS = [
        { label: "ตัว", value: "unit" },
        { label: "กิโลกรัม", value: "kg" },
        { label: "ฟาร์ม", value: "farm" },
    ];

    // SE Cost Handlers
    const calculateSEMonthlyCost = (item: EnterpriseIncome) => {
        const amount = Number(item.costAmount) || 0;
        if (!item.frequency) return 0;
        let result = 0;
        if (item.frequency === 'daily') {
            const days = Number(item.daysPerMonth) || 0;
            result = amount * days;
        } else if (item.frequency === 'weekly') {
            const weeks = Number(item.weeksPerMonth) || 0;
            result = amount * weeks;
        } else if (item.frequency === 'monthly') {
            result = amount;
        } else if (item.frequency === 'quarterly') {
            result = amount / 3;
        } else if (item.frequency === 'yearly') {
            result = amount / 12;
        }
        return roundDown2(result);
    };

    const handleAddSECostRow = (occId: string) => {
        const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
        if (!occ) return;
        const currentCosts = occ.seCosts || [];
        handleOccupationChange(occId, 'seCosts', [...currentCosts, {
            type: '',
            customType: '',
            frequency: '',
            daysPerMonth: '',
            weeksPerMonth: '',
            costAmount: '',
            calculatedMonthly: '0'
        }]);
    };

    const handleUpdateSECostRow = (occId: string, index: number, updates: Record<string, unknown>) => {
        const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
        if (!occ) return;
        const currentCosts = [...(occ.seCosts || [])];

        const currentRow: EnterpriseIncome = { ...currentCosts[index] };

        for (const [field, value] of Object.entries(updates)) {
            let finalValue = value;
            if (field === 'costAmount' || field === 'daysPerMonth' || field === 'weeksPerMonth') {
                const clean = String(value).replace(/[^0-9.]/g, '');
                if (field === 'costAmount') {
                    const parts = clean.split('.');
                    if (parts.length > 2) {
                        finalValue = parts[0] + '.' + parts.slice(1).join('');
                    } else if (parts.length === 2 && parts[1].length > 2) {
                        finalValue = parts[0] + '.' + parts[1].slice(0, 2);
                    } else {
                        finalValue = clean;
                    }
                } else {
                    finalValue = clean; // Whole numbers for days/weeks
                }
            }
            currentRow[field] = finalValue;
        }

        // Update calculated monthly for this row specifically
        currentRow.calculatedMonthly = calculateSEMonthlyCost(currentRow);
        currentCosts[index] = currentRow;

        handleOccupationChange(occId, 'seCosts', currentCosts);
    };

    const handleRemoveSECostRow = (occId: string, index: number) => {
        const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
        if (!occ) return;
        const currentCosts = [...(occ.seCosts || [])];
        currentCosts.splice(index, 1);

        handleOccupationChange(occId, 'seCosts', currentCosts);
        setItemToDelete(null);
    };

    const SE_COST_TYPES = [
        { label: "ค่าวัตถุดิบ", value: "material" },
        { label: "ค่าเช่า", value: "rent" },
        { label: "ค่าจ้าง", value: "wage" },
        { label: "ค่าใช้จ่ายอื่นๆ", value: "other" },
        { label: "ระบุเพิ่ม", value: "custom" },
    ];

    const SE_COST_FREQUENCIES = [
        { label: "รายวัน", value: "daily" },
        { label: "รายสัปดาห์", value: "weekly" },
        { label: "รายเดือน", value: "monthly" },
        { label: "รายไตรมาส", value: "quarterly" },
        { label: "รายปี", value: "yearly" },
    ];

    const handleAddIncomeDocument = (occId: string, docType: string, label: string) => {
        setCurrentDocContext({ occId, docType, label });
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !currentDocContext) return;

        const { occId, docType } = currentDocContext;
        const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
        if (!occ) return;

        // Create new document
        const newDoc: IncomeDocument = {
            id: generateId('doc'),
            type: docType,
            name: file.name,
            url: URL.createObjectURL(file), // used for preview
            status: 'success',
            uploadedAt: new Date().toISOString()
        };

        // Enforce only 1 file: remove list, use new doc for this type
        const currentDocs = (occ.incomeDocuments || []).filter((doc: IncomeDocument) => doc.type !== docType);
        handleOccupationChange(occId, 'incomeDocuments', [...currentDocs, newDoc]);

        // Reset
        if (fileInputRef.current) fileInputRef.current.value = '';
        setCurrentDocContext(null);
    };

    const handleRemoveIncomeDocument = (occId: string, docId: string) => {
        const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
        if (!occ) return;
        const currentDocs = (occ.incomeDocuments || []).filter((d: IncomeDocument) => d.id !== docId);
        handleOccupationChange(occId, 'incomeDocuments', currentDocs);
        setItemToDelete(null);
    };

    const THAI_BANKS = [
        { label: "ธนาคารกสิกรไทย", value: "KBANK", logo: "/bank-logo/Type=KBank.svg" },
        { label: "ธนาคารไทยพาณิชย์", value: "SCB", logo: "/bank-logo/Type=SCB.svg" },
        { label: "ธนาคารกรุงเทพ", value: "BBL", logo: "/bank-logo/Type=BBL.svg" },
        { label: "ธนาคารกรุงศรีอยุธยา", value: "BAY", logo: "/bank-logo/Type=Bank of Ayudhya (Krungsri).svg" },
        { label: "ธนาคารกรุงไทย", value: "KTB", logo: "/bank-logo/Type=Krungthai Bank.svg" },
        { label: "ธนาคารทหารไทยธนชาต", value: "ttb", logo: "/bank-logo/Type=TTB.svg" },
        { label: "ธนาคารออมสิน", value: "GSB", logo: "/bank-logo/Type=GSB.svg" },
    ];

    const INCOME_DOC_TYPES = [
        { id: 'payslip', label: 'สลิปเงินเดือน (Payslip)' },
        { id: 'statement', label: 'รายการเดินบัญชี (Statement)' },
        { id: 'tavi50', label: 'ทวิ 50' },
        { id: 'salary_cert', label: 'หนังสือรับรองเงินเดือน' },
    ];

    return (
        <div className="flex flex-col xl:flex-row gap-6 items-start animate-in fade-in slide-in-from-bottom-2">
            {/* Main Form Container */}
            <div className="flex-1 space-y-6 w-full min-w-0">
                <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*,.pdf"
                />

                {/* ===== SECTION 1: Income (อาชีพและรายได้) ===== */}
                <Card className="border-border-strong">
                    <CardHeader className="bg-blue-50/50 border-b border-border-strong pb-4">
                        <CardTitle className="text-lg flex items-center gap-2 text-chaiyo-blue">
                            <Briefcase className="w-5 h-5" />
                            อาชีพและรายได้
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <div className="relative flex items-center mb-6 border-b border-border-subtle">
                                {/* Scrollable Tab List */}
                                <div className="flex-1 overflow-x-auto no-scrollbar pr-4 min-w-0">
                                    <TabsList className="bg-transparent h-auto p-0 flex space-x-2 w-max pb-3">
                                        {occupations.map((occ: IncomeOccupation, index: number) => (
                                            <TabsTrigger
                                                key={occ.id}
                                                value={occ.id}
                                                className="flex-shrink-0 px-4 py-2 rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-chaiyo-blue data-[state=active]:border-chaiyo-blue border border-transparent hover:bg-gray-50 flex items-center gap-2 transition-all"
                                            >
                                                {occ.isMain ? (
                                                    <span className="flex items-center gap-2">
                                                        <Briefcase className="w-4 h-4" /> อาชีพหลัก
                                                    </span>
                                                ) : (
                                                    `อาชีพรอง ${index}`
                                                )}
                                                {!occ.isMain && (
                                                    <div
                                                        className="w-5 h-5 rounded-full hover:bg-red-100 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRemoveOccupation(occ.id);
                                                        }}
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </div>
                                                )}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                </div>

                                {/* Fixed Add Button */}
                                <div className="flex-shrink-0 pl-4 border-l border-gray-100 mb-3 ml-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleAddSecondaryOccupation}
                                        disabled={occupations.filter((o: IncomeOccupation) => !o.isMain).length >= 10}
                                        className="h-10 border-dashed gap-2 whitespace-nowrap text-gray-600 hover:text-chaiyo-blue transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        เพิ่มอาชีพรอง
                                    </Button>
                                </div>
                            </div>

                            {occupations.map((occ: IncomeOccupation) => (
                                <TabsContent key={occ.id} value={occ.id} className="space-y-8 animate-in fade-in duration-300">
                                    {/* 1. ข้อมูลอาชีพ */}
                                    <div className="rounded-xl border border-border-color bg-gray-50/40 p-6 space-y-4">
                                        <h4 className="text-base font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-border-color">
                                            <Briefcase className="w-5 h-5 text-chaiyo-blue" /> ข้อมูลอาชีพ
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                            <div className="space-y-2">
                                                <Label>ประเภทการจ้างงาน <span className="text-red-500">*</span></Label>
                                                <Select
                                                    value={occ.employmentType || ""}
                                                    onValueChange={(val) => {
                                                        handleOccupationChange(occ.id, {
                                                            employmentType: val,
                                                            jobPosition: "",
                                                            jobPositionOther: ""
                                                        });
                                                    }}
                                                >
                                                    <SelectTrigger className="h-11 bg-white">
                                                        <SelectValue placeholder="เลือกประเภทการจ้างงาน" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="SE">ธุรกิจส่วนตัว (SE)</SelectItem>
                                                        <SelectItem value="SA">พนักงานประจำ / ลูกจ้างชั่วคราว (SA)</SelectItem>
                                                        <SelectItem value="UNEMPLOYED">ว่างงาน</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>อาชีพ <span className="text-red-500">*</span></Label>
                                                <Select
                                                    value={occ.occupationCode || ""}
                                                    onValueChange={(val) => handleOccupationChange(occ.id, "occupationCode", val)}
                                                >
                                                    <SelectTrigger className="h-11 bg-white">
                                                        <SelectValue placeholder="เลือกอาชีพ" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="occ1">Mockup อาชีพที่ 1</SelectItem>
                                                        <SelectItem value="occ2">Mockup อาชีพที่ 2</SelectItem>
                                                        <SelectItem value="FARMER">เกษตรกร</SelectItem>
                                                        <SelectItem value="LIVESTOCK">เลี้ยงสัตว์</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {occ.employmentType === "SE" && (
                                                <div className="space-y-2">
                                                    <Label>ประเภทธุรกิจ (ISIC)</Label>
                                                    <Select
                                                        value={occ.businessTypeIsic || ""}
                                                        onValueChange={(val) => handleOccupationChange(occ.id, "businessTypeIsic", val)}
                                                    >
                                                        <SelectTrigger className="h-11 bg-white">
                                                            <SelectValue placeholder="เลือกประเภทธุรกิจ" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="isic1">Mockup ISIC ที่ 1</SelectItem>
                                                            <SelectItem value="isic2">Mockup ISIC ที่ 2</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            )}

                                            <div className="space-y-2 col-span-1 md:col-span-2">
                                                <Label>ระบุรายละเอียดเพิ่มเติม</Label>
                                                <Textarea
                                                    value={occ.occupationDetail || ""}
                                                    onChange={(e) => handleOccupationChange(occ.id, "occupationDetail", e.target.value)}
                                                    placeholder="รายละเอียดเพิ่มเติมเกี่ยวกับอาชีพ"
                                                    className="resize-none h-20 bg-white"
                                                />
                                            </div>

                                            {occ.employmentType && (
                                                <div className="space-y-2 col-span-1 md:col-span-2">
                                                    <Label>ตำแหน่งงาน <span className="text-red-500">*</span></Label>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <Select
                                                            value={occ.jobPosition || ""}
                                                            onValueChange={(val) => handleOccupationChange(occ.id, "jobPosition", val)}
                                                        >
                                                            <SelectTrigger className="h-11 bg-white">
                                                                <SelectValue placeholder="เลือกตำแหน่งงาน" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {occ.employmentType === 'SE' && (
                                                                    <>
                                                                        <SelectItem value="shareholder">ผู้ถือหุ้น / หุ้นส่วน</SelectItem>
                                                                        <SelectItem value="owner">เจ้าของกิจการ</SelectItem>
                                                                        <SelectItem value="other">อื่นๆ โปรดระบุ</SelectItem>
                                                                    </>
                                                                )}
                                                                {occ.employmentType === 'SA' && (
                                                                    <>
                                                                        <SelectItem value="executive">ผู้บริหารระดับสูง</SelectItem>
                                                                        <SelectItem value="general">พนักงานทั่วไป</SelectItem>
                                                                        <SelectItem value="permanent">ลูกจ้างประจำ (ข้าราชการ และรัฐวิสาหกิจ)</SelectItem>
                                                                        <SelectItem value="temporary">ลูกจ้างชั่วคราว</SelectItem>
                                                                        <SelectItem value="other">อื่นๆ โปรดระบุ</SelectItem>
                                                                    </>
                                                                )}
                                                                {occ.employmentType === 'UNEMPLOYED' && (
                                                                    <>
                                                                        <SelectItem value="retired">เกษียณ</SelectItem>
                                                                        <SelectItem value="unemployed">ว่างงาน</SelectItem>
                                                                        <SelectItem value="other">อื่นๆ โปรดระบุ</SelectItem>
                                                                    </>
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                        {occ.jobPosition === "other" && (
                                                            <Input
                                                                value={occ.jobPositionOther || ""}
                                                                onChange={(e) => handleOccupationChange(occ.id, "jobPositionOther", e.target.value)}
                                                                placeholder="โปรดระบุตำแหน่งงาน"
                                                                className="h-11 bg-white"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="space-y-2">
                                                <Label>ประเทศที่มา-รายได้ <span className="text-red-500">*</span></Label>
                                                <Select
                                                    value={occ.incomeCountry || "TH"}
                                                    onValueChange={(val) => handleOccupationChange(occ.id, "incomeCountry", val)}
                                                >
                                                    <SelectTrigger className="h-11 bg-white">
                                                        <SelectValue placeholder="เลือกประเทศ" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="TH">ไทย</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>แหล่งที่มา-รายได้ <span className="text-red-500">*</span></Label>
                                                <Select
                                                    value={occ.incomeSource || ""}
                                                    onValueChange={(val) => handleOccupationChange(occ.id, "incomeSource", val)}
                                                >
                                                    <SelectTrigger className="h-11 bg-white">
                                                        <SelectValue placeholder="เลือกแหล่งที่มารายได้" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="commission">ค่านายหน้า/ค่าธรรมเนียม/ค่าส่วนลด</SelectItem>
                                                        <SelectItem value="copyright">ค่าลิขสิทธิ์และทรัพย์สินทางปัญญา</SelectItem>
                                                        <SelectItem value="freelance">ค่าวิชาชีพอิสระ</SelectItem>
                                                        <SelectItem value="rent">ค่าเช่า</SelectItem>
                                                        <SelectItem value="interest">ดอกเบี้ย เงินปันผล และ Cyptocurrency</SelectItem>
                                                        <SelectItem value="salary">เงินเดือน/ค่าจ้าง/เบี้ยเลี้ยง/โบนัส</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2. ที่อยู่ที่ทำงาน / กิจการ */}
                                    <div className="rounded-xl border border-gray-200 bg-gray-50/40 p-5">
                                        <AddressForm
                                            title="ที่อยู่ที่ทำงาน / กิจการ"
                                            prefix="work"
                                            formData={occ.isSameAsMainAddress ? (formData.occupations?.find((o: IncomeOccupation) => o.id === 'main') || {}) : occ}
                                            onChange={(field, val) => handleOccupationChange(occ.id, field, val)}
                                            disabled={!!occ.isSameAsMainAddress}
                                            headerChildren={
                                                <div className={cn(
                                                    "flex flex-col md:flex-row md:items-center justify-between gap-4 ",
                                                    occ.isSameAsMainAddress && "opacity-80"
                                                )}>

                                                    {!occ.isMain && (
                                                        <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-border-color">
                                                            <Checkbox
                                                                id={`same-as-main-${occ.id}`}
                                                                checked={occ.isSameAsMainAddress || false}
                                                                onCheckedChange={(checked) => {
                                                                    const isChecked = !!checked;
                                                                    handleOccupationChange(occ.id, "isSameAsMainAddress", isChecked);
                                                                }}
                                                            />
                                                            <label
                                                                htmlFor={`same-as-main-${occ.id}`}
                                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-chaiyo-blue"
                                                            >
                                                                เหมือนที่อยู่อาชีพหลัก
                                                            </label>
                                                        </div>
                                                    )}
                                                </div>
                                            }
                                            footerChildren={
                                                <div className="space-y-4 pt-4 border-t border-gray-100">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                                        <div className="space-y-2">
                                                            <Label className="text-xs text-muted-foreground">บริเวณใกล้เคียง/จุดสังเกต</Label>
                                                            <Input
                                                                value={(occ.isSameAsMainAddress ? (formData.occupations?.find((o: IncomeOccupation) => o.id === 'main') || {} as IncomeOccupation).workLandmark : occ.workLandmark) || ""}
                                                                onChange={(e) => handleOccupationChange(occ.id, "workLandmark", e.target.value)}
                                                                placeholder="เช่น ใกล้เซเว่น, ตรงข้ามธนาคาร"
                                                                className="h-12 bg-white"
                                                                disabled={!!occ.isSameAsMainAddress}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="text-xs text-muted-foreground">ลักษณะที่ตั้งของกิจการ <span className="text-red-500">*</span></Label>
                                                            <div className="flex flex-col gap-2">
                                                                <Select
                                                                    value={(occ.isSameAsMainAddress ? (formData.occupations?.find((o: IncomeOccupation) => o.id === 'main') || {} as IncomeOccupation).workLocationType : occ.workLocationType) || ""}
                                                                    onValueChange={(val) => handleOccupationChange(occ.id, "workLocationType", val)}
                                                                    disabled={!!occ.isSameAsMainAddress}
                                                                >
                                                                    <SelectTrigger className="h-12 bg-white" disabled={!!occ.isSameAsMainAddress}>
                                                                        <SelectValue placeholder="โลเกชั่นที่ตั้ง" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="rental">พื้นที่เช่า/ร้านค้า</SelectItem>
                                                                        <SelectItem value="shop">ห้างร้าน</SelectItem>
                                                                        <SelectItem value="market">แผงลอยในตลาดนัด/ชุมชน</SelectItem>
                                                                        <SelectItem value="factory">โรงงาน</SelectItem>
                                                                        <SelectItem value="street_food">รถเข็นขายของ/ริมถนน</SelectItem>
                                                                        <SelectItem value="company">บริษัท</SelectItem>
                                                                        <SelectItem value="other">อื่นๆ รายละเอียดอื่นๆ</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                                {((occ.isSameAsMainAddress ? (formData.occupations?.find((o: IncomeOccupation) => o.id === 'main') || {} as IncomeOccupation).workLocationType : occ.workLocationType) === 'other') && (
                                                                    <Input
                                                                        value={(occ.isSameAsMainAddress ? (formData.occupations?.find((o: IncomeOccupation) => o.id === 'main') || {} as IncomeOccupation).workLocationTypeOther : occ.workLocationTypeOther) || ""}
                                                                        onChange={(e) => handleOccupationChange(occ.id, "workLocationTypeOther", e.target.value)}
                                                                        placeholder="โปรดระบุรายละเอียด"
                                                                        className="h-12 bg-white"
                                                                        disabled={!!occ.isSameAsMainAddress}
                                                                    />
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {!(occ.employmentType === 'SE' && !['FARMER', 'LIVESTOCK'].includes(occ.occupationCode || '')) && (
                                                        <div className="pt-4 border-t border-gray-100">
                                                            <div className="space-y-3">
                                                                <Label className="text-xs text-muted-foreground">สถานะกิจการปัจจุบัน {(occ.employmentType === 'SA' || occ.employmentType === 'SE') && <span className="text-red-500">*</span>}</Label>
                                                                <RadioGroup
                                                                    value={(occ.isSameAsMainAddress ? (formData.occupations?.find((o: IncomeOccupation) => o.id === 'main') || {} as IncomeOccupation).businessStatus : occ.businessStatus) || ""}
                                                                    onValueChange={(val) => handleOccupationChange(occ.id, "businessStatus", val)}
                                                                    className="flex gap-6 pt-1"
                                                                    disabled={!!occ.isSameAsMainAddress}
                                                                >
                                                                    <div className="flex items-center space-x-2">
                                                                        <RadioGroupItem value="active" id={`${occ.id}-active`} disabled={!!occ.isSameAsMainAddress} />
                                                                        <Label htmlFor={`${occ.id}-active`} className="font-normal cursor-pointer">ดำเนินกิจการอยู่</Label>
                                                                    </div>
                                                                    <div className="flex items-center space-x-2">
                                                                        <RadioGroupItem value="closed" id={`${occ.id}-closed`} disabled={!!occ.isSameAsMainAddress} />
                                                                        <Label htmlFor={`${occ.id}-closed`} className="font-normal cursor-pointer">ปิดกิจการ</Label>
                                                                    </div>
                                                                </RadioGroup>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            }
                                        />
                                    </div>

                                    {/* SA Details Section: Employment Tenure & Income Table */}
                                    {occ.employmentType === 'SA' && (
                                        <div className="rounded-xl border border-border-color bg-gray-50/40 p-6 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                                            <div className="space-y-4">
                                                <h4 className="text-base font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-border-color">
                                                    <TrendingUp className="w-5 h-5 text-chaiyo-blue" /> รายละเอียดอายุงานและรายได้
                                                </h4>

                                                {/* Tenure Grid */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-2">
                                                    <div className="space-y-2">
                                                        <Label className="text-sm font-bold text-gray-700">อายุงานปัจจุบัน <span className="text-red-500">*</span></Label>
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex-1 flex items-center gap-2">
                                                                <Input
                                                                    type="text"
                                                                    className="h-12 bg-white text-center rounded-xl"
                                                                    placeholder="0"
                                                                    value={occ.currentTenureYear || ""}
                                                                    onChange={(e) => handleOccupationChange(occ.id, "currentTenureYear", e.target.value.replace(/\D/g, ''))}
                                                                />
                                                                <span className="text-sm text-muted-foreground whitespace-nowrap">ปี</span>
                                                            </div>
                                                            <div className="flex-1 flex items-center gap-2">
                                                                <Input
                                                                    type="text"
                                                                    className="h-12 bg-white text-center rounded-xl"
                                                                    placeholder="0"
                                                                    value={occ.currentTenureMonth || ""}
                                                                    onChange={(e) => handleOccupationChange(occ.id, "currentTenureMonth", e.target.value.replace(/\D/g, ''))}
                                                                />
                                                                <span className="text-sm text-muted-foreground whitespace-nowrap">เดือน</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-sm font-bold text-gray-700">อายุงานก่อนหน้า <span className="text-red-500">*</span></Label>
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex-1 flex items-center gap-2">
                                                                <Input
                                                                    type="text"
                                                                    className="h-12 bg-white text-center rounded-xl"
                                                                    placeholder="0"
                                                                    value={occ.prevTenureYear || ""}
                                                                    onChange={(e) => handleOccupationChange(occ.id, "prevTenureYear", e.target.value.replace(/\D/g, ''))}
                                                                />
                                                                <span className="text-sm text-muted-foreground whitespace-nowrap">ปี</span>
                                                            </div>
                                                            <div className="flex-1 flex items-center gap-2">
                                                                <Input
                                                                    type="text"
                                                                    className="h-12 bg-white text-center rounded-xl"
                                                                    placeholder="0"
                                                                    value={occ.prevTenureMonth || ""}
                                                                    onChange={(e) => handleOccupationChange(occ.id, "prevTenureMonth", e.target.value.replace(/\D/g, ''))}
                                                                />
                                                                <span className="text-sm text-muted-foreground whitespace-nowrap">เดือน</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Income Table */}
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <Label className="text-sm font-bold text-gray-700">รายการรายได้</Label>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleAddSAIncomeRow(occ.id)}
                                                        className="h-8 text-xs font-medium"
                                                    >
                                                        <Plus className="w-3 h-3 mr-1" /> เพิ่มรายการรายได้
                                                    </Button>
                                                </div>

                                                <div className="border border-border-strong rounded-xl overflow-hidden bg-white">
                                                    <Table>
                                                        <TableHeader className="bg-gray-50/50">
                                                            <TableRow>
                                                                <TableHead className="w-[30%] text-xs">ประเภทรายได้</TableHead>
                                                                <TableHead className="w-[40%] text-xs">รายละเอียดรายได้</TableHead>
                                                                <TableHead className="w-[20%] text-xs">รายได้ (บาท)</TableHead>
                                                                <TableHead className="w-[10%] text-center text-xs">จัดการ</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {(!occ.saIncomes || occ.saIncomes.length === 0) ? (
                                                                <TableRow>
                                                                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground italic text-xs">
                                                                        ยังไม่มีรายการรายได้ กรุณากดเพิ่มรายการ
                                                                    </TableCell>
                                                                </TableRow>
                                                            ) : (
                                                                occ.saIncomes.map((item: SAIncome, idx: number) => (
                                                                    <TableRow key={idx} className="group transition-colors hover:bg-gray-50/50">
                                                                        <TableCell className="py-3">
                                                                            <Select
                                                                                value={item.type || ""}
                                                                                onValueChange={(val) => handleUpdateSAIncomeRow(occ.id, idx, 'type', val)}
                                                                            >
                                                                                <SelectTrigger className="h-9 text-sm bg-gray-50/30">
                                                                                    <SelectValue placeholder="เลือกประเภท" />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    {SA_INCOME_TYPES.map(type => (
                                                                                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                                                                                    ))}
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </TableCell>
                                                                        <TableCell className="py-3">
                                                                            <Input
                                                                                value={item.detail || ""}
                                                                                onChange={(e) => handleUpdateSAIncomeRow(occ.id, idx, 'detail', e.target.value)}
                                                                                placeholder="เช่น ค่าตำแหน่ง, ค่าครองชีพ"
                                                                                className="h-9 text-sm bg-gray-50/30"
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell className="py-3">
                                                                            <Input
                                                                                type="text"
                                                                                value={formatNumberWithCommas(item.amount ?? 0) || ""}
                                                                                onChange={(e) => handleUpdateSAIncomeRow(occ.id, idx, 'amount', e.target.value)}
                                                                                placeholder="0.00"
                                                                                className="h-9 text-sm bg-gray-50/30 text-right font-mono"
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell className="py-3 text-center">
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 rounded-full"
                                                                                onClick={() => setItemToDelete({
                                                                                    index: idx,
                                                                                    occId: occ.id,
                                                                                    name: item.detail || (SA_INCOME_TYPES.find(t => t.value === item.type)?.label) || `รายการที่ ${idx + 1}`,
                                                                                    type: 'saIncomeRow'
                                                                                })}
                                                                            >
                                                                                <Trash2 className="w-4 h-4" />
                                                                            </Button>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))
                                                            )}
                                                        </TableBody>
                                                        <TableFooter>
                                                            <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 transition-none">
                                                                <TableCell colSpan={2} className="text-right font-bold py-4 text-xs">
                                                                    รายได้รวมต่อเดือน:
                                                                </TableCell>
                                                                <TableCell colSpan={2} className="text-right pr-6 py-4">
                                                                    <div className="text-lg font-bold font-mono">
                                                                        ฿{formatNumberWithCommas(occ.totalIncome || "0")}
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableFooter>
                                                    </Table>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* SE Details Section: รายละเอียดกิจการ */}
                                    {occ.employmentType === 'SE' && !['FARMER', 'LIVESTOCK'].includes(occ.occupationCode || '') && (
                                        <div className="rounded-xl border border-border-color bg-gray-50/40 p-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                            <h4 className="text-base font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-border-color">
                                                <Building className="w-5 h-5 text-chaiyo-blue" /> รายละเอียดกิจการ
                                            </h4>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                                <div className="space-y-3">
                                                    <Label>สถานะกิจการปัจจุบัน <span className="text-red-500">*</span></Label>
                                                    <RadioGroup
                                                        value={occ.businessStatus || ""}
                                                        onValueChange={(val) => handleOccupationChange(occ.id, "businessStatus", val)}
                                                        className="flex gap-6 pt-1"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="active" id={`${occ.id}-se-active`} />
                                                            <Label htmlFor={`${occ.id}-se-active`} className="font-normal cursor-pointer">ดำเนินกิจการอยู่</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="closed" id={`${occ.id}-se-closed`} />
                                                            <Label htmlFor={`${occ.id}-se-closed`} className="font-normal cursor-pointer">ปิดกิจการ</Label>
                                                        </div>
                                                    </RadioGroup>

                                                    <div className="pt-2">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            className="h-10 w-full md:w-auto gap-2 border-chaiyo-blue text-chaiyo-blue hover:bg-blue-50 rounded-xl font-medium transition-all"
                                                            onClick={() => window.open("https://datawarehouse.dbd.go.th/", "_blank")}
                                                        >
                                                            <Globe className="w-4 h-4" />
                                                            ตรวจสอบ DBD Datawarehouse
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>กิจการครอบครัว <span className="text-red-500">*</span></Label>
                                                    <Select
                                                        value={occ.familyBusiness || ""}
                                                        onValueChange={(val) => {
                                                            handleOccupationChange(occ.id, {
                                                                familyBusiness: val,
                                                                familyBusinessOther: ""
                                                            });
                                                        }}
                                                    >
                                                        <SelectTrigger className="h-11 bg-white">
                                                            <SelectValue placeholder="เลือก..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="YES">ใช่</SelectItem>
                                                            <SelectItem value="NO">ไม่ใช่</SelectItem>
                                                            <SelectItem value="OTHER">อื่นๆ</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    {occ.familyBusiness === "OTHER" && (
                                                        <Input
                                                            value={occ.familyBusinessOther || ""}
                                                            onChange={(e) => handleOccupationChange(occ.id, "familyBusinessOther", e.target.value)}
                                                            placeholder="โปรดระบุ"
                                                            className="h-11 bg-white mt-2"
                                                        />
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>ประเภทกิจการ <span className="text-red-500">*</span></Label>
                                                    <Select
                                                        value={occ.businessType || ""}
                                                        onValueChange={(val) => handleOccupationChange(occ.id, "businessType", val)}
                                                    >
                                                        <SelectTrigger className="h-11 bg-white">
                                                            <SelectValue placeholder="เลือกประเภทกิจการ" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="type1">การเกษตร</SelectItem>
                                                            <SelectItem value="type2">การพาณิชย์</SelectItem>
                                                            <SelectItem value="type3">การบริการ</SelectItem>
                                                            <SelectItem value="type4">การผลิต</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>จำนวนพนักงาน (คน)</Label>
                                                    <Input
                                                        type="text"
                                                        value={occ.employeeCount || ""}
                                                        onChange={(e) => handleOccupationChange(occ.id, "employeeCount", e.target.value.replace(/\D/g, ''))}
                                                        placeholder="0"
                                                        className="h-11 bg-white"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>อายุกิจการ (ปี) <span className="text-red-500">*</span></Label>
                                                    <Input
                                                        type="text"
                                                        value={occ.businessAgeYear || ""}
                                                        onChange={(e) => handleOccupationChange(occ.id, "businessAgeYear", e.target.value.replace(/\D/g, ''))}
                                                        placeholder="0"
                                                        className="h-11 bg-white"
                                                    />
                                                </div>
                                            </div>

                                            {/* SE Income Data Section */}
                                            <div className="space-y-4 pt-6 mt-6 border-t border-border-color">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                                        <TrendingUp className="w-4 h-4 text-emerald-600" /> ข้อมูลรายได้ของกิจการ
                                                    </h4>
                                                </div>

                                                <div className="border border-border-strong rounded-xl overflow-hidden bg-white">
                                                    <Table>
                                                        <TableHeader className="bg-gray-50/50">
                                                            <TableRow>
                                                                <TableHead className="w-[20%] text-xs">ความถี่</TableHead>
                                                                <TableHead className="w-[10%] text-xs">จำนวน</TableHead>
                                                                <TableHead className="w-[40%] text-xs">เวลาทำการ</TableHead>
                                                                <TableHead className="w-[30%] text-xs text-right pr-6">ยอดขาย (บาท)</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {(() => {
                                                                const item = (occ.seIncomes?.[0] || {}) as EnterpriseIncome;
                                                                const idx = 0;
                                                                return (
                                                                    <TableRow className="group transition-colors hover:bg-gray-50/50">
                                                                        <TableCell className="py-3">
                                                                            <Select
                                                                                value={item.frequency || ""}
                                                                                onValueChange={(val) => {
                                                                                    const rowUpdates: Record<string, unknown> = { frequency: val };
                                                                                    // Clear dependent fields if switching
                                                                                    if (val !== 'daily') rowUpdates.daysPerMonth = '';
                                                                                    if (val !== 'weekly') rowUpdates.weeksPerMonth = '';
                                                                                    handleUpdateSEIncomeRow(occ.id, idx, rowUpdates);
                                                                                }}
                                                                            >
                                                                                <SelectTrigger className="h-9 text-xs bg-gray-50/30">
                                                                                    <SelectValue placeholder="เลือกความถี่" />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    {SE_INCOME_FREQUENCIES.map(freq => (
                                                                                        <SelectItem key={freq.value} value={freq.value} className="text-xs">{freq.label}</SelectItem>
                                                                                    ))}
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </TableCell>
                                                                        <TableCell className="py-3">
                                                                            {item.frequency === 'daily' && (
                                                                                <Input
                                                                                    type="text"
                                                                                    value={item.daysPerMonth || ""}
                                                                                    onChange={(e) => handleUpdateSEIncomeRow(occ.id, idx, { daysPerMonth: e.target.value })}
                                                                                    placeholder="จำนวนวัน"
                                                                                    className="h-9 text-xs bg-gray-50/30"
                                                                                />
                                                                            )}
                                                                            {item.frequency === 'weekly' && (
                                                                                <Input
                                                                                    type="text"
                                                                                    value={item.weeksPerMonth || ""}
                                                                                    onChange={(e) => handleUpdateSEIncomeRow(occ.id, idx, { weeksPerMonth: e.target.value })}
                                                                                    placeholder="จำนวนสัปดาห์"
                                                                                    className="h-9 text-xs bg-gray-50/30"
                                                                                />
                                                                            )}
                                                                        </TableCell>
                                                                        <TableCell className="py-3">
                                                                            <ToggleGroup
                                                                                type="multiple"
                                                                                variant="outline"
                                                                                value={item.operatingHours || []}
                                                                                onValueChange={(vals) => handleUpdateSEIncomeRow(occ.id, idx, { operatingHours: vals })}
                                                                                className="justify-start gap-0 -space-x-px"
                                                                            >
                                                                                {SE_OPERATING_HOURS.map((hour) => (
                                                                                    <ToggleGroupItem
                                                                                        key={hour.value}
                                                                                        value={hour.value}
                                                                                        className={cn(
                                                                                            "h-8 px-3 text-[11px] font-medium rounded-none first:rounded-l-lg last:rounded-r-lg transition-all",
                                                                                            "data-[state=on]:bg-chaiyo-blue data-[state=on]:text-white data-[state=on]:border-chaiyo-blue data-[state=on]:z-10",
                                                                                            "hover:bg-blue-50 hover:text-chaiyo-blue"
                                                                                        )}
                                                                                    >
                                                                                        {hour.label}
                                                                                    </ToggleGroupItem>
                                                                                ))}
                                                                            </ToggleGroup>
                                                                        </TableCell>
                                                                        <TableCell className="py-3 pr-6">
                                                                            <Input
                                                                                type="text"
                                                                                value={formatNumberWithCommas(item.salesAmount ?? "")}
                                                                                onChange={(e) => handleUpdateSEIncomeRow(occ.id, idx, { salesAmount: e.target.value })}
                                                                                placeholder="0.00"
                                                                                className="h-9 text-xs bg-gray-50/30 text-right font-mono"
                                                                            />
                                                                        </TableCell>
                                                                    </TableRow>
                                                                );
                                                            })()}
                                                        </TableBody>
                                                        <TableFooter>
                                                            <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 transition-none">
                                                                <TableCell colSpan={3} className="text-right font-bold py-4 text-xs">
                                                                    รวมยอดขายต่อเดือน:
                                                                </TableCell>
                                                                <TableCell className="text-right pr-6 py-4">
                                                                    <div className="text-lg font-bold font-mono">
                                                                        ฿{formatNumberWithCommas(
                                                                            (occ.seIncomes || []).reduce((acc: number, curr: EnterpriseIncome) => acc + (Number(curr.calculatedMonthly) || 0), 0)
                                                                        )}
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableFooter>
                                                    </Table>
                                                </div>
                                            </div>

                                            {/* SE Cost Data Section */}
                                            <div className="space-y-4 pt-6 mt-6 border-t border-border-color">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                                        <TrendingDown className="w-4 h-4 text-red-500" /> ข้อมูลต้นทุนของกิจการ
                                                    </h4>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleAddSECostRow(occ.id)}
                                                        className="h-8 text-xs font-medium"
                                                    >
                                                        <Plus className="w-3 h-3 mr-1" /> เพิ่มรายการต้นทุน
                                                    </Button>
                                                </div>

                                                <div className="border border-border-strong rounded-xl overflow-hidden bg-white">
                                                    <Table>
                                                        <TableHeader className="bg-gray-50/50">
                                                            <TableRow>
                                                                <TableHead className="w-[20%] text-xs">ประเภทต้นทุน</TableHead>
                                                                <TableHead className="w-[20%] text-xs">ความถี่</TableHead>
                                                                <TableHead className="w-[10%] text-xs">จำนวน</TableHead>
                                                                <TableHead className="w-[30%] text-xs">ต้นทุน (บาท)</TableHead>
                                                                <TableHead className="w-[20%] text-xs text-right">รวมต่อเดือน</TableHead>
                                                                <TableHead className="w-[10%] text-center text-xs">จัดการ</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {(!occ.seCosts || occ.seCosts.length === 0) ? (
                                                                <TableRow>
                                                                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground italic text-xs">
                                                                        ยังไม่มีข้อมูลต้นทุน กรุณากดเพิ่มรายการ
                                                                    </TableCell>
                                                                </TableRow>
                                                            ) : (
                                                                occ.seCosts.map((item: EnterpriseIncome, idx: number) => (
                                                                    <TableRow key={idx} className="group transition-colors hover:bg-gray-50/50">
                                                                        <TableCell className="py-3">
                                                                            <div className="space-y-2">
                                                                                <Select
                                                                                    value={item.type || ""}
                                                                                    onValueChange={(val) => {
                                                                                        const rowUpdates: Record<string, unknown> = { type: val };
                                                                                        if (val !== 'custom') {
                                                                                            rowUpdates.customType = '';
                                                                                        }
                                                                                        handleUpdateSECostRow(occ.id, idx, rowUpdates);
                                                                                    }}
                                                                                >
                                                                                    <SelectTrigger className="h-9 text-xs bg-gray-50/30">
                                                                                        <SelectValue placeholder="เลือกประเภท" />
                                                                                    </SelectTrigger>
                                                                                    <SelectContent>
                                                                                        {SE_COST_TYPES.map(type => (
                                                                                            <SelectItem key={type.value} value={type.value} className="text-xs">{type.label}</SelectItem>
                                                                                        ))}
                                                                                    </SelectContent>
                                                                                </Select>
                                                                                {item.type === 'custom' && (
                                                                                    <Input
                                                                                        type="text"
                                                                                        value={item.customType || ""}
                                                                                        onChange={(e) => handleUpdateSECostRow(occ.id, idx, { customType: e.target.value })}
                                                                                        placeholder="ระบุชื่อต้นทุน"
                                                                                        className="h-9 text-xs bg-gray-50/30"
                                                                                    />
                                                                                )}
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell className="py-3 align-top">
                                                                            <Select
                                                                                value={item.frequency || ""}
                                                                                onValueChange={(val) => {
                                                                                    const rowUpdates: Record<string, unknown> = { frequency: val };
                                                                                    // Clear dependent fields if switching
                                                                                    if (val !== 'daily') rowUpdates.daysPerMonth = '';
                                                                                    if (val !== 'weekly') rowUpdates.weeksPerMonth = '';
                                                                                    handleUpdateSECostRow(occ.id, idx, rowUpdates);
                                                                                }}
                                                                            >
                                                                                <SelectTrigger className="h-9 text-xs bg-gray-50/30">
                                                                                    <SelectValue placeholder="เลือกความถี่" />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    {SE_COST_FREQUENCIES.map(freq => (
                                                                                        <SelectItem key={freq.value} value={freq.value} className="text-xs">{freq.label}</SelectItem>
                                                                                    ))}
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </TableCell>
                                                                        <TableCell className="py-3 align-top">
                                                                            {item.frequency === 'daily' && (
                                                                                <Input
                                                                                    type="text"
                                                                                    value={item.daysPerMonth || ""}
                                                                                    onChange={(e) => handleUpdateSECostRow(occ.id, idx, { daysPerMonth: e.target.value })}
                                                                                    placeholder="จำนวนวัน"
                                                                                    className="h-9 text-xs bg-gray-50/30"
                                                                                />
                                                                            )}
                                                                            {item.frequency === 'weekly' && (
                                                                                <Input
                                                                                    type="text"
                                                                                    value={item.weeksPerMonth || ""}
                                                                                    onChange={(e) => handleUpdateSECostRow(occ.id, idx, { weeksPerMonth: e.target.value })}
                                                                                    placeholder="จำนวนสัปดาห์"
                                                                                    className="h-9 text-xs bg-gray-50/30"
                                                                                />
                                                                            )}
                                                                        </TableCell>
                                                                        <TableCell className="py-3 align-top">
                                                                            <Input
                                                                                type="text"
                                                                                value={formatNumberWithCommas(item.costAmount ?? 0) || ""}
                                                                                onChange={(e) => handleUpdateSECostRow(occ.id, idx, { costAmount: e.target.value })}
                                                                                placeholder="0.00"
                                                                                className="h-9 text-xs bg-gray-50/30 text-right font-mono"
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell className="py-3 pr-4 align-top">
                                                                            <div className="text-right text-sm font-mono font-bold text-gray-600 mt-1">
                                                                                {formatNumberWithCommas(item.calculatedMonthly || "0")}
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell className="py-3 text-center align-top">
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 rounded-full mt-0.5"
                                                                                onClick={() => setItemToDelete({
                                                                                    index: idx,
                                                                                    occId: occ.id,
                                                                                    name: `รายการต้นทุนที่ ${idx + 1}`,
                                                                                    type: 'seCostRow'
                                                                                })}
                                                                            >
                                                                                <Trash2 className="w-4 h-4" />
                                                                            </Button>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))
                                                            )}
                                                        </TableBody>
                                                        <TableFooter>
                                                            <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 transition-none">
                                                                <TableCell colSpan={4} className="text-right font-bold py-4 text-xs">
                                                                    รวมต้นทุนเฉลี่ยต่อเดือน:
                                                                </TableCell>
                                                                <TableCell colSpan={2} className="text-right pr-4 py-4">
                                                                    <div className="text-lg font-bold font-mono text-gray-900">
                                                                        ฿{formatNumberWithCommas(
                                                                            (occ.seCosts || []).reduce((acc: number, curr: EnterpriseIncome) => acc + (Number(curr.calculatedMonthly) || 0), 0)
                                                                        )}
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableFooter>
                                                    </Table>
                                                </div>
                                            </div>

                                            {/* Net Income Summary Box */}
                                            <div className="pt-6 mt-6 border-t border-border-color">
                                                <div className="bg-chaiyo-blue/5 border border-chaiyo-blue/20 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="bg-white p-2 rounded-lg border border-chaiyo-blue/10 text-chaiyo-blue">
                                                            <DollarSign className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-bold text-gray-800">รายได้สุทธิต่อเดือน</h4>
                                                            <p className="text-xs text-muted-foreground mt-0.5">รวมยอดขาย ลบ รวมต้นทุน</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        {(() => {
                                                            const totalIncome = (occ.seIncomes || []).reduce((acc: number, curr: EnterpriseIncome) => acc + (Number(curr.calculatedMonthly) || 0), 0);
                                                            const totalCost = (occ.seCosts || []).reduce((acc: number, curr: EnterpriseIncome) => acc + (Number(curr.calculatedMonthly) || 0), 0);
                                                            const netIncome = totalIncome - totalCost;
                                                            return (
                                                                <div className={cn(
                                                                    "text-2xl font-bold font-mono",
                                                                    netIncome < 0 ? "text-red-500" : "text-chaiyo-blue"
                                                                )}>
                                                                    ฿{formatNumberWithCommas(netIncome)}
                                                                </div>
                                                            );
                                                        })()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* SE Details Section: รายละเอียดกิจการ (กรณีเกษตรกร) */}
                                    {occ.employmentType === 'SE' && occ.occupationCode === 'FARMER' && (
                                        <div className="rounded-xl border border-border-color bg-gray-50/40 p-6 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                                            <h4 className="text-base font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-border-color">
                                                <Briefcase className="w-5 h-5 text-chaiyo-blue" /> รายละเอียดของกิจการ (เกษตรกร)
                                            </h4>

                                            {/* ผลผลิต Section */}
                                            <div className="space-y-4">
                                                <h5 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                                    <PieChart className="w-4 h-4 text-emerald-600" /> ผลผลิต
                                                </h5>
                                                <div className="bg-white p-5 rounded-xl border border-border-color">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                                        {/* ผลผลิตที่ปลูก */}
                                                        <div className="space-y-2 col-span-2">
                                                            <Label>ผลผลิตที่ปลูก <span className="text-red-500">*</span></Label>
                                                            <div className="flex flex-col sm:flex-row gap-3">
                                                                <Select
                                                                    value={occ.produceType || ""}
                                                                    onValueChange={(val) => handleOccupationChange(occ.id, "produceType", val)}
                                                                >
                                                                    <SelectTrigger className="h-11 bg-gray-50/30">
                                                                        <SelectValue placeholder="เลือกผลผลิต" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {FARMER_PRODUCE_LIST.map(item => (
                                                                            <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                {occ.produceType === 'others' && (
                                                                    <Input
                                                                        value={occ.otherProduceType || ""}
                                                                        onChange={(e) => handleOccupationChange(occ.id, "otherProduceType", e.target.value)}
                                                                        placeholder="โปรดระบุอื่นๆ"
                                                                        className="h-11 bg-gray-50/30 w-full sm:max-w-xs"
                                                                    />
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* วันที่ปลูก/เลี้ยง */}
                                                        <div className="space-y-2">
                                                            <Label>วันที่เริ่มปลูก/เลี้ยง</Label>
                                                            <div className="flex items-center gap-3">
                                                                <Select
                                                                    value={occ.plantingStartMonth || ""}
                                                                    onValueChange={(val) => handleOccupationChange(occ.id, "plantingStartMonth", val)}
                                                                >
                                                                    <SelectTrigger className="h-11 bg-gray-50/30 flex-1">
                                                                        <SelectValue placeholder="เดือน" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {FARM_MONTHS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                                                    </SelectContent>
                                                                </Select>
                                                                <Select
                                                                    value={occ.plantingStartYear || ""}
                                                                    onValueChange={(val) => handleOccupationChange(occ.id, "plantingStartYear", val)}
                                                                >
                                                                    <SelectTrigger className="h-11 bg-gray-50/30 flex-1">
                                                                        <SelectValue placeholder="ปี" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {FARM_YEARS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>

                                                        {/* วันที่คาดว่าจะเก็บเกี่ยว */}
                                                        <div className="space-y-2">
                                                            <Label>วันที่คาดว่าจะเก็บเกี่ยว</Label>
                                                            <div className="flex items-center gap-3">
                                                                <Select
                                                                    value={occ.harvestEndMonth || ""}
                                                                    onValueChange={(val) => handleOccupationChange(occ.id, "harvestEndMonth", val)}
                                                                >
                                                                    <SelectTrigger className="h-11 bg-gray-50/30 flex-1">
                                                                        <SelectValue placeholder="เดือน" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {FARM_MONTHS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                                                    </SelectContent>
                                                                </Select>
                                                                <Select
                                                                    value={occ.harvestEndYear || ""}
                                                                    onValueChange={(val) => handleOccupationChange(occ.id, "harvestEndYear", val)}
                                                                >
                                                                    <SelectTrigger className="h-11 bg-gray-50/30 flex-1">
                                                                        <SelectValue placeholder="ปี" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {FARM_YEARS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>

                                                        {/* ระยะเพาะปลูก (อายุ) - Calculated */}
                                                        <div className="col-span-2 bg-chaiyo-blue/5 border border-chaiyo-blue/10 rounded-xl p-4 flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <Info className="w-4 h-4 text-chaiyo-blue" />
                                                                <span className="text-sm font-bold text-gray-700">ระยะเพาะปลูก (อายุ)</span>
                                                            </div>
                                                            {(() => {
                                                                if (!occ.plantingStartYear || !occ.plantingStartMonth || !occ.harvestEndYear || !occ.harvestEndMonth) {
                                                                    return <div className="text-lg font-bold text-gray-400">ระบุวันที่ให้ครบถ้วน</div>;
                                                                }

                                                                const startY = parseInt(occ.plantingStartYear);
                                                                const startM = parseInt(occ.plantingStartMonth);
                                                                const endY = parseInt(occ.harvestEndYear);
                                                                const endM = parseInt(occ.harvestEndMonth);

                                                                const startTotal = startY * 12 + startM;
                                                                const endTotal = endY * 12 + endM;
                                                                let diff = endTotal - startTotal;

                                                                if (diff < 0) {
                                                                    return <div className="text-sm font-bold text-red-500">วันที่เก็บเกี่ยวต้องอยู่หลังวันที่ปลูก</div>;
                                                                }

                                                                const resY = Math.floor(diff / 12);
                                                                const resM = diff % 12;

                                                                return (
                                                                    <div className="text-lg font-bold text-chaiyo-blue">
                                                                        {resY > 0 ? `${resY} ปี ` : ""}{resM > 0 ? `${resM} เดือน` : (resY === 0 ? "0 เดือน" : "")}
                                                                    </div>
                                                                );
                                                            })()}
                                                        </div>

                                                        {/* พื้นที่เพาะปลูก */}
                                                        <div className="space-y-3 col-span-2">
                                                            <Label>พื้นที่เพาะปลูก</Label>
                                                            <div className="grid grid-cols-3 gap-4">
                                                                <div className="relative">
                                                                    <Input
                                                                        type="text"
                                                                        value={occ.cultivationAreaRai || ""}
                                                                        onChange={(e) => handleOccupationChange(occ.id, "cultivationAreaRai", e.target.value.replace(/\D/g, ''))}
                                                                        placeholder="0"
                                                                        className="h-11 bg-gray-50/30 pr-8"
                                                                    />
                                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">ไร่</span>
                                                                </div>
                                                                <div className="relative">
                                                                    <Input
                                                                        type="text"
                                                                        value={occ.cultivationAreaNgan || ""}
                                                                        onChange={(e) => handleOccupationChange(occ.id, "cultivationAreaNgan", e.target.value.replace(/\D/g, ''))}
                                                                        placeholder="0"
                                                                        className="h-11 bg-gray-50/30 pr-10"
                                                                    />
                                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">งาน</span>
                                                                </div>
                                                                <div className="relative">
                                                                    <Input
                                                                        type="text"
                                                                        value={occ.cultivationAreaSqWa || ""}
                                                                        onChange={(e) => handleOccupationChange(occ.id, "cultivationAreaSqWa", e.target.value.replace(/\D/g, ''))}
                                                                        placeholder="0"
                                                                        className="h-11 bg-gray-50/30 pr-16"
                                                                    />
                                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">ตารางวา</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* จำนวนรอบที่ปลูกต่อปี */}
                                                        <div className="space-y-2">
                                                            <Label>จำนวนรอบที่ปลูกต่อปี</Label>
                                                            <Input
                                                                type="text"
                                                                value={occ.cyclesPerYear || ""}
                                                                onChange={(e) => handleOccupationChange(occ.id, "cyclesPerYear", e.target.value.replace(/\D/g, ''))}
                                                                placeholder="เช่น 1"
                                                                className="h-11 bg-gray-50/30"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* อื่นๆ Section */}
                                            <div className="space-y-4">
                                                <h5 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                                    <Info className="w-4 h-4 text-chaiyo-blue" /> อื่นๆ
                                                </h5>
                                                <div className="bg-white p-5 rounded-xl border border-border-color">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                                        {/* เขตชลประทาน */}
                                                        <div className="space-y-3">
                                                            <Label>เขตชลประทาน</Label>
                                                            <ToggleGroup
                                                                type="single"
                                                                value={occ.irrigationZone || ""}
                                                                onValueChange={(val) => { if (val) handleOccupationChange(occ.id, "irrigationZone", val) }}
                                                                className="justify-start gap-2"
                                                            >
                                                                <ToggleGroupItem value="outside" className="h-11 px-6 rounded-xl border border-gray-200 data-[state=on]:bg-chaiyo-blue data-[state=on]:text-white">นอกเขต</ToggleGroupItem>
                                                                <ToggleGroupItem value="inside" className="h-11 px-6 rounded-xl border border-gray-200 data-[state=on]:bg-chaiyo-blue data-[state=on]:text-white">ในเขต</ToggleGroupItem>
                                                            </ToggleGroup>
                                                        </div>

                                                        {/* การถือครอง */}
                                                        <div className="space-y-3">
                                                            <Label>การถือครอง</Label>
                                                            <Select
                                                                value={occ.landOwnership || ""}
                                                                onValueChange={(val) => handleOccupationChange(occ.id, "landOwnership", val)}
                                                            >
                                                                <SelectTrigger className="h-11 bg-gray-50/30">
                                                                    <SelectValue placeholder="เลือกการถือครอง" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {LAND_OWNERSHIP_TYPES.map(item => (
                                                                        <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        {/* ทำเอง/จ้างทำ */}
                                                        <div className="space-y-3">
                                                            <Label>ทำเอง/จ้างทำ</Label>
                                                            <ToggleGroup
                                                                type="single"
                                                                value={occ.laborType || ""}
                                                                onValueChange={(val) => { if (val) handleOccupationChange(occ.id, "laborType", val) }}
                                                                className="justify-start gap-2"
                                                            >
                                                                <ToggleGroupItem value="self" className="h-11 px-6 rounded-xl border border-gray-200 data-[state=on]:bg-chaiyo-blue data-[state=on]:text-white">ทำเอง</ToggleGroupItem>
                                                                <ToggleGroupItem value="hire" className="h-11 px-6 rounded-xl border border-gray-200 data-[state=on]:bg-chaiyo-blue data-[state=on]:text-white">จ้างทำ</ToggleGroupItem>
                                                            </ToggleGroup>
                                                        </div>

                                                        {/* ทำกี่คน (Display only if จ้างทำ is selected) */}
                                                        {occ.laborType === 'hire' && (
                                                            <div className="space-y-2 animate-in fade-in slide-in-from-left-4 duration-300">
                                                                <Label>ทำกี่คน</Label>
                                                                <div className="relative">
                                                                    <Input
                                                                        type="text"
                                                                        value={occ.laborCount || ""}
                                                                        onChange={(e) => handleOccupationChange(occ.id, "laborCount", e.target.value.replace(/\D/g, ''))}
                                                                        placeholder="กี่คน"
                                                                        className="h-11 bg-gray-50/30 pr-10"
                                                                    />
                                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">คน</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            {/* รายได้ต่อเดือน Table */}
                                            <div className="space-y-4">
                                                <h5 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                                    <DollarSign className="w-4 h-4 text-chaiyo-blue" /> รายได้ต่อเดือน
                                                </h5>
                                                <div className="border border-border-strong rounded-xl overflow-hidden bg-white">
                                                    <Table>
                                                        <TableHeader className="bg-gray-50/50">
                                                            <TableRow>
                                                                <TableHead className="w-[40%] text-xs font-bold">รายการ</TableHead>
                                                                <TableHead className="w-[30%] text-xs font-bold text-right">ราคามาตราฐานกลาง</TableHead>
                                                                <TableHead className="w-[30%] text-xs font-bold text-right pr-6">ราคาของลูกค้า</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {(() => {
                                                                const std = FARM_STANDARD_PRICES[occ.produceType || "others"] || { sales: 0, cost: 0 };

                                                                const totalAreaRai = Number(occ.cultivationAreaRai || 0) + (Number(occ.cultivationAreaNgan || 0) / 4) + (Number(occ.cultivationAreaSqWa || 0) / 400);
                                                                const cycles = Number(occ.cyclesPerYear || 1);
                                                                const laborers = Number(occ.laborCount || 1) || 1; // avoid divide by zero

                                                                const customerSales = occ.customerSalesPerRai ? Number(occ.customerSalesPerRai) : std.sales;
                                                                const customerCost = occ.customerCostPerRai ? Number(occ.customerCostPerRai) : std.cost;

                                                                const stdIncome = (((std.sales - std.cost) * totalAreaRai * cycles) / 12) / laborers;
                                                                const customerIncome = (((customerSales - customerCost) * totalAreaRai * cycles) / 12) / laborers;

                                                                return (
                                                                    <>
                                                                        <TableRow className="hover:bg-gray-50/30">
                                                                            <TableCell className="py-3 text-xs font-medium text-gray-700">ขายได้ต่อไร่ต่อรอบ (บาท)</TableCell>
                                                                            <TableCell className="py-3 text-xs text-right font-mono text-muted-foreground">{formatNumberWithCommas(std.sales)}</TableCell>
                                                                            <TableCell className="py-3 text-right pr-6">
                                                                                <Input
                                                                                    type="text"
                                                                                    value={formatNumberWithCommas(occ.customerSalesPerRai || "")}
                                                                                    onChange={(e) => {
                                                                                        const cleaned = e.target.value.replace(/,/g, '');
                                                                                        if (/^\d*\.?\d*$/.test(cleaned)) {
                                                                                            handleOccupationChange(occ.id, "customerSalesPerRai", cleaned);
                                                                                        }
                                                                                    }}
                                                                                    className="h-8 text-[11px] bg-gray-50/30 font-mono text-right w-32 ml-auto"
                                                                                    placeholder="0.00"
                                                                                />
                                                                            </TableCell>
                                                                        </TableRow>
                                                                        <TableRow className="hover:bg-gray-50/30 border-b">
                                                                            <TableCell className="py-3 text-xs font-medium text-gray-700">ต้นทุนต่อไร่ต่อรอบ (บาท)</TableCell>
                                                                            <TableCell className="py-3 text-xs text-right font-mono text-muted-foreground">{formatNumberWithCommas(std.cost)}</TableCell>
                                                                            <TableCell className="py-3 text-right pr-6">
                                                                                <Input
                                                                                    type="text"
                                                                                    value={formatNumberWithCommas(occ.customerCostPerRai || "")}
                                                                                    onChange={(e) => {
                                                                                        const cleaned = e.target.value.replace(/,/g, '');
                                                                                        if (/^\d*\.?\d*$/.test(cleaned)) {
                                                                                            handleOccupationChange(occ.id, "customerCostPerRai", cleaned);
                                                                                        }
                                                                                    }}
                                                                                    className="h-8 text-[11px] bg-gray-50/30 font-mono text-right w-32 ml-auto"
                                                                                    placeholder="0.00"
                                                                                />
                                                                            </TableCell>
                                                                        </TableRow>
                                                                        <TableRow className="bg-blue-50/30 hover:bg-blue-50/40 transition-none">
                                                                            <TableCell className="py-4 text-xs font-bold text-chaiyo-blue">รายได้ต่อเดือน (บาท)</TableCell>
                                                                            <TableCell className="py-4 text-sm text-right font-bold font-mono text-muted-foreground">{formatNumberWithCommas(Math.max(0, stdIncome).toFixed(2))}</TableCell>
                                                                            <TableCell className="py-4 text-right pr-6">
                                                                                <div className="text-sm font-bold font-mono text-chaiyo-blue">
                                                                                    {formatNumberWithCommas(Math.max(0, customerIncome).toFixed(2))}
                                                                                </div>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    </>
                                                                );
                                                            })()}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                                <p className="text-[10px] text-muted-foreground px-1 italic">
                                                    * รายได้ต่อเดือน = (((ขายได้-ต้นทุน) × พื้นที่เพาะปลูก × จำนวนรอบ) / 12) / จำนวนคน
                                                </p>
                                            </div>

                                            {/* ตารางสรุปช่วงเวลาและผลผลิต */}
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h5 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                                        <TrendingUp className="w-4 h-4 text-chaiyo-blue" /> ตารางสรุปช่วงเวลาและผลผลิต
                                                    </h5>
                                                </div>

                                                <div className="border border-border-strong rounded-xl overflow-hidden bg-white">
                                                    <Table>
                                                        <TableHeader className="bg-gray-50/50">
                                                            <TableRow>
                                                                <TableHead className="w-[40%] text-xs font-bold">กิจกรรม/ช่วงการเพาะปลูก</TableHead>
                                                                <TableHead className="w-[60%] text-xs font-bold">เดือน/ช่วงเวลา</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {(() => {
                                                                const produceRows = (occ.produceSummary && occ.produceSummary.length === FARM_STAGES.length)
                                                                    ? occ.produceSummary
                                                                    : FARM_STAGES.map(stage => ({ stage, startMonth: "", endMonth: "" }));

                                                                return produceRows.map((item: any, idx: number) => (
                                                                    <TableRow key={idx} className="group transition-colors hover:bg-gray-50/50">
                                                                        <TableCell className="py-3 font-medium text-xs text-gray-700 bg-gray-50/20">
                                                                            {item.stage}
                                                                        </TableCell>
                                                                        <TableCell className="py-2">
                                                                            <div className="flex items-center gap-2">
                                                                                <Select
                                                                                    value={item.startMonth || ""}
                                                                                    onValueChange={(val) => {
                                                                                        const updated = [...produceRows];
                                                                                        updated[idx] = { ...item, startMonth: val };
                                                                                        handleOccupationChange(occ.id, "produceSummary", updated);
                                                                                    }}
                                                                                >
                                                                                    <SelectTrigger className="h-9 text-xs bg-white border-gray-200 w-32">
                                                                                        <SelectValue placeholder="เดือนที่เริ่ม" />
                                                                                    </SelectTrigger>
                                                                                    <SelectContent>
                                                                                        {THAI_MONTHS_SHORT.map(m => (
                                                                                            <SelectItem key={m} value={m} className="text-xs">{m}</SelectItem>
                                                                                        ))}
                                                                                    </SelectContent>
                                                                                </Select>
                                                                                <span className="text-muted-foreground text-xs">ถึง</span>
                                                                                <Select
                                                                                    value={item.endMonth || ""}
                                                                                    onValueChange={(val) => {
                                                                                        const updated = [...produceRows];
                                                                                        updated[idx] = { ...item, endMonth: val };
                                                                                        handleOccupationChange(occ.id, "produceSummary", updated);
                                                                                    }}
                                                                                >
                                                                                    <SelectTrigger className="h-9 text-xs bg-white border-gray-200 w-32">
                                                                                        <SelectValue placeholder="เดือนที่สิ้นสุด" />
                                                                                    </SelectTrigger>
                                                                                    <SelectContent>
                                                                                        {THAI_MONTHS_SHORT.map(m => (
                                                                                            <SelectItem key={m} value={m} className="text-xs">{m}</SelectItem>
                                                                                        ))}
                                                                                    </SelectContent>
                                                                                </Select>
                                                                            </div>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ));
                                                            })()}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* SE Details Section: รายละเอียดกิจการ (กรณีปศุสัตว์) */}
                                    {occ.employmentType === 'SE' && occ.occupationCode === 'LIVESTOCK' && (
                                        <div className="rounded-xl border border-border-color bg-gray-50/40 p-6 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                                            <h4 className="text-base font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-border-color">
                                                <Briefcase className="w-5 h-5 text-chaiyo-blue" /> รายละเอียดของกิจการ (ปศุสัตว์)
                                            </h4>

                                            {/* ประเภทปศุสัตว์ Section */}
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                                    <div className="space-y-2">
                                                        <Label>ประเภทปศุสัตว์ <span className="text-red-500">*</span></Label>
                                                        <div className="flex flex-col sm:flex-row gap-3">
                                                            <Select
                                                                value={occ.livestockType || ""}
                                                                onValueChange={(val) => handleOccupationChange(occ.id, "livestockType", val)}
                                                            >
                                                                <SelectTrigger className="h-11 bg-white">
                                                                    <SelectValue placeholder="เลือกประเภทปศุสัตว์" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {LIVESTOCK_TYPES.map(item => (
                                                                        <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            {occ.livestockType === 'others' && (
                                                                <Input
                                                                    value={occ.otherLivestockType || ""}
                                                                    onChange={(e) => handleOccupationChange(occ.id, "otherLivestockType", e.target.value)}
                                                                    placeholder="โปรดระบุอื่นๆ"
                                                                    className="h-11 bg-white w-full sm:max-w-xs"
                                                                />
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>ประเภทการเลี้ยง <span className="text-red-500">*</span></Label>
                                                        <ToggleGroup
                                                            type="single"
                                                            value={occ.farmingType || ""}
                                                            onValueChange={(val) => { if (val) handleOccupationChange(occ.id, "farmingType", val) }}
                                                            className="justify-start gap-2"
                                                        >
                                                            <ToggleGroupItem value="contract" className="h-11 px-6 rounded-xl border border-gray-200 data-[state=on]:bg-chaiyo-blue data-[state=on]:text-white">Contract Farming</ToggleGroupItem>
                                                            <ToggleGroupItem value="self" className="h-11 px-6 rounded-xl border border-gray-200 data-[state=on]:bg-chaiyo-blue data-[state=on]:text-white">เลี้ยงเอง</ToggleGroupItem>
                                                        </ToggleGroup>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Livestock Cycles Table (Only if เลี้ยงเอง) */}
                                            {occ.farmingType === 'self' && (
                                                <div className="space-y-4 pt-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                                    <div className="flex items-center justify-between">
                                                        <h5 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                                            <TrendingUp className="w-4 h-4 text-emerald-600" /> ตารางรอบ
                                                        </h5>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            disabled={(occ.livestockCycles?.length || 0) >= 12}
                                                            onClick={() => {
                                                                const current = occ.livestockCycles || [];
                                                                handleOccupationChange(occ.id, "livestockCycles", [
                                                                    ...current,
                                                                    { cycleNo: current.length + 1, unit: "" }
                                                                ]);
                                                            }}
                                                            className="h-8 text-xs gap-1 border-chaiyo-blue text-chaiyo-blue hover:bg-blue-50"
                                                        >
                                                            <Plus className="w-3 h-3" /> เพิ่มรอบ
                                                        </Button>
                                                    </div>

                                                    <div className="border border-border-strong rounded-xl overflow-hidden bg-white">
                                                        <Table>
                                                            <TableHeader className="bg-gray-50/50">
                                                                <TableRow>
                                                                    <TableHead className="w-[15%] text-xs font-bold text-center">ลำดับรอบ</TableHead>
                                                                    <TableHead className="w-[85%] text-xs font-bold">หน่วย / จำนวน</TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {(occ.livestockCycles || []).map((cycle, idx) => (
                                                                    <TableRow key={idx} className="group transition-colors hover:bg-gray-50/50">
                                                                        <TableCell className="py-3 font-medium text-xs text-gray-700 bg-gray-50/20 text-center">
                                                                            {cycle.cycleNo}
                                                                        </TableCell>
                                                                        <TableCell className="py-2 pr-6">
                                                                            <div className="flex items-center gap-3">
                                                                                <Input
                                                                                    type="text"
                                                                                    value={cycle.unit || ""}
                                                                                    onChange={(e) => {
                                                                                        const updated = [...(occ.livestockCycles || [])];
                                                                                        updated[idx] = { ...cycle, unit: e.target.value };
                                                                                        handleOccupationChange(occ.id, "livestockCycles", updated);
                                                                                    }}
                                                                                    placeholder="ระบุจำนวน หรือ รายละเอียด"
                                                                                    className="h-9 text-xs bg-gray-50/30"
                                                                                />
                                                                                <Button
                                                                                    type="button"
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    onClick={() => {
                                                                                        const updated = (occ.livestockCycles || []).filter((_, i) => i !== idx)
                                                                                            .map((c, i) => ({ ...c, cycleNo: i + 1 }));
                                                                                        handleOccupationChange(occ.id, "livestockCycles", updated);
                                                                                    }}
                                                                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                                                >
                                                                                    <X className="w-3.5 h-3.5" />
                                                                                </Button>
                                                                            </div>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                                {(occ.livestockCycles || []).length === 0 && (
                                                                    <TableRow>
                                                                        <TableCell colSpan={2} className="py-8 text-center text-xs text-muted-foreground italic">
                                                                            ยังไม่มีข้อมูลรอบการเลี้ยงสัตว์ กดปุ่ม "เพิ่มรอบ" เพื่อเริ่มบันทึกข้อมูล
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )}
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}



                                    {/* 3. ช่องทางการรับรายได้ */}
                                    <div className="rounded-xl border border-border-color bg-gray-50/40 p-6 space-y-6">
                                        <h4 className="text-base font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-border-color">
                                            <DollarSign className="w-5 h-5 text-chaiyo-blue" /> ช่องทางการรับรายได้
                                        </h4>

                                        <div className="space-y-6">
                                            {/* Payment Channels Selection */}
                                            <div className="space-y-3">
                                                <Label className="text-sm font-bold text-gray-700">ช่องทางการรับเงิน <span className="text-red-500">*</span></Label>
                                                <div className="flex flex-wrap gap-6 mt-1">
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`cash-${occ.id}`}
                                                            checked={(occ.incomeChannels || []).includes('cash')}
                                                            onCheckedChange={() => toggleIncomeChannel(occ.id, 'cash')}
                                                        />
                                                        <Label htmlFor={`cash-${occ.id}`} className="font-normal cursor-pointer">รับเงินสด</Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`bank-${occ.id}`}
                                                            checked={(occ.incomeChannels || []).includes('bank')}
                                                            onCheckedChange={() => toggleIncomeChannel(occ.id, 'bank')}
                                                        />
                                                        <Label htmlFor={`bank-${occ.id}`} className="font-normal cursor-pointer">บัญชีธนาคาร</Label>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Bank Accounts Table (Conditional) */}
                                            {(occ.incomeChannels || []).includes('bank') && (
                                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <Label className="text-sm font-bold text-gray-700">รายการบัญชีธนาคาร</Label>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleAddBankAccount(occ.id)}
                                                            className="h-8 text-xs font-medium"
                                                        >
                                                            <Plus className="w-3 h-3 mr-1" /> เพิ่มบัญชี
                                                        </Button>
                                                    </div>

                                                    <div className="border border-border-strong rounded-xl overflow-hidden bg-white">
                                                        <Table>
                                                            <TableHeader className="bg-gray-50/50">
                                                                <TableRow>
                                                                    <TableHead className="w-[40%] text-xs">ธนาคาร</TableHead>
                                                                    <TableHead className="w-[45%] text-xs">เลขที่บัญชี</TableHead>
                                                                    <TableHead className="w-[15%]"></TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {(!occ.bankAccounts || occ.bankAccounts.length === 0) ? (
                                                                    <TableRow>
                                                                        <TableCell colSpan={3} className="text-center py-8 text-muted-foreground text-sm italic">
                                                                            ยังไม่มีข้อมูลบัญชีธนาคาร กรุณากดเพิ่มบัญชี
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ) : (
                                                                    occ.bankAccounts.map((account: BankAccount, idx: number) => (
                                                                        <TableRow key={idx}>
                                                                            <TableCell>
                                                                                <Select
                                                                                    value={account.bankName}
                                                                                    onValueChange={(val) => handleUpdateBankAccount(occ.id, idx, 'bankName', val)}
                                                                                >
                                                                                    <SelectTrigger className="h-9 text-sm bg-gray-50/30">
                                                                                        <SelectValue placeholder="เลือกธนาคาร">
                                                                                            {account.bankName && (
                                                                                                <div className="flex items-center gap-2">
                                                                                                    <img
                                                                                                        src={THAI_BANKS.find(b => b.value === account.bankName)?.logo}
                                                                                                        alt={account.bankName}
                                                                                                        className="w-5 h-5 object-contain"
                                                                                                    />
                                                                                                    <span className="truncate">{THAI_BANKS.find(b => b.value === account.bankName)?.label}</span>
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
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <Input
                                                                                    value={account.accountNo}
                                                                                    onChange={(e) => handleUpdateBankAccount(occ.id, idx, 'accountNo', e.target.value)}
                                                                                    placeholder="000-0-00000-0"
                                                                                    className="h-9 text-sm bg-gray-50/30 font-mono tracking-wider"
                                                                                    maxLength={13} // 10 digits + 3 dashes
                                                                                />
                                                                            </TableCell>
                                                                            <TableCell className="text-right">
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 rounded-full"
                                                                                    onClick={() => setItemToDelete({
                                                                                        index: idx,
                                                                                        occId: occ.id,
                                                                                        name: account.bankName ? `บัญชี ${THAI_BANKS.find(b => b.value === account.bankName)?.label}` : 'บัญชีธนาคาร',
                                                                                        type: 'bankAccount'
                                                                                    })}
                                                                                >
                                                                                    <Trash2 className="w-4 h-4" />
                                                                                </Button>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))
                                                                )}
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Income Proof Documents Table */}
                                            <div className="space-y-3 pt-2">
                                                <Label className="text-sm font-bold text-gray-700">เอกสารรับรองรายได้ <span className="text-red-500">*</span></Label>

                                                <div className="border border-border-strong rounded-xl overflow-hidden bg-white">
                                                    <Table>
                                                        <TableHeader className="bg-gray-50/50">
                                                            <TableRow>
                                                                <TableHead className="w-[45%] text-xs">ประเภทเอกสาร</TableHead>
                                                                <TableHead className="w-[40%] text-xs">ไฟล์ที่อัพโหลด</TableHead>
                                                                <TableHead className="w-[15%] text-right text-xs">จัดการ</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {INCOME_DOC_TYPES.map((docType) => {
                                                                const uploadedDocs = (occ.incomeDocuments || []).filter((d: IncomeDocument) => d.type === docType.id);

                                                                return (
                                                                    <TableRow key={docType.id} className="hover:bg-transparent">
                                                                        <TableCell className="py-4">
                                                                            <div className="flex items-center gap-3">
                                                                                <div className={cn(
                                                                                    "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                                                                                    uploadedDocs.length > 0 ? "bg-green-50 text-emerald-600" : "bg-gray-100 text-gray-400"
                                                                                )}>
                                                                                    {uploadedDocs.length > 0 ? <CheckCircle2 className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                                                                </div>
                                                                                <span className="font-medium text-gray-700 text-sm whitespace-nowrap">{docType.label}</span>
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {uploadedDocs.length > 0 ? (
                                                                                <div className="space-y-1">
                                                                                    {uploadedDocs.map((doc: IncomeDocument) => (
                                                                                        <div key={doc.id} className="flex items-center gap-2 text-xs text-chaiyo-blue bg-blue-50/50 px-2 py-1 rounded-md border border-blue-100 w-fit max-w-[200px]">
                                                                                            <span className="truncate">{doc.name}</span>
                                                                                            <button
                                                                                                onClick={() => setItemToDelete({
                                                                                                    id: doc.id,
                                                                                                    occId: occ.id,
                                                                                                    name: doc.name,
                                                                                                    type: 'incomeDocument'
                                                                                                })}
                                                                                                className="text-gray-400 hover:text-red-500 ml-1"
                                                                                            >
                                                                                                <X className="w-3 h-3" />
                                                                                            </button>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            ) : (
                                                                                <span className="text-xs text-muted-foreground italic">ยังไม่มีไฟล์</span>
                                                                            )}
                                                                        </TableCell>
                                                                        <TableCell className="text-right">
                                                                            <Button
                                                                                type="button"
                                                                                variant="outline"
                                                                                size="sm"
                                                                                onClick={() => handleAddIncomeDocument(occ.id, docType.id, docType.label)}
                                                                                className="h-8 text-xs gap-1.5 font-medium"
                                                                            >
                                                                                <UploadCloud className="w-3.5 h-3.5" />
                                                                                อัพโหลด
                                                                            </Button>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                );
                                                            })}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                                <p className="text-[10px] text-muted-foreground italic">* รองรับไฟล์ PDF, JPG, PNG (ขนาดไม่เกิน 10MB)</p>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>
                            ))
                            }
                        </Tabs>

                        {/* Special Incomes component has been removed in favor of this tab system */}
                    </CardContent>
                </Card>

                {/* ===== SECTION 2: Debt (ภาระหนี้สิน) ===== */}
                <Card className="border-border-strong">
                    <CardHeader className="bg-blue-50/50 border-b border-border-strong pb-4">
                        <CardTitle className="text-lg flex items-center gap-2 text-chaiyo-blue">
                            <CreditCard className="w-5 h-5" />
                            ภาระหนี้สิน
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="md:col-span-2 space-y-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h5 className="font-bold text-gray-700 flex items-center gap-2">
                                        <span>ภาระหนี้ส่วนตัวรายเดือน (รวมที่อื่น)</span>
                                    </h5>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleAddDebtRow}
                                        className="h-8 text-[11px] font-medium"
                                    >
                                        <Plus className="w-3 h-3 mr-1" /> เพิ่มรายการหนี้
                                    </Button>
                                </div>

                                <div className="border border-border-strong rounded-xl overflow-hidden bg-white">
                                    <Table>
                                        <TableHeader className="bg-gray-50/50">
                                            <TableRow>
                                                <TableHead className="w-[10%] text-center text-xs">ลำดับ</TableHead>
                                                <TableHead className="w-[50%] text-xs">ประเภทสินเชื่อ</TableHead>
                                                <TableHead className="w-[30%] text-xs text-right pr-10">ค่างวด (บาท/เดือน)</TableHead>
                                                <TableHead className="w-[10%] text-center text-xs">จัดการ</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {(!formData.personalDebts || formData.personalDebts.length === 0) ? (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground italic text-xs">
                                                        ยังไม่มีรายการหนี้ส่วนตัวรายเดือน กรุณากดเพิ่มรายการ
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                formData.personalDebts.map((item: PersonalDebt, idx: number) => (
                                                    <TableRow key={idx} className="group transition-colors hover:bg-gray-50/50">
                                                        <TableCell className="py-3 text-center text-xs font-medium text-gray-500">
                                                            {idx + 1}
                                                        </TableCell>
                                                        <TableCell className="py-2">
                                                            <div className="space-y-1.5 transition-all duration-200">
                                                                <Select
                                                                    value={item.type || ""}
                                                                    onValueChange={(val) => handleUpdateDebtRow(idx, 'type', val)}
                                                                >
                                                                    <SelectTrigger className="h-9 text-sm bg-gray-50/30 border-gray-200 focus:ring-chaiyo-blue/20">
                                                                        <SelectValue placeholder="เลือกประเภทสินเชื่อ" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {DEBT_TYPES.map(type => (
                                                                            <SelectItem key={type.value} value={type.value} className="text-sm cursor-pointer">{type.label}</SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>

                                                                {item.type === 'other' && (
                                                                    <div className="relative animate-in fade-in slide-in-from-top-1 duration-200">
                                                                        <Input
                                                                            value={item.customType || ""}
                                                                            onChange={(e) => handleUpdateDebtRow(idx, 'customType', e.target.value)}
                                                                            placeholder="ระบุประเภทหนี้ (เช่น เงินกู้นอกระบบ)"
                                                                            className="h-8 text-xs bg-white border-dashed border-gray-300 focus:border-chaiyo-blue"
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="py-2 pr-4">
                                                            <Input
                                                                type="text"
                                                                value={formatNumberWithCommas(item.amount) || ""}
                                                                onChange={(e) => handleUpdateDebtRow(idx, 'amount', e.target.value)}
                                                                placeholder="0.00"
                                                                className="h-9 text-sm bg-gray-50/30 text-right font-mono border-gray-200 pr-6"
                                                            />
                                                        </TableCell>
                                                        <TableCell className="py-2 text-center">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 rounded-full"
                                                                onClick={() => setItemToDelete({
                                                                    index: idx,
                                                                    name: (DEBT_TYPES.find(d => d.value === item.type)?.label) || `รายการที่ ${idx + 1}`,
                                                                    type: 'debtRow'
                                                                })}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                        <TableFooter>
                                            <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 transition-none">
                                                <TableCell colSpan={2} className="text-right font-bold py-4 text-xs">
                                                    รวมภาระหนี้ส่วนตัวรายเดือน:
                                                </TableCell>
                                                <TableCell colSpan={2} className="text-right pr-10 py-4">
                                                    <div className="text-lg font-bold font-mono text-gray-900 pr-0.5">
                                                        ฿{formatNumberWithCommas(formData.totalPersonalDebt || 0)}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        </TableFooter>
                                    </Table>
                                </div>
                            </div>

                            {/* Chaiyo Debt Table */}
                            <div className="md:col-span-2 space-y-4 pt-4 mt-6 border-t border-border-color animate-in fade-in slide-in-from-top-4 duration-500">
                                <div className="flex items-center justify-between">
                                    <h5 className="font-bold text-gray-700 flex items-center gap-2">
                                        ภาระหนี้ที่ลูกค้ามีกับเงินไชโย
                                    </h5>

                                </div>

                                <div className="border border-border-strong rounded-xl overflow-hidden bg-white">
                                    <Table>
                                        <TableHeader className="bg-gray-50/50">
                                            <TableRow className="hover:bg-transparent border-none">
                                                <TableHead className="w-[10%] text-center text-xs">ลำดับ</TableHead>
                                                <TableHead className="w-[60%] text-xs">ประเภทสินเชื่อ (Loan Type)</TableHead>
                                                <TableHead className="w-[30%] text-right pr-10 text-xs">ค่างวด (บาท/เดือน)</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {!isExistingCustomer || (
                                                (formData.chaiyoLoans || []).length === 0 &&
                                                Number(formData.chaiyoLoanInstallment || 0) === 0 &&
                                                Number(formData.chaiyoInsuranceInstallment || 0) === 0
                                            ) ? (
                                                <TableRow className="hover:bg-transparent border-none">
                                                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground italic text-xs">
                                                        ไม่พบประวัติภาระหนี้เดิมกับเงินไชโย (ลูกค้ารายใหม่)
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                <>
                                                    {/* Specific Chaiyo Products */}
                                                    {(formData.chaiyoLoans || []).map((loan: ChaiyoLoan, lIdx: number) => (
                                                        <TableRow key={`chaiyo-${lIdx}`} className="hover:bg-gray-50/50 transition-colors border-border-subtle">
                                                            <TableCell className="text-center text-xs text-gray-400">{lIdx + 1}</TableCell>
                                                            <TableCell className="text-sm text-gray-700">{loan.type}</TableCell>
                                                            <TableCell className="text-right pr-10 font-mono text-sm text-gray-600">
                                                                {formatNumberWithCommas(loan.amount ?? 0) || "0.00"}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}

                                                    {/* Legacy Field Fallback */}
                                                    {Number(formData.chaiyoLoanInstallment || 0) > 0 && (
                                                        <TableRow className="hover:bg-gray-50/50 transition-colors border-border-subtle">
                                                            <TableCell className="text-center text-xs text-gray-400">
                                                                {(formData.chaiyoLoans || []).length + 1}
                                                            </TableCell>
                                                            <TableCell className="text-sm text-gray-700">สินเชื่อกับเงินไชโยอื่นๆ</TableCell>
                                                            <TableCell className="text-right pr-10 font-mono text-sm text-gray-600">
                                                                {formatNumberWithCommas(formData.chaiyoLoanInstallment ?? 0) || "0.00"}
                                                            </TableCell>
                                                        </TableRow>
                                                    )}

                                                    {/* Insurance Installment */}
                                                    {Number(formData.chaiyoInsuranceInstallment || 0) > 0 && (
                                                        <TableRow className="hover:bg-gray-50/50 transition-colors border-border-subtle">
                                                            <TableCell className="text-center text-xs text-gray-400">
                                                                {(formData.chaiyoLoans || []).length + (Number(formData.chaiyoLoanInstallment || 0) > 0 ? 2 : 1)}
                                                            </TableCell>
                                                            <TableCell className="text-sm text-sm text-gray-700">สินเชื่อประกันผ่อนกับเงินไชโย</TableCell>
                                                            <TableCell className="text-right pr-10 font-mono text-sm text-gray-600">
                                                                {formatNumberWithCommas(formData.chaiyoInsuranceInstallment ?? 0) || "0.00"}
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </>
                                            )}
                                        </TableBody>
                                        <TableFooter>
                                            <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 transition-none border-none">
                                                <TableCell colSpan={2} className="text-right font-bold py-4 text-xs">
                                                    รวมภาระหนี้เงินไชโยรวม:
                                                </TableCell>
                                                <TableCell className="text-right pr-10 py-4">
                                                    <div className="text-lg font-bold font-mono text-gray-900 pr-0.5">
                                                        ฿{formatNumberWithCommas(formData.totalChaiyoDebt || 0)}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        </TableFooter>
                                    </Table>
                                </div>

                            </div>
                        </div>

                        {/* Remarks */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2 pb-2 border-b border-gray-100">
                                <Briefcase className="w-4 h-4" /> หมายเหตุอื่นๆ
                            </h4>
                            <Textarea
                                value={formData.incomeRemarks || ""}
                                onChange={(e) => handleChange("incomeRemarks", e.target.value)}
                                placeholder="ระบุหมายเหตุเพิ่มเติม (ถ้ามี)"
                                className="min-h-[100px] resize-none"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* ===== SECTION 3: Reference Persons (บุคคลอ้างอิง) ===== */}
                <Card className="border-border-strong">
                    <CardHeader className="bg-blue-50/50 border-b border-border-strong pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-chaiyo-blue" />
                                <CardTitle className="text-lg text-chaiyo-blue">
                                    บุคคลอ้างอิง
                                    {!occupations.some((occ: IncomeOccupation) => (occ.incomeDocuments || []).length > 0) ? (
                                        <span className="text-red-500 ml-1.5 text-xs font-normal">(จำเป็น กรณีไม่มีเอกสารแสดงรายได้) *</span>
                                    ) : (
                                        <span className="text-muted-foreground ml-1.5 text-xs font-normal">(ถ้ามี)</span>
                                    )}
                                </CardTitle>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className=""
                                onClick={handleAddReference}
                            >
                                <Plus className="w-3 h-3 mr-1" /> เพิ่มบุคคลอ้างอิง
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="border border-border-strong rounded-xl overflow-hidden bg-white">
                            <Table>
                                <TableHeader className="bg-gray-50/50">
                                    <TableRow className="hover:bg-transparent border-none">
                                        <TableHead className="w-[8%] text-center text-xs">ลำดับ</TableHead>
                                        <TableHead className="w-[37%] text-xs">ชื่อ-นามสกุล</TableHead>
                                        <TableHead className="w-[35%] text-xs">ความเกี่ยวข้อง</TableHead>
                                        <TableHead className="w-[10%] text-xs text-center">จัดการ</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(!formData.referencePersons || formData.referencePersons.length === 0) ? (
                                        <TableRow className="hover:bg-transparent border-none">
                                            <TableCell colSpan={4} className="h-24 text-center text-muted-foreground italic text-xs">
                                                ยังไม่มีข้อมูลบุคคลอ้างอิง — กรุณากดปุ่มเพิ่มเพื่อระบุข้อมูล
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        formData.referencePersons.map((ref: ReferencePerson, index: number) => (
                                            <TableRow key={index} className="group transition-colors hover:bg-gray-50/50">
                                                <TableCell className="py-3 text-center text-xs font-medium text-gray-500">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell className="py-2">
                                                    <Input
                                                        value={ref.name || ""}
                                                        onChange={(e) => handleUpdateReference(index, "name", e.target.value)}
                                                        placeholder="ระบุชื่อ-นามสกุล"
                                                        className="h-9 text-sm bg-gray-50/30 border-gray-200 focus:ring-chaiyo-blue/20"
                                                    />
                                                </TableCell>
                                                <TableCell className="py-2">
                                                    <div className="space-y-1.5 transition-all duration-200">
                                                        <Select
                                                            value={ref.relationship || ""}
                                                            onValueChange={(val) => handleUpdateReference(index, "relationship", val)}
                                                        >
                                                            <SelectTrigger className="h-9 text-sm bg-gray-50/30 border-gray-200 focus:ring-chaiyo-blue/20">
                                                                <SelectValue placeholder="เลือกความเกี่ยวข้อง" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {REFERENCE_RELATIONSHIPS.map(rel => (
                                                                    <SelectItem key={rel.value} value={rel.value} className="text-sm cursor-pointer">{rel.label}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>

                                                        {ref.relationship === 'other' && (
                                                            <div className="relative animate-in fade-in slide-in-from-top-1 duration-200">
                                                                <Input
                                                                    value={ref.customRelationship || ""}
                                                                    onChange={(e) => handleUpdateReference(index, "customRelationship", e.target.value)}
                                                                    placeholder="โปรดระบุรายละเอียด"
                                                                    className="h-8 text-xs bg-white border-dashed border-gray-300 focus:border-chaiyo-blue"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-2 text-center text-gray-500">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 rounded-full"
                                                        onClick={() => setItemToDelete({
                                                            index,
                                                            name: ref.name || `บุคคลที่ ${index + 1}`,
                                                            type: 'reference'
                                                        })}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* ===== SECTION 4: Upload Photos (อัพโหลดรูปประกอบกิจการ) ===== */}
                <Card className="border-border-strong bg-white overflow-hidden">
                    <CardHeader className="bg-blue-50/50 border-b border-border-strong pb-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <ImagePlus className="w-6 h-6 text-chaiyo-blue" />
                                <CardTitle className="text-lg text-chaiyo-blue">

                                    อัพโหลดรูปประกอบกิจการ
                                </CardTitle>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                {/* Hidden Input */}
                                <input
                                    type="file"
                                    multiple
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const files = e.target.files;
                                        if (!files || files.length === 0) return;

                                        const newPhotos: string[] = [];
                                        for (let i = 0; i < files.length; i++) {
                                            const file = files[i];
                                            const url = URL.createObjectURL(file);
                                            newPhotos.push(url);
                                        }

                                        handleChange("incomePhotos", [...(formData.incomePhotos || []), ...newPhotos]);
                                        e.target.value = '';
                                    }}
                                    id="businessPhotoUpload"
                                />                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="gap-1.5 flex items-center bg-white text-gray-600 hover:text-gray-900"
                                        >
                                            <Info className="w-4 h-4" />
                                            ดูคำแนะนำการถ่ายรูป
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle className="flex items-center gap-2">
                                                <div className="p-1.5 bg-chaiyo-blue/10 rounded-lg text-chaiyo-blue">
                                                    <HelpCircle className="w-5 h-5" />
                                                </div>
                                                คำแนะนำการถ่ายรูปประกอบกิจการ
                                            </DialogTitle>
                                            <DialogDescription>
                                                กรุณาถ่ายรูปตามรายการต่อไปนี้เพื่อให้เจ้าหน้าที่ตรวจสอบข้อมูลได้อย่างถูกต้อง
                                            </DialogDescription>
                                        </DialogHeader>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                                            <div className="space-y-3">
                                                <h4 className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-2">
                                                    รูปที่จำเป็น (Mandatory)
                                                </h4>
                                                {PHOTO_GUIDES.filter(g => g.required).map((guide) => (
                                                    <div key={guide.id} className="p-3 rounded-xl border border-amber-100 bg-amber-50/30 space-y-2">
                                                        <div className="flex items-center gap-2 font-bold text-sm text-gray-800">
                                                            <guide.icon className="w-4 h-4 text-amber-600" />
                                                            {guide.title}
                                                        </div>
                                                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                                                            {guide.description}
                                                        </p>
                                                        {guide.demoUrl && (
                                                            <div className="w-full h-32 mt-2 rounded-lg overflow-hidden border border-amber-200 shadow-sm relative group bg-white">
                                                                <img src={guide.demoUrl} alt={guide.title} className="w-full h-full object-cover" />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="space-y-3">
                                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                    รูปเพิ่มเติม (Optional)
                                                </h4>
                                                {PHOTO_GUIDES.filter(g => !g.required).map((guide) => (
                                                    <div key={guide.id} className="p-3 rounded-xl border border-gray-100 bg-gray-50/30 space-y-2">
                                                        <div className="flex items-center gap-2 font-bold text-sm text-gray-800">
                                                            <guide.icon className="w-4 h-4 text-gray-600" />
                                                            {guide.title}
                                                        </div>
                                                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                                                            {guide.description}
                                                        </p>
                                                        {guide.demoUrl && (
                                                            <div className="w-full h-32 mt-2 rounded-lg overflow-hidden border border-gray-200 shadow-sm relative group bg-white">
                                                                <img src={guide.demoUrl} alt={guide.title} className="w-full h-full object-cover" />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>


                    </CardHeader>

                    <CardContent className="p-6">
                        <div className="flex flex-wrap gap-4">
                            {(formData.incomePhotos || []).map((url: string, idx: number) => (
                                <div key={idx} className="relative w-28 h-28 rounded-xl overflow-hidden border border-border-strong group bg-white shadow-sm">
                                    <img src={url} alt={`business-img-${idx}`} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            className="absolute inset-0 flex flex-col items-center justify-center text-white gap-1 z-10"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setLightboxIndex(idx);
                                            }}
                                        >
                                            <Eye className="w-6 h-6 hover:text-blue-200 transition-colors" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemovePhoto(idx);
                                            }}
                                            className="absolute top-1.5 right-1.5 text-white hover:text-red-300 transition-colors bg-black/20 hover:bg-black/40 rounded-full p-1.5 border border-white/20 backdrop-blur-sm shadow-sm z-20"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <div
                                className={cn(
                                    "h-28 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 gap-1 bg-gray-50/50 cursor-pointer hover:bg-blue-50/50 hover:border-chaiyo-blue hover:text-chaiyo-blue transition-all shrink-0",
                                    (!formData.incomePhotos || formData.incomePhotos.length === 0) ? "w-full" : "w-28"
                                )}
                                onClick={() => document.getElementById('businessPhotoUpload')?.click()}
                            >
                                <ImagePlus className="w-5 h-5 opacity-70" />
                                <span className={cn("font-medium", (!formData.incomePhotos || formData.incomePhotos.length === 0) ? "text-sm" : "text-[11px] text-center leading-tight")}>
                                    {!formData.incomePhotos || formData.incomePhotos.length === 0 ? "อัปโหลดรูปภาพประกอบ" : <>อัปโหลด<br />รูปภาพ</>}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            {/* Right side breakdown */}
            <div className="w-full xl:w-[350px] shrink-0 sticky top-6 space-y-4">
                <Card className="border-border-subtle overflow-hidden">
                    <CardHeader className="bg-gray-50 border-b border-gray-100 pb-4">
                        <CardTitle className="text-base flex items-center gap-2 text-gray-800">
                            <PieChart className="w-5 h-5 text-chaiyo-blue" />
                            สรุปรายได้และภาระหนี้
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="p-4 space-y-4">
                            {/* Income Breakdown */}
                            <div className="space-y-2">
                                <h4 className="text-sm font-bold text-emerald-700 flex items-center gap-2">
                                    รายได้รับ   <TrendingUp className="w-4 h-4" />
                                </h4>
                                <div className="space-y-1.5 text-sm">
                                    <div className="flex justify-between text-gray-600">
                                        <span>รายได้อาชีพหลัก</span>
                                        <span className="font-mono">{formatNumberWithCommas(formData.mainOccupationIncome || 0)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>รายได้อาชีพเสริม</span>
                                        <span className="font-mono">{formatNumberWithCommas(formData.secondaryOccupationIncome || 0)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>รายได้พิเศษ</span>
                                        <span className="font-mono">{formatNumberWithCommas(formData.specialIncome || 0)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>รายได้อื่นๆ</span>
                                        <span className="font-mono">{formatNumberWithCommas(formData.otherIncome || 0)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-gray-800 pt-1 border-t border-gray-100">
                                        <span>รวมรายได้</span>
                                        <span className="font-mono text-emerald-600">฿{formatNumberWithCommas(formData.totalIncome || 0)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Debt Breakdown */}
                            <div className="space-y-2 pt-3">
                                <h4 className="text-sm font-bold text-orange-700 flex items-center gap-2">
                                    ภาระหนี้ <TrendingDown className="w-4 h-4" />
                                </h4>
                                <div className="space-y-1.5 text-sm">
                                    <div className="flex justify-between text-gray-600">
                                        <span>หนี้ส่วนตัวรวม</span>
                                        <span className="font-mono">{formatNumberWithCommas(formData.totalPersonalDebt || 0)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>หนี้เงินไชโยรวม</span>
                                        <span className="font-mono">{formatNumberWithCommas(formData.totalChaiyoDebt || 0)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-gray-800 pt-1 border-t border-gray-100">
                                        <span>รวมภาระหนี้</span>
                                        <span className="font-mono text-orange-600">฿{formatNumberWithCommas(formData.totalDebt || 0)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Net Income Remaining */}
                        <div className="bg-blue-50/50 p-4 border-t border-blue-100 space-y-1">
                            <Label className="text-chaiyo-blue text-sm block">รายได้คงเหลือรายเดือน (Capacity)</Label>
                            <div className={Number(formData.totalIncome || 0) - Number(formData.totalDebt || 0) < 0 ? "text-2xl font-black text-red-600 font-mono" : "text-2xl font-black text-blue-700 font-mono"}>
                                ฿{formatNumberWithCommas((Number(formData.totalIncome || 0) - Number(formData.totalDebt || 0)))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div >

            <SpecialIncomeDialog
                open={isSpecialIncomeDialogOpen}
                onOpenChange={setIsSpecialIncomeDialogOpen}
                onSave={handleSaveSpecialIncome}
                initialData={editingSpecialIncome}
            />

            <AlertDialog open={itemToDelete !== null} onOpenChange={(open) => !open && setItemToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>ยืนยันการลบข้อมูล</AlertDialogTitle>
                        <AlertDialogDescription>
                            คุณต้องการลบข้อมูล &quot;{itemToDelete?.name}&quot; ใช่หรือไม่?
                            การดำเนินการนี้ไม่สามารถย้อนกลับได้
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-status-rejected hover:bg-status-rejected/90"
                        >
                            ยืนยันการลบ
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Photo Lightbox */}
            {
                lightboxIndex !== null && formData.incomePhotos && (
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
                        {formData.incomePhotos?.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setLightboxIndex(prev => prev !== null && formData.incomePhotos ? (prev - 1 + formData.incomePhotos.length) % formData.incomePhotos.length : 0);
                                    }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10"><path d="m15 18-6-6 6-6" /></svg>
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setLightboxIndex(prev => prev !== null && formData.incomePhotos ? (prev + 1) % formData.incomePhotos.length : 0);
                                    }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10"><path d="m9 18 6-6-6-6" /></svg>
                                </button>
                            </>
                        )}

                        {/* Main Image */}
                        <img
                            src={formData.incomePhotos?.[lightboxIndex]}
                            alt={`Business Photo ${lightboxIndex + 1}`}
                            className="max-h-[80vh] max-w-full object-contain rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                        />

                        {/* Thumbnail Strip */}
                        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto pb-2" onClick={(e) => e.stopPropagation()}>
                            {formData.incomePhotos?.map((doc: string, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => setLightboxIndex(idx)}
                                    className={cn(
                                        "w-16 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0",
                                        idx === lightboxIndex ? "border-white scale-110 ring-2 ring-white/20" : "border-transparent opacity-50 hover:opacity-100"
                                    )}
                                >
                                    <img src={doc} alt={`Business Photo Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>

                        <div className="absolute top-4 left-4 text-white/80 font-medium bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">
                            {lightboxIndex + 1} / {formData.incomePhotos?.length}
                        </div>
                    </div>
                )
            }
        </div >
    );
}
