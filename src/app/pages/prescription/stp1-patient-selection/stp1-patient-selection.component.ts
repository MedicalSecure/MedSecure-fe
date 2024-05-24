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
import { calculateAge, getDateString } from '../../../shared/utilityFunctions';
import { RegisterService } from '../../../services/register/register.service';
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
import { Router, RouterModule } from '@angular/router';
import { key } from 'flatpickr/dist/types/locale';
import { RegisterForPrescription } from '../../../types/registerDTOs';
import { Country } from '../../../enums/country';
import { mapRegisterDtoToRegisterForPrescription } from '../../../shared/DTOsExtensions';

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
  selectedDate: string = new Date().toLocaleDateString();
  today: Date = new Date();
  tomorrow = new Date();
  yesterday = new Date();
  dataSource = new MatTableDataSource([registerForPrescriptionMock]);

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

  constructor(private registerService: RegisterService) {}

  ngOnInit() {
    this.fetchRegistrations();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.clearTextAfterEachSearch) return;
    let newChange = changes['selectedRegister'];
    if (newChange && !newChange.firstChange) {
      if (this.selectedRegister === undefined) this.searchTerm = '';
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.yesterday.setDate(this.yesterday.getDate() - 1);
  }

  onClickPatient(selectedRegister: RegisterForPrescription) {
    this.selectedRegisterChange.emit(selectedRegister);
    this.selectedRegister = selectedRegister;
    this.onIsPatientSelectPageValidChange.emit(selectedRegister != undefined);
  }

  fetchRegistrations() {
    this.IsPatientListLoading = true;
    this.registerService.getRegistrations().subscribe(
      (response) => {
        this.RegistrationsList = response.registrations.data.map(register=>mapRegisterDtoToRegisterForPrescription(register));
        this.dataSource.data=this.RegistrationsList;
      },
      (error) => console.error(error),
      () => (this.IsPatientListLoading = false)
    );
  }

  changeDate(selectedDate: string) {
    this.selectedDate = selectedDate;
    this.today.setDate(new Date(selectedDate).getDate());
    this.dataSource.data = [registerForPrescriptionMock].filter(
      (item) =>
        new Date(item.registeredAt ?? '').getDate() === this.today.getDate()
    );
  }

  onLeftButtonClick() {
    this.dataSource.data = [registerForPrescriptionMock].filter(
      (item) =>
        new Date(item.registeredAt ?? '').getDate() === this.today.getDate() - 1
    );
    this.today.setDate(this.today.getDate() - 1);
    this.selectedDate = this.today.toLocaleDateString();
  }

  onRightButtonClick() {
    this.dataSource.data = [registerForPrescriptionMock].filter(
      (item) =>
        new Date(item.registeredAt ?? '').getDate() === this.today.getDate() + 1
    );
    this.today.setDate(this.today.getDate() + 1);
    this.selectedDate = this.today.toLocaleDateString();
  }

  Filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
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
  patient_identity: 1234567890,
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
