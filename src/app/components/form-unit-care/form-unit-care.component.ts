import { Component, inject } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';

type FormEquipment = FormGroup<{ text: FormControl<string> }>;

type FormRoom = FormGroup<{
  roomNumber: FormControl<string>;
  equipments: FormArray<FormEquipment>;
}>;

type FormPersonnel=FormGroup<{
  name: FormControl<string>;

}>;

type Form = FormGroup<{
  Title:FormControl,
  Type:FormControl,
  Description:FormControl,
  rooms: FormArray<FormRoom>;
  personnels:FormArray<FormPersonnel>;
}>;




@Component({
  selector: 'app-form-unit-care',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-unit-care.component.html',
  styleUrl: './form-unit-care.component.css'
})
export class FormUnitCareComponent {
  
  fb = inject(NonNullableFormBuilder);
  unitCareForm: Form = this.fb.group({
    Title:'',
    Description:'',
    Type:'',
    rooms: this.fb.array<FormRoom>([this.generateRoom()]),
    personnels: this.fb.array<FormPersonnel>([this.generatePersonnel()]),
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


  generatePersonnel(): FormPersonnel {
    return this.fb.group({
      name: '',

    });
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
    console.log(this.unitCareForm.getRawValue());
  }
}
