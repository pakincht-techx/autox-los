"use client";

import { useEffect } from "react";
import { CollateralStep } from "../../steps/CollateralStepNew";
import { useApplication } from "../../context/ApplicationContext";

export default function CollateralInfoPage() {
    const {
        formData,
        setFormData,
        appId,
        isExistingCustomer,
        mockExistingCollaterals,
        setMandatoryCheckOverride,
        setHideLayoutNav,
    } = useApplication();

    // Hide layout nav and show own buttons
    useEffect(() => {
        setHideLayoutNav(true);
        return () => setHideLayoutNav(false);
    }, [setHideLayoutNav]);

    // Register mandatory field check
    useEffect(() => {
        setMandatoryCheckOverride(() => {
            return !formData.collateralType;
        });
        return () => setMandatoryCheckOverride(null);
    }, [formData.collateralType, setMandatoryCheckOverride]);

    return (
        <>
            <CollateralStep
                formData={formData}
                setFormData={setFormData}
                isExistingCustomer={isExistingCustomer}
                existingCollaterals={isExistingCustomer ? mockExistingCollaterals : []}
            />
        </>
    );
}
