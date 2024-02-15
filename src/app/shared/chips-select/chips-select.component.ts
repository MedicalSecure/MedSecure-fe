import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, ElementRef, Input, ViewChild, inject} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatIconModule} from '@angular/material/icon';
import {AsyncPipe} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {LiveAnnouncer} from '@angular/cdk/a11y';

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
  
  separatorKeysCodes: number[] = [ENTER, COMMA];
  ObjectControl = new FormControl('');
  filteredData: Observable<string[]>;
  selectedObjects: string[] = [];
  AllData: string[] = ['a',"n","c","d","h", 'a',"n","c","d","h",'a',"n","c","d","h",'g'];

  @ViewChild('ValueInput') ValueInput!: ElementRef<HTMLInputElement>;

  announcer = inject(LiveAnnouncer);

  constructor() {
    this.filteredData = this.ObjectControl.valueChanges.pipe(
      startWith(null),
      map((object: string | null) => (object ? this._filter(object) : this.AllData.slice())),
    );
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our object
    if (value) {
      this.selectedObjects.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.ObjectControl.setValue(null);
  }

  remove(object: string): void {
    const index = this.selectedObjects.indexOf(object);

    if (index >= 0) {
      this.selectedObjects.splice(index, 1);

      this.announcer.announce(`Removed ${object}`);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedObjects.push(event.option.viewValue);
    this.ValueInput.nativeElement.value = '';
    this.ObjectControl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.AllData.filter(object => object.toLowerCase().includes(filterValue));
  }
}
