"use client";

import { ArrowLeft, CheckCircle, XCircle, FileText, MoreVertical, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { ApplicationStatus } from "@/components/applications/types";

interface ApplicationHeaderProps {
    applicationId: string;
    applicationNo: string;
    status: ApplicationStatus;
    applicantName: string;
    productType: string;
    onApprove?: () => void;
    onReject?: () => void;
}

const getStatusBadgeVariant = (status: ApplicationStatus) => {
    switch (status) {
        case 'Approved': return 'success';
        case 'Rejected': return 'danger';
        case 'In Review': return 'warning';
        case 'Draft':
        default: return 'neutral';
    }
};

const getStatusLabel = (status: ApplicationStatus) => {
    switch (status) {
        case 'Approved': return 'อนุมัติ';
        case 'Rejected': return 'ปฏิเสธ';
        case 'In Review': return 'รอพิจารณา';
        case 'Draft': return 'แบบร่าง';
        default: return status;
    }
}

export function ApplicationHeader({
    applicationNo,
    status,
    applicantName,
    productType,
    onApprove,
    onReject
}: ApplicationHeaderProps) {
    return (
        <div className="bg-white border-b border-border-subtle sticky top-0 z-10 w-full animate-in slide-in-from-top-2 duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex flex-col gap-4">
                    {/* Breadcrumb / Back */}
                    <Link
                        href="/dashboard/applications"
                        className="inline-flex items-center text-xs text-muted hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="mr-1 h-3 w-3" />
                        กลับไปรายการคำขอ
                    </Link>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        {/* Title & Info */}
                        <div className="flex items-start gap-4">
                            <div className="h-12 w-12 rounded-lg bg-chaiyo-blue/5 border border-chaiyo-blue/10 flex items-center justify-center">
                                <FileText className="h-6 w-6 text-chaiyo-blue" />
                            </div>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-xl font-bold text-foreground tracking-tight">{applicationNo}</h1>
                                    <Badge variant={getStatusBadgeVariant(status)} className="rounded-md">
                                        {getStatusLabel(status)}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                    <span className="font-medium text-gray-900">{applicantName}</span>
                                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                                    <span>{productType}</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <Button variant="outline" className="border-border-subtle hover:bg-gray-50 text-muted hover:text-foreground">
                                <MoreVertical className="h-4 w-4" />
                            </Button>

                            {status === 'In Review' && (
                                <>
                                    <Button
                                        variant="outline"
                                        className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                                        onClick={onReject}
                                    >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        ปฏิเสธ
                                    </Button>
                                    <Button
                                        className="bg-chaiyo-blue hover:bg-blue-700 shadow-lg shadow-chaiyo-blue/20"
                                        onClick={onApprove}
                                    >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        อนุมัติคำขอ
                                    </Button>
                                </>
                            )}


                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
