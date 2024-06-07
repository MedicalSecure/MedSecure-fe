import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MedicationType } from '../../pages/pharmacy/stp1-import-map-drugs/stp1-import-map-drugs.component';
import { MatPaginator } from '@angular/material/paginator';
import { parseDates } from '../prescription/prescription-api.service';
import { CheckDrugRequest,
  CheckDrugResponse,
  CreateDrugRequest,
  CreateDrugResponse,
  DrugDTO,
  GetDrugsResponse,
  GetValidationsResponse, } from '../../model/Drugs';
  import { Subject } from 'rxjs';
  import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class DrugService {
  data_source: DrugDTO[] = [];
  private hubConnection: signalR.HubConnection;
  private messageSubject = new Subject<any>();
  message$ = this.messageSubject.asObservable();

  constructor(private http: HttpClient) {
    this.hubConnection = new signalR.HubConnectionBuilder()
    //.withUrl('http://localhost:6004/medication-service/pharmacist') // 
    .withUrl('http://localhost:6008/pharmacist')
      .build();
    this.hubConnection.on('ReceiveMessage', (message: string) => {
      this.messageSubject.next(message);
    });
    this.startConnection();
  }

  apiUrl="http://localhost:6004/medication-service/api/v1";
  
  apiCheck = this.apiUrl+'/drugsChecked';
  apiCrud = this.apiUrl+'/drugs';
  

  private startConnection() {
    

    this.hubConnection.start().then(() => {
      console.log('SignalR connection established');
    }).catch(err => {
      console.error('Error establishing SignalR connection:', err);
    });

    this.hubConnection.on('PrescriptionToValidateEvent', (message: any) => {
      debugger;
      console.log('Received PrescriptionToValidateEvent: ', message);
      // Handle the received prescription message here
    });
  }

  getMedications() {
    return this.http.get<GetDrugsResponse>(this.apiCrud).pipe(
      map((response) => {
        return parseDates(response);
      })
    );;
  }

  getValidations() {
    return this.http.get<GetValidationsResponse>(this.apiUrl + "/Validations").pipe(
      map((response) => {
        return parseDates(response);
      })
    );;
  }

  getPendingValidations() {
    return this.http.get<GetValidationsResponse>(this.apiUrl + "/PendingValidations").pipe(
      map((response) => {
        return parseDates(response);
      })
    );;
  }

  checkDrugs(
    checkDrugRequest: CheckDrugRequest
  ): Observable<CheckDrugResponse> {
    console.log(JSON.stringify(checkDrugRequest));

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('accept', 'application/json');

    return this.http
      .post<CheckDrugResponse>(this.apiCheck, checkDrugRequest, {
        headers: headers,
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  postDrugs(drugDto: DrugDTO[]): Observable<CreateDrugResponse> {
    const postDrugRequest: CreateDrugRequest = {
      drugs: drugDto,
    };
    return this.http.post<CreateDrugResponse>(
      this.apiCrud,
      postDrugRequest);
  }

  getData(dataSource: MatTableDataSource<MedicationType, MatPaginator>) {
    this.http
      .get<GetDrugsResponse>(this.apiCrud)
      .subscribe(
        (response: GetDrugsResponse) => {
          if (response && response.drugs.data) {
            const medications = response.drugs.data.map(
              this.mapDrugDtoToMedicationType
            );
            dataSource.data = medications;
            this.data_source = response.drugs.data;

            medications.forEach((element) => {
              console.log(element);
            });
          } else {
            console.error('Invalid response format:', response);
          }
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
  }

  private mapDrugDtoToMedicationType(drug: DrugDTO): MedicationType {
    return {
      Name: drug.name,
      Dosage: drug.dosage,
      Form: drug.form,
      Code: drug.code,
      Unit: drug.unit,
      Stock: drug.stock.toString(),
      AvailableStock: drug.availableStock?.toString(),
      ReservedStock: drug.reservedStock?.toString(),
      AlertStock: drug.alertStock.toString(),
      AverageStock: drug.avrgStock.toString(),
      MinimumStock: drug.minStock.toString(),
      SafetyStock: drug.safetyStock.toString(),
      ExpiredAt: drug.expiredAt.toString(),
      Price: drug.price.toString(),
      Description: drug.description,
    };
  }
}
