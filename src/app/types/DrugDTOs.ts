import { PaginatedResult } from '.';

export type GetDrugsResponse = {
  drugs: PaginatedResult<DrugDTO>;
};

export type DrugDTO = {
  id: string;
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