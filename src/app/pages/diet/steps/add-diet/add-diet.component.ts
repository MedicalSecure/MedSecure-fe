import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-add-diet',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './add-diet.component.html',
  styleUrl: './add-diet.component.css'
})
export class AddDietComponent {
DietCategory: string[]=[
  "normal",
  "liquid",
  "semi-liquid",
  "diabetic",
  "salt-free",
  "diabetic salt-free",
  "diabetic semi-liquid",
  "semi-liquid salt-free ",
  "diabetic semi-liquid salt-free ",
  "residue-free ",
  "broth-yogurt-puree",
  "mush",
  "high-protein",
  "high-calorie",
  "low-calorie",
  "force-feeding"
];

}
