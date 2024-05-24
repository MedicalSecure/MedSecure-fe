import { TypeVisit } from "./TypeVisit";
import { LocationVisit } from "./LocationVisit";
import { ActionType } from "./ActionType";
import {Patients} from "../model/patients"
import { EventColor } from 'calendar-utils';
import { EventAction } from "./EventAction";

export interface CalendarEventType<MetaType = any> {
    typevisits?: TypeVisit;
    disponibilite?: LocationVisit;
    avaibility?: string;
    description?: string;
    duration?: string;
    actionType: ActionType[];
    patient?: Patients;
    id?: number;
    start: Date | any;
    end?: Date | any;
    title: string;
    color?: EventColor;
    actions?: EventAction[];
    allDay?: boolean;
    cssClass?: string;
    resizable?: {
      beforeStart?: boolean;
      afterEnd?: boolean;
    };
    draggable?: boolean;
    meta?: MetaType;
  }

  const colors: Record<string, EventColor> = {
    red: { primary: '#ad2121', secondary: '#FAE3E3', },
    blue: { primary: '#1e90ff', secondary: '#D1E8FF', },
    yellow: { primary: '#e3bc08', secondary: '#FDF1BA', },
  };