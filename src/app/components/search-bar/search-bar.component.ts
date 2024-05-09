import { MatSelectModule } from '@angular/material/select';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges ,OnChanges } from '@angular/core';
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
import { MedicationDto } from '../../types/medicationDTOs';

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
export class SearchBarComponent implements OnInit ,OnChanges {
  searchControl = new FormControl();
  @Input()
  displaySelectedMedication = true;
  @Input()
  hideSearchIfMaximumReached = false;
  @Input()
  minimumNumberOfCharacters = 2;
  @Input()
  maxNumberOfSelectedMedications = 15;
  @Input()
  containerClasses: string = 'd-flex gap-3 flex-wrap justify-content-center';
  @Input()
  selectedMedications: MedicationDto[] = [];
  @Output() selectedMedicationsChange = new EventEmitter<MedicationDto[]>();

  @Input()
  searchTerms: searchTerm[] = [
    { label: 'Name', medicationKey: 'Name' },
    { label: 'Laboratory', medicationKey: 'lab' },
    { label: 'Indications', medicationKey: 'DCI' },
  ];
  selectedSearchTerm: searchTerm =
    this.searchTerms.length > 0
      ? this.searchTerms[0]
      : { label: 'Name', medicationKey: 'name' };
  Medications: MedicationDto[] = [];
  filteredMedications: Observable<MedicationDto[]>;
  
  hasReachedLimit= this.selectedMedications.length === this.maxNumberOfSelectedMedications;

  ngOnChanges(changes: SimpleChanges) {
    // Check if the inputVariable has changed
    if (changes['selectedMedications']) {
      this.updateFormControlState();
    }
  }

  updateFormControlState(){
    this.hasReachedLimit= this.selectedMedications.length === this.maxNumberOfSelectedMedications;
    this.hasReachedLimit ? this.searchControl.disable(): this.searchControl.enable()
  }


  constructor(private medicationService: MedicationService) {
    this.filteredMedications = this.searchControl.valueChanges.pipe(
      startWith(''),
      map((searchTerm) => this.filterMedications(searchTerm))
    );
  }


  ngOnInit(): void {
    this.medicationService.getMedications().subscribe(
      (response) => {
        this.Medications = response.medications.data;
      },
      null,
      () => this.afterLoadingData()
    );
    this.updateFormControlState()
  }

  afterLoadingData() {
    this.verifyInputKeys();

    //select default search term
    if (this.searchTerms.length > 0)
      this.selectedSearchTerm = this.searchTerms[0];
  }

  verifyInputKeys() {
    //check wether the keys of the input searchTerms are compatible with the object props
    if (this.Medications.length == 0) {
      console.error('No Medications were loaded to the search bar component');
      return;
    }
    let medicationExample = this.Medications[0];
    let objectKeys = Object.keys(medicationExample);
    this.searchTerms = this.searchTerms.filter((searchTerm) => {
      if (objectKeys.includes(searchTerm.medicationKey)) return true;
      console.error(
        'cannot find property with key : ' +
          searchTerm.medicationKey +
          ' in the medication object'
      );

      return false;
    });
  }

  filterMedications(searchTerm: string): MedicationDto[] {
    if (typeof searchTerm !== 'string' || searchTerm.trim() === '') {
      return [];
    }
    if (searchTerm.length < this.minimumNumberOfCharacters) return [];

    return this.Medications.filter((medication) =>
      medication[this.selectedSearchTerm.medicationKey as keyof MedicationDto]
        ?.toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
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
    return medication[
      this.selectedSearchTerm.medicationKey as keyof MedicationDto
    ].toString();
  }

  removeMedication(medication: MedicationDto): void {
/*     const index = this.selectedMedications.indexOf(medication);
    if (index !== -1) {
      this.selectedMedications.splice(index, 1);
      this.emitSelectedMedications();
    } */
    this.selectedMedications = this.selectedMedications.filter(med => med != medication) 
    this.updateFormControlState();

  }

  private emitSelectedMedications(): void {
    this.selectedMedicationsChange.emit(this.selectedMedications);
    this.updateFormControlState();

  }
}

export type searchTerm = {
  label: string;
  medicationKey: string;
};
