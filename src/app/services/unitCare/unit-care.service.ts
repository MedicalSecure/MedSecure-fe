import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UnitCare, UnitCareData } from '../../model/unitCare/UnitCareData';




@Injectable({
  providedIn: 'root',
})


export class UnitCareService  {

  link = "https://localhost:6064/unitcare-service/unitCares";
  constructor(private http: HttpClient) {}


  getCardData(): Observable<UnitCareData> {

    return this.http.get<UnitCareData>(this.link);
  }

  deleteCardData(id: number|string|undefined): Observable<any> {
    const url = `${this.link}/${id}`; // Construct URL with ID
    return this.http.delete(url); // Use HTTP DELETE method
  }
  postUnitCare(unitcare: UnitCare): Observable<any> {
    const formData = { "UnitCare": unitcare };

    return this.http.post<any>(this.link, formData);
  }

}
