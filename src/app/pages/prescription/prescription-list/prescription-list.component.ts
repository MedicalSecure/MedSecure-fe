import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { FilterPatientByNameAndSnPipe } from '../../../pipes/filter-patient-by-name-and-id/filter-patient-by-name-and-sn.pipe';
import {
  GetPrescriptionsByRegisterIdResponse,
  GetPrescriptionsResponse,
  PrescriptionDto,
} from '../../../types/prescriptionDTOs';
import { PrescriptionApiService } from '../../../services/prescription/prescription-api.service';
import {
  GetRegistrationsResponse,
  RegisterDto,
} from '../../../types/registerDTOs';
import { Status } from '../../../enums/enum';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  calculateAge,
  getDateString,
  getTimeString,
} from '../../../shared/utilityFunctions';

@Component({
  selector: 'app-prescription-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIcon,
    RouterModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './prescription-list.component.html',
  styleUrl: './prescription-list.component.css',
})
export class PrescriptionListComponent implements OnInit {
  @Input() selectedPrescription: PrescriptionDto | undefined = undefined;
  @Output() onClickNewPrescriptionEvent = new EventEmitter<boolean>();
  @Input() clearTextAfterEachSearch: boolean = false;
  @Input()
  checked: boolean = true;

  selectedRegister: RegisterDto | undefined = undefined;
  searchTerm: string = '';
  registrations: RegisterDto[] = [];
  prescriptionsGroupedByRegisterIds: { [key: string]: PrescriptionDto[] } = {};
  isLoading: boolean = false;

  get prescriptions(): PrescriptionDto[] {
    let result: PrescriptionDto[] = [];
    this.registrations.forEach((register) => {
      if (register.prescriptions && register.prescriptions.length > 0)
        result = [...result, ...register.prescriptions];
    });
    debugger;
    return result;
  }

  constructor(private prescriptionApiService: PrescriptionApiService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (!this.clearTextAfterEachSearch) return;
    let newChange = changes['selectedPatient'];
    if (newChange && !newChange.firstChange) {
      if (this.selectedPrescription === undefined) this.searchTerm = '';
    }
  }
  ngOnInit() {
    //this.fetchPrescriptions();
    //this.fetchRegistrations();
    this.fetchRegistrationsWithPrescriptions();
  }

  onClickPrescription(prescription: PrescriptionDto) {
    this.selectedPrescription = prescription;
    this.selectedRegister = this.registrations.filter(
      (register) => register.id == prescription.registerId
    )[0];
  }

  onClickDeselectPrescription() {
    this.selectedRegister = undefined;
    this.selectedPrescription = undefined;
  }

  onClickNewPrescription() {
    // Go to wizard ==>
    this.onClickNewPrescriptionEvent.emit(false);
    // empty this page / reset it
    this.onClickDeselectPrescription();
  }

/*   fetchPrescriptions() {
    this.isLoading=true;
    this.prescriptionApiService.getPrescriptions().subscribe(
      (response: GetPrescriptionsResponse) => {
        this.prescriptions = response.prescriptions.data.map(
          (prescription) => ({
            ...prescription,
            createdAt: this._formatDate(prescription.createdAt),
            //lastModified: this._formatDate(prescription.)
          })
        );
        //debugger;
      },
      (error: any) => {
        console.error('Error fetching prescriptions:', error);
      },
      () => {
        // Completed Fetching
        this.isLoading = false;
      }
    );
  } 

  fetchRegistrations() {
    this.isLoading = true;
    this.prescriptionApiService.getRegistrations().subscribe(
      (response: GetRegistrationsResponse) => {
        this.registrations = response.registrations.data.map(
          (registration) => ({
            ...registration,
            createdAt: this._formatDate(registration.createdAt),
            //lastModified: this._formatDate(prescription.)
          })
        );
       //debugger; 
      },
      (error: any) => {
        console.error('Error fetching registrations:', error);
      },
      () => {
        // Completed Fetching
        this.isLoading = false;
      }
    );
  }
 */
  async fetchRegistrationsWithPrescriptions() {
    var response =
      await PrescriptionApiService.getRegistrationsWithPrescriptions(
        this.prescriptionApiService
      );
    this.registrations = [...response];
  }

  onClickRefresh() {
    //this.fetchPrescriptions();
    this.fetchRegistrationsWithPrescriptions();
  }

  getStatus(register: RegisterDto): Status {
    return getPatientStatusFromRegister(register);
  }

  getDateString(
    dateToFormat: Date,
    dateFormat: string = 'dd-mm-yyyy - HH:MM'
  ): string {
    return getDateString(dateToFormat, dateFormat);
  }

  getTimeString(dateToFormat: Date): string {
    return getTimeString(dateToFormat);
  }

  getAge(bd: Date | undefined | null): string {
    if (!bd) return '';
    let x = calculateAge(bd).toString();
    return '| ' + x + ' years';
  }

  private _formatDate(dateString: any): Date {
    if (dateString) {
      return new Date(dateString);
      //const date = new Date(dateString);
      //return this.datePipe.transform(date, 'yyyy-MM-dd HH:mm:ss');
    }
    return new Date();
  }
}

export function getPatientStatusFromRegister(register: RegisterDto): Status {
  if (register.history == undefined || register.history.length == 0)
    return Status.Out;
  let histories = register.history?.sort((a, b) => {
    // Convert dates to milliseconds since epoch for comparison
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();

    // Compare the dates
    return dateB - dateA;
  });

  // Now `history` is sorted by date
  let lastOne = histories[0];
  return lastOne.status;
}
