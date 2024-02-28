import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule} from "@angular/forms";
import { NgxDaterangepickerBootstrapDirective, NgxDaterangepickerBootstrapComponent } from "ngx-daterangepicker-bootstrap";
import dayjs, { Dayjs } from "dayjs";


import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-datepicker-range-popup',
  standalone: true,
  imports: [CalendarModule ,RouterOutlet, FormsModule, NgxDaterangepickerBootstrapDirective, NgxDaterangepickerBootstrapComponent],
  templateUrl: './datepicker-range-popup.component.html',
  styleUrl: './datepicker-range-popup.component.css'
})
export class DatepickerRangePopupComponent {
  date: Date = new Date();
  selected!: {startDate: Dayjs, endDate: Dayjs};

  onDateRangeChange(event: any) {
    const selectedDateRange = event.target.value;
    console.log(selectedDateRange);
  }

  onDateSelect(event: any) {
    this.date = event;
    console.log(this.date);
  }
}
