import { Injectable } from '@angular/core';
import { Prescription, PrescriptionResponse } from '../../model/BacPatient';
import { HttpClient } from '@angular/common/http';
import { Diet, DietResponse } from '../../model/Diet';
import { map, Observable } from 'rxjs';
import { parseDates } from '../prescription/prescription-api.service';

@Injectable({
  providedIn: 'root',
})
export class DietsService {
  prescription: Prescription[] = [];

  diet: Diet[] = [];
  constructor(private http: HttpClient) {}

  getPrescritios(): Prescription[] {
    this.http
      .get<PrescriptionResponse>('http://localhost:6007/api/v1/Prescription')
      .subscribe(
        (response: PrescriptionResponse) => {
          console.log('Response:', response);
          if (response && response.prescriptions.data) {
            response.prescriptions.data.forEach((element) => {
              this.prescription.push(element);
            });
          } else {
            console.error('Invalid response format:', response);
          }
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
    return this.prescription;
  }

  postDiet(diet: Diet): void {
    const formData = { Diet: diet };
    const url = 'http://localhost:6003/v1/diets';
    this.http.post<any>(url, formData).subscribe(
      (response) => {
        console.log('Response from postDiet:', response);
      },
      (error) => {
        console.error('Error posting diet:', error);
      }
    );
  }

  getDiet(): Observable<DietResponse> {
    return this.http.get<DietResponse>('http://localhost:6003/v1/diets');
  }

  getDietById(dietId: string): Observable<Diet | undefined> {
    let apiUrl = "http://localhost:6003/v1/diets";
    return this.http.get<DietResponse>(apiUrl).pipe(
      map((DietResponse: DietResponse) => DietResponse.diets.data.find(diet => 
        {
          return diet.id==dietId;
        }
      )),
      map(parseDates)
    );
  }

  getDietsByIdList(dietIdList: string[]): Observable<Diet[]> {
    let apiUrl = "http://localhost:6003/v1/diets";
    return this.http.get<DietResponse>(apiUrl).pipe(
      map((response: DietResponse) => response.diets.data.filter((diet: Diet) => dietIdList.includes(diet.id))),
      map(parseDates)
    );
  }

  deleteDiet(id: number | string | undefined): void {
    const url = `http://localhost:6003/v1/diets/${id}`; // Construct URL with ID
    this.http.delete(url).subscribe(
      (response) => {
        console.log('Response from delete Diet:', response);
      },
      (error) => {
        console.error('Error deleting diet:', error);
      }
    );
  }

  putDiet(diet: Diet): void {
    const formData = { Diet: diet };
    const url = `http://localhost:6003/v1/diets`;
    this.http.put<any>(url, formData).subscribe(
      (response) => {
        console.log('Response from putDiet:', response);
      },
      (error) => {
        console.error('Error putting diet:', error);
      }
    );
  }
}
