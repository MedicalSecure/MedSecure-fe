import { Dispense } from '../components/schedule/schedule.component';
import { ConsumptionPeriodType } from '../pages/prescription/stp4-add-medication/stp4-add-medication.component';

export type styleClass = { [klass: string]: any } | null | undefined;

export type PaginatedResult<TEntity> = {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: TEntity[];
};

export type medicationHourType = {
  hour: number;
  isBeforeFood: boolean;
};
export type commentType = {
  id?: string;
  label?: string;
  content: string;
  labelClass?: string;
  labelStyle?: styleClass;
};
export type medicationType = {
  id: string;
  label: string;
  dispenseUnit: string;
  consumptionPeriod: ConsumptionPeriodType;
  isForceOrder?: boolean;
  administrationHours: Dispense[];
  Caution?: string;
  comments: Array<commentType>;
  summary?:object;
};

export type ActivityView = {
  id: string;
  content: string;
  createdBy: string;
  creatorName: string;
  activityTime: string;
};

export type Entity = {
  createdAt: Date;
  modifiedAt?: Date;
  createdBy: string;
  modifiedBy?: string;
};
