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
import { Observable } from 'rxjs';
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
  @Input() class!: string;
  @Input() AllData: string[] = [
    'a',
    'n',
    'c',
    'd',
    'h',
    'a',
    'n',
    'c',
    'd',
    'h',
    'a',
    'n',
    'c',
    'd',
    'h',
    'g',
  ];

  separatorKeysCodes: number[] = [ENTER, COMMA];
  ObjectControl = new FormControl('');
  filteredData: Observable<string[]>;

  @Output() selectedChipsChange = new EventEmitter<chipType[]>();

  onSelectionChange() {
    // Emit the updated array to the parent component
    //console.log("emitted")
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

  selectedObjects: chipType[] = [];
  selectedStrings: string[] = [];

  @ViewChild('ValueInput') ValueInput!: ElementRef<HTMLInputElement>;

  announcer = inject(LiveAnnouncer);

  constructor() {
    this.filteredData = this.ObjectControl.valueChanges.pipe(
      startWith(null),
      map((object: string | null) =>
        object ? this._filter(object) : this.AllData.slice()
      )
    );
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add our object
    if (value) {
      if (!this.selectedStrings.includes(value)) {
        this.selectedStrings.push(value);
        this.selectedObjects.push({
          label: value,
          index: -1,
          value: value,
        });
        console.log('added ' + value);
      }
    }
    // Clear the input value
    event.chipInput!.clear();
    this.ObjectControl.setValue(null);
    this.onSelectionChange();
  }

  remove(label: string): void {
    console.log('remove ' + label);
    this.selectedObjects = this.selectedObjects.filter(
      (chipObject: chipType) => chipObject.label != label
    );
    this.onSelectionChange();
    console.log('removed ' + label);
    const index = this.selectedStrings.indexOf(label);
    if (index >= 0) {
      this.selectedStrings.splice(index, 1);
      this.announcer.announce(`Removed ${label}`);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedStrings.push(event.option.viewValue);
    console.log(event.option.id)
    this.selectedObjects.push({
      label: event.option.viewValue,
      index: this.AllData.indexOf(event.option.viewValue),
      //index: parseInt(event.option.id.substring('mat-option-'.length)),
      value: event.option.viewValue,
    });
    
    this.ValueInput.nativeElement.value = '';
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
  value: string;
};
