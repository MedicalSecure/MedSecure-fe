import { Component, Input } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { DatePicker } from '../../shared/date-picker/date-picker.component';
import { ShipsSelectComponent, chipType } from '../../shared/chips-select/chips-select.component';
import {
  DynamicMultipleSelectsComponent,
  multiSelectInputType,
} from '../../components/dynamic-multiple-selects/dynamic-multiple-selects.component';
import { SymptomSeverityLevels } from '../../shared/data/add-presc-consts';

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
  ],
  templateUrl: './add-symptoms.component.html',
  styleUrl: './add-symptoms.component.css',
})
export class AddSymptomsComponent {
  @Input()
  multiSelectInputs: multiSelectInputType[] = [
    { label: 'Symptom1', options: SymptomSeverityLevels ,isRequired:true},
    { label: 'Symptom2', options: SymptomSeverityLevels },
  ];

  
  selectedInputsChange(selectedInputs: string[]) {
    // Access and use the selected indexes here
    console.log('Selected inputs:', selectedInputs);
  }

  selectedChipsChange(selectedSymptoms: chipType[]) {
    // Access and use the selected indexes here
    //console.log('Selected chips:', selectedSymptoms);
  }
}
