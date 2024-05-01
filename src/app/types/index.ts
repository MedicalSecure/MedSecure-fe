import { hourType } from '../components/parts-of-day/parts-of-day.component';
import { ConsumptionPeriodType } from '../pages/prescription/stp4-add-medication/stp4-add-medication.component';

export type styleClass = { [klass: string]: any } | null | undefined;

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
  administrationHours: hourType[][];
  Caution?: string;
  comments: Array<commentType>;
  summary?:object;
};
