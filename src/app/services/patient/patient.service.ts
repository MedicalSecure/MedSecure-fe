import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Patients } from '../../model/patients';

interface PatientResponse {
    patients: {
        pageIndex: number;
        pageSize: number;
        count: number;
        data: Patients[];
    };
}
@Injectable({
    providedIn: 'root'
})
export class PatientService {

    constructor(private http: HttpClient) { }

    getPatients(): Observable<Patients[]> {
        return this.http.get<any>('assets/data/patients.json');
    }

    getPatientsload(): Observable<Patients[]> {
        return this.http.get<PatientResponse>('assets/data/patients.json').pipe(
            map(response => response.patients.data)
        );
    }

    

    getCountPatientRegister(): Observable<number> {
        return this.getPatientsload().pipe(
            map(patients => patients.filter(patient => patient.status === 'Registered').length)
          );
    }

    getTopUrgencyPatients(): Observable<Patients[]> {
        return this.getPatientsload().pipe(
            map(patients => patients.filter(patient => patient.topUrgency === true))
        );
    }

}