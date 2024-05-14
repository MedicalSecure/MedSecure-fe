import { Country } from '../enums/country';
import {
  FamilyStatus,
  Gender,
  Language,
  Status,
  TestType,
} from '../enums/enum';
import { PaginatedResult, PrescriptionDto } from './prescriptionDTOs';

/// done
export type PatientDto = {
  id: string;
  firstName: string;
  lastName?: string | null;
  dateOfBirth?: Date | null;
  identity?: number | null;
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
  familyStatus?: FamilyStatus | null;
  children?: number | null;
  createdAt: Date;
  modifiedAt?: Date | null;
  createdBy: string;
  modifiedBy?: string | null;
};

export type History = {
  id: string;
  date: Date;
  status: Status;
  registerId: string;
};

export type Test = {
  id: string;
  code?: string;
  description: string;
  language?: Language;
  type: TestType;
  registerId: string;
};

export type RiskFactorDto = {
  id: string;
  key?: string | null;
  value?: string | null;
  code?: string | null;
  description?: string | null;
  isSelected: boolean;
  type?: string | null;
  icon?: string | null;
  subRiskFactors?: SubRiskFactorDto[];
};

export type RegisterDto = {
  id: string;
  patient: PatientDto;
  familyMedicalHistory?: RiskFactorDto[];
  personalMedicalHistory?: RiskFactorDto[];
  diseases?: RiskFactorDto[];
  allergies?: RiskFactorDto[];
  history?: History[];
  test?: Test[];
  prescriptions?: PrescriptionDto[] | null;
  createdAt: Date;
  modifiedAt?: Date;
  createdBy: string;
  modifiedBy?: string;
};

export type SubRiskFactorDto = {
  id: string;
  key: string;
  value: string;
  code: string;
  description: string;
  isSelected: boolean;
  type: string;
  icon: string;
  riskFactorId: string;
};

export type GetRegistrationsResponse = {
  registrations: PaginatedResult<RegisterDto>;
};

export type GetPatientsResponse = {
  patients: PaginatedResult<PatientDto>;
};
