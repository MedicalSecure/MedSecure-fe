import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { UnitCare, UnitCareData } from '../../model/unitCare/UnitCareData';
import { parseDates } from '../prescription/prescription-api.service';



@Injectable({
  providedIn: 'root',
})


export class UnitCareService  {
  constructor(private http: HttpClient) {}
  private apiVersion: number = 1; // Replace 'v1' with your desired API version
  private apiUrl = `http://localhost:5007/api/v${this.apiVersion}/UnitCare`;
  link = "https://localhost:6064/unitcare-service/unitCares";

  getCardData(): Observable<UnitCareData> {
    return this.http.get<UnitCareData>(this.link).pipe(map(parseDates));
  }

  deleteCardData(id: number|string|undefined): Observable<any> {
    const url = `${this.link}/${id}`; // Construct URL with ID
    return this.http.delete(url); // Use HTTP DELETE method
  }

  postUnitCare(unitcare: UnitCare): Observable<any> {
    const formData = { "UnitCare": unitcare };
    const url = this.link; // URL for POST request
    return this.http.post<any>(url, formData);
  }

  //TO REMOVE
  getUnitCareByBedId(bedId: string): Observable<UnitCare | undefined> {
    this.apiUrl = this.link;
    return this.http.get<UnitCareData>(this.apiUrl).pipe(
      map(parseDates),//parse dates of response then filter by id
      map((unitCareData: UnitCareData) => {
        // Find the UnitCare object that contains the bed with the given bedId
        return unitCareData.unitCares.data.find(uc =>
          uc.rooms.some(room =>
            room.equipments.some(bed => bed.id === bedId)
          )
        );
      })
    );
  }

}
