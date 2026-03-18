"use client";

import { useEffect } from "react";
import { IncomeStep } from "../../steps/IncomeStep";
import { useApplication } from "../../context/ApplicationContext";

export default function IncomePage() {
    const { formData, setFormData, isExistingCustomer, setMandatoryCheckOverride } = useApplication();

    // Register mandatory field check
    useEffect(() => {
        setMandatoryCheckOverride(() => {
            const occs = formData.occupations || [];
            // At least one occupation with a type selected
            return occs.length === 0 || !occs[0]?.employmentType;
        });
        return () => setMandatoryCheckOverride(null);
    }, [formData.occupations, setMandatoryCheckOverride]);

    return (
        <IncomeStep
            formData={formData}
            setFormData={setFormData}
            isExistingCustomer={isExistingCustomer}
        />
    );
}
