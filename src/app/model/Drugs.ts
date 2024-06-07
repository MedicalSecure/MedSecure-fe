import { ValidationStatus } from "../enums/enum";
import { PaginatedResult } from "../types";
import { CommentsDto, DispenseDto } from "./Prescription";

export type GetDrugsResponse = {
  drugs: PaginatedResult<DrugDTO>;
};

export type GetValidationsResponse = {
  validations: PaginatedResult<ValidationDto>;
};

export type DrugDTO = {
  id?: string;
  name: string;
  dosage: string;
  form: string;
  code: string;
  unit: string;
  description: string;
  expiredAt: Date;
  stock: number;
  availableStock?: number;
  reservedStock?: number;
  alertStock: number;
  avrgStock: number;
  minStock: number;
  safetyStock: number;
  price: number;
  isDrugExist?: boolean;
  isDosageValid?: boolean;
};

export type CheckDrugRequest = {
  drugs: Array<DrugDTO>;
};
export type CheckDrugResponse = {
  drugsChecked: Array<DrugDTO>;
};

export type CreateDrugRequest = {
  drugs: Array<DrugDTO>;
};

export type CreateDrugResponse = {
  ids: Array<string>;
}



export type ValidationPosologyDto = {
  id: string; // Guid equivalent in TypeScript
  drugId: string; // Guid equivalent in TypeScript
  drug?: DrugDTO;
  dispenses: DispenseDto[];
  comments: CommentsDto[];
};

export type ValidationDto = {
  id: string; // Guid equivalent in TypeScript
  prescriptionId: string; // Guid equivalent in TypeScript
  pharmacistId: string; // Guid equivalent in TypeScript
  unitCareJson: string;
  posologies: ValidationPosologyDto[];
  pharmacistName?: string;
  status: ValidationStatus;
  notes?: string;
  createdAt: Date;
};