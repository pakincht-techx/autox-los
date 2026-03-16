export interface SocialMedia {
    platform: string;
    accountName: string;
}

export interface IncomeItem {
    id: string;
    description: string;
    amount: number;
    frequency?: string;
    calculatedMonthly?: number;
}

export interface SpecialIncomeSource {
    id: string;
    name: string;
}

export interface BankAccount {
    id?: string;
    [key: string]: unknown;
    bankName?: string;
    accountNo?: string;
    accountName?: string;
}

export interface SAIncome {
    id?: string;
    [key: string]: unknown;
    type?: string;
    detail?: string;
    amount?: number | string;
    sourceDocType?: string;
}

export interface PersonalDebt {
    id: string;
    [key: string]: unknown;
    type: string;
    description: string;
    amount: number;
    installment: number;
    customType?: string;
    isDefault?: boolean;
}

export interface ChaiyoLoan {
    id: string;
    [key: string]: unknown;
    type: string;
    description: string;
    amount: number;
    installment: number;
    customType?: string;
}

export interface EnterpriseIncome {
    id: string;
    [key: string]: unknown;
    type: string;
    description: string;
    amount: number;
    frequency: string;
    calculatedMonthly: number;
    salesAmount?: string | number;
    costAmount?: string | number;
    daysPerMonth?: string | number;
    weeksPerMonth?: string | number;
    operatingHours?: string[];
    customType?: string;
    costDetail?: string;
}

export interface SpecialIncome {
    id: string;
    [key: string]: unknown;
    name: string;
    frequency: string;
    amount: number;
    netIncome: number;
}

export interface IncomeDocument {
    id: string;
    name: string;
    url: string;
    type?: string;
    status?: string;
    uploadedAt?: string;
    isLocked?: boolean;
    password?: string;
}

export interface ReferencePerson {
    name?: string;
    phone?: string;
    relationship?: string;
    customRelationship?: string;
}

export interface IncomeOccupation {
    id: string;
    isMain: boolean;
    occupationType?: string;
    occupationName?: string;
    employerName?: string;
    workDurationYears?: string;
    workDurationMonths?: string;
    businessType?: string;
    businessOwnership?: string;
    saIncomes?: SAIncome[];
    seIncomes?: EnterpriseIncome[];
    seCosts?: EnterpriseIncome[];
    incomeDocuments?: IncomeDocument[];
    customDocTypes?: { id: string; label: string }[];
    incomeChannels?: string[];
    bankAccounts?: BankAccount[];
    workLandmark?: string;
    workLocationType?: string;
    workLocationTypeOther?: string;
    businessStatus?: string;
    totalIncome?: number;
    employmentType?: string;
    familyBusiness?: string;
    jobPosition?: string;
    familyBusinessOther?: string;
    occupationCode?: string;
    businessTypeIsic?: string;
    occupationDetail?: string;
    incomeCountry?: string;
    incomeSource?: string;
    currentTenureYear?: string;
    currentTenureMonth?: string;
    prevTenureYear?: string;
    prevTenureMonth?: string;
    employeeCount?: string;
    businessAgeYear?: string;
    isSameAsMainAddress?: string;
    mainAddress?: string;
    officeAddress?: string;
    officePhone?: string;
    officePhoneExt?: string;
    officeName?: string;
    jobPositionOther?: string;
    plantedProducts?: string;
    produceSummary?: any[];
    livestockSchedule?: any[];
    produceType?: string;
    otherProduceType?: string;
    plantingStartMonth?: string;
    plantingStartYear?: string;
    harvestEndMonth?: string;
    harvestEndYear?: string;
    cultivationAreaRai?: string;
    cultivationAreaNgan?: string;
    cultivationAreaSqWa?: string;
    cyclesPerYear?: string;
    irrigationZone?: string;
    landOwnership?: string;
    laborType?: string;
    laborCount?: string;
    customerSalesPerRai?: string;
    customerCostPerRai?: string;
    livestockType?: string;
    otherLivestockType?: string;
    farmIsHigherThanStandard?: boolean;
    farmingType?: 'contract' | 'self';
    livestockUnit?: 'head' | 'cycle';
    livestockCyclesPerYear?: string;
    livestockCycles?: {
        cycleNo: number;
        quantity?: string;
        isHigherThanStandard?: boolean;
        customerPrice?: string;
        customerCost?: string;
        incomeBeforeExpenses?: string;
        incomeAfterExpenses?: string;
        otherExpenses?: string;
        netIncome?: string;
    }[];

    // Residence info (ที่พักอาศัย) - shown when income channel is cash
    residenceLocationStatus?: string;
    residenceHousingType?: string;
    residenceHousingTypeOther?: string;
    residenceHousingStatus?: string;
    residenceDurationYears?: string;
    residenceDurationMonths?: string;
    residenceLivingWith?: string;
    residenceLivingWithRelationships?: string[];
    remarks?: string;
}

export interface Child {
    age: string;
    occupation: string;
}

export interface FamilyMember {
    status: string;
    age?: string;
    hasInsurance?: string;
    hasHealthExp?: string;
}

export interface CoBorrower {
    relationship: string;
    idNumber: string;
    prefix?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    firstNameEn?: string;
    middleNameEn?: string;
    lastNameEn?: string;
    gender?: string;
    occupation?: string;
    income?: string;
    birthDate: string;
    verificationMethod?: string;
    fullAddress?: string;
    watchlistReasons?: string[];
    phone?: string;
    issueDate?: string;
    expiryDate?: string;
    laserId?: string;
    houseNumber?: string;
    floorNumber?: string;
    unitNumber?: string;
    village?: string;
    moo?: string;
    yaek?: string;
    trohk?: string;
    soi?: string;
    street?: string;
    subDistrict?: string;
    district?: string;
    province?: string;
    zipCode?: string;
    verificationStatus?: string;
    latitude?: string;
    longitude?: string;
}

export type Guarantor = CoBorrower;

export interface CustomerFormData {
    verificationStatus: string;
    cardType?: string;
    verificationMethod?: string;
    watchlistReasons?: string[];
    prefix?: string;
    gender?: string;
    nickname?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    firstNameEn?: string;
    middleNameEn?: string;
    lastNameEn?: string;
    birthDate: string;
    age?: string;
    idType: string;
    idNumber: string;
    issueCountry?: string;
    nationality?: string;
    issueDate?: string;
    issueDateDisplay?: string;
    isLifetime?: boolean;
    expiryDate?: string;
    expiryDateDisplay?: string;
    currentAddressSource?: string;
    isCurrentSameAsId?: boolean;
    currentHousingType?: string;
    currentHousingTypeOther?: string;
    currentHousingStatus?: string;
    housingDurationYears?: string;
    housingDurationMonths?: string;
    currentResidentType?: string;
    isDailyResidence?: boolean;
    isOnCollateral?: boolean;
    shippingAddressSource?: string;
    isShippingSameAsCurrent?: boolean;
    contactAddressSource?: string;
    educationLevel?: string;
    maritalStatus?: string;
    isHouseholdHeadBorrower?: boolean;
    householdHeadGender?: string;
    householdHeadAge?: string;
    employedFamilyCount?: string;
    unemployedFamilyCount?: string;
    familyMembers?: Record<string, FamilyMember>;
    socialMedias: SocialMedia[];
    children: Child[];
    phone?: string;
    phoneNumber?: string;
    lineId?: string;
    email?: string;
    laserId?: string;
    occupation?: string;
    occupations?: IncomeOccupation[];
    specialIncomes?: SpecialIncome[];
    incomePhotos?: Record<string, string[]>;
    totalIncome?: number;
    totalDebt?: number;
    totalPersonalDebt?: number;
    totalChaiyoDebt?: number;
    mainOccupationIncome?: number;
    secondaryOccupationIncome?: number;
    specialIncome?: number;
    homePhone?: string;
    coBorrowers: CoBorrower[];
    guarantors: Guarantor[];
    phoneOwnershipProof?: File | null;
    personalDebts?: PersonalDebt[];
    chaiyoLoans?: ChaiyoLoan[];
    chaiyoLoanInstallment?: number;
    chaiyoInsuranceInstallment?: number;
    referencePersons?: ReferencePerson[];
    incomeRemarks?: string;

    // Reference Codes
    ampApplicationId?: string;
    referrerCode?: string;
    promotionCode?: string;

    // Workplace Assessor (ผู้ประเมินสถานที่ทำงาน)
    workplaceAssessorId?: string;
    workplaceAssessorPhone?: string;
    workplaceAssessmentDate?: string;

    // Chaiyo Limits
    chaiyoTotalLimit?: number;
    chaiyoMotorcycleLimit?: number;
    chaiyoCarLimit?: number;
    chaiyoTruckLimit?: number;
    chaiyoAgriLimit?: number;
    chaiyoLandPledgeLimit?: number;
    chaiyoLandMortgageLimit?: number;
    chaiyoOtherLimit?: number;

    // Financial & Application Status
    income?: number;
    expenses?: number;
    baseSalary?: number;
    otherIncome?: number;
    estimatedMonthlyPayment?: number;
    requestedAmount?: number;
    interestRate?: number;
    totalInterest?: number;
    requestedDuration?: number;
    paymentMethod?: string;
    requireNCB?: boolean;
    consentTerms?: boolean;

    // Collateral & Appraisal
    collateralType?: string;
    brand?: string;
    model?: string;
    subModel?: string;
    year?: string;
    color?: string;
    licensePlate?: string;
    registrationProvince?: string;
    province?: string;
    mileage?: string;
    vin?: string;
    chassisNumber?: string;
    wheels?: string;
    bodyType?: string;
    loadCapacity?: string;
    horsepower?: string;
    attachments?: string;
    workingHours?: string;

    // Land-specific
    deedNumber?: string;
    parcelNumber?: string;
    landNumber?: string;
    gridNumber?: string;
    surveyPage?: string;
    surveyNumber?: string;
    area?: string;
    rai?: number;
    ngan?: number;
    wah?: number;
    coordinates?: string;
    tambon?: string;
    amphoe?: string;

    // Legal Status
    legalStatus?: string;
    pawnedRemainingDebt?: number;
    existingDebt?: number;
    leasePayoffBalance?: number;

    // Insurance
    selectedInsurances?: string[];
    includeInsuranceInLoan?: boolean;

    // Appraisal
    appraisalPrice?: number;
    aiAppraisal?: number;

    // Photos
    photos?: Record<string, string>;

    // Address components (General)
    houseNumber?: string;
    floorNumber?: string;
    unitNumber?: string;
    village?: string;
    moo?: string;
    soi?: string;
    yaek?: string;
    trohk?: string;
    street?: string;
    subDistrict?: string;
    district?: string;
    zipCode?: string;
    addressLine1?: string;

    // Questionnaire (แบบสอบถาม)
    qCreditConcern?: number;
    qDebtConcern?: number;
    qCollateralConcern?: number;

    // Financial Behavior (พฤติกรรมทางการเงิน)
    qFinancialPonder?: number;
    qFinancialOnTime?: number;
    qFinancialCloseMonitor?: number;
    qFinancialLongTermGoal?: number;
    qFinancialCompareInfo?: number;

    // Delinquency Problems (ค้างชำระ - ปัญหาด้านใด)
    qDelinquencyHigherCost?: boolean;
    qDelinquencyUnsold?: boolean;
    qDelinquencyOtherDebt?: boolean;
    qDelinquencyFamilyExpense?: boolean;
    qDelinquencyEducationExpense?: boolean;
    qDelinquencyAccident?: boolean;

    // Delinquency Causes (ค้างชำระ - สาเหตุใด)
    qDelinquencyFamilyDispute?: boolean;
    qDelinquencyBusinessProblem?: boolean;
    qDelinquencyHealthProblem?: boolean;
    qDelinquencyHighExpense?: boolean;
    qDelinquencyRelocation?: boolean;
    qDelinquencyDebtProcessIgnorance?: boolean;
    qDelinquencyLawsuit?: boolean;
    qDelinquencyMoveBusiness?: boolean;
    qDelinquencyEconomy?: boolean;
    qDelinquencyNaturalDisaster?: boolean;
    qDelinquencyGovernmentPolicy?: boolean;

    // Extra Income (การหารายได้เสริม)
    qExtraSkill?: string;
    qExtraSkillOther?: string;
    qAppsKnown?: string[];
    qAppsKnownOther?: string;
    qDebtRepaymentIntention?: number;
    isLivingHereEveryday?: boolean;
    isResidingOnMortgagedLand?: boolean;
    currentResidentRelationships?: string[];
}
