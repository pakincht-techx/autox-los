"use client";

import { useRouter } from "next/navigation";
import { PrivacyConsentStep } from "../steps/PrivacyConsentStep";
import { useApplication } from "../context/ApplicationContext";

export default function PrivacyNoticePage() {
    const router = useRouter();
    const { formData } = useApplication();

    return (
        <PrivacyConsentStep
            onAccept={() => router.push("/dashboard/new-application/sensitive-data")}
            onBack={() => router.push("/dashboard/pre-question")}
            collateralType={formData.collateralType}
        />
    );
}
