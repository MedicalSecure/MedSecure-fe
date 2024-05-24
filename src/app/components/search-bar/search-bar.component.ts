import { MatSelectModule } from '@angular/material/select';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipListboxChange, MatChipsModule } from '@angular/material/chips';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MedicationService } from '../../services/medication/medication.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatOptionModule } from '@angular/material/core';
import { MatTooltip } from '@angular/material/tooltip';
import { DrugDTO } from '../../types/DrugDTOs';

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
export class SearchBarComponent implements OnInit, OnChanges {
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
  selectedMedications: DrugDTO[] = [];
  @Output() selectedMedicationsChange = new EventEmitter<DrugDTO[]>();

  @Input()
  searchTerms: searchTerm[] = [
    { label: 'Name', medicationKey: 'name' },
    { label: 'Form', medicationKey: 'form' },
  ];
  selectedSearchTerm: searchTerm =
    this.searchTerms.length > 0
      ? this.searchTerms[0]
      : { label: 'Name', medicationKey: 'name' };
  Medications: DrugDTO[] = [];
  filteredMedications: Observable<DrugDTO[]>;

  hasReachedLimit =
    this.selectedMedications.length === this.maxNumberOfSelectedMedications;

  ngOnChanges(changes: SimpleChanges) {
    // Check if the inputVariable has changed
    if (changes['selectedMedications']) {
      this.updateFormControlState();
    }
  }

  updateFormControlState() {
    this.hasReachedLimit = this.selectedMedications.length === this.maxNumberOfSelectedMedications;

    let c1 = this.hasReachedLimit;
    let c2 = this.selectedSearchTerm == undefined || this.selectedSearchTerm == null;
    if (c1 || c2) this.searchControl.disable();
    else this.searchControl.enable();
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
        this.Medications = response.drugs.data;
      },
      null,
      () => this.afterLoadingData()
    );
    this.updateFormControlState();
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

  filterMedications(searchTerm: string): DrugDTO[] {
    if (typeof searchTerm !== 'string' || searchTerm.trim() === '') {
      return [];
    }
    if (searchTerm.length < this.minimumNumberOfCharacters) return [];

    return this.Medications.filter((medication) =>
      medication[this.selectedSearchTerm.medicationKey]
        ?.toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }

  onChangeSelectedMedication(medication: DrugDTO): void {
    if (!this.selectedMedications.includes(medication)) {
      this.selectedMedications.push(medication);
      this.emitSelectedMedications();
    }
    this.searchControl.setValue('');
  }

  onSearchKeySelectionChange(event: MatChipListboxChange) {
    if (
      event == undefined ||
      event.source == undefined ||
      event.source.value == undefined
    )
      return;
    this.selectedSearchTerm = event.source.value;
    this.emitSelectedMedications();
  }

  getMedicationProperty(medication: DrugDTO): string {
    //@ts-ignore
    return medication[
      this.selectedSearchTerm.medicationKey as keyof DrugDTO
    ].toString();
  }

  removeMedication(medication: DrugDTO, index: any): void {
    //better performance
    //this.selectedMedications = this.selectedMedications.filter(med => med != medication)
    this.selectedMedications.splice(index, 1);
    this.emitSelectedMedications();
  }

  private emitSelectedMedications(): void {
    this.selectedMedicationsChange.emit(this.selectedMedications);
    this.updateFormControlState();
  }
}

export type searchTerm = {
  label: string;
  medicationKey: keyof DrugDTO;
};
