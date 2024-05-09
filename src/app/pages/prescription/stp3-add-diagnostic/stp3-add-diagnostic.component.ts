import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import {
  ShipsSelectComponent,
  onChipsSelectionEmitType,
} from '../../../components/chips-select/chips-select.component';
import { HumanBodyViewerComponent } from '../human-body-viewer/human-body-viewer.component';
import { CommonModule } from '@angular/common';

import { Stp2PatientDetailsComponent } from '../stp2-patient-details/stp2-patient-details.component';
import { DiagnosisDto, SymptomDto } from '../../../types/prescriptionDTOs';
import { PrescriptionApiService } from '../../../services/prescription/prescription-api.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-stp3-add-diagnostic',
  standalone: true,
  templateUrl: './stp3-add-diagnostic.component.html',
  styleUrl: './stp3-add-diagnostic.component.css',
  animations: [
    trigger('loadingAnimation', [
      state('true', style({ opacity: 1 })),
      state('false', style({ opacity: 0 })),
      transition('false <=> true', animate('300ms ease-in-out')),
    ]),
  ],
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ShipsSelectComponent,
    HumanBodyViewerComponent,
    CommonModule,
    Stp2PatientDetailsComponent,
  ],
})
export class Stp3AddDiagnosticComponent {
  @Input() minimumRequiredSymptoms: number = 0;
  @Input() minimumRequiredDiagnosis: number = 0;
  @Output()
  onSelectedDiagnosisChange = new EventEmitter<
    onChipsSelectionEmitType<DiagnosisDto>
  >();
  @Output()
  onSelectedSymptomsChange = new EventEmitter<
    onChipsSelectionEmitType<SymptomDto>
  >();
  @Output()
  onIsAddSymptomsPageValidChange = new EventEmitter<boolean>();

  selectedDiagnosis: DiagnosisDto[] = [];
  selectedSymptoms: SymptomDto[] = [];
  @Input()
  diagnosesData: DiagnosisDto[] = [];
  @Input()
  symptomsData: SymptomDto[] = [];

  minimumSymptomsForPrediction: number = 3;
  continuePredicting: boolean = true;

  isSymptomsLoading = true;
  isDiagnosisLoading = true;

  constructor(private prescriptionService: PrescriptionApiService) {}

  ngOnInit() {
    this.onIsPageValidChange();
    this.fetchSymptoms();
    this.fetchDiagnosis();
  }

  selectedSymptomsChipsChange(result: onChipsSelectionEmitType<SymptomDto>) {
    // Access and use the selected indexes here
    if (result.lastAddedItem) {
      console.log('added custom item :', result.lastAddedItem);
    } else if (result.lastSelectedItem) {
      console.log('added item from search :', result.lastSelectedItem);
    } else if (result.lastRemovedItem) {
      console.log('removed item :', result.lastRemovedItem);
    }
    console.log('updated Selected chips:', result.SelectedObjectList);
    this.selectedSymptoms = result.SelectedObjectList;
    this.onIsPageValidChange();
    this.onSelectedSymptomsChange.emit(result);
    const predictCondition =
      this.minimumSymptomsForPrediction <= this.selectedSymptoms.length && this.continuePredicting;
    if (predictCondition) this.predictDiagnosis(result.SelectedObjectList);
  }

  selectedDiagnosisChipsChange(result: onChipsSelectionEmitType<DiagnosisDto>) {
    this.continuePredicting = false;
    if (result.SelectedObjectList.length ===0) {
      //if its empty, continue predicting
      this.continuePredicting = true;
    }
    //debugger;
    // Access and use the selected indexes here
    if (result.lastAddedItem) {
      console.log('added custom item :', result.lastAddedItem);
    } else if (result.lastSelectedItem) {
      console.log('added item from search :', result.lastSelectedItem);
    } else if (result.lastRemovedItem) {
      console.log('removed item :', result.lastRemovedItem);
    }
    console.log('updated Selected chips:', result.SelectedObjectList);
    this.selectedDiagnosis = result.SelectedObjectList;
    this.onIsPageValidChange();
    this.onSelectedDiagnosisChange.emit(result);
  }

  onIsPageValidChange() {
    const areDiagnosisValid =
      this.selectedDiagnosis.length >= this.minimumRequiredDiagnosis;
    const areSymptomsValid =
      this.selectedSymptoms.length >= this.minimumRequiredSymptoms;
    this.onIsAddSymptomsPageValidChange.emit(
      areDiagnosisValid && areSymptomsValid
    );
  }

  fetchSymptoms() {
    this.isSymptomsLoading = true;
    this.prescriptionService.getSymptoms(0, 200).subscribe(
      (response) => (this.symptomsData = response.symptom.data),
      (error) => console.error(error),
      () => (this.isSymptomsLoading = false)
    );
  }

  fetchDiagnosis() {
    this.isDiagnosisLoading = true;
    this.prescriptionService.getDiagnosis(0, 200).subscribe(
      (response) => {
        this.diagnosesData = response.diagnosis.data;
      },
      (error) => console.error(error),
      () => (this.isDiagnosisLoading = false)
    );
  }

  predictDiagnosis(symptoms: SymptomDto[]) {
    this.isDiagnosisLoading = true;
    this.prescriptionService.getPredictedDiagnosis(symptoms).subscribe(
      (response) => {
        //add to existing!
        //this.selectedDiagnosis = [...this.selectedDiagnosis,response.predictedDiagnosis]

        //replace existing !!
        this.selectedDiagnosis = [response.predictedDiagnosis];

        //shake the input
        this.triggerShakeAnimation()

        console.log("new prediction")
        console.log(response.predictedDiagnosis)
      },
      (error) => console.error(error),
      () => (this.isDiagnosisLoading = false)
    );
  }


  triggerShakeAnimation() {
    if (this.isDiagnosisLoading) {
      const element = document.getElementById('diagnosis-chips-select-container');
      if (element) {
        element.classList.add('shake-animation');
        setTimeout(() => {
          element.classList.remove('shake-animation');
        }, 100); // Adjust this value to match the animation duration
      }
    }
  }
}
