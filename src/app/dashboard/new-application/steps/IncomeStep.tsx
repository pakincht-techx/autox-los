import { useState, useEffect, useRef } from "react";
import { Briefcase, Plus, Trash2, Home, CreditCard, Building, PieChart, TrendingUp, TrendingDown, Pencil, Users, ImagePlus, X, Eye, Link, FileText, UploadCloud, CheckCircle2, Info, HelpCircle, Globe, ClipboardCheck, Phone, Calendar, MapPin, MessageSquare, RotateCcw, Camera, Lock, Unlock } from "lucide-react";
import { BahtSign } from "@/components/icons/BahtSign";
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
import { Switch } from "@/components/ui/switch";
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
import { DocumentScanner } from "@/components/application/DocumentScanner";
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

interface IncomeStepProps {
    formData: CustomerFormData;
    setFormData: React.Dispatch<React.SetStateAction<CustomerFormData>>;
    isExistingCustomer?: boolean;
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




// Mock staff list — replace with API data in production

export function IncomeStep({ formData, setFormData, isExistingCustomer = false }: IncomeStepProps) {
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
        hasDocuments?: boolean,
        documentCount?: number,
        type: 'special' | 'reference' | 'photo' | 'bankAccount' | 'incomeDocument' | 'saIncomeRow' | 'seIncomeRow' | 'seCostRow' | 'debtRow' | 'categorizedPhoto' | 'occupation'
    } | null>(null);

    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const photoInputRef = useRef<HTMLInputElement>(null);
    const [currentDocContext, setCurrentDocContext] = useState<{ occId: string, docType: string, label: string } | null>(null);
    const [currentPhotoCategory, setCurrentPhotoCategory] = useState<string | null>(null);


    // Debt Row Handlers
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

    }, [
        occupations, formData.specialIncome, formData.otherIncome
    ]);


    // Reference Persons
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
            const bankName = currentAccounts[index]?.bankName;
            const numbers = value.replace(/\D/g, '');
            if (bankName === 'TRUEMONEY') {
                // Phone format: 0XX-XXX-XXXX
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
                // Bank account format: 000-0-00000-0
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
        }

        currentAccounts[index] = { ...currentAccounts[index], [field]: finalValue };
        handleOccupationChange(occId, 'bankAccounts', currentAccounts);
    };

    const handleRemoveBankAccount = (occId: string, index: number) => {
        const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
        if (!occ) return;
        const currentAccounts = [...(occ.bankAccounts || [])];
        currentAccounts.splice(index, 1);
        // Also remove associated statement documents for this bank account
        const statementType = `statement_${index}`;
        const currentDocs = (occ.incomeDocuments || []).filter((d: IncomeDocument) => d.type !== statementType);
        // Re-index statement documents for accounts after the removed one
        const reindexedDocs = currentDocs.map((d: IncomeDocument) => {
            if (d.type?.startsWith('statement_')) {
                const docIdx = parseInt(d.type!.split('_')[1]);
                if (docIdx > index) {
                    return { ...d, type: `statement_${docIdx - 1}` };
                }
            }
            return d;
        });
        handleOccupationChange(occId, 'bankAccounts', currentAccounts);
        handleOccupationChange(occId, 'incomeDocuments', reindexedDocs);
        setItemToDelete(null);
    };

    // SA Income Handlers
    const handleAddSAIncomeRow = (occId: string, sourceDocType?: string) => {
        const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
        if (!occ) return;
        const currentIncomes = occ.saIncomes || [];
        handleOccupationChange(occId, 'saIncomes', [...currentIncomes, { type: '', detail: '', amount: '', sourceDocType }]);
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

    const LIVESTOCK_STANDARD_PRICES: Record<string, { sales: number, cost: number }> = {
        "pig": { sales: 8000, cost: 5000 },
        "chicken": { sales: 150, cost: 90 },
        "cow": { sales: 35000, cost: 20000 },
        "duck": { sales: 120, cost: 70 },
        "fish": { sales: 0, cost: 0 },
        "shrimp": { sales: 0, cost: 0 },
        "others": { sales: 0, cost: 0 }
    };

    const LIVESTOCK_TYPES = [
        { label: "หมู", value: "pig" },
        { label: "ไก่", value: "chicken" },
        { label: "วัว", value: "cow" },
        { label: "เป็ด", value: "duck" },
        { label: "ปลา", value: "fish" },
        { label: "กุ้ง", value: "shrimp" },
        { label: "อื่นๆ", value: "others" },
    ];

    const AQUATIC_TYPES = ["fish", "shrimp"];

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
        setIsUploadDialogOpen(true);
    };

    const generateMockOCRIncomeRows = (docType: string): SAIncome[] => {
        const sourceDocType = docType;
        if (docType.startsWith('payslip')) {
            return [
                { type: 'salary', detail: 'เงินเดือน', amount: '25000', sourceDocType },
                { type: 'other_income', detail: 'ค่าล่วงเวลา', amount: '3500', sourceDocType },
                { type: 'fixed_income', detail: 'ค่าตำแหน่ง', amount: '2000', sourceDocType },
                { type: 'bonus', detail: 'เบี้ยขยัน', amount: '1000', sourceDocType },
            ];
        } else if (docType.startsWith('statement_')) {
            return [
                { type: 'other_income', detail: 'เงินโอนเข้าบัญชี (เฉลี่ย 6 เดือน)', amount: '35000', sourceDocType }
            ];
        } else if (docType === 'tavi50') {
            return [
                { type: 'salary', detail: 'รายได้พึงประเมิน', amount: '45000', sourceDocType }
            ];
        } else if (docType === 'salary_cert') {
            return [
                { type: 'salary', detail: 'เงินเดือนหนังสือรับรอง', amount: '30000', sourceDocType }
            ];
        }
        return [];
    };

    const handleUploadMethodSelect = (method: 'file' | 'camera') => {
        // Do not close the dialog so user can see uploads and edit them
        if (method === 'file' && fileInputRef.current) {
            fileInputRef.current?.click();
        } else if (method === 'camera') {
            // Temporarily hide dialog to avoid Radix focus trap blocking scanner
            setIsUploadDialogOpen(false);
            setIsScannerOpen(true);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0 || !currentDocContext) return;

        const { occId, docType } = currentDocContext;
        const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
        if (!occ) return;

        const currentDocs = occ.incomeDocuments || [];
        let currentIncomes = occ.saIncomes || [];

        // For payslip, each file gets its own unique indexed key
        if (docType === 'payslip') {
            const existingPayslipCount = currentDocs.filter((d: IncomeDocument) => d.type?.startsWith('payslip_')).length;
            const newDocs: IncomeDocument[] = [];
            let allNewOCRRows: SAIncome[] = [];

            files.forEach((file, fileIdx) => {
                const payslipKey = `payslip_${existingPayslipCount + fileIdx}`;
                newDocs.push({
                    id: generateId('doc'),
                    type: payslipKey,
                    name: file.name,
                    url: URL.createObjectURL(file),
                    status: 'success',
                    uploadedAt: new Date().toISOString()
                });
                allNewOCRRows = [...allNewOCRRows, ...generateMockOCRIncomeRows(payslipKey)];
            });

            const updatedIncomes = [...currentIncomes, ...allNewOCRRows];
            const totalIncome = updatedIncomes.reduce((acc: number, curr: SAIncome) => acc + (Number(curr.amount) || 0), 0);

            handleOccupationChange(occId, {
                incomeDocuments: [...currentDocs, ...newDocs],
                saIncomes: updatedIncomes,
                totalIncome: totalIncome
            });
        } else {
            const newDocs: IncomeDocument[] = files.map(file => ({
                id: generateId('doc'),
                type: docType,
                name: file.name,
                url: URL.createObjectURL(file),
                status: 'success',
                uploadedAt: new Date().toISOString()
            }));

            const newMockOCRRows = generateMockOCRIncomeRows(docType);
            const updatedIncomes = [...currentIncomes, ...newMockOCRRows];
            const totalIncome = updatedIncomes.reduce((acc: number, curr: SAIncome) => acc + (Number(curr.amount) || 0), 0);

            handleOccupationChange(occId, {
                incomeDocuments: [...currentDocs, ...newDocs],
                saIncomes: updatedIncomes,
                totalIncome: totalIncome
            });
        }

        // Reset file input only, DO NOT close dialog or clear context
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleScanComplete = (pages: string[]) => {
        setIsScannerOpen(false);
        if (pages.length === 0 || !currentDocContext) return;

        const { occId, docType } = currentDocContext;
        const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
        if (!occ) return;

        // Ensure upload dialog stays open after scan
        setIsUploadDialogOpen(true);

        const currentDocs = occ.incomeDocuments || [];
        const currentIncomes = occ.saIncomes || [];

        // For payslip, assign unique indexed key
        const actualDocType = docType === 'payslip'
            ? `payslip_${currentDocs.filter((d: IncomeDocument) => d.type?.startsWith('payslip_')).length}`
            : docType;

        const newDoc: IncomeDocument = {
            id: generateId('doc'),
            type: actualDocType,
            name: `สแกน_${new Date().getTime()}.pdf`,
            url: pages[0],
            status: 'success',
            uploadedAt: new Date().toISOString()
        };

        const newMockOCRRows = generateMockOCRIncomeRows(actualDocType);
        const updatedIncomes = [...currentIncomes, ...newMockOCRRows];
        const totalIncome = updatedIncomes.reduce((acc: number, curr: SAIncome) => acc + (Number(curr.amount) || 0), 0);

        handleOccupationChange(occId, {
            incomeDocuments: [...currentDocs, newDoc],
            saIncomes: updatedIncomes,
            totalIncome: totalIncome
        });
    };

    const handleUpdateIncomeDocument = (occId: string, docId: string, updates: Partial<IncomeDocument>) => {
        const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
        if (!occ) return;
        const currentDocs = (occ.incomeDocuments || []).map((d: IncomeDocument) => d.id === docId ? { ...d, ...updates } : d);
        handleOccupationChange(occId, 'incomeDocuments', currentDocs);
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
        { label: "ทรูมันนี่", value: "TRUEMONEY", logo: "/bank-logo/Type=Truemoney.svg" },
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
                    multiple
                />

                {/* ===== SECTION 1: Income (อาชีพและรายได้) ===== */}
                <Card className="border-border-strong">
                    <CardHeader className="bg-blue-50/50 border-b border-border-strong pb-4">
                        <CardTitle className="text-lg flex items-center gap-2 text-chaiyo-blue">
                            <Briefcase className="w-5 h-5" />
                            อาชีพและรายได้
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-6 pb-6 pt-0">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <div className="relative flex items-stretch sticky top-0 z-20 bg-white border-b border-border-subtle -mx-6 pr-6 shadow-[0_4px_6px_-4px_rgba(0,0,0,0.05)]">
                                {/* Scrollable Tab List */}
                                <div className="flex-1 overflow-x-auto no-scrollbar pr-4 min-w-0">
                                    <TabsList className="bg-transparent h-auto p-0 flex items-stretch gap-0 w-max">
                                        {occupations.map((occ: IncomeOccupation, index: number) => {
                                            const occName = occ.occupationCode
                                                ? OCCUPATIONS.find(o => (o.value || o.label) === occ.occupationCode)?.label
                                                : undefined;

                                            // Compute per-occupation net income
                                            let occIncome = 0;
                                            if (occ.employmentType === 'SA') {
                                                occIncome = (occ.saIncomes || []).reduce((sum: number, item: SAIncome) => sum + (Number(item.amount) || 0), 0);
                                            } else if (occ.employmentType === 'SE') {
                                                if (occ.occupationCode === 'FARMER') {
                                                    const std = FARM_STANDARD_PRICES[occ.produceType || "others"] || { sales: 0, cost: 0 };
                                                    const totalAreaRai = Number(occ.cultivationAreaRai || 0) + (Number(occ.cultivationAreaNgan || 0) / 4) + (Number(occ.cultivationAreaSqWa || 0) / 400);
                                                    const cycles = Number(occ.cyclesPerYear || 1);
                                                    const laborers = Number(occ.laborCount || 1) || 1;
                                                    const salesValue = occ.customerSalesPerRai ? Number(occ.customerSalesPerRai) : std.sales;
                                                    const costValue = occ.customerCostPerRai ? Number(occ.customerCostPerRai) : std.cost;
                                                    occIncome = Math.max(0, (((salesValue - costValue) * totalAreaRai * cycles) / 12) / laborers);
                                                } else if (occ.occupationCode === 'LIVESTOCK') {
                                                    const totalNet = (occ.livestockCycles || []).reduce((sum, c) => sum + (Number(c.netIncome) || 0), 0);
                                                    occIncome = totalNet / 12;
                                                } else {
                                                    const sales = (occ.seIncomes || []).reduce((sum: number, item: SAIncome) => sum + (Number(item.calculatedMonthly) || 0), 0);
                                                    const costs = (occ.seCosts || []).reduce((sum: number, item: SAIncome) => sum + (Number(item.calculatedMonthly) || 0), 0);
                                                    occIncome = sales - costs;
                                                }
                                            }
                                            occIncome = roundDown2(occIncome);

                                            return (
                                                <TabsTrigger
                                                    key={occ.id}
                                                    value={occ.id}
                                                    className="group/tab relative flex-shrink-0 px-5 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-chaiyo-blue data-[state=active]:text-chaiyo-blue text-gray-500 hover:text-gray-800 hover:bg-gray-50/50 flex items-center gap-2.5 transition-all duration-200 bg-transparent shadow-none"
                                                >
                                                    <div className="flex flex-col items-start gap-0.5">
                                                        <span className="flex items-center gap-1.5 text-sm font-semibold">
                                                            {occ.isMain ? (
                                                                <>
                                                                    <Briefcase className="w-3.5 h-3.5" /> อาชีพหลัก
                                                                </>
                                                            ) : (
                                                                `อาชีพเสริม ${index}`
                                                            )}
                                                        </span>
                                                        <div className="flex items-center gap-1.5">
                                                            {occName && (
                                                                <span className="text-[11px] font-normal text-gray-400 group-data-[state=active]/tab:text-chaiyo-blue/60 truncate max-w-[120px]">
                                                                    {occName}
                                                                </span>
                                                            )}
                                                            {occName && occIncome > 0 && (
                                                                <span className="text-[11px] font-medium text-gray-400 group-data-[state=active]/tab:text-chaiyo-blue/60">·</span>
                                                            )}
                                                            {occIncome > 0 && (
                                                                <span className="text-[11px] font-semibold text-chaiyo-blue/60 group-data-[state=active]/tab:text-chaiyo-blue font-mono">
                                                                    ฿{formatNumberWithCommas(occIncome)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {!occ.isMain && (
                                                        <div
                                                            className="w-5 h-5 rounded-full hover:bg-red-100 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors ml-1"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                const occLabel = occ.occupationCode
                                                                    ? OCCUPATIONS.find(o => (o.value || o.label) === occ.occupationCode)?.label
                                                                    : undefined;
                                                                setItemToDelete({
                                                                    id: occ.id,
                                                                    name: occLabel ? `อาชีพเสริม (${occLabel})` : 'อาชีพเสริม',
                                                                    type: 'occupation'
                                                                });
                                                            }}
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </div>
                                                    )}
                                                </TabsTrigger>
                                            );
                                        })}
                                    </TabsList>
                                </div>

                                {/* Fixed Add Button */}
                                <div className="flex-shrink-0 flex items-center pl-4 border-l border-gray-100 py-1 ml-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleAddSecondaryOccupation}
                                        disabled={occupations.filter((o: IncomeOccupation) => !o.isMain).length >= 10}
                                        className="h-9 gap-1.5 whitespace-nowrap text-gray-500 hover:text-chaiyo-blue hover:bg-blue-50/50 transition-colors text-sm"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        เพิ่มอาชีพ
                                    </Button>
                                </div>
                            </div>

                            {/* Separator below sticky tabs */}
                            <div className="h-6"></div>

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
                                                <Combobox
                                                    options={OCCUPATIONS
                                                        .filter(o => !occ.employmentType || o.types.includes(occ.employmentType))
                                                        .map(o => ({
                                                            value: o.value || o.label,
                                                            label: o.label
                                                        }))}
                                                    value={occ.occupationCode || ""}
                                                    onValueChange={(val) => handleOccupationChange(occ.id, "occupationCode", val)}
                                                    placeholder="เลือกอาชีพ"
                                                    searchPlaceholder="ค้นหาอาชีพ..."
                                                    emptyText="ไม่พบข้อมูลอาชีพ"
                                                    className="h-11 shadow-none border-gray-200"
                                                />
                                            </div>

                                            {occ.occupationCode !== 'UNEMPLOYED' && (
                                                <>
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
                                                                <SelectItem value="TH">ไทย (Thai)</SelectItem>
                                                                <SelectItem value="MM">พม่า (Myanmar)</SelectItem>
                                                                <SelectItem value="LA">ลาว (Laos)</SelectItem>
                                                                <SelectItem value="KH">กัมพูชา (Cambodia)</SelectItem>
                                                                <SelectItem value="CN">จีน (China)</SelectItem>
                                                                <SelectItem value="JP">ญี่ปุ่น (Japan)</SelectItem>
                                                                <SelectItem value="VN">เวียดนาม (Vietnam)</SelectItem>
                                                                <SelectItem value="MY">มาเลเซีย (Malaysia)</SelectItem>
                                                                <SelectItem value="SG">สิงคโปร์ (Singapore)</SelectItem>
                                                                <SelectItem value="US">สหรัฐอเมริกา (USA)</SelectItem>
                                                                <SelectItem value="GB">สหราชอาณาจักร (UK)</SelectItem>
                                                                <SelectItem value="OTHER">อื่นๆ (Other)</SelectItem>
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
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {occ.occupationCode !== 'UNEMPLOYED' && (
                                        <>
                                            {/* 2. ที่อยู่ที่ทำงาน / กิจการ */}
                                            <div className="rounded-xl border border-gray-200 bg-gray-50/40 p-5">
                                                <AddressForm
                                                    title="ที่อยู่ที่ทำงาน / กิจการ"
                                                    prefix="work"
                                                    formData={occ.isSameAsMainAddress ? (formData.occupations?.find((o: IncomeOccupation) => o.id === occ.isSameAsMainAddress) || {}) : occ}
                                                    onChange={(field, val) => handleOccupationChange(occ.id, field, val)}
                                                    disabled={!!occ.isSameAsMainAddress}
                                                    requiredFields={['province', 'district', 'subDistrict', 'zipCode']}
                                                    headerChildren={
                                                        !occ.isMain ? (
                                                            <div className="space-y-4 mb-4 mt-2">
                                                                <div className="space-y-2">
                                                                    <Label className="text-sm">เลือกที่อยู่ที่ทำงาน</Label>
                                                                    <Select
                                                                        value={occ.isSameAsMainAddress || "_none"}
                                                                        onValueChange={(val) => {
                                                                            handleOccupationChange(occ.id, "isSameAsMainAddress", val === "_none" ? "" : val);
                                                                        }}
                                                                    >
                                                                        <SelectTrigger className="h-12 bg-white">
                                                                            <SelectValue placeholder="เลือกแหล่งที่มาของที่อยู่" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="_none">ระบุที่อยู่ใหม่</SelectItem>
                                                                            {occupations
                                                                                .filter((o: IncomeOccupation) => o.id !== occ.id)
                                                                                .map((o: IncomeOccupation) => {
                                                                                    const label = o.isMain
                                                                                        ? "อาชีพหลัก"
                                                                                        : `อาชีพเสริม ${occupations.filter((x: IncomeOccupation) => !x.isMain).findIndex((x: IncomeOccupation) => x.id === o.id) + 1}`;
                                                                                    const occName = o.occupationCode
                                                                                        ? OCCUPATIONS.find(oc => (oc.value || oc.label) === o.occupationCode)?.label
                                                                                        : undefined;
                                                                                    return (
                                                                                        <SelectItem key={o.id} value={o.id}>
                                                                                            ที่อยู่{label}{occName ? ` (${occName})` : ""}
                                                                                        </SelectItem>
                                                                                    );
                                                                                })}
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                                {occ.isSameAsMainAddress && (() => {
                                                                    const sourceOcc = occupations.find((o: IncomeOccupation) => o.id === occ.isSameAsMainAddress);
                                                                    const sourceLabel = sourceOcc?.isMain
                                                                        ? "อาชีพหลัก"
                                                                        : `อาชีพเสริม ${occupations.filter((x: IncomeOccupation) => !x.isMain).findIndex((x: IncomeOccupation) => x.id === sourceOcc?.id) + 1}`;
                                                                    return (
                                                                        <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl text-sm text-chaiyo-blue flex items-center gap-2">
                                                                            <Info className="w-4 h-4" />
                                                                            ใช้ข้อมูลที่อยู่เดียวกับที่อยู่{sourceLabel}
                                                                        </div>
                                                                    );
                                                                })()}
                                                            </div>
                                                        ) : undefined
                                                    }
                                                    footerChildren={
                                                        <div className="space-y-4 pt-4 border-t border-gray-100">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                                                <div className="space-y-2">
                                                                    <Label className="text-xs text-muted-foreground">บริเวณใกล้เคียง/จุดสังเกต</Label>
                                                                    <Input
                                                                        value={(occ.isSameAsMainAddress ? (formData.occupations?.find((o: IncomeOccupation) => o.id === occ.isSameAsMainAddress) || {} as IncomeOccupation).workLandmark : occ.workLandmark) || ""}
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
                                                                            value={(occ.isSameAsMainAddress ? (formData.occupations?.find((o: IncomeOccupation) => o.id === occ.isSameAsMainAddress) || {} as IncomeOccupation).workLocationType : occ.workLocationType) || ""}
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
                                                                        {((occ.isSameAsMainAddress ? (formData.occupations?.find((o: IncomeOccupation) => o.id === occ.isSameAsMainAddress) || {} as IncomeOccupation).workLocationType : occ.workLocationType) === 'other') && (
                                                                            <Input
                                                                                value={(occ.isSameAsMainAddress ? (formData.occupations?.find((o: IncomeOccupation) => o.id === occ.isSameAsMainAddress) || {} as IncomeOccupation).workLocationTypeOther : occ.workLocationTypeOther) || ""}
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
                                                                            value={(occ.isSameAsMainAddress ? (formData.occupations?.find((o: IncomeOccupation) => o.id === occ.isSameAsMainAddress) || {} as IncomeOccupation).businessStatus : occ.businessStatus) || ""}
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

                                            {/* 3. ช่องทางการรับรายได้ */}
                                            <div className="rounded-xl border border-border-color bg-gray-50/40 p-6 space-y-6">
                                                <h4 className="text-base font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-border-color">
                                                    <BahtSign className="w-5 h-5 text-chaiyo-blue" /> ช่องทางการรับรายได้
                                                </h4>

                                                <div className="space-y-6">
                                                    {/* Payment Channels Selection */}
                                                    <div className="space-y-3">
                                                        <Label className="text-sm font-bold text-gray-700"> ช่องทางการรับรายได้<span className="text-red-500">*</span></Label>
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
                                                                <Label htmlFor={`bank-${occ.id}`} className="font-normal cursor-pointer">เข้าบัญชีธนาคาร</Label>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Bank Accounts Table (Conditional) */}
                                                    {(occ.incomeChannels || []).includes('bank') && (
                                                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <Label className="text-sm font-bold text-gray-700">บัญชีธนาคาร</Label>
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
                                                                                            placeholder={account.bankName === 'TRUEMONEY' ? '0XX-XXX-XXXX' : '000-0-00000-0'}
                                                                                            className="h-9 text-sm bg-gray-50/30 font-mono tracking-wider"
                                                                                            maxLength={12} // 10 digits + 2-3 dashes
                                                                                        />
                                                                                    </TableCell>
                                                                                    <TableCell className="text-right">
                                                                                        <Button
                                                                                            variant="ghost"
                                                                                            size="sm"
                                                                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 rounded-full"
                                                                                            onClick={() => {
                                                                                                const statementDocs = (occ.incomeDocuments || []).filter((d: IncomeDocument) => d.type === `statement_${idx}`);
                                                                                                setItemToDelete({
                                                                                                    index: idx,
                                                                                                    occId: occ.id,
                                                                                                    name: account.bankName ? `บัญชี ${THAI_BANKS.find(b => b.value === account.bankName)?.label}` : 'บัญชีธนาคาร',
                                                                                                    type: 'bankAccount',
                                                                                                    hasDocuments: statementDocs.length > 0,
                                                                                                    documentCount: statementDocs.length,
                                                                                                });
                                                                                            }}
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
                                                        <div className="flex items-center justify-between mb-2">
                                                            <Label className="text-sm font-bold text-gray-700">เอกสารแสดงรายได้ ({(occ.incomeDocuments || []).length}/50 ไฟล์)<span className="text-red-500">*</span></Label>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    const current = occ.customDocTypes || [];
                                                                    const newId = `other_${Date.now()}`;
                                                                    handleOccupationChange(occ.id, 'customDocTypes', [...current, { id: newId, label: 'เอกสารอื่นๆ' }]);
                                                                }}
                                                                className="h-8 text-xs font-medium"
                                                            >
                                                                <Plus className="w-3 h-3 mr-1" /> เพิ่มเอกสารอื่นๆ
                                                            </Button>
                                                        </div>
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
                                                                    {(() => {
                                                                        // Build dynamic doc types: replace 'statement' with one per bank account
                                                                        const bankAccounts = occ.bankAccounts || [];
                                                                        const dynamicDocTypes: { id: string; label: string; isCustom?: boolean }[] = [];

                                                                        INCOME_DOC_TYPES.forEach(docType => {
                                                                            if (docType.id === 'statement') {
                                                                                if (bankAccounts.length > 0) {
                                                                                    bankAccounts.forEach((account: BankAccount, accIdx: number) => {
                                                                                        const bankInfo = THAI_BANKS.find(b => b.value === account.bankName);
                                                                                        const bankLabel = bankInfo?.label || `บัญชีที่ ${accIdx + 1}`;
                                                                                        dynamicDocTypes.push({
                                                                                            id: `statement_${accIdx}`,
                                                                                            label: `รายการเดินบัญชี - ${bankLabel}${account.accountNo ? ` (${account.accountNo})` : ''}`,
                                                                                        });
                                                                                    });
                                                                                } else {
                                                                                    dynamicDocTypes.push(docType);
                                                                                }
                                                                            } else {
                                                                                dynamicDocTypes.push(docType);
                                                                            }
                                                                        });

                                                                        // Add custom "เอกสารอื่นๆ" rows from customDocTypes array
                                                                        const customTypes = occ.customDocTypes || [];
                                                                        customTypes.forEach((ct: { id: string; label: string }) => {
                                                                            dynamicDocTypes.push({ id: ct.id, label: ct.label, isCustom: true });
                                                                        });

                                                                        return dynamicDocTypes.map((docType) => {
                                                                            const uploadedDocs = (occ.incomeDocuments || []).filter((d: IncomeDocument) =>
                                                                                docType.id === 'payslip' ? d.type?.startsWith('payslip_') : d.type === docType.id
                                                                            );

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
                                                                                            {docType.isCustom ? (
                                                                                                <Input
                                                                                                    value={docType.label}
                                                                                                    onChange={(e) => {
                                                                                                        const updated = (occ.customDocTypes || []).map((ct: { id: string; label: string }) =>
                                                                                                            ct.id === docType.id ? { ...ct, label: e.target.value } : ct
                                                                                                        );
                                                                                                        handleOccupationChange(occ.id, 'customDocTypes', updated);
                                                                                                    }}
                                                                                                    className="h-8 text-sm font-medium w-[200px]"
                                                                                                    placeholder="ชื่อเอกสาร"
                                                                                                />
                                                                                            ) : (
                                                                                                <span className="font-medium text-gray-700 text-sm whitespace-nowrap">{docType.label}</span>
                                                                                            )}
                                                                                        </div>
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        {uploadedDocs.length > 0 ? (
                                                                                            <button
                                                                                                type="button"
                                                                                                onClick={() => handleAddIncomeDocument(occ.id, docType.id, docType.label)}
                                                                                                className="flex items-center gap-1.5 text-xs text-chaiyo-blue font-medium hover:underline cursor-pointer"
                                                                                            >
                                                                                                <FileText className="w-3.5 h-3.5" />
                                                                                                {uploadedDocs.length} ไฟล์
                                                                                            </button>
                                                                                        ) : (
                                                                                            <span className="text-xs text-muted-foreground italic">ยังไม่มีไฟล์</span>
                                                                                        )}
                                                                                    </TableCell>
                                                                                    <TableCell className="text-right">
                                                                                        <div className="flex items-center justify-end gap-1">
                                                                                            <Button
                                                                                                type="button"
                                                                                                variant="outline"
                                                                                                size="sm"
                                                                                                onClick={() => handleAddIncomeDocument(occ.id, docType.id, docType.label)}
                                                                                                className="h-8 text-xs gap-1.5 font-medium"
                                                                                            >
                                                                                                <Plus className="w-3.5 h-3.5" />
                                                                                                เพิ่มเอกสาร
                                                                                            </Button>
                                                                                            {docType.isCustom && (
                                                                                                <Button
                                                                                                    type="button"
                                                                                                    variant="ghost"
                                                                                                    size="sm"
                                                                                                    onClick={() => {
                                                                                                        // Remove custom doc type and its documents
                                                                                                        const updatedTypes = (occ.customDocTypes || []).filter((ct: { id: string; label: string }) => ct.id !== docType.id);
                                                                                                        handleOccupationChange(occ.id, 'customDocTypes', updatedTypes);
                                                                                                        // Also remove any uploaded docs for this type
                                                                                                        const updatedDocs = (occ.incomeDocuments || []).filter((d: IncomeDocument) => d.type !== docType.id);
                                                                                                        handleOccupationChange(occ.id, 'incomeDocuments', updatedDocs);
                                                                                                    }}
                                                                                                    className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                                                                                                    title="ลบประเภทเอกสาร"
                                                                                                >
                                                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                                                </Button>
                                                                                            )}
                                                                                        </div>
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            );
                                                                        });
                                                                    })()}
                                                                </TableBody>
                                                            </Table>
                                                        </div>
                                                    </div>

                                                    {/* Occupation Proof Documents Table */}
                                                    <div className="space-y-3 pt-2">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <Label className="text-sm font-bold text-gray-700">เอกสารยืนยันอาชีพ</Label>
                                                        </div>
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
                                                                    {[
                                                                        { id: 'occ_doc_1', label: 'เอกสารประกอบอาชีพ 1' },
                                                                        { id: 'occ_doc_2', label: 'เอกสารประกอบอาชีพ 2' },
                                                                    ].map((docType) => {
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
                                                                                        <button
                                                                                            type="button"
                                                                                            onClick={() => handleAddIncomeDocument(occ.id, docType.id, docType.label)}
                                                                                            className="flex items-center gap-1.5 text-xs text-chaiyo-blue font-medium hover:underline cursor-pointer"
                                                                                        >
                                                                                            <FileText className="w-3.5 h-3.5" />
                                                                                            {uploadedDocs.length} ไฟล์
                                                                                        </button>
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
                                                                                        <Plus className="w-3.5 h-3.5" />
                                                                                        เพิ่มเอกสาร
                                                                                    </Button>
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        );
                                                                    })}
                                                                </TableBody>
                                                            </Table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>


                                            {/* SA Details Section: Employment Tenure & Income Table */}
                                            {occ.employmentType === 'SA' && (
                                                <div className="rounded-xl border border-border-color bg-gray-50/40 p-6 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                                                    <div className="space-y-4">
                                                        <h4 className="text-base font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-border-color">
                                                            <TrendingUp className="w-5 h-5 text-chaiyo-blue" /> รายละเอียดอายุงานและรายได้
                                                        </h4>

                                                        {/* Tenure Fields - Stacked */}
                                                        <div className="space-y-4 pt-2">
                                                            <div className="space-y-2">
                                                                <Label className="text-sm font-bold text-gray-700">อายุงานปัจจุบัน <span className="text-red-500">*</span></Label>
                                                                <div className="flex items-center gap-3 max-w-md">
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
                                                                <div className="flex items-center gap-3 max-w-md">
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

                                                    {/* Income Tables Per Document Source */}
                                                    <div className="space-y-6">
                                                        {(() => {
                                                            const allDocs = occ.incomeDocuments || [];
                                                            const allIncomes = occ.saIncomes || [];
                                                            const customDocTypes = occ.customDocTypes || [];

                                                            // 1. Identify all unique doc types that have uploaded files
                                                            const uploadedDocTypes = Array.from(new Set(allDocs.map((d: IncomeDocument) => d.type))).filter(Boolean) as string[];

                                                            // 2. Separate incomes by source
                                                            const incomesBySource: Record<string, (SAIncome & { originalIndex: number })[]> = {};
                                                            const otherIncomes: (SAIncome & { originalIndex: number })[] = [];

                                                            allIncomes.forEach((income, index) => {
                                                                const incomeWithIndex = { ...income, originalIndex: index };
                                                                if (income.sourceDocType) {
                                                                    if (!incomesBySource[income.sourceDocType]) {
                                                                        incomesBySource[income.sourceDocType] = [];
                                                                    }
                                                                    incomesBySource[income.sourceDocType].push(incomeWithIndex);
                                                                } else {
                                                                    otherIncomes.push(incomeWithIndex);
                                                                }
                                                            });

                                                            // 3. Helper to render a table for a set of incomes
                                                            const renderIncomeTable = (
                                                                title: string,
                                                                sourceKey: string | undefined,
                                                                incomes: (SAIncome & { originalIndex: number })[],
                                                                showAddButton: boolean = true
                                                            ) => {
                                                                const sourceTotal = incomes.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

                                                                return (
                                                                    <div key={sourceKey || 'other'} className="space-y-3">
                                                                        <div className="flex items-center justify-between pl-1 pr-1">
                                                                            <Label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                                                                {sourceKey ? <FileText className="w-4 h-4 text-emerald-600" /> : <TrendingUp className="w-4 h-4 text-gray-600" />}
                                                                                {title}
                                                                            </Label>
                                                                            {showAddButton && (
                                                                                <Button
                                                                                    type="button"
                                                                                    variant="outline"
                                                                                    size="sm"
                                                                                    onClick={() => handleAddSAIncomeRow(occ.id, sourceKey)}
                                                                                    className="h-8 text-xs font-medium bg-white"
                                                                                >
                                                                                    <Plus className="w-3 h-3 mr-1" /> เพิ่มรายการรายได้
                                                                                </Button>
                                                                            )}
                                                                        </div>

                                                                        <div className="border border-border-strong rounded-xl overflow-hidden bg-white">
                                                                            <Table>
                                                                                <TableHeader className="bg-gray-50/50">
                                                                                    <TableRow>
                                                                                        <TableHead className="w-[30%] text-xs py-3">ประเภทรายได้</TableHead>
                                                                                        <TableHead className="w-[40%] text-xs py-3">รายละเอียดรายได้</TableHead>
                                                                                        <TableHead className="w-[20%] text-xs py-3 text-right">รายได้ (บาท)</TableHead>
                                                                                        <TableHead className="w-[10%] text-center text-xs py-3">จัดการ</TableHead>
                                                                                    </TableRow>
                                                                                </TableHeader>
                                                                                <TableBody>
                                                                                    {incomes.length === 0 ? (
                                                                                        <TableRow>
                                                                                            <TableCell colSpan={4} className="h-16 text-center text-muted-foreground italic text-xs">
                                                                                                ยังไม่มีรายการรายได้ กรุณากดเพิ่มรายการ
                                                                                            </TableCell>
                                                                                        </TableRow>
                                                                                    ) : (
                                                                                        incomes.map((item) => {
                                                                                            const originalIdx = item.originalIndex;
                                                                                            return (
                                                                                                <TableRow key={originalIdx} className="group transition-colors hover:bg-gray-50/50">
                                                                                                    <TableCell className="py-2.5">
                                                                                                        <Select
                                                                                                            value={item.type || ""}
                                                                                                            onValueChange={(val) => handleUpdateSAIncomeRow(occ.id, originalIdx, 'type', val)}
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
                                                                                                    <TableCell className="py-2.5">
                                                                                                        <Input
                                                                                                            value={item.detail || ""}
                                                                                                            onChange={(e) => handleUpdateSAIncomeRow(occ.id, originalIdx, 'detail', e.target.value)}
                                                                                                            placeholder="เช่น ค่าตำแหน่ง, ค่าครองชีพ"
                                                                                                            className="h-9 text-sm bg-gray-50/30"
                                                                                                        />
                                                                                                    </TableCell>
                                                                                                    <TableCell className="py-2.5">
                                                                                                        <Input
                                                                                                            type="text"
                                                                                                            value={formatNumberWithCommas(item.amount ?? '')}
                                                                                                            onChange={(e) => handleUpdateSAIncomeRow(occ.id, originalIdx, 'amount', e.target.value)}
                                                                                                            placeholder="0.00"
                                                                                                            className="h-9 text-sm bg-gray-50/30 text-right font-mono"
                                                                                                        />
                                                                                                    </TableCell>
                                                                                                    <TableCell className="py-2.5 text-center">
                                                                                                        <Button
                                                                                                            variant="ghost"
                                                                                                            size="sm"
                                                                                                            className="text-gray-400 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0 rounded-full"
                                                                                                            onClick={() => setItemToDelete({
                                                                                                                index: originalIdx,
                                                                                                                occId: occ.id,
                                                                                                                name: item.detail || (SA_INCOME_TYPES.find(t => t.value === item.type)?.label) || `รายการที่ ${originalIdx + 1}`,
                                                                                                                type: 'saIncomeRow'
                                                                                                            })}
                                                                                                        >
                                                                                                            <Trash2 className="w-4 h-4" />
                                                                                                        </Button>
                                                                                                    </TableCell>
                                                                                                </TableRow>
                                                                                            );
                                                                                        })
                                                                                    )}
                                                                                </TableBody>
                                                                                {incomes.length > 0 && (
                                                                                    <TableFooter>
                                                                                        <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 transition-none">
                                                                                            <TableCell colSpan={2} className="text-right font-bold py-3 text-xs text-gray-700">
                                                                                                รวมยอดจากเอกสารนี้:
                                                                                            </TableCell>
                                                                                            <TableCell colSpan={2} className="text-right pr-[4.5rem] py-3">
                                                                                                <div className="text-sm font-semibold font-mono text-gray-700">
                                                                                                    ฿{formatNumberWithCommas(sourceTotal)}
                                                                                                </div>
                                                                                            </TableCell>
                                                                                        </TableRow>
                                                                                    </TableFooter>
                                                                                )}
                                                                            </Table>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            };

                                                            // Build dynamic doc types mapping (to resolve readable labels)
                                                            const bankAccounts = occ.bankAccounts || [];
                                                            const dynamicDocTypes: { id: string; label: string }[] = [];
                                                            // Collect all payslip_N doc types from uploaded documents
                                                            const payslipDocTypes = uploadedDocTypes.filter(dt => dt.startsWith('payslip_'));
                                                            INCOME_DOC_TYPES.forEach(dt => {
                                                                if (dt.id === 'payslip') {
                                                                    // Expand payslip into individual payslip_N entries
                                                                    payslipDocTypes.forEach((pdt, idx) => {
                                                                        dynamicDocTypes.push({
                                                                            id: pdt,
                                                                            label: `สลิปเงินเดือน (Payslip) - เดือนที่ ${idx + 1}`
                                                                        });
                                                                    });
                                                                } else if (dt.id === 'statement') {
                                                                    if (bankAccounts.length > 0) {
                                                                        bankAccounts.forEach((account: BankAccount, accIdx: number) => {
                                                                            const bankInfo = THAI_BANKS.find(b => b.value === account.bankName);
                                                                            const bankLabel = bankInfo?.label || `บัญชีที่ ${accIdx + 1}`;
                                                                            dynamicDocTypes.push({
                                                                                id: `statement_${accIdx}`,
                                                                                label: `รายการเดินบัญชี - ${bankLabel}`
                                                                            });
                                                                        });
                                                                    } else {
                                                                        dynamicDocTypes.push(dt);
                                                                    }
                                                                } else {
                                                                    dynamicDocTypes.push(dt);
                                                                }
                                                            });
                                                            customDocTypes.forEach(ct => dynamicDocTypes.push(ct));

                                                            return (
                                                                <>
                                                                    {uploadedDocTypes.map(docType => {
                                                                        const label = dynamicDocTypes.find(d => d.id === docType)?.label || docType;
                                                                        const sourceIncomes = incomesBySource[docType] || [];
                                                                        return renderIncomeTable(`รายการรายได้จาก: ${label}`, docType, sourceIncomes);
                                                                    })}

                                                                    {/* Cash Income Table (if selected) */}
                                                                    {(occ.incomeChannels || []).includes('cash') && (
                                                                        renderIncomeTable('รายการรายได้รับเป็นเงินสด', 'cash', incomesBySource['cash'] || [])
                                                                    )}

                                                                    {/* Always show "Other Incomes" table as the fallback/manual entry ground */}
                                                                    {renderIncomeTable('รายการรายได้อื่นๆ (เพิ่มเติม)', undefined, otherIncomes)}

                                                                    {/* Grand Total Footer */}
                                                                    <div className="mt-6 border-t border-border-strong pt-4">
                                                                        <div className="flex items-center justify-between bg-chaiyo-blue/5 text-chaiyo-blue px-6 py-4 rounded-xl border border-chaiyo-blue/20 shadow-sm">
                                                                            <span className="text-sm font-bold">รายได้รวมทุกแหล่ง (ต่อเดือน):</span>
                                                                            <span className="text-xl font-bold font-mono tracking-tight">
                                                                                ฿{formatNumberWithCommas(occ.totalIncome || "0")}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            );
                                                        })()}
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
                                                        </div>

                                                        {occ.businessStatus !== 'closed' && (
                                                            <>
                                                                <div className="space-y-2">
                                                                    <Label>สถานภาพกิจการปัจจุบัน
                                                                        <span className="text-red-500">*</span></Label>
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
                                                                            <SelectItem value="OWN">กิจการของตนเอง</SelectItem>
                                                                            <SelectItem value="FAMILY">กิจการของครอบครัว</SelectItem>
                                                                            <SelectItem value="OTHER">อื่นๆ โปรดระบุ</SelectItem>
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

                                                                <div className="space-y-2">
                                                                    <Label>เวลาทำการ <span className="text-red-500">*</span></Label>
                                                                    <div>
                                                                        <ToggleGroup
                                                                            type="multiple"
                                                                            variant="outline"
                                                                            value={((occ.seIncomes?.[0] || {}) as EnterpriseIncome).operatingHours || []}
                                                                            onValueChange={(vals) => handleUpdateSEIncomeRow(occ.id, 0, { operatingHours: vals })}
                                                                            className="w-full gap-0 -space-x-px"
                                                                        >
                                                                            {SE_OPERATING_HOURS.map((hour) => (
                                                                                <ToggleGroupItem
                                                                                    key={hour.value}
                                                                                    value={hour.value}
                                                                                    className={cn(
                                                                                        "h-11 flex-1 text-sm font-medium rounded-none first:rounded-l-xl last:rounded-r-xl transition-all",
                                                                                        "data-[state=on]:bg-chaiyo-blue data-[state=on]:text-white data-[state=on]:border-chaiyo-blue data-[state=on]:z-10",
                                                                                        "hover:bg-blue-50 hover:text-chaiyo-blue"
                                                                                    )}
                                                                                >
                                                                                    {hour.label}
                                                                                </ToggleGroupItem>
                                                                            ))}
                                                                        </ToggleGroup>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>

                                                    {occ.businessStatus !== 'closed' && (
                                                        <>
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
                                                                                <TableHead className="w-[25%] text-xs">ความถี่</TableHead>
                                                                                <TableHead className="w-[25%] text-xs">ยอดขาย (บาท)</TableHead>
                                                                                <TableHead className="w-[25%] text-xs">จำนวน</TableHead>
                                                                                <TableHead className="w-[25%] text-xs text-right pr-6">รวมยอดขายต่อเดือน</TableHead>
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
                                                                                            <Input
                                                                                                type="text"
                                                                                                value={formatNumberWithCommas(item.salesAmount ?? "")}
                                                                                                onChange={(e) => handleUpdateSEIncomeRow(occ.id, idx, { salesAmount: e.target.value })}
                                                                                                placeholder="0.00"
                                                                                                className="h-9 text-xs bg-gray-50/30 text-left font-mono"
                                                                                            />
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
                                                                                        <TableCell className="py-3 pr-6">
                                                                                            <div className="text-right text-sm font-mono font-bold text-gray-600 mt-1">
                                                                                                {formatNumberWithCommas(item.calculatedMonthly || "0")}
                                                                                            </div>
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
                                                                                <TableHead className="w-[20%] text-xs">รายละเอียดต้นทุน</TableHead>
                                                                                <TableHead className="w-[15%] text-xs">ความถี่</TableHead>
                                                                                <TableHead className="w-[15%] text-xs">ต้นทุน (บาท)</TableHead>
                                                                                <TableHead className="w-[10%] text-xs">จำนวน</TableHead>
                                                                                <TableHead className="w-[15%] text-xs text-right">รวมต่อเดือน</TableHead>
                                                                                <TableHead className="w-[5%] text-center text-xs">จัดการ</TableHead>
                                                                            </TableRow>
                                                                        </TableHeader>
                                                                        <TableBody>
                                                                            {(!occ.seCosts || occ.seCosts.length === 0) ? (
                                                                                <TableRow>
                                                                                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground italic text-xs">
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
                                                                                            <Input
                                                                                                type="text"
                                                                                                value={item.costDetail || ""}
                                                                                                onChange={(e) => handleUpdateSECostRow(occ.id, idx, { costDetail: e.target.value })}
                                                                                                placeholder="รายละเอียด"
                                                                                                className="h-9 text-xs bg-gray-50/30 text-left"
                                                                                            />
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
                                                                                            <Input
                                                                                                type="text"
                                                                                                value={formatNumberWithCommas(item.costAmount ?? 0) || ""}
                                                                                                onChange={(e) => handleUpdateSECostRow(occ.id, idx, { costAmount: e.target.value })}
                                                                                                placeholder="0.00"
                                                                                                className="h-9 text-xs bg-gray-50/30 text-left font-mono"
                                                                                            />
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
                                                                                <TableCell colSpan={5} className="text-right font-bold py-4 text-xs">
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
                                                            <div className="mt-6">
                                                                <div className="border-t border-border-strong pt-4">
                                                                    <div className="flex items-center justify-between bg-chaiyo-blue/5 text-chaiyo-blue px-6 py-4 rounded-xl border border-chaiyo-blue/20 shadow-sm">
                                                                        <span className="text-sm font-bold">รายได้สุทธิต่อเดือน:</span>
                                                                        {(() => {
                                                                            const totalIncome = (occ.seIncomes || []).reduce((acc: number, curr: EnterpriseIncome) => acc + (Number(curr.calculatedMonthly) || 0), 0);
                                                                            const totalCost = (occ.seCosts || []).reduce((acc: number, curr: EnterpriseIncome) => acc + (Number(curr.calculatedMonthly) || 0), 0);
                                                                            const netIncome = totalIncome - totalCost;
                                                                            return (
                                                                                <span className={cn(
                                                                                    "text-xl font-bold font-mono tracking-tight",
                                                                                    netIncome < 0 ? "text-red-500" : "text-chaiyo-blue"
                                                                                )}>
                                                                                    ฿{formatNumberWithCommas(netIncome)}
                                                                                </span>
                                                                            );
                                                                        })()}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            )}

                                            {/* SE Details Section: รายละเอียดกิจการ (กรณีเกษตรกร) */}
                                            {occ.employmentType === 'SE' && occ.occupationCode === 'FARMER' && (
                                                <div className="rounded-xl border border-border-color bg-gray-50/40 p-6 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                                                    <h4 className="text-base font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-border-color">
                                                        <Briefcase className="w-5 h-5 text-chaiyo-blue" /> รายละเอียดของกิจการ (เกษตรกร)
                                                    </h4>

                                                    {/* ผลผลิต Section */}
                                                    <div className="space-y-2">
                                                        <h5 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                                            ผลผลิต
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
                                                                    <Label>จำนวนรอบที่ปลูกต่อปี <span className="text-red-500">*</span></Label>
                                                                    <Input
                                                                        type="text"
                                                                        value={occ.cyclesPerYear || ""}
                                                                        onChange={(e) => handleOccupationChange(occ.id, "cyclesPerYear", e.target.value.replace(/\D/g, ''))}
                                                                        placeholder="เช่น 1"
                                                                        className="h-11 bg-gray-50/30"
                                                                    />
                                                                </div>

                                                                {/* เขตชลประทาน */}
                                                                <div className="space-y-3">
                                                                    <Label>เขตชลประทาน</Label>
                                                                    <RadioGroup
                                                                        value={occ.irrigationZone || ""}
                                                                        onValueChange={(val) => handleOccupationChange(occ.id, "irrigationZone", val)}
                                                                        className="flex items-center gap-6"
                                                                    >
                                                                        <div className="flex items-center gap-2">
                                                                            <RadioGroupItem value="outside" id={`irrigation-outside-${occ.id}`} />
                                                                            <Label htmlFor={`irrigation-outside-${occ.id}`} className="cursor-pointer font-normal">นอกเขต</Label>
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <RadioGroupItem value="inside" id={`irrigation-inside-${occ.id}`} />
                                                                            <Label htmlFor={`irrigation-inside-${occ.id}`} className="cursor-pointer font-normal">ในเขต</Label>
                                                                        </div>
                                                                    </RadioGroup>
                                                                </div>

                                                                {/* การถือครอง */}
                                                                <div className="space-y-3">
                                                                    <Label>การถือครองที่ดินทำกิน</Label>
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
                                                                    <RadioGroup
                                                                        value={occ.laborType || ""}
                                                                        onValueChange={(val) => handleOccupationChange(occ.id, "laborType", val)}
                                                                        className="flex items-center gap-6"
                                                                    >
                                                                        <div className="flex items-center gap-2">
                                                                            <RadioGroupItem value="self" id={`labor-self-${occ.id}`} />
                                                                            <Label htmlFor={`labor-self-${occ.id}`} className="cursor-pointer font-normal">ทำเอง</Label>
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <RadioGroupItem value="hire" id={`labor-hire-${occ.id}`} />
                                                                            <Label htmlFor={`labor-hire-${occ.id}`} className="cursor-pointer font-normal">จ้างทำ</Label>
                                                                        </div>
                                                                    </RadioGroup>
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
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <h5 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                                                รายได้ต่อเดือน
                                                            </h5>
                                                            <div className="flex items-center gap-2 px-3 py-1.5">
                                                                <Checkbox
                                                                    id={`farm-higher-${occ.id}`}
                                                                    checked={occ.farmIsHigherThanStandard || false}
                                                                    onCheckedChange={(checked) => handleOccupationChange(occ.id, "farmIsHigherThanStandard", !!checked)}
                                                                    className="h-4 w-4 rounded-md border-gray-300 data-[state=checked]:bg-chaiyo-blue data-[state=checked]:border-chaiyo-blue"
                                                                />
                                                                <Label htmlFor={`farm-higher-${occ.id}`} className="text-xs leading-none text-gray-700 cursor-pointer font-bold select-none">
                                                                    กรณีราคาขาย / ต้นทุน ไม่เท่ากับราคากลาง
                                                                </Label>
                                                            </div>
                                                        </div>
                                                        <div className="border border-border-strong rounded-xl overflow-hidden bg-white">
                                                            <Table>
                                                                <TableHeader className="bg-gray-50/50">
                                                                    <TableRow>
                                                                        <TableHead className="w-[40%] text-xs font-bold">รายการ</TableHead>
                                                                        <TableHead className="w-[30%] text-xs font-bold text-right text-gray-500">ราคากลาง</TableHead>
                                                                        {occ.farmIsHigherThanStandard && (
                                                                            <TableHead className="w-[30%] text-xs font-bold text-right pr-6 text-chaiyo-blue bg-blue-50/50">ราคาของลูกค้า</TableHead>
                                                                        )}
                                                                    </TableRow>
                                                                </TableHeader>
                                                                <TableBody>
                                                                    {(() => {
                                                                        const std = FARM_STANDARD_PRICES[occ.produceType || "others"] || { sales: 0, cost: 0 };

                                                                        const totalAreaRai = Number(occ.cultivationAreaRai || 0) + (Number(occ.cultivationAreaNgan || 0) / 4) + (Number(occ.cultivationAreaSqWa || 0) / 400);
                                                                        const cycles = Number(occ.cyclesPerYear || 1);
                                                                        const laborers = Number(occ.laborCount || 1) || 1; // avoid divide by zero

                                                                        const customerSales = occ.farmIsHigherThanStandard ? (occ.customerSalesPerRai ? Number(occ.customerSalesPerRai) : std.sales) : std.sales;
                                                                        const customerCost = occ.farmIsHigherThanStandard ? (occ.customerCostPerRai ? Number(occ.customerCostPerRai) : std.cost) : std.cost;

                                                                        const stdIncome = (((std.sales - std.cost) * totalAreaRai * cycles) / 12) / laborers;
                                                                        const customerIncome = (((customerSales - customerCost) * totalAreaRai * cycles) / 12) / laborers;

                                                                        return (
                                                                            <>
                                                                                <TableRow className="hover:bg-gray-50/30">
                                                                                    <TableCell className="py-3 text-xs font-medium text-gray-700">ขายได้ต่อไร่ต่อรอบ (บาท)</TableCell>
                                                                                    <TableCell className="py-3 text-xs text-right font-mono text-muted-foreground">{formatNumberWithCommas(std.sales)}</TableCell>
                                                                                    {occ.farmIsHigherThanStandard && (
                                                                                        <TableCell className="py-3 text-right pr-6 bg-blue-50/10">
                                                                                            <Input
                                                                                                type="text"
                                                                                                value={formatNumberWithCommas(occ.customerSalesPerRai || "")}
                                                                                                onChange={(e) => {
                                                                                                    const cleaned = e.target.value.replace(/,/g, '');
                                                                                                    if (/^\d*\.?\d*$/.test(cleaned)) {
                                                                                                        handleOccupationChange(occ.id, "customerSalesPerRai", cleaned);
                                                                                                    }
                                                                                                }}
                                                                                                className="h-8 text-[11px] bg-white font-mono text-right w-32 ml-auto"
                                                                                                placeholder="0.00"
                                                                                            />
                                                                                        </TableCell>
                                                                                    )}
                                                                                </TableRow>
                                                                                <TableRow className="hover:bg-gray-50/30 border-b">
                                                                                    <TableCell className="py-3 text-xs font-medium text-gray-700">ต้นทุนต่อไร่ต่อรอบ (บาท)</TableCell>
                                                                                    <TableCell className="py-3 text-xs text-right font-mono text-muted-foreground">{formatNumberWithCommas(std.cost)}</TableCell>
                                                                                    {occ.farmIsHigherThanStandard && (
                                                                                        <TableCell className="py-3 text-right pr-6 bg-blue-50/10">
                                                                                            <Input
                                                                                                type="text"
                                                                                                value={formatNumberWithCommas(occ.customerCostPerRai || "")}
                                                                                                onChange={(e) => {
                                                                                                    const cleaned = e.target.value.replace(/,/g, '');
                                                                                                    if (/^\d*\.?\d*$/.test(cleaned)) {
                                                                                                        handleOccupationChange(occ.id, "customerCostPerRai", cleaned);
                                                                                                    }
                                                                                                }}
                                                                                                className="h-8 text-[11px] bg-white font-mono text-right w-32 ml-auto"
                                                                                                placeholder="0.00"
                                                                                            />
                                                                                        </TableCell>
                                                                                    )}
                                                                                </TableRow>
                                                                                <TableRow className="bg-emerald-50/50 hover:bg-emerald-50/50 transition-none">
                                                                                    <TableCell className="py-4 text-xs font-bold text-emerald-800">รายได้ต่อเดือน (บาท)</TableCell>
                                                                                    <TableCell className="py-4 text-sm text-right font-bold font-mono text-emerald-700">{formatNumberWithCommas(Math.max(0, stdIncome).toFixed(2))}</TableCell>
                                                                                    {occ.farmIsHigherThanStandard && (
                                                                                        <TableCell className="py-4 text-right pr-6 bg-emerald-50/80">
                                                                                            <div className="text-sm font-bold font-mono text-emerald-700">
                                                                                                {formatNumberWithCommas(Math.max(0, customerIncome).toFixed(2))}
                                                                                            </div>
                                                                                        </TableCell>
                                                                                    )}
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
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <h5 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                                                ตารางสรุปช่วงเวลาและผลผลิต
                                                            </h5>
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                                                    <div className="w-3 h-3 rounded-md bg-chaiyo-blue shadow-sm"></div>
                                                                    <span>เลือกแล้ว</span>
                                                                </div>
                                                                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                                                    <div className="w-3 h-3 rounded-md border border-gray-300 bg-white"></div>
                                                                    <span>ยังไม่ได้เลือก</span>
                                                                </div>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const reset = FARM_STAGES.map(stage => ({ stage, selectedMonths: [] }));
                                                                        handleOccupationChange(occ.id, "produceSummary", reset);
                                                                    }}
                                                                    className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-red-500 transition-colors ml-1"
                                                                >
                                                                    <RotateCcw className="w-3 h-3" />
                                                                    <span>รีเซ็ต</span>
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        <div className="border border-border-strong rounded-xl overflow-x-auto bg-white ">
                                                            <Table className="min-w-full lg:min-w-[1000px] border-collapse">
                                                                <TableHeader className="bg-gray-50/80">
                                                                    <TableRow className="hover:bg-transparent border-b border-border-strong">
                                                                        <TableHead className="w-[180px] min-w-[180px] text-xs font-bold text-gray-800 border-r border-border-subtle bg-gray-50 sticky left-0 z-10">
                                                                            กิจกรรม/ช่วงการเพาะปลูก
                                                                        </TableHead>
                                                                        {THAI_MONTHS_SHORT.map(m => (
                                                                            <TableHead key={m} className="text-center p-0 text-[10px] font-bold text-gray-600 border-r border-border-subtle last:border-r-0 min-w-[55px] h-10">
                                                                                {m}
                                                                            </TableHead>
                                                                        ))}
                                                                    </TableRow>
                                                                </TableHeader>
                                                                <TableBody>
                                                                    {(() => {
                                                                        const produceRows = (occ.produceSummary && occ.produceSummary.length === FARM_STAGES.length)
                                                                            ? occ.produceSummary
                                                                            : FARM_STAGES.map(stage => ({ stage, selectedMonths: [] }));

                                                                        return produceRows.map((item: any, rowIdx: number) => {
                                                                            const handleMonthClick = (monthStr: string) => {
                                                                                const updated = [...produceRows];
                                                                                const row = { ...updated[rowIdx] };

                                                                                // Handle transitioning from old range data to array if necessary
                                                                                let currentSelected = Array.isArray(row.selectedMonths) ? [...row.selectedMonths] : [];

                                                                                if (currentSelected.includes(monthStr)) {
                                                                                    currentSelected = currentSelected.filter(m => m !== monthStr);
                                                                                } else {
                                                                                    currentSelected.push(monthStr);
                                                                                }

                                                                                row.selectedMonths = currentSelected;
                                                                                updated[rowIdx] = row;
                                                                                handleOccupationChange(occ.id, "produceSummary", updated);
                                                                            };

                                                                            return (
                                                                                <TableRow key={rowIdx} className="hover:bg-gray-50/20 group transition-colors border-b border-border-subtle last:border-b-0">
                                                                                    <TableCell className="py-4 px-4 font-semibold text-xs text-gray-700 bg-white border-r border-border-subtle sticky left-0 z-10">
                                                                                        {item.stage}
                                                                                    </TableCell>
                                                                                    {THAI_MONTHS_SHORT.map((m, monthIdx) => {
                                                                                        const isSelected = Array.isArray(item.selectedMonths) && item.selectedMonths.includes(m);

                                                                                        return (
                                                                                            <TableCell key={monthIdx} className="p-0 text-center border-r border-border-subtle last:border-r-0 h-[52px]">
                                                                                                <button
                                                                                                    type="button"
                                                                                                    onClick={() => handleMonthClick(m)}
                                                                                                    className={cn(
                                                                                                        "w-full h-full flex flex-col items-center justify-center transition-all duration-150 relative group/btn",
                                                                                                        isSelected ? "bg-chaiyo-blue text-white" : "hover:bg-chaiyo-blue/5 text-gray-400"
                                                                                                    )}
                                                                                                >
                                                                                                    <span className={cn(
                                                                                                        "text-[10px] font-bold transition-transform",
                                                                                                        isSelected ? "scale-110" : "scale-100 opacity-30 group-hover/btn:opacity-100"
                                                                                                    )}>
                                                                                                        {m}
                                                                                                    </span>

                                                                                                    {isSelected && (
                                                                                                        <div className="absolute top-1 right-1">
                                                                                                            <div className="w-1.5 h-1.5 rounded-full bg-white opacity-50" />
                                                                                                        </div>
                                                                                                    )}
                                                                                                </button>
                                                                                            </TableCell>
                                                                                        );
                                                                                    })}
                                                                                </TableRow>
                                                                            );
                                                                        });
                                                                    })()}
                                                                </TableBody>
                                                            </Table>
                                                        </div>
                                                        <p className="text-[10px] text-muted-foreground italic px-1">
                                                            * แตะที่แต่ละเดือนเพื่อเลือกหรือยกเลิกการเลือกช่วงเวลา (เลือกได้หลายเดือนแบบอิสระ)
                                                        </p>
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
                                                                <Select
                                                                    value={occ.farmingType || ""}
                                                                    onValueChange={(val) => handleOccupationChange(occ.id, "farmingType", val)}
                                                                >
                                                                    <SelectTrigger className="h-11 bg-white">
                                                                        <SelectValue placeholder="เลือกประเภทการเลี้ยง" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="contract"> เลี้ยงแบบมีสัญญา (Contract farming)</SelectItem>
                                                                        <SelectItem value="self">เลี้ยงเอง</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>

                                                            <div className="space-y-2">
                                                                <Label>จำนวนรอบใน 1 ปี <span className="text-red-500">*</span> <span className="text-muted-foreground text-[10px] font-normal">(สูงสุด 12 รอบ)</span></Label>
                                                                <Input
                                                                    type="text"
                                                                    value={occ.livestockCyclesPerYear || ""}
                                                                    onChange={(e) => {
                                                                        const val = e.target.value.replace(/\D/g, '');
                                                                        const num = val === "" ? 0 : Math.min(12, parseInt(val));
                                                                        handleOccupationChange(occ.id, "livestockCyclesPerYear", num > 0 ? String(num) : "");

                                                                        // Sync rows
                                                                        const currentCycles = occ.livestockCycles || [];
                                                                        let newCycles = [...currentCycles];
                                                                        if (newCycles.length < num) {
                                                                            for (let i = newCycles.length; i < num; i++) {
                                                                                newCycles.push({
                                                                                    cycleNo: i + 1,
                                                                                    quantity: "",
                                                                                    isHigherThanStandard: false,
                                                                                    customerPrice: "",
                                                                                    customerCost: "",
                                                                                    incomeBeforeExpenses: "",
                                                                                    incomeAfterExpenses: "",
                                                                                    otherExpenses: "",
                                                                                    netIncome: "0"
                                                                                });
                                                                            }
                                                                        } else if (newCycles.length > num) {
                                                                            newCycles = newCycles.slice(0, num);
                                                                        }
                                                                        handleOccupationChange(occ.id, "livestockCycles", newCycles);
                                                                    }}
                                                                    placeholder="ระบุจำนวนรอบ"
                                                                    className="h-11 bg-white"
                                                                />
                                                            </div>

                                                            {occ.farmingType === 'self' && (
                                                                <div className="space-y-2 animate-in fade-in slide-in-from-left-4 duration-300">
                                                                    <Label>หน่วย <span className="text-red-500">*</span></Label>
                                                                    <Select
                                                                        value={occ.livestockUnit || ""}
                                                                        onValueChange={(val) => handleOccupationChange(occ.id, "livestockUnit", val)}
                                                                    >
                                                                        <SelectTrigger className="h-11 bg-white">
                                                                            <SelectValue placeholder="เลือกหน่วย" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="head">ตัว</SelectItem>
                                                                            <SelectItem value="cycle">รอบ</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Livestock Cycles Tables (One per cycle) */}
                                                    {(occ.farmingType === 'self' || occ.farmingType === 'contract') && (occ.livestockCycles || []).length > 0 && (
                                                        <div className="space-y-8 pt-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                                            <div className="flex items-center justify-between">
                                                                <h5 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                                                    <TrendingUp className="w-4 h-4 text-emerald-600" /> ตารางรายละเอียดรายรอบ
                                                                </h5>
                                                                <p className="text-[10px] text-muted-foreground italic">
                                                                    (กรอกข้อมูลแยกตามรอบการเลี้ยง)
                                                                </p>
                                                            </div>

                                                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                                                {(occ.livestockCycles || []).map((cycle, idx) => {
                                                                    const std = LIVESTOCK_STANDARD_PRICES[occ.livestockType || "others"] || { sales: 0, cost: 0 };

                                                                    const updateCycle = (updates: Partial<typeof cycle>) => {
                                                                        const updatedCycles = [...(occ.livestockCycles || [])];
                                                                        const newRow = { ...cycle, ...updates };

                                                                        if (occ.farmingType === 'self') {
                                                                            const isAquatic = AQUATIC_TYPES.includes(occ.livestockType || '');
                                                                            let finalPrice: number, finalCost: number;

                                                                            if (isAquatic) {
                                                                                finalPrice = Number(updates.customerPrice !== undefined ? updates.customerPrice : cycle.customerPrice) || 0;
                                                                                finalCost = Number(updates.customerCost !== undefined ? updates.customerCost : cycle.customerCost) || 0;
                                                                            } else {
                                                                                const finalIsHigher = updates.isHigherThanStandard !== undefined ? updates.isHigherThanStandard : cycle.isHigherThanStandard;
                                                                                finalPrice = finalIsHigher ? (Number(updates.customerPrice !== undefined ? updates.customerPrice : cycle.customerPrice) || std.sales) : std.sales;
                                                                                finalCost = finalIsHigher ? (Number(updates.customerCost !== undefined ? updates.customerCost : cycle.customerCost) || std.cost) : std.cost;
                                                                            }
                                                                            const finalQ = Number(updates.quantity !== undefined ? updates.quantity : cycle.quantity) || 0;
                                                                            newRow.netIncome = String((finalPrice - finalCost) * finalQ);
                                                                        } else {
                                                                            const finalAfter = Number(updates.incomeAfterExpenses !== undefined ? updates.incomeAfterExpenses : cycle.incomeAfterExpenses) || 0;
                                                                            const finalOther = Number(updates.otherExpenses !== undefined ? updates.otherExpenses : cycle.otherExpenses) || 0;
                                                                            newRow.netIncome = String(finalAfter - finalOther);
                                                                        }

                                                                        updatedCycles[idx] = newRow;
                                                                        handleOccupationChange(occ.id, "livestockCycles", updatedCycles);
                                                                    };

                                                                    const q = Number(cycle.quantity) || 0;
                                                                    const effectivePrice = cycle.isHigherThanStandard ? (Number(cycle.customerPrice) || std.sales) : std.sales;
                                                                    const effectiveCost = cycle.isHigherThanStandard ? (Number(cycle.customerCost) || std.cost) : std.cost;
                                                                    const stdNet = (std.sales - std.cost) * q;
                                                                    const custNet = (effectivePrice - effectiveCost) * q;

                                                                    return (
                                                                        <div key={idx} className="bg-white border rounded-2xl overflow-hidden">
                                                                            <div className="bg-gray-50/80 border-b border-border-subtle p-4 flex items-center justify-between">
                                                                                <div className="flex items-center gap-3">
                                                                                    <div className="flex h-8 items-center justify-center rounded-lg bg-chaiyo-blue text-white font-bold text-sm shadow-sm px-3 gap-1">
                                                                                        <span className="text-[10px] font-medium text-white/70">รอบที่</span> {cycle.cycleNo}
                                                                                    </div>
                                                                                    {occ.farmingType !== 'contract' && (
                                                                                        <div className="flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-lg border border-border-subtle">
                                                                                            <Label className="text-[11px] font-bold text-gray-700">{occ.livestockUnit === 'cycle' ? 'จำนวนรอบ' : 'จำนวนตัว'}</Label>
                                                                                            <div className="relative w-28">
                                                                                                <Input
                                                                                                    type="text"
                                                                                                    value={formatNumberWithCommas(cycle.quantity || "")}
                                                                                                    onChange={(e) => updateCycle({ quantity: e.target.value.replace(/,/g, '') })}
                                                                                                    className="h-8 text-right font-mono text-xs pr-7 bg-white"
                                                                                                    placeholder="0"
                                                                                                />
                                                                                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold">{occ.livestockUnit === 'cycle' ? 'รอบ' : 'ตัว'}</span>
                                                                                            </div>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                                {occ.farmingType === 'self' && (
                                                                                    <div className="flex items-center gap-2 px-3 py-1.5">
                                                                                        <Checkbox
                                                                                            id={`higher-${occ.id}-${idx}`}
                                                                                            checked={cycle.isHigherThanStandard}
                                                                                            onCheckedChange={(checked) => updateCycle({ isHigherThanStandard: !!checked })}
                                                                                            className="h-4 w-4 rounded-md border-gray-300 data-[state=checked]:bg-chaiyo-blue data-[state=checked]:border-chaiyo-blue"
                                                                                        />
                                                                                        <Label htmlFor={`higher-${occ.id}-${idx}`} className="text-[11px] leading-none text-gray-700 cursor-pointer font-bold select-none">
                                                                                            กรณีราคาขาย / ต้นทุน ไม่เท่ากับราคากลาง
                                                                                        </Label>
                                                                                    </div>
                                                                                )}
                                                                            </div>

                                                                            <div className="p-5 space-y-4">
                                                                                {occ.farmingType === 'self' ? (
                                                                                    <>

                                                                                        {AQUATIC_TYPES.includes(occ.livestockType || '') ? (
                                                                                            /* Aquatic types: user inputs sales, cost auto-prefilled with 15% margin */
                                                                                            <div className="rounded-xl border border-border-subtle overflow-hidden">
                                                                                                <Table>
                                                                                                    <TableHeader className="bg-gray-50/50">
                                                                                                        <TableRow className="hover:bg-transparent h-10">
                                                                                                            <TableHead className="text-[10px] font-bold py-0 h-10 w-[50%]">รายการ</TableHead>
                                                                                                            <TableHead className="text-[10px] font-bold text-right py-0 h-10 w-[50%] pr-4">จำนวนเงิน (บาท)</TableHead>
                                                                                                        </TableRow>
                                                                                                    </TableHeader>
                                                                                                    <TableBody>
                                                                                                        <TableRow className="hover:bg-transparent border-border-subtle">
                                                                                                            <TableCell className="text-xs py-3 font-medium text-gray-700">{`ราคาขาย/${occ.livestockUnit === 'cycle' ? 'รอบ' : 'ตัว'} (บาท)`}</TableCell>
                                                                                                            <TableCell className="text-xs py-2 text-right pr-4">
                                                                                                                <Input
                                                                                                                    type="text"
                                                                                                                    value={formatNumberWithCommas(cycle.customerPrice || "")}
                                                                                                                    onChange={(e) => {
                                                                                                                        const cleaned = e.target.value.replace(/,/g, '');
                                                                                                                        if (/^\d*\.?\d*$/.test(cleaned)) {
                                                                                                                            const salesVal = Number(cleaned) || 0;
                                                                                                                            const autoCost = String(Math.round(salesVal * 0.85 * 100) / 100);
                                                                                                                            updateCycle({ customerPrice: cleaned, customerCost: autoCost });
                                                                                                                        }
                                                                                                                    }}
                                                                                                                    className="h-8 w-32 text-right ml-auto text-xs font-mono border-gray-200"
                                                                                                                    placeholder="0.00"
                                                                                                                />
                                                                                                            </TableCell>
                                                                                                        </TableRow>
                                                                                                        <TableRow className="hover:bg-transparent border-border-subtle">
                                                                                                            <TableCell className="text-xs py-3 font-medium text-gray-700">
                                                                                                                <div className="flex items-center gap-1.5">
                                                                                                                    {`ต้นทุน/${occ.livestockUnit === 'cycle' ? 'รอบ' : 'ตัว'} (บาท)`}
                                                                                                                    <span className="text-[9px] text-muted-foreground italic">(ราคาขาย × 85%)</span>
                                                                                                                </div>
                                                                                                            </TableCell>
                                                                                                            <TableCell className="text-xs py-2 text-right pr-4">
                                                                                                                <Input
                                                                                                                    type="text"
                                                                                                                    value={formatNumberWithCommas(cycle.customerCost || "")}
                                                                                                                    onChange={(e) => {
                                                                                                                        const cleaned = e.target.value.replace(/,/g, '');
                                                                                                                        if (/^\d*\.?\d*$/.test(cleaned)) {
                                                                                                                            updateCycle({ customerCost: cleaned });
                                                                                                                        }
                                                                                                                    }}
                                                                                                                    className="h-8 w-32 text-right ml-auto text-xs font-mono border-gray-200"
                                                                                                                    placeholder="0.00"
                                                                                                                />
                                                                                                            </TableCell>
                                                                                                        </TableRow>
                                                                                                        <TableRow className="bg-emerald-50/30 hover:bg-emerald-50/50 transition-colors">
                                                                                                            <TableCell className="text-xs py-4 font-bold text-emerald-800">รายได้สุทธิ</TableCell>
                                                                                                            <TableCell className="text-sm py-4 text-right pr-4 font-black font-mono text-emerald-600">
                                                                                                                {formatNumberWithCommas(((Number(cycle.customerPrice) || 0) - (Number(cycle.customerCost) || 0)) * (Number(cycle.quantity) || 0))}
                                                                                                            </TableCell>
                                                                                                        </TableRow>
                                                                                                    </TableBody>
                                                                                                </Table>
                                                                                            </div>
                                                                                        ) : (
                                                                                            /* Non-aquatic types: standard/customer price table */
                                                                                            <div className="rounded-xl border border-border-subtle overflow-hidden">
                                                                                                <Table>
                                                                                                    <TableHeader className="bg-gray-50/50">
                                                                                                        <TableRow className="hover:bg-transparent h-10">
                                                                                                            <TableHead className="text-[10px] font-bold py-0 h-10 w-[35%]">รายการ</TableHead>
                                                                                                            <TableHead className="text-[10px] font-bold text-right py-0 h-10 w-[30%] text-gray-500">ราคากลาง</TableHead>
                                                                                                            {cycle.isHigherThanStandard && (
                                                                                                                <TableHead className="text-[10px] font-bold text-right py-0 h-10 w-[35%] text-chaiyo-blue pr-4 bg-blue-50/50">ราคาลูกค้า</TableHead>
                                                                                                            )}
                                                                                                        </TableRow>
                                                                                                    </TableHeader>
                                                                                                    <TableBody>
                                                                                                        <TableRow className="hover:bg-transparent border-border-subtle">
                                                                                                            <TableCell className="text-xs py-3 font-medium text-gray-700">{`ราคาขาย/${occ.livestockUnit === 'cycle' ? 'รอบ' : 'ตัว'} (บาท)`}</TableCell>
                                                                                                            <TableCell className="text-xs py-3 text-right font-mono text-gray-400">
                                                                                                                {formatNumberWithCommas(std.sales)}
                                                                                                            </TableCell>
                                                                                                            {cycle.isHigherThanStandard && (
                                                                                                                <TableCell className="text-xs py-2 text-right pr-4 bg-blue-50/10">
                                                                                                                    <Input
                                                                                                                        type="text"
                                                                                                                        value={formatNumberWithCommas(cycle.customerPrice || "")}
                                                                                                                        onChange={(e) => updateCycle({ customerPrice: e.target.value.replace(/,/g, '') })}
                                                                                                                        className="h-8 w-full text-right text-xs font-mono border-chaiyo-blue/20"
                                                                                                                        placeholder="0.00"
                                                                                                                    />
                                                                                                                </TableCell>
                                                                                                            )}
                                                                                                        </TableRow>
                                                                                                        <TableRow className="hover:bg-transparent border-border-subtle">
                                                                                                            <TableCell className="text-xs py-3 font-medium text-gray-700">{`ราคาต้นทุน/${occ.livestockUnit === 'cycle' ? 'รอบ' : 'ตัว'} (บาท)`}</TableCell>
                                                                                                            <TableCell className="text-xs py-3 text-right font-mono text-gray-400">
                                                                                                                {formatNumberWithCommas(std.cost)}
                                                                                                            </TableCell>
                                                                                                            {cycle.isHigherThanStandard && (
                                                                                                                <TableCell className="text-xs py-2 text-right pr-4 bg-blue-50/10">
                                                                                                                    <Input
                                                                                                                        type="text"
                                                                                                                        value={formatNumberWithCommas(cycle.customerCost || "")}
                                                                                                                        onChange={(e) => updateCycle({ customerCost: e.target.value.replace(/,/g, '') })}
                                                                                                                        className="h-8 w-full text-right text-xs font-mono border-chaiyo-blue/20"
                                                                                                                        placeholder="0.00"
                                                                                                                    />
                                                                                                                </TableCell>
                                                                                                            )}
                                                                                                        </TableRow>
                                                                                                        <TableRow className="bg-emerald-50/30 hover:bg-emerald-50/50 transition-colors">
                                                                                                            <TableCell className="text-xs py-4 font-bold text-emerald-800">รายได้สุทธิ</TableCell>
                                                                                                            <TableCell className="text-xs py-4 text-right font-mono text-emerald-600/60 font-medium">
                                                                                                                {formatNumberWithCommas(stdNet.toFixed(2))}
                                                                                                            </TableCell>
                                                                                                            {cycle.isHigherThanStandard && (
                                                                                                                <TableCell className="text-sm py-4 text-right pr-4 font-black font-mono text-emerald-600 bg-emerald-100/20">
                                                                                                                    {formatNumberWithCommas(custNet.toFixed(2))}
                                                                                                                </TableCell>
                                                                                                            )}
                                                                                                        </TableRow>
                                                                                                    </TableBody>
                                                                                                </Table>
                                                                                            </div>
                                                                                        )}
                                                                                    </>
                                                                                ) : (
                                                                                    <div className="rounded-xl border border-border-subtle overflow-hidden">
                                                                                        <Table>
                                                                                            <TableHeader className="bg-gray-50/50">
                                                                                                <TableRow className="hover:bg-transparent h-10">
                                                                                                    <TableHead className="text-[10px] font-bold py-0 h-10">รายการ</TableHead>
                                                                                                    <TableHead className="text-[10px] font-bold text-right py-0 h-10 pr-4">จำนวนเงิน (บาท)</TableHead>
                                                                                                </TableRow>
                                                                                            </TableHeader>
                                                                                            <TableBody>
                                                                                                <TableRow className="hover:bg-transparent border-border-subtle">
                                                                                                    <TableCell className="text-xs py-3 font-medium text-gray-700">รายได้ก่อนหักค่าใช้จ่าย</TableCell>
                                                                                                    <TableCell className="text-xs py-2 text-right pr-4">
                                                                                                        <Input
                                                                                                            type="text"
                                                                                                            value={formatNumberWithCommas(cycle.incomeBeforeExpenses || "")}
                                                                                                            onChange={(e) => updateCycle({ incomeBeforeExpenses: e.target.value.replace(/,/g, '') })}
                                                                                                            className="h-8 w-32 text-right ml-auto text-xs font-mono border-gray-200"
                                                                                                            placeholder="0.00"
                                                                                                        />
                                                                                                    </TableCell>
                                                                                                </TableRow>
                                                                                                <TableRow className="hover:bg-transparent border-border-subtle">
                                                                                                    <TableCell className="text-xs py-3 font-medium text-gray-700">รายได้หลังหักค่าใช้จ่าย</TableCell>
                                                                                                    <TableCell className="text-xs py-2 text-right pr-4">
                                                                                                        <Input
                                                                                                            type="text"
                                                                                                            value={formatNumberWithCommas(cycle.incomeAfterExpenses || "")}
                                                                                                            onChange={(e) => updateCycle({ incomeAfterExpenses: e.target.value.replace(/,/g, '') })}
                                                                                                            className="h-8 w-32 text-right ml-auto text-xs font-mono border-gray-200"
                                                                                                            placeholder="0.00"
                                                                                                        />
                                                                                                    </TableCell>
                                                                                                </TableRow>
                                                                                                <TableRow className="hover:bg-transparent border-border-subtle">
                                                                                                    <TableCell className="text-xs py-3 font-medium text-gray-700">ค่าใช้จ่ายอื่นๆ</TableCell>
                                                                                                    <TableCell className="text-xs py-2 text-right pr-4">
                                                                                                        <Input
                                                                                                            type="text"
                                                                                                            value={formatNumberWithCommas(cycle.otherExpenses || "")}
                                                                                                            onChange={(e) => updateCycle({ otherExpenses: e.target.value.replace(/,/g, '') })}
                                                                                                            className="h-8 w-32 text-right ml-auto text-xs font-mono border-gray-200"
                                                                                                            placeholder="0.00"
                                                                                                        />
                                                                                                    </TableCell>
                                                                                                </TableRow>
                                                                                                <TableRow className="bg-emerald-50/30 hover:bg-emerald-50/50 transition-colors">
                                                                                                    <TableCell className="text-xs py-4 font-bold text-emerald-800">รายได้สุทธิต่อรอบ</TableCell>
                                                                                                    <TableCell className="text-sm py-4 text-right pr-4 font-black font-mono text-emerald-600">
                                                                                                        {formatNumberWithCommas(cycle.netIncome || "0.00")}
                                                                                                    </TableCell>
                                                                                                </TableRow>
                                                                                            </TableBody>
                                                                                        </Table>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>

                                                            {/* Monthly Income Summary Block */}
                                                            <div className="pb-8 mt-4 border-b border-border-subtle/50">
                                                                <div className="pt-2">
                                                                    <div className="flex items-center justify-between bg-chaiyo-blue/5 text-chaiyo-blue px-6 py-4 rounded-xl border border-chaiyo-blue/20 shadow-sm">
                                                                        <span className="text-sm font-bold">รายได้ต่อเดือนปศุสัตว์:</span>
                                                                        <span className="text-xl font-bold font-mono tracking-tight">
                                                                            ฿{formatNumberWithCommas((((occ.livestockCycles || []).reduce((acc, c) => acc + (Number(c.netIncome) || 0), 0)) / 12).toFixed(2))}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* ตารางสรุปช่วงเวลาการเลี้ยงสัตว์ */}
                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <h5 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                                                <TrendingUp className="w-4 h-4 text-chaiyo-blue" /> ตารางสรุปช่วงเวลาและผลผลิต
                                                            </h5>
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                                                    <div className="w-3 h-3 rounded-md bg-chaiyo-blue shadow-sm"></div>
                                                                    <span>เลือกแล้ว</span>
                                                                </div>
                                                                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                                                    <div className="w-3 h-3 rounded-md border border-gray-300 bg-white"></div>
                                                                    <span>ยังไม่ได้เลือก</span>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const LIVESTOCK_STAGES = ["เพาะเลี้ยง", "ขาย"];
                                                                        const reset = LIVESTOCK_STAGES.map(stage => ({ stage, selectedMonths: [] }));
                                                                        handleOccupationChange(occ.id, "livestockSchedule", reset);
                                                                    }}
                                                                    className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-red-500 transition-colors ml-1"
                                                                >
                                                                    <RotateCcw className="w-3 h-3" />
                                                                    <span>รีเซ็ต</span>
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="border border-border-strong rounded-xl overflow-x-auto bg-white">
                                                            <Table className="min-w-full lg:min-w-[1000px] border-collapse">
                                                                <TableHeader className="bg-gray-50/80">
                                                                    <TableRow className="hover:bg-transparent border-b border-border-strong">
                                                                        <TableHead className="w-[180px] min-w-[180px] text-xs font-bold text-gray-800 border-r border-border-subtle bg-gray-50 sticky left-0 z-10">
                                                                            กิจกรรม/ช่วงการเลี้ยง
                                                                        </TableHead>
                                                                        {THAI_MONTHS_SHORT.map(m => (
                                                                            <TableHead key={m} className="text-center p-0 text-[10px] font-bold text-gray-600 border-r border-border-subtle last:border-r-0 min-w-[55px] h-10">
                                                                                {m}
                                                                            </TableHead>
                                                                        ))}
                                                                    </TableRow>
                                                                </TableHeader>
                                                                <TableBody>
                                                                    {(() => {
                                                                        const LIVESTOCK_STAGES = ["เพาะเลี้ยง", "ขาย"];
                                                                        const livestockScheduleRows = (occ.livestockSchedule && occ.livestockSchedule.length === LIVESTOCK_STAGES.length)
                                                                            ? occ.livestockSchedule
                                                                            : LIVESTOCK_STAGES.map(stage => ({ stage, selectedMonths: [] }));

                                                                        return livestockScheduleRows.map((item: any, rowIdx: number) => {
                                                                            const handleMonthClick = (monthStr: string) => {
                                                                                const updated = [...livestockScheduleRows];
                                                                                const row = { ...updated[rowIdx] };
                                                                                let currentSelected = Array.isArray(row.selectedMonths) ? [...row.selectedMonths] : [];
                                                                                if (currentSelected.includes(monthStr)) {
                                                                                    currentSelected = currentSelected.filter((m: string) => m !== monthStr);
                                                                                } else {
                                                                                    currentSelected.push(monthStr);
                                                                                }
                                                                                row.selectedMonths = currentSelected;
                                                                                updated[rowIdx] = row;
                                                                                handleOccupationChange(occ.id, "livestockSchedule", updated);
                                                                            };

                                                                            return (
                                                                                <TableRow key={rowIdx} className="hover:bg-gray-50/20 group transition-colors border-b border-border-subtle last:border-b-0">
                                                                                    <TableCell className="py-4 px-4 font-semibold text-xs text-gray-700 bg-white border-r border-border-subtle sticky left-0 z-10">
                                                                                        {item.stage}
                                                                                    </TableCell>
                                                                                    {THAI_MONTHS_SHORT.map((m, monthIdx) => {
                                                                                        const isSelected = Array.isArray(item.selectedMonths) && item.selectedMonths.includes(m);
                                                                                        return (
                                                                                            <TableCell key={monthIdx} className="p-0 text-center border-r border-border-subtle last:border-r-0 h-[52px]">
                                                                                                <button
                                                                                                    type="button"
                                                                                                    onClick={() => handleMonthClick(m)}
                                                                                                    className={cn(
                                                                                                        "w-full h-full flex flex-col items-center justify-center transition-all duration-150 relative group/btn",
                                                                                                        isSelected ? "bg-chaiyo-blue text-white" : "hover:bg-chaiyo-blue/5 text-gray-400"
                                                                                                    )}
                                                                                                >
                                                                                                    <span className={cn(
                                                                                                        "text-[10px] font-bold transition-transform",
                                                                                                        isSelected ? "scale-110" : "scale-100 opacity-30 group-hover/btn:opacity-100"
                                                                                                    )}>
                                                                                                        {m}
                                                                                                    </span>
                                                                                                    {isSelected && (
                                                                                                        <div className="absolute top-1 right-1">
                                                                                                            <div className="w-1.5 h-1.5 rounded-full bg-white opacity-50" />
                                                                                                        </div>
                                                                                                    )}
                                                                                                </button>
                                                                                            </TableCell>
                                                                                        );
                                                                                    })}
                                                                                </TableRow>
                                                                            );
                                                                        });
                                                                    })()}
                                                                </TableBody>
                                                            </Table>
                                                        </div>
                                                        <p className="text-[10px] text-muted-foreground italic px-1">
                                                            * แตะที่แต่ละเดือนเพื่อเลือกหรือยกเลิกการเลือกช่วงเวลา (เลือกได้หลายเดือนแบบอิสระ)
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                    {/* อัพโหลดรูปประกอบกิจการ — hide for unemployed and closed business */}
                                    {occ.occupationCode !== 'UNEMPLOYED' && occ.businessStatus !== 'closed' && (
                                        <div className="rounded-xl border border-border-color bg-gray-50/40 p-6 space-y-4">
                                            <h4 className="text-base font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-border-color">
                                                <ImagePlus className="w-5 h-5 text-chaiyo-blue" /> อัพโหลดรูปประกอบกิจการ
                                            </h4>



                                            <div className="grid grid-cols-2 gap-x-6 gap-y-8">
                                                {PHOTO_GUIDES.map((guide) => {
                                                    const raw = formData.incomePhotos?.[guide.id];
                                                    const photos: string[] = Array.isArray(raw) ? raw : raw ? [raw] : [];
                                                    const hasPhotos = photos.length > 0;
                                                    return (
                                                        <div key={guide.id} className="space-y-3">
                                                            {/* 1. Label and Info Icon for Guidelines */}
                                                            <div className="flex items-center justify-between group">
                                                                <Label className="text-sm font-bold text-gray-700 flex items-center gap-1.5 cursor-default truncate">
                                                                    {guide.title}
                                                                    {guide.required && <span className="text-red-500 ml-0.5">*</span>}
                                                                    {hasPhotos && (
                                                                        <span className="ml-1.5 text-[10px] font-bold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded-full">
                                                                            {photos.length}
                                                                        </span>
                                                                    )}
                                                                </Label>
                                                                <Dialog>
                                                                    <DialogTrigger asChild>
                                                                        <button
                                                                            onClick={(e) => e.stopPropagation()}
                                                                            className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-chaiyo-blue hover:bg-blue-50 transition-all opacity-100 lg:opacity-60 group-hover:opacity-100 shrink-0"
                                                                            title="ดูคำแนะนำการถ่ายภาพ"
                                                                        >
                                                                            <Info className="w-4 h-4" />
                                                                        </button>
                                                                    </DialogTrigger>
                                                                    <DialogContent className="max-w-md">
                                                                        <DialogHeader>
                                                                            <DialogTitle className="flex items-center gap-2">
                                                                                <div className="w-8 h-8 rounded-lg bg-chaiyo-blue/10 text-chaiyo-blue flex items-center justify-center">
                                                                                    <guide.icon className="w-4 h-4" />
                                                                                </div>
                                                                                {guide.title}
                                                                            </DialogTitle>
                                                                            <DialogDescription className="text-sm pt-2">
                                                                                {guide.description}
                                                                            </DialogDescription>
                                                                        </DialogHeader>
                                                                        <div className="aspect-video w-full rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 mt-4 relative">
                                                                            <img src={guide.demoUrl} alt={guide.title} className="w-full h-full object-cover" />
                                                                            <div className="absolute top-2 left-2 px-2 py-0.5 bg-chaiyo-blue text-[10px] text-white rounded font-bold uppercase tracking-wider">ตัวอย่างภาพ</div>
                                                                        </div>
                                                                    </DialogContent>
                                                                </Dialog>
                                                            </div>

                                                            {/* 2. Photo Upload Area */}
                                                            {hasPhotos ? (
                                                                <div className="space-y-2">
                                                                    <div className="grid grid-cols-2 gap-2">
                                                                        {photos.map((photoUrl: string, pIdx: number) => (
                                                                            <div key={pIdx} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-emerald-100 bg-emerald-50/10 shadow-sm group">
                                                                                <img src={photoUrl} alt={`${guide.title} ${pIdx + 1}`} className="w-full h-full object-cover" />
                                                                                <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow border border-white z-20">
                                                                                    <CheckCircle2 className="w-3 h-3" />
                                                                                </div>
                                                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2 z-30 backdrop-blur-[1px]">
                                                                                    <button
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            // Flatten all photos for lightbox
                                                                                            const allPhotos = Object.values(formData.incomePhotos || {}).flat();
                                                                                            const flatIdx = allPhotos.indexOf(photoUrl);
                                                                                            if (flatIdx !== -1) setLightboxIndex(flatIdx);
                                                                                        }}
                                                                                        className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 border border-white/30 flex items-center justify-center text-white transition-all transform hover:scale-110 active:scale-95 shadow-xl"
                                                                                    >
                                                                                        <Eye className="w-4 h-4" />
                                                                                    </button>
                                                                                    <button
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            setItemToDelete({
                                                                                                categoryId: guide.id,
                                                                                                photoIndex: pIdx,
                                                                                                name: `${guide.title} (รูปที่ ${pIdx + 1})`,
                                                                                                type: 'categorizedPhoto'
                                                                                            });
                                                                                        }}
                                                                                        className="w-8 h-8 rounded-full bg-red-500/20 hover:bg-red-500/40 border border-red-500/40 flex items-center justify-center text-red-100 transition-all transform hover:scale-110 active:scale-95 shadow-xl"
                                                                                    >
                                                                                        <Trash2 className="w-4 h-4" />
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                        {/* Add more photos button */}
                                                                        <div
                                                                            className="aspect-[4/3] rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 hover:bg-gray-100 hover:border-gray-400 transition-all flex flex-col items-center justify-center cursor-pointer"
                                                                            onClick={() => handleTriggerPhotoUpload(guide.id)}
                                                                        >
                                                                            <Plus className="w-6 h-6 text-gray-400" />
                                                                            <span className="text-[10px] text-muted-foreground mt-1">เพิ่มรูป</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div
                                                                    className="relative aspect-[4/3] rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 hover:bg-gray-100 hover:border-gray-400 transition-all flex flex-col items-center justify-center cursor-pointer group-photo overflow-hidden"
                                                                    onClick={() => handleTriggerPhotoUpload(guide.id)}
                                                                >
                                                                    <div className="flex flex-col items-center justify-center p-6 text-center gap-3 animate-in fade-in zoom-in-95 duration-300">
                                                                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-all duration-300 transform group-hover:scale-110 bg-gray-100 text-gray-400 border border-gray-200">
                                                                            <guide.icon className="w-7 h-7" />
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            <p className="text-xs font-bold leading-tight text-gray-600">
                                                                                แตะเพื่ออัพโหลด
                                                                            </p>
                                                                            <p className="text-[10px] text-muted-foreground">
                                                                                รองรับไฟล์ภาพ JPEG, PNG (เลือกได้หลายรูป)
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                    )}

                                    {/* หมายเหตุ per occupation */}
                                    <div className="rounded-xl border border-border-color bg-gray-50/40 p-6 space-y-3">
                                        <h4 className="text-base font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-border-color">
                                            <MessageSquare className="w-5 h-5 text-chaiyo-blue" /> หมายเหตุ
                                        </h4>
                                        <Textarea
                                            value={occ.remarks || ""}
                                            onChange={(e) => handleOccupationChange(occ.id, "remarks", e.target.value)}
                                            placeholder="บันทึกหมายเหตุเพิ่มเติมสำหรับอาชีพนี้ (ถ้ามี)"
                                            className="min-h-[100px] resize-none bg-white"
                                        />
                                    </div>
                                </TabsContent>
                            ))
                            }
                        </Tabs>

                        {/* Special Incomes component has been removed in favor of this tab system */}
                    </CardContent>
                </Card>
            </div>

            {/* Right side breakdown */}
            <div className="w-full xl:w-[350px] shrink-0 sticky top-6 space-y-4">
                <Card className="border-border-strong overflow-hidden">
                    <CardHeader className="bg-blue-50/50 border-b border-border-strong pb-4">
                        <CardTitle className="text-base flex items-center gap-2 text-chaiyo-blue">
                            <PieChart className="w-5 h-5 text-chaiyo-blue" />
                            สรุปรายได้
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
                                        <span className="font-mono">{formatNumberWithCommas(roundDown2(Number(formData.mainOccupationIncome || 0)).toFixed(2))}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>รายได้อาชีพเสริม</span>
                                        <span className="font-mono">{formatNumberWithCommas(roundDown2(Number(formData.secondaryOccupationIncome || 0)).toFixed(2))}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-gray-800 pt-1 border-t border-gray-100">
                                        <span>รวมรายได้</span>
                                        <span className="font-mono text-emerald-600">฿{formatNumberWithCommas(roundDown2(Number(formData.totalIncome || 0)).toFixed(2))}</span>
                                    </div>
                                </div>
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
                            ) : itemToDelete?.type === 'bankAccount' ? (
                                <>
                                    คุณต้องการลบข้อมูล &quot;{itemToDelete?.name}&quot; ใช่หรือไม่?
                                    การดำเนินการนี้ไม่สามารถย้อนกลับได้
                                    {itemToDelete?.hasDocuments && (
                                        <span className="block mt-2 text-amber-600 font-medium">
                                            ⚠️ เอกสารรายการเดินบัญชี (Statement) จำนวน {itemToDelete.documentCount} ไฟล์ที่แนบมากับบัญชีนี้จะถูกลบไปด้วย
                                        </span>
                                    )}
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
            {
                (() => {
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
                })()
            }

            {/* Method Selection & Uploaded Files Dialog */}
            <Dialog open={isUploadDialogOpen} onOpenChange={(open) => {
                // Don't allow closing while scanner is active
                if (isScannerOpen) return;
                setIsUploadDialogOpen(open);
                if (!open) setCurrentDocContext(null);
            }}>
                <DialogContent
                    className="max-w-3xl p-0 overflow-hidden rounded-2xl border-none bg-white"
                    onInteractOutside={(e) => { if (isScannerOpen) e.preventDefault(); }}
                    onPointerDownOutside={(e) => { if (isScannerOpen) e.preventDefault(); }}
                >
                    <div className="bg-white p-5 border-b border-border-subtle flex items-center justify-between">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-gray-800">
                                เพิ่ม{currentDocContext?.label}
                            </DialogTitle>

                        </DialogHeader>
                        <Button variant="ghost" size="sm" onClick={() => setIsUploadDialogOpen(false)} className="h-8 w-8 p-0 rounded-full">
                            <X className="w-5 h-5 text-gray-500" />
                        </Button>
                    </div>

                    <div className="p-5 overflow-y-auto max-h-[80vh] space-y-6">
                        {/* Upper: Methods */}
                        <div className="bg-white">
                            <h4 className="text-sm font-bold text-gray-700 mb-4">ช่องทางการเพิ่มไฟล์</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => handleUploadMethodSelect('file')}
                                    className="flex items-center p-4 gap-4 border border-border-strong rounded-xl hover:border-chaiyo-blue hover:bg-blue-50/50 transition-all group"
                                >
                                    <div className="w-12 h-12 rounded-full bg-blue-100/50 flex items-center justify-center group-hover:bg-blue-200/50 transition-colors shrink-0">
                                        <UploadCloud className="w-5 h-5 text-chaiyo-blue" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-gray-800 text-sm leading-tight">อัพโหลดไฟล์</p>
                                        <p className="text-[11px] text-muted-foreground mt-0.5">เลือกไฟล์จากเครื่อง (PDF, JPG, PNG) ไม่เกิน 20MB</p>
                                    </div>
                                </button>

                                <button
                                    onClick={() => handleUploadMethodSelect('camera')}
                                    className="flex items-center p-4 gap-4 border border-border-strong rounded-xl hover:border-chaiyo-blue hover:bg-blue-50/50 transition-all group"
                                >
                                    <div className="w-12 h-12 rounded-full bg-blue-100/50 flex items-center justify-center group-hover:bg-blue-200/50 transition-colors shrink-0">
                                        <Camera className="w-5 h-5 text-chaiyo-blue" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-gray-800 text-sm leading-tight">ถ่ายรูป</p>
                                        <p className="text-[11px] text-muted-foreground mt-0.5">ใช้กล้องถ่ายเอกสารตัวจริง</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Lower: Attached Files List */}
                        {(() => {
                            if (!currentDocContext) return null;
                            const occ = occupations.find((o: IncomeOccupation) => o.id === currentDocContext.occId);
                            if (!occ) return null;
                            const currentFileList = (occ.incomeDocuments || []).filter((d: IncomeDocument) => d.type === currentDocContext.docType);

                            if (currentFileList.length === 0) return null;

                            return (
                                <div>
                                    <div className="text-sm font-bold text-gray-700 mb-4">
                                        ไฟล์ที่อัพโหลด ({currentFileList.length})

                                    </div>
                                    <div className="bg-white rounded-xl border overflow-hidden animate-in fade-in slide-in-from-bottom-2">

                                        <div className="overflow-x-auto border-t border-border-subtle">
                                            <Table>
                                                <TableHeader className="bg-gray-50/50">
                                                    <TableRow>
                                                        <TableHead className="w-[45%] text-xs">ชื่อไฟล์</TableHead>
                                                        <TableHead className="w-[40%] text-xs">มีรหัสผ่าน</TableHead>
                                                        <TableHead className="w-[15%] text-right text-xs">จัดการ</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {currentFileList.map((doc: IncomeDocument) => (
                                                        <TableRow key={doc.id} className="hover:bg-transparent">
                                                            {/* File Name Input */}
                                                            <TableCell className="py-3">
                                                                <div className="flex items-center gap-3">

                                                                    <Input
                                                                        value={doc.name}
                                                                        onChange={(e) => handleUpdateIncomeDocument(occ.id, doc.id, { name: e.target.value })}
                                                                        className="h-9 text-xs bg-white"
                                                                    />
                                                                </div>
                                                            </TableCell>

                                                            {/* Lock/Unlock Status */}
                                                            <TableCell className="py-3">
                                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <Switch
                                                                            checked={doc.isLocked || false}
                                                                            onCheckedChange={(checked) => {
                                                                                handleUpdateIncomeDocument(occ.id, doc.id, {
                                                                                    isLocked: checked,
                                                                                    ...(checked ? {} : { password: '' }) // Clear password if unlocked
                                                                                });
                                                                            }}
                                                                            className="data-[state=checked]:bg-chaiyo-blue shrink-0"
                                                                        />
                                                                    </div>
                                                                    {doc.isLocked && (
                                                                        <Input
                                                                            type="text"
                                                                            value={doc.password || ''}
                                                                            onChange={(e) => handleUpdateIncomeDocument(occ.id, doc.id, { password: e.target.value })}
                                                                            placeholder="ระบุรหัสผ่าน"
                                                                            className="h-9 text-xs w-full sm:w-[140px] bg-white"
                                                                        />
                                                                    )}
                                                                </div>
                                                            </TableCell>

                                                            {/* Actions */}
                                                            <TableCell className="text-right py-3">
                                                                <div className="flex items-center justify-end gap-1">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => window.open(doc.url, "_blank")}
                                                                        className="h-8 w-8 p-0 rounded-full text-chaiyo-blue hover:text-chaiyo-blue hover:bg-blue-50"
                                                                        title="ดูไฟล์"
                                                                    >
                                                                        <Eye className="w-4 h-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleRemoveIncomeDocument(occ.id, doc.id)}
                                                                        className="h-8 w-8 p-0 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50"
                                                                        title="ลบ"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>

                    <div className="p-4 border-t border-border-subtle bg-white flex justify-end">
                        <Button
                            onClick={() => {
                                setIsUploadDialogOpen(false);
                                setCurrentDocContext(null);
                            }}
                            className="bg-chaiyo-blue hover:bg-chaiyo-blue/90"
                        >
                            ยืนยันและปิด
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Document Scanner Flow Overlay */}
            <DocumentScanner
                open={isScannerOpen}
                onClose={() => {
                    setIsScannerOpen(false);
                    setIsUploadDialogOpen(true); // Re-open dialog when scanner is cancelled
                }}
                onSave={handleScanComplete}
            />
        </div >
    );
}
