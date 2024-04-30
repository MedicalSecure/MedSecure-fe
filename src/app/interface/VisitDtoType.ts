import { TypeVisit } from "./TypeVisit";
import { LocationVisit } from "./LocationVisit";
export interface VisitDtoType {
    id?: string;
    startDate: Date ;
    endDate: Date ;
    patient: {
      id: string;
      firstName: string;
      lastName: string;
      dateOfBirth: Date | string;
      gender: number;
    };
    doctorId: string;
    title: string;
    typeVisit: TypeVisit;
    locationVisit: LocationVisit;
    duration: string;
    description: string;
    availability: string;
  }