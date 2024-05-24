import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ArmoireStock } from '../../../model/ArmoireStock';
import { ArmoireWidgetComponent } from '../../widgets/armoire-widget/armoire-widget.component';


@Component({
  selector: 'app-widgets-armoire-med',
  standalone: true,
  imports: [ArmoireWidgetComponent],
  templateUrl: './widgets-armoire-med.component.html',
  styleUrl: './widgets-armoire-med.component.css'
})
export class WidgetsArmoireMedComponent implements OnInit {
  constructor(private http: HttpClient) { }
  medicationArmoireStock:ArmoireStock[]=[]

  ngOnInit():void {

    this. getJsonArmoireMedicationStock()
  }
  //displays the medications that are in armoire
getJsonArmoireMedicationStock(): void {
  const jsonFilePath = 'assets/data/ArmoireData.json';
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
