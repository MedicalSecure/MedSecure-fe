// src/app/azure-graph.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AzureGraphService {
  private apiUrl = 'https://graph.microsoft.com/v1.0/';

  constructor(private http: HttpClient) {}

  createUser(createUserRequest: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'users', createUserRequest);
  }

  inviteUserByEmail(inviteUserRequest: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'invitations', inviteUserRequest);
  }

  getGraphApiData(headers: HttpHeaders): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'me', { headers });
  }
}
