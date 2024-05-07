import { Country } from "../enums/country";
import { FamilyStatus, Gender, Language, Status, TestType } from "../enums/enum";
import { PaginatedResult, PrescriptionDto } from "./prescriptionDTOs";

export type RegisterDto = {
    id: string;
    patientId: string;
    patient: PatientDto;
    familyMedicalHistory?: RiskFactor[] | null;
    personalMedicalHistory?: RiskFactor[] | null;
    diseases?: RiskFactor[] | null;
    allergies?: RiskFactor[] | null;
    history?: History[] | null;
    tests?: Test[] | null;
    prescriptions?: PrescriptionDto[] | null;
    createdAt:Date,
    modifiedAt?:Date,
    createdBy:string,
    modifiedBy?:string,
}


export type PatientDto = {
    id: string;
    firstName: string;
    lastName?: string | null;
    dateOfBirth?: Date | null;
    cin?: number | null;
    cnam?: number | null;
    gender?: Gender | null;
    height?: number | null;
    weight?: number | null;
    email?: string | null;
    address1?: string | null;
    address2?: string | null;
    country?: Country | null;
    state?: string | null;
    familyStatus?: FamilyStatus | null;
    children?: number | null;
    createdAt:Date,
    modifiedAt?:Date,
    createdBy:string,
    modifiedBy?:string,
}

export type History ={
    id: string;
    date: Date;
    status: Status;
    registerId: string;
}

export type RiskFactor ={
    id: string;
    subRiskFactor: RiskFactor[];
    riskFactorParent?: RiskFactor | null;
    riskFactorParentId?: string | null;
    riskFactorId?: string | null;
    key: string;
    value: string;
    code: string;
    description: string;
    isSelected: boolean;
    type: string;
    icon: string;
}

export type Test ={
    id: string;
    code: string;
    description: string;
    language: Language;
    type: TestType;
    registerId: string;
}

export type GetRegistrationsResponse={
    registrations:PaginatedResult<RegisterDto>
}
