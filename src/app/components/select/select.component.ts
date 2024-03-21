import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import {DashedComponent} from '../../components/charts/dashed/dashed.component'
import {WidgetsPageComponent} from '../../pages/widgets-page/widgets-page.component'
import {DetectionTempComponent} from '../../components/detection-temp/detection-temp.component'
@Component({
  selector: 'app-select',
  standalone: true,
  imports: [ CommonModule, 
  HttpClientModule, DashedComponent,WidgetsPageComponent,DetectionTempComponent],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css'
})
export class SelectComponent implements OnInit{
  unitesSoins: any[] = [];
  selectedUniteSoin: any;

  constructor(private http: HttpClient,private router: Router) {}

  ngOnInit() {
    this.http.get<any[]>('assets/data/unites-soins.json').subscribe(data => {
      this.unitesSoins = data;
    });
  }

  onSelectUniteSoin(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value; 
    this.selectedUniteSoin = selectedValue;
  }
}

