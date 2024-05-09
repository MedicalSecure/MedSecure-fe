import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetMedicationsResult } from '../../types/medicationDTOs';

@Injectable({
  providedIn: 'root'
})
export class MedicationService {

  constructor(private http: HttpClient) { }

  getMedications(){
    return this.http.get<GetMedicationsResult>("./../../assets/data/medications.json");
  }
  
}
