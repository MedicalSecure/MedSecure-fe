import { Component, OnInit } from '@angular/core';
import { SignalRService } from '../../services/signalr.service';

@Component({
  selector: 'app-sensor-data',
  templateUrl: './sensor-data.component.html',
  styleUrls: ['./sensor-data.component.css']
})
export class SensorDataComponent implements OnInit {

  constructor(public signalRService: SignalRService) { }

  ngOnInit(): void {
  }

}
