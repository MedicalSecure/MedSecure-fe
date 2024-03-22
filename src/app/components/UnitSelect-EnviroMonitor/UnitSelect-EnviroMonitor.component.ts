import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import {DashedComponent} from '../charts/dashed/dashed.component'
import {WidgetsPageComponent} from '../../pages/widgets-page/widgets-page.component'
import {MultiSenseEnviroScanComponent} from '../MultiSense-EnviroScan/MultiSense-EnviroScan.component'
@Component({
  selector: 'app-unitselect-enviromonitor',
  standalone: true,
  imports: [ CommonModule, 
  HttpClientModule, DashedComponent,WidgetsPageComponent,MultiSenseEnviroScanComponent],
  templateUrl: './UnitSelect-EnviroMonitor.component.html',
  styleUrl: './UnitSelect-EnviroMonitor.component.css'
})
export class UnitSelectEnviroMonitorComponent implements OnInit{
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

