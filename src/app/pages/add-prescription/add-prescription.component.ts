import { Component } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AddSymptomsComponent } from './add-symptoms/add-symptoms.component';
import {
  ShipsSelectComponent,
  onChipsSelectionEmitType,
} from '../../components/chips-select/chips-select.component';
@Component({
  selector: 'app-add-prescription',
  standalone: true,
  imports: [
    MatGridListModule,
    MatProgressBarModule,
    AddSymptomsComponent,
    ShipsSelectComponent,
  ],
  templateUrl: './add-prescription.component.html',
  styleUrl: './add-prescription.component.css',
})
export class AddPrescriptionComponent {
  dummyData: any[] = [
    { index: 1, label: 'test', value: 5555, x: [] },
    { index: 9, label: 'test2', value: 54545 },
    { index: 3, label: 'eeee', value: 555 },
    { index: 4, label: 'eeee22', value: 55 },
    { index: 4, label: 'eeeegegege22', value: 55 },
  ];
  selectedChipsChange(result: onChipsSelectionEmitType) {
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
}
