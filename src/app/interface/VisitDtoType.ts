import { TypeVisit } from "./TypeVisit";
import { LocationVisit } from "./LocationVisit";
import { Patients } from "../model/patients";
export interface VisitDtoType {
    id?: string;
    startDate: Date ;
    endDate: Date ;
    patient:Patients;
    doctorId: string;
    title: string;
    typeVisit: TypeVisit;
    locationVisit: LocationVisit;
    duration: string;
    description: string;
    availability: string;
  }