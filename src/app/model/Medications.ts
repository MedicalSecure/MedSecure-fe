export type Medication = {
    Name: string;
    Dosage: string;
    Forme: number;
    Unit: string;
    Description: string;
    ExpiredAt: string;
    Stock: number;
    AlertStock: number;
    AvrgStock: number;
    MinStock:number;
    SafetyStock: number;
    ReservedStock: number;
    AvailableStock: number;
    Price: number; 
    MaxStock: number;
    [key: string]: any;
  };