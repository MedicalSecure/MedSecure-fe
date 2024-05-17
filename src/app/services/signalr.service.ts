import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection;
  public data: any = {};

  constructor() {
    this.startConnection();
    this.addDataListener();
  }

  private startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://medssecuresignalr.service.signalr.net/sensorHub')
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR connection started'))
      .catch(err => console.error('Error while starting SignalR connection: ' + err));
  }

  private addDataListener(): void {
    this.hubConnection.on('UpdateData', (data) => {
      this.data = data;
      console.log('Data received: ', data);
    });
  }
}