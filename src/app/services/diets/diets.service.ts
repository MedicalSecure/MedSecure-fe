import { Injectable } from '@angular/core';
import { Prescription  , PrescriptionResponse} from '../../model/BacPatient';
import { HttpClient } from '@angular/common/http';
import { Diet } from '../../model/Diet';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DietsService {
prescription : Prescription[] = [];
  constructor(private http: HttpClient) { }

  getPrescritios(  ) : Prescription[] {
    this.http.get<PrescriptionResponse>('http://localhost:6007/api/v1/Prescription')
      .subscribe(
        (response: PrescriptionResponse) => {
          console.log('Response:', response);
          if (response && response.prescriptions.data) {
            response.prescriptions.data.forEach(element => {
              this.prescription.push(element);
            });
          } else {
            console.error('Invalid response format:', response);
          }
        },
        error => {
          console.error('Error fetching data:', error);
        }
      );
 return this.prescription ;
  }
  
  postDiet(diet: Diet): void {
    const formData = { "Diet": diet };
    const url = 'http://localhost:6003/v1/diets';
    this.http.post<any>(url, formData).subscribe(
      response => {
        console.log('Response from postDiet:', response);
      },
      error => {
        console.error('Error posting diet:', error);
      }
    );
  }
}
