import { Component, OnInit } from '@angular/core';

import { Medication } from '../../../model/Medications';
import { HttpClient } from '@angular/common/http';
import { Stockout } from '../../../model/stockout';
import { MedicationsWidgetComponent } from '../../widgets/medications-widget/medications-widget.component';
@Component({
  selector: 'app-widgets-liste-medications',
  standalone: true,
  imports: [MedicationsWidgetComponent],
  templateUrl: './widgets-liste-medications.component.html',
  styleUrl: './widgets-liste-medications.component.css'
})
export class WidgetsListeMedicationsComponent  implements OnInit{
  medicationData: Medication[]= [];
  medicationsInRupture: Stockout[] = [];
  constructor(private http: HttpClient) { }

  ngOnInit():void {

    this. getMedicationData()
  }
  // displays the list of medications with their respective stock
 getMedicationData(): void {
  this.http.get<any>('assets/data/MedicationData.json').subscribe(
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

      this.checkRupture();
    },
    (error) => {
      console.error('Erreur lors de la récupération des données JSON:', error);
    }
  );
}
//displays the medications that are out of stock
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

 }
}
