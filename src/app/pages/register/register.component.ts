import { RegistrationService } from './../../services/registration/registration.service';
import {
  AfterViewInit,
  Component,
  ViewChild,
} from '@angular/core';
import { DatePipe } from '@angular/common';
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
import { CommentComponent } from '../../components/comment/comment.component';
import { ScheduleComponent } from '../../components/schedule/schedule.component';
import { register } from './../../model/Registration';

export interface PeriodicElement {
  name: string;
  MRN: string;
  dateOfBirth: Date;
  registerDate: Date;
  status: string; 
}

export let ELEMENT_DATA: register[] = [
 /*  { MRN: 'A123456789', name: 'Haide', dateOfBirth: new Date('1987-04-13'), registerDate: new Date(), status: "Out" },
  { MRN: 'B234567890', name: 'Helen', dateOfBirth: new Date('1964-03-22'), registerDate: new Date(), status: "Resident" },
  { MRN: 'C345678901', name: 'Liam', dateOfBirth: new Date('2017-08-05'), registerDate: new Date(), status: "Out" },
  { MRN: 'D456789012', name: 'Bery', dateOfBirth: new Date('1965-11-30'), registerDate: new Date(), status: "Out" },
  { MRN: 'E567890123', name: 'Big', dateOfBirth: new Date('1966-09-21'), registerDate: new Date(), status: "Resident" },
  { MRN: 'F678901234', name: 'Carol', dateOfBirth: new Date('1955-12-25'), registerDate: new Date(), status: "Resident" },
  { MRN: 'G789012345', name: 'Nissrine', dateOfBirth: new Date('1994-06-11'), registerDate: new Date(), status: "Out" },
  { MRN: 'H890123456', name: 'Oliver', dateOfBirth: new Date('2004-01-08'), registerDate: new Date(), status: "Resident" },
  { MRN: 'I901234567', name: 'Florence', dateOfBirth: new Date('1977-10-03'), registerDate: new Date(), status: "Out" },
  { MRN: 'J012345678', name: 'Neon', dateOfBirth: new Date('2003-07-17'), registerDate: new Date(), status: "Resident" } */
];
export {register};

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
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
    ScheduleComponent,
    CommentComponent,
  ],
  providers: [],
})
export class RegisterViewComponent implements AfterViewInit {
  columnsToDisplay = ['MRN', 'name', 'age', 'registerDate', 'status','look' ];
  todayDate: string = new Date().toLocaleDateString();
  today: Date = new Date();
  tomorrow = new Date();
  yesterday = new Date();
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  //registerDate = new FormControl(new Date());
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('picker') picker: MatDatepicker<Date>;

  changeDate(selectedDate: string) {
    this.todayDate = selectedDate;
    this.today.setDate(new Date(selectedDate).getDate());
    this.dataSource.data = ELEMENT_DATA.filter(
      (item) => new Date(item.createdAt).getDate() === this.today.getDate()
    );
  }
  onLeftButtonClick() {
    this.dataSource.data = ELEMENT_DATA.filter(
      (item) =>
        new Date(item.createdAt).getDate() === this.today.getDate() - 1
    );
    this.today.setDate(this.today.getDate() - 1);
    this.todayDate = this.today.toLocaleDateString();
  }

  onRightButtonClick() {
    this.dataSource.data = ELEMENT_DATA.filter(
      (item) =>
        new Date(item.createdAt).getDate() === this.today.getDate() + 1
    );
    this.today.setDate(this.today.getDate() + 1);
    this.todayDate = this.today.toLocaleDateString();
  }

  Filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(private router: Router ,private service: RegistrationService) {}

  viewDetails(registerId: string) {
    this.router.navigate(['/register-details', registerId]);
  }
  ngOnInit() {
    this.service.getData(this.dataSource);
  }

  navigateToAddPatient() {
    this.router.navigate(['/register']);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.yesterday.setDate(this.yesterday.getDate() - 1);
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
