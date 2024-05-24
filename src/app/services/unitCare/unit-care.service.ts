import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UnitCare, UnitCareData } from '../../model/unitCare/UnitCareData';
import { GetUnitCareResponse, UnitCareDTO } from '../../types/UnitCareDTOs';




@Injectable({
  providedIn: 'root',
})


export class UnitCareService  {
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

  private apiVersion: number = 1; // Replace 'v1' with your desired API version
  private apiUrl = `http://localhost:5007/api/v${this.apiVersion}/UnitCare`;
  constructor(private http: HttpClient) {}

  getUnitCares(): Observable<GetUnitCareResponse> {
    this.apiUrl="../../../assets/data/unitcares.json"

    let x = this.http.get<GetUnitCareResponse>(this.apiUrl);
    //debugger;
    return x;
  }

  getUnitCareByBedId(bedId: string): Observable<UnitCareDTO | undefined> {
    this.apiUrl = "../../../assets/data/unitcares.json";
    return this.http.get<GetUnitCareResponse>(this.apiUrl).pipe(
      map((unitCares: GetUnitCareResponse) => unitCares.unitCares.data.find(uc => 
        {
          let isUnitCareFound=false;
          uc.rooms.forEach(room=>{
            room.equipments.forEach(bed=>{
              isUnitCareFound=bed.id==bedId
              if(isUnitCareFound==true) return;
            })
            if(isUnitCareFound==true) return;
          })
          return isUnitCareFound;
        }
      ))
    );
  }

}
