"use client";

import { useRouter } from "next/navigation";
import { ReviewStep } from "../../steps/ReviewStep";
import { useApplication } from "../../context/ApplicationContext";
import { toast } from "sonner";
import { APPLICATION_STEPS } from "../../context/ApplicationContext";

export default function ReviewPage() {
    const router = useRouter();
    const { formData, setFormData, appId } = useApplication();

    const handleSubmit = () => {
        toast.success("ส่งใบสมัครสำเร็จ", {
            description: "ใบสมัครสินเชื่อถูกส่งเรียบร้อยแล้ว! ระบบกำลังดำเนินการพิจารณา",
        });
        setTimeout(() => router.push("/dashboard/applications"), 1500);
    };

    const handleEdit = (stepId: number) => {
        const step = APPLICATION_STEPS.find(s => s.id === stepId);
        if (step) {
            router.push(`/dashboard/new-application/${step.slug}`);
        }
    };

    return (
        <ReviewStep
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            onEdit={handleEdit}
        />
    );
}
