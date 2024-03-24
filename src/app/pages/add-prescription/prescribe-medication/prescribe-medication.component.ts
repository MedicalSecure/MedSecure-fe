import { Component, EventEmitter, Input, Output } from '@angular/core';

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
import { Observable, map, startWith } from 'rxjs';
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
import { patientType } from '../patient-select/patient-select.component';
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
import { MedicationSearchComponent } from '../../../components/medication-search/medication-search.component';

@Component({
  selector: 'app-prescribe-medication',
  standalone: true,
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
    MedicationSearchComponent,
    MatChipsModule,
  ],
  templateUrl: './prescribe-medication.component.html',
  styleUrl: './prescribe-medication.component.css',
})
export class PrescribeMedicationComponent {
  @Input()
  selectedPatient: patientType | undefined;
  @Output() onMedicationsChange = new EventEmitter<medicationType[]>();

  isSelectedForceOrder: boolean = false;
  isFilteredForceOrder: boolean = false;
  isEditingMode: boolean = false;
  isCautionEnabled: boolean = false;
  cautionComment: commentType = initialCautionComment;
  consumptionMinStartDate: Date = new Date();

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

    /* if is caution enabled by default => add a caution comment at the beginning of the array  */
    this.isCautionEnabled &&
      this.selectedMedication.comments.unshift(this.cautionComment);
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
    const CurrentMedication = this.selectedMedication as medicationType;
    if (CurrentMedication != null && CurrentMedication.label != '') {
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
    const CurrentMedication = this.selectedMedication;
    if (CurrentMedication != null && CurrentMedication.label != '') {
      this.prescribedMedications.push(CurrentMedication);
      this.selectedMedication = _getFormInitialValues();
      this.isEditingMode == false;
    }
    console.log('finish ');
    console.log(this.prescribedMedications);
  }

  /* prescribed/selected medications display */
  getNewlyPrescribedMedicationSig(
    medication: medicationType
  ): string | undefined {
    let result;
    const size = medication.administrationHours.length;
    if (size > 1) result = size + ' times a day';
    else if (size == 1) result = 'single time a day';
    return result;
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
interface DayHoursBoundaries {
  [category: string]: number[]; // Use index signature for dynamic categories
}

const _initialPartsOfDayHours: hourType[][] = [
  // Late Night
  [{ hour: '00' }, { hour: '01' }, { hour: '02' }],
  // Pre-Dawn/Dawn
  [{ hour: '03' }, { hour: '04' }, { hour: '05' }],
  // Early Morning
  [{ hour: '06' }, { hour: '07' }, { hour: '08' }],
  // Mid-Morning
  [{ hour: '09' }, { hour: '10' }, { hour: '11' }],
  // Noon/Midday
  [{ hour: '12' }],
  // Afternoon
  [{ hour: '13' }, { hour: '14' }, { hour: '15' }],
  // Mid-Afternoon
  [{ hour: '16' }, { hour: '17' }],
  // Evening
  [{ hour: '18' }, { hour: '19' }, { hour: '20' }, { hour: '21' }],
  // Dusk
  [{ hour: '22' }, { hour: '23' }],
];
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
): hourType[][] {
  /* get a copy of the objects one by one to change their memory id; */
  let result: hourType[][] = [];
  source.forEach((hourGroup: hourType[]) => {
    let newHoursGroup: hourType[] = [];
    hourGroup.forEach((hourElement) => {
      let hourElementClone = { ...hourElement };
      newHoursGroup.push(hourElementClone);
    });
    result.push(newHoursGroup);
  });

  return result;
}

function getInitialDateRange(startDay = new Date()): [Date, Date] {
  let twoWeeksLater = new Date(startDay.getTime() + 14 * 24 * 60 * 60 * 1000);
  //set the time to midnight
  twoWeeksLater.setHours(0, 0, 0, 0);
  return [startDay, twoWeeksLater];
}
