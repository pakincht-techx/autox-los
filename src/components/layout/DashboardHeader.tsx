"use client";

import { useState, useEffect } from "react";
import { AnnouncementModal } from "@/components/layout/AnnouncementModal";

import { Search, Megaphone, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription
} from "@/components/ui/Dialog";
import { Label } from "@/components/ui/Label";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const branchInfo = {
    code: '108',
    name: 'สาขาลาดพร้าว',
    district: 'สำนักงานเขตจตุจักร',
    region: 'กรุงเทพมหานคร 2'
};

export function DashboardHeader() {
    const [showAnnouncement, setShowAnnouncement] = useState(false);

    useEffect(() => {
        const hasSeenSession = sessionStorage.getItem("announcementSeen");
        const hideForever = localStorage.getItem("hideAnnouncement");

        if (!hasSeenSession && !hideForever) {
            setShowAnnouncement(true);
        }
    }, []);

    return (
        <header className="h-16 px-8 flex items-center justify-between shrink-0 z-10 print:hidden">
            <div className="flex items-center gap-4 flex-1">
                <div className="relative max-w-sm w-full hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted hover:text-chaiyo-blue transition-colors z-10" />
                    <Input
                        type="search"
                        placeholder="ค้นหาข้อมูล..."
                        className="pl-9 pr-4 h-9 shadow-none border-gray-200"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-muted hover:bg-white hover:shadow-sm h-9 w-9 relative group">
                            <Megaphone className="w-4.5 h-4.5 group-hover:text-foreground transition-colors" />
                            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80 border-border-subtle shadow-lg bg-white/95 backdrop-blur-sm">
                        <DropdownMenuLabel className="font-semibold text-foreground">ประกาศ</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-gray-100" />
                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                            <DropdownMenuItem
                                className="flex flex-col items-start gap-1 p-3 cursor-pointer focus:bg-gray-50"
                                onClick={() => setShowAnnouncement(true)}
                            >
                                <span className="font-medium text-sm text-chaiyo-blue">ประกาศสำคัญจากสำนักงานใหญ่</span>
                                <span className="text-xs text-muted line-clamp-2">
                                    แจ้งเปลี่ยนแปลงนโยบายการอนุมัติสินเชื่อและปรับอัตราดอกเบี้ย มีผล 1 มี.ค. 67
                                </span>
                                <span className="text-[10px] text-gray-400 mt-1">วันนี้, 09:00</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-gray-100" />
                            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer focus:bg-gray-50 opacity-70">
                                <span className="font-medium text-sm text-foreground">แจ้งปิดปรับปรุงระบบ</span>
                                <span className="text-xs text-muted line-clamp-2">
                                    ระบบจะปิดปรับปรุงชั่วคราวในวันที่ 20 ก.พ. เวลา 02:00 - 04:00 น.
                                </span>
                                <span className="text-[10px] text-gray-400 mt-1">เมื่อวาน</span>
                            </DropdownMenuItem>
                        </div>
                        <DropdownMenuSeparator className="bg-gray-100" />
                        <div className="p-2 text-center">
                            <Button variant="link" className="text-xs text-muted h-auto p-0 hover:text-chaiyo-blue">
                                ดูประกาศทั้งหมด
                            </Button>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="h-4 w-[1px] bg-border-color mx-2"></div>

                <div className="flex items-center gap-3 pl-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <div className="hidden sm:flex items-center gap-2 cursor-pointer hover:bg-white/50 px-3 py-1.5 rounded-lg transition-colors group">
                                <div className="text-right">
                                    <p className="text-xs font-semibold group-hover:text-chaiyo-blue transition-colors">{branchInfo.name}</p>
                                    <p className="text-[10px] text-muted">รหัส {branchInfo.code}</p>
                                </div>
                                <ChevronDown className="w-4 h-4 text-muted group-hover:text-foreground transition-colors" />
                            </div>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[480px]">
                            <DialogHeader>
                                <DialogTitle>ข้อมูลสาขา</DialogTitle>
                                <DialogDescription>
                                    รายละเอียดข้อมูลสาขาของคุณ
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right text-muted-foreground">รหัสสาขา</Label>
                                    <div className="col-span-3 font-medium">{branchInfo.code}</div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right text-muted-foreground">ชื่อสาขา</Label>
                                    <div className="col-span-3 font-medium">{branchInfo.name}</div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right text-muted-foreground whitespace-nowrap">สนง.เขต</Label>
                                    <div className="col-span-3 font-medium">{branchInfo.district}</div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right text-muted-foreground">ภาค</Label>
                                    <div className="col-span-3 font-medium">{branchInfo.region}</div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <AnnouncementModal open={showAnnouncement} onOpenChange={setShowAnnouncement} />
        </header>
    );
}
