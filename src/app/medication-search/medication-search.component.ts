import { MatSelectModule } from '@angular/material/select';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipListboxChange, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Medications } from './medication.model';
import { MedicationService } from './medication.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-medication-search',
  standalone: true,
  imports: [
    MatChipsModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatOptionModule,
    
  ],
  templateUrl: './medication-search.component.html',
  styleUrl: './medication-search.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MedicationSearchComponent implements OnInit {
  searchControl = new FormControl();
  searchKeys: string[] = ['Nom', 'Laboratoire', 'Indications'];
  searchKey: string = '';
  Medications: Medications[] = [];
  filteredMedications: Observable<Medications[]>;
  selectedMedications: Medications[] = [];

  @Output() searchMedicationsChange = new EventEmitter<Medications[]>();

  constructor(private medicationService: MedicationService) {
    this.filteredMedications = this.searchControl.valueChanges.pipe(
      startWith(''),
      map((searchTerm) => this.filterMedications(searchTerm))
    );
  }

  ngOnInit(): void {
    this.medicationService.getMedications().subscribe((data) => {
      this.Medications = data.Medications.medication;
    });
  }

  search(value: string) {
    console.log(value);
  }

  filterMedications(searchTerm: string): Medications[] {
    if (typeof searchTerm !== 'string' || searchTerm.trim() === '') {
      return [];
    } else {
      return this.Medications.filter((medication) =>
        medication[this.searchKey]
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }
  }

  openDialog(medication: Medications): void {
    if (!this.selectedMedications.includes(medication)) {
      this.selectedMedications.push(medication);
      this.emitSelectedMedications();
    }
    this.searchControl.setValue('');
  }

  onSelectionChange(event: MatChipListboxChange) {
    this.searchKey = event.source.value
    this.emitSelectedMedications();
  }

  getMedicationProperty(medication: Medications): string {
    switch (this.searchKey) {
      case 'Nom':
        return medication['Nom'];
      case 'Laboratoire':
        return medication['Laboratoire']; 
      case 'Indications':
        return medication['Indications']; 
      default:
        return '';
    }
  }

  removemedication(medication: Medications): void {
    const index = this.selectedMedications.indexOf(medication);
    if (index !== -1) {
      this.selectedMedications.splice(index, 1);
      this.emitSelectedMedications();
    }
  }

  private emitSelectedMedications(): void {
    this.searchMedicationsChange.emit(this.selectedMedications);
  }

  // Function to handle Enter key press
  handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      // Implement your logic here to perform an action when Enter key is pressed
      console.log('Enter key pressed');
    }
  }
}
