interface Equipment {
    id: string;
    roomId: string;
    name: string;
    reference: string;
    eqStatus: number;
    eqType: number;
  }
  
  interface Room {
    id: string;
    unitCareId: string;
    roomNumber: number;
    status: number;
    equipments: Equipment[];
  }
  
  interface Personnel {
    id: string;
    unitCareId: string;
    name: string;
    shift: number;
    gender: number;
  }
export type UnitCare ={
    id: string;
    type: string;
    description: string;
    title: string;
    unitStatus: number;
    rooms: Room[];
    personnels: Personnel[];
  }
  
  interface UnitCaresResponse {
    pageIndex: number;
    pageSize: number;
    count: number;
    data: UnitCare[];
  }
  