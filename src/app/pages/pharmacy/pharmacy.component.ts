import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MedicationType } from '../../pages/index/index.component';


@Component({
  selector: 'app-pharmacy',
  standalone: true,
  imports: [
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    FormsModule,
    MatTableModule,
  ],
  templateUrl: './pharmacy.component.html',
  styleUrl: './pharmacy.component.css',
})
export class PharmacyComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'dosage',
    'forme',
    'quantity',
    'unit',
    'dci',
    'laboratory',
    'expiration_date',
    'price',
    'indications',
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
  
}


