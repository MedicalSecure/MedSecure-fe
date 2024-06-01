import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  PatientDto,
  RegisterDto,
  GetRegistrationResponse,
  CreateRegisterRequest,
  archiveUnarchiveRequest,
} from '../../model/Registration';

import { Observable, catchError, map } from 'rxjs';
import { CreatedResponse } from '../../types';
import { getRegistrationStatus } from '../../shared/utilityFunctions';
import { parseDates } from '../bacPatient/bac-patient-services.service';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  // Register component
  url = 'http://localhost:5010/registers';
  constructor(private http: HttpClient) {}

  getRegistrations(
    pageIndex: number = 0,
    pageSize: number = 10,
    maxRetries: number = 3,
    retryDelayInMs: number = 1000,
    displayErrorMessages: boolean = true
  ): Observable<GetRegistrationResponse> {
    const params = new HttpParams()
      .set('PageIndex', pageIndex.toString())
      .set('PageSize', pageSize.toString());

    /*     const interceptorHeaders = RetryInterceptor.CreateInterceptorHeaders(
      maxRetries,
      retryDelayInMs,
      displayErrorMessages
    ); */

    return this.http
      .get<GetRegistrationResponse>(this.url, {
        params: params,
        //headers: interceptorHeaders,
      })
      .pipe(
        map((response) => {
          return parseDates(response);
        })
      );
  }

  // register form
  postRegister(request: CreateRegisterRequest): Observable<CreatedResponse> {
    const url = this.url;
    return this.http.post<CreatedResponse>(url, request);
  }

  //Archive Unarchive a register
  postArchiveUnarchive(
    request: archiveUnarchiveRequest
  ): Observable<CreatedResponse> {
    const url = this.url + '/status';
    return this.http.post<CreatedResponse>(url, request);
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
    return this.http.post<PatientDto>(this.url, patient).pipe(
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
}
