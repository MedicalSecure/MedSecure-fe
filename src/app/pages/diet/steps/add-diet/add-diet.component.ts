import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FormArray, FormControl, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommentComponent } from "../../../../components/comment/comment.component";
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
  liststring: string[] = ["blablabla"];
  selectedMealType: string;
  isMealSelexted: boolean = false ;

  MealType: string[] = ["BreakFast", "Lunch", "Dinner", "Snack"];
  FoodOptions: string[];
  StarterList = ['Soup', 'Salad', 'Bruschetta', 'Garlic Bread', 'Spring Rolls', 'Stuffed Mushrooms', 'Nachos'];
  MainDishList = ['Pizza', 'Burger', 'Pasta', 'Steak', 'Grilled Chicken', 'Fish and Chips', 'Tacos', 'Sushi', 'BBQ Ribs', 'Lasagna'];
  DessertList = ['Cake', 'Ice Cream', 'Pie', 'Brownies', 'Cheesecake', 'Pudding', 'Mousse', 'Cookies', 'Tiramisu', 'Macarons'];
  DrinkList = ['Soda', 'Juice', 'Water', 'Coffee', 'Tea', 'Milkshake', 'Smoothie', 'Wine', 'Beer', 'Cocktail'];
  FoodList: string[] = ["please select food type"];
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
  }

  chipSelected(food: string, mealIndex: number, foodIndex: number): void {
    if (!this.disableChipState[mealIndex]) {
      this.disableChipState[mealIndex] = {};
    }
    this.disableChipState[mealIndex][foodIndex] = true;
    this.onOptionChange(food);
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

  onOptionChange(selectedOption: string): void {
    switch (selectedOption) {
      case 'Main Dish':
        this.FoodList = this.MainDishList;
        break;
      case 'Dessert':
        this.FoodList = this.DessertList;
        break;
      case 'Drink':
        this.FoodList = this.DrinkList;
        break;
      case 'Starter':
        this.FoodList = this.StarterList;
        break;
      default:
        this.FoodList = ["Please select a food option"];
    }
  }

  addFood(mealIndex: number): void {
    const newFood: FormFood = this.fb.group({
      foodType: '',
      foodOption: ''
    });
    this.DietForm.controls.meals.at(mealIndex)?.controls?.foods?.push(newFood);
    const foodIndex = this.DietForm.controls.meals.at(mealIndex)?.controls?.foods?.length - 1;
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
    this.isMealSelexted = true ;

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
