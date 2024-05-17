// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-pharmacy-list',
//   standalone: true,
//   imports: [],
//   templateUrl: './pharmacy-list.component.html',
//   styleUrl: './pharmacy-list.component.css'
// })
// export class PharmacyListComponent {

// }

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MedicationType } from '../../../partials/navbar/navbar.component';
import { MatChipsModule } from '@angular/material/chips';
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
    MatChipsModule
  ],
  templateUrl: './pharmacy-list.component.html',
  styleUrl: './pharmacy-list.component.css',
})
export class PharmacyListComponent implements OnInit {
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
    'average Stock',
    'minimum Stock',
    'safety Stock',
    'price',
    'description'
  ];
  dataSource = new MatTableDataSource<MedicationType>();

  constructor() {}

  ngOnInit(): void {
    const state = history.state;
    console.log(state);
    if (state && state.mappedData) {
      this.dataSource.data = state.mappedData;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  @Input() selectedPrescription: any | undefined = undefined;
  @Output() onClickNewPrescriptionEvent = new EventEmitter<boolean>();
  @Input() clearTextAfterEachSearch: boolean = false;
  @Input()
  
  checked: boolean = true;
  searchTerm: string = '';

  onClickPrescription(Prescription: any) {
    this.selectedPrescription = Prescription;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.clearTextAfterEachSearch) return;
    let newChange = changes['selectedMedication'];
    if (newChange && !newChange.firstChange) {
      if (this.selectedPrescription === undefined) this.searchTerm = '';
    }
  }

  onClickNewPrescription() {
    this.onClickNewPrescriptionEvent.emit(false);
    this.onClickPrescription(undefined);
  }
}