import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { medicationType } from '../../../../types';
import { CardMedicationComponent } from "../../../../components/card-medication/card-medication.component";
import { RegisterForPrescription } from '../../../../model/Prescription';
import { Food, Meal } from '../../../../model/Diet';

@Component({
    selector: 'app-patient-detail',
    standalone: true,
    templateUrl: './patient-detail.component.html',
    styleUrl: './patient-detail.component.css',
    imports: [CardMedicationComponent]
})
export class PatientDetailComponent implements OnChanges{

  @Input() inputRegister: RegisterForPrescription | undefined = undefined;
  @Input() meal:Meal[];
  @Input() showMeal:boolean = false ;  
  @Input() showFoodInfo:boolean = false ;
  @Input() food:Food ;

  
  currentmeals : Meal[];
  currentfood : Food ;


  ngOnInit(): void {
    
  }
  ngOnChanges() {
    this.currentmeals = this.meal ;
    this.currentfood = this.food


  }
maxWidth: { [klass: string]: string; };
  onClickEditMedication(x: any, y: any) {}
  onClickRemoveMedication(x: any, y: any) {}

}

const dummyData: medicationType[] = [];

