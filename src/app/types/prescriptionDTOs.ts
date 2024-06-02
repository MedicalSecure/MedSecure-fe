import { PaginatedResult } from '.';
import { Country } from '../enums/country';
import { FamilyStatus, Gender, HistoryStatus, PrescriptionStatus, RegisterStatus } from '../enums/enum';
import { HistoryDto, RegisterDto, RiskFactorDto, TestDto } from '../model/Registration';
import { UnitCare } from '../model/unitCare/UnitCareData';
import { DrugDTO } from './DrugDTOs';

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
export type PutPrescriptionStatusRequest = {
  prescription: PrescriptionDto;
};
export type CreatePrescriptionResponse = {
  id: string;
};

export type PutPrescriptionResponse = {
  id: string;
};
export type GetPrescriptionsByRegisterIdResponse = {
  prescriptionsByRegisterId: { [key: string]: PrescriptionDto[] };
};

export type RegisterWithPrescriptions={
  register:RegisterDto,
  prescriptions:PrescriptionDto[]
}
export type RegisterWithPrescriptionsDict={
  [key:string]: RegisterWithPrescriptions
}
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
  unitCare: UnitCare | null; //match these types
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
  medication: DrugDTO;
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


export type RegisterForPrescription = {
  id: string;
  mrn?: string;
  currentStatus: HistoryStatus;
  registeredAt?: Date;
  patient_id: string;
  patient_firstName: string;
  patient_lastName: string;
  patient_fullName: string;
  patient_dateOfBirth: Date;
  patient_identity: string | null;
  patient_cnam?: number | null;
  patient_assurance?: string | null;
  patient_gender: Gender;
  patient_height?: number | null;
  patient_weight?: number | null;
  patient_addressIsRegistrations?: boolean | null;
  patient_saveForNextTime?: boolean | null;
  patient_email?: string | null;
  patient_address1?: string | null;
  patient_address2?: string | null;
  patient_country?: Country | null;
  patient_state?: string | null;
  patient_familyStatus?: FamilyStatus | null;
  patient_children?: number | null;
  familyMedicalHistory?: RiskFactorDto[];
  personalMedicalHistory?: RiskFactorDto[];
  diseases?: RiskFactorDto[];
  allergies?: RiskFactorDto[];
  history?: HistoryDto[];
  test?: TestDto[];
  status?:RegisterStatus;
  prescriptions?: PrescriptionDto[] | null;
  createdAt: Date;
  modifiedAt?: Date;
  createdBy: string;
  modifiedBy?: string | null;
};
