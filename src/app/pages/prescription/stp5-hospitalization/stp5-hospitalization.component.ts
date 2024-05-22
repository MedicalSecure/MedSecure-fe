import { Component, EventEmitter, Input, Output } from '@angular/core';
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
import { UnitCareDTO } from '../../../types/UnitCareDTOs';
import { Subscription } from 'rxjs';
import { DietService } from '../../../services/diet/diet.service';
import { UnitCareService } from '../../../services/unitCare/unit-care.service';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

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
    MatIcon
  ],
  templateUrl: './stp5-hospitalization.component.html',
  styleUrl: './stp5-hospitalization.component.css',
})
export class Stp5HospitalizationComponent {
  @Output() formValueChange = new EventEmitter<stp5FormsValueEvent>();
  @Input() initialData = new EventEmitter<stp5FormsValueEvent>(); // required when updating


  isDietsLoading = false;
  isUnitCaresLoading = false;

  UnitCareList: UnitCareDTO[] = [];
  DietList: DietDto[] = [];

  myForm: FormGroup<stp5FormGroupType>;
  formSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private dietService: DietService,
    private UnitCareService: UnitCareService
  ) {
    this.myForm = this.fb.group<stp5FormsValueEvent>({
      diet: null,
      unitCare: null,
    });
  }

  onClearSelectedDiet(){
    if(this.myForm.get('diet')?.value == null)
      return;

    this.myForm.patchValue({ diet: null });
  }
  onClearSelectedUnitCare(){
    if(this.myForm.get('unitCare')?.value == null)
      return;

    this.myForm.patchValue({ unitCare: null });
  }

  ngOnInit() {
    this.formSubscription = this.myForm.valueChanges.subscribe((value) => {
      //debugger;
      if(value.diet == undefined) value.diet=null
      if(value.unitCare == undefined) value.unitCare=null
      //@ts-ignore (im sure that no undefined status is present)
      this.formValueChange.emit(value);
    });
    this.fetchDiets();
    this.fetchUnitCares();
  }

  ngOnDestroy() {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }

  fetchDiets() {
    this.isDietsLoading = true;
    this.dietService.getDiets().subscribe(
      (response) => {
        this.DietList = response.diets.data;
      },
      (error) => console.error(error),
      () => (this.isDietsLoading = false)
    );
  }

  fetchUnitCares() {
    this.isUnitCaresLoading = true;
    this.UnitCareService.getUnitCares().subscribe(
      (response) => (this.UnitCareList = response.unitCares.data),
      (error) => console.error(error),
      () => (this.isUnitCaresLoading = false)
    );
  }
}
export type stp5FormsValueEvent = {
  diet: DietDto | null;
  unitCare: UnitCareDTO | null;
};
type stp5FormGroupType = {
  diet: FormControl<DietDto | null>;
  unitCare: FormControl<UnitCareDTO | null>;
};