import { Component, Input } from '@angular/core';

import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardMedicationComponent } from '../../../components/card-medication/card-medication.component';
import { medicationType } from '../../../types';
import { MatChip } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { NgxMasonryModule, NgxMasonryOptions } from 'ngx-masonry';
import { ActivityStatus, Gender, HistoryStatus, RegisterStatus } from '../../../enums/enum';
import { calculateBMI, getActivityStatusString, getGender } from '../../registration/register-details/register-details.component';
import { calculateAge, getDateString, getRegistrationStatus } from '../../../shared/utilityFunctions';
import { firstValueFrom } from 'rxjs';
import { RegistrationService } from '../../../services/registration/registration.service';
import { HistoryDto, RegisterDto } from '../../../model/Registration';
import { RegisterForPrescription } from '../../../types/prescriptionDTOs';
import { mapRegisterForPrsToRegisterWithPrs } from '../../../shared/DTOsExtensions';

@Component({
  selector: 'app-stp2-patient-details',
  standalone: true,
  imports: [CommonModule,NgxMasonryModule, MatCardModule, RouterModule,MatProgressSpinnerModule,MatChip],
  templateUrl: './stp2-patient-details.component.html',
  styleUrl: './stp2-patient-details.component.css',
})
export class Stp2PatientDetailsComponent {
  @Input() inputRegister: RegisterForPrescription | undefined = undefined;

  public masonryOptions: NgxMasonryOptions = {
    gutter: 40,
    fitWidth: true,
    horizontalOrder: true,
  };

  cards=_cards;
  registrationData:RegisterDto|undefined;
  registrationId:string|undefined;
  isPageLoading=true;
  isArchived=true;
  currentStatus:HistoryStatus=HistoryStatus.Out;

  errorMessage:string|undefined;

  //caching for optimizing performance
  historiesMappedByDate:HistoryDto[]=[];

  // sample data for cards
  constructor(
    private route: ActivatedRoute,
    private service: RegistrationService
  ) {}

  ngOnInit() {
    this.isPageLoading=true;
    if(this.inputRegister && this.inputRegister.id)
    {
      try {
        this.registrationData=mapRegisterForPrsToRegisterWithPrs(this.inputRegister).register
        let isActive = this.registrationData?.status === RegisterStatus.Active;
        this.isArchived = !isActive;
        this.currentStatus = this.getPatientStatus();
        this.fillHistoryMappedByDate();
  
        this.errorMessage=undefined;
      } catch (error) {
        console.error("cant parse register to view, please check the link, did you come from the right page ?");
        console.error(error)
        this.errorMessage="Can't fetch data";

        //show error here TODO
      }
    }else{
      this.errorMessage=`register id ${this.inputRegister?.id} is invalid` 
      console.error(this.errorMessage)
    }
    this.isPageLoading=false;

  }


  getRegisterStatus( status: RegisterStatus | undefined | null):string{
    if(status == undefined || status == undefined) return "Active";
    if(status==RegisterStatus.Active) return "Active"
    return "Archived"
  }

  fillHistoryMappedByDate(){
    let res= this.registrationData?.history?.sort((a, b) =>{
      return b.date.getTime() - a.date.getTime()}
    )
    this.historiesMappedByDate =res ?? [];
    
  }
  getDateString(date:Date,format:string){
    return getDateString(date,format)
  }

  getPatientStatus():HistoryStatus{
    let elementStatusFromHistory=getRegistrationStatus(this.registrationData?.history,this.registrationData?.id ?? 'not-provided')
    return elementStatusFromHistory;
  } 

  get(prop:any):string{
    if(this.isArchived) return "*ARCHIVED*"
    if(prop == null || prop ==undefined) return "Not Given"
    return (prop + "")
  }

  getAge(bd: Date | undefined | null): string {
    if (!bd) return '';
    let x = calculateAge(bd).toString();
    return x + ' years';
  }

  getCalculatedBMI(weight: number|null|undefined, height: number|null|undefined): number | null {
    if(weight == undefined || height == undefined) return null;
    if(weight == null || height == null) return null;
     return calculateBMI(weight, height);
  }
  getActivityStatusString(status:undefined | null | ActivityStatus):null|string{
    return getActivityStatusString(status);
  }
  getGender(gender:undefined | null | Gender):null|string{
    return getGender(gender);
  }
  

}

const dummyData: medicationType[] = [];
const _cards = [
  { title: 'General informations', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis nisi sed neque tincidunt maximus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis nisi sed neque tincidunt maximus.' },
  { title: 'Allergies', content: 'Vestibulum quis leo id magna ullamcorper venenatis. Quisque commodo massa vitae ante placerat, quis ultricies ligula lacinia.' },
  { title: '', content: 'Donec interdum lectus mauris, nec pharetra sapien imperdiet sed. Phasellus vitae felis sit amet leo placerat imperdiet id quis magna.' },
  { title: '', content: 'Sed quis nisi sed neque tincidunt maximus. Quisque commodo massa vitae ante placerat, quis ultricies ligula lacinia.' },
  { title: '', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec interdum lectus mauris, nec pharetra sapien imperdiet sed.' }
];