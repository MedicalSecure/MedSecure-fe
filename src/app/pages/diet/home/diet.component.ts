import { Component, Input, OnInit, Output } from '@angular/core';
import { WizardHeaderComponent } from "../../../components/wizard-header/wizard-header.component";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AddDietComponent } from "../steps/add-diet/add-diet.component";
 import {PrescriptionListComponent} from"../steps/prescription-list/prescription-list.component"
 import{PatientDetailComponent} from "../steps/patient-detail/patient-detail.component"
import { RegisterForPrescription } from '../../../model/Prescription';
@Component({
    selector: 'app-diet',
    standalone: true,
    templateUrl: './diet.component.html',
    styleUrl: './diet.component.css',
    imports: [WizardHeaderComponent, CommonModule, RouterModule, AddDietComponent,PatientDetailComponent ,PrescriptionListComponent]
})

export class DietComponent implements OnInit {

  stepNumber: number = 1;
  updatingOldPrescriptionMode = false;
  ShowPrescriptionList: boolean = false;
  @Output() emitStepNumber : number ;
  @Input() inputRegister: RegisterForPrescription | undefined = undefined;
  selectedRegister: RegisterForPrescription | undefined;
  nextButtonContent: { label: string; class: string } = _nextButtonContent;
  backButtonContent: { label: string; class: string } = _backButtonContent;
  ngOnInit(): void {
    console.log("init mtea el home : " +this.inputRegister);
  
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
      title: 'Patient Details',
      matIconName: '',
      iconClass: 'fa fa-user-md',
    },
       
  ];
    SwitchToStep(number: number) {
      
    this.stepNumber = number;
  }
  onSelectPatientChange(register :  RegisterForPrescription | undefined ) {
    this.stepNumber = 2;
    this.inputRegister = register;
    this.selectedRegister = register;
    console.log("inputRegisterinputRegister"+this.inputRegister?.id);
    
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

