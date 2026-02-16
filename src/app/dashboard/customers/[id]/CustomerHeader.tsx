"use client";

import React from "react";
import { ArrowLeft, Edit, FileText, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Customer {
    id: string;
    name: string;
    initials: string;
    status: string;
    phone: string;
    avatarUrl?: string;
}

interface CustomerHeaderProps {
    customer: Customer;
}

export function CustomerHeader({ customer }: CustomerHeaderProps) {
    const router = useRouter();

    return (
        <div className="bg-white border-b border-border-subtle sticky top-0 z-10 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Back Button */}
                <div className="mb-6">
                    <Link
                        href="/dashboard/customers"
                        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        กลับหน้ารายชื่อ
                    </Link>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    {/* Identity Profile */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-foreground">{customer.name}</h1>
                            <Badge variant="success" className="px-2.5 rounded-md">Active</Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                            <span className="font-mono text-gray-400">ID: {customer.id}</span>
                            <span className="hidden sm:inline w-1 h-1 bg-gray-300 rounded-full" />
                            <span className="flex items-center gap-1.5 ">
                                <Phone className="h-3.5 w-3.5" />
                                {customer.phone}
                            </span>
                            <span className="hidden sm:inline w-1 h-1 bg-gray-300 rounded-full" />
                            <span className="flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5" />
                                กรุงเทพมหานคร
                            </span>
                        </div>

                        <div className="flex items-center gap-3 pt-1">
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                                <span>ความเสี่ยง: ต่ำ</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-green-50 text-green-700 text-xs font-medium border border-green-100">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                <span>KYC ยืนยันแล้ว</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                        <Button
                            variant="outline"
                            className="gap-2 flex-1 md:flex-none border-border-subtle hover:bg-gray-50"
                            onClick={() => console.log('Edit profile')}
                        >
                            <Edit className="h-4 w-4" />
                            แก้ไขข้อมูล
                        </Button>
                        <Button
                            className="gap-2 bg-chaiyo-blue hover:bg-blue-700 shadow-lg shadow-chaiyo-blue/20 flex-1 md:flex-none"
                            onClick={() => router.push('/dashboard/new-application')}
                        >
                            <FileText className="h-4 w-4" />
                            ขอสินเชื่อใหม่
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
