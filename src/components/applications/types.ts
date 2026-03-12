export type ApplicationStatus = 'Draft' | 'In Review' | 'Approved' | 'Rejected' | 'Sent Back' | 'Cancelled';

export interface Application {
    id: string;
    applicationNo: string;
    applicantName: string;
    makerName: string;
    submissionDate: string;
    requestedAmount: number;
    status: ApplicationStatus;
    productType: string;
    previousProcessorName?: string;
    lastActionTime?: string;
    avatarUrl?: string; // Added for consistency
}

export type ActionPriority = 'High' | 'Medium' | 'Low';

export interface ActionItem {
    id: string;
    title: string;
    description: string;
    priority: ActionPriority;
    isCompleted: boolean;
}

export interface Document {
    id: string;
    name: string;
    type: string;
    uploadDate: string;
    status: 'Verified' | 'Pending' | 'Rejected';
    url: string;
}

export interface Collateral {
    id: string;
    type: 'Vehicle' | 'Land';
    subType: string; // e.g., "Sedan", "Pickup", "Condo"
    brand?: string;
    model?: string;
    year?: string;
    color?: string;
    registrationNo: string;
    province: string;
    mileage?: number;
    vin?: string;
    engineNo?: string;
    marketValue: number;
    appraisalValue: number;
    images: string[];
}

export interface ApplicationDetail extends Application {
    email: string;
    phone: string;
    term: number; // months
    interestRate: number; // percentage
    ltv: number; // Loan-to-Value ratio
    dti: number; // Debt-to-Income ratio
    creditScore: number;
    actionItems: ActionItem[];
    documents: Document[];
    notes: string[];
    collateral: Collateral;
}
