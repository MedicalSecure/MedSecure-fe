import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';

import { MatInputModule } from '@angular/material/input';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
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
  PartsOfDayComponent,
  hourType,
} from '../../../components/parts-of-day/parts-of-day.component';
import { patientType } from '../stp1-patient-selection/stp1-patient-selection.component';
import {
  DateRangeType,
  DatepickerRangePopupComponent,
} from '../../../components/datepicker-range-popup/datepicker-range-popup.component';
import { ToggleButtonComponent } from '../../../components/toggle-button/toggle-button.component';
import {
  commentType,
  medicationHourType,
  medicationType,
  styleClass,
} from '../../../types';
import { Stp2PatientDetailsComponent } from '../stp2-patient-details/stp2-patient-details.component';

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
    PartsOfDayComponent,
    DatepickerRangePopupComponent,
    ToggleButtonComponent,
    MatChipsModule,
    Stp2PatientDetailsComponent,
  ],
})
export class Stp2AddMedicationComponent implements OnInit, OnDestroy {
  @Input()
  selectedPatient: patientType | undefined;
  /* on click finish listener */
  @Input() events: Observable<void>;
  private finishEventSubscription: Subscription;
  @Output() onMedicationsChange = new EventEmitter<medicationType[]>();
  @Output() onIsMedicationPageValidChange = new EventEmitter<boolean>();
  @Output() onSubmitChange = new EventEmitter<void>();

  isSelectedForceOrder: boolean = false;
  isFilteredForceOrder: boolean = false;
  isEditingMode: boolean = false;
  isCautionEnabled: boolean = false;
  cautionComment: commentType = initialCautionComment;
  consumptionMinStartDate: Date = new Date();
  isPageValid: boolean = true;
  selectedMedication: medicationType = _getFormInitialValues();
  prescribedMedications: medicationType[] = [];

  /* autocomplete medication  search */
  medicationFormGroup = this._formBuilder.group({
    medicationNameInputFormControl: '',
  });
  medicationGroupOptions!: Observable<MedicationGroupType[]>;
  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit() {
    /* autocomplete */
    this.medicationGroupOptions = this.medicationFormGroup
      .get('medicationNameInputFormControl')!
      .valueChanges.pipe(
        startWith(''),
        map((value) => this._filterGroup(value || ''))
      );

    this.finishEventSubscription = this.events.subscribe(() =>
      this.onClickFinish()
    );

    /* if is caution enabled by default => add a caution comment at the beginning of the array  */
    this.isCautionEnabled &&
      this.selectedMedication.comments.unshift(this.cautionComment);

    /* emit wether or not we can finish the prescription */
    this.onIsMedicationPageValidChange.emit(this.isPageValid);
  }

  ngOnDestroy() {
    this.finishEventSubscription.unsubscribe();
  }

  /* Form inputs change */
  onSelectedMedicationChange(group: any) {
    //this.appendMedication();
    this.selectedMedication = {
      ..._getFormInitialValues(),
      id: group.option.value,
      label: group.option.value,
      isForceOrder: group.option.group.label === 'out of stock',
    };
    this.isSelectedForceOrder = group.option.group.label === 'out of stock';
  }

  HandleScheduleChange(FilteredHoursList:hourType[]){
    console.log(FilteredHoursList)
  }
  onIsCautionEnabledChange(caution: boolean) {
    this.isCautionEnabled = caution;
    let commentList = this.selectedMedication.comments;
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
    this.switchIsPermanent(newIsPermanentState);
    let dateRange = this.selectedMedication.consumptionPeriod.dateRange;
    if (dateRange === null) {
      dateRange = getInitialDateRange();
    }
    if (newIsPermanentState == true) {
      dateRange[1] = null;
    } else {
      if (dateRange === null || dateRange[0] === null) {
        dateRange = getInitialDateRange();
      } else if (dateRange[0] != null) {
        let oldStartDate = dateRange[0];
        let newEndDate = getInitialDateRange(oldStartDate)[1];
        dateRange[1] = newEndDate;
      }
    }
    this.selectedMedication.consumptionPeriod.dateRange = [...dateRange];
  }
  onPeriodChange(newDateRange: DateRangeType) {
    if (newDateRange === null) {
      //clear button disabling
      newDateRange = getInitialDateRange();
      if (this.selectedMedication.consumptionPeriod.isPermanent) {
        //maintain the old permanent state
        newDateRange[1] = null;
      }
    }
    this.selectedMedication.consumptionPeriod.dateRange = [...newDateRange];
    this.switchIsPermanent(newDateRange[1] === null);
  }
  switchIsPermanent(newState: boolean) {
    this.selectedMedication.consumptionPeriod.isPermanent = newState;
  }

  /* Comments */
  onAddComment() {
    let commentList = this.selectedMedication.comments;
    if (commentList.length > 0) {
      let lastElement = commentList.at(commentList.length - 1);
      const isLastElementCautionComment = lastElement === this.cautionComment;
      if (lastElement?.content != '' || isLastElementCautionComment === true)
        commentList.push({
          id: undefined,
          label: 'Comment',
          content: '',
        });
    } else if (commentList.length == 0)
      commentList.push({ id: undefined, label: 'Comment', content: '' });
  }
  onCommentChange(event: any, comment: commentType) {
    let commentContent: string = event.value as string;
    comment.content = commentContent;
    if (!commentContent || commentContent.trim() === '') {
      //remove the comment if its empty or whitespace
      this.onRemoveComment(comment);
    }
  }
  onRemoveComment(comment: commentType) {
    let commentList = this.selectedMedication.comments;
    if (comment === this.cautionComment) {
      this.onIsCautionEnabledChange(false);
      return;
    }
    commentList = commentList.filter((item) => {
      return item != comment;
    });
  }

  /* medications */
  onClickEditMedication(index: number, medication: medicationType) {
    if (this.isEditingMode == true) {
      //if, after checking the current edited one, we can append it,
      //then we can swap the two medications, first append then proceed to edit the new one
      if (this.onAppendMedication() == false) return;
    }
    this.isEditingMode = true;
    this.prescribedMedications = this.prescribedMedications.filter(
      (item, i) => index != i
    );
    this.selectedMedication = medication;
    this.medicationFormGroup.setValue({
      medicationNameInputFormControl: medication.label,
    });
  }
  onClickRemoveMedication(index: number, medication: medicationType) {
    this.prescribedMedications = this.prescribedMedications.filter(
      (item, i) => {
        if (item.isForceOrder && index != i) this.isFilteredForceOrder = true;
        return index != i;
      }
    );
    console.log('result ' + this.isFilteredForceOrder);
  }
  onAppendMedication(): boolean {
    const CurrentMedication = this.selectedMedication;
    if (CurrentMedication != null && CurrentMedication.label != '') {
      this._cleanComments();
      this.prescribedMedications.push(CurrentMedication);
      this.selectedMedication = _getFormInitialValues();
      this.isEditingMode = false;
      this.medicationFormGroup.setValue({ medicationNameInputFormControl: '' });
      if (this.isFilteredForceOrder === false)
        this.isFilteredForceOrder =
          CurrentMedication.isForceOrder == undefined
            ? false
            : CurrentMedication.isForceOrder;
      this.onMedicationsChange.emit(this.prescribedMedications);
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

    console.log('valid medication: ');
    console.log(this.prescribedMedications);
    this.onSubmitChange.emit();
  }

  validateFinish(): boolean {
    let isFormValid = true;
    //add conditions here like
    const currentInput =
      this.medicationFormGroup.getRawValue().medicationNameInputFormControl;
    if (currentInput !== '') isFormValid = false;

    //emit changes
    this.onIsMedicationPageValidChange.emit(isFormValid);
    return isFormValid;
  }

  /* prescribed/selected medications display */
  getPrescribedMedicationSummary(medication: medicationType): {
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
    medication.administrationHours.forEach((hourObj) => {
        if (hourObj.beforeFood?.DispenseQuantity) {
          const beforeFQ = parseInt(hourObj.beforeFood?.DispenseQuantity);
          beforeFoodCounter += beforeFQ;
          timesADayCounter++;
          if (beforeFQ > maximumDispenseQuantity)
            maximumDispenseQuantity = beforeFQ;
        }
        if (hourObj.afterFood?.DispenseQuantity) {
          const afterFQ = parseInt(hourObj.afterFood?.DispenseQuantity);
          afterFoodCounter += afterFQ;
          timesADayCounter++;
          if (afterFQ > maximumDispenseQuantity)
            maximumDispenseQuantity = afterFQ;
        }
    });
    medication.comments.forEach((comment) => {
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

  private _cleanComments(medication: medicationType = this.selectedMedication) {
    medication.comments.forEach((comment) => {
      let commentContent = comment.content;
      if (!commentContent || commentContent.trim() === '') {
        //remove the comment if its empty or whitespace
        this.onRemoveComment(comment);
      }
    });
  }

  private _filterGroup(value: string): MedicationGroupType[] {
    if (value) {
      return MedicationGroups.map((group) => ({
        letter: group.letter,
        labels: _filterInputAutoCompleteOptions(group.labels, value),
      })).filter((group) => group.labels.length > 0);
    }

    return MedicationGroups;
  }
}
export interface MedicationGroupType {
  letter: string;
  labels: string[];
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

const MedicationGroups: MedicationGroupType[] = [
  {
    letter: 'in stock',
    labels: ['Doliprane', 'Fervex', 'Aspirin'],
  },
  {
    letter: 'out of stock',
    labels: ['ARPL'],
  },
];

const initialCautionComment = {
  id: undefined,
  label: 'Caution',
  content: '',
  labelClass: 'text-warning fw-bold',
};

const consumptionPeriod: ConsumptionPeriodType = {
  isPermanent: false,
  dateRange: getInitialDateRange(),
};
function _getFormInitialValues(): medicationType {
  return {
    id: '',
    label: '',
    dispenseUnit: '',
    consumptionPeriod: { ...consumptionPeriod },
    isForceOrder: false,
    administrationHours: _getACopyOfAdministrationHours(),
    Caution: '',
    comments: [],
  };
}

function _getACopyOfAdministrationHours(
  source = _initialPartsOfDayHours
): hourType[] {
  /* get a copy of the objects one by one to change their memory id; */
  let result: hourType[] = [];
  source.forEach((hourElement) => {
    let hourElementClone = { ...hourElement };
    result.push(hourElementClone);
  });

  return result;
}

function getInitialDateRange(startDay = new Date()): [Date, Date] {
  let twoWeeksLater = new Date(startDay.getTime() + 14 * 24 * 60 * 60 * 1000);
  //set the time to midnight
  twoWeeksLater.setHours(0, 0, 0, 0);
  return [startDay, twoWeeksLater];
}

const _initialPartsOfDayHours: hourType[]= [
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