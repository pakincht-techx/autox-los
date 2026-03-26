"use client";

import { useRouter } from "next/navigation";
import { SensitiveDataConsentStep } from "../steps/SensitiveDataConsentStep";

export default function SensitiveDataPage() {
    const router = useRouter();

    return (
        <SensitiveDataConsentStep
            onAccept={() => router.push("/dashboard/new-application/identity-checker")}
        />
    );
}
