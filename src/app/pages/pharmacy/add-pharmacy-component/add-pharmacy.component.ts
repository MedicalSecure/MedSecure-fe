import { Stp2ViewCheckDrugs } from '../stp2-view-check-drugs/stp2-view-check-drugs.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MedicationType,
  Stp1ImportMapDrugs,
} from '../stp1-import-map-drugs/stp1-import-map-drugs.component';
import { MatIcon } from '@angular/material/icon';
import {
  WizardHeaderComponent,
  wizardStepType,
} from '../../../components/wizard-header/wizard-header.component';
import { Subject } from 'rxjs';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PharmacyListComponent } from '../pharmacy-list/pharmacy-list.component';
import { Stp3ConfirmUpdateDrugs } from '../stp3-confirm-update-drugs/stp3-confirm-update-drugs.component';
import { DrugDTO } from '../../../model/Drugs';
import { PrescriptonToValidateComponent } from '../prescripton-to-validate/prescripton-to-validate.component';


@Component({
  selector: 'app-add-pharmacy',
  standalone: true,
  imports: [
    Stp1ImportMapDrugs,
    Stp2ViewCheckDrugs,
    Stp3ConfirmUpdateDrugs,
    MatIcon,
    WizardHeaderComponent,
    RouterModule,
    CommonModule,
    PharmacyListComponent,
    PrescriptonToValidateComponent
  ],
  templateUrl: './add-pharmacy.component.html',
  styleUrl: './add-pharmacy.component.css',
})
export class AddPharmacyComponent implements OnInit {
  [x: string]: any;

  @ViewChild(Stp2ViewCheckDrugs)
  stp2ViewCheckDrugs!: Stp2ViewCheckDrugs;

  @ViewChild(Stp1ImportMapDrugs)
  stp1ImportMapDrugs!: Stp1ImportMapDrugs;

  mappedMedications: MedicationType[] = [];
  validDrugList: DrugDTO[] = [];

  stepNumber: number = 1;
  stepsLimit: number = _steps.length;
  ShowMedicationList: boolean = false;
  ShowPrescriptionList: boolean = true;
  wizardSteps: wizardStepType[] = _steps;
  eventsSubject: Subject<number> = new Subject<number>();

  isStep1PageValid: boolean = false;
  isStep2PageValid: boolean = false;
  isStep1PartialInsert: boolean = false;

  nextButtonContent: { label: string; class: string } = _nextButtonContent;
  backButtonContent: { label: string; class: string } = _backButtonContent;

  private hubConnection: signalR.HubConnection;


  ngOnInit() {
    this._updateButtonsState();
    this.mappedMedications;
  }
  
  ngAfterViewInit() {
    // This ensures that the view is initialized before trying to access the child component
  }


  handleDownloadButtonClick() {
    this.stp2ViewCheckDrugs.ExportExcel(); // Directly call the method in the child component
  }

  validatePageSwitch = (index: number): boolean => {
    // arrow function to hold they callback context xD
    // index is the next page we are trying to go to.

    // when click finish => index == 4 AND here steplimit ==3
    if (index >= this.stepsLimit + 2) return false;
    if (index < 1) return false;
    if (index >= 1 && index == this.stepNumber) return false;
    if (index >= 2 && !this.isStep1PageValid) return false;
    if (index >= 3 && !this.isStep2PageValid) return false;
    return true;
  };

  handlePageValidationChange(pageIndex: number, isPageValid: boolean) {
    if (pageIndex == 1) this.isStep1PageValid = isPageValid;
    if (pageIndex == 2) this.isStep2PageValid = isPageValid;

    this._updateButtonsState();
  }

  clearWizard() {
    this.stepNumber = 1;
    this.isStep1PageValid = false;
    this.isStep1PartialInsert = false;

    this.isStep2PageValid = false;
    this.nextButtonContent = _nextButtonContent;
    this.backButtonContent = _backButtonContent;
  }

  emitNextEventToChild() {
    this.eventsSubject.next(this.stepNumber);
  }

  handleCheckedDrugsEvent(mappedData: MedicationType[]) {
    console.log(mappedData);
    this.mappedMedications = mappedData;
    //this.stepNumber = 2;
  }

  handleValidDrugsEvent(validDrugList: DrugDTO[]) {
    this.validDrugList = validDrugList;
    console.log(validDrugList);
    //this.stepNumber = 3;
  }

  handleStp1AreAllCheckedDrugsValid(isPartialData: boolean) {
    this.isStep1PartialInsert = isPartialData;
    this._updateButtonsState();
  }

  onClickFinish() {
    this.clearWizard();
    this.ShowMedicationList = true;
  }

  onClickMedicationListEventHandler(viewMedications: boolean) {
    this.ShowMedicationList = viewMedications;
    if(viewMedications==true)
      this.ShowPrescriptionList = false;
  }

  onClickViewMedications() {
    this.ShowMedicationList = !this.ShowMedicationList;
  }

  onClickNewPrescriptionEventHandler(viewPrescriptions: boolean) {
    this.clearWizard();
    this.ShowPrescriptionList = viewPrescriptions;
  }

  onClickViewPrescriptions(show : boolean = true) {
    this.ShowPrescriptionList = show;
    if(show)
      this.ShowMedicationList=false;
  }

  /* wizard buttons */
  SwitchToStep(index: number) {
    //INDEX is the next page we are trying to go to.
    if (this.validatePageSwitch(index) == false) return;
    if (index > this.stepsLimit) return this.onClickFinish();

    if (index === 2 && this.stepNumber === 1)
      return this.handleSubmitStep1ThenSwitchToStep2();
    if (index === 3 && this.stepNumber === 2)
      return this.handleSubmitStep2ThenSwitchToStep3();
    this.stepNumber = index;
    this._updateButtonsState();
    return;
  }

  async handleSubmitStep1ThenSwitchToStep2() {
    let isPostMedicationSucceeded =
      await this.stp1ImportMapDrugs.handleSubmit();

    if (isPostMedicationSucceeded) {
      this.stepNumber = 2;
      this._updateButtonsState();
    }
  }

  async handleSubmitStep2ThenSwitchToStep3() {
    let isPostMedicationSucceeded =
      await this.stp2ViewCheckDrugs.handleSubmit();

    if (isPostMedicationSucceeded) {
      this.stepNumber = 3;
      this._updateButtonsState();
    }
  }

  isStepNumber(step: number): boolean {
    return this.stepNumber === step;
  }

  onPageChangeEvent(event: number, sourcePageNumber: number) {
    this.SwitchToStep(event + sourcePageNumber);
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
    if (!this.validatePageSwitch(this.stepNumber + 1)) {
      this.setNextButtonClass('', 'disabled');
    } else {
      //reset styles
      this.setNextButtonClass('', '', true);
    }
    if (this.stepNumber === 2) {
      let nextLabel: string =
        this.isStep1PartialInsert == true
          ? 'Insert Partial Data'
          : 'Insert Total Data';

      this.nextButtonContent = {
        ...this.nextButtonContent,
        label: nextLabel,
      };
    } else if (this.stepNumber == this.stepsLimit) {
      //add form is valid here before finish
      this.nextButtonContent.label = 'Finish';
    }

    if (!this.validatePageSwitch(this.stepNumber - 1)) {
      this.setBackButtonClass('', 'disabled');
    } else {
      //reset styles
      this.setBackButtonClass('', '', true);
    }
  }

}

const _nextButtonContent = {
  label: 'Data Check',
  class: 'btn btn-primary text-white',
};

const _backButtonContent = {
  label: 'back',
  class: 'btn btn-primary text-white',
};


const _steps: wizardStepType[] = [
  {
    id: 1,
    title: 'Import & Map Medications',
    matIconName: '',
    iconClass: 'fa-solid fa-file-medical',
  },
  {
    id: 2,
    title: 'Check Medications Dosages',
    matIconName: '',
    iconClass: 'fa-solid fa-eye',
  },
  {
    id: 3,
    title: 'Updated Medications',
    matIconName: '',
    iconClass: 'fa-solid fa-list-check',
  },
];
