import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FormArray, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommentComponent } from "../../../../components/comment/comment.component";
@Component({
    selector: 'app-add-diet',
    standalone: true,
    templateUrl: './add-diet.component.html',
    styleUrls: ['./add-diet.component.css'],
    imports: [CommonModule, RouterModule, ReactiveFormsModule, MatIconModule, CommentComponent]
})
export class AddDietComponent implements OnInit {
  @Input() note : string[];
liststring :string[] = ["blablabla"]
  selectedMealType: string;
  MealType: string[] = ["BreakFast", "Lunch", "Dinner", "Snack"];
  FoodOptions: string[] ;
  StarterList = ['Soup', 'Salad', 'Bruschetta', 'Garlic Bread', 'Spring Rolls', 'Stuffed Mushrooms', 'Nachos'];
  MainDishList = ['Pizza', 'Burger', 'Pasta', 'Steak', 'Grilled Chicken', 'Fish and Chips', 'Tacos', 'Sushi', 'BBQ Ribs', 'Lasagna'];
  DessertList = ['Cake', 'Ice Cream', 'Pie', 'Brownies', 'Cheesecake', 'Pudding', 'Mousse', 'Cookies', 'Tiramisu', 'Macarons'];
  DrinkList = ['Soda', 'Juice', 'Water', 'Coffee', 'Tea', 'Milkshake', 'Smoothie', 'Wine', 'Beer', 'Cocktail'];
  FoodList: string[] = [];
  fb = inject(NonNullableFormBuilder);
  DietForm: Form = this.fb.group({
    meals: this.fb.array<FormMeal>([this.generateMeal()]),
  });

  constructor() {
    this.selectedMealType = this.MealType[0];

  }

  ngOnInit(): void {
   this.FoodOptions = ['Drink', 'Main Dish', 'Dessert', 'Starter']
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
  }

  removeFood(mealIndex: number, foodIndex: number): void {
    this.DietForm.controls.meals.at(mealIndex)?.controls?.foods?.removeAt(foodIndex);
  }

  onMealTypeChange(event: Event, mealIndex: number): void {
    const value = (event.target as HTMLInputElement).value;
    this.DietForm.controls.meals.at(mealIndex).patchValue({ type: value });
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
