import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  PatientDto,
  RegisterDto,
  GetRegistrationResponse,
  CreateRegisterRequest,
} from '../../model/Registration';
import { MatPaginator } from '@angular/material/paginator';
import { ELEMENT_DATA } from '../../pages/register/register.component';
import { Observable, catchError, map } from 'rxjs';
import { CreatedResponse } from '../../types';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  // Register component
  url = 'http://localhost:5010/registers';
  constructor(private http: HttpClient) {}

  
  getData(dataSource: MatTableDataSource<RegisterDto, MatPaginator>) {
    this.http
      .get<GetRegistrationResponse>(this.url)
      .subscribe(
        (response: GetRegistrationResponse) => {
          console.log('Response:', response);
          if (response && response.registers.data) {
            dataSource.data = response.registers.data;
            response.registers.data.forEach((element) => {
              console.log(element);
              ELEMENT_DATA.push(element);
            });
          } else {
            console.error('Invalid response format:', response);
          }
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
  }

  updateComment(id: string, note: string) {
    const body = { Id: id, Note: note };
    return this.http.put(this.url, body).subscribe(
      (response) => {
        console.log('Response:', response);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  createPatient(patient: PatientDto): Observable<any> {
    return this.http
      .post<PatientDto>(this.url, patient)
      .pipe(
        map((response) => {
          console.log(patient);
          console.log('Registration created:', response);
          return response;
        }),
        catchError((error) => {
          console.error('Error creating registration:', error);
          throw error;
        })
      );
  }

  // register form
  postRegister(request: CreateRegisterRequest): Observable<CreatedResponse> {
    const url = this.url;
    return this.http.post<CreatedResponse>(url, request);
  }
}
