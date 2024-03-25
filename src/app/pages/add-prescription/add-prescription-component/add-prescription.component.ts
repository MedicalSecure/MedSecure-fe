import { Component, EventEmitter } from '@angular/core';
import {
  AddSymptomsComponent,
  diagnosisType,
  symptomType,
} from '../add-symptoms/add-symptoms.component';
import {
  PatientSelectComponent,
  patientType,
} from '../patient-select/patient-select.component';
import { PrescribeMedicationComponent } from '../prescribe-medication/prescribe-medication.component';
import { onChipsSelectionEmitType } from '../../../components/chips-select/chips-select.component';
import { MatIcon } from '@angular/material/icon';
import { WizardHeaderComponent } from '../../../components/wizard-header/wizard-header.component';
import { PatientInfoCardsComponent } from '../patient-info-cards/patient-info-cards.component';
import { Subject } from 'rxjs';
import { medicationType } from '../../../types';

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
  selectedDiagnosis: diagnosisType[] = [];
  selectedSymptoms: symptomType[] = [];
  selectedMedications: medicationType[] = [];
  selectedPatient: patientType | undefined;
  autoPageSwitchOnPatientSelection: boolean = false;
  isPatientSelectPageValid: boolean = false;
  isAddSymptomsPageValid: boolean = false;
  isSelectMedicationPageValid: boolean = false;

  eventsSubject: Subject<void> = new Subject<void>();

  nextButtonContent: { label: string; class: string } = _nextButtonContent;
  backButtonContent: { label: string; class: string } = _backButtonContent;

  ngOnInit() {
    this._updateButtonsState();
  }

  handleSubmit() {
    const finalPrescription = {
      patient: this.selectedPatient,
      symptoms: this.selectedSymptoms,
      diagnosis: this.selectedDiagnosis,
      medications: this.selectedMedications,
    };
    console.log(finalPrescription);
  }

  validatePageSwitch = (index: number): boolean => {
    // arrow function to hold they callback context xD
    if (index > this.stepsLimit + 1) return false;
    if (index < 1) return false;
    if (index >= 0 && index == this.stepNumber) return false;
    /* if (index != 1 && this.selectedPatient == undefined) return false; */
    if (index != 1 && !this.isPatientSelectPageValid) return false;
    if (index > 2 && !this.isAddSymptomsPageValid) return false;
    if (index > 3 && !this.isSelectMedicationPageValid) return false;
    return true;
  };

  emitFinishEventToChild() {
    this.eventsSubject.next();
  }

  handleMedicationChange(medications: medicationType[]) {
    this.selectedMedications = medications;
  }

  handleIsMedicationPageValidChange(eventData: boolean) {
    this.isSelectMedicationPageValid = eventData;
  }
  handleIsPatientSelectPageValidChange(eventData: boolean) {
    this.isPatientSelectPageValid = eventData;
  }
  handleIsAddSymptomsPageValidChange(eventData: boolean) {
    this.isAddSymptomsPageValid = eventData;
  }
  onSelectedDiagnosisChangeHandler(
    event: onChipsSelectionEmitType<diagnosisType>
  ) {
    this.selectedDiagnosis = event.SelectedObjectList;
  }
  onSelectedSymptomsChangeHandler(
    event: onChipsSelectionEmitType<symptomType>
  ) {
    this.selectedSymptoms = event.SelectedObjectList;
  }
  onClickFinish() {
    this.emitFinishEventToChild();
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

  /* wizard buttons */
  SwitchToStep(index: number) {
    if (index === this.stepsLimit + 1) {
      this.onClickFinish();
      return;
    }
    if (this.validatePageSwitch(index) == false) return;
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
      this.nextButtonContent = _nextButtonContent;
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
      this.backButtonContent = _backButtonContent;
    }
  }
}
const _nextButtonContent = {
  label: 'next',
  class: 'btn w-100 m-0 btn-success fs-6 text-white',
};

const _backButtonContent = {
  label: 'back',
  class: 'btn w-100 m-0 btn-warning fs-6 text-white',
};
