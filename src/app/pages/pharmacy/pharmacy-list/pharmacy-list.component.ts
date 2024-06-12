import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { DrugService } from '../../../services/medication/medication.service';
import { MedicationType } from '../stp1-import-map-drugs/stp1-import-map-drugs.component';
@Component({
  selector: 'app-pharmacy-list',
  standalone: true,
  imports: [
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    FormsModule,
    MatTableModule,
    MatChipsModule,
    MatProgressSpinner
  ],
  templateUrl: './pharmacy-list.component.html',
  styleUrl: './pharmacy-list.component.css',
})
export class PharmacyListComponent implements OnInit {
  @Input() mappedMedications: MedicationType[] = [];
  
  @Input() selectedPrescription: any | undefined = undefined;
  @Output() onClickNewMedicationEvent = new EventEmitter<boolean>();
  @Output() onClickViewPrescriptionsEvent = new EventEmitter<boolean>();
  @Input() clearTextAfterEachSearch: boolean = false;
  @Input()
  

  displayedColumns: string[] = [
    'name',
    'dosage',
    'form',
    'code',
    'expired At',
    'unit',
    'stock',
    'available Stock',
    'reserved Stock',
    'alert Stock',
    //'average Stock',
    //'minimum Stock',
    'safety Stock',
    'price',
    'description'
  ];
  dataSource = new MatTableDataSource<MedicationType>();

  
  isLoading: boolean = true;
  searchTerm: string = '';

  constructor(private drugService: DrugService) {}

  ngOnInit(): void {
    this.drugService.getData(this.dataSource);
    this.updateDataSource();
    console.log(this.mappedMedications);
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['mappedMedications']) {
      this.updateDataSource();
    }
  }

  private updateDataSource() {
    this.dataSource.data = this.mappedMedications;
    console.log(this.mappedMedications);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onClickMedication(Medication: any) {
    this.selectedPrescription = Medication;
  }

  onClickNewMedication() {
    this.onClickNewMedicationEvent.emit(false);
    this.onClickMedication(undefined);
  }

  onClickViewPrescriptions() {
    this.onClickViewPrescriptionsEvent.emit(true);
  }
}