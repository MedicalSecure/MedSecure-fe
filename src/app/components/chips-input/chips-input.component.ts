import { Component, OnInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ElementRef, ViewChild, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { WidgetsPageComponent } from '../../pages/widgets-page/widgets-page.component'
import { DetectionTempComponent } from '../../components/detection-temp/detection-temp.component'
@Component({
  selector: 'app-chips-input',
  standalone: true,
  imports: [FormsModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe, HttpClientModule, CommonModule, WidgetsPageComponent, DetectionTempComponent],
  templateUrl: './chips-input.component.html',
  styleUrl: './chips-input.component.css'
})
export class ChipsInputComponent implements OnInit {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  unitCtrl = new FormControl();
  filteredUnits!: Observable<any[]>;
  units: any[] = [];
  allUnits: any[] = [];
  selectedUniteSoin: any;
  @ViewChild('unitInput') unitInput!: ElementRef<HTMLInputElement>;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<any>('assets/data/unites-soins.json').subscribe(data => {
      this.allUnits = data;
      this.filteredUnits = this.unitCtrl.valueChanges.pipe(
        startWith(null),
        map((unit: string | null) => (unit ? this._filter(unit) : this.allUnits.slice()))
      );
    });
  }

  private _filter(value: string): any[] {
    if (typeof value !== 'string') {
      return [];
    }
    const filterValue = value.toLowerCase();
    return this.allUnits.filter(unit => unit.name.toLowerCase().includes(filterValue));
  }


  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add the selected unit
    if (value) {
      this.units.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.unitCtrl.setValue(null);
  }

  remove(unit: string): void {
    const index = this.units.indexOf(unit);
    if (index >= 0) {
      this.units.splice(index, 1);
      if (this.units.length === 0) {
        this.selectedUniteSoin = false;
      }
    }
  }

  selected(event: any): void {
    this.units.push(event.option.value);
    this.unitInput.nativeElement.value = '';
    this.unitCtrl.setValue(null);
    this.selectedUniteSoin = true;
  }

  trackByFn(index: number, unit: any): any {
    return unit.id;
  }

  onSelectUniteSoin(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.selectedUniteSoin = selectedValue;
  }
}
