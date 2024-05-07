import { MatSelectModule } from '@angular/material/select';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipListboxChange, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MedicationService } from '../../services/medication/medication.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatOptionModule } from '@angular/material/core';
import { MatTooltip } from '@angular/material/tooltip';
import { MedicationDto } from '../../types/prescriptionDTOs';


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
  @Input()
  displaySelectedMedication=true;
  @Input()
  containerClasses:string="d-flex gap-3 flex-wrap justify-content-center";
  @Input()
  searchTerms: searchTerm[] = [
    { label: 'Name', medicationKey: 'name' },
    { label: 'Laboratory', medicationKey: 'lab' },
    { label: 'Indications', medicationKey: 'DCI' },
  ];
  selectedSearchTerm: searchTerm = this.searchTerms.length > 0 ? this.searchTerms[0] : { label: 'Name', medicationKey: 'name' } ;
  Medications: MedicationDto[] = [];
  filteredMedications: Observable<MedicationDto[]>;
  selectedMedications: MedicationDto[] = [];

  @Output() searchMedicationsChange = new EventEmitter<MedicationDto[]>();

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

  filterMedications(searchTerm: string): MedicationDto[] {
    if (typeof searchTerm !== 'string' || searchTerm.trim() === '') {
      return [];
    } else {
      return this.Medications.filter((medication) =>
        medication[this.selectedSearchTerm.medicationKey as keyof(MedicationDto)]
          ?.toString().toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }
  }

  onChangeSelectedMedication(medication: MedicationDto): void {
    if (!this.selectedMedications.includes(medication)) {
      this.selectedMedications.push(medication);
      this.emitSelectedMedications();
    }
    this.searchControl.setValue('');
  }

  onSearchKeySelectionChange(event: MatChipListboxChange) {
    this.selectedSearchTerm = event.source.value;
    this.emitSelectedMedications();
  }

  getMedicationProperty(medication: MedicationDto): string {
    return medication[this.selectedSearchTerm.medicationKey as keyof(MedicationDto)].toString();
  }

  removeMedication(medication: MedicationDto): void {
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

export type searchTerm = {
  label: string;
  medicationKey: string;
};
