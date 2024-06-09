import { Component, OnChanges, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PrescriptionStatus, HistoryStatus } from '../../../../enums/enum';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SnackBarMessagesComponent, snackbarMessageType } from '../../../../components/snack-bar-messages/snack-bar-messages.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { FilterPatientByNameAndSnPipe } from '../../../../pipes/filter-patient-by-name-and-id/filter-patient-by-name-and-sn.pipe';
import { AddDietComponent } from "../add-diet/add-diet.component";
import { PatientDetailComponent } from "../patient-detail/patient-detail.component";
import { PrescriptionApiService } from '../../../../services/prescription/prescription-api.service';
import { PrescriptionDto, RegisterForPrescription, RegisterWithPrescriptions } from '../../../../model/Prescription';
import { mapRegisterWithPrsToRegisterForPrs } from '../../../../shared/DTOsExtensions';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatSort } from '@angular/material/sort';
import { MatChip } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'app-prescription-list-for-diet',
  standalone: true,
  templateUrl: './prescription-list.component.html',
  styleUrl: './prescription-list.component.css',
  imports: [
    MatDatepicker, MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    FormsModule,
    FilterPatientByNameAndSnPipe,
    MatIcon,
    RouterModule,
    AddDietComponent,
    PatientDetailComponent,
    RouterModule,
    CommonModule,
    PrescriptionListComponent,
    SnackBarMessagesComponent,
    MatProgressSpinnerModule,
    CommonModule,
    FormsModule,
    MatIcon,
    RouterModule
    , MatTableModule,
    MatTabsModule,
    MatChip
  ]
})
export class PrescriptionListComponent implements OnChanges {
  @Input() selectedRegister: RegisterForPrescription | undefined = undefined;
  @Output() selectedRegisterChange = new EventEmitter<RegisterForPrescription | undefined>();
  @Output() onIsPatientSelectPageValidChange = new EventEmitter<boolean>();
  @Input() clearTextAfterEachSearch: boolean = false;
  @Input() RegistrationsList: RegisterForPrescription[] = [];
  @Output() canNavigateEmmitter =  new EventEmitter<boolean>() ;
  canNavigate : boolean = false ;
  IsPatientListLoading = false;
  isFailedToLoad = false;
  selectedDate: Date = new Date();
  dataSource = new MatTableDataSource([] as RegisterForPrescription[]);
  @Input() stepNumber: number;
  @Output() stepNumberChange = new EventEmitter<number>();
 
  ErrorMessage = '';

  columnsToDisplay: (keyof RegisterForPrescription)[] = [
    'mrn',
    'patient_fullName', //name
    'patient_dateOfBirth', //age
    'registeredAt',
    'patient_id', //look
  ];

  checked: boolean = true;
  searchTerm: string = '';

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('picker') picker: MatDatepicker<Date>;
  constructor(private prescriptionApiService: PrescriptionApiService) { }
  ngOnInit() {
    this.fetchRegistrationsWithPrescriptions();
   
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.clearTextAfterEachSearch) return;
    let newChange = changes['selectedRegister'];
    if (newChange && !newChange.firstChange) {
      if (this.selectedRegister === undefined) this.searchTerm = '';
    }
  }
  onClickPatient(register: RegisterForPrescription) {
    this.stepNumber = 2;
    this.stepNumberChange.emit(this.stepNumber);
    this.selectedRegisterChange.emit(register);
    this.selectedRegister = register;
  }
  async fetchRegistrationsWithPrescriptions() {
    try {
      this.isFailedToLoad = false;
      this.IsPatientListLoading = true;
      var dictByRegisterIdResponse =
        await PrescriptionApiService.getRegistrationsWithPrescriptions(
          this.prescriptionApiService
        );
      if (!dictByRegisterIdResponse) throw Error("Cant fetch registers with prescriptions");
      let registerWithPrescriptionsList = Object.values(dictByRegisterIdResponse);
      this.RegistrationsList = registerWithPrescriptionsList.map(item => mapRegisterWithPrsToRegisterForPrs(item))

      //refresh the filter
      this.changeDate((new Date()).toDateString())

      this.IsPatientListLoading = false;
      this.isFailedToLoad = false;
      this.ErrorMessage = '';
    } catch (error) {
      this.ErrorMessage = "Can't fetch registrations";
      console.error(error);
      this.isFailedToLoad = true;
    }
  }

  changeDate(selectedDate: string) {
    this.selectedDate = new Date(selectedDate);
    let newSelectedDate = this.selectedDate.getDate();
    this.dataSource.data = this.RegistrationsList.filter(
      (item) =>
        new Date(item.createdAt ?? new Date()).getDate() === newSelectedDate
    );
  }

  onLeftButtonClick() {
    this.selectedDate.setDate(this.selectedDate.getDate() - 1);
    let currentSelectedDate = this.selectedDate.getDate();
    this.dataSource.data = this.RegistrationsList.filter(
      (item) =>
        new Date(item.createdAt ?? new Date()).getDate() === currentSelectedDate
    );
  }

  onRightButtonClick() {
    this.selectedDate.setDate(this.selectedDate.getDate() + 1);
    let currentSelectedDate = this.selectedDate.getDate();
    this.dataSource.data = this.RegistrationsList.filter(
      (item) =>
        new Date(item.createdAt ?? new Date()).getDate() === currentSelectedDate
    );
  }

  Filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filterPredicate = (data: RegisterForPrescription, filter: string) => {
      const p1 = data.patient_firstName.toString().toLowerCase();
      const p2 = data.patient_lastName.toString().toLowerCase();
      const byMRN = data.id?.toString().toLowerCase().includes(filter);
      if (byMRN) return true;

      const byName1 = (p1 + " " + p2).includes(filter)
      if (byName1) return true;

      const byName2 = (p2 + " " + p1).includes(filter)
      if (byName2) return true;

      return false;
    };
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

