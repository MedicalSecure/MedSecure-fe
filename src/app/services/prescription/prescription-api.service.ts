import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, firstValueFrom, timer } from 'rxjs';
import {
  CreatePrescriptionRequest,
  CreatePrescriptionResponse,
  GetDiagnosisResponse,
  GetPrescriptionsByRegisterIdResponse,
  GetPrescriptionsResponse,
  GetSymptomsResponse,
  PostPredictDiagnosisCommand,
  PostPredictDiagnosisResponse,
  PrescriptionCreateDto,
  PrescriptionDto,
  PutPrescriptionResponse,
  PutPrescriptionStatusRequest,
  SymptomDto,
  RegisterWithPrescriptions,
  RegisterWithPrescriptionsDict,
} from '../../model/Prescription';

import { delay, map, switchMap } from 'rxjs/operators';
import { HistoryStatus, RegisterStatus } from '../../enums/enum';
import { GetActivitiesResponse } from '../../types';
import { ActivityService } from '../../components/activities/activities.component';
import { RetryInterceptor } from '../../config/httpInterceptor';

import { RegisterDto } from '../../model/Registration';
import { RegistrationService } from '../registration/registration.service';
@Injectable({
  providedIn: 'root',
})
export class PrescriptionApiService implements ActivityService {
  private apiVersion: number = 1; // Replace 'v1' with your desired API version
  //private apiUrl = `http://localhost:5007/api/v${this.apiVersion}/Prescription`; // swagger
  //private apiUrl = `http://localhost:6007/api/v${this.apiVersion}/Prescription`; // Docker
  private apiUrl = `http://localhost:6004/prescription-service/api/v${this.apiVersion}/Prescription`; // api gateway

  constructor(
    private http: HttpClient,
    public registrationService: RegistrationService
  ) {}

  getPrescriptions(
    pageIndex: number = 0,
    pageSize: number = 10
  ): Observable<GetPrescriptionsResponse> {
    const params = new HttpParams()
      .set('PageIndex', pageIndex.toString())
      .set('PageSize', pageSize.toString());

    const interceptorHeaders = RetryInterceptor.CreateInterceptorHeaders();

    let x = this.http.get<GetPrescriptionsResponse>(this.apiUrl, {
      params,
      ...interceptorHeaders,
    });
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

  putPrescriptions(prescriptionDto: PrescriptionCreateDto) {
    const postPrescriptionRequest: CreatePrescriptionRequest = {
      prescription: prescriptionDto,
    };
    let x = this.http.put<CreatePrescriptionResponse>(
      this.apiUrl,
      postPrescriptionRequest
    );
    return x;
  }

  putPrescriptionsStatus(prescriptionDto: PrescriptionDto) {
    const postPrescriptionRequest: PutPrescriptionStatusRequest = {
      prescription: prescriptionDto,
    };
    let x = this.http.put<PutPrescriptionResponse>(
      this.apiUrl + '/Status',
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

    return timer(1000).pipe(
      delay(1000), // Delaying the emission by 3 seconds
      switchMap(() =>
        this.http.get<GetSymptomsResponse>(this.apiUrl + '/Symptoms', {
          params,
        })
      )
    );
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

  getActivities(
    pageIndex: number = 0,
    pageSize: number = 7
  ): Observable<GetActivitiesResponse> {
    const params = new HttpParams()
      .set('PageIndex', pageIndex.toString())
      .set('PageSize', pageSize.toString());
    let x = this.http
      .get<GetActivitiesResponse>(this.apiUrl + '/Activities', {
        params,
      })
      .pipe(
        map((response) => {
          //still testing dates
          return parseDates(response);
        })
      );
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

  getPrescriptionsByRegisterIds(
    registerIds: string[],
    maxRetries: number = 3,
    retryDelayInMs: number = 1000,
    displayErrorMessages: boolean = true
  ): Observable<GetPrescriptionsByRegisterIdResponse> {
    let url = this.apiUrl + '/Register';

    let params = new HttpParams();
    registerIds.forEach((id) => {
      params = params.append('registerIds', id);
    });

    const interceptorHeaders = RetryInterceptor.CreateInterceptorHeaders(
      maxRetries,
      retryDelayInMs,
      displayErrorMessages
    );

    return this.http
      .get<GetPrescriptionsByRegisterIdResponse>(url, {
        params: params,
        headers: interceptorHeaders,
      })
      .pipe(map((response) => parseDates(response)));
  }


  public static async getRegistrationsWithPrescriptions(
    service: PrescriptionApiService,
    pageIndex: number = 0,
    pageSize: number = 10,
    maxRetries: number = 3,
    retryDelayInMs: number = 1000,
    displayErrorMessages: boolean = true,
    filterArchivedPatients=true
  ): Promise<RegisterWithPrescriptionsDict | null> {

    let registrations = await firstValueFrom(
      service.registrationService.getRegistrations(pageIndex, pageSize)
    );//fetch the Page size registers first

    if (!registrations) return null;
    let registrationsData = registrations.registers.data;
    if(filterArchivedPatients)
      registrationsData=registrationsData.filter(reg=> reg.status== RegisterStatus.Active)
    
    // get the Ids as list from the fetched register => to get prescriptions by register ids
    const ids = registrations.registers.data
      .map((item) => item.id)
      .filter((id) => id != null && id != undefined) as string[];
    let prescriptionsByRegistrationsId = await service
      .getPrescriptionsByRegisterIds(
        ids,
        maxRetries,
        retryDelayInMs,
        displayErrorMessages
      )
      .toPromise();

    if (!prescriptionsByRegistrationsId ||prescriptionsByRegistrationsId == undefined)
      return null;

    let result:RegisterWithPrescriptionsDict={};

    registrationsData.forEach((registration) => {
      if (!prescriptionsByRegistrationsId) return;

      let registerId = registration.id as keyof typeof prescriptionsByRegistrationsId.prescriptionsByRegisterId;

      let newObj:RegisterWithPrescriptions={
        register:registration,
        prescriptions:prescriptionsByRegistrationsId!.prescriptionsByRegisterId[registerId]
      } 
      //key : register Id, value : {register,prescriptions}
      result[registerId] = newObj;
    });
    /* type:
      {
        "999999999999999":{
          register:{....(id=999999)},
          prescriptions:[...]
        }
      }
     */
    return result;
  }

}

export function parseDates<T>(response: T): T {
  const dateReviver = (key: string, value: any) => {
    const isDateString =
      value &&
      typeof value === 'string' &&
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value);
    return isDateString ? new Date(value) : value;
  };

  var parsed = JSON.parse(JSON.stringify(response), dateReviver);
  return parsed;
}
