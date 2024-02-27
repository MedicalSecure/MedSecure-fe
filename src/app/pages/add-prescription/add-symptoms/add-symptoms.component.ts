import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { DatePicker } from '../../../shared/date-picker/date-picker.component';
import {
  ShipsSelectComponent,
  onChipsSelectionEmitType,
} from '../../../components/chips-select/chips-select.component';
import {
  DynamicMultipleSelectsComponent,
  multiSelectInputType,
} from '../../../components/dynamic-multiple-selects/dynamic-multiple-selects.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { HumanBodyViewerComponent } from '../../../components/human-body-viewer/human-body-viewer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-symptoms',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    DatePicker,
    ShipsSelectComponent,
    DynamicMultipleSelectsComponent,
    HumanBodyViewerComponent,
    MatDatepickerModule,
    CommonModule,
  ],
  templateUrl: './add-symptoms.component.html',
  styleUrl: './add-symptoms.component.css',
})
export class AddSymptomsComponent {
  maxSymptomsStartDate: Date = new Date();
  @Output() onSelectedDiagnosisChange =
    new EventEmitter<onChipsSelectionEmitType>();
  @Output() onPageChangeEvent = new EventEmitter<number>();

  onClickNextEvent() {
    this.onPageChangeEvent.emit(1);
  }
  onClickBackEvent(): void {
    this.onPageChangeEvent.emit(-1);
  }
  symptomsData = [
    { index: 1, label: 'Fever', value: 1 },
    { index: 2, label: 'Cough', value: 2 },
    { index: 3, label: 'Shortness of breath', value: 3 },
    { index: 4, label: 'Fatigue', value: 4 },
    { index: 5, label: 'Muscle or body aches', value: 5 },
    { index: 6, label: 'Headache', value: 6 },
    { index: 7, label: 'Sore throat', value: 7 },
    { index: 8, label: 'Loss of taste or smell', value: 8 },
    { index: 9, label: 'Congestion or runny nose', value: 9 },
    { index: 10, label: 'Nausea or vomiting', value: 10 },
    { index: 11, label: 'Diarrhea', value: 11 },
    { index: 12, label: 'Difficulty breathing', value: 12 },
    { index: 13, label: 'Chest pain or pressure', value: 13 },
    { index: 14, label: 'Confusion', value: 14 },
    { index: 15, label: 'Bluish lips or face', value: 15 },
    { index: 16, label: 'Rash', value: 16 },
    { index: 17, label: 'Chills', value: 17 },
    { index: 18, label: 'Dizziness', value: 18 },
    { index: 19, label: 'Loss of appetite', value: 19 },
    { index: 20, label: 'Difficulty sleeping', value: 20 },
  ];
  diagnosesData = [
    { index: 1, label: 'Common Cold', value: 1 },
    { index: 2, label: 'Influenza (Flu)', value: 2 },
    { index: 3, label: 'Pneumonia', value: 3 },
    { index: 4, label: 'Asthma', value: 4 },
    { index: 5, label: 'Bronchitis', value: 5 },
    { index: 6, label: 'COVID-19', value: 6 },
    { index: 7, label: 'Strep Throat', value: 7 },
    { index: 8, label: 'Urinary Tract Infection (UTI)', value: 8 },
    { index: 9, label: 'Gastroenteritis', value: 9 },
    { index: 10, label: 'Migraine', value: 10 },
    { index: 11, label: 'Diabetes', value: 11 },
    { index: 12, label: 'Hypertension (High Blood Pressure)', value: 12 },
    { index: 13, label: 'Hyperthyroidism', value: 13 },
    { index: 14, label: 'Hypothyroidism', value: 14 },
    { index: 15, label: 'Anemia', value: 15 },
    { index: 16, label: 'Allergic Rhinitis (Hay Fever)', value: 16 },
    { index: 17, label: 'Eczema', value: 17 },
    { index: 18, label: 'Psoriasis', value: 18 },
    { index: 19, label: 'Osteoarthritis', value: 19 },
    { index: 20, label: 'Rheumatoid Arthritis', value: 20 },
  ];

  constructor() {
    this.maxSymptomsStartDate.setHours(23, 59, 59, 999); // Set hours, minutes, seconds, and milliseconds
  }

  selectedSymptomsChipsChange(result: onChipsSelectionEmitType) {
    // Access and use the selected indexes here
    if (result.lastAddedItem) {
      console.log('added custom item :', result.lastAddedItem);
    } else if (result.lastSelectedItem) {
      console.log('added item from search :', result.lastSelectedItem);
    } else if (result.lastRemovedItem) {
      console.log('removed item :', result.lastRemovedItem);
    }
    console.log('updated Selected chips:', result.SelectedObjectList);
  }

  selectedDiagnosisChipsChange(result: onChipsSelectionEmitType) {
    // Access and use the selected indexes here
    if (result.lastAddedItem) {
      console.log('added custom item :', result.lastAddedItem);
    } else if (result.lastSelectedItem) {
      console.log('added item from search :', result.lastSelectedItem);
    } else if (result.lastRemovedItem) {
      console.log('removed item :', result.lastRemovedItem);
    }
    console.log('updated Selected chips:', result.SelectedObjectList);
    this.onSelectedDiagnosisChange.emit(result);
  }

  onStartDateInputChange(newDate: Date | null): void {
    console.log('selected ' + newDate);
  }
}
