import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterPatientByNameAndSnPipe } from '../../../pipes/filter-patient-by-name-and-id/filter-patient-by-name-and-sn.pipe';
import { FamilyStatus, Gender, HistoryStatus } from '../../../enums/enum';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { Country } from '../../../enums/country';
import { mapRegisterWithPrsToRegisterForPrs } from '../../../shared/DTOsExtensions';
import { PrescriptionApiService } from '../../../services/prescription/prescription-api.service';
import { RegisterForPrescription } from '../../../model/Prescription';

@Component({
  selector: 'app-stp1-patient-selection',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FilterPatientByNameAndSnPipe,
    MatProgressSpinnerModule,
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
  ],
  templateUrl: './stp1-patient-selection.component.html',
  styleUrl: './stp1-patient-selection.component.css',
})
export class Stp1PatientSelection implements OnChanges {
  @Input() selectedRegister: RegisterForPrescription | undefined = undefined;
  @Output() selectedRegisterChange = new EventEmitter<
    RegisterForPrescription | undefined
  >();
  @Output() onIsPatientSelectPageValidChange = new EventEmitter<boolean>();
  @Input() clearTextAfterEachSearch: boolean = false;
  @Input()
  RegistrationsList: RegisterForPrescription[] = [];
  IsPatientListLoading = false;
  isFailedToLoad = false;
  selectedDate: Date = new Date();
  dataSource = new MatTableDataSource([] as RegisterForPrescription[]);
  ErrorMessage = '';

  columnsToDisplay: (keyof RegisterForPrescription)[] = [
    'mrn',
    'patient_fullName', //name
    'patient_dateOfBirth', //age
    'registeredAt',
    'currentStatus',
    'patient_id', //look
  ];

  checked: boolean = true;
  searchTerm: string = '';

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('picker') picker: MatDatepicker<Date>;

  constructor(private prescriptionApiService:PrescriptionApiService) {}

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

  onClickPatient(selectedRegister: RegisterForPrescription) {
    this.selectedRegisterChange.emit(selectedRegister);
    this.selectedRegister = selectedRegister;
    this.onIsPatientSelectPageValidChange.emit(selectedRegister != undefined);
  }

  async fetchRegistrationsWithPrescriptions() {
    debugger;
    try {
      this.isFailedToLoad = false;
      this.IsPatientListLoading = true;
      var dictByRegisterIdResponse =
        await PrescriptionApiService.getRegistrationsWithPrescriptions(
          this.prescriptionApiService
        );
      if(!dictByRegisterIdResponse) throw Error("Cant fetch registers with prescriptions");
      let registerWithPrescriptionsList = Object.values(dictByRegisterIdResponse);
      this.RegistrationsList=registerWithPrescriptionsList.map(item=>mapRegisterWithPrsToRegisterForPrs(item))
      
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
      if(byMRN) return true;

      const byName1 = (p1 + " " + p2).includes(filter)
      if(byName1) return true;

      const byName2 = (p2 + " " + p1).includes(filter)
      if(byName2) return true;

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

const registerForPrescriptionMock: RegisterForPrescription = {
  id: '123456789',
  mrn: 'MRN123',
  currentStatus: HistoryStatus.Registered,
  registeredAt: new Date(),
  patient_id: '987654321',
  patient_firstName: 'John',
  patient_lastName: 'Doe',
  patient_fullName: 'John Doe',
  patient_dateOfBirth: new Date('1980-01-01'),
  patient_identity: "1234567890",
  patient_cnam: 9876543210,
  patient_assurance: 'Health Insurance',
  patient_gender: Gender.Male,
  patient_height: 180,
  patient_weight: 80,
  patient_addressIsRegistrations: true,
  patient_saveForNextTime: false,
  patient_email: 'john.doe@example.com',
  patient_address1: '123 Main Street',
  patient_address2: 'Apt 101',
  patient_country: Country.US,
  patient_state: 'CA',
  patient_familyStatus: FamilyStatus.Married,
  patient_children: 2,
  familyMedicalHistory: [],
  personalMedicalHistory: [],
  diseases: [],
  allergies: [],
  history: [],
  test: [],
  prescriptions: null,
  createdAt: new Date(),
  createdBy: 'admin',
  modifiedBy: null,
};
