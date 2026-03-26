"use client";

import { useState, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ApplicationTable, SortKey, SortDirection } from "@/components/applications/ApplicationTable";
import { Application, ApplicationStatus } from "@/components/applications/types";
import { useSidebar, DevRole } from "@/components/layout/SidebarContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Dialog, DialogContent, DialogHeader, DialogBody, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/Dialog";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Combobox } from "@/components/ui/combobox";
import { DateRangePickerBE, toBEDisplay } from "@/components/ui/DateRangePickerBE";
import { motion } from "framer-motion";

// Mock Data — all applications in the branch (from all makers), only completed statuses
const MOCK_DATA: Application[] = [
    {
        id: "b1",
        applicationNo: "25690101ULCRL0001",
        applicantName: "สมชาย ใจดี",
        makerName: "สมหญิง จริงใจ",
        submissionDate: "01/10/2569 08:15",
        requestedAmount: 500000,
        status: "Approved",
        productType: "สินเชื่อจำนำทะเบียนรถยนต์",
        previousProcessorName: "มาลี ศรีเมือง",
        lastActionTime: "01/10/2569 10:30"
    },
    {
        id: "b2",
        applicationNo: "25690105ULCRL0005",
        applicantName: "เอกชัย มั่นคง",
        makerName: "สมหญิง จริงใจ",
        submissionDate: "05/10/2569 10:30",
        requestedAmount: 45000,
        status: "Rejected",
        productType: "สินเชื่อส่วนบุคคล",
        previousProcessorName: "ทรงพล รวยทรัพย์",
        lastActionTime: "05/10/2569 16:45"
    },
    {
        id: "b3",
        applicationNo: "25690110ULCRL0010",
        applicantName: "จันทร์ แสงงาม",
        makerName: "กานต์ สว่างใจ",
        submissionDate: "10/10/2569 09:45",
        requestedAmount: 320000,
        status: "Approved",
        productType: "สินเชื่อจำนำทะเบียนรถยนต์",
        previousProcessorName: "สมชาย ยิ่งเจริญ",
        lastActionTime: "10/10/2569 09:15"
    },
    {
        id: "b4",
        applicationNo: "25690112TLTDL0012",
        applicantName: "พิมพ์ใจ รักสวย",
        makerName: "กานต์ สว่างใจ",
        submissionDate: "12/10/2569 14:00",
        requestedAmount: 150000,
        status: "Cancelled",
        productType: "สินเชื่อโฉนดที่ดิน",
        lastActionTime: "12/10/2569 11:20"
    },
    {
        id: "b5",
        applicationNo: "25690115TLTKL0015",
        applicantName: "วิทยา เก่งกล้า",
        makerName: "สมหญิง จริงใจ",
        submissionDate: "15/10/2569 11:20",
        requestedAmount: 780000,
        status: "Approved",
        productType: "สินเชื่อจำนำทะเบียนรถบรรทุก",
        lastActionTime: "15/10/2569 13:05"
    },
    {
        id: "b6",
        applicationNo: "25690118ULCRL0018",
        applicantName: "อรุณ ศรีสวัสดิ์",
        makerName: "กานต์ สว่างใจ",
        submissionDate: "18/10/2569 13:30",
        requestedAmount: 60000,
        status: "Rejected",
        productType: "สินเชื่อนาโนไฟแนนซ์",
        lastActionTime: "18/10/2569 14:50"
    },
    {
        id: "b7",
        applicationNo: "25690120ULCRL0020",
        applicantName: "ธนพล เจริญผล",
        makerName: "สมหญิง จริงใจ",
        submissionDate: "20/10/2569 07:50",
        requestedAmount: 420000,
        status: "Approved",
        productType: "สินเชื่อจำนำทะเบียนรถยนต์",
        lastActionTime: "20/10/2569 08:30"
    },
    {
        id: "b8",
        applicationNo: "25690122ULCRL0022",
        applicantName: "นิตยา อ่อนน้อม",
        makerName: "กานต์ สว่างใจ",
        submissionDate: "22/10/2569 15:45",
        requestedAmount: 90000,
        status: "Cancelled",
        productType: "สินเชื่อส่วนบุคคล",
        lastActionTime: "22/10/2569 15:10"
    },
    {
        id: "b9",
        applicationNo: "25690125TLTDL0025",
        applicantName: "ปราโมทย์ ใจเย็น",
        makerName: "สมหญิง จริงใจ",
        submissionDate: "25/10/2569 09:00",
        requestedAmount: 250000,
        status: "Rejected",
        productType: "สินเชื่อโฉนดที่ดิน",
        lastActionTime: "25/10/2569 10:00"
    },
    {
        id: "b10",
        applicationNo: "25690128ULCRL0028",
        applicantName: "สุดา แก้วมณี",
        makerName: "กานต์ สว่างใจ",
        submissionDate: "28/10/2569 16:15",
        requestedAmount: 650000,
        status: "Approved",
        productType: "สินเชื่อจำนำทะเบียนรถยนต์",
        lastActionTime: "28/10/2569 17:30"
    },
    {
        id: "b11",
        applicationNo: "25690130ULCRL0030",
        applicantName: "วิชัย อดทน",
        makerName: "สมหญิง จริงใจ",
        submissionDate: "30/10/2569 10:00",
        requestedAmount: 400000,
        status: "In Review",
        productType: "สินเชื่อส่วนบุคคล",
        lastActionTime: "30/10/2569 11:20"
    },
    {
        id: "b12",
        applicationNo: "25690201ULCRL0032",
        applicantName: "กมล พงษ์เจริญ",
        makerName: "สมหญิง จริงใจ",
        submissionDate: "01/11/2569 09:30",
        requestedAmount: 350000,
        status: "Draft",
        productType: "สินเชื่อจำนำทะเบียนรถยนต์",
        lastActionTime: "01/11/2569 09:30"
    },
    {
        id: "b13",
        applicationNo: "25690203TLTDL0034",
        applicantName: "รัตนา สุขสม",
        makerName: "กานต์ สว่างใจ",
        submissionDate: "03/11/2569 14:15",
        requestedAmount: 180000,
        status: "Draft",
        productType: "สินเชื่อโฉนดที่ดิน",
        lastActionTime: "03/11/2569 14:15"
    },
    {
        id: "b14",
        applicationNo: "25690205ULCRL0036",
        applicantName: "ประยุทธ์ แสนดี",
        makerName: "สมหญิง จริงใจ",
        submissionDate: "05/11/2569 11:00",
        requestedAmount: 520000,
        status: "Sent Back",
        productType: "สินเชื่อจำนำทะเบียนรถยนต์",
        previousProcessorName: "มาลี ศรีเมือง",
        lastActionTime: "08/11/2569 15:20"
    },
    {
        id: "b15",
        applicationNo: "25690207ULCRL0038",
        applicantName: "สุวรรณี ทองคำ",
        makerName: "กานต์ สว่างใจ",
        submissionDate: "07/11/2569 08:45",
        requestedAmount: 75000,
        status: "Sent Back",
        productType: "สินเชื่อนาโนไฟแนนซ์",
        previousProcessorName: "ทรงพล รวยทรัพย์",
        lastActionTime: "10/11/2569 10:00"
    },
];

export default function AllApplicationsPage() {
    const [currentTab, setCurrentTab] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const { devRole } = useSidebar();

    // Reset tab when role changes
    useEffect(() => {
        setCurrentTab("all");
        setCurrentPage(1);
    }, [devRole]);

    // Sort State
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
    const [filterMaker, setFilterMaker] = useState("");
    const [filterPreviousProcessor, setFilterPreviousProcessor] = useState("");
    const [filterLastActionStartDate, setFilterLastActionStartDate] = useState("");
    const [filterLastActionEndDate, setFilterLastActionEndDate] = useState("");

    const clearFilters = () => {
        setFilterName("");
        setFilterProduct("all");
        setFilterStartDate("");
        setFilterEndDate("");
        setFilterMaker("");
        setFilterPreviousProcessor("");
        setFilterLastActionStartDate("");
        setFilterLastActionEndDate("");
    };

    const hasActiveFilters = filterName !== "" || filterProduct !== "all" || filterStartDate !== "" || filterEndDate !== "" || filterMaker !== "" || filterPreviousProcessor !== "" || filterLastActionStartDate !== "" || filterLastActionEndDate !== "";

    // Generate unique options for Comboboxes
    const applicantNameOptions = Array.from(new Set(MOCK_DATA.map(app => app.applicantName))).map(name => ({ label: name, value: name }));
    const makerNameOptions = Array.from(new Set(MOCK_DATA.map(app => app.makerName))).map(name => ({ label: name, value: name }));
    const previousProcessorOptions = Array.from(new Set(MOCK_DATA.map(app => app.previousProcessorName).filter(Boolean))).map(name => ({ label: name!, value: name! }));

    // Role-based tabs
    const tabs = devRole === 'branch-staff'
        ? [
            { label: "ทั้งหมด", value: "all" },
            { label: "แบบร่าง", value: "Draft" },
            { label: "รอพิจารณา", value: "In Review" },
            { label: "ส่งกลับ", value: "Sent Back" },
            { label: "อนุมัติ", value: "Approved" },
            { label: "ถูกปฎิเสธ", value: "Rejected" },
            { label: "ยกเลิกใบสมัคร", value: "Cancelled" },
        ]
        : [
            { label: "ทั้งหมด", value: "all" },
            { label: "แบบร่าง", value: "Draft" },
            { label: "ส่งกลับ", value: "Sent Back" },
            { label: "อนุมัติ", value: "Approved" },
            { label: "ถูกปฎิเสธ", value: "Rejected" },
            { label: "ยกเลิกใบสมัคร", value: "Cancelled" },
        ];

    const filteredData = MOCK_DATA.filter((app) => {
        // Tab Filter
        const matchesTab = currentTab === "all" || app.status === currentTab;

        // Search Filter
        const matchesSearch =
            app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.applicationNo.toLowerCase().includes(searchQuery.toLowerCase());

        // Dialog Filters
        const matchesName = filterName ? app.applicantName.toLowerCase().includes(filterName.toLowerCase()) : true;
        const matchesMaker = filterMaker ? app.makerName.toLowerCase().includes(filterMaker.toLowerCase()) : true;
        const matchesProduct = filterProduct !== "all" ? app.productType === filterProduct : true;
        const matchesPreviousProcessor = filterPreviousProcessor ? (app.previousProcessorName?.toLowerCase().includes(filterPreviousProcessor.toLowerCase()) ?? false) : true;

        // Date Filter (simple string comparison since it's mock DD/MM/YYYY HH:MM vs ISO YYYY-MM-DD from DatePicker)
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

        return matchesTab && matchesSearch && matchesName && matchesMaker && matchesProduct && matchesDate && matchesPreviousProcessor && matchesLastActionDate;
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

        const valA = a[sortKey as keyof typeof a];
        const valB = b[sortKey as keyof typeof b];

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
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">รายการใบสมัครทั้งหมด</h1>
                        <p className="text-sm text-muted-foreground">รายการใบสมัครสินเชื่อทั้งหมดภายในสาขา</p>
                    </div>
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
                                            layoutId="all-apps-active-tab-pill"
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
                    source="all"
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
        </div>
    );
}
