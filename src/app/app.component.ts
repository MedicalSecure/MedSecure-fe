import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CalendarEvent, CalendarEventAction } from 'angular-calendar';
import { addDays, addHours, endOfMonth, startOfDay, subDays } from 'date-fns';
import { EventColor } from 'calendar-utils';
import { ActionType, CalendarShedulerComponent } from './component/calendar-scheduler/calendar-scheduler.component';
import { HttpClient } from '@angular/common/http';
import { Visite } from '../app/model/visite.model';
const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
  green: {
    primary: '#008000',
    secondary: '#B0E57C',
  },
  purple: {
    primary: '#800080',
    secondary: '#D7BDE2',
  },
  orange: {
    primary: '#FFA500',
    secondary: '#FFDAB9',
  },
  pink: {
    primary: '#FFC0CB',
    secondary: '#FFCCFF',
  },
  teal: {
    primary: '#008080',
    secondary: '#A9DFBF',
  },
};





@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CalendarShedulerComponent],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',

})
export class AppComponent {

  constructor(private http: HttpClient) { }
  title = 'medsecure-fe';

  events: CalendarEvent[] = [
    {
      start: startOfDay(new Date()),
      title: 'event 2',
      color: { ...colors['blue'] },
      actionType: [ActionType.edit, ActionType.delete],
    },
    {
      start: addDays(startOfDay(new Date('2024-02-12')), 2),
      end: addDays(startOfDay(new Date('2024-02-12')), 2),
      title: 'event 1',
      actionType: [ActionType.get],
      color: { ...colors['pink'] },
      allDay: true,
    },
    {
      start: addDays(startOfDay(new Date('2024-02-18')), 3),
      end: addDays(startOfDay(new Date('2024-02-18')), 3),
      title: 'event 3',
      actionType: [ActionType.edit, ActionType.delete],
      color: { ...colors['green'] },
      allDay: true,
    },
    {
      start: addHours(startOfDay(new Date('2024-02-16')), 4),
      end: addHours(startOfDay(new Date('2024-02-16')), 8),
      title: 'event 4',
      color: { ...colors['orange'] },
      actionType: [ActionType.get],
      resizable: {
        beforeStart: true,
        afterEnd: true,

      },
      draggable: true,

    },
    {
      start: addHours(startOfDay(new Date('2024-02-16')), 12),
      end: addHours(startOfDay(new Date('2024-02-16')), 16),
      title: 'event 5',
      color: { ...colors['pink'] },
      actionType: [ActionType.get],
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,

    },
    {
      start: addHours(startOfDay(new Date('2024-02-22')), 12),
      end: addHours(startOfDay(new Date('2024-02-22')), 16),
      title: 'event 8',
      color: { ...colors['pink'] },
      actionType: [ActionType.edit, ActionType.delete],
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,

    },
    {
      start: addHours(startOfDay(new Date('2024-02-25')), 12),
      end: addHours(startOfDay(new Date('2024-02-25')), 16),
      title: 'event 9',
      color: { ...colors['pink'] },
      actionType: [ActionType.edit, ActionType.delete],
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,

    },
  ];
  // events: CalendarEvent<Visite>[] = [];





}