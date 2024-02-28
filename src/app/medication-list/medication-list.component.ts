import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-medication-list',
  standalone: true,
  imports: [MatDialogModule, MatIconModule],
  templateUrl: './medication-list.component.html',
  styleUrl: './medication-list.component.css'
})
export class MedicationListComponent {
  medcine: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.medcine = this.data.medcine;
  }
}
