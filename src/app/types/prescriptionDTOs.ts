export type PaginatedResult<TEntity> = {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: TEntity[];
};

export type GetPrescriptionsResponse = {
  prescriptions: PaginatedResult<PrescriptionDto>;
};

export type PrescriptionDto = {
  id: string;
  registerId: string;
  doctorId: string;
  symptoms: SymptomDto[];
  diagnoses: DiagnosisDto[];
  posologies: PosologyDto[];
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

export type MedicationDto = {
  id: string;
  name: string;
  dosage: string;
  form: string;
  code: string;
  unit: string;
  description: string;
  expiredAt: Date;
  stock: number;
  alertStock: number;
  avrgStock: number;
  minStock: number;
  safetyStock: number;
  reservedStock: number;
  price: number;
};
