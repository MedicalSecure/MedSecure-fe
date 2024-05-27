import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { PosologyDto, PrescriptionDto } from '../../../types/prescriptionDTOs';
import { RegisterDto } from '../../../types/registerDTOs';
import {
  calculateAge,
  getDateString,
  getTimeString,
} from '../../../shared/utilityFunctions';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DrugService } from '../../../services/medication/medication.service';
import { DrugDTO } from '../../../types/DrugDTOs';
import { NgxMasonryModule, NgxMasonryOptions } from 'ngx-masonry';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HumanBodyViewerComponent } from '../human-body-viewer/human-body-viewer.component';
import { getPrescriptionStatus } from '../prescription-list/prescription-list.component';
import { symptomsCodeByBodyPart } from '../stp3-add-diagnostic/stp3-add-diagnostic.component';

@Component({
  selector: 'app-old-prescription-view',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    NgxMasonryModule,
    MatCardModule,
    RouterModule,
    MatProgressSpinnerModule,
    HumanBodyViewerComponent,
  ],
  templateUrl: './old-prescription-view.component.html',
  styleUrl: './old-prescription-view.component.css',
})
export class OldPrescriptionViewComponent {
  @Input() selectedPrescription: PrescriptionDto | undefined = undefined;
  @Input() selectedRegister: RegisterDto | undefined = undefined;

  @Output() onClickUpdatePrescription = new EventEmitter<void>();
  @Output() onClickSuspendPrescription = new EventEmitter<void>();

  showDetails = true;
  isDrugsLoading = false;
  fetchedMedications: DrugDTO[] = [];
  public masonryOptions: NgxMasonryOptions = {
    gutter: 10,
    fitWidth: true,
    horizontalOrder: false,
  };
  selectedBodyParts: Set<string> = new Set<string>();

  constructor(
    private drugService: DrugService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log(this.selectedRegister);

    this.fetchMedications();
    this.mapSymptomsToBodyParts();
  }

  fetchMedications() {
    this.isDrugsLoading = true;
    this.drugService.getMedications().subscribe(
      (response) => {
        this.fetchedMedications = response?.drugs?.data;
        this.isDrugsLoading = false;
      },
      (error) => {
        console.error(error);
      },
      () => {}
    );
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

  onClickUpdatePrescriptionHandler() {
    this.onClickUpdatePrescription.emit();
  }
  onClickSuspendPrescriptionHandler() {
    this.onClickSuspendPrescription.emit();
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
}
