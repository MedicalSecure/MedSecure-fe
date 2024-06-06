import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { medicationType } from '../../../../types';
import { CardMedicationComponent } from "../../../../components/card-medication/card-medication.component";
import { RegisterForPrescription } from '../../../../model/Prescription';

@Component({
    selector: 'app-patient-detail',
    standalone: true,
    templateUrl: './patient-detail.component.html',
    styleUrl: './patient-detail.component.css',
    imports: [CardMedicationComponent]
})
export class PatientDetailComponent implements OnInit{

  @Input() inputRegister: RegisterForPrescription | undefined = undefined;
  ngOnInit(): void {
    console.log(this.inputRegister);
    
  }
maxWidth: { [klass: string]: string; };
  onClickEditMedication(x: any, y: any) {}
  onClickRemoveMedication(x: any, y: any) {}

}

const dummyData: medicationType[] = [];

