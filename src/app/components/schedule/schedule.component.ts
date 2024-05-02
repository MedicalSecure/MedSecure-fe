import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { DatepickerRangePopupComponent } from '../datepicker-range-popup/datepicker-range-popup.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-schedule',
  standalone: true,
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css',
  imports: [
    CommonModule,
    MatDividerModule,
    DatepickerRangePopupComponent,
    FormsModule,
  ],
})
export class ScheduleComponent implements OnInit {
  @Output()
  partsOfDayHoursChange = new EventEmitter<Dispense[]>();
  @Output()
  filteredPartsOfDayHoursChange = new EventEmitter<Dispense[]>();
  @Input()
  partsOfDayHours: Dispense[] = _initialPartsOfDayHours;
  @Input() canValid: boolean = true; //role : nurse ==true
  @Input() canPostValid: boolean = false; //role : doctor==true
  @Input() canUncheckBoxAfterChecking: boolean = false;
  @Input() isDispenseQuantityReadOnly: boolean = true;
  @Input() showEmptyCases: boolean = false;

  persistCache: boolean = true;
  private _partsOfDayHoursMapped: Dispense[][];

  get hourClasses() {
    return _hourClassesMap;
  }
  get partsOfDayNames() {
    return _partsOfDayNamesMap;
  }

  get partsOfDayHoursMapped(): Dispense[][] {
    //this line is for using the cached variable for performance issues
    if (this._partsOfDayHoursMapped != undefined && this.persistCache)
      return this._partsOfDayHoursMapped;
    this.persistCache = true;
    //update the cached variable
    const result: Dispense[][] = [];
    for (const timezone of hoursCategorized) {
      const timezoneHours: Dispense[] = [];
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
      this.persistCache = false;
      //Do the changes that the getter is waiting for
      this._fillInitialData(this.partsOfDayHours);
    }
  }

  onClick(increment: number, HourObject: Dispense, isBeforeFood: boolean) {
    if (this.isDispenseQuantityReadOnly) return;
    this.updateHourValue(HourObject, isBeforeFood, increment);
    this._emitChanges();
  }

  onScroll(
    event: WheelEvent,
    HourObject: Dispense,
    isBeforeFood: boolean = false
  ) {
    if (this.isDispenseQuantityReadOnly) return;
    let increment = event.deltaY < 0 ? 1 : -1;
    this.updateHourValue(HourObject, isBeforeFood, increment);
    this._emitChanges();
  }

  updateHourValue(
    HourObject: Dispense,
    isBeforeFood: boolean,
    increment: number,
    newHourValue?: number
  ): Dispense {
    let newHourObject = { ...HourObject };
    let oldValue = 0;
    // this function is created to increment the values of the inputs, which are stored as strings
    // it checks if the string are undefined, parse them into Int, increment or decrement, then parse them into string again
    // if the values is 0 => parse it into EmptyString ""

    if (isBeforeFood) {
      if (newHourObject.beforeMeal?.Quantity != undefined) {
        try {
          oldValue = parseInt(newHourObject.beforeMeal?.Quantity || '');
          if (Number.isNaN(oldValue)) oldValue = 0;
        } catch (error) {
          oldValue = 0;
        }
      }
    } else {
      if (newHourObject.afterMeal?.Quantity != undefined) {
        try {
          oldValue = parseInt(newHourObject.afterMeal?.Quantity || '');
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
      if (newHourObject.beforeMeal == undefined) {
        newHourObject.beforeMeal = {
          Quantity: finalValue,
          isPostValid: false,
          isValid: false,
        };
      } else {
        newHourObject.beforeMeal.Quantity = finalValue;
      }
    }
    if (!isBeforeFood) {
      if (newHourObject.afterMeal == undefined) {
        newHourObject.afterMeal = {
          Quantity: finalValue,
          isPostValid: false,
          isValid: false,
        };
      } else {
        newHourObject.afterMeal.Quantity = finalValue;
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
   * @param {Dispense} HourObject - The object containing the hour data.
   * @param {boolean} [isBeforeFood=true] - Optional parameter indicating if it's before food.
   */
  onInputFinalChange(
    $event: any,
    partOfDayIndex: number,
    hourIndex: number,
    HourObject: Dispense,
    isBeforeFood: boolean = true
  ) {
    if (this.isDispenseQuantityReadOnly) return;

    const newHourValue: string = $event.target.value;
    const parsedHourValue: number =
      newHourValue != '' ? parseInt(newHourValue) : 0;
    let newValue: Dispense = this.updateHourValue(
      HourObject,
      isBeforeFood,
      0,
      parsedHourValue
    );
    this._emitChanges();
  }

  onIsValidCheckBoxClick(
    event: any,
    hourItem: Dispense,
    isBeforeFood: boolean
  ) {
    let newDispenseObject: Dose;
    let newValue: boolean = event.target.checked;
    if (isBeforeFood == true) newDispenseObject = hourItem.beforeMeal!;
    else newDispenseObject = hourItem.afterMeal!;
    newDispenseObject.isValid = newValue;
    this._emitChanges();
  }

  onIsPostValidCheckBoxClick(
    event: any,
    hourItem: Dispense,
    isBeforeFood: boolean
  ) {
    let newDispenseObject: Dose;
    let newValue: boolean = event.target.checked;
    if (isBeforeFood == true) newDispenseObject = hourItem.beforeMeal!;
    else newDispenseObject = hourItem.afterMeal!;
    newDispenseObject.isPostValid = newValue;
    this._emitChanges();
  }

  private _emitChanges() {
    // filter empty objects before emitting in some cases
    this.partsOfDayHoursChange.emit(this.partsOfDayHours);
    let filteredList = this.partsOfDayHours.filter((item) => {
      let isBeforeFoodEmpty =
        item.beforeMeal == undefined ||
        item.beforeMeal.Quantity == '' ||
        item.beforeMeal.Quantity == undefined;
      let isAfterFoodEmpty =
        item.afterMeal == undefined ||
        item.afterMeal.Quantity == '' ||
        item.afterMeal.Quantity == undefined;
      if (isBeforeFoodEmpty && isAfterFoodEmpty) return false;
      return true;
    });
    this.filteredPartsOfDayHoursChange.emit(filteredList);
  }

  //
  private _fillInitialData(initialData = this.partsOfDayHours) {
    if (this.showEmptyCases == false) return;
    this.partsOfDayHours = initialData.map((hourObj) => {
      if (hourObj.afterMeal == undefined)
        hourObj.afterMeal = {
          Quantity: '',
          isPostValid: false,
          isValid: false,
        };
      if (hourObj.beforeMeal == undefined)
        hourObj.beforeMeal = {
          Quantity: '',
          isPostValid: false,
          isValid: false,
        };
      return hourObj;
    });
  }
}

const _initialPartsOfDayHours: Dispense[] = [
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

export type Dispense = {
  hour: string;
  beforeMeal?: Dose;
  afterMeal?: Dose;
};

export type Dose = {
  Quantity?: string;
  isValid: boolean;
  isPostValid: boolean;
};
