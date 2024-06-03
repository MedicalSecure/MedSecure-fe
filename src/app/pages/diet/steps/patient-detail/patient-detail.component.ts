import { Component, Input } from '@angular/core';
import { medicationType } from '../../../../types';
import { CardMedicationComponent } from "../../../../components/card-medication/card-medication.component";

@Component({
    selector: 'app-patient-detail',
    standalone: true,
    templateUrl: './patient-detail.component.html',
    styleUrl: './patient-detail.component.css',
    imports: [CardMedicationComponent]
})
export class PatientDetailComponent {
  @Input()
  medication: medicationType[] = dummyData;
maxWidth: { [klass: string]: string; };

  onClickEditMedication(x: any, y: any) {}
  onClickRemoveMedication(x: any, y: any) {}
}
const dummyData: medicationType[] = [];

