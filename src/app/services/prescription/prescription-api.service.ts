import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, timer } from 'rxjs';
import {
  CreatePrescriptionRequest,
  CreatePrescriptionResponse,
  GetDiagnosisResponse,
  GetPrescriptionsByRegisterIdResponse,
  GetPrescriptionsResponse,
  GetSymptomsResponse,
  PaginatedResult,
  PostPredictDiagnosisCommand,
  PostPredictDiagnosisResponse,
  PrescriptionCreateDto,
  PrescriptionDto,
  SymptomDto,
} from '../../types/prescriptionDTOs';
import { GetRegistrationsResponse, RegisterDto } from '../../types/registerDTOs';
import { delay, map, switchMap } from 'rxjs/operators';
import { Status } from '../../enums/enum';
import { Entity } from '../../types';
@Injectable({
  providedIn: 'root',
})
export class PrescriptionApiService {
  private apiVersion: number = 1; // Replace 'v1' with your desired API version
  private apiUrl = `http://localhost:5007/api/v${this.apiVersion}/Prescription`;
  constructor(private http: HttpClient) {}

  getPrescriptions(
    pageIndex: number = 0,
    pageSize: number = 10
  ): Observable<GetPrescriptionsResponse> {
    const params = new HttpParams()
      .set('PageIndex', pageIndex.toString())
      .set('PageSize', pageSize.toString());

    let x = this.http.get<GetPrescriptionsResponse>(this.apiUrl, { params });
    return x;
  }

  postPrescriptions(prescriptionDto: PrescriptionCreateDto) {
    const postPrescriptionRequest: CreatePrescriptionRequest = {
      prescription: prescriptionDto,
    };
    let x = this.http.post<CreatePrescriptionResponse>(
      this.apiUrl,
      postPrescriptionRequest
    );
    return x;
  }

  getSymptoms(
    pageIndex: number = 0,
    pageSize: number = 10
  ): Observable<GetSymptomsResponse> {
    const params = new HttpParams()
      .set('PageIndex', pageIndex.toString())
      .set('PageSize', pageSize.toString());
    let x = this.http.get<GetSymptomsResponse>(this.apiUrl + '/Symptoms', {
      params,
    });
    return x;
  }

  getDiagnosis(
    pageIndex: number = 0,
    pageSize: number = 10
  ): Observable<GetDiagnosisResponse> {
    const params = new HttpParams()
      .set('PageIndex', pageIndex.toString())
      .set('PageSize', pageSize.toString());
    let x = this.http.get<GetDiagnosisResponse>(this.apiUrl + '/Diagnosis', {
      params,
    });
    return x;
  }

  getPredictedDiagnosis(
    symptoms: SymptomDto[]
  ): Observable<PostPredictDiagnosisResponse> {
    const body: PostPredictDiagnosisCommand = { symptoms };
    /*let x = this.http.post<PostPredictDiagnosisResponse>(this.apiUrl+"/Symptoms/Predict",body);
    
    return x;*/

    return timer(1000).pipe(
      delay(1000), // Delaying the emission by 3 seconds
      switchMap(() =>
        this.http.post<PostPredictDiagnosisResponse>(
          this.apiUrl + '/Symptoms/Predict',
          body
        )
      )
    );
  }

  getRegistrations(
    pageIndex: number = 0,
    pageSize: number = 10
  ): Observable<GetRegistrationsResponse> {
    const params = new HttpParams()
      .set('PageIndex', pageIndex.toString())
      .set('PageSize', pageSize.toString());
    return this.http
      .get<GetRegistrationsResponse>(this.apiUrl + '/Registration', { params })
      .pipe(
        map((response) => {
          //new test
          return parseDates(response);


          // Modify the response data here
          // Assuming the response contains an array of objects with a "dateString" property
/*           response.registrations.data = response.registrations.data.map(
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
              prescriptions: this.DeserializeCreatedAtAnModifiedAt(
                item.prescriptions
              ),
            })
          );
          return response; */
        })
      );
  }

  getPrescriptionsByRegisterIds(
    registerIds: string[]
  ): Observable<GetPrescriptionsByRegisterIdResponse> {
    let url = this.apiUrl + '/Register';
    const params = new HttpParams().set('registerIds', registerIds.join(','));
    return this.http.get<GetPrescriptionsByRegisterIdResponse>(url, {params}).pipe(
      map((response)=> parseDates(response)));
  }

  public static async getRegistrationsWithPrescriptions(
    service: PrescriptionApiService,
    pageIndex: number = 0,
    pageSize: number = 10,
  ): Promise<RegisterDto[]> {
    let registrations = await service
      .getRegistrations(pageIndex, pageSize)
      .toPromise();
    //debugger;
    if (!registrations) return [];
    let registrationsData=registrations.registrations.data;
    const ids = registrations.registrations.data.map((item) => item.id);
    let prescriptionsByRegistrationsId = await service
      .getPrescriptionsByRegisterIds(ids)
      .toPromise();
    if (!prescriptionsByRegistrationsId || prescriptionsByRegistrationsId==undefined) return [];
    registrationsData.forEach((registration)=>{
      //@ts-ignore
      let registerId=registration.id as keyof(typeof prescriptionsByRegistrationsId.prescriptionsByRegisterId ) ;
      //@ts-ignore
      registration.prescriptions= prescriptionsByRegistrationsId.prescriptionsByRegisterId[registerId]
    })
    return registrationsData;
  }

  private _mapStatusEnum(value: any): Status {
    //the enum value is coming as number => we convert it to status enum here
    if (value == 0) return Status.Resident;
    if (value == 1) return Status.Out;
    return Status.Registered;
  }

  //to remove
  DeserializeCreatedAtAnModifiedAt<T extends Entity>(
    list: Array<T> | undefined | null
  ): Array<T> {
    if (!list) return [];
    return list?.map((obj) => {
      return {
        ...obj,
        createdAt: new Date(obj.createdAt),
        modifiedAt: obj.modifiedAt ? new Date(obj.modifiedAt) : undefined,
      };
    });
  }
}


/* function parsePrescriptionDates(prescription:PrescriptionDto):PrescriptionDto{

} */

export function parseDates<T>(response:T):T{

  const dateReviver = (key: string, value: any) => {
    const isDateString = value && typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value);
    return isDateString ? new Date(value) : value;
  };

  var parsed=JSON.parse(JSON.stringify(response), dateReviver)
  return parsed;
}

