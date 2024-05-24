import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetDrugsResponse } from '../../types/DrugDTOs';


@Injectable({
  providedIn: 'root'
})
export class MedicationService {

  constructor(private http: HttpClient) { }

  getMedications(){
    return this.http.get<GetDrugsResponse>("./../../assets/data/medications.json");
  }
  
}
