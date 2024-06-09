import { Component, ViewChild ,Input} from "@angular/core";
import {ChartComponent,ApexNonAxisChartSeries,ApexPlotOptions,ApexChart, ApexDataLabels} from "ng-apexcharts";

import { NgApexchartsModule } from "ng-apexcharts";

export type ChartOptionsCircle = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
};
@Component({
  selector: 'app-radialbar-charts',
  standalone: true,
  imports: [ NgApexchartsModule],
  templateUrl: './radialbar-charts.component.html',
  styleUrl: './radialbar-charts.component.css'
})
export class RadialbarChartsComponent {
  @ViewChild("chart") chart!: ChartComponent;
  @Input() chartOptionsCircle!: ChartOptionsCircle;


  constructor() {
    this.chartOptionsCircle = {
      series: [],
      chart: {
        height: 200,
        type: "radialBar"
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: "80%"
          }
        }
      },
      labels: ["Cricket"]
    };
  }
  

}

