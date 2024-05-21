import { Component, DoCheck, SimpleChanges, ViewChild } from '@angular/core';
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
import {
  filterScheduleDoses,
  filterScheduleItems,
} from '../../../components/schedule/schedule.component';
import { PrescriptionApiService } from '../../../services/prescription/prescription-api.service';
import { RegisterDto, RegisterForPrescription } from '../../../types/registerDTOs';
import { ErrorMessageComponent } from '../../../components/error-message/error-message.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { mapRegisterDtoToRegisterForPrescription } from '../../../shared/DTOsExtensions';
import { UnitCareDTO } from '../../../types/UnitCareDTOs';

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
    ErrorMessageComponent,
    MatProgressSpinnerModule
  ],
  templateUrl: './add-prescription.component.html',
  styleUrl: './add-prescription.component.css',
})
export class AddPrescriptionComponent implements DoCheck {
  @ViewChild(ErrorMessageComponent)
  errorMessageComponent!: ErrorMessageComponent;

  stepNumber: number = 1;
  stepsLimit: number = _steps.length;
  selectedDiagnosis: DiagnosisDto[] = [];
  selectedSymptoms: SymptomDto[] = [];
  newPosologies: PosologyDto[] = [];
  selectedRegister: RegisterForPrescription | undefined;
  isAddMedicationPageValid: boolean = false;
  ShowPrescriptionList: boolean = true;
  isPageLoading = false;
  wizardSteps: wizardStepType[] = _steps;
  Hospitalization: stp5FormsValueEvent = { unitCare: null, diet: null };

  eventsSubject: Subject<void> = new Subject<void>();

  nextButtonContent: { label: string; class: string } = _nextButtonContent;
  backButtonContent: { label: string; class: string } = _backButtonContent;

  constructor(private prescriptionApiService: PrescriptionApiService) {}

  ngOnInit() {
    this._updateButtonsState();
  }

  prevStepNumber: number;
  ngDoCheck(): void {
    //handle wizard changes button checks
    if (this.stepNumber !== this.prevStepNumber) {
      this._updateButtonsState();
      // Update prevStepNumber to the current value
      this.prevStepNumber = this.stepNumber;
    }
  }

  handleSubmit() {
    if (!this.selectedRegister) {
      console.error('cant submit without selecting a patient / registration');
      return;
    }
    this.isPageLoading = true;
    const summary = {
      patient: this.selectedRegister,
      symptoms: this.selectedSymptoms,
      diagnosis: this.selectedDiagnosis,
      posologies: this.newPosologies,
      unitCare: this.Hospitalization.unitCare,
      diet: this.Hospitalization.diet,
    };
    //console.log(summary);
    const filteredPosologies: PosologyCreateDto[] = this.newPosologies.map(
      (posology) => {
        var x: PosologyCreateDto = {
          medicationId: posology.medication.id,
          startDate: posology.startDate,
          endDate: posology.endDate,
          isPermanent: posology.isPermanent,
          comments: posology.comments,
          dispenses: filterScheduleDoses(posology.dispenses),
        };
        return x;
      }
    );
    let doctorIdd = '55555555-5555-5555-5555-555555555554'; //TODO

    let emptyUnitCare = {
      id: '',
      type: '',
      description: '',
      title: '',
      rooms: [],
      personnels: [],
    };

    const finalPrescription: PrescriptionCreateDto = {
      registerId: this.selectedRegister.id,
      doctorId: doctorIdd, //TODO
      diagnoses: this.selectedDiagnosis,
      symptoms: this.selectedSymptoms,
      createdAt: new Date(),
      createdBy: doctorIdd, //TODO
      posologies: filteredPosologies,
      unitCare: this.Hospitalization.unitCare ?? emptyUnitCare,
      dietId: this.Hospitalization.diet?.Id,
    };
    console.log(JSON.stringify(finalPrescription));
    this.prescriptionApiService.postPrescriptions(finalPrescription).subscribe(
      (response) => {
        this.ShowPrescriptionList = true;
        this.clearWizard();

        console.log(response);
        this.isPageLoading = false;
      },
      (error) => {
        console.error(error.status);
        console.error(error.error);
        this.displayNewErrorMessage(error.error.message);
        this.isPageLoading = false;
        this._updateButtonsState()
      }
    );
  }


  async handleUpdatePrescription({prescription,register}:{prescription:PrescriptionDto,register:RegisterDto}){
    console.log(prescription);
    this.clearWizard();
    this.ShowPrescriptionList = false;
    this.isPageLoading=true;

    this.selectedDiagnosis = prescription.diagnoses;
    this.selectedSymptoms = prescription.symptoms;
    this.newPosologies = prescription.posologies;
    this.selectedRegister = mapRegisterDtoToRegisterForPrescription(register);

    this.Hospitalization = { unitCare: await this.fetchUnitCareByBedId(prescription?.bedId), diet: null };
    this._updateButtonsState();
    this.isPageLoading=false;
  }

  async fetchUnitCareByBedId(bedId:string | null | undefined):Promise<UnitCareDTO | null>{
    return null;
  }

  displayNewErrorMessage(
    title: string,
    duration = 4,
    content: string = 'Error : '
  ) {
    this.errorMessageComponent.openSnackBar(title, duration, content);
  }

  clearWizard() {
    this.stepNumber = 1;
    this.selectedDiagnosis = [];
    this.selectedSymptoms = [];
    this.newPosologies = [];
    this.selectedRegister = undefined;
    this.isAddMedicationPageValid = false;
    this.ShowPrescriptionList = true;
    this.Hospitalization = { unitCare: null, diet: null };
    this.isPageLoading=false;
    this._updateButtonsState();
  }

  // arrow function to hold the callback context ?? xD
  validatePageSwitch = (index: number): boolean => {
    //index is the NEXT DESIRED PAGE TO SWITCH TO!

    // arrow function to hold the callback context ?? xD
    //if (index > this.stepsLimit + 1) return false;
    if(this.isPageLoading) return false;
    if (index < 1) return false;
    if (index >= 1 && index == this.stepNumber) return false;
    if (index > 1 && this.selectedRegister == undefined) return false;
    if (index > 4 && !this.isAddMedicationPageValid) return false;
    return true;
  };

  emitFinishEventToChild() {
    this.eventsSubject.next();
  }

  handlePosologyChange(posologies: PosologyDto[]) {
    this.newPosologies = posologies;
  }

  handlePageValidationChange(pageIndex: number, isPageValid: boolean) {
    //handle the event emitter from child pages, for example, the medication page will check if the required fields are filled
    //and then it will emit the make its corresponding variable isAddMedicationPageValid = true
    //this help prevent Next button clicks without valid steps!!
    if (pageIndex == 4) this.isAddMedicationPageValid = isPageValid;

    this._updateButtonsState();
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

  onSelectPatientChange(register: RegisterForPrescription | undefined) {
    if (register == undefined) {
      this.selectedRegister = undefined;
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
    if(this.isPageLoading) return;

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
    //this._updateButtonsState();
  }

  isStepNumber(step: number): boolean {
    return this.stepNumber === step;
  }

  onClickNextEvent(): void {
    this.SwitchToStep(this.stepNumber + 1);
  }
  onClickBackEvent(): void {
    this.SwitchToStep(this.stepNumber - 1);
  }

  setNextButtonClass(
    newClassNames: string,
    appendClassNames: string = '',
    resetClass = false
  ) {
    // Reset default next button classes
    if (resetClass) {
      this.nextButtonContent = { ..._nextButtonContent };
      return;
    }
    // Append to default next button classes (example add disabled)
    if (appendClassNames !== '') {
      this.nextButtonContent = {
        ..._nextButtonContent,
        class: `${_nextButtonContent.class} ${appendClassNames}`,
      };
      return;
    }
    // Set manually the whole next button classes
    this.nextButtonContent = { ..._nextButtonContent, class: newClassNames };
  }

  setBackButtonClass(
    newClassNames: string,
    appendClassNames: string = '',
    resetClass = false
  ) {
    // Reset default back button classes
    if (resetClass) {
      this.backButtonContent = { ..._backButtonContent };
      return;
    }
    // Append to default back button classes (example add disabled)
    if (appendClassNames !== '') {
      this.backButtonContent = {
        ..._backButtonContent,
        class: `${_backButtonContent.class} ${appendClassNames}`,
      };
      return;
    }
    // Set manually the whole back button classes
    this.backButtonContent = { ..._backButtonContent, class: newClassNames };
  }

  private _updateButtonsState() {
    if(this.isPageLoading){
      this.setNextButtonClass('', 'disabled');
    }
    else if (!this.validatePageSwitch(this.stepNumber + 1)) {
      this.setNextButtonClass('', 'disabled');
    } else {
      //reset styles
      this.setNextButtonClass('', '', true);
    }
    /*     if (this.selectedRegister == undefined) {
      //append disabled
      this.setNextButtonClass('', 'disabled');
    } else if (this.stepNumber == 4 && !this.isAddMedicationPageValid) {
      this.setNextButtonClass('', 'disabled');
    } else {
      //reset styles
      this.setNextButtonClass('', '', true);
    } */

    if (this.stepNumber == this.stepsLimit) {
      if (true)
        //add form is valid here before finish
        this.nextButtonContent.label = 'Finish';
    }

    if(this.isPageLoading){
      this.setBackButtonClass('', 'disabled');
    }
    else if (!this.validatePageSwitch(this.stepNumber - 1)) {
      this.setBackButtonClass('', 'disabled');
    } else {
      //reset styles
      this.setBackButtonClass('', '', true);
    }

    // if (this.stepNumber === 1) {
    //   this.setBackButtonClass('', 'disabled'); //disabled
    // } else {
    //   this.setBackButtonClass('', '', true); //reset
    // }
  }
}
const _nextButtonContent = {
  label: 'next',
  class: 'btn btn-primary text-white',
};

const _backButtonContent = {
  label: 'Previous',
  class: 'btn btn-primary text-white',
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
