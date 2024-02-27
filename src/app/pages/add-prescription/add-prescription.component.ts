import { Component, EventEmitter } from '@angular/core';
import { AddSymptomsComponent } from './add-symptoms/add-symptoms.component';
import { PatientSelectComponent } from './patient-select/patient-select.component';
import { PrescribeMedicationComponent } from './prescribe-medication/prescribe-medication.component';
import { onChipsSelectionEmitType } from '../../components/chips-select/chips-select.component';

@Component({
  selector: 'app-add-prescription',
  standalone: true,
  imports: [
    AddSymptomsComponent,
    PatientSelectComponent,
    PrescribeMedicationComponent,
  ],
  templateUrl: './add-prescription.component.html',
  styleUrl: './add-prescription.component.css',
})
export class AddPrescriptionComponent {
  stepNumber: number = 2;
  selectedDiagnosis: any = [];

  prevStep() {
    this.stepNumber--;
  }

  SwitchToStep(index: number) {
    if (this._validatePageSwitch(index)) this.stepNumber = index;
  }

  nextStep() {
    this.stepNumber++;
  }
  isStepNumber(step: number): boolean {
    console.log(step + ' is ', this.stepNumber === step);
    return this.stepNumber === step;
  }

  onPageChangeEvent(event: number, sourcePageNumber: number) {
    this.SwitchToStep(event + sourcePageNumber);
  }

  onSelectedDiagnosisChangeHandler(event: onChipsSelectionEmitType) {
    console.log('main ' + event);
    this.selectedDiagnosis = event.SelectedObjectList;
  }

  _validatePageSwitch(index: number): Boolean {
    return true;
  }
}
