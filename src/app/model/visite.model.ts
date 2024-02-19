// visite.model.ts
import {Patients} from'./patients'

export interface Visite {
    id?: number;
    startDate: Date;
    endDate: Date;
    patientName: Patients['nom'];
    repetition: string;
    treatment: string;
  }
  