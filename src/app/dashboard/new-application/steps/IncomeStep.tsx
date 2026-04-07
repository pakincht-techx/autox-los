import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Plus,
  Minus,
  Trash2,
  Home,
  CreditCard,
  Building,
  PieChart,
  TrendingUp,
  TrendingDown,
  Pencil,
  Users,
  ImagePlus,
  X,
  Eye,
  Link,
  FileText,
  UploadCloud,
  CheckCircle2,
  Info,
  HelpCircle,
  Globe,
  ClipboardCheck,
  Phone,
  Calendar,
  MapPin,
  MessageSquare,
  RotateCcw,
  Camera,
  Lock,
  Unlock,
  GripVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
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
import {
  SpecialIncomeDialog,
  SpecialIncomeSource,
} from "./SpecialIncomeDialog";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/Dialog";
import { useSidebar } from "@/components/layout/SidebarContext";
import { AddressForm } from "@/components/application/AddressForm";
import {
  CustomerFormData,
  IncomeOccupation,
  SpecialIncome,
  IncomeItem,
  EnterpriseIncome,
  IncomeDocument,
  PersonalDebt,
  ChaiyoLoan,
  SAIncome,
  ReferencePerson,
  BankAccount,
} from "@/types/application";

interface IncomeStepProps {
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
  {
    label: "ผู้ประกอบอาชีพเป็นพนักงานหรือลูกจ้างประจำของหน่วยงานของรัฐ",
    types: ["SA"],
  },
  { label: "นักการเมือง", types: ["SA", "SE"] },
  { label: "ข้าราชการพลเรือน", types: ["SA"] },
  { label: "ข้าราชการตำรวจ", types: ["SA"] },
  { label: "ข้าราชการทหาร", types: ["SA"] },
  { label: "ข้าราชการตุลาการ(ผู้พิพากษา)", types: ["SA"] },
  { label: "อัยการ", types: ["SA"] },
  { label: "พนักงานรัฐวิสาหกิจ", types: ["SA"] },
  { label: "ข้าราการบำนาญ", types: ["SA"] },
  {
    label:
      "ผู้ประกอบอาชีพเป็นพนักงาน หรือลูกจ้าง ของบริษัท, ห้างร้าน, สำนักงานต่าง ๆ",
    types: ["SA", "SE"],
  },
  { label: "พนักงานหรือลูกจ้างบริษัท ออโต้ เอกซ์ จำกัด", types: ["SA"] },
  { label: "พนักงานหรือลูกจ้างสถาบันการเงิน", types: ["SA"] },
  { label: "พนักงานหรือลูกจ้างกิจการพาณิชยกรรม", types: ["SA"] },
  { label: "พนักงานหรือลูกจ้างกิจการอุตสาหกรรม", types: ["SA"] },
  { label: "พนักงานหรือลูกจ้างธุรกิจบริการ", types: ["SA"] },
  { label: "พนักงานหรือลูกจ้างอุตสาหกรรมการเกษตร", types: ["SA"] },
  { label: "ผู้ประกอบอาชีพอิสระอื่น ๆ", types: ["SA", "SE"] },
  {
    label: "นักบัญชี (ที่ได้รับประกาศนียบัตร อนุปริญญา หรือปริญญา)",
    types: ["SA", "SE"],
  },
  { label: "นักกฎหมายและผู้ใช้วิชาชีพทางกฎหมาย", types: ["SA", "SE"] },
  { label: "วิศวกร", types: ["SA", "SE"] },
  { label: "สถาปนิก", types: ["SA", "SE"] },
  { label: "ช่างเทคนิค", types: ["SA", "SE"] },
  { label: "มัณฑณากร, จิตรกร, ช่างภาพและช่างศิลป์อื่น ๆ", types: ["SA", "SE"] },
  { label: "ค้าวัตถุโบราณ", types: ["SE"] },
  { label: "ค้าทอง, ค้าอัญมณี", types: ["SE"] },
  {
    label: "เป็นผู้ประกอบการ /เจ้าของ/ กรรมการ/ หุ้นส่วน",
    types: ["SA", "SE"],
  },
  { label: "ผู้ประกอบการกิจการพาณิชยกรรม", types: ["SA", "SE"] },
  { label: "ผู้ประกอบการกิจการอุตสาหกรรม", types: ["SA", "SE"] },
  { label: "ผู้ประกอบการกิจการธุรกิจบริการ", types: ["SA", "SE"] },
  {
    label: "ผู้ประกอบการกิจการเกษตรกรรม หรืออุตสาหกรรมการเกษตร",
    types: ["SA", "SE"],
  },
  { label: "ผู้ประกอบการสถาบันการเงิน", types: ["SA", "SE"] },
  { label: "ผู้ประกอบธุรกิจแลกเปลี่ยนเงินตราต่างประเทศ", types: ["SA", "SE"] },
  { label: "ผู้ประกอบการธุรกิจโอนเงินออกนอกประเทศ", types: ["SA", "SE"] },
  { label: "ผู้ประกอบการโรงงานผลิตอาวุธยุทโธปกรณ์", types: ["SA", "SE"] },
  {
    label:
      "ผู้ประกอบอาชีพเป็นพนักงานหรือลูกจ้าง/ กลุ่มบุคคลในสถาบันที่ไม่แสวงหาผลกำไร",
    types: ["SA", "SE"],
  },
  {
    label: "พนักงานหรือลูกจ้าง องค์การระหว่างประเทศหรือสถานฑูต",
    types: ["SA"],
  },
  { label: "พนักงานหรือลูกจ้างสหกรณ์", types: ["SA"] },
  { label: "พนักงานหรือลูกจ้างสมาคม", types: ["SA"] },
  { label: "พนักงานหรือลูกจ้างมูลนิธิ", types: ["SA"] },
  { label: "พนักงานหรือลูกจ้างสโมสร", types: ["SA"] },
  { label: "พนักงานหรือลูกจ้างชมรม", types: ["SA"] },
  { label: "พนักงานหรือลูกจ้างองค์การระหว่างประเทศ", types: ["SA"] },
  { label: "ผู้ประกอบอาชีพการศึกษา", types: ["SA", "SE"] },
  {
    label:
      "อาจารย์และผู้ปฎิบัติงานด้านบริหารและงานด้านปกครองของมหาวิทยาลัยและสถาบันที่เทียบเท่า",
    types: ["SA", "SE"],
  },
  {
    label:
      "อาจารย์ ครูและผู้ปฏิบัติงานด้านบริหารและงานด้านปกครองในโรงเรียนอนุบาล,ชั้นประถม,มัธยม และอาชีวศึกษา",
    types: ["SA", "SE"],
  },
  {
    label:
      "ผู้ประกอบอาชีพในวงการบันเทิงและสื่อมวลชน และผู้ประกอบอาชีพเกี่ยวกับการเขียน",
    types: ["SA", "SE"],
  },
  {
    label: "บุคคลในวงการสื่อสารมวลชนและผู้ประกอบอาชีพเกี่ยวกับการเขียน",
    types: ["SA", "SE"],
  },
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
  {
    label: "ผู้ปฏิบัติงานที่จำแนกเข้าอาชีพใดไม่ได้ หรือไม่ทราบประเภทอาชีพ",
    types: ["SA", "SE"],
  },
  { label: "เกษตรกร", value: "FARMER", types: ["SA", "SE"] },
  { label: "เลี้ยงสัตว์", value: "LIVESTOCK", types: ["SA", "SE"] },
  { label: "จักรยานยนต์รับจ้าง", types: ["SE"] },
  { label: "ค้าขาย / แผงลอย / ออนไลน์", types: ["SE"] },
  { label: "พนักงานส่งเอกสาร / อาหาร", types: ["SA", "SE"] },
  { label: "คนขับแท็กซี่", types: ["SE"] },
];

// Mock staff list — replace with API data in production
const MOCK_STAFF_LIST = [
  { id: "S001", code: "S001", name: "สมชาย ใจดี", phone: "081-234-5678" },
  { id: "S002", code: "S002", name: "สุดา รักงาน", phone: "089-876-5432" },
  { id: "S003", code: "S003", name: "วิชัย มุ่งดี", phone: "090-111-2233" },
  { id: "S004", code: "S004", name: "มานี ตั้งใจ", phone: "086-444-5566" },
  { id: "S005", code: "S005", name: "ปรียา สุขสม", phone: "092-777-8899" },
];

export function IncomeStep({
  formData,
  setFormData,
  isExistingCustomer = false,
  isGuarantor = false,
}: IncomeStepProps) {
  const { devRole } = useSidebar();
  const handleChange = <K extends keyof CustomerFormData>(
    field: K,
    value: CustomerFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Helper for specific occupation tab field change
  const handleOccupationChange = (
    id: string,
    fieldOrUpdates: string | Partial<IncomeOccupation>,
    value?: unknown,
  ) => {
    setFormData((prev) => {
      const occs = prev.occupations || [
        { id: "main", isMain: true } as IncomeOccupation,
      ];
      const updates =
        typeof fieldOrUpdates === "string"
          ? { [fieldOrUpdates]: value }
          : fieldOrUpdates;
      const updated = occs.map((o) => (o.id === id ? { ...o, ...updates } : o));
      return { ...prev, occupations: updated };
    });
  };

  const [activeTab, setActiveTab] = useState("main");
  const idCounterRef = useRef(0);
  const generateId = (prefix: string) => `${prefix}-${++idCounterRef.current}`;
  const occupations = formData.occupations || [{ id: "main", isMain: true }];

  // Determine required reference person count based on income channel
  const hasCashChannel = occupations.some((occ: IncomeOccupation) =>
    (occ.incomeChannels || []).includes("cash"),
  );
  const isSAWithPayslipOrStatement =
    occupations.some(
      (occ: IncomeOccupation) =>
        occ.employmentType === "SA" &&
        (occ.incomeDocuments || []).some(
          (doc: IncomeDocument) =>
            doc.type === "payslip" || doc.type === "statement",
        ),
    ) && !hasCashChannel;
  const requiredReferenceCount = hasCashChannel
    ? 2
    : isSAWithPayslipOrStatement
      ? 0
      : 1;

  const [isSpecialIncomeDialogOpen, setIsSpecialIncomeDialogOpen] =
    useState(false);
  const [editingSpecialIncome, setEditingSpecialIncome] =
    useState<SpecialIncomeSource | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{
    id?: string;
    index?: number;
    occId?: string;
    name?: string;
    categoryId?: string;
    photoIndex?: number;
    hasDocuments?: boolean;
    documentCount?: number;
    type:
      | "special"
      | "reference"
      | "photo"
      | "bankAccount"
      | "incomeDocument"
      | "saIncomeRow"
      | "seIncomeRow"
      | "seCostRow"
      | "debtRow"
      | "categorizedPhoto"
      | "occupation";
  } | null>(null);

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [currentDocContext, setCurrentDocContext] = useState<{
    occId: string;
    docType: string;
    label: string;
  } | null>(null);
  const [viewFilesContext, setViewFilesContext] = useState<{
    occId: string;
    docType: string;
    label: string;
  } | null>(null);
  const [uploadSessionDocIds, setUploadSessionDocIds] = useState<Set<string>>(
    new Set(),
  );
  const [dragOverDocIdx, setDragOverDocIdx] = useState<number | null>(null);
  const [currentPhotoCategory, setCurrentPhotoCategory] = useState<
    string | null
  >(null);
  const [managingPhotoGuideId, setManagingPhotoGuideId] = useState<
    string | null
  >(null);

  // Statement month dialog state
  const [statementMonthDialogOpen, setStatementMonthDialogOpen] =
    useState(false);
  const [statementMonthDialogBank, setStatementMonthDialogBank] = useState<{
    occId: string;
    bankIdx: number;
  } | null>(null);
  const [selectedMonthForDialog, setSelectedMonthForDialog] =
    useState<string>("");
  const [pendingDeleteMonth, setPendingDeleteMonth] = useState<{
    occId: string;
    bankIdx: number;
    monthLabel: string;
  } | null>(null);

  // Payslip month dialog state
  const [payslipMonthDialogOpen, setPayslipMonthDialogOpen] = useState(false);
  const [payslipMonthDialogOccId, setPayslipMonthDialogOccId] = useState<
    string | null
  >(null);
  const [selectedPayslipMonth, setSelectedPayslipMonth] = useState<string>("");
  const [pendingDeletePayslipMonth, setPendingDeletePayslipMonth] = useState<{
    occId: string;
    monthLabel: string;
  } | null>(null);

  // Tavi 50 Item dialog state
  const [tavi50ItemDialogOpen, setTavi50ItemDialogOpen] = useState(false);
  const [tavi50ItemDialogOccId, setTavi50ItemDialogOccId] = useState<
    string | null
  >(null);
  const [tavi50ItemType, setTavi50ItemType] = useState<"yearly" | "monthly">(
    "monthly",
  );
  const [selectedTavi50Month, setSelectedTavi50Month] = useState<string>("");
  const [pendingDeleteTavi50Month, setPendingDeleteTavi50Month] = useState<{
    occId: string;
    monthLabel: string;
  } | null>(null);
  const [pendingDeleteTavi50Yearly, setPendingDeleteTavi50Yearly] = useState<
    string | null
  >(null);

  // SE Statement Manage Dialog state
  const [seStatementDialogOpen, setSeStatementDialogOpen] = useState(false);
  const [seStatementDialogContext, setSeStatementDialogContext] = useState<{
    occId: string;
    bankIdx: number;
  } | null>(null);
  const [seStatementPage, setSeStatementPage] = useState(1);
  // SE Statement Items Handlers
  const initSEStatementMockData = (occId: string) => {
    const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
    if (!occ || (occ.seStatementItems && occ.seStatementItems.length > 0))
      return;
    handleOccupationChange(occId, "seStatementItems", MOCK_SE_STATEMENT_ITEMS);
  };

  const handleToggleSEStatementItem = (
    occId: string,
    index: number,
    included: boolean,
  ) => {
    const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
    if (!occ) return;
    const items = [...(occ.seStatementItems || [])];
    items[index] = {
      ...items[index],
      included,
      excludeReason: included ? undefined : items[index].excludeReason,
    };
    handleOccupationChange(occId, "seStatementItems", items);
  };

  const handleUpdateSEStatementExcludeReason = (
    occId: string,
    index: number,
    reason: string,
  ) => {
    const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
    if (!occ) return;
    const items = [...(occ.seStatementItems || [])];
    items[index] = { ...items[index], excludeReason: reason };
    handleOccupationChange(occId, "seStatementItems", items);
  };

  const handleUpdateSEStatementNote = (
    occId: string,
    index: number,
    note: string,
  ) => {
    const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
    if (!occ) return;
    const items = [...(occ.seStatementItems || [])];
    items[index] = { ...items[index], note };
    handleOccupationChange(occId, "seStatementItems", items);
  };

  const handleAddManualSEStatementItem = (occId: string, afterIndex?: number) => {
    const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
    if (!occ) return;
    const items = [...(occ.seStatementItems || [])];
    const newItem = {
      code: "",
      dateTime: "",
      type: "in" as const,
      description: "",
      amount: "",
      included: true,
      isManual: true,
    };
    if (afterIndex !== undefined && afterIndex >= 0 && afterIndex < items.length) {
      items.splice(afterIndex + 1, 0, newItem);
    } else {
      items.push(newItem);
    }
    handleOccupationChange(occId, "seStatementItems", items);
    // Auto-navigate to the page containing the new row
    const SE_ITEMS_PER_PAGE = 25;
    const newRowIndex = afterIndex !== undefined ? afterIndex + 1 : items.length - 1;
    const targetPage = Math.ceil((newRowIndex + 1) / SE_ITEMS_PER_PAGE);
    setSeStatementPage(targetPage);
  };

  const handleEditManualSEStatementItem = (
    occId: string,
    index: number,
    field: "code" | "dateTime" | "type" | "description" | "amount",
    value: string,
  ) => {
    const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
    if (!occ) return;
    const items = [...(occ.seStatementItems || [])];
    items[index] = { ...items[index], [field]: value };
    handleOccupationChange(occId, "seStatementItems", items);
  };

  const handleDeleteManualSEStatementItem = (occId: string, index: number) => {
    const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
    if (!occ) return;
    const items = [...(occ.seStatementItems || [])];
    items.splice(index, 1);
    handleOccupationChange(occId, "seStatementItems", items);
  };

  // Debt Row Handlers
  const handleSaveSpecialIncome = (
    source: SpecialIncomeSource | SpecialIncome,
  ) => {
    const currentIncomes = formData.specialIncomes || [];
    if ("amount" in source) {
      handleChange(
        "specialIncomes",
        currentIncomes.map((item) => (item.id === source.id ? source : item)),
      );
    } else {
      const newIncome: SpecialIncome = {
        ...source,
        frequency: "monthly",
        amount: 0,
        netIncome: 0,
        id: generateId("special"),
      };
      handleChange("specialIncomes", [...currentIncomes, newIncome]);
    }
    setEditingSpecialIncome(null);
  };

  const handleRemoveSpecialIncome = (id: string) => {
    const currentIncomes = formData.specialIncomes || [];
    handleChange(
      "specialIncomes",
      currentIncomes.filter((item: SpecialIncome) => item.id !== id),
    );
    setItemToDelete(null);
  };

  // Reference Persons
  const handleAddReference = () => {
    const refs = formData.referencePersons || [];
    setFormData((prev: CustomerFormData) => ({
      ...prev,
      referencePersons: [
        ...refs,
        { name: "", phone: "", relationship: "", customRelationship: "" },
      ],
    }));
  };

  const handleUpdateReference = (
    index: number,
    field: string,
    value: string,
  ) => {
    const refs = [...(formData.referencePersons || [])];

    let finalValue = value;
    if (field === "phone") {
      const numbers = value.replace(/\D/g, "");
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
    }

    refs[index] = { ...refs[index], [field]: finalValue };
    handleChange("referencePersons", refs);
  };

  const handleRemoveReference = (index: number) => {
    const refs = [...(formData.referencePersons || [])];
    refs.splice(index, 1);
    handleChange("referencePersons", refs);
    setItemToDelete(null);
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === "reference" && itemToDelete.index !== undefined) {
      handleRemoveReference(itemToDelete.index);
    } else if (itemToDelete.type === "special" && itemToDelete.id) {
      handleRemoveSpecialIncome(itemToDelete.id);
    } else if (
      itemToDelete.type === "categorizedPhoto" &&
      itemToDelete.categoryId
    ) {
      handleRemoveCategorizedPhoto(
        itemToDelete.categoryId,
        itemToDelete.photoIndex,
      );
    } else if (
      itemToDelete.type === "bankAccount" &&
      itemToDelete.occId &&
      itemToDelete.index !== undefined
    ) {
      handleRemoveBankAccount(itemToDelete.occId, itemToDelete.index);
    } else if (
      itemToDelete.type === "incomeDocument" &&
      itemToDelete.occId &&
      itemToDelete.id
    ) {
      handleRemoveIncomeDocument(itemToDelete.occId, itemToDelete.id);
    } else if (
      itemToDelete.type === "saIncomeRow" &&
      itemToDelete.occId &&
      itemToDelete.index !== undefined
    ) {
      handleRemoveSAIncomeRow(itemToDelete.occId, itemToDelete.index);
    } else if (
      itemToDelete.type === "seIncomeRow" &&
      itemToDelete.occId &&
      itemToDelete.index !== undefined
    ) {
      handleRemoveSEIncomeRow(itemToDelete.occId, itemToDelete.index);
    } else if (
      itemToDelete.type === "seCostRow" &&
      itemToDelete.occId &&
      itemToDelete.index !== undefined
    ) {
      handleRemoveSECostRow(itemToDelete.occId, itemToDelete.index);
    } else if (itemToDelete.type === "occupation" && itemToDelete.id) {
      handleRemoveOccupation(itemToDelete.id);
    }
  };

  const handleNumberChange = (field: string, value: string) => {
    const cleanValue = value.replace(/,/g, "");
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
    const specialIncomeSum = specialIncomesList.reduce(
      (sum: number, item: SpecialIncome) => sum + (item.netIncome || 0),
      0,
    );

    if (formData.specialIncome !== specialIncomeSum) {
      handleChange("specialIncome", specialIncomeSum);
    }

    // Get Occupation Sums
    const mainOccSum = occupations
      .filter((o: IncomeOccupation) => o.isMain)
      .reduce((acc: number, o: IncomeOccupation) => {
        if (o.employmentType === "SA") {
          const saSum = (o.saIncomes || []).reduce(
            (sumAcc: number, item: SAIncome) =>
              sumAcc + (Number(item.amount) || 0),
            0,
          );
          return acc + roundDown2(saSum);
        }
        if (o.employmentType === "SE") {
          if (o.occupationCode === "FARMER") {
            const std = FARM_STANDARD_PRICES[o.produceType || "others"] || {
              sales: 0,
              cost: 0,
            };
            const totalAreaRai =
              Number(o.cultivationAreaRai || 0) +
              Number(o.cultivationAreaNgan || 0) / 4 +
              Number(o.cultivationAreaSqWa || 0) / 400;
            const cycles = Number(o.cyclesPerYear || 1);
            const laborers = Number(o.laborCount || 1) || 1;
            const salesValue = o.customerSalesPerRai
              ? Number(o.customerSalesPerRai)
              : std.sales;
            const costValue = o.customerCostPerRai
              ? Number(o.customerCostPerRai)
              : std.cost;
            const farmerIncome =
              ((salesValue - costValue) * totalAreaRai * cycles) /
              12 /
              laborers;
            return acc + roundDown2(Math.max(0, farmerIncome));
          }
          if (o.occupationCode === "LIVESTOCK") {
            const totalNet = (o.livestockCycles || []).reduce(
              (sum, c) => sum + (Number(c.netIncome) || 0),
              0,
            );
            return acc + roundDown2(totalNet / 12);
          }
          const sales = (o.seIncomes || []).reduce(
            (sumAcc: number, item: SAIncome) =>
              sumAcc + (Number(item.calculatedMonthly) || 0),
            0,
          );
          const costs = (o.seCosts || []).reduce(
            (sumAcc: number, item: SAIncome) =>
              sumAcc + (Number(item.calculatedMonthly) || 0),
            0,
          );
          return acc + roundDown2(sales - costs);
        }
        return acc;
      }, 0);

    const secondaryOccSum = occupations
      .filter((o: IncomeOccupation) => !o.isMain)
      .reduce((acc: number, o: IncomeOccupation) => {
        if (o.employmentType === "SA") {
          const saSum = (o.saIncomes || []).reduce(
            (sumAcc: number, item: SAIncome) =>
              sumAcc + (Number(item.amount) || 0),
            0,
          );
          return acc + roundDown2(saSum);
        }
        if (o.employmentType === "SE") {
          if (o.occupationCode === "FARMER") {
            const std = FARM_STANDARD_PRICES[o.produceType || "others"] || {
              sales: 0,
              cost: 0,
            };
            const totalAreaRai =
              Number(o.cultivationAreaRai || 0) +
              Number(o.cultivationAreaNgan || 0) / 4 +
              Number(o.cultivationAreaSqWa || 0) / 400;
            const cycles = Number(o.cyclesPerYear || 1);
            const laborers = Number(o.laborCount || 1) || 1;
            const salesValue = o.customerSalesPerRai
              ? Number(o.customerSalesPerRai)
              : std.sales;
            const costValue = o.customerCostPerRai
              ? Number(o.customerCostPerRai)
              : std.cost;
            const farmerIncome =
              ((salesValue - costValue) * totalAreaRai * cycles) /
              12 /
              laborers;
            return acc + roundDown2(Math.max(0, farmerIncome));
          }
          if (o.occupationCode === "LIVESTOCK") {
            const totalNet = (o.livestockCycles || []).reduce(
              (sum, c) => sum + (Number(c.netIncome) || 0),
              0,
            );
            return acc + roundDown2(totalNet / 12);
          }
          const sales = (o.seIncomes || []).reduce(
            (sumAcc: number, item: SAIncome) =>
              sumAcc + (Number(item.calculatedMonthly) || 0),
            0,
          );
          const costs = (o.seCosts || []).reduce(
            (sumAcc: number, item: SAIncome) =>
              sumAcc + (Number(item.calculatedMonthly) || 0),
            0,
          );
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
  }, [occupations, formData.specialIncome, formData.otherIncome]);

  // Reference Persons
  // Occupations Management

  const handleAddSecondaryOccupation = () => {
    const secondaryCount = occupations.filter(
      (o: IncomeOccupation) => !o.isMain,
    ).length;
    if (secondaryCount >= 10) return;

    const newId = generateId("sec");
    handleChange("occupations", [...occupations, { id: newId, isMain: false }]);
    setActiveTab(newId);
  };

  const handleRemoveOccupation = (id: string) => {
    const newOccupations = occupations
      .filter((o: IncomeOccupation) => o.id !== id)
      .map((o: IncomeOccupation) =>
        o.isSameAsMainAddress === id ? { ...o, isSameAsMainAddress: "" } : o,
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
    const newUrls = Array.from(files).map((file) => URL.createObjectURL(file));
    handleChange("incomePhotos", {
      ...currentPhotos,
      [currentPhotoCategory]: [...existing, ...newUrls],
    });

    // Reset
    if (photoInputRef.current) photoInputRef.current.value = "";
    setCurrentPhotoCategory(null);
  };

  const handleRemoveCategorizedPhoto = (
    categoryId: string,
    photoIndex?: number,
  ) => {
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
    handleOccupationChange(occId, "incomeChannels", updated);
  };

  // Statement Month Handlers
  const handleOpenAddMonthDialog = (occId: string, bankIdx: number) => {
    setStatementMonthDialogBank({ occId, bankIdx });
    setSelectedMonthForDialog("");
    setStatementMonthDialogOpen(true);
  };

  const handleConfirmAddMonth = () => {
    if (!statementMonthDialogBank || !selectedMonthForDialog) return;
    const { occId, bankIdx } = statementMonthDialogBank;
    const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
    if (!occ) return;
    const bankKey = String(bankIdx);
    const currentMonths = { ...(occ.statementMonths || {}) };
    const bankMonths = currentMonths[bankKey] || [];
    // Don't add duplicate months
    if (bankMonths.includes(selectedMonthForDialog)) {
      setStatementMonthDialogOpen(false);
      return;
    }
    const newMonths = [...bankMonths, selectedMonthForDialog];
    // Sort by calendar order
    newMonths.sort(
      (a, b) => THAI_MONTHS_SHORT.indexOf(a) - THAI_MONTHS_SHORT.indexOf(b),
    );
    currentMonths[bankKey] = newMonths;
    handleOccupationChange(occId, "statementMonths", currentMonths);
    setStatementMonthDialogOpen(false);
  };

  const handleRemoveStatementMonth = (
    occId: string,
    bankIdx: number,
    monthLabel: string,
  ) => {
    const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
    if (!occ) return;
    const bankKey = String(bankIdx);
    const currentMonths = { ...(occ.statementMonths || {}) };
    const bankMonths = currentMonths[bankKey] || [];
    const monthIdx = bankMonths.indexOf(monthLabel);
    if (monthIdx === -1) return;

    // Remove the month
    currentMonths[bankKey] = bankMonths.filter((m: string) => m !== monthLabel);

    // Clean up income rows linked to this month
    const sourceKey = `statement_${bankIdx}_month_${monthIdx}`;
    const updatedIncomes = (occ.saIncomes || []).filter(
      (inc: SAIncome) => inc.sourceDocType !== sourceKey,
    );
    // Re-index remaining months' income keys
    const reindexedIncomes = updatedIncomes.map((inc: SAIncome) => {
      if (inc.sourceDocType?.startsWith(`statement_${bankIdx}_month_`)) {
        const incMonthIdx = Number(
          inc.sourceDocType.replace(`statement_${bankIdx}_month_`, ""),
        );
        if (incMonthIdx > monthIdx) {
          return {
            ...inc,
            sourceDocType: `statement_${bankIdx}_month_${incMonthIdx - 1}`,
          };
        }
      }
      return inc;
    });

    handleOccupationChange(occId, {
      statementMonths: currentMonths,
      saIncomes: reindexedIncomes,
    });
  };

  // Payslip Month & Slip Handlers
  const handleOpenAddPayslipMonthDialog = (occId: string) => {
    setPayslipMonthDialogOccId(occId);
    setSelectedPayslipMonth("");
    setPayslipMonthDialogOpen(true);
  };

  const handleConfirmAddPayslipMonth = () => {
    if (!payslipMonthDialogOccId || !selectedPayslipMonth) return;
    const occ = occupations.find(
      (o: IncomeOccupation) => o.id === payslipMonthDialogOccId,
    );
    if (!occ) return;
    const currentMonths: string[] = occ.payslipMonths || [];
    if (currentMonths.includes(selectedPayslipMonth)) {
      setPayslipMonthDialogOpen(false);
      return;
    }
    const newMonths = [...currentMonths, selectedPayslipMonth];
    newMonths.sort(
      (a, b) => THAI_MONTHS_SHORT.indexOf(a) - THAI_MONTHS_SHORT.indexOf(b),
    );
    // Initialize 1 slip for the new month
    const monthIdx = newMonths.indexOf(selectedPayslipMonth);
    const currentSlipCounts = { ...(occ.payslipSlipCounts || {}) };
    // Re-index slip counts for months that shifted
    const reindexedSlipCounts: Record<string, number> = {};
    newMonths.forEach((m, i) => {
      const oldIdx = currentMonths.indexOf(m);
      if (oldIdx !== -1) {
        reindexedSlipCounts[String(i)] = currentSlipCounts[String(oldIdx)] || 1;
      } else {
        reindexedSlipCounts[String(i)] = 1; // new month starts with 1 slip
      }
    });
    // Re-index income sourceDocType keys
    const reindexedIncomes = (occ.saIncomes || []).map((inc: SAIncome) => {
      if (inc.sourceDocType?.startsWith("payslip_")) {
        const match = inc.sourceDocType.match(/^payslip_(\d+)_slip_(\d+)$/);
        if (match) {
          const oldMonthIdx = Number(match[1]);
          const slipIdx = match[2];
          const oldMonthLabel = currentMonths[oldMonthIdx];
          const newMonthIdx = newMonths.indexOf(oldMonthLabel);
          if (newMonthIdx !== -1) {
            return {
              ...inc,
              sourceDocType: `payslip_${newMonthIdx}_slip_${slipIdx}`,
            };
          }
        }
      }
      return inc;
    });
    handleOccupationChange(payslipMonthDialogOccId, {
      payslipMonths: newMonths,
      payslipSlipCounts: reindexedSlipCounts,
      saIncomes: reindexedIncomes,
    });
    setPayslipMonthDialogOpen(false);
  };

  const handleRemovePayslipMonth = (occId: string, monthLabel: string) => {
    const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
    if (!occ) return;
    const currentMonths: string[] = occ.payslipMonths || [];
    const monthIdx = currentMonths.indexOf(monthLabel);
    if (monthIdx === -1) return;

    const newMonths = currentMonths.filter((m: string) => m !== monthLabel);
    const currentSlipCounts = { ...(occ.payslipSlipCounts || {}) };
    const slipCount = currentSlipCounts[String(monthIdx)] || 0;

    // Remove all income rows for this month (all slips)
    let updatedIncomes = (occ.saIncomes || []).filter((inc: SAIncome) => {
      if (inc.sourceDocType?.startsWith("payslip_")) {
        const match = inc.sourceDocType.match(/^payslip_(\d+)_slip_(\d+)$/);
        if (match && Number(match[1]) === monthIdx) return false;
      }
      return true;
    });

    // Re-index remaining months
    const reindexedSlipCounts: Record<string, number> = {};
    newMonths.forEach((m, i) => {
      const oldIdx = currentMonths.indexOf(m);
      reindexedSlipCounts[String(i)] = currentSlipCounts[String(oldIdx)] || 1;
    });

    updatedIncomes = updatedIncomes.map((inc: SAIncome) => {
      if (inc.sourceDocType?.startsWith("payslip_")) {
        const match = inc.sourceDocType.match(/^payslip_(\d+)_slip_(\d+)$/);
        if (match) {
          const oldMonthIdx = Number(match[1]);
          if (oldMonthIdx > monthIdx) {
            return {
              ...inc,
              sourceDocType: `payslip_${oldMonthIdx - 1}_slip_${match[2]}`,
            };
          }
        }
      }
      return inc;
    });

    handleOccupationChange(occId, {
      payslipMonths: newMonths,
      payslipSlipCounts: reindexedSlipCounts,
      saIncomes: updatedIncomes,
    });
  };

  const handleAddPayslipSlip = (occId: string, monthIdx: number) => {
    const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
    if (!occ) return;
    const currentSlipCounts = { ...(occ.payslipSlipCounts || {}) };
    const current = currentSlipCounts[String(monthIdx)] || 0;
    currentSlipCounts[String(monthIdx)] = current + 1;
    handleOccupationChange(occId, "payslipSlipCounts", currentSlipCounts);
  };

  const handleRemovePayslipSlip = (
    occId: string,
    monthIdx: number,
    slipIdx: number,
  ) => {
    const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
    if (!occ) return;
    const currentSlipCounts = { ...(occ.payslipSlipCounts || {}) };
    const current = currentSlipCounts[String(monthIdx)] || 0;
    if (current <= 0) return;
    currentSlipCounts[String(monthIdx)] = current - 1;

    // Remove income rows for this slip
    const sourceKey = `payslip_${monthIdx}_slip_${slipIdx}`;
    let updatedIncomes = (occ.saIncomes || []).filter(
      (inc: SAIncome) => inc.sourceDocType !== sourceKey,
    );

    // Re-index remaining slips
    updatedIncomes = updatedIncomes.map((inc: SAIncome) => {
      if (inc.sourceDocType?.startsWith(`payslip_${monthIdx}_slip_`)) {
        const match = inc.sourceDocType.match(/^payslip_\d+_slip_(\d+)$/);
        if (match) {
          const incSlipIdx = Number(match[1]);
          if (incSlipIdx > slipIdx) {
            return {
              ...inc,
              sourceDocType: `payslip_${monthIdx}_slip_${incSlipIdx - 1}`,
            };
          }
        }
      }
      return inc;
    });

    handleOccupationChange(occId, {
      payslipSlipCounts: currentSlipCounts,
      saIncomes: updatedIncomes,
    });
  };

  // Tavi 50 Item Handlers
  const handleOpenAddTavi50ItemDialog = (occId: string) => {
    setTavi50ItemDialogOccId(occId);
    setTavi50ItemType("monthly");
    setSelectedTavi50Month("");
    setTavi50ItemDialogOpen(true);
  };

  const handleConfirmAddTavi50Item = () => {
    if (!tavi50ItemDialogOccId) return;
    const occ = occupations.find(
      (o: IncomeOccupation) => o.id === tavi50ItemDialogOccId,
    );
    if (!occ) return;

    if (tavi50ItemType === "yearly") {
      if (occ.hasTavi50Yearly) {
        setTavi50ItemDialogOpen(false);
        return;
      }
      handleOccupationChange(tavi50ItemDialogOccId, {
        hasTavi50Yearly: true,
        tavi50MonthlyMonths: [],
        tavi50MonthlySlipCounts: {},
      });
      setTavi50ItemDialogOpen(false);
      return;
    }

    // Monthly Type
    if (!selectedTavi50Month) return;
    const currentMonths: string[] = occ.tavi50MonthlyMonths || [];
    if (currentMonths.includes(selectedTavi50Month)) {
      setTavi50ItemDialogOpen(false);
      return;
    }
    const newMonths = [...currentMonths, selectedTavi50Month];
    newMonths.sort(
      (a, b) => THAI_MONTHS_SHORT.indexOf(a) - THAI_MONTHS_SHORT.indexOf(b),
    );
    // Initialize 1 slip for the new month
    const monthIdx = newMonths.indexOf(selectedTavi50Month);
    const currentSlipCounts = { ...(occ.tavi50MonthlySlipCounts || {}) };
    // Re-index slip counts for months that shifted
    const reindexedSlipCounts: Record<string, number> = {};
    newMonths.forEach((m, i) => {
      const oldIdx = currentMonths.indexOf(m);
      if (oldIdx !== -1) {
        reindexedSlipCounts[String(i)] = currentSlipCounts[String(oldIdx)] || 1;
      } else {
        reindexedSlipCounts[String(i)] = 1; // new month starts with 1 slip
      }
    });
    // Re-index income sourceDocType keys
    const reindexedIncomes = (occ.saIncomes || []).map((inc: SAIncome) => {
      if (inc.sourceDocType?.startsWith("tavi50_monthly_")) {
        const match = inc.sourceDocType.match(
          /^tavi50_monthly_(\d+)_slip_(\d+)$/,
        );
        if (match) {
          const oldMonthIdx = Number(match[1]);
          const slipIdx = match[2];
          const oldMonthLabel = currentMonths[oldMonthIdx];
          const newMonthIdx = newMonths.indexOf(oldMonthLabel);
          if (newMonthIdx !== -1) {
            return {
              ...inc,
              sourceDocType: `tavi50_monthly_${newMonthIdx}_slip_${slipIdx}`,
            };
          }
        }
      }
      return inc;
    });
    handleOccupationChange(tavi50ItemDialogOccId, {
      hasTavi50Yearly: false,
      tavi50MonthlyMonths: newMonths,
      tavi50MonthlySlipCounts: reindexedSlipCounts,
      saIncomes: reindexedIncomes,
    });
    setTavi50ItemDialogOpen(false);
  };

  const handleRemoveTavi50Month = (occId: string, monthLabel: string) => {
    const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
    if (!occ) return;
    const currentMonths: string[] = occ.tavi50MonthlyMonths || [];
    const monthIdx = currentMonths.indexOf(monthLabel);
    if (monthIdx === -1) return;

    const newMonths = currentMonths.filter((m: string) => m !== monthLabel);
    const currentSlipCounts = { ...(occ.tavi50MonthlySlipCounts || {}) };
    const slipCount = currentSlipCounts[String(monthIdx)] || 0;

    // Remove all income rows for this month (all slips)
    let updatedIncomes = (occ.saIncomes || []).filter((inc: SAIncome) => {
      if (inc.sourceDocType?.startsWith("tavi50_monthly_")) {
        const match = inc.sourceDocType.match(
          /^tavi50_monthly_(\d+)_slip_(\d+)$/,
        );
        if (match && Number(match[1]) === monthIdx) return false;
      }
      return true;
    });

    // Re-index remaining months
    const reindexedSlipCounts: Record<string, number> = {};
    newMonths.forEach((m, i) => {
      const oldIdx = currentMonths.indexOf(m);
      reindexedSlipCounts[String(i)] = currentSlipCounts[String(oldIdx)] || 1;
    });

    updatedIncomes = updatedIncomes.map((inc: SAIncome) => {
      if (inc.sourceDocType?.startsWith("tavi50_monthly_")) {
        const match = inc.sourceDocType.match(
          /^tavi50_monthly_(\d+)_slip_(\d+)$/,
        );
        if (match) {
          const oldMonthIdx = Number(match[1]);
          if (oldMonthIdx > monthIdx) {
            return {
              ...inc,
              sourceDocType: `tavi50_monthly_${oldMonthIdx - 1}_slip_${match[2]}`,
            };
          }
        }
      }
      return inc;
    });

    handleOccupationChange(occId, {
      tavi50MonthlyMonths: newMonths,
      tavi50MonthlySlipCounts: reindexedSlipCounts,
      saIncomes: updatedIncomes,
    });
  };

  const handleAddTavi50Slip = (occId: string, monthIdx: number) => {
    const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
    if (!occ) return;
    const currentSlipCounts = { ...(occ.tavi50MonthlySlipCounts || {}) };
    const current = currentSlipCounts[String(monthIdx)] || 0;
    currentSlipCounts[String(monthIdx)] = current + 1;
    handleOccupationChange(occId, "tavi50MonthlySlipCounts", currentSlipCounts);
  };

  const handleRemoveTavi50Slip = (
    occId: string,
    monthIdx: number,
    slipIdx: number,
  ) => {
    const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
    if (!occ) return;
    const currentSlipCounts = { ...(occ.tavi50MonthlySlipCounts || {}) };
    const current = currentSlipCounts[String(monthIdx)] || 0;
    if (current <= 0) return;
    currentSlipCounts[String(monthIdx)] = current - 1;

    // Remove income rows for this slip
    const sourceKey = `tavi50_monthly_${monthIdx}_slip_${slipIdx}`;
    let updatedIncomes = (occ.saIncomes || []).filter(
      (inc: SAIncome) => inc.sourceDocType !== sourceKey,
    );

    // Re-index remaining slips
    updatedIncomes = updatedIncomes.map((inc: SAIncome) => {
      if (inc.sourceDocType?.startsWith(`tavi50_monthly_${monthIdx}_slip_`)) {
        const match = inc.sourceDocType.match(
          /^tavi50_monthly_\d+_slip_(\d+)$/,
        );
        if (match) {
          const incSlipIdx = Number(match[1]);
          if (incSlipIdx > slipIdx) {
            return {
              ...inc,
              sourceDocType: `tavi50_monthly_${monthIdx}_slip_${incSlipIdx - 1}`,
            };
          }
        }
      }
      return inc;
    });

    handleOccupationChange(occId, {
      tavi50MonthlySlipCounts: currentSlipCounts,
      saIncomes: updatedIncomes,
    });
  };

  const handleAddBankAccount = (occId: string) => {
    const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
    if (!occ) return;
    const currentAccounts = occ.bankAccounts || [];
    handleOccupationChange(occId, "bankAccounts", [
      ...currentAccounts,
      { bankName: "", accountNo: "" },
    ]);
  };

  const handleUpdateBankAccount = (
    occId: string,
    index: number,
    field: string,
    value: string,
  ) => {
    const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
    if (!occ) return;
    const currentAccounts = [...(occ.bankAccounts || [])];

    // Apply mask if it's the account number field
    let finalValue = value;
    if (field === "accountNo") {
      const bankName = currentAccounts[index]?.bankName;
      const numbers = value.replace(/\D/g, "");
      if (bankName === "TRUEMONEY") {
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
    handleOccupationChange(occId, "bankAccounts", currentAccounts);
  };

  const handleRemoveBankAccount = (occId: string, index: number) => {
    const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
    if (!occ) return;
    const currentAccounts = [...(occ.bankAccounts || [])];
    currentAccounts.splice(index, 1);
    // Also remove associated statement documents for this bank account
    const statementType = `statement_${index}`;
    const currentDocs = (occ.incomeDocuments || []).filter(
      (d: IncomeDocument) => d.type !== statementType,
    );
    // Re-index statement documents for accounts after the removed one
    const reindexedDocs = currentDocs.map((d: IncomeDocument) => {
      if (d.type?.startsWith("statement_")) {
        const docIdx = parseInt(d.type!.split("_")[1]);
        if (docIdx > index) {
          return { ...d, type: `statement_${docIdx - 1}` };
        }
      }
      return d;
    });
    handleOccupationChange(occId, "bankAccounts", currentAccounts);
    handleOccupationChange(occId, "incomeDocuments", reindexedDocs);
    setItemToDelete(null);
  };

  // SA Income Handlers
  const handleAddSAIncomeRow = (occId: string, sourceDocType?: string) => {
    const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
    if (!occ) return;
    const currentIncomes = occ.saIncomes || [];
    handleOccupationChange(occId, "saIncomes", [
      ...currentIncomes,
      { type: "", detail: "", amount: "", sourceDocType },
    ]);
  };

  const handleUpdateSAIncomeRow = (
    occId: string,
    index: number,
    field: string,
    value: string,
  ) => {
    const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
    if (!occ) return;
    const currentIncomes = [...(occ.saIncomes || [])];

    let finalValue = value;
    if (field === "amount" || field === "yearlyAmount") {
      // Numbers only, handle decimals and round down to 2 places
      const clean = value.replace(/[^0-9.]/g, "");
      const parts = clean.split(".");
      if (parts.length > 2) {
        finalValue = parts[0] + "." + parts.slice(1).join("");
      } else if (parts.length === 2 && parts[1].length > 2) {
        finalValue = parts[0] + "." + parts[1].slice(0, 2);
      } else {
        finalValue = clean;
      }
    }

    currentIncomes[index] = { ...currentIncomes[index], [field]: finalValue };

    if (field === "yearlyAmount") {
      // Calculate monthly amount as yearly / 12 and round down to 2 decimal places
      const yearlyNum = Number(finalValue) || 0;
      const monthlyNum = Math.floor((yearlyNum / 12) * 100) / 100;
      currentIncomes[index].amount = monthlyNum.toString();
    }

    // Calculate total income for this occupation
    const total = currentIncomes.reduce(
      (acc: number, curr: SAIncome) => acc + (Number(curr.amount) || 0),
      0,
    );

    handleOccupationChange(occId, {
      saIncomes: currentIncomes,
      totalIncome: total,
    });
  };

  const handleRemoveSAIncomeRow = (occId: string, index: number) => {
    const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
    if (!occ) return;
    const currentIncomes = [...(occ.saIncomes || [])];
    currentIncomes.splice(index, 1);

    // Calculate total
    const total = currentIncomes.reduce(
      (acc: number, curr: SAIncome) => acc + (Number(curr.amount) || 0),
      0,
    );

    handleOccupationChange(occId, {
      saIncomes: currentIncomes,
      totalIncome: total,
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

  // Auto-add reference person rows when requiredReferenceCount changes
  useEffect(() => {
    const currentRefs = formData.referencePersons || [];
    if (currentRefs.length < requiredReferenceCount) {
      const toAdd = requiredReferenceCount - currentRefs.length;
      const newRefs = [...currentRefs];
      for (let i = 0; i < toAdd; i++) {
        newRefs.push({
          name: "",
          phone: "",
          relationship: "",
          customRelationship: "",
        });
      }
      handleChange("referencePersons", newRefs);
    }
  }, [requiredReferenceCount]);

  const PHOTO_GUIDES = [
    {
      id: "landmarks",
      title: "รูปสถานที่/จุดสังเกตุหลัก",
      description:
        "รูปสถานที่, รูปป้าย ที่เป็นจุดสังเกตุหลัก รอบกิจการผู้กู้ (ที่คนในพื้นที่รู้จัก) เช่น ป้ายซอย, ตึกอาคาร, วัด, ตลาด",
      required: true,
      icon: Building,
      demoUrl: "/images/guidelines/landmarks_demo.png",
    },
    {
      id: "business_wide",
      title: "รูปมุมกว้างที่ตั้งกิจการ",
      description:
        "รูปมุมกว้าง เห็นที่ตั้งของกิจการ, เห็นป้ายหน้าร้าน (เห็นเบอร์โทรกิจการ) และ เห็นบริเวณข้างเคียง",
      required: true,
      icon: ImagePlus,
      demoUrl: "/images/guidelines/business_wide_demo.png",
    },
    {
      id: "equipment",
      title: "รูปวัสดุ/อุปกรณ์กิจการ",
      description:
        "รูปวัสดุ และอุปกรณ์ที่ใช้ในการดำเนินกิจการ (อุปกรณ์ หรือเครื่องมือ ทำมาหากิน)",
      required: true,
      icon: Briefcase,
      demoUrl: "/images/guidelines/equipment_demo.png",
    },
    {
      id: "applicant_working",
      title: "รูปผู้กู้ขณะทำงาน",
      description: "รูปผู้กู้ ขณะประกอบกิจการ",
      required: true,
      icon: Users,
      demoUrl: "/images/guidelines/applicant_working_demo.png",
    },
    {
      id: "address_sign",
      title: "รูปเลขที่ตั้งกิจการ",
      description: "รูปเลขที่ตั้งกิจการ (ระบุเลขที่บ้าน หรือเลขที่ตั้งกิจการ)",
      required: false,
      icon: Home,
      demoUrl: "/images/guidelines/address_sign_demo.png",
    },
    {
      id: "qr_code",
      title: "รูป QR Code รับเงิน",
      description: "รูป QR Code สำหรับรับเงินของกิจการ",
      required: false,
      icon: CreditCard,
      demoUrl: "/images/guidelines/qr_code_demo.png",
    },
  ];

  // SE Income Handlers
  const calculateSEMonthlyIncome = (item: EnterpriseIncome) => {
    const amount = Number(item.salesAmount) || 0;
    if (!item.frequency) return 0;
    let result = 0;
    if (item.frequency === "daily") {
      const days = Number(item.daysPerMonth) || 0;
      result = amount * days;
    } else if (item.frequency === "weekly") {
      const weeks = Number(item.weeksPerMonth) || 0;
      result = amount * weeks;
    } else if (item.frequency === "monthly") {
      result = amount;
    } else if (item.frequency === "quarterly") {
      result = amount / 3;
    } else if (item.frequency === "yearly") {
      result = amount / 12;
    }
    return roundDown2(result);
  };

  const handleAddSEIncomeRow = (occId: string) => {
    const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
    if (!occ) return;
    const currentIncomes = occ.seIncomes || [];
    handleOccupationChange(occId, "seIncomes", [
      ...currentIncomes,
      {
        frequency: "",
        daysPerMonth: "",
        weeksPerMonth: "",
        operatingHours: [],
        salesAmount: "",
        calculatedMonthly: "0",
      },
    ]);
  };

  const handleUpdateSEIncomeRow = (
    occId: string,
    index: number,
    updates: Record<string, unknown>,
  ) => {
    const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
    if (!occ) return;
    const currentIncomes = [...(occ.seIncomes || [])];

    const currentRow: EnterpriseIncome = { ...currentIncomes[index] };

    for (const [field, value] of Object.entries(updates)) {
      let finalValue = value;
      if (
        field === "salesAmount" ||
        field === "daysPerMonth" ||
        field === "weeksPerMonth"
      ) {
        const clean = String(value).replace(/[^0-9.]/g, "");
        if (field === "salesAmount") {
          const parts = clean.split(".");
          if (parts.length > 2) {
            finalValue = parts[0] + "." + parts.slice(1).join("");
          } else if (parts.length === 2 && parts[1].length > 2) {
            finalValue = parts[0] + "." + parts[1].slice(0, 2);
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
    const total = currentIncomes.reduce(
      (acc: number, curr: EnterpriseIncome) =>
        acc + (Number(curr.calculatedMonthly) || 0),
      0,
    );

    handleOccupationChange(occId, {
      seIncomes: currentIncomes,
      totalIncome: total,
    });
  };

  const handleRemoveSEIncomeRow = (occId: string, index: number) => {
    const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
    if (!occ) return;
    const currentIncomes = [...(occ.seIncomes || [])];
    currentIncomes.splice(index, 1);

    // Calculate total
    const total = currentIncomes.reduce(
      (acc: number, curr: EnterpriseIncome) =>
        acc + (Number(curr.calculatedMonthly) || 0),
      0,
    );

    handleOccupationChange(occId, {
      seIncomes: currentIncomes,
      totalIncome: total,
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

  const SE_STATEMENT_EXCLUDE_REASONS = [
    { label: "เงินเข้าบัญชีจากธนาคารอื่น", value: "other_bank" },
    { label: "เงินที่เข้าจากบัญชีของตัวเอง", value: "own_account" },
    {
      label: "เงินที่เข้าจากกิจการของตัวเอง หรือนิติบุคคลที่ผู้กู้เป็นเจ้าของ",
      value: "own_business",
    },
    { label: "เงินที่เข้าจาก คู่สมรส", value: "spouse" },
    { label: "ตัดออกภายในวัน", value: "same_day" },
    { label: "ไม่เอามารวมเป็นรายได้", value: "not_income" },
    { label: "Payroll", value: "payroll" },
  ];

  const MOCK_SE_STATEMENT_ITEMS = [
    {
      code: "TRF",
      dateTime: "2024-05-12 14:30",
      type: "in" as const,
      description: "โอนเงินเข้าบัญชี จาก นาย สมชาย มั่นคง",
      amount: 45000,
      included: true,
    },
    {
      code: "D/W",
      dateTime: "2024-05-13 10:00",
      type: "out" as const,
      description: "ถอนเงินสด ATM",
      amount: 5000,
      included: true,
    },
    {
      code: "CDM",
      dateTime: "2024-05-14 09:15",
      type: "in" as const,
      description: "ฝากเงินสด สาขาลาดพร้าว",
      amount: 18500,
      included: true,
    },
    {
      code: "TRF",
      dateTime: "2024-05-15 16:45",
      type: "in" as const,
      description: "รับโอน PromptPay 0899999999",
      amount: 32000,
      included: true,
    },
    {
      code: "TRF",
      dateTime: "2024-05-16 13:20",
      type: "out" as const,
      description: "โอนเงินออก ชำระค่าไฟฟ้า กฟน.",
      amount: 3200,
      included: true,
    },
    {
      code: "CDM",
      dateTime: "2024-05-18 11:20",
      type: "in" as const,
      description: "ฝากเงินสด ATM สาขาเซ็นทรัล",
      amount: 12000,
      included: true,
    },
    {
      code: "TRF",
      dateTime: "2024-05-20 08:05",
      type: "in" as const,
      description: "โอนเงินเข้าบัญชี จาก บจก.เอบีซี เทรดดิ้ง",
      amount: 85000,
      included: false,
      excludeReason: "own_business",
    },
    {
      code: "TRF",
      dateTime: "2024-05-21 15:40",
      type: "out" as const,
      description: "โอนเงินออก ชำระค่าเช่าอาคาร",
      amount: 15000,
      included: true,
    },
    {
      code: "TRF",
      dateTime: "2024-05-22 17:30",
      type: "in" as const,
      description: "รับโอน PromptPay 0811111111",
      amount: 5500,
      included: true,
    },
    {
      code: "CHQ",
      dateTime: "2024-05-23 10:15",
      type: "in" as const,
      description: "เช็คเข้าบัญชี เลขที่ 0012345",
      amount: 120000,
      included: true,
    },
    {
      code: "TRF",
      dateTime: "2024-05-24 09:00",
      type: "out" as const,
      description: "โอนเงินออก ชำระสินเชื่อ SME",
      amount: 22000,
      included: true,
    },
    {
      code: "TRF",
      dateTime: "2024-05-25 12:45",
      type: "in" as const,
      description: "โอนเงินระหว่างบัญชี ออมทรัพย์ → กระแสรายวัน",
      amount: 50000,
      included: false,
      excludeReason: "own_account",
    },
    {
      code: "CDM",
      dateTime: "2024-05-28 14:10",
      type: "in" as const,
      description: "ฝากเงินสด สาขาสยาม",
      amount: 8200,
      included: true,
    },
    {
      code: "D/W",
      dateTime: "2024-05-29 11:30",
      type: "out" as const,
      description: "ถอนเงินสด สาขาสยาม",
      amount: 20000,
      included: true,
    },
    {
      code: "TRF",
      dateTime: "2024-05-30 09:50",
      type: "in" as const,
      description: "รับโอน จาก นาง สุดา รักดี (คู่สมรส)",
      amount: 25000,
      included: false,
      excludeReason: "spouse",
    },
    {
      code: "PAY",
      dateTime: "2024-05-31 06:30",
      type: "in" as const,
      description: "Payroll เงินเดือน บจก.เอบีซี",
      amount: 35000,
      included: false,
      excludeReason: "payroll",
    },
    {
      code: "TRF",
      dateTime: "2024-06-01 08:15",
      type: "out" as const,
      description: "โอนเงินออก ชำระบัตรเครดิต",
      amount: 8500,
      included: true,
    },
    {
      code: "TRF",
      dateTime: "2024-06-02 14:00",
      type: "in" as const,
      description: "โอนเงินเข้าบัญชี จาก ธนาคารกรุงไทย",
      amount: 15000,
      included: false,
      excludeReason: "other_bank",
    },
  ];

  const FARM_STAGES = [
    "เตรียมดินก่อนเพาะปลูก",
    "เพาะปลูก",
    "ระยะโต",
    "เก็บเกี่ยวผลผลิต",
  ];

  const THAI_MONTHS_SHORT = [
    "ม.ค.",
    "ก.พ.",
    "มี.ค.",
    "เม.ย.",
    "พ.ค.",
    "มิ.ย.",
    "ก.ค.",
    "ส.ค.",
    "ก.ย.",
    "ต.ค.",
    "พ.ย.",
    "ธ.ค.",
  ];

  const THAI_MONTHS_FULL = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
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

  const YEAR_OPTIONS = Array.from({ length: 21 }, (_, i) => ({
    label: `${i} ปี`,
    value: String(i),
  }));
  const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
    label: `${i} เดือน`,
    value: String(i),
  }));

  const currentYearBE = new Date().getFullYear() + 543;
  const FARM_YEARS = Array.from({ length: 11 }, (_, i) => {
    const year = currentYearBE - 5 + i;
    return { label: String(year), value: String(year) };
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

  const FARM_STANDARD_PRICES: Record<string, { sales: number; cost: number }> =
    {
      ข้าวนาปี: { sales: 8000, cost: 4500 },
      ข้าวนาปรัง: { sales: 9500, cost: 5500 },
      ข้าวโพด: { sales: 7500, cost: 4000 },
      อ้อย: { sales: 13000, cost: 7000 },
      มันสำปะหลัง: { sales: 11000, cost: 5000 },
      ยางพารา: { sales: 16000, cost: 8000 },
      ปาร์มน้ำมัน: { sales: 15000, cost: 7500 },
      others: { sales: 0, cost: 0 },
    };

  const LIVESTOCK_STANDARD_PRICES: Record<
    string,
    { sales: number; cost: number }
  > = {
    pig: { sales: 8000, cost: 5000 },
    chicken: { sales: 150, cost: 90 },
    cow: { sales: 35000, cost: 20000 },
    duck: { sales: 120, cost: 70 },
    fish: { sales: 0, cost: 0 },
    shrimp: { sales: 0, cost: 0 },
    others: { sales: 0, cost: 0 },
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
    if (item.frequency === "daily") {
      const days = Number(item.daysPerMonth) || 0;
      result = amount * days;
    } else if (item.frequency === "weekly") {
      const weeks = Number(item.weeksPerMonth) || 0;
      result = amount * weeks;
    } else if (item.frequency === "monthly") {
      result = amount;
    } else if (item.frequency === "quarterly") {
      result = amount / 3;
    } else if (item.frequency === "yearly") {
      result = amount / 12;
    }
    return roundDown2(result);
  };

  const handleAddSECostRow = (occId: string) => {
    const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
    if (!occ) return;
    const currentCosts = occ.seCosts || [];
    handleOccupationChange(occId, "seCosts", [
      ...currentCosts,
      {
        type: "",
        customType: "",
        frequency: "",
        daysPerMonth: "",
        weeksPerMonth: "",
        costAmount: "",
        calculatedMonthly: "0",
      },
    ]);
  };

  const handleUpdateSECostRow = (
    occId: string,
    index: number,
    updates: Record<string, unknown>,
  ) => {
    const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
    if (!occ) return;
    const currentCosts = [...(occ.seCosts || [])];

    const currentRow: EnterpriseIncome = { ...currentCosts[index] };

    for (const [field, value] of Object.entries(updates)) {
      let finalValue = value;
      if (
        field === "costAmount" ||
        field === "daysPerMonth" ||
        field === "weeksPerMonth"
      ) {
        const clean = String(value).replace(/[^0-9.]/g, "");
        if (field === "costAmount") {
          const parts = clean.split(".");
          if (parts.length > 2) {
            finalValue = parts[0] + "." + parts.slice(1).join("");
          } else if (parts.length === 2 && parts[1].length > 2) {
            finalValue = parts[0] + "." + parts[1].slice(0, 2);
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

    handleOccupationChange(occId, "seCosts", currentCosts);
  };

  const handleRemoveSECostRow = (occId: string, index: number) => {
    const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
    if (!occ) return;
    const currentCosts = [...(occ.seCosts || [])];
    currentCosts.splice(index, 1);

    handleOccupationChange(occId, "seCosts", currentCosts);
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

  const handleAddIncomeDocument = (
    occId: string,
    docType: string,
    label: string,
  ) => {
    setCurrentDocContext({ occId, docType, label });
    // Snapshot existing doc IDs so upload dialog only shows newly uploaded files
    const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
    const existingIds = new Set(
      (occ?.incomeDocuments || []).map((d: IncomeDocument) => d.id),
    );
    setUploadSessionDocIds(existingIds);
    setIsUploadDialogOpen(true);
  };

  const generateMockOCRIncomeRows = (docType: string): SAIncome[] => {
    const sourceDocType = docType;
    if (docType.startsWith("payslip")) {
      return [
        { type: "salary", detail: "เงินเดือน", amount: "25000", sourceDocType },
        {
          type: "other_income",
          detail: "ค่าล่วงเวลา",
          amount: "3500",
          sourceDocType,
        },
        {
          type: "fixed_income",
          detail: "ค่าตำแหน่ง",
          amount: "2000",
          sourceDocType,
        },
        { type: "bonus", detail: "เบี้ยขยัน", amount: "1000", sourceDocType },
      ];
    } else if (docType.startsWith("statement_")) {
      return [
        {
          type: "other_income",
          detail: "เงินโอนเข้าบัญชี (เฉลี่ย 6 เดือน)",
          amount: "35000",
          sourceDocType,
        },
      ];
    } else if (docType.startsWith("tavi50_")) {
      return [
        {
          type: "salary",
          detail: "เงินได้พึงประเมินจำแนกตามประเภท",
          amount: "45000",
          sourceDocType,
        },
      ];
    } else if (docType === "salary_cert") {
      return [
        {
          type: "salary",
          detail: "เงินเดือนหนังสือรับรอง",
          amount: "30000",
          sourceDocType,
        },
      ];
    }
    return [];
  };

  const handleUploadMethodSelect = (method: "file" | "camera") => {
    // Do not close the dialog so user can see uploads and edit them
    if (method === "file" && fileInputRef.current) {
      fileInputRef.current?.click();
    } else if (method === "camera") {
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
    if (docType === "payslip") {
      const existingPayslipCount = currentDocs.filter((d: IncomeDocument) =>
        d.type?.startsWith("payslip_"),
      ).length;
      const newDocs: IncomeDocument[] = [];
      let allNewOCRRows: SAIncome[] = [];

      files.forEach((file, fileIdx) => {
        const payslipKey = `payslip_${existingPayslipCount + fileIdx}`;
        newDocs.push({
          id: generateId("doc"),
          type: payslipKey,
          name: file.name,
          originalName: file.name,
          url: URL.createObjectURL(file),
          status: "success",
          uploadedAt: new Date().toISOString(),
          // DEV MOCK: first file always has password
          ...(fileIdx === 0 ? { isLocked: true, password: "mock1234" } : {}),
        });
        allNewOCRRows = [
          ...allNewOCRRows,
          ...generateMockOCRIncomeRows(payslipKey),
        ];
      });

      const updatedIncomes = [...currentIncomes, ...allNewOCRRows];
      const totalIncome = updatedIncomes.reduce(
        (acc: number, curr: SAIncome) => acc + (Number(curr.amount) || 0),
        0,
      );

      handleOccupationChange(occId, {
        incomeDocuments: [...currentDocs, ...newDocs],
        saIncomes: updatedIncomes,
        totalIncome: totalIncome,
      });
    } else if (docType === "tavi50") {
      const existingTavi50Count = currentDocs.filter((d: IncomeDocument) =>
        d.type?.startsWith("tavi50_"),
      ).length;
      const newDocs: IncomeDocument[] = [];
      let allNewOCRRows: SAIncome[] = [];

      files.forEach((file, fileIdx) => {
        const tavi50Key = `tavi50_${existingTavi50Count + fileIdx}`;
        newDocs.push({
          id: generateId("doc"),
          type: tavi50Key,
          name: file.name,
          originalName: file.name,
          url: URL.createObjectURL(file),
          status: "success",
          uploadedAt: new Date().toISOString(),
          // DEV MOCK: first file always has password
          ...(fileIdx === 0 ? { isLocked: true, password: "mock1234" } : {}),
        });
        allNewOCRRows = [
          ...allNewOCRRows,
          ...generateMockOCRIncomeRows(tavi50Key),
        ];
      });

      const updatedIncomes = [...currentIncomes, ...allNewOCRRows];
      const totalIncome = updatedIncomes.reduce(
        (acc: number, curr: SAIncome) => acc + (Number(curr.amount) || 0),
        0,
      );

      handleOccupationChange(occId, {
        incomeDocuments: [...currentDocs, ...newDocs],
        saIncomes: updatedIncomes,
        totalIncome: totalIncome,
      });
    } else {
      const newDocs: IncomeDocument[] = files.map((file, fileIdx) => ({
        id: generateId("doc"),
        type: docType,
        name: file.name,
        originalName: file.name,
        url: URL.createObjectURL(file),
        status: "success",
        uploadedAt: new Date().toISOString(),
        // DEV MOCK: first file always has password
        ...(fileIdx === 0 ? { isLocked: true, password: "mock1234" } : {}),
      }));

      const newMockOCRRows = generateMockOCRIncomeRows(docType);
      const updatedIncomes = [...currentIncomes, ...newMockOCRRows];
      const totalIncome = updatedIncomes.reduce(
        (acc: number, curr: SAIncome) => acc + (Number(curr.amount) || 0),
        0,
      );

      handleOccupationChange(occId, {
        incomeDocuments: [...currentDocs, ...newDocs],
        saIncomes: updatedIncomes,
        totalIncome: totalIncome,
      });
    }

    // Reset file input only, DO NOT close dialog or clear context
    if (fileInputRef.current) fileInputRef.current.value = "";
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

    // For payslip and tavi50, assign unique indexed key
    const actualDocType =
      docType === "payslip"
        ? `payslip_${currentDocs.filter((d: IncomeDocument) => d.type?.startsWith("payslip_")).length}`
        : docType === "tavi50"
          ? `tavi50_${currentDocs.filter((d: IncomeDocument) => d.type?.startsWith("tavi50_")).length}`
          : docType;

    const scanName = `สแกน_${new Date().getTime()}.pdf`;
    const newDoc: IncomeDocument = {
      id: generateId("doc"),
      type: actualDocType,
      name: scanName,
      originalName: scanName,
      url: pages[0],
      status: "success",
      uploadedAt: new Date().toISOString(),
    };

    const newMockOCRRows = generateMockOCRIncomeRows(actualDocType);
    const updatedIncomes = [...currentIncomes, ...newMockOCRRows];
    const totalIncome = updatedIncomes.reduce(
      (acc: number, curr: SAIncome) => acc + (Number(curr.amount) || 0),
      0,
    );

    handleOccupationChange(occId, {
      incomeDocuments: [...currentDocs, newDoc],
      saIncomes: updatedIncomes,
      totalIncome: totalIncome,
    });
  };

  const handleUpdateIncomeDocument = (
    occId: string,
    docId: string,
    updates: Partial<IncomeDocument>,
  ) => {
    const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
    if (!occ) return;
    const currentDocs = (occ.incomeDocuments || []).map((d: IncomeDocument) =>
      d.id === docId ? { ...d, ...updates } : d,
    );
    handleOccupationChange(occId, "incomeDocuments", currentDocs);
  };

  const handleRemoveIncomeDocument = (occId: string, docId: string) => {
    const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
    if (!occ) return;
    const currentDocs = (occ.incomeDocuments || []).filter(
      (d: IncomeDocument) => d.id !== docId,
    );
    handleOccupationChange(occId, "incomeDocuments", currentDocs);
    setItemToDelete(null);
  };

  const handleReorderIncomeDocument = (
    occId: string,
    docId: string,
    direction: "up" | "down",
  ) => {
    const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
    if (!occ) return;
    const docs = [...(occ.incomeDocuments || [])];
    const currentIndex = docs.findIndex((d: IncomeDocument) => d.id === docId);
    if (currentIndex === -1) return;
    const targetIndex =
      direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= docs.length) return;
    [docs[currentIndex], docs[targetIndex]] = [
      docs[targetIndex],
      docs[currentIndex],
    ];
    handleOccupationChange(occId, "incomeDocuments", docs);
  };

  const handleDragReorderIncomeDocument = (
    occId: string,
    fromIndex: number,
    toIndex: number,
    filteredIds: string[],
  ) => {
    const occ = occupations.find((o: IncomeOccupation) => o.id === occId);
    if (!occ || fromIndex === toIndex) return;
    const docs = [...(occ.incomeDocuments || [])];
    // Map filteredIds positions to actual docs array positions and reorder
    const filteredDocs = filteredIds
      .map((id) => docs.find((d) => d.id === id)!)
      .filter(Boolean);
    const [moved] = filteredDocs.splice(fromIndex, 1);
    filteredDocs.splice(toIndex, 0, moved);
    // Rebuild full docs array: replace filtered docs in their original slots, preserving others
    const filteredSet = new Set(filteredIds);
    const result: typeof docs = [];
    let filteredIdx = 0;
    for (const doc of docs) {
      if (filteredSet.has(doc.id)) {
        result.push(filteredDocs[filteredIdx++]);
      } else {
        result.push(doc);
      }
    }
    handleOccupationChange(occId, "incomeDocuments", result);
  };

  const THAI_BANKS = [
    {
      label: "ธนาคารกสิกรไทย",
      value: "KBANK",
      logo: "/bank-logo/Type=KBank.svg",
    },
    {
      label: "ธนาคารไทยพาณิชย์",
      value: "SCB",
      logo: "/bank-logo/Type=SCB.svg",
    },
    { label: "ธนาคารกรุงเทพ", value: "BBL", logo: "/bank-logo/Type=BBL.svg" },
    {
      label: "ธนาคารกรุงศรีอยุธยา",
      value: "BAY",
      logo: "/bank-logo/Type=Bank of Ayudhya (Krungsri).svg",
    },
    {
      label: "ธนาคารกรุงไทย",
      value: "KTB",
      logo: "/bank-logo/Type=Krungthai Bank.svg",
    },
    {
      label: "ธนาคารทหารไทยธนชาต",
      value: "ttb",
      logo: "/bank-logo/Type=TTB.svg",
    },
    { label: "ธนาคารออมสิน", value: "GSB", logo: "/bank-logo/Type=GSB.svg" },
    {
      label: "ทรูมันนี่วอลเล็ท",
      value: "TRUEMONEY",
      logo: "/bank-logo/Type=Truemoney.svg",
    },
  ];

  const INCOME_DOC_TYPES = [
    { id: "payslip", label: "สลิปเงินเดือน (Payslip)" },
    { id: "statement", label: "รายการเดินบัญชี (Statement)" },
    { id: "tavi50", label: "ทวิ 50" },
    { id: "salary_cert", label: "หนังสือรับรองเงินเดือน" },
  ];

  return (
    <div className="flex flex-col gap-6 items-start animate-in fade-in slide-in-from-bottom-2">
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
              อาชีพและรายได้
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-0">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="relative flex items-stretch sticky top-0 z-20 bg-white border-b border-border-subtle -mx-6 pr-6 shadow-[0_4px_6px_-4px_rgba(0,0,0,0.05)]">
                {/* Scrollable Tab List */}
                <div className="flex-1 overflow-x-auto no-scrollbar pr-4 min-w-0">
                  <TabsList className="bg-transparent h-auto p-0 flex items-stretch gap-0 w-max">
                    {occupations.map((occ: IncomeOccupation, index: number) => {
                      const occName = occ.occupationCode
                        ? OCCUPATIONS.find(
                            (o) => (o.value || o.label) === occ.occupationCode,
                          )?.label
                        : undefined;

                      // Compute per-occupation net income
                      let occIncome = 0;
                      if (occ.employmentType === "SA") {
                        occIncome = (occ.saIncomes || []).reduce(
                          (sum: number, item: SAIncome) =>
                            sum + (Number(item.amount) || 0),
                          0,
                        );
                      } else if (occ.employmentType === "SE") {
                        if (occ.occupationCode === "FARMER") {
                          const std = FARM_STANDARD_PRICES[
                            occ.produceType || "others"
                          ] || { sales: 0, cost: 0 };
                          const totalAreaRai =
                            Number(occ.cultivationAreaRai || 0) +
                            Number(occ.cultivationAreaNgan || 0) / 4 +
                            Number(occ.cultivationAreaSqWa || 0) / 400;
                          const cycles = Number(occ.cyclesPerYear || 1);
                          const laborers = Number(occ.laborCount || 1) || 1;
                          const salesValue = occ.customerSalesPerRai
                            ? Number(occ.customerSalesPerRai)
                            : std.sales;
                          const costValue = occ.customerCostPerRai
                            ? Number(occ.customerCostPerRai)
                            : std.cost;
                          occIncome = Math.max(
                            0,
                            ((salesValue - costValue) * totalAreaRai * cycles) /
                              12 /
                              laborers,
                          );
                        } else if (occ.occupationCode === "LIVESTOCK") {
                          const totalNet = (occ.livestockCycles || []).reduce(
                            (sum, c) => sum + (Number(c.netIncome) || 0),
                            0,
                          );
                          occIncome = totalNet / 12;
                        } else {
                          const sales = (occ.seIncomes || []).reduce(
                            (sum: number, item: SAIncome) =>
                              sum + (Number(item.calculatedMonthly) || 0),
                            0,
                          );
                          const costs = (occ.seCosts || []).reduce(
                            (sum: number, item: SAIncome) =>
                              sum + (Number(item.calculatedMonthly) || 0),
                            0,
                          );
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
                                <>อาชีพหลัก</>
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
                                <span className="text-[11px] font-medium text-gray-400 group-data-[state=active]/tab:text-chaiyo-blue/60">
                                  ·
                                </span>
                              )}
                              {occIncome > 0 && (
                                <span className="text-[11px] font-semibold text-chaiyo-blue/60 group-data-[state=active]/tab:text-chaiyo-blue font-mono">
                                  {formatNumberWithCommas(occIncome)}
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
                                  ? OCCUPATIONS.find(
                                      (o) =>
                                        (o.value || o.label) ===
                                        occ.occupationCode,
                                    )?.label
                                  : undefined;
                                setItemToDelete({
                                  id: occ.id,
                                  name: occLabel
                                    ? `อาชีพเสริม (${occLabel})`
                                    : "อาชีพเสริม",
                                  type: "occupation",
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
                    disabled={
                      occupations.filter((o: IncomeOccupation) => !o.isMain)
                        .length >= 10
                    }
                    className="h-9 gap-1.5 whitespace-nowrap text-gray-500 hover:text-chaiyo-blue hover:bg-blue-50/50 transition-colors text-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    เพิ่มอาชีพ
                  </Button>
                </div>
              </div>

              {/* Separator below sticky tabs */}
              <div className="h-6"></div>

              {occupations.map((occ: IncomeOccupation) => {
                // --- Shared Document Table Variables & Helpers FOR BOTH SA AND SE ---
                const allDocs = occ.incomeDocuments || [];
                const allIncomes = occ.saIncomes || [];
                const customDocTypes = occ.customDocTypes || [];

                const uploadedDocTypes = Array.from(
                  new Set(allDocs.map((d: IncomeDocument) => d.type)),
                ).filter(Boolean) as string[];

                const incomesBySource: Record<
                  string,
                  (SAIncome & { originalIndex: number })[]
                > = {};
                const otherIncomes: (SAIncome & { originalIndex: number })[] =
                  [];

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

                const renderIncomeTable = (
                  title: string,
                  sourceKey: string | undefined,
                  incomes: (SAIncome & { originalIndex: number })[],
                  showAddButton: boolean = true,
                  sourceDocs?: IncomeDocument[],
                  onRemove?: () => void,
                  isYearly: boolean = false,
                  isMandatory: boolean = true,
                ) => {
                  const sourceTotal = incomes.reduce(
                    (sum, item) =>
                      sum +
                      (Number(isYearly ? item.yearlyAmount : item.amount) || 0),
                    0,
                  );
                  const sourceDoc =
                    sourceDocs && sourceDocs.length > 0
                      ? sourceDocs[0]
                      : undefined;
                  const displayTitle = sourceDoc
                    ? (sourceDoc.originalName || sourceDoc.name) || title
                    : title;

                  return (
                    <div key={sourceKey || "other"} className="space-y-3">
                      <div className="flex items-center justify-between pl-1 pr-1">
                        <div className="flex items-center gap-2 truncate">
                          <Label className="text-sm font-bold text-gray-700 truncate">
                            {displayTitle}
                          </Label>
                          {sourceDoc && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                window.open(sourceDoc.url, "_blank")
                              }
                              className="h-7 w-7 p-0 text-gray-400 hover:text-chaiyo-blue shrink-0"
                              title="ดูเอกสารต้นฉบับ"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {onRemove && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={onRemove}
                              className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200"
                              title="ลบเดือนนี้"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                          {showAddButton && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleAddSAIncomeRow(occ.id, sourceKey)
                              }
                              className="h-8 text-xs font-medium bg-white"
                            >
                              <Plus className="w-3 h-3 mr-1" />{" "}
                              เพิ่มรายการรายได้
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="border border-border-strong rounded-xl overflow-hidden bg-white">
                        <Table>
                          <TableHeader className="bg-gray-50/50">
                            <TableRow>
                              <TableHead className="w-[30%] text-xs py-3">
                                ประเภทรายได้{" "}
                                {isMandatory && <span className="text-red-500">*</span>}
                              </TableHead>
                              <TableHead className="w-[40%] text-xs py-3">
                                รายละเอียดรายได้
                              </TableHead>
                              <TableHead className="w-[20%] text-xs py-3 text-right">
                                รายได้{isYearly ? "ทั้งปี" : ""} (บาท){" "}
                                {isMandatory && <span className="text-red-500">*</span>}
                              </TableHead>
                              <TableHead className="w-[10%] text-center text-xs py-3">
                                จัดการ
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {incomes.length === 0 ? (
                              <TableRow>
                                <TableCell
                                  colSpan={4}
                                  className="h-16 text-center text-muted-foreground italic text-xs"
                                >
                                  ยังไม่มีรายการรายได้ กรุณากดเพิ่มรายการ
                                </TableCell>
                              </TableRow>
                            ) : (
                              incomes.map((item) => {
                                const originalIdx = item.originalIndex;
                                return (
                                  <TableRow
                                    key={originalIdx}
                                    className="group transition-colors hover:bg-gray-50/50"
                                  >
                                    <TableCell className="py-2.5">
                                      <Select
                                        value={item.type || ""}
                                        onValueChange={(val) =>
                                          handleUpdateSAIncomeRow(
                                            occ.id,
                                            originalIdx,
                                            "type",
                                            val,
                                          )
                                        }
                                      >
                                        <SelectTrigger className="h-9 text-sm bg-gray-50/30">
                                          <SelectValue placeholder="เลือกประเภท" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {SA_INCOME_TYPES.map((type) => (
                                            <SelectItem
                                              key={type.value}
                                              value={type.value}
                                            >
                                              {type.label}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </TableCell>
                                    <TableCell className="py-2.5">
                                      <Input
                                        value={item.detail || ""}
                                        onChange={(e) =>
                                          handleUpdateSAIncomeRow(
                                            occ.id,
                                            originalIdx,
                                            "detail",
                                            e.target.value,
                                          )
                                        }
                                        placeholder="เช่น ค่าตำแหน่ง, ค่าครองชีพ"
                                        className="h-9 text-sm bg-gray-50/30"
                                      />
                                    </TableCell>
                                    <TableCell className="py-2.5">
                                      <Input
                                        type="text"
                                        value={formatNumberWithCommas(
                                          (isYearly
                                            ? item.yearlyAmount
                                            : item.amount) ?? "",
                                        )}
                                        onChange={(e) =>
                                          handleUpdateSAIncomeRow(
                                            occ.id,
                                            originalIdx,
                                            isYearly
                                              ? "yearlyAmount"
                                              : "amount",
                                            e.target.value,
                                          )
                                        }
                                        placeholder="0.00"
                                        className="h-9 text-sm bg-gray-50/30 text-right font-mono"
                                      />
                                    </TableCell>
                                    <TableCell className="py-2.5 text-center">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-gray-400 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0 rounded-full"
                                        onClick={() =>
                                          setItemToDelete({
                                            index: originalIdx,
                                            occId: occ.id,
                                            name:
                                              item.detail ||
                                              SA_INCOME_TYPES.find(
                                                (t) => t.value === item.type,
                                              )?.label ||
                                              `รายการที่ ${originalIdx + 1}`,
                                            type: "saIncomeRow",
                                          })
                                        }
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
                                <TableCell
                                  colSpan={2}
                                  className="text-right font-bold py-3 text-xs text-gray-700"
                                >
                                  รวมยอดจากเอกสารนี้:
                                </TableCell>
                                <TableCell
                                  colSpan={2}
                                  className="text-right pr-[4.5rem] py-3"
                                >
                                  <div className="text-sm font-semibold font-mono text-gray-700">
                                    {formatNumberWithCommas(sourceTotal)}
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

                const bankAccounts = occ.bankAccounts || [];
                const dynamicDocTypes: { id: string; label: string }[] = [];
                const payslipDocTypes = uploadedDocTypes.filter((dt) =>
                  dt.startsWith("payslip_"),
                );
                const tavi50DocTypes = uploadedDocTypes.filter((dt) =>
                  dt.startsWith("tavi50_monthly_"),
                );
                const payslipMonths: string[] = occ.payslipMonths || [];
                const payslipSlipCounts: Record<string, number> =
                  occ.payslipSlipCounts || {};
                const tavi50Months: string[] = occ.tavi50MonthlyMonths || [];
                const tavi50SlipCounts: Record<string, number> =
                  occ.tavi50MonthlySlipCounts || {};

                INCOME_DOC_TYPES.forEach((dt) => {
                  if (dt.id === "payslip") {
                    payslipDocTypes.forEach((pdt, idx) => {
                      dynamicDocTypes.push({
                        id: pdt,
                        label: `สลิปเงินเดือน (Payslip) - เดือนที่ ${idx + 1}`,
                      });
                    });
                  } else if (dt.id === "tavi50") {
                    if (occ.hasTavi50Yearly) {
                      dynamicDocTypes.push({
                        id: "tavi50_yearly",
                        label: "ทวิ 50 (รายปี)",
                      });
                    }
                    if (tavi50Months.length > 0) {
                      tavi50Months.forEach((mLabel, mIdx) => {
                        const slipCount = tavi50SlipCounts[String(mIdx)] || 0;
                        for (let sIdx = 0; sIdx < slipCount; sIdx++) {
                          dynamicDocTypes.push({
                            id: `tavi50_monthly_${mIdx}_slip_${sIdx}`,
                            label: `ทวิ 50 (รายเดือน) - ${mLabel} รูปที่ ${sIdx + 1}`,
                          });
                        }
                      });
                    }
                    // Fallback: always show generic row if no specific variants exist
                    if (!occ.hasTavi50Yearly && tavi50Months.length === 0) {
                      dynamicDocTypes.push(dt);
                    }
                  } else if (dt.id === "statement") {
                    if (bankAccounts.length > 0) {
                      bankAccounts.forEach(
                        (account: BankAccount, accIdx: number) => {
                          const bankInfo = THAI_BANKS.find(
                            (b) => b.value === account.bankName,
                          );
                          const bankLabel =
                            bankInfo?.label || `บัญชีที่ ${accIdx + 1}`;
                          dynamicDocTypes.push({
                            id: `statement_${accIdx}`,
                            label: `รายการเดินบัญชี - ${bankLabel}`,
                          });
                        },
                      );
                    } else {
                      dynamicDocTypes.push(dt);
                    }
                  } else {
                    dynamicDocTypes.push(dt);
                  }
                });
                customDocTypes.forEach((ct) => dynamicDocTypes.push(ct));

                const statementUploaded = uploadedDocTypes.filter((dt) =>
                  dt.startsWith("statement_"),
                );
                const tavi50YearlyUploaded =
                  uploadedDocTypes.includes("tavi50_yearly");
                const tavi50MonthlyUploaded =
                  uploadedDocTypes.filter((dt) =>
                    dt.startsWith("tavi50_monthly_"),
                  ).length > 0;
                const salaryCertUploaded =
                  uploadedDocTypes.includes("salary_cert");
                const otherUploaded = uploadedDocTypes.filter(
                  (dt) =>
                    !dt.startsWith("payslip_") &&
                    !dt.startsWith("statement_") &&
                    dt !== "salary_cert" &&
                    dt !== "tavi50_yearly" &&
                    dt !== "tavi50_monthly" &&
                    !dt.startsWith("tavi50_monthly_"),
                );

                // SE Statement: summary-only table with "จัดการรายการ" button
                const seStatementSection =
                  occ.employmentType === "SE" &&
                  occ.useBankStatementIncome &&
                  statementUploaded.length > 0 ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500 mb-6 mt-6">
                      {statementUploaded.map((dt) => {
                        const accIdx = Number(dt.replace("statement_", ""));
                        const account = bankAccounts[accIdx];
                        const bankInfo = account
                          ? THAI_BANKS.find((b) => b.value === account.bankName)
                          : undefined;
                        const bankLabel =
                          bankInfo?.label || `บัญชีที่ ${accIdx + 1}`;
                        const accountNo = account?.accountNo || "";
                        const stmtDocs = allDocs.filter(
                          (d: IncomeDocument) => d.type === dt,
                        );
                        const seItems = occ.seStatementItems || [];
                        const includedItems = seItems.filter(
                          (item) => item.included,
                        );
                        const seTotalIncome = includedItems.reduce(
                          (sum, item) => sum + (Number(item.amount) || 0),
                          0,
                        );

                        return (
                          <div
                            key={dt}
                            className="border border-border-strong rounded-xl bg-white overflow-hidden"
                          >
                            {/* Bank Header */}
                            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-color">
                              <div className="flex items-center gap-2.5">
                                {bankInfo?.logo && (
                                  <img
                                    src={bankInfo.logo}
                                    alt={bankLabel}
                                    className="w-6 h-6 object-contain shrink-0"
                                  />
                                )}
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold text-gray-800">
                                    {bankLabel}
                                  </span>
                                  {accountNo && (
                                    <span className="text-sm font-bold text-gray-800">
                                      ({accountNo})
                                    </span>
                                  )}
                                </div>
                                {stmtDocs.length > 0 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      window.open(stmtDocs[0].url, "_blank")
                                    }
                                    className="h-7 w-7 p-0 text-gray-400 hover:text-chaiyo-blue"
                                    title="ดูเอกสารต้นฉบับ"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  initSEStatementMockData(occ.id);
                                  setSeStatementDialogContext({
                                    occId: occ.id,
                                    bankIdx: accIdx,
                                  });
                                  setSeStatementPage(1);
                                  setSeStatementDialogOpen(true);
                                }}
                                className="h-8 text-xs font-medium"
                              >
                                <Pencil className="w-3 h-3 mr-1" /> จัดการรายการ
                              </Button>
                            </div>

                            {/* Summary Row */}
                            <Table>
                              <TableBody>
                                <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                                  <TableCell className="py-3.5 text-sm font-medium text-gray-700">
                                    รายได้รวมจากรายการเดินบัญชี
                                    <span className="text-xs text-muted-foreground ml-2">
                                      ({includedItems.length}/{seItems.length}{" "}
                                      รายการ)
                                    </span>
                                  </TableCell>
                                  <TableCell className="py-3.5 text-right pr-6">
                                    <span className="text-base font-bold font-mono text-gray-800">
                                      {formatNumberWithCommas(seTotalIncome)}
                                    </span>
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>

                            {/* Corporate Account Checkbox */}
                            <div className="px-5 py-4 border-t border-border-color bg-gray-50/20">
                              <div className="mb-3 flex items-center gap-1.5 text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200/60 px-2.5 py-1.5 rounded-md w-fit">
                                <Info className="w-4 h-4" />
                                <span>เนื่องจากบัญชีผู้กู้ไม่ตรงกับชื่อผู้กู้</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  id={`corp-acc-${occ.id}-${accIdx}`}
                                  checked={account?.isCorporateAccount || false}
                                  onCheckedChange={(checked) =>
                                    handleUpdateBankAccount(
                                      occ.id,
                                      accIdx,
                                      "isCorporateAccount",
                                      !!checked as any,
                                    )
                                  }
                                />
                                <Label
                                  htmlFor={`corp-acc-${occ.id}-${accIdx}`}
                                  className="cursor-pointer font-medium"
                                >
                                  บัญชีนี้เป็นบัญชีที่อ้างอิงบัญชีนิติบุคคล
                                </Label>
                              </div>
                              {account?.isCorporateAccount && (
                                <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                  <Label className="text-xs mb-1.5 block">
                                    ชื่อบัญชีนิติบุคคล{" "}
                                    <span className="text-red-500">*</span>
                                  </Label>
                                  <Input
                                    type="text"
                                    placeholder="ระบุชื่อบัญชีนิติบุคคล"
                                    value={account.corporateAccountName || ""}
                                    onChange={(e) =>
                                      handleUpdateBankAccount(
                                        occ.id,
                                        accIdx,
                                        "corporateAccountName",
                                        e.target.value,
                                      )
                                    }
                                    className="bg-white max-w-md"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : null;

                return (
                  <TabsContent
                    key={occ.id}
                    value={occ.id}
                    className="space-y-8 animate-in fade-in duration-300"
                  >
                    {/* 1. ข้อมูลอาชีพ */}
                    <div className="rounded-xl border border-border-color bg-gray-50/40 p-6 space-y-4">
                      <h4 className="text-base font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-border-color">
                        <Briefcase className="w-5 h-5 text-chaiyo-blue" />{" "}
                        ข้อมูลอาชีพ
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <div className="space-y-2">
                          <Label>
                            ประเภทการจ้างงาน{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={occ.employmentType || ""}
                            onValueChange={(val) => {
                              handleOccupationChange(occ.id, {
                                employmentType: val,
                                jobPosition: "",
                                jobPositionOther: "",
                              });
                            }}
                          >
                            <SelectTrigger className="h-11 bg-white">
                              <SelectValue placeholder="เลือกประเภทการจ้างงาน" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="SE">
                                ธุรกิจส่วนตัว (SE)
                              </SelectItem>
                              <SelectItem value="SA">
                                พนักงานประจำ / ลูกจ้างชั่วคราว (SA)
                              </SelectItem>
                              <SelectItem value="UNEMPLOYED">
                                ว่างงาน
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {occ.employmentType && (
                          <>
                            <div className="space-y-2">
                              <Label>
                                อาชีพ <span className="text-red-500">*</span>
                              </Label>
                              <Combobox
                                options={OCCUPATIONS.filter(
                                  (o) =>
                                    !occ.employmentType ||
                                    o.types.includes(occ.employmentType),
                                ).map((o) => ({
                                  value: o.value || o.label,
                                  label: o.label,
                                }))}
                                value={occ.occupationCode || ""}
                                onValueChange={(val) =>
                                  handleOccupationChange(
                                    occ.id,
                                    "occupationCode",
                                    val,
                                  )
                                }
                                placeholder="เลือกอาชีพ"
                                searchPlaceholder="ค้นหาอาชีพ..."
                                emptyText="ไม่พบข้อมูลอาชีพ"
                                className="h-11 shadow-none border-gray-200"
                              />
                            </div>

                            {!!occ.occupationCode && occ.occupationCode !== "UNEMPLOYED" && (
                              <>
                                {occ.employmentType === "SE" && (
                                  <div className="space-y-2">
                                    <Label>ประเภทธุรกิจ (ISIC)</Label>
                                    <Select
                                      value={occ.businessTypeIsic || ""}
                                      onValueChange={(val) =>
                                        handleOccupationChange(
                                          occ.id,
                                          "businessTypeIsic",
                                          val,
                                        )
                                      }
                                    >
                                      <SelectTrigger className="h-11 bg-white">
                                        <SelectValue placeholder="เลือกประเภทธุรกิจ" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="isic1">
                                          Mockup ISIC ที่ 1
                                        </SelectItem>
                                        <SelectItem value="isic2">
                                          Mockup ISIC ที่ 2
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                )}

                                <div className="space-y-2 col-span-1 md:col-span-2">
                                  <Label>ระบุรายละเอียดเพิ่มเติม</Label>
                                  <Textarea
                                    value={occ.occupationDetail || ""}
                                    onChange={(e) =>
                                      handleOccupationChange(
                                        occ.id,
                                        "occupationDetail",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="รายละเอียดเพิ่มเติมเกี่ยวกับอาชีพ"
                                    className="resize-none h-20 bg-white"
                                  />
                                </div>

                                {occ.employmentType && (
                                  <div className="space-y-2 col-span-1 md:col-span-2">
                                    <Label>
                                      ตำแหน่งงาน{" "}
                                      <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <Select
                                        value={occ.jobPosition || ""}
                                        onValueChange={(val) =>
                                          handleOccupationChange(
                                            occ.id,
                                            "jobPosition",
                                            val,
                                          )
                                        }
                                      >
                                        <SelectTrigger className="h-11 bg-white">
                                          <SelectValue placeholder="เลือกตำแหน่งงาน" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {occ.employmentType === "SE" && (
                                            <>
                                              <SelectItem value="shareholder">
                                                ผู้ถือหุ้น / หุ้นส่วน
                                              </SelectItem>
                                              <SelectItem value="owner">
                                                เจ้าของกิจการ
                                              </SelectItem>
                                              <SelectItem value="other">
                                                อื่นๆ โปรดระบุ
                                              </SelectItem>
                                            </>
                                          )}
                                          {occ.employmentType === "SA" && (
                                            <>
                                              <SelectItem value="executive">
                                                ผู้บริหารระดับสูง
                                              </SelectItem>
                                              <SelectItem value="general">
                                                พนักงานทั่วไป
                                              </SelectItem>
                                              <SelectItem value="permanent">
                                                ลูกจ้างประจำ (ข้าราชการ
                                                และรัฐวิสาหกิจ)
                                              </SelectItem>
                                              <SelectItem value="temporary">
                                                ลูกจ้างชั่วคราว
                                              </SelectItem>
                                              <SelectItem value="other">
                                                อื่นๆ โปรดระบุ
                                              </SelectItem>
                                            </>
                                          )}
                                          {occ.employmentType ===
                                            "UNEMPLOYED" && (
                                            <>
                                              <SelectItem value="retired">
                                                เกษียณ
                                              </SelectItem>
                                              <SelectItem value="unemployed">
                                                ว่างงาน
                                              </SelectItem>
                                              <SelectItem value="other">
                                                อื่นๆ โปรดระบุ
                                              </SelectItem>
                                            </>
                                          )}
                                        </SelectContent>
                                      </Select>
                                      {occ.jobPosition === "other" && (
                                        <Input
                                          value={occ.jobPositionOther || ""}
                                          onChange={(e) =>
                                            handleOccupationChange(
                                              occ.id,
                                              "jobPositionOther",
                                              e.target.value,
                                            )
                                          }
                                          placeholder="โปรดระบุตำแหน่งงาน"
                                          className="h-11 bg-white"
                                        />
                                      )}
                                    </div>
                                  </div>
                                )}

                                <div className="space-y-2">
                                  <Label>
                                    ประเทศที่มาของรายได้{" "}
                                    <span className="text-red-500">*</span>
                                  </Label>
                                  <Select
                                    value={occ.incomeCountry || "TH"}
                                    onValueChange={(val) =>
                                      handleOccupationChange(
                                        occ.id,
                                        "incomeCountry",
                                        val,
                                      )
                                    }
                                  >
                                    <SelectTrigger className="h-11 bg-white">
                                      <SelectValue placeholder="เลือกประเทศ" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="TH">
                                        ไทย (Thai)
                                      </SelectItem>
                                      <SelectItem value="MM">
                                        พม่า (Myanmar)
                                      </SelectItem>
                                      <SelectItem value="LA">
                                        ลาว (Laos)
                                      </SelectItem>
                                      <SelectItem value="KH">
                                        กัมพูชา (Cambodia)
                                      </SelectItem>
                                      <SelectItem value="CN">
                                        จีน (China)
                                      </SelectItem>
                                      <SelectItem value="JP">
                                        ญี่ปุ่น (Japan)
                                      </SelectItem>
                                      <SelectItem value="VN">
                                        เวียดนาม (Vietnam)
                                      </SelectItem>
                                      <SelectItem value="MY">
                                        มาเลเซีย (Malaysia)
                                      </SelectItem>
                                      <SelectItem value="SG">
                                        สิงคโปร์ (Singapore)
                                      </SelectItem>
                                      <SelectItem value="US">
                                        สหรัฐอเมริกา (USA)
                                      </SelectItem>
                                      <SelectItem value="GB">
                                        สหราชอาณาจักร (UK)
                                      </SelectItem>
                                      <SelectItem value="OTHER">
                                        อื่นๆ (Other)
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <Label>
                                    แหล่งที่มาของรายได้{" "}
                                    <span className="text-red-500">*</span>
                                  </Label>
                                  <Select
                                    value={occ.incomeSource || ""}
                                    onValueChange={(val) =>
                                      handleOccupationChange(
                                        occ.id,
                                        "incomeSource",
                                        val,
                                      )
                                    }
                                  >
                                    <SelectTrigger className="h-11 bg-white">
                                      <SelectValue placeholder="เลือกแหล่งที่มารายได้" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="commission">
                                        ค่านายหน้า/ค่าธรรมเนียม/ค่าส่วนลด
                                      </SelectItem>
                                      <SelectItem value="copyright">
                                        ค่าลิขสิทธิ์และทรัพย์สินทางปัญญา
                                      </SelectItem>
                                      <SelectItem value="freelance">
                                        ค่าวิชาชีพอิสระ
                                      </SelectItem>
                                      <SelectItem value="rent">
                                        ค่าเช่า
                                      </SelectItem>
                                      <SelectItem value="interest">
                                        ดอกเบี้ย เงินปันผล และ Cyptocurrency
                                      </SelectItem>
                                      <SelectItem value="salary">
                                        เงินเดือน/ค่าจ้าง/เบี้ยเลี้ยง/โบนัส
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {occ.employmentType &&
                      !!occ.occupationCode &&
                      occ.occupationCode !== "UNEMPLOYED" && (
                        <>
                          {/* 2. ที่อยู่ที่ทำงาน / กิจการ */}
                          <div className="rounded-xl border border-gray-200 bg-gray-50/40 p-5">
                            <AddressForm
                              title="ที่อยู่ที่ทำงาน / กิจการ"
                              prefix="work"
                              formData={
                                occ.isSameAsMainAddress
                                  ? formData.occupations?.find(
                                      (o: IncomeOccupation) =>
                                        o.id === occ.isSameAsMainAddress,
                                    ) || {}
                                  : occ
                              }
                              onChange={(field, val) =>
                                handleOccupationChange(occ.id, field, val)
                              }
                              disabled={!!occ.isSameAsMainAddress}
                              requiredFields={
                                occ.employmentType === "SA"
                                  ? [
                                      "houseNumber",
                                      "province",
                                      "district",
                                      "subDistrict",
                                      "zipCode",
                                    ]
                                  : [
                                      "province",
                                      "district",
                                      "subDistrict",
                                      "zipCode",
                                    ]
                              }
                              groupRequiredNote={
                                occ.employmentType === "SA"
                                  ? "กรุณาระบุอย่างน้อย 1 รายการ: หมู่ที่, ซอย, แยก, หรือถนน"
                                  : undefined
                              }
                              headerChildren={
                                !occ.isMain ? (
                                  <div className="space-y-4 mb-4 mt-2">
                                    <div className="space-y-2">
                                      <Label className="text-sm">
                                        เลือกที่อยู่ที่ทำงาน
                                      </Label>
                                      <Select
                                        value={
                                          occ.isSameAsMainAddress || "_none"
                                        }
                                        onValueChange={(val) => {
                                          handleOccupationChange(
                                            occ.id,
                                            "isSameAsMainAddress",
                                            val === "_none" ? "" : val,
                                          );
                                        }}
                                      >
                                        <SelectTrigger className="h-12 bg-white">
                                          <SelectValue placeholder="เลือกแหล่งที่มาของที่อยู่" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="_none">
                                            ระบุที่อยู่ใหม่
                                          </SelectItem>
                                          {occupations
                                            .filter(
                                              (o: IncomeOccupation) =>
                                                o.id !== occ.id,
                                            )
                                            .map((o: IncomeOccupation) => {
                                              const label = o.isMain
                                                ? "อาชีพหลัก"
                                                : `อาชีพเสริม ${occupations.filter((x: IncomeOccupation) => !x.isMain).findIndex((x: IncomeOccupation) => x.id === o.id) + 1}`;
                                              const occName = o.occupationCode
                                                ? OCCUPATIONS.find(
                                                    (oc) =>
                                                      (oc.value || oc.label) ===
                                                      o.occupationCode,
                                                  )?.label
                                                : undefined;
                                              return (
                                                <SelectItem
                                                  key={o.id}
                                                  value={o.id}
                                                >
                                                  ที่อยู่{label}
                                                  {occName
                                                    ? ` (${occName})`
                                                    : ""}
                                                </SelectItem>
                                              );
                                            })}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    {occ.isSameAsMainAddress &&
                                      (() => {
                                        const sourceOcc = occupations.find(
                                          (o: IncomeOccupation) =>
                                            o.id === occ.isSameAsMainAddress,
                                        );
                                        const sourceLabel = sourceOcc?.isMain
                                          ? "อาชีพหลัก"
                                          : `อาชีพเสริม ${occupations.filter((x: IncomeOccupation) => !x.isMain).findIndex((x: IncomeOccupation) => x.id === sourceOcc?.id) + 1}`;
                                        return (
                                          <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl text-sm text-chaiyo-blue flex items-center gap-2">
                                            <Info className="w-4 h-4" />
                                            ใช้ข้อมูลที่อยู่เดียวกับที่อยู่
                                            {sourceLabel}
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
                                      <Label className="text-xs text-muted-foreground">
                                        บริเวณใกล้เคียง/จุดสังเกต
                                      </Label>
                                      <Input
                                        value={
                                          (occ.isSameAsMainAddress
                                            ? (
                                                formData.occupations?.find(
                                                  (o: IncomeOccupation) =>
                                                    o.id ===
                                                    occ.isSameAsMainAddress,
                                                ) || ({} as IncomeOccupation)
                                              ).workLandmark
                                            : occ.workLandmark) || ""
                                        }
                                        onChange={(e) =>
                                          handleOccupationChange(
                                            occ.id,
                                            "workLandmark",
                                            e.target.value,
                                          )
                                        }
                                        placeholder="เช่น ใกล้เซเว่น, ตรงข้ามธนาคาร"
                                        className="h-12 bg-white"
                                        disabled={!!occ.isSameAsMainAddress}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-xs text-muted-foreground">
                                        ลักษณะที่ตั้งของกิจการ{" "}
                                        <span className="text-red-500">*</span>
                                      </Label>
                                      <div className="flex flex-col gap-2">
                                        <Select
                                          value={
                                            (occ.isSameAsMainAddress
                                              ? (
                                                  formData.occupations?.find(
                                                    (o: IncomeOccupation) =>
                                                      o.id ===
                                                      occ.isSameAsMainAddress,
                                                  ) || ({} as IncomeOccupation)
                                                ).workLocationType
                                              : occ.workLocationType) || ""
                                          }
                                          onValueChange={(val) =>
                                            handleOccupationChange(
                                              occ.id,
                                              "workLocationType",
                                              val,
                                            )
                                          }
                                          disabled={!!occ.isSameAsMainAddress}
                                        >
                                          <SelectTrigger
                                            className="h-12 bg-white"
                                            disabled={!!occ.isSameAsMainAddress}
                                          >
                                            <SelectValue placeholder="โลเกชั่นที่ตั้ง" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="rental">
                                              พื้นที่เช่า/ร้านค้า
                                            </SelectItem>
                                            <SelectItem value="shop">
                                              ห้างร้าน
                                            </SelectItem>
                                            <SelectItem value="market">
                                              แผงลอยในตลาดนัด/ชุมชน
                                            </SelectItem>
                                            <SelectItem value="factory">
                                              โรงงาน
                                            </SelectItem>
                                            <SelectItem value="street_food">
                                              รถเข็นขายของ/ริมถนน
                                            </SelectItem>
                                            <SelectItem value="company">
                                              บริษัท
                                            </SelectItem>
                                            <SelectItem value="other">
                                              อื่นๆ รายละเอียดอื่นๆ
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                        {(occ.isSameAsMainAddress
                                          ? (
                                              formData.occupations?.find(
                                                (o: IncomeOccupation) =>
                                                  o.id ===
                                                  occ.isSameAsMainAddress,
                                              ) || ({} as IncomeOccupation)
                                            ).workLocationType
                                          : occ.workLocationType) ===
                                          "other" && (
                                          <Input
                                            value={
                                              (occ.isSameAsMainAddress
                                                ? (
                                                    formData.occupations?.find(
                                                      (o: IncomeOccupation) =>
                                                        o.id ===
                                                        occ.isSameAsMainAddress,
                                                    ) ||
                                                    ({} as IncomeOccupation)
                                                  ).workLocationTypeOther
                                                : occ.workLocationTypeOther) ||
                                              ""
                                            }
                                            onChange={(e) =>
                                              handleOccupationChange(
                                                occ.id,
                                                "workLocationTypeOther",
                                                e.target.value,
                                              )
                                            }
                                            placeholder="โปรดระบุรายละเอียด"
                                            className="h-12 bg-white"
                                            disabled={!!occ.isSameAsMainAddress}
                                          />
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {!(
                                    occ.employmentType === "SE" &&
                                    !["FARMER", "LIVESTOCK"].includes(
                                      occ.occupationCode || "",
                                    )
                                  ) && (
                                    <div className="pt-4 border-t border-gray-100">
                                      <div className="space-y-3">
                                        <Label className="text-xs text-muted-foreground">
                                          สถานะกิจการปัจจุบัน{" "}
                                          {occ.employmentType === "SA" && (
                                            <span className="text-red-500">
                                              *
                                            </span>
                                          )}
                                        </Label>
                                        <RadioGroup
                                          value={
                                            (occ.isSameAsMainAddress
                                              ? (
                                                  formData.occupations?.find(
                                                    (o: IncomeOccupation) =>
                                                      o.id ===
                                                      occ.isSameAsMainAddress,
                                                  ) || ({} as IncomeOccupation)
                                                ).businessStatus
                                              : occ.businessStatus) || ""
                                          }
                                          onValueChange={(val) =>
                                            handleOccupationChange(
                                              occ.id,
                                              "businessStatus",
                                              val,
                                            )
                                          }
                                          className="flex gap-6 pt-1"
                                          disabled={!!occ.isSameAsMainAddress}
                                        >
                                          <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                              value="active"
                                              id={`${occ.id}-active`}
                                              disabled={
                                                !!occ.isSameAsMainAddress
                                              }
                                            />
                                            <Label
                                              htmlFor={`${occ.id}-active`}
                                              className="font-normal cursor-pointer"
                                            >
                                              ดำเนินกิจการอยู่
                                            </Label>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                              value="closed"
                                              id={`${occ.id}-closed`}
                                              disabled={
                                                !!occ.isSameAsMainAddress
                                              }
                                            />
                                            <Label
                                              htmlFor={`${occ.id}-closed`}
                                              className="font-normal cursor-pointer"
                                            >
                                              ปิดกิจการ
                                            </Label>
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
                              <BahtSign className="w-5 h-5 text-chaiyo-blue" />{" "}
                              ช่องทางการรับรายได้
                            </h4>

                            <div className="space-y-6">
                              {/* Payment Channels Selection */}
                              <div className="space-y-3">
                                <Label className="text-sm font-bold text-gray-700">
                                  {" "}
                                  ช่องทางการรับรายได้
                                  <span className="text-red-500">*</span>
                                </Label>
                                <div className="flex flex-wrap gap-6 mt-1">
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`cash-${occ.id}`}
                                      checked={(
                                        occ.incomeChannels || []
                                      ).includes("cash")}
                                      onCheckedChange={() =>
                                        toggleIncomeChannel(occ.id, "cash")
                                      }
                                    />
                                    <Label
                                      htmlFor={`cash-${occ.id}`}
                                      className="font-normal cursor-pointer"
                                    >
                                      รับเงินสด
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`bank-${occ.id}`}
                                      checked={(
                                        occ.incomeChannels || []
                                      ).includes("bank")}
                                      onCheckedChange={() =>
                                        toggleIncomeChannel(occ.id, "bank")
                                      }
                                    />
                                    <Label
                                      htmlFor={`bank-${occ.id}`}
                                      className="font-normal cursor-pointer"
                                    >
                                      เข้าบัญชีธนาคาร
                                    </Label>
                                  </div>
                                </div>
                              </div>

                              {/* Bank Accounts Table (Conditional) */}
                              {(occ.incomeChannels || []).includes("bank") && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                  <div className="flex items-center justify-between mb-2">
                                    <Label className="text-sm font-bold text-gray-700">
                                      บัญชีธนาคาร
                                    </Label>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        handleAddBankAccount(occ.id)
                                      }
                                      className="h-8 text-xs font-medium"
                                    >
                                      <Plus className="w-3 h-3 mr-1" />{" "}
                                      เพิ่มบัญชี
                                    </Button>
                                  </div>

                                  <div className="border border-border-strong rounded-xl overflow-hidden bg-white">
                                    <Table>
                                      <TableHeader className="bg-gray-50/50">
                                        <TableRow>
                                          <TableHead className="w-[40%] text-xs">
                                            ธนาคาร{" "}
                                            <span className="text-red-500">
                                              *
                                            </span>
                                          </TableHead>
                                          <TableHead className="w-[45%] text-xs">
                                            เลขที่บัญชี{" "}
                                            <span className="text-red-500">
                                              *
                                            </span>
                                          </TableHead>
                                          <TableHead className="w-[15%]"></TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {!occ.bankAccounts ||
                                        occ.bankAccounts.length === 0 ? (
                                          <TableRow>
                                            <TableCell
                                              colSpan={3}
                                              className="text-center py-8 text-muted-foreground text-sm italic"
                                            >
                                              ยังไม่มีข้อมูลบัญชีธนาคาร
                                              กรุณากดเพิ่มบัญชี
                                            </TableCell>
                                          </TableRow>
                                        ) : (
                                          occ.bankAccounts.map(
                                            (
                                              account: BankAccount,
                                              idx: number,
                                            ) => (
                                              <TableRow key={idx}>
                                                <TableCell>
                                                  <Select
                                                    value={account.bankName}
                                                    onValueChange={(val) =>
                                                      handleUpdateBankAccount(
                                                        occ.id,
                                                        idx,
                                                        "bankName",
                                                        val,
                                                      )
                                                    }
                                                  >
                                                    <SelectTrigger className="h-9 text-sm bg-gray-50/30">
                                                      <SelectValue placeholder="เลือกธนาคาร">
                                                        {account.bankName && (
                                                          <div className="flex items-center gap-2">
                                                            <img
                                                              src={
                                                                THAI_BANKS.find(
                                                                  (b) =>
                                                                    b.value ===
                                                                    account.bankName,
                                                                )?.logo
                                                              }
                                                              alt={
                                                                account.bankName
                                                              }
                                                              className="w-5 h-5 object-contain"
                                                            />
                                                            <span className="truncate">
                                                              {
                                                                THAI_BANKS.find(
                                                                  (b) =>
                                                                    b.value ===
                                                                    account.bankName,
                                                                )?.label
                                                              }
                                                            </span>
                                                          </div>
                                                        )}
                                                      </SelectValue>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      {THAI_BANKS.map(
                                                        (bank) => (
                                                          <SelectItem
                                                            key={bank.value}
                                                            value={bank.value}
                                                          >
                                                            <div className="flex items-center gap-2">
                                                              <img
                                                                src={bank.logo}
                                                                alt={bank.label}
                                                                className="w-5 h-5 object-contain shrink-0"
                                                              />
                                                              <span>
                                                                {bank.label}
                                                              </span>
                                                            </div>
                                                          </SelectItem>
                                                        ),
                                                      )}
                                                    </SelectContent>
                                                  </Select>
                                                </TableCell>
                                                <TableCell>
                                                  <Input
                                                    value={account.accountNo}
                                                    onChange={(e) =>
                                                      handleUpdateBankAccount(
                                                        occ.id,
                                                        idx,
                                                        "accountNo",
                                                        e.target.value,
                                                      )
                                                    }
                                                    placeholder={
                                                      account.bankName ===
                                                      "TRUEMONEY"
                                                        ? "0XX-XXX-XXXX"
                                                        : "000-0-00000-0"
                                                    }
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
                                                      const statementDocs = (
                                                        occ.incomeDocuments ||
                                                        []
                                                      ).filter(
                                                        (d: IncomeDocument) =>
                                                          d.type ===
                                                          `statement_${idx}`,
                                                      );
                                                      setItemToDelete({
                                                        index: idx,
                                                        occId: occ.id,
                                                        name: account.bankName
                                                          ? `บัญชี ${THAI_BANKS.find((b) => b.value === account.bankName)?.label}`
                                                          : "บัญชีธนาคาร",
                                                        type: "bankAccount",
                                                        hasDocuments:
                                                          statementDocs.length >
                                                          0,
                                                        documentCount:
                                                          statementDocs.length,
                                                      });
                                                    }}
                                                  >
                                                    <Trash2 className="w-4 h-4" />
                                                  </Button>
                                                </TableCell>
                                              </TableRow>
                                            ),
                                          )
                                        )}
                                      </TableBody>
                                    </Table>
                                  </div>
                                </div>
                              )}

                              {/* Income Proof Documents Table */}
                              <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-between mb-2">
                                  <Label className="text-sm font-bold text-gray-700">
                                    เอกสารแสดงรายได้ (
                                    {(occ.incomeDocuments || []).length}/50
                                    ไฟล์)<span className="text-red-500">*</span>
                                  </Label>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const current = occ.customDocTypes || [];
                                      const newId = `other_${Date.now()}`;
                                      handleOccupationChange(
                                        occ.id,
                                        "customDocTypes",
                                        [
                                          ...current,
                                          { id: newId, label: "เอกสารอื่นๆ" },
                                        ],
                                      );
                                    }}
                                    className="h-8 text-xs font-medium"
                                  >
                                    <Plus className="w-3 h-3 mr-1" />{" "}
                                    เพิ่มเอกสารอื่นๆ
                                  </Button>
                                </div>
                                <div className="border border-border-strong rounded-xl overflow-hidden bg-white">
                                  <Table>
                                    <TableHeader className="bg-gray-50/50">
                                      <TableRow>
                                        <TableHead className="w-[45%] text-xs">
                                          ประเภทเอกสาร
                                        </TableHead>
                                        <TableHead className="w-[40%] text-xs">
                                          ไฟล์ที่อัพโหลด
                                        </TableHead>
                                        <TableHead className="w-[15%] text-right text-xs">
                                          จัดการ
                                        </TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {(() => {
                                        // Build dynamic doc types: replace 'statement' with one per bank account
                                        const bankAccounts =
                                          occ.bankAccounts || [];
                                        const dynamicDocTypes: {
                                          id: string;
                                          label: string;
                                          isCustom?: boolean;
                                        }[] = [];

                                        INCOME_DOC_TYPES.forEach((docType) => {
                                          if (docType.id === "statement") {
                                            if (bankAccounts.length > 0) {
                                              bankAccounts.forEach(
                                                (
                                                  account: BankAccount,
                                                  accIdx: number,
                                                ) => {
                                                  const bankInfo =
                                                    THAI_BANKS.find(
                                                      (b) =>
                                                        b.value ===
                                                        account.bankName,
                                                    );
                                                  const bankLabel =
                                                    bankInfo?.label ||
                                                    `บัญชีที่ ${accIdx + 1}`;
                                                  dynamicDocTypes.push({
                                                    id: `statement_${accIdx}`,
                                                    label: `รายการเดินบัญชี - ${bankLabel}${account.accountNo ? ` (${account.accountNo})` : ""}`,
                                                  });
                                                },
                                              );
                                            }
                                          } else if (docType.id === "tavi50") {
                                            const tavi50Months: string[] =
                                              occ.tavi50MonthlyMonths || [];
                                            const tavi50SlipCounts: Record<
                                              string,
                                              number
                                            > =
                                              occ.tavi50MonthlySlipCounts || {};
                                            if (occ.hasTavi50Yearly) {
                                              dynamicDocTypes.push({
                                                id: "tavi50_yearly",
                                                label: "ทวิ 50 (รายปี)",
                                              });
                                            }
                                            if (tavi50Months.length > 0) {
                                              tavi50Months.forEach(
                                                (mLabel, mIdx) => {
                                                  const slipCount =
                                                    tavi50SlipCounts[
                                                      String(mIdx)
                                                    ] || 0;
                                                  for (
                                                    let sIdx = 0;
                                                    sIdx < slipCount;
                                                    sIdx++
                                                  ) {
                                                    dynamicDocTypes.push({
                                                      id: `tavi50_monthly_${mIdx}_slip_${sIdx}`,
                                                      label: `ทวิ 50 (รายเดือน) - ${mLabel} รูปที่ ${sIdx + 1}`,
                                                    });
                                                  }
                                                },
                                              );
                                            }
                                            // Fallback: always show generic row if no specific variants exist
                                            if (
                                              !occ.hasTavi50Yearly &&
                                              tavi50Months.length === 0
                                            ) {
                                              dynamicDocTypes.push(docType);
                                            }
                                          } else {
                                            dynamicDocTypes.push(docType);
                                          }
                                        });

                                        // Add custom "เอกสารอื่นๆ" rows from customDocTypes array
                                        const customTypes =
                                          occ.customDocTypes || [];
                                        customTypes.forEach(
                                          (ct: {
                                            id: string;
                                            label: string;
                                          }) => {
                                            dynamicDocTypes.push({
                                              id: ct.id,
                                              label: ct.label,
                                              isCustom: true,
                                            });
                                          },
                                        );

                                        return dynamicDocTypes.map(
                                          (docType) => {
                                            const uploadedDocs = (
                                              occ.incomeDocuments || []
                                            ).filter((d: IncomeDocument) =>
                                              docType.id === "payslip"
                                                ? d.type?.startsWith("payslip_")
                                                : docType.id === "tavi50"
                                                  ? d.type?.startsWith(
                                                      "tavi50_",
                                                    )
                                                  : d.type === docType.id,
                                            );

                                            return (
                                              <TableRow
                                                key={docType.id}
                                                className="hover:bg-transparent"
                                              >
                                                <TableCell className="py-4">
                                                  <div className="flex items-center gap-3">
                                                    <div
                                                      className={cn(
                                                        "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                                                        uploadedDocs.length > 0
                                                          ? "bg-green-50 text-emerald-600"
                                                          : "bg-gray-100 text-gray-400",
                                                      )}
                                                    >
                                                      {uploadedDocs.length >
                                                      0 ? (
                                                        <CheckCircle2 className="w-4 h-4" />
                                                      ) : (
                                                        <FileText className="w-4 h-4" />
                                                      )}
                                                    </div>
                                                    {docType.isCustom ? (
                                                      <Input
                                                        value={docType.label}
                                                        onChange={(e) => {
                                                          const updated = (
                                                            occ.customDocTypes ||
                                                            []
                                                          ).map(
                                                            (ct: {
                                                              id: string;
                                                              label: string;
                                                            }) =>
                                                              ct.id ===
                                                              docType.id
                                                                ? {
                                                                    ...ct,
                                                                    label:
                                                                      e.target
                                                                        .value,
                                                                  }
                                                                : ct,
                                                          );
                                                          handleOccupationChange(
                                                            occ.id,
                                                            "customDocTypes",
                                                            updated,
                                                          );
                                                        }}
                                                        className="h-8 text-sm font-medium w-[200px]"
                                                        placeholder="ชื่อเอกสาร"
                                                      />
                                                    ) : (
                                                      <span className="font-medium text-gray-700 text-sm whitespace-nowrap">
                                                        {docType.label}
                                                      </span>
                                                    )}
                                                  </div>
                                                </TableCell>
                                                <TableCell>
                                                  {uploadedDocs.length > 0 ? (
                                                    <button
                                                      type="button"
                                                      onClick={() =>
                                                        setViewFilesContext({
                                                          occId: occ.id,
                                                          docType: docType.id,
                                                          label: docType.label,
                                                        })
                                                      }
                                                      className="flex items-center gap-1.5 text-xs text-chaiyo-blue font-medium hover:underline cursor-pointer"
                                                    >
                                                      <FileText className="w-3.5 h-3.5" />
                                                      {uploadedDocs.length} ไฟล์
                                                    </button>
                                                  ) : (
                                                    <span className="text-xs text-muted-foreground italic">
                                                      ยังไม่มีไฟล์
                                                    </span>
                                                  )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                  <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                      type="button"
                                                      variant="outline"
                                                      size="sm"
                                                      onClick={() =>
                                                        handleAddIncomeDocument(
                                                          occ.id,
                                                          docType.id,
                                                          docType.label,
                                                        )
                                                      }
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
                                                          const updatedTypes = (
                                                            occ.customDocTypes ||
                                                            []
                                                          ).filter(
                                                            (ct: {
                                                              id: string;
                                                              label: string;
                                                            }) =>
                                                              ct.id !==
                                                              docType.id,
                                                          );
                                                          handleOccupationChange(
                                                            occ.id,
                                                            "customDocTypes",
                                                            updatedTypes,
                                                          );
                                                          // Also remove any uploaded docs for this type
                                                          const updatedDocs = (
                                                            occ.incomeDocuments ||
                                                            []
                                                          ).filter(
                                                            (
                                                              d: IncomeDocument,
                                                            ) =>
                                                              d.type !==
                                                              docType.id,
                                                          );
                                                          handleOccupationChange(
                                                            occ.id,
                                                            "incomeDocuments",
                                                            updatedDocs,
                                                          );
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
                                          },
                                        );
                                      })()}
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>

                              {/* Occupation Proof Documents Table */}
                              <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-between mb-2">
                                  <Label className="text-sm font-bold text-gray-700">
                                    เอกสารยืนยันอาชีพ
                                  </Label>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const current =
                                        occ.customOccDocTypes || [];
                                      const newId = `occ_other_${Date.now()}`;
                                      handleOccupationChange(
                                        occ.id,
                                        "customOccDocTypes",
                                        [
                                          ...current,
                                          { id: newId, label: "เอกสารอื่นๆ" },
                                        ],
                                      );
                                    }}
                                    className="h-8 text-xs font-medium"
                                  >
                                    <Plus className="w-3 h-3 mr-1" />{" "}
                                    เพิ่มเอกสารอื่นๆ
                                  </Button>
                                </div>
                                <div className="border border-border-strong rounded-xl overflow-hidden bg-white">
                                  <Table>
                                    <TableHeader className="bg-gray-50/50">
                                      <TableRow>
                                        <TableHead className="w-[45%] text-xs">
                                          ประเภทเอกสาร
                                        </TableHead>
                                        <TableHead className="w-[40%] text-xs">
                                          ไฟล์ที่อัพโหลด
                                        </TableHead>
                                        <TableHead className="w-[15%] text-right text-xs">
                                          จัดการ
                                        </TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {[
                                        {
                                          id: "occ_doc_1",
                                          label: "เอกสารประกอบอาชีพ 1",
                                        },
                                        {
                                          id: "occ_doc_2",
                                          label: "เอกสารประกอบอาชีพ 2",
                                        },
                                        ...(occ.customOccDocTypes || []).map(
                                          (ct: {
                                            id: string;
                                            label: string;
                                          }) => ({ ...ct, isCustom: true }),
                                        ),
                                      ].map((docType) => {
                                        const uploadedDocs = (
                                          occ.incomeDocuments || []
                                        ).filter(
                                          (d: IncomeDocument) =>
                                            d.type === docType.id,
                                        );
                                        return (
                                          <TableRow
                                            key={docType.id}
                                            className="hover:bg-transparent"
                                          >
                                            <TableCell className="py-4">
                                              <div className="flex items-center gap-3">
                                                <div
                                                  className={cn(
                                                    "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                                                    uploadedDocs.length > 0
                                                      ? "bg-green-50 text-emerald-600"
                                                      : "bg-gray-100 text-gray-400",
                                                  )}
                                                >
                                                  {uploadedDocs.length > 0 ? (
                                                    <CheckCircle2 className="w-4 h-4" />
                                                  ) : (
                                                    <FileText className="w-4 h-4" />
                                                  )}
                                                </div>
                                                {"isCustom" in docType ? (
                                                  <Input
                                                    value={docType.label}
                                                    onChange={(e) => {
                                                      const updated = (
                                                        occ.customOccDocTypes ||
                                                        []
                                                      ).map(
                                                        (ct: {
                                                          id: string;
                                                          label: string;
                                                        }) =>
                                                          ct.id === docType.id
                                                            ? {
                                                                ...ct,
                                                                label:
                                                                  e.target
                                                                    .value,
                                                              }
                                                            : ct,
                                                      );
                                                      handleOccupationChange(
                                                        occ.id,
                                                        "customOccDocTypes",
                                                        updated,
                                                      );
                                                    }}
                                                    className="h-8 text-sm font-medium max-w-[200px]"
                                                    placeholder="ชื่อเอกสาร"
                                                  />
                                                ) : (
                                                  <span className="font-medium text-gray-700 text-sm whitespace-nowrap">
                                                    {docType.label}
                                                  </span>
                                                )}
                                              </div>
                                            </TableCell>
                                            <TableCell>
                                              {uploadedDocs.length > 0 ? (
                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    setViewFilesContext({
                                                      occId: occ.id,
                                                      docType: docType.id,
                                                      label: docType.label,
                                                    })
                                                  }
                                                  className="flex items-center gap-1.5 text-xs text-chaiyo-blue font-medium hover:underline cursor-pointer"
                                                >
                                                  <FileText className="w-3.5 h-3.5" />
                                                  {uploadedDocs.length} ไฟล์
                                                </button>
                                              ) : (
                                                <span className="text-xs text-muted-foreground italic">
                                                  ยังไม่มีไฟล์
                                                </span>
                                              )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                              <div className="flex items-center justify-end gap-1">
                                                <Button
                                                  type="button"
                                                  variant="outline"
                                                  size="sm"
                                                  onClick={() =>
                                                    handleAddIncomeDocument(
                                                      occ.id,
                                                      docType.id,
                                                      docType.label,
                                                    )
                                                  }
                                                  className="h-8 text-xs gap-1.5 font-medium"
                                                >
                                                  <Plus className="w-3.5 h-3.5" />
                                                  เพิ่มเอกสาร
                                                </Button>
                                                {"isCustom" in docType && (
                                                  <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                      const updated = (
                                                        occ.customOccDocTypes ||
                                                        []
                                                      ).filter(
                                                        (ct: { id: string }) =>
                                                          ct.id !== docType.id,
                                                      );
                                                      handleOccupationChange(
                                                        occ.id,
                                                        "customOccDocTypes",
                                                        updated,
                                                      );
                                                    }}
                                                    className="h-8 w-8 p-0 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50"
                                                    title="ลบประเภท"
                                                  >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                  </Button>
                                                )}
                                              </div>
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
                          {occ.employmentType === "SA" && (
                            <div className="rounded-xl border border-border-color bg-gray-50/40 p-6 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                              <div className="space-y-4">
                                <h4 className="text-base font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-border-color">
                                  <TrendingUp className="w-5 h-5 text-chaiyo-blue" />{" "}
                                  รายละเอียดอายุงานและรายได้
                                </h4>

                                {/* Tenure Fields - Stacked */}
                                <div className="space-y-4 pt-2">
                                  <div className="space-y-2">
                                    <Label className="text-sm font-bold text-gray-700">
                                      อายุงานปัจจุบัน{" "}
                                      <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="flex items-center gap-3 max-w-md">
                                      <div className="flex-1 relative">
                                        <Input
                                          type="text"
                                          className="h-12 bg-white text-center rounded-xl pr-10"
                                          placeholder="0"
                                          value={occ.currentTenureYear || ""}
                                          onChange={(e) =>
                                            handleOccupationChange(
                                              occ.id,
                                              "currentTenureYear",
                                              e.target.value.replace(/\D/g, ""),
                                            )
                                          }
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                                          ปี
                                        </span>
                                      </div>
                                      <div className="flex-1 relative">
                                        <Input
                                          type="text"
                                          className="h-12 bg-white text-center rounded-xl pr-14"
                                          placeholder="0"
                                          value={occ.currentTenureMonth || ""}
                                          onChange={(e) =>
                                            handleOccupationChange(
                                              occ.id,
                                              "currentTenureMonth",
                                              e.target.value.replace(/\D/g, ""),
                                            )
                                          }
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                                          เดือน
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-sm font-bold text-gray-700">
                                      อายุงานก่อนหน้า{" "}
                                      <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="flex items-center gap-3 max-w-md">
                                      <div className="flex-1 relative">
                                        <Input
                                          type="text"
                                          className="h-12 bg-white text-center rounded-xl pr-10"
                                          placeholder="0"
                                          value={occ.prevTenureYear ?? "0"}
                                          onChange={(e) =>
                                            handleOccupationChange(
                                              occ.id,
                                              "prevTenureYear",
                                              e.target.value.replace(/\D/g, ""),
                                            )
                                          }
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                                          ปี
                                        </span>
                                      </div>
                                      <div className="flex-1 relative">
                                        <Input
                                          type="text"
                                          className="h-12 bg-white text-center rounded-xl pr-14"
                                          placeholder="0"
                                          value={occ.prevTenureMonth ?? "0"}
                                          onChange={(e) =>
                                            handleOccupationChange(
                                              occ.id,
                                              "prevTenureMonth",
                                              e.target.value.replace(/\D/g, ""),
                                            )
                                          }
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                                          เดือน
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Income Tables Per Document Source */}
                              <div className="space-y-6">
                                {(() => {
                                  const tavi50Uploaded = uploadedDocTypes.some(
                                    (dt) => dt.startsWith("tavi50_"),
                                  );
                                  const hasTavi50Content =
                                    occ.hasTavi50Yearly ||
                                    tavi50Months.length > 0;
                                  const showTavi50Section =
                                    tavi50Uploaded || hasTavi50Content;
                                  const salaryCertUploaded =
                                    uploadedDocTypes.includes("salary_cert");
                                  const otherUploaded = uploadedDocTypes.filter(
                                    (dt) =>
                                      !dt.startsWith("payslip_") &&
                                      !dt.startsWith("statement_") &&
                                      dt !== "salary_cert" &&
                                      !dt.startsWith("tavi50_"),
                                  );

                                  return (
                                    <>
                                      {/* Payslip Section - Multi-Slip per Month */}
                                      <div className="border border-border-strong rounded-xl bg-white p-5 space-y-4">
                                        <div className="flex items-center justify-between pb-2.5 border-b border-border-color">
                                          <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-emerald-600" />
                                            <span className="text-sm font-bold text-gray-800">
                                              รายการรายได้จาก: สลิปเงินเดือน
                                              (Payslip)
                                            </span>
                                          </div>
                                          <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                              handleOpenAddPayslipMonthDialog(
                                                occ.id,
                                              )
                                            }
                                            className="h-8 text-xs font-medium"
                                          >
                                            <Plus className="w-3 h-3 mr-1" />{" "}
                                            เพิ่มเดือน
                                          </Button>
                                        </div>
                                        {payslipMonths.length > 0 ? (
                                          <Tabs
                                            defaultValue={`payslip_month_0`}
                                            className="w-full"
                                          >
                                            <TabsList className="w-full h-auto p-0 bg-transparent border-b border-border-subtle justify-start flex-wrap gap-0 rounded-none">
                                              {payslipMonths.map(
                                                (
                                                  monthLabel: string,
                                                  mIdx: number,
                                                ) => (
                                                  <TabsTrigger
                                                    key={`payslip_month_${mIdx}`}
                                                    value={`payslip_month_${mIdx}`}
                                                    className="relative px-4 py-2 text-xs font-bold rounded-none border-b-2 border-transparent data-[state=active]:border-chaiyo-blue data-[state=active]:text-chaiyo-blue data-[state=active]:shadow-none text-gray-500 hover:text-gray-700 bg-transparent shadow-none transition-all"
                                                  >
                                                    <span>{monthLabel}</span>
                                                  </TabsTrigger>
                                                ),
                                              )}
                                            </TabsList>
                                            {payslipMonths.map(
                                              (
                                                monthLabel: string,
                                                mIdx: number,
                                              ) => {
                                                const monthFullName =
                                                  THAI_MONTHS_FULL[
                                                    THAI_MONTHS_SHORT.indexOf(
                                                      monthLabel,
                                                    )
                                                  ] || monthLabel;
                                                const slipCount =
                                                  payslipSlipCounts[
                                                    String(mIdx)
                                                  ] || 0;
                                                return (
                                                  <TabsContent
                                                    key={`payslip_month_${mIdx}`}
                                                    value={`payslip_month_${mIdx}`}
                                                    className="mt-3"
                                                  >
                                                    <motion.div
                                                      initial={{
                                                        opacity: 0,
                                                        y: 6,
                                                      }}
                                                      animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                      }}
                                                      transition={{
                                                        duration: 0.2,
                                                        ease: "easeOut",
                                                      }}
                                                      className="space-y-4"
                                                    >
                                                      {/* Month Header */}
                                                      <div className="flex items-center justify-between">
                                                        <Label className="text-sm font-bold text-gray-700">
                                                          {monthFullName}
                                                        </Label>
                                                        <div className="flex items-center gap-2">
                                                          <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                              setPendingDeletePayslipMonth(
                                                                {
                                                                  occId: occ.id,
                                                                  monthLabel,
                                                                },
                                                              )
                                                            }
                                                            className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200"
                                                            title="ลบเดือนนี้"
                                                          >
                                                            <Trash2 className="w-4 h-4" />
                                                          </Button>
                                                          <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                              handleAddPayslipSlip(
                                                                occ.id,
                                                                mIdx,
                                                              )
                                                            }
                                                            className="h-8 text-xs font-medium"
                                                          >
                                                            <Plus className="w-3 h-3 mr-1" />{" "}
                                                            เพิ่ม Slip
                                                          </Button>
                                                        </div>
                                                      </div>

                                                      {/* Slips */}
                                                      {slipCount > 0 ? (
                                                        <div className="border border-border-subtle rounded-xl bg-white overflow-hidden divide-y divide-border-subtle">
                                                          {Array.from(
                                                            {
                                                              length: slipCount,
                                                            },
                                                            (_, sIdx) => {
                                                              const slipSourceKey = `payslip_${mIdx}_slip_${sIdx}`;
                                                              const slipIncomes =
                                                                incomesBySource[
                                                                  slipSourceKey
                                                                ] || [];
                                                              const slipDefaultLabel = `Payslip ${String(sIdx + 1).padStart(2, "0")}`;
                                                              const payslipDocs =
                                                                allDocs.filter(
                                                                  (
                                                                    d: IncomeDocument,
                                                                  ) =>
                                                                    d.type ===
                                                                      slipSourceKey ||
                                                                    d.type ===
                                                                      `payslip_${mIdx}` ||
                                                                    d.type ===
                                                                      `payslip_${sIdx}`,
                                                                );
                                                              const sourceDoc =
                                                                payslipDocs.length >
                                                                0
                                                                  ? payslipDocs[0]
                                                                  : undefined;
                                                              const slipLabel =
                                                                sourceDoc
                                                                  ? sourceDoc.name ||
                                                                    sourceDoc.originalName ||
                                                                    slipDefaultLabel
                                                                  : slipDefaultLabel;

                                                              return (
                                                                <div
                                                                  key={
                                                                    slipSourceKey
                                                                  }
                                                                  className="p-4 space-y-3"
                                                                >
                                                                  {/* Slip Header */}
                                                                  <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-2">
                                                                      <Label className="text-sm font-bold text-gray-700">
                                                                        {
                                                                          slipLabel
                                                                        }
                                                                      </Label>
                                                                      {sourceDoc && (
                                                                        <Button
                                                                          type="button"
                                                                          variant="ghost"
                                                                          size="sm"
                                                                          onClick={() =>
                                                                            window.open(
                                                                              sourceDoc.url,
                                                                              "_blank",
                                                                            )
                                                                          }
                                                                          className="h-7 w-7 p-0 text-gray-400 hover:text-chaiyo-blue"
                                                                          title="ดูเอกสารต้นฉบับ"
                                                                        >
                                                                          <Eye className="w-4 h-4" />
                                                                        </Button>
                                                                      )}
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                      {slipCount >
                                                                        1 && (
                                                                        <Button
                                                                          type="button"
                                                                          variant="outline"
                                                                          size="sm"
                                                                          onClick={() =>
                                                                            handleRemovePayslipSlip(
                                                                              occ.id,
                                                                              mIdx,
                                                                              sIdx,
                                                                            )
                                                                          }
                                                                          className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200"
                                                                          title="ลบ Slip นี้"
                                                                        >
                                                                          <Trash2 className="w-4 h-4" />
                                                                        </Button>
                                                                      )}
                                                                      <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                          handleAddSAIncomeRow(
                                                                            occ.id,
                                                                            slipSourceKey,
                                                                          )
                                                                        }
                                                                        className="h-8 text-xs font-medium bg-white"
                                                                      >
                                                                        <Plus className="w-3 h-3 mr-1" />{" "}
                                                                        เพิ่มรายการ
                                                                      </Button>
                                                                    </div>
                                                                  </div>

                                                                  {/* Slip Income Table */}
                                                                  <div className="border border-border-strong rounded-lg overflow-hidden bg-white">
                                                                    <Table>
                                                                      <TableHeader className="bg-gray-50/50">
                                                                        <TableRow>
                                                                          <TableHead className="w-[30%] text-xs py-3">
                                                                            ประเภทรายได้{" "}
                                                                            <span className="text-red-500">
                                                                              *
                                                                            </span>
                                                                          </TableHead>
                                                                          <TableHead className="w-[40%] text-xs py-3">
                                                                            รายละเอียดรายได้
                                                                          </TableHead>
                                                                          <TableHead className="w-[20%] text-xs py-3 text-right">
                                                                            รายได้
                                                                            (บาท){" "}
                                                                            <span className="text-red-500">
                                                                              *
                                                                            </span>
                                                                          </TableHead>
                                                                          <TableHead className="w-[10%] text-center text-xs py-3">
                                                                            จัดการ
                                                                          </TableHead>
                                                                        </TableRow>
                                                                      </TableHeader>
                                                                      <TableBody>
                                                                        {slipIncomes.length ===
                                                                        0 ? (
                                                                          <TableRow>
                                                                            <TableCell
                                                                              colSpan={
                                                                                4
                                                                              }
                                                                              className="h-16 text-center text-muted-foreground italic text-xs"
                                                                            >
                                                                              ยังไม่มีรายการรายได้
                                                                              กรุณากดเพิ่มรายการ
                                                                            </TableCell>
                                                                          </TableRow>
                                                                        ) : (
                                                                          slipIncomes.map(
                                                                            (
                                                                              item,
                                                                            ) => {
                                                                              const originalIdx =
                                                                                item.originalIndex;
                                                                              return (
                                                                                <TableRow
                                                                                  key={
                                                                                    originalIdx
                                                                                  }
                                                                                  className="group transition-colors hover:bg-gray-50/50"
                                                                                >
                                                                                  <TableCell className="py-2.5">
                                                                                    <Select
                                                                                      value={
                                                                                        item.type ||
                                                                                        ""
                                                                                      }
                                                                                      onValueChange={(
                                                                                        val,
                                                                                      ) =>
                                                                                        handleUpdateSAIncomeRow(
                                                                                          occ.id,
                                                                                          originalIdx,
                                                                                          "type",
                                                                                          val,
                                                                                        )
                                                                                      }
                                                                                    >
                                                                                      <SelectTrigger className="h-9 text-sm bg-gray-50/30">
                                                                                        <SelectValue placeholder="ระบุประเภทรายได้" />
                                                                                      </SelectTrigger>
                                                                                      <SelectContent>
                                                                                        {SA_INCOME_TYPES.map(
                                                                                          (
                                                                                            type,
                                                                                          ) => (
                                                                                            <SelectItem
                                                                                              key={
                                                                                                type.value
                                                                                              }
                                                                                              value={
                                                                                                type.value
                                                                                              }
                                                                                            >
                                                                                              {
                                                                                                type.label
                                                                                              }
                                                                                            </SelectItem>
                                                                                          ),
                                                                                        )}
                                                                                      </SelectContent>
                                                                                    </Select>
                                                                                  </TableCell>
                                                                                  <TableCell className="py-2.5">
                                                                                    <Input
                                                                                      value={
                                                                                        item.detail ||
                                                                                        ""
                                                                                      }
                                                                                      onChange={(
                                                                                        e,
                                                                                      ) =>
                                                                                        handleUpdateSAIncomeRow(
                                                                                          occ.id,
                                                                                          originalIdx,
                                                                                          "detail",
                                                                                          e
                                                                                            .target
                                                                                            .value,
                                                                                        )
                                                                                      }
                                                                                      placeholder="รายละเอียด"
                                                                                      className="h-9 text-sm bg-gray-50/30"
                                                                                    />
                                                                                  </TableCell>
                                                                                  <TableCell className="py-2.5">
                                                                                    <Input
                                                                                      type="text"
                                                                                      value={formatNumberWithCommas(
                                                                                        item.amount ??
                                                                                          "",
                                                                                      )}
                                                                                      onChange={(
                                                                                        e,
                                                                                      ) =>
                                                                                        handleUpdateSAIncomeRow(
                                                                                          occ.id,
                                                                                          originalIdx,
                                                                                          "amount",
                                                                                          e
                                                                                            .target
                                                                                            .value,
                                                                                        )
                                                                                      }
                                                                                      placeholder="จำนวน"
                                                                                      className="h-9 text-sm bg-gray-50/30 text-right font-mono"
                                                                                    />
                                                                                  </TableCell>
                                                                                  <TableCell className="py-2.5 text-center">
                                                                                    <Button
                                                                                      variant="ghost"
                                                                                      size="sm"
                                                                                      className="text-gray-400 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0 rounded-full"
                                                                                      onClick={() =>
                                                                                        setItemToDelete(
                                                                                          {
                                                                                            index:
                                                                                              originalIdx,
                                                                                            occId:
                                                                                              occ.id,
                                                                                            name:
                                                                                              item.detail ||
                                                                                              SA_INCOME_TYPES.find(
                                                                                                (
                                                                                                  t,
                                                                                                ) =>
                                                                                                  t.value ===
                                                                                                  item.type,
                                                                                              )
                                                                                                ?.label ||
                                                                                              `รายการที่ ${originalIdx + 1}`,
                                                                                            type: "saIncomeRow",
                                                                                          },
                                                                                        )
                                                                                      }
                                                                                    >
                                                                                      <Trash2 className="w-4 h-4" />
                                                                                    </Button>
                                                                                  </TableCell>
                                                                                </TableRow>
                                                                              );
                                                                            },
                                                                          )
                                                                        )}
                                                                      </TableBody>
                                                                      {slipIncomes.length >
                                                                        0 && (
                                                                        <TableFooter>
                                                                          <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 transition-none">
                                                                            <TableCell
                                                                              colSpan={
                                                                                2
                                                                              }
                                                                              className="text-right font-bold py-3 text-xs text-gray-700"
                                                                            >
                                                                              รวมยอดจาก
                                                                              Slip
                                                                              นี้:
                                                                            </TableCell>
                                                                            <TableCell
                                                                              colSpan={
                                                                                2
                                                                              }
                                                                              className="text-right pr-[4.5rem] py-3"
                                                                            >
                                                                              <div className="text-sm font-semibold font-mono text-gray-700">
                                                                                {formatNumberWithCommas(
                                                                                  slipIncomes.reduce(
                                                                                    (
                                                                                      sum,
                                                                                      item,
                                                                                    ) =>
                                                                                      sum +
                                                                                      (Number(
                                                                                        item.amount,
                                                                                      ) ||
                                                                                        0),
                                                                                    0,
                                                                                  ),
                                                                                )}
                                                                              </div>
                                                                            </TableCell>
                                                                          </TableRow>
                                                                        </TableFooter>
                                                                      )}
                                                                    </Table>
                                                                  </div>
                                                                </div>
                                                              );
                                                            },
                                                          )}
                                                        </div>
                                                      ) : (
                                                        <div className="text-center py-6 text-muted-foreground text-sm italic">
                                                          ยังไม่มี Slip
                                                          กรุณากดเพิ่ม Slip
                                                        </div>
                                                      )}
                                                    </motion.div>
                                                  </TabsContent>
                                                );
                                              },
                                            )}
                                          </Tabs>
                                        ) : (
                                          <div className="text-center py-8 text-muted-foreground text-sm italic">
                                            ยังไม่มีเดือน กรุณากดเพิ่มเดือน
                                          </div>
                                        )}
                                      </div>

                                      {/* Statement Section - Separate Card per Bank, Month Tabs Inside */}
                                      {statementUploaded.map((dt) => {
                                        const accIdx = Number(
                                          dt.replace("statement_", ""),
                                        );
                                        const account = bankAccounts[accIdx];
                                        const bankInfo = account
                                          ? THAI_BANKS.find(
                                              (b) =>
                                                b.value === account.bankName,
                                            )
                                          : undefined;
                                        const bankLabel =
                                          bankInfo?.label ||
                                          `บัญชีที่ ${accIdx + 1}`;
                                        const accountNo =
                                          account?.accountNo || "";
                                        const stmtDocs = allDocs.filter(
                                          (d: IncomeDocument) => d.type === dt,
                                        );
                                        const bankKey = String(accIdx);
                                        const monthsForBank =
                                          (occ.statementMonths || {})[
                                            bankKey
                                          ] || [];

                                        return (
                                          <div
                                            key={dt}
                                            className="border border-border-strong rounded-xl bg-white p-5 space-y-4"
                                          >
                                            {/* Bank Header */}
                                            <div className="flex items-center justify-between pb-2.5 border-b border-border-color">
                                              <div className="flex items-center gap-2.5">
                                                {bankInfo?.logo && (
                                                  <img
                                                    src={bankInfo.logo}
                                                    alt={bankLabel}
                                                    className="w-6 h-6 object-contain shrink-0"
                                                  />
                                                )}
                                                <div className="flex items-center gap-2">
                                                  <span className="text-sm font-bold text-gray-800">
                                                    {bankLabel}
                                                  </span>
                                                  {accountNo && (
                                                    <span className="text-sm font-bold text-gray-800">
                                                      ({accountNo})
                                                    </span>
                                                  )}
                                                </div>
                                                {stmtDocs.length > 0 && (
                                                  <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                      window.open(
                                                        stmtDocs[0].url,
                                                        "_blank",
                                                      )
                                                    }
                                                    className="h-7 w-7 p-0 text-gray-400 hover:text-chaiyo-blue"
                                                    title="ดูเอกสารต้นฉบับ"
                                                  >
                                                    <Eye className="w-4 h-4" />
                                                  </Button>
                                                )}
                                              </div>
                                              <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                  handleOpenAddMonthDialog(
                                                    occ.id,
                                                    accIdx,
                                                  )
                                                }
                                                className="h-8 text-xs font-medium"
                                              >
                                                <Plus className="w-3 h-3 mr-1" />{" "}
                                                เพิ่มเดือน
                                              </Button>
                                            </div>

                                            {/* Month Tabs */}
                                            {monthsForBank.length > 0 ? (
                                              <Tabs
                                                defaultValue={`stmt_${accIdx}_month_0`}
                                                className="w-full"
                                              >
                                                <TabsList className="w-full h-auto p-0 bg-transparent border-b border-border-subtle justify-start flex-wrap gap-0 rounded-none">
                                                  {monthsForBank.map(
                                                    (
                                                      monthLabel: string,
                                                      mIdx: number,
                                                    ) => (
                                                      <TabsTrigger
                                                        key={`stmt_${accIdx}_month_${mIdx}`}
                                                        value={`stmt_${accIdx}_month_${mIdx}`}
                                                        className="relative px-4 py-2 text-xs font-bold rounded-none border-b-2 border-transparent data-[state=active]:border-chaiyo-blue data-[state=active]:text-chaiyo-blue data-[state=active]:shadow-none text-gray-500 hover:text-gray-700 bg-transparent shadow-none transition-all"
                                                      >
                                                        <span>
                                                          {monthLabel}
                                                        </span>
                                                      </TabsTrigger>
                                                    ),
                                                  )}
                                                </TabsList>
                                                {monthsForBank.map(
                                                  (
                                                    monthLabel: string,
                                                    mIdx: number,
                                                  ) => {
                                                    const monthSourceKey = `statement_${accIdx}_month_${mIdx}`;
                                                    const monthIncomes =
                                                      incomesBySource[
                                                        monthSourceKey
                                                      ] || [];
                                                    const monthFullName =
                                                      THAI_MONTHS_FULL[
                                                        THAI_MONTHS_SHORT.indexOf(
                                                          monthLabel,
                                                        )
                                                      ] || monthLabel;
                                                    return (
                                                      <TabsContent
                                                        key={`stmt_${accIdx}_month_${mIdx}`}
                                                        value={`stmt_${accIdx}_month_${mIdx}`}
                                                        className="mt-3"
                                                      >
                                                        <motion.div
                                                          initial={{
                                                            opacity: 0,
                                                            y: 6,
                                                          }}
                                                          animate={{
                                                            opacity: 1,
                                                            y: 0,
                                                          }}
                                                          transition={{
                                                            duration: 0.2,
                                                            ease: "easeOut",
                                                          }}
                                                        >
                                                          {renderIncomeTable(
                                                            monthFullName,
                                                            monthSourceKey,
                                                            monthIncomes,
                                                            true,
                                                            undefined,
                                                            () =>
                                                              setPendingDeleteMonth(
                                                                {
                                                                  occId: occ.id,
                                                                  bankIdx:
                                                                    accIdx,
                                                                  monthLabel,
                                                                },
                                                              ),
                                                          )}
                                                        </motion.div>
                                                      </TabsContent>
                                                    );
                                                  },
                                                )}
                                              </Tabs>
                                            ) : (
                                              <div className="text-center py-8 text-muted-foreground text-sm italic">
                                                ยังไม่มีเดือน กรุณากดเพิ่มเดือน
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })}

                                      {/* Unified Tavi 50 Section */}
                                      {showTavi50Section && (
                                        <div className="border border-border-strong rounded-xl bg-white p-5 space-y-4">
                                          <div className="flex items-center justify-between pb-2.5 border-b border-border-color">
                                            <div className="flex items-center gap-2">
                                              <FileText className="w-4 h-4 text-emerald-600" />
                                              <span className="text-sm font-bold text-gray-800">
                                                รายการรายได้จาก: 50 ทวิ (หนังสือรับรองการหักภาษี ณ ที่จ่าย)
                                              </span>
                                            </div>
                                            <Button
                                              type="button"
                                              variant="outline"
                                              size="sm"
                                              onClick={() =>
                                                handleOpenAddTavi50ItemDialog(
                                                  occ.id,
                                                )
                                              }
                                              className="h-8 text-xs font-medium"
                                            >
                                              <Plus className="w-3 h-3 mr-1" />{" "}
                                              เพิ่มรายการ
                                            </Button>
                                          </div>

                                          {!hasTavi50Content ? (
                                            <div className="text-center py-8 text-muted-foreground text-sm italic">
                                              ยังไม่มีรายการ กรุณากดเพิ่มรายการ
                                            </div>
                                          ) : (
                                            <div className="space-y-6 mt-3">
                                              {/* Yearly Block */}
                                              {occ.hasTavi50Yearly &&
                                                (() => {
                                                  const sourceIncomes =
                                                    incomesBySource[
                                                      "tavi50_yearly"
                                                    ] || [];
                                                  const tavi50YearlyDocs =
                                                    allDocs.filter(
                                                      (
                                                        d: IncomeDocument,
                                                      ) =>
                                                        d.type ===
                                                        "tavi50_yearly",
                                                    );
                                                  return (
                                                    <div className="space-y-4">
                                                      {renderIncomeTable(
                                                        `รายการรายได้จาก: 50 ทวิ (หนังสือรับรองการหักภาษี ณ ที่จ่าย) (รายปี)`,
                                                        "tavi50_yearly",
                                                        sourceIncomes,
                                                        true,
                                                        tavi50YearlyDocs,
                                                        () =>
                                                          setPendingDeleteTavi50Yearly(
                                                            occ.id,
                                                          ),
                                                        true, // isYearly = true
                                                      )}
                                                    </div>
                                                  );
                                                })()}

                                              {/* Divider if both exist */}
                                              {occ.hasTavi50Yearly &&
                                                tavi50Months.length > 0 && (
                                                  <div className="border-t border-border-color my-2"></div>
                                                )}

                                              {/* Monthly Tabs Block */}
                                              {tavi50Months.length > 0 && (
                                                <div className="space-y-4">
                                                  <Tabs
                                                    defaultValue={`tavi50_monthly_month_0`}
                                                    className="w-full"
                                                  >
                                                    <TabsList className="w-full h-auto p-0 bg-transparent border-b border-border-subtle justify-start flex-wrap gap-0 rounded-none">
                                                      {tavi50Months.map(
                                                        (
                                                          monthLabel: string,
                                                          mIdx: number,
                                                        ) => (
                                                          <TabsTrigger
                                                            key={`tavi50_monthly_month_${mIdx}`}
                                                            value={`tavi50_monthly_month_${mIdx}`}
                                                            className="relative px-4 py-2 text-xs font-bold rounded-none border-b-2 border-transparent data-[state=active]:border-chaiyo-blue data-[state=active]:text-chaiyo-blue data-[state=active]:shadow-none text-gray-500 hover:text-gray-700 bg-transparent shadow-none transition-all"
                                                          >
                                                            <span>
                                                              {monthLabel}
                                                            </span>
                                                          </TabsTrigger>
                                                        ),
                                                      )}
                                                    </TabsList>
                                                    {tavi50Months.map(
                                                      (
                                                        monthLabel: string,
                                                        mIdx: number,
                                                      ) => {
                                                        const monthFullName =
                                                          THAI_MONTHS_FULL[
                                                            THAI_MONTHS_SHORT.indexOf(
                                                              monthLabel,
                                                            )
                                                          ] || monthLabel;
                                                        const monthDocs = allDocs.filter(
                                                          (d: IncomeDocument) =>
                                                            d.type ===
                                                            `tavi50_monthly_${mIdx}`
                                                        );
                                                        const monthDoc = monthDocs.length > 0 ? monthDocs[0] : undefined;
                                                        const slipCount =
                                                          tavi50SlipCounts[
                                                            String(mIdx)
                                                          ] || 0;
                                                        return (
                                                          <TabsContent
                                                            key={`tavi50_monthly_month_${mIdx}`}
                                                            value={`tavi50_monthly_month_${mIdx}`}
                                                            className="mt-3"
                                                          >
                                                            <motion.div
                                                              initial={{
                                                                opacity: 0,
                                                                y: 6,
                                                              }}
                                                              animate={{
                                                                opacity: 1,
                                                                y: 0,
                                                              }}
                                                              transition={{
                                                                duration: 0.2,
                                                                ease: "easeOut",
                                                              }}
                                                              className="space-y-4"
                                                            >
                                                              {/* Month Header */}
                                                              <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                  <Label className="text-sm font-bold text-gray-700">
                                                                    {
                                                                      monthFullName
                                                                    }
                                                                  </Label>
                                                                  {monthDoc && (
                                                                    <Button
                                                                      type="button"
                                                                      variant="ghost"
                                                                      size="sm"
                                                                      onClick={() =>
                                                                        window.open(monthDoc.url, "_blank")
                                                                      }
                                                                      className="h-7 w-7 p-0 text-gray-400 hover:text-chaiyo-blue"
                                                                      title="ดูเอกสารต้นฉบับ"
                                                                    >
                                                                      <Eye className="w-4 h-4" />
                                                                    </Button>
                                                                  )}
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                  <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                      setPendingDeleteTavi50Month(
                                                                        {
                                                                          occId:
                                                                            occ.id,
                                                                          monthLabel,
                                                                        },
                                                                      )
                                                                    }
                                                                    className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200"
                                                                    title="ลบเดือนนี้"
                                                                  >
                                                                    <Trash2 className="w-4 h-4" />
                                                                  </Button>
                                                                  <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                      handleAddTavi50Slip(
                                                                        occ.id,
                                                                        mIdx,
                                                                      )
                                                                    }
                                                                    className="h-8 text-xs font-medium"
                                                                  >
                                                                    <Plus className="w-3 h-3 mr-1" />{" "}
                                                                    เพิ่มเอกสาร
                                                                  </Button>
                                                                </div>
                                                              </div>

                                                              {/* Slips */}
                                                              {slipCount > 0 ? (
                                                                <div className="border border-border-subtle rounded-xl bg-white overflow-hidden divide-y divide-border-subtle">
                                                                  {Array.from(
                                                                    {
                                                                      length:
                                                                        slipCount,
                                                                    },
                                                                    (
                                                                      _,
                                                                      sIdx,
                                                                    ) => {
                                                                      const slipSourceKey = `tavi50_monthly_${mIdx}_slip_${sIdx}`;
                                                                      const slipIncomes =
                                                                        incomesBySource[
                                                                          slipSourceKey
                                                                        ] || [];
                                                                      const slipDefaultLabel = `50 ทวิ (หนังสือรับรองการหักภาษี ณ ที่จ่าย) (รายเดือน) ${String(sIdx + 1).padStart(2, "0")}`;
                                                                      const tavi50Docs =
                                                                        allDocs.filter(
                                                                          (
                                                                            d: IncomeDocument,
                                                                          ) =>
                                                                            d.type ===
                                                                              slipSourceKey ||
                                                                            d.type ===
                                                                              `tavi50_monthly_${mIdx}` ||
                                                                            d.type ===
                                                                              `tavi50_monthly_${sIdx}`,
                                                                        );
                                                                      const sourceDoc =
                                                                        tavi50Docs.length >
                                                                        0
                                                                          ? tavi50Docs[0]
                                                                          : undefined;
                                                                      const slipLabel =
                                                                        sourceDoc
                                                                          ? sourceDoc.name ||
                                                                            sourceDoc.originalName ||
                                                                            slipDefaultLabel
                                                                          : slipDefaultLabel;

                                                                      return (
                                                                        <div
                                                                          key={
                                                                            slipSourceKey
                                                                          }
                                                                          className="p-4 space-y-3"
                                                                        >
                                                                          {/* Slip Header */}
                                                                          <div className="flex items-center justify-between">
                                                                            <div className="flex items-center gap-2">
                                                                              <Label className="text-sm font-bold text-gray-700">
                                                                                {
                                                                                  slipLabel
                                                                                }
                                                                              </Label>
                                                                              {sourceDoc && (
                                                                                <Button
                                                                                  type="button"
                                                                                  variant="ghost"
                                                                                  size="sm"
                                                                                  onClick={() =>
                                                                                    window.open(
                                                                                      sourceDoc.url,
                                                                                      "_blank",
                                                                                    )
                                                                                  }
                                                                                  className="h-7 w-7 p-0 text-gray-400 hover:text-chaiyo-blue"
                                                                                  title="ดูเอกสารต้นฉบับ"
                                                                                >
                                                                                  <Eye className="w-4 h-4" />
                                                                                </Button>
                                                                              )}
                                                                            </div>
                                                                            <div className="flex items-center gap-2">
                                                                              {slipCount >
                                                                                1 && (
                                                                                <Button
                                                                                  type="button"
                                                                                  variant="outline"
                                                                                  size="sm"
                                                                                  onClick={() =>
                                                                                    handleRemoveTavi50Slip(
                                                                                      occ.id,
                                                                                      mIdx,
                                                                                      sIdx,
                                                                                    )
                                                                                  }
                                                                                  className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200"
                                                                                  title="ลบเอกสารนี้"
                                                                                >
                                                                                  <Trash2 className="w-4 h-4" />
                                                                                </Button>
                                                                              )}
                                                                              <Button
                                                                                type="button"
                                                                                variant="outline"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                  handleAddSAIncomeRow(
                                                                                    occ.id,
                                                                                    slipSourceKey,
                                                                                  )
                                                                                }
                                                                                className="h-8 text-xs font-medium bg-white"
                                                                              >
                                                                                <Plus className="w-3 h-3 mr-1" />{" "}
                                                                                เพิ่มรายการ
                                                                              </Button>
                                                                            </div>
                                                                          </div>

                                                                          {/* Slip Income Table */}
                                                                          <div className="border border-border-strong rounded-lg overflow-hidden bg-white">
                                                                            <Table>
                                                                              <TableHeader className="bg-gray-50/50">
                                                                                <TableRow>
                                                                                  <TableHead className="w-[30%] text-xs py-3">
                                                                                    ประเภทรายได้{" "}
                                                                                    <span className="text-red-500">
                                                                                      *
                                                                                    </span>
                                                                                  </TableHead>
                                                                                  <TableHead className="w-[40%] text-xs py-3">
                                                                                    รายละเอียดรายได้
                                                                                  </TableHead>
                                                                                  <TableHead className="w-[20%] text-xs py-3 text-right">
                                                                                    รายได้
                                                                                    (บาท){" "}
                                                                                    <span className="text-red-500">
                                                                                      *
                                                                                    </span>
                                                                                  </TableHead>
                                                                                  <TableHead className="w-[10%] text-center text-xs py-3">
                                                                                    จัดการ
                                                                                  </TableHead>
                                                                                </TableRow>
                                                                              </TableHeader>
                                                                              <TableBody>
                                                                                {slipIncomes.length ===
                                                                                0 ? (
                                                                                  <TableRow>
                                                                                    <TableCell
                                                                                      colSpan={
                                                                                        4
                                                                                      }
                                                                                      className="h-16 text-center text-muted-foreground italic text-xs"
                                                                                    >
                                                                                      ยังไม่มีรายการรายได้
                                                                                      กรุณากดเพิ่มรายการ
                                                                                    </TableCell>
                                                                                  </TableRow>
                                                                                ) : (
                                                                                  slipIncomes.map(
                                                                                    (
                                                                                      item,
                                                                                    ) => {
                                                                                      const originalIdx =
                                                                                        item.originalIndex;
                                                                                      return (
                                                                                        <TableRow
                                                                                          key={
                                                                                            originalIdx
                                                                                          }
                                                                                          className="group transition-colors hover:bg-gray-50/50"
                                                                                        >
                                                                                          <TableCell className="py-2.5">
                                                                                            <Select
                                                                                              value={
                                                                                                item.type ||
                                                                                                ""
                                                                                              }
                                                                                              onValueChange={(
                                                                                                val,
                                                                                              ) =>
                                                                                                handleUpdateSAIncomeRow(
                                                                                                  occ.id,
                                                                                                  originalIdx,
                                                                                                  "type",
                                                                                                  val,
                                                                                                )
                                                                                              }
                                                                                            >
                                                                                              <SelectTrigger className="h-9 text-sm bg-gray-50/30">
                                                                                                <SelectValue placeholder="ระบุประเภทรายได้" />
                                                                                              </SelectTrigger>
                                                                                              <SelectContent>
                                                                                                {SA_INCOME_TYPES.map(
                                                                                                  (
                                                                                                    type,
                                                                                                  ) => (
                                                                                                    <SelectItem
                                                                                                      key={
                                                                                                        type.value
                                                                                                      }
                                                                                                      value={
                                                                                                        type.value
                                                                                                      }
                                                                                                    >
                                                                                                      {
                                                                                                        type.label
                                                                                                      }
                                                                                                    </SelectItem>
                                                                                                  ),
                                                                                                )}
                                                                                              </SelectContent>
                                                                                            </Select>
                                                                                          </TableCell>
                                                                                          <TableCell className="py-2.5">
                                                                                            <Input
                                                                                              value={
                                                                                                item.detail ||
                                                                                                ""
                                                                                              }
                                                                                              onChange={(
                                                                                                e,
                                                                                              ) =>
                                                                                                handleUpdateSAIncomeRow(
                                                                                                  occ.id,
                                                                                                  originalIdx,
                                                                                                  "detail",
                                                                                                  e
                                                                                                    .target
                                                                                                    .value,
                                                                                                )
                                                                                              }
                                                                                              placeholder="รายละเอียด"
                                                                                              className="h-9 text-sm bg-gray-50/30"
                                                                                            />
                                                                                          </TableCell>
                                                                                          <TableCell className="py-2.5">
                                                                                            <Input
                                                                                              type="text"
                                                                                              value={formatNumberWithCommas(
                                                                                                item.amount ??
                                                                                                  "",
                                                                                              )}
                                                                                              onChange={(
                                                                                                e,
                                                                                              ) =>
                                                                                                handleUpdateSAIncomeRow(
                                                                                                  occ.id,
                                                                                                  originalIdx,
                                                                                                  "amount",
                                                                                                  e
                                                                                                    .target
                                                                                                    .value,
                                                                                                )
                                                                                              }
                                                                                              placeholder="จำนวน"
                                                                                              className="h-9 text-sm bg-gray-50/30 text-right font-mono"
                                                                                            />
                                                                                          </TableCell>
                                                                                          <TableCell className="py-2.5 text-center">
                                                                                            <Button
                                                                                              variant="ghost"
                                                                                              size="sm"
                                                                                              className="text-gray-400 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0 rounded-full"
                                                                                              onClick={() =>
                                                                                                setItemToDelete(
                                                                                                  {
                                                                                                    index:
                                                                                                      originalIdx,
                                                                                                    occId:
                                                                                                      occ.id,
                                                                                                    name:
                                                                                                      item.detail ||
                                                                                                      SA_INCOME_TYPES.find(
                                                                                                        (
                                                                                                          t,
                                                                                                        ) =>
                                                                                                          t.value ===
                                                                                                          item.type,
                                                                                                      )
                                                                                                        ?.label ||
                                                                                                      `รายการที่ ${originalIdx + 1}`,
                                                                                                    type: "saIncomeRow",
                                                                                                  },
                                                                                                )
                                                                                              }
                                                                                            >
                                                                                              <Trash2 className="w-4 h-4" />
                                                                                            </Button>
                                                                                          </TableCell>
                                                                                        </TableRow>
                                                                                      );
                                                                                    },
                                                                                  )
                                                                                )}
                                                                              </TableBody>
                                                                              {slipIncomes.length >
                                                                                0 && (
                                                                                <TableFooter>
                                                                                  <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 transition-none">
                                                                                    <TableCell
                                                                                      colSpan={
                                                                                        2
                                                                                      }
                                                                                      className="text-right font-bold py-3 text-xs text-gray-700"
                                                                                    >
                                                                                      รวมยอดจากเอกสารนี้:
                                                                                    </TableCell>
                                                                                    <TableCell
                                                                                      colSpan={
                                                                                        2
                                                                                      }
                                                                                      className="text-right pr-[4.5rem] py-3"
                                                                                    >
                                                                                      <div className="text-sm font-semibold font-mono text-gray-700">
                                                                                        {formatNumberWithCommas(
                                                                                          slipIncomes.reduce(
                                                                                            (
                                                                                              sum,
                                                                                              item,
                                                                                            ) =>
                                                                                              sum +
                                                                                              (Number(
                                                                                                item.amount,
                                                                                              ) ||
                                                                                                0),
                                                                                            0,
                                                                                          ),
                                                                                        )}
                                                                                      </div>
                                                                                    </TableCell>
                                                                                  </TableRow>
                                                                                </TableFooter>
                                                                              )}
                                                                            </Table>
                                                                          </div>
                                                                        </div>
                                                                      );
                                                                    },
                                                                  )}
                                                                </div>
                                                              ) : (
                                                                <div className="text-center py-6 text-muted-foreground text-sm italic">
                                                                  ยังไม่มีเอกสาร
                                                                  กรุณากดเพิ่มเอกสาร
                                                                </div>
                                                              )}
                                                            </motion.div>
                                                          </TabsContent>
                                                        );
                                                      },
                                                    )}
                                                  </Tabs>
                                                </div>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      )}

                                      {/* Salary Certificate Section */}
                                      {salaryCertUploaded &&
                                        (() => {
                                          const label =
                                            dynamicDocTypes.find(
                                              (d) => d.id === "salary_cert",
                                            )?.label ||
                                            "หนังสือรับรองเงินเดือน";
                                          const sourceIncomes =
                                            incomesBySource["salary_cert"] ||
                                            [];
                                          const salaryCertDocs = allDocs.filter(
                                            (d: IncomeDocument) =>
                                              d.type === "salary_cert",
                                          );
                                          const sourceDoc =
                                            salaryCertDocs.length > 0
                                              ? salaryCertDocs[0]
                                              : undefined;

                                          return (
                                            <div className="border border-border-strong rounded-xl bg-white p-5 space-y-4">
                                              <div className="flex items-center justify-between pb-2.5 border-b border-border-color">
                                                <div className="flex items-center gap-2.5">
                                                  <FileText className="w-4 h-4 text-emerald-600" />
                                                  <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold text-gray-800">
                                                      รายการรายได้จาก: {label}
                                                    </span>
                                                  </div>
                                                  {sourceDoc && (
                                                    <Button
                                                      type="button"
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() =>
                                                        window.open(
                                                          sourceDoc.url,
                                                          "_blank",
                                                        )
                                                      }
                                                      className="h-7 w-7 p-0 text-gray-400 hover:text-chaiyo-blue"
                                                      title="ดูเอกสารต้นฉบับ"
                                                    >
                                                      <Eye className="w-4 h-4" />
                                                    </Button>
                                                  )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                  {/* Empty right side container since there are no month/add-row buttons on the section header */}
                                                </div>
                                              </div>
                                              <div className="mt-3">
                                                {renderIncomeTable(
                                                  `รายการรายได้จาก: ${label}`,
                                                  "salary_cert",
                                                  sourceIncomes,
                                                  true,
                                                )}
                                              </div>
                                            </div>
                                          );
                                        })()}

                                      {/* Other Doc Types - Flat (ทวิ 50, หนังสือรับรองเงินเดือน, custom, etc.) */}
                                      {otherUploaded.map((docType) => {
                                        const label =
                                          dynamicDocTypes.find(
                                            (d) => d.id === docType,
                                          )?.label || docType;
                                        const sourceIncomes =
                                          incomesBySource[docType] || [];
                                        const otherDocs = allDocs.filter(
                                          (d: IncomeDocument) =>
                                            d.type === docType,
                                        );
                                        return renderIncomeTable(
                                          `รายการรายได้จาก: ${label}`,
                                          docType,
                                          sourceIncomes,
                                          true,
                                          otherDocs,
                                        );
                                      })}

                                      {/* Cash Income Table */}
                                      <div className="border border-border-strong rounded-xl bg-white p-5 space-y-4">
                                        <div className="flex items-center justify-between pb-2.5 border-b border-border-color">
                                          <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-emerald-600" />
                                            <span className="text-sm font-bold text-gray-800">
                                              รายการรายได้จากการสอบถาม
                                            </span>
                                          </div>
                                          <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                              handleAddSAIncomeRow(
                                                occ.id,
                                                "cash",
                                              )
                                            }
                                            className="h-8 text-xs font-medium"
                                          >
                                            <Plus className="w-3 h-3 mr-1" />{" "}
                                            เพิ่มรายการรายได้
                                          </Button>
                                        </div>
                                        {renderIncomeTable(
                                          "รายการรายได้จากการสอบถาม",
                                          "cash",
                                          incomesBySource["cash"] || [],
                                          false,
                                          undefined,
                                          undefined,
                                          false,
                                          (occ.incomeChannels || []).includes("cash")
                                        )}
                                      </div>

                                      {/* Grand Total Footer */}
                                      <div className="mt-6 border-t border-border-strong pt-4">
                                        <div className="flex items-center justify-between bg-chaiyo-blue/5 text-chaiyo-blue px-6 py-4 rounded-xl border border-chaiyo-blue/20 shadow-sm">
                                          <span className="text-sm font-bold">
                                            รายได้รวมทุกแหล่ง (ต่อเดือน):
                                          </span>
                                          <span className="text-xl font-bold font-mono tracking-tight">
                                            {formatNumberWithCommas(
                                              occ.totalIncome || "0",
                                            )}
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
                          {occ.employmentType === "SE" &&
                            !["FARMER", "LIVESTOCK"].includes(
                              occ.occupationCode || "",
                            ) && (
                              <div className="rounded-xl border border-border-color bg-gray-50/40 p-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                <h4 className="text-base font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-border-color">
                                  <Building className="w-5 h-5 text-chaiyo-blue" />{" "}
                                  รายละเอียดกิจการ
                                </h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                  <div className="space-y-3">
                                    <Label>
                                      สถานะกิจการปัจจุบัน{" "}
                                      <span className="text-red-500">*</span>
                                    </Label>
                                    <RadioGroup
                                      value={occ.businessStatus || ""}
                                      onValueChange={(val) =>
                                        handleOccupationChange(
                                          occ.id,
                                          "businessStatus",
                                          val,
                                        )
                                      }
                                      className="flex gap-6 pt-1"
                                    >
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                          value="active"
                                          id={`${occ.id}-se-active`}
                                        />
                                        <Label
                                          htmlFor={`${occ.id}-se-active`}
                                          className="font-normal cursor-pointer"
                                        >
                                          ดำเนินกิจการอยู่
                                        </Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                          value="closed"
                                          id={`${occ.id}-se-closed`}
                                        />
                                        <Label
                                          htmlFor={`${occ.id}-se-closed`}
                                          className="font-normal cursor-pointer"
                                        >
                                          ปิดกิจการ
                                        </Label>
                                      </div>
                                    </RadioGroup>
                                  </div>

                                  {occ.businessStatus !== "closed" && (
                                    <>
                                      <div className="space-y-2">
                                        <Label>
                                          สถานภาพกิจการปัจจุบัน
                                          <span className="text-red-500">
                                            *
                                          </span>
                                        </Label>
                                        <Select
                                          value={occ.familyBusiness || ""}
                                          onValueChange={(val) => {
                                            handleOccupationChange(occ.id, {
                                              familyBusiness: val,
                                              familyBusinessOther: "",
                                            });
                                          }}
                                        >
                                          <SelectTrigger className="h-11 bg-white">
                                            <SelectValue placeholder="เลือก..." />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="OWN">
                                              กิจการของตนเอง
                                            </SelectItem>
                                            <SelectItem value="FAMILY">
                                              กิจการของครอบครัว
                                            </SelectItem>
                                            <SelectItem value="OTHER">
                                              อื่นๆ โปรดระบุ
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                        {occ.familyBusiness === "OTHER" && (
                                          <Input
                                            value={
                                              occ.familyBusinessOther || ""
                                            }
                                            onChange={(e) =>
                                              handleOccupationChange(
                                                occ.id,
                                                "familyBusinessOther",
                                                e.target.value,
                                              )
                                            }
                                            placeholder="โปรดระบุ"
                                            className="h-11 bg-white mt-2"
                                          />
                                        )}
                                      </div>

                                      <div className="space-y-2">
                                        <Label>
                                          ประเภทกิจการ{" "}
                                          <span className="text-red-500">
                                            *
                                          </span>
                                        </Label>
                                        <Select
                                          value={occ.businessType || ""}
                                          onValueChange={(val) =>
                                            handleOccupationChange(
                                              occ.id,
                                              "businessType",
                                              val,
                                            )
                                          }
                                        >
                                          <SelectTrigger className="h-11 bg-white">
                                            <SelectValue placeholder="เลือกประเภทกิจการ" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="type1">
                                              การเกษตร
                                            </SelectItem>
                                            <SelectItem value="type2">
                                              การพาณิชย์
                                            </SelectItem>
                                            <SelectItem value="type3">
                                              การบริการ
                                            </SelectItem>
                                            <SelectItem value="type4">
                                              การผลิต
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>

                                      <div className="space-y-2">
                                        <Label>จำนวนพนักงาน</Label>
                                        <div className="relative">
                                          <Input
                                            type="text"
                                            value={occ.employeeCount || ""}
                                            onChange={(e) =>
                                              handleOccupationChange(
                                                occ.id,
                                                "employeeCount",
                                                e.target.value.replace(
                                                  /\D/g,
                                                  "",
                                                ),
                                              )
                                            }
                                            placeholder="0"
                                            className="h-11 bg-white pr-10"
                                          />
                                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                                            คน
                                          </span>
                                        </div>
                                      </div>

                                      <div className="space-y-2">
                                        <Label>
                                          อายุกิจการ{" "}
                                          <span className="text-red-500">
                                            *
                                          </span>
                                        </Label>
                                        <div className="relative">
                                          <Input
                                            type="text"
                                            value={occ.businessAgeYear || ""}
                                            onChange={(e) =>
                                              handleOccupationChange(
                                                occ.id,
                                                "businessAgeYear",
                                                e.target.value.replace(
                                                  /\D/g,
                                                  "",
                                                ),
                                              )
                                            }
                                            placeholder="0"
                                            className="h-11 bg-white pr-8"
                                          />
                                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                                            ปี
                                          </span>
                                        </div>
                                      </div>

                                      <div className="space-y-2">
                                        <Label>
                                          เวลาทำการ{" "}
                                          <span className="text-red-500">
                                            *
                                          </span>
                                        </Label>
                                        <div className="flex flex-wrap gap-6 mt-1">
                                          {SE_OPERATING_HOURS.map((hour) => {
                                            const currentHours =
                                              (
                                                (occ.seIncomes?.[0] ||
                                                  {}) as EnterpriseIncome
                                              ).operatingHours || [];
                                            const isChecked =
                                              currentHours.includes(hour.value);
                                            return (
                                              <div
                                                key={hour.value}
                                                className="flex items-center space-x-2"
                                              >
                                                <Checkbox
                                                  id={`operating-${hour.value}-${occ.id}`}
                                                  checked={isChecked}
                                                  onCheckedChange={() => {
                                                    const newHours = isChecked
                                                      ? currentHours.filter(
                                                          (h: string) =>
                                                            h !== hour.value,
                                                        )
                                                      : [
                                                          ...currentHours,
                                                          hour.value,
                                                        ];
                                                    handleUpdateSEIncomeRow(
                                                      occ.id,
                                                      0,
                                                      {
                                                        operatingHours:
                                                          newHours,
                                                      },
                                                    );
                                                  }}
                                                />
                                                <Label
                                                  htmlFor={`operating-${hour.value}-${occ.id}`}
                                                  className="font-normal cursor-pointer"
                                                >
                                                  {hour.label}
                                                </Label>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </div>

                                {occ.businessStatus !== "closed" && (
                                  <>
                                    {/* SE Income Method Checkboxes */}
                                    {devRole !== 'branch-staff' && (
                                      <div className="space-y-3 mt-6 mb-2">
                                        <Label className="font-bold text-gray-800">
                                          แหล่งรายได้ที่นำมาคำนวณ
                                        </Label>
                                        <div className="flex items-center gap-6">
                                          <div className="flex items-center gap-2">
                                            <Checkbox
                                              id={`use-statement-main-${occ.id}`}
                                              checked={
                                                occ.useBankStatementIncome ||
                                                false
                                              }
                                              onCheckedChange={(checked) =>
                                                handleOccupationChange(
                                                  occ.id,
                                                  "useBankStatementIncome",
                                                  !!checked,
                                                )
                                              }
                                            />
                                            <Label
                                              htmlFor={`use-statement-main-${occ.id}`}
                                              className="cursor-pointer font-medium"
                                            >
                                              ใช้รายได้จากบัญชีธนาคาร
                                            </Label>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <Checkbox
                                              id={`use-inquired-main-${occ.id}`}
                                              checked={
                                                occ.useInquiredIncome || false
                                              }
                                              onCheckedChange={(checked) =>
                                                handleOccupationChange(
                                                  occ.id,
                                                  "useInquiredIncome",
                                                  !!checked,
                                                )
                                              }
                                            />
                                            <Label
                                              htmlFor={`use-inquired-main-${occ.id}`}
                                              className="cursor-pointer font-medium"
                                            >
                                              ใช้รายได้จากการสอบถาม
                                            </Label>
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {/* SE Statement Section */}
                                    {seStatementSection}

                                    {/* SE Income Data Section */}
                                    <div className="space-y-4 pt-6 mt-6 border-t border-border-color">
                                      <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                          <TrendingUp className="w-4 h-4 text-emerald-600" />{" "}
                                          ข้อมูลรายได้ของกิจการ
                                        </h4>
                                      </div>

                                      <div className="border border-border-strong rounded-xl overflow-hidden bg-white">
                                        <Table>
                                          <TableHeader className="bg-gray-50/50">
                                            <TableRow>
                                              <TableHead className="w-[25%] text-xs">
                                                ความถี่{" "}
                                                <span className="text-red-500">
                                                  *
                                                </span>
                                              </TableHead>
                                              <TableHead className="w-[25%] text-xs">
                                                ยอดขาย (บาท){" "}
                                                <span className="text-red-500">
                                                  *
                                                </span>
                                              </TableHead>
                                              <TableHead className="w-[25%] text-xs">
                                                จำนวนต่อเดือน
                                              </TableHead>
                                              <TableHead className="w-[25%] text-xs text-right pr-6">
                                                รวมยอดขายต่อเดือน
                                              </TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {(() => {
                                              const item = (occ
                                                .seIncomes?.[0] ||
                                                {}) as EnterpriseIncome;
                                              const idx = 0;
                                              return (
                                                <TableRow className="group transition-colors hover:bg-gray-50/50">
                                                  <TableCell className="py-3">
                                                    <Select
                                                      value={
                                                        item.frequency || ""
                                                      }
                                                      onValueChange={(val) => {
                                                        const rowUpdates: Record<
                                                          string,
                                                          unknown
                                                        > = { frequency: val };
                                                        // Clear dependent fields if switching
                                                        if (val !== "daily")
                                                          rowUpdates.daysPerMonth =
                                                            "";
                                                        if (val !== "weekly")
                                                          rowUpdates.weeksPerMonth =
                                                            "";
                                                        handleUpdateSEIncomeRow(
                                                          occ.id,
                                                          idx,
                                                          rowUpdates,
                                                        );
                                                      }}
                                                    >
                                                      <SelectTrigger className="h-9 text-xs bg-gray-50/30">
                                                        <SelectValue placeholder="เลือกความถี่" />
                                                      </SelectTrigger>
                                                      <SelectContent>
                                                        {SE_INCOME_FREQUENCIES.map(
                                                          (freq) => (
                                                            <SelectItem
                                                              key={freq.value}
                                                              value={freq.value}
                                                              className="text-xs"
                                                            >
                                                              {freq.label}
                                                            </SelectItem>
                                                          ),
                                                        )}
                                                      </SelectContent>
                                                    </Select>
                                                  </TableCell>
                                                  <TableCell className="py-3">
                                                    <Input
                                                      type="text"
                                                      value={formatNumberWithCommas(
                                                        item.salesAmount ?? "",
                                                      )}
                                                      onChange={(e) =>
                                                        handleUpdateSEIncomeRow(
                                                          occ.id,
                                                          idx,
                                                          {
                                                            salesAmount:
                                                              e.target.value,
                                                          },
                                                        )
                                                      }
                                                      placeholder="0.00"
                                                      className="h-9 text-xs bg-gray-50/30 text-left font-mono"
                                                    />
                                                  </TableCell>
                                                  <TableCell className="py-3">
                                                    {item.frequency ===
                                                      "daily" && (
                                                      <Input
                                                        type="text"
                                                        value={
                                                          item.daysPerMonth ||
                                                          ""
                                                        }
                                                        onChange={(e) =>
                                                          handleUpdateSEIncomeRow(
                                                            occ.id,
                                                            idx,
                                                            {
                                                              daysPerMonth:
                                                                e.target.value,
                                                            },
                                                          )
                                                        }
                                                        placeholder="จำนวนวัน"
                                                        className="h-9 text-xs bg-gray-50/30"
                                                      />
                                                    )}
                                                    {item.frequency ===
                                                      "weekly" && (
                                                      <Input
                                                        type="text"
                                                        value={
                                                          item.weeksPerMonth ||
                                                          ""
                                                        }
                                                        onChange={(e) =>
                                                          handleUpdateSEIncomeRow(
                                                            occ.id,
                                                            idx,
                                                            {
                                                              weeksPerMonth:
                                                                e.target.value,
                                                            },
                                                          )
                                                        }
                                                        placeholder="จำนวนสัปดาห์"
                                                        className="h-9 text-xs bg-gray-50/30"
                                                      />
                                                    )}
                                                  </TableCell>
                                                  <TableCell className="py-3 pr-6">
                                                    <div className="text-right text-sm font-mono font-bold text-gray-600 mt-1">
                                                      {formatNumberWithCommas(
                                                        item.calculatedMonthly ||
                                                          "0",
                                                      )}
                                                    </div>
                                                  </TableCell>
                                                </TableRow>
                                              );
                                            })()}
                                          </TableBody>
                                          <TableFooter>
                                            <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 transition-none">
                                              <TableCell
                                                colSpan={3}
                                                className="text-right font-bold py-4 text-xs"
                                              >
                                                รวมยอดขายต่อเดือน:
                                              </TableCell>
                                              <TableCell className="text-right pr-6 py-4">
                                                <div className="text-lg font-bold font-mono">
                                                  {formatNumberWithCommas(
                                                    (
                                                      occ.seIncomes || []
                                                    ).reduce(
                                                      (
                                                        acc: number,
                                                        curr: EnterpriseIncome,
                                                      ) =>
                                                        acc +
                                                        (Number(
                                                          curr.calculatedMonthly,
                                                        ) || 0),
                                                      0,
                                                    ),
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
                                          <TrendingDown className="w-4 h-4 text-red-500" />{" "}
                                          ข้อมูลต้นทุนของกิจการ
                                        </h4>
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="sm"
                                          onClick={() =>
                                            handleAddSECostRow(occ.id)
                                          }
                                          className="h-8 text-xs font-medium"
                                        >
                                          <Plus className="w-3 h-3 mr-1" />{" "}
                                          เพิ่มรายการต้นทุน
                                        </Button>
                                      </div>

                                      <div className="border border-border-strong rounded-xl overflow-hidden bg-white">
                                        <Table>
                                          <TableHeader className="bg-gray-50/50">
                                            <TableRow>
                                              <TableHead className="w-[20%] text-xs">
                                                ประเภทต้นทุน{" "}
                                                <span className="text-red-500">
                                                  *
                                                </span>
                                              </TableHead>
                                              <TableHead className="w-[20%] text-xs">
                                                รายละเอียดต้นทุน
                                              </TableHead>
                                              <TableHead className="w-[15%] text-xs">
                                                ความถี่{" "}
                                                <span className="text-red-500">
                                                  *
                                                </span>
                                              </TableHead>
                                              <TableHead className="w-[15%] text-xs">
                                                ต้นทุน (บาท){" "}
                                                <span className="text-red-500">
                                                  *
                                                </span>
                                              </TableHead>
                                              <TableHead className="w-[10%] text-xs">
                                                จำนวนต่อเดือน
                                              </TableHead>
                                              <TableHead className="w-[15%] text-xs text-right">
                                                รวมต่อเดือน
                                              </TableHead>
                                              <TableHead className="w-[5%] text-center text-xs">
                                                จัดการ
                                              </TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {!occ.seCosts ||
                                            occ.seCosts.length === 0 ? (
                                              <TableRow>
                                                <TableCell
                                                  colSpan={7}
                                                  className="h-24 text-center text-muted-foreground italic text-xs"
                                                >
                                                  ยังไม่มีข้อมูลต้นทุน
                                                  กรุณากดเพิ่มรายการ
                                                </TableCell>
                                              </TableRow>
                                            ) : (
                                              occ.seCosts.map(
                                                (
                                                  item: EnterpriseIncome,
                                                  idx: number,
                                                ) => (
                                                  <TableRow
                                                    key={idx}
                                                    className="group transition-colors hover:bg-gray-50/50"
                                                  >
                                                    <TableCell className="py-3 align-top">
                                                      <div className="space-y-2">
                                                        <Select
                                                          value={
                                                            item.type || ""
                                                          }
                                                          onValueChange={(
                                                            val,
                                                          ) => {
                                                            const rowUpdates: Record<
                                                              string,
                                                              unknown
                                                            > = { type: val };
                                                            if (
                                                              val !== "custom"
                                                            ) {
                                                              rowUpdates.customType =
                                                                "";
                                                            }
                                                            handleUpdateSECostRow(
                                                              occ.id,
                                                              idx,
                                                              rowUpdates,
                                                            );
                                                          }}
                                                        >
                                                          <SelectTrigger className="h-9 text-xs bg-gray-50/30">
                                                            <SelectValue placeholder="เลือกประเภท" />
                                                          </SelectTrigger>
                                                          <SelectContent>
                                                            {SE_COST_TYPES.map(
                                                              (type) => (
                                                                <SelectItem
                                                                  key={
                                                                    type.value
                                                                  }
                                                                  value={
                                                                    type.value
                                                                  }
                                                                  className="text-xs"
                                                                >
                                                                  {type.label}
                                                                </SelectItem>
                                                              ),
                                                            )}
                                                          </SelectContent>
                                                        </Select>
                                                        {item.type ===
                                                          "custom" && (
                                                          <Input
                                                            type="text"
                                                            value={
                                                              item.customType ||
                                                              ""
                                                            }
                                                            onChange={(e) =>
                                                              handleUpdateSECostRow(
                                                                occ.id,
                                                                idx,
                                                                {
                                                                  customType:
                                                                    e.target
                                                                      .value,
                                                                },
                                                              )
                                                            }
                                                            placeholder="ระบุชื่อต้นทุน"
                                                            className="h-9 text-xs bg-gray-50/30"
                                                          />
                                                        )}
                                                      </div>
                                                    </TableCell>
                                                    <TableCell className="py-3 align-top">
                                                      <Textarea
                                                        value={
                                                          item.costDetail || ""
                                                        }
                                                        onChange={(e) =>
                                                          handleUpdateSECostRow(
                                                            occ.id,
                                                            idx,
                                                            {
                                                              costDetail:
                                                                e.target.value,
                                                            },
                                                          )
                                                        }
                                                        placeholder="รายละเอียด"
                                                        className="text-xs bg-gray-50/30 text-left min-h-[36px] resize-none overflow-hidden"
                                                        rows={1}
                                                        onInput={(e) => {
                                                          const target =
                                                            e.target as HTMLTextAreaElement;
                                                          target.style.height =
                                                            "auto";
                                                          target.style.height =
                                                            target.scrollHeight +
                                                            "px";
                                                        }}
                                                      />
                                                    </TableCell>
                                                    <TableCell className="py-3 align-top">
                                                      <Select
                                                        value={
                                                          item.frequency || ""
                                                        }
                                                        onValueChange={(
                                                          val,
                                                        ) => {
                                                          const rowUpdates: Record<
                                                            string,
                                                            unknown
                                                          > = {
                                                            frequency: val,
                                                          };
                                                          // Clear dependent fields if switching
                                                          if (val !== "daily")
                                                            rowUpdates.daysPerMonth =
                                                              "";
                                                          if (val !== "weekly")
                                                            rowUpdates.weeksPerMonth =
                                                              "";
                                                          handleUpdateSECostRow(
                                                            occ.id,
                                                            idx,
                                                            rowUpdates,
                                                          );
                                                        }}
                                                      >
                                                        <SelectTrigger className="h-9 text-xs bg-gray-50/30">
                                                          <SelectValue placeholder="เลือกความถี่" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                          {SE_COST_FREQUENCIES.map(
                                                            (freq) => (
                                                              <SelectItem
                                                                key={freq.value}
                                                                value={
                                                                  freq.value
                                                                }
                                                                className="text-xs"
                                                              >
                                                                {freq.label}
                                                              </SelectItem>
                                                            ),
                                                          )}
                                                        </SelectContent>
                                                      </Select>
                                                    </TableCell>
                                                    <TableCell className="py-3 align-top">
                                                      <Input
                                                        type="text"
                                                        value={
                                                          formatNumberWithCommas(
                                                            item.costAmount ??
                                                              0,
                                                          ) || ""
                                                        }
                                                        onChange={(e) =>
                                                          handleUpdateSECostRow(
                                                            occ.id,
                                                            idx,
                                                            {
                                                              costAmount:
                                                                e.target.value,
                                                            },
                                                          )
                                                        }
                                                        placeholder="0.00"
                                                        className="h-9 text-xs bg-gray-50/30 text-left font-mono"
                                                      />
                                                    </TableCell>
                                                    <TableCell className="py-3 align-top">
                                                      {item.frequency ===
                                                        "daily" && (
                                                        <Input
                                                          type="text"
                                                          value={
                                                            item.daysPerMonth ||
                                                            ""
                                                          }
                                                          onChange={(e) =>
                                                            handleUpdateSECostRow(
                                                              occ.id,
                                                              idx,
                                                              {
                                                                daysPerMonth:
                                                                  e.target
                                                                    .value,
                                                              },
                                                            )
                                                          }
                                                          placeholder="จำนวนวัน"
                                                          className="h-9 text-xs bg-gray-50/30"
                                                        />
                                                      )}
                                                      {item.frequency ===
                                                        "weekly" && (
                                                        <Input
                                                          type="text"
                                                          value={
                                                            item.weeksPerMonth ||
                                                            ""
                                                          }
                                                          onChange={(e) =>
                                                            handleUpdateSECostRow(
                                                              occ.id,
                                                              idx,
                                                              {
                                                                weeksPerMonth:
                                                                  e.target
                                                                    .value,
                                                              },
                                                            )
                                                          }
                                                          placeholder="จำนวนสัปดาห์"
                                                          className="h-9 text-xs bg-gray-50/30"
                                                        />
                                                      )}
                                                    </TableCell>
                                                    <TableCell className="py-3 pr-4 align-top">
                                                      <div className="text-right text-sm font-mono font-bold text-gray-600 mt-1">
                                                        {formatNumberWithCommas(
                                                          item.calculatedMonthly ||
                                                            "0",
                                                        )}
                                                      </div>
                                                    </TableCell>
                                                    <TableCell className="py-3 text-center align-top">
                                                      <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 rounded-full mt-0.5"
                                                        onClick={() =>
                                                          setItemToDelete({
                                                            index: idx,
                                                            occId: occ.id,
                                                            name: `รายการต้นทุนที่ ${idx + 1}`,
                                                            type: "seCostRow",
                                                          })
                                                        }
                                                      >
                                                        <Trash2 className="w-4 h-4" />
                                                      </Button>
                                                    </TableCell>
                                                  </TableRow>
                                                ),
                                              )
                                            )}
                                          </TableBody>
                                          <TableFooter>
                                            <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 transition-none">
                                              <TableCell
                                                colSpan={5}
                                                className="text-right font-bold py-4 text-xs"
                                              >
                                                รวมต้นทุนเฉลี่ยต่อเดือน:
                                              </TableCell>
                                              <TableCell
                                                colSpan={2}
                                                className="text-right pr-4 py-4"
                                              >
                                                <div className="text-lg font-bold font-mono text-gray-900">
                                                  {formatNumberWithCommas(
                                                    (occ.seCosts || []).reduce(
                                                      (
                                                        acc: number,
                                                        curr: EnterpriseIncome,
                                                      ) =>
                                                        acc +
                                                        (Number(
                                                          curr.calculatedMonthly,
                                                        ) || 0),
                                                      0,
                                                    ),
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
                                          <span className="text-sm font-bold">
                                            รายได้สุทธิต่อเดือน:
                                          </span>
                                          {(() => {
                                            const totalIncome = (
                                              occ.seIncomes || []
                                            ).reduce(
                                              (
                                                acc: number,
                                                curr: EnterpriseIncome,
                                              ) =>
                                                acc +
                                                (Number(
                                                  curr.calculatedMonthly,
                                                ) || 0),
                                              0,
                                            );
                                            const totalCost = (
                                              occ.seCosts || []
                                            ).reduce(
                                              (
                                                acc: number,
                                                curr: EnterpriseIncome,
                                              ) =>
                                                acc +
                                                (Number(
                                                  curr.calculatedMonthly,
                                                ) || 0),
                                              0,
                                            );
                                            const netIncome =
                                              totalIncome - totalCost;
                                            return (
                                              <span
                                                className={cn(
                                                  "text-xl font-bold font-mono tracking-tight",
                                                  netIncome < 0
                                                    ? "text-red-500"
                                                    : "text-chaiyo-blue",
                                                )}
                                              >
                                                {formatNumberWithCommas(
                                                  netIncome,
                                                )}
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
                          {occ.employmentType === "SE" &&
                            occ.occupationCode === "FARMER" && (
                              <div className="rounded-xl border border-border-color bg-gray-50/40 p-6 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                                <h4 className="text-base font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-border-color">
                                  <Briefcase className="w-5 h-5 text-chaiyo-blue" />{" "}
                                  รายละเอียดของกิจการ (เกษตรกร)
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
                                        <Label>
                                          ผลผลิตที่ปลูก{" "}
                                          <span className="text-red-500">
                                            *
                                          </span>
                                        </Label>
                                        <div className="flex flex-col sm:flex-row gap-3">
                                          <Select
                                            value={occ.produceType || ""}
                                            onValueChange={(val) =>
                                              handleOccupationChange(
                                                occ.id,
                                                "produceType",
                                                val,
                                              )
                                            }
                                          >
                                            <SelectTrigger className="h-11 bg-gray-50/30">
                                              <SelectValue placeholder="เลือกผลผลิต" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {FARMER_PRODUCE_LIST.map(
                                                (item) => (
                                                  <SelectItem
                                                    key={item.value}
                                                    value={item.value}
                                                  >
                                                    {item.label}
                                                  </SelectItem>
                                                ),
                                              )}
                                            </SelectContent>
                                          </Select>
                                          {occ.produceType === "others" && (
                                            <Input
                                              value={occ.otherProduceType || ""}
                                              onChange={(e) =>
                                                handleOccupationChange(
                                                  occ.id,
                                                  "otherProduceType",
                                                  e.target.value,
                                                )
                                              }
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
                                            onValueChange={(val) =>
                                              handleOccupationChange(
                                                occ.id,
                                                "plantingStartMonth",
                                                val,
                                              )
                                            }
                                          >
                                            <SelectTrigger className="h-11 bg-gray-50/30 flex-1">
                                              <SelectValue placeholder="เดือน" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {FARM_MONTHS.map((opt) => (
                                                <SelectItem
                                                  key={opt.value}
                                                  value={opt.value}
                                                >
                                                  {opt.label}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                          <Select
                                            value={occ.plantingStartYear || ""}
                                            onValueChange={(val) =>
                                              handleOccupationChange(
                                                occ.id,
                                                "plantingStartYear",
                                                val,
                                              )
                                            }
                                          >
                                            <SelectTrigger className="h-11 bg-gray-50/30 flex-1">
                                              <SelectValue placeholder="ปี" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {FARM_YEARS.map((opt) => (
                                                <SelectItem
                                                  key={opt.value}
                                                  value={opt.value}
                                                >
                                                  {opt.label}
                                                </SelectItem>
                                              ))}
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
                                            onValueChange={(val) =>
                                              handleOccupationChange(
                                                occ.id,
                                                "harvestEndMonth",
                                                val,
                                              )
                                            }
                                          >
                                            <SelectTrigger className="h-11 bg-gray-50/30 flex-1">
                                              <SelectValue placeholder="เดือน" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {FARM_MONTHS.map((opt) => (
                                                <SelectItem
                                                  key={opt.value}
                                                  value={opt.value}
                                                >
                                                  {opt.label}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                          <Select
                                            value={occ.harvestEndYear || ""}
                                            onValueChange={(val) =>
                                              handleOccupationChange(
                                                occ.id,
                                                "harvestEndYear",
                                                val,
                                              )
                                            }
                                          >
                                            <SelectTrigger className="h-11 bg-gray-50/30 flex-1">
                                              <SelectValue placeholder="ปี" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {FARM_YEARS.map((opt) => (
                                                <SelectItem
                                                  key={opt.value}
                                                  value={opt.value}
                                                >
                                                  {opt.label}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>

                                      {/* ระยะเพาะปลูก (อายุ) - Calculated */}
                                      <div className="col-span-2 bg-chaiyo-blue/5 border border-chaiyo-blue/10 rounded-xl p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <Info className="w-4 h-4 text-chaiyo-blue" />
                                          <span className="text-sm font-bold text-gray-700">
                                            ระยะเพาะปลูก (อายุ)
                                          </span>
                                        </div>
                                        {(() => {
                                          if (
                                            !occ.plantingStartYear ||
                                            !occ.plantingStartMonth ||
                                            !occ.harvestEndYear ||
                                            !occ.harvestEndMonth
                                          ) {
                                            return (
                                              <div className="text-lg font-bold text-gray-400">
                                                ระบุวันที่ให้ครบถ้วน
                                              </div>
                                            );
                                          }

                                          const startY = parseInt(
                                            occ.plantingStartYear,
                                          );
                                          const startM = parseInt(
                                            occ.plantingStartMonth,
                                          );
                                          const endY = parseInt(
                                            occ.harvestEndYear,
                                          );
                                          const endM = parseInt(
                                            occ.harvestEndMonth,
                                          );

                                          const startTotal =
                                            startY * 12 + startM;
                                          const endTotal = endY * 12 + endM;
                                          let diff = endTotal - startTotal;

                                          if (diff < 0) {
                                            return (
                                              <div className="text-sm font-bold text-red-500">
                                                วันที่เก็บเกี่ยวต้องอยู่หลังวันที่ปลูก
                                              </div>
                                            );
                                          }

                                          const resY = Math.floor(diff / 12);
                                          const resM = diff % 12;

                                          return (
                                            <div className="text-lg font-bold text-chaiyo-blue">
                                              {resY > 0 ? `${resY} ปี ` : ""}
                                              {resM > 0
                                                ? `${resM} เดือน`
                                                : resY === 0
                                                  ? "0 เดือน"
                                                  : ""}
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
                                              value={
                                                occ.cultivationAreaRai || ""
                                              }
                                              onChange={(e) =>
                                                handleOccupationChange(
                                                  occ.id,
                                                  "cultivationAreaRai",
                                                  e.target.value.replace(
                                                    /\D/g,
                                                    "",
                                                  ),
                                                )
                                              }
                                              placeholder="0"
                                              className="h-11 bg-gray-50/30 pr-8"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                                              ไร่
                                            </span>
                                          </div>
                                          <div className="relative">
                                            <Input
                                              type="text"
                                              value={
                                                occ.cultivationAreaNgan || ""
                                              }
                                              onChange={(e) =>
                                                handleOccupationChange(
                                                  occ.id,
                                                  "cultivationAreaNgan",
                                                  e.target.value.replace(
                                                    /\D/g,
                                                    "",
                                                  ),
                                                )
                                              }
                                              placeholder="0"
                                              className="h-11 bg-gray-50/30 pr-10"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                                              งาน
                                            </span>
                                          </div>
                                          <div className="relative">
                                            <Input
                                              type="text"
                                              value={
                                                occ.cultivationAreaSqWa || ""
                                              }
                                              onChange={(e) =>
                                                handleOccupationChange(
                                                  occ.id,
                                                  "cultivationAreaSqWa",
                                                  e.target.value.replace(
                                                    /\D/g,
                                                    "",
                                                  ),
                                                )
                                              }
                                              placeholder="0"
                                              className="h-11 bg-gray-50/30 pr-16"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                                              ตารางวา
                                            </span>
                                          </div>
                                        </div>
                                      </div>

                                      {/* จำนวนรอบที่ปลูกต่อปี */}
                                      <div className="space-y-2">
                                        <Label>
                                          จำนวนรอบที่ปลูกต่อปี{" "}
                                          <span className="text-red-500">
                                            *
                                          </span>
                                        </Label>
                                        <div className="relative">
                                          <Input
                                            type="text"
                                            value={occ.cyclesPerYear || ""}
                                            onChange={(e) =>
                                              handleOccupationChange(
                                                occ.id,
                                                "cyclesPerYear",
                                                e.target.value.replace(
                                                  /\D/g,
                                                  "",
                                                ),
                                              )
                                            }
                                            placeholder="เช่น 1"
                                            className="h-11 bg-gray-50/30 pr-10"
                                          />
                                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                                            รอบ
                                          </span>
                                        </div>
                                      </div>

                                      {/* เขตชลประทาน */}
                                      <div className="space-y-3">
                                        <Label>เขตชลประทาน</Label>
                                        <RadioGroup
                                          value={occ.irrigationZone || ""}
                                          onValueChange={(val) =>
                                            handleOccupationChange(
                                              occ.id,
                                              "irrigationZone",
                                              val,
                                            )
                                          }
                                          className="flex items-center gap-6"
                                        >
                                          <div className="flex items-center gap-2">
                                            <RadioGroupItem
                                              value="outside"
                                              id={`irrigation-outside-${occ.id}`}
                                            />
                                            <Label
                                              htmlFor={`irrigation-outside-${occ.id}`}
                                              className="cursor-pointer font-normal"
                                            >
                                              นอกเขต
                                            </Label>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <RadioGroupItem
                                              value="inside"
                                              id={`irrigation-inside-${occ.id}`}
                                            />
                                            <Label
                                              htmlFor={`irrigation-inside-${occ.id}`}
                                              className="cursor-pointer font-normal"
                                            >
                                              ในเขต
                                            </Label>
                                          </div>
                                        </RadioGroup>
                                      </div>

                                      {/* การถือครอง */}
                                      <div className="space-y-3">
                                        <Label>การถือครองที่ดินทำกิน</Label>
                                        <Select
                                          value={occ.landOwnership || ""}
                                          onValueChange={(val) =>
                                            handleOccupationChange(
                                              occ.id,
                                              "landOwnership",
                                              val,
                                            )
                                          }
                                        >
                                          <SelectTrigger className="h-11 bg-gray-50/30">
                                            <SelectValue placeholder="เลือกการถือครอง" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {LAND_OWNERSHIP_TYPES.map(
                                              (item) => (
                                                <SelectItem
                                                  key={item.value}
                                                  value={item.value}
                                                >
                                                  {item.label}
                                                </SelectItem>
                                              ),
                                            )}
                                          </SelectContent>
                                        </Select>
                                      </div>

                                      {/* ทำเอง/จ้างทำ */}
                                      <div className="space-y-3">
                                        <Label>ทำเอง/จ้างทำ</Label>
                                        <RadioGroup
                                          value={occ.laborType || ""}
                                          onValueChange={(val) =>
                                            handleOccupationChange(
                                              occ.id,
                                              "laborType",
                                              val,
                                            )
                                          }
                                          className="flex items-center gap-6"
                                        >
                                          <div className="flex items-center gap-2">
                                            <RadioGroupItem
                                              value="self"
                                              id={`labor-self-${occ.id}`}
                                            />
                                            <Label
                                              htmlFor={`labor-self-${occ.id}`}
                                              className="cursor-pointer font-normal"
                                            >
                                              ทำเอง
                                            </Label>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <RadioGroupItem
                                              value="hire"
                                              id={`labor-hire-${occ.id}`}
                                            />
                                            <Label
                                              htmlFor={`labor-hire-${occ.id}`}
                                              className="cursor-pointer font-normal"
                                            >
                                              จ้างทำ
                                            </Label>
                                          </div>
                                        </RadioGroup>
                                      </div>

                                      {/* ทำกี่คน (Display only if จ้างทำ is selected) */}
                                      {occ.laborType === "hire" && (
                                        <div className="space-y-2 animate-in fade-in slide-in-from-left-4 duration-300">
                                          <Label>ทำกี่คน</Label>
                                          <div className="relative">
                                            <Input
                                              type="text"
                                              value={occ.laborCount || ""}
                                              onChange={(e) =>
                                                handleOccupationChange(
                                                  occ.id,
                                                  "laborCount",
                                                  e.target.value.replace(
                                                    /\D/g,
                                                    "",
                                                  ),
                                                )
                                              }
                                              placeholder="กี่คน"
                                              className="h-11 bg-gray-50/30 pr-10"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                                              คน
                                            </span>
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
                                        checked={
                                          occ.farmIsHigherThanStandard || false
                                        }
                                        onCheckedChange={(checked) =>
                                          handleOccupationChange(
                                            occ.id,
                                            "farmIsHigherThanStandard",
                                            !!checked,
                                          )
                                        }
                                        className="h-4 w-4 rounded-md border-gray-300 data-[state=checked]:bg-chaiyo-blue data-[state=checked]:border-chaiyo-blue"
                                      />
                                      <Label
                                        htmlFor={`farm-higher-${occ.id}`}
                                        className="text-xs leading-none text-gray-700 cursor-pointer font-bold select-none"
                                      >
                                        กรณีราคาขาย / ต้นทุน ไม่เท่ากับราคากลาง
                                      </Label>
                                    </div>
                                  </div>
                                  <div className="border border-border-strong rounded-xl overflow-hidden bg-white">
                                    <Table>
                                      <TableHeader className="bg-gray-50/50">
                                        <TableRow>
                                          <TableHead className="w-[40%] text-xs font-bold">
                                            รายการ
                                          </TableHead>
                                          <TableHead className="w-[30%] text-xs font-bold text-right text-gray-500">
                                            ราคากลาง
                                          </TableHead>
                                          {occ.farmIsHigherThanStandard && (
                                            <TableHead className="w-[30%] text-xs font-bold text-right pr-6 text-chaiyo-blue bg-blue-50/50">
                                              ราคาของลูกค้า
                                            </TableHead>
                                          )}
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {(() => {
                                          const std = FARM_STANDARD_PRICES[
                                            occ.produceType || "others"
                                          ] || { sales: 0, cost: 0 };

                                          const totalAreaRai =
                                            Number(
                                              occ.cultivationAreaRai || 0,
                                            ) +
                                            Number(
                                              occ.cultivationAreaNgan || 0,
                                            ) /
                                              4 +
                                            Number(
                                              occ.cultivationAreaSqWa || 0,
                                            ) /
                                              400;
                                          const cycles = Number(
                                            occ.cyclesPerYear || 1,
                                          );
                                          const laborers =
                                            Number(occ.laborCount || 1) || 1; // avoid divide by zero

                                          const customerSales =
                                            occ.farmIsHigherThanStandard
                                              ? occ.customerSalesPerRai
                                                ? Number(
                                                    occ.customerSalesPerRai,
                                                  )
                                                : std.sales
                                              : std.sales;
                                          const customerCost =
                                            occ.farmIsHigherThanStandard
                                              ? occ.customerCostPerRai
                                                ? Number(occ.customerCostPerRai)
                                                : std.cost
                                              : std.cost;

                                          const stdIncome =
                                            ((std.sales - std.cost) *
                                              totalAreaRai *
                                              cycles) /
                                            12 /
                                            laborers;
                                          const customerIncome =
                                            ((customerSales - customerCost) *
                                              totalAreaRai *
                                              cycles) /
                                            12 /
                                            laborers;

                                          return (
                                            <>
                                              <TableRow className="hover:bg-gray-50/30">
                                                <TableCell className="py-3 text-xs font-medium text-gray-700">
                                                  ขายได้ต่อไร่ต่อรอบ (บาท)
                                                </TableCell>
                                                <TableCell className="py-3 text-xs text-right font-mono text-muted-foreground">
                                                  {formatNumberWithCommas(
                                                    std.sales,
                                                  )}
                                                </TableCell>
                                                {occ.farmIsHigherThanStandard && (
                                                  <TableCell className="py-3 text-right pr-6 bg-blue-50/10">
                                                    <Input
                                                      type="text"
                                                      value={formatNumberWithCommas(
                                                        occ.customerSalesPerRai ||
                                                          "",
                                                      )}
                                                      onChange={(e) => {
                                                        const cleaned =
                                                          e.target.value.replace(
                                                            /,/g,
                                                            "",
                                                          );
                                                        if (
                                                          /^\d*\.?\d*$/.test(
                                                            cleaned,
                                                          )
                                                        ) {
                                                          handleOccupationChange(
                                                            occ.id,
                                                            "customerSalesPerRai",
                                                            cleaned,
                                                          );
                                                        }
                                                      }}
                                                      className="h-8 text-[11px] bg-white font-mono text-right w-32 ml-auto"
                                                      placeholder="0.00"
                                                    />
                                                  </TableCell>
                                                )}
                                              </TableRow>
                                              <TableRow className="hover:bg-gray-50/30 border-b">
                                                <TableCell className="py-3 text-xs font-medium text-gray-700">
                                                  ต้นทุนต่อไร่ต่อรอบ (บาท)
                                                </TableCell>
                                                <TableCell className="py-3 text-xs text-right font-mono text-muted-foreground">
                                                  {formatNumberWithCommas(
                                                    std.cost,
                                                  )}
                                                </TableCell>
                                                {occ.farmIsHigherThanStandard && (
                                                  <TableCell className="py-3 text-right pr-6 bg-blue-50/10">
                                                    <Input
                                                      type="text"
                                                      value={formatNumberWithCommas(
                                                        occ.customerCostPerRai ||
                                                          "",
                                                      )}
                                                      onChange={(e) => {
                                                        const cleaned =
                                                          e.target.value.replace(
                                                            /,/g,
                                                            "",
                                                          );
                                                        if (
                                                          /^\d*\.?\d*$/.test(
                                                            cleaned,
                                                          )
                                                        ) {
                                                          handleOccupationChange(
                                                            occ.id,
                                                            "customerCostPerRai",
                                                            cleaned,
                                                          );
                                                        }
                                                      }}
                                                      className="h-8 text-[11px] bg-white font-mono text-right w-32 ml-auto"
                                                      placeholder="0.00"
                                                    />
                                                  </TableCell>
                                                )}
                                              </TableRow>
                                              <TableRow className="bg-blue-50/50 hover:bg-blue-50/50 transition-none">
                                                <TableCell className="py-4 text-xs font-bold text-chaiyo-blue">
                                                  รายได้ต่อเดือน (บาท)
                                                </TableCell>
                                                <TableCell className="py-4 text-sm text-right font-bold font-mono text-chaiyo-blue">
                                                  {formatNumberWithCommas(
                                                    Math.max(
                                                      0,
                                                      stdIncome,
                                                    ).toFixed(2),
                                                  )}
                                                </TableCell>
                                                {occ.farmIsHigherThanStandard && (
                                                  <TableCell className="py-4 text-right pr-6 bg-blue-50/80">
                                                    <div className="text-sm font-bold font-mono text-chaiyo-blue">
                                                      {formatNumberWithCommas(
                                                        Math.max(
                                                          0,
                                                          customerIncome,
                                                        ).toFixed(2),
                                                      )}
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
                                    * รายได้ต่อเดือน = (((ขายได้-ต้นทุน) ×
                                    พื้นที่เพาะปลูก × จำนวนรอบ) / 12) / จำนวนคน
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
                                          const reset = FARM_STAGES.map(
                                            (stage) => ({
                                              stage,
                                              selectedMonths: [],
                                            }),
                                          );
                                          handleOccupationChange(
                                            occ.id,
                                            "produceSummary",
                                            reset,
                                          );
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
                                          {THAI_MONTHS_SHORT.map((m) => (
                                            <TableHead
                                              key={m}
                                              className="text-center p-0 text-[10px] font-bold text-gray-600 border-r border-border-subtle last:border-r-0 min-w-[55px] h-10"
                                            >
                                              {m}
                                            </TableHead>
                                          ))}
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {(() => {
                                          const produceRows =
                                            occ.produceSummary &&
                                            occ.produceSummary.length ===
                                              FARM_STAGES.length
                                              ? occ.produceSummary
                                              : FARM_STAGES.map((stage) => ({
                                                  stage,
                                                  selectedMonths: [],
                                                }));

                                          return produceRows.map(
                                            (item: any, rowIdx: number) => {
                                              const handleMonthClick = (
                                                monthStr: string,
                                              ) => {
                                                const updated = [
                                                  ...produceRows,
                                                ];
                                                const row = {
                                                  ...updated[rowIdx],
                                                };

                                                // Handle transitioning from old range data to array if necessary
                                                let currentSelected =
                                                  Array.isArray(
                                                    row.selectedMonths,
                                                  )
                                                    ? [...row.selectedMonths]
                                                    : [];

                                                if (
                                                  currentSelected.includes(
                                                    monthStr,
                                                  )
                                                ) {
                                                  currentSelected =
                                                    currentSelected.filter(
                                                      (m) => m !== monthStr,
                                                    );
                                                } else {
                                                  currentSelected.push(
                                                    monthStr,
                                                  );
                                                }

                                                row.selectedMonths =
                                                  currentSelected;
                                                updated[rowIdx] = row;
                                                handleOccupationChange(
                                                  occ.id,
                                                  "produceSummary",
                                                  updated,
                                                );
                                              };

                                              return (
                                                <TableRow
                                                  key={rowIdx}
                                                  className="hover:bg-gray-50/20 group transition-colors border-b border-border-subtle last:border-b-0"
                                                >
                                                  <TableCell className="py-4 px-4 font-semibold text-xs text-gray-700 bg-white border-r border-border-subtle sticky left-0 z-10">
                                                    {item.stage}
                                                  </TableCell>
                                                  {THAI_MONTHS_SHORT.map(
                                                    (m, monthIdx) => {
                                                      const isSelected =
                                                        Array.isArray(
                                                          item.selectedMonths,
                                                        ) &&
                                                        item.selectedMonths.includes(
                                                          m,
                                                        );

                                                      return (
                                                        <TableCell
                                                          key={monthIdx}
                                                          className="p-0 text-center border-r border-border-subtle last:border-r-0 h-[52px]"
                                                        >
                                                          <button
                                                            type="button"
                                                            onClick={() =>
                                                              handleMonthClick(
                                                                m,
                                                              )
                                                            }
                                                            className={cn(
                                                              "w-full h-full flex flex-col items-center justify-center transition-all duration-150 relative group/btn",
                                                              isSelected
                                                                ? "bg-chaiyo-blue text-white"
                                                                : "hover:bg-chaiyo-blue/5 text-gray-400",
                                                            )}
                                                          >
                                                            <span
                                                              className={cn(
                                                                "text-[10px] font-bold transition-transform",
                                                                isSelected
                                                                  ? "scale-110"
                                                                  : "scale-100 opacity-30 group-hover/btn:opacity-100",
                                                              )}
                                                            >
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
                                                    },
                                                  )}
                                                </TableRow>
                                              );
                                            },
                                          );
                                        })()}
                                      </TableBody>
                                    </Table>
                                  </div>
                                  <p className="text-[10px] text-muted-foreground italic px-1">
                                    *
                                    แตะที่แต่ละเดือนเพื่อเลือกหรือยกเลิกการเลือกช่วงเวลา
                                    (เลือกได้หลายเดือนแบบอิสระ)
                                  </p>
                                </div>
                              </div>
                            )}

                          {/* SE Details Section: รายละเอียดกิจการ (กรณีปศุสัตว์) */}
                          {occ.employmentType === "SE" &&
                            occ.occupationCode === "LIVESTOCK" && (
                              <div className="rounded-xl border border-border-color bg-gray-50/40 p-6 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                                <h4 className="text-base font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-border-color">
                                  <Briefcase className="w-5 h-5 text-chaiyo-blue" />{" "}
                                  รายละเอียดของกิจการ (ปศุสัตว์)
                                </h4>

                                {/* ประเภทปศุสัตว์ Section */}
                                <div className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    <div className="space-y-2">
                                      <Label>
                                        ประเภทปศุสัตว์{" "}
                                        <span className="text-red-500">*</span>
                                      </Label>
                                      <div className="flex flex-col sm:flex-row gap-3">
                                        <Select
                                          value={occ.livestockType || ""}
                                          onValueChange={(val) =>
                                            handleOccupationChange(
                                              occ.id,
                                              "livestockType",
                                              val,
                                            )
                                          }
                                        >
                                          <SelectTrigger className="h-11 bg-white">
                                            <SelectValue placeholder="เลือกประเภทปศุสัตว์" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {LIVESTOCK_TYPES.map((item) => (
                                              <SelectItem
                                                key={item.value}
                                                value={item.value}
                                              >
                                                {item.label}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                        {occ.livestockType === "others" && (
                                          <Input
                                            value={occ.otherLivestockType || ""}
                                            onChange={(e) =>
                                              handleOccupationChange(
                                                occ.id,
                                                "otherLivestockType",
                                                e.target.value,
                                              )
                                            }
                                            placeholder="โปรดระบุอื่นๆ"
                                            className="h-11 bg-white w-full sm:max-w-xs"
                                          />
                                        )}
                                      </div>
                                    </div>

                                    <div className="space-y-2">
                                      <Label>
                                        ประเภทการเลี้ยง{" "}
                                        <span className="text-red-500">*</span>
                                      </Label>
                                      <Select
                                        value={occ.farmingType || ""}
                                        onValueChange={(val) =>
                                          handleOccupationChange(
                                            occ.id,
                                            "farmingType",
                                            val,
                                          )
                                        }
                                      >
                                        <SelectTrigger className="h-11 bg-white">
                                          <SelectValue placeholder="เลือกประเภทการเลี้ยง" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="contract">
                                            {" "}
                                            เลี้ยงแบบมีสัญญา (Contract farming)
                                          </SelectItem>
                                          <SelectItem value="self">
                                            เลี้ยงเอง
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    {/* การถือครองที่ดินทำกิน, ทำเอง/จ้างทำ, กี่คน (For เลี้ยงเอง) */}
                                    {occ.farmingType === "self" && (
                                      <>
                                        {/* การถือครอง */}
                                        <div className="space-y-3">
                                          <Label>การถือครองที่ดินทำกิน</Label>
                                          <Select
                                            value={occ.landOwnership || ""}
                                            onValueChange={(val) =>
                                              handleOccupationChange(
                                                occ.id,
                                                "landOwnership",
                                                val,
                                              )
                                            }
                                          >
                                            <SelectTrigger className="h-11 bg-gray-50/30">
                                              <SelectValue placeholder="เลือกการถือครอง" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {LAND_OWNERSHIP_TYPES.map(
                                                (item) => (
                                                  <SelectItem
                                                    key={item.value}
                                                    value={item.value}
                                                  >
                                                    {item.label}
                                                  </SelectItem>
                                                ),
                                              )}
                                            </SelectContent>
                                          </Select>
                                        </div>

                                        {/* ทำเอง/จ้างทำ */}
                                        <div className="space-y-3">
                                          <Label>ทำเอง/จ้างทำ</Label>
                                          <RadioGroup
                                            value={occ.laborType || ""}
                                            onValueChange={(val) =>
                                              handleOccupationChange(
                                                occ.id,
                                                "laborType",
                                                val,
                                              )
                                            }
                                            className="flex items-center gap-6"
                                          >
                                            <div className="flex items-center gap-2">
                                              <RadioGroupItem
                                                value="self"
                                                id={`livestock-labor-self-${occ.id}`}
                                              />
                                              <Label
                                                htmlFor={`livestock-labor-self-${occ.id}`}
                                                className="cursor-pointer font-normal"
                                              >
                                                ทำเอง
                                              </Label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <RadioGroupItem
                                                value="hire"
                                                id={`livestock-labor-hire-${occ.id}`}
                                              />
                                              <Label
                                                htmlFor={`livestock-labor-hire-${occ.id}`}
                                                className="cursor-pointer font-normal"
                                              >
                                                จ้างทำ
                                              </Label>
                                            </div>
                                          </RadioGroup>
                                        </div>

                                        {/* ทำกี่คน (Display only if จ้างทำ is selected) */}
                                        {occ.laborType === "hire" && (
                                          <div className="space-y-2 animate-in fade-in slide-in-from-left-4 duration-300">
                                            <Label>ทำกี่คน</Label>
                                            <div className="relative">
                                              <Input
                                                type="text"
                                                value={occ.laborCount || ""}
                                                onChange={(e) =>
                                                  handleOccupationChange(
                                                    occ.id,
                                                    "laborCount",
                                                    e.target.value.replace(
                                                      /\D/g,
                                                      "",
                                                    ),
                                                  )
                                                }
                                                placeholder="กี่คน"
                                                className="h-11 bg-gray-50/30 pr-10"
                                              />
                                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                                                คน
                                              </span>
                                            </div>
                                          </div>
                                        )}
                                      </>
                                    )}

                                    <div className="space-y-2">
                                      <Label>
                                        จำนวนรอบการขายใน 1 ปี{" "}
                                        <span className="text-red-500">*</span>{" "}
                                        <span className="text-muted-foreground text-[10px] font-normal">
                                          (สูงสุด 12 รอบ)
                                        </span>
                                      </Label>
                                      <div className="relative">
                                        <Input
                                          type="text"
                                          value={
                                            occ.livestockCyclesPerYear || ""
                                          }
                                          onChange={(e) => {
                                            const val = e.target.value.replace(
                                              /\D/g,
                                              "",
                                            );
                                            const num =
                                              val === ""
                                                ? 0
                                                : Math.min(12, parseInt(val));
                                            handleOccupationChange(
                                              occ.id,
                                              "livestockCyclesPerYear",
                                              num > 0 ? String(num) : "",
                                            );

                                            // Sync rows
                                            const currentCycles =
                                              occ.livestockCycles || [];
                                            let newCycles = [...currentCycles];
                                            if (newCycles.length < num) {
                                              for (
                                                let i = newCycles.length;
                                                i < num;
                                                i++
                                              ) {
                                                newCycles.push({
                                                  cycleNo: i + 1,
                                                  quantity: "",
                                                  isHigherThanStandard: false,
                                                  customerPrice: "",
                                                  customerCost: "",
                                                  incomeBeforeExpenses: "",
                                                  incomeAfterExpenses: "",
                                                  otherExpenses: "",
                                                  netIncome: "0",
                                                });
                                              }
                                            } else if (newCycles.length > num) {
                                              newCycles = newCycles.slice(
                                                0,
                                                num,
                                              );
                                            }
                                            handleOccupationChange(
                                              occ.id,
                                              "livestockCycles",
                                              newCycles,
                                            );
                                          }}
                                          placeholder="ระบุจำนวนรอบ"
                                          className="h-11 bg-white pr-10"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                                          รอบ
                                        </span>
                                      </div>
                                    </div>

                                    {occ.farmingType === "self" && (
                                      <div className="space-y-2 animate-in fade-in slide-in-from-left-4 duration-300">
                                        <Label>
                                          หน่วยการขาย{" "}
                                          <span className="text-red-500">
                                            *
                                          </span>
                                        </Label>
                                        <Select
                                          value={occ.livestockUnit || ""}
                                          onValueChange={(val) =>
                                            handleOccupationChange(
                                              occ.id,
                                              "livestockUnit",
                                              val,
                                            )
                                          }
                                        >
                                          <SelectTrigger className="h-11 bg-white">
                                            <SelectValue placeholder="เลือกหน่วย" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="head">
                                              ขายเป็นตัว
                                            </SelectItem>
                                            <SelectItem value="cycle">
                                              ขายเป็นรอบ
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Livestock Cycles Tables (One per cycle) */}
                                {(occ.farmingType === "self" ||
                                  occ.farmingType === "contract") &&
                                  (occ.livestockCycles || []).length > 0 && (
                                    <div className="space-y-8 pt-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                      <div className="flex items-center justify-between">
                                        <h5 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                          <TrendingUp className="w-4 h-4 text-emerald-600" />{" "}
                                          ตารางรายละเอียดรายรอบ
                                        </h5>
                                        <p className="text-[10px] text-muted-foreground italic">
                                          (กรอกข้อมูลแยกตามรอบการเลี้ยง)
                                        </p>
                                      </div>

                                      <div className="grid grid-cols-1 gap-4">
                                        {(occ.livestockCycles || []).map(
                                          (cycle, idx) => {
                                            const std =
                                              LIVESTOCK_STANDARD_PRICES[
                                                occ.livestockType || "others"
                                              ] || { sales: 0, cost: 0 };

                                            const updateCycle = (
                                              updates: Partial<typeof cycle>,
                                            ) => {
                                              const updatedCycles = [
                                                ...(occ.livestockCycles || []),
                                              ];
                                              const newRow = {
                                                ...cycle,
                                                ...updates,
                                              };

                                              if (occ.farmingType === "self") {
                                                const isAquatic =
                                                  AQUATIC_TYPES.includes(
                                                    occ.livestockType || "",
                                                  );
                                                let finalPrice: number,
                                                  finalCost: number;

                                                if (isAquatic) {
                                                  finalPrice =
                                                    Number(
                                                      updates.customerPrice !==
                                                        undefined
                                                        ? updates.customerPrice
                                                        : cycle.customerPrice,
                                                    ) || 0;
                                                  finalCost =
                                                    Number(
                                                      updates.customerCost !==
                                                        undefined
                                                        ? updates.customerCost
                                                        : cycle.customerCost,
                                                    ) || 0;
                                                } else {
                                                  const finalIsHigher =
                                                    updates.isHigherThanStandard !==
                                                    undefined
                                                      ? updates.isHigherThanStandard
                                                      : cycle.isHigherThanStandard;
                                                  finalPrice = finalIsHigher
                                                    ? Number(
                                                        updates.customerPrice !==
                                                          undefined
                                                          ? updates.customerPrice
                                                          : cycle.customerPrice,
                                                      ) || std.sales
                                                    : std.sales;
                                                  finalCost = finalIsHigher
                                                    ? Number(
                                                        updates.customerCost !==
                                                          undefined
                                                          ? updates.customerCost
                                                          : cycle.customerCost,
                                                      ) || std.cost
                                                    : std.cost;
                                                }
                                                const finalQ =
                                                  Number(
                                                    updates.quantity !==
                                                      undefined
                                                      ? updates.quantity
                                                      : cycle.quantity,
                                                  ) || 0;
                                                newRow.netIncome = String(
                                                  (finalPrice - finalCost) *
                                                    finalQ,
                                                );
                                              } else {
                                                const finalAfter =
                                                  Number(
                                                    updates.incomeAfterExpenses !==
                                                      undefined
                                                      ? updates.incomeAfterExpenses
                                                      : cycle.incomeAfterExpenses,
                                                  ) || 0;
                                                const finalOther =
                                                  Number(
                                                    updates.otherExpenses !==
                                                      undefined
                                                      ? updates.otherExpenses
                                                      : cycle.otherExpenses,
                                                  ) || 0;
                                                newRow.netIncome = String(
                                                  finalAfter - finalOther,
                                                );
                                              }

                                              updatedCycles[idx] = newRow;
                                              handleOccupationChange(
                                                occ.id,
                                                "livestockCycles",
                                                updatedCycles,
                                              );
                                            };

                                            const q =
                                              Number(cycle.quantity) || 0;
                                            const effectivePrice =
                                              cycle.isHigherThanStandard
                                                ? Number(cycle.customerPrice) ||
                                                  std.sales
                                                : std.sales;
                                            const effectiveCost =
                                              cycle.isHigherThanStandard
                                                ? Number(cycle.customerCost) ||
                                                  std.cost
                                                : std.cost;
                                            const stdNet =
                                              (std.sales - std.cost) * q;
                                            const custNet =
                                              (effectivePrice - effectiveCost) *
                                              q;

                                            return (
                                              <div
                                                key={idx}
                                                className="bg-white border rounded-2xl overflow-hidden"
                                              >
                                                <div className="bg-gray-50/80 border-b border-border-subtle p-4 flex items-center justify-between">
                                                  <div className="flex items-center gap-3">
                                                    <div className="flex h-8 items-center justify-center rounded-lg bg-chaiyo-blue text-white font-bold text-sm shadow-sm px-3 gap-1">
                                                      รอบที่ {cycle.cycleNo}
                                                    </div>
                                                    {occ.farmingType !==
                                                      "contract" &&
                                                      occ.livestockUnit !==
                                                        "cycle" && (
                                                        <div className="flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-lg border border-border-subtle">
                                                          <Label className="text-[11px] font-bold text-gray-700">
                                                            จำนวนตัว
                                                          </Label>
                                                          <div className="relative w-28">
                                                            <Input
                                                              type="text"
                                                              value={formatNumberWithCommas(
                                                                cycle.quantity ||
                                                                  "",
                                                              )}
                                                              onChange={(e) =>
                                                                updateCycle({
                                                                  quantity:
                                                                    e.target.value.replace(
                                                                      /,/g,
                                                                      "",
                                                                    ),
                                                                })
                                                              }
                                                              className="h-8 text-right font-mono text-xs pr-7 bg-white"
                                                              placeholder="0"
                                                            />
                                                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold">
                                                              ตัว
                                                            </span>
                                                          </div>
                                                        </div>
                                                      )}
                                                  </div>
                                                  {occ.farmingType ===
                                                    "self" && (
                                                    <div className="flex items-center gap-2 px-3 py-1.5">
                                                      <Checkbox
                                                        id={`higher-${occ.id}-${idx}`}
                                                        checked={
                                                          cycle.isHigherThanStandard
                                                        }
                                                        onCheckedChange={(
                                                          checked,
                                                        ) =>
                                                          updateCycle({
                                                            isHigherThanStandard:
                                                              !!checked,
                                                          })
                                                        }
                                                        className="h-4 w-4 rounded-md border-gray-300 data-[state=checked]:bg-chaiyo-blue data-[state=checked]:border-chaiyo-blue"
                                                      />
                                                      <Label
                                                        htmlFor={`higher-${occ.id}-${idx}`}
                                                        className="text-[11px] leading-none text-gray-700 cursor-pointer font-bold select-none"
                                                      >
                                                        กรณีราคาขาย / ต้นทุน
                                                        ไม่เท่ากับราคากลาง
                                                      </Label>
                                                    </div>
                                                  )}
                                                </div>

                                                <div className="p-5 space-y-4">
                                                  {occ.farmingType ===
                                                  "self" ? (
                                                    <>
                                                      {AQUATIC_TYPES.includes(
                                                        occ.livestockType || "",
                                                      ) ? (
                                                        /* Aquatic types: user inputs sales, cost auto-prefilled with 15% margin */
                                                        <div className="rounded-xl border border-border-subtle overflow-hidden">
                                                          <Table>
                                                            <TableHeader className="bg-gray-50/50">
                                                              <TableRow className="hover:bg-transparent h-10">
                                                                <TableHead className="text-[10px] font-bold py-0 h-10 w-[50%]">
                                                                  รายการ
                                                                </TableHead>
                                                                <TableHead className="text-[10px] font-bold text-right py-0 h-10 w-[50%] pr-4">
                                                                  จำนวนเงิน
                                                                  (บาท)
                                                                </TableHead>
                                                              </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                              <TableRow className="hover:bg-transparent border-border-subtle">
                                                                <TableCell className="text-xs py-3 font-medium text-gray-700">{`ราคาขาย/${occ.livestockUnit === "cycle" ? "รอบ" : "ตัว"} (บาท)`}</TableCell>
                                                                <TableCell className="text-xs py-2 text-right pr-4">
                                                                  <Input
                                                                    type="text"
                                                                    value={formatNumberWithCommas(
                                                                      cycle.customerPrice ||
                                                                        "",
                                                                    )}
                                                                    onChange={(
                                                                      e,
                                                                    ) => {
                                                                      const cleaned =
                                                                        e.target.value.replace(
                                                                          /,/g,
                                                                          "",
                                                                        );
                                                                      if (
                                                                        /^\d*\.?\d*$/.test(
                                                                          cleaned,
                                                                        )
                                                                      ) {
                                                                        const salesVal =
                                                                          Number(
                                                                            cleaned,
                                                                          ) ||
                                                                          0;
                                                                        const autoCost =
                                                                          String(
                                                                            Math.round(
                                                                              salesVal *
                                                                                0.85 *
                                                                                100,
                                                                            ) /
                                                                              100,
                                                                          );
                                                                        updateCycle(
                                                                          {
                                                                            customerPrice:
                                                                              cleaned,
                                                                            customerCost:
                                                                              autoCost,
                                                                          },
                                                                        );
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
                                                                    {`ต้นทุน/${occ.livestockUnit === "cycle" ? "รอบ" : "ตัว"} (บาท)`}
                                                                    <span className="text-[9px] text-muted-foreground italic">
                                                                      (ราคาขาย ×
                                                                      85%)
                                                                    </span>
                                                                  </div>
                                                                </TableCell>
                                                                <TableCell className="text-xs py-2 text-right pr-4">
                                                                  <Input
                                                                    type="text"
                                                                    value={formatNumberWithCommas(
                                                                      cycle.customerCost ||
                                                                        "",
                                                                    )}
                                                                    onChange={(
                                                                      e,
                                                                    ) => {
                                                                      const cleaned =
                                                                        e.target.value.replace(
                                                                          /,/g,
                                                                          "",
                                                                        );
                                                                      if (
                                                                        /^\d*\.?\d*$/.test(
                                                                          cleaned,
                                                                        )
                                                                      ) {
                                                                        updateCycle(
                                                                          {
                                                                            customerCost:
                                                                              cleaned,
                                                                          },
                                                                        );
                                                                      }
                                                                    }}
                                                                    className="h-8 w-32 text-right ml-auto text-xs font-mono border-gray-200"
                                                                    placeholder="0.00"
                                                                  />
                                                                </TableCell>
                                                              </TableRow>
                                                              <TableRow className="bg-blue-50/30 hover:bg-blue-50/50 transition-colors">
                                                                <TableCell className="text-xs py-4 font-bold text-chaiyo-blue">
                                                                  รายได้สุทธิ
                                                                </TableCell>
                                                                <TableCell className="text-sm py-4 text-right pr-4 font-black font-mono text-chaiyo-blue">
                                                                  {formatNumberWithCommas(
                                                                    ((Number(
                                                                      cycle.customerPrice,
                                                                    ) || 0) -
                                                                      (Number(
                                                                        cycle.customerCost,
                                                                      ) || 0)) *
                                                                      (Number(
                                                                        cycle.quantity,
                                                                      ) || 0),
                                                                  )}
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
                                                                <TableHead className="text-[10px] font-bold py-0 h-10 w-[35%]">
                                                                  รายการ
                                                                </TableHead>
                                                                <TableHead className="text-[10px] font-bold text-right py-0 h-10 w-[30%] text-gray-500">
                                                                  ราคากลาง
                                                                </TableHead>
                                                                {cycle.isHigherThanStandard && (
                                                                  <TableHead className="text-[10px] font-bold text-right py-0 h-10 w-[35%] text-chaiyo-blue pr-4 bg-blue-50/50">
                                                                    ราคาลูกค้า
                                                                  </TableHead>
                                                                )}
                                                              </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                              <TableRow className="hover:bg-transparent border-border-subtle">
                                                                <TableCell className="text-xs py-3 font-medium text-gray-700">{`ราคาขาย/${occ.livestockUnit === "cycle" ? "รอบ" : "ตัว"} (บาท)`}</TableCell>
                                                                <TableCell className="text-xs py-3 text-right font-mono text-gray-400">
                                                                  {formatNumberWithCommas(
                                                                    std.sales,
                                                                  )}
                                                                </TableCell>
                                                                {cycle.isHigherThanStandard && (
                                                                  <TableCell className="text-xs py-2 text-right pr-4 bg-blue-50/10">
                                                                    <Input
                                                                      type="text"
                                                                      value={formatNumberWithCommas(
                                                                        cycle.customerPrice ||
                                                                          "",
                                                                      )}
                                                                      onChange={(
                                                                        e,
                                                                      ) =>
                                                                        updateCycle(
                                                                          {
                                                                            customerPrice:
                                                                              e.target.value.replace(
                                                                                /,/g,
                                                                                "",
                                                                              ),
                                                                          },
                                                                        )
                                                                      }
                                                                      className="h-8 w-full text-right text-xs font-mono border-chaiyo-blue/20"
                                                                      placeholder="0.00"
                                                                    />
                                                                  </TableCell>
                                                                )}
                                                              </TableRow>
                                                              <TableRow className="hover:bg-transparent border-border-subtle">
                                                                <TableCell className="text-xs py-3 font-medium text-gray-700">{`ราคาต้นทุน/${occ.livestockUnit === "cycle" ? "รอบ" : "ตัว"} (บาท)`}</TableCell>
                                                                <TableCell className="text-xs py-3 text-right font-mono text-gray-400">
                                                                  {formatNumberWithCommas(
                                                                    std.cost,
                                                                  )}
                                                                </TableCell>
                                                                {cycle.isHigherThanStandard && (
                                                                  <TableCell className="text-xs py-2 text-right pr-4 bg-blue-50/10">
                                                                    <Input
                                                                      type="text"
                                                                      value={formatNumberWithCommas(
                                                                        cycle.customerCost ||
                                                                          "",
                                                                      )}
                                                                      onChange={(
                                                                        e,
                                                                      ) =>
                                                                        updateCycle(
                                                                          {
                                                                            customerCost:
                                                                              e.target.value.replace(
                                                                                /,/g,
                                                                                "",
                                                                              ),
                                                                          },
                                                                        )
                                                                      }
                                                                      className="h-8 w-full text-right text-xs font-mono border-chaiyo-blue/20"
                                                                      placeholder="0.00"
                                                                    />
                                                                  </TableCell>
                                                                )}
                                                              </TableRow>
                                                              <TableRow className="bg-blue-50/30 hover:bg-blue-50/50 transition-colors">
                                                                <TableCell className="text-xs py-4 font-bold text-chaiyo-blue">
                                                                  รายได้สุทธิ
                                                                </TableCell>
                                                                <TableCell className="text-xs py-4 text-right font-mono text-chaiyo-blue/60 font-medium">
                                                                  {formatNumberWithCommas(
                                                                    stdNet.toFixed(
                                                                      2,
                                                                    ),
                                                                  )}
                                                                </TableCell>
                                                                {cycle.isHigherThanStandard && (
                                                                  <TableCell className="text-sm py-4 text-right pr-4 font-black font-mono text-chaiyo-blue bg-blue-100/20">
                                                                    {formatNumberWithCommas(
                                                                      custNet.toFixed(
                                                                        2,
                                                                      ),
                                                                    )}
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
                                                            <TableHead className="text-[10px] font-bold py-0 h-10">
                                                              รายการ
                                                            </TableHead>
                                                            <TableHead className="text-[10px] font-bold text-right py-0 h-10 pr-4">
                                                              จำนวนเงิน (บาท)
                                                            </TableHead>
                                                          </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                          <TableRow className="hover:bg-transparent border-border-subtle">
                                                            <TableCell className="text-xs py-3 font-medium text-gray-700">
                                                              รายได้ก่อนหักค่าใช้จ่าย
                                                            </TableCell>
                                                            <TableCell className="text-xs py-2 text-right pr-4">
                                                              <Input
                                                                type="text"
                                                                value={formatNumberWithCommas(
                                                                  cycle.incomeBeforeExpenses ||
                                                                    "",
                                                                )}
                                                                onChange={(e) =>
                                                                  updateCycle({
                                                                    incomeBeforeExpenses:
                                                                      e.target.value.replace(
                                                                        /,/g,
                                                                        "",
                                                                      ),
                                                                  })
                                                                }
                                                                className="h-8 w-32 text-right ml-auto text-xs font-mono border-gray-200"
                                                                placeholder="0.00"
                                                              />
                                                            </TableCell>
                                                          </TableRow>
                                                          <TableRow className="hover:bg-transparent border-border-subtle">
                                                            <TableCell className="text-xs py-3 font-medium text-gray-700">
                                                              รายได้หลังหักค่าใช้จ่าย
                                                            </TableCell>
                                                            <TableCell className="text-xs py-2 text-right pr-4">
                                                              <Input
                                                                type="text"
                                                                value={formatNumberWithCommas(
                                                                  cycle.incomeAfterExpenses ||
                                                                    "",
                                                                )}
                                                                onChange={(e) =>
                                                                  updateCycle({
                                                                    incomeAfterExpenses:
                                                                      e.target.value.replace(
                                                                        /,/g,
                                                                        "",
                                                                      ),
                                                                  })
                                                                }
                                                                className="h-8 w-32 text-right ml-auto text-xs font-mono border-gray-200"
                                                                placeholder="0.00"
                                                              />
                                                            </TableCell>
                                                          </TableRow>
                                                          <TableRow className="hover:bg-transparent border-border-subtle">
                                                            <TableCell className="text-xs py-3 font-medium text-gray-700">
                                                              ค่าใช้จ่ายอื่นๆ
                                                            </TableCell>
                                                            <TableCell className="text-xs py-2 text-right pr-4">
                                                              <Input
                                                                type="text"
                                                                value={formatNumberWithCommas(
                                                                  cycle.otherExpenses ||
                                                                    "",
                                                                )}
                                                                onChange={(e) =>
                                                                  updateCycle({
                                                                    otherExpenses:
                                                                      e.target.value.replace(
                                                                        /,/g,
                                                                        "",
                                                                      ),
                                                                  })
                                                                }
                                                                className="h-8 w-32 text-right ml-auto text-xs font-mono border-gray-200"
                                                                placeholder="0.00"
                                                              />
                                                            </TableCell>
                                                          </TableRow>
                                                          <TableRow className="bg-blue-50/30 hover:bg-blue-50/50 transition-colors">
                                                            <TableCell className="text-xs py-4 font-bold text-chaiyo-blue">
                                                              รายได้สุทธิต่อรอบ
                                                            </TableCell>
                                                            <TableCell className="text-sm py-4 text-right pr-4 font-black font-mono text-chaiyo-blue">
                                                              {formatNumberWithCommas(
                                                                cycle.netIncome ||
                                                                  "0.00",
                                                              )}
                                                            </TableCell>
                                                          </TableRow>
                                                        </TableBody>
                                                      </Table>
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            );
                                          },
                                        )}
                                      </div>

                                      {/* Monthly Income Summary Block */}
                                      <div className="pb-8 mt-4 border-b border-border-subtle/50">
                                        <div className="pt-2">
                                          <div className="flex items-center justify-between bg-chaiyo-blue/5 text-chaiyo-blue px-6 py-4 rounded-xl border border-chaiyo-blue/20 shadow-sm">
                                            <span className="text-sm font-bold">
                                              รายได้ต่อเดือนปศุสัตว์:
                                            </span>
                                            <span className="text-xl font-bold font-mono tracking-tight">
                                              {formatNumberWithCommas(
                                                (
                                                  (
                                                    occ.livestockCycles || []
                                                  ).reduce(
                                                    (acc, c) =>
                                                      acc +
                                                      (Number(c.netIncome) ||
                                                        0),
                                                    0,
                                                  ) / 12
                                                ).toFixed(2),
                                              )}
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
                                          const LIVESTOCK_STAGES = [
                                            "เพาะเลี้ยง",
                                            "ขาย",
                                          ];
                                          const reset = LIVESTOCK_STAGES.map(
                                            (stage) => ({
                                              stage,
                                              selectedMonths: [],
                                            }),
                                          );
                                          handleOccupationChange(
                                            occ.id,
                                            "livestockSchedule",
                                            reset,
                                          );
                                        }}
                                        className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-red-500 transition-colors ml-1"
                                      >
                                        <RotateCcw className="w-3 h-3" />
                                        <span>รีเซ็ต</span>
                                      </Button>
                                    </div>
                                  </div>

                                  <div className="border border-border-strong rounded-xl overflow-x-auto bg-white">
                                    <Table className="min-w-full lg:min-w-[1000px] border-collapse">
                                      <TableHeader className="bg-gray-50/80">
                                        <TableRow className="hover:bg-transparent border-b border-border-strong">
                                          <TableHead className="w-[180px] min-w-[180px] text-xs font-bold text-gray-800 border-r border-border-subtle bg-gray-50 sticky left-0 z-10">
                                            กิจกรรม/ช่วงการเลี้ยง
                                          </TableHead>
                                          {THAI_MONTHS_SHORT.map((m) => (
                                            <TableHead
                                              key={m}
                                              className="text-center p-0 text-[10px] font-bold text-gray-600 border-r border-border-subtle last:border-r-0 min-w-[55px] h-10"
                                            >
                                              {m}
                                            </TableHead>
                                          ))}
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {(() => {
                                          const LIVESTOCK_STAGES = [
                                            "เพาะเลี้ยง",
                                            "ขาย",
                                          ];
                                          const livestockScheduleRows =
                                            occ.livestockSchedule &&
                                            occ.livestockSchedule.length ===
                                              LIVESTOCK_STAGES.length
                                              ? occ.livestockSchedule
                                              : LIVESTOCK_STAGES.map(
                                                  (stage) => ({
                                                    stage,
                                                    selectedMonths: [],
                                                  }),
                                                );

                                          return livestockScheduleRows.map(
                                            (item: any, rowIdx: number) => {
                                              const handleMonthClick = (
                                                monthStr: string,
                                              ) => {
                                                const updated = [
                                                  ...livestockScheduleRows,
                                                ];
                                                const row = {
                                                  ...updated[rowIdx],
                                                };
                                                let currentSelected =
                                                  Array.isArray(
                                                    row.selectedMonths,
                                                  )
                                                    ? [...row.selectedMonths]
                                                    : [];
                                                if (
                                                  currentSelected.includes(
                                                    monthStr,
                                                  )
                                                ) {
                                                  currentSelected =
                                                    currentSelected.filter(
                                                      (m: string) =>
                                                        m !== monthStr,
                                                    );
                                                } else {
                                                  currentSelected.push(
                                                    monthStr,
                                                  );
                                                }
                                                row.selectedMonths =
                                                  currentSelected;
                                                updated[rowIdx] = row;
                                                handleOccupationChange(
                                                  occ.id,
                                                  "livestockSchedule",
                                                  updated,
                                                );
                                              };

                                              return (
                                                <TableRow
                                                  key={rowIdx}
                                                  className="hover:bg-gray-50/20 group transition-colors border-b border-border-subtle last:border-b-0"
                                                >
                                                  <TableCell className="py-4 px-4 font-semibold text-xs text-gray-700 bg-white border-r border-border-subtle sticky left-0 z-10">
                                                    {item.stage}
                                                  </TableCell>
                                                  {THAI_MONTHS_SHORT.map(
                                                    (m, monthIdx) => {
                                                      const isSelected =
                                                        Array.isArray(
                                                          item.selectedMonths,
                                                        ) &&
                                                        item.selectedMonths.includes(
                                                          m,
                                                        );
                                                      return (
                                                        <TableCell
                                                          key={monthIdx}
                                                          className="p-0 text-center border-r border-border-subtle last:border-r-0 h-[52px]"
                                                        >
                                                          <button
                                                            type="button"
                                                            onClick={() =>
                                                              handleMonthClick(
                                                                m,
                                                              )
                                                            }
                                                            className={cn(
                                                              "w-full h-full flex flex-col items-center justify-center transition-all duration-150 relative group/btn",
                                                              isSelected
                                                                ? "bg-chaiyo-blue text-white"
                                                                : "hover:bg-chaiyo-blue/5 text-gray-400",
                                                            )}
                                                          >
                                                            <span
                                                              className={cn(
                                                                "text-[10px] font-bold transition-transform",
                                                                isSelected
                                                                  ? "scale-110"
                                                                  : "scale-100 opacity-30 group-hover/btn:opacity-100",
                                                              )}
                                                            >
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
                                                    },
                                                  )}
                                                </TableRow>
                                              );
                                            },
                                          );
                                        })()}
                                      </TableBody>
                                    </Table>
                                  </div>
                                  <p className="text-[10px] text-muted-foreground italic px-1">
                                    *
                                    แตะที่แต่ละเดือนเพื่อเลือกหรือยกเลิกการเลือกช่วงเวลา
                                    (เลือกได้หลายเดือนแบบอิสระ)
                                  </p>
                                </div>
                              </div>
                            )}
                        </>
                      )}
                    {/* ===== บุคคลอ้างอิง (only show on the main occupation tab, and not for unemployed) ===== */}
                    {occ.isMain &&
                      !!occ.occupationCode &&
                      occ.occupationCode !== "UNEMPLOYED" &&
                      occ.employmentType && (
                        <div className="rounded-xl border border-border-color bg-gray-50/40 p-6 space-y-4">
                          <h4 className="text-base font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-border-color">
                            <Users className="w-5 h-5 text-chaiyo-blue" />{" "}
                            บุคคลอ้างอิง
                          </h4>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Label className="text-sm font-bold text-gray-700">
                                  รายชื่อบุคคลอ้างอิง
                                </Label>
                                {requiredReferenceCount >= 2 ? (
                                  <span className="text-red-500 text-xs font-normal">
                                    (จำเป็น อย่างน้อย 2 คน) *
                                  </span>
                                ) : requiredReferenceCount === 1 ? (
                                  <span className="text-red-500 text-xs font-normal">
                                    (จำเป็น อย่างน้อย 1 คน) *
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground text-xs font-normal">
                                    (ถ้ามี)
                                  </span>
                                )}
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleAddReference}
                                className="h-8 text-xs font-medium"
                              >
                                <Plus className="w-3 h-3 mr-1" />{" "}
                                เพิ่มบุคคลอ้างอิง
                              </Button>
                            </div>
                            <div className="border border-border-strong rounded-xl overflow-hidden bg-white">
                              <Table>
                                <TableHeader className="bg-gray-50/50">
                                  <TableRow className="hover:bg-transparent border-none">
                                    <TableHead className="w-[8%] text-center text-xs">
                                      ลำดับ
                                    </TableHead>
                                    <TableHead className="w-[27%] text-xs">
                                      ชื่อ-นามสกุล{" "}
                                      <span className="text-red-500">*</span>
                                    </TableHead>
                                    <TableHead className="w-[25%] text-xs">
                                      เบอร์ติดต่อ{" "}
                                      <span className="text-red-500">*</span>
                                    </TableHead>
                                    <TableHead className="w-[30%] text-xs">
                                      ความเกี่ยวข้อง{" "}
                                      <span className="text-red-500">*</span>
                                    </TableHead>
                                    <TableHead className="w-[10%] text-xs text-center">
                                      จัดการ
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {!formData.referencePersons ||
                                  formData.referencePersons.length === 0 ? (
                                    <TableRow className="hover:bg-transparent border-none">
                                      <TableCell
                                        colSpan={5}
                                        className="h-24 text-center text-muted-foreground italic text-xs"
                                      >
                                        ยังไม่มีข้อมูลบุคคลอ้างอิง —
                                        กรุณากดปุ่มเพิ่มเพื่อระบุข้อมูล
                                      </TableCell>
                                    </TableRow>
                                  ) : (
                                    formData.referencePersons.map(
                                      (ref: ReferencePerson, index: number) => (
                                        <TableRow
                                          key={index}
                                          className="group transition-colors hover:bg-gray-50/50"
                                        >
                                          <TableCell className="py-3 text-center text-xs font-medium text-gray-500">
                                            {index + 1}
                                          </TableCell>
                                          <TableCell className="py-2">
                                            <Input
                                              value={ref.name || ""}
                                              onChange={(e) =>
                                                handleUpdateReference(
                                                  index,
                                                  "name",
                                                  e.target.value,
                                                )
                                              }
                                              placeholder="ระบุชื่อ-นามสกุล"
                                              className="h-9 text-sm bg-gray-50/30 border-gray-200 focus:ring-chaiyo-blue/20"
                                            />
                                          </TableCell>
                                          <TableCell className="py-2">
                                            <Input
                                              value={ref.phone || ""}
                                              onChange={(e) =>
                                                handleUpdateReference(
                                                  index,
                                                  "phone",
                                                  e.target.value,
                                                )
                                              }
                                              placeholder="ระบุเบอร์ติดต่อ"
                                              className="h-9 text-sm bg-gray-50/30 border-gray-200 focus:ring-chaiyo-blue/20"
                                              maxLength={20}
                                            />
                                          </TableCell>
                                          <TableCell className="py-2">
                                            <div className="space-y-1.5 transition-all duration-200">
                                              <Select
                                                value={ref.relationship || ""}
                                                onValueChange={(val) =>
                                                  handleUpdateReference(
                                                    index,
                                                    "relationship",
                                                    val,
                                                  )
                                                }
                                              >
                                                <SelectTrigger className="h-9 text-sm bg-gray-50/30 border-gray-200 focus:ring-chaiyo-blue/20">
                                                  <SelectValue placeholder="เลือกความเกี่ยวข้อง" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  {REFERENCE_RELATIONSHIPS.map(
                                                    (rel) => (
                                                      <SelectItem
                                                        key={rel.value}
                                                        value={rel.value}
                                                        className="text-sm cursor-pointer"
                                                      >
                                                        {rel.label}
                                                      </SelectItem>
                                                    ),
                                                  )}
                                                </SelectContent>
                                              </Select>
                                              {ref.relationship === "other" && (
                                                <div className="relative animate-in fade-in slide-in-from-top-1 duration-200">
                                                  <Input
                                                    value={
                                                      ref.customRelationship ||
                                                      ""
                                                    }
                                                    onChange={(e) =>
                                                      handleUpdateReference(
                                                        index,
                                                        "customRelationship",
                                                        e.target.value,
                                                      )
                                                    }
                                                    placeholder="โปรดระบุรายละเอียด"
                                                    className="h-8 text-xs bg-white border-dashed border-gray-300 focus:border-chaiyo-blue"
                                                  />
                                                </div>
                                              )}
                                            </div>
                                          </TableCell>
                                          <TableCell className="py-2 text-center text-gray-500">
                                            {index >= requiredReferenceCount ? (
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 rounded-full"
                                                onClick={() =>
                                                  setItemToDelete({
                                                    index,
                                                    name:
                                                      ref.name ||
                                                      `บุคคลที่ ${index + 1}`,
                                                    type: "reference",
                                                  })
                                                }
                                              >
                                                <Trash2 className="w-4 h-4" />
                                              </Button>
                                            ) : null}
                                          </TableCell>
                                        </TableRow>
                                      ),
                                    )
                                  )}
                                </TableBody>
                              </Table>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2 pl-1">
                              บุคคลอ้างอิงห้ามเป็นกู้/ผู้ค้า/คนในครอบครัว/คนใกล้ชิด/ลูกจ้าง
                            </p>
                          </div>
                        </div>
                      )}

                    {/* ===== บุคคลอ้างอิง for secondary occupations ===== */}
                    {!occ.isMain &&
                      !!occ.occupationCode &&
                      occ.occupationCode !== "UNEMPLOYED" &&
                      occ.employmentType && (
                        <div className="rounded-xl border border-border-color bg-gray-50/40 p-6 space-y-4">
                          <h4 className="text-base font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-border-color">
                            <Users className="w-5 h-5 text-chaiyo-blue" />{" "}
                            บุคคลอ้างอิง
                          </h4>
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <Label className="text-sm">
                                ใช้บุคคลอ้างอิงเดียวกับ
                              </Label>
                              <Select
                                value={occ.referenceSource || "_none"}
                                onValueChange={(val) => {
                                  handleOccupationChange(
                                    occ.id,
                                    "referenceSource",
                                    val === "_none" ? "" : val,
                                  );
                                }}
                              >
                                <SelectTrigger className="h-12 bg-white">
                                  <SelectValue placeholder="เลือกแหล่งอ้างอิง" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="_none">ระบุเอง</SelectItem>
                                  {occupations
                                    .filter(
                                      (o: IncomeOccupation) => o.id !== occ.id,
                                    )
                                    .map((o: IncomeOccupation) => {
                                      const label = o.isMain
                                        ? "อาชีพหลัก"
                                        : `อาชีพเสริม ${occupations.filter((x: IncomeOccupation) => !x.isMain).findIndex((x: IncomeOccupation) => x.id === o.id) + 1}`;
                                      const occName = o.occupationCode
                                        ? OCCUPATIONS.find(
                                            (oc) =>
                                              (oc.value || oc.label) ===
                                              o.occupationCode,
                                          )?.label
                                        : undefined;
                                      return (
                                        <SelectItem key={o.id} value={o.id}>
                                          {label}
                                          {occName ? ` (${occName})` : ""}
                                        </SelectItem>
                                      );
                                    })}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Conditional Rendering: Editable vs Read-only */}
                            {(!occ.referenceSource || occ.referenceSource === "_none") ? (
                              <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="flex items-center justify-between mt-2 mb-2">
                                  <div className="flex items-center gap-2">
                                    <Label className="text-sm font-bold text-gray-700">
                                      รายชื่อบุคคลอ้างอิง (ระบุเอง)
                                    </Label>
                                    {requiredReferenceCount >= 2 ? (
                                      <span className="text-red-500 text-xs font-normal">
                                        (จำเป็น อย่างน้อย 2 คน) *
                                      </span>
                                    ) : requiredReferenceCount === 1 ? (
                                      <span className="text-red-500 text-xs font-normal">
                                        (จำเป็น อย่างน้อย 1 คน) *
                                      </span>
                                    ) : (
                                      <span className="text-muted-foreground text-xs font-normal">
                                        (ถ้ามี)
                                      </span>
                                    )}
                                  </div>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const currentRefs =
                                        occ.referencePersons || [];
                                      handleOccupationChange(
                                        occ.id,
                                        "referencePersons",
                                        [
                                          ...currentRefs,
                                          {
                                            name: "",
                                            phone: "",
                                            relationship: "",
                                            customRelationship: "",
                                          },
                                        ],
                                      );
                                    }}
                                    className="h-8 text-xs font-medium"
                                  >
                                    <Plus className="w-3 h-3 mr-1" />{" "}
                                    เพิ่มบุคคลอ้างอิง
                                  </Button>
                                </div>
                                <div className="border border-border-strong rounded-xl overflow-hidden bg-white">
                                  <Table>
                                    <TableHeader className="bg-gray-50/50">
                                      <TableRow className="hover:bg-transparent border-none">
                                        <TableHead className="w-[8%] text-center text-xs">
                                          ลำดับ
                                        </TableHead>
                                        <TableHead className="w-[27%] text-xs">
                                          ชื่อ-นามสกุล{" "}
                                          <span className="text-red-500">
                                            *
                                          </span>
                                        </TableHead>
                                        <TableHead className="w-[25%] text-xs">
                                          เบอร์ติดต่อ{" "}
                                          <span className="text-red-500">
                                            *
                                          </span>
                                        </TableHead>
                                        <TableHead className="w-[30%] text-xs">
                                          ความเกี่ยวข้อง{" "}
                                          <span className="text-red-500">
                                            *
                                          </span>
                                        </TableHead>
                                        <TableHead className="w-[10%] text-xs text-center">
                                          จัดการ
                                        </TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {!occ.referencePersons ||
                                      occ.referencePersons.length === 0 ? (
                                        <TableRow className="hover:bg-transparent border-none">
                                          <TableCell
                                            colSpan={5}
                                            className="h-24 text-center text-muted-foreground italic text-xs"
                                          >
                                            ยังไม่มีข้อมูลบุคคลอ้างอิง —
                                            กรุณากดปุ่มเพิ่มเพื่อระบุข้อมูล
                                          </TableCell>
                                        </TableRow>
                                      ) : (
                                        occ.referencePersons.map(
                                          (
                                            ref: ReferencePerson,
                                            index: number,
                                          ) => {
                                            const updateRef = (
                                              field: string,
                                              value: string,
                                            ) => {
                                              const currentRefs = [
                                                ...(occ.referencePersons || []),
                                              ];

                                              let finalValue = value;
                                              if (field === "phone") {
                                                const numbers = value.replace(
                                                  /\D/g,
                                                  "",
                                                );
                                                const digits = numbers.slice(
                                                  0,
                                                  10,
                                                );
                                                if (digits.length > 0) {
                                                  finalValue = digits.slice(
                                                    0,
                                                    3,
                                                  );
                                                  if (digits.length > 3) {
                                                    finalValue +=
                                                      "-" + digits.slice(3, 6);
                                                    if (digits.length > 6) {
                                                      finalValue +=
                                                        "-" +
                                                        digits.slice(6, 10);
                                                    }
                                                  }
                                                }
                                              }

                                              currentRefs[index] = {
                                                ...currentRefs[index],
                                                [field]: finalValue,
                                              };
                                              handleOccupationChange(
                                                occ.id,
                                                "referencePersons",
                                                currentRefs,
                                              );
                                            };

                                            return (
                                              <TableRow
                                                key={index}
                                                className="group transition-colors hover:bg-gray-50/50"
                                              >
                                                <TableCell className="py-3 text-center text-xs font-medium text-gray-500">
                                                  {index + 1}
                                                </TableCell>
                                                <TableCell className="py-2">
                                                  <Input
                                                    value={ref.name || ""}
                                                    onChange={(e) =>
                                                      updateRef(
                                                        "name",
                                                        e.target.value,
                                                      )
                                                    }
                                                    placeholder="ระบุชื่อ-นามสกุล"
                                                    className="h-9 text-sm bg-gray-50/30 border-gray-200 focus:ring-chaiyo-blue/20"
                                                  />
                                                </TableCell>
                                                <TableCell className="py-2">
                                                  <Input
                                                    value={ref.phone || ""}
                                                    onChange={(e) =>
                                                      updateRef(
                                                        "phone",
                                                        e.target.value,
                                                      )
                                                    }
                                                    placeholder="ระบุเบอร์ติดต่อ"
                                                    className="h-9 text-sm bg-gray-50/30 border-gray-200 focus:ring-chaiyo-blue/20"
                                                    maxLength={20}
                                                  />
                                                </TableCell>
                                                <TableCell className="py-2">
                                                  <div className="space-y-1.5 transition-all duration-200">
                                                    <Select
                                                      value={
                                                        ref.relationship || ""
                                                      }
                                                      onValueChange={(val) =>
                                                        updateRef(
                                                          "relationship",
                                                          val,
                                                        )
                                                      }
                                                    >
                                                      <SelectTrigger className="h-9 text-sm bg-gray-50/30 border-gray-200 focus:ring-chaiyo-blue/20">
                                                        <SelectValue placeholder="เลือกความเกี่ยวข้อง" />
                                                      </SelectTrigger>
                                                      <SelectContent>
                                                        {REFERENCE_RELATIONSHIPS.map(
                                                          (rel) => (
                                                            <SelectItem
                                                              key={rel.value}
                                                              value={rel.value}
                                                              className="text-sm cursor-pointer"
                                                            >
                                                              {rel.label}
                                                            </SelectItem>
                                                          ),
                                                        )}
                                                      </SelectContent>
                                                    </Select>
                                                    {ref.relationship ===
                                                      "other" && (
                                                      <div className="relative animate-in fade-in slide-in-from-top-1 duration-200">
                                                        <Input
                                                          value={
                                                            ref.customRelationship ||
                                                            ""
                                                          }
                                                          onChange={(e) =>
                                                            updateRef(
                                                              "customRelationship",
                                                              e.target.value,
                                                            )
                                                          }
                                                          placeholder="โปรดระบุรายละเอียด"
                                                          className="h-8 text-xs bg-white border-dashed border-gray-300 focus:border-chaiyo-blue"
                                                        />
                                                      </div>
                                                    )}
                                                  </div>
                                                </TableCell>
                                                <TableCell className="py-2 text-center">
                                                  <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                      const currentRefs = [
                                                        ...(occ.referencePersons ||
                                                          []),
                                                      ];
                                                      currentRefs.splice(
                                                        index,
                                                        1,
                                                      );
                                                      handleOccupationChange(
                                                        occ.id,
                                                        "referencePersons",
                                                        currentRefs,
                                                      );
                                                    }}
                                                    className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                  >
                                                    <Trash2 className="w-4 h-4" />
                                                  </Button>
                                                </TableCell>
                                              </TableRow>
                                            );
                                          },
                                        )
                                      )}
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>
                            ) : (
                              occ.referenceSource &&
                              (() => {
                                const sourceRefs =
                                  occ.referenceSource === "main" ||
                                  occupations.find(
                                    (o: IncomeOccupation) =>
                                      o.id === occ.referenceSource,
                                  )?.isMain
                                    ? formData.referencePersons || []
                                    : occupations.find(
                                        (o: IncomeOccupation) =>
                                          o.id === occ.referenceSource,
                                      )?.referencePersons || [];

                                const sourceOcc = occupations.find(
                                  (o: IncomeOccupation) =>
                                    o.id === occ.referenceSource,
                                );
                                const sourceLabel = sourceOcc?.isMain
                                  ? "อาชีพหลัก"
                                  : `อาชีพเสริม ${occupations.filter((x: IncomeOccupation) => !x.isMain).findIndex((x: IncomeOccupation) => x.id === sourceOcc?.id) + 1}`;

                                return (
                                  <div className="space-y-3">
                                    <div className="border border-border-strong rounded-xl overflow-hidden bg-white">
                                      <Table>
                                        <TableHeader className="bg-gray-50/50">
                                          <TableRow className="hover:bg-transparent border-none">
                                            <TableHead className="w-[8%] text-center text-xs">
                                              ลำดับ
                                            </TableHead>
                                            <TableHead className="w-[30%] text-xs">
                                              ชื่อ-นามสกุล
                                            </TableHead>
                                            <TableHead className="w-[30%] text-xs">
                                              เบอร์ติดต่อ
                                            </TableHead>
                                            <TableHead className="w-[32%] text-xs">
                                              ความเกี่ยวข้อง
                                            </TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {sourceRefs.length === 0 ? (
                                            <TableRow className="hover:bg-transparent border-none">
                                              <TableCell
                                                colSpan={4}
                                                className="h-20 text-center text-muted-foreground italic text-xs"
                                              >
                                                ยังไม่มีข้อมูลบุคคลอ้างอิงจาก{" "}
                                                {sourceLabel}
                                              </TableCell>
                                            </TableRow>
                                          ) : (
                                            sourceRefs.map(
                                              (
                                                ref: ReferencePerson,
                                                index: number,
                                              ) => {
                                                const relLabel =
                                                  ref.relationship === "other"
                                                    ? ref.customRelationship ||
                                                      "อื่นๆ"
                                                    : REFERENCE_RELATIONSHIPS.find(
                                                        (r) =>
                                                          r.value ===
                                                          ref.relationship,
                                                      )?.label ||
                                                      ref.relationship ||
                                                      "—";
                                                return (
                                                  <TableRow
                                                    key={index}
                                                    className="group transition-colors hover:bg-gray-50/50"
                                                  >
                                                    <TableCell className="py-3 text-center text-xs font-medium text-gray-500">
                                                      {index + 1}
                                                    </TableCell>
                                                    <TableCell className="py-3 text-sm text-gray-700">
                                                      {ref.name || "—"}
                                                    </TableCell>
                                                    <TableCell className="py-3 text-sm text-gray-700 font-mono">
                                                      {ref.phone || "—"}
                                                    </TableCell>
                                                    <TableCell className="py-3 text-sm text-gray-700">
                                                      {relLabel}
                                                    </TableCell>
                                                  </TableRow>
                                                );
                                              },
                                            )
                                          )}
                                        </TableBody>
                                      </Table>
                                    </div>
                                    <p className="text-xs text-muted-foreground italic pl-1">
                                      ข้อมูลบุคคลอ้างอิงถูกอ้างอิงจากอาชีพอื่น –
                                      แก้ไขได้ที่แท็บต้นทาง
                                    </p>
                                  </div>
                                );
                              })()
                            )}
                          </div>
                        </div>
                      )}

                    {/* อัพโหลดรูปประกอบกิจการ — hide for unemployed and closed business */}
                    {!!occ.occupationCode && occ.occupationCode !== "UNEMPLOYED" &&
                      occ.businessStatus !== "closed" &&
                      occ.employmentType && (
                        <div className="rounded-xl border border-border-color bg-gray-50/40 p-6 space-y-4">
                          <h4 className="text-base font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-border-color">
                            <ImagePlus className="w-5 h-5 text-chaiyo-blue" />{" "}
                            อัพโหลดรูปประกอบกิจการ
                          </h4>

                          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                            {/* Mandatory Documents Table */}
                            <div className="space-y-3">
                              <div className="flex items-center justify-between mb-2">
                                <Label className="text-sm font-bold text-gray-700">
                                  เอกสารบังคับ
                                </Label>
                              </div>
                              <div className="border border-border-strong rounded-xl overflow-hidden bg-white">
                                <Table>
                                  <TableHeader className="bg-gray-50/50">
                                    <TableRow className="hover:bg-transparent">
                                      <TableHead className="w-[45%] text-xs">
                                        ประเภทเอกสาร/รูปภาพ{" "}
                                        <span className="text-red-500 text-sm">
                                          *
                                        </span>
                                      </TableHead>
                                      <TableHead className="w-[40%] text-xs">
                                        ไฟล์ที่อัพโหลด
                                      </TableHead>
                                      <TableHead className="w-[15%] text-right text-xs">
                                        จัดการ
                                      </TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {PHOTO_GUIDES.filter((g) => g.required).map(
                                      (guide) => {
                                        const raw =
                                          formData.incomePhotos?.[guide.id];
                                        const photos: string[] = Array.isArray(
                                          raw,
                                        )
                                          ? raw
                                          : raw
                                            ? [raw]
                                            : [];
                                        const hasPhotos = photos.length > 0;
                                        return (
                                          <TableRow
                                            key={guide.id}
                                            className="hover:bg-transparent"
                                          >
                                            <TableCell className="py-4">
                                              <div className="flex items-center gap-3">
                                                <div
                                                  className={cn(
                                                    "w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0",
                                                    hasPhotos
                                                      ? "bg-green-50 text-emerald-600"
                                                      : "bg-gray-100 text-gray-400",
                                                  )}
                                                >
                                                  {hasPhotos ? (
                                                    <CheckCircle2 className="w-4 h-4" />
                                                  ) : (
                                                    <FileText className="w-4 h-4" />
                                                  )}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                  <span className="font-medium text-gray-700 text-sm whitespace-nowrap">
                                                    {guide.title}
                                                  </span>
                                                  <Dialog>
                                                    <DialogTrigger asChild>
                                                      <button
                                                        onClick={(e) =>
                                                          e.stopPropagation()
                                                        }
                                                        className="w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:text-chaiyo-blue hover:bg-blue-50 transition-all shrink-0"
                                                        title="ดูคำแนะนำการถ่ายภาพ"
                                                      >
                                                        <Info className="w-4 h-4" />
                                                      </button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-md">
                                                      <DialogHeader>
                                                        <DialogTitle>
                                                          {guide.title}
                                                        </DialogTitle>
                                                        <DialogDescription className="text-sm">
                                                          {guide.description}
                                                        </DialogDescription>
                                                      </DialogHeader>
                                                      <DialogBody>
                                                        <div className="aspect-video w-full rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 relative">
                                                          <img
                                                            src={guide.demoUrl}
                                                            alt={guide.title}
                                                            className="w-full h-full object-cover"
                                                          />
                                                          <div className="absolute top-2 left-2 px-2 py-0.5 bg-chaiyo-blue text-[10px] text-white rounded font-bold uppercase tracking-wider">
                                                            ตัวอย่างภาพ
                                                          </div>
                                                        </div>
                                                      </DialogBody>
                                                      <DialogFooter>
                                                        <DialogClose asChild>
                                                          <Button
                                                            variant="outline"
                                                            className="min-w-[104px]"
                                                          >
                                                            ปิด
                                                          </Button>
                                                        </DialogClose>
                                                      </DialogFooter>
                                                    </DialogContent>
                                                  </Dialog>
                                                </div>
                                              </div>
                                            </TableCell>
                                            <TableCell>
                                              {hasPhotos ? (
                                                <div className="flex items-center gap-3">
                                                  <button
                                                    type="button"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      setManagingPhotoGuideId(
                                                        guide.id,
                                                      );
                                                    }}
                                                    className="flex items-center gap-1.5 text-xs text-chaiyo-blue font-medium hover:underline cursor-pointer"
                                                  >
                                                    <FileText className="w-4 h-4" />
                                                    {photos.length} รูปภาพ
                                                  </button>
                                                </div>
                                              ) : (
                                                <span className="text-xs text-muted-foreground italic">
                                                  ยังไม่มีไฟล์
                                                </span>
                                              )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                              <div className="flex items-center justify-end gap-1">
                                                <Button
                                                  type="button"
                                                  variant="outline"
                                                  size="sm"
                                                  onClick={() =>
                                                    handleTriggerPhotoUpload(
                                                      guide.id,
                                                    )
                                                  }
                                                  className="h-8 text-xs gap-1.5 font-medium"
                                                >
                                                  <Plus className="w-3.5 h-3.5" />
                                                  เพิ่มเอกสาร
                                                </Button>
                                              </div>
                                            </TableCell>
                                          </TableRow>
                                        );
                                      },
                                    )}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>

                            {/* Optional Documents Table */}
                            <div className="space-y-3">
                              <div className="flex items-center justify-between mb-2">
                                <Label className="text-sm font-bold text-gray-700">
                                  เอกสารเพิ่มเติม
                                </Label>
                              </div>
                              <div className="border border-border-strong rounded-xl overflow-hidden bg-white">
                                <Table>
                                  <TableHeader className="bg-gray-50/50">
                                    <TableRow className="hover:bg-transparent">
                                      <TableHead className="w-[45%] text-xs">
                                        ประเภทเอกสาร/รูปภาพ
                                      </TableHead>
                                      <TableHead className="w-[40%] text-xs">
                                        ไฟล์ที่อัพโหลด
                                      </TableHead>
                                      <TableHead className="w-[15%] text-right text-xs">
                                        จัดการ
                                      </TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {PHOTO_GUIDES.filter(
                                      (g) => !g.required,
                                    ).map((guide) => {
                                      const raw =
                                        formData.incomePhotos?.[guide.id];
                                      const photos: string[] = Array.isArray(
                                        raw,
                                      )
                                        ? raw
                                        : raw
                                          ? [raw]
                                          : [];
                                      const hasPhotos = photos.length > 0;
                                      return (
                                        <TableRow
                                          key={guide.id}
                                          className="hover:bg-transparent"
                                        >
                                          <TableCell className="py-4">
                                            <div className="flex items-center gap-3">
                                              <div
                                                className={cn(
                                                  "w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0",
                                                  hasPhotos
                                                    ? "bg-green-50 text-emerald-600"
                                                    : "bg-gray-100 text-gray-400",
                                                )}
                                              >
                                                {hasPhotos ? (
                                                  <CheckCircle2 className="w-4 h-4" />
                                                ) : (
                                                  <FileText className="w-4 h-4" />
                                                )}
                                              </div>
                                              <div className="flex items-center gap-1.5">
                                                <span className="font-medium text-gray-700 text-sm whitespace-nowrap">
                                                  {guide.title}
                                                </span>
                                                <Dialog>
                                                  <DialogTrigger asChild>
                                                    <button
                                                      onClick={(e) =>
                                                        e.stopPropagation()
                                                      }
                                                      className="w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:text-chaiyo-blue hover:bg-blue-50 transition-all shrink-0"
                                                      title="ดูคำแนะนำการถ่ายภาพ"
                                                    >
                                                      <Info className="w-4 h-4" />
                                                    </button>
                                                  </DialogTrigger>
                                                  <DialogContent className="sm:max-w-md">
                                                    <DialogHeader>
                                                      <DialogTitle>
                                                        {guide.title}
                                                      </DialogTitle>
                                                      <DialogDescription className="text-sm">
                                                        {guide.description}
                                                      </DialogDescription>
                                                    </DialogHeader>
                                                    <DialogBody>
                                                      <div className="aspect-video w-full rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 relative">
                                                        <img
                                                          src={guide.demoUrl}
                                                          alt={guide.title}
                                                          className="w-full h-full object-cover"
                                                        />
                                                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-chaiyo-blue text-[10px] text-white rounded font-bold uppercase tracking-wider">
                                                          ตัวอย่างภาพ
                                                        </div>
                                                      </div>
                                                    </DialogBody>
                                                    <DialogFooter>
                                                      <DialogClose asChild>
                                                        <Button
                                                          variant="outline"
                                                          className="min-w-[104px]"
                                                        >
                                                          ปิด
                                                        </Button>
                                                      </DialogClose>
                                                    </DialogFooter>
                                                  </DialogContent>
                                                </Dialog>
                                              </div>
                                            </div>
                                          </TableCell>
                                          <TableCell>
                                            {hasPhotos ? (
                                              <div className="flex items-center gap-3">
                                                <button
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setManagingPhotoGuideId(
                                                      guide.id,
                                                    );
                                                  }}
                                                  className="flex items-center gap-1.5 text-xs text-chaiyo-blue font-medium hover:underline cursor-pointer"
                                                >
                                                  <FileText className="w-4 h-4" />
                                                  {photos.length} รูปภาพ
                                                </button>
                                              </div>
                                            ) : (
                                              <span className="text-xs text-muted-foreground italic">
                                                ยังไม่มีไฟล์
                                              </span>
                                            )}
                                          </TableCell>
                                          <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                              <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                  handleTriggerPhotoUpload(
                                                    guide.id,
                                                  )
                                                }
                                                className="h-8 text-xs gap-1.5 font-medium"
                                              >
                                                <Plus className="w-3.5 h-3.5" />
                                                เพิ่มเอกสาร
                                              </Button>
                                            </div>
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
                      )}

                    {/* ===== ผู้ประเมินสถานที่ทำงาน ===== */}
                    {occ.employmentType &&
                      occ.employmentType !== "UNEMPLOYED" &&
                      !!occ.occupationCode && (
                        <div className="rounded-xl border border-border-color bg-gray-50/40 p-6 space-y-4">
                          <div className="flex items-center justify-between pb-2 border-b border-border-color">
                            <h4 className="text-base font-bold text-gray-800 flex items-center gap-2">
                              <ClipboardCheck className="w-5 h-5 text-chaiyo-blue" />{" "}
                              ผู้ประเมินสถานที่ทำงาน
                            </h4>
                            {/* Checkbox for secondary occupations */}
                            {!occ.isMain && (
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  id={`same-assessor-${occ.id}`}
                                  checked={occ.sameAssessorAsMain !== false}
                                  onCheckedChange={(checked) =>
                                    handleOccupationChange(
                                      occ.id,
                                      "sameAssessorAsMain",
                                      !!checked,
                                    )
                                  }
                                  className="h-4 w-4 rounded-md border-gray-300 data-[state=checked]:bg-chaiyo-blue data-[state=checked]:border-chaiyo-blue"
                                />
                                <Label
                                  htmlFor={`same-assessor-${occ.id}`}
                                  className="text-sm text-gray-700 cursor-pointer select-none font-medium"
                                >
                                  ใช้ผู้ประเมินเดียวกับอาชีพหลัก
                                </Label>
                              </div>
                            )}
                          </div>

                          {/* Main occupation — always editable via formData */}
                          {occ.isMain && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="md:col-span-2 space-y-2">
                                <Label className="flex items-center gap-1.5">
                                  <span>พนักงาน</span>
                                  <span className="text-red-500">*</span>
                                </Label>
                                <Combobox
                                  options={MOCK_STAFF_LIST.map((s) => ({
                                    value: s.id,
                                    label: `${s.code} — ${s.name}`,
                                  }))}
                                  value={
                                    formData.workplaceAssessorId ??
                                    MOCK_STAFF_LIST[0].id
                                  }
                                  onValueChange={(val) => {
                                    const staff = MOCK_STAFF_LIST.find(
                                      (s) => s.id === val,
                                    );
                                    handleChange("workplaceAssessorId", val);
                                    if (staff)
                                      handleChange(
                                        "workplaceAssessorPhone",
                                        staff.phone,
                                      );
                                  }}
                                  placeholder="ค้นหาพนักงาน..."
                                  className="h-12 rounded-xl"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>เบอร์ติดต่อพนักงาน</Label>
                                <Input
                                  value={
                                    formData.workplaceAssessorPhone ??
                                    (() => {
                                      const staff = MOCK_STAFF_LIST.find(
                                        (s) =>
                                          s.id ===
                                          (formData.workplaceAssessorId ??
                                            MOCK_STAFF_LIST[0].id),
                                      );
                                      return staff?.phone ?? "";
                                    })()
                                  }
                                  onChange={(e) =>
                                    handleChange(
                                      "workplaceAssessorPhone",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="0XX-XXX-XXXX"
                                  className="h-12 rounded-xl font-mono"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>วันที่ประเมิน</Label>
                                <DatePickerBE
                                  value={formData.workplaceAssessmentDate ?? ""}
                                  onChange={(val) =>
                                    handleChange("workplaceAssessmentDate", val)
                                  }
                                  inputClassName="h-12 rounded-xl"
                                />
                              </div>
                            </div>
                          )}

                          {/* Secondary occupation — checkbox controls same-as-main */}
                          {!occ.isMain && (
                            <>
                              {/* Same as main: read-only display */}
                              {occ.sameAssessorAsMain !== false && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-60 pointer-events-none">
                                  <div className="md:col-span-2 space-y-2">
                                    <Label className="flex items-center gap-1.5 text-muted-foreground">
                                      <span>พนักงาน</span>
                                    </Label>
                                    <div className="h-12 flex items-center px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-600 font-medium">
                                      {(() => {
                                        const staff = MOCK_STAFF_LIST.find(
                                          (s) =>
                                            s.id ===
                                            (formData.workplaceAssessorId ??
                                              MOCK_STAFF_LIST[0].id),
                                        );
                                        return staff
                                          ? `${staff.code} — ${staff.name}`
                                          : "—";
                                      })()}
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-muted-foreground">
                                      เบอร์ติดต่อพนักงาน
                                    </Label>
                                    <div className="h-12 flex items-center px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-600 font-mono">
                                      {formData.workplaceAssessorPhone ??
                                        (() => {
                                          const staff = MOCK_STAFF_LIST.find(
                                            (s) =>
                                              s.id ===
                                              (formData.workplaceAssessorId ??
                                                MOCK_STAFF_LIST[0].id),
                                          );
                                          return staff?.phone ?? "—";
                                        })()}
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-muted-foreground">
                                      วันที่ประเมิน
                                    </Label>
                                    <div className="h-12 flex items-center px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-600">
                                      {formData.workplaceAssessmentDate || "—"}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Different assessor: per-occupation editable fields */}
                              {occ.sameAssessorAsMain === false && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-200">
                                  <div className="md:col-span-2 space-y-2">
                                    <Label className="flex items-center gap-1.5">
                                      <span>พนักงาน</span>
                                      <span className="text-red-500">*</span>
                                    </Label>
                                    <Combobox
                                      options={MOCK_STAFF_LIST.map((s) => ({
                                        value: s.id,
                                        label: `${s.code} — ${s.name}`,
                                      }))}
                                      value={occ.workplaceAssessorId ?? ""}
                                      onValueChange={(val) => {
                                        const staff = MOCK_STAFF_LIST.find(
                                          (s) => s.id === val,
                                        );
                                        handleOccupationChange(occ.id, {
                                          workplaceAssessorId: val,
                                          workplaceAssessorPhone:
                                            staff?.phone ??
                                            occ.workplaceAssessorPhone ??
                                            "",
                                        });
                                      }}
                                      placeholder="ค้นหาพนักงาน..."
                                      className="h-12 rounded-xl"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>เบอร์ติดต่อพนักงาน</Label>
                                    <Input
                                      value={occ.workplaceAssessorPhone ?? ""}
                                      onChange={(e) =>
                                        handleOccupationChange(
                                          occ.id,
                                          "workplaceAssessorPhone",
                                          e.target.value,
                                        )
                                      }
                                      placeholder="0XX-XXX-XXXX"
                                      className="h-12 rounded-xl font-mono"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>วันที่ประเมิน</Label>
                                    <DatePickerBE
                                      value={occ.workplaceAssessmentDate ?? ""}
                                      onChange={(val) =>
                                        handleOccupationChange(
                                          occ.id,
                                          "workplaceAssessmentDate",
                                          val,
                                        )
                                      }
                                      inputClassName="h-12 rounded-xl"
                                    />
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}

                    {/* หมายเหตุ per occupation */}
                    {occ.employmentType && !!occ.occupationCode && (
                      <div className="rounded-xl border border-border-color bg-gray-50/40 p-6 space-y-3">
                        <h4 className="text-base font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-border-color">
                          <MessageSquare className="w-5 h-5 text-chaiyo-blue" />{" "}
                          หมายเหตุ
                        </h4>
                        <Textarea
                          value={occ.remarks || ""}
                          onChange={(e) =>
                            handleOccupationChange(
                              occ.id,
                              "remarks",
                              e.target.value,
                            )
                          }
                          placeholder="บันทึกหมายเหตุเพิ่มเติมสำหรับอาชีพนี้ (ถ้ามี)"
                          className="min-h-[100px] resize-none bg-white"
                        />
                      </div>
                    )}
                  </TabsContent>
                );
              })}
            </Tabs>

            {/* Special Incomes component has been removed in favor of this tab system */}
          </CardContent>
        </Card>
      </div>

      {/* Business Status Verification Links Section */}
      <div className="w-full">
        <Card className="border-border-strong overflow-hidden">
          <CardHeader className="bg-gray-50/80 border-b border-border-strong pb-3 pt-4">
            <CardTitle className="text-base flex items-center gap-2 text-gray-800">
              สถานะกิจการปัจจุบัน
            </CardTitle>
            <CardDescription className="text-xs text-gray-500 mt-1">
              ลิงก์สำหรับตรวจสอบสถานะการจดทะเบียนกิจการ
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* DBD Link */}
              <a
                href="https://www.dbd.go.th/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-chaiyo-blue hover:bg-blue-50/40 transition-all cursor-pointer group"
              >
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Globe className="w-5 h-5 text-chaiyo-blue group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-sm font-medium text-chaiyo-blue group-hover:underline">
                    DBD
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    Department of Business Development
                  </p>
                </div>
              </a>

              {/* DBD2 Link */}
              <a
                href="https://www.dbd.go.th/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-chaiyo-blue hover:bg-blue-50/40 transition-all cursor-pointer group"
              >
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Globe className="w-5 h-5 text-chaiyo-blue group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-sm font-medium text-chaiyo-blue group-hover:underline">
                    DBD2
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    Business Online System
                  </p>
                </div>
              </a>

              {/* สปสช Link */}
              <a
                href="https://www.acm.go.th/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-chaiyo-blue hover:bg-blue-50/40 transition-all cursor-pointer group"
              >
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Globe className="w-5 h-5 text-chaiyo-blue group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-sm font-medium text-chaiyo-blue group-hover:underline">
                    สปสช
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    Anti-Corruption Commission
                  </p>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary breakdown */}
      <div className="w-full space-y-4">
        <Card className="border-border-strong overflow-hidden">
          <CardHeader className="bg-gray-50/80 border-b border-border-strong pb-3 pt-4">
            <CardTitle className="text-base flex items-center gap-2 text-gray-800">
              สรุปรายได้ (บาท/เดือน)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
              {/* Income Breakdown */}
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-5 rounded-full bg-emerald-500" />
                  <h4 className="text-sm font-bold text-gray-700">รายได้</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">รายได้อาชีพหลัก</span>
                    <span className="font-mono text-gray-700">
                      {formatNumberWithCommas(
                        roundDown2(
                          Number(formData.mainOccupationIncome || 0),
                        ).toFixed(2),
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">รายได้อาชีพเสริม</span>
                    <span className="font-mono text-gray-700">
                      {formatNumberWithCommas(
                        roundDown2(
                          Number(formData.secondaryOccupationIncome || 0),
                        ).toFixed(2),
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Total Column */}
              <div className="p-5 flex flex-col justify-center items-center text-center bg-emerald-50/60">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-bold text-gray-700">
                    รวมรายได้
                  </span>
                </div>
                <div className="text-3xl font-black font-mono mt-1 text-chaiyo-blue">
                  {formatNumberWithCommas(
                    roundDown2(Number(formData.totalIncome || 0)).toFixed(2),
                  )}
                </div>
                <span className="text-xs text-gray-400 mt-1">บาท/เดือน</span>
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

      <AlertDialog
        open={itemToDelete !== null}
        onOpenChange={(open) => !open && setItemToDelete(null)}
      >
        <AlertDialogContent onCloseAutoFocus={(e) => e.preventDefault()}>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบข้อมูล</AlertDialogTitle>
            <AlertDialogDescription>
              คุณต้องการลบข้อมูลนี้ใช่หรือไม่?
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

      {/* Add Statement Month Dialog */}
      <Dialog
        open={statementMonthDialogOpen}
        onOpenChange={setStatementMonthDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>เพิ่มเดือน</DialogTitle>
            <DialogDescription>
              เลือกเดือนที่ต้องการเพิ่มรายการรายได้จากรายการเดินบัญชี
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <div className="space-y-3">
              <Label>
                เดือน <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedMonthForDialog}
                onValueChange={setSelectedMonthForDialog}
              >
                <SelectTrigger className="h-11 bg-white">
                  <SelectValue placeholder="เลือกเดือน..." />
                </SelectTrigger>
                <SelectContent>
                  {THAI_MONTHS_SHORT.map((month, idx) => {
                    // Check if already added for this bank
                    const bankKey = statementMonthDialogBank
                      ? String(statementMonthDialogBank.bankIdx)
                      : "";
                    const existingMonths = statementMonthDialogBank
                      ? (occupations.find(
                          (o) => o.id === statementMonthDialogBank.occId,
                        )?.statementMonths || {})[bankKey] || []
                      : [];
                    const isAlreadyAdded = existingMonths.includes(month);
                    const fullName = THAI_MONTHS_FULL[idx];
                    return (
                      <SelectItem
                        key={month}
                        value={month}
                        disabled={isAlreadyAdded}
                      >
                        {fullName} {isAlreadyAdded ? "(เพิ่มแล้ว)" : ""}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setStatementMonthDialogOpen(false)}
              className="min-w-[104px]"
            >
              ยกเลิก
            </Button>
            <Button
              onClick={handleConfirmAddMonth}
              disabled={!selectedMonthForDialog}
              className="min-w-[104px]"
            >
              ยืนยัน
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Statement Month Confirmation */}
      <AlertDialog
        open={pendingDeleteMonth !== null}
        onOpenChange={(open) => !open && setPendingDeleteMonth(null)}
      >
        <AlertDialogContent onCloseAutoFocus={(e) => e.preventDefault()}>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบเดือน</AlertDialogTitle>
            <AlertDialogDescription>
              คุณต้องการลบข้อมูลนี้ใช่หรือไม่?
              การดำเนินการนี้ไม่สามารถย้อนกลับได้
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingDeleteMonth) {
                  handleRemoveStatementMonth(
                    pendingDeleteMonth.occId,
                    pendingDeleteMonth.bankIdx,
                    pendingDeleteMonth.monthLabel,
                  );
                }
                setPendingDeleteMonth(null);
              }}
              className="bg-status-rejected hover:bg-status-rejected/90"
            >
              ยืนยันการลบ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Manage Photo Documents Dialog */}
      <Dialog
        open={managingPhotoGuideId !== null}
        onOpenChange={(open) => !open && setManagingPhotoGuideId(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>ไฟล์ที่อัพโหลด</DialogTitle>
          </DialogHeader>
          <DialogBody className="max-h-[60vh] overflow-y-auto">
            <div className="border border-border-strong rounded-xl overflow-hidden bg-white">
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow>
                    <TableHead className="w-16 text-center text-xs">
                      ลำดับ
                    </TableHead>
                    <TableHead className="text-xs">ชื่อไฟล์</TableHead>
                    <TableHead className="w-48 text-center text-xs">
                      รหัสผ่าน
                    </TableHead>
                    <TableHead className="w-24 text-center text-xs">
                      จัดการ
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {managingPhotoGuideId &&
                    (() => {
                      const raw = formData.incomePhotos?.[managingPhotoGuideId];
                      const photos = Array.isArray(raw)
                        ? raw
                        : raw
                          ? [raw]
                          : [];
                      if (photos.length === 0) {
                        return (
                          <TableRow>
                            <TableCell
                              colSpan={4}
                              className="text-center py-8 text-muted-foreground"
                            >
                              ไม่มีไฟล์ในรายการนี้
                            </TableCell>
                          </TableRow>
                        );
                      }
                      return photos.map((photoUrl, pIdx) => (
                        <TableRow key={pIdx}>
                          <TableCell className="text-center font-medium text-gray-500">
                            {pIdx + 1}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-700">
                                {photoUrl.split("/").pop() ||
                                  `Photo_${pIdx + 1}.jpg`}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="text-gray-400">-</span>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const allPhotos = Object.values(
                                    formData.incomePhotos || {},
                                  ).flat();
                                  const flatIdx = allPhotos.indexOf(photoUrl);
                                  if (flatIdx !== -1) setLightboxIndex(flatIdx);
                                }}
                                className="w-8 h-8 rounded-full text-chaiyo-blue hover:bg-blue-50 border border-transparent hover:border-blue-100 flex items-center justify-center transition-all bg-white"
                                title="ดูรูปภาพ"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const guide = PHOTO_GUIDES.find(
                                    (g) => g.id === managingPhotoGuideId,
                                  );
                                  setItemToDelete({
                                    categoryId: managingPhotoGuideId,
                                    photoIndex: pIdx,
                                    name: `${guide?.title} (รูปที่ ${pIdx + 1})`,
                                    type: "categorizedPhoto",
                                  });
                                }}
                                className="w-8 h-8 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 flex items-center justify-center transition-all bg-white"
                                title="ลบ"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ));
                    })()}
                </TableBody>
              </Table>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setManagingPhotoGuideId(null)}
              className="min-w-[104px]"
            >
              ปิด
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payslip Month Add Dialog */}
      <Dialog
        open={payslipMonthDialogOpen}
        onOpenChange={setPayslipMonthDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>เพิ่มเดือน</DialogTitle>
            <DialogDescription>
              เลือกเดือนที่ต้องการเพิ่มรายการรายได้จากสลิปเงินเดือน
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <div className="space-y-3">
              <Label>
                เดือน <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedPayslipMonth}
                onValueChange={setSelectedPayslipMonth}
              >
                <SelectTrigger className="h-11 bg-white">
                  <SelectValue placeholder="เลือกเดือน..." />
                </SelectTrigger>
                <SelectContent>
                  {THAI_MONTHS_SHORT.map((month, idx) => {
                    const existingMonths = payslipMonthDialogOccId
                      ? occupations.find(
                          (o) => o.id === payslipMonthDialogOccId,
                        )?.payslipMonths || []
                      : [];
                    const isAlreadyAdded = existingMonths.includes(month);
                    const fullName = THAI_MONTHS_FULL[idx];
                    return (
                      <SelectItem
                        key={month}
                        value={month}
                        disabled={isAlreadyAdded}
                      >
                        {fullName} {isAlreadyAdded ? "(เพิ่มแล้ว)" : ""}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPayslipMonthDialogOpen(false)}
              className="min-w-[104px]"
            >
              ยกเลิก
            </Button>
            <Button
              onClick={handleConfirmAddPayslipMonth}
              disabled={!selectedPayslipMonth}
              className="min-w-[104px]"
            >
              ยืนยัน
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Payslip Month Confirmation */}
      <AlertDialog
        open={pendingDeletePayslipMonth !== null}
        onOpenChange={(open) => !open && setPendingDeletePayslipMonth(null)}
      >
        <AlertDialogContent onCloseAutoFocus={(e) => e.preventDefault()}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ยืนยันการลบเดือน (สลิปเงินเดือน)
            </AlertDialogTitle>
            <AlertDialogDescription>
              คุณต้องการลบข้อมูลนี้ใช่หรือไม่?
              การดำเนินการนี้ไม่สามารถย้อนกลับได้
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingDeletePayslipMonth) {
                  handleRemovePayslipMonth(
                    pendingDeletePayslipMonth.occId,
                    pendingDeletePayslipMonth.monthLabel,
                  );
                }
                setPendingDeletePayslipMonth(null);
              }}
              className="bg-status-rejected hover:bg-status-rejected/90"
            >
              ยืนยันการลบ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Tavi 50 Item Add Dialog */}
      <Dialog
        open={tavi50ItemDialogOpen}
        onOpenChange={setTavi50ItemDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>เพิ่มรายการ ทวิ 50</DialogTitle>
            <DialogDescription>
              โปรดเลือกประเภทของเอกสาร ทวิ 50 ที่ต้องการเพิ่มรายการ
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <div className="space-y-6">
              <div className="space-y-3">
                <Label>
                  ประเภท ทวิ 50 <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={tavi50ItemType}
                  onValueChange={(val: "yearly" | "monthly") =>
                    setTavi50ItemType(val)
                  }
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yearly" id="tavi50-type-yearly" />
                    <Label
                      htmlFor="tavi50-type-yearly"
                      className="font-normal cursor-pointer"
                    >
                      รายปี
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="monthly" id="tavi50-type-monthly" />
                    <Label
                      htmlFor="tavi50-type-monthly"
                      className="font-normal cursor-pointer"
                    >
                      รายเดือน
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {tavi50ItemType === "monthly" && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                  <Label>
                    เดือน <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={selectedTavi50Month}
                    onValueChange={setSelectedTavi50Month}
                  >
                    <SelectTrigger className="h-11 bg-white">
                      <SelectValue placeholder="เลือกเดือน..." />
                    </SelectTrigger>
                    <SelectContent>
                      {THAI_MONTHS_SHORT.map((month, idx) => {
                        const existingMonths = tavi50ItemDialogOccId
                          ? occupations.find(
                              (o) => o.id === tavi50ItemDialogOccId,
                            )?.tavi50MonthlyMonths || []
                          : [];
                        const isAlreadyAdded = existingMonths.includes(month);
                        const fullName = THAI_MONTHS_FULL[idx];
                        return (
                          <SelectItem
                            key={month}
                            value={month}
                            disabled={isAlreadyAdded}
                          >
                            {fullName} {isAlreadyAdded ? "(เพิ่มแล้ว)" : ""}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setTavi50ItemDialogOpen(false)}
              className="min-w-[104px]"
            >
              ยกเลิก
            </Button>
            <Button
              onClick={handleConfirmAddTavi50Item}
              disabled={tavi50ItemType === "monthly" && !selectedTavi50Month}
              className="min-w-[104px]"
            >
              ยืนยัน
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Tavi 50 Month Confirmation */}
      <AlertDialog
        open={pendingDeleteTavi50Month !== null}
        onOpenChange={(open) => !open && setPendingDeleteTavi50Month(null)}
      >
        <AlertDialogContent onCloseAutoFocus={(e) => e.preventDefault()}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ยืนยันการลบเดือน (ทวิ 50 (รายเดือน))
            </AlertDialogTitle>
            <AlertDialogDescription>
              คุณต้องการลบข้อมูลนี้ใช่หรือไม่?
              การดำเนินการนี้ไม่สามารถย้อนกลับได้
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingDeleteTavi50Month) {
                  handleRemoveTavi50Month(
                    pendingDeleteTavi50Month.occId,
                    pendingDeleteTavi50Month.monthLabel,
                  );
                }
                setPendingDeleteTavi50Month(null);
              }}
              className="bg-status-rejected hover:bg-status-rejected/90"
            >
              ยืนยันการลบ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        open={pendingDeleteTavi50Yearly !== null}
        onOpenChange={(open) => !open && setPendingDeleteTavi50Yearly(null)}
      >
        <AlertDialogContent onCloseAutoFocus={(e) => e.preventDefault()}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ยืนยันการลบรายปี (ทวิ 50 (รายปี))
            </AlertDialogTitle>
            <AlertDialogDescription>
              คุณต้องการลบข้อมูลนี้ใช่หรือไม่?
              การดำเนินการนี้ไม่สามารถย้อนกลับได้
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingDeleteTavi50Yearly) {
                  handleOccupationChange(
                    pendingDeleteTavi50Yearly,
                    "hasTavi50Yearly",
                    false,
                  );
                  // Remove any tavi50_yearly documents
                  const occ = occupations.find(
                    (o) => o.id === pendingDeleteTavi50Yearly,
                  );
                  if (occ) {
                    const remainingDocs = (occ.incomeDocuments || []).filter(
                      (d) => d.type !== "tavi50_yearly",
                    );
                    const remainingIncomes = (occ.saIncomes || []).filter(
                      (inc) => inc.sourceDocType !== "tavi50_yearly",
                    );
                    handleOccupationChange(pendingDeleteTavi50Yearly, {
                      incomeDocuments: remainingDocs,
                      saIncomes: remainingIncomes,
                    });
                  }
                }
                setPendingDeleteTavi50Yearly(null);
              }}
              className="bg-status-rejected hover:bg-status-rejected/90"
            >
              ยืนยันการลบ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Photo Lightbox */}
      {(() => {
        const allPhotos: string[] = Object.values(
          formData.incomePhotos || {},
        ).flat() as string[];
        return (
          lightboxIndex !== null &&
          allPhotos.length > 0 && (
            <div
              className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 md:p-8 animate-in fade-in duration-200"
              onClick={() => setLightboxIndex(null)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(null);
                }}
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
                      setLightboxIndex((prev) =>
                        prev !== null
                          ? (prev - 1 + allPhotos.length) % allPhotos.length
                          : 0,
                      );
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-10 h-10"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex((prev) =>
                        prev !== null ? (prev + 1) % allPhotos.length : 0,
                      );
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-10 h-10"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
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
              <div
                className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto pb-2"
                onClick={(e) => e.stopPropagation()}
              >
                {allPhotos.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setLightboxIndex(idx)}
                    className={cn(
                      "w-16 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0",
                      idx === lightboxIndex
                        ? "border-white scale-110 ring-2 ring-white/20"
                        : "border-transparent opacity-50 hover:opacity-100",
                    )}
                  >
                    <img
                      src={url}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              <div className="absolute top-4 left-4 text-white/80 font-medium bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">
                {(lightboxIndex ?? 0) + 1} / {allPhotos.length}
              </div>
            </div>
          )
        );
      })()}

      {/* Method Selection & Uploaded Files Dialog */}
      {/* View Uploaded Files Dialog */}
      <Dialog
        open={!!viewFilesContext}
        onOpenChange={(open) => {
          if (!open && !itemToDelete) setViewFilesContext(null);
        }}
      >
        <DialogContent
          className="max-w-3xl"
          onInteractOutside={(e) => {
            if (itemToDelete) e.preventDefault();
          }}
          onPointerDownOutside={(e) => {
            if (itemToDelete) e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>ไฟล์ที่อัพโหลด</DialogTitle>
          </DialogHeader>
          <DialogBody>
            {(() => {
              if (!viewFilesContext) return null;
              const occ = occupations.find(
                (o: IncomeOccupation) => o.id === viewFilesContext.occId,
              );
              if (!occ) return null;
              const fileList = (occ.incomeDocuments || []).filter(
                (d: IncomeDocument) =>
                  viewFilesContext.docType === "payslip"
                    ? d.type?.startsWith("payslip")
                    : viewFilesContext.docType === "statement"
                      ? d.type?.startsWith("statement")
                      : viewFilesContext.docType === "tavi50"
                        ? d.type?.startsWith("tavi50_")
                        : viewFilesContext.docType === "tavi50_monthly"
                          ? d.type?.startsWith("tavi50_monthly_")
                          : d.type === viewFilesContext.docType,
              );

              if (fileList.length === 0)
                return (
                  <div className="text-center py-10 text-muted-foreground">
                    <FileText className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">ไม่มีไฟล์ที่อัพโหลด</p>
                  </div>
                );

              const hasAnyPassword = fileList.some(
                (d: IncomeDocument) => d.isLocked,
              );

              return (
                <div className="bg-white rounded-xl border overflow-hidden">
                  <div className="max-h-[480px] overflow-y-auto">
                    <Table>
                      <TableHeader className="bg-gray-50/50">
                        <TableRow>
                          <TableHead className="w-[50px] text-xs"></TableHead>
                          <TableHead
                            className={cn(
                              "text-xs",
                              hasAnyPassword ? "w-[45%]" : "w-[60%]",
                            )}
                          >
                            ชื่อไฟล์
                          </TableHead>
                          {hasAnyPassword && (
                            <TableHead className="w-[25%] text-xs">
                              รหัสผ่าน
                            </TableHead>
                          )}
                          <TableHead className="w-[80px] text-right text-xs">
                            จัดการ
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="divide-y divide-gray-100">
                        {fileList.map((doc: IncomeDocument, idx: number) => (
                          <TableRow
                            key={doc.id}
                            className={cn(
                              "transition-all duration-150",
                              dragOverDocIdx === idx
                                ? "border-t-2 border-chaiyo-blue"
                                : "hover:bg-transparent",
                            )}
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData("text/plain", String(idx));
                              e.dataTransfer.effectAllowed = "move";
                            }}
                            onDragOver={(e) => {
                              e.preventDefault();
                              e.dataTransfer.dropEffect = "move";
                              setDragOverDocIdx(idx);
                            }}
                            onDragLeave={(e) => {
                              if (
                                !e.currentTarget.contains(
                                  e.relatedTarget as Node,
                                )
                              )
                                setDragOverDocIdx(null);
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              setDragOverDocIdx(null);
                              const from = Number(
                                e.dataTransfer.getData("text/plain"),
                              );
                              handleDragReorderIncomeDocument(
                                occ.id,
                                from,
                                idx,
                                fileList.map((d: IncomeDocument) => d.id),
                              );
                            }}
                            onDragEnd={() => setDragOverDocIdx(null)}
                          >
                            <TableCell className="py-3 px-2">
                              <div
                                className="flex items-center gap-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-colors"
                                title="ลากเพื่อเรียงลำดับ"
                              >
                                <GripVertical className="w-4 h-4 shrink-0" />
                                <span className="text-xs font-mono font-semibold text-gray-500 w-4 text-center">
                                  {idx + 1}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="py-3 align-top">
                              <div className="space-y-1">
                                <span className="text-sm text-gray-700 font-medium block truncate">
                                  {doc.name}
                                </span>
                                {doc.originalName &&
                                  doc.originalName !== doc.name && (
                                    <span className="text-[11px] text-muted-foreground truncate block">
                                      {doc.originalName}
                                    </span>
                                  )}
                              </div>
                            </TableCell>
                            {hasAnyPassword && (
                              <TableCell className="py-3 align-top">
                                {doc.isLocked && doc.password ? (
                                  <span className="text-xs text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded">
                                    {doc.password}
                                  </span>
                                ) : (
                                  <span className="text-xs text-muted-foreground italic">
                                    -
                                  </span>
                                )}
                              </TableCell>
                            )}
                            <TableCell className="text-right py-3 align-top">
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
                                  onClick={() =>
                                    setItemToDelete({
                                      id: doc.id,
                                      name: doc.name,
                                      occId: occ.id,
                                      type: "incomeDocument",
                                    })
                                  }
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
              );
            })()}
          </DialogBody>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViewFilesContext(null)}
              className="min-w-[100px]"
            >
              ปิด
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Document Dialog */}
      <Dialog
        open={isUploadDialogOpen}
        onOpenChange={(open) => {
          // Don't allow closing while scanner or delete dialog is active
          if (isScannerOpen || itemToDelete) return;
          setIsUploadDialogOpen(open);
          if (!open) setCurrentDocContext(null);
        }}
      >
        <DialogContent
          className="max-w-3xl"
          onInteractOutside={(e) => {
            if (isScannerOpen || itemToDelete) e.preventDefault();
          }}
          onPointerDownOutside={(e) => {
            if (isScannerOpen || itemToDelete) e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>เพิ่มเอกสาร</DialogTitle>
          </DialogHeader>

          <DialogBody className="space-y-6">
            {/* Upper: Methods */}
            <div>
              <h4 className="text-sm font-bold text-gray-700 mb-4">
                ช่องทางการเพิ่มไฟล์
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleUploadMethodSelect("file")}
                  className="flex items-center p-4 gap-4 border border-border-strong rounded-xl hover:border-chaiyo-blue hover:bg-blue-50/50 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100/50 flex items-center justify-center group-hover:bg-blue-200/50 transition-colors shrink-0">
                    <UploadCloud className="w-5 h-5 text-chaiyo-blue" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-800 text-sm leading-tight">
                      อัพโหลดไฟล์
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      เลือกไฟล์จากเครื่อง (PDF, JPG, PNG) ไม่เกิน 20MB
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => handleUploadMethodSelect("camera")}
                  className="flex items-center p-4 gap-4 border border-border-strong rounded-xl hover:border-chaiyo-blue hover:bg-blue-50/50 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100/50 flex items-center justify-center group-hover:bg-blue-200/50 transition-colors shrink-0">
                    <Camera className="w-5 h-5 text-chaiyo-blue" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-800 text-sm leading-tight">
                      ถ่ายรูป
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      ใช้กล้องถ่ายเอกสารตัวจริง
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Lower: Attached Files List */}
            {(() => {
              if (!currentDocContext) return null;
              const occ = occupations.find(
                (o: IncomeOccupation) => o.id === currentDocContext.occId,
              );
              if (!occ) return null;
              const currentFileList = (occ.incomeDocuments || []).filter(
                (d: IncomeDocument) => {
                  // Only show files uploaded during this session
                  if (uploadSessionDocIds.has(d.id)) return false;
                  return currentDocContext.docType === "payslip"
                    ? d.type?.startsWith("payslip")
                    : currentDocContext.docType === "statement"
                      ? d.type?.startsWith("statement")
                      : currentDocContext.docType === "tavi50"
                        ? d.type?.startsWith("tavi50_")
                        : currentDocContext.docType === "tavi50_monthly"
                          ? d.type?.startsWith("tavi50_monthly_")
                          : d.type === currentDocContext.docType;
                },
              );

              if (currentFileList.length === 0) return null;

              const hasAnyPw = currentFileList.some(
                (d: IncomeDocument) => d.isLocked,
              );

              return (
                <div>
                  <div className="text-sm font-bold text-gray-700 mb-4">
                    ไฟล์ที่อัพโหลด ({currentFileList.length})
                  </div>
                  <div className="bg-white rounded-xl border overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                    <div className="max-h-[480px] overflow-y-auto border-t border-border-subtle">
                      <Table>
                        <TableHeader className="bg-gray-50/50">
                          <TableRow>
                            <TableHead className="w-[50px] text-xs"></TableHead>
                            <TableHead
                              className={cn(
                                "text-xs",
                                hasAnyPw ? "w-[45%]" : "w-[60%]",
                              )}
                            >
                              ชื่อไฟล์ <span className="text-red-500">*</span>
                            </TableHead>
                            {hasAnyPw && (
                              <TableHead className="w-[25%] text-xs">
                                รหัสผ่าน <span className="text-red-500">*</span>
                              </TableHead>
                            )}
                            <TableHead className="w-[80px] text-right text-xs">
                              จัดการ
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100">
                          {currentFileList.map(
                            (doc: IncomeDocument, idx: number) => (
                              <TableRow
                                key={doc.id}
                                className={cn(
                                  "transition-all duration-150",
                                  dragOverDocIdx === idx
                                    ? "border-t-2 border-chaiyo-blue"
                                    : "hover:bg-transparent",
                                )}
                                draggable
                                onDragStart={(e) => {
                                  e.dataTransfer.setData(
                                    "text/plain",
                                    String(idx),
                                  );
                                  e.dataTransfer.effectAllowed = "move";
                                }}
                                onDragOver={(e) => {
                                  e.preventDefault();
                                  e.dataTransfer.dropEffect = "move";
                                  setDragOverDocIdx(idx);
                                }}
                                onDragLeave={(e) => {
                                  if (
                                    !e.currentTarget.contains(
                                      e.relatedTarget as Node,
                                    )
                                  )
                                    setDragOverDocIdx(null);
                                }}
                                onDrop={(e) => {
                                  e.preventDefault();
                                  setDragOverDocIdx(null);
                                  const from = Number(
                                    e.dataTransfer.getData("text/plain"),
                                  );
                                  handleDragReorderIncomeDocument(
                                    occ.id,
                                    from,
                                    idx,
                                    currentFileList.map(
                                      (d: IncomeDocument) => d.id,
                                    ),
                                  );
                                }}
                                onDragEnd={() => setDragOverDocIdx(null)}
                              >
                                <TableCell className="py-3 px-2">
                                  <div
                                    className="flex items-center gap-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-colors"
                                    title="ลากเพื่อเรียงลำดับ"
                                  >
                                    <GripVertical className="w-4 h-4 shrink-0" />
                                    <span className="text-xs font-mono font-semibold text-gray-500 w-4 text-center">
                                      {idx + 1}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="py-3 align-top">
                                  <div className="space-y-1">
                                    <Input
                                      value={doc.name}
                                      onChange={(e) =>
                                        handleUpdateIncomeDocument(
                                          occ.id,
                                          doc.id,
                                          { name: e.target.value },
                                        )
                                      }
                                      className={cn(
                                        "h-8 text-xs bg-white",
                                        !doc.name?.trim() &&
                                          "border-red-500 focus-visible:ring-red-500",
                                      )}
                                      placeholder="ตั้งชื่อไฟล์"
                                    />
                                    <span className="text-[11px] text-muted-foreground truncate block">
                                      {doc.originalName || doc.name}
                                    </span>
                                  </div>
                                </TableCell>
                                {hasAnyPw && (
                                  <TableCell className="py-3 align-top">
                                    {doc.isLocked ? (
                                      <Input
                                        type="text"
                                        value={doc.password || ""}
                                        onChange={(e) =>
                                          handleUpdateIncomeDocument(
                                            occ.id,
                                            doc.id,
                                            { password: e.target.value },
                                          )
                                        }
                                        placeholder="ระบุรหัสผ่าน"
                                        className={cn(
                                          "h-8 text-xs bg-white w-full max-w-[180px]",
                                          !doc.password?.trim() &&
                                            "border-red-500 focus-visible:ring-red-500",
                                        )}
                                      />
                                    ) : (
                                      <span className="text-xs text-muted-foreground italic">
                                        -
                                      </span>
                                    )}
                                  </TableCell>
                                )}
                                <TableCell className="text-right py-3 align-top">
                                  <div className="flex items-center justify-end gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        window.open(doc.url, "_blank")
                                      }
                                      className="h-8 w-8 p-0 rounded-full text-chaiyo-blue hover:text-chaiyo-blue hover:bg-blue-50"
                                      title="ดูไฟล์"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        setItemToDelete({
                                          id: doc.id,
                                          name: doc.name,
                                          occId: occ.id,
                                          type: "incomeDocument",
                                        })
                                      }
                                      className="h-8 w-8 p-0 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50"
                                      title="ลบ"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ),
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              );
            })()}
          </DialogBody>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsUploadDialogOpen(false);
                setCurrentDocContext(null);
              }}
              className="min-w-[120px] font-bold"
            >
              ยกเลิก
            </Button>
            <Button
              onClick={() => {
                setIsUploadDialogOpen(false);
                setCurrentDocContext(null);
              }}
              className="min-w-[120px] font-bold bg-chaiyo-blue hover:bg-chaiyo-blue/90"
            >
              ยืนยันและปิด
            </Button>
          </DialogFooter>
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

      {/* SE Statement Manage Dialog */}
      <Dialog
        open={seStatementDialogOpen}
        onOpenChange={setSeStatementDialogOpen}
      >
        <DialogContent
          size="xl"
          className="p-0 gap-0 overflow-hidden border-border-strong rounded-2xl h-[85vh] flex flex-col"
        >
          <DialogHeader className="px-6 pt-6 pb-4 shrink-0 bg-white border-b border-gray-100 flex flex-row items-center justify-between">
            <DialogTitle>จัดการรายการเดินบัญชี</DialogTitle>
            {(() => {
              if (!seStatementDialogContext) return null;
              const hdrOcc = occupations.find(
                (o: IncomeOccupation) => o.id === seStatementDialogContext.occId,
              );
              const hdrItems = hdrOcc?.seStatementItems || [];
              if (hdrItems.length === 0) return null;
              const SE_PP = 25;
              const tp = Math.ceil(hdrItems.length / SE_PP) || 1;
              return (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-medium">
                    หน้า {seStatementPage} จาก {tp} (ทั้งหมด {hdrItems.length} รายการ)
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs bg-white text-gray-500 hover:text-gray-900 border-gray-200 px-2"
                      disabled={seStatementPage === 1}
                      onClick={() => setSeStatementPage((p) => Math.max(1, p - 1))}
                    >
                      ก่อนหน้า
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs bg-white text-gray-500 hover:text-gray-900 border-gray-200 px-2"
                      disabled={seStatementPage >= tp}
                      onClick={() => setSeStatementPage((p) => Math.min(tp, p + 1))}
                    >
                      ถัดไป
                    </Button>
                  </div>
                </div>
              );
            })()}
          </DialogHeader>
          <DialogBody className="flex-1 overflow-hidden flex flex-col bg-white p-0">
            {(() => {
              if (!seStatementDialogContext) return null;
              const dialogOcc = occupations.find(
                (o: IncomeOccupation) =>
                  o.id === seStatementDialogContext.occId,
              );
              if (!dialogOcc) return null;
              const items = dialogOcc.seStatementItems || [];
              const includedItems = items.filter((item) => item.included);
              const includedTotal = includedItems.reduce(
                (sum, item) => sum + (Number(item.amount) || 0),
                0,
              );

              const SE_ITEMS_PER_PAGE = 25;
              const totalPages = Math.ceil(items.length / SE_ITEMS_PER_PAGE) || 1;
              const paginatedItems = items.slice(
                (seStatementPage - 1) * SE_ITEMS_PER_PAGE,
                seStatementPage * SE_ITEMS_PER_PAGE
              );

              return (
                <div className="flex flex-col h-full">
                  <div className="overflow-y-auto bg-white flex-1 min-h-0">
                    <Table>
                      <TableHeader className="bg-gray-50/80">
                        <TableRow>
                          <TableHead className="w-[50px] text-center text-xs py-3">
                            รวม
                          </TableHead>
                          <TableHead className="w-[13%] text-xs py-3">
                            วันที่/เวลา
                          </TableHead>
                          <TableHead className="w-[60px] text-xs py-3">
                            รหัส
                          </TableHead>
                          <TableHead className="text-xs py-3">
                            รายละเอียด
                          </TableHead>
                          <TableHead className="w-[18%] text-xs py-3 text-right">
                            จำนวน (บาท)
                          </TableHead>
                          <TableHead className="w-[30%] text-xs py-3">
                            หมายเหตุ
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              className="h-24 text-center"
                            >
                              <div className="flex flex-col items-center gap-2">
                                <span className="text-muted-foreground italic text-xs">ยังไม่มีรายการจาก Statement</span>
                                {seStatementDialogContext && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleAddManualSEStatementItem(seStatementDialogContext.occId)
                                    }
                                    className="h-8 text-xs font-medium"
                                  >
                                    <Plus className="w-3 h-3 mr-1" /> เพิ่มรายการ
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          paginatedItems.map((item, idx) => {
                            const absoluteIdx = (seStatementPage - 1) * SE_ITEMS_PER_PAGE + idx;
                            return (
                              <TableRow
                                key={absoluteIdx}
                                className={cn(
                                  "group transition-colors",
                                  item.type === "out"
                                    ? "bg-white"
                                    : item.included
                                      ? "hover:bg-gray-50/50 cursor-pointer"
                                      : "bg-gray-50/80 hover:bg-gray-100/80 cursor-pointer",
                                )}
                                onClick={() => {
                                  if (item.type === "out") return;
                                  handleToggleSEStatementItem(
                                    seStatementDialogContext.occId,
                                    absoluteIdx,
                                    !item.included,
                                  );
                                }}
                              >
                                <TableCell className="py-2.5 text-center">
                                  {item.type !== "out" ? (
                                    <Checkbox
                                      checked={item.included}
                                      onCheckedChange={(checked) =>
                                        handleToggleSEStatementItem(
                                          seStatementDialogContext.occId,
                                          absoluteIdx,
                                          !!checked,
                                        )
                                      }
                                    />
                                  ) : (
                                    <span className="text-xs text-muted-foreground">
                                      —
                                    </span>
                                  )}
                                </TableCell>
                                <TableCell className="py-2.5">
                                    <Input
                                      type="datetime-local"
                                      value={item.dateTime || ""}
                                      onChange={(e) =>
                                        handleEditManualSEStatementItem(
                                          seStatementDialogContext.occId,
                                          absoluteIdx,
                                          "dateTime",
                                          e.target.value,
                                        )
                                      }
                                      onClick={(e) => e.stopPropagation()}
                                      className="h-8 !text-xs bg-white font-sans"
                                    />
                                </TableCell>
                                <TableCell className="py-2.5">
                                    <Input
                                      value={item.code}
                                      onChange={(e) =>
                                        handleEditManualSEStatementItem(
                                          seStatementDialogContext.occId,
                                          absoluteIdx,
                                          "code",
                                          e.target.value,
                                        )
                                      }
                                      onClick={(e) => e.stopPropagation()}
                                      className="h-8 !text-xs bg-white min-w-[60px]"
                                      placeholder="รหัส"
                                    />
                                </TableCell>
                                <TableCell className="py-2.5">
                                    <Textarea
                                      value={item.description}
                                      onChange={(e) =>
                                        handleEditManualSEStatementItem(
                                          seStatementDialogContext.occId,
                                          absoluteIdx,
                                          "description",
                                          e.target.value,
                                        )
                                      }
                                      onClick={(e) => e.stopPropagation()}
                                      rows={1}
                                      className="min-h-[32px] !text-xs bg-white resize-none overflow-hidden py-2"
                                      placeholder="รายละเอียด"
                                      onInput={(e) => {
                                        const t =
                                          e.target as HTMLTextAreaElement;
                                        t.style.height = "auto";
                                        t.style.height = t.scrollHeight + "px";
                                      }}
                                    />
                                </TableCell>
                                <TableCell className="py-2.5 text-right w-[20%]">
                                    <div
                                      className="flex items-center gap-1.5 justify-end"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <div className="flex items-center h-8 rounded-md border border-gray-200 bg-gray-100 p-0.5 shrink-0">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleEditManualSEStatementItem(
                                              seStatementDialogContext.occId,
                                              absoluteIdx,
                                              "type",
                                              "in",
                                            )
                                          }
                                          className={cn(
                                            "h-full px-1.5 rounded text-[11px] font-semibold transition-all flex items-center",
                                            (item.type || "in") === "in"
                                              ? "bg-emerald-500 text-white shadow-sm"
                                              : "text-gray-400 hover:text-gray-600",
                                          )}
                                        >
                                          <Plus className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleEditManualSEStatementItem(
                                              seStatementDialogContext.occId,
                                              absoluteIdx,
                                              "type",
                                              "out",
                                            )
                                          }
                                          className={cn(
                                            "h-full px-1.5 rounded text-[11px] font-semibold transition-all flex items-center",
                                            item.type === "out"
                                              ? "bg-rose-500 text-white shadow-sm"
                                              : "text-gray-400 hover:text-gray-600",
                                          )}
                                        >
                                          <Minus className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                      <Input
                                        type="text"
                                        value={formatNumberWithCommas(item.amount)}
                                        onChange={(e) =>
                                          handleEditManualSEStatementItem(
                                            seStatementDialogContext.occId,
                                            absoluteIdx,
                                            "amount",
                                            e.target.value.replace(/,/g, ""),
                                          )
                                        }
                                        className="h-8 !text-xs text-right bg-white min-w-[70px] w-full"
                                        placeholder="0.00"
                                      />
                                    </div>
                                </TableCell>
                                <TableCell className="py-2.5">
                                  <div className="flex items-center gap-2 justify-between">
                                    {!item.included ? (
                                      <div
                                        onClick={(e) => e.stopPropagation()}
                                        className="flex-1 flex flex-col gap-1.5"
                                      >
                                        <Select
                                          value={item.excludeReason || ""}
                                          onValueChange={(val) =>
                                            handleUpdateSEStatementExcludeReason(
                                              seStatementDialogContext.occId,
                                              absoluteIdx,
                                              val,
                                            )
                                          }
                                        >
                                          <SelectTrigger className="h-8 text-[11px] bg-white">
                                            <SelectValue placeholder="เลือกเหตุผล..." />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {SE_STATEMENT_EXCLUDE_REASONS.map(
                                              (r) => (
                                                <SelectItem
                                                  key={r.value}
                                                  value={r.value}
                                                  className="text-[11px]"
                                                >
                                                  {r.label}
                                                </SelectItem>
                                              ),
                                            )}
                                          </SelectContent>
                                        </Select>
                                        <Textarea
                                          value={(item as any).note || ""}
                                          onChange={(e) =>
                                            handleUpdateSEStatementNote(
                                              seStatementDialogContext.occId,
                                              absoluteIdx,
                                              e.target.value,
                                            )
                                          }
                                          rows={1}
                                          className="min-h-[32px] !text-[11px] bg-white resize-none overflow-hidden py-2"
                                          placeholder="หมายเหตุ..."
                                          onInput={(e) => {
                                            const t = e.target as HTMLTextAreaElement;
                                            t.style.height = "auto";
                                            t.style.height = t.scrollHeight + "px";
                                          }}
                                        />
                                      </div>
                                    ) : (
                                      <div
                                        onClick={(e) => e.stopPropagation()}
                                        className="flex-1"
                                      >
                                        <Textarea
                                          value={(item as any).note || ""}
                                          onChange={(e) =>
                                            handleUpdateSEStatementNote(
                                              seStatementDialogContext.occId,
                                              absoluteIdx,
                                              e.target.value,
                                            )
                                          }
                                          rows={1}
                                          className="min-h-[32px] !text-[11px] bg-white resize-none overflow-hidden py-2"
                                          placeholder="หมายเหตุ..."
                                          onInput={(e) => {
                                            const t = e.target as HTMLTextAreaElement;
                                            t.style.height = "auto";
                                            t.style.height = t.scrollHeight + "px";
                                          }}
                                        />
                                      </div>
                                    )}

                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteManualSEStatementItem(
                                            seStatementDialogContext.occId,
                                            absoluteIdx,
                                          );
                                        }}
                                        className="h-8 w-8 p-0 shrink-0 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddManualSEStatementItem(
                                          seStatementDialogContext.occId,
                                          absoluteIdx,
                                        );
                                      }}
                                      className="h-7 w-7 p-0 shrink-0 rounded-full text-gray-300 hover:text-gray-600 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
                                      title="แทรกรายการด้านล่าง"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              );
            })()}
          </DialogBody>
          <DialogFooter className="px-6 py-4 bg-white border-t border-gray-100 shrink-0 flex flex-row items-center justify-between sm:justify-between">
            {(() => {
              if (!seStatementDialogContext) return <div />;
              const footerOcc = occupations.find(
                (o: IncomeOccupation) =>
                  o.id === seStatementDialogContext.occId,
              );
              const footerItems = footerOcc?.seStatementItems || [];
              const footerIncluded = footerItems.filter(
                (item) => item.included,
              );
              const footerTotal = footerIncluded.reduce(
                (sum, item) => sum + (Number(item.amount) || 0),
                0,
              );
              return (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">
                    รวมรายได้ ({footerIncluded.length} รายการ):
                  </span>
                  <span className="text-lg font-black text-gray-900 font-mono">
                    {formatNumberWithCommas(footerTotal)}
                  </span>
                  <span className="text-gray-500">บาท</span>
                </div>
              );
            })()}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setSeStatementDialogOpen(false)}
                className="h-9 px-4 rounded-lg text-sm text-gray-600 border-gray-200 hover:bg-gray-50 min-w-[100px]"
              >
                ยกเลิก
              </Button>
              <Button
                className="h-9 px-5 rounded-lg bg-chaiyo-blue hover:bg-chaiyo-blue/90 text-white text-sm min-w-[100px]"
                onClick={() => setSeStatementDialogOpen(false)}
              >
                ยืนยัน
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
