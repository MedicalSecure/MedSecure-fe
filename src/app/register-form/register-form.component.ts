import { Component } from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatRadioChange } from '@angular/material/radio';
import MonitorHeartRoundedIcon from '@mui/icons-material/MonitorHeartRounded';
import {MatListModule} from '@angular/material/list';

// Interfaces
interface Activity {
  value: string;
  viewValue: string;
}
interface Smoking {
  value: string;
  viewValue: string;
}
interface Subtask {
  name: string;
  completed: boolean;
  color: string;
}

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatSelectModule,MatCheckboxModule,MatListModule],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css'
})

export class RegisterFormComponent {
  typesOfAllergies: string[] = ['Food Allergies', 'Environmental Allergies', 'Insect Sting Allergies', 'Medication Allergies', 'Skin Allergies','Pet Allergies','Occupational Allergies'];
  // selectedAllergie: string = '';
  selectedSexe: string = ''; 

  handleSexeChange(event: MatRadioChange) {
    this.selectedSexe = event.value;
    
  }
  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  thirdFormGroup = this._formBuilder.group({
    thirdCtrl: ['', Validators.required],
  });
  fourthFormGroup = this._formBuilder.group({
    fourthCtrl: ['', Validators.required],
  });
  isLinear = false;
  activities: Activity[] = [
    {value: 'light-0', viewValue: 'light'},
    {value: 'Medium-1', viewValue: 'Medium'},
    {value: 'Intense-2', viewValue: 'Intense'},
  ];
  habits: Smoking[] = [
    {value: 'light-0', viewValue: 'light'},
    {value: 'Medium-1', viewValue: 'Medium'},
    {value: 'Heavy-2', viewValue: 'Heavy'},
  ];
  
  constructor(private _formBuilder: FormBuilder) {}
  
}