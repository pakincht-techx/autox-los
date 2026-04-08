"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";

interface WatchlistItem {
  id: string;
  source: string;
  code: string;
  reason: string;
  status: "pending" | "approved" | "rejected" | "in-review";
  operator: string;
  date: string;
}

const mockWatchlistData: WatchlistItem[] = [
  {
    id: "1",
    source: "Credit Bureau",
    code: "WL-001",
    reason: "Late payment history detected",
    status: "in-review",
    operator: "สมชาย สวัสดี",
    date: "2026-03-15",
  },
  {
    id: "2",
    source: "Fraud Database",
    code: "WL-002",
    reason: "Suspicious transaction pattern",
    status: "pending",
    operator: "สมหญิง ใจดี",
    date: "2026-03-10",
  },
  {
    id: "3",
    source: "Internal System",
    code: "WL-003",
    reason: "Loan product mismatch",
    status: "approved",
    operator: "ประเสริฐ ทํางาน",
    date: "2026-03-05",
  },
  {
    id: "4",
    source: "Risk Assessment",
    code: "WL-004",
    reason: "Income verification failed",
    status: "rejected",
    operator: "วิชา ศรีสุข",
    date: "2026-02-28",
  },
  {
    id: "5",
    source: "Compliance Check",
    code: "WL-005",
    reason: "PEP list match",
    status: "in-review",
    operator: "สมบูรณ์ มีสติ",
    date: "2026-02-20",
  },
];

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "approved":
      return "success";
    case "rejected":
      return "danger";
    case "pending":
      return "warning";
    case "in-review":
      return "yellow";
    default:
      return "neutral";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "approved":
      return "อนุมัติ";
    case "rejected":
      return "ปฏิเสธ";
    case "pending":
      return "รอการตรวจสอบ";
    case "in-review":
      return "อยู่ระหว่างตรวจสอบ";
    default:
      return status;
  }
};

export default function WatchlistPage() {
  const router = useRouter();

  return (
    <>
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Watchlist
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                รายการตรวจสอบผู้กู้ยืมจากระบบตรวจสอบต่างๆ
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              ย้อนกลับ
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
        {/* Table */}
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Source
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Code
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  เหตุผล
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  สถานะการตรวจสอบ
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  ผู้ดำเนินการ
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  วันที่
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockWatchlistData.map((item) => (
                <TableRow
                  key={item.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="px-6 py-4">
                    <span className="text-sm text-gray-700">{item.source}</span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <code className="text-xs bg-gray-100 text-gray-800 px-2.5 py-1 rounded font-mono">
                      {item.code}
                    </code>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="text-sm text-gray-700">{item.reason}</span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge variant={getStatusBadgeVariant(item.status)}>
                      {getStatusLabel(item.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="text-sm text-gray-700">{item.operator}</span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="text-sm text-gray-500">{item.date}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Empty state */}
          {mockWatchlistData.length === 0 && (
            <div className="px-6 py-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">ไม่มีรายการ Watchlist</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
