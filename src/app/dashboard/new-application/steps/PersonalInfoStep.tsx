"use client";

import { useState } from "react";
import { User, MapPin, Briefcase, ShieldCheck, Loader2, AlertCircle, CheckCircle } from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface PersonalInfoStepProps {
    formData: any;
    setFormData: (data: any) => void;
}

type ScreeningStatus = 'IDLE' | 'CHECKING' | 'PASSED' | 'FAILED';

export function PersonalInfoStep({ formData, setFormData }: PersonalInfoStepProps) {
    const [screeningStatus, setScreeningStatus] = useState<ScreeningStatus>('IDLE');

    const handleChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handlePreScreening = async () => {
        setScreeningStatus('CHECKING');
        // Simulate API Call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setScreeningStatus('PASSED');
        // In real app, handle FAILED case
    };

    return (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-2">

            {/* eKYC Status Banner */}
            <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center gap-4 text-emerald-800 shadow-sm shadow-emerald-500/5">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                <div className="flex flex-col">
                    <span className="text-sm font-bold">ผ่านการยืนยันตัวตน (eKYC) เรียบร้อยแล้ว</span>
                    <span className="text-[10px] opacity-70">ข้อมูลถูกดึงมาจากระบบทะเบียนราษฎร์อัตโนมัติ</span>
                </div>
                <span className="ml-auto text-xs font-mono font-bold text-emerald-600/70">{new Date().toLocaleDateString('th-TH')}</span>
            </div>

            {/* PRE-SCREENING SECTION (NEW) */}
            <Card className={cn("border-2 transition-all", screeningStatus === 'PASSED' ? "border-emerald-100 bg-emerald-50/30" : "border-chaiyo-blue/20 bg-blue-50/10")}>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-start gap-4">
                            <div className={cn("mt-1 p-2 rounded-lg", screeningStatus === 'PASSED' ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-chaiyo-blue")}>
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold text-foreground">ตรวจสอบประวัติอาชญากรรม (Pre-screening)</h3>
                                <p className="text-sm text-muted">ตรวจสอบรายชื่อ Blacklist, Watchlist และสถานะล้มละลาย ก่อนดำเนินการต่อ</p>
                            </div>
                        </div>

                        {screeningStatus === 'IDLE' && (
                            <Button size="lg" className="bg-chaiyo-blue hover:bg-chaiyo-blue/90 shadow-lg shadow-chaiyo-blue/20" onClick={handlePreScreening}>
                                ตรวจสอบประวัติ
                            </Button>
                        )}

                        {screeningStatus === 'CHECKING' && (
                            <Button disabled className="bg-gray-100 text-gray-400 border border-gray-200">
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> กำลังตรวจสอบ...
                            </Button>
                        )}

                        {screeningStatus === 'PASSED' && (
                            <div className="flex items-center gap-2 text-emerald-600 font-bold bg-white px-4 py-2 rounded-xl shadow-sm border border-emerald-100">
                                <CheckCircle className="w-5 h-5" />
                                <span>ไม่พบประวัติเสี่ยง</span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className={cn("space-y-16 transition-opacity duration-500", screeningStatus !== 'PASSED' && "opacity-50 pointer-events-none grayscale-[0.5]")}>
                {/* Form Sections (Only accessible after screening) */}
                <div className="space-y-10">
                    <div className="flex items-center gap-3 pb-4 border-b border-border-subtle/60">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                            <User className="w-5 h-5 text-chaiyo-blue" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">ข้อมูลส่วนบุคคลตามบัตรประชาชน</h3>
                    </div>

                    <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>คำนำหน้า</Label>
                            <Select defaultValue={formData.prefix || "นาย"} onValueChange={(val) => handleChange("prefix", val)}>
                                <SelectTrigger className="w-full !h-14 rounded-xl shadow-none border-input focus:ring-2 focus:ring-chaiyo-blue/20">
                                    <SelectValue placeholder="เลือกคำนำหน้า" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="นาย">นาย</SelectItem>
                                    <SelectItem value="นาง">นาง</SelectItem>
                                    <SelectItem value="นางสาว">นางสาว</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="hidden md:block"></div> {/* Spacer */}

                        <div className="space-y-2">
                            <Label>ชื่อจริง</Label>
                            <Input defaultValue={formData.firstName || "สมชาย"} className="h-14 rounded-xl" onChange={(e) => handleChange("firstName", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>นามสกุล</Label>
                            <Input defaultValue={formData.lastName || "รักชาติ"} className="h-14 rounded-xl" onChange={(e) => handleChange("lastName", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>วันเกิด</Label>
                            <Input defaultValue={formData.birthDate || "12/05/1985"} placeholder="DD/MM/YYYY" className="h-14 rounded-xl" onChange={(e) => handleChange("birthDate", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>เบอร์โทรศัพท์มือถือ</Label>
                            <Input defaultValue={formData.phone || "081-234-5678"} className="font-mono h-14 rounded-xl" onChange={(e) => handleChange("phone", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>อีเมล (ถ้ามี)</Label>
                            <Input defaultValue={formData.email || ""} placeholder="example@email.com" className="h-14 rounded-xl" onChange={(e) => handleChange("email", e.target.value)} />
                        </div>
                    </div>
                </div>

                <div className="space-y-10">
                    <div className="flex items-center gap-3 pb-4 border-b border-border-subtle/60">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-chaiyo-blue" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">ที่อยู่ตามระเบียนบ้าน</h3>
                    </div>

                    <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
                        <div className="md:col-span-2 space-y-2">
                            <Label>ที่อยู่ (บ้านเลขที่, หมู่, ซอย, ถนน)</Label>
                            <Input value={formData.addressLine1} placeholder="99/9 หมู่ 1 ถ.วิภาวดีรังสิต" className="h-14 rounded-xl" onChange={(e) => handleChange("addressLine1", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>จังหวัด</Label>
                            <Input value={formData.province} placeholder="กรุงเทพมหานคร" className="h-14 rounded-xl" onChange={(e) => handleChange("province", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>เขต / อำเภอ</Label>
                            <Input value={formData.district} placeholder="จตุจักร" className="h-14 rounded-xl" onChange={(e) => handleChange("district", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>แขวง / ตำบล</Label>
                            <Input value={formData.subDistrict} placeholder="จอมพล" className="h-14 rounded-xl" onChange={(e) => handleChange("subDistrict", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>รหัสไปรษณีย์</Label>
                            <Input value={formData.zipCode} placeholder="10900" className="font-mono h-14 rounded-xl" onChange={(e) => handleChange("zipCode", e.target.value)} />
                        </div>
                    </div>
                </div>

                <div className="space-y-10">
                    <div className="flex items-center gap-3 pb-4 border-b border-border-subtle/60">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-chaiyo-blue" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">ข้อมูลอาชีพและการทำงาน</h3>
                    </div>

                    <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>อาชีพ</Label>
                            <Select defaultValue={formData.occupation} onValueChange={(val) => handleChange("occupation", val)}>
                                <SelectTrigger className="w-full !h-14 rounded-xl shadow-none border-input focus:ring-2 focus:ring-chaiyo-blue/20">
                                    <SelectValue placeholder="เลือกอาชีพ" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="พนักงานบริษัท">พนักงานบริษัท</SelectItem>
                                    <SelectItem value="ข้าราชการ">ข้าราชการ</SelectItem>
                                    <SelectItem value="รัฐวิสาหกิจ">รัฐวิสาหกิจ</SelectItem>
                                    <SelectItem value="ธุรกิจส่วนตัว">ธุรกิจส่วนตัว</SelectItem>
                                    <SelectItem value="รับจ้างทั่วไป">รับจ้างทั่วไป</SelectItem>
                                    <SelectItem value="เกษตรกร">เกษตรกร</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>สถานที่ทำงาน</Label>
                            <Input placeholder="บริษัท เงินไชโย จำกัด" className="h-14 rounded-xl" onChange={(e) => handleChange("workplace", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>รายได้ต่อเดือน (บาท)</Label>
                            <Input placeholder="0.00" className="h-14 rounded-xl text-lg bg-gray-50/50 border-gray-200 focus:bg-white transition-all text-right" onChange={(e) => handleChange("income", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>อายุงาน (ปี)</Label>
                            <Input placeholder="2" type="number" className="h-14 rounded-xl" onChange={(e) => handleChange("workYears", e.target.value)} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
