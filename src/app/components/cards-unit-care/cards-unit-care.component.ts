import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { UnitCareService } from '../../services/unit-care.service';
import { Router } from '@angular/router';
import { UnitCare } from '../../model/UnitCareData';



 export interface UnitCareData {
  unitCares: {
    pageIndex: number;
    pageSize: number;
    count: number;
    data: UnitCare[];
  };
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
  constructor(public unitcare : UnitCareService , private router :Router ) { }

  //Methods

  getButtonClass(index: number): string {
    switch(index) {
      case 0:
        return 'btn btn-success';
      case 1:
        return 'btn btn-secondary';
      case 2:
        return 'btn btn-primary';
      case 3:
        return 'bouton'
      default:
        return 'btn btn-default'; // Add more cases if needed
    }
  }





ngOnInit() {
  this.fetchUnitCares();


}

fetchUnitCares() {
  this.unitcare.getCardData().subscribe(
    (response: UnitCareData) => {
      this.cards = response.unitCares.data;
    },
    (error: any) => {
      console.error('Error fetching Unitcares:', error);
    }
  );
}
onDelete(id: number|string) {
  this.unitcare.deleteCardData(id)
    .subscribe(
      response => {
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['unit-care']);
          })
        console.log('Data deleted successfully!');

      },
      error => {
        if (error.status === 409) {
          console.error('Optimistic concurrency exception:', error);
          // Display an error message to the user
          alert('Data has been modified by another user. Please refresh and try again.');
        } else {
          console.error('Error deleting data:', error);
          // Handle other errors
        }
      }
    );
}



}





