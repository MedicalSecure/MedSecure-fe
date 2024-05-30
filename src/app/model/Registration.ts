import { Country } from "../enums/country";
import { Children, FamilyStatus, Gender, HistoryStatus, Language, RegisterStatus, TestType } from "../enums/enum";

export interface RegistrationResponse{
    registers: {
        pageIndex: number;
        pageSize: number;
        count: number;
        data: RegisterDto[]
    };
}

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
    familyStatus?: FamilyStatus | null;
    children?: Children | null;
  }
  


  export interface HistoryDto {
    id?: string | null;
    date?: Date | null;
    status: HistoryStatus;
    registerId: string;
  }
  
  export interface RiskFactorDto {
    id?: string | null;
    key?: string | null;
    value?: string | null;
    code?: string | null;
    description?: string | null;
    isSelected: boolean;
    type?: string | null;
    icon?: string | null;
    subRiskFactors?: SubRiskFactor[] | null;
  }

  export interface SubRiskFactor {
    id?: string| null;
    key?: string | null;
    value?: string | null;
    code?: string | null;
    description?: string | null;
    isSelected: boolean;
    type?: string | null;
    icon?: string | null;
    subRiskFactors?: SubRiskFactor[] | null;
  }
  
  export interface TestDto {
    id: string;
    code?: string | null;
    description?: string | null;
    language?: Language | null;
    testType?: TestType | null;
    registerId: string;
  }
