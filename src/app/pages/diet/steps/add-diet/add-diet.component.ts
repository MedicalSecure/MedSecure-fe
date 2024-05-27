import { Component, Input, OnInit, inject } from '@angular/core';
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

@Component({
    selector: 'app-add-diet',
    standalone: true,
    templateUrl: './add-diet.component.html',
    styleUrls: ['./add-diet.component.css'],
    imports: [CommonModule, MatSelectModule, MatMenuModule, RouterModule, MatChipsModule, ReactiveFormsModule, MatIconModule, CommentComponent, MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule]
})
export class AddDietComponent implements OnInit {
  @Input() note: string[];
  liststring: Comment[] = [];
  selectedMealType: string;
  isMealSelected: boolean[] = [];


  MealType: string[] = ["BreakFast", "Lunch", "Dinner", "Snack"];
  FoodOptions: string[];
  StarterList = ['Soup', 'Salad', 'Bruschetta', 'Garlic Bread', 'Spring Rolls', 'Stuffed Mushrooms', 'Nachos'];
  MainDishList = ['Pizza', 'Burger', 'Pasta', 'Steak', 'Grilled Chicken', 'Fish and Chips', 'Tacos', 'Sushi', 'BBQ Ribs', 'Lasagna'];
  DessertList = ['Cake', 'Ice Cream', 'Pie', 'Brownies', 'Cheesecake', 'Pudding', 'Mousse', 'Cookies', 'Tiramisu', 'Macarons'];
  DrinkList = ['Soda', 'Juice', 'Water', 'Coffee', 'Tea', 'Milkshake', 'Smoothie', 'Wine', 'Beer', 'Cocktail'];
  FoodList: { [key: number]: { [key: number]: string[] } } = { 0: { 0: ["Please select a food option"] } };
  fb = inject(NonNullableFormBuilder);
  disableChipState: { [key: number]: { [key: number]: boolean } } = {};

  DietForm: Form = this.fb.group({
    meals: this.fb.array<FormMeal>([this.generateMeal()]),
  });

  constructor() {
    this.selectedMealType = this.MealType[0];

  }

  ngOnInit(): void {
    this.FoodOptions = ['Drink', 'Main Dish', 'Dessert', 'Starter'];
    this.DietForm.controls.meals.valueChanges.subscribe(() => {
      this.isMealSelected = Array(this.DietForm.controls.meals.length).fill(false);
    });
 
  }

  chipSelected(food: string, mealIndex: number, foodIndex: number): void {
    if (!this.disableChipState[mealIndex]) {
      this.disableChipState[mealIndex] = {};
    }
    this.disableChipState[mealIndex][foodIndex] = true;
    this.onOptionChange(food , mealIndex , foodIndex);
  }

  isChipDisabled(mealIndex: number, foodIndex: number): boolean {
    return this.disableChipState[mealIndex]?.[foodIndex] ?? false;
  }

  generateMeal(): FormMeal {
    return this.fb.group({
      type: '',
      foods: this.fb.array<FormFood>([]),
    });
  }

  addMeal(): void {
    this.DietForm.controls.meals.push(this.generateMeal());
  }

  removeMeal(mealIndex: number): void {
    this.DietForm.controls.meals.removeAt(mealIndex);
    delete this.disableChipState[mealIndex];
  }

  onOptionChange(food: string, mealIndex: number, foodIndex: number): void {
    if (!this.FoodList[mealIndex]) {
      this.FoodList[mealIndex] = {};
    }
    if (!this.FoodList[mealIndex][foodIndex]) {
      this.FoodList[mealIndex][foodIndex] = [];
    }
  
    switch (food) {
      case 'Main Dish':
        this.FoodList[mealIndex][foodIndex] = this.MainDishList;
        break;
      case 'Dessert':
        this.FoodList[mealIndex][foodIndex] = this.DessertList;
        break;
      case 'Drink':
        this.FoodList[mealIndex][foodIndex] = this.DrinkList;
        break;
      case 'Starter':
        this.FoodList[mealIndex][foodIndex] = this.StarterList;
        break;
      default:
        this.FoodList[mealIndex][foodIndex] = ["Please select a food option"];
    }
  }

  addFood(mealIndex: number): void {
    const newFood: FormFood = this.fb.group({
      foodType: '',
      foodOption: ''
    });
    this.DietForm.controls.meals.at(mealIndex)?.controls?.foods?.push(newFood);
    const foodIndex = this.DietForm.controls.meals.at(mealIndex)?.controls?.foods?.length - 1;
  
    // Ensure FoodList is initialized up to mealIndex and foodIndex
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
    const value = (event.target as HTMLInputElement).value;
    this.DietForm.controls.meals.at(mealIndex).patchValue({ type: value });
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
}

type Form = FormGroup<{
  meals: FormArray<FormMeal>;
}>;

type FormMeal = FormGroup<{
  type: FormControl<string>;
  foods: FormArray<FormFood>;
}>;

type FormFood = FormGroup<{
  foodType: FormControl<string>;
  foodOption: FormControl<string>;
}>;
