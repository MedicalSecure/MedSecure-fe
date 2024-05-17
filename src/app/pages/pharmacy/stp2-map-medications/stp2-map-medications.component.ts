import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MedicationType } from '../stp1-import-medications/stp1-import-medications.component';
@Component({
  selector: 'app-stp2-map-medications',
  standalone: true,
  imports: [
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    FormsModule,
    MatTableModule,
    MatChipsModule,
  ],
  templateUrl: './stp2-map-medications.component.html',
  styleUrl: './stp2-map-medications.component.css',
})
export class Stp2MapMedicationsComponent implements OnInit {
  @Input()
  mappedMedications: MedicationType[] = [];
  @Input() selectedPrescription: any | undefined = undefined;
  @Output() onClickNewPrescriptionEvent = new EventEmitter<boolean>();
  @Input() clearTextAfterEachSearch: boolean = false;
  @Input()
  checked: boolean = true;
  searchTerm: string = '';

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
    'description',
  ];
  dataSource = new MatTableDataSource<MedicationType>();

  constructor() {}

  ngOnInit(): void {
    const state = history.state;
    console.log(this.mappedMedications);
    if (state && state.mappedData) {
      this.dataSource.data = state.mappedData;
    }
    this.dataSource = new MatTableDataSource<MedicationType>(this.mappedMedications);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.clearTextAfterEachSearch) return;
    let newChange = changes['selectedPatient'];
    if (newChange && !newChange.firstChange) {
      if (this.selectedPrescription === undefined) this.searchTerm = '';
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onClickPrescription(Prescription: any) {
    this.selectedPrescription = Prescription;
  }

  onClickNewPrescription() {
    this.onClickNewPrescriptionEvent.emit(false);
    this.onClickPrescription(undefined);
  }
}
