import { ActionMenu } from "@/components/ui/ActionMenu";
import { Badge } from "@/components/ui/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Application, ApplicationStatus } from "./types";
import { Eye, FileEdit, Trash2 } from "lucide-react";
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
        case 'In Review':
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
            router.push('/dashboard/new-application?state=draft');
        } else {
            router.push(`/dashboard/applications/${app.id}`);
        }
    };

    return (
        <div className="rounded-xl border border-border-subtle overflow-hidden">
            <Table>
                <TableHeader className="bg-gray-50/50 border-b border-border-subtle">
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[150px]">รหัสคำขอ</TableHead>
                        <TableHead>ผู้ยื่นคำขอ</TableHead>
                        <TableHead>ประเภทสินเชื่อ</TableHead>
                        <TableHead>วันที่ยื่น</TableHead>
                        <TableHead className="text-right">วงเงินที่ขอ</TableHead>
                        <TableHead className="text-center">สถานะ</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="h-32 text-center text-muted">
                                ไม่พบข้อมูลรายการคำขอ
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
                                <TableCell className="text-muted">{app.submissionDate}</TableCell>
                                <TableCell className="text-right font-medium">
                                    {app.requestedAmount.toLocaleString('th-TH', { minimumFractionDigits: 0 })}
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge variant={getStatusColor(app.status)}>
                                        {getStatusLabel(app.status)}
                                    </Badge>
                                </TableCell>
                                <TableCell onClick={(e) => e.stopPropagation()}>
                                    <ActionMenu
                                        items={[
                                            {
                                                label: "ดูรายละเอียด",
                                                icon: <Eye className="w-4 h-4" />,
                                                onClick: () => router.push(`/dashboard/applications/${app.id}`),
                                            },
                                            {
                                                label: "แก้ไข",
                                                icon: <FileEdit className="w-4 h-4" />,
                                                onClick: () => console.log("Edit", app.id),
                                            },
                                            {
                                                label: "ลบ",
                                                icon: <Trash2 className="w-4 h-4" />,
                                                variant: "destructive",
                                                onClick: () => console.log("Delete", app.id),
                                            },
                                        ]}
                                    />
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
