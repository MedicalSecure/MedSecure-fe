import { Component, ViewChild ,Input} from '@angular/core';
import { NgApexchartsModule } from "ng-apexcharts";
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexYAxis,
  ApexXAxis,
  ApexDataLabels,
  ApexGrid
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart| any;
  xaxis: ApexXAxis| any;
  yaxis: ApexYAxis| any;
  dataLabels: ApexDataLabels| any;
  grid: ApexGrid| any;
};

@Component({
  selector: 'app-prescription-widget',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './prescription-widget.component.html',
  styleUrl: './prescription-widget.component.css'
})
export class PrescriptionWidgetComponent {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;
  @Input() prescriptions: any;

  constructor() {
  
  }
  ngOnChanges(): void {
    if (this.prescriptions) {
      this.chartOptions = this.generateChartOptions(this.prescriptions);
    }
  }

  generateChartOptions(prescriptions: any): Partial<ChartOptions> {
    const groupedPrescriptions: { [medicationName: string]: any[] } = {};
    prescriptions.forEach((prescription: any) => {
      if (!groupedPrescriptions[prescription.medication_name]) {
        groupedPrescriptions[prescription.medication_name] = [];
      }
      groupedPrescriptions[prescription.medication_name].push(prescription);
    });
    const series = Object.keys(groupedPrescriptions).map((medicationName, index) => {
     
      return {
        name: medicationName,
        data: groupedPrescriptions[medicationName].map((prescription: any) => ({
          x: new Date(prescription.date_prescribed).getTime(),
          y: prescription.quantity,
      
        }))
      };
    });
    return {
      series: series,
      chart: {
        height: 350,
        type: "scatter",
        zoom: {
          type: "xy"
        }
      },
      dataLabels: {
        enabled: false
      },
      grid: {
        xaxis: {
          lines: {
            show: true
          }
        },
        yaxis: {
          lines: {
            show: true
          }
        }
      },
      xaxis: {
        type: "datetime"
      },
      yaxis: {
        max: Math.max(...prescriptions.map((prescription: any) => prescription.quantity)) + 20
      },
      
    };
  }


  public generateDayWiseTimeSeries(baseval:any, count:any, yrange:any) {
    var i = 0;
    var series = [];
    while (i < count) {
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push([baseval, y]);
      baseval += 86400000;
      i++;
    }
    return series;
  }
}