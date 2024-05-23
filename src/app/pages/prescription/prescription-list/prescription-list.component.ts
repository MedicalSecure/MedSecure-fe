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
  PosologyDto,
  PrescriptionDto,
} from '../../../types/prescriptionDTOs';
import { PrescriptionApiService } from '../../../services/prescription/prescription-api.service';
import {
  GetRegistrationsResponse,
  RegisterDto,
} from '../../../types/registerDTOs';
import { PrescriptionStatus, Status } from '../../../enums/enum';
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
  @Output() onClickUpdatePrescriptionEvent = new EventEmitter<{
    prescription: PrescriptionDto;
    register: RegisterDto;
  }>();

  @Input() clearTextAfterEachSearch: boolean = false;
  @Input()
  checked: boolean = true;

  @Input() lastCreatedPrescriptionIdFromResponse:string|undefined;

  selectedRegister: RegisterDto | undefined = undefined;
  searchTerm: string = '';
  registrations: RegisterDto[] = [];
  prescriptionsGroupedByRegisterIds: { [key: string]: PrescriptionDto[] } = {};
  isLoading: boolean = false;

  constructor(private prescriptionApiService: PrescriptionApiService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (!this.clearTextAfterEachSearch) return;
    let newChange = changes['selectedPatient'];
    if (newChange && !newChange.firstChange) {
      if (this.selectedPrescription === undefined) this.searchTerm = '';
    }
  }
  ngOnInit() {
    this.fetchRegistrationsWithPrescriptions();
  }

  onClickPrescription(prescription: PrescriptionDto) {
    this.selectedPrescription = prescription;
    console.log(JSON.stringify(prescription));
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

  async fetchRegistrationsWithPrescriptions() {
    this.isLoading = true;
    var response =
      await PrescriptionApiService.getRegistrationsWithPrescriptions(
        this.prescriptionApiService
      );
    this.registrations = [...response];
    this.isLoading = false;
    this.highlightLastAddedPrescription()
  }

  highlightLastAddedPrescription(){
    
  }

  onClickRefresh() {
    //this.fetchPrescriptions();
    this.fetchRegistrationsWithPrescriptions();
  }

  getRegisterStatus(register: RegisterDto): Status {
    return getPatientStatusFromRegister(register);
  }

  getPrescriptionStatus(prescription: PrescriptionDto): string {
    return getPrescriptionStatus(prescription);
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

  getPosologySummary(posology: PosologyDto): {
    timesADay: string;
    beforeFoodCounter: number;
    afterFoodCounter: number;
    maximumDispenseQuantity: number;
    average: number;
    numberOfCautions: number;
    numberOfComments: number;
  } {
    let timesADay: string = '';
    let afterFoodCounter: number = 0;
    let beforeFoodCounter: number = 0;
    let timesADayCounter: number = 0;
    let maximumDispenseQuantity: number = 0;
    let numberOfComments: number = 0;
    let numberOfCautions: number = 0;
    posology.dispenses.forEach((hourObj) => {
      if (hourObj.beforeMeal?.quantity) {
        const beforeFQ = parseInt(hourObj.beforeMeal?.quantity);
        beforeFoodCounter += beforeFQ;
        timesADayCounter++;
        if (beforeFQ > maximumDispenseQuantity)
          maximumDispenseQuantity = beforeFQ;
      }
      if (hourObj.afterMeal?.quantity) {
        const afterFQ = parseInt(hourObj.afterMeal?.quantity);
        afterFoodCounter += afterFQ;
        timesADayCounter++;
        if (afterFQ > maximumDispenseQuantity)
          maximumDispenseQuantity = afterFQ;
      }
    });
    posology.comments.forEach((comment) => {
      if (comment.label === 'Caution') numberOfCautions++;
      else numberOfComments++;
    });
    if (timesADayCounter > 1) timesADay = timesADayCounter + ' times a day : ';
    else if (timesADayCounter == 1) timesADay = 'single time a day : ';
    let average = (beforeFoodCounter + afterFoodCounter) / timesADayCounter;
    return {
      timesADay,
      beforeFoodCounter,
      afterFoodCounter,
      maximumDispenseQuantity,
      average: !Number.isNaN(average) ? Number(average.toFixed(1)) : 0,
      numberOfCautions,
      numberOfComments,
    };
  }
  getNumberOfDaysInRange(dateRange: [Date, Date | null] | null): number | null {
    if (dateRange === null || dateRange[1] === null) return null;
    // Convert both dates to timestamps
    var timestamp1 = dateRange[0].getTime();
    var timestamp2 = dateRange[1].getTime();
    // Calculate the difference in milliseconds
    var difference = Math.abs(timestamp2 - timestamp1);
    // Convert milliseconds to days
    var daysDifference = Math.ceil(difference / (1000 * 60 * 60 * 24));
    return daysDifference;
  }

  navigateToUpdatePrescription(
    prescription: PrescriptionDto,
    register: RegisterDto | undefined
  ) {
    if (register == undefined) return;
    console.log('sent from list');
    //add checks of status here before submitting
    //...
    this.onClickUpdatePrescriptionEvent.emit({ prescription, register });
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

export function getPrescriptionStatus(prescription: PrescriptionDto): string {
  switch (prescription.status) {
    case PrescriptionStatus.Draft:
      return 'Draft';
    case PrescriptionStatus.Pending:
      return 'Pending';
    case PrescriptionStatus.Active:
      return 'Active'; // Done: validée
    case PrescriptionStatus.Rejected:
      return 'Rejected';
    case PrescriptionStatus.Discontinued:
      return 'Discontinued';
    case PrescriptionStatus.Completed:
      return 'Completed';
    // Add cases for other statuses if they are uncommented in the enum
    default:
      return 'Unknown Status';
  }
}
