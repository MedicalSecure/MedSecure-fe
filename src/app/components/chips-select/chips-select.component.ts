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
  @Input() minimumSearchLength: number = 2;
  @Input() minimumAddedLabelLength: number = 5;
  @Input() class: string = '';
  @Input() enableCustomAdditions: boolean = true;
  @Input() enableQuickSelectFromSuggestions: boolean = true;
  @Input() isStartWithSearch: boolean = false;
  @Input() fullData: chipType[] = [{ index: 1, label: 'test', value: '5555' }];

  separatorKeysCodes: number[] = [ENTER, COMMA];
  ObjectControl = new FormControl<string | chipType>('');
  filteredDataByInput: Observable<chipType[]>;
  filteredDataSubscription!: Subscription;
  updatedSuggestionList: chipType[] = [];
  selectedObjects: chipType[] = [];

  @ViewChild('ValueInput') ValueInput!: ElementRef<HTMLInputElement>;
  announcer = inject(LiveAnnouncer);

  @Output() selectedChipsChange = new EventEmitter<chipType[]>();

  constructor() {
    this.filteredDataByInput = this.ObjectControl.valueChanges.pipe(
      startWith(null),
      map((object: string | chipType | null) =>
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
  }

  ngOnDestroy() {
    this.filteredDataSubscription.unsubscribe(); // Prevent memory leaks
  }

  onSelectionChange() {
    // Emit the updated array to the parent component
    this.selectedChipsChange.emit(this.selectedObjects);
  }

  add(event: MatChipInputEvent): void {
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
      if (value.toLowerCase() == selectedObject.label.toLocaleLowerCase()) {
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
      this._addChipToSelection({ index: -1, label: value, value: undefined });
      event.chipInput!.clear();
    }
  }

  remove(objectToRemove: chipType): void {
    this.selectedObjects = this.selectedObjects.filter(
      (chipObject: chipType) => chipObject != objectToRemove
    );
    this.onSelectionChange();
    this.announcer.announce(`Removed ${objectToRemove.label}`);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this._addChipToSelection(event.option.value);
    this.ValueInput.nativeElement.value = '';
  }

  private _addChipToSelection(newChip: chipType): void {
    this.selectedObjects.push(newChip);
    this.ObjectControl.setValue(null);
    this.onSelectionChange();
  }

  private _filter(value: string | chipType): chipType[] {
    const filterValue = typeof value == 'string' ? value : value.label;
    const filterValueLower = filterValue.toLocaleLowerCase();
    return this.fullData.filter((object) => {
      const isResultFound = this.isStartWithSearch
        ? object.label.toLowerCase().startsWith(filterValueLower)
        : object.label.toLowerCase().includes(filterValueLower);
      return isResultFound;
      /* const isObjectAlreadySelected = this.selectedObjects.includes(object);
      return isResultFound && !isObjectAlreadySelected; */
    });
  }

  private _findByLabel(list: chipType[], searchString: string) {
    for (let i = 0; i < list.length; i++) {
      const object = list[i];
      if (object.label.toLowerCase() == searchString.toLowerCase())
        return object;
    }
    return undefined;
  }
}

export type chipType = {
  label: string;
  index: number;
  value: any;
};
