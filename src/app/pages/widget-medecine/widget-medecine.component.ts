import { Component, OnInit, Input } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import{MedicationsListeComponent} from '../../components/charts/medications-liste/medications-liste.component'
import { MedicationData } from "../../model/MedicationData"
import {ReptureMedicationData } from "../../model/ReptureMedicationData"
import {MedicationsInRuptureComponent} from'../../components/charts/medications-in-rupture/medications-in-rupture.component'
import {MedicationsConsommationComponent} from '../../components/charts/medications-consommation/medications-consommation.component'
import { PresecriptionMedicament } from "../../model/PresecriptionMedicament"
import {ArmoireMedicamentComponent} from '../../components/charts/armoire-medicament/armoire-medicament.component'
import {UniteDeSoinData } from "../../model/UniteDeSoinData"
import {ArmoireStock } from "../../model/ArmoireStock"
@Component({
  selector: 'app-widget-medecine',
  standalone: true,
  imports: [ HttpClientModule,MedicationsListeComponent,MedicationsInRuptureComponent,MedicationsConsommationComponent,ArmoireMedicamentComponent],
  templateUrl: './widget-medecine.component.html',
  styleUrl: './widget-medecine.component.css'
})
export class WidgetMedecineComponent implements OnInit {
  medicationData: MedicationData[] = [];
  medicationsInRupture: ReptureMedicationData[] = [];
  medicationsDataprescription: PresecriptionMedicament[] = [];
  medicationArmoire :UniteDeSoinData[]=[]
  medicationArmoireStock:ArmoireStock []=[]
  constructor(private http: HttpClient) { }
  ngOnInit(): void {
    this. getMedicationData()
    this.  getJsonMedicationDataPresecription()
    this.getJsonArmoireMedicationStock()

  }
    
    getMedicationData(): void {
      this.http.get<any>('assets/data/medications.json').subscribe(
        (data) => {
          this.medicationData = data.Medications.medication.map((med: any) => ({
            Nom: med.Nom,
            StockDisponible: med['Stock dispo'],
            StockMax:((2*med['Stock moy'])-med['Stock min']),
            STockMoy:med['Stock moy'],
            StockMin:med['Stock min'],
            StockAlerte:med['Stock alerte'],
            StockSécurité:med['Stock sécurité'],

          }));
          console.log('Données des médicaments:', this.medicationData);
          this.checkRupture();
        },
        (error) => {
          console.error('Erreur lors de la récupération des données JSON:', error);
        }
      );
    }
 
    checkRupture(): void {
      
     this.medicationData.forEach((med) => {
        if (med.StockDisponible < med['StockMin'] || med.StockDisponible < med['StockSécurité']) {
          this.medicationsInRupture.push({
            Nom: med.Nom,
            StockDisponible: med.StockDisponible,
            StockMin: med.StockMin,
    StockAlerte: med.StockAlerte,
    StockSécurité:med. StockSécurité

          });
        }
      });
      console.log('Médicaments en rupture de stock:', this.medicationsInRupture);
    }

    getJsonMedicationDataPresecription(): void {
      const jsonFilePath = 'assets/data/prescriptions.json';
      this.http.get<any>(jsonFilePath).subscribe(
        (data: any) => {
          this.medicationsDataprescription = data;
         
        },
        (error) => {
          console.error('Erreur lors du chargement des données JSON:', error);
        }
      );
    }
    // getJsonArmoireMedication(): void {
    //   const jsonFilePath = 'assets/data/UniteDeSoinData.json';
    //   this.http.get<any>(jsonFilePath).subscribe(
    //     (data: any) => { 
    //       this.medicationArmoire = data;
    //       console.log('hhhhh', this.medicationArmoire);
    //     },
    //     (error) => {
    //       console.error('Erreur lors du chargement des données JSON:', error);
    //     }
    //   );
    // }
    getJsonArmoireMedicationStock(): void {
      const jsonFilePath = 'assets/data/ArmoireStock.json';
      this.http.get<any>(jsonFilePath).subscribe(
        (data: any) => { 
          this.medicationArmoireStock = data;
        },
        (error) => {
          console.error('Erreur lors du chargement des données JSON:', error);
        }
      );
    }
    
}
