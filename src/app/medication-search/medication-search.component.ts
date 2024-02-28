import { MatSelectModule } from '@angular/material/select';
import { CUSTOM_ELEMENTS_SCHEMA, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Medcine } from './medcine.model';
import { MedicationService } from './medication.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatOptionModule } from '@angular/material/core';



@Component({
  selector: 'app-medication-search',
  standalone: true,
  imports: [MatChipsModule, MatIconModule, MatSelectModule, MatFormFieldModule,CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, ReactiveFormsModule, MatOptionModule ],
  templateUrl: './medication-search.component.html',
  styleUrl: './medication-search.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MedicationSearchComponent implements OnInit {
  searchControl = new FormControl();
  searchKeys: string[] = ['Nom', 'Laboratoire', 'Indications'];
  searchKey: string = 'Nom';
  medcines: Medcine[] = [];
  filteredMedcines: Observable<Medcine[]>; // Initialize filteredMedcines as an array
  selectedMedcines: Medcine[] = [];
  
  @Output() searchMedicationsChange = new EventEmitter<Medcine[]>();

  constructor(private medicationService: MedicationService) {
    this.filteredMedcines = this.searchControl.valueChanges.pipe(
      startWith(''),
      map(searchTerm => this.filterMedcines(searchTerm))
    );
  }

  ngOnInit(): void {
    this.medicationService.getMedications().subscribe(data => {
      this.medcines = data.medcines.medcine;
    });
  }

  filterMedcines(searchTerm: string): Medcine[] {
    if (typeof searchTerm !== 'string' || searchTerm.trim() === '') {
      return [];
    } else {
      return this.medcines.filter(medcine =>
        medcine[this.searchKey]?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }

  openDialog(medcine: Medcine): void {
    if (!this.selectedMedcines.includes(medcine)) {
      this.selectedMedcines.push(medcine);
      this.emitSelectedMedcines();
    }
    this.searchControl.setValue('');
  }

  getMedcineProperty(medcine: Medcine): string {
    switch (this.searchKey) {
      case 'Nom':
        return medcine['Nom']; // Use square brackets for dynamic properties
      case 'Laboratoire':
        return medcine['Laboratoire']; // Use square brackets for dynamic properties
      case 'Indications':
        return medcine['Indications']; // Use square brackets for dynamic properties
      default:
        return '';
    }
  }

  // onSelectionChange(lastAddedItem: Medcine | undefined, lastRemovedItem: Medcine | undefined) {
  //   if (lastAddedItem) {
  //     this.selectedMedcines.push(lastAddedItem);
  //   }
  //   if (lastRemovedItem) {
  //     const index = this.selectedMedcines.indexOf(lastRemovedItem);
  //     if (index !== -1) {
  //       this.selectedMedcines.splice(index, 1);
  //     }
  //   }
  //   this.emitSelectedMedcines();
  // }

  removeMedcine(medcine: Medcine): void {
    const index = this.selectedMedcines.indexOf(medcine);
    if (index !== -1) {
      this.selectedMedcines.splice(index, 1);
      this.emitSelectedMedcines();
    }
  }

  private emitSelectedMedcines(): void {
    this.searchMedicationsChange.emit(this.selectedMedcines);
  }

  // Function to handle Enter key press
  handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      // Implement your logic here to perform an action when Enter key is pressed
      console.log('Enter key pressed');
    }
  }
}

  

  


