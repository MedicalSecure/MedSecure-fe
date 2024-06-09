import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-datepicker-range-popup',
  standalone: true,
  imports: [CalendarModule, RouterOutlet, FormsModule],
  templateUrl: './datepicker-range-popup.component.html',
  styleUrl: './datepicker-range-popup.component.css',
})
export class DatepickerRangePopupComponent {
  @Input()
  dateRange: DateRangeType = [new Date(), null];

  @Input()
  isMinimalisticView: boolean = true;

  @Input()
  minDate:Date=new Date('2000/01/01');

  @Input()
  maxDate:Date=new Date('9999/01/01');

  @Input()
  disabled:boolean=false

  panelStyle: string = 'd-none';
  @Output()
  DateRangeChange: EventEmitter<DateRangeType> =
    new EventEmitter<DateRangeType>();

  inputStyle: object = this.isMinimalisticView ? { maxWidth: '14.2rem' } : {};

  emitFinalDateRange() {
    //console.log('selected range :', this.dateRange);
    this.DateRangeChange.emit(this.dateRange);
  }

  onCloseCalender() {
    this.emitFinalDateRange();
  }
  onClearClick() {
    this.emitFinalDateRange();
  }
  onDateSelect() {
    if (this.dateRange?.at(1) != null) {
      //emit only when both startDate and endDate are selected
      // this is used to prevent Emitting a [StartDate,null] while the user is still choosing the end date
      // if the user choose to close the calender after choosing the startDate only, the onCloseCalender will handle Emitting it!
      this.onCloseCalender();
    }
  }
}

export type DateRangeType = [Date, Date | null] | null;
