"use client";

import { useRouter } from "next/navigation";
import { IdentityCheckStep } from "../steps/IdentityCheckStep";
import { useApplication } from "../context/ApplicationContext";

export default function IdentityCheckerPage() {
    const router = useRouter();
    const {
        formData,
        setFormData,
        isExistingCustomer,
        setIsExistingCustomer,
        setExistingProfile,
        isIdentityVerified,
        setIsIdentityVerified,
        setIsApplicationStarted,
        setAppId,
    } = useApplication();

    const handleIdentityCheckNext = (isExisting: boolean, profile: any) => {
        setIsExistingCustomer(isExisting);
        setIsIdentityVerified(true);
        setIsApplicationStarted(true);

        if (isExisting) {
            setExistingProfile(profile);
            setAppId("25690316ULCRL0001");
            // Navigate directly to customer-info step (skip overview)
            router.push(`/dashboard/new-application/25690316ULCRL0001/customer-info`);
        } else {
            // New customer → Start application flow
            setAppId("25690316ULCRL0002");
            router.push("/dashboard/new-application/salesheet");
        }
    };

    return (
        <>
            {/* Identity Check (before verification) */}
            {!isIdentityVerified && (
                <IdentityCheckStep
                    formData={formData}
                    setFormData={setFormData}
                    onNext={handleIdentityCheckNext}
                />
            )}
        </>
    );
}
