import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { DietDto, GetDietResponse } from '../../types/DietDTOs';
import { HttpClient } from '@angular/common/http';
import { parseDates } from '../prescription/prescription-api.service';

@Injectable({
  providedIn: 'root'
})
export class DietService {
  private apiVersion: number = 1; // Replace 'v1' with your desired API version
  private apiUrl = `http://localhost:5007/api/v${this.apiVersion}/Diets`;
  constructor(private http: HttpClient) {}

  getDiets(): Observable<GetDietResponse> {
    this.apiUrl="../../../assets/data/diets.json"
    let x = this.http.get<GetDietResponse>(this.apiUrl).pipe(map(parseDates));
    //debugger;
    return x;
  }

  getDietById(dietId: string): Observable<DietDto | undefined> {
    this.apiUrl = "../../../assets/data/diets.json";
    return this.http.get<GetDietResponse>(this.apiUrl).pipe(
      map((DietResponse: GetDietResponse) => DietResponse.diets.data.find(diet => 
        {
          return diet.id==dietId;
        }
      )),
      map(parseDates)
    );
  }

  getDietsByIdList(dietIdList: string[]): Observable<DietDto[]> {
    this.apiUrl = "../../../assets/data/diets.json";
    return this.http.get<GetDietResponse>(this.apiUrl).pipe(
      map((response: GetDietResponse) => response.diets.data.filter((diet: DietDto) => dietIdList.includes(diet.id))),
      map(parseDates)
    );
  }
}