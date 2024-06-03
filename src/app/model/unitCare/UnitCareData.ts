import { EquipmentType } from "../../enums/enum";

export  interface UnitCareData {
  unitCares: {
    pageIndex: number;
    pageSize: number;
    count: number;
    data: UnitCare[];

  };
}

 export interface UnitCare {
  id: string;
  type: string;
  description: string;
  title: string;
  unitStatus: number;
  rooms: Room[];
  personnels: Personnel[];
}

export interface Room {
  id: string;
  unitCareId: string;
  roomNumber: number;
  status: number;
  equipments: Equipment[];
}

export interface Equipment {
  id: string;
  roomId: string;
  name: string;
  reference: string;
  eqStatus:number;
  eqType:EquipmentType;
}

export interface Personnel {
  id: string;
  unitCareId: string;
  name: string;
  shift: number;
  gender:number
}
