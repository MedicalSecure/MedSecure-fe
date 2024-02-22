import { MatSelectModule } from '@angular/material/select';
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MedicationService } from './medication.service';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';



@Component({
  selector: 'app-search-medicaments',
  standalone: true,
  imports: [MatChipsModule, MatIconModule, MatSelectModule, MatFormFieldModule,CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, ReactiveFormsModule ],
  templateUrl: './medication-search.component.html',
  styleUrl: './medication-search.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MedicationSearchComponent implements OnInit {
  searchControl = new FormControl();
  searchKeys: string[] = ['Nom', 'Laboratoire', 'Indications'];
  searchKey: string = 'Nom';
  medcines: any[] = [];
  filteredMedcines: any[] = [];
  selectedMedcines: string[] = []; 

  constructor(private medicationService: MedicationService) {}

  ngOnInit(): void {
    this.medicationService.getMedications().subscribe(data => {
      this.medcines = data.medcines.medcine;
    });

    this.searchControl.valueChanges.subscribe(searchTerm => {
      this.filteredMedcines = this.filterMedcines(searchTerm);
    });
  }

  filterMedcines(searchTerm: string): any[] {
    if (typeof searchTerm !== 'string' || searchTerm.trim() === '') {
      return [];
    } else {
      return this.medcines.filter(medcine =>
        medcine[this.searchKey]?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }

  openDialog(medcine: any): void {
    const selectedMedcine = this.getMedcineProperty(medcine);
    if (!this.selectedMedcines.includes(selectedMedcine)) {
      this.selectedMedcines.push(selectedMedcine);
    }
    this.searchControl.setValue(''); // Clear the value of the search input field
  }

  getMedcineProperty(medcine: any): string {
    // Return the property based on the selected key
    switch (this.searchKey) {
      case 'Nom':
        return medcine.Nom;
      case 'Laboratoire':
        return medcine.Laboratoire;
      case 'Indications':
        return medcine.Indications;
      default:
        return '';
    }
  }

  removeMedcine(medcine: string): void {
    const index = this.selectedMedcines.indexOf(medcine);
    if (index !== -1) {
      this.selectedMedcines.splice(index, 1);
    }
  }
  
}
