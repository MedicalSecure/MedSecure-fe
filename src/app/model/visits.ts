export class visits{
    start: string;
    end?: string;
    title: string;
    color: { [key: string]: string };
    actionType: string[];
    allDay?: boolean;
    patient?: string;
    repetition?: string;
    treatment?: string;

    constructor(
        start: string,
        title: string,
        color: { [key: string]: string },
        actionType: string[],
        patient?: string,
        repetition?: string,
        treatment?: string,
        end?: string,
        allDay?: boolean
    ) {
        this.start = start;
        this.title = title;
        this.color = color;
        this.actionType = actionType;
        this.patient = patient;
        this.repetition = repetition;
        this.treatment = treatment;
        this.end = end;
        this.allDay = allDay;
    }
}
