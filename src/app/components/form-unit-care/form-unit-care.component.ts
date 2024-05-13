import { Component, OnInit, inject } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { UnitCareService } from '../../services/unit-care.service';
import { UnitCare } from '../../model/UnitCareData';



// Interface for personnel information (assuming basic structure)

type FormEquipment = FormGroup<{

    name: FormControl<string>;
    reference: FormControl<string>;
    eqStatus: FormControl<number>;
    eqType: FormControl<number>;
  }>;


type FormRoom = FormGroup<{

  roomNumber: FormControl<string>;
  equipments: FormArray<FormEquipment>;
}>;



type Form = FormGroup<{
  title:FormControl,
  type:FormControl,
  description:FormControl,
  rooms: FormArray<FormRoom>;
  personnels:FormArray<any>;
}>;

export interface IDropdownSettings {
  singleSelection?: boolean;
  idField?: string;
  textField?: string;
  selectAllText?: string;
  unSelectAllText?: string;
  itemsShowLimit?: number;
  allowSearchFilter?: boolean;
}

export interface DropdownItem {
  name: string;
  gender: number;
  isSelected: boolean;
  shift:number}



@Component({
  selector: 'app-form-unit-care',
  standalone: true,
  imports: [ReactiveFormsModule,RouterModule,MatDividerModule,MatIconModule,NgMultiSelectDropDownModule],
  templateUrl: './form-unit-care.component.html',
  styleUrl: './form-unit-care.component.css'
})
export class FormUnitCareComponent  implements OnInit {
  dropdownList: DropdownItem[] = [];
  selectedItems: DropdownItem[] = [];
  dropdownSettings: IDropdownSettings = {};

  constructor(public unitcare : UnitCareService) { }

  ngOnInit() {
    this.dropdownList = [

        { name: 'olivia', gender: 2, isSelected: false, shift: 1 },
        { name: 'emily', gender: 2, isSelected: false, shift: 2 },
        { name: 'make', gender: 1, isSelected: false, shift: 3 },
        { name: 'sami', gender: 1, isSelected: false, shift: 1 },
        { name: 'lucy', gender: 2, isSelected: false, shift: 2 },
      ];


    this.selectedItems = [
      { name: 'olivia', gender: 2, isSelected: true, shift:  1},
      { name: 'emily', gender: 2, isSelected: true, shift: 2 },
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'name',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }



  onItemSelect(item: any) {
    console.log("our item is", item);

  // Find the item in dropdownList with matching item_id
  const selectedItem = this.dropdownList.find(x => x.name === item.name)

  if (selectedItem) {
    selectedItem.isSelected = true;


    // Update personnels form array
    const personnelArray = this.unitCareForm.get('personnels') as FormArray;
    personnelArray.push(new FormControl(selectedItem));

    console.log('Selected items:', this.dropdownList.filter(x => x.isSelected));
  } else {
    console.log('Item not found in dropdownList');
  }
}

onItemDeSelect(item: any) {
  console.log("our item is", item);

  // Find the item in dropdownList with matching item_id
  const deselectedItem = this.dropdownList.find(x => x.name === item.N);

  if (deselectedItem) {
      // Update isSelected and unitcareId properties of the deselected item
      deselectedItem.isSelected = false;


      // Logging the selected items
      console.log('Selected items:', this.dropdownList.filter(x => x.isSelected));
  } else {
      console.log('Item not found in dropdownList');
  }
}



onSelectAll(items: any) {
  // Update isSelected property of all items to true
  this.dropdownList.forEach(item => {
      item.isSelected = true;

  });

  // Update selectedItems array with all items
  this.selectedItems = [...this.dropdownList];

  // Log selected items
  console.log('Selected items:', this.selectedItems);
}

onDeSelectAll() {
  // Update isSelected property of all items to false
  this.dropdownList.forEach(item => {
      item.isSelected = false;

  });

  // Clear selectedItems array
  this.selectedItems = [];

  // Log selected items
  console.log('Selected items:', this.selectedItems);
}

// the form

  fb = inject(NonNullableFormBuilder);
  unitCareForm: Form = this.fb.group({
    title:'',
    description:'',
    type:'',
    rooms: this.fb.array<FormRoom>([this.generateRoom()]),
    personnels: this.fb.array<any>([])

  });


  generateRoom(): FormRoom {
    return this.fb.group({
      roomNumber: '',
      equipments: this.fb.array<FormEquipment>([]),
    });
  }

  addRoom(): void {
    this.unitCareForm.controls.rooms.push(this.generateRoom());
  }

  removeRoom(roomIndex: number): void {
    this.unitCareForm.controls.rooms.removeAt(roomIndex);
  }


  addEquipment(roomIndex: number): void {
    const newEquipment: FormEquipment = this.fb.group({
      name: '',
      reference: '',
      eqStatus: 1,
      eqType: 2
    });
    this.unitCareForm.controls.rooms
      .at(roomIndex)
      ?.controls?.equipments?.push(newEquipment);
  }

  removeEquipment(roomIndex: number, equipmentIndex: number): void {
    this.unitCareForm.controls.rooms
      .at(roomIndex)
      ?.controls?.equipments?.removeAt(equipmentIndex);
  }
  UnitCare : UnitCare | any;
  onSubmit() {
    console.log("test",this.unitCareForm.value)
    console.log("test 2",this.unitCareForm.valid)
    if (this.unitCareForm.valid) {

       this.UnitCare = this.unitCareForm.value;

      this.unitcare.postUnitCare(this.UnitCare)
        .subscribe(response => {
          console.log('Backend response:', response);
        }, error => {
          console.error('Error submitting data:', error);
        });
    } else {
      console.error('Form is invalid!');

    }
  }

}
