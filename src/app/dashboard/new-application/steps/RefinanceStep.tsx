import { useState } from "react";
import { FileText, Phone, Info, Plus, Trash2, Home, ClipboardCheck, Calendar } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DatePickerBE } from "@/components/ui/DatePickerBE";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/Table";
import { CustomerFormData } from "@/types/application";
import { Combobox } from "@/components/ui/combobox";
import { cn } from "@/lib/utils";

interface RefinanceStepProps {
    formData: CustomerFormData;
    setFormData: React.Dispatch<React.SetStateAction<CustomerFormData>>;
}

// Mock staff list for assessor
const MOCK_STAFF_LIST = [
    { id: "S001", code: "S001", name: "สมชาย ใจดี", phone: "081-234-5678" },
    { id: "S002", code: "S002", name: "สุดา รักงาน", phone: "089-876-5432" },
    { id: "S003", code: "S003", name: "วิชัย มุ่งดี", phone: "090-111-2233" },
    { id: "S004", code: "S004", name: "มานี ตั้งใจ", phone: "086-444-5566" },
    { id: "S005", code: "S005", name: "ปรียา สุขสม", phone: "092-777-8899" },
];

// Mock finance company options
const FINANCE_COMPANIES = [
    { value: "scb", label: "ธนาคารไทยพาณิชย์", icon: "/bank-logo/Type=SCB.svg" },
    { value: "kbank", label: "ธนาคารกสิกรไทย", icon: "/bank-logo/Type=KBank.svg" },
    { value: "bbl", label: "ธนาคารกรุงเทพ", icon: "/bank-logo/Type=BBL.svg" },
    { value: "ktb", label: "ธนาคารกรุงไทย", icon: "/bank-logo/Type=Krungthai Bank.svg" },
    { value: "bay", label: "ธนาคารกรุงศรีอยุธยา", icon: "/bank-logo/Type=Bank of Ayudhya (Krungsri).svg" },
    { value: "ttb", label: "ธนาคารทหารไทยธนชาต", icon: "/bank-logo/Type=TTB.svg" },
    { value: "tisco", label: "ทิสโก้ ไฟแนนเชียล กรุ๊ป", icon: "/bank-logo/Type=TISCO.svg" },
    { value: "aeon", label: "อิออน ธนสินทรัพย์", icon: "/bank-logo/Type=Default.svg" },
    { value: "muang_thai", label: "เมืองไทย แคปปิตอล", icon: "/bank-logo/Type=Default.svg" },
    { value: "sri_savings", label: "ศรีสวัสดิ์ เงินติดล้อ", icon: "/bank-logo/Type=Default.svg" },
    { value: "ngern_tid_lo", label: "เงินติดล้อ", icon: "/bank-logo/Type=Default.svg" },
    { value: "easy_buy", label: "อีซี่บาย", icon: "/bank-logo/Type=Default.svg" },
    { value: "other", label: "อื่นๆ โปรดระบุ", icon: "" },
];


export function RefinanceStep({ formData, setFormData }: RefinanceStepProps) {
    // Section 1 state
    const [financeCompany, setFinanceCompany] = useState("");
    const [financeCompanyOther, setFinanceCompanyOther] = useState("");
    const [financeCompanyBranch, setFinanceCompanyBranch] = useState("");
    const [contractNo, setContractNo] = useState("");
    const [contractDate, setContractDate] = useState("");
    const [loanAmount, setLoanAmount] = useState("");
    const [loanTerm, setLoanTerm] = useState("");
    const [monthlyInstallment, setMonthlyInstallment] = useState("");

    // Section 2 state
    const [hasCashCard, setHasCashCard] = useState(false);

    const [hasApplication, setHasApplication] = useState(false);

    // ยอดหนี้ที่ต้องชำระเพื่อปิดบัญชี
    const closureDate = (() => {
        const d = new Date();
        d.setDate(d.getDate() + 7);
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear() + 543;
        return `${dd}/${mm}/${yyyy}`;
    })();
    const [closureAmount, setClosureAmount] = useState("");

    // ค่าปรับ หรือ ค่าธรรมเนียม
    const [hasPenalty, setHasPenalty] = useState(false);
    const [penaltyAmount, setPenaltyAmount] = useState("");
    const [feeAmount, setFeeAmount] = useState("");

    // สินเชื่ออื่นๆ
    const [hasOtherLoans, setHasOtherLoans] = useState<boolean | null>(null);
    const [otherLoans, setOtherLoans] = useState<{ id: number; name: string }[]>([]);

    // วิธีชำระหนี้ปิดบัญชี
    const [paymentMethod, setPaymentMethod] = useState("");
    const [paymentMethodOther, setPaymentMethodOther] = useState("");

    // สถานะบัญชี
    const [hasOverdue, setHasOverdue] = useState(false);
    const [overdueInstallments, setOverdueInstallments] = useState("");

    // วิธีการรับเล่มคืน
    const [bookReturnMethod, setBookReturnMethod] = useState("");
    const [bookReturnDays, setBookReturnDays] = useState("");

    // ข้อมูลที่อยู่อาศัยปัจจุบัน
    const [housingType, setHousingType] = useState("");
    const [housingTypeOther, setHousingTypeOther] = useState("");
    const [housingStatus, setHousingStatus] = useState("");
    const [housingDurationYears, setHousingDurationYears] = useState("");
    const [housingDurationMonths, setHousingDurationMonths] = useState("");
    const [livingWith, setLivingWith] = useState("");
    const [livingWithRelationships, setLivingWithRelationships] = useState<string[]>([]);

    // ผู้ประเมินสถานที่ทำงาน
    const [assessorId, setAssessorId] = useState(MOCK_STAFF_LIST[0].id);
    const [assessorPhone, setAssessorPhone] = useState(MOCK_STAFF_LIST[0].phone);
    const [assessmentDate, setAssessmentDate] = useState("");


    const formatNumberWithCommas = (val: string) => {
        const clean = val.replace(/[^0-9.]/g, "");
        const parts = clean.split(".");
        if (parts.length > 2) return parts[0] + "." + parts.slice(1).join("");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        if (parts.length === 2 && parts[1].length > 2) {
            parts[1] = parts[1].slice(0, 2);
        }
        return parts.join(".");
    };

    const handleAmountChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/,/g, "");
        if (/^[0-9]*\.?[0-9]*$/.test(raw)) {
            setter(formatNumberWithCommas(raw));
        }
    };

    const handleTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/[^0-9]/g, "");
        setLoanTerm(raw);
    };

    return (
        <div className="space-y-6">
            {/* ── Section 1: สัญญาเงินกู้ ────────────────────────────── */}
            <Card className="border-border-strong">
                <CardHeader className="bg-blue-50/50 border-b border-border-strong pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-chaiyo-blue">
                        <FileText className="w-5 h-5" />
                        ข้อมูลสินเชื่อเดิม
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 pt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        {/* ชื่อไฟแนนซ์เดิม */}
                        <div className="space-y-1.5">
                            <Label>
                                ชื่อสถาบันการเงิน/ไฟแนนซ์เดิม
                                <span className="text-red-500">*</span>
                            </Label>
                            <Select value={financeCompany} onValueChange={(val) => {
                                setFinanceCompany(val);
                                if (val !== "other") setFinanceCompanyOther("");
                            }}>
                                <SelectTrigger className="h-11 bg-white">
                                    <SelectValue placeholder="เลือกชื่อไฟแนนซ์">
                                        {financeCompany && (() => {
                                            const selected = FINANCE_COMPANIES.find(fc => fc.value === financeCompany);
                                            if (!selected) return null;
                                            return (
                                                <span className="flex items-center gap-2">
                                                    {selected.icon && (
                                                        <img src={selected.icon} alt="" className="w-5 h-5 rounded-sm object-contain" />
                                                    )}
                                                    {selected.label}
                                                </span>
                                            );
                                        })()}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {FINANCE_COMPANIES.map((fc) => (
                                        <SelectItem key={fc.value} value={fc.value}>
                                            <span className="flex items-center gap-2">
                                                {fc.icon ? (
                                                    <img src={fc.icon} alt="" className="w-5 h-5 rounded-sm object-contain" />
                                                ) : (
                                                    <span className="w-5 h-5" />
                                                )}
                                                {fc.label}
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {financeCompany === "other" && (
                                <Input
                                    value={financeCompanyOther}
                                    onChange={(e) => setFinanceCompanyOther(e.target.value)}
                                    placeholder="ระบุชื่อสถาบันการเงิน/ไฟแนนซ์"
                                    className="h-11 bg-white mt-2 animate-in fade-in slide-in-from-top-1 duration-200"
                                />
                            )}
                        </div>

                        {/* ชื่อสาขาของ Finance เดิม */}
                        <div className="space-y-1.5">
                            <Label>
                                ชื่อสาขาของไฟแนนซ์เดิม
                            </Label>
                            <Input
                                value={financeCompanyBranch}
                                onChange={(e) => setFinanceCompanyBranch(e.target.value)}
                                placeholder="ระบุชื่อสาขา"
                                className="h-11 bg-white"
                            />
                        </div>

                        {/* เลขที่สัญญา */}
                        <div className="space-y-1.5">
                            <Label>
                                เลขที่สัญญา <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                value={contractNo}
                                onChange={(e) => setContractNo(e.target.value)}
                                placeholder="ระบุเลขที่สัญญา"
                                className="h-11 bg-white"
                            />
                        </div>

                        {/* วันที่ทำสัญญา */}
                        <div className="space-y-1.5">
                            <Label>
                                วันที่ทำสัญญา <span className="text-red-500">*</span>
                            </Label>
                            <DatePickerBE
                                value={contractDate}
                                onChange={setContractDate}
                                placeholder="DD/MM/YYYY"
                            />
                        </div>

                        {/* วงเงินกู้ */}
                        <div className="space-y-1.5">
                            <Label>
                                วงเงินกู้ <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <Input
                                    value={loanAmount}
                                    onChange={handleAmountChange(setLoanAmount)}
                                    placeholder="0.00"
                                    className="pr-12 h-11 bg-white"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                                    บาท
                                </span>
                            </div>
                        </div>

                        {/* ระยะเวลาผ่อน */}
                        <div className="space-y-1.5">
                            <Label>
                                ระยะเวลาผ่อน <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <Input
                                    value={loanTerm}
                                    onChange={handleTermChange}
                                    placeholder="0"
                                    className="pr-14 h-11 bg-white"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                                    เดือน
                                </span>
                            </div>
                        </div>

                        {/* ค่างวดต่อเดือน */}
                        <div className="space-y-1.5">
                            <Label>
                                ค่างวดต่อเดือน <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <Input
                                    value={monthlyInstallment}
                                    onChange={handleAmountChange(setMonthlyInstallment)}
                                    placeholder="0.00"
                                    className="pr-12 h-11 bg-white"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                                    บาท
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* กรณีมีบัตรกดเงินสด และ Application */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-gray-700">
                            กรณีมีบัตรกดเงินสด และ Application
                        </h4>

                        <div className="space-y-4 pl-1">
                            {/* Checkboxes in same row */}
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2.5">
                                    <Checkbox
                                        id="hasCashCard"
                                        checked={hasCashCard}
                                        onCheckedChange={(checked) => setHasCashCard(!!checked)}
                                    />
                                    <Label htmlFor="hasCashCard" className="text-sm font-medium text-gray-700 cursor-pointer">
                                        มีบัตรกดเงินสด
                                    </Label>
                                </div>

                                <div className="flex items-center gap-2.5">
                                    <Checkbox
                                        id="hasApplication"
                                        checked={hasApplication}
                                        onCheckedChange={(checked) => setHasApplication(!!checked)}
                                    />
                                    <Label htmlFor="hasApplication" className="text-sm font-medium text-gray-700 cursor-pointer">
                                        มี Application
                                    </Label>
                                </div>
                            </div>
                        </div>

                        {/* Staff Instructions - conditional based on checkbox state */}
                        {(hasCashCard || hasApplication) && (
                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl animate-in fade-in slide-in-from-top-1 duration-200">
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                                        <Phone className="w-4.5 h-4.5 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-amber-800">
                                            คำแนะนำสำหรับพนักงาน — กรณีลูกค้ามีบัตรกดเงินสด หรือ มี App หรือทั้งคู่
                                        </p>
                                        <ol className="text-sm text-amber-700 mt-2 leading-relaxed list-decimal list-inside space-y-1">
                                            <li>ให้ลูกค้าโทรศัพท์มือถือ ติดต่อเจ้าหน้าที่ Call Center เจ้าหนี้เดิม (เช่น เงินติดล้อ 0880880880)</li>
                                            <li>ให้เปิด Speaker Phone แจ้งยกเลิกบัตร / App. ด้วยตนเอง</li>
                                            <li>พนักงานต้องได้ยินเสียงเจ้าหน้าที่ Call Center &quot;แจ้งว่าได้ยกเลิกบัตร หรือ ยกเลิก App. แล้ว&quot;</li>
                                            <li>หลังจากนั้นให้ลูกค้าทำลายบัตรด้วยตนเอง ต่อหน้าพนักงาน</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        )}

                        {(hasCashCard || hasApplication) && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-xl animate-in fade-in slide-in-from-top-1 duration-200">
                                <p className="text-sm text-red-700 font-medium leading-relaxed">
                                    *** กรณีลูกค้ามีบัตรกดเงินสด แต่ไม่ได้นำบัตรติดตัวมาด้วย <span className="font-bold">ห้ามรับทำสินเชื่อเด็ดขาด</span> ต้องให้ลูกค้านำบัตรมาแสดงกับพนักงาน เพื่อแจ้งยกเลิกบัตรกดเงินสด และทำลายบัตรต่อหน้าพนักงาน (คำสั่งที่ 145/2566)
                                </p>
                            </div>
                        )}

                        {!hasCashCard && !hasApplication && (
                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl animate-in fade-in slide-in-from-top-1 duration-200">
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                                        <Phone className="w-4.5 h-4.5 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-amber-800">
                                            คำแนะนำสำหรับพนักงาน — กรณีลูกค้าแจ้งว่าไม่มีบัตรกดเงินสด และไม่มี App.
                                        </p>
                                        <ol className="text-sm text-amber-700 mt-2 leading-relaxed list-decimal list-inside space-y-1">
                                            <li>ให้ลูกค้าโทรศัพท์ ติดต่อเจ้าหน้าที่ Call Center เจ้าหนี้เดิม (เช่น เงินติดล้อ 0880880880)</li>
                                            <li>ให้เปิด Speaker Phone และให้ลูกค้าสอบถามเจ้าหน้าที่ Call Center ว่าตนเองมีบัตร / App. หรือไม่</li>
                                            <li>พนักงานต้องได้ยินเจ้าหน้าที่ Call Center &quot;แจ้งว่าลูกค้าไม่มีบัตรกดเงินสด / App.&quot;</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <hr className="border-gray-100" />

                    {/* ── ยอดหนี้ที่ต้องชำระเพื่อปิดบัญชี ────────────── */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-gray-700">
                            ยอดหนี้ที่ต้องชำระเพื่อปิดบัญชี
                        </h4>

                        <div className="border border-border-strong rounded-xl overflow-hidden bg-white">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50%]">รายการ</TableHead>
                                        <TableHead className="text-right">จำนวนเงิน (บาท)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {/* ยอดหนี้ปิดบัญชี */}
                                    <TableRow className="hover:bg-gray-50/50 transition-colors">
                                        <TableCell className="px-4 py-3">
                                            <span className="text-sm text-gray-700">
                                                ยอดหนี้ปิดบัญชี ณ วันที่ {closureDate} <span className="text-gray-400">(ล่วงหน้า 7 วัน)</span>
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-4 py-3">
                                            <div className="max-w-[200px] ml-auto">
                                                <Input
                                                    value={closureAmount}
                                                    onChange={handleAmountChange(setClosureAmount)}
                                                    placeholder="0.00"
                                                    className="h-9 bg-white text-right"
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>

                                    {/* ค่าปรับ */}
                                    <TableRow className="hover:bg-gray-50/50 transition-colors">
                                        <TableCell className="px-4 py-3">
                                            <span className="text-sm text-gray-700">
                                                ค่าปรับ
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-4 py-3">
                                            <div className="max-w-[200px] ml-auto">
                                                <Input
                                                    value={penaltyAmount}
                                                    onChange={handleAmountChange(setPenaltyAmount)}
                                                    placeholder="0.00"
                                                    className="h-9 bg-white text-right"
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>

                                    {/* ค่าธรรมเนียม */}
                                    <TableRow className="hover:bg-gray-50/50 transition-colors">
                                        <TableCell className="px-4 py-3">
                                            <span className="text-sm text-gray-700">
                                                ค่าธรรมเนียม
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-4 py-3">
                                            <div className="max-w-[200px] ml-auto">
                                                <Input
                                                    value={feeAmount}
                                                    onChange={handleAmountChange(setFeeAmount)}
                                                    placeholder="0.00"
                                                    className="h-9 bg-white text-right"
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>

                                    {/* ยอดรวม */}
                                    <TableRow className="bg-gray-50 hover:bg-gray-50 border-t border-border-strong">
                                        <TableCell className="px-4 py-3">
                                            <span className="text-sm font-bold text-gray-800">
                                                ยอดรวมที่ต้องชำระเพื่อปิดบัญชี
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-right">
                                            <span className="text-sm font-bold text-gray-900 font-mono">
                                                {(() => {
                                                    const c = Number((closureAmount || "0").replace(/,/g, "")) || 0;
                                                    const p = Number((penaltyAmount || "0").replace(/,/g, "")) || 0;
                                                    const f = Number((feeAmount || "0").replace(/,/g, "")) || 0;
                                                    const total = c + p + f;
                                                    return total > 0 ? formatNumberWithCommas(String(total)) : "-";
                                                })()}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                            <div className="space-y-1.5">
                                <Label>
                                    วิธีชำระหนี้ปิดบัญชี <span className="text-red-500">*</span>
                                </Label>
                                <Select value={paymentMethod} onValueChange={(val) => {
                                    setPaymentMethod(val);
                                    if (val !== "other") setPaymentMethodOther("");
                                }}>
                                    <SelectTrigger className="h-11 bg-white">
                                        <SelectValue placeholder="เลือกวิธีชำระ" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="transfer">โอนเงิน</SelectItem>
                                        <SelectItem value="cash">ชำระเงินสด</SelectItem>
                                        <SelectItem value="cheque">เช็ค</SelectItem>
                                        <SelectItem value="other">อื่นๆ โปรดระบุ</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {paymentMethod === "other" && (
                                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                                    <Label>
                                        ระบุวิธีชำระอื่นๆ <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        value={paymentMethodOther}
                                        onChange={(e) => setPaymentMethodOther(e.target.value)}
                                        placeholder="ระบุวิธีชำระ"
                                        className="h-11 bg-white"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* ── สินเชื่ออื่นๆ ที่ผูกกับรถคันนี้ ────────────── */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-gray-700">
                            มีสินเชื่ออื่นๆ ที่ผูกกับรถคันนี้
                        </h4>

                        <RadioGroup
                            value={hasOtherLoans === true ? "yes" : hasOtherLoans === false ? "no" : ""}
                            onValueChange={(val) => {
                                const isYes = val === "yes";
                                setHasOtherLoans(isYes);
                                if (!isYes) setOtherLoans([]);
                            }}
                            className="flex items-center gap-6 pl-1"
                        >
                            <div className="flex items-center gap-2.5">
                                <RadioGroupItem value="yes" id="otherLoansYes" />
                                <Label htmlFor="otherLoansYes" className="text-sm font-medium text-gray-700 cursor-pointer">
                                    มี
                                </Label>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <RadioGroupItem value="no" id="otherLoansNo" />
                                <Label htmlFor="otherLoansNo" className="text-sm font-medium text-gray-700 cursor-pointer">
                                    ไม่มี
                                </Label>
                            </div>
                        </RadioGroup>

                        <p className="text-xs text-red-500 leading-relaxed pl-1">
                            * หากผู้กู้มีสินเชื่อหลายประเภทกับ Finance เดิม เช่น ผู้กู้มีสินเชื่อจำนำเล่มทะเบียน และมีสินเชื่ออื่นที่ผูกกับรถที่นำมาขอสินเชื่อ Refinance (สินเชื่อหมุนเวียน, สินเชื่อบุคคล) <span className="font-bold">ห้ามรับทำสินเชื่อ</span>
                        </p>

                        {hasOtherLoans === true && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                <div className="flex items-center justify-end">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="h-8 text-xs"
                                        onClick={() => {
                                            setOtherLoans((prev) => [
                                                ...prev,
                                                { id: Date.now(), name: "" },
                                            ]);
                                        }}
                                    >
                                        <Plus className="w-3.5 h-3.5 mr-1" />
                                        เพิ่มรายการ
                                    </Button>
                                </div>

                                {otherLoans.length > 0 ? (
                                    <div className="border border-border-strong rounded-xl overflow-hidden bg-white">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[60px] text-center">ลำดับ</TableHead>
                                                    <TableHead>ชื่อสินเชื่อ</TableHead>
                                                    <TableHead className="w-[60px] text-center">จัดการ</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {otherLoans.map((loan, index) => (
                                                    <TableRow key={loan.id} className="hover:bg-gray-50/50 transition-colors">
                                                        <TableCell className="text-center text-sm text-gray-500 font-medium">
                                                            {index + 1}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Input
                                                                value={loan.name}
                                                                onChange={(e) => {
                                                                    setOtherLoans((prev) =>
                                                                        prev.map((l) =>
                                                                            l.id === loan.id
                                                                                ? { ...l, name: e.target.value }
                                                                                : l
                                                                        )
                                                                    );
                                                                }}
                                                                placeholder="ระบุชื่อสินเชื่อ"
                                                                className="h-9 bg-white border-gray-200"
                                                            />
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <button
                                                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                                onClick={() => {
                                                                    setOtherLoans((prev) =>
                                                                        prev.filter((l) => l.id !== loan.id)
                                                                    );
                                                                }}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : (
                                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex items-center justify-center">
                                        <p className="text-sm text-gray-400">
                                            ยังไม่มีรายการสินเชื่ออื่นๆ — กดปุ่ม &quot;เพิ่มรายการ&quot; เพื่อเพิ่ม
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <hr className="border-gray-100" />

                    {/* ── สถานะบัญชี ──────────────────────────────────── */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-gray-700">
                            สถานะบัญชี
                        </h4>
                        <div className="space-y-3 pl-1">
                            <div className="flex items-center gap-2.5">
                                <Checkbox
                                    id="hasOverdue"
                                    checked={hasOverdue}
                                    onCheckedChange={(checked) => {
                                        setHasOverdue(!!checked);
                                        if (!checked) setOverdueInstallments("");
                                    }}
                                />
                                <Label htmlFor="hasOverdue" className="text-sm font-medium text-gray-700 cursor-pointer">
                                    มีการค้างชำระ
                                </Label>
                            </div>
                            {hasOverdue && (
                                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                                    <Label>
                                        จำนวนงวดที่ค้างชำระ <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative max-w-md">
                                        <Input
                                            value={overdueInstallments}
                                            onChange={(e) => {
                                                const raw = e.target.value.replace(/[^0-9]/g, "");
                                                setOverdueInstallments(raw);
                                            }}
                                            placeholder="0"
                                            className="pr-14 h-11 bg-white"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                                            งวด
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* ── วิธีการรับเล่มคืน ───────────────────────────── */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-gray-700">
                            วิธีการรับเล่มคืน และระยะเวลาในการรับเล่มคืน
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                            <div className="space-y-1.5">
                                <Label>วิธีการรับเล่มคืน</Label>
                                <Input
                                    value={bookReturnMethod}
                                    onChange={(e) => setBookReturnMethod(e.target.value)}
                                    placeholder="ระบุวิธีการรับเล่มคืน"
                                    className="h-11 bg-white"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label>ระยะเวลาในการรับเล่ม</Label>
                                <div className="relative">
                                    <Input
                                        value={bookReturnDays}
                                        onChange={(e) => {
                                            const raw = e.target.value.replace(/[^0-9]/g, "");
                                            setBookReturnDays(raw);
                                        }}
                                        placeholder="0"
                                        className="pr-12 h-11 bg-white"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                                        วัน
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ── Section 2: ข้อมูลที่อยู่อาศัยปัจจุบัน ──────────────── */}
            <Card className="border-border-strong">
                <CardHeader className="bg-blue-50/50 border-b border-border-strong pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-chaiyo-blue">
                        <Home className="w-5 h-5" />
                        ข้อมูลที่อยู่อาศัยปัจจุบัน
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 pt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        {/* สถานที่ตั้ง */}
                        <div className="space-y-1.5">
                            <Label>
                                สถานที่ตั้ง <span className="text-red-500">*</span>
                            </Label>
                            <Select value={housingType} onValueChange={setHousingType}>
                                <SelectTrigger className="h-11 bg-white">
                                    <SelectValue placeholder="ระบุสถานที่ตั้ง" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="สถานที่ตั้งถูกต้อง">สถานที่ตั้งถูกต้อง</SelectItem>
                                    <SelectItem value="สถานที่ตั้งไม่ถูกต้อง">สถานที่ตั้งไม่ถูกต้อง</SelectItem>
                                    <SelectItem value="ไม่พบสถานที่ตั้ง">ไม่พบสถานที่ตั้ง</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* สถานะที่อยู่อาศัย */}
                        <div className="space-y-1.5">
                            <Label>
                                สถานะที่อยู่อาศัย <span className="text-red-500">*</span>
                            </Label>
                            <Select value={housingStatus} onValueChange={setHousingStatus}>
                                <SelectTrigger className="h-11 bg-white">
                                    <SelectValue placeholder="ระบุสถานะที่อยู่อาศัย" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="เป็นของตนเอง (เป็นเจ้าบ้าน)">เป็นของตนเอง (เป็นเจ้าบ้าน)</SelectItem>
                                    <SelectItem value="เป็นผู้อาศัย">เป็นผู้อาศัย</SelectItem>
                                    <SelectItem value="เช่า">เช่า</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* ระยะเวลาที่พักอาศัย */}
                        <div className="space-y-1.5">
                            <Label>
                                ระยะเวลาที่พักอาศัย <span className="text-red-500">*</span>
                            </Label>
                            <div className="flex items-center gap-3">
                                <div className="flex-1 relative">
                                    <Input
                                        type="number"
                                        className="h-11 bg-white pr-12"
                                        placeholder="0"
                                        value={housingDurationYears}
                                        onChange={(e) => setHousingDurationYears(e.target.value)}
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">ปี</span>
                                </div>
                                <div className="flex-1 relative">
                                    <Input
                                        type="number"
                                        className="h-11 bg-white pr-14"
                                        placeholder="0"
                                        max={11}
                                        value={housingDurationMonths}
                                        onChange={(e) => setHousingDurationMonths(e.target.value)}
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">เดือน</span>
                                </div>
                            </div>
                        </div>

                        {/* อาศัยอยู่กับใคร */}
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <Label>
                                    อาศัยอยู่กับใคร <span className="text-red-500">*</span>
                                </Label>
                                <Select value={livingWith} onValueChange={(val) => {
                                    setLivingWith(val);
                                    if (val === "อยู่คนเดียว") {
                                        setLivingWithRelationships([]);
                                    }
                                }}>
                                    <SelectTrigger className="h-11 bg-white">
                                        <SelectValue placeholder="ระบุผู้ที่พักอาศัยอยู่ด้วยกัน" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="อยู่คนเดียว">อยู่คนเดียว</SelectItem>
                                        <SelectItem value="อยู่ร่วมกับผู้อื่น โปรดระบุความสัมพันธ์">อยู่ร่วมกับผู้อื่น โปรดระบุความสัมพันธ์</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {livingWith === "อยู่ร่วมกับผู้อื่น โปรดระบุความสัมพันธ์" && (
                                <div className="space-y-3 p-4 bg-gray-50/50 rounded-xl border border-dashed border-gray-200 animate-in fade-in slide-in-from-top-1 duration-200">
                                    <Label className="text-xs text-muted-foreground">โปรดระบุความสัมพันธ์ (เลือกได้มากกว่า 1)</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {["พ่อ", "แม่", "ลูก", "สามี/ภรรยา/แฟน", "ญาติ", "เพื่อน"].map((relation) => {
                                            const isSelected = livingWithRelationships.includes(relation);
                                            return (
                                                <Button
                                                    key={relation}
                                                    type="button"
                                                    variant={isSelected ? "default" : "outline"}
                                                    className={cn(
                                                        "h-9 px-3 rounded-full text-xs font-medium transition-all",
                                                        isSelected ? "bg-chaiyo-blue hover:bg-chaiyo-blue/90" : "bg-white hover:bg-gray-100 border-border-strong text-gray-700"
                                                    )}
                                                    onClick={() => {
                                                        setLivingWithRelationships(prev =>
                                                            isSelected
                                                                ? prev.filter(r => r !== relation)
                                                                : [...prev, relation]
                                                        );
                                                    }}
                                                >
                                                    {relation}
                                                </Button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* ── ผู้ประเมินสถานที่ทำงาน ──────────────────────── */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                            ผู้ประเมินสถานที่
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                            <div className="md:col-span-2 space-y-1.5">
                                <Label className="flex items-center gap-1.5">
                                    <span>พนักงาน</span>
                                    <span className="text-red-500">*</span>
                                    <span className="text-xs text-muted-foreground font-normal ml-1">(รหัส, ชื่อ-นามสกุล)</span>
                                </Label>
                                <Combobox
                                    options={MOCK_STAFF_LIST.map(s => ({
                                        value: s.id,
                                        label: `${s.code} — ${s.name}`,
                                    }))}
                                    value={assessorId}
                                    onValueChange={(val) => {
                                        const staff = MOCK_STAFF_LIST.find(s => s.id === val);
                                        setAssessorId(val);
                                        if (staff) setAssessorPhone(staff.phone);
                                    }}
                                    placeholder="ค้นหาพนักงาน..."
                                    className="h-11 rounded-xl"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="flex items-center gap-1.5">
                                    <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                                    เบอร์ติดต่อพนักงาน
                                </Label>
                                <Input
                                    value={assessorPhone}
                                    onChange={(e) => setAssessorPhone(e.target.value)}
                                    placeholder="0XX-XXX-XXXX"
                                    className="h-11 bg-white font-mono"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                    วันที่ประเมิน
                                </Label>
                                <DatePickerBE
                                    value={assessmentDate}
                                    onChange={setAssessmentDate}
                                    inputClassName="h-11"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

