import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-add-diet',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './add-diet.component.html',
  styleUrl: './add-diet.component.css'
})
export class AddDietComponent {
  selectedMealType: string;
  MealType: string[] = [
    "Break Fast",
    "Lunch",
    "Dinner",
    "Snack"
  ];
  FoodOptions: string[] = ['Drink', 'Main Dish', 'Dessert', 'Starter'];
  StarterList = ['Soup', 'Salad', 'Bruschetta', 'Garlic Bread', 'Spring Rolls', 'Stuffed Mushrooms', 'Nachos'];
  MainDishList = ['Pizza', 'Burger', 'Pasta', 'Steak', 'Grilled Chicken', 'Fish and Chips', 'Tacos', 'Sushi', 'BBQ Ribs', 'Lasagna'];
  DessertList = ['Cake', 'Ice Cream', 'Pie', 'Brownies', 'Cheesecake', 'Pudding', 'Mousse', 'Cookies', 'Tiramisu', 'Macarons'];
  DrinkList = ['Soda', 'Juice', 'Water', 'Coffee', 'Tea', 'Milkshake', 'Smoothie', 'Wine', 'Beer', 'Cocktail'];


  // Define the currently selected food list
  FoodList :string[] = [];
  constructor() {
    this.selectedMealType = this.MealType[0];
  }
  onOptionChange(selectedOption: string) {
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
          this.FoodList = this.DrinkList;
          break;
      default:
        this.FoodList = ["please select food option"];
    }
  }
  
  onMealTypeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedMealType = selectElement.value;
  }
}
