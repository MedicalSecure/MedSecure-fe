import { Country } from "../enums/country";
import { ActivityStatus, Children, FamilyStatus, Gender, HistoryStatus, Language, RegisterStatus, TestType } from "../enums/enum";
import { PaginatedResult } from "../types";

export interface GetRegistrationResponse{
  registers: PaginatedResult<RegisterDto>;
}
export type GetPatientsResponse = {
  patients: PaginatedResult<PatientDto>;
};


export type CreateRegisterRequest = {
  register: RegisterDto;
};

export type GetRegisterByIdResponse = {
  register: RegisterDto | null;
};

export type archiveUnarchiveRequest = {
  registerId:string;
  registerStatus:RegisterStatus;
};


export interface RegisterDto {
    id?: string | null;
    patient: PatientDto;
    familyMedicalHistory?: RiskFactorDto[] | null;
    personalMedicalHistory?: RiskFactorDto[] | null;
    diseases?: RiskFactorDto[] | null;
    allergies?: RiskFactorDto[] | null;
    history?: HistoryDto[] | null;
    test?: TestDto[] | null;
    status?: RegisterStatus | null;
    createdAt?: Date | null;
  }

  export interface PatientDto {
    id?: string | null;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    identity: string;
    cnam?: number | null;
    assurance?: string | null;
    gender?: Gender | null;
    height?: number | null;
    weight?: number | null;
    addressIsRegistrations?: boolean | null;
    saveForNextTime?: boolean | null;
    email?: string | null;
    address1?: string | null;
    address2?: string | null;
    country?: Country | null;
    state?: string | null;
    zipCode?: number | null;
    activityStatus? : ActivityStatus | null;
    familyStatus?: FamilyStatus | null;
    children?: Children | null;
  }
  


  export interface HistoryDto {
    id?: string | null;
    date: Date;
    status: HistoryStatus;
    registerId: string;
  }
  
  export interface RiskFactorDto {
    id?: string | null;
    RiskFactorParentId?: string | null;
    key: string;
    value: string;
    code?: string | null;
    description?: string | null;
    isSelected?: boolean | null;
    type?: string | null;
    icon?: string | null;
    subRiskFactor?: RiskFactorDto[] | null;
  }


  
  export interface TestDto {
    id: string;
    code?: string | null;
    description?: string | null;
    language?: Language | null;
    testType?: TestType | null;
    registerId: string;
  }
