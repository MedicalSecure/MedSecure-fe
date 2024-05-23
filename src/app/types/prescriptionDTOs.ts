import { PaginatedResult } from '.';
import { Country } from '../enums/country';
import { FamilyStatus, Gender, PrescriptionStatus } from '../enums/enum';
import { UnitCareDTO } from './UnitCareDTOs';
import { MedicationDto } from './medicationDTOs';

export type GetPrescriptionsResponse = {
  prescriptions: PaginatedResult<PrescriptionDto>;
};
export type GetDiagnosisResponse = {
  diagnosis: PaginatedResult<DiagnosisDto>;
};
export type GetSymptomsResponse = {
  symptom: PaginatedResult<SymptomDto>;
};

export type PostPredictDiagnosisResponse = {
  predictedDiagnosis: DiagnosisDto;
};
export type PostPredictDiagnosisCommand = {
  symptoms: SymptomDto[];
};
export type CreatePrescriptionRequest = {
  prescription: PrescriptionCreateDto;
};
export type CreatePrescriptionResponse = {
  id: string;
};
export type GetPrescriptionsByRegisterIdResponse = {
  prescriptionsByRegisterId: { [key: string]: PrescriptionDto[] };
};

export type PrescriptionDto = {
  id: string;
  registerId: string;
  doctorId: string;
  symptoms: SymptomDto[];
  diagnoses: DiagnosisDto[];
  posologies: PosologyDto[];
  bedId?: string | null; //match these types
  status: PrescriptionStatus;
  diet?: DietForPrescriptionDTO | null;
  createdAt: Date;
  lastModified?: Date | null;
  createdBy: string;
  lastModifiedBy?: string | null;
};

export type PrescriptionCreateDto = {
  id?: string;
  registerId: string;
  doctorId: string;
  symptoms: SymptomDto[];
  diagnoses: DiagnosisDto[];
  posologies: PosologyCreateDto[];
  unitCare: UnitCareDTO | null; //match these types
  diet?: DietForPrescriptionDTO | null;
  createdAt: Date;
  createdBy: string;
};

export type DietForPrescriptionDTO = {
  id?: string;
  startDate: Date;
  endDate: Date;
  dietsId: string[];
};

export type GetPrescriptionsResult = {
  prescriptions: PaginatedResult<PrescriptionDto>;
};

export type PosologyDto = {
  id: string;
  prescriptionId: string;
  medication: MedicationDto;
  medicationId: string;
  startDate: Date;
  endDate: Date | null;
  isPermanent: boolean;
  comments: CommentsDto[];
  dispenses: DispenseDto[];
};

export type PosologyCreateDto = {
  medicationId: string;
  startDate: Date;
  endDate: Date | null;
  isPermanent: boolean;
  comments: CommentsDto[];
  dispenses: DispenseDto[];
};

export type CommentsDto = {
  id?: string;
  posologyId?: string;
  label: string;
  content: string;
};

export type DispenseDto = {
  hour: string;
  beforeMeal?: DoseDto;
  afterMeal?: DoseDto;
};

export type DoseDto = {
  quantity: string;
  isValid: boolean;
  isPostValid: boolean;
};

export type DiagnosisDto = {
  id: string;
  code: string;
  name: string;
  shortDescription: string;
  longDescription: string;
};

export type SymptomDto = {
  id: string;
  code: string;
  name: string;
  shortDescription: string;
  longDescription: string;
};

export type DoctorDto = {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  dateOfBirth: Date;
};

export type PatientForPrescription = {
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
