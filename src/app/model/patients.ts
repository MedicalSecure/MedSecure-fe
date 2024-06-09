export interface Patients {
  id: string;
  firstName: string;
  lastName?: string;
  dateOfBirth?: Date | string;
  gender?: number;
  CIN?: number;
  CNAM?: number;
  assurance?: string;
  height?: number;
  weight?: number;
  addressIsRegisterations?: boolean;
  saveForNextTime?: boolean;
  email?: string;
  address1?: string;
  address2?: string | null;
  activityStatus?: number;
  country?: number;
  state?: string;
  zipCode?: number;
  familyStatus?: number;
  children?: number;
  status?: string;
  topUrgency?:boolean
  image?:string
}