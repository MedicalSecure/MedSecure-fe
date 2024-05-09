import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetUnitCareResponse } from '../../types/UnitCareDTOs';

@Injectable({
  providedIn: 'root'
})
export class UnitCareService {
  private apiVersion: number = 1; // Replace 'v1' with your desired API version
  private apiUrl = `http://localhost:5007/api/v${this.apiVersion}/UnitCare`;
  constructor(private http: HttpClient) {}

  getUnitCares(): Observable<GetUnitCareResponse> {
    this.apiUrl="../../../assets/data/unitcares.json"

    let x = this.http.get<GetUnitCareResponse>(this.apiUrl);
    //debugger;
    return x;
  }
}