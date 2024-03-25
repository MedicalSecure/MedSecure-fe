import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { cardData } from '../../card-data';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-cards-unit-care',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    CommonModule],
  templateUrl: './cards-unit-care.component.html',
  styleUrl: './cards-unit-care.component.css'
})
export class CardsUnitCareComponent {

  //Data
  cards=cardData;
  selectedCard: any;

  //Methods

  getButtonClass(index: number): string {
    switch(index) {
      case 0:
        return 'btn btn-primary';
      case 1:
        return 'btn btn-secondary';
      case 2:
        return 'btn btn-success';
      case 3:
        return 'bouton'
      default:
        return 'btn btn-default'; // Add more cases if needed
    }
  }

  showRooms(card: any) {
    this.selectedCard = card;
  }

}
