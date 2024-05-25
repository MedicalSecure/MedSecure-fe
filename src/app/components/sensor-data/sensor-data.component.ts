
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { SignalRService } from '../../services/signalr.service';

@Component({
  selector: 'app-sensor-data',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="sensorData">
      <p>Temperature: {{ sensorData.temperature }}</p>
      <p>Humidity: {{ sensorData.humidity }}</p>
      <p>Electricity: {{ sensorData.electricity }}</p>
      <p>Luminosity: {{ sensorData.luminosity }}</p>
    </div>
  `,
  styles: []
})
export class SensorDataComponent implements OnInit {
  sensorData: any;

  //constructor(private signalRService: SignalRService) {}

  ngOnInit() {
    // this.signalRService.sensorDataReceived = (data) => {
    //   this.sensorData = data;
    };

    // this.signalRService.startConnection();
    // this.signalRService.addSensorDataListener();
  }
