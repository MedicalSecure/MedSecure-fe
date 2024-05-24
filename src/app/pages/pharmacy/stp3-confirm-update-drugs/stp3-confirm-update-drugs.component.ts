import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stp3-confirm-update-drugs',
  standalone: true,
  imports: [MatProgressSpinner, CommonModule],
  templateUrl: './stp3-confirm-update-drugs.component.html',
  styleUrl: './stp3-confirm-update-drugs.component.css'
})
export class Stp3ConfirmUpdateDrugs {

  isLoading: boolean = true;

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }
}
