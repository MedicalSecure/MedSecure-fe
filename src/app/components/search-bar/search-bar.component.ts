import { MatSelectModule } from '@angular/material/select';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipListboxChange, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Medications } from '../../model/medication';
import { MedicationService } from '../../services/medication.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatOptionModule } from '@angular/material/core';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-search-bar',
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
    MatTooltip,
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
})
export class SearchBarComponent implements OnInit {
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

  onChangeSelectedMedication(medication: Medications): void {
    if (!this.selectedMedications.includes(medication)) {
      this.selectedMedications.push(medication);
      this.emitSelectedMedications();
    }
    this.searchControl.setValue('');
  }

  onSelectionChange(event: MatChipListboxChange) {
    this.searchKey = event.source.value;
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
}