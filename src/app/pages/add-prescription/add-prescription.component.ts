import { Component } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AddSymptomsComponent } from './add-symptoms/add-symptoms.component';
import { ShipsSelectComponent } from '../../components/chips-select/chips-select.component';
@Component({
  selector: 'app-add-prescription',
  standalone: true,
  imports: [
    MatGridListModule,
    MatProgressBarModule,
    AddSymptomsComponent,
    ShipsSelectComponent,
  ],
  templateUrl: './add-prescription.component.html',
  styleUrl: './add-prescription.component.css',
})
export class AddPrescriptionComponent {}
