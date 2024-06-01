import { RegistrationService } from '../../../services/registration/registration.service';
import {
  AfterViewInit,
  Component,
  ViewChild,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router, RouterModule } from '@angular/router';
import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatChipsModule } from '@angular/material/chips';
import { JsonPipe } from '@angular/common';
import { FormControl, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommentComponent } from '../../../components/comment/comment.component';
import { RegisterDto } from '../../../model/Registration';
import { firstValueFrom } from 'rxjs';
import { getRegistrationStatus } from '../../../shared/utilityFunctions';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { RouterDataService } from '../../../services/routerData/router-data.service';

export interface PeriodicElement {
  name: string;
  MRN: string;
  dateOfBirth: Date;
  registerDate: Date;
  status: string; 
}

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register-list.component.html',
  styleUrls: ['./register-list.component.css'],
  imports: [
    DatePipe,
    RouterModule,
    MatTableModule,
    MatDatepickerModule,
    MatIconModule,
    MatTabsModule,
    MatSortModule,
    MatSort,
    MatTooltipModule,
    MatProgressBarModule,
    MatGridListModule,
    MatChipsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    JsonPipe,
    CommentComponent,
    CommonModule,
    MatProgressSpinner
  ],
  providers: [],
})
export class RegisterViewComponent {
  columnsToDisplay = ['MRN', 'name', 'age', 'registerDate', 'status','look' ];
  selectedDate: Date = new Date();
  fetchedData:RegisterDto[]=[]
  dataSource = new MatTableDataSource<RegisterDto>(this.fetchedData);
  isPageLoading =true;
  ErrorMessage="";

  changeDate(selectedDate: string) {
    this.selectedDate = new Date(selectedDate);
    let newSelectedDate= this.selectedDate.getDate();
    this.dataSource.data = this.fetchedData.filter(
      (item) => new Date(item.createdAt  ?? new Date()).getDate() === newSelectedDate
    );
  }
  onLeftButtonClick() {
    this.selectedDate.setDate(this.selectedDate.getDate() - 1);
    let currentSelectedDate=this.selectedDate.getDate();
    this.dataSource.data = this.fetchedData.filter(
      (item) =>
        new Date(item.createdAt ?? new Date()).getDate() === currentSelectedDate
    );
  }

  onRightButtonClick() {
    this.selectedDate.setDate(this.selectedDate.getDate() + 1);
    let currentSelectedDate=this.selectedDate.getDate()
    this.dataSource.data = this.fetchedData.filter(
      (item) =>
        new Date(item.createdAt ?? new Date()).getDate() === currentSelectedDate
    );
  }

  Filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(private router: Router ,private service: RegistrationService,private routerDataService:RouterDataService) {}

  ngOnInit() {
    this.fetchRegistrations()
  }
  
  onRowClick(row: any) {
    this.routerDataService.setData(row);
    this.router.navigate(['/register-details']);
  }

  viewDetails(registerId: string) {
    this.router.navigate(['/register-details', registerId]);
  }
  async fetchRegistrations(){
    try {
      this.isPageLoading=true;
      let response = await firstValueFrom(this.service.getRegistrations())
      this.fetchedData = response.registers.data.map(item=>{
        let elementStatusFromHistory=getRegistrationStatus(item.history,item.id ?? 'not-provided')
        //@ts-ignore
        item.currentStatus=elementStatusFromHistory;//force add on top of the type (not recommended but..)
        return item;
      });
      this.dataSource.data=this.fetchedData;
      this.isPageLoading=false;
      this.ErrorMessage=""
    } catch (error) {
      console.error("can't fetch registrations")
      console.error(error)
      this.ErrorMessage="Can't fetch registrations"
      this.isPageLoading=false;
    }
  }

  navigateToAddPatient() {
    this.router.navigate(['/register']);
  }


  calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
}
