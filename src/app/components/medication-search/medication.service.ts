import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MedicationService {

  constructor(private http: HttpClient) { }

  getMedications(){
    return this.http.get<any>("./../../assets/medications.json");
  }
  
}
