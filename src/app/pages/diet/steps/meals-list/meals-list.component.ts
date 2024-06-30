import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxMasonryOptions, NgxMasonryModule } from 'ngx-masonry';
import { DietsService } from '../../../../services/diets/diets.service';
import { Diet, DietResponse } from '../../../../model/Diet';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { identity } from 'rxjs';

@Component({
  selector: 'app-meals-list',
  standalone: true,
  imports: [NgxMasonryModule, MatProgressSpinnerModule],
  templateUrl: './meals-list.component.html',
  styleUrl: './meals-list.component.css'
})
export class MealsListComponent implements OnInit {
  @Input() stepNumber: number = 0;
  @Output() stepNumberChange = new EventEmitter<number>();
  dietToEmit : Diet | undefined ;
  @Output() dietEmmitter = new EventEmitter<Diet>();

  public masonryOptions: NgxMasonryOptions = {
    gutter: 50,
    fitWidth: true,
    horizontalOrder: true,
  };
  diet: Diet[] = []
  IsPatientListLoading: boolean = false;
  constructor(private dietsService: DietsService, private router: Router) {
  }
  ngOnInit(): void {
    this.fetchDiet();
  }
  fetchDiet() {
    this.IsPatientListLoading = true;
    this.dietsService.getDiet().subscribe(
      (response: DietResponse) => {
        console.log('Response:', response.diets);
        this.diet = response.diets.data || [];
        console.log('this.diet', this.diet);
        this.IsPatientListLoading = false;
      },
      error => {
        console.error('Error fetching data:', error);
        this.IsPatientListLoading = false;
      }
    );
  }
  formatDate(date: Date) {
    return date.toString();

  }
  editMeals(id : string) {
    this.stepNumber = 2 ; 
    this.stepNumberChange.emit(this.stepNumber);
    this.dietToEmit = this.diet.find(diet => diet.id === id);
    this.dietEmmitter.emit(this.dietToEmit ) ; 
  }
  deleteMeal(id : string){
    this.dietsService.deleteDiet(id);

    console.log("idididididid",id);
   // window.location.reload();
   this.diet = this.diet.filter(diet => diet.id !== id);


    
    
  }
  getDietTypeLabel(dietType: number): string {
    switch (dietType) {
      case 1: return 'Normal';
      case 2: return 'Liquid';
      case 3: return 'SemiLiquid';
      case 4: return 'Diabetic';
      case 5: return 'NoSalt';
      case 6: return 'DiabeticNoSalt';
      case 7: return 'SemiLiquidDiabetic';
      case 8: return 'SemiLiquidNoSalt';
      case 9: return 'SemiLiquidDiabeticNoSalt';
      case 10: return 'NoResidue';
      case 11: return 'BrothYogurtCompote';
      case 12: return 'Puree';
      case 13: return 'HyperProtein';
      case 14: return 'HyperCaloric';
      case 15: return 'HypoCaloric';
      case 16: return 'TubeFeeding';
      default: return '';
    }
  }
}
