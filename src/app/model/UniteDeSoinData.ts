
export type Prescription= {
    id: number;
    medicament: string;
    dosage: string;
    quantite: number;
    infirmier: string;
    date: string;
    name:string;
}


export type Chambre ={
    name:string,
    numero: number;
    prescriptions: Prescription[];
}


export type Armoire ={
    id: number;
    chambres: Chambre[];
}


export type UniteDeSoinData= {
    id: number;
    nom: string;
    armoires: Armoire[];
}



