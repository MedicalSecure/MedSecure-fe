import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ELEMENT_DATA } from '../../pages/bacPatient/bacPatient.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { BacPatientResponse, Comment, bacpatient } from '../../model/BacPatient';

@Injectable({
  providedIn: 'root'
})
export class BacPatientService {
  data_source : bacpatient[];
  constructor(private http: HttpClient) { }
  getData( dataSource :  MatTableDataSource<bacpatient, MatPaginator> ) : bacpatient[] {
    this.http.get<BacPatientResponse>('https://localhost:5055/v1/bacPatient')
      .subscribe(
        (response: BacPatientResponse) => {
          console.log('Response:', response);
          if (response && response.bacPatients.data) {
           dataSource.data = response.bacPatients.data;
           this.data_source = response.bacPatients.data
           
           response.bacPatients.data.forEach(element => {
              console.log(element);
              ELEMENT_DATA.push(element);
            }); 
          } else {
            console.error('Invalid response format:', response);
          }
        },
        error => {
          console.error('Error fetching data:', error);
        }
      );
      return this.data_source ; 
  }
  updateComment( id : string ,note:Comment){
    const body = { Id: id, Note: note };
    return this.http.put('https://localhost:6065/v1/bacPatient/note', body).subscribe(response => {
    
    },
    error => {
      console.error('Error:', error); 
    }
  );

   }
   updateBacPatient(bacPatient : bacpatient){
    const body = { "bacPatient": bacPatient };
    return this.http.put('https://localhost:5055/v1/bacPatient', body).subscribe(response => {
 
    },
    error => {
      console.error('Error:', error); 
    }
  );

   }
}
