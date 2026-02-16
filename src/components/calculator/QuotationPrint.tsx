"use client";

import { cn } from "@/lib/utils";
import { Car, Bike, Truck, Sparkles, MapIcon, Tractor, PiggyBank, FileText } from "lucide-react";

interface QuotationData {
    collateralType: string;
    estimatedValue: number;
    loanAmount: number;
    duration: number;
    monthlyPayment: number;
    interestRate: number;
    totalInterest: number;
    // Vehicle
    brand?: string;
    model?: string;
    year?: string;
    // Land
    landRai?: string;
    landNgan?: string;
    landWah?: string;
    province?: string;
    // Financial
    paymentMethod?: 'installment' | 'bullet';
    income?: number;
    monthlyDebt?: number;
    occupation?: string;
}

interface QuotationPrintProps {
    data: QuotationData;
}

export function QuotationPrint({ data }: QuotationPrintProps) {
    const today = new Date().toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const PRODUCTS = [
        { id: "car", label: "รถเก๋ง / กระบะ", icon: Car },
        { id: "moto", label: "รถมอเตอร์ไซค์", icon: Bike },
        { id: "truck", label: "รถบรรทุก", icon: Truck },
        { id: "agri", label: "รถเพื่อการเกษตร", icon: Tractor },
        { id: "land", label: "โฉนดที่ดิน", icon: MapIcon },
    ];

    const product = PRODUCTS.find(p => p.id === data.collateralType) || PRODUCTS[0];
    const Icon = product.icon;

    // Helper Description for Asset
    const getAssetDescription = () => {
        if (data.collateralType === 'land') {
            return `ที่ดิน ${data.province || ''} [ขนาด ${data.landRai || 0} ไร่ ${data.landNgan || 0} งาน ${data.landWah || 0} ตร.ว.]`;
        }
        return `${data.brand || ''} ${data.model || ''} ${data.year ? `(${data.year})` : ''}`;
    };

    const netIncome = (data.income || 0) - (data.monthlyDebt || 0);

    return (
        <div className="hidden print:block print:w-full print:h-full bg-white text-black font-sans relative">
            <style jsx global>{`
                @media print {
                    @page { margin: 0; size: auto; }
                    body { margin: 0; -webkit-print-color-adjust: exact; }
                }
            `}</style>
            {/* Left Red Border Accent */}
            <div className="fixed top-0 bottom-0 left-0 w-4 bg-[#E51B24] z-50 print:block"></div>

            <div className="p-6 pb-24 pl-10"> {/* Content Container with padding - adjusted left padding */}
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div className="text-left">
                        <h2 className="text-xl font-bold uppercase tracking-wider text-gray-800">ใบเสนอราคา</h2>
                        <p className="text-sm text-gray-500 mt-1">วันที่: {today}</p>
                    </div>

                    <div className="text-right">
                        <img src="/images/logo-chaiyo.svg" alt="Chaiyo Logo" className="h-12 mb-2 ml-auto" />

                    </div>
                </div>

                {/* Content Grid */}
                <div className="space-y-6">

                    {/* 1. Asset Info & Financial Context */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-lg font-bold text-chaiyo-blue">
                                    ข้อมูลหลักประกัน
                                </h3>
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded-full font-bold">ประเมินโดย AI</span>
                            </div>
                            <div className="space-y-2">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">ประเภททรัพย์สิน</p>
                                    <p className="text-base font-medium text-gray-900">{product.label}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">รายละเอียด</p>
                                    <p className="text-base font-medium text-gray-900">{getAssetDescription()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">ราคาประเมินเบื้องต้น</p>
                                    <div className="">
                                        <p className="text-xl font-bold text-gray-900">฿{data.estimatedValue.toLocaleString()}</p>
                                        <p className="text-[10px] text-gray-400 font-light">*ราคาอาจเปลี่ยนแปลงหลังตรวจสภาพจริง</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-800 mb-3">
                                ข้อมูลสุขภาพทางการเงิน
                            </h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">อาชีพ</span>
                                    <span className="font-medium">
                                        {data.occupation === 'office' ? 'พนักงานออฟฟิศ' :
                                            data.occupation === 'business' ? 'เจ้าของธุรกิจ' :
                                                data.occupation === 'farmer' ? 'เกษตรกร' :
                                                    data.occupation === 'salary' ? 'พนักงานบริษัท' :
                                                        data.occupation === 'freelance' ? 'อาชีพอิสระ' :
                                                            data.occupation === 'merchant' ? 'ค้าขาย' :
                                                                data.occupation || '-'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">รายได้รวมต่อเดือน</span>
                                    <span className="font-medium">฿{(data.income || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">ภาระหนี้เดิม</span>
                                    <span className="font-medium text-red-600">-฿{(data.monthlyDebt || 0).toLocaleString()}</span>
                                </div>
                                <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                                    <span className="text-sm font-bold text-gray-800">รายได้สุทธิ</span>
                                    <span className={cn("font-bold text-lg", netIncome < 0 ? "text-red-600" : "text-emerald-600")}>
                                        ฿{netIncome.toLocaleString()}
                                    </span>
                                </div>
                                {/* DSR Calculation */}
                                <div className="pt-2 flex justify-between items-center">
                                    <span className="text-xs font-bold text-gray-500 uppercase">อัตราส่วนภาระหนี้ (DSR)</span>
                                    {(() => {
                                        const newMonthly = data.paymentMethod === 'bullet' ? 0 : data.monthlyPayment;
                                        const totalDebt = (data.monthlyDebt || 0) + newMonthly;
                                        const dsr = data.income ? (totalDebt / data.income) * 100 : 0;
                                        return (
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className={cn("h-full rounded-full", dsr > 70 ? "bg-red-500" : dsr > 50 ? "bg-yellow-500" : "bg-emerald-500")}
                                                        style={{ width: `${Math.min(dsr, 100)}%` }}
                                                    />
                                                </div>
                                                <span className={cn("font-bold text-sm", dsr > 70 ? "text-red-600" : "text-gray-700")}>
                                                    {dsr.toFixed(1)}%
                                                </span>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Loan Proposal */}
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <div className="bg-gray-100 p-3 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-chaiyo-blue flex items-center gap-2">
                                ข้อเสนอสินเชื่อ
                            </h3>
                            <span className="px-3 py-1 bg-white rounded-full text-xs font-bold text-chaiyo-blue border border-gray-200">
                                {data.paymentMethod === 'bullet' ? 'ชำระคืนเงินต้นงวดเดียว' : 'ผ่อนชำระรายเดือน'}
                            </span>
                        </div>
                        <div className="p-4 grid grid-cols-4 gap-4 divide-x divide-gray-100">
                            <div className="px-2">
                                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">วงเงินสินเชื่อ</p>
                                <p className="text-2xl font-black text-chaiyo-blue">฿{data.loanAmount.toLocaleString()}</p>
                            </div>
                            <div className="px-2 pl-4">
                                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">ระยะเวลา</p>
                                <p className="text-2xl font-bold text-gray-800">{data.duration} <span className="text-sm font-normal text-gray-400">งวด</span></p>
                            </div>
                            <div className="px-2 pl-4">
                                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">ดอกเบี้ยรวม</p>
                                <p className="text-2xl font-bold text-gray-800">฿{Math.ceil(data.totalInterest || 0).toLocaleString()}</p>
                                <p className="text-[10px] text-gray-400">({((data.interestRate || 0.24) * 100).toFixed(2)}% ต่อปี)</p>
                            </div>
                            <div className="px-2 pl-4">
                                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                                    {data.paymentMethod === 'bullet' ? 'ยอดชำระคืนทั้งหมด' : 'ยอดผ่อนชำระ/เดือน'}
                                </p>
                                <p className="text-3xl font-black text-emerald-600">
                                    {data.paymentMethod === 'bullet'
                                        ? `฿${Math.ceil(data.loanAmount + (data.totalInterest || 0)).toLocaleString()}`
                                        : `฿${Math.ceil(data.monthlyPayment).toLocaleString()}`
                                    }
                                </p>
                                {data.paymentMethod === 'bullet' && (
                                    <p className="text-[10px] text-red-500">รวมเงินต้นและดอกเบี้ย ณ วันครบกำหนดสัญญา</p>
                                )}
                            </div>
                        </div>
                        {/* Add-on fees section */}
                        <div className="bg-gray-50/50 p-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                            <div className="flex gap-4">
                                <span>ค่าอากรแสตมป์ (ประมาณการ): ฿{(Math.ceil(data.loanAmount * 0.0005)).toLocaleString()}</span>
                                <span>ค่าประเมินหลักทรัพย์: ฿{data.collateralType === 'land' ? '3,000' : '500'}</span>
                            </div>
                            <div className="font-bold text-gray-700">
                                ยอดได้รับสุทธิ (โดยประมาณ): <span className="text-emerald-600 text-sm">฿{(data.loanAmount - (data.loanAmount * 0.0005) - (data.collateralType === 'land' ? 3000 : 500)).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* 4. Required Documents Checklist */}
                    <div>
                        <h3 className="text-sm font-bold border-b border-gray-200 pb-2 mb-3">เอกสารที่ต้องเตรียม</h3>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs text-gray-600">
                            <div className="flex items-center">
                                <div className="w-4 h-4 border border-gray-300 rounded mr-2"></div> บัตรประชาชน (ตัวจริง)
                            </div>
                            <div className="flex items-center">
                                <div className="w-4 h-4 border border-gray-300 rounded mr-2"></div> ทะเบียนบ้าน (ตัวจริง)
                            </div>
                            <div className="flex items-center">
                                <div className="w-4 h-4 border border-gray-300 rounded mr-2"></div> {data.collateralType === 'land' ? 'โฉนดที่ดิน (ตัวจริง - ห้ามเคลือบ)' : 'เล่มทะเบียนรถ (ตัวจริง - ชื่อผู้กู้เป็นเจ้าของ)'}
                            </div>
                            <div className="flex items-center">
                                <div className="w-4 h-4 border border-gray-300 rounded mr-2"></div> สลิปเงินเดือน / หนังสือรับรองเงินเดือน
                            </div>
                            <div className="flex items-center">
                                <div className="w-4 h-4 border border-gray-300 rounded mr-2"></div> รายการเดินบัญชีย้อนหลัง (Statement) 6 เดือน
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer / Disclaimer */}
                <div className="fixed bottom-10 left-8 right-8 text-center pt-4">
                    <p className="text-[10px] text-gray-400 leading-relaxed max-w-2xl mx-auto">
                        *เอกสารนี้เป็นเพียงการประเมินวงเงินและยอดผ่อนชำระเบื้องต้นเท่านั้น ไม่ใช่หนังสืออนุมัติสินเชื่อ <br />
                        ผลการอนุมัติจริงขึ้นอยู่กับการตรวจสอบเครดิตบูโร รายได้ และหลักประกันตามหลักเกณฑ์ของบริษัท AutoX <br />
                        อัตราดอกเบี้ยอาจเปลี่ยนแปลงได้ตามประกาศของบริษัท
                    </p>
                    <div className="mt-2 font-bold text-chaiyo-blue text-xs">
                        สอบถามเพิ่มเติมโทร 02-123-4567 หรือที่สาขาใกล้บ้านท่าน
                    </div>
                </div>

                {/* Branded Footer Strip */}
                <div className="fixed bottom-0 left-0 right-0 flex h-3 print:h-3 z-50">
                    <div className="w-6  bg-chaiyo-gold"></div>
                    <div className="w-24 bg-chaiyo-blue"></div>
                    <div className="w-4 bg-chaiyo-gold"></div>
                    <div className="w-32 bg-[#E51B24]"></div>
                    <div className="w-4 bg-white"></div>
                    <div className="flex-1 bg-chaiyo-blue"></div>
                    <div className="w-4 bg-chaiyo-gold"></div>
                    <div className="w-16 bg-[#E51B24]"></div>
                </div>
            </div> {/* End content container */}
        </div>
    );
}
