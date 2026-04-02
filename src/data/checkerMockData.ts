import { Application, ReviewFieldStatus } from "@/components/applications/types";

/**
 * Mock data for เขต/ภาค Checker role
 * Includes three scenarios:
 * 1. Application with all fields approved
 * 2. Application with fields needing caution/review
 * 3. Application with fraud flags
 */

export interface CheckerApplication extends Application {
    reviewStatus?: ReviewFieldStatus[];
    overallReviewStatus?: 'all-approved' | 'needs-review' | 'fraud-flagged';
}

export const CHECKER_MOCK_DATA: CheckerApplication[] = [
    // Scenario 1: All fields checked and approved
    {
        id: "checker-1",
        applicationNo: "25690315ULCRL0001",
        applicantName: "สมศักดิ์ สมบูรณ์",
        makerName: "สมหญิง ใจดี",
        submissionDate: "15/03/2569 09:00",
        requestedAmount: 500000,
        status: "In Review",
        productType: "สินเชื่อจำนำทะเบียนรถยนต์",
        previousProcessorName: "มาลี ศรีเมือง",
        lastActionTime: "15/03/2569 14:30",
        overallReviewStatus: 'all-approved',
        reviewStatus: [
            { fieldName: "ข้อมูลส่วนบุคคล", status: "approved" },
            { fieldName: "สำมะโนประชากร", status: "approved" },
            { fieldName: "หลักประกัน/สินทรัพย์", status: "approved" },
            { fieldName: "เอกสารและการยืนยัน", status: "approved" },
            { fieldName: "ประวัติการออม", status: "approved" },
            { fieldName: "ประเมินความเสี่ยง", status: "approved" },
        ]
    },

    // Scenario 2: Application with caution flags requiring review
    {
        id: "checker-2",
        applicationNo: "25690316TLTDL0002",
        applicantName: "วิภาวดี รักษ์ไทย",
        makerName: "กานต์ สว่างใจ",
        submissionDate: "16/03/2569 10:30",
        requestedAmount: 350000,
        status: "In Review",
        productType: "สินเชื่อโฉนดที่ดิน",
        previousProcessorName: "ทรงพล รวยทรัพย์",
        lastActionTime: "16/03/2569 11:45",
        overallReviewStatus: 'needs-review',
        reviewStatus: [
            { fieldName: "ข้อมูลส่วนบุคคล", status: "approved" },
            { fieldName: "สำมะโนประชากร", status: "approved" },
            { fieldName: "หลักประกัน/สินทรัพย์", status: "caution", remark: "ต้องตรวจสอบเพิ่มเติม: ค่าประเมินน้อยกว่าค่าตลาดตามปกติ" },
            { fieldName: "เอกสารและการยืนยัน", status: "caution", remark: "เอกสารหลักประกันมีวันหมดอายุใกล้เข้ามา" },
            { fieldName: "ประวัติการออม", status: "approved" },
            { fieldName: "ประเมินความเสี่ยง", status: "caution", remark: "อัตรา DTI สูงขึ้น - ต้องปรึกษาผู้อนุมัติ" },
        ]
    },

    // Scenario 3: Application with fraud flags
    {
        id: "checker-3",
        applicationNo: "25690317ULCRL0003",
        applicantName: "กมล คนขยัน",
        makerName: "สมหญิง ใจดี",
        submissionDate: "17/03/2569 08:15",
        requestedAmount: 450000,
        status: "In Review",
        productType: "จำนำรถมอเตอร์ไซต์ผ่อนรายเดือน",
        previousProcessorName: "สมชาย ยิ่งเจริญ",
        lastActionTime: "17/03/2569 09:30",
        overallReviewStatus: 'fraud-flagged',
        reviewStatus: [
            { fieldName: "ข้อมูลส่วนบุคคล", status: "approved" },
            { fieldName: "สำมะโนประชากร", status: "fraud", remark: "ข้อมูลหลักประกันไม่ตรงกับเอกสารจดทะเบียน" },
            { fieldName: "หลักประกัน/สินทรัพย์", status: "fraud", remark: "ทะเบียนรถดูเหมือนปลอม - ส่งให้ตรวจสอบอัตลักษณ์" },
            { fieldName: "เอกสารและการยืนยัน", status: "fraud", remark: "เอกสารประจำตัวขาดหรือหมดอายุ" },
            { fieldName: "ประวัติการออม", status: "caution", remark: "ไม่สม่ำเสมอในการออม" },
            { fieldName: "ประเมินความเสี่ยง", status: "fraud", remark: "ความเสี่ยงสูง - เสนอให้หยุดการพิจารณา" },
        ]
    },

    // Scenario 4: Partially approved with minor caution
    {
        id: "checker-4",
        applicationNo: "25690318ULCPL0004",
        applicantName: "สมหญิง ใจบริสุทธิ์",
        makerName: "กานต์ สว่างใจ",
        submissionDate: "18/03/2569 09:45",
        requestedAmount: 250000,
        status: "In Review",
        productType: "สินเชื่อนาโนไฟแนนซ์",
        previousProcessorName: "มาลี ศรีเมือง",
        lastActionTime: "18/03/2569 13:20",
        overallReviewStatus: 'needs-review',
        reviewStatus: [
            { fieldName: "ข้อมูลส่วนบุคคล", status: "approved" },
            { fieldName: "สำมะโนประชากร", status: "approved" },
            { fieldName: "หลักประกัน/สินทรัพย์", status: "approved" },
            { fieldName: "เอกสารและการยืนยัน", status: "approved" },
            { fieldName: "ประวัติการออม", status: "caution", remark: "บัญชีธนาคารใหม่ - ควรตรวจสอบประวัติที่สถาบันการเงินอื่น" },
            { fieldName: "ประเมินความเสี่ยง", status: "approved" },
        ]
    },
];

export const getCheckerApplicationsData = (role: string) => {
    // Could filter data based on specific checker role if needed
    return CHECKER_MOCK_DATA;
};
