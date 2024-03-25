import { Component, Input } from '@angular/core';
import { patientType } from '../patient-select/patient-select.component';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardMedicationComponent } from '../../../components/card-medication/card-medication.component';
import { medicationType } from '../../../types';

@Component({
  selector: 'app-patient-info-cards',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIcon, CardMedicationComponent],
  templateUrl: './patient-info-cards.component.html',
  styleUrl: './patient-info-cards.component.css',
})
export class PatientInfoCardsComponent {
  @Input() selectedPatient: patientType | undefined = undefined;
  @Input()
  medication: medicationType[] = dummyData;

  onClickEditMedication(x: any, y: any) {}
  onClickRemoveMedication(x: any, y: any) {}

  getNewlyPrescribedMedicationSig(
    medication: medicationType
  ): string | undefined {
    let result;
    const size = medication.administrationHours.length;
    if (size > 1) result = size + ' times a day';
    else if (size == 1) result = 'single time a day';
    return result;
  }
}

const dummyData: medicationType[] = [
  
];
