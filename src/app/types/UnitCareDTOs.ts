import { EqStatus } from "../enums/enum";

export type GetUnitCareResponse = {
  unitCares: {
    pageIndex: number;
    pageSize: number;
    count: number;
    data: UnitCareDTO[];
  };
};

export type UnitCareDTO = {
  id: string;
  type: string;
  description: string;
  title: string;
  rooms: Room[];
  personnels: Personnel[];
};

export type Room = {
  id: string;
  unitCareId: string;
  roomNumber: number;
  status: number;
  equipments: Equipment[];
};

export type Equipment = {
  id: string;
  roomId: string;
  name: string;
  reference: string;
  eqStatus: EqStatus
};

export type Personnel = {
  id: string;
  unitCareId: string;
  name: string;
  shift: number;
  gender: number;
};
