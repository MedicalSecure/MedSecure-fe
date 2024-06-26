import { PaginatedResult } from '.';

export type GetDrugsResponse = {
  drugs: PaginatedResult<DrugDTO>;
};

export type DrugDTO = {
  id?: string;
  name: string;
  dosage: string;
  form: string;
  code: string;
  unit: string;
  description: string;
  expiredAt: string;
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
};


