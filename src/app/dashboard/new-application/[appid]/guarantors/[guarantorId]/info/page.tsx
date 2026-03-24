"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { useSidebar } from "@/components/layout/SidebarContext";
import { useApplication } from "../../../../context/ApplicationContext";
import { Button } from "@/components/ui/Button";
import { CustomerInfoStep } from "../../../../steps/CustomerInfoStep";
import { MandatoryFieldWarningDialog } from "../../../../components/MandatoryFieldWarningDialog";
import { CustomerFormData } from "@/types/application";

export default function GuarantorInfoPage() {
    const router = useRouter();
    const params = useParams();
    const appId = params.appid as string;
    const guarantorId = params.guarantorId as string;

    const { setBreadcrumbs, setRightContent } = useSidebar();
    const { formData: applicationFormData } = useApplication();
    const searchParams = useSearchParams();
    const isReadonly = searchParams.get('state') === 'readonly';

    const [mandatoryWarningOpen, setMandatoryWarningOpen] = useState(false);
    const mandatoryWarningRef = useRef(setMandatoryWarningOpen);
    mandatoryWarningRef.current = setMandatoryWarningOpen;

    const [guarantorFormData, setGuarantorFormData] = useState<CustomerFormData>({
        idType: "บัตรประชาชนไทย",
        idNumber: "1-1234-56789-01-2",
        prefix: "นาง",
        firstName: "ดีใจ",
        lastName: "ไชโย",
        middleName: "",
        firstNameEn: "Deejai",
        middleNameEn: "",
        lastNameEn: "Chaiyo",
        gender: "หญิง",
        birthDate: "15/06/2523",
        phone: "089-123-4567",
        nationality: "ไทย",
        verificationMethod: "DIPCHIP",
        verificationStatus: "PASSED",
        coBorrowers: [],
        guarantors: [],
        socialMedias: [],
        children: [],
        maritalStatus: "",
        houseNumber: "123",
        moo: "4",
        soi: "สุขใจ 5",
        street: "ถนนเพชรเกษม",
        subDistrict: "หนองแขม",
        district: "หนองแขม",
        province: "กรุงเทพมหานคร",
        zipCode: "10160",
    } as CustomerFormData);

    const handleSaveAndBack = useCallback(() => {
        toast.success("บันทึกข้อมูลสำเร็จ", {
            description: "ข้อมูลถูกบันทึกเรียบร้อยแล้ว",
            duration: 2000,
        });
        setTimeout(() => {
            router.push(`/dashboard/new-application/${appId}/guarantors/${guarantorId}`);
        }, 500);
    }, [router, appId, guarantorId]);

    useEffect(() => {
        const borrowerFirstName = applicationFormData?.firstName;
        const displayAppId = appId.length > 8 ? appId.slice(8) : appId;
        const appLabel = borrowerFirstName ? `${displayAppId} (${borrowerFirstName})` : displayAppId;
        const displayName = "ดีใจ";

        setBreadcrumbs([
            { label: appLabel, onClick: () => router.push(`/dashboard/applications/${appId || 'draft'}`) },
            { label: "ผู้ค้ำประกัน", onClick: () => router.push(`/dashboard/new-application/${appId}/guarantors`) },
            { label: displayName, onClick: () => router.push(`/dashboard/new-application/${appId}/guarantors/${guarantorId}`) },
            { label: "ข้อมูลผู้ค้ำ", isActive: true }
        ]);

        if (!isReadonly) {
            setRightContent(
                <div className="flex items-center gap-3">
                    <Button
                        variant="default"
                        size="sm"
                        onClick={() => {
                            // Always show mandatory warning — in real app, check actual fields
                            mandatoryWarningRef.current(true);
                        }}
                    >
                        <Save className="w-4 h-4 mr-2" /> บันทึกและกลับ
                    </Button>
                </div>
            );
        }
    }, [appId, guarantorId, setBreadcrumbs, applicationFormData?.firstName, router, isReadonly, setRightContent]);

    return (
        <>
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <CustomerInfoStep
                    formData={guarantorFormData}
                    setFormData={setGuarantorFormData}
                    variant="guarantor"
                />
            </div>

            <MandatoryFieldWarningDialog
                open={mandatoryWarningOpen}
                onOpenChange={setMandatoryWarningOpen}
                onSaveAndExit={handleSaveAndBack}
                onCancel={() => setMandatoryWarningOpen(false)}
            />
        </>
    );
}
