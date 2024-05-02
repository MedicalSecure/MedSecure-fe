import { Component, EventEmitter, Input, OnInit, Output,OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { DatepickerRangePopupComponent } from '../datepicker-range-popup/datepicker-range-popup.component';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-parts-of-day',
  standalone: true,
  templateUrl: './parts-of-day.component.html',
  styleUrl: './parts-of-day.component.css',
  imports: [
    CommonModule,
    MatDividerModule,
    DatepickerRangePopupComponent,
    FormsModule,
  ],
})
export class PartsOfDayComponent implements OnInit {
  @Output()
  partsOfDayHoursChange = new EventEmitter<hourType[]>();
  @Output()
  filteredPartsOfDayHoursChange = new EventEmitter<hourType[]>();
  @Input()
  partsOfDayHours: hourType[] = _initialPartsOfDayHours;
  @Input() canValid: boolean = true; //role : nurse ==true
  @Input() canPostValid: boolean = true; //role : doctor==true
  @Input() canUncheckBoxAfterChecking: boolean = true;
  @Input() isDispenseQuantityReadOnly: boolean = false;
  @Input() showEmptyCases: boolean = true;

  persistCache:boolean=true;
  private _partsOfDayHoursMapped: hourType[][];

  get hourClasses() {
    return _hourClassesMap;
  }
  get partsOfDayNames() {
    return _partsOfDayNamesMap;
  }

  get partsOfDayHoursMapped(): hourType[][] {
    //this line is for using the cached variable for performance issues
    if(this._partsOfDayHoursMapped!=undefined && this.persistCache) return this._partsOfDayHoursMapped;
    this.persistCache=true;
    //update the cached variable 
    const result: hourType[][] = [];
    for (const timezone of hoursCategorized) {
      const timezoneHours: hourType[] = [];
      for (const hoursNumber of timezone) {
        for (const hourObj of this.partsOfDayHours) {
          if (hoursNumber === hourObj.hour) {
            timezoneHours.push(hourObj);
          }
        }
      }
      if (timezoneHours.length > 0) result.push(timezoneHours);
    }
    this._partsOfDayHoursMapped = result;
    return result;
  }

  constructor() {}

  ngOnInit(): void {
    this._fillInitialData();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Check if partsOfDayHours has changed
    if (changes['partsOfDayHours']) {
      //handle changes coming from the parent, like when switching between medications => force change the prefilled values inside the input

      //make the getter ( get partsOfDayHoursMapped ) on waiting state for the next input changes
      //so the next input change will force remap the objects in the getter
      this.persistCache=false;
      //Do the changes that the getter is waiting for
      this._fillInitialData(this.partsOfDayHours)
    }
  }

  onClick(
    increment: number,
    HourObject: hourType,
    isBeforeFood: boolean
  ) {
    if (this.isDispenseQuantityReadOnly) return;
    this.updateHourValue(
      HourObject,
      isBeforeFood,
      increment
    );
    this._emitChanges();
  }

  onScroll(
    event: WheelEvent,
    HourObject: hourType,
    isBeforeFood: boolean = false
  ) {
    if (this.isDispenseQuantityReadOnly) return;
    let increment = event.deltaY < 0 ? 1 : -1;
    this.updateHourValue(
      HourObject,
      isBeforeFood,
      increment
    );
    this._emitChanges();
  }


  updateHourValue(
    HourObject: hourType,
    isBeforeFood: boolean,
    increment: number,
    newHourValue?: number
  ): hourType {
    let newHourObject = { ...HourObject };
    let oldValue = 0;
    // this function is created to increment the values of the inputs, which are stored as strings
    // it checks if the string are undefined, parse them into Int, increment or decrement, then parse them into string again
    // if the values is 0 => parse it into EmptyString ""

    if (isBeforeFood) {
      if (newHourObject.beforeFood?.DispenseQuantity != undefined) {
        try {
          oldValue = parseInt(newHourObject.beforeFood?.DispenseQuantity || '');
          if (Number.isNaN(oldValue)) oldValue = 0;
        } catch (error) {
          oldValue = 0;
        }
      }
    } else {
      if (newHourObject.afterFood?.DispenseQuantity != undefined) {
        try {
          oldValue = parseInt(newHourObject.afterFood?.DispenseQuantity || '');
          if (Number.isNaN(oldValue)) oldValue = 0;
        } catch (error) {
          oldValue = 0;
        }
      }
    }
    let newHoursValue: number =
      newHourValue != undefined ? newHourValue : oldValue + increment;
    let finalValue: string = newHoursValue > 0 ? newHoursValue.toString() : '';
    if (isBeforeFood) {
      if (newHourObject.beforeFood == undefined) {
        newHourObject.beforeFood = {
          DispenseQuantity: finalValue,
          isPostValid: false,
          isValid: false,
        };
      } else {
        newHourObject.beforeFood.DispenseQuantity = finalValue;
      }
    }
    if (!isBeforeFood) {
      if (newHourObject.afterFood == undefined) {
        newHourObject.afterFood = {
          DispenseQuantity: finalValue,
          isPostValid: false,
          isValid: false,
        };
      } else {
        newHourObject.afterFood.DispenseQuantity = finalValue;
      }
    }

    return newHourObject;
  }


  //this function will be called when you are typing in the input field
  //it will print only numbers and filter other chars
  onInputChange(event: any) {
    if (this.isDispenseQuantityReadOnly) {
      event.target.value = '';
      return;
    }

    let inputValue = event.target.value;
    inputValue = inputValue.replace(/\D/g, '');
    event.target.value = inputValue;
  }

  /**
   * Updates the hour value when the input is finalized (e.g., click outside the input or unfocus).
   * This function is designed for performance, as it updates the value in the object only once.(not like onInputChange )
   * @param {any} $event - The event object triggered by the input change.
   * @param {number} partOfDayIndex - The index representing the part of the day.
   * @param {number} hourIndex - The index representing the hour.
   * @param {hourType} HourObject - The object containing the hour data.
   * @param {boolean} [isBeforeFood=true] - Optional parameter indicating if it's before food.
   */
  onInputFinalChange(
    $event: any,
    partOfDayIndex: number,
    hourIndex: number,
    HourObject: hourType,
    isBeforeFood: boolean = true
  ) {
    if (this.isDispenseQuantityReadOnly) return;

    const newHourValue: string = $event.target.value;
    const parsedHourValue: number =
      newHourValue != '' ? parseInt(newHourValue) : 0;
    let newValue: hourType = this.updateHourValue(
      HourObject,
      isBeforeFood,
      0,
      parsedHourValue
    );
    this._emitChanges();
  }

  onIsValidCheckBoxClick(
    event: any,
    hourItem: hourType,
    isBeforeFood: boolean
  ) {
    let newDispenseObject: dispense;
    let newValue: boolean = event.target.checked;
    if (isBeforeFood == true) newDispenseObject = hourItem.beforeFood!;
    else newDispenseObject = hourItem.afterFood!;
    newDispenseObject.isValid = newValue;
    this._emitChanges();
  }

  onIsPostValidCheckBoxClick(
    event: any,
    hourItem: hourType,
    isBeforeFood: boolean
  ) {
    let newDispenseObject: dispense;
    let newValue: boolean = event.target.checked;
    if (isBeforeFood == true) newDispenseObject = hourItem.beforeFood!;
    else newDispenseObject = hourItem.afterFood!;
    newDispenseObject.isPostValid = newValue;
    this._emitChanges();
  }

  private _emitChanges() {
    // filter empty objects before emitting in some cases
    this.partsOfDayHoursChange.emit(this.partsOfDayHours);
    let filteredList = this.partsOfDayHours.filter((item) => {
      let isBeforeFoodEmpty =
        item.beforeFood == undefined ||
        item.beforeFood.DispenseQuantity == '' ||
        item.beforeFood.DispenseQuantity == undefined;
      let isAfterFoodEmpty =
        item.afterFood == undefined ||
        item.afterFood.DispenseQuantity == '' ||
        item.afterFood.DispenseQuantity == undefined;
      if (isBeforeFoodEmpty && isAfterFoodEmpty) return false;
      return true;
    });
    this.filteredPartsOfDayHoursChange.emit(filteredList);
  }

  //
  private _fillInitialData(initialData = this.partsOfDayHours) {
    if (this.showEmptyCases == false) return;
    this.partsOfDayHours = initialData.map((hourObj) => {
      if (hourObj.afterFood == undefined)
        hourObj.afterFood = {
          DispenseQuantity: '',
          isPostValid: false,
          isValid: false,
        };
      if (hourObj.beforeFood == undefined)
        hourObj.beforeFood = {
          DispenseQuantity: '',
          isPostValid: false,
          isValid: false,
        };
      return hourObj;
    });
  }
}

const _initialPartsOfDayHours: hourType[] = [
  { hour: '00' },
  { hour: '01' },
  { hour: '02' },
  { hour: '03' },
  { hour: '04' },
  { hour: '05' },
  { hour: '06' },
  { hour: '07' },
  { hour: '08' },
  { hour: '09' },
  { hour: '10' },
  { hour: '11' },
  { hour: '12' },
  { hour: '13' },
  { hour: '14' },
  { hour: '15' },
  { hour: '16' },
  { hour: '17' },
  { hour: '18' },
  { hour: '19' },
  { hour: '20' },
  { hour: '21' },
  { hour: '22' },
  { hour: '23' },
];

const _partsOfDayNamesMap: { [hour: string]: string } = {
  '00': 'Late Night',
  '01': 'Late Night',
  '02': 'Late Night',
  '03': 'Pre-Dawn/Dawn',
  '04': 'Pre-Dawn/Dawn',
  '05': 'Pre-Dawn/Dawn',
  '06': 'Early Morning',
  '07': 'Early Morning',
  '08': 'Early Morning',
  '09': 'Mid-Morning',
  '10': 'Mid-Morning',
  '11': 'Mid-Morning',
  '12': 'Noon/Midday',
  '13': 'Afternoon',
  '14': 'Afternoon',
  '15': 'Afternoon',
  '16': 'Mid-Afternoon',
  '17': 'Mid-Afternoon',
  '18': 'Evening',
  '19': 'Evening',
  '20': 'Evening',
  '21': 'Evening',
  '22': 'Dusk',
  '23': 'Dusk',
};

const _hourClassesMap: { [hour: string]: string } = {
  '00': 'bg-dark',
  '01': 'bg-dark',
  '02': 'bg-dark',
  '03': 'bg-info',
  '04': 'bg-info',
  '05': 'bg-info',
  '06': 'bg-info',
  '07': 'bg-info',
  '08': 'bg-info',
  '09': 'bg-success',
  '10': 'bg-success',
  '11': 'bg-success',
  '12': 'bg-warning',
  '13': 'bg-primary',
  '14': 'bg-primary',
  '15': 'bg-primary',
  '16': 'bg-danger',
  '17': 'bg-danger',
  '18': 'bg-warning',
  '19': 'bg-warning',
  '20': 'bg-warning',
  '21': 'bg-warning',
  '22': 'bg-danger',
  '23': 'bg-danger',
};

const hoursCategorized = [
  ['00', '01', '02'], // Late Night
  ['03', '04', '05'], // Pre-Dawn/Dawn
  ['06', '07', '08'], // Early Morning
  ['09', '10', '11'], // Mid-Morning
  ['12'], // Noon/Midday
  ['13', '14', '15'], // Afternoon
  ['16', '17'], // Mid-Afternoon
  ['18', '19', '20', '21'], // Evening
  ['22', '23'], // Dusk
];

export type hourType = {
  hour: string;
  beforeFood?: dispense;
  afterFood?: dispense;
};

export type dispense = {
  DispenseQuantity?: string;
  isValid: boolean;
  isPostValid: boolean;
};
