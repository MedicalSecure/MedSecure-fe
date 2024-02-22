export interface Medicine {
    id: number;
    medicineName: string;
    dosage: string;
    dosageForm: string;
    quantity: number;
    reservedQuantity: number;
    manufacturer: string;
    expirationDate: Date;
    price: number;
    prescriptionRequired: boolean;
    indications: string;
}

export const MEDICINES: Medicine[] = [

      

];


  