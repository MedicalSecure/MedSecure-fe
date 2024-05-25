import { PaginatedResult } from ".";


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
    availableStock:number;
    price: number;
  };
  
export type GetMedicationsResult = {
    medications: PaginatedResult<MedicationDto>;
  };