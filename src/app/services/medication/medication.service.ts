import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MedicationService {


  private dataUrl = 'assets/data/MedicationData.json'; // Path to your JSON file

  constructor(private http: HttpClient) {}

  getMedicationsNews(): Observable<any> {
    return this.http.get<any>(this.dataUrl);
  }
  getMedications(){
    return this.http.get<any>(this.dataUrl);
  }
  
}
