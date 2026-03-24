import { useState, useEffect, useRef } from "react";
import { Briefcase, Plus, Trash2, Home, CreditCard, Building, PieChart, TrendingUp, TrendingDown, Pencil, Users, ImagePlus, X, Eye, Link, FileText, UploadCloud, CheckCircle2, Info, HelpCircle, Globe, ClipboardCheck, Phone, Calendar, MapPin, MessageSquare } from "lucide-react";
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
import { DatePickerBE } from "@/components/ui/DatePickerBE";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/Dialog";
import { AddressForm } from "@/components/application/AddressForm";
import { CustomerFormData, IncomeOccupation, SpecialIncome, IncomeItem, EnterpriseIncome, IncomeDocument, PersonalDebt, ChaiyoLoan, SAIncome, ReferencePerson, BankAccount } from "@/types/application";

interface DebtStepProps {
    formData: CustomerFormData;
    setFormData: React.Dispatch<React.SetStateAction<CustomerFormData>>;
    isExistingCustomer?: boolean;
    isGuarantor?: boolean;
}

const OCCUPATIONS = [
    { label: "ผู้ประกอบการอาชีพที่เกี่ยวกับการแพทย์", types: ["SA", "SE"] },
    { label: "แพทย์", types: ["SA", "SE"] },
    { label: "ทันตแพทย์", types: ["SA", "SE"] },
    { label: "สัตวแพทย์", types: ["SA", "SE"] },
    { label: "เภสัชกร", types: ["SA", "SE"] },
    { label: "พยาบาล", types: ["SA", "SE"] },
    { label: "เทคนิคการแพทย์", types: ["SA", "SE"] },
    { label: "ผู้ประกอบอาชีพเป็นพนักงานหรือลูกจ้างประจำของหน่วยงานของรัฐ", types: ["SA"] },
    { label: "นักการเมือง", types: ["SA", "SE"] },
    { label: "ข้าราชการพลเรือน", types: ["SA"] },
    { label: "ข้าราชการตำรวจ", types: ["SA"] },
    { label: "ข้าราชการทหาร", types: ["SA"] },
    { label: "ข้าราชการตุลาการ(ผู้พิพากษา)", types: ["SA"] },
    { label: "อัยการ", types: ["SA"] },
    { label: "พนักงานรัฐวิสาหกิจ", types: ["SA"] },
    { label: "ข้าราการบำนาญ", types: ["SA"] },
    { label: "ผู้ประกอบอาชีพเป็นพนักงาน หรือลูกจ้าง ของบริษัท, ห้างร้าน, สำนักงานต่าง ๆ", types: ["SA", "SE"] },
    { label: "พนักงานหรือลูกจ้างบริษัท ออโต้ เอกซ์ จำกัด", types: ["SA"] },
    { label: "พนักงานหรือลูกจ้างสถาบันการเงิน", types: ["SA"] },
    { label: "พนักงานหรือลูกจ้างกิจการพาณิชยกรรม", types: ["SA"] },
    { label: "พนักงานหรือลูกจ้างกิจการอุตสาหกรรม", types: ["SA"] },
    { label: "พนักงานหรือลูกจ้างธุรกิจบริการ", types: ["SA"] },
    { label: "พนักงานหรือลูกจ้างอุตสาหกรรมการเกษตร", types: ["SA"] },
    { label: "ผู้ประกอบอาชีพอิสระอื่น ๆ", types: ["SA", "SE"] },
    { label: "นักบัญชี (ที่ได้รับประกาศนียบัตร อนุปริญญา หรือปริญญา)", types: ["SA", "SE"] },
    { label: "นักกฎหมายและผู้ใช้วิชาชีพทางกฎหมาย", types: ["SA", "SE"] },
    { label: "วิศวกร", types: ["SA", "SE"] },
    { label: "สถาปนิก", types: ["SA", "SE"] },
    { label: "ช่างเทคนิค", types: ["SA", "SE"] },
    { label: "มัณฑณากร, จิตรกร, ช่างภาพและช่างศิลป์อื่น ๆ", types: ["SA", "SE"] },
    { label: "ค้าวัตถุโบราณ", types: ["SE"] },
    { label: "ค้าทอง, ค้าอัญมณี", types: ["SE"] },
    { label: "เป็นผู้ประกอบการ /เจ้าของ/ กรรมการ/ หุ้นส่วน", types: ["SA", "SE"] },
    { label: "ผู้ประกอบการกิจการพาณิชยกรรม", types: ["SA", "SE"] },
    { label: "ผู้ประกอบการกิจการอุตสาหกรรม", types: ["SA", "SE"] },
    { label: "ผู้ประกอบการกิจการธุรกิจบริการ", types: ["SA", "SE"] },
    { label: "ผู้ประกอบการกิจการเกษตรกรรม หรืออุตสาหกรรมการเกษตร", types: ["SA", "SE"] },
    { label: "ผู้ประกอบการสถาบันการเงิน", types: ["SA", "SE"] },
    { label: "ผู้ประกอบธุรกิจแลกเปลี่ยนเงินตราต่างประเทศ", types: ["SA", "SE"] },
    { label: "ผู้ประกอบการธุรกิจโอนเงินออกนอกประเทศ", types: ["SA", "SE"] },
    { label: "ผู้ประกอบการโรงงานผลิตอาวุธยุทโธปกรณ์", types: ["SA", "SE"] },
    { label: "ผู้ประกอบอาชีพเป็นพนักงานหรือลูกจ้าง/ กลุ่มบุคคลในสถาบันที่ไม่แสวงหาผลกำไร", types: ["SA", "SE"] },
    { label: "พนักงานหรือลูกจ้าง องค์การระหว่างประเทศหรือสถานฑูต", types: ["SA"] },
    { label: "พนักงานหรือลูกจ้างสหกรณ์", types: ["SA"] },
    { label: "พนักงานหรือลูกจ้างสมาคม", types: ["SA"] },
    { label: "พนักงานหรือลูกจ้างมูลนิธิ", types: ["SA"] },
    { label: "พนักงานหรือลูกจ้างสโมสร", types: ["SA"] },
    { label: "พนักงานหรือลูกจ้างชมรม", types: ["SA"] },
    { label: "พนักงานหรือลูกจ้างองค์การระหว่างประเทศ", types: ["SA"] },
    { label: "ผู้ประกอบอาชีพการศึกษา", types: ["SA", "SE"] },
    { label: "อาจารย์และผู้ปฎิบัติงานด้านบริหารและงานด้านปกครองของมหาวิทยาลัยและสถาบันที่เทียบเท่า", types: ["SA", "SE"] },
    { label: "อาจารย์ ครูและผู้ปฏิบัติงานด้านบริหารและงานด้านปกครองในโรงเรียนอนุบาล,ชั้นประถม,มัธยม และอาชีวศึกษา", types: ["SA", "SE"] },
    { label: "ผู้ประกอบอาชีพในวงการบันเทิงและสื่อมวลชน และผู้ประกอบอาชีพเกี่ยวกับการเขียน", types: ["SA", "SE"] },
    { label: "บุคคลในวงการสื่อสารมวลชนและผู้ประกอบอาชีพเกี่ยวกับการเขียน", types: ["SA", "SE"] },
    { label: "บุคคลในวงการศิลปะ และบันเทิง", types: ["SA", "SE"] },
    { label: "บุคคลในวงการกีฬา", types: ["SA", "SE"] },
    { label: "นายหน้าค้าอาวุธยุทโธปกรณ์", types: ["SA", "SE"] },
    { label: "ธุรกิจคาสิโนและการพนัน", types: ["SA", "SE"] },
    { label: "ธุรกิจเงินกู้นอกระบบ", types: ["SA", "SE"] },
    { label: "ธุรกิจนำเที่ยว บริษัททัวร์", types: ["SA", "SE"] },
    { label: "สถานบริการ", types: ["SA", "SE"] },
    { label: "บริษัทหรือนายหน้าจัดหางาน", types: ["SA", "SE"] },
    { label: "คหบดี", types: ["SA", "SE"] },
    { label: "แม่บ้าน", types: ["SA", "SE"] },
    { label: "รับจ้างทั่วไป", types: ["SE"] },
    { label: "ไม่ได้ทำงาน", value: "UNEMPLOYED", types: ["UNEMPLOYED"] },
    { label: "ผู้ปฏิบัติงานที่จำแนกเข้าอาชีพใดไม่ได้ หรือไม่ทราบประเภทอาชีพ", types: ["SA", "SE"] },
    { label: "เกษตรกร", value: "FARMER", types: ["SA", "SE"] },
    { label: "เลี้ยงสัตว์", value: "LIVESTOCK", types: ["SA", "SE"] },
    { label: "จักรยานยนต์รับจ้าง", types: ["SE"] },
    { label: "ค้าขาย / แผงลอย / ออนไลน์", types: ["SE"] },
    { label: "พนักงานส่งเอกสาร / อาหาร", types: ["SA", "SE"] },
    { label: "คนขับแท็กซี่", types: ["SE"] },
];

const DEFAULT_DEBT_TYPES = [
    "เงินกู้สหกรณ์",
    "เงินกู้นอกระบบ",
];

const ADDITIONAL_DEBT_TYPES = [
    "สินเชื่อส่วนบุคคล",
    "บัตรเครดิต",
    "สินเชื่อบ้าน",
    "สินเชื่อรถยนต์",
    "สินเชื่อธุรกิจ",
    "สินเชื่ออื่น ๆ",
    "โปรดระบุ",
];

const DEBT_TYPES_MAPPING = [
    ...DEFAULT_DEBT_TYPES.map(label => ({ value: label, label, isDefault: true })),
    ...ADDITIONAL_DEBT_TYPES.map(label => ({ value: label, label, isDefault: false })),
];

const GUARANTOR_DEBT_TYPES = [
    "ผ่อนบ้าน/ค่าเช่าบ้าน",
    "ผ่อนรถ",
    "ผ่อนบัตรเครดิต/บัตรกดเงินสด",
    "ผ่อนสินเชื่ออื่นๆ (ไม่รวมสินเชื่อเงินไชโย)",
    "ผ่อนเงินกู้สหกรณ์",
    "ผ่อนเงินกู้นอกระบบ",
];

// Mock staff list — replace with API data in production
const MOCK_STAFF_LIST = [
    { id: "S001", code: "S001", name: "สมชาย ใจดี", phone: "081-234-5678" },
    { id: "S002", code: "S002", name: "สุดา รักงาน", phone: "089-876-5432" },
    { id: "S003", code: "S003", name: "วิชัย มุ่งดี", phone: "090-111-2233" },
    { id: "S004", code: "S004", name: "มานี ตั้งใจ", phone: "086-444-5566" },
    { id: "S005", code: "S005", name: "ปรียา สุขสม", phone: "092-777-8899" },
];

export function DebtStep({ formData, setFormData, isExistingCustomer = false, isGuarantor = false }: DebtStepProps) {
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
        photoIndex?: number,
        type: 'special' | 'reference' | 'photo' | 'bankAccount' | 'incomeDocument' | 'saIncomeRow' | 'seIncomeRow' | 'seCostRow' | 'debtRow' | 'categorizedPhoto' | 'occupation'
    } | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const photoInputRef = useRef<HTMLInputElement>(null);
    const [currentDocContext, setCurrentDocContext] = useState<{ occId: string, docType: string, label: string } | null>(null);
    const [currentPhotoCategory, setCurrentPhotoCategory] = useState<string | null>(null);


    // Debt Row Handlers
    const handleAddDebtRow = () => {
        const debts = formData.personalDebts || [];
        const newDebt: PersonalDebt = {
            id: generateId('debt'),
            type: "", // User will select from ADDITIONAL_DEBT_TYPES
            description: "",
            amount: 0,
            installment: 0,
            isDefault: false
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
        } else if (itemToDelete.type === 'categorizedPhoto' && itemToDelete.categoryId) {
            handleRemoveCategorizedPhoto(itemToDelete.categoryId, itemToDelete.photoIndex);
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
        } else if (itemToDelete.type === 'occupation' && itemToDelete.id) {
            handleRemoveOccupation(itemToDelete.id);
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
                if (o.occupationCode === 'LIVESTOCK') {
                    const totalNet = (o.livestockCycles || []).reduce((sum, c) => sum + (Number(c.netIncome) || 0), 0);
                    return acc + roundDown2(totalNet / 12);
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
                if (o.occupationCode === 'LIVESTOCK') {
                    const totalNet = (o.livestockCycles || []).reduce((sum, c) => sum + (Number(c.netIncome) || 0), 0);
                    return acc + roundDown2(totalNet / 12);
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

    // Ensure default personal debts exist
    useEffect(() => {
        const currentDebts = formData.personalDebts || [];
        const hasDefaults = currentDebts.some(d => d.isDefault);

        if (currentDebts.length === 0 || !hasDefaults) {
            const sourceTypes = isGuarantor ? GUARANTOR_DEBT_TYPES : DEFAULT_DEBT_TYPES;
            const defaultRows = sourceTypes.map((label, idx) => ({
                id: `debt-default-${idx}`,
                type: label,
                description: "",
                amount: 0,
                installment: 0,
                isDefault: true
            }));

            // If there were already some debts (but no defaults), keep them but put defaults first
            const nonDefaults = isGuarantor ? [] : currentDebts.filter(d => !d.isDefault);
            const combined = [...defaultRows, ...nonDefaults];
            handleChange("personalDebts", combined);
        }
    }, []);


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
        const newOccupations = occupations
            .filter((o: IncomeOccupation) => o.id !== id)
            .map((o: IncomeOccupation) =>
                o.isSameAsMainAddress === id ? { ...o, isSameAsMainAddress: "" } : o
            );
        handleChange("occupations", newOccupations);
        if (activeTab === id) {
            setActiveTab("main");
        }
    };

    // Photo Upload (Categorized)
    const handleTriggerPhotoUpload = (categoryId: string) => {
        setCurrentPhotoCategory(categoryId);
        if (photoInputRef.current) {
            photoInputRef.current.click();
        }
    };

    const handlePhotoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0 || !currentPhotoCategory) return;

        const currentPhotos = formData.incomePhotos || {};
        const existing = currentPhotos[currentPhotoCategory] || [];
        const newUrls = Array.from(files).map(file => URL.createObjectURL(file));
        handleChange("incomePhotos", {
            ...currentPhotos,
            [currentPhotoCategory]: [...existing, ...newUrls]
        });

        // Reset
        if (photoInputRef.current) photoInputRef.current.value = '';
        setCurrentPhotoCategory(null);
    };

    const handleRemoveCategorizedPhoto = (categoryId: string, photoIndex?: number) => {
        const currentPhotos = { ...(formData.incomePhotos || {}) };
        if (photoIndex !== undefined) {
            const arr = [...(currentPhotos[categoryId] || [])];
            arr.splice(photoIndex, 1);
            if (arr.length === 0) {
                delete currentPhotos[categoryId];
            } else {
                currentPhotos[categoryId] = arr;
            }
        } else {
            delete currentPhotos[categoryId];
        }
        handleChange("incomePhotos", currentPhotos);
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
        "เตรียมดินก่อนเพาะปลูก",
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

    const LIVESTOCK_STANDARD_PRICES: Record<string, { sales: number, cost: number }> = {
        "pig": { sales: 8000, cost: 5000 },
        "chicken": { sales: 150, cost: 90 },
        "cow": { sales: 35000, cost: 20000 },
        "duck": { sales: 120, cost: 70 },
        "fish": { sales: 80, cost: 45 },
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
                                        <span>{isGuarantor ? "ภาระหนี้อื่นๆ (ไม่รวมเงินไชโย)" : "ภาระหนี้นอกระบบ"}</span>
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
                                                <TableHead className="w-[50%] text-xs">ประเภทสินเชื่อ <span className="text-red-500">*</span></TableHead>
                                                <TableHead className="w-[30%] text-xs text-right pr-10">ค่างวด (บาท/เดือน) <span className="text-red-500">*</span></TableHead>
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
                                                    <TableRow key={idx} className={cn("group transition-colors hover:bg-gray-50/50", item.isDefault && "bg-gray-50/10")}>
                                                        <TableCell className="py-3 text-center text-xs font-medium text-gray-500">
                                                            {idx + 1}
                                                        </TableCell>
                                                        <TableCell className="py-2">
                                                            <div className="space-y-1.5 transition-all duration-200">
                                                                {item.isDefault ? (
                                                                    <div className="h-9 flex items-center px-3 text-sm text-gray-700 bg-gray-50/50 border border-transparent rounded-lg font-medium">
                                                                        {item.type}
                                                                    </div>
                                                                ) : (
                                                                    <Input
                                                                        value={item.type || ""}
                                                                        onChange={(e) => handleUpdateDebtRow(idx, 'type', e.target.value)}
                                                                        placeholder="ระบุประเภทหนี้"
                                                                        className="h-9 text-sm bg-gray-50/30 border-gray-200 focus:ring-chaiyo-blue/20"
                                                                    />
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
                                                            {!item.isDefault && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 rounded-full"
                                                                    onClick={() => setItemToDelete({
                                                                        index: idx,
                                                                        name: (DEBT_TYPES_MAPPING.find(d => d.value === item.type)?.label) || `รายการที่ ${idx + 1}`,
                                                                        type: 'debtRow'
                                                                    })}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            )}
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
                                                        {formatNumberWithCommas(formData.totalPersonalDebt || 0)}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        </TableFooter>
                                    </Table>
                                </div>
                            </div>

                            {/* Chaiyo Debt Monthly Table */}
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
                                                <TableHead className="w-[50%] text-xs">รายละเอียด</TableHead>
                                                <TableHead className="w-[40%] text-right pr-10 text-xs">ค่างวด (บาท/เดือน)</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow className="hover:bg-gray-50/50 transition-colors border-border-subtle">
                                                <TableCell className="text-center text-xs text-gray-400">1</TableCell>
                                                <TableCell className="text-sm text-gray-700">ค่างวดสินเชื่อ</TableCell>
                                                <TableCell className="text-right pr-10 font-mono text-sm text-gray-600">
                                                    {formatNumberWithCommas(formData.chaiyoLoanInstallment || 0)}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow className="hover:bg-gray-50/50 transition-colors border-border-subtle">
                                                <TableCell className="text-center text-xs text-gray-400">2</TableCell>
                                                <TableCell className="text-sm text-gray-700">ค่างวดประกัน</TableCell>
                                                <TableCell className="text-right pr-10 font-mono text-sm text-gray-600">
                                                    {formatNumberWithCommas(formData.chaiyoInsuranceInstallment || 0)}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow className="bg-gray-100/80 transition-none">
                                                <TableCell colSpan={2} className="text-right font-bold py-4 text-xs">ภาระหนี้ที่ลูกค้ามีกับเงินไชโยรวมรายเดือน:</TableCell>
                                                <TableCell className="text-right pr-10 py-4">
                                                    <div className="text-lg font-bold font-mono text-gray-900 pr-0.5">
                                                        {formatNumberWithCommas(formData.totalChaiyoDebt || 0)}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                            {/* Chaiyo Loan Limit Table */}
                            <div className="md:col-span-2 space-y-4 pt-4 mt-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                <div className="flex items-center justify-between">
                                    <h5 className="font-bold text-gray-700 flex items-center gap-2">
                                        สินเชื่อที่มีทั้งหมดกับเงินไชโย
                                    </h5>
                                </div>

                                <div className="border border-border-strong rounded-xl overflow-hidden bg-white">
                                    <Table>
                                        <TableHeader className="bg-gray-50/50">
                                            <TableRow className="hover:bg-transparent border-none">
                                                <TableHead className="w-[10%] text-center text-xs">ลำดับ</TableHead>
                                                <TableHead className="w-[60%] text-xs">ประเภทสินเชื่อ</TableHead>
                                                <TableHead className="w-[30%] text-right pr-10 text-xs">วงเงินรวม (บาท)</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {[
                                                { label: "สินเชื่อรถจักรยานยนต์", value: formData.chaiyoMotorcycleLimit },
                                                { label: "สินเชื่อรถยนต์", value: formData.chaiyoCarLimit },
                                                { label: "สินเชื่อรถบรรทุก", value: formData.chaiyoTruckLimit },
                                                { label: "สินเชื่อรถเพื่อการเกษตร", value: formData.chaiyoAgriLimit },
                                                { label: "สินเชื่อจำนำที่ดิน", value: formData.chaiyoLandPledgeLimit },
                                                { label: "สินเชื่อจำนองที่ดิน", value: formData.chaiyoLandMortgageLimit },
                                                { label: "สินเชื่ออื่นๆ", value: formData.chaiyoOtherLimit },
                                            ].map((row, idx) => (
                                                <TableRow
                                                    key={idx}
                                                    className="hover:bg-gray-50/50 transition-colors border-border-subtle"
                                                >
                                                    <TableCell className="text-center text-xs text-gray-400">{idx + 1}</TableCell>
                                                    <TableCell className="text-sm text-gray-700">
                                                        {row.label}
                                                    </TableCell>
                                                    <TableCell className="text-right pr-10 font-mono text-sm text-gray-600">
                                                        {formatNumberWithCommas(row.value || 0)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                        <TableFooter>
                                            <TableRow className="bg-gray-100/80 hover:bg-gray-100/80 transition-none">
                                                <TableCell colSpan={2} className="text-right font-bold py-4 text-xs">
                                                    ยอดรวมวงเงินทุกสินเชื่อของเงินไชโย:
                                                </TableCell>
                                                <TableCell className="text-right pr-10 py-4">
                                                    <div className="text-lg font-bold font-mono text-gray-900 pr-0.5">
                                                        {formatNumberWithCommas(formData.chaiyoTotalLimit || 0)}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        </TableFooter>
                                    </Table>
                                </div>
                            </div>
                        </div>


                    </CardContent>
                </Card>



            </div>

            {/* Right side breakdown */}
            <div className="w-full xl:w-[350px] shrink-0 sticky top-6 space-y-4">
                <Card className="border-border-strong overflow-hidden">
                    <CardHeader className="bg-blue-50/50 border-b border-border-strong pb-4">
                        <CardTitle className="text-base flex items-center gap-2 text-chaiyo-blue">
                            <PieChart className="w-5 h-5 text-chaiyo-blue" />
                            สรุปรายได้และภาระหนี้
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="p-4 space-y-4">
                            {/* Income Breakdown */}
                            <div className="space-y-2">
                                <h4 className="text-sm font-bold text-emerald-700 flex items-center gap-2">
                                    รายได้   <TrendingUp className="w-4 h-4" />
                                </h4>
                                <div className="space-y-1.5 text-sm">
                                    <div className="flex justify-between text-gray-600">
                                        <span>รายได้อาชีพหลัก</span>
                                        <span className="font-mono">{formatNumberWithCommas(roundDown2(Number(formData.mainOccupationIncome || 0)).toFixed(2))}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>รายได้อาชีพเสริม</span>
                                        <span className="font-mono">{formatNumberWithCommas(roundDown2(Number(formData.secondaryOccupationIncome || 0)).toFixed(2))}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-gray-800 pt-1 border-t border-gray-100">
                                        <span>รวมรายได้</span>
                                        <span className="font-mono text-emerald-600">{formatNumberWithCommas(roundDown2(Number(formData.totalIncome || 0)).toFixed(2))}</span>
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
                                        <span>{isGuarantor ? "ภาระหนี้ที่ลูกค้ามีกับเงินไชโย" : "ภาระหนี้ในระบบ (รวมภาระหนี้จาก NCB)"}</span>
                                        <span className="font-mono">{formatNumberWithCommas(roundDown2(Number(formData.totalChaiyoDebt || 0)).toFixed(2))}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>{isGuarantor ? "ภาระหนี้อื่นๆ (ไม่รวมเงินไชโย)" : "ภาระหนี้นอกระบบ"}</span>
                                        <span className="font-mono">{formatNumberWithCommas(roundDown2(Number(formData.totalPersonalDebt || 0)).toFixed(2))}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-gray-800 pt-1 border-t border-gray-100">
                                        <span>รวมภาระหนี้</span>
                                        <span className="font-mono text-orange-600">{formatNumberWithCommas(roundDown2(Number(formData.totalDebt || 0)).toFixed(2))}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Net Income Remaining */}
                        <div className="bg-blue-50/50 p-4 border-t border-blue-100 space-y-1 text-right">
                            <Label className="text-chaiyo-blue text-sm block">รายได้คงเหลือรายเดือน</Label>
                            <div className={Number(formData.totalIncome || 0) - Number(formData.totalDebt || 0) < 0 ? "text-2xl font-black text-red-600 font-mono" : "text-2xl font-black text-blue-700 font-mono"}>
                                {formatNumberWithCommas(roundDown2(Number(formData.totalIncome || 0) - Number(formData.totalDebt || 0)).toFixed(2))}
                            </div>
                        </div>


                    </CardContent>
                </Card>
            </div>

            <SpecialIncomeDialog
                open={isSpecialIncomeDialogOpen}
                onOpenChange={setIsSpecialIncomeDialogOpen}
                onSave={handleSaveSpecialIncome}
                initialData={editingSpecialIncome}
            />

            {/* Hidden file input for photo uploads - must be at root level, not inside TabsContent */}
            <input
                type="file"
                ref={photoInputRef}
                className="hidden"
                accept="image/*"
                multiple
                onChange={handlePhotoFileSelect}
            />

            <AlertDialog open={itemToDelete !== null} onOpenChange={(open) => !open && setItemToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {itemToDelete?.type === 'occupation' ? 'ลบอาชีพเสริม?' : 'ยืนยันการลบข้อมูล'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {itemToDelete?.type === 'occupation' ? (
                                <>
                                    คุณต้องการลบ <span className="font-medium text-gray-700">&quot;{itemToDelete?.name}&quot;</span> ใช่หรือไม่?{' '}
                                    ข้อมูลรายได้และรายละเอียดทั้งหมดของอาชีพนี้จะถูกลบอย่างถาวร
                                </>
                            ) : (
                                <>
                                    คุณต้องการลบข้อมูล &quot;{itemToDelete?.name}&quot; ใช่หรือไม่?
                                    การดำเนินการนี้ไม่สามารถย้อนกลับได้
                                </>
                            )}
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
            {(() => {
                const allPhotos: string[] = Object.values(formData.incomePhotos || {}).flat() as string[];
                return lightboxIndex !== null && allPhotos.length > 0 && (
                    <div
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 md:p-8 animate-in fade-in duration-200"
                        onClick={() => setLightboxIndex(null)}
                    >
                        <button
                            onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
                            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all border border-white/20"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        {/* Navigation */}
                        {allPhotos.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setLightboxIndex(prev => prev !== null ? (prev - 1 + allPhotos.length) % allPhotos.length : 0);
                                    }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10"><path d="m15 18-6-6 6-6" /></svg>
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setLightboxIndex(prev => prev !== null ? (prev + 1) % allPhotos.length : 0);
                                    }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10"><path d="m9 18 6-6-6-6" /></svg>
                                </button>
                            </>
                        )}

                        {/* Main Image */}
                        <img
                            src={allPhotos[lightboxIndex ?? 0]}
                            alt={`Business Photo ${(lightboxIndex ?? 0) + 1}`}
                            className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-200"
                            onClick={(e) => e.stopPropagation()}
                        />

                        {/* Thumbnail Strip */}
                        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto pb-2" onClick={(e) => e.stopPropagation()}>
                            {allPhotos.map((url, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setLightboxIndex(idx)}
                                    className={cn(
                                        "w-16 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0",
                                        idx === lightboxIndex ? "border-white scale-110 ring-2 ring-white/20" : "border-transparent opacity-50 hover:opacity-100"
                                    )}
                                >
                                    <img src={url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>

                        <div className="absolute top-4 left-4 text-white/80 font-medium bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">
                            {(lightboxIndex ?? 0) + 1} / {allPhotos.length}
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}
