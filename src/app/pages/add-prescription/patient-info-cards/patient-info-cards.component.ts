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
    const size = medication.administrationHours.size;
    if (size > 1) result = size + ' times a day';
    else if (size == 1) result = 'single time a day';
    return result;
  }
}

const dummyData: medicationType[] = [
  {
    medicationId: '1',
    name: 'Aspirin',
    dispenseValue: 30,
    dispenseUnit: 'tablets',
    startDate: new Date('2024-03-01'),
    consumptionDays: 30,
    isForceOrder: false,
    administrationHours: new Set([
      { hour: 8, isBeforeFood: false },
      { hour: 12, isBeforeFood: true },
      { hour: 20, isBeforeFood: false },
    ]),
    dispenseCaution: 'Avoid alcohol while taking this medication.',
    comments: [{ content: 'Patient has allergy to penicillin.' }],
  },
  {
    medicationId: '2',
    name: 'Lipitor',
    dispenseValue: 120,
    dispenseUnit: 'capsules',
    startDate: new Date('2024-03-05'),
    consumptionDays: 60,
    isForceOrder: true,
    administrationHours: new Set([
      { hour: 9, isBeforeFood: false },
      { hour: 21, isBeforeFood: false },
    ]),
    comments: [{ content: 'Take with food to reduce stomach discomfort.' }],
  },
  {
    medicationId: '3',
    name: 'Voltaren Gel',
    dispenseValue: 30,
    dispenseUnit: 'g',
    startDate: new Date('2024-03-10'),
    consumptionDays: 30,
    isForceOrder: false,
    administrationHours: new Set([{ hour: 8, isBeforeFood: false }]),
    comments: [],
  },
];
/* {
    medicationId: '4',
    name: 'Metformin',
    dispenseValue: 90,
    dispenseUnit: 'tablets',
    startDate: new Date('2024-03-15'),
    consumptionDays: 90,
    isForceOrder: true,
    administrationHours: new Set([{ hour: 10, isBeforeFood: false }]),
    comments: ['Store at room temperature.'],
  },
  {
    medicationId: '5',
    name: 'Amoxicillin',
    dispenseValue: 180,
    dispenseUnit: 'tablets',
    startDate: new Date('2024-03-20'),
    consumptionDays: 60,
    isForceOrder: false,
    administrationHours: new Set([
      { hour: 7, isBeforeFood: true },
      { hour: 12, isBeforeFood: true },
      { hour: 18, isBeforeFood: true },
    ]),
    comments: [],
  },
  {
    medicationId: '6',
    name: 'Prozac',
    dispenseValue: 60,
    dispenseUnit: 'tablets',
    startDate: new Date('2024-03-25'),
    consumptionDays: 30,
    isForceOrder: false,
    administrationHours: new Set([
      { hour: 8, isBeforeFood: false },
      { hour: 20, isBeforeFood: false },
    ]),
    comments: [
      'Avoid consuming grapefruit or grapefruit juice while on this medication.',
    ],
  },
]; */
