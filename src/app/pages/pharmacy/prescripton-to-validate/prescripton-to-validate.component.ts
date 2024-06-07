import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import {
  PrescriptionDto,
  RegisterForPrescription,
  RegisterWithPrescriptions,
} from '../../../model/Prescription';
import { PrescriptionApiService } from '../../../services/prescription/prescription-api.service';

import { PrescriptionStatus, HistoryStatus } from '../../../enums/enum';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  calculateAge,
  getDateString,
  getTimeString,
} from '../../../shared/utilityFunctions';
import { RegisterDto } from '../../../model/Registration';
import { mapRegisterWithPrsToRegisterForPrs } from '../../../shared/DTOsExtensions';
import { PrescriptionViewForPrescriptionToValidateComponent } from '../prescription-view-for-prescription-to-validate/prescription-view-for-prescription-to-validate.component';

@Component({
  selector: 'app-prescription-to-validate',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIcon,
    RouterModule,
    MatProgressSpinnerModule,
    PrescriptionViewForPrescriptionToValidateComponent
  ],
  templateUrl: './prescripton-to-validate.component.html',
  styleUrl: './prescripton-to-validate.component.css'
})
export class PrescriptonToValidateComponent {
  @Input() selectedPrescription: PrescriptionDto | undefined = undefined;
  @Output() onClickNewPrescriptionEvent = new EventEmitter<boolean>();
  @Output() onClickUpdatePrescriptionEvent = new EventEmitter<{
    prescription: PrescriptionDto;
    register: RegisterForPrescription;
  }>();

  @ViewChildren('prescriptionRows') prescriptionRows: QueryList<any>;

  @Input() clearTextAfterEachSearch: boolean = false;
  @Input()
  checked: boolean = true;

  @Input() lastCreatedPrescriptionIdFromResponse: string | undefined;

  selectedRegister: RegisterForPrescription | undefined = undefined;
  searchTerm: string = '';
  registrations: RegisterWithPrescriptions[] = [];
  prescriptionsGroupedByRegisterIds: { [key: string]: PrescriptionDto[] } = {};
  isLoading: boolean = false;
  isFailedToLoad: boolean = false;

  prescriptionsViewList:PrescriptionDto[]=[];

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
    let regWithPrescriptions = this.registrations.filter(
      (registerWithPrescription) => registerWithPrescription.register.id == prescription.registerId
    )[0];
    this.selectedRegister = mapRegisterWithPrsToRegisterForPrs(regWithPrescriptions);
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
    try {
      this.isFailedToLoad = false;
      this.isLoading = true;
      var dictByRegisterIdResponse =
        await PrescriptionApiService.getRegistrationsWithPrescriptions(
          this.prescriptionApiService
        );
      if(!dictByRegisterIdResponse) throw Error("Cant fetch registers with prescriptions");
      this.registrations = Object.values(dictByRegisterIdResponse);
      let extractedPrescriptions:PrescriptionDto[]=[];

      //extract all prescriptions from the dict
      this.registrations.forEach(registerWithPrescription=>{
        //get the prescriptions of this register object
        let newPrescriptions:PrescriptionDto[]=registerWithPrescription.prescriptions? registerWithPrescription.prescriptions.filter(p => !!p ) : []
        //add the newPrescriptions to the already extracted (accumulate)
        extractedPrescriptions=[...extractedPrescriptions ,...newPrescriptions]
      })
      //display them sorted by date
      this.prescriptionsViewList=extractedPrescriptions.sort((a,b)=> a.createdAt < b.createdAt ? 1 : -1);

      this.isLoading = false;
      this.isFailedToLoad = false;
      this.highlightLastAddedPrescription();
    } catch (error) {
      console.error(error);
      this.isFailedToLoad = true;
    }
  }

  highlightLastAddedPrescription() {
    setTimeout(() => {
      const element = document.getElementById(
        'last-selected-prescription'
      );
      if (element) {
        element.classList.add('highlight-animation');
      }
      setTimeout(()=>this.lastCreatedPrescriptionIdFromResponse=undefined,3000) // after 3 seconds, disable highlighting again
    },200)//wait for table to be rendered first
  }

  suspendPrescription(prescription:PrescriptionDto){  
    this.isLoading = true;

    prescription.status=PrescriptionStatus.Discontinued;
    
    this.prescriptionApiService
        .putPrescriptionsStatus(prescription)
        .subscribe(
          (response) => {
            this.isLoading = false;
            this.lastCreatedPrescriptionIdFromResponse = response.id;
            this.selectedRegister = undefined;
            this.selectedPrescription = undefined;
            this.highlightLastAddedPrescription()
          },
          (error) => {
            this.isLoading = false;
          }
        );

  }
  

  onClickRefresh() {
    //this.fetchPrescriptions();
    this.fetchRegistrationsWithPrescriptions();
  }

  getRegister(regId: string):RegisterDto{
    return this.registrations.filter(
      (x) => x.register.id == regId
    )[0].register;
  }

  getRegisterStatus(registerId:string): HistoryStatus {
    return getPatientStatusFromRegister(this.getRegister(registerId));
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

  

  navigateToUpdatePrescription(
    prescription: PrescriptionDto,
    register: RegisterForPrescription | undefined
  ) {
    if (register == undefined) return;
    console.log('sent from list');
    //add checks of status here before submitting
    //...
    this.onClickUpdatePrescriptionEvent.emit({ prescription, register });
  }
}

export function getPatientStatusFromRegister(register: RegisterDto): HistoryStatus {
  if (register.history == undefined || register.history.length == 0)
    return HistoryStatus.Out;

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
