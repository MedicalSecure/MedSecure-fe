import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay, map, switchMap, timer } from 'rxjs';
import { GetPatientsResponse, GetRegistrationsResponse } from '../../types/registerDTOs';
import { parseDates } from '../prescription/prescription-api.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiVersion: number = 1; // Replace 'v1' with your desired API version
  private apiUrl = `http://localhost:5007/api/v${this.apiVersion}/Register`;
  constructor(private http: HttpClient) {}

  getPatients(): Observable<GetPatientsResponse> {
    this.apiUrl="../../../assets/data/patients.json"
/*     let x = this.http.get<GetPatientsResponse>(this.apiUrl);
    return x; */

    return timer(200).pipe(
      delay(200), // Delaying the emission by 3 seconds
      switchMap(() => this.http.get<GetPatientsResponse>(this.apiUrl))
    )
  }


  getRegistrations(
    pageIndex: number = 0,
    pageSize: number = 10
  ): Observable<GetRegistrationsResponse> {
    this.apiUrl="../../../assets/data"
    const params = new HttpParams()
      .set('PageIndex', pageIndex.toString())
      .set('PageSize', pageSize.toString());
    return this.http
      .get<GetRegistrationsResponse>(this.apiUrl + '/registration.json', { params })
      .pipe(
        map((response) => {
          return parseDates(response);
        })
      );
  }
}
