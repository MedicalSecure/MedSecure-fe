
export type ArmoireStock= {
    id: number;
    nom: string,
    medicaments: medicaments []
}

export type medicaments ={
    nom: string,
    quantite_Pres_administree:number,
    quantite_stock_actual: number
}