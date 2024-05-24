import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Patient } from '../../model/unitCare/PatientI';
import { ActivityService } from '../../components/activities/activities.component';
import { GetActivitiesResponse } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class SupervisorDashboardService implements ActivityService {


  constructor(private http: HttpClient) { }

  getActivities(
    pageIndex: number = 0,
    pageSize: number = 7
  ): Observable<GetActivitiesResponse> {
    const params = new HttpParams()
      .set('PageIndex', pageIndex.toString())
      .set('PageSize', pageSize.toString());
    let x = this.http.get<GetActivitiesResponse>("http://localhost:5102/Activities", {
      params,
    }).pipe(
      map((response) => {
        //still testing dates
        return parseDates(response);
      })
    );
    return x;
  }




  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>("./../../assets/patientData.json");
  }

  getTopUrgentPatients(): Observable<Patient[]> {
    return this.getPatients().pipe(
      map(patients => {
        console.log('All Patients:', patients); // Log all patients
        return patients.filter(patient => patient.topUrgence);
      })
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
