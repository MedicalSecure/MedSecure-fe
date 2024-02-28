import { Component, ElementRef, ViewChild } from '@angular/core';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShipsSelectComponent, onChipsSelectionEmitType } from '../chips-select/chips-select.component';
import { personnel } from '../../personnel-data';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';




@Component({
  selector: 'app-side-rooms',
  standalone: true,
  imports: [MatListModule, MatIconModule, MatDividerModule,MatSelectModule,
    MatIcon,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ShipsSelectComponent
   ],
  templateUrl: './side-rooms.component.html',
  styleUrl: './side-rooms.component.css'
})
export class SideRoomsComponent {
  selected = '';
  description: string = '';
  form!: FormGroup;
  selectedPersonnels:any[]=[];
  i: any;
  personnels=personnel;



  equipmentData = [
    { id: 1, name: 'Equipment 1' },
    { id: 2, name: 'Equipment 2' },
    { id: 3, name: 'Equipment 3' }
  ];

  get passenger(): FormArray {
    return this.form.get('passenger') as FormArray;
  }

  addPassenger() {
    this.passenger.push(
      new FormGroup({
        roomNumber: new FormControl(''),

      })
    );
  }

  removePassenger(index: number) {
    this.passenger.removeAt(index);
  }

  constructor()
   {this.form = new FormGroup({
    passenger: new FormArray([
      new FormGroup({
        roomNumber: new FormControl(''),
      })
    ])
  });}


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
    this.selectedPersonnels=result.SelectedObjectList;

  }




}

