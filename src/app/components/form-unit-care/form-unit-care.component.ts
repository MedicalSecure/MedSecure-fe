import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { UnitCareService } from '../../services/unitCare/unit-care.service';
import { UnitCare } from '../../model/unitCare/UnitCareData';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

// Interface for personnel information (assuming basic structure)

type FormEquipment = FormGroup<{
  name: FormControl<string>;
  reference: FormControl<string>;
  eqStatus: FormControl<string>;
  eqType: FormControl<string>;
}>;

type FormRoom = FormGroup<{
  roomNumber: FormControl<string>;
  status: FormControl<string>;
  equipments: FormArray<FormEquipment>;
}>;

type Form = FormGroup<{
  title: FormControl;
  type: FormControl;
  description: FormControl;
  unitStatus:FormControl;
  rooms: FormArray<FormRoom>;
  personnels: FormArray<any>;
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
  shift: number;
}

@Component({
  selector: 'app-form-unit-care',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    MatDividerModule,
    MatIconModule,
    NgMultiSelectDropDownModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './form-unit-care.component.html',
  styleUrl: './form-unit-care.component.css',
  encapsulation: ViewEncapsulation.None, // Add this line
})
export class FormUnitCareComponent implements OnInit {
  dropdownList: DropdownItem[] = [];
  selectedItems: DropdownItem[] = [];
  dropdownSettings: IDropdownSettings = {};

  constructor(public unitcare: UnitCareService, private router: Router) {}

  ngOnInit() {
    this.dropdownList = [
      { name: 'olivia', gender: 2, isSelected: false, shift: 1 },
      { name: 'emily', gender: 2, isSelected: false, shift: 2 },
      { name: 'make', gender: 1, isSelected: false, shift: 3 },
      { name: 'sami', gender: 1, isSelected: false, shift: 1 },
      { name: 'lucy', gender: 2, isSelected: false, shift: 2 },
    ];

    this.selectedItems = [
      { name: 'olivia', gender: 2, isSelected: true, shift: 1 },
      { name: 'emily', gender: 2, isSelected: true, shift: 2 },
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'name',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
  }

  onItemSelect(item: any) {
    console.log('our item is', item);

    // Find the item in dropdownList with matching item_id
    const selectedItem = this.dropdownList.find((x) => x.name === item.name);

    if (selectedItem) {
      selectedItem.isSelected = true;

      // Update personnels form array
      const personnelArray = this.unitCareForm.get('personnels') as FormArray;
      personnelArray.push(new FormControl(selectedItem));

      console.log(
        'Selected items:',
        this.dropdownList.filter((x) => x.isSelected)
      );
    } else {
      console.log('Item not found in dropdownList');
    }
  }

  onItemDeSelect(item: any) {
    // Find the item in dropdownList with matching item_id
    const deselectedItem = this.dropdownList.find((x) => x.name === item.N);

    if (deselectedItem) {
      // Update isSelected and unitcareId properties of the deselected item
      deselectedItem.isSelected = false;

      // Logging the selected items
      console.log(
        'Selected items:',
        this.dropdownList.filter((x) => x.isSelected)
      );
    } else {
      console.log('Item not found in dropdownList');
    }
  }

  onSelectAll(items: any) {
    // Update isSelected property of all items to true
    this.dropdownList.forEach((item) => {
      item.isSelected = true;
    });

    // Update selectedItems array with all items
    this.selectedItems = [...this.dropdownList];

    // Log selected items
    console.log('Selected items:', this.selectedItems);
  }

  onDeSelectAll() {
    // Update isSelected property of all items to false
    this.dropdownList.forEach((item) => {
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
    title: '',
    description: '',
    type: '',
    unitStatus:'',
    rooms: this.fb.array<FormRoom>([this.generateRoom()]),
    personnels: this.fb.array<any>([]),
  });

  generateRoom(): FormRoom {
    return this.fb.group({
      roomNumber: '',
      status:'',
      equipments: this.fb.array<FormEquipment>([]),
    });
  }

  addRoom(): void {
    this.unitCareForm.controls.rooms.push(this.generateRoom());
  }
  removeRoom(roomIndex: number): void {
    console.log('tt', roomIndex);
    this.unitCareForm.controls.rooms.removeAt(roomIndex);
  }

  addEquipment(roomIndex: number): void {
    const newEquipment: FormEquipment = this.fb.group({
      name: '',
      reference: '',
      eqStatus: '',
      eqType: '',
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
  UnitCare: UnitCare | any;
  onSubmit() {
    console.log('test', this.unitCareForm.value);

    if (this.unitCareForm.valid) {
      this.UnitCare = this.unitCareForm.value;


      let mappedUnitCare = this.UnitCare;
      mappedUnitCare.unitStatus=this.tryParseNumber(this.UnitCare.unitStatus)
      mappedUnitCare.rooms = mappedUnitCare.rooms.map((room: any) => {
        return {
          ...room,
          status:this.tryParseNumber(room.status),
          equipments: room.equipments.map((equipment: any) => {
            return {
              ...equipment,
              eqStatus: this.tryParseNumber(equipment.eqStatus),
              eqType: this.tryParseNumber(equipment.eqType),
            };
          }),
        };
      });

      console.log(mappedUnitCare);

      this.unitcare.postUnitCare(mappedUnitCare).subscribe(
        (response) => {
          console.log('Backend response:', response);
          this.router.navigate(['unit-care']);
        },
        (error) => {
          console.error('Error submitting data:', error);
        }
      );
    } else {
      console.error('Form is invalid!');
    }
  }

  tryParseNumber(input: string): number {
    try {
      let result = parseInt(input);
      if (isNaN(result)) return 0;
      return result;
    } catch (error) {
      return 0;
    }
  }

  resetForm() {
    this.unitCareForm.reset(); // Reset the form to its initial values
  }

  setTypeValue(event: any) {
    const selectedValue = event.target.value;
    console.log(selectedValue);
    // You can then assign it to any variable or pass it to a function as needed.
  }
}
