import { COMMA, ENTER, V } from '@angular/cdk/keycodes';
import {
  AfterContentInit,
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
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatTooltipModule } from '@angular/material/tooltip';
import { URL_REGEX } from '../../shared/const';

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
export class ShipsSelectComponent<T> {
  @Input() ObjectName!: string;
  @Input() customLabel!: string;
  @Input() searchPropertyName: keyof T;

  @Input() tooltipPropertyName: keyof T; // optional : add the property name to display tooltip text

  @Input() imagePropertyName: keyof T; // optional : add the property name of the image
  @Input() minimumSearchLength: number = 2;
  @Input() minimumAddedLabelLength: number = 5;
  @Input() class: string = '';
  @Input() enableCustomAdditions: boolean = true;
  @Input() enableQuickSelectFromSuggestions: boolean = true;
  @Input() isStartWithSearch: boolean = false;
  @Input() fullData: T[] = [];
  @Input() disabled: boolean = false;
  @Input() selectedChips: T[] = [];

  keepFilterAfterSelection = false;
  updatedSuggestionList: T[] = [];

  @Output() selectedChipsChange = new EventEmitter<
    onChipsSelectionEmitType<T>
  >();

  /* assure that the input propertyName refers to string prop?
    type StringKeys<T> = {
    [K in keyof T]: T[K] extends string ? K : never;
  }[keyof T];
  interface MyComponent<T extends object> {
    @Input() tooltipPropertyName: StringKeys<T>;
  }
  */

  separatorKeysCodes: number[] = [ENTER, COMMA];
  // we gonna cache the input value minimumSearchLength so we can work with the minSearchLength instead, so we can set it sometimes to ZERO (incase of forceSuggest)
  //and be able to reset it to minimumSearchLength(from the parent / default settings)
  minSearchLength: number = 2;
  ObjectControl = new FormControl<string | any>('');
  filteredDataByInput: Observable<T[]>;
  filteredDataSubscription!: Subscription;
  private _isAdditionEnabled: boolean = false;

  @ViewChild('ValueInput') ValueInput!: ElementRef<HTMLInputElement>;
  announcer = inject(LiveAnnouncer);

  @ViewChild('autoInput', { read: MatAutocompleteTrigger })
  autoCompleteTrigger: MatAutocompleteTrigger;

  handleForcedSuggestions(
    handleForcedSuggestions: handleForcedSuggestionsAction<T>
  ) {
    //handleForcedSuggestions(newFilteredData:T[],keepFilterAfterSelection=false,handleForcedSuggestionsParams) {
    let keepFilterAfterSelection =
      handleForcedSuggestions?.keepFilterAfterSelection ?? false;
    let newFilteredData = handleForcedSuggestions.newFilteredData;
    let forceReset = handleForcedSuggestions?.forceReset ?? false;

    this.keepFilterAfterSelection = keepFilterAfterSelection;

    //newFilteredData in case of force reset, it must be the full original data ( handled by the parent )
    if (forceReset) {
      this.minSearchLength = this.minimumSearchLength;
      this.fullData = newFilteredData;
      return;
    }

    // else :
    //newFilteredData is gonna be the given data filtered by body Part

    //updatedSuggestionList is the new filtered data but also filtered by input and already selected ones
    //its just temporary list viewed once!! then it will be filtered from the fullData list
    //this helps for example when you tape in the input two letters XY then click on the LEG in the body
    //it will suggest the selected leg symptoms but also filter by XY search ! and even don't suggest the already selected ones!
    const inputValue = this.ObjectControl.value ? this.ObjectControl.value : '';
    let filteredBySearch = this._filter(inputValue, newFilteredData);
    this.updatedSuggestionList = filteredBySearch.filter(
      (item) => !this.selectedChips.includes(item)
    );

    // params for the suggestion panel to open!
    if (this.autoCompleteTrigger && this.fullData.length > 0) {
      this.minSearchLength = 0;
      this.ValueInput.nativeElement.focus();
      this.autoCompleteTrigger.openPanel();
    }

    // if the keep filter option is true, the searchable data will be the newFilteredData for the next searches.
    if (keepFilterAfterSelection) {
      this.fullData = newFilteredData;
    }
  }

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
          (item) => !this.selectedChips.includes(item)
        );
      }
    );
    this._verifySearchPropertyName();
    this._verifyImagePropertyName();

    //set the original input value (this is needed when the forceOpenAutocompletePanel is called from the parent)
    if (!this.keepFilterAfterSelection)
      this.minSearchLength = this.minimumSearchLength;
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
      SelectedObjectList: this.selectedChips,
      lastAddedItem,
      lastSelectedItem,
      lastRemovedItem,
    } as onChipsSelectionEmitType<T>);

    //restore the original input value (this is needed when the forceOpenAutocompletePanel is called from the parent)
    if (!this.keepFilterAfterSelection)
      this.minSearchLength = this.minimumSearchLength;
  }

  add(event: MatChipInputEvent): void {
    //restore the original input value (this is needed when the forceOpenAutocompletePanel is called from the parent)
    if (!this.keepFilterAfterSelection)
      this.minSearchLength = this.minimumSearchLength;

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
    this.selectedChips.forEach((selectedObject) => {
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
    //restore the original input value (this is needed when the forceOpenAutocompletePanel is called from the parent)
    if (!this.keepFilterAfterSelection)
      this.minSearchLength = this.minimumSearchLength;

    this.selectedChips = this.selectedChips.filter(
      (chipObject: any) => chipObject != objectToRemove
    );
    this.onSelectionChange(undefined, undefined, objectToRemove);
    this.announcer.announce(
      `Removed ${objectToRemove[this.searchPropertyName]}`
    );
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.selectedChips.includes(event.option.value)) {
      this._addChipToSelection(event.option.value);
      this.ValueInput.nativeElement.value = '';
    }
  }

  setIsAdditionEnabled(isAdditionEnabled: boolean) {
    this._isAdditionEnabled = isAdditionEnabled;
  }

  isViewImage(chipObject: any): boolean {
    if (this.imagePropertyName === '') return false;
    if (this.imagePropertyName === undefined) return false;
    if (this.imagePropertyName === null) return false;
    let imageUrl = '';
    try {
      imageUrl = chipObject[this.imagePropertyName];
    } catch (error) {
      imageUrl = '';
    }
    if (imageUrl == '' || typeof imageUrl != 'string') return false;
    const isValidUrl = URL_REGEX.test(imageUrl);
    return isValidUrl;
  }

  private _addChipToSelection(newChip: any, isAdded = false): void {
    this.selectedChips.push(newChip);
    this.ObjectControl.setValue(null);
    let lastAddedItem, lastSelectedItem;
    if (isAdded) lastAddedItem = newChip;
    else lastSelectedItem = newChip;
    this.onSelectionChange(lastAddedItem, lastSelectedItem, undefined);
  }

  private _filter(
    value: string | any,
    arrayToFilter: T[] = this.fullData
  ): T[] {
    let filterValueLower = this._getStringToCompareTo(value);
    return arrayToFilter.filter((object) => {
      let stringCasted = this._getStringToCompareTo(object);
      const isResultFound = this.isStartWithSearch
        ? stringCasted.startsWith(filterValueLower)
        : stringCasted.includes(filterValueLower);
      return isResultFound;
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
    const firstDataItem = this.fullData[0] as Record<string, any>;
    if (!firstDataItem.hasOwnProperty(this.searchPropertyName)) {
      this.disabled = true;
      throw new TypeError(
        'Chip select component : ' +
          " the provided data doesn't contain the searchPropertyName : " +
          this.searchPropertyName.toString() +
          ' || Component Label : ' +
          this.customLabel
      );
    }
    let searchablePropertyType =
      typeof this.fullData[0][this.searchPropertyName as keyof T];
    if (['number', 'string'].includes(searchablePropertyType) == false) {
      this.disabled = true;
      throw new TypeError(
        'Chip select component : ' +
          'the provided searchPropertyName ( ' +
          this.searchPropertyName.toString() +
          " ) isn't of type String Or Number" +
          ' || Component Label : ' +
          this.customLabel
      );
    }
  }
  private _verifyImagePropertyName(): void {
    if (!this.fullData || this.fullData.length == 0) return;
    if (this.imagePropertyName === '' || this.imagePropertyName === undefined)
      return;
    const firstDataItem = this.fullData[0] as Record<string, any>;

    /* if (!firstDataItem.hasOwnProperty(this.imagePropertyName)) {
      throw new TypeError(
        'Chip select component : ' +
          " the provided data doesn't contain the image property name : " +
          this.imagePropertyName +
          ' || Component Label : ' +
          this.customLabel
      );
    }
    let imagePropertyType = typeof firstDataItem[this.imagePropertyName];
    if (imagePropertyType != 'string') {
      throw new TypeError(
        'Chip select component : ' +
          'the provided ImagePropertyName ( ' +
          this.imagePropertyName +
          " ) isn't of type String (must be a url)" +
          ' || Component Label : ' +
          this.customLabel
      );
    }
    let imageUrl = firstDataItem[this.imagePropertyName];
    const isValidUrl = URL_REGEX.test(imageUrl);
    if (!isValidUrl) {
      throw new TypeError(
        'Chip select component : ' +
          'the provided ImagePropertyName ( ' +
          this.imagePropertyName +
          " ) isn't a valid url" +
          ' || Component Label : ' +
          this.customLabel
      );
    } */
  }
}

export type onChipsSelectionEmitType<T> = {
  SelectedObjectList: T[];
  lastAddedItem?: T;
  lastSelectedItem?: T;
  lastRemovedItem?: T;
};

export type handleForcedSuggestionsAction<T> = {
  newFilteredData: T[];
  keepFilterAfterSelection?: boolean;
  forceReset?: boolean;
};

/* 
// usage: parent component : 

 dummyData: T[] = [
    { index: 1, label: 'test', value: 5555, x: [] },
    { index: 9, label: 'test2', value: 54545 },
    { index: 3, label: 'eeee', value: 555 },
    { index: 4, label: 'eeee22', value: 55 },
    { index: 4, label: 'eeeegegege22', value: 55 },
  ];
  selectedChipsChange(result: onChipsSelectionEmitType<T>) {
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
      [imagePropertyName]="''"
    ></chips-select>
*/
