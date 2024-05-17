import { Component, OnInit } from '@angular/core';
import {
  MedicationType,
  Stp1ImportMedications
} from '../stp1-import-medications/stp1-import-medications.component';
import { MatIcon } from '@angular/material/icon';
import {
  WizardHeaderComponent,
  wizardStepType,
} from '../../../components/wizard-header/wizard-header.component';
import { Stp2MapMedicationsComponent } from '../stp2-map-medications/stp2-map-medications.component';
import { Subject } from 'rxjs';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PharmacyListComponent } from '../pharmacy-list/pharmacy-list.component';

@Component({
  selector: 'app-add-prescription',
  standalone: true,
  imports: [
    Stp1ImportMedications,
    MatIcon,
    WizardHeaderComponent,
    Stp2MapMedicationsComponent,
    RouterModule,
    CommonModule,
    PharmacyListComponent,
  ],
  templateUrl: './add-pharmacy.component.html',
  styleUrl: './add-pharmacy.component.css',
})
export class AddPharmacyComponent implements OnInit {
[x: string]: any;

  mappedMedications: MedicationType[]=[];

  stepNumber: number = 1;
  stepsLimit: number = _steps.length;
  ShowMedicationList: boolean = false;
  selectedFile : MedicationType[] | undefined;
  wizardSteps: wizardStepType[] = _steps;

  eventsSubject: Subject<number> = new Subject<number>();

  nextButtonContent: { label: string; class: string } = _nextButtonContent;
  backButtonContent: { label: string; class: string } = _backButtonContent;

  ngOnInit() {
    this._updateButtonsState();
  }
  

  validatePageSwitch = (index: number): boolean => {
    // arrow function to hold they callback context xD
    if (index > this.stepsLimit + 1) return false;
    if (index < 1) return false;
    if (index >= 1 && index == this.stepNumber) return false;
    //if (index > 1 && this.selectedFile == undefined) return false;
    return true;
  };

  emitNextEventToChild() {
    this.eventsSubject.next(this.stepNumber);
  }

  handleMapMedications(mappedData: MedicationType[]) {

    console.log(mappedData);
    this.mappedMedications = mappedData;
    
  }

  onClickFinish() {
    //this.emitFinishEventToChild();
  }
  onSelectMedicationChange(file: any | undefined) {
    if (file == undefined) {
      this.selectedFile = undefined;
      this.stepNumber = 1;
    } else {
      if (this.stepNumber == 1) {
        this.SwitchToStep(2);
      }
    }
    this._updateButtonsState();
  }

  onClickNewPrescriptionEventHandler(viewMedications: boolean) {
    this.ShowMedicationList = viewMedications;
  }

  onClickViewMedications() {
    this.ShowMedicationList = !this.ShowMedicationList;
  }

  /* wizard buttons */
  SwitchToStep(index: number) {
    // if (index === 0) {
    //   this.onSelectMedicationChange(undefined);
    //   return;
    // }

    // if (index === this.stepsLimit + 1) {
    //   this.onClickFinish();
    //   return;
    // }
    if (this.validatePageSwitch(index) == false) return;
    // this.stepNumber = index; TODO AYMEN
    this._updateButtonsState();
  }

  isStepNumber(step: number): boolean {
    return this.stepNumber === step;
  }

  onPageChangeEvent(event: number, sourcePageNumber: number) {
    this.SwitchToStep(event + sourcePageNumber);
  }

  onClickNextEvent(): void {
    this.emitNextEventToChild();
    this.SwitchToStep(this.stepNumber + 1);

  }
  onClickBackEvent(): void {
    this.SwitchToStep(this.stepNumber - 1);

  }
  setNextButtonStyle(event: { label: string; class: string }) {
    this.nextButtonContent = event;
  }
  setBackButtonStyle(event: { label: string; class: string }) {
    this.nextButtonContent = event;
  }

  private _updateButtonsState() {
    if (this.selectedFile == undefined) {
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
  label: 'Data Check',
  class: 'btn w-100 m-0 btn-success fs-6 text-white',
};

const _backButtonContent = {
  label: 'back',
  class: 'btn w-100 m-0 btn-warning fs-6 text-white',
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
    iconClass:'fa-solid fa-eye',
  },
  {
    id: 3,
    title: 'Updated Medications',
    matIconName: '',
    iconClass: 'fa-solid fa-list-check',
  }
];
