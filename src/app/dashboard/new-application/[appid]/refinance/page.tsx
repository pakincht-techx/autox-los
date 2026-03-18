"use client";

import { RefinanceStep } from "../../steps/RefinanceStep";
import { useApplication } from "../../context/ApplicationContext";

export default function RefinancePage() {
    const { formData, setFormData } = useApplication();

    return (
        <RefinanceStep
            formData={formData}
            setFormData={setFormData}
        />
    );
}
