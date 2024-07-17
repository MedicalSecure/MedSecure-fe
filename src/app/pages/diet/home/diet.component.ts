import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WizardHeaderComponent } from '../../../components/wizard-header/wizard-header.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AddDietComponent } from '../steps/add-diet/add-diet.component';
import { PrescriptionListComponent } from '../steps/prescription-list/prescription-list.component';
import { PatientDetailComponent } from '../steps/patient-detail/patient-detail.component';
import { RegisterForPrescription } from '../../../model/Prescription';
import foods, { Diet, Food, Meal } from '../../../model/Diet';
import { MealsListComponent } from '../steps/meals-list/meals-list.component';
import { getRoles, RoleAuthGuard } from '../../../../app/role-auth.guard';
import { AzureGraphService } from '../../../azure-graph.service';
import { User } from '../../account/account.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-diet',
  standalone: true,
  templateUrl: './diet.component.html',
  styleUrl: './diet.component.css',
  imports: [
    WizardHeaderComponent,
    MealsListComponent,
    CommonModule,
    RouterModule,
    AddDietComponent,
    PatientDetailComponent,
    PrescriptionListComponent,
    MatProgressSpinnerModule
  ],
})
export class DietComponent implements OnInit {
  stepNumber: number = 1;
  updatingOldPrescriptionMode = false;
  ShowPrescriptionList: boolean = false;
  @Output() emitStepNumber: number;
  @Output() emitMeal: Meal[];
  @Input() inputRegister: RegisterForPrescription | undefined = undefined;
  selectedRegister: RegisterForPrescription | undefined;
  nextButtonContent: { label: string; class: string } = _nextButtonContent;
  backButtonContent: { label: string; class: string } = _backButtonContent;
  emittedMeals: Meal[];
  emmitedFoods: Food;
  emittedShowMeal: boolean;
  emittedShowFood: boolean = false;
  canNavigate: boolean = false;
  currentDiet: Diet;
  @Output() DietEmit = new EventEmitter<Diet>();

  isPageLoading=true;
  currentUser: User | undefined;

  @Output() emitCanValidate = new EventEmitter<boolean>();
  dietToEdit: Diet;
  constructor(private graphService: AzureGraphService) {}
  ngOnInit(): void {
    this.isPageLoading=true
    this.graphService.getCurrentUserWithRole().subscribe((account) => {
      console.log(account);
      
      this.currentUser = account;
      this.isPageLoading=false;
    });
  }

  getRoles() {
    // to be used with HTML
    //debugger;
    return getRoles(this.currentUser);
  }



  SwitchToStep(number: number) {
    this.stepNumber = number;
    // Disallow going back once navigated forward
  }
  onDietEmmitted(diet: any) {
    this.currentDiet = diet;
    this.DietEmit.emit(this.currentDiet);
    console.log('Diet emitted:', diet);
  }
  onSelectPatientChange(register: RegisterForPrescription | undefined) {
    this.stepNumber = 2;
    this.inputRegister = register;
    this.selectedRegister = register;
  }
  onMealsEmitter(meals: Meal[]) {
    this.emittedMeals = meals;
    this.emittedShowMeal = true;
    this.canNavigate = true;
    this.emitCanValidate.emit(this.canNavigate);
  }
  onFoodEmmited(food: Food) {
    this.emmitedFoods = food;
    this.emittedShowFood = true;
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
