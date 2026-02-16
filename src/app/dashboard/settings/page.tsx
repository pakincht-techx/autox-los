"use client";

import { useState } from "react";
import {
    User,
    Bell,
    Lock,
    Globe,
    Database,
    ChevronRight,
    Save
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/Select";
import { cn } from "@/lib/utils";

const settingsTabs = [
    { id: "profile", label: "ข้อมูลโปรไฟล์", icon: User },
    { id: "notifications", label: "การแจ้งเตือน", icon: Bell },
    { id: "security", label: "ความปลอดภัย", icon: Lock },
    { id: "regional", label: "ภาษาและภูมิภาค", icon: Globe },
    { id: "data", label: "การจัดการข้อมูล", icon: Database },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");

    return (
        <div className="h-full flex flex-col gap-8">
            <div>
                <h1 className="text-xl font-bold tracking-tight text-foreground">ตั้งค่าระบบ</h1>
                <p className="text-[13px] text-muted mt-1">จัดการข้อมูลส่วนตัวและการตั้งค่าการทำงานของสาขา</p>
            </div>

            <div className="flex-1 flex gap-10 overflow-hidden min-h-[500px]">
                {/* Left Side: Detail Tabs (Inside the right container) */}
                <div className="w-64 shrink-0 space-y-1">
                    {settingsTabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm transition-all",
                                    isActive
                                        ? "bg-chaiyo-blue/5 text-chaiyo-blue font-bold border border-chaiyo-blue/10"
                                        : "text-muted hover:text-foreground hover:bg-gray-50"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className={cn("w-4 h-4", isActive ? "text-chaiyo-blue" : "text-muted")} />
                                    <span>{tab.label}</span>
                                </div>
                                {isActive && <ChevronRight className="w-3 h-3" />}
                            </button>
                        )
                    })}
                </div>

                {/* Right Side: Detail Content */}
                <div className="flex-1 max-w-2xl bg-gray-50/50 rounded-2xl border border-border-subtle p-8 overflow-y-auto no-scrollbar">
                    {activeTab === "profile" && (
                        <div className="space-y-8">
                            <div className="flex items-center gap-6 pb-8 border-b border-border-subtle">
                                <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-2xl font-bold border-2 border-white shadow-sm">
                                    JS
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-foreground">สมหญิง จริงใจ</h3>
                                    <p className="text-sm text-muted">ผู้ช่วยผู้จัดการสาขา (สาขาลาดพร้าว)</p>
                                    <div className="flex gap-2 mt-3">
                                        <Button size="sm" variant="outline" className="h-8 text-[11px] px-3 font-bold border-border-strong">
                                            เปลี่ยนรูปภาพ
                                        </Button>
                                        <Button size="sm" variant="ghost" className="h-8 text-[11px] px-3 font-bold text-red-500 hover:bg-red-50">
                                            ลบรูปภาพ
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold text-muted uppercase tracking-wider">ชื่อ-นามสกุล</Label>
                                    <Input defaultValue="สมหญิง จริงใจ" className="bg-white border-border-subtle focus:bg-white" />
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold text-muted uppercase tracking-wider">อีเมลสำหรับติดต่องาน</Label>
                                    <Input defaultValue="somying.j@ngernchaiyo.com" className="bg-white border-border-subtle" />
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold text-muted uppercase tracking-wider">เบอร์โทรศัพท์มือถือ</Label>
                                    <Input defaultValue="081-xxx-xxxx" className="font-mono bg-white border-border-subtle" />
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold text-muted uppercase tracking-wider">ตำแหน่งงาน</Label>
                                    <Input defaultValue="Assistant Branch Manager" disabled className="bg-gray-100/50 border-border-subtle text-muted" />
                                </div>
                            </div>

                            <div className="pt-6 flex justify-end gap-3">
                                <Button variant="outline" className="h-10 px-6 font-bold text-sm">ยกเลิก</Button>
                                <Button className="h-10 px-8 font-bold text-sm bg-chaiyo-blue hover:bg-blue-700">
                                    <Save className="w-4 h-4 mr-2" />
                                    บันทึกการเปลี่ยนแปลง
                                </Button>
                            </div>
                        </div>
                    )}

                    {activeTab === "regional" && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-2 duration-300">
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold text-foreground">ภาษาและภูมิภาค</h3>
                                <p className="text-sm text-muted">ตั้งค่าภาษาหลักของระบบและรูปแบบการแสดงผลภูมิภาค</p>
                            </div>

                            <div className="grid gap-6 bg-white p-8 rounded-2xl border border-border-subtle shadow-sm">
                                <div className="grid gap-3">
                                    <Label className="text-xs font-bold text-muted uppercase tracking-wider">ภาษาที่ใช้ในระบบ (Language)</Label>
                                    <Select defaultValue="th">
                                        <SelectTrigger className="h-12 rounded-xl">
                                            <SelectValue placeholder="เลือกภาษา" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="th">ไทย (Thai)</SelectItem>
                                            <SelectItem value="en">English (US)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-3">
                                    <Label className="text-xs font-bold text-muted uppercase tracking-wider">เขตเวลา (Timezone)</Label>
                                    <Select defaultValue="bangkok">
                                        <SelectTrigger className="h-12 rounded-xl">
                                            <SelectValue placeholder="เลือกเขตเวลา" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="bangkok">(GMT+07:00) Bangkok, Hanoi, Jakarta</SelectItem>
                                            <SelectItem value="tokyo">(GMT+09:00) Tokyo, Seoul, Osaka</SelectItem>
                                            <SelectItem value="london">(GMT+00:00) London, Dublin, Lisbon</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="pt-6 flex justify-end gap-3">
                                <Button variant="outline" className="h-10 px-6 font-bold text-sm">การตั้งค่าเริ่มต้น</Button>
                                <Button className="h-10 px-8 font-bold text-sm bg-chaiyo-blue hover:bg-blue-700">
                                    บันทึกการตั้งค่า
                                </Button>
                            </div>
                        </div>
                    )}

                    {activeTab !== "profile" && activeTab !== "regional" && (() => {
                        const TabIcon = settingsTabs.find(t => t.id === activeTab)?.icon || User;
                        return (
                            <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-4">
                                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                                    <TabIcon className="w-8 h-8 text-muted/50" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground">ยังไม่มีการตั้งค่าข้อมูลส่วนนี้</h3>
                                    <p className="text-xs text-muted mt-1 max-w-[200px]">ระบบกำลังดำเนินการพัฒนาส่วนต่อขยาย เพื่อรองรับการตั้งค่าที่ละเอียดขึ้น</p>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            </div>
        </div>
    );
}
