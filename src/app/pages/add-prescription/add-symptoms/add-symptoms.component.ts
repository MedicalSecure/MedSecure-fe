import { Component, Input } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { DatePicker } from '../../../shared/date-picker/date-picker.component';
import { ShipsSelectComponent } from '../../../components/chips-select/chips-select.component';
import {
  DynamicMultipleSelectsComponent,
  multiSelectInputType,
} from '../../../components/dynamic-multiple-selects/dynamic-multiple-selects.component';
import { SymptomSeverityLevels } from '../../../shared/data/add-presc-consts';
import { HumanBodyViewerComponent } from '../../../components/human-body-viewer/human-body-viewer.component';

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
  ],
  templateUrl: './add-symptoms.component.html',
  styleUrl: './add-symptoms.component.css',
})
export class AddSymptomsComponent {
  @Input()
  multiSelectInputs: multiSelectInputType[] = [];

  @Input()
  multiDiagnosisSelectInputs: multiSelectInputType[] = [];

  dummyData: any[] = [
    { index: 1, label: 'test', value: '5555' },
    { index: 9, label: 'test2', value: '54545' },
    { index: 3, label: 'eeee', value: 555 },
    { index: 4, label: 'eeee22', value: ['55'] },
  ];
  selectedInputsChange(selectedInputs: string[]) {
    // Access and use the selected indexes here
    console.log('Selected inputs:', selectedInputs);
  }

  selectedChipsChange(selectedSymptoms: any[]) {
    // Access and use the selected indexes here
    console.log('Selected chips:', selectedSymptoms);
    this.multiSelectInputs = selectedSymptoms.map((item: any) => {
      return {
        index: item.index,
        label: item.label,
        options: SymptomSeverityLevels,
        isRequired: true,
      };
    });
  }
}
