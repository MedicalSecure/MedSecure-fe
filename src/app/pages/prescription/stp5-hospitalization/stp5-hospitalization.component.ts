import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { DietDto } from '../../../types/DietDTOs';
import { Subscription } from 'rxjs';
import { DietService } from '../../../services/diet/diet.service';
import { UnitCareService } from '../../../services/unitCare/unit-care.service';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import {
  ShipsSelectComponent,
  onChipsSelectionEmitType,
} from '../../../components/chips-select/chips-select.component';
import {
  DateRangeType,
  DatepickerRangePopupComponent,
} from '../../../components/datepicker-range-popup/datepicker-range-popup.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { UnitCare } from '../../../model/unitCare/UnitCareData';

@Component({
  selector: 'app-stp5-hospitalization',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    MatIcon,
    ShipsSelectComponent,
    DatepickerRangePopupComponent,
    MatProgressBarModule,
  ],
  templateUrl: './stp5-hospitalization.component.html',
  styleUrl: './stp5-hospitalization.component.css',
})
export class Stp5HospitalizationComponent {
  @Output() formValueChange = new EventEmitter<stp5FormsValueEvent>();
  @Output() isHospitalizationPageValid = new EventEmitter<boolean>();
  @Input() initialData: stp5FormsValueEvent | undefined; // required when updating

  //an option to choose manually
  allowNonHospitalizedPatients = true;

  @ViewChild(ShipsSelectComponent<DietDto>)
  DietsSelectComponent: ShipsSelectComponent<DietDto>;

  isDietsLoading = false;
  isUnitCaresLoading = false; 
  selectedDietsDateRange = this.getInitialDateRange();
  UnitCareList: UnitCare[] = [];
  DietList: DietDto[] = [];
  selectedDiets: DietDto[] = [];
  minDietStartDiet = new Date();

  private oldHospitalizationState: stp5FormsValueEvent | undefined;
  private _hasDietSuggestionsListOpenedOnce = false; //variable used to force suggest the Diet after first unit care selection

  myForm: FormGroup<stp5FormGroupType>;
  formSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private dietService: DietService,
    private UnitCareService: UnitCareService
  ) {
    this.myForm = this.fb.group<stp5FormsValueEvent>({
      unitCare: null,
      diet: null,
    });
  }

  ngOnInit() {
    this.formSubscription = this.myForm.valueChanges.subscribe((value) => {
      const formStatus = this.myForm.status;

      if (formStatus === 'DISABLED') return;
      const diet = value.diet ?? null;
      const unitCare = value.unitCare ?? null;

      if (unitCare != null) {
        if (this.myForm.get('diet')?.disabled) {
          this.myForm.get('diet')?.enable();
          return;
        }
      } else {
        if (this.myForm.get('diet')?.enabled)
          this.myForm.get('diet')?.disable();
      }

      if (
        this.DietList.length > 0 &&
        unitCare != null &&
        this._hasDietSuggestionsListOpenedOnce == false
      ) {
        //for the first time you select a unitCare, a suggestion list of diets appears!
        //also this is useful for fixing a bug, when the minimumSearchLength==0, you need to tape a letter at first try ! then it will suggest the list OnFocus
        setTimeout(() => {
          // open the Diet suggestion after 200ms delay
          this.DietsSelectComponent.handleForcedSuggestions({
            newFilteredData: this.DietList,
          });
        }, 200);
        //don't open it on the next unitCare changes
        this._hasDietSuggestionsListOpenedOnce = true;
      }

      this.oldHospitalizationState = {
        unitCare,
        diet,
      };
      this.selectedDiets = diet?.diets ?? [];

      this.onIsPageValidChange();

      this.formValueChange.emit({ diet: diet, unitCare }); 

    });
    this.fetchUnitCaresThenDiets();
    if (checkIsHospitalizationDataValid(this.initialData)) 
      this.formValueChange.emit(this.initialData); 

  }

  ngOnDestroy() {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }

  forceClearPage(){
    this.onClearSelectedUnitCare();
  }
  onClearSelectedDiet() {
    this.selectedDiets = [];
    this.myForm.patchValue({ diet: null });
    this.onIsPageValidChange();
  }

  onIsPageValidChange() {
    let selectedUnitCare = this.myForm.get('unitCare')?.value;

    if (!selectedUnitCare && this.allowNonHospitalizedPatients == false) {
      // Don't allow non NonHospitalized Patients
      this.isHospitalizationPageValid.emit(false);
      return;
    }
    if (selectedUnitCare) {
      //there is a selected unitCare => verify that at least a diet is selected and the date range is correct
      let selectedDiets = this.myForm.get('diet')
        ?.value as stp5SelectedDietsType;
      if (
        !selectedDiets ||
        !selectedDiets.diets ||
        selectedDiets.diets?.length == 0
      ) {
        this.isHospitalizationPageValid.emit(false);
        return;
      }

      if (
        !selectedDiets.dateRange ||
        selectedDiets.dateRange.length != 2 ||
        !selectedDiets.dateRange[0] ||
        !selectedDiets.dateRange[1]
      ) {
        this.isHospitalizationPageValid.emit(false);
        return;
      }

      //all checks passed  => return true
    }
    this.isHospitalizationPageValid.emit(true);
  }

  onClearSelectedUnitCare() {
    //don't clear if its already null
    if (this.myForm.get('unitCare')?.value == null) return;

    //clear selected diets also
    this.selectedDiets = [];
    this.myForm.patchValue({ unitCare: null, diet: null });
    this.myForm.get('diet')?.disable();
  }

  fetchDiets() {
    this.isDietsLoading = true;
    this.dietService.getDiets().subscribe(
      (response) => {
        this.DietList = response.diets.data;

        this.mapDietsDataInCaseOfUpdate();
      },
      (error) => console.error(error),
      () => (this.isDietsLoading = false)
    );
  }

  mapDietsDataInCaseOfUpdate() {
    //handle the update case (whenever the data is coming from the parent in initialData from an old prescription to update)

    if (checkIsHospitalizationDataValid(this.initialData) == false) return;
    //to remove ts errors
    if (!this.initialData || !this.initialData.diet) return;

    //OPTION 1 2 here we make sure that the selected diets exists in the list coming from the diets database
    /* let selectedDietToUpdate = [];
      response.diets.data.forEach((fetchedDiet) => {
        let foundSelectedDiet = this.initialData?.diet?.diets.find(
          (selectedDiet) => fetchedDiet.Id == selectedDiet.Id
        );
        selectedDietToUpdate.push(foundSelectedDiet);
      });
      //Fin option 1
      */

    //OPTION 2 : another approach : view selected diets directly from the old prescription
    let selectedDietToUpdate = this.initialData.diet.diets;
    //Fin option 2

    if (selectedDietToUpdate.length == 0) return;

    if (
      !this.isValidDate(this.initialData.diet.dateRange[0]) ||
      !this.isValidDate(this.initialData.diet.dateRange[1])
    )
      return;

    //update start date to today (the update is in reality a new prescription starting today replacing the old one)
    this.initialData.diet.dateRange[0] = new Date();
    this.initialData.diet.dateRange[0].setHours(0, 0, 0, 0);

    if (this.isDateAfterToday(this.initialData.diet.dateRange[1]) == false) {
      //consumption period ended already => update end date
      let newUpdatedDateDiet: stp5SelectedDietsType = {
        diets: this.initialData.diet.diets,
        //@ts-ignore
        dateRange: [this.initialData.diet.dateRange[0], null],
      };
      //this.selectedDietsDateRange = [this.initialData.diet.dateRange[0], null];

      this.myForm.patchValue({ diet: newUpdatedDateDiet });
      this.selectedDietsDateRange = newUpdatedDateDiet.dateRange;
      return;
    }
    //this.selectedDietsDateRange = [...this.initialData.diet.dateRange];
    this.selectedDiets = this.initialData.diet.diets;
    this.myForm.patchValue({ diet: this.initialData.diet });
  }

  isValidDate(date: any): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }
  isDateAfterToday(date: Date): boolean {
    const today = new Date();
    // Set the time of today's date to 00:00:00 to compare only the date part
    today.setHours(0, 0, 0, 0);
    return date > today;
  }

  fetchUnitCaresThenDiets() {
    this.isUnitCaresLoading = true;
    this.myForm.disable();
    this.UnitCareService.getUnitCares().subscribe(
      (response) => {
        this.UnitCareList = response.unitCares.data;
        // set selected from parent here in case of update !!
        if (this.initialData && this.initialData.unitCare) {
          let selectedUnitCareToUpdate = response.unitCares.data.find(
            (unitCare) =>
              unitCare.id == this.initialData?.unitCare?.id ||
              unitCare.title == this.initialData?.unitCare?.title
          );
          if (selectedUnitCareToUpdate)
            this.myForm.patchValue({ unitCare: selectedUnitCareToUpdate });
        }
        this.fetchDiets();
      },
      (error) => console.error(error),
      () => {
        this.isUnitCaresLoading = false;
        this.myForm.get('unitCare')?.enable();
      }
    );
  }

  selectedDietsChipsChange(result: onChipsSelectionEmitType<DietDto>) {
    if (this.myForm.get('diet')?.disabled) {
      //to remove after fixing the disabled part
      this.selectedDiets = [];
      return;
    }

    if (result.lastAddedItem) {
      console.log('added custom item :', result.lastAddedItem);
    } else if (result.lastSelectedItem) {
      console.log('added item from search :', result.lastSelectedItem);
    } else if (result.lastRemovedItem) {
      console.log('removed item :', result.lastRemovedItem);
    }
    console.log('updated Selected chips:', result.SelectedObjectList);
    if (result.SelectedObjectList.length == 0) {
      this.onClearSelectedDiet();
      return;
    }
    this.selectedDietsDateRange[1] =
      this.selectedDietsDateRange[1] ??
      this.getInitialDateRange(new Date(), 14)[1];
    let newDietObject: stp5SelectedDietsType = {
      diets: result.SelectedObjectList,
      //@ts-ignore
      dateRange: [...this.selectedDietsDateRange],
    };
    this.myForm.get('diet')?.setValue(newDietObject);
    this.onIsPageValidChange();
  }

  onPeriodChange(newDateRange: DateRangeType) {
    if (newDateRange === null) {
      //clear button disabling
      newDateRange = this.getInitialDateRange();
    }
    //Update the selected posology object
    this.selectedDietsDateRange = [...newDateRange];
    this.selectedDietsDateRange[1] =
      this.selectedDietsDateRange[1] ??
      this.getInitialDateRange(new Date(), 14)[1];
    let newDietObject: stp5SelectedDietsType = {
      diets: this.selectedDiets,
      //@ts-ignore
      dateRange: this.selectedDietsDateRange,
    };
    this.myForm.get('diet')?.setValue(newDietObject);
    this.onIsPageValidChange();
  }

  getInitialDateRange(
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
}
export type stp5FormsValueEvent = {
  diet: stp5SelectedDietsType | null;
  unitCare: UnitCare | null;
};

type stp5FormGroupType = {
  diet: FormControl<stp5SelectedDietsType | null>;
  unitCare: FormControl<UnitCare | null>;
};

type stp5SelectedDietsType = {
  dateRange: [Date, Date];
  diets: DietDto[];
};
export function checkIsHospitalizationDataValid(
  Data: stp5FormsValueEvent | undefined | null
): boolean {
  if (!Data || !Data.diet) return false;

  let isOldPrescriptionDataValid =
    !!Data.unitCare &&
    !!Data.diet.dateRange &&
    Data.diet.dateRange.length == 2 &&
    !!Data.diet.dateRange[0] &&
    !!Data.diet.dateRange[1];
  return isOldPrescriptionDataValid;
}
