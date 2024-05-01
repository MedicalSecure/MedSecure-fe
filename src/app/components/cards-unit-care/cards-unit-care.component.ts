import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface UnitCareData {
  unitCares: {
    pageIndex: number;
    pageSize: number;
    count: number;
    data: UnitCare[];
  };
}

interface UnitCare {
  id: string;
  type: string;
  description: string;
  title: string;
  rooms: Room[];
  personnels: Personnel[];
}

interface Room {
  id: string;
  unitCareId: string;
  roomNumber: number;
  status: number;
  equipments: Equipment[];
}

interface Equipment {
  id: string;
  roomId: string;
  name: string;
  reference: string;
}

interface Personnel {
  id: string;
  unitCareId: string;
  name: string;
  shift: number;
  gender:number
}



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

  cards: UnitCare[] = [];
  constructor(private http: HttpClient) { }

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



getCardData() {
  this.http.get<UnitCareData>('http://localhost:5102/unitCares')
  .subscribe(response => {
    response.unitCares.data
this.cards=(response.unitCares.data)
  },
  error => {
    console.error('Error fetching unit care data:', error);
  });
}

ngOnInit() {
  this.getCardData();
}




}
