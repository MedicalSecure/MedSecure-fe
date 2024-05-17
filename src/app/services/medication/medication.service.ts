import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CheckDrugRequest } from '../../types/DrugDTOs';

@Injectable({
  providedIn: 'root'
})
export class DrugService {

  constructor(private http: HttpClient) { }

  apiUrl = "http://localhost:5008/api/v1/drugsChecked";

  getMedications(){
    return this.http.get<any>("./../../assets/data/medications.json");
  }

  checkDrugs(checkDrugRequest: CheckDrugRequest) {
    console.log("ligne 17");
    console.log(checkDrugRequest);
    console.log(JSON.stringify(checkDrugRequest))
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    headers.set('accept','application/json'); 
    let x = this.http.post<any>(
      this.apiUrl,
      checkDrugRequest,
      { headers: headers }
    );
    console.log("ligne 27");
    console.log(x);
    return x;
  }
  
}
