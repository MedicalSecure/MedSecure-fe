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
import { Diet, Food, Meal } from '../../../../model/Diet';
import { PrescriptionDto, RegisterForPrescription } from '../../../../model/Prescription';
import { PrescriptionApiService } from '../../../../services/prescription/prescription-api.service';

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
  @Input()
  CardBodyClass: string = 'card-body pb-0 pt-3';
  liststring: Comment[] = [];
  selectedMealType: number;
  isMealSelected: boolean[] = [];
  diet: Diet;
  Prescrotion: PrescriptionDto;
  @Output() mealsEmitter = new EventEmitter<Meal[]>();
  Diet: Diet | any;
  MealType: number[] = [0, 1, 2, 3];
  foodCategory: number[];
  StarterList = ['Soup', 'Salad', 'Bruschetta', 'Garlic Bread', 'Spring Rolls', 'Stuffed Mushrooms', 'Nachos'];
  MainDishList = ['Pizza', 'Burger', 'Pasta', 'Steak', 'Grilled Chicken', 'Fish and Chips', 'Tacos', 'Sushi', 'BBQ Ribs', 'Lasagna'];
  DessertList = ['Cake', 'Ice Cream', 'Pie', 'Brownies', 'Cheesecake', 'Pudding', 'Mousse', 'Cookies', 'Tiramisu', 'Macarons'];
  DrinkList = ['Soda', 'Juice', 'Water', 'Coffee', 'Tea', 'Milkshake', 'Smoothie', 'Wine', 'Beer', 'Cocktail'];
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

  constructor(private PescriptionService: PrescriptionApiService) {
    this.selectedMealType = this.MealType[0];

  }

  ngOnInit(): void {
    this.foodCategory = [0, 1, 2, 3];
    this.DietForm.controls.meals.valueChanges.subscribe(() => {
      this.isMealSelected = Array(this.DietForm.controls.meals.length).fill(false);
    });


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

  onOptionChange(food: number, mealIndex: number, foodIndex: number): void {
    if (!this.FoodList[mealIndex]) {
      this.FoodList[mealIndex] = {};
    }
    if (!this.FoodList[mealIndex][foodIndex]) {
      this.FoodList[mealIndex][foodIndex] = [];
    }

    switch (food) {
      case 0:
        this.FoodList[mealIndex][foodIndex] = this.MainDishList;
        break;
      case 1:
        this.FoodList[mealIndex][foodIndex] = this.DessertList;
        break;
      case 2:
        this.FoodList[mealIndex][foodIndex] = this.DrinkList;
        break;
      case 3:
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

  isMealTypeSelected(mealIndex: number): boolean {
    const mealGroup = this.DietForm.controls.meals.at(mealIndex) as FormGroup;
    return mealGroup.get('type')?.value !== '';
  }

  cards: any[] = [{ id: 1 }];

  addCard() {
    const newId = this.cards.length ? this.cards[this.cards.length - 1].id + 1 : 1;
    this.cards.push({ id: newId });
  }

  addCardFromChild() {
    const newId = this.cards.length ? this.cards[this.cards.length - 1].id + 1 : 1;
    this.cards.push({ id: newId });
  }
  Submit() {
    console.log(this.DietForm.value);

    this.Diet = this.DietForm.value
    let mappeddiet = this.Diet
    if (mappeddiet.meals) {
      mappeddiet.meals = mappeddiet.meals.map((meal: Meal) => {
        return {
          ...meal,
          id: '',
          name: meal.name,
          mealType: meal.mealType,
          foods: meal.foods.map((food: Food) => {
            return {
              ...food,
              id: '',
              name: food.name,
              calories: food.calories,
              description: food.description,
              foodCategory: food.foodCategory
            };
          }),
        };
      });

    }
    this.mealsEmitter.emit(mappeddiet.meals);


  }

}
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