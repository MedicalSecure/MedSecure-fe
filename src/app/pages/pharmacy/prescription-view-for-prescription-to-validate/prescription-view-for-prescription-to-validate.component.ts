import { Component } from '@angular/core';
import { PosologyDto, PrescriptionDto } from '../../../model/Prescription';
import {
  calculateAge,
  extractErrorMessage,
  getDateString,
  getTimeString,
} from '../../../shared/utilityFunctions';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DrugService } from '../../../services/medication/medication.service';
import { DrugDTO, ValidationDto } from '../../../model/Drugs';
import { NgxMasonryModule, NgxMasonryOptions } from 'ngx-masonry';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UnitCareService } from '../../../services/unitCare/unit-care.service';
import { DietService } from '../../../services/diet/diet.service';
import { DietDto } from '../../../types/DietDTOs';
import { getGender } from '../../registration/register-details/register-details.component';
import { Gender, ValidationStatus } from '../../../enums/enum';
import {
  Equipment,
  Room,
  UnitCare,
} from '../../../model/unitCare/UnitCareData';
import { HumanBodyViewerComponent } from '../../prescription/human-body-viewer/human-body-viewer.component';
import { symptomsCodeByBodyPart } from '../../prescription/stp3-add-diagnostic/stp3-add-diagnostic.component';
import { getDietTypeString } from '../../prescription/stp5-hospitalization/stp5-hospitalization.component';
import { getPrescriptionStatus } from '../../prescription/prescription-list/prescription-list.component';
import { PrescriptionApiService } from '../../../services/prescription/prescription-api.service';
import { ScheduleComponent } from '../../../components/schedule/schedule.component';
import { SnackBarMessagesService } from '../../../services/util/snack-bar-messages.service';
import {
  SnackBarMessageProps,
  snackbarMessageType,
} from '../../../components/snack-bar-messages/snack-bar-messages.component';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-old-prescription-view-for-prescription-to-validate',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatIconModule,
    NgxMasonryModule,
    MatCardModule,
    RouterModule,
    MatProgressSpinnerModule,
    HumanBodyViewerComponent,
    ScheduleComponent,
    ReactiveFormsModule
  ],
  templateUrl:
    './prescription-view-for-prescription-to-validate.component.html',
  styleUrl: './prescription-view-for-prescription-to-validate.component.css',
})
export class PrescriptionViewForPrescriptionToValidateComponent {
  ConfirmationForm: FormGroup;
  //from query
  validationId: string | null = null;
  prescriptionId: string | null = null;

  selectedValidation: ValidationDto | undefined = undefined;
  selectedPrescription: PrescriptionDto | undefined = undefined;
  enableActions = true;

  private pharmacistName="Hammadi Pharmacist";
  private PharmacistId="11111111-1111-1111-1111-111111114214";

  selectedUnitCare: UnitCare | undefined;
  selectedDiet: DietDto | undefined;
  selectedRoom: Room | undefined;
  selectedBed: Equipment | undefined;
  showDetails = true;
  fetchedMedications: DrugDTO[] = [];
  selectedBodyParts: Set<string> = new Set<string>();

  

  //true : confirmation popup / false: rejection popup, undefined: hide popup
  isConfirmationPopUp :boolean|undefined = undefined;

  //loading
  isDietLoading = false;
  isUnitCareLoading = false;
  isPrescriptionLoading = false;
  isValidationLoading = false;

  public masonryOptions: NgxMasonryOptions = {
    gutter: 10,
    fitWidth: true,
    horizontalOrder: false,
    animations: {
      show: [],
      hide: []
    }
  };

  constructor(
    private drugService: DrugService,
    private unitCareService: UnitCareService,
    private dietService: DietService,
    private prescriptionService: PrescriptionApiService,
    private route: ActivatedRoute,
    private snackBarMessagesService: SnackBarMessagesService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.validationId = params.get('validationId');
      this.prescriptionId = params.get('prescriptionId');

      // Now fetch data based on validationId and prescriptionId
      if (this.validationId) {
        this.fetchValidationById(this.validationId);
      }
      if (this.prescriptionId) {
        this.fetchPrescriptionById(this.prescriptionId);
        if(!this.validationId)
          this.fetchValidationById(this.validationId,true);
      }

      if (!this.validationId && !this.prescriptionId) {
        console.error('Missing required parameters');
      }
    });


    // Confirmation form
    this.ConfirmationForm = this.fb.group({
      notesInput: ['', this.isConfirmationPopUp===false ? Validators.compose([Validators.required, Validators.minLength(20)]) : null]
    });
    // Confirmation form : Subscribe to value changes
    this.ConfirmationForm.statusChanges.subscribe(status => {
      this.onValidationStatusChange(status);
    });
  }

  setValidation(): void {
    const notesInputControl = this.ConfirmationForm.get('notesInput');
    if(!notesInputControl)
      return;
    if (this.isConfirmationPopUp===false) {
      notesInputControl.setValidators([Validators.required, Validators.minLength(20)]);
    } else {
      notesInputControl.clearValidators();
    }
    notesInputControl.updateValueAndValidity();
  }

  onValidationStatusChange(status: string): void {
    console.log('Form validation status changed:', status);
  }

  fetchValidationById(validationId: string | null,searchByPrescriptionIdToo=false) {
    this.isValidationLoading = true;
    this.drugService.getValidations().subscribe(
      (response) => {
        if (
          response?.validations?.data ||
          response?.validations?.data.length > 0
        )
          this.selectedValidation = response.validations.data.find(
            (p) => {
              if(p.id === validationId) return true
              //search by prescription id if applicable
              if(this.prescriptionId && searchByPrescriptionIdToo)
                 return p.prescriptionId === this.prescriptionId;
              return false;
            }
          );
          if(this.selectedValidation){
            if(this.selectedValidation.status != ValidationStatus.Pending)
              this.enableActions = false;
          }
      },
      (error) => {
        console.error(error);
      },
      () => (this.isValidationLoading = false)
    );
  }


  fetchUnitCareByBedId(bedId: string | null | undefined) {
    if (!bedId) return;
    this.isUnitCareLoading = true;
    this.unitCareService.getUnitCareByBedId(bedId).subscribe(
      (response) => {
        this.selectedUnitCare = response;
        this.getRoomFromUnitCare(response);
        this.getBedById(this.selectedPrescription?.bedId);
      },
      (error) => console.error(error),
      () => (this.isUnitCareLoading = false)
    );
  }

  fetchDietById(dietId: string | null | undefined) {
    if (!dietId) return;
    if (this.selectedDiet?.id == dietId) return;
    this.isDietLoading = true;
    this.dietService.getDietById(dietId).subscribe(
      (response) => {
        if (!response) return;
        this.selectedDiet = {
          ...response,
          dietTypeString: getDietTypeString(response.dietType),
        };
      },
      (error) => console.error(error),
      () => (this.isDietLoading = false)
    );
  }

  fetchPrescriptionById(prescriptionId: string | null | undefined) {
    if (!prescriptionId) return;
    if (this.selectedDiet?.id == prescriptionId) return;
    this.isPrescriptionLoading = true;
    this.prescriptionService.getPrescriptionById(prescriptionId).subscribe(
      (response) => {
        if (!response || response.prescriptions.data.length == 0) return;
        this.selectedPrescription = response.prescriptions.data[0];

        this.mapSymptomsToBodyParts();
        this.fetchUnitCareByBedId(this.selectedPrescription?.bedId);
        this.fetchDietById(this.selectedPrescription?.diet?.dietsId[0]);
        this.fetchMedications();
      },
      (error) => console.error(error),
      () => (this.isPrescriptionLoading = false)
    );
  }

  getGender(gender: undefined | null | Gender): null | string {
    return getGender(gender);
  }

  async fetchMedications(){
    this.drugService.getMedications().subscribe(
      (response) => {
        this.fetchedMedications = response.drugs.data;
        this.mapMedicationsToPrescriptions();
      },
      null
    );
  }

  

  getRoomFromUnitCare(unitCare: UnitCare | undefined): Room | null {
    //using cache to optimize performance, the msonary is rerendering too much so this getFunction will be called many times
    if (!unitCare) return null;
    if (
      this.selectedPrescription?.bedId &&
      this.selectedRoom?.equipments
        .map((item) => item.id)
        .includes(this.selectedPrescription?.bedId)
    ) {
      return this.selectedRoom;
    }
    let roomFound: Room | undefined = undefined;
    unitCare.rooms.forEach((room) => {
      roomFound = room;
      let isFound = false;
      room.equipments.forEach((element) => {
        if (element.id === this.selectedPrescription?.bedId) {
          isFound = true;
          return;
        }
      });
      if (isFound) return;
    });
    if (roomFound == undefined) return null;
    this.selectedRoom = roomFound;
    return roomFound;
  }

  getBedById(bedId: string | null | undefined): Equipment | null {
    //using cache to optimize performance, the msonary is rerendering too much so this getFunction will be called many times
    if (!bedId) return null;
    if (this.selectedBed?.id == bedId) return this.selectedBed;
    let room = this.getRoomFromUnitCare(this.selectedUnitCare);
    if (!room) return null;

    let equipmentFound = null;
    room.equipments.forEach((equipment) => {
      if (equipment.id === this.selectedPrescription?.bedId) {
        equipmentFound = equipment;
        return;
      }
    });
    if (equipmentFound == undefined) return null;
    this.selectedBed = equipmentFound;
    return equipmentFound;
  }

  getDietRange(diet: DietDto | undefined | null): string | null {
    if (!diet || !diet.startDate || !diet.endDate) return null;
    let start = getDateString(diet.startDate, 'dd/mm/yyyy');
    let end = getDateString(diet.endDate, 'dd/mm/yyyy');
    let nbDays = this.getNumberOfDaysInRange([diet.startDate, diet.endDate]);
    if (!nbDays || !end || !start) return null;
    return `${nbDays}d ${start}-${end}`;
  }

  mapSymptomsToBodyParts() {
    let bodyParts = new Set<string>();
    this.selectedPrescription?.symptoms.forEach((symptom) => {
      let code = symptom.code;
      for (const [key, value] of Object.entries(symptomsCodeByBodyPart)) {
        if (value.includes(parseInt(code))) {
          bodyParts.add(key);
          return;
        }
      }
    });

    this.selectedBodyParts = bodyParts;
  }

   onClickValidate(){
     this.isConfirmationPopUp=true;
    this.setValidation();
   }

   onClickReject(){
     this.isConfirmationPopUp=false;
    this.setValidation();
   }

   onClickConfirmPrescriptionHandler() {
    //hide popup
    this.isConfirmationPopUp=undefined;
    if (!this.selectedValidation) return;
    if (this.selectedValidation?.status != ValidationStatus.Pending) return;
    this.isValidationLoading = true;
   
    //TODO
    this.selectedValidation.pharmacistId=this.PharmacistId;
    this.selectedValidation.pharmacistName=this.pharmacistName;

    this.selectedValidation.status = ValidationStatus.Validated;
    this.drugService.putValidation(this.selectedValidation).subscribe(
      async (response) => {
        var props: SnackBarMessageProps = {
          messageContent: 'Prescription is now active',
          messageType: snackbarMessageType.Success,
        };
        await this.fetchPrescriptionById(response.validation.prescriptionId ?? this.prescriptionId)
        await this.fetchValidationById(response.validation.id ?? this.validationId,true)
        this.snackBarMessagesService.displaySnackBarMessage(props);
        this.isValidationLoading = false;
        this.enableActions = false;
        
      },
      (error) => {
        console.error(error);
        var props: SnackBarMessageProps = {
          messageContent: extractErrorMessage(error),
          messageType: snackbarMessageType.Error,
        };
        this.snackBarMessagesService.displaySnackBarMessage(props);
      }
    );
    this.isValidationLoading = false;
  }

  onClickRejectPrescriptionHandler() {
    //hide popup
    this.isConfirmationPopUp=undefined;
    if (!this.selectedValidation) return;
    if (this.selectedValidation?.status != ValidationStatus.Pending) return;
    this.isValidationLoading = true;
    this.selectedValidation.status = ValidationStatus.Rejected;
    this.selectedValidation.notes=this.ConfirmationForm.get('notesInput')?.value;
    this.selectedValidation.pharmacistId=this.PharmacistId;
    this.selectedValidation.pharmacistName=this.pharmacistName;

    this.drugService.putValidation(this.selectedValidation).subscribe(
      async (response) => {
        var props: SnackBarMessageProps = {
          messageContent: 'Prescription has been rejected',
          messageType: snackbarMessageType.Success,
        };
        await this.fetchPrescriptionById(response.validation.prescriptionId ?? this.prescriptionId)
        await this.fetchValidationById(response.validation.id ?? this.validationId,true)
        this.snackBarMessagesService.displaySnackBarMessage(props);
        this.isValidationLoading = false;
        this.enableActions = false;
      },
      (error) => {
        console.error(error);
        var props: SnackBarMessageProps = {
          messageContent: extractErrorMessage(error),
          messageType: snackbarMessageType.Error,
        };
        this.snackBarMessagesService.displaySnackBarMessage(props);
      }
    );
    this.isValidationLoading = false;
  }

  mapMedicationsToPrescriptions() {
    this.selectedPrescription?.posologies.forEach((posology) => {
      //the new medication is coming from the pharmacy microservice => its updated
      let foundUpdatedMedication = this.fetchedMedications.find(
        (m) => m.id === posology.medicationId
      );
      if (foundUpdatedMedication) {
        posology.medication = foundUpdatedMedication;
        return;
      }
    });
  }

  getPrescriptionStatus(prescriptionDto: PrescriptionDto) {
    return getPrescriptionStatus(prescriptionDto);
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
    return x + ' years';
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

  onToggleShowDetails() {
    this.showDetails = !this.showDetails;
  }

  getValidationStatusInfo():{text:string,class:string}{
    if(this.isValidationLoading)
      return {text:"Loading",class:'text-danger'};

    if(!this.selectedValidation)
      return {text:"Pending",class:'text-warning'};
    
    if(this.selectedValidation.status==ValidationStatus.Pending)
      return {text:"Pending",class:'text-warning'};

    if(this.selectedValidation.status==ValidationStatus.Rejected)
      return {text:"Rejected",class:'text-danger'};

    if(this.selectedValidation.status==ValidationStatus.Cancelled)
      return {text:"Cancelled",class:'text-danger'};

    if(this.selectedValidation.status==ValidationStatus.Validated)
      return {text:"Validated",class:'text-success'};

    return {text:"Unknown",class:'text-danger'};
  }

  getValidationActionInfo():{notes:string | undefined,pharmacist:string,validatedAt:string}{

    let validatedAt="Not applicable"
    if(this.selectedValidation?.modifiedAt){
      validatedAt = getDateString(this.selectedValidation.modifiedAt,"dd/mm - HH:MM")
    }
    let pharmacist="Not applicable"
    if(this.selectedValidation?.pharmacistName){
      pharmacist = this.selectedValidation.pharmacistName
    }
    let notes=undefined;
    if(this.selectedValidation?.notes){
      notes = this.selectedValidation.notes;
    }
    return{
      notes,pharmacist,validatedAt
    }
  }
}
