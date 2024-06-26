import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-wizard-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './wizard-header.component.html',
  styleUrl: './wizard-header.component.css',
})
export class WizardHeaderComponent implements OnChanges {
  @Input()
  switchCondition: boolean = true;
  @Input()
  currentStep = 1;
  @Output()
  currentStepChange = new EventEmitter<number>();
  @Input() validatePageSwitch: CallbackFunction;
  @Input()
  showSteps$WithTitle: boolean = true;
  @Input()
  size: number = 2.5;
  @Input()
  sizeUnit: string = 'rem';
  @Input()
  IconSize: number | undefined = undefined;
  @Input()
  IconSizeRatio: number = 0.7;
  @Input()
  style: { [klass: string]: string } = {
    fontSize: this.IconSize
      ? this.IconSize + this.sizeUnit
      : this.size * this.IconSizeRatio + this.sizeUnit,
    height: this.size + this.sizeUnit,
    lineHeight: this.size + this.sizeUnit,
    width: this.size + this.sizeUnit,
  };

  @Input()
  steps: wizardStepType[] = [
    {
      id: 1,
      title: 'Patient information',
      matIconName: '',
      iconClass: 'fa fa-user-md',
    },
    {
      id: 2,
      title: 'Diagnostic',
      matIconName: '',
      iconClass: 'fa fa-stethoscope',
    },
    {
      id: 3,
      title: 'Medication',
      matIconName: '',
      iconClass: 'fa fa-medkit',
    },
  ];

  ngOnChanges() {
    this.style = {
      fontSize: this.IconSize
        ? this.IconSize + this.sizeUnit
        : this.size * this.IconSizeRatio + this.sizeUnit,
      height: this.size + this.sizeUnit,
      lineHeight: this.size + this.sizeUnit,
      width: this.size + this.sizeUnit,
    };
  }

  stepChanged(step: number) {
    this.currentStep = step;
    this.currentStepChange.emit(step);
  }

  getIndicatorClass(step: any) {
    return {
      active: step.id === this.currentStep,
      complete: this.currentStep > step.id,
    };
  }

  SwitchToStep(index: number) {
    if (this.localValidatePageSwitch(index)) this.stepChanged(index);
  }

  localValidatePageSwitch(index: number): Boolean {
    /* you have the choice to choose between the parent callback fn or this logic here */
    if(this.validatePageSwitch !== undefined) return this.validatePageSwitch(index);

    /* wizard validation logic, works if no function is provided by the parent */
    if (index > 0) {
      if (this.switchCondition) return true;
    }
    return false;
  }

  isActive(step: wizardStepType) {
    return step.id === this.currentStep;
  }

  isFirstStep() {
    return this.currentStep === 1;
  }

  isLastStep() {
    return this.currentStep === this.steps.length;
  }

  nextStep() {
    this.stepChanged(this.currentStep + 1);
  }

  previousStep() {
    this.stepChanged(this.currentStep - 1);
  }
}
export type wizardStepType = {
  id: number;
  title: string;
  matIconName: string;
  iconClass: string;
};

interface CallbackFunction {
  (index:number): boolean;
}

/* USAGE

<app-wizard-header
    (currentStepChange)="SwitchToStep($event)"
    [switchCondition]="selectedPatient != undefined"     ***optional****
    [currentStep]="stepNumber"    ***optional****
    [size]="3"     ***optional****
    [IconSizeRatio]="0.6"     ***optional****
    [steps]= yourArrayHere 
  ></app-wizard-header>
  
*/
