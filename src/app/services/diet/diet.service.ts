import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetDietResponse } from '../../types/DietDTOs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DietService {
  private apiVersion: number = 1; // Replace 'v1' with your desired API version
  private apiUrl = `http://localhost:5007/api/v${this.apiVersion}/Diets`;
  constructor(private http: HttpClient) {}

  getDiets(): Observable<GetDietResponse> {
    this.apiUrl="../../../assets/data/diets.json"
    let x = this.http.get<GetDietResponse>(this.apiUrl);
    //debugger;
    return x;
  }
}