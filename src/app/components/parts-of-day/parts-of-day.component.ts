import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Output()
  partsOfDayHoursChange = new EventEmitter<hourType[][]>();
  @Input()
  partsOfDayHours: hourType[][] = _initialPartsOfDayHours;
  private _partsOfDayNames: string[] = [
    'Late Night',
    'Pre-Dawn/Dawn',
    'Early Morning',
    'Mid-Morning',
    'Noon/Midday',
    'Afternoon',
    'Mid-Afternoon',
    'Evening',
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
      isBeforeFood,
      increment
    );
    this.applyHourModificationWithoutChangingMemoryId(
      partOfDayIndex,
      hourIndex,
      newHourObject
    );
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
      isBeforeFood,
      increment
    );
    this.applyHourModification(partOfDayIndex, hourIndex, newHourObject);
  }

  applyHourModification(
    partOfDayIndex: number,
    hourIndex: number,
    newValue: hourType
  ) {
    let oldPartOfDayArray = this.partsOfDayHours[partOfDayIndex];
    oldPartOfDayArray[hourIndex] = newValue;
    this.partsOfDayHoursChange.emit(this.partsOfDayHours);
  }

  getUpdatedHourValue(
    HourObject: hourType,
    isBeforeFood: boolean,
    increment: number,
    newHourValue?: number
  ): hourType {
    let newHourObject = { ...HourObject };
    let oldValue = 0;

    const keyName: string = isBeforeFood
      ? 'beforeFoodDispenseQuantity'
      : 'afterFoodDispenseQuantity';

    if (newHourObject[keyName as keyof hourType] != undefined) {
      try {
        oldValue = parseInt(newHourObject[keyName as keyof hourType] || '');
        if (Number.isNaN(oldValue)) oldValue = 0;
      } catch (error) {
        oldValue = 0;
      }
    }
    let newHoursValue: number =
      newHourValue != undefined ? newHourValue : oldValue + increment;
    let finalValue: string = newHoursValue > 0 ? newHoursValue.toString() : '';
    newHourObject[keyName as keyof hourType] = finalValue;
    return newHourObject;
  }

  applyHourModificationWithoutChangingMemoryId(
    partOfDayIndex: number,
    hourIndex: number,
    newValue: hourType
  ) {
    let oldPartOfDayArray = this.partsOfDayHours[partOfDayIndex];
    let oldHourObject = oldPartOfDayArray[hourIndex];

    /* this method is just to apply the values from an object to another object without changing the memory id of the 
    destination object, instead of resObj=SrcObj, we will assign their values one by one */
    /* this is due to a bug when assigning them directly after a click on the input, the cursor will disappear */
    Object.keys(newValue).forEach((key: string) => {
      let _key = key as keyof hourType;
      oldHourObject[_key] = newValue[_key] || '';
    });

    this.partsOfDayHoursChange.emit(this.partsOfDayHours);
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

  onInputChange(event: any) {
    let inputValue = event.target.value;
    inputValue = inputValue.replace(/\D/g, '');
    event.target.value = inputValue;
  }

  onInputFinalChange(
    $event: any,
    partOfDayIndex: number,
    hourIndex: number,
    HourObject: hourType,
    isBeforeFood: boolean = true
  ) {
    const newHourValue: string = $event.target.value;
    const parsedHourValue: number =
      newHourValue != '' ? parseInt(newHourValue) : 0;
    let newValue: hourType = this.getUpdatedHourValue(
      HourObject,
      isBeforeFood,
      0,
      parsedHourValue
    );
    this.applyHourModificationWithoutChangingMemoryId(
      partOfDayIndex,
      hourIndex,
      newValue
    );
  }
}
export type hourType = {
  hour: string;
  beforeFoodDispenseQuantity?: string;
  afterFoodDispenseQuantity?: string;
};

const _initialPartsOfDayHours: hourType[][] = [
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
