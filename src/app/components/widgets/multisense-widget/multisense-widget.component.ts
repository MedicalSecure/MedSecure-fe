import { Component } from '@angular/core';
import { ChartOptionsCircle } from '../radialbar-charts/radialbar-charts.component'
import { RadialbarChartsComponent} from '../radialbar-charts/radialbar-charts.component'
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-multisense-widget',
  standalone: true,
  imports: [MatProgressSpinnerModule,HttpClientModule,RadialbarChartsComponent],
  templateUrl: './multisense-widget.component.html',
  styleUrl: './multisense-widget.component.css'
})
export class MultiSenseWidgetComponent {
  private readonly baseUrl = 'https://api.thingspeak.com/channels/2523035/feeds.json?api_key=R8YQ581XJM22XBIA&results=2';
  TemperatureOptionsCircle: ChartOptionsCircle = {
   series: [],
   chart: {
     height: 200,
     type: "radialBar"
   },
   plotOptions: {
     radialBar: {
       hollow: {
         size: "70%",
       },
       dataLabels: {
         name: {
           offsetY: -10,
           show: true,

           fontSize: "14px"
         },
         value: {
           color: "#111",
           fontSize: "28px",
           show: true,
           formatter: function(val:any) {
             return val + "°C";
           }
         }
       },

     }
   },

   labels: ["Temperature"]
 };
HumidityOptionsCircle: ChartOptionsCircle = {
   series: [],
   chart: {
     height: 200,
     type: "radialBar"
   },
   plotOptions: {
     radialBar: {
       hollow: {
         size: "70%",
       },
       dataLabels: {
         name: {
           offsetY: -10,
           show: true,

            fontSize: '16px',
            fontFamily: 'Manrope, sans-serif',
          
         },
         value: {
           color: "#111",
           fontSize: "28px",
           show: true,
           formatter: function(val:any) {
             return val + "%";
           }
         }
       },

     }
   },
   labels: ["Humidity",]
 };
 LuminosityOptionsCircle: ChartOptionsCircle = {
   series: [],
   chart: {
     height: 200,
     type: "radialBar"
   },
   plotOptions: {
     radialBar: {
       hollow: {
         size: "70%",
       },
       dataLabels: {
         name: {
           offsetY: -10,
           show: true,

           fontSize: "14px"
         },
         value: {
           color: "#111",
           fontSize: "28px",
           show: true,
           formatter: function(val:any) {
             return val + "A";
           }
         }
       },

     }
   },
   labels: ["Luminosity"]
 };
 ElectricityOptionsCircle: ChartOptionsCircle = {
   series: [],
   chart: {
     height: 200,
     type: "radialBar"
   },
   plotOptions: {
     radialBar: {
       hollow: {
         size: "70%",
       },
       dataLabels: {
         name: {
           offsetY: -10,
           show: true,

           fontSize: "14px"
         },
         value: {
           color: "#111",
           fontSize: "28px",
           show: true,
           formatter: function(val:any) {
             return val + "C";
           }
         }
       },

     }
   },
   labels: ["Electricity"]
 };


 constructor(private http: HttpClient) { }
 ngOnInit(): void {
  this.getData();
 }

 getData() {
  this.http.get<any>(this.baseUrl).subscribe(data => {
    var currenttemperature = parseFloat(data?.feeds[0]?.field1.replace(',', '.')).toFixed(2);
    var currenthumidity = parseFloat(data?.feeds[0]?.field2.replace(',', '.')).toFixed(2);
    var currentluminosity = parseFloat(data?.feeds[0]?.field3.replace(',', '.')).toFixed(2);
    var currentlelectricity = parseFloat(data?.feeds[0]?.field4.replace(',', '.')).toFixed(2);
    this.TemperatureOptionsCircle.series = [parseFloat(currenttemperature)];
    this.HumidityOptionsCircle.series=[parseFloat(currenthumidity)];
    this.LuminosityOptionsCircle.series=[parseFloat(currentluminosity)];
    this.ElectricityOptionsCircle.series=[parseFloat(currentlelectricity)];

  });
}

}
