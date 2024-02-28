import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SideRoomsComponent } from "../../components/side-rooms/side-rooms.component";
import { cardData } from '../../card-data';

@Component({
    selector: 'app-unit-care',
    standalone: true,
    templateUrl: './unit-care.component.html',
    styleUrl: './unit-care.component.css',
    imports: [
        MatButtonModule,
        CommonModule,
        MatIconModule,
        SideRoomsComponent
    ]
})
export class UnitCareComponent {

 cards=cardData;


  constructor() {}


  getButtonClass(index: number): string {
    switch(index) {
      case 0:
        return 'btn btn-primary';
      case 1:
        return 'btn btn-secondary';
      case 2:
        return 'btn btn-success';
      default:
        return 'btn btn-default'; // Add more cases if needed
    }
  }

  selectedCard: any;

  showRooms(card: any) {
    this.selectedCard = card;
  }



}
