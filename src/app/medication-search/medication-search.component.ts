import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MedicationService } from './medication.service';
import { MedicationDetailsDialogComponent } from '../medication-details-dialog/medication-details-dialog.component';


@Component({
  selector: 'app-search-medicaments',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatCheckboxModule, MatListModule, MatButtonModule, MatAutocompleteModule, MatDialogModule, ReactiveFormsModule, MatRadioModule, MatCardModule],
  templateUrl: './medication-search.component.html',
  styleUrl: './medication-search.component.css'
})
export class MedicationSearchComponent implements OnInit {
  searchControl = new FormControl();
  searchKey: string = 'Nom';
  medcines: any[] = [];
  filteredMedcines: any[] = [];
  selectedMedcine: any;

  constructor(private medicationService: MedicationService, public dialog: MatDialog) {}

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
  this.selectedMedcine = medcine;
  this.searchControl.setValue(''); // Clear the value of the search input field
  const dialogRef = this.dialog.open(MedicationDetailsDialogComponent, {
    data: { medcine }
  });
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
}
