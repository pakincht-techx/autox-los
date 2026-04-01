"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Calculator, Plus, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { ApplicationTable, SortKey, SortDirection } from "@/components/applications/ApplicationTable";
import { Application, ApplicationStatus } from "@/components/applications/types";
import { useSidebar, DevRole } from "@/components/layout/SidebarContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";

import { Dialog, DialogContent, DialogHeader, DialogBody, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/Dialog";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Combobox } from "@/components/ui/combobox";
import { DateRangePickerBE, toBEDisplay } from "@/components/ui/DateRangePickerBE";
import { CHECKER_MOCK_DATA } from "@/data/checkerMockData";

// Mock Data
const MOCK_DATA: Application[] = [
    {
        id: "mock-4",
        applicationNo: "25690317TLTDL0009",
        applicantName: "สมศักดิ์ ที่ดินทอง",
        makerName: "สมหญิง ใจดี",
        submissionDate: "17/03/2569 09:00",
        requestedAmount: 500000,
        status: "Draft",
        productType: "สินเชื่อโฉนดที่ดิน",
        lastActionTime: "17/03/2569 10:00"
    },
    {
        id: "mock-1",
        applicationNo: "25680313ULCPL0001",
        applicantName: "สมชาย ใจดี",
        makerName: "สมหญิง ใจดี",
        submissionDate: "13/03/2569 09:00",
        requestedAmount: 20000,
        status: "Draft",
        productType: "จำนำรถมอเตอร์ไซต์ผ่อนรายเดือน",
        lastActionTime: "14/03/2569 10:30"
    },
    {
        id: "mock-2",
        applicationNo: "25680313ULCPL0002",
        applicantName: "สมชาย ใจดี",
        makerName: "สมหญิง ใจดี",
        submissionDate: "13/03/2569 09:00",
        requestedAmount: 20000,
        status: "In Review",
        productType: "จำนำรถมอเตอร์ไซต์ผ่อนรายเดือน",
        lastActionTime: "14/03/2569 10:30"
    },
    {
        id: "mock-3",
        applicationNo: "25680313ULCPL0003",
        applicantName: "สมชาย ใจดี",
        makerName: "สมหญิง ใจดี",
        submissionDate: "13/03/2569 09:00",
        requestedAmount: 20000,
        status: "Draft",
        productType: "จำนำรถมอเตอร์ไซต์ผ่อนรายเดือน",
        lastActionTime: "14/03/2569 10:30"
    },
    {
        id: "1",
        applicationNo: "25690101ULCRL0001",
        applicantName: "สมชาย ใจดี",
        makerName: "สมหญิง ใจดี",
        submissionDate: "01/10/2569 09:00",
        requestedAmount: 500000,
        status: "Approved",
        productType: "สินเชื่อจำนำทะเบียนรถยนต์",
        previousProcessorName: "มาลี ศรีเมือง",
        lastActionTime: "01/10/2569 10:30"
    },
    {
        id: "2",
        applicationNo: "25690102TLTDL0002",
        applicantName: "วิภาวดี รักษ์ไทย",
        makerName: "กานต์ สว่างใจ",
        submissionDate: "02/10/2569 08:30",
        requestedAmount: 120000,
        status: "In Review",
        productType: "สินเชื่อโฉนดที่ดิน",
        previousProcessorName: "ทรงพล รวยทรัพย์",
        lastActionTime: "02/10/2569 11:15"
    },
    {
        id: "3",
        applicationNo: "25690103ULCRL0003",
        applicantName: "กมล คนขยัน",
        makerName: "สมหญิง ใจดี",
        submissionDate: "03/10/2569 10:15",
        requestedAmount: 35000,
        status: "In Review",
        productType: "สินเชื่อนาโนไฟแนนซ์",
        previousProcessorName: "สมชาย ยิ่งเจริญ",
        lastActionTime: "03/10/2569 14:20"
    },
    {
        id: "4",
        applicationNo: "25690104TLTKL0004",
        applicantName: "ดาริน สวยงาม",
        makerName: "กานต์ สว่างใจ",
        submissionDate: "04/10/2569 13:45",
        requestedAmount: 850000,
        status: "Draft",
        productType: "สินเชื่อจำนำทะเบียนรถบรรทุก",
        lastActionTime: "04/10/2569 09:45"
    },
    {
        id: "5",
        applicationNo: "25690105ULCRL0005",
        applicantName: "เอกชัย มั่นคง",
        makerName: "สมหญิง ใจดี",
        submissionDate: "05/10/2569 11:00",
        requestedAmount: 45000,
        status: "Rejected",
        productType: "สินเชื่อส่วนบุคคล",
        lastActionTime: "05/10/2569 16:10"
    },
    {
        id: "6",
        applicationNo: "25690106ULCRL0006",
        applicantName: "มานะ อดทน",
        makerName: "กานต์ สว่างใจ",
        submissionDate: "06/10/2569 14:20",
        requestedAmount: 200000,
        status: "In Review",
        productType: "สินเชื่อจำนำทะเบียนรถยนต์",
        lastActionTime: "06/10/2569 13:30"
    },
    {
        id: "7",
        applicationNo: "25690107ULCRL0007",
        applicantName: "ประภาส เจริญดี",
        makerName: "สมหญิง ใจดี",
        submissionDate: "07/10/2569 09:30",
        requestedAmount: 350000,
        status: "Sent Back",
        productType: "สินเชื่อจำนำทะเบียนรถยนต์",
        lastActionTime: "07/10/2569 08:50"
    },
    {
        id: "8",
        applicationNo: "25690108TLTDL0008",
        applicantName: "สุนีย์ แสงทอง",
        makerName: "กานต์ สว่างใจ",
        submissionDate: "08/10/2569 16:00",
        requestedAmount: 180000,
        status: "Sent Back",
        productType: "สินเชื่อโฉนดที่ดิน",
        lastActionTime: "08/10/2569 15:25"
    },
];

import { motion } from "framer-motion";

export default function ApplicationsPage() {
    const [currentTab, setCurrentTab] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const { devRole } = useSidebar();

    // Determine which data set to use based on role
    const isCheckerRole = devRole === 'district-checker' || devRole === 'rcco-checker' || devRole === 'rcco-approver';
    const currentData = isCheckerRole ? CHECKER_MOCK_DATA : MOCK_DATA;

    // Reset tab when role changes
    useEffect(() => {
        setCurrentTab("all");
        setCurrentPage(1);
    }, [devRole]);

    // Sort state
    const [sortKey, setSortKey] = useState<SortKey | null>('submissionDate');
    const [sortDirection, setSortDirection] = useState<SortDirection | null>('desc');

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            if (sortDirection === 'asc') setSortDirection('desc');
            else { setSortKey(null); setSortDirection(null); }
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
        setCurrentPage(1);
    };

    // Filter State
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterName, setFilterName] = useState("");
    const [filterProduct, setFilterProduct] = useState("all");
    const [filterStartDate, setFilterStartDate] = useState("");
    const [filterEndDate, setFilterEndDate] = useState("");
    const [filterPreviousProcessor, setFilterPreviousProcessor] = useState("");
    const [filterLastActionStartDate, setFilterLastActionStartDate] = useState("");
    const [filterLastActionEndDate, setFilterLastActionEndDate] = useState("");
    const [filterMaker, setFilterMaker] = useState("");

    const clearFilters = () => {
        setFilterName("");
        setFilterProduct("all");
        setFilterStartDate("");
        setFilterEndDate("");
        setFilterPreviousProcessor("");
        setFilterLastActionStartDate("");
        setFilterLastActionEndDate("");
        setFilterMaker("");
    };

    const hasActiveFilters = filterName !== "" || filterProduct !== "all" || filterStartDate !== "" || filterEndDate !== "" || filterPreviousProcessor !== "" || filterLastActionStartDate !== "" || filterLastActionEndDate !== "" || filterMaker !== "";

    // Generate unique options for Comboboxes
    const applicantNameOptions = Array.from(new Set(MOCK_DATA.map(app => app.applicantName))).map(name => ({ label: name, value: name }));
    const makerNameOptions = Array.from(new Set(MOCK_DATA.map(app => app.makerName))).map(name => ({ label: name, value: name }));
    const previousProcessorOptions = Array.from(new Set(MOCK_DATA.map(app => app.previousProcessorName).filter(Boolean))).map(name => ({ label: name!, value: name! }));

    // Role-based tabs and status filtering
    const tabs = isCheckerRole
        ? [
            { label: "ทั้งหมด", value: "all" },
            { label: "ผ่านการตรวจสอบ", value: "all-approved" },
            { label: "ต้องตรวจสอบ", value: "needs-review" },
            { label: "เสี่ยงการฉ้อโกง", value: "fraud-flagged" },
        ]
        : devRole === 'branch-staff'
            ? [
                { label: "ทั้งหมด", value: "all" },
                { label: "แบบร่าง", value: "Draft" },
                { label: "ส่งกลับ", value: "Sent Back" },
            ]
            : [
                { label: "ทั้งหมด", value: "all" },
                { label: "รอพิจารณา", value: "In Review" },
            ];

    const excludedStatuses: ApplicationStatus[] = devRole === 'branch-staff'
        ? ['Approved', 'Rejected', 'Cancelled', 'In Review']
        : ['Approved', 'Rejected', 'Cancelled', 'Draft', 'Sent Back'];

    const filteredData = MOCK_DATA.filter((app) => {
        if (excludedStatuses.includes(app.status)) return false;
        const matchesTab = currentTab === "all" || app.status === currentTab;
        const matchesSearch =
            app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.applicationNo.toLowerCase().includes(searchQuery.toLowerCase());

        // Dialog Filters
        const matchesName = filterName ? app.applicantName.toLowerCase().includes(filterName.toLowerCase()) : true;
        const matchesProduct = filterProduct !== "all" ? app.productType === filterProduct : true;
        const matchesMaker = filterMaker ? app.makerName.toLowerCase().includes(filterMaker.toLowerCase()) : true;
        const matchesPreviousProcessor = filterPreviousProcessor ? (app.previousProcessorName?.toLowerCase().includes(filterPreviousProcessor.toLowerCase()) ?? false) : true;

        let matchesDate = true;
        if (filterStartDate || filterEndDate) {
            const [datePart] = app.submissionDate.split(' ');
            const [d, m, y] = datePart.split('/');
            const appYearAD = parseInt(y) - 543;
            const appDatePath = `${appYearAD}-${m}-${d}`;

            if (filterStartDate && appDatePath < filterStartDate) matchesDate = false;
            if (filterEndDate && appDatePath > filterEndDate) matchesDate = false;
        }

        // Last Action Date Filter
        let matchesLastActionDate = true;
        if ((filterLastActionStartDate || filterLastActionEndDate) && app.lastActionTime) {
            const [datePart] = app.lastActionTime.split(' ');
            const [d2, m2, y2] = datePart.split('/');
            const actionYearAD = parseInt(y2) - 543;
            const actionDatePath = `${actionYearAD}-${m2}-${d2}`;

            if (filterLastActionStartDate && actionDatePath < filterLastActionStartDate) matchesLastActionDate = false;
            if (filterLastActionEndDate && actionDatePath > filterLastActionEndDate) matchesLastActionDate = false;
        }

        return matchesTab && matchesSearch && matchesName && matchesProduct && matchesDate && matchesMaker && matchesPreviousProcessor && matchesLastActionDate;
    });

    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortKey || !sortDirection) return 0;

        if (sortKey === 'submissionDate') {
            const [datePartA, timePartA = ''] = a.submissionDate.split(' ');
            const [datePartB, timePartB = ''] = b.submissionDate.split(' ');
            const dateA = datePartA.split('/').reverse().join('') + timePartA.replace(':', '');
            const dateB = datePartB.split('/').reverse().join('') + timePartB.replace(':', '');
            return sortDirection === 'asc' ? dateA.localeCompare(dateB) : dateB.localeCompare(dateA);
        }

        const valA = a[sortKey as keyof Application];
        const valB = b[sortKey as keyof Application];

        if (valA === undefined || valB === undefined) return 0;
        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    const totalPages = Math.max(1, Math.ceil(sortedData.length / rowsPerPage));
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedData = sortedData.slice(startIndex, startIndex + rowsPerPage);

    const { setBreadcrumbs, setRightContent } = useSidebar();

    useEffect(() => {
        setBreadcrumbs([]);
        setRightContent(null);
    }, [setBreadcrumbs, setRightContent]);

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 space-y-6 p-6 lg:p-8">
                {/* Page Title Header */}
                <div className="flex flex-row items-start justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">รายการใบสมัครของฉัน</h1>
                        <p className="text-sm text-muted-foreground">จัดการและตรวจสอบรายการใบสมัครสินเชื่อทั้งหมดของคุณ</p>
                    </div>

                    <Link href="/dashboard/pre-question">
                        <Button className="active:scale-95 transition-all shadow-sm gap-2">
                            <Plus className="w-4 h-4" />
                            เช็คราคา/สร้างใบสมัครใหม่
                        </Button>
                    </Link>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Tabs
                        value={currentTab}
                        onValueChange={(value) => { setCurrentTab(value); setCurrentPage(1); }}
                    >
                        <TabsList className="h-auto p-1 bg-gray-50/50 border border-border-subtle rounded-xl relative">
                            {tabs.map((tab) => (
                                <TabsTrigger
                                    key={tab.value}
                                    value={tab.value}
                                    className="relative px-4 py-1.5 text-xs font-bold rounded-lg data-[state=active]:bg-transparent data-[state=active]:text-chaiyo-blue data-[state=active]:shadow-none z-10"
                                >
                                    {currentTab === tab.value && (
                                        <motion.div
                                            layoutId="active-tab-pill"
                                            className="absolute inset-0 bg-white rounded-lg shadow-sm"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                                        />
                                    )}
                                    <span className="relative z-20">{tab.label}</span>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted hover:text-chaiyo-blue transition-colors z-10" />
                            <Input
                                type="text"
                                placeholder="ค้นหาชื่อ หรือเลขที่ใบสมัคร..."
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                className="pl-9 pr-4 h-9 shadow-none border-gray-200"
                            />
                        </div>

                        <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                            <DialogTrigger asChild>
                                <Button variant={hasActiveFilters ? "default" : "outline"} size="icon" className="h-9 w-9 shrink-0 relative">
                                    <Filter className="w-4 h-4" />
                                    {hasActiveFilters && (
                                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                                    )}
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-h-[90vh] flex flex-col">
                                <DialogHeader className="flex-shrink-0">
                                    <DialogTitle>ตัวกรอง</DialogTitle>
                                </DialogHeader>
                                <DialogBody className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>ชื่อ-นามสกุล ผู้กู้</Label>
                                        <Combobox
                                            options={applicantNameOptions}
                                            value={filterName}
                                            onValueChange={setFilterName}
                                            placeholder="ระบุชื่อหรือนามสกุล"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>ประเภทสินเชื่อ</Label>
                                        <Select
                                            value={filterProduct === "all" ? "" : filterProduct}
                                            onValueChange={(v) => setFilterProduct(v || "all")}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="ทั้งหมด" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">ทั้งหมด</SelectItem>
                                                <SelectItem value="สินเชื่อจำนำทะเบียนรถยนต์">สินเชื่อจำนำทะเบียนรถยนต์</SelectItem>
                                                <SelectItem value="สินเชื่อจำนำทะเบียนรถบรรทุก">สินเชื่อจำนำทะเบียนรถบรรทุก</SelectItem>
                                                <SelectItem value="สินเชื่อส่วนบุคคล">สินเชื่อส่วนบุคคล</SelectItem>
                                                <SelectItem value="สินเชื่อโฉนดที่ดิน">สินเชื่อโฉนดที่ดิน</SelectItem>
                                                <SelectItem value="สินเชื่อนาโนไฟแนนซ์">สินเชื่อนาโนไฟแนนซ์</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>ช่วงของวันเวลาสร้างใบสมัคร</Label>
                                        <DateRangePickerBE
                                            from={filterStartDate}
                                            to={filterEndDate}
                                            onRangeChange={(from, to) => { setFilterStartDate(from); setFilterEndDate(to); }}
                                            placeholder="เลือกช่วงวันที่สร้างใบสมัคร"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>ช่วงของวันเวลาดำเนินการล่าสุด</Label>
                                        <DateRangePickerBE
                                            from={filterLastActionStartDate}
                                            to={filterLastActionEndDate}
                                            onRangeChange={(from, to) => { setFilterLastActionStartDate(from); setFilterLastActionEndDate(to); }}
                                            placeholder="เลือกช่วงวันที่ดำเนินการ"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>ผู้ดำเนินการก่อนหน้า</Label>
                                        <Combobox
                                            options={previousProcessorOptions}
                                            value={filterPreviousProcessor}
                                            onValueChange={setFilterPreviousProcessor}
                                            placeholder="ระบุชื่อผู้ดำเนินการ"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>ผู้สร้างใบสมัคร</Label>
                                        <Combobox
                                            options={makerNameOptions}
                                            value={filterMaker}
                                            onValueChange={setFilterMaker}
                                            placeholder="ระบุชื่อผู้สร้างใบสมัคร"
                                        />
                                    </div>
                                </DialogBody>
                                <DialogFooter className="flex items-center sm:justify-between sm:space-x-0 w-full flex-shrink-0">
                                    <Button variant="ghost" onClick={clearFilters} className="text-muted-foreground hover:text-foreground">
                                        ล้างตัวกรอง
                                    </Button>
                                    <DialogClose asChild>
                                        <Button className="font-semibold min-w-[104px]" onClick={() => setCurrentPage(1)}>
                                            ตกลง
                                        </Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Active Filter Badges */}
                {hasActiveFilters && (() => {
                    const badges: { label: string; value: string; onRemove: () => void }[] = [];
                    if (filterName) badges.push({ label: "ผู้กู้", value: filterName, onRemove: () => setFilterName("") });
                    if (filterProduct !== "all") badges.push({ label: "สินเชื่อ", value: filterProduct, onRemove: () => setFilterProduct("all") });
                    if (filterStartDate || filterEndDate) badges.push({ label: "วันสร้าง", value: [filterStartDate, filterEndDate].filter(Boolean).map(toBEDisplay).join(" - "), onRemove: () => { setFilterStartDate(""); setFilterEndDate(""); } });
                    if (filterLastActionStartDate || filterLastActionEndDate) badges.push({ label: "วันดำเนินการ", value: [filterLastActionStartDate, filterLastActionEndDate].filter(Boolean).map(toBEDisplay).join(" - "), onRemove: () => { setFilterLastActionStartDate(""); setFilterLastActionEndDate(""); } });
                    if (filterPreviousProcessor) badges.push({ label: "ผู้ดำเนินการก่อนหน้า", value: filterPreviousProcessor, onRemove: () => setFilterPreviousProcessor("") });
                    if (filterMaker) badges.push({ label: "ผู้สร้าง", value: filterMaker, onRemove: () => setFilterMaker("") });

                    return (
                        <div className="flex flex-wrap items-center gap-2">
                            {badges.map((badge, i) => (
                                <span
                                    key={i}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-chaiyo-blue/10 text-chaiyo-blue text-xs font-medium"
                                >
                                    <span className="text-chaiyo-blue/60">{badge.label}:</span>
                                    <span className="max-w-[120px] truncate">{badge.value}</span>
                                </span>
                            ))}
                            <button
                                onClick={() => { clearFilters(); setCurrentPage(1); }}
                                className="text-xs text-muted-foreground hover:text-red-500 transition-colors underline underline-offset-2"
                            >
                                ล้างตัวกรองทั้งหมด
                            </button>
                        </div>
                    );
                })()}

                {/* Application List Table */}
                <ApplicationTable
                    data={paginatedData}
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                    source="my"
                />

                <div className="flex items-center justify-between px-2">
                    <p className="text-xs text-muted">
                        แสดง {filteredData.length === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + rowsPerPage, filteredData.length)} จาก {filteredData.length} รายการ
                    </p>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={currentPage <= 1}
                            className="text-xs"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        >
                            ก่อนหน้า
                        </Button>
                        <span className="text-xs text-muted px-2">
                            {currentPage} / {totalPages}
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={currentPage >= totalPages}
                            className="text-xs"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        >
                            ถัดไป
                        </Button>
                    </div>
                </div>
            </div>
        </div >
    );
}
