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
  medicationId: string;
  name: string;
  dispenseValue: number;
  dispenseUnit: string;
  startDate: Date;
  consumptionDays: number;
  isForceOrder?: boolean;
  administrationHours: Set<medicationHourType>;
  dispenseCaution?: string;
  comments: Array<commentType>;
};
