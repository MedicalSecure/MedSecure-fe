import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  ShipsSelectComponent,
  onChipsSelectionEmitType,
} from '../../../components/chips-select/chips-select.component';
import { DatePicker } from '../../../shared/date-picker/date-picker.component';
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
import { SYRINGE_ICON } from '../../../../assets/icons/icons';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { R } from '@angular/cdk/keycodes';
import {
  PartsOfDayComponent,
  hourType,
} from '../../../components/parts-of-day/parts-of-day.component';
import { patientType } from '../patient-select/patient-select.component';
import { DatepickerRangePopupComponent } from '../../../components/datepicker-range-popup/datepicker-range-popup.component';
import { ToggleButtonComponent } from '../../../components/toggle-button/toggle-button.component';
import { styleClass } from '../../../types';

@Component({
  selector: 'app-prescribe-medication',
  standalone: true,
  imports: [
    ShipsSelectComponent,
    DatePicker,
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
  ],
  templateUrl: './prescribe-medication.component.html',
  styleUrl: './prescribe-medication.component.css',
})
export class PrescribeMedicationComponent {
  @Input()
  selectedPatient: patientType | undefined;
  @Output() onBackClick = new EventEmitter<void>();
  SelectedMedicationUnit: string = 'Unit';
  syringeIcon: string = SYRINGE_ICON;
  dummyData: any[] = [
    { index: 1, label: 'test', value: 5555, x: [] },
    { index: 9, label: 'test2', value: 54545 },
    { index: 3, label: 'eeee', value: 555 },
    { index: 4, label: 'eeee22', value: 55 },
    { index: 4, label: 'eeeegegege22', value: 55 },
  ];
  dosageUnits: string[] = [
    'Units',
    'mg (milligrams)',
    'mcg (micrograms)',
    'g (grams)',
    'mL (milliliters)',
    'cc (cubic centimeters)',
    'IU (International Units)',
    'mg/mL',
    'mg/kg ',
    'mcg/mL ',
  ];
  test: hourType[][] = _initialPartsOfDayHours;
  selectedMedicationInput = '';
  isSelectedForceOrder: boolean = false;
  isFilteredForceOrder: boolean = false;
  isEditingMode: boolean = false;
  isCautionEnabled: boolean = false;
  initialUnit: string = this.dosageUnits[0];
  commentsList: commentType[] = [];
  cautionComment: commentType = {
    id: undefined,
    label: 'Caution',
    content: '',
    labelClass: 'text-warning fw-bold',
  };
  selected!: Date | null;
  public start: Date = new Date('10/07/2017');
  public end: Date = new Date('11/25/2017');
  getDater(data: any) {
    console.log(data);
  }
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  EndDate = this._formBuilder.group({
    isPermanent: false,
    consumptionDays: 7,
  });
  private _formInitialValues = {
    medicationId: '',
    SIG: '3 times a day',
    dispenseValue: 1,
    dispenseUnit: this.dosageUnits[0],
    startDate: new Date(),
    consumptionDays: 7,
    isForceOrder: false,
    administrationHours: new Set<medicationHourType>(),
    dispenseCaution: '',
    comments: [],
  };
  dayHoursBoundaries: DayHoursBoundaries = {
    Morning: [5, 6, 7, 8, 9, 10, 11],
    Afternoon: [12, 13, 14, 15, 16, 17],
    Evening: [18, 19, 20, 21],
    Night: [22, 23, 0, 1, 2, 3, 4],
  };
  dayHoursBoundariesKeys: string[] = Object.keys(this.dayHoursBoundaries);

  Medication = this._formBuilder.group<any>(this._formInitialValues);

  medicationForm = this._formBuilder.group({
    medicationGroup: '',
  });

  mainAddedMedications: medicationType[] = [];

  MedicationGroups: MedicationGroupType[] = [
    {
      letter: 'in stock',
      names: ['Doliprane', 'Fervex', 'Aspirin'],
    },
    {
      letter: 'out of stock',
      names: ['ARPL'],
    },
  ];

  medicationGroupOptions!: Observable<MedicationGroupType[]>;
  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit() {
    this.medicationGroupOptions = this.medicationForm
      .get('medicationGroup')!
      .valueChanges.pipe(
        startWith(''),
        map((value) => this._filterMedicationGroup(value || ''))
      );
    this.SIGFilteredOptions = this.sigFormControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
    this.isCautionEnabled && this.commentsList.unshift(this.cautionComment);
  }

  onStartDateInputChange(newDate: Date | null): void {
    if (newDate != null) {
      this.Medication.setValue({
        ...this.Medication.getRawValue(),
        startDate: newDate,
      });
    }
  }

  sigFormControl = new FormControl('');
  SigOptions: string[] = [
    '3 times a day',
    '5 times a day',
    'single time : morning',
    'single time : afternoon',
  ];
  SIGFilteredOptions!: Observable<string[]>;

  setIsPermanentToFalse() {
    this.EndDate.setValue({
      ...this.EndDate.getRawValue(),
      isPermanent: false,
    });
    this.Medication.setValue({
      ...this.Medication.getRawValue(),
      consumptionDays: this.EndDate.getRawValue().consumptionDays,
    });
  }

  onIsCautionEnabledChange() {
    this.isCautionEnabled = !this.isCautionEnabled;
    if (this.isCautionEnabled) {
      // Add the caution to the beginning of the array
      this.commentsList.unshift(this.cautionComment);
    } else {
      // Remove caution from the array if it exists
      const index = this.commentsList.indexOf(this.cautionComment);
      if (index !== -1) {
        this.commentsList.splice(index, 1);
      }
    }
  }

  onIsPermanentChange() {
    const currentEndDate = this.EndDate.getRawValue();
    const newIsPermanentState = !currentEndDate.isPermanent;
    this.EndDate.setValue({
      ...currentEndDate,
      isPermanent: newIsPermanentState,
    });

    if (newIsPermanentState == true) {
      this.Medication.setValue({
        ...this.Medication.getRawValue(),
        consumptionDays: -1,
      });
    } else {
      this.Medication.setValue({
        ...this.Medication.getRawValue(),
        consumptionDays: currentEndDate.consumptionDays,
      });
    }
  }

  onClickFinish() {
    const CurrentMedication = this.Medication.getRawValue() as medicationType;
    if (CurrentMedication != null && CurrentMedication.medicationId != '') {
      this.mainAddedMedications.push(CurrentMedication);
      this.Medication.setValue(this._formInitialValues);
      this.isEditingMode == false;
    }
    console.log('finish ');
    console.log(this.mainAddedMedications);
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.SigOptions.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  onAddComment() {
    if (this.commentsList.length > 0) {
      let lastElement = this.commentsList.at(this.commentsList.length - 1);
      if (lastElement?.content != '')
        this.commentsList.push({
          id: undefined,
          label: 'Comment',
          content: '',
        });
    } else if (this.commentsList.length == 0)
      this.commentsList.push({ id: undefined, label: 'Comment', content: '' });
  }

  onCommentChange(event: any, comment: commentType) {}

  onRemoveComment(comment: commentType) {
    if (comment === this.cautionComment) {
      this.onIsCautionEnabledChange();
      return;
    }
    this.commentsList = this.commentsList.filter((item) => {
      return item != comment;
    });
  }
  onSelectedMedicationChange(group: any) {
    this.Medication.setValue({
      ...this.Medication.getRawValue(),
      medicationId: group.option.value,
      isForceOrder: group.option.group.label === 'out of stock',
    });
    this.isSelectedForceOrder = group.option.group.label === 'out of stock';
  }

  getNextButtonLabel(): { label: string; class: string } {
    if (this.isFilteredForceOrder || this.isSelectedForceOrder) {
      return {
        label: 'Finish with Order',
        class: ' btn-outline-warning col-6 m-0',
      };
    }
    return {
      label: 'Finish',
      class: 'btn py-2 btn-outline-success col-6 m-0',
    };
  }

  onClickEditMedication(index: number, medication: medicationType) {
    if (this.isEditingMode == true) {
      return;
    }
    this.isEditingMode = true;
    this.mainAddedMedications = this.mainAddedMedications.filter(
      (item, i) => index != i
    );
    this.Medication.setValue(medication);
  }

  onClickRemoveMedication(index: number, medication: medicationType) {
    this.mainAddedMedications = this.mainAddedMedications.filter((item, i) => {
      if (item.isForceOrder && index != i) this.isFilteredForceOrder = true;
      return index != i;
    });
    console.log('result ' + this.isFilteredForceOrder);
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
  onClickAppendMedication() {
    const CurrentMedication = this.Medication.getRawValue() as medicationType;
    if (CurrentMedication != null && CurrentMedication.medicationId != '') {
      this.mainAddedMedications.push(CurrentMedication);
      this.Medication.setValue({
        ...this._formInitialValues,
        administrationHours: new Set(),
      });
      this.isEditingMode = false;
      if (this.isFilteredForceOrder === false)
        this.isFilteredForceOrder =
          CurrentMedication.isForceOrder == undefined
            ? false
            : CurrentMedication.isForceOrder;
    }
  }
  onClickBackEvent(): void {
    this.onBackClick.emit();
  }

  getHourClass(hourNumber: number): string {
    let medicationHour = this.getMedicationHourByHour(hourNumber);
    if (medicationHour === null) return 'bg-white border ';

    return medicationHour.isBeforeFood
      ? 'bg-info border hourCircleBtn'
      : 'bg-primary text-light border hourCircleBtn';
  }

  onClickDayHour(hourNumber: number) {
    const CurrentMedication = this.Medication.getRawValue() as medicationType;
    const currentSelectedHours = CurrentMedication.administrationHours;
    let medicationHour = this.getMedicationHourByHour(hourNumber);
    if (medicationHour === null) {
      currentSelectedHours.add({
        hour: hourNumber,
        isBeforeFood: true,
      });
      this.Medication.setValue({
        ...CurrentMedication,
        administrationHours: currentSelectedHours,
      });
      return;
    }
    if (medicationHour.isBeforeFood === true) {
      currentSelectedHours.delete(medicationHour);
      currentSelectedHours.add({
        hour: hourNumber,
        isBeforeFood: false,
      });
      this.Medication.setValue({
        ...CurrentMedication,
        administrationHours: currentSelectedHours,
      });
      return;
    }
    currentSelectedHours.delete(medicationHour);
    this.Medication.setValue({
      ...CurrentMedication,
      administrationHours: currentSelectedHours,
    });
  }

  onModifyQuantity(increment: number) {
    const CurrentMedication = this.Medication.getRawValue() as medicationType;
    if (increment > 0) {
      this.Medication.setValue({
        ...CurrentMedication,
        dispenseValue: CurrentMedication.dispenseValue + increment,
      });
      return;
    }
    if (CurrentMedication.dispenseValue > 1) {
      this.Medication.setValue({
        ...CurrentMedication,
        dispenseValue: CurrentMedication.dispenseValue + increment,
      });
    }
  }

  getNewlyPrescribedMedicationSig(
    medication: medicationType
  ): string | undefined {
    let result;
    const size = medication.administrationHours.size;
    if (size > 1) result = size + ' times a day';
    else if (size == 1) result = 'single time a day';
    return result;
  }

  getMedicationHourByHour(hourNumber: number): medicationHourType | null {
    const CurrentMedication = this.Medication.getRawValue() as medicationType;
    let medicationHour: medicationHourType | null = null;
    CurrentMedication.administrationHours.forEach((element) => {
      if (element.hour === hourNumber) {
        medicationHour = element;
        return;
      }
    });
    return medicationHour;
  }
  private _filterMedicationGroup(value: string): MedicationGroupType[] {
    if (value) {
      return this.MedicationGroups.map((group) => ({
        letter: group.letter,
        names: _filterMedication(group.names, value),
      })).filter((group) => group.names.length > 0);
    }

    return this.MedicationGroups;
  }
}
export interface MedicationGroupType {
  letter: string;
  names: string[];
}
export const _filterMedication = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter((item) => item.toLowerCase().includes(filterValue));
};

export type medicationType = {
  medicationId: string;
  name: string;
  dispenseValue: number;
  dispenseUnit: string;
  startDate: Date;
  consumptionDays: number;
  isForceOrder?: boolean;
  administrationHours: Set<medicationHourType>;
  dispenseCaution?: string;
  comments: Array<commentType>;
};
interface DayHoursBoundaries {
  [category: string]: number[]; // Use index signature for dynamic categories
}
export type medicationHourType = {
  hour: number;
  isBeforeFood: boolean;
};
export type commentType = {
  id?: string;
  label?: string;
  content: string;
  labelClass?: string;
  labelStyle?: styleClass;
};

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
