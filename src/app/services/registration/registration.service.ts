import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {  Patient, RegistrationResponse, register } from '../../model/Registration';
import { MatPaginator } from '@angular/material/paginator';
import { ELEMENT_DATA } from '../../pages/register/register.component';
import { Observable, catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  // Register component

  constructor(private http: HttpClient) { }
  getData( dataSource :  MatTableDataSource<register, MatPaginator> ) {
    this.http.get<RegistrationResponse>('http://localhost:5010/registers')
      .subscribe(
        (response: RegistrationResponse) => {
          console.log('Response:', response);
          if (response && response.registers.data) {
           dataSource.data = response.registers.data;          
           response.registers.data.forEach(element => {
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
  }
  updateComment( id : string ,note:string){
    const body = { Id: id, Note: note };
    return this.http.put('https://localhost:5010/registers', body).subscribe(response => {
      console.log('Response:', response); 
    },
    error => {
      console.error('Error:', error);
    }
  );

   }

   createPatient(patient: Patient): Observable<any> {
    return this.http.post<Patient>('http://localhost:5010/registers', patient)
      .pipe(
        map(response => {
          console.log(patient);
          console.log('Registration created:', response);
          return response;
        }),
        catchError(error => {
          console.error('Error creating registration:', error);
          throw error;
        })
      );
  }
   createRegistration(regsiterr: register): Observable<any> {
    return this.http.post<register>('http://localhost:5010/registers', regsiterr)
      .pipe(
        map(response => {
          console.log('Registration created:', response);
          return response;
        }),
        catchError(error => {
          console.error('Error creating registration:', error);
          throw error;
        })
      );
  }

  // register form

  postRegister(registerr: register): Observable<any> {
    const formData = { "register": registerr };
    const url = 'http://localhost:5010/registers';
    return this.http.post<any>(url, formData);
  }

}
