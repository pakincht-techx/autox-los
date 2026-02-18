"use client";

import { Search, Bell, HelpCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription
} from "@/components/ui/Dialog";
import { Label } from "@/components/ui/Label";

const branchInfo = {
    code: '108',
    name: 'สาขาลาดพร้าว',
    district: 'สำนักงานเขตจตุจักร',
    region: 'กรุงเทพมหานคร 2'
};

export function DashboardHeader() {
    return (
        <header className="h-16 px-8 flex items-center justify-between shrink-0 z-10 print:hidden">
            <div className="flex items-center gap-4 flex-1">
                <div className="relative max-w-md w-full hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                        type="text"
                        placeholder="ค้นหาข้อมูล..."
                        className="w-full pl-9 pr-4 py-2 bg-white border border-border-subtle rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-chaiyo-blue/50 transition-all shadow-sm"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-muted hover:bg-white hover:shadow-sm h-9 w-9">
                    <Bell className="w-4.5 h-4.5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-muted hover:bg-white hover:shadow-sm h-9 w-9">
                    <HelpCircle className="w-4.5 h-4.5" />
                </Button>
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
                        <DialogContent className="sm:max-w-[425px]">
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
        </header>
    );
}
