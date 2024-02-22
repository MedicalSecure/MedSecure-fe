import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddUnitCareDialogComponent } from '../../components/add-unit-care-dialog/add-unit-care-dialog.component';
import { SideRoomsComponent } from "../../components/side-rooms/side-rooms.component";


type CardContent = {
  title: string;
  description: string;
};
type RoomContent = {
  Number: string;
  status: string;
};

@Component({
    selector: 'app-unit-care',
    standalone: true,
    templateUrl: './unit-care.component.html',
    styleUrl: './unit-care.component.css',
    imports: [
        MatCardModule,
        MatButtonModule,
        MatDialogModule,
        MatToolbarModule,
        CommonModule,
        MatIconModule,
        SideRoomsComponent
    ]
})
export class UnitCareComponent {

addCard($event: Event) {
throw new Error('Method not implemented.');
}
  cards = signal<CardContent[]>([]);
  rooms = signal<RoomContent[]>([]);


  constructor(private dialog: MatDialog,) {
    const cards: CardContent[] = [];
    for (let i = 0; i < 6; i++) {
      cards.push({
        title: `Unit ${i + 1}`,
        description: `Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. `,
      });
    }

    this.cards.set(cards);

    const rooms: RoomContent[] = [];
    for (let i = 0; i < 8; i++) {
      rooms.push({
        Number: `520 `,
        status: `activated `,
      });
    }

    this.rooms.set(rooms);
  }



ngOnInit() {

}




  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddUnitCareDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const updatedCards = this.cards() || []; // Get the current value of cards
        updatedCards.push(result); // Add the new card
        this.cards.set(updatedCards); // Set the updated cards array
      }
    });
  }
}
