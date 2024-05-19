// import { Injectable } from '@angular/core';
// import * as signalR from '@microsoft/signalr';
// import { BehaviorSubject } from 'rxjs';
// import { environment } from '../../environments/environment';

// @Injectable({
//   providedIn: 'root'
// })
// export class SignalRService {
//   private hubConnection: signalR.HubConnection;
//   private sensorDataSubject = new BehaviorSubject<any>(null);
//   public sensorData$ = this.sensorDataSubject.asObservable();

//   constructor() {
//     this.startConnection();
//     this.addSensorDataListener();
//   }

//   private startConnection() {
//     // Ajoutez votre chaîne de connexion à l'URL SignalR
//     const signalrUrl = 'https://medssecuresignalr.service.signalr.net';
//     const connectionString = 'Endpoint=https://medssecuresignalr.service.signalr.net;AccessKey=gPQBsWlNYqEld28/KlTgUjifIB91ciw2M+WFNz9qEFk=;Version=1.0;'; // Remplacez avec votre connexion string
//     this.hubConnection = new signalR.HubConnectionBuilder()
//       .withUrl(signalrUrl, {
//         accessTokenFactory: () => connectionString // Utilisez la connexion string comme accessTokenFactory
//       })
//       .build();
//     this.hubConnection
//       .start()
//       .then(() => console.log('Connection started'))
//       .catch(err => console.log('Error while starting connection: ' + err));
//   }

//   private addSensorDataListener() {

//     this.hubConnection.on('ReceiveSensorData', (data) => {
//       debugger
//       this.sensorDataSubject.next(data);
//     });
//   }
// }
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection;

  public sensorDataReceived: (data: any) => void;

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://medsecure-functions.azurewebsites.net/api', {
        accessTokenFactory: async () => {
          const response = await fetch('https://medsecure-functions.azurewebsites.net/api/negotiate', {
            method: 'POST'
          });
          const negotiateResponse = await response.json();
          return negotiateResponse.accessToken;
        },
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.ServerSentEvents | signalR.HttpTransportType.LongPolling
      })
      .build();
  }

  public startConnection() {
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err));
  }

  public addSensorDataListener() {
    this.hubConnection.on('ReceiveSensorData', (data) => {
      if (this.sensorDataReceived) {
        this.sensorDataReceived(data);
      }
    });
  }
}
