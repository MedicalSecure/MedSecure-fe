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
import { Router, RouterModule } from '@angular/router';
import {
  PrescriptionDto,
  RegisterForPrescription,
  RegisterWithPrescriptions,
} from '../../../model/Prescription';
import { PrescriptionApiService } from '../../../services/prescription/prescription-api.service';

import { PrescriptionStatus, HistoryStatus, ValidationStatus } from '../../../enums/enum';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  calculateAge,
  getDateString,
  getTimeString,
} from '../../../shared/utilityFunctions';
import { RegisterDto } from '../../../model/Registration';
import { mapRegisterWithPrsToRegisterForPrs } from '../../../shared/DTOsExtensions';
import { PrescriptionViewForPrescriptionToValidateComponent } from '../prescription-view-for-prescription-to-validate/prescription-view-for-prescription-to-validate.component';
import { DrugService } from '../../../services/medication/medication.service';
import { ValidationDto } from '../../../model/Drugs';

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
  selectedValidation: ValidationDto | undefined = undefined;
  @Output() onClickImportMedicationEvent = new EventEmitter<boolean>();

  @ViewChildren('prescriptionRows') prescriptionRows: QueryList<any>;

  clearTextAfterEachSearch: boolean = false;

  @Input() lastCreatedValidationIdFromNotification: string | undefined;


  searchTerm: string = '';

  validations: ValidationDto[] = [];
  isLoading: boolean = false;
  isFailedToLoad: boolean = false;


  constructor(private drugsService:DrugService,private router: Router) {}

  ngOnChanges(changes: SimpleChanges) {
    if (!this.clearTextAfterEachSearch) return;
    let newChange = changes['selectedPatient'];
    if (newChange && !newChange.firstChange) {
      if (this.selectedValidation === undefined) this.searchTerm = '';
    }
  }
  ngOnInit() {
    //this.fetchRegistrationsWithPrescriptions();
    this.fetchValidations();
  }

  onClickOnValidation(validation: ValidationDto) {
    this.selectedValidation = validation;
    this.router.navigate(['/pharmacyValidation'],{ 
      queryParams: { 
        validationId: validation.id, 
        prescriptionId: validation.prescriptionId
      }
    });
  }

  onClickDeselectValidation() {
    this.selectedValidation = undefined;
  }

  onClickImportMedications() {
    // Go to wizard ==>
    this.onClickImportMedicationEvent.emit(true);
    // empty this page / reset it
    this.onClickDeselectValidation();
  }

  async fetchValidations(){
    this.isFailedToLoad = false;
      this.isLoading = true;
    try {
      this.drugsService.getValidations().subscribe(response=>{
        this.validations=response.validations.data.sort((a,b)=> a.createdAt < b.createdAt ? 1 : -1);;
        this.isLoading = false;
        this.isFailedToLoad = false;
        this.highlightLastAddedValidation();
      },error=>{throw error})
    } catch (error) {

      console.error(error);
      this.isFailedToLoad = true;
    }
  }

  highlightLastAddedValidation() {
    setTimeout(() => {
      const element = document.getElementById(
        'last-selected-prescription'
      );
      if (element) {
        element.classList.add('highlight-animation');
      }
      setTimeout(()=>this.lastCreatedValidationIdFromNotification=undefined,3000) // after 3 seconds, disable highlighting again
    },200)//wait for table to be rendered first
  }

  onClickRefresh() {
    this.fetchValidations();
  }

/*   getRegister(regId: string):RegisterDto{
    return this.registrations.filter(
      (x) => x.register.id == regId
    )[0].register;
  } */

/*   getRegisterStatus(registerId:string): HistoryStatus {
    return getPatientStatusFromRegister(this.getRegister(registerId));
  } */

  getValidationStatus(validatation: ValidationDto): string {
    return getValidationStatus(validatation);
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
    //this.onClickUpdatePrescriptionEvent.emit({ prescription, register });
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

export function getValidationStatus(validation: ValidationDto): string {
  switch (validation.status) {
    case ValidationStatus.Pending:
      return 'Pending';
    case ValidationStatus.Validated:
      return 'Validated';
    case ValidationStatus.Rejected:
      return 'Rejected';
    case ValidationStatus.Cancelled:
      return 'Cancelled';

    // Add cases for other statuses if they are uncommented in the enum
    default:
      return 'Unknown Status';
  }
}
