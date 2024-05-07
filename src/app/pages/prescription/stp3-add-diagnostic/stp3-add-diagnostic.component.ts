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
  @Output() onSelectedDiagnosisChange = new EventEmitter<
    onChipsSelectionEmitType<DiagnosisDto>
  >();
  @Output() onSelectedSymptomsChange = new EventEmitter<
    onChipsSelectionEmitType<SymptomDto>
  >();
  @Output() onIsAddSymptomsPageValidChange = new EventEmitter<boolean>();

  selectedDiagnosis: DiagnosisDto[] = [];
  selectedSymptoms: SymptomDto[] = [];
  @Input() diagnosesData = [];
  @Input() symptomsData = [];

  ngOnInit() {
    this.onIsPageValidChange();
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
  }

  selectedDiagnosisChipsChange(
    result: onChipsSelectionEmitType<DiagnosisDto>,
  ) {
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
      areDiagnosisValid && areSymptomsValid,
    );
  }
}
