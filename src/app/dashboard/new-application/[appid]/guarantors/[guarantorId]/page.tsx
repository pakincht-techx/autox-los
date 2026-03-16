"use client";

import { useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useSidebar } from "@/components/layout/SidebarContext";
import { useApplication } from "../../../context/ApplicationContext";
import { Card, CardContent } from "@/components/ui/Card";
import { ArrowLeft, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";

export default function GuarantorDetailPage() {
    const router = useRouter();
    const params = useParams();
    const appId = params.appid as string;
    
    // In a real app we'd fetch the guarantor details by guarantorId
    // For now, we'll extract the name from query params or a mock standard name
    const { setBreadcrumbs, setRightContent } = useSidebar();
    const { formData: applicationFormData } = useApplication();
    const searchParams = useSearchParams();
    const isReadonly = searchParams.get('state') === 'readonly';

    // Breadcrumbs management
    useEffect(() => {
        const borrowerFirstName = applicationFormData?.firstName;
        const displayAppId = appId.length > 8 ? `...${appId.slice(-6)}` : appId;
        const appLabel = borrowerFirstName ? `${displayAppId} (${borrowerFirstName})` : displayAppId;

        // Mock getting guarantor name
        const displayName = "ดีใจ";

        setBreadcrumbs([
            { label: "รายการใบสมัคร", onClick: () => router.push("/dashboard/applications") },
            { label: appLabel, onClick: () => router.push(`/dashboard/applications/${appId}`) },
            { label: "ผู้ค้ำ", onClick: () => router.push(`/dashboard/new-application/${appId}/guarantors`) },
            { label: displayName, isActive: true }
        ]);
        
        // Clear right content if any
        if (!isReadonly) {
            setRightContent(null);
        }
        
    }, [appId, setBreadcrumbs, applicationFormData?.firstName, router, isReadonly, setRightContent]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" className="p-2" onClick={() => router.push(`/dashboard/new-application/${appId}/guarantors`)}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h2 className="text-2xl font-bold">ดีใจ ไชโย</h2>
                </div>
            </div>

            <Tabs defaultValue="info" className="w-full">
                <TabsList className="flex w-full max-w-[400px] mb-8 bg-gray-100/50 p-1 rounded-2xl gap-1">
                    <TabsTrigger value="info" className="flex-1 rounded-xl data-[state=active]:bg-white data-[state=active]:text-chaiyo-blue data-[state=active]:shadow-sm font-bold h-10">ข้อมูลผู้ค้ำ</TabsTrigger>
                    <TabsTrigger value="income" className="flex-1 rounded-xl data-[state=active]:bg-white data-[state=active]:text-chaiyo-blue data-[state=active]:shadow-sm font-bold h-10">รายได้</TabsTrigger>
                    <TabsTrigger value="debt" className="flex-1 rounded-xl data-[state=active]:bg-white data-[state=active]:text-chaiyo-blue data-[state=active]:shadow-sm font-bold h-10">ภาระหนี้สิน</TabsTrigger>
                </TabsList>
                
                <TabsContent value="info" className="mt-0">
                    <Card className="border-border-subtle shadow-sm rounded-2xl bg-white">
                        <CardContent className="p-6 min-h-[400px] flex items-center justify-center">
                            <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                                <p className="text-lg font-bold mb-2">ข้อมูลผู้ค้ำประกัน</p>
                                <p className="text-sm">จะพัฒนาในเฟสถัดไป</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="income" className="mt-0">
                    <Card className="border-border-subtle shadow-sm rounded-2xl bg-white">
                        <CardContent className="p-6 min-h-[400px] flex items-center justify-center">
                            <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                                <p className="text-lg font-bold mb-2">ข้อมูลรายได้</p>
                                <p className="text-sm">จะพัฒนาในเฟสถัดไป</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="debt" className="mt-0">
                    <Card className="border-border-subtle shadow-sm rounded-2xl bg-white">
                        <CardContent className="p-6 min-h-[400px] flex items-center justify-center">
                            <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                                <p className="text-lg font-bold mb-2">ข้อมูลภาระหนี้สิน</p>
                                <p className="text-sm">จะพัฒนาในเฟสถัดไป</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
