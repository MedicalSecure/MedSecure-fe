import { Component } from '@angular/core';
import { CalendarEventType, CalendarShedulerComponent } from '../../components/calendar-scheduler/calendar-scheduler.component';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-visits',
  standalone: true,
  imports: [CalendarShedulerComponent, RouterModule],
  templateUrl: './visits.component.html',
  styleUrl: './visits.component.css'
})
export class VisitsComponent  {
  
  events: CalendarEventType[] = [];
  selectedDate: Date = new Date();
  formData: any = {};
  selectedTime: string = '';
}
