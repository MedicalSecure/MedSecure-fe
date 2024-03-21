import { COMMA, ENTER, V } from '@angular/cdk/keycodes';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteModule,
} from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatTooltipModule } from '@angular/material/tooltip';
/**
 * @title Chips Autocomplete
 */
@Component({
  selector: 'chips-select',
  templateUrl: 'chips-select.component.html',
  styleUrls: ['chips-select.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatTooltipModule,
  ],
})
export class ShipsSelectComponent {
  @Input() ObjectName!: string;
  @Input() customLabel!: string;
  @Input() searchPropertyName: string = 'label';
  @Input() minimumSearchLength: number = 2;
  @Input() minimumAddedLabelLength: number = 5;
  @Input() class: string = '';
  @Input() enableCustomAdditions: boolean = true;
  @Input() enableQuickSelectFromSuggestions: boolean = true;
  @Input() isStartWithSearch: boolean = false;
  @Input() fullData: any[] = [{ index: 1, label: 'test', value: '5555' }];

  separatorKeysCodes: number[] = [ENTER, COMMA];
  ObjectControl = new FormControl<string | any>('');
  filteredDataByInput: Observable<any[]>;
  filteredDataSubscription!: Subscription;
  updatedSuggestionList: any[] = [];
  selectedObjects: any[] = [];
  private _isAdditionEnabled: boolean = false;

  @ViewChild('ValueInput') ValueInput!: ElementRef<HTMLInputElement>;
  announcer = inject(LiveAnnouncer);

  @Output() selectedChipsChange = new EventEmitter<onChipsSelectionEmitType>();

  constructor() {
    this.filteredDataByInput = this.ObjectControl.valueChanges.pipe(
      startWith(null),
      map((object: string | any | null) =>
        object ? this._filter(object) : this.fullData.slice()
      )
    );
  }

  ngOnInit() {
    this.filteredDataSubscription = this.filteredDataByInput.subscribe(
      (data) => {
        this.updatedSuggestionList = data.filter(
          (item) => !this.selectedObjects.includes(item)
        );
      }
    );
    this._verifySearchPropertyName();
  }

  ngOnDestroy() {
    this.filteredDataSubscription.unsubscribe(); // Prevent memory leaks
  }

  onSelectionChange(
    lastAddedItem: object | undefined,
    lastSelectedItem: object | undefined,
    lastRemovedItem: object | undefined
  ) {
    // Emit the updated array to the parent component
    this.selectedChipsChange.emit({
      SelectedObjectList: this.selectedObjects,
      lastAddedItem,
      lastSelectedItem,
      lastRemovedItem,
    } as onChipsSelectionEmitType);
  }

  add(event: MatChipInputEvent): void {
    if (this._isAdditionEnabled === false) return;
    const value = (event.value || '').trim();
    if (value.length < this.minimumSearchLength) {
      /*  TODO : display input error message [ 'customLabel' length must be at least 'this.minimumSearchLength' ] */
      console.error(
        this.customLabel +
          ' length must be at least ' +
          this.minimumSearchLength +
          ' to start searching '
      );
      return;
    }
    if (
      this.enableQuickSelectFromSuggestions == true &&
      this.updatedSuggestionList.length > 0
    ) {
      // add the first suggestion
      this._addChipToSelection(this.updatedSuggestionList[0]);
      event.chipInput!.clear();
      return;
    }
    if (this.enableCustomAdditions === false) return;
    // Add custom value
    if (value.length < this.minimumAddedLabelLength) {
      /*  TODO : display input error message [ 'customLabel' length must be at least 'this.minimumAddedLabelLength' ] */
      console.error(
        this.customLabel +
          ' length must be at least ' +
          this.minimumAddedLabelLength
      );
      return;
    }
    // Proceed to Add custom value
    let isAlreadyRegistered = false;
    this.selectedObjects.forEach((selectedObject) => {
      if (value.toLowerCase() == this._getStringToCompareTo(selectedObject)) {
        isAlreadyRegistered = true;
        /*  TODO : display input error message [ 'customLabel' length must be at least 'this.minimumSearchLength' ] */
        console.error(
          this.customLabel +
            ' chips: cant add "' +
            value +
            '" : Value already exists  '
        );
        return;
      }
    });
    const lengthCondition = value.length >= this.minimumAddedLabelLength;
    if (!isAlreadyRegistered && lengthCondition) {
      this._addChipToSelection({ [this.searchPropertyName]: value }, true);
      event.chipInput!.clear();
    }
  }

  remove(objectToRemove: any): void {
    this.selectedObjects = this.selectedObjects.filter(
      (chipObject: any) => chipObject != objectToRemove
    );
    this.onSelectionChange(undefined, undefined, objectToRemove);
    this.announcer.announce(
      `Removed ${objectToRemove[this.searchPropertyName]}`
    );
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.selectedObjects.includes(event.option.value)) {
      this._addChipToSelection(event.option.value);
      this.ValueInput.nativeElement.value = '';
    }
  }

  setIsAdditionEnabled(isAdditionEnabled: boolean) {
    this._isAdditionEnabled = isAdditionEnabled;
  }

  private _addChipToSelection(newChip: any, isAdded = false): void {
    this.selectedObjects.push(newChip);
    this.ObjectControl.setValue(null);
    let lastAddedItem, lastSelectedItem;
    if (isAdded) lastAddedItem = newChip;
    else lastSelectedItem = newChip;
    this.onSelectionChange(lastAddedItem, lastSelectedItem, undefined);
  }

  private _filter(value: string | any): any[] {
    let filterValueLower = this._getStringToCompareTo(value);
    return this.fullData.filter((object) => {
      let stringCasted = this._getStringToCompareTo(object);
      const isResultFound = this.isStartWithSearch
        ? stringCasted.startsWith(filterValueLower)
        : stringCasted.includes(filterValueLower);
      return isResultFound;
      /* const isObjectAlreadySelected = this.selectedObjects.includes(object);
      return isResultFound && !isObjectAlreadySelected; */
    });
  }

  private _getStringToCompareTo(object: any): string {
    let extractedString = '';
    if (typeof object === 'string') extractedString = object;
    else if (typeof object[this.searchPropertyName] === 'string') {
      extractedString = object[this.searchPropertyName];
    } else {
      extractedString = object[this.searchPropertyName].toString();
    }
    return extractedString.toLocaleLowerCase();
  }

  private _verifySearchPropertyName(): void {
    if (!this.fullData || this.fullData.length == 0) return;
    if (!this.fullData[0].hasOwnProperty(this.searchPropertyName)) {
      throw new TypeError(
        'Chip select component : ' +
          " the provided data doesn't contain the searchPropertyName : " +
          this.searchPropertyName +
          ' || Component Label : ' +
          this.customLabel
      );
    }
    let searchablePropertyType =
      typeof this.fullData[0][this.searchPropertyName];
    if (['number', 'string'].includes(searchablePropertyType) == false) {
      throw new TypeError(
        'Chip select component : ' +
          'the provided searchPropertyName ( ' +
          this.searchPropertyName +
          " ) isn't of type String Or Number" +
          ' || Component Label : ' +
          this.customLabel
      );
    }
  }
}

export type onChipsSelectionEmitType = {
  SelectedObjectList: any[];
  lastAddedItem?: any;
  lastSelectedItem?: any;
  lastRemovedItem?: any;
};

/* 
// usage: parent component : 

 dummyData: any[] = [
    { index: 1, label: 'test', value: 5555, x: [] },
    { index: 9, label: 'test2', value: 54545 },
    { index: 3, label: 'eeee', value: 555 },
    { index: 4, label: 'eeee22', value: 55 },
    { index: 4, label: 'eeeegegege22', value: 55 },
  ];
  selectedChipsChange(result: onChipsSelectionEmitType) {
    // Access and use the selected indexes here
    if (result.lastAddedItem) {
      console.log('added custom item :', result.lastAddedItem);
    } else if (result.lastSelectedItem) {
      console.log('added item from search :', result.lastSelectedItem);
    } else if (result.lastRemovedItem) {
      console.log('removed item :', result.lastRemovedItem);
    }
    console.log('updated Selected chips:', result.SelectedObjectList);
  }

//  usage: parent Template : 

<chips-select
      [ObjectName]="'Symptom'"
      [customLabel]="'Symptoms'"
      class="w-100"
      (selectedChipsChange)="selectedChipsChange($event)"
      [enableCustomAdditions]="true"
      [enableQuickSelectFromSuggestions]="true"
      [fullData]="dummyData"
      [minimumSearchLength]="2"
      [minimumAddedLabelLength]="5"
      [isStartWithSearch]="true"
      [searchPropertyName]="'label'"
    ></chips-select>
*/
