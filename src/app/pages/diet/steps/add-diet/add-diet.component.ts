import { Component, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardComponent } from '../card/card.component';
@Component({
  selector: 'app-add-diet',
  standalone: true,
  imports: [CommonModule, RouterModule , CardComponent],
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
  constructor() {
    this.selectedMealType = this.MealType[0];
  }
  onMealTypeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedMealType = selectElement.value;
  }
  cards: any[] = [{ id: 1 }]; // Initialize with one card

  addCard() {
    const newId = this.cards.length ? this.cards[this.cards.length - 1].id + 1 : 1;
    this.cards.push({ id: newId });
  }

  addCardFromChild() {
    const newId = this.cards.length ? this.cards[this.cards.length - 1].id + 1 : 1;
    this.cards.push({ id: newId });
  }
  removeCard(cardId: number) {
    this.cards = this.cards.filter(card => card.id !== cardId);
  }
 

  

}
