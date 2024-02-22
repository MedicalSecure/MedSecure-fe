import { Component } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { CalendarShedulerComponent } from '../../component/calendar-scheduler/calendar-scheduler.component';

@Component({
  selector: 'app-visits-home-page',
  standalone: true,
  imports: [CalendarShedulerComponent],
  templateUrl: './visits-home-page.component.html',
  styleUrl: './visits-home-page.component.css'
})
export class VisitsHomePageComponent {
  
  events: CalendarEvent[] = [];
  selectedDate: Date = new Date();
  

}
