import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxMasonryModule } from 'ngx-masonry';
import { MatCardModule } from '@angular/material/card';
import { NgxMasonryOptions } from 'ngx-masonry';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RegistrationService } from '../../../services/registration/registration.service';
import { HistoryDto, RegisterDto, archiveUnarchiveRequest } from '../../../model/Registration';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { calculateAge, getDateString, getRegistrationStatus } from '../../../shared/utilityFunctions';
import { ActivityStatus, Gender, HistoryStatus, RegisterStatus } from '../../../enums/enum';
import { MatChip } from '@angular/material/chips';
import { firstValueFrom } from 'rxjs';
import { SensorThingspeakService } from '../../../services/sensor-thingspeak/sensor-thingspeak.service';

interface MasonryItem {
  title: string;
  content: string;
}

export let ELEMENT_DATA: RegisterDto[] = [];
@Component({
  selector: 'app-register-details',
  standalone: true,
  imports: [CommonModule, NgxMasonryModule, MatCardModule, RouterModule,MatProgressSpinnerModule,MatChip],
  templateUrl: './register-details.component.html',
  styleUrl: './register-details.component.css',
})
export class MasonryDpiComponent {
  public masonryOptions: NgxMasonryOptions = {
    gutter: 10,
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

  feed: any = {
    created_at: '',
    field1: '',
    field2: '',
    field3: '',
    field4: '',
    field5: '',
    field6: '',
    field7: ''
  };

  // sample data for cards
  constructor(
    private route: ActivatedRoute,
    private sensorThingspeakService: SensorThingspeakService,
    private service: RegistrationService
  ) {}

 async ngOnInit() {
    //GET DATA FROM ROUTE
    let dataJson=this.route.snapshot.paramMap.get('registrationId');
    let minimumLogicalJsonLength=36 //characters GUID = 36
    if(dataJson && dataJson.length >= minimumLogicalJsonLength)
    {
      try {
        this.registrationId = JSON.parse(dataJson);
        if(!this.registrationId || this.registrationId.length<36)
          throw Error("Register id is invalid")
        await this.fetchRegisterById(this.registrationId);

        let obs=this.sensorThingspeakService.getDataStreamHealth();
        this.feed = await firstValueFrom(obs);

      } catch (error) {
        console.error("cant parse register to view, please check the link, did you come from the right page ?");
        console.error(error)
        this.errorMessage="Can't fetch data";

        //show error here TODO
      }
    }else{
      this.errorMessage=`register id ${dataJson} is invalid` 
      console.error(this.errorMessage)
    }
    this.isPageLoading=false;

  }

  async fetchRegisterById(registerId:string){
    this.isPageLoading=true;
    let observable=this.service.getRegisterById(registerId);
    let result = await firstValueFrom(observable);
    if(!result || !result.register || !result.register.id)
      throw Error("Invalid register from backend")
    this.registrationData=result.register;
    let isActive = this.registrationData?.status === RegisterStatus.Active;
    this.isArchived = !isActive;
    this.currentStatus = this.getPatientStatus();
    this.fillHistoryMappedByDate();
    
    this.isPageLoading = false;
    this.errorMessage=undefined;
  }

  async onClickNewEntryHandler(){
    //Create new history => registered

    try {
      if(!this.registrationData?.id){
        throw Error("can't find a valid id for the request")
      }
      let request:archiveUnarchiveRequest={
        registerId:this.registrationData.id,
        registerStatus:RegisterStatus.Active
      }
  
      let observable = this.service.postArchiveUnarchive(request)
      let result=await firstValueFrom(observable)
      let updatedRegisterId = result.id;
      console.log("Unarchive result : ");
      console.log(result);
      if(updatedRegisterId.length==36)
        this.fetchRegisterById(updatedRegisterId)
    } catch (error) {
      console.error(error)
      this.errorMessage="Can't fetch data";
    }
    this.isPageLoading=false;
    
  }

  async onClickArchiveHandler(){
    try {
      if(!this.registrationData?.id){
        throw Error("can't find a valid id for the request")
      }
      let request:archiveUnarchiveRequest={
        registerId:this.registrationData.id,
        registerStatus:RegisterStatus.Archived
      }
  
      let observable = this.service.postArchiveUnarchive(request)
      let result=await firstValueFrom(observable)
      let updatedRegisterId = result.id;
      console.log("Archive result : ");
      console.log(result);
      if(updatedRegisterId.length==36)
        this.fetchRegisterById(updatedRegisterId)
    } catch (error) {
      console.error(error)
      this.errorMessage="Can't fetch data";
    }
    this.isPageLoading=false;
  }

  getGender(gender:undefined | null | Gender){
    return getGender(gender)
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
}
const _cards = [
  { title: 'General informations', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis nisi sed neque tincidunt maximus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis nisi sed neque tincidunt maximus.' },
  { title: 'Allergies', content: 'Vestibulum quis leo id magna ullamcorper venenatis. Quisque commodo massa vitae ante placerat, quis ultricies ligula lacinia.' },
  { title: '', content: 'Donec interdum lectus mauris, nec pharetra sapien imperdiet sed. Phasellus vitae felis sit amet leo placerat imperdiet id quis magna.' },
  { title: '', content: 'Sed quis nisi sed neque tincidunt maximus. Quisque commodo massa vitae ante placerat, quis ultricies ligula lacinia.' },
  { title: '', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec interdum lectus mauris, nec pharetra sapien imperdiet sed.' }
];

export function getActivityStatusString(status:undefined | null | ActivityStatus):null|string{
  if(status == null || status==undefined) return null;

  switch (status) {
    case ActivityStatus.Intense:
      return "Intense";
    case ActivityStatus.Light:
      return "Light";
    case ActivityStatus.Medium:
      return "Medium";
  
    default:
      return "Not-given"
  }
}

export function getGender(gender:undefined | null | Gender):null|string{
  if(gender == null || gender==undefined) return null;

  switch (gender) {
    case Gender.Male:
      return "Male";
    case Gender.Female:
      return "Female";
    case Gender.Other:
      return "Other";
  
    default:
      return "Not-given"
  }
}

export function calculateBMI(weight: number, height: number): number {
  if (isNaN(weight) || isNaN(height) ||  weight <= 0 || height <= 0) {
    return -1;
  }
  let heightInMeters = height / 100;
  let res= weight / (heightInMeters * heightInMeters);

  return parseFloat(res.toFixed(2));
}
