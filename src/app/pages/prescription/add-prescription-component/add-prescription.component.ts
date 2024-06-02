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
import { Subject, firstValueFrom } from 'rxjs';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PrescriptionListComponent } from '../prescription-list/prescription-list.component';
import {
  calculateAge,
  extractErrorMessage,
} from '../../../shared/utilityFunctions';
import {
  DiagnosisDto,
  DietForPrescriptionDTO,
  PosologyCreateDto,
  PosologyDto,
  PrescriptionCreateDto,
  PrescriptionDto,
  RegisterForPrescription,
  RegisterWithPrescriptions,
  SymptomDto,
} from '../../../types/prescriptionDTOs';
import {
  Stp5HospitalizationComponent,
  stp5FormsValueEvent,
} from '../stp5-hospitalization/stp5-hospitalization.component';
import {
  filterScheduleDoses,
} from '../../../components/schedule/schedule.component';
import { PrescriptionApiService } from '../../../services/prescription/prescription-api.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DrugService } from '../../../services/medication/medication.service';
import { UnitCareService } from '../../../services/unitCare/unit-care.service';
import { DietService } from '../../../services/diet/diet.service';
import { DietDto } from '../../../types/DietDTOs';
import { UnitCare } from '../../../model/unitCare/UnitCareData';
import { SnackBarMessagesComponent, snackbarMessageType } from '../../../components/snack-bar-messages/snack-bar-messages.component';
import { SnackBarMessagesService } from '../../../services/util/snack-bar-messages.service';

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
    SnackBarMessagesComponent,
    MatProgressSpinnerModule
  ],
  templateUrl: './add-prescription.component.html',
  styleUrl: './add-prescription.component.css',
})
export class AddPrescriptionComponent implements DoCheck {
  @ViewChild(Stp5HospitalizationComponent)
  stp5HospitalizationComponent!: Stp5HospitalizationComponent;
  @ViewChild(Stp3AddDiagnosticComponent)
  stp3AddDiagnosticComponent!: Stp3AddDiagnosticComponent;

  stepNumber: number = 1;
  stepsLimit: number = _steps.length;
  selectedDiagnosis: DiagnosisDto[] = [];
  selectedSymptoms: SymptomDto[] = [];
  newPosologies: PosologyDto[] = [];
  selectedRegister: RegisterForPrescription | undefined;
  isAddMedicationPageValid: boolean = false;
  isHospitalizationValid: boolean = false;
  ShowPrescriptionList: boolean = false;
  isPageLoading = false;
  updatingOldPrescriptionMode = false;
  wizardSteps: wizardStepType[] = _steps;
  Hospitalization: stp5FormsValueEvent = { unitCare: null, diet: null };
  HospitalizationForUpdate: stp5FormsValueEvent = { unitCare: null, diet: null };
  oldPrescriptionToUpdate: PrescriptionDto; // used only when updating a prescription
  lastCreatedPrescriptionIdFromResponse: string | undefined; // After we do the post, the new result will be saved here

  eventsSubject: Subject<void> = new Subject<void>();

  nextButtonContent: { label: string; class: string } = _nextButtonContent;
  backButtonContent: { label: string; class: string } = _backButtonContent;

  constructor(
    private prescriptionApiService: PrescriptionApiService,
    private drugService: DrugService,
    private unitCareService: UnitCareService,
    private dietService: DietService,
    private snackBarMessagesService:SnackBarMessagesService
  )
  {}

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
          medication:posology.medication,
          medicationId: posology.medication?.id ?? "no id given, impossible",
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
    let diet: DietForPrescriptionDTO | null = null;
    if (
      this.Hospitalization.unitCare != null &&
      this.Hospitalization.diet != null &&
      this.Hospitalization.diet.diets.length > 0
    ) {
      //if we have a unitCare and diets => create a diet app
      if (this.Hospitalization.diet.diets)
        diet = {
          startDate: this.Hospitalization.diet.dateRange[0],
          endDate: this.Hospitalization.diet.dateRange[1],
          dietsId: this.Hospitalization.diet.diets.map((diet) => diet.id),
        };
    }

    const finalPrescription: PrescriptionCreateDto = {
      registerId: this.selectedRegister.id,
      doctorId: doctorIdd, //TODO
      diagnoses: this.selectedDiagnosis,
      symptoms: this.selectedSymptoms,
      createdAt: new Date(),
      createdBy: doctorIdd, //TODO
      posologies: filteredPosologies,
      unitCare: this.Hospitalization.unitCare ?? null,
      diet: diet,
    };
    console.log(JSON.stringify(finalPrescription));
    //debugger;
    if (
      this.updatingOldPrescriptionMode &&
      this.oldPrescriptionToUpdate &&
      this.oldPrescriptionToUpdate.id
    ) {
      //UPDATING : PUT
      finalPrescription.id = this.oldPrescriptionToUpdate.id;
      this.prescriptionApiService.putPrescriptions(finalPrescription).subscribe(
        (response) => {
          this.ShowPrescriptionList = true;
          this.clearWizard();
          console.log(response);
          this.isPageLoading = false;
          this.lastCreatedPrescriptionIdFromResponse = response.id;

        },
        (error) => {
          console.error(extractErrorMessage(error));
          this.displayNewErrorMessage(extractErrorMessage(error));
          this.isPageLoading = false;
          this._updateButtonsState();
        }
      );
    } else {
      //Creating new one : POST
      this.prescriptionApiService
        .postPrescriptions(finalPrescription)
        .subscribe(
          (response) => {
            this.clearWizard();
            this.ShowPrescriptionList = true;
            console.log(response);
            this.isPageLoading = false;
            this.lastCreatedPrescriptionIdFromResponse = response.id;
          },
          (error) => {
            console.error(error.error);
            this.displayNewErrorMessage(error.error.message ?? error.message);
            this.isPageLoading = false;
            this._updateButtonsState();
          }
        );
    }
  }

  async handleUpdatePrescription({prescription,register,}
    : { prescription: PrescriptionDto;register: RegisterForPrescription;})
   {
    console.log(prescription);
    this.oldPrescriptionToUpdate = prescription;
    this.clearWizard();
    this.updatingOldPrescriptionMode = true;
    this.ShowPrescriptionList = false;
    this.isPageLoading = true;
    this.stepNumber = 2;
    this.selectedDiagnosis = prescription.diagnoses;
    this.selectedSymptoms = prescription.symptoms;
    this.newPosologies = await this.getMedicationDTOsById(
      prescription.posologies
    );
    this.selectedRegister = register;

    if (
      prescription?.bedId &&
      prescription.diet &&
      prescription.diet?.dietsId.length > 0
    ) {
      this.HospitalizationForUpdate = {
        unitCare: await this.fetchUnitCareByBedId(prescription?.bedId),
        diet: {
          diets: await this.fetchDietByIdList(prescription.diet?.dietsId),
          dateRange: [prescription.diet?.startDate, prescription.diet?.endDate],
        },
      };
    } else {
      this.HospitalizationForUpdate = {
        unitCare: null,
        diet: null,
      };
    }
    this._updateButtonsState();
    this.isPageLoading = false;
    //this.stp5HospitalizationComponent.insertOldHospitalizationData(this.Hospitalization)

  }

  handlePosologyChange(posologies: PosologyDto[]) {
    this.newPosologies = posologies;
  }

  async getMedicationDTOsById(
    posologies: PosologyDto[]
  ): Promise<PosologyDto[]> {
    //TODO change to get by list ids

    try {
      const response = await this.drugService
        .getMedications()
        .toPromise();
      let medications = response?.drugs.data;
      if (medications == undefined) throw new Error('medications is undefined');

      return posologies.map((posology) => {
        //@ts-ignore im sure it exists
        let medication = medications.find(
          (med) => med.id == posology.medicationId
        );
        if (!medication)
          throw new Error(
            'cant find medication with the id : ' + posology.medicationId
          );
        return {
          ...posology,
          medication: medication,
        };
      });
    } catch (error) {
      console.error('Error fetching medications:', error);
      throw error;
    }
  }

  async fetchUnitCareByBedId(
    bedId: string | null | undefined
  ): Promise<UnitCare | null> {
    if (bedId == null || bedId == undefined) {
      return null;
    }
    let response = this.unitCareService.getUnitCareByBedId(bedId);
    let unitCare = await firstValueFrom(response);
    return unitCare ?? null;
  }

  async fetchDietByIdList(
    DietIds: string[] | undefined | null
  ): Promise<DietDto[]> {
    if (DietIds == null || DietIds == undefined || DietIds.length == 0) {
      return [];
    }
    let response = this.dietService.getDietsByIdList(DietIds);
    let diet = await firstValueFrom(response);
    return diet;
  }

  displayNewErrorMessage(
    title: string,
    duration = 4,
    content: string = 'Error : '
  ) {
    this.snackBarMessagesService.displaySnackBarMessage(content,snackbarMessageType.Error,duration,true)
  }

  clearWizard() {
    this.updatingOldPrescriptionMode = false;
    this.stepNumber = 1;
    this.selectedDiagnosis = [];
    this.selectedSymptoms = [];
    this.newPosologies = [];
    this.selectedRegister = undefined;
    this.isAddMedicationPageValid = false;
    this.isHospitalizationValid = false;
    this.ShowPrescriptionList = true;
    this.Hospitalization = { unitCare: null, diet: null };
    this.isPageLoading = false;
    if(this.stp3AddDiagnosticComponent) this.stp3AddDiagnosticComponent.forceClearPage()
    if(this.stp5HospitalizationComponent) this.stp5HospitalizationComponent.forceClearPage()

    this._updateButtonsState();
  }

  // arrow function to hold the callback context ?? xD
  validatePageSwitch = (index: number): boolean => {
    //index is the NEXT DESIRED PAGE TO SWITCH TO!

    // arrow function to hold the callback context ?? xD
    //if (index > this.stepsLimit + 1) return false;
    if (this.isPageLoading) return false;
    if (index < 1) return false;
    //if we are currently updating an old prescription, we cant go back to patient select, UNTIL we deselect the current patient
    if (index == 1 && this.updatingOldPrescriptionMode) return false;
    if (index >= 1 && index == this.stepNumber) return false; //we don't have to switch to the same page (error)
    if (index > 1 && this.selectedRegister == undefined) return false;
    if (index > 4 && !this.isAddMedicationPageValid) return false;
    if (index > 5 && !this.isHospitalizationValid) return false;
    return true;
  };

  emitFinishEventToChild() {
    this.eventsSubject.next();
  }

  handlePageValidationChange(pageIndex: number, isPageValid: boolean) {
    //handle the event emitter from child pages, for example, the medication page will check if the required fields are filled
    //and then it will emit the make its corresponding variable isAddMedicationPageValid = true
    //this help prevent Next button clicks without valid steps!!
    if (pageIndex == 4) this.isAddMedicationPageValid = isPageValid;
    else if (pageIndex == 5) this.isHospitalizationValid = isPageValid;

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
      // Deselect patient => clear old wizard
      this.selectedRegister = undefined;
      this.updatingOldPrescriptionMode = false;
      this.stepNumber = 1;
      let oldShowListState = this.ShowPrescriptionList;
      this.clearWizard();
      this.ShowPrescriptionList = oldShowListState;
    } else {
      //new patient is selected
      if(this.selectedRegister != undefined){
        // doctor switched registers/patient directly (without a deselect first)
        //handle clear the wizard first (automatic deselect before preceding to select)
        this.onSelectPatientChange(undefined);
      }
      this.selectedRegister = register;
      if (this.stepNumber == 1) {
        this.SwitchToStep(2);
      }
    }
    this._updateButtonsState();
  }

  onClickNewPrescriptionEventHandler(viewPrescriptions: boolean) {
    this.clearWizard();
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
    if (this.isPageLoading) return;

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
    if (this.isPageLoading) {
      this.setNextButtonClass('', 'disabled');
    } else if (!this.validatePageSwitch(this.stepNumber + 1)) {
      this.setNextButtonClass('', 'disabled');
    } else {
      //reset styles
      this.setNextButtonClass('', '', true);
    }

    if (this.isPageLoading) {
      this.setBackButtonClass('', 'disabled');
    } else if (!this.validatePageSwitch(this.stepNumber - 1)) {
      this.setBackButtonClass('', 'disabled');
    } else {
      //reset styles
      this.setBackButtonClass('', '', true);
    }

    if (this.stepNumber == this.stepsLimit) {
      this.nextButtonContent.label = 'Finish';
    }
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
