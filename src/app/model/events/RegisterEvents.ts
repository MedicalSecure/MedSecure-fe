export type NewRegisterSharedEvent = IntegrationEvent & {
    register: RegisterEvent;
};

export type IntegrationEvent = {
    eventId: string;
    occurredOn: Date;
    eventType?: string | null;
};

export type RegisterEvent = {
    id?: string | null;
    patient: PatientEvent;
    familyMedicalHistory?: RiskFactorEvent[] | null;
    personalMedicalHistory?: RiskFactorEvent[] | null;
    diseases?: RiskFactorEvent[] | null;
    allergies?: RiskFactorEvent[] | null;
    history?: HistoryEvent[] | null;
    test?: TestEvent[] | null;
    status?: number | null;
    createdAt?: Date | null;
};

export type RiskFactorEvent = {
    id?: string | null;
    subRiskFactor?: RiskFactorEvent[] | null;
    riskFactorParentId?: string | null;
    key: string;
    value: string;
    code?: string | null;
    description?: string | null;
    isSelected?: boolean | null;
    type: string;
    icon: string;
};

export type TestEvent = {
    id?: string | null;
    code: string;
    description: string;
    language: number;
    testType: number;
    registerId?: string | null;
};

export type PatientEvent = {
    id?: string | null;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    identity: string;
    gender: number;
    cnam?: number | null;
    assurance?: string | null;
    height?: number | null;
    weight?: number | null;
    addressIsRegistrations?: boolean | null;
    saveForNextTime?: boolean | null;
    email?: string | null;
    address1?: string | null;
    address2?: string | null;
    country?: number | null;
    state?: string | null;
    zipCode?: number | null;
    activityStatus?: number | null;
    familyStatus?: number | null;
    children?: number | null;
};

export type HistoryEvent = {
    id?: string | null;
    date?: Date | null;
    status: number;
    registerId: string;
};