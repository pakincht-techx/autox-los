"use client";

import { useRouter } from "next/navigation";
import { IdentityCheckStep } from "../steps/IdentityCheckStep";
import { ExistingCustomerView } from "../components/ExistingCustomerView";
import { useApplication } from "../context/ApplicationContext";

export default function IdentityCheckerPage() {
    const router = useRouter();
    const {
        formData,
        setFormData,
        isExistingCustomer,
        setIsExistingCustomer,
        existingProfile,
        setExistingProfile,
        isIdentityVerified,
        setIsIdentityVerified,
        setIsApplicationStarted,
        setAppId,
        setIsSkipped,
        assetsWithLoans,
    } = useApplication();

    const handleIdentityCheckNext = (isExisting: boolean, profile: any) => {
        setIsExistingCustomer(isExisting);
        if (isExisting) {
            setExistingProfile(profile);
            setFormData((prev: any) => ({
                ...prev,
                firstName: profile.fullName.split(" ")[1] || "",
                middleName: profile.fullName.split(" ").length > 3 ? profile.fullName.split(" ")[2] : "",
                lastName: profile.fullName.split(" ").slice(-1)[0] || "",
            }));
        } else {
            // New customer → Start application flow
            setIsApplicationStarted(true);
            setAppId("app-256700002");
            router.push("/dashboard/new-application/salesheet");
        }
        setIsIdentityVerified(true);
    };

    const startApplication = () => {
        setIsApplicationStarted(true);
        setAppId("app-256700001");
        setIsSkipped(false);
        router.push("/dashboard/new-application/salesheet");
    };

    const handleSkipToCalculator = () => {
        setFormData((prev: any) => ({
            ...prev,
            prefix: "นาย",
            birthDate: "1990-01-01",
            addressLine1: "123 หมู่ 1",
            subDistrict: "ลาดพร้าว",
            district: "ลาดพร้าว",
            province: "กรุงเทพมหานคร",
            zipCode: "10230",
            existingAssetId: "A-002",
            collateralType: "moto",
            collateralBrand: "Honda",
            collateralModel: "Wave 125i",
            collateralYear: "2020",
            collateralLicense: "1กค 1234",
            loanPurpose: "personal",
            requestedAmount: 20000,
            income: 40000,
            occupation: "พนักงานบริษัท",
            salary: 35000,
            otherIncome: 5000,
            expense: 15000,
        }));
        setIsSkipped(true);
        setIsApplicationStarted(true);
        setAppId("app-256700001");
        router.push("/dashboard/new-application/app-256700001/loan-calculator");
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

            {/* Existing Customer View (after verification, if existing) */}
            {isIdentityVerified && isExistingCustomer && (
                <ExistingCustomerView
                    profile={existingProfile}
                    assetsWithLoans={assetsWithLoans}
                    onProceed={startApplication}
                    onSkipToCalculator={handleSkipToCalculator}
                />
            )}
        </>
    );
}
