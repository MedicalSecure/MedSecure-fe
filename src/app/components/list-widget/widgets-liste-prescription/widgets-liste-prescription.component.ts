import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PrescriptionWidgetComponent } from '../../widgets/prescription-widget/prescription-widget.component';

@Component({
  selector: 'app-widgets-liste-prescription',
  standalone: true,
  imports: [PrescriptionWidgetComponent],
  templateUrl: './widgets-liste-prescription.component.html',
  styleUrl: './widgets-liste-prescription.component.css'
})
export class WidgetsListePrescriptionComponent implements OnInit{
  Dataprescription: String[] = []
  constructor(private http: HttpClient) { }

  ngOnInit():void {

    this. getJsonDataPresecription()
  }
//displays the medications of presecription
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
