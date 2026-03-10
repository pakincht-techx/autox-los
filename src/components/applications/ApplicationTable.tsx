import { Badge } from "@/components/ui/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Application, ApplicationStatus } from "./types";
import { useRouter } from "next/navigation";

interface ApplicationTableProps {
    data: Application[];
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

export function ApplicationTable({ data }: ApplicationTableProps) {
    const router = useRouter();

    const handleRowClick = (app: Application) => {
        if (app.status === 'Draft') {
            router.push(`/dashboard/new-application/${app.applicationNo}/customer-info?state=draft`);
        } else {
            router.push(`/dashboard/applications/${app.id}`);
        }
    };

    return (
        <div className="rounded-xl border border-border-subtle overflow-hidden">
            <Table>
                <TableHeader className="bg-gray-50/50 border-b border-border-subtle">
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[150px]">เลขที่ใบสมัคร</TableHead>
                        <TableHead>ชื่อ-นามสกุลผู้กู้</TableHead>
                        <TableHead>ประเภทสินเชื่อ</TableHead>
                        <TableHead className="text-center">สถานะ</TableHead>
                        <TableHead>วันที่สร้างใบสมัคร</TableHead>
                        <TableHead>ผู้สร้างใบสมัคร</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-32 text-center text-muted">
                                ไม่พบข้อมูลรายการใบสมัคร
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((app) => (
                            <TableRow
                                key={app.id}
                                className="group cursor-pointer hover:bg-gray-50/50 transition-colors"
                                onClick={() => handleRowClick(app)}
                            >
                                <TableCell className="font-medium text-foreground">{app.applicationNo}</TableCell>
                                <TableCell>
                                    <span className="font-semibold text-foreground text-[13px]">{app.applicantName}</span>
                                </TableCell>
                                <TableCell className="text-muted">{app.productType}</TableCell>

                                <TableCell className="text-center">
                                    <Badge variant={getStatusColor(app.status)}>
                                        {getStatusLabel(app.status)}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-muted">{app.submissionDate}</TableCell>
                                <TableCell className="text-muted text-[13px]">{app.makerName}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
