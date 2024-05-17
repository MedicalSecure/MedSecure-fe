import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OnDestroy, OnInit } from '@angular/core';
import * as signalR from '@microsoft/signalr';
@Component({
  selector: 'app-get-data-azure',
  standalone: true,
  imports: [CommonModule],
  templateUrl:'./get-data-azure.component.html' ,
  styleUrl: './get-data-azure.component.css'
})
export class GetDataAzureComponent implements OnInit, OnDestroy {
  data: any[] = [];
  private hubConnection: signalR.HubConnection;

  ngOnInit() {
    //this.hubConnection = new signalR.HubConnectionBuilder()
      //.withUrl('https://medssecuresignalr.service.signalr.net/sensorHub')
      //.build();
      this.hubConnection = new signalR.HubConnectionBuilder()
  .withUrl('https://medssecuresignalr.service.signalr.net', {
    accessTokenFactory: () => fetchAccessToken()
  })
  .build();

    this.hubConnection.on('ReceiveSensorData', (sensorData) => {
      console.log(sensorData)
      this.data.unshift(sensorData); // Insert new data at the beginning of the array
    });

    this.hubConnection.start().catch(error => console.error('Connection failed: ', error));
  }

  ngOnDestroy() {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }
  
}

async function fetchAccessToken() {
  try {
    const response = await fetch('/api/negotiate', {
      headers: {
        'SignalRConnectionString': 'Endpoint=https://medssecuresignalr.service.signalr.net;accesskey=gpqbswlnyqeld28/KlTgUjifIB91ciw2M+WFNz9qEFk=;Version=1.0;'
      }
    });
    console.log(response)
    const data = await response.json();
    return data.accessToken;
  } catch (err) {
    console.error('Error fetching access token', err);
    throw err;
  }
}
