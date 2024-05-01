import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  partsOfDayHoursChange = new EventEmitter<hourType[][]>();
  @Output()
  filteredPartsOfDayHoursChange = new EventEmitter<hourType[][]>();
  @Input()
  partsOfDayHours: hourType[][] = _initialPartsOfDayHours;
  @Input() canValid: boolean = false; //role : nurse ==true
  @Input() canPostValid: boolean = false; //role : doctor==true
  @Input() canUncheckBoxAfterChecking: boolean = true;
  @Input() isReadOnly: boolean = false;
  @Input() showAllCases: boolean = true;

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

  constructor() {}

  ngOnInit(): void {
    this._fillInitialData();
  }

  onClick(
    partOfDayIndex: number,
    hourIndex: number,
    increment: number,
    HourObject: hourType,
    isBeforeFood: boolean
  ) {
    if (this.isReadOnly) return;
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
    if (this.isReadOnly) return;
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
    if (this.isReadOnly) return;
    let oldPartOfDayArray = this.partsOfDayHours[partOfDayIndex];
    oldPartOfDayArray[hourIndex] = newValue;
    this._emitChanges()
  }

  getUpdatedHourValue(
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

  applyHourModificationWithoutChangingMemoryId(
    partOfDayIndex: number,
    hourIndex: number,
    newValue: hourType
  ) {
    if (this.isReadOnly) return;

    let oldPartOfDayArray = this.partsOfDayHours[partOfDayIndex];
    let oldHourObject = oldPartOfDayArray[hourIndex];
    /* this method is just to apply the values from an object to another object without changing the memory id of the 
    destination object, instead of resObj=SrcObj, we will assign their values one by one */
    /* this is due to a bug when assigning them directly after a click on the input, the cursor will disappear */
    oldHourObject.afterFood = newValue.afterFood;
    oldHourObject.beforeFood = newValue.beforeFood;
    oldHourObject.hour = newValue.hour;
    this._emitChanges()
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

  //this function will be called when you are typing in the input field
  //it will print only numbers and filter other chars
  onInputChange(event: any) {
    if (this.isReadOnly) {
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
    if (this.isReadOnly) return;

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
    this._emitChanges()
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
    this._emitChanges()
  }
  

  private _emitChanges(){
    // filter empty objects before emitting in some cases
    this.partsOfDayHoursChange.emit(this.partsOfDayHours);
    let filteredList=this.partsOfDayHours.map(listObj=>{
      let newObjList=listObj.filter(item=>{
        let isBeforeFoodEmpty = item.beforeFood == undefined || item.beforeFood.DispenseQuantity == "" || item.beforeFood.DispenseQuantity == undefined ;
        let isAfterFoodEmpty = item.afterFood == undefined || item.afterFood.DispenseQuantity == "" || item.afterFood.DispenseQuantity == undefined ;
        if(isBeforeFoodEmpty && isAfterFoodEmpty) return false;
        return true;
      })
      return newObjList;
    })
    const finalFilteredList=filteredList.filter(item=> item.length>0) ;
    console.log(finalFilteredList)
    debugger;
    this.filteredPartsOfDayHoursChange.emit(finalFilteredList);
  }
  /* private _emitChanges(){
    // filter empty objects before emitting in some cases
    let c1= this.canValid==true || this.canPostValid==true ;
    let c2=this.showAllCases==false || this.isReadOnly == true;
    if(c1 || c2) {
      this.partsOfDayHoursChange.emit(this.partsOfDayHours);
      return;
    };
    let filteredList=this.partsOfDayHours.map(listObj=>{
      let newObjList=listObj.filter(item=>{
        let isBeforeFoodEmpty = item.beforeFood == undefined || item.beforeFood.DispenseQuantity == "" || item.beforeFood.DispenseQuantity == undefined ;
        let isAfterFoodEmpty = item.afterFood == undefined || item.afterFood.DispenseQuantity == "" || item.afterFood.DispenseQuantity == undefined ;
        if(isBeforeFoodEmpty && isAfterFoodEmpty) return false;
        return true;
      })
      return newObjList;
    })
    const finalFilteredList=filteredList.filter(item=> item.length>0) ;
    console.log(finalFilteredList)
    debugger;
    this.partsOfDayHoursChange.emit(finalFilteredList);
  } */

  //
  private _fillInitialData(initialData = this.partsOfDayHours) {
    if (this.showAllCases == false) return;
    this.partsOfDayHours = initialData.map((hourObjList) => {
      hourObjList = hourObjList.map((hourObj) => {
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
      return hourObjList;
    });
  }
}

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
