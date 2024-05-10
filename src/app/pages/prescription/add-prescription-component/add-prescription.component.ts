import { Component } from '@angular/core';
import { Stp3AddDiagnosticComponent } from '../stp3-add-diagnostic/stp3-add-diagnostic.component';
import { Stp1PatientSelection } from '../stp1-patient-selection/stp1-patient-selection.component';
import { Stp4AddMedicationComponent } from '../stp4-add-medication/stp4-add-medication.component';
import { onChipsSelectionEmitType } from '../../../components/chips-select/chips-select.component';
import { MatIcon } from '@angular/material/icon';
import {
  WizardHeaderComponent,
  wizardStepType,
} from '../../../components/wizard-header/wizard-header.component';
import { Stp2PatientDetailsComponent } from '../stp2-patient-details/stp2-patient-details.component';
import { Subject } from 'rxjs';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PrescriptionListComponent } from '../prescription-list/prescription-list.component';
import { PatientDto } from '../../../types/registerDTOs';
import { calculateAge } from '../../../shared/utilityFunctions';
import {
  DiagnosisDto,
  PosologyCreateDto,
  PosologyDto,
  PrescriptionCreateDto,
  PrescriptionDto,
  SymptomDto,
} from '../../../types/prescriptionDTOs';
import {
  Stp5HospitalizationComponent,
  stp5FormsValueEvent,
} from '../stp5-hospitalization/stp5-hospitalization.component';
import { filterScheduleItems } from '../../../components/schedule/schedule.component';
import { PrescriptionApiService } from '../../../services/prescription/prescription-api.service';

@Component({
  selector: 'app-add-prescription',
  standalone: true,
  imports: [
    Stp1PatientSelection,
    Stp2PatientDetailsComponent,
    Stp3AddDiagnosticComponent,
    Stp4AddMedicationComponent,
    Stp5HospitalizationComponent,
    MatIcon,
    WizardHeaderComponent,
    RouterModule,
    CommonModule,
    PrescriptionListComponent,
  ],
  templateUrl: './add-prescription.component.html',
  styleUrl: './add-prescription.component.css',
})
export class AddPrescriptionComponent {
  stepNumber: number = 1;
  stepsLimit: number = _steps.length;
  selectedDiagnosis: DiagnosisDto[] = [];
  selectedSymptoms: SymptomDto[] = [];
  newPosologies: PosologyDto[] = [];
  selectedPatient: PatientDto | undefined;
  isAddDiagnosticPageValid: boolean = false;
  isAddMedicationPageValid: boolean = true;
  ShowPrescriptionList: boolean = false;
  wizardSteps: wizardStepType[] = _steps;
  Hospitalization: stp5FormsValueEvent = { unitCare: null, diet: null };

  eventsSubject: Subject<void> = new Subject<void>();

  nextButtonContent: { label: string; class: string } = _nextButtonContent;
  backButtonContent: { label: string; class: string } = _backButtonContent;

  constructor(private prescriptionApiService: PrescriptionApiService) {}
  ngOnInit() {
    this._updateButtonsState();
  }

  handleSubmit() {
    const summary = {
      patient: this.selectedPatient,
      symptoms: this.selectedSymptoms,
      diagnosis: this.selectedDiagnosis,
      posologies: this.newPosologies,
      unitCare: this.Hospitalization.unitCare,
      diet: this.Hospitalization.diet,
    };
    //console.log(summary);
    const filteredPosologies: PosologyCreateDto[] = this.newPosologies.map(
      (posology) => {
         var x : PosologyCreateDto={
          medicationId:posology.medication.id,
          startDate:posology.startDate,
          endDate:posology.endDate,
          isPermanent:posology.isPermanent,
          comments:posology.comments,
          dispenses: filterScheduleItems(posology.dispenses),
        };
        return x;
      }
    );
    const finalPrescription: PrescriptionCreateDto = {
      //@ts-ignore im sure, on submit, patient is selected and not undefined
      registerId: this.selectedPatient.registerId,
      doctorId: '', //TODO
      diagnoses: this.selectedDiagnosis,
      symptoms: this.selectedSymptoms,
      createdAt: new Date(),
      createdBy: '',
      posologies: filteredPosologies,
      unitCareId: this.Hospitalization.unitCare?.id,
      dietId: this.Hospitalization.diet?.Id,
    };
    console.log(JSON.stringify(finalPrescription));
    this.prescriptionApiService.postPrescriptions(finalPrescription).subscribe(
      (response) => console.log(response),
      (error) => console.error(error) 
    );
  }

  validatePageSwitch = (index: number): boolean => {
    // arrow function to hold they callback context xD
    if (index > this.stepsLimit + 1) return false;
    if (index < 1) return false;
    if (index >= 1 && index == this.stepNumber) return false;
    if (index > 1 && this.selectedPatient == undefined) return false;
    if (index > 3 && !this.isAddDiagnosticPageValid) return false;
    if (index > 4 && !this.isAddMedicationPageValid) return false;
    if (index > 5) return false;
    return true;
  };

  emitFinishEventToChild() {
    this.eventsSubject.next();
  }

  handlePosologyChange(posologies: PosologyDto[]) {
    this.newPosologies = posologies;
  }

  validatePageChange(pageIndex: number, isPageValid: boolean) {
    if (pageIndex == 3) this.isAddDiagnosticPageValid = isPageValid;
    else if (pageIndex == 4) this.isAddMedicationPageValid = isPageValid;
  }

  calculateAge(dateOfB: Date | undefined | null): string {
    if (!dateOfB) return '';
    return calculateAge(dateOfB).toString();
  }

  onSelectedDiagnosisChangeHandler(
    event: onChipsSelectionEmitType<DiagnosisDto>
  ) {
    this.selectedDiagnosis = event.SelectedObjectList;
  }
  onSelectedSymptomsChangeHandler(event: onChipsSelectionEmitType<SymptomDto>) {
    this.selectedSymptoms = event.SelectedObjectList;
  }
  onClickFinish() {
    this.emitFinishEventToChild();
  }
  onSelectPatientChange(patient: PatientDto | undefined) {
    if (patient == undefined) {
      this.selectedPatient = undefined;
      this.stepNumber = 1;
    } else {
      if (this.stepNumber == 1) {
        this.SwitchToStep(2);
      }
    }
    this._updateButtonsState();
  }

  onClickNewPrescriptionEventHandler(viewPrescriptions: boolean) {
    this.ShowPrescriptionList = viewPrescriptions;
  }

  onClickViewPrescriptions() {
    this.ShowPrescriptionList = !this.ShowPrescriptionList;
  }

  HandleHospitalizationChange(event: stp5FormsValueEvent) {
    this.Hospitalization = event;
  }

  /* wizard buttons */
  SwitchToStep(index: number) {
    if (index === 0) {
      this.onSelectPatientChange(undefined);
      return;
    }

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

const _steps: wizardStepType[] = [
  {
    id: 1,
    title: 'Patient Selection',
    matIconName: '',
    iconClass: 'fa fa-list',
  },
  {
    id: 2,
    title: 'Patient Details',
    matIconName: '',
    iconClass: 'fa fa-user-md',
  },
  {
    id: 3,
    title: 'Add Diagnostic',
    matIconName: '',
    iconClass: 'fa fa-stethoscope',
  },
  {
    id: 4,
    title: 'Add Medication',
    matIconName: '',
    iconClass: 'fa fa-medkit',
  },
  {
    id: 5,
    title: 'Hospitalization',
    matIconName: '',
    iconClass: 'fa fa-hospital-o',
  },
];
