import { Component } from '@angular/core';
import { EnvironmentWidget } from '../widgets/environment-widget/environment-widget.component'
import { ChartOptionsCircle } from '../widgets/radialbar-charts/radialbar-charts.component'
import { RadialbarChartsComponent} from '../widgets/radialbar-charts/radialbar-charts.component'
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-multisense-widget',
  standalone: true,
  imports: [MatProgressSpinnerModule,HttpClientModule, EnvironmentWidget,RadialbarChartsComponent],
  templateUrl: './multisense-widget.component.html',
  styleUrl: './multisense-widget.component.css'
})
export class MultiSenseWidgetComponent {

  private readonly baseUrl = 'https://api.thingspeak.com/channels/2445450/feeds.json?api_key=RCTKIS245KTGZ01I&results=2';
  private readonly baseUrlall='https://api.thingspeak.com/channels/2445450/feeds.json?api_key=RCTKIS245KTGZ01I'
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
       
           fontSize: "14px"
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
   labels: ["Humidity"]
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
 temperatureData: number[] = [];
 humidityData: number[] = [];
 electricityData: number[] = [];
 luminosityData: number[] = [];
 categoriesData : Date[]=[]
 
 constructor(private http: HttpClient) { }
 ngOnInit(): void {
  this.getData();
  this.getDataall()}

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
getDataall() {
  this.http.get<any>(this.baseUrlall).subscribe(data => {
    if (data && data.feeds) {
      this.temperatureData = data.feeds.map((feed: any) => {
        if (feed && feed.field1) {
          return feed.field1.split(',').map(parseFloat);
        }
        return [];
      }).flat();
      this.humidityData = data.feeds.map((feed: any) => {
        if (feed && feed.field2) {
          return feed.field2.split(',').map(parseFloat);
        }
        return [];
      }).flat();
      this.electricityData= data.feeds.map((feed: any) => {
        if (feed && feed.field3) {
          return feed.field3.split(',').map(parseFloat);
        }
        return [];
      }).flat();
      this.luminosityData= data.feeds.map((feed: any) => {
        if (feed && feed.field4) {
          return feed.field4.split(',').map(parseFloat);
        }
        return [];
      }).flat();
      
      this.categoriesData = data.feeds.map((feed: any) => {
        if (feed && feed.created_at) {
          return formatDate(new Date(feed.created_at), 'medium', 'en-US'); // Formatez la date avec l'heure
        }
        return '';
      }).filter((dateTime: string) => dateTime !== '');
        } else {
      console.error("Missing 'feeds' in the response data");
    }
  }, error => {
    console.error("Error fetching temperature data:", error);
  });
}
}
