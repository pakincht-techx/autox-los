"use client";
import { getMockApp } from "@/lib/mockApplications";
import { cn } from "@/lib/utils";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSidebar } from "@/components/layout/SidebarContext";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CircleCheck, Loader2, ShieldCheck, MapPin, Info, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { DatePickerBE } from "@/components/ui/DatePickerBE";
import { AddressForm } from "@/components/application/AddressForm";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/Table";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/Dialog";
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

// ─── Mock Approved Loan Data ────────────────────────────────────────────────

const APPROVED_LOAN = {
    loanProductLabel: "ULCR",
    loanProductName: "จำนำรถมอเตอร์ไซต์ผ่อนรายเดือน",
    loanAmount: 400000,
    interestRate: 23.99,
    term: 60,
    installment: 3000,
    freebieInsurance: {
        company: "ประกันคุ้มครองวงเงินสินเชื่อ FWD",
        logo: "/insurance-logo/Property 1=FWD.png",
        label: "ฟรี! ความคุ้มครองทันที ไม่มีค่าใช้จ่ายเพิ่มเติม",
    },
    carInsurance: {
        company: "วิริยะประกันภัย",
        logo: "/insurance-logo/Property 1=Viriya.png",
        label: "ประกันรถยนต์ ชั้น 2+",
        tier: "ชั้น 2+",
        premium: 15000,
        coverage: 300000,
        repairType: "ซ่อมศูนย์",
    },
    paInsurance: {
        company: "เทเวศประกันภัย",
        logo: "/insurance-logo/Property 1=Theves.png",
        label: "ประกันอุบัติเหตุส่วนบุคคล (PA)",
        premium: 5000,
        coverage: 500000,
        coveragePeriod: "2 ปี",
        beneficiaries: [
            { rank: 1, name: "บริษัท ออโต้ เอกซ์ จำกัด" },
            { rank: 2, name: "ทายาททางกฎหมาย" },
        ],
    },
};

// ─── Page Component ─────────────────────────────────────────────────────────

export default function ConfirmLoanPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const router = useRouter();
    const searchParams = useSearchParams();
    const isViewMode = searchParams.get('mode') === 'view';
    const { setBreadcrumbs, setHideNavButtons, setHideSaveDraftButton, setOnBack } = useSidebar();

    const [isLoadingDialogOpen, setIsLoadingDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [includeCarInsurance, setIncludeCarInsurance] = useState(true);
    const [includePaInsurance, setIncludePaInsurance] = useState(true);

    const [policyAddress, setPolicyAddress] = useState('registered');
    const [newAddressData, setNewAddressData] = useState<any>({});
    const [deliveryMethod, setDeliveryMethod] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [paymentStartDate, setPaymentStartDate] = useState('');
    const [paymentFormat, setPaymentFormat] = useState('monthly');

    const [wantChaiyoCard, setWantChaiyoCard] = useState('yes');
    const [chaiyoCardNumber, setChaiyoCardNumber] = useState('');

    useEffect(() => {
        if (startDate && startDate.length === 10) {
            const date = new Date(startDate);
            if (!isNaN(date.getTime())) {
                // Auto calculation (e.g. adding 2 years based on PA coverage period)
                date.setFullYear(date.getFullYear() + 2);
                const isoDate = date.toISOString().split('T')[0];
                setEndDate(isoDate);
            }
        } else {
            setEndDate('');
        }
    }, [startDate]);

    const fmt = (n: number) => n.toLocaleString('th-TH');

    // ── Breadcrumbs ─────────────────────────────────────────────────────
    useEffect(() => {
        const app = getMockApp(null, id);
        const appNoShort = app.applicationNo ? app.applicationNo.slice(8) : id;
        const firstName = app.applicantName ? app.applicantName.split(' ')[0] : '';
        setBreadcrumbs([
            { label: `${appNoShort}${firstName ? ` (${firstName})` : ''}`, href: `/dashboard/applications/${id}?from=my` },
            { label: "ยืนยันสินเชื่อ", isActive: true },
        ]);
        setOnBack(() => () => router.back());
        setHideNavButtons(false);
        setHideSaveDraftButton(true);

        return () => {
            setBreadcrumbs([]);
            setHideNavButtons(false);
            setHideSaveDraftButton(false);
            setOnBack(null);
        };
    }, [id, setBreadcrumbs, setHideNavButtons, setHideSaveDraftButton, setOnBack, router]);

    const loan = APPROVED_LOAN;
    const totalInsurancePremium = (includeCarInsurance && loan.carInsurance ? loan.carInsurance.premium : 0) + 
                                  (includePaInsurance && loan.paInsurance ? loan.paInsurance.premium : 0);
    const netAmount = loan.loanAmount + totalInsurancePremium;

    return (
        <div>
            {/* ── Two-Column Checkout Layout ──────────────────────────── */}
            <div className="flex h-[calc(100vh-64px)]">

                {/* ═══ LEFT COLUMN ═══ */}
                <div className="flex-1 min-w-0 space-y-6 bg-gray-50 p-6 overflow-y-auto">
                    {/* Page Title */}
                    <h1 className="text-xl font-bold text-gray-900">ยืนยันสินเชื่อ</h1>

                    <div className={cn("space-y-6", isViewMode && "pointer-events-none opacity-80")}>
                        {/* ── Loan Detail Card ──────────────────────────────── */}
                        <Card className="border-border-strong overflow-hidden">
                        <CardHeader className="bg-blue-50/50 border-b border-border-strong pb-4">
                            <CardTitle className="text-lg flex items-center gap-2 text-chaiyo-blue">
                                รายละเอียดสินเชื่อ
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-6 pb-6 pt-5">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-xs text-gray-500 mb-1">วงเงินอนุมัติ</p>
                                    <p className="text-xl font-bold text-gray-900 tracking-tight">{fmt(loan.loanAmount)} <span className="text-sm font-semibold text-gray-500">บาท</span></p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-xs text-gray-500 mb-1">อัตราดอกเบี้ย</p>
                                    <p className="text-xl font-bold text-gray-900 tracking-tight">{loan.interestRate}% <span className="text-sm font-semibold text-gray-500">ต่อปี</span></p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-xs text-gray-500 mb-1">ข้อมูลสินเชื่อ</p>
                                    <p className="text-sm font-bold text-gray-900">{loan.loanProductName}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{loan.loanProductLabel}</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-xs text-gray-500 mb-1">ระยะเวลาผ่อน</p>
                                    <p className="text-xl font-bold text-gray-900 tracking-tight">{loan.term} <span className="text-sm font-semibold text-gray-500">เดือน</span></p>
                                    <p className="text-xs text-gray-400 mt-0.5">ค่างวด {fmt(loan.installment)} บาท/เดือน</p>
                                </div>
                            </div>

                            {/* ── Payment Start Date Selection ──────────────── */}
                            <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col gap-4">
                                <Label className="text-md font-bold text-gray-900">กำหนดการชำระเงิน</Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2 flex flex-col">
                                        <Label className="text-sm">รูปแบบการผ่อน</Label>
                                        <Select value={paymentFormat} onValueChange={setPaymentFormat}>
                                            <SelectTrigger className="bg-white h-11 rounded-xl">
                                                <SelectValue placeholder="เลือกรูปแบบการผ่อน" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="monthly">ผ่อนรายเดือน</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2 flex flex-col">
                                        <Label className="text-sm">วันที่เริ่มต้นการชำระ</Label>
                                        <DatePickerBE 
                                            value={paymentStartDate}
                                            onChange={(val) => setPaymentStartDate(val)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* ── Insurance Card ────────────────────────────────── */}
                    <Card className="border-border-strong overflow-hidden">
                        <CardHeader className="bg-blue-50/50 border-b border-border-strong pb-4">
                            <CardTitle className="text-lg flex items-center gap-2 text-chaiyo-blue">
                                ประกันภัย
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-6 pb-6 pt-5 space-y-6">

                            {/* ── Freebie Insurance ───────────────────────── */}
                            {loan.freebieInsurance && (
                                <div className="space-y-3">
                                    <div className="flex items-center min-h-[24px]">
                                        <Label className="text-md font-bold">ประกันคุ้มครองวงเงินสินเชื่อ</Label>
                                    </div>
                                    <div className="flex justify-between items-center p-3 rounded-xl border border-gray-200 bg-white">
                                        <div className="flex items-center gap-3">
                                            <img src={loan.freebieInsurance.logo} alt="FWD" className="w-8 h-8 object-contain rounded-md shrink-0" />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-gray-800">{loan.freebieInsurance.company}</span>
                                                <span className="text-xs text-gray-500">{loan.freebieInsurance.label}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── Car Insurance ─────────────────────────── */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-md font-bold">ประกันภัยรถยนต์/ประกันรถมอเตอไซค์</Label>
                                    <RadioGroup
                                        value={includeCarInsurance ? 'yes' : 'no'}
                                        onValueChange={(val) => setIncludeCarInsurance(val === 'yes')}
                                        className="flex items-center gap-4"
                                    >
                                        <div className="flex items-center gap-2">
                                            <RadioGroupItem value="yes" id="car-insurance-yes" />
                                            <Label htmlFor="car-insurance-yes" className="text-sm font-normal cursor-pointer">ต้องการ</Label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <RadioGroupItem value="no" id="car-insurance-no" />
                                            <Label htmlFor="car-insurance-no" className="text-sm font-normal cursor-pointer">ไม่ต้องการ</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {includeCarInsurance && loan.carInsurance && (
                                    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                                        {/* Company Header */}
                                        <div className="flex justify-between items-center p-3">
                                            <div className="flex items-center gap-3">
                                                {loan.carInsurance.logo ? (
                                                    <img src={loan.carInsurance.logo} alt={loan.carInsurance.company} className="w-8 h-8 object-contain rounded-md shrink-0" />
                                                ) : (
                                                    <ShieldCheck className="w-6 h-6 text-chaiyo-blue shrink-0" />
                                                )}
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-gray-800">{loan.carInsurance.company}</span>
                                                    <span className="text-xs text-gray-500">{loan.carInsurance.label}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Detail Rows */}
                                        <div className="divide-y divide-gray-100 border-t border-gray-100">
                                            <div className="flex items-center justify-between px-4 py-2.5">
                                                <span className="text-xs text-gray-500">ทุนประกัน</span>
                                                <span className="text-sm">{fmt(loan.carInsurance.coverage)} บาท</span>
                                            </div>
                                            <div className="flex items-center justify-between px-4 py-2.5">
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-gray-500">ค่าเบี้ยประกัน</span>
                                                    <span className="text-[11px] text-gray-400">*ค่าเบี้ยประกันจะถูกรวมในวงเงินสินเชื่อ</span>
                                                </div>
                                                <span className="text-sm">{fmt(loan.carInsurance.premium)} บาท</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* ── PA Insurance ──────────────────────────── */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-md font-bold">ประกันคุ้มครองวงเงินสินเชื่อ</Label>
                                    <RadioGroup
                                        value={includePaInsurance ? 'yes' : 'no'}
                                        onValueChange={(val) => setIncludePaInsurance(val === 'yes')}
                                        className="flex items-center gap-4"
                                    >
                                        <div className="flex items-center gap-2">
                                            <RadioGroupItem value="yes" id="insurance-yes" />
                                            <Label htmlFor="insurance-yes" className="text-sm font-normal cursor-pointer">ต้องการ</Label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <RadioGroupItem value="no" id="insurance-no" />
                                            <Label htmlFor="insurance-no" className="text-sm font-normal cursor-pointer">ไม่ต้องการ</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {includePaInsurance && loan.paInsurance && (
                                    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                                        {/* Company Header */}
                                        <div className="flex justify-between items-center p-3">
                                            <div className="flex items-center gap-3">
                                                <img src={loan.paInsurance.logo} alt={loan.paInsurance.company} className="w-8 h-8 object-contain rounded-md shrink-0" />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-gray-800">{loan.paInsurance.company}</span>
                                                    <span className="text-xs text-gray-500">{loan.paInsurance.label}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Detail Rows */}
                                        <div className="divide-y divide-gray-100 border-t border-gray-100">
                                            <div className="flex items-center justify-between px-4 py-2.5">
                                                <span className="text-xs text-gray-500">ทุนประกัน</span>
                                                <span className="text-sm">{fmt(loan.paInsurance.coverage)} บาท</span>
                                            </div>
                                            <div className="flex items-center justify-between px-4 py-2.5">
                                                <span className="text-xs text-gray-500">เวลาการคุ้มครอง</span>
                                                <span className="text-sm">{loan.paInsurance.coveragePeriod}</span>
                                            </div>
                                            <div className="flex items-center justify-between px-4 py-2.5">
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-gray-500">ค่าเบี้ยประกัน</span>
                                                    <span className="text-[11px] text-gray-400">*ค่าเบี้ยประกันจะถูกรวมในวงเงินสินเชื่อ</span>
                                                </div>
                                                <span className="text-sm">{fmt(loan.paInsurance.premium)} บาท</span>
                                            </div>

                                            {/* ผู้รับผลประโยชน์ */}
                                            <div className="px-4 py-2.5">
                                                <span className="text-xs font-bold text-gray-600 mb-2 block">ผู้รับผลประโยชน์</span>
                                                <div className="rounded-lg border border-gray-200 overflow-hidden">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow className="bg-gray-50 border-b border-gray-200 hover:bg-gray-50">
                                                                <TableHead className="px-3 py-2 text-left font-semibold text-gray-500 w-16 text-xs">อันดับ</TableHead>
                                                                <TableHead className="px-3 py-2 text-left font-semibold text-gray-500 text-xs">ชื่อผู้รับผลประโยชน์</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {loan.paInsurance.beneficiaries.map((b) => (
                                                                <TableRow key={b.rank} className="hover:bg-transparent">
                                                                    <TableCell className="px-3 py-2.5 text-gray-700 font-medium text-xs">{b.rank}</TableCell>
                                                                    <TableCell className="px-3 py-2.5 text-gray-800 font-semibold text-xs">{b.name}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* ── Additional Insurance Info Form ──────────────── */}
                            <div className="pt-6 border-t border-gray-200 flex flex-col gap-6">
                                <Label className="text-md font-bold text-gray-900">ข้อมูลกรมธรรม์</Label>
                                
                                <div className="grid grid-cols-1 gap-5">
                                    {/* Address Selection with AddressForm */}
                                    <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50/50">
                                        <AddressForm 
                                            title="ที่อยู่บนกรมธรรม์"
                                            formData={newAddressData}
                                            onChange={(field, val) => setNewAddressData((prev: any) => ({ ...prev, [field]: val }))}
                                            hideFields={policyAddress !== 'new'}
                                            headerChildren={
                                                <div className="space-y-4">
                                                    <div>
                                                        <Select value={policyAddress} onValueChange={setPolicyAddress}>
                                                            <SelectTrigger className="bg-white">
                                                                <SelectValue placeholder="เลือกที่อยู่บนกรมธรรม์" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="registered">ตามบัตรประชาชน</SelectItem>
                                                                <SelectItem value="current">ตามที่อยู่ปัจจุบัน</SelectItem>
                                                                <SelectItem value="mailing">ตามที่อยู่จัดส่งเอกสาร</SelectItem>
                                                                <SelectItem value="work">ตามที่อยู่ที่ทำงาน (อาชีพ)</SelectItem>
                                                                <SelectItem value="new">ระบุใหม่</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    {policyAddress === 'registered' && (
                                                        <div className="animate-in slide-in-from-top-1 fade-in">
                                                            <div className="p-3.5 bg-blue-50/50 border border-blue-100 rounded-xl flex items-start gap-3">
                                                                <MapPin className="w-4 h-4 text-chaiyo-blue shrink-0 mt-0.5" />
                                                                <p className="text-sm text-chaiyo-blue leading-relaxed font-semibold">123/45 ถนน สุขุมวิท แขวง คลองเตย เขต คลองเตย กรุงเทพมหานคร 10110</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {policyAddress === 'current' && (
                                                        <div className="animate-in slide-in-from-top-1 fade-in">
                                                            <div className="p-3.5 bg-blue-50/50 border border-blue-100 rounded-xl flex items-start gap-3">
                                                                <MapPin className="w-4 h-4 text-chaiyo-blue shrink-0 mt-0.5" />
                                                                <p className="text-sm text-chaiyo-blue leading-relaxed font-semibold">88/9 หมู่ 1 ต.บ้านทุ่ม อ.เมือง จ.ขอนแก่น 40000</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {policyAddress === 'mailing' && (
                                                        <div className="animate-in slide-in-from-top-1 fade-in">
                                                            <div className="p-3.5 bg-blue-50/50 border border-blue-100 rounded-xl flex items-start gap-3">
                                                                <MapPin className="w-4 h-4 text-chaiyo-blue shrink-0 mt-0.5" />
                                                                <p className="text-sm text-chaiyo-blue leading-relaxed font-semibold">99 หมู่ 5 ต.ศิลา อ.เมือง จ.ขอนแก่น 40000</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {policyAddress === 'work' && (
                                                        <div className="animate-in slide-in-from-top-1 fade-in">
                                                            <div className="p-3.5 bg-blue-50/50 border border-blue-100 rounded-xl flex items-start gap-3">
                                                                <MapPin className="w-4 h-4 text-chaiyo-blue shrink-0 mt-0.5" />
                                                                <p className="text-sm text-chaiyo-blue leading-relaxed font-semibold">บริษัท ตัวอย่าง จำกัด 456 ถนน พระราม 4 แขวง ลุมพินี เขต ปทุมวัน กรุงเทพมหานคร 10330</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            }
                                        />
                                    </div>

                                    {/* Delivery Method */}
                                    <div className="space-y-2">
                                        <Label className="text-sm">วิธีรับกรมธรรม์</Label>
                                        <Select value={deliveryMethod} onValueChange={setDeliveryMethod}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="เลือกวิธีรับกรมธรรม์" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="mail">รับกรมธรรม์ฉบับจริงทางไปรษณีย์</SelectItem>
                                                <SelectItem value="email">รับผ่านช่องทาง Email</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Start Date & End Date Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Start Date */}
                                        <div className="space-y-2 flex flex-col">
                                            <Label className="text-sm flex justify-between items-center h-5">
                                                <span>วันเริ่มคุ้มครอง</span>
                                                <span className="text-xs text-gray-400 font-normal">(ภายใน 90 วัน)</span>
                                            </Label>
                                            <DatePickerBE 
                                                value={startDate} 
                                                onChange={(val) => setStartDate(val)} 
                                            />
                                        </div>

                                        {/* End Date */}
                                        <div className="space-y-2 flex flex-col">
                                            <Label className="text-sm flex items-center h-5">
                                                <span>วันสิ้นสุดคุ้มครอง</span>
                                            </Label>
                                            <DatePickerBE 
                                                value={endDate} 
                                                onChange={() => {}} 
                                                disabled={true} // Auto calculated
                                                placeholder="คำนวณอัตโนมัติ"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </CardContent>
                    </Card>

                    {/* ── Chaiyo Card ─────────────────────────────────────── */}
                    <Card className="border-border-strong overflow-hidden">
                        <CardHeader className="bg-blue-50/50 border-b border-border-strong pb-4">
                            <CardTitle className="text-lg flex items-center gap-2 text-chaiyo-blue">
                                บัตรไชโย
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-6 pb-6 pt-5">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <Label className="text-md font-bold">รับบัตรไชโย</Label>
                                    <RadioGroup
                                        value={wantChaiyoCard}
                                        onValueChange={setWantChaiyoCard}
                                        className="flex items-center gap-6"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="yes" id="chaiyo-yes" />
                                            <Label htmlFor="chaiyo-yes" className="font-medium cursor-pointer">รับ</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="no" id="chaiyo-no" />
                                            <Label htmlFor="chaiyo-no" className="font-medium cursor-pointer">ไม่รับ</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {wantChaiyoCard === 'yes' && (
                                    <div className="animate-in slide-in-from-top-1 fade-in mt-4 pt-4 border-t border-gray-100">
                                        <div className="space-y-2 max-w-sm">
                                            <Label className="text-sm">เลขที่บัตรไชโย <span className="text-red-500">*</span></Label>
                                            <Input 
                                                value={chaiyoCardNumber}
                                                onChange={(e) => setChaiyoCardNumber(e.target.value)}
                                                placeholder="ระบุเลขที่บัตรไชโย 16 หลัก"
                                                maxLength={16}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    </div>

                    {/* ── Footer Actions ──────────────────────────────────── */}
                    {!isViewMode && (
                        <div className="flex justify-end pt-6 pb-6 pointer-events-auto">
                            <Button
                                className="min-w-[140px] h-11 rounded-xl font-bold shadow-none cursor-pointer bg-chaiyo-blue hover:bg-chaiyo-blue/90 text-white"
                                onClick={() => {
                                    setIsLoadingDialogOpen(true);
                                    setTimeout(() => {
                                        setIsLoadingDialogOpen(false);
                                        router.push(`/dashboard/applications/${id}/contract`);
                                    }, 2500);
                                }}
                            >
                                ดำเนินการต่อ
                            </Button>
                        </div>
                    )}
                </div>

                {/* ═══ RIGHT COLUMN — Loan Summary Sidebar ═══ */}
                <div className="w-[340px] shrink-0 px-6 pt-6 overflow-y-auto">
                    {/* Header */}
                    <p className="text-base font-bold text-gray-900 pb-4 border-b border-gray-200">สรุปยอดสินเชื่อ</p>

                    <div className="pt-5 space-y-5">
                        {/* Product Badge + Name */}
                        <div>
                            <span className="px-2.5 py-1 rounded-full bg-[#0d005f] text-white text-[10px] font-bold tracking-wider">
                                {loan.loanProductLabel}
                            </span>
                            <h3 className="text-sm font-bold text-gray-900 mt-3 leading-tight">{loan.loanProductName}</h3>
                        </div>

                        {/* Loan Amount Row */}
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">วงเงิน</span>
                            <span className="font-bold text-gray-900">{fmt(loan.loanAmount)} บาท</span>
                        </div>

                        {/* Insurance Breakdown */}
                        {(includeCarInsurance || includePaInsurance) && (
                            <>
                                <div className="w-full h-px bg-gray-100"></div>
                                {/* Car Insurance */}
                                {includeCarInsurance && loan.carInsurance && (
                                    <>
                                        <div className="flex items-center gap-3">
                                            <img src={loan.carInsurance.logo} alt={loan.carInsurance.company} className="w-9 h-9 object-contain rounded-full bg-white border border-gray-100 p-0.5" />
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">{loan.carInsurance.company}</p>
                                                <p className="text-xs text-gray-400">{loan.carInsurance.label}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">ค่าเบี้ยประกัน</span>
                                            <span className="font-bold text-gray-900">+{fmt(loan.carInsurance.premium)} บาท</span>
                                        </div>
                                    </>
                                )}
                                {/* PA Insurance */}
                                {includePaInsurance && loan.paInsurance && (
                                    <>
                                        {includeCarInsurance && <div className="w-full h-px bg-gray-100"></div>}
                                        <div className="flex items-center gap-3">
                                            <img src={loan.paInsurance.logo} alt={loan.paInsurance.company} className="w-9 h-9 object-contain rounded-full bg-white border border-gray-100 p-0.5" />
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">{loan.paInsurance.company}</p>
                                                <p className="text-xs text-gray-400">{loan.paInsurance.label}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">ค่าเบี้ยประกัน</span>
                                            <span className="font-bold text-gray-900">+{fmt(loan.paInsurance.premium)} บาท</span>
                                        </div>
                                    </>
                                )}
                            </>
                        )}

                        {/* Net Amount */}
                        <div className="w-full h-px bg-gray-200"></div>
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="font-bold text-gray-900 text-sm">วงเงินสุทธิ</p>
                                <p className="text-[11px] text-gray-400 mt-0.5">*รวมวงเงินและเบี้ยประกัน</p>
                            </div>
                            <div className="text-right">
                                <span className="font-black text-gray-900 text-xl">{fmt(netAmount)}</span>
                                <span className="text-sm font-bold text-gray-500 ml-1">บาท</span>
                            </div>
                        </div>

                        {/* Monthly Payment */}
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">ค่าผ่อนต่อเดือน</span>
                            <span className="font-bold text-gray-900">{fmt(loan.installment)} บาท/เดือน</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Loading Contract/e-Signature Dialog ─────────────────────── */}
            <Dialog open={isLoadingDialogOpen} onOpenChange={() => {}}>
                <DialogContent className="sm:max-w-[425px] [&>button]:hidden">
                    <div className="flex flex-col items-center justify-center py-10 space-y-6">
                        <Loader2 className="w-16 h-16 text-chaiyo-blue animate-spin" />
                        <div className="space-y-2 text-center">
                            <h3 className="text-xl font-bold text-gray-900">กำลังดำเนินการ</h3>
                            <p className="text-sm text-gray-500">
                                ระบบกำลังสร้างสัญญาสินเชื่อและเตรียมเข้าสู่<br />ขั้นตอน e-Signature...
                            </p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
