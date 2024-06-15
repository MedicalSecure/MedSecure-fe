import { Component } from '@angular/core';
import { ViewChild,OnInit } from "@angular/core";
import { NgApexchartsModule } from "ng-apexcharts";
import {PrescriptionService} from '../../../services/prescription/prescription.service'
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries|any;
  chart: ApexChart|any;
  xaxis: ApexXAxis|any;
  yaxis: ApexXAxis | any;
  stroke: ApexStroke|any;
  tooltip: ApexTooltip|any;
  dataLabels: ApexDataLabels|any;
  colors:any
};

@Component({
  selector: 'app-rendement-prescription',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './rendement-prescription.component.html',
  styleUrl: './rendement-prescription.component.css'
})
export class RendementPrescriptionComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor(private prescriptionService: PrescriptionService) {
    this.chartOptions = {
      series: [
        {
          name: "Rendement Prescription",
          data: [],

        }
      ],
      chart: {
        height: 190,
        weight:120,
        type: "area",
        zoom: {
          enabled: false 
        },
        toolbar: {
          show: false 
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth",
        width: 3, 
        colors: ['#FF5733'] 
      },
      xaxis: {
        type: "datetime",
        categories: [],
        labels: {
          style: {
            colors: '#FFFFFF', 
            fontSize: "10px"
          },
          rotate: 0,
          offsetY: -5
        },
        axisBorder: {
          show: true,
          color: '#FFFFFF' // couleur de la bordure de l'axe X en blanc
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#FFFFFF' // couleur des labels de l'axe Y en blanc
          }
        },
        axisBorder: {
          show: true,
          color: '#FFFFFF' // couleur de la bordure de l'axe Y en blanc
        }
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm"
        }
      }
    };
  }



  public generateData(baseval:any, count:any, yrange:any) {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = Math.floor(Math.random() * (750 - 1 + 1)) + 1;
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
      var z = Math.floor(Math.random() * (75 - 15 + 1)) + 15;

      series.push([x, y, z]);
      baseval += 86400000;
      i++;
    }
    return series;
  }

  ngOnInit() {
    this.prescriptionService.getPrescriptions().subscribe(data => {
      
      const categories = data.map((med: any) => med.date_prescribed);
      const stockData = data.map((med: any) => med.quantity);
  
      this.chartOptions.series = [{
        name: 'Rendement Prescription',
        data: stockData,

      }];
  
      this.chartOptions.xaxis = {
        categories: categories,
        labels: {
          style: {
            colors: '#FFFFFF', 
            fontSize: "10px"
          },
          rotate: 0,
          offsetY: -5
        },
        axisBorder: {
          show: true,
          color: '#FFFFFF'
        }
      };

      this.chartOptions.yaxis = {
        labels: {
          style: {
            colors: '#FFFFFF' 
          }
        },
        axisBorder: {
          show: true,
          color: '#FFFFFF' 
        }
      };
    });
  }
}
