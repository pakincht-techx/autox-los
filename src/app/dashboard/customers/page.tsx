"use client";

import React, { useState } from "react";
import {
    Search,
    Plus,
    Download,
    Calendar,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/Select";
import { ActionMenu } from "@/components/ui/ActionMenu";
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from "@/components/ui/Table";

// Mock Data Types
type CustomerStatus = "Active" | "Inactive" | "Blacklisted" | "Onboarding";
type KYCStatus = "Verified" | "Pending" | "Rejected";
type RiskLevel = "Low" | "Medium" | "High";

interface Customer {
    id: string;
    name: string;
    avatarUrl?: string;
    initials: string;
    status: CustomerStatus;
    kycStatus: KYCStatus;
    riskLevel: RiskLevel;
    phone: string;
    activeLoans: number;
    registeredDate: string;
}

// Mock Data
const MOCK_CUSTOMERS: Customer[] = [
    {
        id: "CUST-001",
        name: "Somchai Jai-dee",
        initials: "SJ",
        status: "Active",
        kycStatus: "Verified",
        riskLevel: "Low",
        phone: "081-234-5678",
        activeLoans: 1,
        registeredDate: "2023-10-15",
    },
    {
        id: "CUST-002",
        name: "Araya Suea-ngam",
        initials: "AS",
        status: "Active",
        kycStatus: "Pending",
        riskLevel: "Medium",
        phone: "089-987-6543",
        activeLoans: 0,
        registeredDate: "2023-11-02",
    },
    {
        id: "CUST-003",
        name: "John Smith",
        initials: "JS",
        status: "Onboarding",
        kycStatus: "Pending",
        riskLevel: "High",
        phone: "062-111-2222",
        activeLoans: 0,
        registeredDate: "2024-01-20",
    },
    {
        id: "CUST-004",
        name: "Nadech Kugimiya",
        initials: "NK",
        status: "Active",
        kycStatus: "Verified",
        riskLevel: "Low",
        phone: "085-555-5555",
        activeLoans: 2,
        registeredDate: "2023-09-10",
    },
    {
        id: "CUST-005",
        name: "Yaya Urassaya",
        initials: "YU",
        status: "Blacklisted",
        kycStatus: "Verified",
        riskLevel: "High",
        phone: "090-000-0001",
        activeLoans: 0,
        registeredDate: "2023-08-05",
    },
    {
        id: "CUST-006",
        name: "Mario Maurer",
        initials: "MM",
        status: "Inactive",
        kycStatus: "Rejected",
        riskLevel: "Medium",
        phone: "082-333-4444",
        activeLoans: 0,
        registeredDate: "2023-12-12",
    },
];

import { useRouter } from "next/navigation";

export default function CustomersPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [riskFilter, setRiskFilter] = useState("All");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const filteredCustomers = MOCK_CUSTOMERS.filter((customer) => {
        // Search
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
            customer.name.toLowerCase().includes(searchLower) ||
            customer.id.toLowerCase().includes(searchLower) ||
            customer.phone.includes(searchLower);

        // Status Filter
        const matchesStatus =
            statusFilter === "All" || customer.status === statusFilter;

        // Risk Filter
        const matchesRisk = riskFilter === "All" || customer.riskLevel === riskFilter;

        // Date Range Filter
        let matchesDate = true;
        if (startDate || endDate) {
            const regDate = new Date(customer.registeredDate);
            if (startDate) {
                matchesDate = matchesDate && regDate >= new Date(startDate);
            }
            if (endDate) {
                matchesDate = matchesDate && regDate <= new Date(endDate);
            }
        }

        return matchesSearch && matchesStatus && matchesRisk && matchesDate;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500 text-foreground">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        รายชื่อลูกค้า
                    </h1>
                    <p className="text-sm text-muted mt-1">
                        จัดการข้อมูลลูกค้า ตรวจสอบสถานะ และดูรายการสินเชื่อ
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2 border-border-subtle hover:bg-gray-50" onClick={() => console.log('Export')}>
                        <Download className="h-4 w-4" />
                        Export
                    </Button>

                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="ค้นหาด้วยชื่อ, รหัสลูกค้า หรือเบอร์โทรศัพท์..."
                            className="pl-9 bg-gray-50/50 border-gray-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Filters Group */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Status Filter */}
                        <div className="w-[180px]">
                            <Select
                                value={statusFilter}
                                onValueChange={(val) => setStatusFilter(val)}
                            >
                                <SelectTrigger className="bg-gray-50/50 border-gray-200">
                                    <SelectValue placeholder="ทุกสถานะ" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">ทุกสถานะ</SelectItem>
                                    <SelectItem value="Active">ใช้งานปกติ</SelectItem>
                                    <SelectItem value="Onboarding">รอตรวจสอบ</SelectItem>
                                    <SelectItem value="Blacklisted">Blacklist</SelectItem>
                                    <SelectItem value="Inactive">ไม่เคลื่อนไหว</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Risk Filter */}
                        <div className="w-[180px]">
                            <Select
                                value={riskFilter}
                                onValueChange={(val) => setRiskFilter(val)}
                            >
                                <SelectTrigger className="bg-gray-50/50 border-gray-200">
                                    <SelectValue placeholder="ความเสี่ยงทั้งหมด" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">ความเสี่ยงทั้งหมด</SelectItem>
                                    <SelectItem value="Low">ต่ำ</SelectItem>
                                    <SelectItem value="Medium">ปานกลาง</SelectItem>
                                    <SelectItem value="High">สูง</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Date Range */}
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <input
                                type="date"
                                className="bg-transparent text-sm focus:outline-none w-[110px] text-gray-600 placeholder:text-gray-400"
                                placeholder="Start Date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                            <span className="text-gray-400 text-xs">-</span>
                            <input
                                type="date"
                                className="bg-transparent text-sm focus:outline-none w-[110px] text-gray-600 placeholder:text-gray-400"
                                placeholder="End Date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="border border-border-subtle rounded-xl overflow-hidden bg-white">
                <Table>
                    <TableHeader className="bg-gray-50/50 border-b border-border-subtle">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[300px]">ลูกค้า</TableHead>
                            <TableHead>สถานะ</TableHead>
                            <TableHead>KYC</TableHead>
                            <TableHead>ความเสี่ยง</TableHead>
                            <TableHead>ติดต่อ</TableHead>
                            <TableHead className="text-center">สินเชื่อ</TableHead>
                            <TableHead className="text-right">วันที่ลงทะเบียน</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredCustomers.length > 0 ? (
                            filteredCustomers.map((customer) => (
                                <TableRow
                                    key={customer.id}
                                    className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                                    onClick={() => router.push(`/dashboard/customers/${customer.id}`)}
                                >
                                    <TableCell className="font-medium">
                                        <div>
                                            <div className="font-semibold text-gray-900">{customer.name}</div>
                                            <div className="text-xs text-gray-500 font-normal">{customer.id}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge status={customer.status} />
                                    </TableCell>
                                    <TableCell>
                                        <KYCBadge status={customer.kycStatus} />
                                    </TableCell>
                                    <TableCell>
                                        <RiskBadge level={customer.riskLevel} />
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm text-gray-600 font-medium">{customer.phone}</div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {customer.activeLoans > 0 ? (
                                            <span className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-1.5 rounded text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                                                {customer.activeLoans}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right text-gray-500 font-medium text-xs">
                                        {new Date(customer.registeredDate).toLocaleDateString("th-TH", {
                                            day: 'numeric', month: 'short', year: 'numeric'
                                        })}
                                    </TableCell>
                                    <TableCell onClick={(e) => e.stopPropagation()}>
                                        <ActionMenu
                                            onView={() => router.push(`/dashboard/customers/${customer.id}`)}
                                            onEdit={() => console.log('Edit', customer.id)}
                                            onNewApplication={() => console.log('New App', customer.id)}
                                            onDelete={() => console.log('Delete', customer.id)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="h-24 text-center">
                                    <div className="flex flex-col items-center justify-center text-gray-500">
                                        <p>ไม่พบข้อมูลลูกค้าที่ค้นหา</p>
                                        <Button
                                            variant="link"
                                            className="text-chaiyo-blue"
                                            onClick={() => {
                                                setSearchTerm("");
                                                setStatusFilter("All");
                                                setRiskFilter("All");
                                                setStartDate("");
                                                setEndDate("");
                                            }}
                                        >
                                            ล้างตัวกรองทั้งหมด
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Footer (Simple) */}
            <div className="flex items-center justify-between px-2">
                <div className="text-xs text-gray-500 font-medium">
                    แสดง {filteredCustomers.length} จากทั้งหมด 124 รายการ
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled className="text-xs h-8">ก่อนหน้า</Button>
                    <Button variant="outline" size="sm" className="text-xs h-8">ถัดไป</Button>
                </div>
            </div>
        </div>
    );
}

// Helper Components for Badges

function StatusBadge({ status }: { status: CustomerStatus }) {
    const map: Record<CustomerStatus, "success" | "neutral" | "danger" | "warning"> = {
        Active: "success",
        Inactive: "neutral",
        Blacklisted: "danger",
        Onboarding: "warning",
    };
    const labelMap: Record<CustomerStatus, string> = {
        Active: "ใช้งานปกติ",
        Inactive: "ไม่เคลื่อนไหว",
        Blacklisted: "Blacklist",
        Onboarding: "รอตรวจสอบ",
    };
    return <Badge variant={map[status]}>{labelMap[status]}</Badge>;
}

function KYCBadge({ status }: { status: KYCStatus }) {
    // Custom styling for KYC to distinguish from main status
    const styles = {
        Verified: "text-green-600 bg-green-50 border border-green-200",
        Pending: "text-amber-600 bg-amber-50 border border-amber-200",
        Rejected: "text-red-600 bg-red-50 border border-red-200",
    };
    const labelMap: Record<KYCStatus, string> = {
        Verified: "ยืนยันแล้ว",
        Pending: "รอตรวจสอบ",
        Rejected: "ไม่ผ่าน",
    };

    return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${styles[status]}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status === 'Verified' ? 'bg-green-500' : status === 'Pending' ? 'bg-amber-500' : 'bg-red-500'}`} />
            {labelMap[status]}
        </span>
    )
}

function RiskBadge({ level }: { level: RiskLevel }) {
    const map: Record<RiskLevel, "success" | "warning" | "danger"> = {
        Low: "success",
        Medium: "warning",
        High: "danger",
    };
    const labelMap: Record<RiskLevel, string> = {
        Low: "ต่ำ",
        Medium: "ปานกลาง",
        High: "สูง",
    };
    return <Badge variant={map[level]} className="px-3 rounded-md">{labelMap[level]}</Badge>;
}
