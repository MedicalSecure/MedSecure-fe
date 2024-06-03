import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import {
  ShipsSelectComponent,
  handleForcedSuggestionsAction,
  onChipsSelectionEmitType,
} from '../../../components/chips-select/chips-select.component';
import {
  HumanBodyViewerComponent,
  onFilterChangeEventType,
} from '../human-body-viewer/human-body-viewer.component';
import { CommonModule } from '@angular/common';

import { Stp2PatientDetailsComponent } from '../stp2-patient-details/stp2-patient-details.component';
import { DiagnosisDto, SymptomDto } from '../../../types/prescriptionDTOs';
import { PrescriptionApiService } from '../../../services/prescription/prescription-api.service';

@Component({
  selector: 'app-stp3-add-diagnostic',
  standalone: true,
  templateUrl: './stp3-add-diagnostic.component.html',
  styleUrl: './stp3-add-diagnostic.component.css',
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
  @Input()
  diagnosesData: DiagnosisDto[] = [];
  @Input()
  symptomsData: SymptomDto[] = [];


  @Input() updatingOldPrescriptionMode=false;
  @Input()
  updateInitialData:{symptoms:SymptomDto[],diagnosis:DiagnosisDto[]} = {symptoms:[],diagnosis:[]}

  @ViewChild(ShipsSelectComponent<SymptomDto>)
  SymptomsSelectComponent: ShipsSelectComponent<SymptomDto>;

  symptomsCodeByBodyPart = symptomsCodeByBodyPart;
  selectedDiagnosis: DiagnosisDto[] = [];
  selectedSymptoms: SymptomDto[] = [];
  minimumSymptomsForPrediction: number = 3;
  continuePredicting: boolean = true;
  isFilteringEnabled: boolean = false;

  selectedBodyParts: string[] = [];

  isSymptomsLoading = true;
  isDiagnosisLoading = true;

  constructor(private prescriptionService: PrescriptionApiService) {}

  ngOnInit() {
    this.onIsPageValidChange();
    this.fetchSymptoms();
    this.fetchDiagnosis();

    if(this.updatingOldPrescriptionMode){
      this.selectedSymptoms=[...this.updateInitialData.symptoms];
      this.selectedDiagnosis=[...this.updateInitialData.diagnosis];
    }
  }

  forceClearPage(){
    this.selectedDiagnosis = [];
    this.selectedSymptoms = [];
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
      this.minimumSymptomsForPrediction <= this.selectedSymptoms.length &&
      this.continuePredicting;
    if (predictCondition) this.predictDiagnosis(result.SelectedObjectList);
  }

  selectedDiagnosisChipsChange(result: onChipsSelectionEmitType<DiagnosisDto>) {
    this.continuePredicting = false;
    if (result.SelectedObjectList.length === 0) {
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
      (response) => {
        this.symptomsData = response.symptom.data;
      },
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
        if(!response.predictedDiagnosis) return;
        //add to existing! it may continue adding to infinity, also risk adding without doctor notice
        //let uniqueSelectedDiagnosis=new Set<DiagnosisDto>([...this.selectedDiagnosis,response.predictedDiagnosis]);
        //this.selectedDiagnosis = Array.from(uniqueSelectedDiagnosis)

        //replace existing !! safer with the disabling algo
        this.selectedDiagnosis = [response.predictedDiagnosis];

        //shake the input
        this.triggerShakeAnimation();

        console.log('new prediction');
        console.log(response.predictedDiagnosis);
        this.onSelectedDiagnosisChange.emit({
          SelectedObjectList:this.selectedDiagnosis,
        });
      },
      (error) => console.error(error),
      () => (this.isDiagnosisLoading = false)
    );
  }

  triggerShakeAnimation() {
    if (this.isDiagnosisLoading) {
      const element = document.getElementById(
        'diagnosis-chips-select-container'
      );
      if (element) {
        element.classList.add('shake-animation');
        setTimeout(() => {
          element.classList.remove('shake-animation');
        }, 100); // Adjust this value to match the animation duration
      }
    }
  }

  onSelectedBodyPartsChange(selectedParts: Set<string>) {
    this.selectedBodyParts = Array.from(selectedParts);
    if (selectedParts.size == 0) {
      //last selected part of body is unselected
      //Or deselect all button is clicked
      let params: handleForcedSuggestionsAction<SymptomDto> = {
        newFilteredData: this.symptomsData,
        keepFilterAfterSelection: false,
        forceReset: true,
      };
      this.SymptomsSelectComponent.handleForcedSuggestions(params);
      this.isFilteringEnabled = false;
      return;
    }
    //still some parts are selected
    let forceReset = false;
    let symptoms: SymptomDto[] =
      this.getFilteredSymptomsBySelectedBodyParts(selectedParts);

    let params: handleForcedSuggestionsAction<SymptomDto> = {
      newFilteredData: symptoms,
      keepFilterAfterSelection: true,
      forceReset: forceReset,
    };
    this.SymptomsSelectComponent.handleForcedSuggestions(params);
    this.isFilteringEnabled = true;
  }

  handleIsFilteringEnabledChange(newValues: onFilterChangeEventType) {
    let newState = newValues.isFilterEnabled;
    let selectedBodyParts = newValues.selectedParts;
    this.isFilteringEnabled = newState;
    let forceReset = false;
    let symptoms: SymptomDto[] = [];
    if (newState == true) {
      if (selectedBodyParts.size === 0) {
        symptoms = this.symptomsData;
      } else {
        symptoms =
          this.getFilteredSymptomsBySelectedBodyParts(selectedBodyParts);
      }
    } else {
      symptoms = this.symptomsData;
      forceReset = true;
    }

    let params: handleForcedSuggestionsAction<SymptomDto> = {
      newFilteredData: symptoms,
      keepFilterAfterSelection: true,
      forceReset: forceReset,
    };
    this.SymptomsSelectComponent.handleForcedSuggestions(params);
  }

  getFilteredSymptomsBySelectedBodyParts(
    selectedBodyParts: Set<string>
  ): SymptomDto[] {
    let filteredSymptomsSet = new Set<SymptomDto>();

    selectedBodyParts.forEach((bodyPartName) => {
      let correspondentSymptomsCodes =
        this.symptomsCodeByBodyPart[bodyPartName];

      //can return duplicates in the result
      let correspondentSymptoms = this.getSymptomsFromCodes(
        correspondentSymptomsCodes
      );
      correspondentSymptoms.forEach((symptom) =>
        filteredSymptomsSet.add(symptom)
      );
    });

    //the set is to filter duplicates
    let filteredSymptoms: SymptomDto[] = Array.from(filteredSymptomsSet);
    return filteredSymptoms;
  }

  getSymptomsFromCodes(codes: number[]): SymptomDto[] {
    //can return duplicates in the result
    let result: SymptomDto[] = [];
    this.symptomsData.forEach((symptom) => {
      try {
        //compare as numbers
        let code = parseInt(symptom.code);
        if (codes.includes(code)) result.push(symptom);
      } catch (error) {
        console.log(error);
        //compare as strings
        let codesString = codes.map((code) => code.toString());
        if (codesString.includes(symptom.code)) result.push(symptom);
      }
    });
    return result;
  }

}

export const symptomsCodeByBodyPart: { [key: string]: number[] } = {
  Head: [31, 53, 36, 9, 88],
  Neck: [71, 81, 63],
  Chest: [24, 27, 56, 108, 107, 118],
  'Right Hand': [82, 83, 85, 86, 87, 80],
  'Left Hand': [82, 83, 85, 86, 87, 80],
  Abdomen: [38, 39, 44, 114, 117, 113, 100, 92, 103, 115, 7, 73, 119, 106],
  Pelvis: [38, 39, 46, 47, 60, 59, 61],
  'Right Leg': [78, 79, 80, 121, 120],
  'Left Leg': [78, 79, 80, 121, 120],
  Back: [37],
  Buttocks: [],
  Skin: [
    1, 2, 4, 5, 0, 32, 131, 99, 125, 66, 102, 129, 126, 130, 128, 127, 123,
  ],
};
