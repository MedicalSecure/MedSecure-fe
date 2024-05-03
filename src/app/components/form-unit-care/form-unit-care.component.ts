import { Component } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import { ShipsSelectComponent, onChipsSelectionEmitType } from '../chips-select/chips-select.component';
import { personnel } from '../../personnel-data';
import {FormGroup,FormControl,FormArray,FormBuilder} from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import {MatDividerModule} from '@angular/material/divider';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-form-unit-care',
  standalone: true,
  imports: [MatSelectModule,ShipsSelectComponent,MatIconModule,
    FormsModule,CommonModule,ReactiveFormsModule,MatCheckboxModule,
    MatButtonModule,MatDividerModule,RouterModule],
  templateUrl: './form-unit-care.component.html',
  styleUrl: './form-unit-care.component.css'
})
export class FormUnitCareComponent {
       //Data
  selected = '';
  selectedPersonnels:any[]=[];
  personnels=personnel;
  form!: FormGroup;
  i: any;
  selectedRoomEquipments: any[] = [];

  equipments = this._formBuilder.group({
    Equipment1: false,
    Equipment2: false,
    Equipment3: false,
  });


  unitCareForm = new FormGroup({
    Title: new FormControl(''),
    Description: new FormControl(''),
    Type: new FormControl(''),
  });

  constructor(private _formBuilder: FormBuilder)
  {this.form = new FormGroup({
   room: new FormArray([
     new FormGroup({
       roomNumber: new FormControl(''),
     })
   ])
 });}

       //Methods


       onSubmit() {
        // TODO: Use EventEmitter with form value
        console.warn(this.unitCareForm.value);
      }
  selectedChipsChange(result: onChipsSelectionEmitType<any>) {
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


  get room(): FormArray {
    return this.form.get('room') as FormArray;
  }


  addRoom() {
    this.room.push(
      new FormGroup({
        roomNumber: new FormControl(''),

      })
    );
  }

  removeRoom(index: number) {
    this.room.removeAt(index);
  }


  selectRoomEquipments(room: any) {
    this.selectedRoomEquipments = room.equipments;
}
}



