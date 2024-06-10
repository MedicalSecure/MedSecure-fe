import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {TypeVisit} from '../../interface/TypeVisit'
import {LocationVisit} from '../../interface/LocationVisit'
import { VisitDtoType } from '../../interface/VisitDtoType';
import { ActivityService } from '../../components/activities/activities.component';
import { GetActivitiesResponse } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class VisitService implements ActivityService {

    constructor(private http: HttpClient) { }
    
//load visits
    getVisits(): Observable<any> {
        return this.http.get<any>('http://localhost:6012/v1/visits');
      }
//create visits
    creatVisits(formData:any) {
        const typeVisitEnumValue: TypeVisit = TypeVisit[formData.typevisits as keyof typeof TypeVisit];
        const locationVisitEnumValue: LocationVisit = LocationVisit[formData.disponibilite as keyof typeof LocationVisit];
        // Soustraire deux heures pour ajuster l'heure à GMT+0
        const startDate = new Date(formData.start);
        startDate.setHours(startDate.getHours() + 2);
        console.log("1111",startDate)
        const visit1: VisitDtoType = {
          startDate: startDate,
          endDate: formData.end,
          patient: {
            id: formData.patient.id,
            firstName: formData.patient.firstName,
            lastName: formData.patient.lastName,
            dateOfBirth: formData.patient.dateOfBirth,
            gender: formData.patient.gender
          },
          doctorId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          title: 'Appointment with' + formData.patient.firstName + ' ' + formData.patient.lastName,
          typeVisit: typeVisitEnumValue,
          locationVisit: locationVisitEnumValue,
          duration: formData.duration,
          description: formData.description,
          availability: formData.avaibility
        };
        const VisitDtoWrapper = {
          Visit: visit1
        };
        return this.http.post<any>('http://localhost:6012/v1/visits', VisitDtoWrapper);
    }

    //update visits
    updateVisits(formData:any) {
        const typeVisitEnumValue: TypeVisit = TypeVisit[formData.typevisits as keyof typeof TypeVisit];
        const locationVisitEnumValue: LocationVisit = LocationVisit[formData.disponibilite as keyof typeof LocationVisit];
        // Soustraire deux heures pour ajuster l'heure à GMT+0
        const startDate = new Date(formData.start);
        startDate.setHours(startDate.getHours() + 2);
        console.log("1111",startDate)
        const visitupdate: VisitDtoType = {
          id: formData.id,
          startDate: startDate,
          endDate: formData.end,
          patient: {
            id: formData.patient.id,
            firstName: formData.patient.firstName,
            lastName: formData.patient.lastName,
            dateOfBirth: formData.patient.dateOfBirth,
            gender: formData.patient.gender
          },
          doctorId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          title: 'Appointment with ' + formData.patient.firstName + ' ' + formData.patient.lastName,
          typeVisit: TypeVisit[formData.typevisits as keyof typeof TypeVisit],
          locationVisit: LocationVisit[formData.disponibilite as keyof typeof LocationVisit],
          duration: formData.duration,
          description: formData.description,
          availability: formData.avaibility
        };
    
        const VisitDtoWrapper = {
          Visit: visitupdate
        };
        return this.http.put<any>("http://localhost:6012/v1/visits", VisitDtoWrapper);
    }

    //delete visits
    deleteVisits(visitId: string | number | undefined){
        return this.http.delete(`http://localhost:6012/v1/visits/${visitId}?Id=${visitId}`);
    }

     // Obtenir liste de nbre vistes par jour
  getVisitsCountByDay(): Observable<{ [key: string]: number }> {
    return this.getVisits().pipe(
      map(visits => {
        const visitCounts: { [key: string]: number } = {};
        visits.forEach((visit: VisitDtoType) => {
          const date = new Date(visit.startDate).toISOString().split('T')[0];
          if (!visitCounts[date]) {
            visitCounts[date] = 0;
          }
          visitCounts[date]++;
        });
        return visitCounts;
      })
    );}
 
  getVisitsCountByToday(): Observable<number> {
    return this.getVisits().pipe(
      map(response => {
        const visits = response.visits.data;
        const today = new Date().toLocaleDateString('en-CA');
        let visitCountToday = 0;

        visits.forEach((visit: VisitDtoType) => {
          const visitDate = new Date(visit.startDate).toLocaleDateString('en-CA');
          if (visitDate === today) {
            visitCountToday++;
          }
        });

        return visitCountToday;
      })
    );
  }

  getTotalVisitsCount(): Observable<number> {
    return this.getVisits().pipe(
      map(response => response.visits.count)
    );
  }


      getActivities(
        pageIndex: number = 0,
        pageSize: number = 7
      ): Observable<GetActivitiesResponse> {
        const params = new HttpParams()
          .set('PageIndex', pageIndex.toString())
          .set('PageSize', pageSize.toString());
        let x = this.http.get<GetActivitiesResponse>('http://localhost:5004/v1/visits' + '/Activities', {
          params,
        }).pipe(
          map((response) => {
            //still testing dates
            return parseDates(response);
          })
        );
        return x;
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
