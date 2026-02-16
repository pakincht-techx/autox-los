"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ApplicationHeader } from "./ApplicationHeader";
import { ActionRequiredList } from "./ActionRequiredList";
import { ApplicationDetail } from "@/components/applications/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FileText, User, Car, Wallet, FileCheck, Eye, Banknote } from "lucide-react";

// Mock Data
const MOCK_DETAIL_DATA: ApplicationDetail = {
    id: "1",
    applicationNo: "APP-2023001",
    applicantName: "สมชาย ใจดี",
    submissionDate: "01/10/2023",
    requestedAmount: 500000,
    status: "In Review",
    productType: "สินเชื่อจำนำทะเบียนรถยนต์",
    email: "somchai.j@example.com",
    phone: "081-234-5678",
    term: 48,
    interestRate: 0.79, // per month
    ltv: 85,
    dti: 45,
    creditScore: 720,
    notes: [
        "ลูกค้าประกอบอาชีพค้าขาย มีหน้าร้านชัดเจน",
        "เคยมีประวัติล่าช้า 1 ครั้งเมื่อปีที่แล้ว แต่ปิดบัญชีแล้ว"
    ],
    actionItems: [
        {
            id: "a1",
            title: "เอกสารรายได้ไม่ชัดเจน",
            description: "สเตรทเมนท์เดือนล่าสุดไม่มียอดเงินเข้าตามที่แจ้ง กรุณาขอเอกสารเพิ่มเติม",
            priority: "High",
            isCompleted: false
        },
        {
            id: "a2",
            title: "รูปถ่ายรถยนต์ไม่ครบถ้วน",
            description: "ขาดรูปถ่ายเลขตัวถัง และเลขไมล์รถยนต์",
            priority: "Medium",
            isCompleted: false
        }
    ],
    documents: [
        { id: "d1", name: "บัตรประชาชน.pdf", type: "Identity", uploadDate: "01/10/2023", status: "Verified", url: "#" },
        { id: "d2", name: "เล่มทะเบียนรถ.pdf", type: "Asset", uploadDate: "01/10/2023", status: "Verified", url: "#" },
        { id: "d3", name: "Statement ย้อนหลัง 6 เดือน.pdf", type: "Income", uploadDate: "02/10/2023", status: "Rejected", url: "#" },
    ],
    collateral: {
        id: "c1",
        type: "Vehicle",
        subType: "รถเก๋ง (Sedan)",
        brand: "Toyota",
        model: "Camry 2.5 HEV Premium Luxury",
        year: "2023",
        color: "Platinum White Pearl",
        registrationNo: "9กข 9999",
        province: "กรุงเทพมหานคร",
        mileage: 15420,
        vin: "MR053K74001234567",
        engineNo: "A25A-FXS-1234567",
        marketValue: 1450000,
        appraisalValue: 1380000,
        images: [
            "/mock-car-front.jpg", // Placeholder
            "/mock-car-back.jpg",
            "/mock-car-interior.jpg"
        ]
    }
};

export default function ApplicationDetailPage({ params }: { params: { id: string } }) {
    // In real app, fetch data using params.id
    const app = MOCK_DETAIL_DATA;

    return (
        <div className="min-h-screen bg-gray-50/30 pb-20 space-y-6">
            <ApplicationHeader
                applicationId={app.id}
                applicationNo={app.applicationNo}
                status={app.status}
                applicantName={app.applicantName}
                productType={app.productType}
                onApprove={() => console.log("Approve")}
                onReject={() => console.log("Reject")}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Action Required Section */}
                {(app.status === 'In Review') && (
                    <ActionRequiredList items={app.actionItems} />
                )}

                {/* Main Content Tabs */}
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="bg-transparent p-0 h-auto border-b border-gray-200 w-full justify-start gap-6">
                        <TabsTrigger value="overview" className="text-base h-11 px-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-chaiyo-blue data-[state=active]:text-chaiyo-blue">ภาพรวม</TabsTrigger>
                        <TabsTrigger value="collateral" className="text-base h-11 px-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-chaiyo-blue data-[state=active]:text-chaiyo-blue">หลักประกัน</TabsTrigger>
                        <TabsTrigger value="documents" className="text-base h-11 px-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-chaiyo-blue data-[state=active]:text-chaiyo-blue">เอกสารแนบ</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {/* Key Metrics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <MetricCard label="วงเงินที่ขอ" value={`฿${app.requestedAmount.toLocaleString()}`} icon={<Wallet className="text-chaiyo-blue" />} />
                            <MetricCard label="ระยะเวลาผ่อน" value={`${app.term} งวด`} icon={<ClockIcon className="text-orange-500" />} />
                            <MetricCard label="ดอกเบี้ย" value={`${app.interestRate}% / เดือน`} icon={<PercentIcon className="text-emerald-500" />} />
                            <MetricCard label="Credit Score" value={app.creditScore.toString()} subValue="Grade B+" icon={<FileCheck className="text-purple-500" />} />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <Card className="lg:col-span-2 border-border-subtle shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg">วิเคราะห์ความสามารถในการชำระหนี้</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <span className="text-sm font-medium text-gray-600">ภาระหนี้ต่อรายได้ (DTI)</span>
                                            <div className="flex items-center gap-3">
                                                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-500" style={{ width: `${app.dti}%` }} />
                                                </div>
                                                <span className="font-bold text-gray-900">{app.dti}%</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <span className="text-sm font-medium text-gray-600">วงเงินต่อมูลค่าหลักประกัน (LTV)</span>
                                            <div className="flex items-center gap-3">
                                                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div className="h-full bg-chaiyo-blue" style={{ width: `${app.ltv}%` }} />
                                                </div>
                                                <span className="font-bold text-gray-900">{app.ltv}%</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <h4 className="text-sm font-bold text-gray-900 mb-2">บันทึกเพิ่มเติมจากเจ้าหน้าที่</h4>
                                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 bg-yellow-50/50 p-4 rounded-xl border border-yellow-100">
                                            {app.notes.map((note, i) => (
                                                <li key={i}>{note}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-border-subtle shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg">ข้อมูลผู้กู้เบื้องต้น</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col items-center mb-6">
                                        <div className="h-20 w-20 bg-chaiyo-blue/10 rounded-full flex items-center justify-center text-chaiyo-blue mb-3">
                                            <User className="h-10 w-10" />
                                        </div>
                                        <h3 className="font-bold text-lg">{app.applicantName}</h3>
                                        <p className="text-sm text-muted">ID: 1-1004-xxxx-xx-x</p>
                                    </div>
                                    <div className="space-y-3">
                                        <InfoItem label="เบอร์โทรศัพท์" value={app.phone} />
                                        <InfoItem label="อีเมล" value={app.email} />
                                        <InfoItem label="อาชีพ" value="ค้าขาย" />
                                        <InfoItem label="รายได้เฉลี่ย" value="฿35,000 / เดือน" />
                                    </div>
                                    <Button variant="outline" className="w-full mt-6 border-chaiyo-blue text-chaiyo-blue hover:bg-chaiyo-blue/5">
                                        ดูข้อมูลผู้กู้ฉบับเต็ม
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="collateral" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {/* Summary Header */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="border-border-subtle shadow-sm bg-gradient-to-br from-white to-gray-50">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                                        <Banknote className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted">ราคาประเมินกลาง</p>
                                        <h3 className="text-2xl font-bold text-foreground">฿{app.collateral?.appraisalValue.toLocaleString()}</h3>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-border-subtle shadow-sm">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-chaiyo-blue/10 text-chaiyo-blue">
                                        <Car className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted">วงเงินอนุมัติสูงสุด (LTV {app.ltv}%)</p>
                                        <h3 className="text-2xl font-bold text-chaiyo-blue">฿{(app.collateral?.appraisalValue * app.ltv / 100).toLocaleString()}</h3>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Col: Images */}
                            <Card className="lg:col-span-1 border-border-subtle shadow-sm h-fit">
                                <CardHeader>
                                    <CardTitle className="text-lg">รูปถ่ายหลักประกัน</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="aspect-[4/3] rounded-lg bg-gray-100 overflow-hidden relative group cursor-pointer">
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-100 italic">
                                            {/* In real app, use Image component */}
                                            <span>Main Image</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="aspect-square rounded-md bg-gray-50 border border-gray-100 flex items-center justify-center text-xs text-muted hover:border-chaiyo-blue cursor-pointer transition-colors">
                                                Image {i}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Right Col: Details */}
                            <Card className="lg:col-span-2 border-border-subtle shadow-sm">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-lg">รายละเอียดพาหนะ</CardTitle>
                                    <Badge variant="outline" className="font-mono text-xs">{app.collateral?.id}</Badge>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                        <div className="space-y-4">
                                            <h4 className="font-semibold text-sm text-gray-900 border-b border-gray-100 pb-2">ข้อมูลรถยนต์</h4>
                                            <div className="space-y-3">
                                                <InfoItem label="ยี่ห้อ" value={app.collateral?.brand || "-"} />
                                                <InfoItem label="รุ่น" value={app.collateral?.model || "-"} />
                                                <InfoItem label="ปีจดทะเบียน" value={app.collateral?.year || "-"} />
                                                <InfoItem label="สี" value={app.collateral?.color || "-"} />
                                                <InfoItem label="ประเภท" value={app.collateral?.subType || "-"} />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="font-semibold text-sm text-gray-900 border-b border-gray-100 pb-2">เลขทะเบียนและเครื่องยนต์</h4>
                                            <div className="space-y-3">
                                                <InfoItem label="เลขทะเบียน" value={app.collateral?.registrationNo} />
                                                <InfoItem label="จังหวัด" value={app.collateral?.province} />
                                                <InfoItem label="เลขไมล์" value={`${app.collateral?.mileage?.toLocaleString() || "-"} กม.`} />
                                                <InfoItem label="เลขตัวถัง" value={app.collateral?.vin || "-"} />
                                                <InfoItem label="เลขเครื่องยนต์" value={app.collateral?.engineNo || "-"} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                        <h4 className="font-bold text-sm text-gray-900 mb-3">การประเมินมูลค่า</h4>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">ราคากลางตลาด (Market Price)</span>
                                            <span className="font-medium">฿{app.collateral?.marketValue.toLocaleString()}</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-200 rounded-full mt-2 mb-4 overflow-hidden">
                                            <div
                                                className="h-full bg-emerald-500"
                                                style={{
                                                    width: `${(app.collateral.appraisalValue / app.collateral.marketValue) * 100}%`
                                                }}
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                            <span>ราคาประเมินคิดเป็น {((app.collateral.appraisalValue / app.collateral.marketValue) * 100).toFixed(1)}% ของราคากลาง</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="documents">
                        <Card>
                            <CardHeader><CardTitle>เอกสารแนบ ({app.documents.length})</CardTitle></CardHeader>
                            <CardContent>
                                <div className="divide-y divide-gray-100">
                                    {app.documents.map((doc) => (
                                        <div key={doc.id} className="flex items-center justify-between py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                                                    <FileText className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{doc.name}</p>
                                                    <p className="text-xs text-gray-500">{doc.type} • {doc.uploadDate}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <Badge variant={doc.status === 'Verified' ? 'success' : doc.status === 'Rejected' ? 'danger' : 'warning'}>
                                                    {doc.status}
                                                </Badge>
                                                <Button variant="ghost" size="sm">
                                                    <Eye className="h-4 w-4 mr-2" /> ดูเอกสาร
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

// Sub-components for internal use
function MetricCard({ label, value, subValue, icon }: { label: string, value: string, subValue?: string, icon: React.ReactNode }) {
    return (
        <Card className="border-border-subtle shadow-sm">
            <CardContent className="p-6 flex items-start justify-between">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-muted">{label}</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-bold text-foreground">{value}</h3>
                        {subValue && (
                            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                                {subValue}
                            </span>
                        )}
                    </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">{icon}</div>
            </CardContent>
        </Card>
    )
}

function InfoItem({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex justify-between items-center py-1 border-b border-gray-50 last:border-0">
            <span className="text-sm text-gray-500">{label}</span>
            <span className="text-sm font-medium text-gray-900">{value}</span>
        </div>
    )
}

// Icons
function ClockIcon({ className }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("h-5 w-5", className)}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
}

function PercentIcon({ className }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("h-5 w-5", className)}><line x1="19" y1="5" x2="5" y2="19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></svg>
}


