import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {TypeVisit} from '../interface/TypeVisit'
import {LocationVisit} from '../interface/LocationVisit'
import { VisitDtoType } from '../interface/VisitDtoType';

@Injectable({
  providedIn: 'root'
})
export class VisitService {

    constructor(private http: HttpClient) { }
    

    getVisits(): Observable<any> {
        return this.http.get<any>('http://localhost:5004/v1/visits');
      }

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


    
    deleteVisits(visitId: string | number | undefined){
        return this.http.delete(`http://localhost:5004/v1/visits/${visitId}?Id=${visitId}`);
    }

}
