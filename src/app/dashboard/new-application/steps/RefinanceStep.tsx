import { useState } from "react";
import { FileText, Building2, Phone, Info, Plus, Trash2 } from "lucide-react";
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

interface RefinanceStepProps {
    formData: CustomerFormData;
    setFormData: React.Dispatch<React.SetStateAction<CustomerFormData>>;
}

// Mock finance company options
const FINANCE_COMPANIES = [
    { value: "scb", label: "ธนาคารไทยพาณิชย์" },
    { value: "kbank", label: "ธนาคารกสิกรไทย" },
    { value: "bbl", label: "ธนาคารกรุงเทพ" },
    { value: "ktb", label: "ธนาคารกรุงไทย" },
    { value: "bay", label: "ธนาคารกรุงศรีอยุธยา" },
    { value: "ttb", label: "ธนาคารทหารไทยธนชาต" },
    { value: "tisco", label: "ทิสโก้ ไฟแนนเชียล กรุ๊ป" },
    { value: "aeon", label: "อิออน ธนสินทรัพย์" },
    { value: "muang_thai", label: "เมืองไทย แคปปิตอล" },
    { value: "sri_savings", label: "ศรีสวัสดิ์ เงินติดล้อ" },
    { value: "ngern_tid_lo", label: "เงินติดล้อ" },
    { value: "easy_buy", label: "อีซี่บาย" },
    { value: "other", label: "อื่นๆ" },
];

const THAI_MONTHS = [
    { value: "01", label: "มกราคม" },
    { value: "02", label: "กุมภาพันธ์" },
    { value: "03", label: "มีนาคม" },
    { value: "04", label: "เมษายน" },
    { value: "05", label: "พฤษภาคม" },
    { value: "06", label: "มิถุนายน" },
    { value: "07", label: "กรกฎาคม" },
    { value: "08", label: "สิงหาคม" },
    { value: "09", label: "กันยายน" },
    { value: "10", label: "ตุลาคม" },
    { value: "11", label: "พฤศจิกายน" },
    { value: "12", label: "ธันวาคม" },
];

const currentBEYear = new Date().getFullYear() + 543;
const BE_YEARS = Array.from({ length: 6 }, (_, i) => String(currentBEYear - 5 + i));

export function RefinanceStep({ formData, setFormData }: RefinanceStepProps) {
    // Section 1 state
    const [financeCompany, setFinanceCompany] = useState("");
    const [contractNo, setContractNo] = useState("");
    const [contractDate, setContractDate] = useState("");
    const [loanAmount, setLoanAmount] = useState("");
    const [loanTerm, setLoanTerm] = useState("");
    const [monthlyInstallment, setMonthlyInstallment] = useState("");

    // Section 2 state
    const [hasCashCard, setHasCashCard] = useState(false);
    const [cashCardNumber, setCashCardNumber] = useState("");
    const [hasApplication, setHasApplication] = useState(false);

    // ยอดหนี้ที่ต้องชำระเพื่อปิดบัญชี
    const [closureDate, setClosureDate] = useState("");
    const [closureAmount, setClosureAmount] = useState("");

    // ค่าปรับ หรือ ค่าธรรมเนียม
    const [hasPenalty, setHasPenalty] = useState(false);
    const [penaltyAmount, setPenaltyAmount] = useState("");
    const [feeAmount, setFeeAmount] = useState("");

    // สินเชื่ออื่นๆ
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

    // ตรวจสอบการต่อภาษีรถประจำปี
    const [lastTaxMonth, setLastTaxMonth] = useState("");
    const [lastTaxYear, setLastTaxYear] = useState("");
    const [taxExpiryMonth, setTaxExpiryMonth] = useState("");
    const [taxExpiryYear, setTaxExpiryYear] = useState("");

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
                        สัญญาเงินกู้
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        {/* ชื่อไฟแนนซ์เดิม */}
                        <div className="space-y-1.5">
                            <Label>
                                ชื่อไฟแนนซ์เดิม <span className="text-red-500">*</span>
                            </Label>
                            <Select value={financeCompany} onValueChange={setFinanceCompany}>
                                <SelectTrigger className="h-11 bg-white">
                                    <SelectValue placeholder="เลือกชื่อไฟแนนซ์" />
                                </SelectTrigger>
                                <SelectContent>
                                    {FINANCE_COMPANIES.map((fc) => (
                                        <SelectItem key={fc.value} value={fc.value}>
                                            {fc.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                </CardContent>
            </Card>

            {/* ── Section 2: ข้อมูลสินเชื่อจาก Finance เดิม ──────────── */}
            <Card className="border-border-strong">
                <CardHeader className="bg-blue-50/50 border-b border-border-strong pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-chaiyo-blue">
                        <Building2 className="w-5 h-5" />
                        ข้อมูลสินเชื่อจาก Finance เดิม
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 pt-6 space-y-6">
                    {/* Staff Guidance Callout */}
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                        <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                            <Phone className="w-4.5 h-4.5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-amber-800">
                                คำแนะนำสำหรับพนักงาน
                            </p>
                            <p className="text-sm text-amber-700 mt-1 leading-relaxed">
                                ให้ลูกค้าโทรศัพท์สอบถามไฟแนนซ์เดิม และเปิด Speaker Phone เพื่อให้พนักงานได้ยินการสนทนา
                                แล้วกรอกรายละเอียดดังนี้
                            </p>
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
                                        onCheckedChange={(checked) => {
                                            setHasCashCard(!!checked);
                                            if (!checked) setCashCardNumber("");
                                        }}
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

                            {/* Conditional: หมายเลขบัตรกดเงินสด */}
                            {hasCashCard && (
                                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                                    <Label>
                                        หมายเลขบัตรกดเงินสด <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        value={cashCardNumber}
                                        onChange={(e) => setCashCardNumber(e.target.value)}
                                        placeholder="ระบุหมายเลขบัตรกดเงินสด"
                                        className="h-11 bg-white max-w-md"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* ── ยอดหนี้ที่ต้องชำระเพื่อปิดบัญชี ────────────── */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-gray-700">
                            ยอดหนี้ที่ต้องชำระเพื่อปิดบัญชี
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                            <div className="space-y-1.5">
                                <Label>
                                    วันที่ปิดบัญชี <span className="text-red-500">*</span>
                                </Label>
                                <DatePickerBE
                                    value={closureDate}
                                    onChange={setClosureDate}
                                    placeholder="DD/MM/YYYY"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label>
                                    ยอดหนี้ปิดบัญชี <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <Input
                                        value={closureAmount}
                                        onChange={handleAmountChange(setClosureAmount)}
                                        placeholder="0.00"
                                        className="pr-12 h-11 bg-white"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                                        บาท
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* ── ค่าปรับ หรือ ค่าธรรมเนียม ──────────────────── */}
                    <div className="space-y-2">
                        <h4 className="text-sm font-bold text-gray-700">
                            ค่าปรับและค่าธรรมเนียม
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
                                                ยอดรวมของค่าปรับและค่าธรรมเนียม
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-right">
                                            <span className="text-sm font-bold text-gray-900 font-mono">
                                                {(() => {
                                                    const p = Number((penaltyAmount || "0").replace(/,/g, "")) || 0;
                                                    const f = Number((feeAmount || "0").replace(/,/g, "")) || 0;
                                                    const total = p + f;
                                                    return total > 0 ? formatNumberWithCommas(String(total)) : "-";
                                                })()}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* ── สินเชื่ออื่นๆ ที่ผูกกับรถคันนี้ ────────────── */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-gray-700">
                                มีสินเชื่ออื่นๆ ที่ผูกกับรถคันนี้
                            </h4>
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
                                    ยังไม่มีรายการสินเชื่ออื่นๆ
                                </p>
                            </div>
                        )}
                    </div>

                    <hr className="border-gray-100" />

                    {/* ── วิธีชำระหนี้ปิดบัญชี ──────────────────────── */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-gray-700">
                            วิธีชำระหนี้ปิดบัญชี
                        </h4>
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

                    <hr className="border-gray-100" />

                    {/* ── ตรวจสอบการต่อภาษีรถประจำปี ───────────── */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-gray-700">
                            ตรวจสอบการต่อภาษีรถประจำปี (ตรวจสอบจากป้ายวงกลม)
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                            {/* ชำระภาษีครั้งสุดท้าย */}
                            <div className="space-y-1.5">
                                <Label>ชำระภาษีครั้งสุดท้าย</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Select value={lastTaxMonth} onValueChange={setLastTaxMonth}>
                                        <SelectTrigger className="h-11 bg-white">
                                            <SelectValue placeholder="เดือน" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {THAI_MONTHS.map((m) => (
                                                <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select value={lastTaxYear} onValueChange={setLastTaxYear}>
                                        <SelectTrigger className="h-11 bg-white">
                                            <SelectValue placeholder="ปี (พ.ศ.)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {BE_YEARS.map((y) => (
                                                <SelectItem key={y} value={y}>{y}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* สิ้นสุดเดือน */}
                            <div className="space-y-1.5">
                                <Label>สิ้นสุดเดือน</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Select value={taxExpiryMonth} onValueChange={setTaxExpiryMonth}>
                                        <SelectTrigger className="h-11 bg-white">
                                            <SelectValue placeholder="เดือน" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {THAI_MONTHS.map((m) => (
                                                <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select value={taxExpiryYear} onValueChange={setTaxExpiryYear}>
                                        <SelectTrigger className="h-11 bg-white">
                                            <SelectValue placeholder="ปี (พ.ศ.)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {BE_YEARS.map((y) => (
                                                <SelectItem key={y} value={y}>{y}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

