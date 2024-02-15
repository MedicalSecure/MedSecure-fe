import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { NumbersOnlyDirective } from '../add-unit-care-dialog/numbers-only.directive';
import {ThemePalette} from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DataService } from '../data.service';
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
    MatAutocompleteModule,
    MatSelectModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NumbersOnlyDirective
  ],
  templateUrl: './add-unit-care-dialog.component.html',
  styleUrl: './add-unit-care-dialog.component.css',
})
export class AddUnitCareDialogComponent {
  title: string = '';
  description: string = '';
  FormData!:FormGroup
  colorControl = new FormControl('primary' as ThemePalette);
  imageControl = new FormControl();
  staticImages: string[] = [
    'https://material.angular.io/assets/img/examples/shiba1.jpg',
    'https://emploi.ouest-france.fr/sites/default/files/styles/originale/public/fiches_metiers/414_200252901.jpg?itok=eUsFD33s',
    'https://material.angular.io/assets/img/examples/shiba1.jpg',
    // Add more images here as needed
  ];

  selectedImage!: string; // Variable to store the selected image

  constructor(
    private builder: FormBuilder,public dialogRef: MatDialogRef<AddUnitCareDialogComponent>,
    private dataService: DataService
) {}

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSubmit(formData:any): void {
    this.dialogRef.close({ title: this.title, description: this.description });
    this.dataService.updateSubmittedData(formData);
  }

  ngOnInit() {
    this.FormData = this.builder.group({
      rooms: this.builder.array([this.builder.control(null)]),
    });
    this.imageControl.valueChanges.subscribe((value: string) => {
      this.selectedImage = value;
    });
  }

  addItem(){
    (this.FormData.get('rooms')as FormArray).push(
      this.builder.control(null)
    )
  }
  deleteItem(index:any){
    (this.FormData.get('rooms')as FormArray).removeAt(index)
  }

  getRooms(): AbstractControl[]{
    return(<FormArray> this.FormData.get('rooms')).controls
  }






}
