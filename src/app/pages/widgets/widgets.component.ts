import { Component, OnInit, Input } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import{MedicationsWidgetComponent} from '../../components/widgets/medications-widget/medications-widget.component'
import {StockOutWidgetComponent} from'../../components/widgets/stock-out-widget/stock-out-widget.component'
import {ArmoireWidgetComponent} from '../../components/widgets/armoire-widget/armoire-widget.component'

import { PatientsWidgetComponent} from '../../components/widgets/patients-widget/patients-widget.component'
import { CardComponent } from '../../components/card/card.component'
import { RadialbarChartsComponent } from '../../components/widgets/radialbar-charts/radialbar-charts.component'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PrescriptionWidgetComponent  } from '../../components/widgets/prescription-widget/prescription-widget.component'
import { MultiSenseWidgetComponent} from '../../components/widgets/multisense-widget/multisense-widget.component'



import {ArmoireStock } from "../../model/ArmoireStock"
import { Medication } from './../../model/Medications';
import {Stockout} from "../../model/stockout"
import { Presecription } from "../../model/Presecription"
@Component({
  selector: 'app-widgets',
  standalone: true,
  imports: [ HttpClientModule,MedicationsWidgetComponent,StockOutWidgetComponent,ArmoireWidgetComponent
  ,MatProgressSpinnerModule,PatientsWidgetComponent, CardComponent,
    RadialbarChartsComponent, PrescriptionWidgetComponent , MultiSenseWidgetComponent]
  ,
  templateUrl: './widgets.component.html',
  styleUrl: './widgets.component.css'
})
export class WidgetsComponent implements OnInit {
  medicationData: Medication[]= [];
  medicationsInRupture: Stockout[] = [];
  medicationsDataprescription: Presecription[] = [];
  medicationArmoireStock:ArmoireStock []=[]

  DateUsedMedicationsByMonth: Date[] = []
  mostUsedMedicationsByMonth: any = {};
  leastUsedMedicationsByMonth: any = {}
  checkin: number = 0;
  checkout: number = 0;
  register: number = 0;
  Datastock: String[] = []
  Dataprescription: String[] = []
  jsonData: any;

  constructor(private http: HttpClient) { }
  ngOnInit(): void {
    this. getMedicationData()
    this.getJsonArmoireMedicationStock()
    this.getJsonDataRegistration()
    this.getJsonDataPresecription()

  }
    

  // displays the list of medications with their respective stock 
    getMedicationData(): void {
      this.http.get<any>('assets/data/MedicationData.json').subscribe(
        (data) => {
          this.medicationData = data.Medications.medication.map((med: any) => ({
            Name: med.Name,
            AvailableStock: med['Available Stock'],
            MaxStock:((2*med['Avrg Stock'])-med['Min Stock']),
            AvrgStock:med['Avrg Stock'],
            MinStock:med['Min Stock'],
            AlertStock:med['Alert Stock'],
            SafetyStock:med['Safety Stock'],

          }));
          console.log('Medications Details:', this.medicationData);
          this.checkRupture();
        },
        (error) => {
          console.error('Error to fetch data from JSON : ', error);
        }
      );
    }
 
    //displays the medications that are out of stock
    checkRupture(): void {
      
     this.medicationData.forEach((med) => {
        if (med.AvailableStock < med['MinStock'] || med.AvailableStock < med['SafetyStock']) {
          this.medicationsInRupture.push({
            Nom: med.Name,
            StockDisponible: med.AvailableStock,
            StockMin: med.MinStock,
    StockAlerte: med.AlertStock,
    StockSécurité: med.SafetyStock

          });
        }
      });
      console.log('Medications out of stock: ', this.medicationsInRupture);
    }

    //displays the medications of presecription
    getJsonMedicationDataPresecription(): void {
      const jsonFilePath = 'assets/data/prescriptions.json';
      this.http.get<any>(jsonFilePath).subscribe(
        (data: any) => {
          this.medicationsDataprescription = data;
         
        },
        (error) => {
          console.error('Error to fetch data from JSON : ', error);
        }
      );
    }

   //displays the medications that are in armoire 
    getJsonArmoireMedicationStock(): void {
      const jsonFilePath = 'assets/data/ArmoireData.json';
      this.http.get<any>(jsonFilePath).subscribe(
        (data: any) => { 
          this.medicationArmoireStock = data;
        },
        (error) => {
          console.error('Error to fetch data from JSON : ', error);
        }
      );
    }
    

   
  
  // displays the progress of checkin, checkout, register
    getJsonDataRegistration(): void {
      const jsonFilePath = 'assets/data/registration.json';
      this.http.get<any>(jsonFilePath).subscribe(data => {
        this.checkin = data.checkin;
        this.checkout = data.checkout;
        this.register = data.register;
        console.log('this.checkin', this.checkin)
      });
    }
  
   
   //displays the medications of presecription
    getJsonDataPresecription(): void {
      const jsonFilePath = 'assets/data/prescriptions.json';
      this.http.get<any>(jsonFilePath).subscribe(
        (data: any) => {
          this.Dataprescription = data;
        },
        (error) => {
          console.error('Error to fetch data from JSON : ', error);
        }
      );
    }


}
