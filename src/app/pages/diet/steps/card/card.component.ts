import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule 
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  FoodOptions: string[] = ['Drink', 'Main Dish', 'Dessert', 'Starter'];
  StarterList = ['Soup', 'Salad', 'Bruschetta', 'Garlic Bread', 'Spring Rolls', 'Stuffed Mushrooms', 'Nachos'];
  MainDishList = ['Pizza', 'Burger', 'Pasta', 'Steak', 'Grilled Chicken', 'Fish and Chips', 'Tacos', 'Sushi', 'BBQ Ribs', 'Lasagna'];
  DessertList = ['Cake', 'Ice Cream', 'Pie', 'Brownies', 'Cheesecake', 'Pudding', 'Mousse', 'Cookies', 'Tiramisu', 'Macarons'];
  DrinkList = ['Soda', 'Juice', 'Water', 'Coffee', 'Tea', 'Milkshake', 'Smoothie', 'Wine', 'Beer', 'Cocktail'];
  @Input() cardId: number;
  @Output() remove = new EventEmitter<number>();
  @Output() add = new EventEmitter<void>();
  constructor() {}
  FoodList :string[] = [];
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
          this.FoodList = this.StarterList;
          break;
      default:
        this.FoodList = ["please select food option"];
    }
  }
  

  removeCard() {
    this.remove.emit(this.cardId);
  }

  addCard() {
    this.add.emit();
  }
}
