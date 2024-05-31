import { Component, Input } from '@angular/core';
import { patientType } from '../stp1-patient-selection/stp1-patient-selection.component';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardMedicationComponent } from '../../../components/card-medication/card-medication.component';
import { medicationType } from '../../../types';

@Component({
  selector: 'app-stp2-patient-details',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIcon, CardMedicationComponent],
  templateUrl: './stp2-patient-details.component.html',
  styleUrl: './stp2-patient-details.component.css',
})
export class Stp2PatientDetailsComponent {
  @Input() selectedPatient: patientType | undefined = undefined;
  @Input()
  medication: medicationType[] = dummyData;

  onClickEditMedication(x: any, y: any) {}
  onClickRemoveMedication(x: any, y: any) {}
}

const dummyData: medicationType[] = [];
