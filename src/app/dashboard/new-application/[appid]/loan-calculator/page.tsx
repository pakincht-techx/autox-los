"use client";

import { useEffect } from "react";
import { CalculatorStep } from "../../steps/CalculatorStep";
import { useApplication } from "../../context/ApplicationContext";

export default function LoanCalculatorPage() {
    const { formData, setFormData, navigateNext, navigatePrev, setMandatoryCheckOverride } = useApplication();

    // Register mandatory field check
    useEffect(() => {
        setMandatoryCheckOverride(() => {
            return !formData.requestedAmount || !formData.requestedDuration;
        });
        return () => setMandatoryCheckOverride(null);
    }, [formData.requestedAmount, formData.requestedDuration, setMandatoryCheckOverride]);

    return (
        <CalculatorStep
            onNext={navigateNext}
            formData={formData}
            setFormData={setFormData}
            onBack={navigatePrev}
            hideNavigation={true}
            readOnlyProduct={false}
        />
    );
}
