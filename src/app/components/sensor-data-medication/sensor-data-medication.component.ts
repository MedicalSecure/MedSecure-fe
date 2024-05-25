import { Component, OnDestroy, OnInit } from '@angular/core';
import { SensorThingspeakService } from '../../services/sensor-thingspeak/sensor-thingspeak.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-sensor-data-medication',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sensor-data-medication.component.html',
  styleUrl: './sensor-data-medication.component.css'
})
export class SensorDataMedicationComponent implements OnInit {
  feed1: any = {
    created_at: '',
    field1: '',
    field2: '',
    field3: '',
    field4: ''
  };
  feed2: any = {
    created_at: '',
    field1: '',
    field2: '',
    field3: '',
    field4: ''
  };
  constructor(private sensorThingspeakService: SensorThingspeakService) { }

  ngOnInit(): void {
    this.sensorThingspeakService.getDataStreamMed().subscribe((data: any) => {
      this.feed1 = data; // Mettre à jour avec les nouvelles données
    });
    this.sensorThingspeakService.getDataStreamHealth().subscribe((data: any) => {
      this.feed2 = data; // Mettre à jour avec les nouvelles données
    });
  }
}

// export class SensorDataMedicationComponent  implements OnInit, OnDestroy {
//   sensorData: any;
//   private dataSubscription: Subscription;

//   constructor(private sensorService: SensorThingspeakService) { }

//   ngOnInit(): void {
//     this.dataSubscription = this.sensorService.getDataStream().subscribe(data => {
//       this.sensorData = data;
//       console.log('Sensor data received: ', data);
//     });
//   }

//   ngOnDestroy(): void {
//     if (this.dataSubscription) {
//       this.dataSubscription.unsubscribe();
//     }
//   }
// }