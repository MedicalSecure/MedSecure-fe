import {Component, Input} from '@angular/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {provideNativeDateAdapter} from '@angular/material/core';

/** @title Datepicker start date */
@Component({
  selector: 'date-picker',
  templateUrl: 'date-picker.component.html',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule],
})
export class DatePicker {
  @Input() customTitle:String="Choose a date"
  @Input() showHint:boolean=true;
  startDate = new Date();

  
}