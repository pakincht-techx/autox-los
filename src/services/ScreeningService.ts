export interface ScreeningResult {
    status: 'PASS' | 'REJECT' | 'REVIEW' | 'EXISTING';
    riskScore: number;
    details?: {
        message: string;
        flags: string[];
    };
    existingProfile?: {
        customerId: string;
        fullName: string;
        activeLoans: number;
        lastContact: string;
        creditGrade: string;
    };
}

export const ScreeningService = {
    /**
     * Checks a customer's citizen ID against internal watchlists and fraud databases (Mock).
     */
    checkCustomerStatus: async (idNumber: string): Promise<ScreeningResult> => {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // MOCK LOGIC

        // Case 1: Blacklist (ID ends with 999)
        if (idNumber.endsWith("999")) {
            return {
                status: 'REJECT',
                riskScore: 95,
                details: {
                    message: "พบประวัติในบัญชีเฝ้าระวังพิเศษ (Blacklist)",
                    flags: ["FRAUD_HISTORY", "NCB_DEFAULT"]
                }
            };
        }

        // Case 2: Watchlist / Review (ID ends with 888)
        if (idNumber.endsWith("888")) {
            return {
                status: 'REVIEW',
                riskScore: 60,
                details: {
                    message: "ต้องตรวจสอบเอกสารเพิ่มเติม (Enhanced Due Diligence)",
                    flags: ["PEP_MATCH", "HIGH_RISK_AREA"]
                }
            };
        }

        // Case 3: Existing Customer (ID ends with 555)
        if (idNumber.endsWith("555")) {
            return {
                status: 'EXISTING',
                riskScore: 10,
                details: {
                    message: "พบข้อมูลลูกค้าในระบบ",
                    flags: ["EXISTING_CUSTOMER"]
                },
                existingProfile: {
                    customerId: "CUST-555001",
                    fullName: "คุณสมชาย ใจดี",
                    activeLoans: 2,
                    lastContact: "2023-12-01",
                    creditGrade: "A"
                }
            };
        }

        // Case 4: Pass (Default)
        return {
            status: 'PASS',
            riskScore: 10
        };
    }
};
