import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxMasonryModule } from 'ngx-masonry';
import { MatCardModule } from '@angular/material/card';
import { NgxMasonryOptions } from 'ngx-masonry';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RegistrationService } from '../../../services/registration/registration.service';
import { RegisterDto } from '../../../model/Registration';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { calculateAge, getDateString } from '../../../shared/utilityFunctions';
import { ActivityStatus, Gender, RegisterStatus } from '../../../enums/enum';

interface MasonryItem {
  title: string;
  content: string;
}

export let ELEMENT_DATA: RegisterDto[] = [];
@Component({
  selector: 'app-register-details',
  standalone: true,
  imports: [CommonModule, NgxMasonryModule, MatCardModule, RouterModule,MatProgressSpinnerModule],
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
  isPageLoading=true;
  isArchived=true;

  // sample data for cards
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: RegistrationService
  ) {}

  ngOnInit() {
    //GET DATA FROM ROUTE
    let dataJson=this.route.snapshot.paramMap.get('registrationDataInRoute');
    let minimumLogicalJsonLength=40 //characters
    if(dataJson && dataJson.length > minimumLogicalJsonLength)
    {
      try {
        this.registrationData = JSON.parse(dataJson);
        this.isPageLoading=false;
        let isActive= this.registrationData?.status === RegisterStatus.Active;
        this.isArchived = !isActive;
      } catch (error) {
        console.error("cant parse register to view, please check the link, did you come from the right page ?")
        //show error here TODO
      }
    }
  }

  getRegisterStatus( status: RegisterStatus | undefined | null):string{
    if(status == undefined || status == undefined) return "Active";
    if(status==RegisterStatus.Active) return "Active"
    return "Archived"
  }
  getHistoryMappedByDate(){
    return this.registrationData?.history?.sort((a, b) => b.date.getTime() - a.date.getTime())
  }
  getDateString(date:Date,format:string){
    return getDateString(date,format)
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
  getGender(gender:undefined | null | Gender):null|string{
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
  
}
const _cards = [
  { title: 'General informations', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis nisi sed neque tincidunt maximus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis nisi sed neque tincidunt maximus.' },
  { title: 'Allergies', content: 'Vestibulum quis leo id magna ullamcorper venenatis. Quisque commodo massa vitae ante placerat, quis ultricies ligula lacinia.' },
  { title: '', content: 'Donec interdum lectus mauris, nec pharetra sapien imperdiet sed. Phasellus vitae felis sit amet leo placerat imperdiet id quis magna.' },
  { title: '', content: 'Sed quis nisi sed neque tincidunt maximus. Quisque commodo massa vitae ante placerat, quis ultricies ligula lacinia.' },
  { title: '', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec interdum lectus mauris, nec pharetra sapien imperdiet sed.' }
];


export function calculateBMI(weight: number, height: number): number {
  if (isNaN(weight) || isNaN(height) ||  weight <= 0 || height <= 0) {
    return -1;
  }
  let heightInMeters = height / 100;
  let res= weight / (heightInMeters * heightInMeters);

  return parseFloat(res.toFixed(2));
}

