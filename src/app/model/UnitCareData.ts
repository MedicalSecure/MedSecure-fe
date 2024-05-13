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
  rooms: Room[];
  personnels: Personnel[];
}

interface Room {
  id: string;
  unitCareId: string;
  roomNumber: number;
  status: number;
  equipments: Equipment[];
}

interface Equipment {
  id: string;
  roomId: string;
  name: string;
  reference: string;
  eqStatus:number;
  eq:number;
}

interface Personnel {
  id: string;
  unitCareId: string;
  name: string;
  shift: number;
  gender:number
}
