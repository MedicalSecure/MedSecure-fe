export interface BacPatientResponse {
    bacPatients: {
      pageIndex: number;
      pageSize: number;
      count: number;
      data: bacpatient[];
    };
  }
  
  export interface bacpatient {
    id: string;
    prescription: Prescription;
    bed: number;
    nurseId: string;
    served: number;
    toServe: number;
    status: number;
    room : Room ; 
  }
  export interface Room {
    id: string;
    roomNumber: number;
    status: number;
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
    form: string;
    description: string;
  }
  
  export interface Comment {
    id: string;
    posologyId: string;
    label: string;
    content: string;
  }
  
  export interface Dispense {
    id: string;
    posologyId: string;
    hour: number;
    quantityBE: number;
    quantityAE: number;
  }
  