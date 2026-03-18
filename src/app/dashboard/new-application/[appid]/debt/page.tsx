"use client";

import { useEffect } from "react";
import { DebtStep } from "../../steps/DebtStep";
import { useApplication } from "../../context/ApplicationContext";

export default function DebtPage() {
    const { formData, setFormData, isExistingCustomer, setMandatoryCheckOverride } = useApplication();

    // Register mandatory field check
    useEffect(() => {
        setMandatoryCheckOverride(() => {
            const refs = formData.references || [];
            // At least 1 reference is required
            return refs.length === 0 || !refs[0]?.firstName;
        });
        return () => setMandatoryCheckOverride(null);
    }, [formData.references, setMandatoryCheckOverride]);

    return (
        <DebtStep
            formData={formData}
            setFormData={setFormData}
            isExistingCustomer={isExistingCustomer}
        />
    );
}
