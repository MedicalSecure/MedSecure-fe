import { Dispense } from "../components/schedule/schedule.component";

export interface BacPatientResponse {
    bacPatients: {
      pageIndex: number;
      pageSize: number;
      count: number;
      data: bacpatient[];
    };
  }
  export interface PrescriptionResponse {
    prescriptions: {
      pageIndex: number;
      pageSize: number;
      count: number;
      data: Prescription[];
    };
  }
  export interface bacpatient {
    id: string;
    prescription: Prescription;
    nurseId: string;
    served: number;
    toServe: number;
    status: number;
   
  }
  export interface Room {
    id: string;
    roomNumber: number;
    status: number;
    equipment : Equipment
  }
  export interface Equipment {
    id: string;
   reference : string;
  }
  export interface Prescription {
    id: string;
    register: Register;
    createdAt: Date;
    posologies: Posology[];
    unitCare: UnitCare;
  }
  export interface UnitCare {
    id: string;
    title: string;
    description: string;
    room : Room
  }
  export interface Register {
    id: string;
    patient: Patient;
  }
  export interface Patient {
    id: string;
    firstName: string;
    lastName: string;
    dateOfbirth: Date;
    gender: number;
  }
  export interface Posology {
    id: string;
    prescriptionId: string;
    medication: Medication;
    startDate: Date;
    endDate: Date;
    isPermanent: boolean;
    comments: Comment[];
    dispenses: Dispense[];
  }
  export interface Medication {
    id: string;
    name: string;
    dosage: string;
    form: number;
    description: string;
  }
  export interface Comment {
    id: string;
    posologyId: string;
    label: string;
    content: string;
  }
 