import { Component } from '@angular/core';
import { WizardHeaderComponent } from "../../../components/wizard-header/wizard-header.component";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AddDietComponent } from "../steps/add-diet/add-diet.component";
@Component({
    selector: 'app-diet',
    standalone: true,
    templateUrl: './diet.component.html',
    styleUrl: './diet.component.css',
    imports: [WizardHeaderComponent , CommonModule ,RouterModule , AddDietComponent]
    
})

export class DietComponent {
  stepNumber: number = 1;

  steps: wizardStepType[] = [
    {
      id: 1,
      title: 'Patient Selection',
      matIconName: '',
      iconClass: 'fa fa-list',
    },
    {
      id: 2,
      title: 'Patient Details',
      matIconName: '',
      iconClass: 'fa fa-user-md',
    },
    {
      id: 3,
      title: 'Add Meal',
      matIconName: '',
      iconClass: 'fa fa-utensils', 
    }    
  ];
    SwitchToStep(number: number) {
      
    this.stepNumber = number;
  }
}
export type wizardStepType = {
  id: number;
  title: string;
  matIconName: string;
  iconClass: string;
};

