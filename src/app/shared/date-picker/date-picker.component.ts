import { Component, EventEmitter, Input, Output, input } from '@angular/core';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';

/** @title Datepicker start date */
@Component({
  selector: 'date-picker',
  templateUrl: 'date-picker.component.html',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule],
})
export class DatePicker {
  @Input() customTitle: String = 'Choose a date';
  @Input() showHint: boolean = true;
  @Input() class: string = '';
  @Input() errorMessage: string = '';
  @Input() minDate?: Date;
  @Input() maxDate?: Date;
  @Input() startDate = new Date();
  @Output() onInputDateChange = new EventEmitter<Date | null>();

  handleDateChange(event: MatDatepickerInputEvent<any, any>): void {
    this.errorMessage = '';
    let inputDate: Date | null = event.value;
    if (inputDate == null) {
      this.errorMessage = "Date isn't valid";
      inputDate = null;
    } else if (this.minDate && inputDate < this.minDate) {
      this.errorMessage = 'Input date must be after the minimum date.';
      inputDate = null;
    } else if (this.maxDate && inputDate > this.maxDate) {
      this.errorMessage = 'Input date must be before the maximum date.';
      inputDate = null;
    }
    this._emitDate(inputDate);
  }

  private _emitDate(dateToEmit: Date | null) {
    this.onInputDateChange.emit(dateToEmit);
  }

  filterFunction(d: Date | null): boolean {
    /*  const date = d || new Date();
    // Prevent Saturday and Sunday from being selected
    return date <= new Date(); */
    return true;
  }

  /* 
  usage on parent component

  onStartDateInputChange(newDate: Date | null): void {
    console.log('selected ' + newDate);
  }

  usage on parent template 
  <date-picker
        customTitle="Choose start date"
        [showHint]="false"
        class=""
        (onInputDateChange)="onStartDateInputChange($event)"
        [maxDate]="maxSymptomsStartDate"
      ></date-picker>
  
  
  */
}
