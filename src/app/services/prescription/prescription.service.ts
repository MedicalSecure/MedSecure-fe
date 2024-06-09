

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {
  private readonly baseUrl = 'assets/data/prescriptions.json';

  constructor(private http: HttpClient) { }

  getPrescriptions(): Observable<Presecription[]> {
    return this.http.get<Presecription[]>(this.baseUrl);
  }


  getValidePrescriptions(): Observable<number> {
    return this.getPrescriptions().pipe(
      map(presecription => presecription.filter(presecription => presecription.status === 'valide').length)
    );
  }
  getInValidePrescriptions(): Observable<number> {
    return this.getPrescriptions().pipe(
      map(presecription => presecription.filter(presecription => presecription.status === 'invalide').length)
    );
  }

  getCountPrescriptions():Observable<number> {
    return this.getPrescriptions().pipe(
      map(prescription => prescription.length)
    );
  }

  getPatientPrescribed(): Observable<number> {
    return this.getPrescriptions().pipe(
      map(prescriptions => {
        // Extract patient names and filter out any undefined or null values
        const patientNames = prescriptions
          .map(prescription => prescription.patient_name)
          .filter(name => name != null);
  
        // Create a Set to store unique patient names
        const uniquePatientNames = new Set(patientNames);
  
        // Return the number of unique patient names
        return uniquePatientNames.size;}))}

  
}

//service hammadi (service avec backend)
// import {
//   CreatePrescriptionRequest,
//   CreatePrescriptionResponse,
//   GetDiagnosisResponse,
//   GetPrescriptionsByRegisterIdResponse,
//   GetPrescriptionsResponse,
//   GetSymptomsResponse,
//   PostPredictDiagnosisCommand,
//   PostPredictDiagnosisResponse,
//   PrescriptionCreateDto,
//   PrescriptionDto,
//   SymptomDto,
// } from '../../types/prescriptionDTOs';
// import { GetRegistrationsResponse, RegisterDto } from '../../types/registerDTOs';
// import { delay, map, switchMap } from 'rxjs/operators';
// import { Status } from '../../enums/enum';
// import { GetActivitiesResponse } from '../../types';
// import { ActivityService } from '../../components/activities/activities.component';
// @Injectable({
//   providedIn: 'root',
// })
// export class PrescriptionApiService implements ActivityService {
//   private apiVersion: number = 1; // Replace 'v1' with your desired API version
//   private apiUrl = `http://localhost:5007/api/v${this.apiVersion}/Prescription`;
//   constructor(private http: HttpClient) {}

//   getPrescriptions(
//     pageIndex: number = 0,
//     pageSize: number = 10
//   ): Observable<GetPrescriptionsResponse> {
//     const params = new HttpParams()
//       .set('PageIndex', pageIndex.toString())
//       .set('PageSize', pageSize.toString());

//     let x = this.http.get<GetPrescriptionsResponse>(this.apiUrl, { params });
//     return x;
//   }

//   getActivities(
//     pageIndex: number = 0,
//     pageSize: number = 7
//   ): Observable<GetActivitiesResponse> {
//     const params = new HttpParams()
//       .set('PageIndex', pageIndex.toString())
//       .set('PageSize', pageSize.toString());
//     let x = this.http.get<GetActivitiesResponse>(this.apiUrl + '/Activities', {
//       params,
//     }).pipe(
//       map((response) => {
//         //still testing dates
//         return parseDates(response);
//       })
//     );
//     return x;
//   }

//   getRegistrations(
//     pageIndex: number = 0,
//     pageSize: number = 10
//   ): Observable<GetRegistrationsResponse> {
//     let apiUrl="../../../assets/data"
//     const params = new HttpParams()
//       .set('PageIndex', pageIndex.toString())
//       .set('PageSize', pageSize.toString());
//     return this.http
//       .get<GetRegistrationsResponse>(apiUrl + '/registration.json', { params })
//       .pipe(
//         map((response) => {
//           return parseDates(response);
//         })
//       );
//   }

//   getPrescriptionsByRegisterIds(
//     registerIds: string[]
//   ): Observable<GetPrescriptionsByRegisterIdResponse> {
//     let url = this.apiUrl + '/Register';

//     let params = new HttpParams();
//     registerIds.forEach(id => {
//       params = params.append('registerIds', id);
//     });
//     return this.http.get<GetPrescriptionsByRegisterIdResponse>(url, {params}).pipe(
//       map((response)=> parseDates(response)));
//   }

//   public static async getRegistrationsWithPrescriptions(
//     service: PrescriptionApiService,
//     pageIndex: number = 0,
//     pageSize: number = 10,
//   ): Promise<RegisterDto[]> {
//     let registrations = await service
//       .getRegistrations(pageIndex, pageSize)
//       .toPromise();
//     //debugger;
//     if (!registrations) return [];
//     let registrationsData=registrations.registrations.data;
//     const ids = registrations.registrations.data.map((item) => item.id);
//     let prescriptionsByRegistrationsId = await service
//       .getPrescriptionsByRegisterIds(ids)
//       .toPromise();
//     if (!prescriptionsByRegistrationsId || prescriptionsByRegistrationsId==undefined) return [];
//     registrationsData.forEach((registration)=>{
//       //@ts-ignore
//       let registerId=registration.id as keyof(typeof prescriptionsByRegistrationsId.prescriptionsByRegisterId ) ;
//       //@ts-ignore
//       registration.prescriptions= prescriptionsByRegistrationsId.prescriptionsByRegisterId[registerId]
//     })
//     return registrationsData;
//   }

//   private _mapStatusEnum(value: any): Status {
//     //the enum value is coming as number => we convert it to status enum here
//     if (value == 0) return Status.Resident;
//     if (value == 1) return Status.Out;
//     return Status.Registered;
//   }


// }


// /* function parsePrescriptionDates(prescription:PrescriptionDto):PrescriptionDto{

// } */

// export function parseDates<T>(response:T):T{

//   const dateReviver = (key: string, value: any) => {
//     const isDateString = value && typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value);
//     return isDateString ? new Date(value) : value;
//   };

//   var parsed=JSON.parse(JSON.stringify(response), dateReviver)
//   return parsed;
// }


export type Presecription= {
  medication_name: string;
  dosage: string;
  quantity :number;
  date_prescribed : string
  patient_name :string
  doctor_name :string
  status:string;
  image?:string
}
