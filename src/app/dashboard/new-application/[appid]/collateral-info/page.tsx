"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CollateralStep } from "../../steps/CollateralStepNew";
import { useApplication } from "../../context/ApplicationContext";
import { Button } from "@/components/ui/Button";
import { ChevronRight, Share2, Save } from "lucide-react";

export default function CollateralInfoPage() {
    const router = useRouter();
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

    const handleSave = () => {
        // Save functionality - keep on current page
        console.log("Saving collateral info...", formData);
    };

    const handleRefer = () => {
        // Refer functionality - share with others
        console.log("Referring collateral info...", formData);
    };

    const handleProceed = () => {
        // Proceed to next step
        router.push(`/dashboard/applications/${appId || 'draft'}`);
    };

    return (
        <>
            <CollateralStep
                formData={formData}
                setFormData={setFormData}
                isExistingCustomer={isExistingCustomer}
                existingCollaterals={isExistingCustomer ? mockExistingCollaterals : []}
            />

            {/* Action Buttons */}
            <div className="flex justify-between gap-3 pt-6 mt-6 border-t border-gray-100">
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={handleSave}
                        className="font-bold shadow-none"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        บันทึก
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={handleRefer}
                        className="font-bold shadow-none"
                    >
                        <Share2 className="w-4 h-4 mr-2" />
                        แชร์
                    </Button>
                </div>
                <Button
                    size="lg"
                    onClick={handleProceed}
                    className="px-8 font-bold shadow-none"
                >
                    ดำเนินการต่อ <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </>
    );
}
