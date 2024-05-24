import {CalendarEventType} from './CalendarEventType'

export interface EventAction {
    id?: string | number;
    label: string;
    cssClass?: string;
    a11yLabel?: string;
    onClick({ event, sourceEvent, }: {
      event: CalendarEventType;
      sourceEvent: MouseEvent | KeyboardEvent;
    }): any;
  }