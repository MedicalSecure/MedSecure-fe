import { DietDto } from './DietDTOs';
import { UnitCareDTO } from './UnitCareDTOs';
import { MedicationDto } from './medicationDTOs';

export type PaginatedResult<TEntity> = {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: TEntity[];
};

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

export type PrescriptionDto = {
  id: string;
  registerId: string;
  doctorId: string;
  symptoms: SymptomDto[];
  diagnoses: DiagnosisDto[];
  posologies: PosologyDto[];
  unitCare?: UnitCareDTO | null;
  diet?: DietDto | null;
  createdAt: Date;
  lastModified?: Date | null;
  createdBy: string;
  lastModifiedBy?: string | null;
};

export type GetPrescriptionsResult = {
  prescriptions: PaginatedResult<PrescriptionDto>;
};

export type PosologyDto = {
  id: string;
  prescriptionId: string;
  medication: MedicationDto;
  startDate: Date;
  endDate: Date | null;
  isPermanent: boolean;
  comments: CommentsDto[];
  dispenses: DispenseDto[];
};

export type CommentsDto = {
  id: string | null;
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
  Quantity?: string;
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
