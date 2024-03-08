
import { Component, OnInit, Input } from '@angular/core';
import { DashedComponent } from '../../components/charts/dashed/dashed.component'
import { ColumnChartsComponent } from '../../components/charts/column-charts/column-charts.component'
import { CustomAngleCircleComponent } from '../../components/charts/custom-angle-circle/custom-angle-circle.component'
import { CustomDataLabelsBarComponent } from '../../components/charts/custom-data-labels-bar/custom-data-labels-bar.component'
import { CardComponent } from '../../components/card/card.component'
import { RadialbarChartsComponent, ChartOptionsCircle } from '../../components/charts/radialbar-charts/radialbar-charts.component'
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
@Component({
  selector: 'app-widgets-page',
  standalone: true,
  imports: [MatProgressSpinnerModule,HttpClientModule, DashedComponent, ColumnChartsComponent, CustomAngleCircleComponent, CustomDataLabelsBarComponent, CardComponent, RadialbarChartsComponent],
  templateUrl: './widgets-page.component.html',
  styleUrl: './widgets-page.component.css'
})
export class WidgetsPageComponent implements OnInit {
   private readonly baseUrl = 'https://api.thingspeak.com/channels/2445450/feeds.json?api_key=RCTKIS245KTGZ01I&results=2';
   private readonly baseUrlTemp='https://api.thingspeak.com/channels/2445450/fields/1.json?api_key=RCTKIS245KTGZ01I'
   private readonly baseUrlHumd='https://api.thingspeak.com/channels/2445450/fields/2.json?api_key=RCTKIS245KTGZ01I'
   private readonly baseUrlElec='https://api.thingspeak.com/channels/2445450/fields/3.json?api_key=RCTKIS245KTGZ01I'
   private readonly baseUrlLum='https://api.thingspeak.com/channels/2445450/fields/4.json?api_key=RCTKIS245KTGZ01I'
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
  DateUsedMedicationsByMonth :Date[]=[]
  mostUsedMedicationsByMonth:any= {};
  leastUsedMedicationsByMonth:any={}
  checkin: number = 0;
  checkout: number = 0;
  register: number = 0;
  Datastock : String[]=[]
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getData();
    // this.getDataTemperature()
    // this.getDataelectricity()
    // this.getDataHumidity()
    // this.getDataluminosity()
    this.getDataall()
    this.getJsonDataMedication()
    this.getJsonDataRegistration()
   this.getJsonDataStock()
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
  // getDataTemperature() {
  //   this.http.get<any>(this.baseUrlTemp).subscribe(data => {
  //     if (data && data.feeds) {
  //       this.temperatureData = data.feeds.map((feed: any) => {
  //         if (feed && feed.field1) {
  //           return feed.field1.split(',').map(parseFloat);
  //         }
  //         return [];
  //       }).flat();
  //       console.log(this.temperatureData);
  //         } else {
  //       console.error("Missing 'feeds' in the response data");
  //     }
  //   }, error => {
  //     console.error("Error fetching temperature data:", error);
  //   });
  // }
  
  // getDataHumidity() {
  //   this.http.get<any>(this.baseUrlHumd).subscribe(data => {
  //     if (data && data.feeds) {
  //       this.humidityData = data.feeds.map((feed: any) => {
  //         if (feed && feed.field2) {
  //           return feed.field2.split(',').map(parseFloat);
  //         }
  //         return [];
  //       }).flat();
  //       console.log(this.humidityData);
  //         } else {
  //       console.error("Missing 'feeds' in the response data");
  //     }
  //   }, error => {
  //     console.error("Error fetching temperature data:", error);
  //   });
  // }

  // getDataluminosity() {
  //   this.http.get<any>(this.baseUrlLum).subscribe(data => {
  //     if (data && data.feeds) {
  //       this.luminosityData= data.feeds.map((feed: any) => {
  //         if (feed && feed.field4) {
  //           return feed.field4.split(',').map(parseFloat);
  //         }
  //         return [];
  //       }).flat();
  //       console.log(this.luminosityData);
  //         } else {
  //       console.error("Missing 'feeds' in the response data");
  //     }
  //   }, error => {
  //     console.error("Error fetching temperature data:", error);
  //   });
  // }
  
  // getDataelectricity() {
  //   this.http.get<any>(this.baseUrlElec).subscribe(data => {
  //     if (data && data.feeds) {
  //       this.electricityData= data.feeds.map((feed: any) => {
  //         if (feed && feed.field3) {
  //           return feed.field3.split(',').map(parseFloat);
  //         }
  //         return [];
  //       }).flat();
  //       console.log(this.electricityData);
  //         } else {
  //       console.error("Missing 'feeds' in the response data");
  //     }
  //   }, error => {
  //     console.error("Error fetching temperature data:", error);
  //   });
  // }
 
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
  jsonData: any;
  getJsonDataMedication(): void {
    const jsonFilePath = 'assets/data/medication.json'; // Chemin vers votre fichier JSON
     this.http.get(jsonFilePath).subscribe(
      (data: any) => {
        this.jsonData = data;
        console.log('Données JSON:', this.jsonData);
        this.findMostUsedMedicationsByMonth();
      },
      (error) => {
        console.error('Erreur lors de la récupération des données JSON:', error);
      }
    );
  }

  findMostUsedMedicationsByMonth(): void {
    const medicationsByMonth:any = {};

    this.jsonData.forEach((medication: any) => {
      const month = medication.month;
      if (!medicationsByMonth[month]) {
        medicationsByMonth[month] = [];
      }
      medicationsByMonth[month].push(medication);

    });

    for (const month in medicationsByMonth) {
      if (medicationsByMonth.hasOwnProperty(month)) {
        const medications = medicationsByMonth[month];
        medications.sort((a: any, b: any) => b.uses - a.uses);
        this.mostUsedMedicationsByMonth[month] = medications[0];
        medications.sort((a: any, b: any) => a.uses - b.uses);
        this.leastUsedMedicationsByMonth[month] = medications[0];
      }
      this.mostUsedMedicationsByMonth={...this.mostUsedMedicationsByMonth}
      this.leastUsedMedicationsByMonth={...this.leastUsedMedicationsByMonth}
    }
    
    console.log('Medications les plus utilisées par mois:', this.mostUsedMedicationsByMonth);
    console.log('Medications les moins utilisées par mois:', this.leastUsedMedicationsByMonth);

  }
  getJsonDataRegistration(): void {
    const jsonFilePath = 'assets/data/registration.json'; 
     this.http.get<any>(jsonFilePath).subscribe(data => {
        this.checkin = data.checkin;
        this.checkout = data.checkout;
        this.register = data.register;
        console.log('this.checkin',this.checkin )
      });
    }

    getJsonDataStock() :void{
      const jsonFilePath = 'assets/data/stockmedication.json';
      this.http.get<any>(jsonFilePath).subscribe(
        (data: any) => {
          this.Datastock = data; 
        },
        (error) => {
          console.error('Erreur lors du chargement des données JSON:', error);
        }
      );
    }
  

}
  
  
 
