import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WizardHeaderComponent } from "../../../components/wizard-header/wizard-header.component";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AddDietComponent } from "../steps/add-diet/add-diet.component";
 import {PrescriptionListComponent} from"../steps/prescription-list/prescription-list.component"
 import{PatientDetailComponent} from "../steps/patient-detail/patient-detail.component"
import { RegisterForPrescription } from '../../../model/Prescription';
import { Meal } from '../../../model/Diet';
import { MealsListComponent } from '../steps/meals-list/meals-list.component';
@Component({
    selector: 'app-diet',
    standalone: true,
    templateUrl: './diet.component.html',
    styleUrl: './diet.component.css',
    imports: [WizardHeaderComponent,MealsListComponent, CommonModule, RouterModule, AddDietComponent, PatientDetailComponent, PrescriptionListComponent]
})

export class DietComponent implements OnInit {

  stepNumber: number = 1;
  updatingOldPrescriptionMode = false;
  ShowPrescriptionList: boolean = false;
  @Output() emitStepNumber : number ;
  @Output() emitMeal : Meal[] ;
  @Input() inputRegister: RegisterForPrescription | undefined = undefined;
  selectedRegister: RegisterForPrescription | undefined;
  nextButtonContent: { label: string; class: string } = _nextButtonContent;
  backButtonContent: { label: string; class: string } = _backButtonContent;
  emittedMeals: Meal[];
  canNavigate:boolean=false ; 
  @Output() emitCanValidate =  new EventEmitter<boolean>();
  ngOnInit(): void {
  
  }
  steps: wizardStepType[] = [
    {
      id: 1,
      title: 'Patient Selection',
      matIconName: '',
      iconClass: 'fa fa-list',
    },
    {
      id: 2,
      title: 'Affect Meal',
      matIconName: '',
      iconClass: 'fa fa-utensils',
    },
    {
      id: 3,
      title: 'Meals Details',
      matIconName: '',
      iconClass: 'fa fa-hamburger',
    },
  ];
    SwitchToStep(number: number) {
   
        this.stepNumber = number;
   // Disallow going back once navigated forward
      
  }
  onSelectPatientChange(register :  RegisterForPrescription | undefined ) {
    this.stepNumber = 2;
    this.inputRegister = register;
    this.selectedRegister = register;
   

  }
  onMealsEmitter(meals: Meal[]) {
    this.emittedMeals = meals;
  
    
  }
  
}
const _nextButtonContent = {
  label: 'next',
  class: 'btn btn-primary text-white',
};

const _backButtonContent = {
  label: 'Previous',
  class: 'btn btn-primary text-white',
};
export type wizardStepType = {
  id: number;
  title: string;
  matIconName: string;
  iconClass: string;
};

