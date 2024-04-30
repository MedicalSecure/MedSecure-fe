import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PatientService {

    constructor(private http: HttpClient) { }


    getPatients(): Observable<any> {
        return this.http.get<any>('assets/data/patients.json');
    }


}