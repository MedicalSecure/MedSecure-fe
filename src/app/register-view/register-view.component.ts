
import { FlexLayoutModule } from '@angular/flex-layout'; 
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { Router } from '@angular/router';


export interface Allergies {
  AllergyType: string;
  Trigger: string;
  previousTreatments: string;
  ReactionSeverity: string;
}

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

export interface Card {
  id: number;
  text: string;
  postDate: Date;
  availability: number;
  desc: string;
}

interface Pin {
  id: number;
  title: string;
  description: string;
}

const ELEMENT_DATA: Allergies[] = [
  { AllergyType: '', Trigger: 'Hydrogen', previousTreatments: '', ReactionSeverity: 'H' },
  { AllergyType: '', Trigger: 'Helium', previousTreatments: '', ReactionSeverity: 'He' },
  { AllergyType: '', Trigger: 'Lithium', previousTreatments: '', ReactionSeverity: 'Li' },
  { AllergyType: '', Trigger: 'Beryllium', previousTreatments: '', ReactionSeverity: 'Be' },
];

@Component({
  standalone : true,
  selector: 'app-register-view',
  templateUrl: './register-view.component.html',
  styleUrls: ['./register-view.component.css'],
  imports: [RouterModule],
  providers: [MatIconModule, MatTableModule, MatSortModule, MatGridListModule,FlexLayoutModule, MatCardModule],
})
export class RegisterViewComponent {

  // Tableau
  displayedColumns: string[] = ['AllergyType', 'Trigger', 'previousTreatments', 'ReactionSeverity'];
  dataSource = ELEMENT_DATA;

  // Grid
  tiles: Tile[] = [
    { text: 'One', cols: 3, rows: 1, color: 'lightblue' },
    { text: 'Two', cols: 1, rows: 2, color: 'lightgreen' },
    { text: 'Three', cols: 1, rows: 1, color: 'lightpink' },
    { text: 'Four', cols: 2, rows: 1, color: '#DDBDF1' },
  ];

  pins: Pin[] = [
    { id: 1, title: 'Title 1', description: 'Description 1' },
    { id: 2, title: 'Title 2', description: 'Description 2' },
    // Add more pins as needed
  ];

  renderPins() {
    const pinsContainer = document.getElementById('pins-container');

    if (pinsContainer) {
      pinsContainer.innerHTML = '';

      this.pins.forEach(pin => {
        const pinElement = document.createElement('div');
        pinElement.classList.add('pin');

        const titleElement = document.createElement('h2');
        titleElement.textContent = pin.title;

        const descriptionElement = document.createElement('p');
        descriptionElement.textContent = pin.description;

        pinElement.appendChild(titleElement);
        pinElement.appendChild(descriptionElement);
        pinsContainer.appendChild(pinElement);
      });
    }
  }

  constructor(private router: Router) {}

  ngOnInit() {}

  navigateToAddPatient() {
    this.router.navigate(['/register']);
  }
  
}
