import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { UnitCare, UnitCareData } from '../model/UnitCareData';

@Injectable({
  providedIn: 'root',
})


export class UnitCareService {
  constructor(private http: HttpClient) {}

  getCardData(): Observable<UnitCareData> {

    return this.http.get<UnitCareData>('http://localhost:5102/unitCares');
  }

  deleteCardData(id: number|string|undefined): Observable<any> {
    const url = `http://localhost:5102/unitCares/${id}`; // Construct URL with ID
    return this.http.delete(url); // Use HTTP DELETE method
  }
  postUnitCare(unitcare: UnitCare): Observable<any> {
    const formData = { "UnitCare": unitcare };
    const url = 'http://localhost:5102/unitCares'; // URL for POST request
    return this.http.post<any>(url, formData);
  }

}
