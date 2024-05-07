import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  GetPrescriptionsResponse,
  PaginatedResult,
  PrescriptionDto,
} from '../../types/prescriptionDTOs';
import { GetRegistrationsResponse } from '../../types/registerDTOs';
import { map } from 'rxjs/operators';
import { Status } from '../../enums/enum';
import { Entity } from '../../types';
@Injectable({
  providedIn: 'root',
})
export class PrescriptionApiService {
  private apiVersion: number = 1; // Replace 'v1' with your desired API version
  private apiUrl = `http://localhost:5007/api/v${this.apiVersion}/Prescription`;
  constructor(private http: HttpClient) {}

  getPrescriptions(): Observable<GetPrescriptionsResponse> {
    let x = this.http.get<GetPrescriptionsResponse>(this.apiUrl);
    return x;
  }
  
  getRegistrations(): Observable<GetRegistrationsResponse> {
    return this.http
      .get<GetRegistrationsResponse>(this.apiUrl + '/Registration')
      .pipe(
        map((response) => {
          // Modify the response data here
          // Assuming the response contains an array of objects with a "dateString" property
          response.registrations.data = response.registrations.data.map(
            (item) => ({
              ...item,
              history: !item.history
                ? []
                : item.history.map((h) => {
                    return {
                      ...h,
                      date: new Date(h.date),
                      status: this._mapStatusEnum(h.status),
                    };
                  }),
              prescriptions: this.DeserializeCreatedAtAnModifiedAt(item.prescriptions)
            })
          );
          return response;
        })
      );
  }

  private _mapStatusEnum(value: any): Status {
    //the enum value is coming as number => we convert it to status enum here
    if (value == 0) return Status.Resident;
    if (value == 1) return Status.Out;
    return Status.Registered;
  }

  DeserializeCreatedAtAnModifiedAt<T  extends Entity>(list: Array<T> | undefined | null) : Array<T>{
    if(!list) return [];
    return list?.map(obj=>{
      return {
        ...obj,
        createdAt: new Date(obj.createdAt),
        modifiedAt: obj.modifiedAt ?  new Date(obj.modifiedAt) : undefined,
      }
    });
  }


}

