import { ApplicationStatus } from "@/components/applications/types";

export const BASE_MOCK_APP = {
    id: "1",
    applicationNo: "25680313ULCPL0001",
    applicantName: "สมชาย ใจดี",
    applicantNickname: "ชาย",
    applicantInitials: "JS",
    status: "Draft" as ApplicationStatus,
    phone: "080-000-0000",
    applicantAge: 35,
    lastActionTime: "14-03-2569 10:30",

    // Section 2: Detail cards
    customerType: "ปกติ",
    collateralType: "รถมอเตอร์ไซต์",
    incomePerMonth: 25000,
    debtPerMonth: 8500,
    guarantorCount: 1,
    refinanceCount: 1,
    uploadedDocCount: 5,
    acceptedConsentCount: 3,
    isLoanAccepted: false,

    // Module completion status
    moduleStatus: {
        customerInfo: true,
        collateral: true,
        loanDetail: true,
        income: true,
        debt: true,
        guarantor: true,
        refinance: true,
        verifyAddress: true,
        documents: true,
        consent: false,
    } as Record<string, boolean>,

    // Loan detail
    loanProductLabel: "ULCR",
    loanProductName: "จำนำรถมอเตอร์ไซต์ผ่อนรายเดือน",
    loanAmount: 20000,
    interestRate: 24,
    term: 60,
    installment: 3000,
    insurance: {
        company: "วิริยะประกันภัย",
        logo: "/insurance-logo/Property 1=Viriya.png",
        tier: "ชั้น 1",
        premium: 20000,
        coverage: 500000,
        repairType: "ซ่อมศูนย์",
    },
    totalInstallmentWithInsurance: 4000,
    maxLoanAmount: 440000,
    maxInstallment: 12656,

    // Section 3: History log
    historyLog: [
        {
            date: "13 มี.ค. 2569",
            time: "10:30 น.",
            title: "สร้างใบสมัคร",
            team: "พนักงานสาขา",
            result: "",
            comment: undefined as string | undefined,
            attachments: undefined as { name: string; url: string }[] | undefined,
        },
    ],
};

/** Returns mock app data based on the mockCase query param (1, 2, or 3). */
export function getMockApp(mockCase: string | null = null, id?: string) {
    if (id === '1' || id === 'mock-5') {
        return {
            ...BASE_MOCK_APP,
            id: id,
            applicationNo: id === '1' ? "25690101ULCRL0001" : "25690318ULCRL0010",
            applicantName: id === '1' ? "สมชาย ใจดี" : "สมหมาย ปลายฝัน",
            status: "Approved" as ApplicationStatus,
            loanAmount: 400000,
            interestRate: 23.99,
            installment: 3000,
            moduleStatus: {
                customerInfo: true,
                collateral: true,
                loanDetail: true,
                income: true,
                debt: true,
                guarantor: true,
                refinance: true,
                verifyAddress: true,
                documents: true,
                consent: true,
            },
            isLoanAccepted: id === '1',
        };
    }

    switch (mockCase) {
        case '1': // Draft — only customer info filled (Normal)
            return {
                ...BASE_MOCK_APP,
                applicationNo: "25680313ULCPL0001",
                collateralType: "",
                incomePerMonth: 0,
                debtPerMonth: 0,
                guarantorCount: 0,
                uploadedDocCount: 0,
                acceptedConsentCount: 0,
                moduleStatus: {
                    customerInfo: true,
                    collateral: false,
                    loanDetail: false,
                    income: false,
                    debt: false,
                    guarantor: false,
                    documents: false,
                    consent: false,
                },
            };
        case '2': // In Review — only customer info filled (Softblock)
            return {
                ...BASE_MOCK_APP,
                applicationNo: "25680313ULCPL0002",
                status: "In Review" as ApplicationStatus,
                collateralType: "",
                incomePerMonth: 0,
                debtPerMonth: 0,
                guarantorCount: 0,
                uploadedDocCount: 0,
                acceptedConsentCount: 0,
                moduleStatus: {
                    customerInfo: true,
                    collateral: false,
                    loanDetail: false,
                    income: false,
                    debt: false,
                    guarantor: false,
                    documents: false,
                    consent: false,
                },
            };
        case '3': // Draft — all sections filled
            return {
                ...BASE_MOCK_APP,
                applicationNo: "25680313ULCPL0003",
            };
        case '4': // Draft — Land collateral, all sections filled
            return {
                ...BASE_MOCK_APP,
                id: "mock-4",
                applicationNo: "25690317TLTDL0009",
                applicantName: "สมศักดิ์ ที่ดินทอง",
                applicantInitials: "สท",
                status: "Draft" as ApplicationStatus,
                phone: "081-234-5678",
                applicantAge: 42,
                lastActionTime: "17-03-2569 10:00",
                customerType: "ปกติ",
                collateralType: "โฉนดที่ดิน",
                incomePerMonth: 30000,
                debtPerMonth: 5000,
                guarantorCount: 1,
                refinanceCount: 0,
                uploadedDocCount: 3,
                acceptedConsentCount: 2,
                moduleStatus: {
                    customerInfo: true,
                    collateral: true,
                    loanDetail: true,
                    income: true,
                    debt: true,
                    guarantor: true,
                    refinance: false,
                    documents: true,
                    consent: false,
                },
                loanProductLabel: "TLTD",
                loanProductName: "ที่ดิน (จำนำ) ผ่อนรายเดือน",
                loanAmount: 500000,
                interestRate: 15,
                term: 120,
                installment: 8075,
                insurance: {
                    company: "เทเวศประกันภัย",
                    logo: "",
                    tier: "",
                    premium: 5000,
                    coverage: 500000,
                    repairType: "",
                },
                totalInstallmentWithInsurance: 8075,
                maxLoanAmount: 750000,
                maxInstallment: 12113,
                historyLog: [
                    {
                        date: "17 มี.ค. 2569",
                        time: "09:00 น.",
                        title: "สร้างใบสมัคร",
                        team: "พนักงานสาขา",
                        result: "",
                        comment: undefined as string | undefined,
                        attachments: undefined as { name: string; url: string }[] | undefined,
                    },
                ],
            };
        default:
            return BASE_MOCK_APP;
    }
}
