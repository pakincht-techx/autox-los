"use client";

import { DebtStep } from "../../steps/DebtStep";
import { useApplication } from "../../context/ApplicationContext";

export default function DebtPage() {
    const { formData, setFormData, isExistingCustomer } = useApplication();

    return (
        <DebtStep
            formData={formData}
            setFormData={setFormData}
            isExistingCustomer={isExistingCustomer}
        />
    );
}
