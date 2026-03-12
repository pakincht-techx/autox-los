"use client";

import { IncomeStep } from "../../steps/IncomeStep";
import { useApplication } from "../../context/ApplicationContext";

export default function IncomePage() {
    const { formData, setFormData, isExistingCustomer } = useApplication();

    return (
        <IncomeStep
            formData={formData}
            setFormData={setFormData}
            isExistingCustomer={isExistingCustomer}
        />
    );
}
