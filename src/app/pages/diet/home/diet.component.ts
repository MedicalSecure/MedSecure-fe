import { Component } from '@angular/core';
import { WizardHeaderComponent } from "../../../components/wizard-header/wizard-header.component";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AddDietComponent } from "../steps/add-diet/add-diet.component";
 import {PrescriptionListComponent} from"../steps/prescription-list/prescription-list.component"
@Component({
    selector: 'app-diet',
    standalone: true,
    templateUrl: './diet.component.html',
    styleUrl: './diet.component.css',
    imports: [WizardHeaderComponent , CommonModule ,RouterModule , AddDietComponent , PrescriptionListComponent]
    
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

