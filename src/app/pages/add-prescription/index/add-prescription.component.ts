import { Component, EventEmitter } from '@angular/core';
import { AddSymptomsComponent } from '../add-symptoms/add-symptoms.component';
import {
  PatientSelectComponent,
  patientType,
} from '../patient-select/patient-select.component';
import { PrescribeMedicationComponent } from '../prescribe-medication/prescribe-medication.component';
import { onChipsSelectionEmitType } from '../../../components/chips-select/chips-select.component';
import { MatIcon } from '@angular/material/icon';
import { WizardHeaderComponent } from '../../../components/wizard-header/wizard-header.component';
import { PatientInfoCardsComponent } from '../patient-info-cards/patient-info-cards.component';

@Component({
  selector: 'app-add-prescription',
  standalone: true,
  imports: [
    AddSymptomsComponent,
    PatientSelectComponent,
    PrescribeMedicationComponent,
    MatIcon,
    WizardHeaderComponent,
    PatientInfoCardsComponent,
  ],
  templateUrl: './add-prescription.component.html',
  styleUrl: './add-prescription.component.css',
})
export class AddPrescriptionComponent {
  stepNumber: number = 1;
  stepsLimit: number = 3;
  selectedDiagnosis: any = [];
  selectedPatient: patientType | undefined;
  autoPageSwitchOnPatientSelection: boolean = false;

  private _nextButtonContent = {
    label: 'next',
    class: 'btn w-100 m-0 btn-success fs-6 text-white',
  };

  private _backButtonContent = {
    label: 'back',
    class: 'btn w-100 m-0 btn-warning fs-6 text-white',
  };

  nextButtonContent: { label: string; class: string } = this._nextButtonContent;
  backButtonContent: { label: string; class: string } = this._backButtonContent;

  ngOnInit() {
    this._updateButtonsState();
  }

  onSelectPatientChange(patient: patientType | undefined) {
    if (patient == undefined) {
      this.selectedPatient = undefined;
      this.stepNumber = 1;
    } else {
      if (this.autoPageSwitchOnPatientSelection && this.stepNumber == 1) {
        this.SwitchToStep(2);
      }
    }
    this._updateButtonsState();
  }

  SwitchToStep(index: number) {
    if (this._validatePageSwitch(index) == false) return;
    this.stepNumber = index;
    this._updateButtonsState();
  }

  nextStep() {
    this.SwitchToStep(this.stepNumber + 1);
  }
  prevStep() {
    this.SwitchToStep(this.stepNumber - 1);
  }

  isStepNumber(step: number): boolean {
    return this.stepNumber === step;
  }

  onPageChangeEvent(event: number, sourcePageNumber: number) {
    this.SwitchToStep(event + sourcePageNumber);
  }

  onSelectedDiagnosisChangeHandler(event: onChipsSelectionEmitType) {
    this.selectedDiagnosis = event.SelectedObjectList;
  }

  _validatePageSwitch(index: number): Boolean {
    if (index > this.stepsLimit) return false;
    if (index < 0) return false;
    if (index >= 0 && index == this.stepNumber) return false;
    if (index != 0 && this.selectedPatient == undefined) return false;
    return true;
  }

  onClickNextEvent(): void {
    this.nextStep();
  }
  onClickBackEvent(): void {
    this.prevStep();
  }
  setNextButtonStyle(event: { label: string; class: string }) {
    this.nextButtonContent = event;
  }
  setBackButtonStyle(event: { label: string; class: string }) {
    this.nextButtonContent = event;
  }

  private _updateButtonsState() {
    if (this.selectedPatient == undefined) {
      this.nextButtonContent = {
        ...this.nextButtonContent,
        class: this.nextButtonContent.class + 'd btn-outline-warning disabled',
      };
    } else {
      this.nextButtonContent = this._nextButtonContent;
    }
    if (this.stepNumber == this.stepsLimit) {
      if (true)
        this.nextButtonContent = {
          ...this.nextButtonContent,
          label: 'Finish',
        };
      else
        this.nextButtonContent = {
          ...this.nextButtonContent,
          label: 'Finish',
        };
    }

    if (this.stepNumber === 1) {
      this.backButtonContent = {
        ...this.backButtonContent,
        class: this.backButtonContent.class + 'd btn-outline-success disabled',
      };
    } else {
      this.backButtonContent = this._backButtonContent;
    }
  }
}
