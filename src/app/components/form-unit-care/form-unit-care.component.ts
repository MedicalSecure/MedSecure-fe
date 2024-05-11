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

type FormEquipment = FormGroup<{ text: FormControl<string> }>;

type FormRoom = FormGroup<{
  roomNumber: FormControl<string>;
  equipments: FormArray<FormEquipment>;
}>;



type Form = FormGroup<{
  Title:FormControl,
  Type:FormControl,
  Description:FormControl,
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
  item_id: number;
  item_text: string;
  isSelected: boolean;
  unitcareId: string;}



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
  ngOnInit() {
    this.dropdownList = [
      { item_id: 1, item_text: 'Mumbai', isSelected: false, unitcareId: "" },
      { item_id: 2, item_text: 'Bangaluru', isSelected: false, unitcareId: "" },
      { item_id: 3, item_text: 'Pune', isSelected: false, unitcareId: "" },
      { item_id: 4, item_text: 'Navsari', isSelected: false, unitcareId: "" },
      { item_id: 5, item_text: 'New Delhi', isSelected: false, unitcareId: "" },
    ];
    this.selectedItems = [
      { item_id: 3, item_text: 'Pune', isSelected: true, unitcareId: "" },
      { item_id: 4, item_text: 'Navsari', isSelected: true, unitcareId: "" },
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  unitcareId = "1";

  onItemSelect(item: any) {
    console.log("our item is", item);

  // Find the item in dropdownList with matching item_id
  const selectedItem = this.dropdownList.find(x => x.item_id === item.item_id);

  if (selectedItem) {
    selectedItem.isSelected = true;
    selectedItem.unitcareId = this.unitcareId;

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
  const deselectedItem = this.dropdownList.find(x => x.item_id === item.item_id);

  if (deselectedItem) {
      // Update isSelected and unitcareId properties of the deselected item
      deselectedItem.isSelected = false;
      deselectedItem.unitcareId = "";

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
      item.unitcareId = this.unitcareId; // Assuming unitcareId needs to be assigned to all selected items
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
      item.unitcareId = ""; // Clear unitcareId for all deselected items
  });

  // Clear selectedItems array
  this.selectedItems = [];

  // Log selected items
  console.log('Selected items:', this.selectedItems);
}


saveSelectedItems() {
  // Create a register object containing the selected items
  const registerObject = {
    UnitCare:this.unitcareId,
    Room: ["Room1", "Room2"],
    Personels: this.selectedItems
  };
  console.log('Saved Selected Items:', registerObject);
  // You can perform further actions here, such as sending the registerObject to a server or storing it locally
}

  fb = inject(NonNullableFormBuilder);
  unitCareForm: Form = this.fb.group({
    Title:'',
    Description:'',
    Type:'',
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
      text: '',
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

  onSubmit() {
    console.log('test',this.unitCareForm.getRawValue());
  }
}
