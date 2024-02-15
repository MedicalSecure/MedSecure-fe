import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-medication-details-dialog',
  standalone: true,
  imports: [MatDialogModule, MatIconModule],
  templateUrl: './medication-details-dialog.component.html',
  styleUrl: './medication-details-dialog.component.css'
})
export class MedicationDetailsDialogComponent {
  medcine: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.medcine = this.data.medcine;
  }
}
