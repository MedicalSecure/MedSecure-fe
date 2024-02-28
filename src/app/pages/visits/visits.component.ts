import { Component } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { CalendarShedulerComponent } from '../../components/calendar-scheduler/calendar-scheduler.component';


@Component({
  selector: 'app-visits-home-page',
  standalone: true,
  imports: [CalendarShedulerComponent],
  templateUrl: './visits.component.html',
  styleUrl: './visits.component.css'
})
export class Visits  {
  
  events: CalendarEvent[] = [];
  selectedDate: Date = new Date();
  formData: any = {};
  selectedTime: string = '';
}
