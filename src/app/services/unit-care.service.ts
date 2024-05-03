import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {UnitCareData} from '../components/cards-unit-care/cards-unit-care.component';
import { Observable } from 'rxjs';

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


}
