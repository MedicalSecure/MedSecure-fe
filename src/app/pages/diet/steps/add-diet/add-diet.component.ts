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
 

  

}
