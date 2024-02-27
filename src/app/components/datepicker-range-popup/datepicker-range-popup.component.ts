import { Component } from '@angular/core';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-datepicker-range-popup',
  standalone: true,
  imports: [CalendarModule, FormsModule],
  templateUrl: './datepicker-range-popup.component.html',
  styleUrl: './datepicker-range-popup.component.css'
})
export class DatepickerRangePopupComponent {
  date: Date = new Date();
}
