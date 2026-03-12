"use client";

import { useState, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ApplicationTable, SortKey, SortDirection } from "@/components/applications/ApplicationTable";
import { Application, ApplicationStatus } from "@/components/applications/types";
import { useSidebar } from "@/components/layout/SidebarContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/Dialog";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Combobox } from "@/components/ui/combobox";
import { DatePickerBE } from "@/components/ui/DatePickerBE";
import { motion } from "framer-motion";

// Mock Data — all applications in the branch (from all makers), only completed statuses
const MOCK_DATA: Application[] = [
    {
        id: "b1",
        applicationNo: "app-256700001",
        applicantName: "สมชาย ใจดี",
        makerName: "สมหญิง จริงใจ",
        submissionDate: "01/10/2566",
        requestedAmount: 500000,
        status: "Approved",
        productType: "สินเชื่อจำนำทะเบียนรถยนต์",
        previousProcessorName: "มาลี ศรีเมือง",
        lastActionTime: "01/10/2566 10:30"
    },
    {
        id: "b2",
        applicationNo: "app-256700005",
        applicantName: "เอกชัย มั่นคง",
        makerName: "สมหญิง จริงใจ",
        submissionDate: "05/10/2566",
        requestedAmount: 45000,
        status: "Rejected",
        productType: "สินเชื่อส่วนบุคคล",
        previousProcessorName: "ทรงพล รวยทรัพย์",
        lastActionTime: "05/10/2566 16:45"
    },
    {
        id: "b3",
        applicationNo: "app-256700010",
        applicantName: "จันทร์ แสงงาม",
        makerName: "กานต์ สว่างใจ",
        submissionDate: "10/10/2566",
        requestedAmount: 320000,
        status: "Approved",
        productType: "สินเชื่อจำนำทะเบียนรถยนต์",
        previousProcessorName: "สมชาย ยิ่งเจริญ",
        lastActionTime: "10/10/2566 09:15"
    },
    {
        id: "b4",
        applicationNo: "app-256700012",
        applicantName: "พิมพ์ใจ รักสวย",
        makerName: "กานต์ สว่างใจ",
        submissionDate: "12/10/2566",
        requestedAmount: 150000,
        status: "Cancelled",
        productType: "สินเชื่อโฉนดที่ดิน",
        lastActionTime: "12/10/2566 11:20"
    },
    {
        id: "b5",
        applicationNo: "app-256700015",
        applicantName: "วิทยา เก่งกล้า",
        makerName: "สมหญิง จริงใจ",
        submissionDate: "15/10/2566",
        requestedAmount: 780000,
        status: "Approved",
        productType: "สินเชื่อจำนำทะเบียนรถบรรทุก",
        lastActionTime: "15/10/2566 13:05"
    },
    {
        id: "b6",
        applicationNo: "app-256700018",
        applicantName: "อรุณ ศรีสวัสดิ์",
        makerName: "กานต์ สว่างใจ",
        submissionDate: "18/10/2566",
        requestedAmount: 60000,
        status: "Rejected",
        productType: "สินเชื่อนาโนไฟแนนซ์",
        lastActionTime: "18/10/2566 14:50"
    },
    {
        id: "b7",
        applicationNo: "app-256700020",
        applicantName: "ธนพล เจริญผล",
        makerName: "สมหญิง จริงใจ",
        submissionDate: "20/10/2566",
        requestedAmount: 420000,
        status: "Approved",
        productType: "สินเชื่อจำนำทะเบียนรถยนต์",
        lastActionTime: "20/10/2566 08:30"
    },
    {
        id: "b8",
        applicationNo: "app-256700022",
        applicantName: "นิตยา อ่อนน้อม",
        makerName: "กานต์ สว่างใจ",
        submissionDate: "22/10/2566",
        requestedAmount: 90000,
        status: "Cancelled",
        productType: "สินเชื่อส่วนบุคคล",
        lastActionTime: "22/10/2566 15:10"
    },
    {
        id: "b9",
        applicationNo: "app-256700025",
        applicantName: "ปราโมทย์ ใจเย็น",
        makerName: "สมหญิง จริงใจ",
        submissionDate: "25/10/2566",
        requestedAmount: 250000,
        status: "Rejected",
        productType: "สินเชื่อโฉนดที่ดิน",
        lastActionTime: "25/10/2566 10:00"
    },
    {
        id: "b10",
        applicationNo: "app-256700028",
        applicantName: "สุดา แก้วมณี",
        makerName: "กานต์ สว่างใจ",
        submissionDate: "28/10/2566",
        requestedAmount: 650000,
        status: "Approved",
        productType: "สินเชื่อจำนำทะเบียนรถยนต์",
        lastActionTime: "28/10/2566 17:30"
    },
];

export default function AllApplicationsPage() {
    const [currentTab, setCurrentTab] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

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
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterStartDate, setFilterStartDate] = useState("");
    const [filterEndDate, setFilterEndDate] = useState("");
    const [filterMaker, setFilterMaker] = useState("");

    const clearFilters = () => {
        setFilterName("");
        setFilterProduct("all");
        setFilterStatus("all");
        setFilterStartDate("");
        setFilterEndDate("");
        setFilterMaker("");
    };

    const hasActiveFilters = filterName !== "" || filterProduct !== "all" || filterStatus !== "all" || filterStartDate !== "" || filterEndDate !== "" || filterMaker !== "";

    // Generate unique options for Comboboxes
    const applicantNameOptions = Array.from(new Set(MOCK_DATA.map(app => app.applicantName))).map(name => ({ label: name, value: name }));
    const makerNameOptions = Array.from(new Set(MOCK_DATA.map(app => app.makerName))).map(name => ({ label: name, value: name }));

    const tabs = [
        { label: "ทั้งหมด", value: "all" },
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
        const matchesStatus = filterStatus !== "all" ? app.status === filterStatus : true;

        // Date Filter (simple string comparison since it's mock DD/MM/YYYY vs ISO YYYY-MM-DD from DatePicker. Let's do a basic check if implemented, or skip deep parsing for prototype)
        // Note: DatePicker returns YYYY-MM-DD, Mock Data has DD/MM/BBBB (2566)
        let matchesDate = true;
        if (filterStartDate || filterEndDate) {
            // Rough logic: convert mock format (DD/MM/YYYY Thai) to comparable string
            const [d, m, y] = app.submissionDate.split('/');
            const appYearAD = parseInt(y) - 543;
            const appDatePath = `${appYearAD}-${m}-${d}`;

            if (filterStartDate && appDatePath < filterStartDate) matchesDate = false;
            if (filterEndDate && appDatePath > filterEndDate) matchesDate = false;
        }

        return matchesTab && matchesSearch && matchesName && matchesMaker && matchesProduct && matchesStatus && matchesDate;
    });

    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortKey || !sortDirection) return 0;

        if (sortKey === 'submissionDate') {
            const dateA = a.submissionDate.split('/').reverse().join('');
            const dateB = b.submissionDate.split('/').reverse().join('');
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
                                            className="absolute inset-0 bg-white border border-chaiyo-blue rounded-lg shadow-sm"
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
                            <DialogContent className="sm:max-w-[450px]">
                                <DialogHeader>
                                    <DialogTitle>ตัวกรอง</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-5 py-4">
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
                                        <Label>สถานะใบสมัคร</Label>
                                        <Select
                                            value={filterStatus === "all" ? "" : filterStatus}
                                            onValueChange={(v) => setFilterStatus(v || "all")}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="ทั้งหมด" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">ทั้งหมด</SelectItem>
                                                <SelectItem value="Approved">อนุมัติ</SelectItem>
                                                <SelectItem value="Rejected">ถูกปฎิเสธ</SelectItem>
                                                <SelectItem value="Cancelled">ยกเลิกใบสมัคร</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>ช่วงของวันที่สร้างใบสมัคร</Label>
                                        <div className="flex items-center gap-2">
                                            <DatePickerBE
                                                value={filterStartDate}
                                                onChange={setFilterStartDate}
                                                placeholder="ตั้งแต่ (วว/ดด/ปปปป)"
                                                inputClassName="h-12 rounded-xl flex-1"
                                            />
                                            <span className="text-muted-foreground">-</span>
                                            <DatePickerBE
                                                value={filterEndDate}
                                                onChange={setFilterEndDate}
                                                placeholder="ถึง (วว/ดด/ปปปป)"
                                                inputClassName="h-12 rounded-xl flex-1"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>ชื่อผู้สร้าง</Label>
                                        <Combobox
                                            options={makerNameOptions}
                                            value={filterMaker}
                                            onValueChange={setFilterMaker}
                                            placeholder="ระบุชื่อผู้สร้างใบสมัคร"
                                        />
                                    </div>
                                </div>
                                <DialogFooter className="flex items-center sm:justify-between sm:space-x-0 w-full">
                                    <Button variant="ghost" onClick={clearFilters} className="text-muted-foreground hover:text-foreground">
                                        ล้างตัวกรอง
                                    </Button>
                                    <DialogClose asChild>
                                        <Button className="font-semibold px-8" onClick={() => setCurrentPage(1)}>
                                            ตกลง
                                        </Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Application List Table */}
                <ApplicationTable
                    data={paginatedData}
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    onSort={handleSort}
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
