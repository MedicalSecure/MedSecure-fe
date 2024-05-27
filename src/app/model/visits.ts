import { Patients } from "./patients";

export class visits{
    start: string;
    end?: string;
    title: string;
    color: { [key: string]: string };
    actionType?: string[];
    allDay?: boolean;
    patient?: Patients;
    repetition?: string;
    treatment?: string;
    }

