import {
  ChangeDetectorRef,
  Component,
  DoCheck,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';

import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { MedicationAutocompleteInputComponent } from '../../../components/medication-autocomplete-input/medication-autocomplete-input.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe, CommonModule, JsonPipe } from '@angular/common';
import { Observable, Subscription, map, startWith } from 'rxjs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import {
  Dispense,
  ScheduleComponent,
} from '../../../components/schedule/schedule.component';

import {
  DateRangeType,
  DatepickerRangePopupComponent,
} from '../../../components/datepicker-range-popup/datepicker-range-popup.component';
import { ToggleButtonComponent } from '../../../components/toggle-button/toggle-button.component';

import { Stp2PatientDetailsComponent } from '../stp2-patient-details/stp2-patient-details.component';
import {
  CommentsDto,
  DispenseDto,
  PosologyDto,
} from '../../../types/prescriptionDTOs';

import { getDateString } from '../../../shared/utilityFunctions';
import {
  SearchBarComponent,
  searchTerm,
} from '../../../components/search-bar/search-bar.component';
import { DrugDTO } from '../../../types/DrugDTOs';

@Component({
  selector: 'app-stp4-add-medication',
  standalone: true,
  templateUrl: './stp4-add-medication.component.html',
  styleUrl: './stp4-add-medication.component.css',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    AsyncPipe,
    MatSelectModule,
    JsonPipe,
    MatIcon,
    CommonModule,
    MatCardModule,
    MatDatepickerModule,
    ScheduleComponent,
    DatepickerRangePopupComponent,
    ToggleButtonComponent,
    MatChipsModule,
    Stp2PatientDetailsComponent,
    SearchBarComponent,
  ],
})
export class Stp4AddMedicationComponent implements OnInit, OnDestroy, DoCheck {
  @Input() events: Observable<void>;
  @Input() newPosologiesList: PosologyDto[] = [];
  @Input() updatingOldPrescriptionMode: boolean = false;

  @Output() onPosologiesChange = new EventEmitter<PosologyDto[]>();
  @Output() onIsMedicationPageValidChange = new EventEmitter<boolean>();
  @Output() onSubmitChange = new EventEmitter<void>();

  private finishEventSubscription: Subscription;

  searchTerms = _searchTerms;
  isSelectedForceOrder: boolean = false;
  isFilteredForceOrder: boolean = false;
  isEditingMode: boolean = false;
  isCautionEnabled: boolean = false;
  cautionComment: CommentsDto = initialCautionComment;
  consumptionMinStartDate: Date = new Date();
  isPageValid: boolean = false;
  selectedPosology: PosologyDto = this._getFormInitialValues();
  selectedPosologyDateRange = getInitialDateRange();

  //in this page case, selectedMedications[].length will at max contains 1 medication
  //but the searchBar component require the selectedMedications input to be a LIST OF MEDICATIONS..
  selectedMedications: DrugDTO[] = [];

  //If no medications is selected, don't modify the posology values, only the search medications will work
  canUpdatePosology: boolean = this.selectedMedications.length > 0;

  private previousPosologiesListLength: number = 0;
  constructor(private changeDetector: ChangeDetectorRef) {}

  ngOnInit() {
    /* autocomplete */
    this.finishEventSubscription = this.events.subscribe(() =>
      this.onClickFinish()
    );

    /* if is caution enabled by default => add a caution comment at the beginning of the array  */
    this.isCautionEnabled &&
      this.selectedPosology.comments.unshift(this.cautionComment);

    if (this.updatingOldPrescriptionMode) {
      this.newPosologiesList = this.newPosologiesList.map((posology) => {
        return {
          ...posology,
          dispenses: this.fillEmptyDispenses(posology.dispenses),
        };
      });
    }

    /* emit wether or not we can finish the prescription */
    this.onIsMedicationPageValidChange.emit(this.isPageValid);
  }

  ngOnDestroy() {
    this.finishEventSubscription.unsubscribe();
  }

  ngDoCheck() {
    //handle changes whenever the new posologies list changes
    const currentPosologiesListLength = this.newPosologiesList.length;
    if (currentPosologiesListLength !== this.previousPosologiesListLength) {
      //emit is  page now valid
      let isThisPageValid = currentPosologiesListLength > 0;
      this.onIsMedicationPageValidChange.emit(isThisPageValid);
      // Update the previous list length
      this.previousPosologiesListLength = currentPosologiesListLength;
    }
  }

  /* Form inputs change */
  onSelectedMedicationChange(medications: DrugDTO[]) {
    if (medications.length === 0) {
      this.selectedMedications = [];
      this.selectedPosology = this._getFormInitialValues();
      this.canUpdatePosology = this.selectedMedications.length > 0;
      return;
    }
    this.selectedPosology = this._getFormInitialValues();
    this.selectedMedications = medications;
    this.selectedPosology.medication = medications[0];
    this.canUpdatePosology = this.selectedMedications.length > 0;
  }

  onIsCautionEnabledChange(caution: boolean) {
    const bugCondition =
      caution &&
      this.isEditingMode &&
      this.selectedPosology.comments.length > 0 &&
      this.selectedPosology.comments[0].label === 'Caution';
    if (bugCondition) {
      // in this if, i will handle the caution enabling in case of editing a medication (click on edit)
      //and this medication has a caution comment => it will trigger this function and cause comment duplication
      return;
    }
    this.isCautionEnabled = caution;
    let commentList = this.selectedPosology.comments;
    if (caution) {
      // Add the caution to the beginning of the array
      commentList.unshift(this.cautionComment);
    } else {
      // Remove caution from the array if it exists
      const index = commentList.indexOf(this.cautionComment);
      if (index !== -1) {
        commentList.splice(index, 1);
      }
    }
  }

  onIsPermanentChange(newIsPermanentState: boolean) {
    this.selectedPosology.isPermanent = newIsPermanentState;
    let startDate = this.selectedPosology.startDate;
    let endDate = this.selectedPosology.endDate;
    if (newIsPermanentState == true) {
      endDate = null;
    } else {
      //newIsPermanentState==false
      //two cases, either we don't have a start date (error somehow) => handled in if (startDate === null) => {NEwStartDate = today, NewEndDate == 15days}
      // or we have a startDate ( normal case ) => handled in if (startDate != null)  ==> {NewEndDate == old start date + 14days}
      if (startDate === null) {
        [startDate, endDate] = getInitialDateRange();
      } else if (startDate != null) {
        let newEndDate = getInitialDateRange(startDate)[1];
        endDate = newEndDate;
      }
    }
    //Update the DatePicker component Values
    this.selectedPosologyDateRange = [startDate, endDate];
  }

  onPeriodChange(newDateRange: DateRangeType) {
    //debugger;
    if (newDateRange === null) {
      //clear button disabling
      newDateRange = getInitialDateRange();
      if (this.selectedPosology.isPermanent) {
        //maintain the old permanent state
        newDateRange[1] = null;
      }
    }
    //Update the selected posology object
    this.selectedPosology.startDate = newDateRange[0];
    this.selectedPosology.endDate = newDateRange[1];

    //Update IsPermanent button
    let NewIsPermanentState = newDateRange[1] === null; // EndDate==Null => NewIsPermanentState = true
    this.selectedPosology.isPermanent = NewIsPermanentState;
    this.changeDetector.detectChanges();
  }

  /* Comments */
  onAddComment() {
    if (this.canUpdatePosology == false) return;
    let commentList = this.selectedPosology.comments;
    if (commentList.length > 0) {
      let lastElement = commentList.at(commentList.length - 1);
      const isLastElementCautionComment = lastElement === this.cautionComment;
      if (lastElement?.content != '' || isLastElementCautionComment === true)
        commentList.push({
          label: 'Comment',
          content: '',
        });
    } else if (commentList.length == 0)
      commentList.push({ label: 'Comment', content: '' });
  }
  onCommentChange(event: any, comment: CommentsDto) {
    let commentContent: string = event.value as string;
    comment.content = commentContent;
    if (!commentContent || commentContent.trim() === '') {
      //remove the comment if its empty or whitespace
      this.onRemoveComment(comment);
    }
  }
  onRemoveComment(comment: CommentsDto) {
    let commentList = this.selectedPosology.comments;
    if (comment === this.cautionComment) {
      this.onIsCautionEnabledChange(false);
      return;
    }
    this.selectedPosology.comments = commentList.filter((item) => {
      return item != comment;
    });
  }

  /* medications */
  onClickEditMedication(index: number, posology: PosologyDto) {
    if (this.isEditingMode == true) {
      //if, after checking the current edited one, we can append it,
      //then we can swap the two medications, first append then proceed to edit the new one
      if (this.onAppendMedication() == false) return;
    }
    this.isEditingMode = true;
    this.newPosologiesList = this.newPosologiesList.filter(
      (item, i) => index != i
    );
    this.selectedPosology = posology;
    this.selectedPosologyDateRange = [posology.startDate, posology.endDate];
    this.selectedMedications = [posology.medication];
    this.canUpdatePosology = this.selectedMedications.length > 0;
    //Caution comment is always the first one, so we can change the state here!
    this.isCautionEnabled =
      this.selectedPosology.comments.length > 0
        ? this.selectedPosology.comments[0].label === 'Caution'
        : false;
  }

  onClickRemoveMedication(index: number) {
    this.newPosologiesList = this.newPosologiesList.filter((item, i) => {
      //if (item.isForceOrder && index != i) this.isFilteredForceOrder = true;
      return index != i;
    });
    this.onPosologiesChange.emit(this.newPosologiesList);
  }

  onAppendMedication(): boolean {
    //debugger;
    //if (this.canUpdatePosology == false) return false;

    const CurrentPosology = this.selectedPosology;
    if (
      CurrentPosology != null &&
      CurrentPosology.medication != null &&
      CurrentPosology.medication.name != ''
    ) {
      this._cleanComments();

      this.newPosologiesList.push(CurrentPosology);
      this.onSelectedMedicationChange([]);
      this.isEditingMode = false;
      this.isCautionEnabled = false;
      /*       if (this.isFilteredForceOrder === false)
        this.isFilteredForceOrder =
          CurrentPosology.isForceOrder == undefined
            ? false
            : CurrentPosology.isForceOrder; */
      this.onPosologiesChange.emit(this.newPosologiesList);
      return true;
    }
    return false;
  }
  getAppendMedicationButtonLabel(): { label: string; class: string } {
    if (this.isSelectedForceOrder) {
      return {
        label: this.isEditingMode
          ? 'Update medication with order'
          : 'Add with order',
        class: ' btn-warning m-0',
      };
    }
    return {
      label: this.isEditingMode ? 'Update medication' : 'Add medication',
      class: 'btn py-2 btn-primary text-white m-0 col-11 ',
    };
  }

  onClickFinish() {
    console.log('checking before finish ');
    this.onAppendMedication();
    if (this.validateFinish() === false) return;
    /* handle prescription submission to backend */

    console.log('valid posologies: ');
    console.log(this.newPosologiesList);
    this.onSubmitChange.emit();
  }

  validateFinish(): boolean {
    let isFormValid = true;
    //add conditions here like

    //emit changes
    this.onIsMedicationPageValidChange.emit(isFormValid);
    return isFormValid;
  }

  /* prescribed/selected medications display */
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

  getDateString(date: Date, format = 'dd/mm/yyyy'): string {
    if (!date) {
      //fix this
      console.log('date is null');
      return '';
    }
    return getDateString(date, format);
  }

  fillEmptyDispenses(dispensesDto: DispenseDto[]): Dispense[] {
    let dispensesResult = _getACopyOfAdministrationHours();

    for (const dispense of dispensesResult) {
      let dispenseDto = dispensesDto.find((item) => item.hour == dispense.hour);
      if (dispenseDto == undefined) continue; // if the DTO to update doesn't have this hour already;
      dispense.afterMeal = dispenseDto?.afterMeal;
      dispense.beforeMeal = dispenseDto?.beforeMeal;
    }

    return dispensesResult;
  }

  private _getFormInitialValues(): PosologyDto {
    this.selectedMedications = [];
    return {
      id: '',
      prescriptionId: '',
      medication: initialEmptyMedication,
      medicationId: initialEmptyMedication.id,
      startDate: getInitialDateRange()[0],
      endDate: getInitialDateRange()[1],
      isPermanent: false,
      dispenses: _getACopyOfAdministrationHours(),
      comments: [],
    };
  }

  private _cleanComments(posology: PosologyDto = this.selectedPosology) {
    posology.comments.forEach((comment) => {
      let commentContent = comment.content;
      if (!commentContent || commentContent.trim() === '') {
        //remove the comment if its empty or whitespace
        this.onRemoveComment(comment);
      }
    });
  }
}

export type ConsumptionPeriodType = {
  isPermanent: boolean;
  dateRange: [Date, Date | null] | null;
};

export const _filterInputAutoCompleteOptions = (
  opt: string[],
  value: string
): string[] => {
  const filterValue = value.toLowerCase();
  return opt.filter((item) => item.toLowerCase().includes(filterValue));
};

const _searchTerms: searchTerm[] = [
  { label: 'Name', medicationKey: 'name' },
  { label: 'Form', medicationKey: 'form' },
];
const initialCautionComment: CommentsDto = {
  label: 'Caution',
  content: '',
};

const consumptionPeriod: ConsumptionPeriodType = {
  isPermanent: false,
  dateRange: getInitialDateRange(),
};

function _getACopyOfAdministrationHours(
  source = _initialPartsOfDayHours
): Dispense[] {
  /* get a copy of the objects one by one to change their memory id; */
  let result: Dispense[] = [];
  source.forEach((hourElement) => {
    let hourElementClone = { ...hourElement };
    result.push(hourElementClone);
  });

  return result;
}

function getInitialDateRange(
  startDay = new Date(),
  numberOfDays = 14
): [Date, Date | null] {
  //by default: two weeks late (14days)
  let twoWeeksLater = new Date(
    startDay.getTime() + numberOfDays * 24 * 60 * 60 * 1000
  );
  //set the time to midnight
  twoWeeksLater.setHours(0, 0, 0, 0);
  return [startDay, twoWeeksLater];
}

const _initialPartsOfDayHours: Dispense[] = [
  { hour: '00' },
  { hour: '01' },
  { hour: '02' },
  { hour: '03' },
  { hour: '04' },
  { hour: '05' },
  { hour: '06' },
  { hour: '07' },
  { hour: '08' },
  { hour: '09' },
  { hour: '10' },
  { hour: '11' },
  { hour: '12' },
  { hour: '13' },
  { hour: '14' },
  { hour: '15' },
  { hour: '16' },
  { hour: '17' },
  { hour: '18' },
  { hour: '19' },
  { hour: '20' },
  { hour: '21' },
  { hour: '22' },
  { hour: '23' },
];

const initialEmptyMedication: DrugDTO = {
  id: '',
  name: '',
  dosage: '',
  form: '',
  code: '',
  unit: '',
  description: '',
  expiredAt: new Date('9999-12-01'),
  stock: 0,
  alertStock: 0,
  avrgStock: 0,
  minStock: 0,
  safetyStock: 0,
  reservedStock: 0,
  availableStock: 0,
  price: 0,
};
