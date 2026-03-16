"use client";
// Force refresh to resolve stale HMR cache and module factory errors

// Sync: Move sidebar button
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
    UserCircle,
    HelpCircle,
    Calculator,
    ChevronsUpDown,
    Search,
    Megaphone,
    Info,
    ArrowLeftRight,
    Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useSidebar, DevRole } from "@/components/layout/SidebarContext";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/Dialog";
import { Label } from "@/components/ui/Label";

type UserRole = 'Maker' | 'Checker' | 'Approver';

const mockUser = {
    name: 'สมหญิง จริงใจ',
    role: 'Maker' as UserRole,
    position: 'เจ้าหน้าที่สินเชื่อสาขา',
    branch: 'สาขาลาดพร้าว'
};

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
    const { isCollapsed, devRole, setDevRole } = useSidebar();
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [isBranchInfoOpen, setIsBranchInfoOpen] = useState(false);
    const [showAnnouncement, setShowAnnouncement] = useState(false);

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
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className={cn(
                            "flex items-center gap-3 p-2 rounded-md transition-colors cursor-pointer group hover:bg-white/10 border border-transparent outline-none",
                            isCollapsed && "justify-center p-1"
                        )}>
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xs shrink-0">
                                JS
                            </div>
                            {!isCollapsed && (
                                <>
                                    <div className="flex-1 overflow-hidden text-left">
                                        <p className="text-xs font-semibold text-white truncate">{mockUser.name}</p>
                                        <p className="text-[10px] text-white/60 truncate">{devRole === 'branch-staff' ? 'พนักงานสาขา' : 'ทีม Legal'}</p>
                                    </div>
                                    <ChevronsUpDown className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
                                </>
                            )}
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56" sideOffset={8}>
                        <DropdownMenuLabel>บัญชีของฉัน</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setIsAccountOpen(true)}>
                            <UserCircle className="mr-2 h-4 w-4" />
                            <span>ข้อมูลผู้ใช้</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                            <ArrowLeftRight className="w-3 h-3" />
                            สลับบทบาท (Dev)
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => setDevRole('branch-staff')}
                            className={cn(devRole === 'branch-staff' && 'bg-blue-50 text-blue-700 font-medium')}
                        >
                            <UserCircle className="mr-2 h-4 w-4" />
                            <span>พนักงานสาขา</span>
                            {devRole === 'branch-staff' && <span className="ml-auto text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-bold">Active</span>}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => setDevRole('legal-team')}
                            className={cn(devRole === 'legal-team' && 'bg-purple-50 text-purple-700 font-medium')}
                        >
                            <Shield className="mr-2 h-4 w-4" />
                            <span>ทีม Legal</span>
                            {devRole === 'legal-team' && <span className="ml-auto text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full font-bold">Active</span>}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => console.log("Logout")}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>ออกจากระบบ</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
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
            <div className={cn("py-6 pl-4 pr-2 space-y-2 border-t border-white/10", isCollapsed && "pl-4 pr-2")}>

                {/* Announcements - Direct trigger for Modal */}
                <div
                    className={cn(
                        "flex items-center gap-3 p-2 rounded-md transition-colors cursor-pointer group hover:bg-white/10 border border-transparent outline-none",
                        isCollapsed && "justify-center p-1 py-2"
                    )}
                    onClick={() => setShowAnnouncement(true)}
                >
                    <div className="relative shrink-0">
                        <Megaphone className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-chaiyo-blue"></span>
                    </div>
                    {!isCollapsed && (
                        <div className="flex-1 overflow-hidden text-left">
                            <p className="text-sm font-medium text-white/80 group-hover:text-white transition-colors truncate">ประกาศแจ้งเตือน</p>
                        </div>
                    )}
                </div>


            </div>

            <Dialog open={isAccountOpen} onOpenChange={setIsAccountOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>ข้อมูลผู้ใช้งาน</DialogTitle>
                        <DialogDescription>
                            ข้อมูลส่วนตัวและข้อมูลสาขาของคุณ
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-5 items-center gap-4">
                            <Label className="col-span-2 text-left text-muted-foreground">พนักงาน</Label>
                            <div className="col-span-3 font-medium">1234567</div>
                        </div>
                        <div className="grid grid-cols-5 items-center gap-4">
                            <Label className="col-span-2 text-left text-muted-foreground">ชื่อ-สกุล</Label>
                            <div className="col-span-3 font-medium">นางสาวสมหญิง จริงใจ</div>
                        </div>
                        <div className="grid grid-cols-5 items-center gap-4">
                            <Label className="col-span-2 text-left text-muted-foreground">ตำแหน่ง</Label>
                            <div className="col-span-3 font-medium">เจ้าหน้าที่สินเชื่อสาขา</div>
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
                </DialogContent>
            </Dialog>
            <Dialog open={isBranchInfoOpen} onOpenChange={setIsBranchInfoOpen}>
                <DialogContent className="sm:max-w-[425px]">
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
