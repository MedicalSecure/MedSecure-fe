import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay, switchMap, timer } from 'rxjs';
import { GetPatientsResponse } from '../../types/registerDTOs';

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

    return timer(1000).pipe(
      delay(1000), // Delaying the emission by 3 seconds
      switchMap(() => this.http.get<GetPatientsResponse>(this.apiUrl))
    )
  }
}
