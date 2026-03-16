import { Badge } from "@/components/ui/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Application, ApplicationStatus } from "./types";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

export type SortKey = 'applicationNo' | 'applicantName' | 'productType' | 'status' | 'submissionDate' | 'makerName' | 'previousProcessorName' | 'lastActionTime';
export type SortDirection = 'asc' | 'desc' | null;

interface ApplicationTableProps {
    data: Application[];
    sortKey?: SortKey | null;
    sortDirection?: SortDirection | null;
    onSort?: (key: SortKey) => void;
    source?: 'my' | 'all';
}

const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
        case 'Approved':
            return 'success';
        case 'Rejected':
            return 'danger';
        case 'Cancelled':
            return 'neutral';
        case 'In Review':
            return 'yellow';
        case 'Sent Back':
            return 'warning';
        case 'Draft':
        default:
            return 'neutral';
    }
};

const getStatusLabel = (status: ApplicationStatus) => {
    switch (status) {
        case 'Approved':
            return 'อนุมัติ';
        case 'Rejected':
            return 'ถูกปฎิเสธ'; // Fixed typo from 'ถูกปฎิเสธ' if any, keeping simple 'ปฏิเสธ' as per previous code, or match user request 'ถูกปฎิเสธ'? User said 'ถูกปฎิเสธ', let's stick to existing simple if possible or update. The previous code was 'ปฏิเสธ'.
        case 'In Review':
            return 'รอพิจารณา';
        case 'Sent Back':
            return 'ส่งกลับ';
        case 'Cancelled':
            return 'ยกเลิก';
        case 'Draft':
            return 'แบบร่าง';
        default:
            return status;
    }
};

export function ApplicationTable({ data, sortKey, sortDirection, onSort, source = 'my' }: ApplicationTableProps) {
    const router = useRouter();

    const handleRowClick = (app: Application) => {
        // Route mock cases to the real [id] detail page with mockCase param
        if (app.id?.startsWith('mock-')) {
            const caseNum = app.id.replace('mock-', '');
            router.push(`/dashboard/applications/${app.id}?from=${source}&mockCase=${caseNum}`);
            return;
        }

        if (app.status === 'Draft') {
            router.push(`/dashboard/new-application/${app.applicationNo}/customer-info?state=draft`);
        } else {
            router.push(`/dashboard/applications/${app.id}?from=${source}`);
        }
    };

    const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
        if (!onSort) return null;
        if (sortKey !== columnKey || !sortDirection) {
            return <ArrowUpDown className="ml-2 h-4 w-4 opacity-40" />;
        }
        return sortDirection === 'asc' ? (
            <ArrowUp className="ml-2 h-4 w-4 text-chaiyo-blue" />
        ) : (
            <ArrowDown className="ml-2 h-4 w-4 text-chaiyo-blue" />
        );
    };

    const SortableHead = ({ label, columnKey, className = "" }: { label: string, columnKey: SortKey, className?: string }) => (
        <TableHead
            className={`group cursor-pointer hover:bg-gray-100/50 transition-colors whitespace-nowrap ${className}`}
            onClick={() => onSort && onSort(columnKey)}
        >
            <div className={`flex items-center ${className.includes('text-center') ? 'justify-center' : ''}`}>
                <span>{label}</span>
                <SortIcon columnKey={columnKey} />
            </div>
        </TableHead>
    );

    return (
        <div className="rounded-xl border border-border-subtle overflow-hidden">
            <Table>
                <TableHeader className="bg-gray-50 border-b border-border-subtle">
                    <TableRow className="hover:bg-transparent">
                        <SortableHead label="เลขที่ใบสมัคร" columnKey="applicationNo" className="min-w-[170px] max-w-[170px] sticky left-0 z-20 bg-gray-50" />
                        <SortableHead label="ชื่อ-นามสกุลผู้กู้" columnKey="applicantName" className="sticky left-[170px] z-20 bg-gray-50 before:absolute before:inset-y-0 before:-right-px before:w-px before:bg-border-subtle" />
                        <SortableHead label="ประเภทสินเชื่อ" columnKey="productType" />
                        <SortableHead label="สถานะใบสมัคร" columnKey="status" className="text-center" />
                        <SortableHead label="วันที่สร้างใบสมัคร" columnKey="submissionDate" />
                        <SortableHead label="วันที่ดำเนินการล่าสุด" columnKey="lastActionTime" />
                        <SortableHead label="ผู้ดำเนินการก่อนหน้า" columnKey="previousProcessorName" />
                        <SortableHead label="ผู้สร้างใบสมัคร" columnKey="makerName" />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="h-32 text-center text-muted">
                                ไม่พบข้อมูลรายการใบสมัคร
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((app) => (
                            <TableRow
                                key={app.id}
                                className="group cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => handleRowClick(app)}
                            >
                                <TableCell className="font-medium text-foreground whitespace-nowrap sticky left-0 z-10 bg-white group-hover:bg-gray-50 transition-colors min-w-[170px] max-w-[170px] overflow-hidden text-ellipsis">{app.applicationNo}</TableCell>
                                <TableCell className="whitespace-nowrap sticky left-[170px] z-10 bg-white group-hover:bg-gray-50 transition-colors before:absolute before:inset-y-0 before:-right-px before:w-px before:bg-border-subtle before:z-10">
                                    <span className="font-semibold text-foreground text-[13px]">{app.applicantName}</span>
                                </TableCell>
                                <TableCell className="text-muted whitespace-nowrap">{app.productType}</TableCell>

                                <TableCell className="text-center whitespace-nowrap">
                                    <Badge variant={getStatusColor(app.status)}>
                                        {getStatusLabel(app.status)}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-muted whitespace-nowrap">{app.submissionDate}</TableCell>
                                <TableCell className="text-muted text-[13px] whitespace-nowrap">{app.lastActionTime || '-'}</TableCell>
                                <TableCell className="text-muted text-[13px] whitespace-nowrap">{app.previousProcessorName || '-'}</TableCell>
                                <TableCell className="text-muted text-[13px] whitespace-nowrap">{app.makerName}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
