import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { NumbersOnlyDirective } from './numbers-only.directive';
import { MatIcon } from '@angular/material/icon';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@Component({
  selector: 'app-add-unit-care-dialog',
  standalone: true,
  imports: [
    MatSelectModule,
    MatIcon,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NumbersOnlyDirective,
  ],
  templateUrl: './add-unit-care-dialog.component.html',
  styleUrl: './add-unit-care-dialog.component.css',
})



export class AddUnitCareDialogComponent {
  selected = '';
  title: string = '';
  description: string = '';
  FormData!: FormGroup;
  imageControl = new FormControl();

  i: any;

  constructor(
    private builder: FormBuilder,
    public dialogRef: MatDialogRef<AddUnitCareDialogComponent>,


  )
   {}

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSubmit(formData: any): void {
    this.dialogRef.close({ title: this.title, description: this.description });
  }

  ngOnInit() {
    this.FormData = this.builder.group({
      rooms: this.builder.array([this.builder.control(null)]),
    });
  }

  addItem() {
    (this.FormData.get('rooms') as FormArray).push(this.builder.control(null));
  }
  deleteItem(index: any) {
    (this.FormData.get('rooms') as FormArray).removeAt(index);
  }

  getRooms(): AbstractControl[] {
    return (<FormArray>this.FormData.get('rooms')).controls;
  }
}
