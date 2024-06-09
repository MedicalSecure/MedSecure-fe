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
  GetValidationsResponse,
  ValidationDto,
  putValidationRequest, } from '../../model/Drugs';
  import { Subject } from 'rxjs';
  import * as signalR from '@microsoft/signalr';
import { SnackBarMessagesService } from '../util/snack-bar-messages.service';
import { SnackBarMessageProps, snackbarMessageType } from '../../components/snack-bar-messages/snack-bar-messages.component';

@Injectable({
  providedIn: 'root',
})
export class DrugService {
  data_source: DrugDTO[] = [];
  private hubConnection: signalR.HubConnection;
  private messageSubject = new Subject<any>();
  message$ = this.messageSubject.asObservable();

  constructor(private http: HttpClient , private snackBarMessages:SnackBarMessagesService) {
    this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl('http://localhost:6008/pharmacist')
      .build();
  }

  apiUrl="http://localhost:6004/medication-service/api/v1";
  
  apiCheck = this.apiUrl+'/drugsChecked';
  apiCrud = this.apiUrl+'/drugs';
  
  private dataUrlDashboard = 'assets/data/MedicationData.json'; // Path to your JSON file
  getMedicationsNews(): Observable<any> {
    return this.http.get<any>(this.dataUrlDashboard);
  }

  public async disconnectSignalR(){
    if(!this.hubConnection.connectionId)
      return console.log("pharmacist already disconnected")
    await this.hubConnection.stop();
    var props: SnackBarMessageProps = {
      messageContent: 'pharmacist Notification service disconnected',
      messageType: snackbarMessageType.Warning,
      durationInSeconds: 2,
    };
    this.snackBarMessages.displaySnackBarMessage(props);
  }

  public async connectSignalR() {
    if(this.hubConnection.connectionId)
      return console.log("pharmacist already connected")

    await this.hubConnection.start().then(() => {
      console.log('SignalR connection established');
      var props: SnackBarMessageProps = {
        messageContent: 'Pharmacist Notification service connected',
        messageType: snackbarMessageType.Info,
        durationInSeconds: 2,
      };
      this.snackBarMessages.displaySnackBarMessage(props);
    }).catch(err => {
      console.error('Error establishing SignalR connection:', err);
      var props: SnackBarMessageProps = {
        messageContent: "Couldn't connect to Notification service, please refresh the page",
        messageType: snackbarMessageType.Error,
        durationInSeconds: 5,
      };
      this.snackBarMessages.displaySnackBarMessage(props);
    });

    this.hubConnection.on('PrescriptionToValidateEvent', (message: any) => {
      console.log('Received PrescriptionToValidateEvent: ', message);
      var props:SnackBarMessageProps={
        messageContent:"A New prescription is waiting for your confirmation",
        messageType:snackbarMessageType.Warning,
        durationInSeconds:10,
        redirectionPath:"pharmacyValidation",
        queryParams:{
          //validationId:message.validationId,//TODO still missing
          prescriptionId:message.id
        }
      }
      this.snackBarMessages.displaySnackBarMessage(props)
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

  putValidation(validation: ValidationDto) {
    const putValidationRequest: putValidationRequest = {
      validation: validation,
    };
    let x = this.http.put<putValidationRequest>(
      this.apiUrl + "/Validations",
      putValidationRequest
    );
    return x;
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
