import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FormArray, FormControl, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommentComponent } from "../../../../components/comment/comment.component";
import { Comment } from '../../../../model/BacPatient';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import foods, { Diet, Food, Meal, SimpleRegisterDto , SimplePatientDto , SimpleRiskFactorDto} from '../../../../model/Diet';
import { PrescriptionDto, RegisterForPrescription } from '../../../../model/Prescription';
import { PrescriptionApiService } from '../../../../services/prescription/prescription-api.service';
import { DietsService } from '../../../../services/diets/diets.service';
import { Router } from '@angular/router';
import { MealsListComponent } from '../meals-list/meals-list.component';
import { log } from 'console';
import { S } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-add-diet',
  standalone: true,
  templateUrl: './add-diet.component.html',
  styleUrls: ['./add-diet.component.css'],
  imports: [CommonModule, MatSelectModule, MatMenuModule, RouterModule, MatChipsModule, ReactiveFormsModule, MatIconModule, CommentComponent, MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule]
})
export class AddDietComponent implements OnInit {

  @Input() inputRegister: RegisterForPrescription | undefined = undefined;
  @Input() note: string[];
  @Input()CardBodyClass: string = 'card-body pb-0 pt-3';
  @Input() stepNumber: number;
  @Output() stepNumberChange = new EventEmitter<number>();
  @Input() dietToEdit: Diet | undefined ;
  liststring: Comment[] = [];
  selectedMealType: number;
  isMealSelected: boolean[] = [];
  diet: Diet;
  Prescrotion: PrescriptionDto;
  @Output() mealsEmitter = new EventEmitter<Meal[]>();
  @Output() showMealImiiter = new EventEmitter<boolean>();
  showMeal:boolean = false ;
  @Output() showFoodInfoEmitter = new EventEmitter<boolean>();
  showFoodInfo:boolean = false ;
  @Output() FoodEmitter = new EventEmitter<Food>();
  Foods:Food;
  Diet: Diet | any;
  MealType: number[] = [1, 2, 3, 4];
  foodCategory: number[];
  StarterList : string[] = [];
  MainDishList : string[] = [];
  DessertList : string[] = [];
  DrinkList : string[] = [];
  FoodList: { [key: number]: { [key: number]: string[] } } = { 0: { 0: ["Please select a food option"] } };
  disableChipState: { [key: number]: { [key: number]: boolean } } = {};
  fb = inject(NonNullableFormBuilder);
  DietForm: Form = this.fb.group({
    meals: this.fb.array<FormMeal>([this.fb.group({
      foods: this.fb.array<FormFood>([]),
      name: '',
      mealType: 0
    })]),
    dietType: 0,
    label: '',
  })

  nextButtonContent: { label: string; class: string } = _nextButtonContent;
  backButtonContent: { label: string; class: string } = _backButtonContent;
  constructor(private PescriptionService: PrescriptionApiService , private DietService : DietsService , private router : Router) {
    this.selectedMealType = this.MealType[0];

  }

  ngOnInit(): void {
    this.foodCategory = [1,2,3,4];
    this.DietForm.controls.meals.valueChanges.subscribe(() => {
      this.isMealSelected = Array(this.DietForm.controls.meals.length).fill(false);
    });
foods.forEach(food=>{
  if(food.foodCategory == 1){
    this.StarterList.push(food.name)
  }
  if(food.foodCategory == 2){
    this.MainDishList.push(food.name)
  }
  if(food.foodCategory == 3){
    this.DrinkList.push(food.name)
  }
  if(food.foodCategory == 4){
    this.DessertList.push(food.name)
  }
})

  }

  chipSelected(food: number, mealIndex: number, foodIndex: number): void {
    if (!this.disableChipState[mealIndex]) {
      this.disableChipState[mealIndex] = {};
    }
    this.disableChipState[mealIndex][foodIndex] = true;
    this.onOptionChange(food, mealIndex, foodIndex);
  }
 
  isChipDisabled(mealIndex: number, foodIndex: number): boolean {
    return this.disableChipState[mealIndex]?.[foodIndex] ?? false;
  }
  onPreviousClick() {
    throw new Error('Method not implemented.');
    }
  generateMeal(): FormMeal {
    return this.fb.group({
      foods: this.fb.array<FormFood>([]),
      name: '',
      mealType: 0
    });
  }

  generateFood(): FormFood {
    return this.fb.group({
      name: '',
      calories: 0,
      description: '',
      foodCategory: 0
    });
  }
  addMeal(): void {
    this.DietForm.controls.meals.push(this.generateMeal());
  }

  removeMeal(mealIndex: number): void {
    this.DietForm.controls.meals.removeAt(mealIndex);
    delete this.disableChipState[mealIndex];
  }
  resetForm() {
    this.DietForm.reset(); 
  }
  onOptionChange(food: number, mealIndex: number, foodIndex: number): void {
    if (!this.FoodList[mealIndex]) {
      this.FoodList[mealIndex] = {};
    }
    if (!this.FoodList[mealIndex][foodIndex]) {
      this.FoodList[mealIndex][foodIndex] = [];
    }

    switch (food) {
      case 1:
        this.FoodList[mealIndex][foodIndex] = this.MainDishList;
        break;
      case 2:
        this.FoodList[mealIndex][foodIndex] = this.DessertList;
        break;
      case 3:
        this.FoodList[mealIndex][foodIndex] = this.DrinkList;
        break;
      case 4:
        this.FoodList[mealIndex][foodIndex] = this.StarterList;
        break;
      default:
        this.FoodList[mealIndex][foodIndex] = ["Please select a food option"];
    }
  }

  addFood(mealIndex: number): void {
    const newFood: FormFood = this.fb.group({
      name: '',
      calories: 0,
      description: '',
      foodCategory: 0
    });

    this.DietForm.controls.meals.at(mealIndex)?.controls?.foods?.push(newFood);
    const foodIndex = this.DietForm.controls.meals.at(mealIndex)?.controls?.foods?.length - 1;
    if (!this.FoodList[mealIndex]) {
      this.FoodList[mealIndex] = {};
    }
    this.FoodList[mealIndex][foodIndex] = [];

    if (!this.disableChipState[mealIndex]) {
      this.disableChipState[mealIndex] = {};
    }
    this.disableChipState[mealIndex][foodIndex] = false;
  }


  removeFood(mealIndex: number, foodIndex: number): void {
    this.DietForm.controls.meals.at(mealIndex)?.controls?.foods?.removeAt(foodIndex);
    delete this.disableChipState[mealIndex][foodIndex];
  }

  onMealTypeChange(event: Event, mealIndex: number): void {
    const value = parseInt((event.target as HTMLInputElement).value);
    this.DietForm.controls.meals.at(mealIndex).patchValue({ mealType: value });
    this.isMealSelected[mealIndex] = true;

  }
  onFoodChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedFoodName = selectElement.value;

    console.log('Selected food name:', selectedFoodName);
  foods.forEach(f=>{
    if(f.name==selectedFoodName){
      this.Foods = f ;
      this.showFoodInfo = true ;
      this.showFoodInfoEmitter.emit(this.showFoodInfo);
      this.FoodEmitter.emit(this.Foods);
    }
  })

}
  isMealTypeSelected(mealIndex: number): boolean {
    const mealGroup = this.DietForm.controls.meals.at(mealIndex) as FormGroup;
    return mealGroup.get('type')?.value !== '';
  }

  cards: any[] = [{ id: 1 }];

  addCard() {
    const newId = this.cards.length ? this.cards[this.cards.length - 1].id + 1 : 1;
    this.cards.push({ id: newId });
  }
  fromRegisterToregisterDto (register: RegisterForPrescription):SimpleRegisterDto {
    const simplePatientDto:SimplePatientDto = {
      firstName : register.patient_firstName ,
      lastName : register.patient_lastName ,
      dateOfBirth : register.patient_dateOfBirth ,
      gender:register.patient_gender
    }
    const mapAllergy = register.allergies?.map((rf) => ({
      Value: rf.value,
      Type: rf.type ?? '',
    })) || [];
    
    const mapDisease = register.diseases?.map((rf) => ({
      Value: rf.value,
      Type: rf.type ?? '',
    })) || [];
    
    const simpleRegisterDto: SimpleRegisterDto = {
      patient: simplePatientDto,
      allergies: mapAllergy,
      disease: mapDisease,
    };
    return simpleRegisterDto ;

  }
  addCardFromChild() {
    const newId = this.cards.length ? this.cards[this.cards.length - 1].id + 1 : 1;
    this.cards.push({ id: newId });
  }
  Submit() {
    this.Diet = this.DietForm.value
    let mappeddiet: Diet = this.Diet
    if (mappeddiet.meals) {
      mappeddiet.meals = mappeddiet.meals.map((meal: Meal) => {
        return {
          ...meal,
          name: meal.name,
          mealType: meal.mealType,
          foods: meal.foods.map((food: Food) => {
            return {
              ...food,
              name: food.name,
              calories: food.calories,
              description: food.description,
              foodCategory: food.foodCategory
            };
          }),
        };
      });
    }
   
    if (this.inputRegister && this.inputRegister.prescriptions ) {
      mappeddiet.endDate = this.inputRegister.prescriptions[0].diet?.endDate || new Date();
      mappeddiet.startDate = this.inputRegister.prescriptions[0].diet?.startDate || new Date();

      mappeddiet.register = this.fromRegisterToregisterDto(this.inputRegister);
    } else {
      console.error('inputRegister is undefined');
    }
   
      
    if (this.DietForm.value.label !== undefined) {
      mappeddiet.label = this.DietForm.value.label;
  } else {
      mappeddiet.label = ''; // or handle as needed
  }    this.mealsEmitter.emit(mappeddiet.meals);
  this.showMeal = true ;
  this.showMealImiiter.emit(this.showMeal);
    this.stepNumber = 3 ; 
    this.stepNumberChange.emit(this.stepNumber);
    if(this.dietToEdit == undefined){
      this.DietService.postDiet(mappeddiet);

    }
    else {
      let mappeddietToEdit: Diet = this.Diet
      mappeddietToEdit.id = this.dietToEdit.id
    if (mappeddietToEdit.meals) {
      mappeddietToEdit.meals = mappeddietToEdit.meals.map((meal: Meal) => {
        return {
          ...meal,
          name: meal.name,
          mealType: meal.mealType,
          foods: meal.foods.map((food: Food) => {
            return {
              ...food,
              name: food.name,
              calories: food.calories,
              description: food.description,
              foodCategory: food.foodCategory
            };
          }),
        };
      });
    }
    if (this.inputRegister && this.inputRegister.prescriptions ) {
      mappeddietToEdit.endDate = this.inputRegister.prescriptions[0].diet?.endDate || new Date();
      mappeddiet.startDate = this.inputRegister.prescriptions[0].diet?.startDate || new Date();

      mappeddietToEdit.register = this.fromRegisterToregisterDto(this.inputRegister);
    } else {
      console.error('inputRegister is undefined');
    }
    if (this.DietForm.value.label !== undefined) {
      mappeddietToEdit.label = this.DietForm.value.label;
  } else {
    mappeddietToEdit.label = ''; 
  } 
      this.DietService.putDiet(mappeddietToEdit);      
   }


    console.log("mappeddiet" + mappeddiet.meals);
    console.log("form values" + this.DietForm.value.meals);
    
    
this.resetForm();
  }

}
const _nextButtonContent = {
  label: 'next',
  class: 'btn btn-primary text-white',
};

const _backButtonContent = {
  label: 'Previous',
  class: 'btn btn-primary text-white',
};
type Form = FormGroup<{
  meals: FormArray<FormMeal>,
  dietType: FormControl<number>;
  label: FormControl<string>;

}>;
type FormMeal = FormGroup<{
  foods: FormArray<FormFood>;
  name: FormControl<string>;
  mealType: FormControl<number>;
}>;

type FormFood = FormGroup<{
  name: FormControl<string>;
  calories: FormControl<number>;
  description: FormControl<string>;
  foodCategory: FormControl<number>;

}>;