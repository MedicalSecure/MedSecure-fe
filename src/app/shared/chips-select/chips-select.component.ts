import { COMMA, ENTER } from '@angular/cdk/keycodes';
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
  ],
})
export class ShipsSelectComponent {
  @Input() ObjectName!: string;
  @Input() customLabel!: string;
  @Input() class: string = '';
  @Input() enableCustomAdditions: boolean = true;
  @Input() enableQuickSelectFromSuggestions: boolean = true;
  @Input() AllData: string[] = ['sym1', 'sym2', 'sym22'];

  separatorKeysCodes: number[] = [ENTER, COMMA];
  ObjectControl = new FormControl('');
  filteredData: Observable<string[]>;
  filteredDataSubscription!: Subscription;
  updatedSuggestionList: string[] = [];
  selectedObjects: chipType[] = [];
  selectedStrings: string[] = [];

  @ViewChild('ValueInput') ValueInput!: ElementRef<HTMLInputElement>;
  announcer = inject(LiveAnnouncer);

  @Output() selectedChipsChange = new EventEmitter<chipType[]>();

  constructor() {
    this.filteredData = this.ObjectControl.valueChanges.pipe(
      startWith(null),
      map((object: string | null) =>
        object ? this._filter(object) : this.AllData.slice()
      )
    );
  }

  ngOnInit() {
    this.filteredDataSubscription = this.filteredData.subscribe((data) => {
      this.updatedSuggestionList = data;
    });
  }

  ngOnDestroy() {
    this.filteredDataSubscription.unsubscribe(); // Prevent memory leaks
  }

  onSelectionChange() {
    // Emit the updated array to the parent component
    this.selectedChipsChange.emit(
      this.selectedObjects
      //TODO add index of the searched item from database
      /*       this.selectedObjects.map((value) => {
        console.log("here")
        return {
          label: value,
          index: 'string',
          value: value,
        };
      })
    ); */
    );
  }

  add(event: MatChipInputEvent): void {
    if (
      this.enableQuickSelectFromSuggestions == true &&
      this.updatedSuggestionList.length > 0
    ) {
      // add the first suggestion
      this._addString(this.updatedSuggestionList[0]);
      event.chipInput!.clear();
      return;
    }
    if (this.enableCustomAdditions === true) {
      const value = (event.value || '').trim();
      // Add custom value
      if (value && !this.selectedStrings.includes(value)) {
        this._addString(value, -1);
        event.chipInput!.clear();
      }
    }
  }

  remove(label: string): void {
    this.selectedObjects = this.selectedObjects.filter(
      (chipObject: chipType) => chipObject.label != label
    );
    this.onSelectionChange();
    const index = this.selectedStrings.indexOf(label);
    if (index >= 0) {
      this.selectedStrings.splice(index, 1);
      this.announcer.announce(`Removed ${label}`);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this._addString(event.option.viewValue);
    //const index= parseInt(event.option.id.substring('mat-option-'.length));
    //this._addString(event.option.viewValue,index)
    this.ValueInput.nativeElement.value = '';
  }

  private _addString(
    newValue: string,
    id: number | undefined = undefined
  ): void {
    //find the id from the data array
    id = id != undefined ? id : this.AllData.indexOf(newValue);
    this.selectedStrings.push(newValue);
    this.selectedObjects.push({
      label: newValue,
      index: id == undefined ? -1 : id,
      value: newValue,
    });
    this.ObjectControl.setValue(null);
    this.onSelectionChange();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.AllData.filter((object) =>
      object.toLowerCase().includes(filterValue)
    );
  }
}

export type chipType = {
  label: string;
  index: number;
  value: any;
};
