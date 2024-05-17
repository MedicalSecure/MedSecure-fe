export type CheckDrugRequest = {
    drugs: Array<DrugDTO>
}
export type CheckDrugResponse = {
    drugsChecked: Array<DrugDTO>
}

export type DrugDTO = {
    id?: string;
    name: string;
    dosage: string;
    form: string;
    code: string;
    unit: string;
    description: string;
    expiredAt: string;//TODO 
    stock: number;
    alertStock: number;
    avrgStock: number;
    minStock: number;
    safetyStock: number;
    reservedStock: number;
    price: number;
    isDrugExist?: boolean;
    isDosageValid?: boolean;
}
