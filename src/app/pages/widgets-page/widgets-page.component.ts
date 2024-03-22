
import { Component, OnInit, Input } from '@angular/core';
import { DashedComponent } from '../../components/charts/dashed/dashed.component'
import { chartsmostmedicationComponent } from '../../components/charts/charts-mostmedication/charts-mostmedication.component'
import { TriCheckCircleProgressComponent } from '../../components/charts/tricheckcircle-progress/tricheckcircle-progress.component'
import { ChartsListeMedstockComponent } from '../../components/charts/charts-liste-medstock/charts-liste-medstock.component'
import { CardComponent } from '../../components/card/card.component'
import { RadialbarChartsComponent, ChartOptionsCircle } from '../../components/charts/radialbar-charts/radialbar-charts.component'
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChartsScatterMedComponent } from '../../components/charts/charts-scatter-med/charts-scatter-med.component'
import { MultiSenseEnviroScanComponent } from '../../components/MultiSense-EnviroScan/MultiSense-EnviroScan.component'

@Component({
  selector: 'app-widgets-page',
  standalone: true,
  imports: [MatProgressSpinnerModule, HttpClientModule, DashedComponent, chartsmostmedicationComponent,
    TriCheckCircleProgressComponent, ChartsListeMedstockComponent, CardComponent,
    RadialbarChartsComponent, ChartsScatterMedComponent, MultiSenseEnviroScanComponent],
  templateUrl: './widgets-page.component.html',
  styleUrl: './widgets-page.component.css'
})
export class WidgetsPageComponent implements OnInit {

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
    this.getJsonDataMedication()
    this.getJsonDataRegistration()
    this.getJsonDataStock()
    this.getJsonDataPresecription()
  }



  getJsonDataMedication(): void {
    const jsonFilePath = 'assets/data/medication.json'; 
    this.http.get(jsonFilePath).subscribe(
      (data: any) => {
        this.jsonData = data;
        console.log('Données JSON:', this.jsonData);
        this.findMostUsedMedicationsByMonth();
      },
      (error) => {
        console.error('Erreur lors de la récupération des données JSON:', error);
      }
    );
  }

  findMostUsedMedicationsByMonth(): void {
    const medicationsByMonth: any = {};

    this.jsonData.forEach((medication: any) => {
      const month = medication.month;
      if (!medicationsByMonth[month]) {
        medicationsByMonth[month] = [];
      }
      medicationsByMonth[month].push(medication);

    });

    for (const month in medicationsByMonth) {
      if (medicationsByMonth.hasOwnProperty(month)) {
        const medications = medicationsByMonth[month];
        medications.sort((a: any, b: any) => b.uses - a.uses);
        this.mostUsedMedicationsByMonth[month] = medications[0];
        medications.sort((a: any, b: any) => a.uses - b.uses);
        this.leastUsedMedicationsByMonth[month] = medications[0];
      }
      this.mostUsedMedicationsByMonth = { ...this.mostUsedMedicationsByMonth }
      this.leastUsedMedicationsByMonth = { ...this.leastUsedMedicationsByMonth }
    }

    console.log('Medications les plus utilisées par mois:', this.mostUsedMedicationsByMonth);
    console.log('Medications les moins utilisées par mois:', this.leastUsedMedicationsByMonth);

  }
  getJsonDataRegistration(): void {
    const jsonFilePath = 'assets/data/registration.json';
    this.http.get<any>(jsonFilePath).subscribe(data => {
      this.checkin = data.checkin;
      this.checkout = data.checkout;
      this.register = data.register;
      console.log('this.checkin', this.checkin)
    });
  }

  getJsonDataStock(): void {
    const jsonFilePath = 'assets/data/stockmedication.json';
    this.http.get<any>(jsonFilePath).subscribe(
      (data: any) => {
        this.Datastock = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des données JSON:', error);
      }
    );
  }

  getJsonDataPresecription(): void {
    const jsonFilePath = 'assets/data/prescriptions.json';
    this.http.get<any>(jsonFilePath).subscribe(
      (data: any) => {
        this.Dataprescription = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des données JSON:', error);
      }
    );
  }


}



