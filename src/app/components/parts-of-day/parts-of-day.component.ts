import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { DatepickerRangePopupComponent } from '../datepicker-range-popup/datepicker-range-popup.component';

@Component({
  selector: 'app-parts-of-day',
  standalone: true,
  templateUrl: './parts-of-day.component.html',
  styleUrl: './parts-of-day.component.css',
  imports: [CommonModule, MatDividerModule, DatepickerRangePopupComponent],
})
export class PartsOfDayComponent implements OnInit {
  @Input()
  partsOfDayHours: hourType[][] = [
    // Late Night
    [{ hour: '00' }, { hour: '01' }, { hour: '02' }],
    // Pre-Dawn/Dawn
    [{ hour: '03' }, { hour: '04' }, { hour: '05' }],
    // Early Morning
    [{ hour: '06' }, { hour: '07' }, { hour: '08' }],
    // Mid-Morning
    [{ hour: '09' }, { hour: '10' }, { hour: '11' }],
    // Noon/Midday
    [{ hour: '12' }],
    // Afternoon
    [{ hour: '13' }, { hour: '14' }, { hour: '15' }],
    // Mid-Afternoon
    [{ hour: '16' }, { hour: '17' }],
    // Evening
    [{ hour: '18' }, { hour: '19' }, { hour: '20' }, { hour: '21' }],
    // Dusk
    [{ hour: '22' }, { hour: '23' }],
  ];
  private _partsOfDayNames: string[] = [
    // Late Night
    'Late Night',
    // Pre-Dawn/Dawn
    'Pre-Dawn/Dawn',
    // Early Morning
    'Early Morning',
    // Mid-Morning
    'Mid-Morning',
    // Noon/Midday
    'Noon/Midday',
    // Afternoon
    'Afternoon',
    // Mid-Afternoon
    'Mid-Afternoon',
    // Evening
    'Evening',
    // Dusk
    'Dusk',
  ];
  private _hourClasses: string[] = [
    'bg-dark',
    'bg-info',
    'bg-info',
    'bg-success',
    'bg-warning',
    'bg-primary',
    'bg-danger',
    'bg-warning',
    'bg-danger',
    'bg-dark',
  ];

  ngOnInit(): void {}

  onClick(
    partOfDayIndex: number,
    hourIndex: number,
    increment: number,
    HourObject: hourType,
    isBeforeFood: boolean
  ) {
    let newHourObject = this.getUpdatedHourValue(
      HourObject,
      increment,
      isBeforeFood
    );
    //this.applyHourModification(partOfDayIndex, hourIndex, newHourObject);
  }

  onScroll(
    partOfDayIndex: number,
    hourIndex: number,
    event: WheelEvent,
    HourObject: hourType,
    isBeforeFood: boolean = false
  ) {
    let increment = event.deltaY < 0 ? 1 : -1;
    let newHourObject = this.getUpdatedHourValue(
      HourObject,
      increment,
      isBeforeFood
    );
    console.log(newHourObject);
    this.applyHourModification(partOfDayIndex, hourIndex, newHourObject);
  }

  getUpdatedHourValue(
    HourObject: hourType,
    increment: number,
    isBeforeFood: boolean
  ): hourType {
    let newHourObject = { ...HourObject };
    let oldValue = 0;
    if (isBeforeFood) {
      if (newHourObject?.beforeFoodDispenseQuantity != undefined) {
        try {
          oldValue = parseInt(newHourObject?.beforeFoodDispenseQuantity);
          if (Number.isNaN(oldValue)) oldValue = 0;
        } catch (error) {
          oldValue = 0;
        }
      }
      console.log(oldValue);
      let finalValue: string =
        oldValue + increment > 0 ? (oldValue + increment).toString() : '';
      newHourObject.beforeFoodDispenseQuantity = finalValue;
    } else {
      if (newHourObject?.afterFoodDispenseQuantity != undefined) {
        try {
          oldValue = parseInt(newHourObject?.afterFoodDispenseQuantity);
          if (Number.isNaN(oldValue)) oldValue = 0;
        } catch (error) {
          oldValue = 0;
        }
      }
      let finalValue: string =
        oldValue + increment > 0 ? (oldValue + increment).toString() : '';
      newHourObject.afterFoodDispenseQuantity = finalValue;
    }
    return newHourObject;
  }

  applyHourModification(
    partOfDayIndex: number,
    hourIndex: number,
    newValue: hourType
  ) {
    let oldPartOfDayArray = this.partsOfDayHours[partOfDayIndex];
    oldPartOfDayArray[hourIndex] = newValue;
  }

  getBackgroundColor(index: number): string {
    return index >= 0 && index < this._hourClasses.length
      ? this._hourClasses[index]
      : 'bg-dark';
  }

  

  getTitle(index: number) {
    return index >= 0 && index < this._hourClasses.length
      ? this._partsOfDayNames[index]
      : '';
  }

  onInputChange($event: any) {
    console.log($event);
  }
}
export type hourType = {
  hour: string;
  beforeFoodDispenseQuantity?: string;
  afterFoodDispenseQuantity?: string;
};
