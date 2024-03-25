import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Medications } from './../../model/medication'


@Component({
  selector: 'app-medication-list',
  standalone: true,
  imports: [MatDialogModule, MatIconModule],
  templateUrl: './medication-list.component.html',
  styleUrl: './medication-list.component.css'
})
export class MedicationListComponent {
  medication: Medications;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Medications) {
    this.medication = this.data['medication'];
  }
}
