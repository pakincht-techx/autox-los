"use client";

import { VerifyAddressStep } from "@/app/dashboard/new-application/steps/VerifyAddressStep";
import { useApplication } from "@/app/dashboard/new-application/context/ApplicationContext";

export default function VerifyAddressPage() {
    const { formData, setFormData } = useApplication();

    return (
        <VerifyAddressStep
            formData={formData}
            setFormData={setFormData}
        />
    );
}
