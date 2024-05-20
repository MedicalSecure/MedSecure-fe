import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {TypeVisit} from '../../interface/TypeVisit'
import {LocationVisit} from '../../interface/LocationVisit'
import { VisitDtoType } from '../../interface/VisitDtoType';

@Injectable({
  providedIn: 'root'
})
export class VisitService {

    constructor(private http: HttpClient) { }
    
//load visits
    getVisits(): Observable<any> {
        return this.http.get<any>('assets/data/visits.json');
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
        return this.http.post<any>('http://localhost:5004/v1/visits', VisitDtoWrapper);
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
        return this.http.put<any>("http://localhost:5004/v1/visits", VisitDtoWrapper);
    }

    //delete visits
    deleteVisits(visitId: string | number | undefined){
        return this.http.delete(`http://localhost:5004/v1/visits/${visitId}?Id=${visitId}`);
    }

     // Obtenir liste de nbre vistes par jour
  getVisitsCountByDay(): Observable<{ [key: string]: number }> {
    return this.getVisits().pipe(
      map(visits => {
        const visitCounts: { [key: string]: number } = {};
        visits.forEach((visit: any) => {
          const date = new Date(visit.start).toISOString().split('T')[0];
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
          map(visits => {
            //.toLocaleDateString() pour formater la date en utilisant le fuseau horaire local
            //Le format en-CA produit des dates au format YYYY-MM-DD
              const today = new Date().toLocaleDateString('en-CA'); 
              let visitCountToday = 0;
  
              visits.forEach((visit: any) => {
                  const visitDate = new Date(visit.start).toLocaleDateString('en-CA');
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
          map(visits => visits.length)
        );
      }

}
