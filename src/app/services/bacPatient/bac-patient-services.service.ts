import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ELEMENT_DATA } from '../../pages/bacPatient/bacPatient.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { BacPatientResponse, Comment, bacpatient } from '../../model/BacPatient';
import { ActivityService } from '../../components/activities/activities.component';
import { Observable, map } from 'rxjs';
import { GetActivitiesResponse } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class BacPatientService implements ActivityService {
  data_source : bacpatient[];
  constructor(private http: HttpClient) { }
  getActivities(
    pageIndex: number = 0,
    pageSize: number = 7
  ): Observable<GetActivitiesResponse> {
    const params = new HttpParams()
      .set('PageIndex', pageIndex.toString())
      .set('PageSize', pageSize.toString());
    let x = this.http.get<GetActivitiesResponse>("https://localhost:6005/api/v1/Prescription/Activities", {
      params,
    }).pipe(
      map((response) => {
        //still testing dates
        return parseDates(response);
      })
    );
    return x;
  }
  getTimeline():bacpatient[] {
    this.http.get<BacPatientResponse>('https://localhost:5055/v1/bacPatient')
    .subscribe(
      (response: BacPatientResponse) => {
        console.log('Response:', response);
         this.data_source = response.bacPatients.data },
      error => {
        console.error('Error fetching data:', error);
      }
    );
    return this.data_source ;
  }
  getData( dataSource :  MatTableDataSource<bacpatient, MatPaginator> ,isLoading :boolean) : bacpatient[] {
    this.http.get<BacPatientResponse>('https://localhost:5055/v1/bacPatient')
      .subscribe(
        (response: BacPatientResponse) => {
          console.log('Response:', response);
          if (response && response.bacPatients.data) {
           dataSource.data = response.bacPatients.data;
           this.data_source = response.bacPatients.data
           isLoading = true ;
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
   updateBacPatient(bacPatient : bacpatient){
    const body = { "bacPatient": bacPatient };
    return this.http.put('https://localhost:5055/v1/bacPatient', body).subscribe(response => {
 
    },
    error => {
      console.error('Error:', error); 
    }
  );

   }
   updateBacPatientComment(bacPatient : bacpatient , Content : string , username : string){
    bacPatient.prescription.posologies.forEach(pos => {
      pos.comments.forEach(com=>{
        pos.comments.push({ id : com.id , posologyId : com.posologyId , label : username ,content: Content });
      })
      
  });
    const body = { "bacPatient": bacPatient };
    return this.http.put('https://localhost:5055/v1/bacPatient', body).subscribe(response => {
 console.log(response);
 
    },
    error => {
      console.error('Error:', error); 
    }
  );

   }
}

export function parseDates<T>(response:T):T{

  const dateReviver = (key: string, value: any) => {
    const isDateString = value && typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value);
    return isDateString ? new Date(value) : value;
  };

  var parsed=JSON.parse(JSON.stringify(response), dateReviver)
  return parsed;
}
