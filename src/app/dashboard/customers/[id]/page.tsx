"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { CustomerHeader } from "./CustomerHeader";
import { LoanAccordionCard } from "./LoanAccordionCard";
import { PaymentHistorySheet } from "./PaymentHistorySheet";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FileText, Clock, Wallet, AlertCircle, ChevronRight, Download } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/Table";

// Mock Data
const MOCK_CUSTOMER = {
    id: "CUST-001",
    name: "สมชาย ใจดี",
    initials: "SJ",
    status: "Active",
    kycStatus: "Verified",
    riskLevel: "Low",
    phone: "081-234-5678",
    activeLoans: 1,
    registeredDate: "2023-10-15",
    email: "somchai.j@example.com",
    dob: "1985-05-12",
    address: "123 ถ.สุขุมวิท แขวงคลองเตย เขตคลองเตย กทม. 10110",
    occupation: "พนักงานบริษัท",
    salary: "45,000",
};

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
    // In a real app, use params.id to fetch data
    const [isHistoryOpen, setIsHistoryOpen] = React.useState(false);
    const [activeLoanId, setActiveLoanId] = React.useState<string | null>("LN-2023-8899");

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            <CustomerHeader customer={MOCK_CUSTOMER} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Tabs defaultValue="overview" className="space-y-8">
                    <TabsList className="bg-transparent p-0 h-auto border-b border-gray-200 w-full justify-start gap-6">
                        <TabsTrigger value="overview" className="text-base h-11 px-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-chaiyo-blue data-[state=active]:text-chaiyo-blue">ภาพรวม</TabsTrigger>
                        <TabsTrigger value="profile" className="text-base h-11 px-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-chaiyo-blue data-[state=active]:text-chaiyo-blue">ข้อมูลส่วนตัว</TabsTrigger>
                        <TabsTrigger value="loans" className="text-base h-11 px-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-chaiyo-blue data-[state=active]:text-chaiyo-blue">ประวัติสินเชื่อ</TabsTrigger>
                        <TabsTrigger value="documents" className="text-base h-11 px-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-chaiyo-blue data-[state=active]:text-chaiyo-blue">เอกสาร</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
                        {/* Financial Snapshot */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <SummaryCard
                                title="ยอดหนี้คงเหลือ"
                                value="฿ 12,450.00"
                                subtext="จากวงเงินทั้งหมด ฿ 50,000"
                                icon={<Wallet className="h-5 w-5 text-chaiyo-blue" />}
                            />
                            <SummaryCard
                                title="ค่างวดที่ต้องชำระ"
                                value="฿ 2,500.00"
                                subtext="กำหนดชำระ: 25 ก.พ. 2024"
                                icon={<Clock className="h-5 w-5 text-orange-500" />}
                                highlight
                            />
                            <SummaryCard
                                title="เกรดการชำระหนี้"
                                value="A+"
                                subtext="ตรงเวลาต่อเนื่อง 12 เดือน"
                                icon={<FileText className="h-5 w-5 text-green-500" />}
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Active Loan Section */}
                            <div className="lg:col-span-2 space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    สินเชื่อที่ใช้งานอยู่
                                    <Badge variant="neutral" className="ml-2">1</Badge>
                                </h3>

                                <LoanAccordionCard
                                    loanId="LN-2023-8899"
                                    onViewHistory={() => setIsHistoryOpen(true)}
                                />
                            </div>

                            {/* Recent Activity / Notes */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900">บันทึกล่าสุด</h3>
                                <div className="bg-yellow-50/50 border border-yellow-100 rounded-xl p-4 space-y-3">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-yellow-900 font-medium">ติดตามเอกสารเพิ่มเติม</p>
                                            <p className="text-xs text-yellow-700 mt-1">
                                                ลูกค้าแจ้งว่าจะส่งหนังสือรับรองเงินเดือนภายในวันศุกร์นี้ (Note โดย Admin A.)
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border border-border-subtle rounded-xl bg-white p-4">
                                    <h4 className="text-sm font-medium text-gray-900 mb-3">Timeline</h4>
                                    <div className="space-y-4 relative pl-2">
                                        {/* Line */}
                                        <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-100" />

                                        {[1, 2, 3].map((_, i) => (
                                            <div key={i} className="relative flex gap-3 pl-4">
                                                <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-white bg-gray-200 z-10" />
                                                <div>
                                                    <p className="text-sm text-gray-800">ชำระค่างวดสำเร็จ</p>
                                                    <p className="text-xs text-gray-500">25 ม.ค. 2024 • 14:30 น.</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="profile" className="animate-in slide-in-from-bottom-2 duration-500">
                        <Card>
                            <CardHeader>
                                <CardTitle>ข้อมูลส่วนตัว</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                                    <InfoRow label="ชื่อ-นามสกุล" value={MOCK_CUSTOMER.name} />
                                    <InfoRow label="รหัสบัตรประชาชน" value="1-2345-67890-12-3" />
                                    <InfoRow label="วันเกิด" value="12 พฤษภาคม 1985 (38 ปี)" />
                                    <InfoRow label="เบอร์โทรศัพท์" value={MOCK_CUSTOMER.phone} />
                                    <InfoRow label="อีเมล" value={MOCK_CUSTOMER.email} />
                                    <InfoRow label="อาชีพ" value={MOCK_CUSTOMER.occupation} />
                                    <InfoRow label="รายได้ต่อเดือน" value={MOCK_CUSTOMER.salary} />
                                    <InfoRow label="ที่อยู่ปัจจุบัน" value={MOCK_CUSTOMER.address} fullWidth />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="loans" className="animate-in slide-in-from-bottom-2 duration-500">
                        <Card>
                            <CardHeader><CardTitle>ประวัติการขอสินเชื่อ</CardTitle></CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>วันที่สมัคร</TableHead>
                                            <TableHead>เลขที่สัญญา</TableHead>
                                            <TableHead>ประเภทสินเชื่อ</TableHead>
                                            <TableHead>วงเงิน</TableHead>
                                            <TableHead>สถานะ</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow className="cursor-pointer hover:bg-gray-50/50 group" onClick={() => setActiveLoanId("LN-2023-8899")}>
                                            <TableCell>15 ต.ค. 2023</TableCell>
                                            <TableCell className="font-medium text-chaiyo-blue group-hover:underline">LN-2023-8899</TableCell>
                                            <TableCell>สินเชื่อส่วนบุคคล</TableCell>
                                            <TableCell>฿ 50,000</TableCell>
                                            <TableCell><Badge variant="success">อนุมัติ</Badge></TableCell>
                                        </TableRow>
                                        <TableRow className="cursor-pointer hover:bg-gray-50/50 group" onClick={() => setActiveLoanId("LN-2022-1022")}>
                                            <TableCell>10 ส.ค. 2022</TableCell>
                                            <TableCell className="font-medium text-chaiyo-blue group-hover:underline">LN-2022-1022</TableCell>
                                            <TableCell>นาโนไฟแนนซ์</TableCell>
                                            <TableCell>฿ 20,000</TableCell>
                                            <TableCell><Badge variant="neutral">ปิดบัญชีแล้ว</Badge></TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="documents" className="animate-in slide-in-from-bottom-2 duration-500">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>เอกสารประกอบ (KYC)</CardTitle>
                                <Button variant="outline" size="sm">อัปโหลดเพิ่ม</Button>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {['บัตรประชาชน.pdf', 'สลิปเงินเดือน (ล่าสุด).pdf', 'รายการเดินบัญชี (6 เดือน).pdf', 'รูปถ่ายหน้าตรง.jpg'].map((doc, i) => (
                                        <div key={i} className="group border border-gray-200 rounded-lg p-4 hover:border-chaiyo-blue hover:bg-blue-50/10 transition-colors cursor-pointer flex flex-col items-center text-center gap-3">
                                            <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 group-hover:text-chaiyo-blue group-hover:bg-blue-100 transition-colors">
                                                <FileText className="h-6 w-6" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">{doc}</p>
                                                <p className="text-xs text-gray-500">2.4 MB • 15 ต.ค. 2023</p>
                                            </div>
                                            <Button variant="ghost" size="sm" className="w-full mt-2 text-xs h-8">
                                                <Download className="h-3 w-3 mr-2" /> ดาวน์โหลด
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            <PaymentHistorySheet
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
                loanId={activeLoanId}
            />
        </div>
    );
}

interface SummaryCardProps {
    title: string;
    value: string;
    subtext: string;
    icon: React.ReactNode;
    highlight?: boolean;
}

function SummaryCard({ title, value, subtext, icon, highlight }: SummaryCardProps) {
    return (
        <Card className={`border-border-subtle shadow-sm ${highlight ? 'ring-2 ring-chaiyo-blue/10 bg-blue-50/20' : ''}`}>
            <CardContent className="p-6">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${highlight ? 'bg-white shadow-sm' : 'bg-gray-50'}`}>
                        {icon}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted">{title}</p>
                        <h4 className="text-2xl font-bold text-foreground mt-1">{value}</h4>
                        <p className="text-xs text-muted mt-1">{subtext}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

interface InfoRowProps {
    label: string;
    value: string;
    fullWidth?: boolean;
}

function InfoRow({ label, value, fullWidth }: InfoRowProps) {
    return (
        <div className={`space-y-1 ${fullWidth ? 'md:col-span-2' : ''}`}>
            <label className="text-sm text-muted font-normal">{label}</label>
            <p className="text-base font-medium text-foreground border-b border-gray-100 pb-2">{value}</p>
        </div>
    )
}
