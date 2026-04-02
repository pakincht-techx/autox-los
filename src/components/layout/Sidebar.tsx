"use client";
// Force refresh to resolve stale HMR cache and module factory errors

// Sync: Move sidebar button
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnnouncementModal } from "@/components/layout/AnnouncementModal";
import {
    LayoutGrid,
    PlusSquare,
    Files,
    FolderOpen,
    CheckSquare,
    Car,
    LogOut,
    Settings,
    ShieldCheck,
    HelpCircle,
    Calculator,
    Search,
    Megaphone,
    Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useSidebar } from "@/components/layout/SidebarContext";
import { getRoleInfo, getRoleDisplayName } from "@/lib/roleConfig";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/Dialog";
import { Label } from "@/components/ui/Label";

type UserRole = 'Maker' | 'Checker' | 'Approver';

const branchInfo = {
    code: '108',
    name: 'สาขาลาดพร้าว',
    district: 'สำนักงานเขตจตุจักร',
    region: 'กรุงเทพมหานคร 2'
};

const navigationGroups = [
    {
        title: "จัดการ",
        items: [
            { name: "รายการใบสมัครของฉัน", href: "/dashboard/applications", icon: Files, allowedRoles: ['Maker', 'Checker', 'Approver'] as UserRole[] },
            { name: "รายการใบสมัครทั้งหมด", href: "/dashboard/all-applications", icon: FolderOpen, allowedRoles: ['Maker', 'Checker', 'Approver'] as UserRole[] },
            { name: "ประกาศแจ้งเตือน", href: "#announcement", icon: Megaphone, allowedRoles: ['Maker', 'Checker', 'Approver'] as UserRole[], isAnnouncement: true },
        ]
    },
    {
        title: "ตั้งค่า",
        items: [
            { name: "การตั้งค่า", href: "/dashboard/settings", icon: Settings, allowedRoles: ['Approver'] as UserRole[] },
        ]
    }
];

export function Sidebar() {
    // Main sidebar component
    const pathname = usePathname();
    const { isCollapsed, devRole } = useSidebar();
    const router = useRouter();
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [isBranchInfoOpen, setIsBranchInfoOpen] = useState(false);
    const [showAnnouncement, setShowAnnouncement] = useState(false);
    const [isLogoutOpen, setIsLogoutOpen] = useState(false);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const hasSeenSession = sessionStorage.getItem("announcementSeen");
        const hideForever = localStorage.getItem("hideAnnouncement");

        if (!hasSeenSession && !hideForever) {
            setShowAnnouncement(true);
        }
    }, []);

    // Get role-based user info
    const roleInfo = getRoleInfo(devRole);
    const mockUser = {
        name: roleInfo.displayName,
        role: 'Maker' as UserRole,
        position: roleInfo.position,
        branch: 'สาขาลาดพร้าว',
        initials: roleInfo.initials,
    };

    const filteredGroups = navigationGroups.map(group => ({
        ...group,
        items: group.items.filter(item => !item.allowedRoles || item.allowedRoles.includes(mockUser.role))
    })).filter(group => group.items.length > 0);

    // Initial render on server and client MUST match perfect.
    // We render the expanded state by default to fill the space.
    if (!mounted) {
        return (
            <div className="relative flex flex-col h-full bg-chaiyo-blue w-64 text-white overflow-hidden">
                <div className="absolute top-0 left-0 w-[4px] h-full z-50" style={{ backgroundImage: 'url(/images/vertical-line.svg)', backgroundSize: 'cover' }} />
                <div className="p-5 border-b border-white/10 flex items-center justify-between h-[73px] ml-[4px]">
                    <div className="flex items-center gap-3">
                        <img src="/images/logo-chaiyo.svg" alt="เงินไชโย" className="h-8 w-auto rounded shrink-0" />
                        <div className="font-semibold text-base text-white/90">เงินไชโย</div>
                    </div>
                    <div className="h-8 w-8 rounded-md bg-white/10 flex items-center justify-center text-white/80">
                    </div>
                </div>
                <div className="flex-1" />
            </div>
        );
    }

    return (
        <div className={cn(
            "relative flex flex-col h-full bg-chaiyo-blue transition-all duration-300 text-white overflow-hidden",
            isCollapsed ? "w-16" : "w-64"
        )}>
            {/* Stripe Line Left */}
            <div className="absolute top-0 left-0 w-[4px] h-full z-50" style={{ backgroundImage: 'url(/images/vertical-line.svg)', backgroundSize: 'cover' }} />

            {/* Brand Header */}
            <div className={cn(
                "border-b border-white/10 flex items-center h-[73px] ml-[4px] transition-all duration-300",
                isCollapsed ? "justify-center px-1" : "justify-between px-5"
            )}>
                <div className={cn("flex items-center gap-3 overflow-hidden", isCollapsed && "justify-center")}>
                    <img src="/images/logo-chaiyo.svg" alt="เงินไชโย" className="h-7 w-auto rounded shrink-0" />
                    {!isCollapsed && (
                        <div className="overflow-hidden">
                            <h1 className="font-semibold text-base leading-none truncate text-white/90 tracking-wide">เงินไชโย</h1>
                            <div
                                className="flex items-center gap-1.5 group mt-1"
                            >
                                <div className="text-[11px] font-medium text-white/60 truncate">
                                    {branchInfo.name} ({branchInfo.code})
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* User Account */}
            <div className={cn("pl-4 pr-2 pt-4 pb-2", isCollapsed && "pl-4 pr-2")}>
                <div 
                    onClick={() => setIsAccountOpen(true)}
                    role="button"
                    tabIndex={0}
                    className={cn(
                        "flex items-center gap-3 p-2 rounded-md transition-colors cursor-pointer group hover:bg-white/10 border border-transparent outline-none",
                        isCollapsed && "justify-center p-1"
                    )}>
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xs shrink-0">
                        {mockUser.initials}
                    </div>
                    {!isCollapsed && (
                        <>
                            <div className="flex-1 overflow-hidden text-left">
                                <p className="text-xs font-semibold text-white truncate">{mockUser.name}</p>
                                <p className="text-[10px] text-white/60 truncate">{getRoleDisplayName(devRole)}</p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 pl-4 pr-2 space-y-6">


                {filteredGroups.map((group) => (
                    <div key={group.title} className="space-y-1">
                        {!isCollapsed && (
                            <p className="px-3 text-[10px] font-semibold text-white/50 uppercase tracking-widest mb-2">
                                {group.title}
                            </p>
                        )}
                        <div className="space-y-0.5">
                            {group.items.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = item.icon;

                                if ((item as any).isAnnouncement) {
                                    return (
                                        <div
                                            key={item.name}
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-2 rounded-md transition-all group border border-transparent cursor-pointer",
                                                "text-white/70 hover:text-white hover:bg-white/10",
                                                isCollapsed && "justify-center px-0"
                                            )}
                                            title={isCollapsed ? item.name : ""}
                                            onClick={() => setShowAnnouncement(true)}
                                        >
                                            <div className="relative shrink-0">
                                                <Icon className="w-4.5 h-4.5 text-white/70 group-hover:text-white" />
                                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-chaiyo-blue"></span>
                                            </div>
                                            {!isCollapsed && (
                                                <span className="text-[13px]">{item.name}</span>
                                            )}
                                        </div>
                                    );
                                }

                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2 rounded-md transition-all group border border-transparent",
                                            isActive
                                                ? "bg-white/15 border-white/10 text-white font-medium shadow-none"
                                                : "text-white/70 hover:text-white hover:bg-white/10",
                                            isCollapsed && "justify-center px-0"
                                        )}
                                        title={isCollapsed ? item.name : ""}
                                    >
                                        <Icon className={cn("w-4.5 h-4.5 shrink-0", isActive ? "text-white" : "text-white/70 group-hover:text-white")} />
                                        {!isCollapsed && (
                                            <span className="text-[13px]">{item.name}</span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Announcement & User Footer */}
            {/* Logout Button */}
            <div className={cn("py-6 pl-4 pr-2 border-t border-white/10", isCollapsed && "pl-4 pr-2")}>
                <div
                    className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors cursor-pointer group hover:bg-white/10 border border-transparent outline-none",
                        isCollapsed && "justify-center px-0"
                    )}
                    onClick={() => setIsLogoutOpen(true)}
                    title={isCollapsed ? "ออกจากระบบ" : ""}
                >
                    <LogOut className="w-4.5 h-4.5 shrink-0 text-white/70 group-hover:text-white transition-colors" />
                    {!isCollapsed && (
                        <span className="text-[13px] text-white/70 group-hover:text-white transition-colors">ออกจากระบบ</span>
                    )}
                </div>
            </div>

            {/* Logout Confirmation Dialog */}
            <Dialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>ยืนยันการออกจากระบบ</DialogTitle>
                        <DialogDescription>
                            คุณต้องการออกจากระบบหรือไม่?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" className="min-w-[120px]" onClick={() => setIsLogoutOpen(false)}>ยกเลิก</Button>
                        <Button variant="destructive" className="min-w-[120px]" onClick={() => { setIsLogoutOpen(false); router.push('/'); }}>ออกจากระบบ</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isAccountOpen} onOpenChange={setIsAccountOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>ข้อมูลผู้ใช้งาน</DialogTitle>
                        <DialogDescription>
                            ข้อมูลส่วนตัวและข้อมูลสาขาของคุณ
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 px-6">
                        <div className="grid grid-cols-5 items-center gap-4">
                            <Label className="col-span-2 text-left text-muted-foreground">บทบาท</Label>
                            <div className="col-span-3 font-medium">{getRoleDisplayName(devRole)}</div>
                        </div>
                        <div className="grid grid-cols-5 items-center gap-4">
                            <Label className="col-span-2 text-left text-muted-foreground">ชื่อ-สกุล</Label>
                            <div className="col-span-3 font-medium">{mockUser.name}</div>
                        </div>
                        <div className="grid grid-cols-5 items-center gap-4">
                            <Label className="col-span-2 text-left text-muted-foreground">ตำแหน่ง</Label>
                            <div className="col-span-3 font-medium">{mockUser.position}</div>
                        </div>
                        <div className="border-t border-border-subtle my-2" />
                        <div className="grid grid-cols-5 items-center gap-4">
                            <Label className="col-span-2 text-left text-muted-foreground">รหัสสาขา / OC Code</Label>
                            <div className="col-span-3 font-medium">108</div>
                        </div>
                        <div className="grid grid-cols-5 items-center gap-4">
                            <Label className="col-span-2 text-left text-muted-foreground">ชื่อสาขา / ทีม</Label>
                            <div className="col-span-3 font-medium">สาขาลาดพร้าว</div>
                        </div>
                        <div className="grid grid-cols-5 items-center gap-4">
                            <Label className="col-span-2 text-left text-muted-foreground">เขต / ฝ่าย</Label>
                            <div className="col-span-3 font-medium">สำนักงานเขตจตุจักร</div>
                        </div>
                        <div className="grid grid-cols-5 items-center gap-4">
                            <Label className="col-span-2 text-left text-muted-foreground">ภาค / สายงาน</Label>
                            <div className="col-span-3 font-medium">กรุงเทพมหานคร 2</div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="min-w-[120px]" onClick={() => setIsAccountOpen(false)}>ปิด</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={isBranchInfoOpen} onOpenChange={setIsBranchInfoOpen}>
                                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>ข้อมูลสาขา</DialogTitle>
                        <DialogDescription>
                            รายละเอียดข้อมูลสาขาของคุณ
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 px-6">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right text-muted-foreground font-medium">รหัสสาขา</Label>
                            <div className="col-span-3 font-semibold text-gray-900">{branchInfo.code}</div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right text-muted-foreground font-medium">ชื่อสาขา</Label>
                            <div className="col-span-3 font-semibold text-gray-900">{branchInfo.name}</div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right text-muted-foreground font-medium whitespace-nowrap">สนง.เขต</Label>
                            <div className="col-span-3 font-semibold text-gray-900">{branchInfo.district}</div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right text-muted-foreground font-medium">ภาค</Label>
                            <div className="col-span-3 font-semibold text-gray-900">{branchInfo.region}</div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <AnnouncementModal open={showAnnouncement} onOpenChange={setShowAnnouncement} />
        </div>
    );
}
